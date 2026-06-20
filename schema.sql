-- ================================================================
-- USERS — Admin accounts only (no patient accounts in v1)
-- ================================================================
CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL UNIQUE,
  password    TEXT    NOT NULL,
  role        TEXT    NOT NULL DEFAULT 'admin'
                      CHECK(role IN ('admin', 'superadmin')),
  is_active   INTEGER NOT NULL DEFAULT 1
                      CHECK(is_active IN (0, 1)),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ================================================================
-- APPOINTMENTS — Core business table
-- ================================================================
CREATE TABLE IF NOT EXISTS appointments (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_ref      TEXT    NOT NULL UNIQUE,
  patient_name     TEXT    NOT NULL,
  phone            TEXT    NOT NULL,
  email            TEXT,
  treatment        TEXT    NOT NULL,
  appointment_date TEXT    NOT NULL,
  appointment_time TEXT    NOT NULL,
  slot_id          INTEGER REFERENCES slots(id) ON DELETE SET NULL,
  notes            TEXT,
  status           TEXT    NOT NULL DEFAULT 'pending'
                   CHECK(status IN (
                     'pending','confirmed','rejected','completed','cancelled'
                   )),
  whatsapp_sent    INTEGER NOT NULL DEFAULT 0
                   CHECK(whatsapp_sent IN (0, 1)),
  admin_notes      TEXT,
  created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_appt_date   ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appt_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appt_phone  ON appointments(phone);
CREATE INDEX IF NOT EXISTS idx_appt_ref    ON appointments(booking_ref);

-- ================================================================
-- SLOTS — Weekly time slot schedule
-- ================================================================
CREATE TABLE IF NOT EXISTS slots (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  day_of_week  TEXT    NOT NULL
               CHECK(day_of_week IN (
                 'monday','tuesday','wednesday',
                 'thursday','friday','saturday','sunday'
               )),
  start_time   TEXT    NOT NULL,
  end_time     TEXT    NOT NULL,
  label        TEXT,
  is_active    INTEGER NOT NULL DEFAULT 1
               CHECK(is_active IN (0, 1)),
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  CONSTRAINT chk_slot_time CHECK(end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_slots_day ON slots(day_of_week, is_active);

-- ================================================================
-- HOLIDAYS — Specific dates clinic is closed
-- ================================================================
CREATE TABLE IF NOT EXISTS holidays (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  date       TEXT    NOT NULL UNIQUE,
  reason     TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ================================================================
-- SERVICES — Dental treatments offered
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
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ================================================================
-- DOCTORS — Clinic staff profiles
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
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ================================================================
-- TESTIMONIALS — Patient reviews
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
-- FAQS — Frequently Asked Questions
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
-- SETTINGS — Clinic-wide configuration key/value store
-- ================================================================
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  label      TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
