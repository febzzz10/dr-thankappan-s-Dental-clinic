import { Hono, Context } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { compare, hash } from 'bcryptjs';
import { createToken, verifyToken } from '../lib/jwt';
import { get, run } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

const auth = new Hono<{ Bindings: Env }>();

interface AdminRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: number;
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60; // 15 minutes in seconds

async function checkRateLimit(c: Context, ip: string): Promise<boolean> {
  const key = `rl:login:${ip}`;
  const kv = c.env.KV_RATE_LIMIT as KVNamespace | undefined;
  if (!kv) return true; // allow if KV not configured
  const current = parseInt((await kv.get(key)) ?? '0', 10);
  if (current >= RATE_LIMIT_MAX) return false;
  if (current === 0) {
    await kv.put(key, '1', { expirationTtl: RATE_LIMIT_WINDOW });
  } else {
    await kv.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW });
  }
  return true;
}

async function resetRateLimit(c: Context, ip: string): Promise<void> {
  const kv = c.env.KV_RATE_LIMIT as KVNamespace | undefined;
  if (kv) await kv.delete(`rl:login:${ip}`);
}

auth.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ success: false, error: 'VALIDATION', message: 'Email and password required' }, 400);
  }

  const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown';
  const allowed = await checkRateLimit(c, ip);
  if (!allowed) {
    return c.json({ success: false, error: 'RATE_LIMITED', message: 'Too many attempts. Try again in 15 minutes.' }, 429);
  }

  const admin = await get<AdminRow>(c.env.DB,
    'SELECT id, name, email, password_hash, role, is_active FROM admins WHERE email = ?',
    [email]
  );

  if (!admin || !admin.is_active) {
    return c.json({ success: false, error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }, 401);
  }

  const valid = await compare(password, admin.password_hash);
  if (!valid) {
    return c.json({ success: false, error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }, 401);
  }

  await resetRateLimit(c, ip);

  const token = await createToken(c, {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  setCookie(c, 'token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
    maxAge: 86400,
  });

  return c.json({ success: true, data: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
});

auth.post('/logout', (c) => {
  deleteCookie(c, 'token', { path: '/' });
  return c.json({ success: true, data: null });
});

auth.get('/me', authMiddleware, async (c) => {
  const admin = c.get('admin');
  return c.json({ success: true, data: admin });
});

export default auth;
