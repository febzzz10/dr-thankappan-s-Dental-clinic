'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PiCalendarBlank, PiChatCircle, PiShield, PiClock, PiSparkle, PiShieldCheck, PiUsers, PiSmiley } from 'react-icons/pi';
import { motion } from 'framer-motion';
import { getSettings } from '@/lib/api';
import { generateWhatsAppUrl } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const heroEase = [0.32, 0.72, 0, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: heroEase },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 40, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, delay: 0.3, ease: heroEase },
  },
};

export function HeroSection() {
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    getSettings().then((s) => {
      if (s.whatsapp_number) setWhatsappNumber(s.whatsapp_number);
    });
  }, []);

  const waUrl = generateWhatsAppUrl(
    whatsappNumber || '0',
    'Hi! I\'d like to book a dental appointment.'
  );

  return (
    <section className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-teal-50 via-white to-teal-50/80 hero-compact grain-overlay">
      <div className="hidden md:block absolute inset-0">
        <Image src="/images/debg.webp" alt="" fill className="object-cover" style={{ objectPosition: "center right" }} priority unoptimized />
      </div>
      <div className="md:hidden absolute inset-0">
        <Image src="/images/bgmobile.webp" alt="" fill className="object-cover" style={{ objectPosition: "center 25%" }} priority unoptimized />
      </div>
      <div className="hidden md:block absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.12),transparent_50%)]" />
      <div className="hidden md:block absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-400/5 blur-3xl" />
      <div className="hidden md:block absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-400/5 blur-3xl" />
      <div className="md:hidden absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-teal-50 via-white/95 to-white/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
          <Image src="/images/logo.png" alt="Dr.Thankappan's Dental Clinic" width={40} height={40} className="h-9 w-auto object-contain" priority />
          <div className="ml-2.5 leading-tight">
            <p className="font-display text-sm font-bold tracking-tight text-slate-800">Dr.Thankappan's</p>
            <p className="text-[10px] font-bold tracking-wider text-teal-600">DENTAL CLINIC</p>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto flex min-h-[90dvh] max-w-7xl flex-col items-center px-4 pb-16 pt-20 sm:px-6 lg:flex-row lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-center lg:text-left -mt-16 lg:-ml-32"
        >
          {/* Mobile-only hero content */}
          <div className="md:hidden w-full text-left pt-20">
            <motion.h1 variants={itemVariants} className="font-display text-fluid-hero font-extrabold tracking-tight text-pretty text-slate-900">
              Expert Care for
              <br />
              <span className="text-teal-600">a Healthier,</span>
              <br />
              <span className="text-teal-600">Brighter Smile</span>
            </motion.h1>
            <motion.div variants={itemVariants} className="mt-4 h-0.5 w-10 rounded-full bg-teal-500" />
            <motion.p variants={itemVariants} className="mt-5 max-w-xl text-fluid-body leading-relaxed text-slate-600">
              A Family Tradition of Dental Excellence.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <PiClock aria-hidden="true" className="h-3 w-3 text-teal-600" />
                Mon–Sat: 9 AM – 6 PM
              </span>
              <span className="flex items-center gap-1">
                <PiShield aria-hidden="true" className="h-3 w-3 text-teal-600" />
                100% Safe & Hygienic
              </span>
            </motion.div>
          </div>
          {/* Desktop/tablet hero content (unchanged) */}
          <div className="hidden md:block w-full">
            <motion.div variants={itemVariants} className="mb-6 inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
              Trusted by 10,000+ patients
            </motion.div>
            <motion.h1 variants={itemVariants} className="font-display text-fluid-hero font-extrabold tracking-tight text-pretty text-slate-900">
              Dr.Thankappan's
              <br />
              <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                Dental Clinic
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="mx-auto mt-4 max-w-xl text-lg font-medium text-teal-700 lg:mx-0">
              A Family Tradition of Dental Excellence
            </motion.p>
            <motion.p variants={itemVariants} className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
              Gentle care, advanced treatment and lasting results for you and your family.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 lg:justify-start">
              <span className="flex items-center gap-1.5">
                <PiClock aria-hidden="true" className="h-4 w-4 text-teal-600" />
                Mon–Sat: 9 AM – 6 PM
              </span>
              <span className="flex items-center gap-1.5">
                <PiShield aria-hidden="true" className="h-4 w-4 text-teal-600" />
                100% Safe & Hygienic
              </span>
            </motion.div>
          </div>
          {/* Mobile CTA buttons — side by side */}
          <motion.div variants={itemVariants} className="md:hidden mt-90 flex flex-row flex-nowrap items-center gap-6">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/book"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-teal-600 px-5 text-sm font-semibold text-white shadow-lg transition-[transform,opacity,color,background-color] hover:bg-teal-700 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <PiCalendarBlank aria-hidden="true" className="h-4 w-4" />
                Book Appointment
              </Link>
            </motion.div>
            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-[transform,opacity,color,background-color] hover:bg-slate-50 hover:shadow-md"
            >
              <PiChatCircle aria-hidden="true" className="h-4 w-4 text-green-500" />
              WhatsApp Us
            </motion.a>
          </motion.div>
          {/* Desktop/tablet CTA buttons — stacked (unchanged) */}
          <motion.div variants={itemVariants} className="hidden md:flex mt-8 flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="/book"
                className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-teal-600 px-8 text-base font-semibold text-white shadow-lg transition-[transform,opacity,color,background-color] hover:bg-teal-700 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
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
              className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-8 text-base font-semibold text-slate-700 shadow-sm transition-[transform,opacity,color,background-color] hover:bg-slate-50 hover:shadow-md focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
            >
              <PiChatCircle aria-hidden="true" className="h-5 w-5 text-green-500" />
              WhatsApp Us
            </motion.a>
          </motion.div>

          {/* Mobile floating card — Your Smile, Our Passion */}
          <motion.div variants={cardVariants} className="md:hidden mt-6 w-fit">
            <div className="rounded-2xl bg-white px-4 py-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200 shadow-md">
                  <Image src="/images/tooht.png" alt="" fill className="object-contain p-2.5" />
                  <PiSparkle aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 text-teal-500" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-slate-900">Your Smile,</p>
                  <p className="font-display text-sm font-bold text-teal-600">Our Passion</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: heroEase }}
          className="hidden md:block mt-12 flex-1 lg:mt-0"
        >
          <div className="relative flex h-[340px] w-full max-w-md items-center justify-center sm:h-[420px] lg:ml-86">
            {/* Decorative tooth emblem */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: heroEase }}
              className="relative z-10 flex items-center justify-center"
            >
              {/* Tooth icon */}
              <motion.div
                animate={{ rotate: [0, 4, 0, -4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex h-48 w-48 items-center justify-center rounded-full bg-white shadow-xl sm:h-52 sm:w-52"
              >
                <Image src="/images/tooth2.png" alt="" fill sizes="192px" loading="eager" className="object-contain p-1" />
              </motion.div>
            </motion.div>
            {/* Floating feature bar overlapping hero photo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5, ease: heroEase }}
              className="absolute -bottom-40 right-50 z-20 w-[250%] "
            >
              <div className="flex items-center justify-evenly rounded-2xl bg-white px-6 py-5 shadow-xl">
                {[
                  { icon: null, title: 'Expert Care', sub: 'Experienced dentists', isTooth: true },
                  { icon: PiShieldCheck, title: 'Advanced Technology', sub: 'Modern & safe treatment' },
                  { icon: PiUsers, title: 'Patient First', sub: 'Comfortable & friendly care' },
                  { icon: PiSmiley, title: '10k+ Patients', sub: 'Happy smiles delivered' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-center gap-4">
                      {i > 0 && <div className="mr-4 h-12 w-px bg-slate-200" />}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-50">
                        {item.isTooth ? (
                          <div className="relative h-6 w-6">
                            <Image src="/images/tooht.png" alt="" fill className="object-contain" />
                          </div>
                        ) : Icon ? (
                          <Icon className="h-6 w-6 text-teal-600" />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-600">{item.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
