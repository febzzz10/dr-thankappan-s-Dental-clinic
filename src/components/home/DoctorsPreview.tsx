'use client';

import Link from 'next/link';
import { PiArrowRight } from 'react-icons/pi';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { mockData } from '@/lib/mock-data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export function DoctorsPreview() {
  const doctors = mockData.doctors.slice(0, 3);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: cardEase }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
            Our Team
          </span>
          <h2 className="mt-4 font-display text-fluid-h2 font-bold tracking-tight text-pretty text-slate-900">
            Meet Our Expert Doctors
          </h2>
          <p className="mt-4 text-fluid-body text-slate-600">
            Highly qualified and experienced dental professionals dedicated to your care.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]"
        >
          {doctors.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden text-center">
                <div className="bg-gradient-to-b from-teal-50 to-white p-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.1 + 0.2 }}
                    className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200"
                  >
                    <span className="text-4xl font-bold text-teal-600">
                      {doctor.doctor_name.charAt(0)}
                    </span>
                  </motion.div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {doctor.doctor_name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-teal-600">
                    {doctor.qualification}
                  </p>
                </div>
                <div className="p-6 pt-4">
                  <p className="mb-1 text-sm text-slate-600">{doctor.specialization}</p>
                  <p className="text-sm text-slate-400">{doctor.experience_yrs} years experience</p>
                  <Link
                    href={`/doctors/${doctor.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-600 transition-[transform,opacity,color] hover:gap-2"
                  >
                    View Profile
                    <PiArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 px-8 py-3 text-sm font-semibold text-slate-700 transition-[transform,opacity,color] hover:bg-slate-50 hover:shadow-md active:scale-[0.97]"
          >
            Meet All Doctors
            <PiArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
