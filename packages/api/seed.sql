-- DEVELOPMENT ONLY — DO NOT USE IN PRODUCTION.
-- Default admin credentials are NOT seeded in production.
-- For production, run: npm run create-admin
-- That script reads ADMIN_EMAIL and ADMIN_PASSWORD from environment
-- and hashes the password before inserting.
-- Delete this entire INSERT block before production deploy.
-- INSERT OR IGNORE INTO admins (name, email, password_hash, role) VALUES
--   ('Admin', 'admin@dentalclinic.com', '$2a$12$jz.n66bmmTQvPL759BdchOgNq.UeSlFo5V1ciLtz4T0vgXWEnLksS', 'superadmin');

-- Seed settings
INSERT OR IGNORE INTO settings (key, value, label) VALUES
  ('clinic_name', 'Dr. Thankappan''s Dental Clinic', 'Clinic Name'),
  ('clinic_phone', '+91 94471 21519', 'Contact Phone'),
  ('clinic_email', 'drthankappandentalclinic@gmail.com', 'Contact Email'),
  ('clinic_address', 'M J Zakaria Sait Rd, Panayapilly East, Kappalandimukku, Mattancherry, Kochi, Kerala 682002', 'Address'),
  ('booking_enabled', 'true', 'Enable Online Booking'),
  ('whatsapp_number', '919447121519', 'WhatsApp Number'),
  ('consultation_fee', '500', 'Consultation Fee'),
  ('google_maps_link', 'https://maps.google.com/?q=12.9716,77.5946', 'Google Maps Link');

-- Seed sample services
INSERT OR IGNORE INTO services (slug, service_name, short_desc, description, icon, is_active, sort_order) VALUES
  ('root-canal', 'Root Canal', 'Painless root canal treatment', 'Advanced root canal treatment using modern techniques. We ensure maximum comfort.', 'tooth', 1, 1),
  ('dental-cleaning', 'Dental Cleaning', 'Professional teeth cleaning', 'Remove plaque and tartar buildup with our professional cleaning service.', 'sparkles', 1, 2),
  ('crowns-bridges', 'Crowns & Bridges', 'Restore damaged teeth', 'High-quality crowns and bridges to restore your smile.', 'gem', 1, 3);

-- Seed sample doctors
INSERT OR IGNORE INTO doctors (slug, doctor_name, qualification, specialization, experience_yrs, bio, is_active, sort_order) VALUES
  ('dr-thankappan', 'Dr. Thankappan', 'BDS, MDS (Prosthodontics)', 'Prosthodontics', 12, 'Founder and lead dentist with over 12 years of experience.', 1, 1),
  ('dr-sarah', 'Dr. Sarah Mathews', 'BDS, MDS (Orthodontics)', 'Orthodontics', 8, 'Specializes in braces and smile correction.', 1, 2);

-- Seed testimonials
INSERT OR IGNORE INTO testimonials (patient_name, rating, review, treatment, is_visible) VALUES
  ('Rajesh Kumar', 5, 'Excellent dental care. The root canal was completely painless!', 'Root Canal', 1),
  ('Ananya Gupta', 5, 'Very professional and friendly staff. Highly recommended.', 'Dental Cleaning', 1);
