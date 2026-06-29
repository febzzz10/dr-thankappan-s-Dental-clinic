import { Hono } from 'hono';
import { get, all, run, batch } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

const slots = new Hono<{ Bindings: Env }>();

// Public: get available slots in a range
slots.get('/', async (c) => {
  const from = c.req.query('from');
  const to = c.req.query('to');
  const doctorId = c.req.query('doctor_id');

  if (!from || !to) {
    return c.json({ success: false, error: 'VALIDATION', message: 'from and to query params required (YYYY-MM-DD)' }, 400);
  }

  const fromDate = new Date(from + 'T00:00:00');
  const toDate = new Date(to + 'T00:00:00');
  const diffDays = (toDate.getTime() - fromDate.getTime()) / 86400000;
  if (diffDays > 62) {
    return c.json({ success: false, error: 'VALIDATION', message: 'Date range cannot exceed 62 days' }, 400);
  }

  let sql = 'SELECT * FROM slots WHERE date >= ? AND date <= ?';
  const bindings: unknown[] = [from, to];

  if (doctorId) {
    sql += ' AND doctor_id = ?';
    bindings.push(parseInt(doctorId, 10));
  }

  sql += ' ORDER BY date, start_time';

  const rows = await all<any>(c.env.DB, sql, bindings);
  return c.json({ success: true, data: rows });
});

// Admin: create a single slot
slots.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const { date, start_time, end_time, slot_label, status, doctor_id, procedure_type } = body;

  if (!date || !start_time || !end_time || !doctor_id) {
    return c.json({ success: false, error: 'VALIDATION', message: 'date, start_time, end_time, doctor_id required' }, 400);
  }

  const result = await run(c.env.DB,
    'INSERT INTO slots (date, start_time, end_time, slot_label, status, doctor_id, procedure_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [date, start_time, end_time, slot_label ?? null, status ?? 'available', doctor_id, procedure_type ?? null]
  );

  return c.json({ success: true, data: { id: result.meta.last_row_id } });
});

// Admin: batch create slots (for local generation sync)
slots.post('/batch', authMiddleware, async (c) => {
  const body = await c.req.json();
  const { slots: slotsToInsert } = body;

  if (!slotsToInsert || !Array.isArray(slotsToInsert) || slotsToInsert.length === 0) {
    return c.json({ success: false, error: 'VALIDATION', message: 'slots array required' }, 400);
  }

  const statements: { sql: string; bindings: unknown[] }[] = [];
  let created = 0;

  for (const s of slotsToInsert) {
    if (!s.date || !s.start_time || !s.end_time || !s.doctor_id) continue;

    // Don't create duplicates
    const existing = await get<{ cnt: number }>(c.env.DB,
      'SELECT COUNT(*) as cnt FROM slots WHERE date = ? AND start_time = ? AND doctor_id = ?',
      [s.date, s.start_time, s.doctor_id]
    );
    if (existing && existing.cnt > 0) continue;

    statements.push({
      sql: 'INSERT INTO slots (date, start_time, end_time, slot_label, status, doctor_id, procedure_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      bindings: [s.date, s.start_time, s.end_time, s.slot_label ?? null, s.status ?? 'available', s.doctor_id, s.procedure_type ?? null],
    });
    created++;
  }

  if (statements.length > 0) {
    await batch(c.env.DB, statements);
  }

  return c.json({ success: true, data: { created } });
});

