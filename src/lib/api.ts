const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const json: { success: boolean; data?: T; error?: string; message?: string } = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(
      json.error ?? 'UNKNOWN_ERROR',
      json.message ?? 'An error occurred',
      res.status
    );
  }

  return json.data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};

// ---- Auth ----
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export async function login(email: string, password: string): Promise<AdminUser> {
  return api.post<AdminUser>('/api/auth/login', { email, password });
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout', {});
}

export async function getMe(): Promise<AdminUser> {
  return api.get<AdminUser>('/api/auth/me');
}

// ---- Appointments ----
export interface Appointment {
  id: number;
  booking_ref: string;
  patient_name: string;
  phone: string;
  email: string | null;
  service_id: number | null;
  treatment_name_snapshot: string | null;
  doctor_id: number | null;
  doctor_name?: string;
  service_name?: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
}

export interface AppointmentLookup {
  booking_ref: string;
  patient_name: string;
  status: string;
  appointment_date: string;
  appointment_time: string;
  treatment: string | null;
}

export async function getAppointments(params?: { page?: number; status?: string; date?: string; limit?: number }) {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.status) q.set('status', params.status);
  if (params?.date) q.set('date', params.date);
  const qs = q.toString();
  return api.get<{ appointments: Appointment[]; total: number; page: number; totalPages: number }>(
    `/api/appointments${qs ? `?${qs}` : ''}`
  );
}

export async function lookupAppointment(bookingRef: string): Promise<AppointmentLookup> {
  return api.get<AppointmentLookup>(`/api/appointments/lookup?booking_ref=${encodeURIComponent(bookingRef)}`);
}

export async function createAppointment(data: {
  patient_name: string;
  phone: string;
  email?: string;
  service_id?: number;
  treatment_name?: string;
  doctor_id?: number;
  appointment_date: string;
  appointment_time: string;
  slot_id: number;
  notes?: string;
}): Promise<{ booking_ref: string; message: string }> {
  return api.post('/api/appointments', data);
}

export async function updateAppointmentStatus(id: number, data: { status?: string; admin_notes?: string }) {
  return api.patch(`/api/appointments/${id}`, data);
}

// ---- Slots ----
export interface Slot {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  slot_label: string | null;
  status: 'available' | 'booked' | 'blocked';
  doctor_id: number | null;
  procedure_type: string | null;
}

export async function getSlots(from: string, to: string, doctorId?: number): Promise<Slot[]> {
  const q = new URLSearchParams({ from, to });
  if (doctorId) q.set('doctor_id', String(doctorId));
  return api.get<Slot[]>(`/api/slots?${q.toString()}`);
}

export async function generateSlots(data: {
  start_date: string;
  end_date: string;
  work_start: string;
  work_end: string;
  duration_min: number;
  break_start?: string;
  break_end?: string;
  days_of_week: string[];
  doctor_id: number;
}): Promise<{ generated: number; dates_generated: string[]; skipped: string[] }> {
  return api.post('/api/slots/generate', data);
}

export async function createSlot(data: {
  date: string;
  start_time: string;
  end_time: string;
  slot_label?: string;
  status?: string;
  doctor_id: number;
  procedure_type?: string | null;
}): Promise<{ id: number }> {
  return api.post('/api/slots', data);
}

export async function createBatchSlots(slots: {
  date: string;
  start_time: string;
  end_time: string;
  slot_label?: string;
  status?: string;
  doctor_id: number;
  procedure_type?: string | null;
}[]): Promise<{ created: number }> {
  return api.post('/api/slots/batch', { slots });
}

export async function updateSlot(id: number, data: { status?: string; procedure_type?: string; start_time?: string; end_time?: string }) {
  return api.patch(`/api/slots/${id}`, data);
}

export async function deleteSlot(id: number) {
  return api.del(`/api/slots/${id}`);
}

// ---- Services ----
export interface Service {
  id: number;
  slug: string;
  service_name: string;
  short_desc: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  price_from: number | null;
  is_active: number;
  sort_order: number;
}

export async function getServices(): Promise<Service[]> {
  return api.get<Service[]>('/api/services');
}

export async function getService(slug: string): Promise<Service> {
  return api.get<Service>(`/api/services/${slug}`);
}

export async function createService(data: Partial<Service>): Promise<{ id: number }> {
  return api.post('/api/services', data);
}

export async function updateService(id: number, data: Partial<Service>) {
  return api.patch(`/api/services/${id}`, data);
}

export async function deleteService(id: number) {
  return api.del(`/api/services/${id}`);
}

// ---- Doctors ----
export interface Doctor {
  id: number;
  slug: string;
  doctor_name: string;
  qualification: string;
  specialization: string;
  experience_yrs: number | null;
  bio: string | null;
  image_url: string | null;
  is_active: number;
  sort_order: number;
}

export async function getDoctors(): Promise<Doctor[]> {
  return api.get<Doctor[]>('/api/doctors');
}

export async function getDoctor(slug: string): Promise<Doctor> {
  return api.get<Doctor>(`/api/doctors/${slug}`);
}

export async function createDoctor(data: Partial<Doctor>): Promise<{ id: number }> {
  return api.post('/api/doctors', data);
}

export async function updateDoctor(id: number, data: Partial<Doctor>) {
  return api.patch(`/api/doctors/${id}`, data);
}

export async function deleteDoctor(id: number) {
  return api.del(`/api/doctors/${id}`);
}

// ---- Settings ----
export interface Settings {
  [key: string]: string;
}

export async function getSettings(): Promise<Settings> {
  return api.get<Settings>('/api/settings');
}

export async function updateSettings(data: Settings) {
  return api.patch('/api/settings', data);
}

// ---- Testimonials ----
export interface Testimonial {
  id: number;
  patient_name: string;
  rating: number;
  review: string;
  treatment: string | null;
  is_visible: number;
  source: string;
  created_at: string;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return api.get<Testimonial[]>('/api/testimonials');
}

export async function createTestimonial(data: Partial<Testimonial>): Promise<{ id: number }> {
  return api.post('/api/testimonials', data);
}

export async function deleteTestimonial(id: number) {
  return api.del(`/api/testimonials/${id}`);
}

// ---- FAQs ----
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  is_visible: number;
  sort_order: number;
}

export async function getFAQs(): Promise<FAQ[]> {
  return api.get<FAQ[]>('/api/faqs');
}

export async function createFAQ(data: Partial<FAQ>): Promise<{ id: number }> {
  return api.post('/api/faqs', data);
}

export async function updateFAQ(id: number, data: Partial<FAQ>) {
  return api.patch(`/api/faqs/${id}`, data);
}

export async function deleteFAQ(id: number) {
  return api.del(`/api/faqs/${id}`);
}

// ---- Upload ----
export async function getPresignedUrl(content_type: string, file_name: string) {
  return api.post<{ upload_url: string; public_url: string; key: string }>('/api/upload/presigned', { content_type, file_name });
}

// ---- Doctor Unavailability ----
export async function getUnavailability(doctorId?: number) {
  const q = doctorId ? `?doctor_id=${doctorId}` : '';
  return api.get<Record<string, unknown>[]>(`/api/doctor-unavailability${q}`);
}

export async function addUnavailability(data: { doctor_id: number; date: string; reason?: string }) {
  return api.post('/api/doctor-unavailability', data);
}

export async function removeUnavailability(id: number) {
  return api.del(`/api/doctor-unavailability/${id}`);
}
