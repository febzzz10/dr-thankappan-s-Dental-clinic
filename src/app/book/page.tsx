'use client';

import { Suspense } from 'react';
import { Container, SectionHeader } from '@/components/ui/Section';
import { BookingForm } from '@/components/booking/BookingForm';

function BookingPageContent() {
  return (
    <div className="min-h-dvh bg-white">
      <section className="bg-gradient-to-br from-teal-50 via-white to-teal-50/80 py-20 md:py-28">
        <Container>
          <SectionHeader
            title="Book Your Appointment"
            subtitle="Fill in your details below and get your slot confirmed via WhatsApp. No account needed."
          />
        </Container>
      </section>

      <Container className="pb-24">
        <BookingForm />
      </Container>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}
