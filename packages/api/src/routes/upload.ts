import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';

const upload = new Hono<{ Bindings: Env }>();

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

upload.post('/presigned', authMiddleware, async (c) => {
  const { content_type, file_name } = await c.req.json();

  if (!content_type || !file_name) {
    return c.json({ success: false, error: 'VALIDATION', message: 'content_type and file_name required' }, 400);
  }

  if (!ALLOWED_TYPES.includes(content_type)) {
    return c.json({ success: false, error: 'INVALID_TYPE', message: `Allowed MIME types: ${ALLOWED_TYPES.join(', ')}` }, 400);
  }

  // Validate file extension
  const ext = '.' + file_name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return c.json({ success: false, error: 'INVALID_EXTENSION', message: `Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}` }, 400);
  }

  const bucket = c.env.R2_BUCKET as R2Bucket;
  const key = `uploads/${Date.now()}-${file_name}`;

  const url = await bucket.createSignedUrl('put', key, {
    signedExpiry: new Date(Date.now() + 3600 * 1000),
    allowedMethods: ['PUT'],
    minBound: { contentLength: 1 },
    maxBound: { contentLength: MAX_SIZE },
    customConditions: [{ content_type }],
  });

  return c.json({
    success: true,
    data: { upload_url: url, public_url: `https://pub-${c.env.R2_PUBLIC_URL}.r2.dev/${key}`, key },
  });
});

export default upload;
