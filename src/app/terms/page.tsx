import type { Metadata } from 'next';
import { Container } from '@/components/ui/Section';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Dr.Thankappan\'s Dental Clinic',
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-white py-20 md:py-28">
      <Container>
        <Link href="/" className="mb-8 inline-flex text-sm text-teal-600 hover:text-teal-700">&larr; Back to Home</Link>
        <h1 className="font-display text-fluid-h1 font-bold tracking-tight text-slate-900">Terms of Service</h1>
        <div className="prose prose-slate mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600">
          <p>By using Dr.Thankappan&apos;s Dental Clinic website and services, you agree to the following terms.</p>
          <h2 className="font-display text-fluid-h3 font-bold text-slate-900">Appointments</h2>
          <p>Appointment requests are subject to availability. We require 24 hours notice for cancellations. Late cancellations may result in a fee.</p>
          <h2 className="font-display text-fluid-h3 font-bold text-slate-900">Medical Information</h2>
          <p>You are responsible for providing accurate medical history and insurance information. Services are tailored based on the information you provide.</p>
          <h2 className="font-display text-fluid-h3 font-bold text-slate-900">Website Use</h2>
          <p>This website is for informational purposes and does not constitute medical advice. Always consult with a qualified dentist for diagnosis and treatment.</p>
          <h2 className="font-display text-fluid-h3 font-bold text-slate-900">Changes</h2>
          <p>We reserve the right to update these terms. Continued use of our services constitutes acceptance of any changes.</p>
        </div>
      </Container>
    </div>
  );
}
