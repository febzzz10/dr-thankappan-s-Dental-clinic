import { Hono } from 'hono';
import { get, all, run } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

const settings = new Hono<{ Bindings: Env }>();

settings.get('/', async (c) => {
  const rows = await all<any>(c.env.DB, 'SELECT key, value, label FROM settings');
  const obj: Record<string, string> = {};
  for (const row of rows) obj[row.key] = row.value;
  return c.json({ success: true, data: obj });
});

settings.patch('/', authMiddleware, async (c) => {
  const body = await c.req.json();
  const entries = Object.entries(body);
  if (entries.length === 0) {
    return c.json({ success: false, error: 'VALIDATION', message: 'No settings provided' }, 400);
  }
  for (const [key, value] of entries) {
    await run(c.env.DB, 'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime(\'now\'))', [key, String(value)]);
  }
  return c.json({ success: true, data: { updated: entries.length } });
});

export default settings;
