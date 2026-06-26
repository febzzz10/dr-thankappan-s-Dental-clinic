import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

const upload = new Hono<{ Bindings: Env }>();

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

upload.post('/', authMiddleware, async (c) => {
  const body = await c.req.parseBody();
  const file = body.file as File | null;

  if (!file) {
    return c.json({ success: false, error: 'VALIDATION', message: 'File is required' }, 400);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return c.json({ success: false, error: 'INVALID_TYPE', message: `Allowed MIME types: ${ALLOWED_TYPES.join(', ')}` }, 400);
  }

  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return c.json({ success: false, error: 'INVALID_EXTENSION', message: `Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}` }, 400);
  }

  if (file.size > MAX_SIZE) {
    return c.json({ success: false, error: 'TOO_LARGE', message: 'File must be under 5 MB' }, 400);
  }

  const bucket = c.env.R2_BUCKET;
  const key = `uploads/${Date.now()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();

  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  return c.json({
    success: true,
    data: {
      public_url: `https://pub-${c.env.R2_PUBLIC_URL}.r2.dev/${key}`,
      key,
    },
  });
});

export default upload;
