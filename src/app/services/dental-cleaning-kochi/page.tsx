import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Section';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFAQSchema } from '@/lib/schemas';

const baseUrl = 'https://www.drthankappandentalclinic.com';

export const metadata: Metadata = {
  title: 'Dental Cleaning in Kochi | Professional Teeth Cleaning & Scaling',
  description: 'Dr. Thankappan\'s Dental Clinic offers professional dental cleaning in Kochi. Regular scaling and polishing for healthy gums and teeth.',
  openGraph: {
    title: 'Dental Cleaning in Kochi | Dr. Thankappan\'s Dental Clinic',
    description: 'Professional dental cleaning and scaling in Kochi for healthy gums and fresh breath.',
    url: '/services/dental-cleaning-kochi',
  },
  alternates: {
    canonical: '/services/dental-cleaning-kochi',
  },
};

const faqs = [
  { question: 'How often should I get dental cleaning?', answer: 'We recommend professional dental cleaning every six months for optimal oral health. Your dentist may suggest more frequent visits depending on your oral health condition.' },
  { question: 'Is dental cleaning painful?', answer: 'Most patients experience minimal discomfort during dental cleaning. Any sensitivity is usually temporary and subsides within a few hours.' },
];

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: baseUrl },
  { name: 'Dental Cleaning in Kochi', url: '/services/dental-cleaning-kochi' },
]);

const faqSchema = getFAQSchema(faqs);

export default function ServicePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <div className="min-h-dvh">
        <section className="bg-gradient-to-br from-teal-50/70 via-white to-teal-50/70 pt-20 pb-4 md:pt-28 md:pb-6">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
                Preventive Dentistry
              </span>
              <h1 className="mt-4 font-display text-fluid-h1 font-bold tracking-tight text-slate-900">
                Dental Cleaning in Kochi
              </h1>
              <p className="mt-6 text-fluid-body text-pretty text-slate-600">
                Dr. Thankappan's Dental Clinic offers professional dental cleaning and scaling in Kochi for patients who want healthy gums, fresh breath, and a clean smile.
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">What is Dental Cleaning?</h2>
            <p className="mt-4 text-fluid-body text-pretty text-slate-600">
              Dental cleaning, also known as scaling and polishing, is a professional procedure to remove plaque, tartar, and stains from teeth. It helps prevent cavities, gum disease, and maintains overall oral health. Dentists recommend cleaning every six months.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Benefits</h2>
            <ul className="mt-4 space-y-3 text-fluid-body text-slate-600">
              <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Removes plaque and tartar buildup</li>
              <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Prevents cavities and gum disease</li>
              <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Freshens breath and brightens smile</li>
              <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Recommended every 6 months for optimal oral health</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Who Needs This Treatment?</h2>
            <p className="mt-4 text-fluid-body text-pretty text-slate-600">
              Everyone benefits from regular dental cleaning. Patients with plaque buildup, bad breath, bleeding gums, or those who haven't visited a dentist in over six months should schedule a professional cleaning.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm open:shadow-md transition-shadow">
                  <summary className="cursor-pointer list-none font-display text-base font-semibold text-slate-900">
                    <div className="flex items-center justify-between">
                      <span>{faq.question}</span>
                      <span className="shrink-0 ml-4 text-teal-600 transition-transform group-open:rotate-180">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Book Your Appointment</h2>
            <p className="mt-4 text-fluid-body text-slate-600">
              Ready to get started? Schedule a consultation with our dental team.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/book" className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md">
                Book Appointment
              </Link>
              <a href="https://wa.me/919447121519" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md">
                WhatsApp Us
              </a>
              <a href="tel:+919447121519" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md">
                Call Now
              </a>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
