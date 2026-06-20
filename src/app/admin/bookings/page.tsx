'use client';

import { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { mockData } from '@/lib/api';
import { formatDate, formatTime, generateWhatsAppUrl, buildConfirmationMessage } from '@/lib/utils';

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('');
  const settings = mockData.settings;

  const filtered = mockData.appointments.filter(
    (a) =>
      a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search)
  );

  const handleWhatsApp = (appt: typeof mockData.appointments[0]) => {
    const msg = buildConfirmationMessage(
      {
        booking_ref: appt.booking_ref,
        patient_name: appt.patient_name,
        treatment: appt.treatment,
        appointment_date: appt.appointment_date,
        appointment_time: appt.appointment_time,
      },
      { address: settings.clinic_address, phone: settings.clinic_phone, maps_link: settings.google_maps_link }
    );
    const waUrl = generateWhatsAppUrl(appt.phone, msg);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="mt-1 text-sm text-slate-500">View and manage all booking records</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookings..."
          aria-label="Search bookings"
          autoComplete="off"
          className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((appt) => (
          <div key={appt.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-600">
                  {appt.patient_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{appt.patient_name}</p>
                  <p className="text-xs text-slate-500">{appt.phone} · {appt.treatment}</p>
                  <p className="text-xs text-slate-400">
                    Ref: {appt.booking_ref} · {formatDate(appt.appointment_date)} at {formatTime(appt.appointment_time)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={appt.status}>{appt.status}</Badge>
                <button
                  onClick={() => handleWhatsApp(appt)}
                  className="rounded-lg p-2 text-green-500 hover:bg-green-50 transition-colors"
                  title="Send WhatsApp"
                  aria-label="Contact via WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
