import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function buildAdminAlertMessage(booking: {
  booking_ref: string;
  patient_name: string;
  phone: string;
  treatment: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}): string {
  return [
    '🦷 *New Appointment Booking*',
    '',
    `📋 Ref: *${booking.booking_ref}*`,
    `👤 Patient: *${booking.patient_name}*`,
    `📞 Phone: ${booking.phone}`,
    `💊 Treatment: *${booking.treatment}*`,
    `📅 Date: *${formatDate(booking.appointment_date)}*`,
    `⏰ Time: *${formatTime(booking.appointment_time)}*`,
    ...(booking.notes ? [`📝 Notes: ${booking.notes}`] : []),
    '',
    'Please review and confirm this appointment.',
  ].filter(Boolean).join('\n');
}

export function buildConfirmationMessage(booking: {
  booking_ref: string;
  patient_name: string;
  treatment: string;
  appointment_date: string;
  appointment_time: string;
}, clinic: { address: string; phone: string; maps_link: string }): string {
  const firstName = booking.patient_name.split(' ')[0];
  return [
    '*Appointment Confirmed*',
    '',
    `Dear ${firstName},`,
    '',
    'Your dental appointment has been confirmed.',
    '',
    `Booking Ref: ${booking.booking_ref}`,
    `Patient: ${booking.patient_name}`,
    `Treatment: ${booking.treatment}`,
    `Date: ${formatDate(booking.appointment_date)}`,
    `Time: ${formatTime(booking.appointment_time)}`,
    '',
    'Clinic Address:',
    clinic.address,
    '',
    `Google Maps: ${clinic.maps_link}`,
    '',
    'Please arrive 10 minutes early.',
    `For any changes, call: ${clinic.phone}`,
    '',
    'Thank you for choosing us.',
  ].join('\n');
}

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
