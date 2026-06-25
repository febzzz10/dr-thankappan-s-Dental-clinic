import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schemas';
import AboutContent from './page.client';

const baseUrl = 'https://dr-thankappan-s-dental-clinic-theta.vercel.app';

export const metadata: Metadata = {
  title: 'About Us | Dr.Thankappan\'s Dental Clinic — Kochi\'s Trusted Dentist Since 1997',
  description:
    'Learn about Dr.Thankappan\'s Dental Clinic in Kochi. Family-owned since 1997, we provide compassionate, high-quality dental care in a modern, hygienic facility.',
  openGraph: {
    title: 'About Our Dental Clinic in Kochi | Dr.Thankappan\'s',
    description:
      'Founded in 1997, Dr.Thankappan\'s Dental Clinic has been serving Kochi with world-class dental care. Meet our team and tour our facility.',
    url: `${baseUrl}/about`,
  },
  alternates: {
    canonical: `${baseUrl}/about`,
  },
};

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: baseUrl },
  { name: 'About Us', url: `${baseUrl}/about` },
]);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <AboutContent />
    </>
  );
}
