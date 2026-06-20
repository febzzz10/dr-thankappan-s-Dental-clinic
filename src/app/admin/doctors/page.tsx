'use client';

import { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockData } from '@/lib/api';
import type { Doctor } from '@/types';

interface DoctorForm {
  doctor_name: string;
  slug: string;
  qualification: string;
  specialization: string;
  experience_yrs: number | null;
  image_url: string;
  is_active: boolean;
}

const emptyForm: DoctorForm = {
  doctor_name: '', slug: '', qualification: '',
  specialization: '', experience_yrs: null, image_url: '', is_active: true,
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(mockData.doctors);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DoctorForm>(emptyForm);

  const toggleActive = (id: number) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_active: !d.is_active } : d))
    );
  };

  const deleteDoctor = (id: number) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (doctor: Doctor) => {
    setEditingId(doctor.id);
    setForm({
      doctor_name: doctor.doctor_name,
      slug: doctor.slug,
      qualification: doctor.qualification,
      specialization: doctor.specialization,
      experience_yrs: doctor.experience_yrs,
      image_url: doctor.image_url ?? '',
      is_active: doctor.is_active,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      setDoctors((prev) =>
        prev.map((d) => (d.id === editingId ? { ...d, ...form } : d))
      );
      } else {
        const { image_url, ...rest } = form;
        const newDoctor = {
          id: Math.max(0, ...doctors.map((d) => d.id)) + 1,
          ...rest,
          image_url: image_url || null,
          bio: null,
          availability: null,
          sort_order: doctors.length + 1,
        } as Doctor;
      setDoctors((prev) => [...prev, newDoctor]);
    }
    setShowModal(false);
  };

  const slugFromName = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Doctors</h1>
          <p className="mt-1 text-sm text-slate-500">Manage doctor profiles</p>
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          Add Doctor
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              {doctor.image_url ? (
                <img
                  src={doctor.image_url}
                  alt={doctor.doctor_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-base font-bold text-teal-600">
                  {doctor.doctor_name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">{doctor.doctor_name}</h3>
                  <Badge variant={doctor.is_active ? 'confirmed' : 'cancelled'}>
                    {doctor.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{doctor.qualification}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{doctor.specialization}</p>
            <p className="text-xs text-slate-400">{doctor.experience_yrs} years experience</p>
            <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => toggleActive(doctor.id)} className="text-xs text-slate-500 hover:text-teal-600">
                {doctor.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => openEdit(doctor)} className="text-xs text-slate-500 hover:text-blue-600">
                <Pencil className="h-3.5 w-3.5 inline mr-1" />
                Edit
              </button>
              <button onClick={() => { if (confirm('Are you sure you want to delete this doctor?')) deleteDoctor(doctor.id); }} className="text-xs text-slate-500 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Doctor Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                {editingId ? 'Edit Doctor' : 'Add Doctor'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name</label>
                <input
                  value={form.doctor_name}
                  onChange={(e) => setForm({ ...form, doctor_name: e.target.value, slug: editingId ? form.slug : slugFromName(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="e.g. Dr. John Doe"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="dr-john-doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
                <input
                  value={form.qualification}
                  onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="e.g. BDS, MDS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                <input
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="e.g. Orthodontist"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience (years)</label>
                <input
                  type="number"
                  value={form.experience_yrs ?? ''}
                  onChange={(e) => setForm({ ...form, experience_yrs: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profile Picture URL</label>
                <div className="flex items-center gap-3">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="h-12 w-12 rounded-full object-cover shrink-0 border border-slate-200"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-sm text-slate-300 shrink-0 border border-dashed border-slate-200">
                      <span className="text-[10px] font-medium">URL</span>
                    </div>
                  )}
                  <input
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    placeholder="https://example.com/doctor.jpg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active</label>
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={!form.doctor_name || !form.slug}>
                {editingId ? 'Save Changes' : 'Add Doctor'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}