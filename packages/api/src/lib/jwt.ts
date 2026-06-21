import { sign, verify } from 'hono/jwt';
import type { Context } from 'hono';

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  exp: number;
}

function getSecret(c: Context): string {
  return c.env.JWT_SECRET as string;
}

export async function createToken(
  c: Context,
  payload: { id: number; name: string; email: string; role: string }
): Promise<string> {
  const secret = getSecret(c);
  return sign(
    {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    },
    secret
  );
}

export async function verifyToken(
  c: Context,
  token: string
): Promise<JwtPayload | null> {
  try {
    const secret = getSecret(c);
    return (await verify(token, secret, 'HS256')) as unknown as JwtPayload;
  } catch {
    return null;
  }
}
