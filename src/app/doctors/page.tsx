import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schemas';
import DoctorsContent from './page.client';

const baseUrl = 'https://dr-thankappan-s-dental-clinic-theta.vercel.app';

export const metadata: Metadata = {
  title: 'Meet Our Expert Dentists | Dental Team in Kochi',
  description:
    'Get to know the experienced dental team at Dr.Thankappan\'s Dental Clinic in Kochi. Skilled professionals dedicated to your oral health.',
  openGraph: {
    title: 'Meet Our Dentists | Dr.Thankappan\'s Dental Clinic',
    description:
      'Our experienced dental team in Kochi provides expert care in root canal, implants, braces, cleaning, and more.',
    url: `${baseUrl}/doctors`,
  },
  alternates: {
    canonical: `${baseUrl}/doctors`,
  },
};

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: baseUrl },
  { name: 'Our Doctors', url: `${baseUrl}/doctors` },
]);

export default function DoctorsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <DoctorsContent />
    </>
  );
}
