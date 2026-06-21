import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors';
import authRoutes from './routes/auth';

const app = new Hono<{ Bindings: Env }>();

app.use('*', corsMiddleware);

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ success: false, error: 'INTERNAL', message: err.message || 'An unexpected error occurred' }, 500);
});

app.get('/health', (c) => c.json({ success: true, data: { status: 'ok' } }));

app.route('/auth', authRoutes);

export default app;
