import { Hono } from 'hono';
import { get, all, run } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

const unavailability = new Hono<{ Bindings: Env }>();

unavailability.get('/', authMiddleware, async (c) => {
  const doctorId = c.req.query('doctor_id');
  let sql = 'SELECT * FROM doctor_unavailability';
  const bindings: unknown[] = [];
  if (doctorId) {
    sql += ' WHERE doctor_id = ?';
    bindings.push(parseInt(doctorId, 10));
  }
  sql += ' ORDER BY start_date';
  const rows = await all<any>(c.env.DB, sql, bindings);
  return c.json({ success: true, data: rows });
});

unavailability.post('/', authMiddleware, async (c) => {
  const { doctor_id, start_date, end_date, reason } = await c.req.json();
  if (!doctor_id || !start_date || !end_date) {
    return c.json({ success: false, error: 'VALIDATION', message: 'doctor_id, start_date, and end_date required' }, 400);
  }
  if (end_date < start_date) {
    return c.json({ success: false, error: 'VALIDATION', message: 'end_date must be >= start_date' }, 400);
  }
  await run(c.env.DB,
    'INSERT INTO doctor_unavailability (doctor_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)',
    [doctor_id, start_date, end_date, reason ?? null]
  );
  return c.json({ success: true, data: { message: 'Unavailability added' } }, 201);
});

unavailability.delete('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
  const result = await run(c.env.DB, 'DELETE FROM doctor_unavailability WHERE id = ?', [id]);
  if (result.meta.changes === 0) {
    return c.json({ success: false, error: 'NOT_FOUND', message: 'Unavailability record not found' }, 404);
  }
  return c.json({ success: true, data: { id } });
});

export default unavailability;
