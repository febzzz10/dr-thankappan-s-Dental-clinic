'use client';

import { motion } from 'framer-motion';
import { PiSmiley, PiUsers, PiTrophy, PiHeart } from 'react-icons/pi';

const stats = [
  { icon: PiUsers, value: '10,000+', label: 'Happy Patients' },
  { icon: PiTrophy, value: '30+', label: 'Years Experience' },
  { icon: PiSmiley, value: '50,000+', label: 'Treatments Done' },
  { icon: PiHeart, value: '4.9/5', label: 'Patient Rating' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const statEase = [0.16, 1, 0.3, 1] as const;

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: statEase },
  },
};

export function StatsSection() {
  return (
    <section className="bg-teal-600 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))]"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={statVariants}
                className="text-center text-white"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur transition-colors hover:bg-white/20"
                >
                  <Icon aria-hidden="true" className="h-7 w-7" />
                </motion.div>
                <p className="font-display text-4xl font-bold tabular-nums">{stat.value}</p>
                <p className="mt-1 text-sm text-teal-100">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
