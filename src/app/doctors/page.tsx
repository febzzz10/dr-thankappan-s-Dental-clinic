'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Container, SectionHeader } from '@/components/ui/Section';
import { mockData } from '@/lib/api';

const cardEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

export default function DoctorsPage() {
  const doctors = mockData.doctors;

  return (
    <div className="min-h-dvh bg-white">
      <section className="bg-gradient-to-br from-teal-50 via-white to-teal-50/80 py-20 md:py-28">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: cardEase }}
          >
            <SectionHeader
              title="Meet Our Team"
              subtitle="Our experienced and caring dental professionals are committed to giving you the best possible care."
            />
          </motion.div>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]"
        >
          {doctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/doctors/${doctor.slug}`}>
                <Card className="h-full overflow-hidden text-center transition-all hover:shadow-lg">
                  <div className="bg-gradient-to-b from-teal-50 to-white p-6 pb-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200"
                    >
                      <span className="text-3xl font-bold text-teal-600">
                        {doctor.doctor_name.charAt(0)}
                      </span>
                    </motion.div>
                    <h3 className="font-display text-fluid-h4 font-bold text-slate-900">
                      {doctor.doctor_name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-teal-600">
                      {doctor.qualification}
                    </p>
                  </div>
                  <div className="p-6 pt-4">
                    <p className="mb-1 text-fluid-sm text-slate-600">{doctor.specialization}</p>
                    <p className="text-sm text-slate-400">{doctor.experience_yrs} years experience</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-600 transition-all hover:gap-2">
                      View Profile
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
