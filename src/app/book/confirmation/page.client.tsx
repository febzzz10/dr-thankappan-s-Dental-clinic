'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, MessageCircle, Calendar, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Section';
import { formatDate, formatTime } from '@/lib/utils';

function ConfirmationContent() {
  const params = useSearchParams();
  const ref = params.get('ref');
  const waUrl = params.get('wa');
  const name = params.get('name');
  const date = params.get('date');
  const time = params.get('time');
  const treatment = params.get('treatment');
  const phone = params.get('phone');

  return (
    <div className="min-h-dvh bg-gradient-to-br from-teal-50 via-white to-teal-50/80">
      <Container className="flex min-h-[80dvh] items-center justify-center py-16">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
            <CheckCircle className="h-10 w-10 text-teal-600" aria-hidden="true" />
          </div>
          <h1 className="font-display text-fluid-h1 font-bold text-slate-900">
            Booking Submitted!
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Your appointment request has been received. The clinic will confirm via WhatsApp shortly.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Booking Ref
                </span>
                <span className="font-mono text-sm font-bold text-teal-700" data-testid="booking-ref">
                  {ref}
                </span>
              </div>
              {name && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Patient</span>
                  <span className="font-medium text-slate-900">{name}</span>
                </div>
              )}
              {treatment && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Treatment</span>
                  <span className="font-medium text-slate-900">{treatment}</span>
                </div>
              )}
              {date && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium text-slate-900">{formatDate(date)}</span>
                </div>
              )}
              {time && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Time</span>
                  <span className="font-medium text-slate-900">{formatTime(time)}</span>
                </div>
              )}
              {phone && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-medium text-slate-900">{phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Next Step: Notify the Clinic
            </p>
            <a
              href={waUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="whatsapp-btn"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-green-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md active:scale-[0.97]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Notify Clinic on WhatsApp
            </a>
            <p className="text-xs text-slate-400">
              Your appointment is <strong>pending</strong>. The clinic will confirm via WhatsApp shortly.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/book"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.97]"
            >
              <Calendar className="h-4 w-4" />
              Book Another Appointment
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-teal-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ConfirmationContentWrapper() {
  return (
    <Suspense fallback={
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
