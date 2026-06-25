import type { Metadata } from 'next';
import ContactContent from './page.client';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFAQSchema } from '@/lib/schemas';

const baseUrl = 'https://drthankappandental.com';

export const metadata: Metadata = {
  title: 'Contact Us | Dr.Thankappan\'s Dental Clinic in Kochi',
  description:
    'Get in touch with Dr.Thankappan\'s Dental Clinic in Kochi. Call +91 94471 21519, WhatsApp, email, or visit our clinic. Book your appointment today.',
  openGraph: {
    title: 'Contact Dr.Thankappan\'s Dental Clinic | Kochi',
    description:
      'Reach Dr.Thankappan\'s Dental Clinic in Kochi by phone, WhatsApp, email, or visit us in person. We\'re here to help.',
    url: `${baseUrl}/contact`,
  },
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
};

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: baseUrl },
  { name: 'Contact Us', url: `${baseUrl}/contact` },
]);

const faqSchema = getFAQSchema([
  { question: 'How can I contact Dr. Thankappan\'s Dental Clinic?', answer: 'You can call us at +91 94471 21519, send a message on WhatsApp, email us at drthankappandentalclinic@gmail.com, or visit our clinic in Kochi, Kerala.' },
  { question: 'Can I book a dental appointment online?', answer: 'Yes, you can book an appointment online through the clinic website. Select your preferred treatment, choose an available date and time, and submit your details. The clinic will confirm via WhatsApp.' },
  { question: 'What are the clinic working hours?', answer: 'The clinic is open Monday to Friday from 9:00 AM to 6:00 PM and Saturday from 9:00 AM to 2:00 PM. Sunday is closed.' },
  { question: 'Do you accept walk-in patients?', answer: 'While appointments are recommended, walk-in patients are welcome. Please call ahead to check availability.' },
]);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <ContactContent />
    </>
  );
}
