'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getServices, createService, updateService, deleteService } from '@/lib/api';
import type { Service } from '@/lib/api';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface ServiceForm {
  service_name: string;
  short_desc: string;
  slug: string;
  is_active: boolean;
}

const emptyForm: ServiceForm = { service_name: '', short_desc: '', slug: '', is_active: true };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getServices(true);
      setServices(data);
    } catch {
      console.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServices(true)
      .then(setServices)
      .catch(() => console.error('Failed to fetch services'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    import('@aejkatappaja/phantom-ui');
  }, []);

  const toggleActive = async (id: number, current: number) => {
    try {
      await updateService(id, { is_active: current ? 0 : 1 });
      await fetchServices();
    } catch {
      console.error('Failed to toggle service status');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteService(id);
      await fetchServices();
    } catch {
      console.error('Failed to delete service');
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
    setError(null);
  };

  const openEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      service_name: service.service_name,
      short_desc: service.short_desc,
      slug: service.slug,
      is_active: service.is_active === 1,
    });
    setShowModal(true);
    setError(null);
  };

  const handleSave = async () => {
    setError(null);
    if (editingId) {
      try {
        await updateService(editingId, {
          service_name: form.service_name,
          short_desc: form.short_desc,
          slug: form.slug,
          is_active: form.is_active ? 1 : 0,
        });
        await fetchServices();
        setShowModal(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update service');
      }
    } else {
      try {
        await createService({
          service_name: form.service_name,
          short_desc: form.short_desc,
          slug: form.slug,
          is_active: form.is_active ? 1 : 0,
        });
        await fetchServices();
        setShowModal(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create service');
      }
    }
  };

  const slugFromName = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Services</h1>
          <p className="mt-1 text-sm text-slate-500">Manage dental services and treatments</p>
        </div>
        <Button variant="primary" size="sm" onClick={openAdd}>
          Add Service
        </Button>
      </div>

      <phantom-ui loading={loading}>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="h-3 w-20 rounded bg-slate-100" />
                    </div>
                    <div className="h-5 w-16 rounded-full bg-slate-200" />
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-3/4 rounded bg-slate-100" />
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
            services.map((service) => (
              <div key={service.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{service.service_name}</h3>
                    <p className="text-xs text-slate-400">{service.slug}</p>
                  </div>
                  <Badge variant={service.is_active ? 'confirmed' : 'cancelled'}>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="mt-3 text-xs text-slate-500 line-clamp-2">{service.short_desc}</p>
                <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => toggleActive(service.id, service.is_active)}
                    className="text-xs text-slate-500 hover:text-teal-600"
                  >
                    {service.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openEdit(service)}
                    className="text-xs text-slate-500 hover:text-blue-600"
                  >
                    <Pencil className="h-3.5 w-3.5 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(service.id)}
                    className="text-xs text-slate-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </phantom-ui>

      {/* Add/Edit Service Modal */}
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
                {editingId ? 'Edit Service' : 'Add Service'}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                <input
                  value={form.service_name}
                  onChange={(e) => setForm({ ...form, service_name: e.target.value, slug: editingId ? form.slug : slugFromName(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="e.g. Dental Cleaning"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  placeholder="dental-cleaning"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
                <textarea
                  value={form.short_desc}
                  onChange={(e) => setForm({ ...form, short_desc: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Brief description of the service..."
                />
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
            {error && (
              <div className="px-6 pb-2">
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>
              </div>
            )}
            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={!form.service_name || !form.slug}>
                {editingId ? 'Save Changes' : 'Add Service'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Service?"
        description="This service will be permanently removed from the website. This action cannot be undone."
        confirmText="Delete Service"
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
