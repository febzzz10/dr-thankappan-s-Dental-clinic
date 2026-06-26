'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Container, SectionHeader } from '@/components/ui/Section';
import { GradientBackground } from '@/components/ui/gradient-background';
import { getDoctors } from '@/lib/api';
import type { Doctor } from '@/lib/api';

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

const dentalSoftGradients = [
  'linear-gradient(135deg, #d9fbff 0%, #f8ffff 45%, #c7f4f1 100%)',
  'linear-gradient(135deg, #e6ffff 0%, #ffffff 45%, #bdeeea 100%)',
  'linear-gradient(135deg, #c9f7ff 0%, #f9ffff 50%, #d7fff8 100%)',
  'linear-gradient(135deg, #eaffff 0%, #f7ffff 45%, #b8ebe7 100%)',
  'linear-gradient(135deg, #d9fbff 0%, #f8ffff 45%, #c7f4f1 100%)',
];

const PLACEHOLDER_DOCTORS = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  slug: '',
  doctor_name: 'Dr. Full Name',
  qualification: 'BDS, MDS',
  specialization: 'Specialization Area',
  experience_yrs: 10,
  image_url: null,
  is_active: 1,
  sort_order: 0,
}));

function DoctorsContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .finally(() => setLoading(false));
  }, []);

  const displayed = loading ? PLACEHOLDER_DOCTORS : doctors;

  return (
    <phantom-ui loading={loading}>
      <GradientBackground gradients={dentalSoftGradients} animationDuration={10} overlay={false} className="min-h-screen">
        <section className="bg-gradient-to-br from-teal-50/70 via-white to-teal-50/70 pt-20 pb-4 md:pt-28 md:pb-6">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: cardEase }}
            >
              <SectionHeader
                as="h1"
                title="Meet Our Team"
                subtitle="Our experienced and caring dental professionals are committed to giving you the best possible care."
                className="mb-4 md:mb-6"
              />
            </motion.div>
          </Container>
        </section>

        <Container className="pt-0 pb-16 md:pt-0 md:pb-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]"
          >
            {displayed.map((doctor) => (
              <motion.div
                key={doctor.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {!loading && doctor.slug ? (
                  <Link href={`/doctors/${doctor.slug}`}>
                    <Card className="h-full overflow-hidden text-center transition-all hover:shadow-lg">
                      <div className="bg-gradient-to-b from-teal-50 to-white p-6 pb-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200 overflow-hidden"
                        >
                          {doctor.image_url ? (
                            <Image src={doctor.image_url} alt={doctor.doctor_name} width={96} height={96} className="h-full w-full object-cover" unoptimized />
                          ) : (
                            <span className="text-3xl font-bold text-teal-600">
                              {doctor.doctor_name.charAt(0)}
                            </span>
                          )}
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
                ) : (
                  <Card className="h-full overflow-hidden text-center transition-all hover:shadow-lg">
                    <div className="bg-gradient-to-b from-teal-50 to-white p-6 pb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200 overflow-hidden"
                      >
                        {doctor.image_url ? (
                          <Image src={doctor.image_url} alt={doctor.doctor_name} width={96} height={96} className="h-full w-full object-cover" unoptimized />
                        ) : (
                          <span className="text-3xl font-bold text-teal-600">
                            {doctor.doctor_name.charAt(0)}
                          </span>
                        )}
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
                )}
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </GradientBackground>
    </phantom-ui>
  );
}

export default DoctorsContent;
