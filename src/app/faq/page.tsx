import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getFAQSchema } from '@/lib/schemas';
import FaqContent from './page.client';

const faqItems = [
  { question: 'How do I book a dental appointment?', answer: 'You can book an appointment online through our website in under 60 seconds. Select your preferred treatment, choose an available date and time, enter your details, and submit. The clinic will confirm your appointment via WhatsApp.' },
  { question: 'What dental services are available?', answer: 'We offer a full range of dental services including root canal treatment, dental cleaning and scaling, crowns and bridges, dental implants, braces and aligners, teeth whitening, and preventive care.' },
  { question: 'Is root canal treatment painful?', answer: 'No. Modern root canal treatment is performed under local anesthesia and is generally no more uncomfortable than getting a filling. Most patients report little to no pain during the procedure.' },
  { question: 'How often should I get dental cleaning?', answer: 'We recommend professional dental cleaning every 6 months. Regular cleanings help prevent cavities, gum disease, and maintain overall oral health.' },
  { question: 'Do you offer braces and aligners?', answer: 'Yes, we offer both traditional braces and clear aligners. Our dental team will assess your teeth and recommend the best option based on your needs and lifestyle.' },
  { question: 'Can I contact the clinic through WhatsApp?', answer: 'Yes, you can reach us on WhatsApp at +91 94471 21519. We use WhatsApp for appointment confirmations, reminders, and answering your questions.' },
  { question: 'What are your clinic working hours?', answer: 'We are open Monday to Friday from 9:00 AM to 6:00 PM and Saturday from 9:00 AM to 2:00 PM. The clinic is closed on Sunday.' },
];

export const metadata: Metadata = {
  title: 'FAQ — Dental Clinic Questions Answered | Dr.Thankappan\'s',
  description:
    'Frequently asked questions about dental treatments, appointments, pricing, and clinic policies at Dr.Thankappan\'s Dental Clinic in Kochi.',
  openGraph: {
    title: 'Dental FAQ | Dr.Thankappan\'s Dental Clinic',
    description:
      'Get answers to common questions about root canal, teeth cleaning, braces, implants, appointments, and more.',
    url: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/faq',
  },
  alternates: {
    canonical: 'https://dr-thankappan-s-dental-clinic-theta.vercel.app/faq',
  },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={getFAQSchema(faqItems)} />
      <FaqContent />
    </>
  );
}
