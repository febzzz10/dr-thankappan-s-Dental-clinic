'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck, Clock, Users, TrendingUp } from 'lucide-react';
import { getAppointments, Appointment } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
        const weekStart = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);

        const [todayRes, pendingRes, completedRes, weekRes, upcomingRes] = await Promise.all([
          getAppointments({ date: today, limit: 50 }),
          getAppointments({ status: 'PENDING', from: today, limit: 50 }),
          getAppointments({ status: 'COMPLETED', from: monthStart, limit: 50 }),
          getAppointments({ from: weekStart, to: today, limit: 100 }),
          getAppointments({ from: today, limit: 20 }),
        ]);

        setTodayAppointments(todayRes.appointments);
        setTodayCount(todayRes.total);
        setPendingCount(pendingRes.total);
        setWeekCount(weekRes.total);
        setCompletedCount(completedRes.total);
        setUpcomingAppointments(upcomingRes.appointments.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    { icon: CalendarCheck, label: "Today's Appointments", value: todayCount, color: 'bg-teal-500' },
    { icon: Clock, label: 'Pending Confirmation', value: pendingCount, color: 'bg-amber-500' },
    { icon: TrendingUp, label: "This Week's Total", value: weekCount, color: 'bg-blue-500' },
    { icon: Users, label: 'Completed Total', value: completedCount, color: 'bg-emerald-500' },
  ];

  return (
    <phantom-ui loading={loading}>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here&apos;s your clinic overview.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))]">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-1 font-display text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} bg-opacity-10`}>
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-slate-900">Today&apos;s Appointments</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Treatment</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todayAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                        No appointments for today.
                      </td>
                    </tr>
                  ) : (
                    todayAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{formatTime(appt.appointment_time)}</td>
                        <td className="px-4 py-3 text-slate-700">{appt.patient_name}</td>
                        <td className="px-4 py-3 text-slate-500">{appt.treatment_name_snapshot ?? appt.service_name ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-500">{appt.phone}</td>
                        <td className="px-4 py-3">
                          <Badge variant={badgeVariant(appt.status)}>{appt.status.replace(/_/g, ' ')}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-slate-900">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-600">
                    {appt.patient_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{appt.patient_name}</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(appt.appointment_date)} at {formatTime(appt.appointment_time)}
                    </p>
                  </div>
                </div>
                <Badge variant={badgeVariant(appt.status)}>{appt.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </phantom-ui>
  );
}
