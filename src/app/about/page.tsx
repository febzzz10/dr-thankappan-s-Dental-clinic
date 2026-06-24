'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Section';
import { Shield, Users, Heart, Award } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Safety First', desc: 'We follow the highest sterilization protocols and use premium materials for every procedure.' },
  { icon: Users, title: 'Patient-Centered', desc: 'Your comfort and satisfaction drive every decision we make. We listen before we treat.' },
  { icon: Heart, title: 'Compassionate Care', desc: 'We understand dental anxiety and go the extra mile to make you feel at ease.' },
  { icon: Award, title: 'Excellence', desc: 'Continuous learning and modern technology ensure you get the best possible care.' },
];

const pageEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: pageEase },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-white">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: pageEase }}
        className="bg-gradient-to-br from-teal-50 via-white to-teal-50/80 py-20 md:py-28"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
              About Us
            </span>
            <h1 className="mt-4 font-display text-fluid-h1 font-bold tracking-tight text-slate-900">
              Your Smile, Our Story
            </h1>
            <p className="mt-6 text-fluid-body text-pretty text-slate-600">
              Founded in 2010, Dr.Thankappan&apos;s Dental Clinic has been serving the Kochi community
              with compassion, expertise, and a commitment to excellence.
            </p>
          </div>
        </Container>
      </motion.section>

      <Container className="py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: pageEase }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="font-display text-3xl font-bold text-pretty text-slate-900">Our Mission</h2>
          <p className="mt-4 text-fluid-body text-pretty text-slate-600">
            To provide world-class dental care in a warm, welcoming environment. We believe everyone
            deserves a healthy, beautiful smile — and we&apos;re here to make that happen.
          </p>
          <p className="mt-4 text-fluid-body text-slate-600">
            Our clinic is equipped with state-of-the-art technology, including digital X-rays, intraoral
            cameras, and laser dentistry equipment. We invest in the latest techniques to ensure your
            treatment is effective, comfortable, and efficient.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid gap-8 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))]"
        >
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl border border-slate-100 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-display text-fluid-h4 font-bold text-pretty text-slate-900">{v.title}</h3>
                <p className="mt-2 text-fluid-sm text-slate-600">{v.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: pageEase }}
          className="mt-16 rounded-2xl bg-slate-900 p-8 text-white md:p-12"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold">Our Facility</h2>
            <p className="mt-4 text-fluid-sm text-slate-300">
              Our modern clinic features 6 treatment rooms, a dedicated sterilization area, digital
              imaging suite, and a comfortable waiting lounge. We maintain the highest standards of
              cleanliness and infection control.
            </p>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
