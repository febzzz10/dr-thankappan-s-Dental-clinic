'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { Pencil, Trash2, X, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor, uploadFile } from '@/lib/api';
import type { Doctor } from '@/lib/api';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface DoctorForm {
  doctor_name: string;
  slug: string;
  qualification: string;
  specialization: string;
  experience_yrs: number | null;
  bio: string;
  image_url: string;
  is_active: number;
}

const emptyForm: DoctorForm = {
  doctor_name: '', slug: '', qualification: '',
  specialization: '', experience_yrs: null, bio: '', image_url: '', is_active: 1,
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DoctorForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch(() => setError('Failed to load doctors'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    import('@aejkatappaja/phantom-ui');
  }, []);

  const toggleActive = async (id: number) => {
    try {
      const doctor = doctors.find(d => d.id === id);
      if (!doctor) return;
      await updateDoctor(id, { is_active: doctor.is_active === 1 ? 0 : 1 });
      fetchDoctors();
    } catch {
      setError('Failed to update doctor status');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDoctor(id);
      fetchDoctors();
    } catch {
      setError('Failed to delete doctor');
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFilePreview(null);
    setSelectedFile(null);
    setError('');
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
      bio: doctor.bio ?? '',
      image_url: doctor.image_url ?? '',
      is_active: doctor.is_active,
    });
    setFilePreview(null);
    setSelectedFile(null);
    setError('');
    setShowModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, or WebP images are accepted');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB');
      return;
    }

    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    setError('');
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return form.image_url || null;
    const { public_url } = await uploadFile(selectedFile);
    return public_url;
  };

  const handleSave = async () => {
    setError('');
    setUploading(true);
    try {
      const imageUrl = await uploadImage();
      const data = {
        doctor_name: form.doctor_name,
        slug: form.slug,
        qualification: form.qualification,
        specialization: form.specialization,
        experience_yrs: form.experience_yrs,
        bio: form.bio || null,
        image_url: imageUrl,
        is_active: form.is_active,
      };
      if (editingId) {
        await updateDoctor(editingId, data);
      } else {
        await createDoctor(data);
      }
      await fetchDoctors();
      setShowModal(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(`Failed to save doctor: ${msg}`);
    } finally {
      setUploading(false);
    }
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

      <phantom-ui loading={loading}>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
          {loading ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-28 rounded bg-slate-200" />
                        <div className="h-5 w-16 rounded-full bg-slate-200" />
                      </div>
                      <div className="h-3 w-36 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-24 rounded bg-slate-100" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <div className="h-3 w-16 rounded bg-slate-100" />
                    <div className="h-3 w-12 rounded bg-slate-100" />
                    <div className="h-3 w-14 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            doctors.map((doctor) => (
              <div key={doctor.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  {doctor.image_url ? (
                    <Image
                      src={doctor.image_url}
                      alt={doctor.doctor_name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                      unoptimized
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
                  <button onClick={() => setDeleteTarget(doctor.id)} className="text-xs text-slate-500 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </phantom-ui>

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
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                  placeholder="Brief description about the doctor..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profile Picture</label>
                <div className="flex items-start gap-4">
                  {(filePreview || form.image_url) && !selectedFile ? (
                    <Image
                      src={form.image_url}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full object-cover shrink-0 border border-slate-200"
                      unoptimized
                    />
                  ) : filePreview ? (
                    <Image
                      src={filePreview}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full object-cover shrink-0 border border-slate-200"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300 shrink-0 border-2 border-dashed border-slate-200">
                      <Upload className="h-5 w-5" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm"
                    >
                      <Upload className="h-4 w-4" />
                      {selectedFile ? selectedFile.name : 'Choose Image'}
                    </button>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                        className="ml-2 text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                    <p className="mt-1.5 text-xs text-slate-400">JPG, PNG, or WebP. Max 5 MB.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active === 1}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active</label>
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)} disabled={uploading}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={!form.doctor_name || !form.slug || uploading}>
                {uploading ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</span>
                ) : (
                  editingId ? 'Save Changes' : 'Add Doctor'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Doctor?"
        description="This doctor profile will be permanently removed from the website. This action cannot be undone."
        confirmText="Delete Doctor"
        variant="danger"
        onConfirm={() => {
          if (deleteTarget !== null) handleDelete(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
