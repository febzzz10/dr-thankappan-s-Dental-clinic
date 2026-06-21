-- Seed admin (password: admin123, bcrypt hash)
INSERT OR IGNORE INTO admins (name, email, password_hash, role) VALUES
  ('Admin', 'admin@dentalclinic.com', '$2a$12$LJ3m4ys3Lg3YOCwKkDqOYeQFH0T0iVJLZn0FPwJ5w/m0pBXgZFYDS', 'superadmin');

-- Seed settings
INSERT OR IGNORE INTO settings (key, value, label) VALUES
  ('clinic_name', 'Dr. Thankappan''s Dental Clinic', 'Clinic Name'),
  ('clinic_phone', '+91-1234567890', 'Contact Phone'),
  ('clinic_email', 'info@dentalclinic.com', 'Contact Email'),
  ('clinic_address', '123, MG Road, Kochi, Kerala', 'Address'),
  ('booking_enabled', 'true', 'Enable Online Booking'),
  ('whatsapp_number', '+919999999999', 'WhatsApp Number'),
  ('consultation_fee', '500', 'Consultation Fee');

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
