# Worker Backend — Dental Clinic API

> Architecture: Vercel (frontend) → Cloudflare Worker (Hono.js) → D1 + R2  
> Date: 2026-06-21  
> Status: Approved design

---

## Architecture

```
Browser → Next.js (Vercel) → fetch() → Cloudflare Worker → D1 (SQLite)
                                                           → R2 (Images)
```

- **Vercel** serves the Next.js frontend (no more static export)
- **Worker** handles all backend logic with native D1 + R2 bindings
- **Auth**: HttpOnly Secure cookies. Worker issues/validates JWT. Vercel middleware just checks cookie presence.

---

## D1 Schema — Final

### `admins`

```sql
CREATE TABLE admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'admin'
                CHECK(role IN ('admin','superadmin')),
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER admins_updated_at
AFTER UPDATE ON admins
WHEN OLD.updated_at IS DISTINCT FROM NEW.updated_at
BEGIN
  UPDATE admins SET updated_at = datetime('now') WHERE id = NEW.id;
END;
```

### `slots`

```sql
CREATE TABLE slots (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  date           TEXT    NOT NULL,              -- YYYY-MM-DD
  start_time     TEXT    NOT NULL,              -- HH:MM
  end_time       TEXT    NOT NULL,              -- HH:MM
  slot_label     TEXT,                          -- 'Morning', 'Afternoon'
  status         TEXT    NOT NULL DEFAULT 'available'
                 CHECK(status IN ('available','booked','blocked')),
  doctor_id      INTEGER NOT NULL REFERENCES doctors(id),
  procedure_type TEXT,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT chk_slot_time CHECK(end_time > start_time),
  UNIQUE(date, start_time, doctor_id)
);

CREATE INDEX idx_slots_date ON slots(date, status);
CREATE INDEX idx_slots_doctor ON slots(doctor_id, date);

CREATE TRIGGER slots_updated_at
AFTER UPDATE ON slots
WHEN OLD.updated_at IS DISTINCT FROM NEW.updated_at
BEGIN
  UPDATE slots SET updated_at = datetime('now') WHERE id = NEW.id;
END;
```

### `appointments`

```sql
CREATE TABLE appointments (
  id                     INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_ref            TEXT    NOT NULL UNIQUE,          -- DC-{YYYY}-{seq}
  patient_name           TEXT    NOT NULL,
  phone                  TEXT    NOT NULL,
  email                  TEXT,
  service_id             INTEGER REFERENCES services(id),
  treatment_name_snapshot TEXT,                             -- name at booking time
  doctor_id              INTEGER NOT NULL REFERENCES doctors(id),
  appointment_date       TEXT    NOT NULL,
  appointment_time       TEXT    NOT NULL,
  slot_id                INTEGER REFERENCES slots(id),
  notes                  TEXT,
  status                 TEXT    NOT NULL DEFAULT 'PENDING'
                         CHECK(status IN ('PENDING','CONFIRMED','REJECTED','COMPLETED','CANCELLED','NO_SHOW')),
  whatsapp_sent          INTEGER NOT NULL DEFAULT 0,
  admin_notes            TEXT,
  cancellation_reason    TEXT,
  created_at             TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at             TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_ref ON appointments(booking_ref);

CREATE TRIGGER appointments_updated_at
AFTER UPDATE ON appointments
BEGIN
  UPDATE appointments SET updated_at = datetime('now') WHERE id = NEW.id;
END;
```

### `doctors` — soft-delete

```sql
ALTER TABLE doctors ADD COLUMN deleted_at TEXT;

CREATE TRIGGER doctors_updated_at
AFTER UPDATE ON doctors
BEGIN
  UPDATE doctors SET updated_at = datetime('now') WHERE id = NEW.id;
END;
```

### `services` — soft-delete

```sql
ALTER TABLE services ADD COLUMN deleted_at TEXT;

CREATE TRIGGER services_updated_at
AFTER UPDATE ON services
BEGIN
  UPDATE services SET updated_at = datetime('now') WHERE id = NEW.id;
END;
```

### `doctor_unavailability`

Date range support for multi-day vacations or leave. `start_date` and `end_date` allow single rows for ranges instead of one row per day.

```sql
CREATE TABLE doctor_unavailability (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id  INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  start_date TEXT    NOT NULL,
  end_date   TEXT    NOT NULL,
  reason     TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT chk_dates CHECK(end_date >= start_date)
);

CREATE INDEX idx_doc_unavail ON doctor_unavailability(doctor_id, start_date, end_date);
```

### Other tables (unchanged from original schema)

- `testimonials` — as-is
- `faqs` — as-is
- `content` — as-is
- `banners` — as-is
- `holidays` — as-is
- `settings` — as-is (includes `booking_enabled`, already in seed data)

---

## Auth

| Detail | Value |
|--------|-------|
| Hash | bcrypt (12 rounds) |
| JWT secret | Worker secret `JWT_SECRET` — **never** in Vercel |
| Cookie | `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400` |
| Login response | `{ success: true }` — **no** JWT in body |
| Rate limit | 5 attempts / IP / 15 min (KV-based) |

**Endpoints:**
```
POST /api/auth/login    → verify password_hash → Set-Cookie
POST /api/auth/logout   → clear cookie
GET  /api/auth/me       → cookie → { id, name, email, role }
```

---

## Routes

### Public (no auth)
```
GET  /api/services                      → active, deleted_at IS NULL
GET  /api/doctors                       → active, deleted_at IS NULL
GET  /api/doctors/:slug                 → single
GET  /api/slots?from=&to=&doctor_id=    → available slots in range
GET  /api/settings                      → clinic settings
GET  /api/testimonials                  → visible
GET  /api/faqs                          → visible
GET  /api/appointments/lookup?booking_ref=  → status lookup { booking_ref, status, date, time }
POST /api/appointments                  → create booking (atomic slot logic)
```

