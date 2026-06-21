'use client';

import { useState } from 'react';
import { Search, Phone, Calendar } from 'lucide-react';
import { mockData } from '@/lib/mock-data';

export default function AdminPatientsPage() {
  const [search, setSearch] = useState('');

  const uniquePatients = Array.from(
    new Map(mockData.appointments.map((a) => [a.phone, a])).values()
  ).filter(
    (a) =>
      a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search)
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

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
        {uniquePatients.map((p) => {
          const patientAppts = mockData.appointments.filter((a) => a.phone === p.phone);
          return (
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
                {patientAppts.length} visit{patientAppts.length !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
        {uniquePatients.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-slate-400">No patients found.</p>
        )}
      </div>
    </div>
  );
}
