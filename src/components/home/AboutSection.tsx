'use client';

import Image from 'next/image';
import { PiSparkle } from 'react-icons/pi';
import { motion } from 'framer-motion';

const cardEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: cardEase },
  },
};

export function AboutSection() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="md:hidden bg-white px-4 py-14"
    >
      <motion.div variants={itemVariants} className="mx-auto flex max-w-xs flex-col items-center text-center">
        {/* Decorative divider */}
        <div className="flex items-center gap-3">
          <div className="h-px w-16 bg-teal-300" />
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-teal-50">
            <Image src="/images/tooht.png" alt="" width={16} height={16} className="object-contain" />
            <PiSparkle aria-hidden="true" className="absolute -right-1 -top-1 h-3 w-3 text-teal-500" />
          </div>
          <div className="h-px w-16 bg-teal-300" />
        </div>

        {/* Heading */}
        <h2 className="mt-5 font-display text-xl font-bold tracking-tight text-pretty text-slate-900">
          Dr.Thankappan&apos;s
        </h2>
        <h2 className="font-display text-xl font-bold tracking-tight text-pretty text-teal-600">
          Dental Clinic
        </h2>

        {/* Description */}
        <p className="mt-4 text-fluid-sm leading-relaxed text-slate-600">
          We are committed to providing personalized dental care with compassion and excellence. Your smile is our priority.
        </p>
      </motion.div>
    </motion.section>
  );
}
