import { cors } from 'hono/cors';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://dental-clinic.vercel.app',
  'https://dr-thankappan-s-dental-clinic-theta.vercel.app',
  'https://drthankappandental.com',
  'https://www.drthankappandental.com',
  'https://drthankappandentalclinic.com',
  'https://www.drthankappandentalclinic.com',
  /\.vercel\.app$/,
];

export const corsMiddleware = cors({
  origin: (origin, c) => {
    if (!origin && c.req.method === 'GET') return '*';
    if (!origin) return 'http://localhost:3000';
    for (const allowed of ALLOWED_ORIGINS) {
      if (typeof allowed === 'string' && origin === allowed) return origin;
      if (allowed instanceof RegExp && allowed.test(origin)) return origin;
    }
    return null;
  },
  credentials: true,
});
