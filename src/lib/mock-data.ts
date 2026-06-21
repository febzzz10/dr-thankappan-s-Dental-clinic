import type { AvailableSlot } from '@/types';

const MOCK_PHONE = '+91 94471 21519';
const MOCK_WHATSAPP = '919447121519';

export const mockData = {
  services: [
    { id: 1, slug: 'dental-cleaning', service_name: 'Dental Cleaning', short_desc: 'Professional scaling and polishing to remove plaque and tartar buildup.', description: 'Complete dental cleaning procedure including scaling, polishing, and fluoride treatment. Recommended every 6 months.', icon: 'Sparkles', image_url: null, price_from: 500, is_active: true, sort_order: 1 },
    { id: 2, slug: 'root-canal', service_name: 'Root Canal Treatment', short_desc: 'Painless root canal therapy to save infected teeth.', description: 'Advanced root canal treatment using modern techniques. Save your natural tooth and eliminate pain.', icon: 'Syringe', image_url: null, price_from: 3000, is_active: true, sort_order: 2 },
    { id: 3, slug: 'dental-implants', service_name: 'Dental Implants', short_desc: 'Permanent tooth replacement with titanium implants.', description: 'State-of-the-art dental implant surgery for missing teeth. Natural-looking and long-lasting results.', icon: 'Award', image_url: null, price_from: 15000, is_active: true, sort_order: 3 },
    { id: 4, slug: 'braces-aligners', service_name: 'Braces & Aligners', short_desc: 'Straighten your teeth with braces or invisible aligners.', description: 'Comprehensive orthodontic treatment including metal braces, ceramic braces, and clear aligners.', icon: 'Smile', image_url: null, price_from: 25000, is_active: true, sort_order: 4 },
    { id: 5, slug: 'teeth-whitening', service_name: 'Teeth Whitening', short_desc: 'Professional teeth whitening for a brighter smile.', description: 'Safe and effective teeth whitening treatment. Get visibly brighter teeth in a single session.', icon: 'Sun', image_url: null, price_from: 3000, is_active: true, sort_order: 5 },
    { id: 6, slug: 'cosmetic-dentistry', service_name: 'Cosmetic Dentistry', short_desc: 'Enhance your smile with veneers, bonding, and more.', description: 'Complete smile makeover services including veneers, composite bonding, and gum contouring.', icon: 'Heart', image_url: null, price_from: 8000, is_active: true, sort_order: 6 },
    { id: 7, slug: 'pediatric-dentistry', service_name: 'Pediatric Dentistry', short_desc: 'Gentle dental care for children of all ages.', description: 'Child-friendly dental environment with specialized pediatric care. Building healthy habits from an early age.', icon: 'Baby', image_url: null, price_from: 400, is_active: true, sort_order: 7 },
    { id: 8, slug: 'gum-treatment', service_name: 'Gum Disease Treatment', short_desc: 'Treatment for gingivitis and periodontitis.', description: 'Comprehensive gum disease diagnosis and treatment including scaling, root planing, and laser therapy.', icon: 'Shield', image_url: null, price_from: 1500, is_active: true, sort_order: 8 },
  ],
  doctors: [
    { id: 1, slug: 'dr-nishna-thankappan', doctor_name: 'Dr. Nishna Thankappan', qualification: 'Pediatric Dentist', specialization: 'Pediatric Dentistry', experience_yrs: 8, bio: 'Dr. Nishna Thankappan is a caring pediatric dentist dedicated to providing gentle and compassionate dental care for children.', image_url: null, availability: '{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true,"sat":true,"sun":false}', is_active: true, sort_order: 1 },
    { id: 2, slug: 'dr-noel-joshi', doctor_name: 'Dr. Noel Joshi', qualification: 'Endodontist', specialization: 'Root Canal & Endodontics', experience_yrs: 9, bio: 'Dr. Noel Joshi is a skilled endodontist specializing in root canal treatments and dental pain management. He is committed to providing pain-free and effective care.', image_url: null, availability: '{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true,"sat":false,"sun":false}', is_active: true, sort_order: 2 },
    { id: 3, slug: 'dr-anila-britta', doctor_name: 'Dr. Anila Britta', qualification: 'Oral Surgeon', specialization: 'Oral Surgery & Implants', experience_yrs: 10, bio: 'Dr. Anila Britta is an experienced oral surgeon specializing in dental implants, extractions, and reconstructive jaw surgery.', image_url: null, availability: '{"mon":true,"tue":true,"wed":false,"thu":true,"fri":true,"sat":true,"sun":false}', is_active: true, sort_order: 3 },
    { id: 4, slug: 'dr-arya-sreedhar', doctor_name: 'Dr. Arya Sreedhar', qualification: 'Periodontist', specialization: 'Gum Care & Periodontics', experience_yrs: 7, bio: 'Dr. Arya Sreedhar is a skilled periodontist specializing in gum disease treatment, scaling, and periodontal surgery.', image_url: null, availability: '{"mon":true,"tue":true,"wed":true,"thu":true,"fri":true,"sat":false,"sun":false}', is_active: true, sort_order: 4 },
  ],
  testimonials: [
    { id: 1, patient_name: 'Ananya Gupta', rating: 5, review: 'Best dental clinic in town! Dr. Priya was extremely gentle during my root canal. I barely felt any pain. Highly recommend!', treatment: 'Root Canal Treatment', is_visible: true, source: 'website', created_at: '2025-12-01' },
    { id: 2, patient_name: 'Rahul Verma', rating: 5, review: 'Got my braces done here. The team was very supportive throughout the 18-month treatment. My smile has completely transformed!', treatment: 'Braces', is_visible: true, source: 'google', created_at: '2025-11-15' },
    { id: 3, patient_name: 'Meera Iyer', rating: 4, review: 'Very professional clinic with modern equipment. My dental cleaning was thorough and painless. The staff is courteous.', treatment: 'Dental Cleaning', is_visible: true, source: 'website', created_at: '2025-10-20' },
    { id: 4, patient_name: 'Suresh Kumar', rating: 5, review: 'I got a dental implant done here and it feels just like my natural tooth. Amazing work by Dr. Vikram!', treatment: 'Dental Implant', is_visible: true, source: 'google', created_at: '2025-09-10' },
    { id: 5, patient_name: 'Priyanka Singh', rating: 5, review: 'Took my 5-year-old daughter for a checkup. Dr. Sneha was wonderful with her. She now looks forward to dentist visits!', treatment: 'Pediatric Checkup', is_visible: true, source: 'website', created_at: '2025-08-05' },
  ],
  faqs: [
    { id: 1, question: 'How often should I visit the dentist?', answer: 'We recommend visiting the dentist every 6 months for a regular checkup and cleaning. However, some patients may need more frequent visits based on their oral health condition.', category: 'General', is_visible: true, sort_order: 1 },
    { id: 2, question: 'Does dental treatment hurt?', answer: 'We use modern techniques and local anesthesia to ensure your comfort during any procedure. Most patients report minimal to no discomfort. We also offer sedation options for anxious patients.', category: 'General', is_visible: true, sort_order: 2 },
    { id: 3, question: 'What payment options are available?', answer: 'We accept cash, credit/debit cards, UPI payments, and most health insurance plans. Please contact our front desk for detailed information about insurance coverage.', category: 'Pricing', is_visible: true, sort_order: 3 },
    { id: 4, question: 'How long does a root canal take?', answer: 'A typical root canal treatment takes 1-2 appointments, each lasting about 60-90 minutes. Complex cases may require additional visits.', category: 'Procedures', is_visible: true, sort_order: 4 },
    { id: 5, question: 'At what age should my child first visit the dentist?', answer: 'We recommend that children visit the dentist by their first birthday or within 6 months of their first tooth appearing. Early visits help establish good oral habits.', category: 'Pediatric', is_visible: true, sort_order: 5 },
    { id: 6, question: 'How do I book an appointment?', answer: 'You can book online through our website, call us directly, or send a message on WhatsApp. Online booking is available 24/7 and takes less than 60 seconds.', category: 'General', is_visible: true, sort_order: 6 },
    { id: 7, question: 'What is the cost of a dental cleaning?', answer: 'Our professional dental cleaning (scaling and polishing) starts at ₹500. The exact cost depends on the amount of buildup and any additional treatments required.', category: 'Pricing', is_visible: true, sort_order: 7 },
    { id: 8, question: 'Are dental implants painful?', answer: 'The implant procedure is performed under local anesthesia, so you won\'t feel pain during the surgery. Post-procedure discomfort is manageable with prescribed medication.', category: 'Procedures', is_visible: true, sort_order: 8 },
  ],
  settings: {
    clinic_name: "Dr.Thankappan's Dental Clinic",
    clinic_phone: MOCK_PHONE,
    clinic_email: 'drthankappandentalclinic@gmail.com',
    clinic_address: 'M J Zakaria Sait Rd, Panayapilly East, Kappalandimukku, Mattancherry, Kochi, Kerala 682002',
    whatsapp_number: MOCK_WHATSAPP,
    google_maps_link: 'https://maps.google.com/?q=12.9716,77.5946',
    booking_enabled: '1',
    slot_advance_days: '30',
    lunch_start: '13:00',
    lunch_end: '14:00',
    instagram_url: 'https://instagram.com/smilecare_dental',
    facebook_url: 'https://facebook.com/smilecaredental',
    procedure_durations: {
      'Dental Cleaning': 30,
      'Root Canal': 60,
      'Dental Filling': 45,
      'Extraction': 30,
      'Scaling': 30,
      'Whitening': 45,
      'Crown': 60,
      'Ortho Consultation': 30,
    },
  },
  slots: [
    { id: 1, day_of_week: 'monday' as const, start_time: '09:00', end_time: '09:30', label: 'Morning', is_active: true },
    { id: 2, day_of_week: 'monday' as const, start_time: '09:30', end_time: '10:00', label: 'Morning', is_active: true },
    { id: 3, day_of_week: 'monday' as const, start_time: '10:00', end_time: '10:30', label: 'Morning', is_active: true },
    { id: 4, day_of_week: 'monday' as const, start_time: '10:30', end_time: '11:00', label: 'Morning', is_active: true },
    { id: 5, day_of_week: 'monday' as const, start_time: '11:00', end_time: '11:30', label: 'Morning', is_active: true },
    { id: 6, day_of_week: 'monday' as const, start_time: '14:00', end_time: '14:30', label: 'Afternoon', is_active: true },
    { id: 7, day_of_week: 'monday' as const, start_time: '14:30', end_time: '15:00', label: 'Afternoon', is_active: true },
    { id: 8, day_of_week: 'monday' as const, start_time: '15:00', end_time: '15:30', label: 'Afternoon', is_active: true },
    { id: 9, day_of_week: 'monday' as const, start_time: '16:00', end_time: '16:30', label: 'Afternoon', is_active: true },
    { id: 10, day_of_week: 'monday' as const, start_time: '16:30', end_time: '17:00', label: 'Afternoon', is_active: true },
    { id: 11, day_of_week: 'tuesday' as const, start_time: '09:00', end_time: '09:30', label: 'Morning', is_active: true },
    { id: 12, day_of_week: 'tuesday' as const, start_time: '09:30', end_time: '10:00', label: 'Morning', is_active: true },
    { id: 13, day_of_week: 'tuesday' as const, start_time: '10:00', end_time: '10:30', label: 'Morning', is_active: true },
    { id: 14, day_of_week: 'tuesday' as const, start_time: '14:00', end_time: '14:30', label: 'Afternoon', is_active: true },
    { id: 15, day_of_week: 'tuesday' as const, start_time: '14:30', end_time: '15:00', label: 'Afternoon', is_active: true },
    { id: 16, day_of_week: 'tuesday' as const, start_time: '15:00', end_time: '15:30', label: 'Afternoon', is_active: true },
    { id: 17, day_of_week: 'wednesday' as const, start_time: '09:00', end_time: '09:30', label: 'Morning', is_active: true },
    { id: 18, day_of_week: 'wednesday' as const, start_time: '09:30', end_time: '10:00', label: 'Morning', is_active: true },
    { id: 19, day_of_week: 'wednesday' as const, start_time: '10:00', end_time: '10:30', label: 'Morning', is_active: true },
    { id: 20, day_of_week: 'wednesday' as const, start_time: '14:00', end_time: '14:30', label: 'Afternoon', is_active: true },
    { id: 21, day_of_week: 'wednesday' as const, start_time: '14:30', end_time: '15:00', label: 'Afternoon', is_active: true },
    { id: 22, day_of_week: 'thursday' as const, start_time: '09:00', end_time: '09:30', label: 'Morning', is_active: true },
    { id: 23, day_of_week: 'thursday' as const, start_time: '09:30', end_time: '10:00', label: 'Morning', is_active: true },
    { id: 24, day_of_week: 'thursday' as const, start_time: '10:00', end_time: '10:30', label: 'Morning', is_active: true },
    { id: 25, day_of_week: 'thursday' as const, start_time: '14:00', end_time: '14:30', label: 'Afternoon', is_active: true },
    { id: 26, day_of_week: 'thursday' as const, start_time: '14:30', end_time: '15:00', label: 'Afternoon', is_active: true },
    { id: 27, day_of_week: 'friday' as const, start_time: '09:00', end_time: '09:30', label: 'Morning', is_active: true },
    { id: 28, day_of_week: 'friday' as const, start_time: '09:30', end_time: '10:00', label: 'Morning', is_active: true },
    { id: 29, day_of_week: 'friday' as const, start_time: '10:00', end_time: '10:30', label: 'Morning', is_active: true },
    { id: 30, day_of_week: 'friday' as const, start_time: '14:00', end_time: '14:30', label: 'Afternoon', is_active: true },
    { id: 31, day_of_week: 'friday' as const, start_time: '14:30', end_time: '15:00', label: 'Afternoon', is_active: true },
    { id: 32, day_of_week: 'saturday' as const, start_time: '09:00', end_time: '09:30', label: 'Morning', is_active: true },
    { id: 33, day_of_week: 'saturday' as const, start_time: '09:30', end_time: '10:00', label: 'Morning', is_active: true },
    { id: 34, day_of_week: 'saturday' as const, start_time: '10:00', end_time: '10:30', label: 'Morning', is_active: true },
    { id: 35, day_of_week: 'saturday' as const, start_time: '10:30', end_time: '11:00', label: 'Morning', is_active: true },
    { id: 36, day_of_week: 'saturday' as const, start_time: '11:00', end_time: '11:30', label: 'Morning', is_active: true },
  ],
  appointments: [
    { id: 1, booking_ref: 'DC-2026-00001', patient_name: 'Ananya Gupta', phone: '+91 94471 21519', email: 'ananya@email.com', treatment: 'Root Canal Treatment', appointment_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), appointment_time: '09:00', slot_id: 1, notes: 'First visit, mild tooth pain', status: 'pending' as const, whatsapp_sent: false, admin_notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, booking_ref: 'DC-2026-00002', patient_name: 'Rahul Verma', phone: '+91 87654 32109', email: null, treatment: 'Dental Cleaning', appointment_date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10), appointment_time: '14:00', slot_id: 6, notes: null, status: 'confirmed' as const, whatsapp_sent: true, admin_notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, booking_ref: 'DC-2026-00003', patient_name: 'Meera Iyer', phone: '+91 76543 21098', email: 'meera@email.com', treatment: 'Teeth Whitening', appointment_date: new Date().toISOString().slice(0, 10), appointment_time: '10:00', slot_id: 3, notes: null, status: 'completed' as const, whatsapp_sent: true, admin_notes: 'Patient satisfied', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
};

export function getAvailableSlots(date: string): AvailableSlot[] {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayOfWeek = dayNames[new Date(date + 'T00:00:00').getDay()];
  const daySlots = mockData.slots.filter(s => s.day_of_week === dayOfWeek && s.is_active);
  const bookedSlotIds = mockData.appointments
    .filter(a => a.appointment_date === date && (a.status === 'pending' || a.status === 'confirmed'))
    .map(a => a.slot_id);
  return daySlots.map(s => ({
    id: s.id,
    time: s.start_time,
    end_time: s.end_time,
    label: s.label,
    available: !bookedSlotIds.includes(s.id),
  }));
}

export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const seq = String(mockData.appointments.length + 1).padStart(5, '0');
  return `DC-${year}-${seq}`;
}