### Admin (JWT required)
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

POST   /api/services
PATCH  /api/services/:id
DELETE /api/services/:id                 → soft (SET deleted_at)

POST   /api/doctors
PATCH  /api/doctors/:id
DELETE /api/doctors/:id                  → soft

POST   /api/slots/generate
PATCH  /api/slots/:id
DELETE /api/slots/:id

GET    /api/doctor-unavailability?doctor_id=
POST   /api/doctor-unavailability
DELETE /api/doctor-unavailability/:id

GET    /api/appointments?page=&status=&date=&limit=
PATCH  /api/appointments/:id            → update status

PATCH  /api/settings

POST   /api/testimonials
DELETE /api/testimonials/:id

POST   /api/faqs
PATCH  /api/faqs/:id
DELETE /api/faqs/:id

POST   /api/upload/presigned            → image/jpeg, image/png, image/webp, max 5MB
```

---

## Atomic Slot Booking

```
POST /api/appointments
Body: { patient_name, phone, email, service_id, doctor_id, slot_id, notes }

Worker logic (uses UPDATE-with-condition as atomic guard — no explicit transaction needed):

1. UPDATE slots SET status = 'booked' WHERE id = ? AND status = 'available'
2. Check meta.changes (affected rows)
3. If changes === 0 → slot was already taken → return 409 Conflict
4. If changes > 0 → slot atomically claimed → INSERT appointment

This is safe because SQLite serializes writes at the connection level.
D1 batch executes atomically, so the UPDATE + INSERT pair is indivisible.

Booking_ref format: DC-{YEAR}-{seq}
```

If using D1 batch:
```sql
-- Execute as batch (atomic):
UPDATE slots SET status = 'booked' WHERE id = ? AND status = 'available';
INSERT INTO appointments (...) VALUES (...);
```

---

## Slot Generation

```
POST /api/slots/generate
Body: { start_date, end_date, work_start, work_end, duration_min,
        break_start, break_end, days_of_week, doctor_id }

Logic:
1. For each date in range matching days_of_week
2.   Skip entire date if any booked slots exist for this date+doctor
3.   DELETE existing available/blocked slots for this date+doctor
4.   INSERT new slots from config
5. Return { generated: N, skipped: [dates_with_bookings] }
```

---

## Soft-Delete Pattern

```sql
-- Instead of DELETE:
UPDATE doctors SET deleted_at = datetime('now') WHERE id = ?;

-- All queries filter:
SELECT * FROM doctors WHERE deleted_at IS NULL;
```

---

## Upload Security

```
POST /api/upload/presigned
Allowed MIME types:  image/jpeg, image/png, image/webp
Allowed extensions:  .jpg, .jpeg, .png, .webp
Max file size:       5 MB

Worker validates:
1. Requested content_type (MIME)
2. File extension from file_name
3. R2 presigned PUT enforces minBound/maxBound for size

Client-side also validates before upload attempt.
```

---

## Login Rate Limiting

```
POST /api/auth/login
- KV key: rl:login:{ip}
- 5 attempts per 15 minutes
- Reset on successful login
- Returns 429 if exceeded
```

---

## Appointment Lookup

```
GET /api/appointments/lookup?booking_ref=DC-2026-00042

Response:
{
  "success": true,
  "data": {
    "booking_ref": "DC-2026-00042",
    "patient_name": "Ananya Gupta",
    "status": "CONFIRMED",
    "appointment_date": "2026-06-25",
    "appointment_time": "10:00",
    "treatment": "Root Canal Therapy"
  }
}
```

---

## Response Format

All endpoints return:
```json
{
  "success": true,
  "data": { ... }           // single object or array
}
```

Errors:
```json
{
  "success": false,
  "error": "SLOT_UNAVAILABLE",
  "message": "This slot is no longer available"
}
```

---

## Slot Cleanup Strategy

Old slots should be periodically cleaned to prevent unbounded table growth:

```
Run via Cron Trigger (Worker) weekly:
  DELETE FROM slots
  WHERE date < date('now', '-12 months')
  AND status IN ('available', 'blocked');

Booked slots are retained for historical reference.
```

Appointments are never deleted (retained for audit/reporting).

---

## Pagination Defaults

```
GET /api/appointments?page=1&limit=20
- Default limit: 20
- Max limit: 100
- Enforced server-side (limit > 100 is capped to 100)
```

---

## Project Structure

```
packages/api/
├── src/
│   ├── index.ts              ← Hono app + CORS + auth middleware
│   ├── middleware/
│   │   ├── auth.ts           ← JWT verify, admin-only guard
│   │   └── cors.ts           ← Vercel domain allowlist
│   ├── routes/
│   │   ├── auth.ts           ← login/logout/me + rate limit
│   │   ├── services.ts
│   │   ├── doctors.ts
│   │   ├── slots.ts          ← CRUD + generate
│   │   ├── appointments.ts   ← CRUD + lookup + atomic booking
│   │   ├── unavailability.ts ← doctor_unavailability
│   │   ├── settings.ts
│   │   ├── testimonials.ts
│   │   ├── faqs.ts
│   │   └── upload.ts         ← presigned R2 URLs
│   └── lib/
│       ├── db.ts             ← D1 query helpers
│       └── jwt.ts            ← sign/verify wrappers
├── migrations/
│   └── 001_schema.sql        ← full initial schema
├── seed.sql                  ← seed data
├── wrangler.jsonc
├── package.json
├── tsconfig.json
```
