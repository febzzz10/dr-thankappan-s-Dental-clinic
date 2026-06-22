'use client';

import { useState, useEffect, useCallback, startTransition } from 'react';
import { Search, MoreHorizontal, MessageCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getAppointments, updateAppointmentStatus, getSettings } from '@/lib/api';
import type { Appointment } from '@/lib/api';
import { formatDate, formatTime, generateWhatsAppUrl, buildConfirmationMessage, buildRejectionMessage } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_SHOW', label: 'No Show' },
] as const;

function badgeVariant(status: string): 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | 'default' {
  const map: Record<string, 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | 'default'> = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'default',
  };
  return map[status] ?? 'default';
}

function getTreatment(appt: Appointment): string {
  return appt.treatment_name_snapshot ?? appt.service_name ?? 'N/A';
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState<number | null>(null);
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: { status?: string } = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const [apptRes, settingsRes] = await Promise.all([
        getAppointments(params),
        getSettings(),
      ]);
      setAppointments(apptRes.appointments);
      setSettings(settingsRes);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { startTransition(() => { fetchData(); }); }, [fetchData]);

  const filtered = appointments.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (a.patient_name?.toLowerCase() ?? '').includes(q) ||
      (a.phone ?? '').includes(q) ||
      (a.booking_ref?.toLowerCase() ?? '').includes(q)
    );
  });

  const handleConfirm = async (id: number) => {
    const appt = appointments.find(a => a.id === id);
    if (!appt || !settings) return;
    try {
      await updateAppointmentStatus(id, { status: 'CONFIRMED' });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'CONFIRMED' } : a))
      );
    } catch {
      // non-blocking — still try to send WhatsApp
    }
    const treatment = appt.treatment_name_snapshot ?? appt.service_name ?? 'Dental Appointment';
    const msg = buildConfirmationMessage(
      {
        booking_ref: appt.booking_ref,
        patient_name: appt.patient_name,
        treatment,
        appointment_date: appt.appointment_date,
        appointment_time: appt.appointment_time,
      },
      {
        address: settings.clinic_address ?? '',
        phone: settings.clinic_phone ?? '',
        maps_link: settings.google_maps_link ?? '',
      }
    );
    const waUrl = generateWhatsAppUrl(appt.phone, msg);
    window.open(waUrl, '_blank');
  };

  const handleReject = async (id: number) => {
    const appt = appointments.find(a => a.id === id);
    if (!appt || !settings) return;
    if (!confirm('Reject this appointment and notify the patient via WhatsApp?')) return;
    try {
      await updateAppointmentStatus(id, { status: 'REJECTED' });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'REJECTED' } : a))
      );
    } catch {
      // non-blocking — still try to send WhatsApp
    }
    const treatment = appt.treatment_name_snapshot ?? appt.service_name ?? 'General';
    const msg = buildRejectionMessage(
      {
        booking_ref: appt.booking_ref,
        patient_name: appt.patient_name,
        treatment,
        appointment_date: appt.appointment_date,
        appointment_time: appt.appointment_time,
      },
      { phone: settings.clinic_phone ?? '' }
    );
    const waUrl = generateWhatsAppUrl(appt.phone, msg);
    window.open(waUrl, '_blank');
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all patient appointments</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" aria-label="Loading" />
        </div>
      </div>
    );
  }

  if (error && appointments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all patient appointments</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Appointments</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all patient appointments</p>
        </div>
        {error && (
          <Button variant="outline" size="sm" onClick={fetchData}>Retry</Button>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone..."
              aria-label="Search appointments"
              autoComplete="off"
              className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Treatment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                    {loading ? 'Loading...' : 'No appointments found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-slate-500">{appt.booking_ref}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{appt.patient_name}</td>
                    <td className="px-4 py-3 text-slate-500">{getTreatment(appt)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatDate(appt.appointment_date)}</td>
                    <td className="px-4 py-3 text-slate-700">{formatTime(appt.appointment_time)}</td>
                    <td className="px-4 py-3 text-slate-500">{appt.phone}</td>
                    <td className="px-4 py-3">
                      <Badge variant={badgeVariant(appt.status)}>{appt.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedAppt(appt.id === selectedAppt ? null : appt.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                        </button>
                        {(appt.status === 'CONFIRMED' || appt.status === 'PENDING') && (
                          <button
                            onClick={() => handleConfirm(appt.id)}
                            className="rounded-lg p-1.5 text-green-500 hover:bg-green-50"
                            title="Send WhatsApp"
                            aria-label="Contact via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                        {appt.status === 'PENDING' && (
                          <button
                            onClick={() => handleReject(appt.id)}
                            className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                            title="Reject appointment"
                            aria-label="Reject appointment"
                          >
                            <XCircle className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAppt && (() => {
        const appt = appointments.find(a => a.id === selectedAppt);
        if (!appt) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setSelectedAppt(null)} style={{ overscrollBehavior: 'contain' }}>
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-display text-lg font-bold text-slate-900">Appointment Details</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Ref</span><span className="font-medium text-slate-900">{appt.booking_ref}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Patient</span><span className="font-medium text-slate-900">{appt.patient_name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Phone</span><span className="font-medium text-slate-900">{appt.phone}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Treatment</span><span className="font-medium text-slate-900">{getTreatment(appt)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Date</span><span className="font-medium text-slate-900">{formatDate(appt.appointment_date)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Time</span><span className="font-medium text-slate-900">{formatTime(appt.appointment_time)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Status</span><Badge variant={badgeVariant(appt.status)}>{appt.status}</Badge></div>
                {appt.notes && <div className="flex justify-between text-sm"><span className="text-slate-500">Notes</span><span className="font-medium text-slate-900">{appt.notes}</span></div>}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                {appt.status === 'PENDING' && (
                  <Button
                    variant="outline"
                    onClick={() => { handleReject(appt.id); setSelectedAppt(null); }}
                  >
                    Reject
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setSelectedAppt(null)}>Close</Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
