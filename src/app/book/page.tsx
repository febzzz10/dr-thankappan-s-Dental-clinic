import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container, SectionHeader } from '@/components/ui/Section';
import { GradientBackground } from '@/components/ui/gradient-background';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schemas';
import { BookingForm } from '@/components/booking/BookingForm';

const dentalSoftGradients = [
  'linear-gradient(135deg, #d9fbff 0%, #f8ffff 45%, #c7f4f1 100%)',
  'linear-gradient(135deg, #e6ffff 0%, #ffffff 45%, #bdeeea 100%)',
  'linear-gradient(135deg, #c9f7ff 0%, #f9ffff 50%, #d7fff8 100%)',
  'linear-gradient(135deg, #eaffff 0%, #f7ffff 45%, #b8ebe7 100%)',
  'linear-gradient(135deg, #d9fbff 0%, #f8ffff 45%, #c7f4f1 100%)',
];

export const metadata: Metadata = {
  title: 'Book a Dental Appointment Online | Dr.Thankappan\'s Kochi',
  description:
    'Schedule your dental appointment online at Dr.Thankappan\'s Dental Clinic in Kochi. Fast, easy booking with WhatsApp confirmation. Root canal, cleaning, implants & more.',
  openGraph: {
    title: 'Book Appointment | Dr.Thankappan\'s Dental Clinic',
    description:
      'Book your dental appointment online in 60 seconds. Choose your treatment, pick a time, and get confirmed via WhatsApp.',
    url: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/book',
  },
  alternates: {
    canonical: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/book',
  },
};

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app' },
  { name: 'Book Appointment', url: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/book' },
]);

function BookingPageContent() {
  return (
    <GradientBackground gradients={dentalSoftGradients} animationDuration={10} overlay={false} className="min-h-screen">
      <section className="bg-gradient-to-br from-teal-50/70 via-white to-teal-50/70 pt-20 pb-4 md:pt-28 md:pb-6">
        <Container>
          <SectionHeader
            as="h1"
            title="Book Your Appointment"
            subtitle="Fill in your details below and get your slot confirmed via WhatsApp. No account needed."
            className="mb-4 md:mb-6"
          />
        </Container>
      </section>

      <Container className="pb-24">
        <BookingForm />
      </Container>
    </GradientBackground>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
      </div>
    }>
      <JsonLd data={breadcrumbSchema} />
      <BookingPageContent />
    </Suspense>
  );
}
