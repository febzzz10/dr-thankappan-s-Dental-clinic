'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PiArrowRight } from 'react-icons/pi';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { getServices } from '@/lib/api';
import type { Service } from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardEase = [0.16, 1, 0.3, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: cardEase },
  },
};

export function ServicesPreview() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then((res) => setServices(res.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <section className="bg-gradient-to-br from-[#d9fbff] via-[#f8ffff] to-[#c7f4f1] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
            Our Treatments
          </span>
          <h2 className="mt-4 font-display text-fluid-h2 font-bold tracking-tight text-pretty text-slate-900">
            Complete Dental Care Services
          </h2>
          <p className="mt-4 text-fluid-body text-slate-600">
            From preventive care to advanced procedures — we offer everything you need
            for a healthy, beautiful smile.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]"
        >
          {services.map((service) => (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="group h-full cursor-default p-6 transition-all hover:border-teal-200 hover:shadow-lg">
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
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="mt-12 text-center"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 px-8 py-3 text-sm font-semibold text-slate-700 transition-[transform,opacity,color] hover:bg-slate-50 hover:shadow-md active:scale-[0.97]"
          >
            View All Services
            <PiArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
