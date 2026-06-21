'use client';

import { PiStar, PiCaretLeft, PiCaretRight, PiQuotes } from 'react-icons/pi';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockData } from '@/lib/mock-data';

export function TestimonialsSection() {
  const testimonials = mockData.testimonials.filter(t => t.is_visible);
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1)), [testimonials.length]);
  const next = useCallback(() => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1)), [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <section className="bg-gradient-to-br from-teal-50 to-teal-50/80 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
            Testimonials
          </span>
          <h2 className="mt-4 font-display text-fluid-h2 font-bold tracking-tight text-slate-900">
            What Our Patients Say
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="relative rounded-2xl bg-white p-8 shadow-md sm:p-12">
            <PiQuotes aria-hidden="true" className="absolute right-8 top-8 h-12 w-12 text-teal-100" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                className="space-y-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <PiStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-slate-700">&ldquo;{t.review}&rdquo;</p>
                <div>
                  <p className="font-semibold text-slate-900">{t.patient_name}</p>
                  <p className="text-fluid-sm text-slate-600">{t.treatment}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-[width,background-color] focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
                      i === current ? 'w-6 bg-teal-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={prev}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label="Previous testimonial"
                >
                  <PiCaretLeft className="h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={next}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label="Next testimonial"
                >
                  <PiCaretRight className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
