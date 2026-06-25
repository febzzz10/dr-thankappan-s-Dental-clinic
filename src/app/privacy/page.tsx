import type { Metadata } from 'next';
import { Container } from '@/components/ui/Section';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dr.Thankappan\'s Dental Clinic',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-white py-20 md:py-28">
      <Container>
        <Link href="/" className="mb-8 inline-flex text-sm text-teal-600 hover:text-teal-700">&larr; Back to Home</Link>
        <h1 className="font-display text-fluid-h1 font-bold tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Last updated: {new Date().getFullYear()}</p>
        <div className="prose prose-slate mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600">
          <p>Dr.Thankappan&apos;s Dental Clinic respects your privacy. This policy explains how we collect, use, and protect your personal information.</p>
          <h2 className="font-display text-fluid-h3 font-bold text-slate-900">Information We Collect</h2>
          <p>We collect information you provide when booking appointments, including your name, phone number, email address, and medical history relevant to your dental care.</p>
          <h2 className="font-display text-fluid-h3 font-bold text-slate-900">How We Use Your Information</h2>
          <p>Your information is used solely to provide dental care services, schedule appointments, and communicate with you about your treatment. We do not share your data with third parties for marketing purposes.</p>
          <h2 className="font-display text-fluid-h3 font-bold text-slate-900">Data Protection</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
          <h2 className="font-display text-fluid-h3 font-bold text-slate-900">Contact</h2>
          <p>For questions about this policy, contact us at <a href="mailto:drthankappandentalclinic@gmail.com" className="text-teal-600 hover:underline">drthankappandentalclinic@gmail.com</a>.</p>
        </div>
      </Container>
    </div>
  );
}
