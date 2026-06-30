import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { Container } from '@/components/ui/Section';
import { getBreadcrumbSchema, getFAQSchema, getServiceSchema } from '@/lib/schemas';
import ServicesContent from './page.client';

const baseUrl = 'https://www.drthankappandentalclinic.com';

export const metadata: Metadata = {
  title: 'Dental Services — Root Canal, Cleaning, Implants & Braces in Kochi',
  description:
    'Explore all dental services at Dr.Thankappan\'s Dental Clinic in Kochi: laser dentistry, root canal treatment, dental cleaning, crowns & bridges, implants, braces & aligners, teeth whitening, smile correction, and gum depigmentation.',
  openGraph: {
    title: 'Dental Services | Dr.Thankappan\'s Dental Clinic',
    description:
      'Laser dentistry, root canal, dental cleaning, crowns & bridges, dental implants, braces & aligners, teeth whitening, smile correction, and gum depigmentation — all in one trusted Kochi clinic.',
    url: '/services',
  },
  alternates: {
    canonical: '/services',
  },
};

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: baseUrl },
  { name: 'Dental Services', url: '/services' },
]);

const serviceListSchema = getServiceSchema([
  { name: 'Root Canal Treatment', description: 'Painless root canal therapy to save infected teeth.', url: `${baseUrl}/services/root-canal-kochi` },
  { name: 'Dental Cleaning', description: 'Professional scaling and polishing for healthy gums and teeth.', url: `${baseUrl}/services/dental-cleaning-kochi` },
  { name: 'Crowns & Bridges', description: 'Restore damaged or missing teeth with custom crowns and bridges.', url: `${baseUrl}/services/crowns-bridges-kochi` },
  { name: 'Dental Implants', description: 'Permanent tooth replacement with titanium dental implants.', url: `${baseUrl}/services/dental-implants-kochi` },
  { name: 'Braces & Aligners', description: 'Straighten teeth with traditional braces or clear aligners.', url: `${baseUrl}/services/braces-aligners-kochi` },
  { name: 'Teeth Whitening', description: 'Professional teeth whitening for a brighter, more confident smile.', url: `${baseUrl}/services/teeth-whitening-kochi` },
]);

const faqSchema = getFAQSchema([
  { question: 'What dental services does Dr.Thankappan\'s clinic offer?', answer: 'We offer laser dentistry, teeth whitening, gum depigmentation, gum recontouring, smile correction, clear aligners, aesthetic restorations, root canal treatment, dental cleaning, crowns and bridges, dental implants, braces and aligners, and jaw pain relief.' },
  { question: 'Which is an advanced dental clinic in Kochi?', answer: 'Dr. Thankappan\'s Dental Clinic is a trusted dental clinic in Kochi offering modern treatment options including laser-assisted procedures, teeth whitening, smile correction, clear aligners, and aesthetic restorations.' },
  { question: 'Is root canal treatment painful?', answer: 'No. Root canal treatment is performed under local anesthesia. Patients typically experience minimal discomfort during and after the procedure.' },
  { question: 'How often should I visit the dentist?', answer: 'We recommend a check-up and professional cleaning every six months for optimal oral health.' },
  { question: 'Do you offer teeth whitening services?', answer: 'Yes, we offer professional teeth whitening treatments that are safe, effective, and provide noticeable results.' },
  { question: 'Does the clinic offer laser dentistry?', answer: 'Yes, the clinic provides laser-assisted dental procedures for various treatments including gum recontouring, gum depigmentation, and certain soft tissue procedures.' },
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
