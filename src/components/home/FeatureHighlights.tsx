'use client';

import { PiUserCircle, PiShieldCheck, PiUsers, PiSmiley } from 'react-icons/pi';
import { motion } from 'framer-motion';

const cardEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: PiUserCircle,
    title: 'Expert Doctors',
    sub: 'Highly qualified specialists',
  },
  {
    icon: PiShieldCheck,
    title: 'Advanced Technology',
    sub: 'Modern equipment & techniques',
  },
  {
    icon: PiUsers,
    title: 'Patient First',
    sub: 'Comfortable & friendly care',
  },
  {
    icon: PiSmiley,
    title: '10k+ Patients',
    sub: 'Happy smiles delivered',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: cardEase },
  },
};

export function FeatureHighlights() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="md:hidden bg-white px-4 py-10"
    >
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-x-6 gap-y-8">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <motion.div key={f.title} variants={itemVariants} className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </div>
              <h3 className="mt-3 font-display text-sm font-bold text-pretty text-slate-900">{f.title}</h3>
              <p className="mt-0.5 text-xs text-slate-600">{f.sub}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
