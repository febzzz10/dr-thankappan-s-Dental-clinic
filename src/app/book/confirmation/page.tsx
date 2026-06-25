import type { Metadata } from 'next';
import ConfirmationContentWrapper from './page.client';

export const metadata: Metadata = {
  title: 'Booking Confirmation | Dr.Thankappan\'s Dental Clinic',
  description:
    'Your appointment request has been submitted. The clinic will confirm via WhatsApp shortly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConfirmationPage() {
  return <ConfirmationContentWrapper />;
}
