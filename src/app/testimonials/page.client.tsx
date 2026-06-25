'use client';

import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { Container, SectionHeader } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { getTestimonials, Testimonial } from '@/lib/api';

function TestimonialsContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then((data) => setTestimonials(data.filter((t) => t.is_visible)))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh">
      <section className="bg-gradient-to-br from-teal-50/70 via-white to-teal-50/70 pt-20 pb-4 md:pt-28 md:pb-6">
        <Container>
          <SectionHeader
            as="h1"
            title="What Our Patients Say"
            subtitle="Real reviews from real patients. We take pride in every smile we help create."
            className="mb-4 md:mb-6"
          />
        </Container>
      </section>

      <Container className="pb-16 md:pb-24">
        {loading ? (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500">No testimonials yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
            {testimonials.map((t) => (
              <Card key={t.id} className="p-6">
                <Quote className="h-6 w-6 text-teal-200" aria-hidden="true" />
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{t.review}</p>
                <div className="mt-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < t.rating ? 'text-amber-400' : 'text-slate-200'}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {t.patient_name || 'Anonymous'}
                </p>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default TestimonialsContent;
