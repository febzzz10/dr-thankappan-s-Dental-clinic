import { Hono } from 'hono';
import { get, all, run } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

const services = new Hono<{ Bindings: Env }>();

services.get('/', async (c) => {
  const rows = await all<any>(c.env.DB,
    'SELECT * FROM services WHERE is_active = 1 AND deleted_at IS NULL ORDER BY sort_order'
  );
  return c.json({ success: true, data: rows });
});

services.get('/:slug', async (c) => {
  const row = await get<any>(c.env.DB,
    'SELECT * FROM services WHERE slug = ? AND deleted_at IS NULL',
    [c.req.param('slug')]
  );
  if (!row) return c.json({ success: false, error: 'NOT_FOUND', message: 'Service not found' }, 404);
  return c.json({ success: true, data: row });
});

services.post('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const { slug, service_name, short_desc, description, icon, image_url, price_from, is_active, sort_order } = body;

  if (!slug || !service_name || !short_desc) {
    return c.json({ success: false, error: 'VALIDATION', message: 'slug, service_name, short_desc required' }, 400);
  }

  const result = await run(c.env.DB,
    'INSERT INTO services (slug, service_name, short_desc, description, icon, image_url, price_from, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [slug, service_name, short_desc, description ?? null, icon ?? null, image_url ?? null, price_from ?? null, is_active ?? 1, sort_order ?? 0]
  );

  return c.json({ success: true, data: { id: result.meta.last_row_id } }, 201);
});

services.patch('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const body = await c.req.json();
  const allowed = ['slug', 'service_name', 'short_desc', 'description', 'icon', 'image_url', 'price_from', 'is_active', 'sort_order'];
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
  await run(c.env.DB, `UPDATE services SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`, bindings);

  return c.json({ success: true, data: { id } });
});

services.delete('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  await run(c.env.DB,
    "UPDATE services SET deleted_at = datetime('now'), is_active = 0 WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
  return c.json({ success: true, data: { id } });
});

export default services;
