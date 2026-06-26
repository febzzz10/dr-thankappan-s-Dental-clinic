'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import type { Doctor } from '@/lib/api';

const pageEase = [0.16, 1, 0.3, 1] as const;

interface DoctorDetailContentProps {
  doctor: Doctor;
}

export function DoctorDetailContent({ doctor }: DoctorDetailContentProps) {
  return (
    <div className="min-h-dvh bg-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: pageEase }}
        className="bg-gradient-to-br from-teal-50 via-white to-teal-50/80 py-12 md:py-16"
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Link
              href="/doctors"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-teal-600"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Doctors
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: pageEase }}
            className="flex flex-col items-center gap-6 md:flex-row md:items-start"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.25 }}
              className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200 overflow-hidden"
            >
              {doctor.image_url ? (
                <Image src={doctor.image_url} alt={doctor.doctor_name} width={128} height={128} className="h-full w-full object-cover" unoptimized />
              ) : (
                <span className="text-5xl font-bold text-teal-600">
                  {doctor.doctor_name.charAt(0)}
                </span>
              )}
            </motion.div>
            <div className="text-center md:text-left">
              <h1 className="font-display text-fluid-h1 font-bold tracking-tight text-slate-900">
                {doctor.doctor_name}
              </h1>
              <p className="mt-1 text-base font-medium text-teal-600">
                {doctor.qualification}
              </p>
              <p className="mt-1 text-fluid-sm text-slate-600">{doctor.specialization}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                {doctor.experience_yrs ? (
                  <span className="rounded-full bg-teal-100 px-4 py-1.5 text-sm font-medium text-teal-700">
                    {doctor.experience_yrs} years experience
                  </span>
                ) : null}
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <BadgeCheck className="h-4 w-4 text-teal-600" aria-hidden="true" />
                  Verified Professional
                </span>
              </div>
            </div>
          </motion.div>
        </Container>
      </motion.div>

      <Container className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: pageEase }}
          className="mx-auto max-w-3xl"
        >
          {doctor.bio ? (
            <>
              <h2 className="font-display text-fluid-h3 font-bold text-slate-900">Biography</h2>
              <p className="mt-4 text-fluid-body leading-relaxed text-slate-600">
                {doctor.bio}
              </p>
            </>
          ) : (
            <p className="text-center text-slate-400">No biography available.</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <Link href="/book">
            <Button variant="primary" size="md">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Book Appointment
            </Button>
          </Link>
        </motion.div>
      </Container>
    </div>
  );
}
