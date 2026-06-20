'use client';

import Link from 'next/link';
import { PiCalendarBlank, PiChatCircle } from 'react-icons/pi';
import { motion } from 'framer-motion';
import { mockData } from '@/lib/api';
import { generateWhatsAppUrl } from '@/lib/utils';

export function CTABanner() {
  const settings = mockData.settings;
  const waUrl = generateWhatsAppUrl(
    settings.whatsapp_number,
    'Hi! I\'d like to book a dental appointment.'
  );

  return (
    <section className="bg-gradient-to-r from-teal-700 to-teal-800 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="font-display text-fluid-h2 font-bold text-white">
          Ready for a Healthier Smile?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-fluid-body text-teal-100">
          Book your appointment today and take the first step toward the smile you deserve.
          No referral needed. Same-day appointments available.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href="/book"
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-white px-6 text-sm font-semibold text-teal-700 shadow-sm transition-[transform,opacity,color,background-color] hover:shadow-md sm:w-auto"
            >
              <PiCalendarBlank aria-hidden="true" className="h-5 w-5" />
              Book Appointment
            </Link>
          </motion.div>
          <motion.a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border-2 border-white/30 px-6 text-sm font-semibold text-white transition-[transform,opacity,color,background-color] hover:border-white/50 sm:w-auto"
          >
            <PiChatCircle aria-hidden="true" className="h-5 w-5" />
            WhatsApp Us
          </motion.a>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-medium text-teal-200"
        >
          <span>ISO Certified</span>
          <span>NABH Accredited</span>
          <span>100% Sterilization</span>
          <span>10,000+ Happy Patients</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
