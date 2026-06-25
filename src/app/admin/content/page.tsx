'use client';

import { useState, useEffect } from 'react';
import { Star, Eye, EyeOff, Trash2 } from 'lucide-react';
import { getTestimonials, createTestimonial, deleteTestimonial, Testimonial } from '@/lib/api';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function AdminContentPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const fetchTestimonials = () => {
    getTestimonials()
      .then(setTestimonials)
      .catch(() => setTestimonials([]));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = (id: number) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget === null) return;
    deleteTestimonial(deleteTarget)
      .then(fetchTestimonials)
      .catch(() => alert('Failed to delete testimonial'));
  };

  const handleToggleVisibility = async (id: number) => {
    const t = testimonials.find((t) => t.id === id);
    if (!t) return;
    try {
      await createTestimonial({ ...t, is_visible: t.is_visible ? 0 : 1 });
      fetchTestimonials();
    } catch {
      alert('Failed to update visibility');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Content</h1>
        <p className="mt-1 text-sm text-slate-500">Manage website content and testimonials</p>
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-bold text-slate-900">Testimonials</h2>
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-600">
                    {t.patient_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{t.patient_name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">&ldquo;{t.review}&rdquo;</p>
                    {t.treatment && (
                      <p className="mt-1 text-xs text-slate-400">{t.treatment}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleVisibility(t.id)}
                    className={`rounded-lg p-1.5 transition-colors ${
                      t.is_visible ? 'text-teal-500 hover:bg-teal-50' : 'text-slate-400 hover:bg-slate-100'
                    }`}
                    title={t.is_visible ? 'Hide' : 'Show'}
                    aria-label="Toggle visibility"
                  >
                    {t.is_visible ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                    aria-label="Delete testimonial"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <h3 className="font-display text-lg font-bold text-slate-900">Other Content Sections</h3>
        <p className="mt-2 text-sm text-slate-500">
          Banners, FAQs, and other content management coming soon.
        </p>
      </div>
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Testimonial?"
        description="This testimonial will be permanently removed from the website. This action cannot be undone."
        confirmText="Delete Testimonial"
        variant="danger"
        onConfirm={() => {
          confirmDelete();
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
