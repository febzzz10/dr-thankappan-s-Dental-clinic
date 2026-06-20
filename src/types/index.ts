export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export type DayOfWeek =
  | 'monday' | 'tuesday' | 'wednesday'
  | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Service {
  id: number;
  slug: string;
  service_name: string;
  short_desc: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  price_from: number | null;
  is_active: boolean;
  sort_order: number;
}

export interface Doctor {
  id: number;
  slug: string;
  doctor_name: string;
  qualification: string;
  specialization: string;
  experience_yrs: number | null;
  bio: string | null;
  image_url: string | null;
  availability: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Appointment {
  id: number;
  booking_ref: string;
  patient_name: string;
  phone: string;
  email: string | null;
  treatment: string;
  appointment_date: string;
  appointment_time: string;
  slot_id: number | null;
  notes: string | null;
  status: AppointmentStatus;
  whatsapp_sent: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AvailableSlot {
  id: number;
  time: string;
  end_time: string;
  label: string | null;
  available: boolean;
}

export interface Testimonial {
  id: number;
  patient_name: string;
  rating: number;
  review: string;
  treatment: string | null;
  is_visible: boolean;
  source: string;
  created_at: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  is_active: boolean;
  sort_order: number;
  expires_at: string | null;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  is_visible: boolean;
  sort_order: number;
}

export interface Settings {
  clinic_name: string;
  clinic_phone: string;
  clinic_email: string;
  clinic_address: string;
  whatsapp_number: string;
  google_maps_link: string;
  booking_enabled: string;
  slot_advance_days: string;
  lunch_start: string;
  lunch_end: string;
  instagram_url: string;
  facebook_url: string;
  procedure_durations?: Record<string, number>;
}

export interface Slot {
  id: number;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  label: string | null;
  is_active: boolean;
}

export interface Holiday {
  id: number;
  date: string;
  reason: string | null;
}

export interface DashboardStats {
  today: number;
  pending: number;
  this_week: number;
  completed_month: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
