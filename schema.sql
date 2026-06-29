-- ================================================================
-- ADMINS (replaces users)
-- ================================================================
CREATE TABLE IF NOT EXISTS admins (
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

CREATE TRIGGER IF NOT EXISTS admins_updated_at
AFTER UPDATE ON admins
WHEN OLD.updated_at IS DISTINCT FROM NEW.updated_at
BEGIN
  UPDATE admins SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ================================================================
-- APPOINTMENTS
-- ================================================================
CREATE TABLE IF NOT EXISTS appointments (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_ref             TEXT    NOT NULL UNIQUE,
  patient_name            TEXT    NOT NULL,
  phone                   TEXT    NOT NULL,
  email                   TEXT,
  service_id              INTEGER REFERENCES services(id),
  treatment_name_snapshot TEXT,
  doctor_id              INTEGER NOT NULL REFERENCES doctors(id),
  appointment_date        TEXT    NOT NULL,
  appointment_time        TEXT    NOT NULL,
  slot_id                 INTEGER REFERENCES slots(id),
  notes                   TEXT,
  status                  TEXT    NOT NULL DEFAULT 'PENDING'
                          CHECK(status IN ('PENDING','CONFIRMED','REJECTED','COMPLETED','CANCELLED','NO_SHOW')),
  whatsapp_sent           INTEGER NOT NULL DEFAULT 0,
  admin_notes             TEXT,
  cancellation_reason     TEXT,
  created_at              TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at              TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON appointments(booking_ref);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);
CREATE INDEX IF NOT EXISTS idx_slots_date_status_doctor ON slots(date, status, doctor_id);

CREATE TRIGGER IF NOT EXISTS appointments_updated_at
AFTER UPDATE ON appointments
WHEN OLD.updated_at IS DISTINCT FROM NEW.updated_at
BEGIN
  UPDATE appointments SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ================================================================
-- SLOTS (date-specific, replaces day_of_week template)
-- ================================================================
CREATE TABLE IF NOT EXISTS slots (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  date           TEXT    NOT NULL,
  start_time     TEXT    NOT NULL,
  end_time       TEXT    NOT NULL,
  slot_label     TEXT,
  status         TEXT    NOT NULL DEFAULT 'available'
                 CHECK(status IN ('available','booked','blocked')),
  doctor_id      INTEGER NOT NULL REFERENCES doctors(id),
  procedure_type TEXT,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT chk_slot_time CHECK(end_time > start_time),
  UNIQUE(date, start_time, doctor_id)
);

CREATE INDEX IF NOT EXISTS idx_slots_date ON slots(date, status);
CREATE INDEX IF NOT EXISTS idx_slots_doctor ON slots(doctor_id, date);

CREATE TRIGGER IF NOT EXISTS slots_updated_at
AFTER UPDATE ON slots
WHEN OLD.updated_at IS DISTINCT FROM NEW.updated_at
BEGIN
  UPDATE slots SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ================================================================
-- HOLIDAYS
-- ================================================================
CREATE TABLE IF NOT EXISTS holidays (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT    NOT NULL UNIQUE,
  reason     TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ================================================================
-- SERVICES (soft-delete via deleted_at)
-- ================================================================
CREATE TABLE IF NOT EXISTS services (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT    NOT NULL UNIQUE,
  service_name TEXT    NOT NULL,
  short_desc   TEXT    NOT NULL,
  description  TEXT,
  icon         TEXT,
  image_url    TEXT,
  price_from   REAL,
  is_active    INTEGER NOT NULL DEFAULT 1
               CHECK(is_active IN (0, 1)),
  sort_order   INTEGER NOT NULL DEFAULT 0,
  deleted_at   TEXT,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS services_updated_at
AFTER UPDATE ON services
WHEN OLD.updated_at IS DISTINCT FROM NEW.updated_at
BEGIN
  UPDATE services SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ================================================================
-- DOCTORS (soft-delete via deleted_at)
-- ================================================================
CREATE TABLE IF NOT EXISTS doctors (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT    NOT NULL UNIQUE,
  doctor_name     TEXT    NOT NULL,
  qualification   TEXT    NOT NULL,
  specialization  TEXT    NOT NULL,
  experience_yrs  INTEGER,
  bio             TEXT,
  image_url       TEXT,
  availability    TEXT,
  is_active       INTEGER NOT NULL DEFAULT 1
                  CHECK(is_active IN (0, 1)),
  sort_order      INTEGER NOT NULL DEFAULT 0,
  deleted_at      TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS doctors_updated_at
AFTER UPDATE ON doctors
WHEN OLD.updated_at IS DISTINCT FROM NEW.updated_at
BEGIN
  UPDATE doctors SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ================================================================
-- DOCTOR_UNAVAILABILITY (date range — supports multi-day leave)
-- ================================================================
CREATE TABLE IF NOT EXISTS doctor_unavailability (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id  INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  start_date TEXT    NOT NULL,
  end_date   TEXT    NOT NULL,
  reason     TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT chk_dates CHECK(end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_doc_unavail ON doctor_unavailability(doctor_id, start_date, end_date);

-- ================================================================
-- TESTIMONIALS
-- ================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_name TEXT    NOT NULL,
  rating       INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  review       TEXT    NOT NULL,
  treatment    TEXT,
  is_visible   INTEGER NOT NULL DEFAULT 1
               CHECK(is_visible IN (0, 1)),
  source       TEXT    NOT NULL DEFAULT 'manual'
               CHECK(source IN ('website','google','manual')),
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ================================================================
-- FAQS
-- ================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  question   TEXT    NOT NULL,
  answer     TEXT    NOT NULL,
  category   TEXT    NOT NULL DEFAULT 'general',
  is_visible INTEGER NOT NULL DEFAULT 1
             CHECK(is_visible IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ================================================================
-- CONTENT — CMS key/value store for editable website text
-- ================================================================
CREATE TABLE IF NOT EXISTS content (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  section    TEXT    NOT NULL,
  key        TEXT    NOT NULL,
  value      TEXT    NOT NULL,
  type       TEXT    NOT NULL DEFAULT 'text'
             CHECK(type IN ('text','html','json','image_url','number')),
  updated_at TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(section, key)
);

-- ================================================================
-- BANNERS — Homepage promotional banners
-- ================================================================
CREATE TABLE IF NOT EXISTS banners (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT    NOT NULL,
  subtitle   TEXT,
  image_url  TEXT,
  cta_text   TEXT,
  cta_link   TEXT,
  is_active  INTEGER NOT NULL DEFAULT 1
             CHECK(is_active IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ================================================================
-- SETTINGS — Clinic-wide configuration key/value store
-- ================================================================
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  label      TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
