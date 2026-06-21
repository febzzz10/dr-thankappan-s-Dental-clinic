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

export default app;
