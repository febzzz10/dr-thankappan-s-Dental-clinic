'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import type { ElementType } from 'react';

const pageEase = [0.16, 1, 0.3, 1] as const;

interface ServiceDetailContentProps {
  service: {
    slug: string;
    service_name: string;
    short_desc: string;
    description: string | null;
    price_from: number | null;
    icon: string | null;
  };
  Icon: ElementType;
  related: Array<{
    id: number;
    slug: string;
    service_name: string;
    short_desc: string;
    icon: string | null;
  }>;
}

export function ServiceDetailContent({ service, Icon, related }: ServiceDetailContentProps) {
  return (
    <div className="min-h-dvh bg-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: pageEase }}
        className="bg-gradient-to-br from-teal-50 via-white to-teal-50/80 py-12 md:py-16"
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              href="/services"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-teal-600"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Services
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: pageEase }}
            className="flex items-start gap-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.25 }}
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-600"
            >
              <Icon className="h-8 w-8" aria-hidden="true" />
            </motion.div>
            <div>
              <h1 className="font-display text-fluid-h1 font-bold tracking-tight text-slate-900">
                {service.service_name}
              </h1>
              <p className="mt-2 max-w-2xl text-base text-slate-600">
                {service.short_desc}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {service.price_from && (
                  <span className="rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-700">
                    Starting from ₹{service.price_from.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </Container>
      </motion.div>

      <Container className="py-16">
        {service.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: pageEase }}
            className="mx-auto max-w-3xl"
          >
            <h2 className="font-display text-fluid-h3 font-bold text-slate-900">About This Treatment</h2>
            <p className="mt-4 text-fluid-body text-slate-600">
              {service.description}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-12 max-w-3xl"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link href={`/book?treatment=${service.slug}`}>
              <Button variant="primary" size="lg">
                <Calendar className="h-5 w-5" aria-hidden="true" />
                Book {service.service_name}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Container>

      {related.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50 py-16">
          <Container>
            <h2 className="mb-8 font-display text-fluid-h3 font-bold text-slate-900">
              Related Services
            </h2>
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
              {related.map((r, i) => {
                return (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: pageEase }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={`/services/${r.slug}`}>
                      <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 transition-[transform,opacity] hover:border-teal-200 hover:shadow-md">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-display text-fluid-h4 font-bold text-slate-900">
                            {r.service_name}
                          </h3>
                          <p className="mt-1 text-fluid-sm text-slate-600">{r.short_desc}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}
