import type { Metadata } from 'next';
import ContactContent from './page.client';

export const metadata: Metadata = {
  title: 'Contact Us | Dr.Thankappan\'s Dental Clinic in Kochi',
  description:
    'Get in touch with Dr.Thankappan\'s Dental Clinic in Kochi. Call, WhatsApp, email, or visit our clinic. Book your appointment today.',
  openGraph: {
    title: 'Contact Dr.Thankappan\'s Dental Clinic | Kochi',
    description:
      'Reach Dr.Thankappan\'s Dental Clinic in Kochi by phone, WhatsApp, email, or visit us in person. We\'re here to help.',
    url: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/contact',
  },
  alternates: {
    canonical: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/contact',
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
