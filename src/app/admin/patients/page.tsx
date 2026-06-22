'use client';

import { useState, useEffect } from 'react';
import { Search, Phone, Calendar } from 'lucide-react';
import { getAppointments } from '@/lib/api';
import type { Appointment } from '@/lib/api';

interface PatientEntry {
  patient_name: string;
  phone: string;
  visit_count: number;
}

export default function AdminPatientsPage() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<PatientEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAppointments({ limit: 100 })
      .then((res) => {
        if (!mounted) return;
        const map = new Map<string, { name: string; count: number }>();
        for (const a of res.appointments) {
          const key = a.phone;
          if (map.has(key)) {
            map.get(key)!.count++;
          } else {
            map.set(key, { name: a.patient_name, count: 1 });
          }
        }
        const entries: PatientEntry[] = [];
        map.forEach((val, phone) => {
          entries.push({ patient_name: val.name, phone, visit_count: val.count });
        });
        entries.sort((a, b) => a.patient_name.localeCompare(b.patient_name));
        setPatients(entries);
      })
      .catch(() => {
        if (mounted) setPatients([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Patients</h1>
        <p className="mt-1 text-sm text-slate-500">Patient directory</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients..."
          aria-label="Search patients"
          autoComplete="off"
          className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" aria-label="Loading" />
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
          {filtered.map((p) => (
            <div key={p.phone} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-lg font-bold text-teal-600">
                  {p.patient_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{p.patient_name}</p>
                  <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600">
                    <Phone className="h-3 w-3" aria-hidden="true" />
                    {p.phone}
                  </a>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {p.visit_count} visit{p.visit_count !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-slate-400">No patients found.</p>
          )}
        </div>
      )}
    </div>
  );
}
