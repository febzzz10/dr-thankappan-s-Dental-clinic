import { Hono } from 'hono';
import { corsMiddleware } from './middleware/cors';
import authRoutes from './routes/auth';
import servicesRoutes from './routes/services';
import doctorsRoutes from './routes/doctors';
import slotsRoutes from './routes/slots';
import appointmentsRoutes from './routes/appointments';
import unavailabilityRoutes from './routes/unavailability';
import settingsRoutes from './routes/settings';
import testimonialsRoutes from './routes/testimonials';
import faqsRoutes from './routes/faqs';
import uploadRoutes from './routes/upload';

export type Env = {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  JWT_SECRET: string;
  KV_RATE_LIMIT?: KVNamespace;
  R2_PUBLIC_URL?: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use('*', corsMiddleware);

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ success: false, error: 'INTERNAL', message: err.message || 'An unexpected error occurred' }, 500);
});

app.get('/', (c) => c.json({ success: true, data: {
  name: 'Dental Clinic API',
  version: '0.1.0',
  endpoints: {
    health: '/health',
    auth: '/auth',
    services: '/services',
    doctors: '/doctors',
    slots: '/slots',
    appointments: '/appointments',
    unavailability: '/doctor-unavailability',
    settings: '/settings',
    testimonials: '/testimonials',
    faqs: '/faqs',
    upload: '/upload',
  },
} }));

app.get('/health', (c) => c.json({ success: true, data: { status: 'ok' } }));

// ── Slot cleanup ──────────────────────────────────────────────────

async function deleteOldSlots(db: D1Database): Promise<number> {
  const result = await db.prepare(
    "DELETE FROM slots WHERE date < date('now', '-90 days') AND status IN ('available', 'blocked')"
  ).run();
  return result.meta.changes;
}

// Manual trigger
app.post('/api/system/cleanup-slots', async (c) => {
  const deleted = await deleteOldSlots(c.env.DB);
  return c.json({ success: true, data: { deleted } });
});

// Mount under /api prefix for frontend compatibility
const api = new Hono<{ Bindings: Env }>();
api.route('/auth', authRoutes);
api.route('/services', servicesRoutes);
api.route('/doctors', doctorsRoutes);
api.route('/slots', slotsRoutes);
api.route('/appointments', appointmentsRoutes);
api.route('/doctor-unavailability', unavailabilityRoutes);
api.route('/settings', settingsRoutes);
api.route('/testimonials', testimonialsRoutes);
api.route('/faqs', faqsRoutes);
api.route('/upload', uploadRoutes);
app.route('/api', api);

// Also mount directly for Worker API consumers
app.route('/auth', authRoutes);
app.route('/services', servicesRoutes);
app.route('/doctors', doctorsRoutes);
app.route('/slots', slotsRoutes);
app.route('/appointments', appointmentsRoutes);
app.route('/doctor-unavailability', unavailabilityRoutes);
app.route('/settings', settingsRoutes);
app.route('/testimonials', testimonialsRoutes);
app.route('/faqs', faqsRoutes);
app.route('/upload', uploadRoutes);

export default {
  fetch: app.fetch,
  scheduled: async (controller: ScheduledController, env: Env, ctx: ExecutionContext) => {
    const deleted = await deleteOldSlots(env.DB);
    console.log(`[CRON] Cleaned up ${deleted} old slots`);
  },
};
