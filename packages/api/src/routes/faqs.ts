import { Hono } from 'hono';
import { get, all, run } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

const faqs = new Hono<{ Bindings: Env }>();

faqs.get('/', async (c) => {
  const rows = await all<any>(c.env.DB,
    'SELECT * FROM faqs WHERE is_visible = 1 ORDER BY sort_order'
  );
  return c.json({ success: true, data: rows });
});

faqs.post('/', authMiddleware, async (c) => {
  const { question, answer, category, sort_order } = await c.req.json();
  if (!question || !answer) {
    return c.json({ success: false, error: 'VALIDATION', message: 'question and answer required' }, 400);
  }
  const result = await run(c.env.DB,
    'INSERT INTO faqs (question, answer, category, sort_order) VALUES (?, ?, ?, ?)',
    [question, answer, category ?? 'general', sort_order ?? 0]
  );
  return c.json({ success: true, data: { id: result.meta.last_row_id } }, 201);
});

faqs.patch('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
  const body = await c.req.json();
  const allowed = ['question', 'answer', 'category', 'is_visible', 'sort_order'];
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
  await run(c.env.DB, `UPDATE faqs SET ${updates.join(', ')} WHERE id = ?`, bindings);
  return c.json({ success: true, data: { id } });
});

faqs.delete('/:id', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  if (isNaN(id)) return c.json({ success: false, error: 'VALIDATION', message: 'Invalid id' }, 400);
  await run(c.env.DB, 'DELETE FROM faqs WHERE id = ?', [id]);
  return c.json({ success: true, data: { id } });
});

export default faqs;
