'use client';

import { motion } from 'framer-motion';

export function MarqueeStrip() {
  const treatments = [
    'Dental Cleaning', 'Root Canal', 'Braces & Aligners',
    'Teeth Whitening', 'Dental Implants', 'Cosmetic Dentistry',
    'Pediatric Care', 'Gum Treatment', 'Smile Makeover',
    'Veneers', 'Crowns & Bridges', 'Oral Surgery',
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="overflow-hidden border-y border-slate-100 bg-slate-50 py-5"
    >
      <div className="animate-marquee flex gap-16 whitespace-nowrap">
        {[...treatments, ...treatments].map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 text-base font-medium text-slate-600 sm:text-lg"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            {t}
          </span>
        ))}
      </div>
    </motion.section>
  );
}
