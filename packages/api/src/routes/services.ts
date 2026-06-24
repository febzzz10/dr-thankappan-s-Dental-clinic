import { Hono } from 'hono';
import { get, all, run } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

const services = new Hono<{ Bindings: Env }>();

services.get('/', async (c) => {
  const allFlag = c.req.query('all');
  let sql = 'SELECT * FROM services WHERE deleted_at IS NULL';
  if (allFlag !== 'true') sql += ' AND is_active = 1';
  sql += ' ORDER BY sort_order';
  const rows = await all<any>(c.env.DB, sql);
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

  const maxRow = await get<{ m: number }>(c.env.DB, 'SELECT COALESCE(MAX(sort_order), 0) + 1 AS m FROM services WHERE deleted_at IS NULL');
  const finalSortOrder = sort_order ?? maxRow?.m ?? 1;

  const result = await run(c.env.DB,
    'INSERT INTO services (slug, service_name, short_desc, description, icon, image_url, price_from, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [slug, service_name, short_desc, description ?? null, icon ?? null, image_url ?? null, price_from ?? null, is_active ?? 1, finalSortOrder]
  );

  return c.json({ success: true, data: { id: result.meta.last_row_id } }, 201);
});

services.patch('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
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
  const result = await run(c.env.DB, `UPDATE services SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`, bindings);

  if (result.meta.changes === 0) {
    return c.json({ success: false, error: 'NOT_FOUND', message: 'Service not found or already deleted' }, 404);
  }

  return c.json({ success: true, data: { id } });
});

services.delete('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
  const result = await run(c.env.DB,
    "UPDATE services SET deleted_at = datetime('now'), is_active = 0 WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
  if (result.meta.changes === 0) {
    return c.json({ success: false, error: 'NOT_FOUND', message: 'Service not found or already deleted' }, 404);
  }
  return c.json({ success: true, data: { id } });
});

export default services;
