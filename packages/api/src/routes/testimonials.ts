import { Hono } from 'hono';
import { get, all, run } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

const testimonials = new Hono<{ Bindings: Env }>();

testimonials.get('/', async (c) => {
  const rows = await all<any>(c.env.DB,
    'SELECT * FROM testimonials WHERE is_visible = 1 ORDER BY created_at DESC'
  );
  return c.json({ success: true, data: rows });
});

testimonials.post('/', authMiddleware, async (c) => {
  const { patient_name, rating, review, treatment, source } = await c.req.json();
  if (!patient_name || !rating || !review) {
    return c.json({ success: false, error: 'VALIDATION', message: 'patient_name, rating, review required' }, 400);
  }
  const result = await run(c.env.DB,
    'INSERT INTO testimonials (patient_name, rating, review, treatment, source) VALUES (?, ?, ?, ?, ?)',
    [patient_name, rating, review, treatment ?? null, source ?? 'manual']
  );
  return c.json({ success: true, data: { id: result.meta.last_row_id } }, 201);
});

testimonials.delete('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
  await run(c.env.DB, 'DELETE FROM testimonials WHERE id = ?', [id]);
  return c.json({ success: true, data: { id } });
});

export default testimonials;
