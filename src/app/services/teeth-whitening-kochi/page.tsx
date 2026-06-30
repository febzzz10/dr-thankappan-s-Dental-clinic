import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Section';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFAQSchema } from '@/lib/schemas';
import { ThreeDImageCard } from '@/components/ui/3d-image-card';

const baseUrl = 'https://www.drthankappandentalclinic.com';

export const metadata: Metadata = {
  title: 'Teeth Whitening in Kochi | Professional Teeth Whitening Treatment',
  description: 'Dr. Thankappan\'s Dental Clinic provides professional teeth whitening in Kochi. Safe and effective treatment for a brighter smile.',
  openGraph: {
    title: 'Teeth Whitening in Kochi | Dr. Thankappan\'s Dental Clinic',
    description: 'Professional teeth whitening treatment in Kochi for a brighter, more confident smile.',
    url: '/services/teeth-whitening-kochi',
  },
  alternates: {
    canonical: '/services/teeth-whitening-kochi',
  },
};

const faqs = [
  { question: 'Is teeth whitening safe?', answer: 'Professional teeth whitening performed under dental supervision is safe. Your dentist will evaluate your teeth and gums before recommending the appropriate whitening method.' },
  { question: 'How long do teeth whitening results last?', answer: 'Results typically last 6 to 12 months depending on your oral hygiene, diet, and lifestyle habits. Touch-up treatments can help maintain brightness.' },
];

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: baseUrl },
  { name: 'Teeth Whitening in Kochi', url: '/services/teeth-whitening-kochi' },
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
                Cosmetic Dentistry
              </span>
              <h1 className="mt-4 font-display text-fluid-h1 font-bold tracking-tight text-slate-900">
                Teeth Whitening in Kochi
              </h1>
              <p className="mt-6 text-fluid-body text-pretty text-slate-600">
                Dr. Thankappan's Dental Clinic provides professional teeth whitening in Kochi for patients who want a brighter and more confident smile.
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-start mb-12">
            <div className="space-y-12">
              <section>
                <h2 className="font-display text-fluid-h2 font-bold text-slate-900">What is Teeth Whitening?</h2>
                <p className="mt-4 text-fluid-body text-pretty text-slate-600">
                  Teeth whitening is a cosmetic dental procedure that lightens the color of teeth by removing stains and discoloration. Professional whitening is performed under dental supervision for safe and effective results.
                </p>
              </section>

              <section>
                <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Benefits</h2>
                <ul className="mt-4 space-y-3 text-fluid-body text-slate-600">
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Brightens stained or discolored teeth</li>
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Safe and performed under professional supervision</li>
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Noticeable results in a single session</li>
                  <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Boosts confidence and smile appearance</li>
                </ul>
              </section>
            </div>

            <div className="lg:sticky lg:top-28">
              <ThreeDImageCard imageUrl="/images/sub-image/treatment.webp" alt="Teeth whitening treatment at Dr. Thankappan's Dental Clinic in Kochi" />
            </div>
          </div>

          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Who Needs This Treatment?</h2>
            <p className="mt-4 text-fluid-body text-pretty text-slate-600">
              Patients with stained or yellow teeth from coffee, tea, smoking, or aging who want a brighter smile may benefit from professional teeth whitening.
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
