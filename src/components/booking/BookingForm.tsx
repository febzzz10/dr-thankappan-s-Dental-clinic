'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { PiCalendarBlank, PiClock, PiUser, PiPhone, PiEnvelope, PiChatText, PiArrowRight, PiCheck } from 'react-icons/pi';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { mockData } from '@/lib/mock-data';
import { getSlots, createAppointment } from '@/lib/api';
import type { AvailableSlot } from '@/types';
import { formatDate, formatTime, generateWhatsAppUrl } from '@/lib/utils';

export function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTreatment = searchParams.get('treatment');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  const [form, setForm] = useState({
    patient_name: '',
    phone: '+91 ',
    email: '',
    treatment: preselectedTreatment
      ? mockData.services.find(s => s.slug === preselectedTreatment)?.service_name ?? ''
      : '',
    appointment_date: '',
    appointment_time: '',
    slot_id: 0,
    notes: '',
  });

  useEffect(() => {
    const filled = form.patient_name || form.treatment || form.appointment_date;
    if (!filled) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [form.patient_name, form.treatment, form.appointment_date]);

  const [dateSlots, setDateSlots] = useState<AvailableSlot[]>([]);
  const settings = mockData.settings;

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleDateChange = async (date: string) => {
    updateField('appointment_date', date);
    updateField('slot_id', 0);
    updateField('appointment_time', '');
    try {
      const apiSlots = await getSlots(date, date);
      const mapped: AvailableSlot[] = apiSlots.map((s) => ({
        id: s.id,
        time: s.start_time,
        end_time: s.end_time,
        label: s.slot_label,
        available: s.status === 'available',
      }));
      setDateSlots(mapped);
    } catch {
      setDateSlots([]);
    }
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    updateField('slot_id', slot.id);
    updateField('appointment_time', slot.time);
  };

  const canNextStep = () => {
    if (step === 1) return form.patient_name.length >= 2 && form.phone.length >= 10 && form.treatment;
    if (step === 2) return form.appointment_date && form.slot_id > 0;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!form.patient_name || form.patient_name.length < 2) errors.patient_name = 'Please enter your full name';
    if (!form.phone || form.phone.length < 10) errors.phone = 'Please enter a valid phone number';
    if (!form.treatment) errors.treatment = 'Please select a treatment';
    if (!form.appointment_date) errors.appointment_date = 'Please select a date';
    if (!form.slot_id) errors.appointment_time = 'Please select a time slot';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the highlighted fields below.');
      setLoading(false);
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(firstKey === 'appointment_time' ? 'appointment_date' : firstKey);
      el?.focus();
      return;
    }

    try {
      const result = await createAppointment({
        patient_name: form.patient_name,
        phone: form.phone,
        email: form.email || undefined,
        treatment_name: form.treatment,
        doctor_id: 1,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        slot_id: form.slot_id,
        notes: form.notes || undefined,
      });
      const ref = result.booking_ref;
      const waNumber = settings.whatsapp_number;
      const msg = [
        '*New Appointment Booking*',
        '',
        `Ref: *${ref}*`,
        `Patient: *${form.patient_name}*`,
        `PiPhone: ${form.phone}`,
        `Treatment: *${form.treatment}*`,
        `Date: *${formatDate(form.appointment_date)}*`,
        `Time: *${formatTime(form.appointment_time)}*`,
        ...(form.notes ? [`Notes: ${form.notes}`] : []),
        '',
        'Please confirm this booking.',
      ].join('\n');
      const waUrl = generateWhatsAppUrl(waNumber, msg);

      window.open(waUrl, '_blank');
      router.push(`/book/confirmation?ref=${ref}&name=${encodeURIComponent(form.patient_name)}&date=${form.appointment_date}&time=${encodeURIComponent(formatTime(form.appointment_time))}&treatment=${encodeURIComponent(form.treatment)}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again or call us directly.');
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step >= s
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s ? <PiCheck className="h-4 w-4" aria-hidden="true" /> : s}
            </div>
            <span className={`text-xs font-medium ${step >= s ? 'text-teal-700' : 'text-slate-400'}`}>
              {s === 1 ? 'Details' : s === 2 ? 'Schedule' : 'Review'}
            </span>
            {s < 3 && <div className="mx-2 h-px w-8 bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        {step === 1 && (
          <AnimatePresence mode="wait">
            <motion.div
              key="step1"
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
              transition={prefersReducedMotion ? undefined : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <h2 className="font-display text-xl font-bold text-slate-900">Your Details</h2>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name *</label>
                <Input
                  id="name"
                  autoComplete="name"
                  icon={<PiUser />}
                  value={form.patient_name}
                  onChange={(e) => updateField('patient_name', e.target.value)}
                  placeholder="Your full name"
                  className="mt-1"
                />
                {fieldErrors.patient_name && <p className="mt-1 text-xs text-red-500">{fieldErrors.patient_name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number *</label>
                <Input
                  id="phone"
                  autoComplete="tel"
                  icon={<PiPhone />}
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+91 94471 21519"
                  className="mt-1"
                />
                {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email (optional)</label>
                <Input
                  id="email"
                  autoComplete="email"
                  spellCheck={false}
                  icon={<PiEnvelope />}
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="email@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-slate-700">Treatment *</label>
                <Select
                  id="treatment"
                  value={form.treatment}
                  onChange={(e) => updateField('treatment', e.target.value)}
                  className="mt-1"
                >
                  <option value="">Select a treatment</option>
                  {mockData.services.map((s) => (
                    <option key={s.id} value={s.service_name}>
                      {s.service_name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </Select>
                {fieldErrors.treatment && <p className="mt-1 text-xs text-red-500">{fieldErrors.treatment}</p>}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {step === 2 && (
          <AnimatePresence mode="wait">
            <motion.div
              key="step2"
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
              transition={prefersReducedMotion ? undefined : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
            <h2 className="font-display text-xl font-bold text-slate-900">Choose Date & Time</h2>
            <div>
              <label htmlFor="appointment_date" className="block text-sm font-medium text-slate-600">Preferred Date *</label>
              <Input
                id="appointment_date"
                autoComplete="off"
                icon={<PiCalendarBlank />}
                type="date"
                value={form.appointment_date}
                min={today}
                onChange={(e) => handleDateChange(e.target.value)}
                className="mt-1"
              />
              {fieldErrors.appointment_date && <p className="mt-1 text-xs text-red-500">{fieldErrors.appointment_date}</p>}
            </div>

            {form.appointment_date && (
              <div>
                <label className="block text-sm font-medium text-slate-600">Available Slots *</label>
                {dateSlots.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">
                    No slots available for this date. Please select another date.
                  </p>
                ) : (
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {dateSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => handleSlotSelect(slot)}
                        style={{ touchAction: 'manipulation' }}
                        className={`rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-all ${
                          form.slot_id === slot.id
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : !slot.available
                            ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                            : 'border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                        }`}
                      >
                        <PiClock className="mx-auto mb-1 h-3.5 w-3.5" aria-hidden="true" />
                        {formatTime(slot.time)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {fieldErrors.appointment_time && <p className="mt-1 text-xs text-red-500">{fieldErrors.appointment_time}</p>}
          </motion.div>
          </AnimatePresence>
        )}

        {step === 3 && (
          <AnimatePresence mode="wait">
            <motion.div
              key="step3"
              initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
              transition={prefersReducedMotion ? undefined : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <h2 className="font-display text-xl font-bold text-slate-900">Review & Confirm</h2>
              <div className="rounded-xl bg-slate-50 p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Name</span>
                  <span className="font-medium text-slate-900">{form.patient_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">PiPhone</span>
                  <span className="font-medium text-slate-900">{form.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Treatment</span>
                  <span className="font-medium text-slate-900">{form.treatment}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Date</span>
                  <span className="font-medium text-slate-900">
                    {form.appointment_date ? formatDate(form.appointment_date) : ''}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Time</span>
                  <span className="font-medium text-slate-900">{formatTime(form.appointment_time)}</span>
                </div>
                {form.notes && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Notes</span>
                    <span className="font-medium text-slate-900">{form.notes}</span>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-600">Additional Notes</label>
                <Textarea
                  id="notes"
                  autoComplete="off"
                  icon={<PiChatText />}
                  rows={3}
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  maxLength={500}
                  placeholder="Any specific concerns or requirements…"
                  className="mt-1"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button disabled={!canNextStep()} onClick={() => setStep(step + 1)} showArrow={false}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Booking…' : 'Confirm Booking'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