// Admin: generate slots for a date range
slots.post('/generate', authMiddleware, async (c) => {
  const body = await c.req.json();
  const { start_date, end_date, work_start, work_end, duration_min, break_start, break_end, days_of_week, doctor_id } = body;

  if (!start_date || !end_date || !work_start || !work_end || !duration_min || !days_of_week || !doctor_id) {
    return c.json({ success: false, error: 'VALIDATION', message: 'Missing required fields' }, 400);
  }

  const start = new Date(start_date + 'T00:00:00');
  const end = new Date(end_date + 'T00:00:00');
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const daysSet = new Set(days_of_week.map((d: string) => d.toLowerCase()));
  const generated: string[] = [];
  const skipped: string[] = [];

  function timeToMinutes(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  function minutesToTime(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  const ws = timeToMinutes(work_start);
  const we = timeToMinutes(work_end);
  const bs = break_start ? timeToMinutes(break_start) : null;
  const be = break_end ? timeToMinutes(break_end) : null;
  const dur = duration_min;

  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().slice(0, 10);
    const dayName = dayNames[current.getDay()];

    if (daysSet.has(dayName)) {
      // Check if any booked slots exist for this date+doctor
      const bookedCount = await get<{ cnt: number }>(c.env.DB,
        "SELECT COUNT(*) as cnt FROM slots WHERE date = ? AND doctor_id = ? AND status = 'booked'",
        [dateStr, doctor_id]
      );

      if (bookedCount && bookedCount.cnt > 0) {
        skipped.push(dateStr);
        current.setDate(current.getDate() + 1);
        continue;
      }

      // Delete existing available/blocked slots for this date+doctor
      await run(c.env.DB,
        "DELETE FROM slots WHERE date = ? AND doctor_id = ? AND status IN ('available', 'blocked')",
        [dateStr, doctor_id]
      );

      // Generate new slots
      let slotStart = ws;
      const newSlots: { sql: string; bindings: unknown[] }[] = [];

      while (slotStart + dur <= we) {
        // Skip break period
        if (bs !== null && be !== null && slotStart >= bs && slotStart < be) {
          slotStart = be;
          continue;
        }

        const startTime = minutesToTime(slotStart);
        const endTime = minutesToTime(slotStart + dur);
        const hour = slotStart / 60;
        const slotLabel = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

        newSlots.push({
          sql: 'INSERT INTO slots (date, start_time, end_time, slot_label, status, doctor_id) VALUES (?, ?, ?, ?, ?, ?)',
          bindings: [dateStr, startTime, endTime, slotLabel, 'available', doctor_id],
        });

        slotStart += dur;
      }

      if (newSlots.length > 0) {
        await batch(c.env.DB, newSlots);
        generated.push(dateStr);
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return c.json({
    success: true,
    data: {
      generated: generated.length,
      dates_generated: generated,
      skipped,
    },
  });
});

// Admin: update a single slot
slots.patch('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
  const body = await c.req.json();
  const { status, procedure_type, start_time, end_time } = body;

  const slot = await get<any>(c.env.DB, 'SELECT id, status FROM slots WHERE id = ?', [id]);
  if (!slot) {
    return c.json({ success: false, error: 'NOT_FOUND', message: 'Slot not found' }, 404);
  }

  if (status && !['available', 'booked', 'blocked'].includes(status)) {
    return c.json({ success: false, error: 'VALIDATION', message: 'Invalid status' }, 400);
  }

  if (slot.status === 'booked' && status && status !== 'booked') {
    return c.json({ success: false, error: 'CANNOT_MODIFY_BOOKED', message: 'Cannot modify a booked slot. Cancel the appointment first.' }, 409);
  }

  const updates: string[] = [];
  const bindings: unknown[] = [];
  if (status) { updates.push('status = ?'); bindings.push(status); }
  if (procedure_type !== undefined) { updates.push('procedure_type = ?'); bindings.push(procedure_type); }
  if (start_time) { updates.push('start_time = ?'); bindings.push(start_time); }
  if (end_time) { updates.push('end_time = ?'); bindings.push(end_time); }

  if (updates.length === 0) {
    return c.json({ success: false, error: 'VALIDATION', message: 'No fields to update' }, 400);
  }

  bindings.push(id);
  await run(c.env.DB, `UPDATE slots SET ${updates.join(', ')} WHERE id = ?`, bindings);

  return c.json({ success: true, data: { id } });
});

// Admin: delete a slot
slots.delete('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
  const slot = await get<any>(c.env.DB, 'SELECT id, status FROM slots WHERE id = ?', [id]);

  if (!slot) {
    return c.json({ success: false, error: 'NOT_FOUND', message: 'Slot not found' }, 404);
  }

  if (slot.status === 'booked') {
    return c.json({ success: false, error: 'CANNOT_DELETE_BOOKED', message: 'Cannot delete a booked slot. Cancel the appointment first.' }, 409);
  }

  await run(c.env.DB, 'DELETE FROM slots WHERE id = ?', [id]);
  return c.json({ success: true, data: { id } });
});

export default slots;
