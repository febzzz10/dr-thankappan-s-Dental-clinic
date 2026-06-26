import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || 'Admin';

if (!email) fail('ADMIN_EMAIL environment variable is required.');
if (!password) fail('ADMIN_PASSWORD environment variable is required.');

const common = [
  'admin123', 'password', 'password123', 'dental123', 'dental',
  '12345678', 'qwerty', 'letmein', 'welcome', 'monkey',
  'admin', 'doctor', 'clinic', 'tooth',
  'drthankappan', 'thankappan',
];

const normalized = password.toLowerCase();
if (common.some((p) => normalized.includes(p))) {
  fail('Password is too common. Choose a stronger password.');
}

if (password.length < 12) {
  fail('Password must be at least 12 characters long.');
}
if (!/[A-Z]/.test(password)) {
  fail('Password must include at least one uppercase letter.');
}
if (!/[a-z]/.test(password)) {
  fail('Password must include at least one lowercase letter.');
}
if (!/[0-9]/.test(password)) {
  fail('Password must include at least one number.');
}
if (!/[^A-Za-z0-9]/.test(password)) {
  fail('Password must include at least one symbol (e.g. @, #, $, etc.).');
}

const hash = bcrypt.hashSync(password, 12);

const sql = `INSERT OR IGNORE INTO admins (name, email, password_hash, role) VALUES ('${name.replace(/'/g, "''")}', '${email.replace(/'/g, "''")}', '${hash}', 'superadmin');`;

console.log('-- Admin account SQL (ready for D1):');
console.log(sql);
console.log(`-- Email: ${email}`);
console.log('-- Password: [not logged]');
console.log('-- Run with: wrangler d1 execute dental-clinic --command="<sql>"');
console.log('-- Or pipe:  echo "<sql>" | wrangler d1 execute dental-clinic');
