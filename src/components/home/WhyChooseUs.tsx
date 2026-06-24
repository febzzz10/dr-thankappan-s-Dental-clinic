'use client';

import { PiShield, PiUsers, PiClock, PiThumbsUp } from 'react-icons/pi';
import { motion } from 'framer-motion';

const features = [
  {
    icon: PiShield,
    title: 'Sterilized & Safe',
    description:
      'We follow the highest sterilization standards with autoclave equipment for your complete safety.',
  },
  {
    icon: PiUsers,
    title: 'Expert Team',
    description:
      'Our team of experienced dentists and specialists stay updated with the latest techniques.',
  },
  {
    icon: PiClock,
    title: 'Flexible Hours',
    description:
      'Early morning and evening appointments available. Same-day emergency appointments welcomed.',
  },
  {
    icon: PiThumbsUp,
    title: 'Pain-Free Treatment',
    description:
      'Modern anesthesia and gentle techniques ensure a comfortable, pain-free experience.',
  },
];

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

export function WhyChooseUs() {
  return (
    <section className="bg-teal-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: cardEase }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
            Why Dr.Thankappan&apos;s Dental Clinic
          </span>
          <h2 className="mt-4 font-display text-fluid-h2 font-bold tracking-tight text-pretty text-slate-900">
            Why Patients Choose Us
          </h2>
          <p className="mt-4 text-fluid-body text-slate-600">
            We combine expertise with compassion to deliver the best dental experience
            in Kochi.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))]"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600"
                >
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </motion.div>
                <h3 className="mb-2 font-display text-fluid-h4 font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-fluid-sm text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
