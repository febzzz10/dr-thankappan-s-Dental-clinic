'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Container, SectionHeader } from '@/components/ui/Section';
import { getServices } from '@/lib/api';
import type { Service } from '@/lib/api';

const cardEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: cardEase },
  },
};

const PLACEHOLDER_SERVICES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  service_name: 'Dental Service Name',
  short_desc: 'A detailed description of what this dental service entails and how it benefits patients.',
  slug: '',
  is_active: 1,
  sort_order: 0,
}));

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load services'))
      .finally(() => setLoading(false));
  }, []);

  const displayed = loading ? PLACEHOLDER_SERVICES : services;

  return (
    <phantom-ui loading={loading}>
      <div className="min-h-dvh bg-white">
        <section className="bg-gradient-to-br from-teal-50 via-white to-teal-50/80 pt-20 pb-4 md:pt-28 md:pb-6">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: cardEase }}
            >
              <SectionHeader
                title="Our Dental Services"
                subtitle="Comprehensive dental care tailored to your needs. From routine checkups to advanced cosmetic procedures."
                className="mb-4 md:mb-6"
              />
            </motion.div>
          </Container>
        </section>

        <Container className="pt-0 pb-16 md:pt-0 md:pb-24">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
          )}
          <motion.div
            key={loading ? 'loading' : 'loaded'}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]"
          >
            {displayed.map((service) => (
              <motion.div key={service.id} variants={cardVariants} initial="hidden" animate="visible" whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
                <Card className="group h-full cursor-default p-6 transition-[transform,opacity] hover:border-teal-200 hover:shadow-lg">
                  <h3 className="mb-2 font-display text-fluid-h4 font-bold text-slate-900">
                    {service.service_name}
                  </h3>
                  <p className="mb-4 text-fluid-sm text-slate-600">
                    {service.short_desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: cardEase }}
            className="mt-16 rounded-2xl bg-teal-50 p-8 text-center md:p-12"
          >
            <h3 className="font-display text-fluid-h3 font-bold text-slate-900">
              Not Sure Which Treatment You Need?
            </h3>
            <p className="mt-2 text-slate-500">
              Book a consultation and our experts will guide you to the right solution.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-6 inline-block">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-[transform,opacity] hover:bg-teal-700 hover:shadow-md"
              >
                Book a Free Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </phantom-ui>
  );
}
