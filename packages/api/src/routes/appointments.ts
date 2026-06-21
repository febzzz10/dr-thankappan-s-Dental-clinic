import { Hono } from 'hono';
import { get, all, run, batch } from '../lib/db';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const appointments = new Hono<{ Bindings: Env }>();

function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 90000) + 10000;
  return `DC-${year}-${seq}`;
}

const createSchema = z.object({
  patient_name: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal('')),
  service_id: z.number().int().positive().optional(),
  doctor_id: z.number().int().positive(),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointment_time: z.string().regex(/^\d{2}:\d{2}$/),
  slot_id: z.number().int().positive(),
  notes: z.string().max(500).optional(),
});

// Public: appointment status lookup
appointments.get('/lookup', async (c) => {
  const bookingRef = c.req.query('booking_ref');
  if (!bookingRef) {
    return c.json({ success: false, error: 'VALIDATION', message: 'booking_ref required' }, 400);
  }

  const appt = await get<any>(c.env.DB,
    `SELECT a.booking_ref, a.status, a.appointment_date, a.appointment_time,
            a.patient_name, a.treatment_name_snapshot, s.service_name
     FROM appointments a
     LEFT JOIN services s ON a.service_id = s.id
     WHERE a.booking_ref = ?`,
    [bookingRef]
  );

  if (!appt) {
    return c.json({ success: false, error: 'NOT_FOUND', message: 'Appointment not found' }, 404);
  }

  return c.json({
    success: true,
    data: {
      booking_ref: appt.booking_ref,
      patient_name: appt.patient_name,
      status: appt.status,
      appointment_date: appt.appointment_date,
      appointment_time: appt.appointment_time,
      treatment: appt.treatment_name_snapshot ?? appt.service_name ?? null,
    },
  });
});

// Public: create booking (atomic)
appointments.post('/', async (c) => {
  const body = await c.req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ success: false, error: 'VALIDATION', message: parsed.error.issues[0].message }, 400);
  }

  const { patient_name, phone, email, service_id, doctor_id, appointment_date, appointment_time, slot_id, notes } = parsed.data;

  // Check settings: booking_enabled
  const bookingSetting = await get<any>(c.env.DB,
    "SELECT value FROM settings WHERE key = 'booking_enabled'"
  );
  if (bookingSetting && bookingSetting.value === 'false') {
    return c.json({ success: false, error: 'BOOKING_DISABLED', message: 'Online booking is currently disabled' }, 403);
  }

  // Capture service name at booking time
  let treatmentNameSnapshot: string | null = null;
  if (service_id) {
    const svc = await get<any>(c.env.DB, 'SELECT service_name FROM services WHERE id = ?', [service_id]);
    if (svc) treatmentNameSnapshot = svc.service_name;
  }

  const bookingRef = generateBookingRef();

  // Atomic booking: UPDATE with status guard, then check affected rows
  // SQLite serializes writes — no race condition possible
  const updateResult = await run(c.env.DB,
    "UPDATE slots SET status = 'booked' WHERE id = ? AND status = 'available'",
    [slot_id]
  );

  if (updateResult.meta.changes === 0) {
    return c.json({ success: false, error: 'SLOT_UNAVAILABLE', message: 'This slot is no longer available' }, 409);
  }

  // Slot was atomically claimed — now create the appointment
  await run(c.env.DB,
    'INSERT INTO appointments (booking_ref, patient_name, phone, email, service_id, treatment_name_snapshot, doctor_id, appointment_date, appointment_time, slot_id, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [bookingRef, patient_name, phone, email ?? null, service_id ?? null, treatmentNameSnapshot, doctor_id, appointment_date, appointment_time, slot_id, notes ?? null, 'PENDING']
  );

  return c.json({
    success: true,
    message: 'Appointment booked successfully',
    data: {
      booking_ref: bookingRef,
    },
  }, 201);
});

// Admin: list appointments with filters
appointments.get('/', authMiddleware, async (c) => {
  const page = parseInt(c.req.query('page') ?? '1', 10);
  const status = c.req.query('status');
  const date = c.req.query('date');
  const limit = Math.min(parseInt(c.req.query('limit') ?? '20', 10), 100);
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const bindings: unknown[] = [];

  if (status) {
    where += ' AND a.status = ?';
    bindings.push(status);
  }
  if (date) {
    where += ' AND a.appointment_date = ?';
    bindings.push(date);
  }

  const sql = `SELECT a.*, d.doctor_name, s.service_name
               FROM appointments a
               LEFT JOIN doctors d ON a.doctor_id = d.id
               LEFT JOIN services s ON a.service_id = s.id
               ${where}
               ORDER BY a.created_at DESC
               LIMIT ? OFFSET ?`;

  const countSql = `SELECT COUNT(*) as total FROM appointments a ${where}`;

  const [rows, countResult] = await Promise.all([
    all<any>(c.env.DB, sql, [...bindings, limit, offset]),
    get<{ total: number }>(c.env.DB, countSql, bindings),
  ]);

  return c.json({
    success: true,
    data: {
      appointments: rows,
      total: countResult?.total ?? 0,
      page,
      totalPages: Math.ceil((countResult?.total ?? 0) / limit),
    },
  });
});

// Admin: update appointment status
appointments.patch('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
  const body = await c.req.json();
  const { status, admin_notes } = body;

  const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
  if (status && !validStatuses.includes(status)) {
    return c.json({ success: false, error: 'VALIDATION', message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, 400);
  }

  const appt = await get<any>(c.env.DB, 'SELECT id FROM appointments WHERE id = ?', [id]);
  if (!appt) {
    return c.json({ success: false, error: 'NOT_FOUND', message: 'Appointment not found' }, 404);
  }

  const updates: string[] = [];
  const bindings: unknown[] = [];

  if (status) { updates.push('status = ?'); bindings.push(status); }
  if (admin_notes !== undefined) { updates.push('admin_notes = ?'); bindings.push(admin_notes); }

  if (updates.length === 0) {
    return c.json({ success: false, error: 'VALIDATION', message: 'No fields to update' }, 400);
  }

  bindings.push(id);
  await run(c.env.DB,
    `UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`,
    bindings
  );

  return c.json({ success: true, data: { id } });
});

export default appointments;
