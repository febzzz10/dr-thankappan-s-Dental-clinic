import type { Metadata } from 'next';
import TestimonialsContent from './page.client';

export const metadata: Metadata = {
  title: 'Patient Testimonials | Dr.Thankappan\'s Dental Clinic Kochi',
  description:
    'Read what our patients say about their experience at Dr.Thankappan\'s Dental Clinic in Kochi. Real reviews from real smiles.',
  openGraph: {
    title: 'Testimonials | Dr.Thankappan\'s Dental Clinic',
    description:
      'See why patients trust Dr.Thankappan\'s Dental Clinic for their dental care in Kochi.',
    url: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/testimonials',
  },
  alternates: {
    canonical: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/testimonials',
  },
};

export default function TestimonialsPage() {
  return <TestimonialsContent />;
}
