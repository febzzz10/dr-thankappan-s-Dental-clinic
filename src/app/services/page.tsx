import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFAQSchema, getServiceSchema } from '@/lib/schemas';
import ServicesContent from './page.client';

const baseUrl = 'https://dr-thankappan-s-dental-clinic-theta.vercel.app';

export const metadata: Metadata = {
  title: 'Dental Services — Root Canal, Cleaning, Implants & Braces in Kochi',
  description:
    'Explore all dental services at Dr.Thankappan\'s Dental Clinic in Kochi: root canal treatment, dental cleaning, crowns & bridges, implants, braces & aligners, and teeth whitening.',
  openGraph: {
    title: 'Dental Services | Dr.Thankappan\'s Dental Clinic',
    description:
      'Root canal, dental cleaning, crowns & bridges, dental implants, braces & aligners, and teeth whitening — all in one trusted Kochi clinic.',
    url: `${baseUrl}/services`,
  },
  alternates: {
    canonical: `${baseUrl}/services`,
  },
};

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: baseUrl },
  { name: 'Dental Services', url: `${baseUrl}/services` },
]);

const serviceListSchema = getServiceSchema([
  { name: 'Root Canal Treatment', description: 'Painless root canal therapy to save infected teeth.', url: `${baseUrl}/services/root-canal` },
  { name: 'Dental Cleaning', description: 'Professional scaling and polishing for healthy gums and teeth.', url: `${baseUrl}/services/dental-cleaning` },
  { name: 'Crowns & Bridges', description: 'Restore damaged or missing teeth with custom crowns and bridges.', url: `${baseUrl}/services/crowns-bridges` },
  { name: 'Dental Implants', description: 'Permanent tooth replacement with titanium dental implants.', url: `${baseUrl}/services/dental-implants` },
  { name: 'Braces & Aligners', description: 'Straighten teeth with traditional braces or clear aligners.', url: `${baseUrl}/services/braces-aligners` },
  { name: 'Teeth Whitening', description: 'Professional teeth whitening for a brighter, more confident smile.', url: `${baseUrl}/services/teeth-whitening` },
]);

const faqSchema = getFAQSchema([
  { question: 'What dental services does Dr.Thankappan\'s clinic offer?', answer: 'We offer root canal treatment, dental cleaning, crowns & bridges, dental implants, braces & aligners, teeth whitening, and general dentistry.' },
  { question: 'Is root canal treatment painful?', answer: 'No. Root canal treatment is performed under local anesthesia. Patients typically experience minimal discomfort during and after the procedure.' },
  { question: 'How often should I visit the dentist?', answer: 'We recommend a check-up and professional cleaning every six months for optimal oral health.' },
  { question: 'Do you offer teeth whitening services?', answer: 'Yes, we offer professional teeth whitening treatments that are safe, effective, and provide noticeable results in a single session.' },
]);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceListSchema} />
      <JsonLd data={faqSchema} />
      <ServicesContent />
    </>
  );
}
