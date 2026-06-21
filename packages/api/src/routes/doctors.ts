import { Hono } from 'hono';
import { get, all, run } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

const doctors = new Hono<{ Bindings: Env }>();

doctors.get('/', async (c) => {
  const rows = await all<any>(c.env.DB,
    'SELECT * FROM doctors WHERE is_active = 1 AND deleted_at IS NULL ORDER BY sort_order'
  );
  return c.json({ success: true, data: rows });
});

doctors.get('/:slug', async (c) => {
  const row = await get<any>(c.env.DB,
    'SELECT * FROM doctors WHERE slug = ? AND deleted_at IS NULL',
    [c.req.param('slug')]
  );
  if (!row) return c.json({ success: false, error: 'NOT_FOUND', message: 'Doctor not found' }, 404);
  return c.json({ success: true, data: row });
});

doctors.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const { slug, doctor_name, qualification, specialization, experience_yrs, bio, image_url, availability, is_active, sort_order } = body;

  if (!slug || !doctor_name || !qualification || !specialization) {
    return c.json({ success: false, error: 'VALIDATION', message: 'slug, doctor_name, qualification, specialization required' }, 400);
  }

  const result = await run(c.env.DB,
    'INSERT INTO doctors (slug, doctor_name, qualification, specialization, experience_yrs, bio, image_url, availability, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [slug, doctor_name, qualification, specialization, experience_yrs ?? null, bio ?? null, image_url ?? null, availability ?? null, is_active ?? 1, sort_order ?? 0]
  );

  return c.json({ success: true, data: { id: result.meta.last_row_id } }, 201);
});

doctors.patch('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
  const body = await c.req.json();
  const allowed = ['slug', 'doctor_name', 'qualification', 'specialization', 'experience_yrs', 'bio', 'image_url', 'availability', 'is_active', 'sort_order'];
  const updates: string[] = [];
  const bindings: unknown[] = [];

  for (const key of allowed) {
    if (body[key] !== undefined) {
      updates.push(`${key} = ?`);
      bindings.push(body[key]);
    }
  }

  if (updates.length === 0) {
    return c.json({ success: false, error: 'VALIDATION', message: 'No fields to update' }, 400);
  }

  bindings.push(id);
  const result = await run(c.env.DB, `UPDATE doctors SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`, bindings);

  if (result.meta.changes === 0) {
    return c.json({ success: false, error: 'NOT_FOUND', message: 'Doctor not found or already deleted' }, 404);
  }

  return c.json({ success: true, data: { id } });
});

doctors.delete('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
  const result = await run(c.env.DB,
    "UPDATE doctors SET deleted_at = datetime('now'), is_active = 0 WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
  if (result.meta.changes === 0) {
    return c.json({ success: false, error: 'NOT_FOUND', message: 'Doctor not found or already deleted' }, 404);
  }
  return c.json({ success: true, data: { id } });
});

export default doctors;
