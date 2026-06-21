import { cors } from 'hono/cors';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://dental-clinic.vercel.app',
  /\.vercel\.app$/,
];

export const corsMiddleware = cors({
  origin: (origin, c) => {
    if (!origin) return 'http://localhost:3000';
    for (const allowed of ALLOWED_ORIGINS) {
      if (typeof allowed === 'string' && origin === allowed) return origin;
      if (allowed instanceof RegExp && allowed.test(origin)) return origin;
    }
    return null;
  },
  credentials: true,
});
