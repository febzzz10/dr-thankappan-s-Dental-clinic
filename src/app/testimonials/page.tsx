'use client';

import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { Container, SectionHeader } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { getTestimonials, Testimonial } from '@/lib/api';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then((data) => setTestimonials(data.filter((t) => t.is_visible)))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh bg-white">
      <section className="bg-gradient-to-br from-teal-50 via-white to-teal-50/80 py-20 md:py-28">
        <Container>
          <SectionHeader
            title="Patient Testimonials"
            subtitle="Real stories from real patients. We let our work speak for itself."
          />
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        {loading ? (
          <div className="py-12 text-center">
            <p className="text-slate-500">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-500">No testimonials found.</p>
          </div>
        ) : (
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
          {testimonials.map((t) => (
            <Card key={t.id} className="p-6">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="mt-4">
                <Quote className="h-6 w-6 text-teal-200" aria-hidden="true" />
                <p className="mt-2 text-fluid-sm text-slate-600">&ldquo;{t.review}&rdquo;</p>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-sm font-semibold text-slate-900">{t.patient_name}</p>
                {t.treatment && (
                  <p className="text-xs text-slate-500">{t.treatment}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
        )}
      </Container>
    </div>
  );
}
