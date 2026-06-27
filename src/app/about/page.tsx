import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema } from '@/lib/schemas';
import AboutContent from './page.client';

const baseUrl = 'https://drthankappandental.com';

export const metadata: Metadata = {
  title: 'About Us | Dr.Thankappan\'s Dental Clinic — Kochi\'s Trusted Dentist Since 1997',
  description:
    'A legacy of smiles since 1997. Dr.Thankappan\'s Dental Clinic was founded by my father and is now proudly run by Dr. Nimisha Thankappan, continuing a family tradition of dental excellence in Kochi.',
  openGraph: {
    title: 'About Our Dental Clinic in Kochi | Dr.Thankappan\'s',
    description:
      'A legacy of smiles since 1997. Founded by my father and now run by Dr. Nimisha Thankappan, our clinic continues a family tradition of dental excellence in Kochi.',
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
