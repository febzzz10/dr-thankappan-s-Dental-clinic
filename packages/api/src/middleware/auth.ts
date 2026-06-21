import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { verifyToken, type JwtPayload } from '../lib/jwt';

declare module 'hono' {
  interface ContextVariableMap {
    admin: JwtPayload;
  }
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const token = getCookie(c, 'token');
  if (!token) {
    return c.json({ success: false, error: 'UNAUTHORIZED', message: 'Not authenticated' }, 401);
  }
  const payload = await verifyToken(c, token);
  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN', message: 'Invalid or expired token' }, 401);
  }
  c.set('admin', payload);
  await next();
});

export const adminGuard = createMiddleware(async (c, next) => {
  const admin = c.get('admin');
  if (admin.role !== 'superadmin' && admin.role !== 'admin') {
    return c.json({ success: false, error: 'FORBIDDEN', message: 'Insufficient permissions' }, 403);
  }
  await next();
});
