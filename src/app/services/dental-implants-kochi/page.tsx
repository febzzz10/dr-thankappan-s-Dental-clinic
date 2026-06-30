import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Section';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFAQSchema } from '@/lib/schemas';

const baseUrl = 'https://www.drthankappandentalclinic.com';

export const metadata: Metadata = {
  title: 'Dental Implants in Kochi | Permanent Tooth Replacement',
  description: 'Dr. Thankappan\'s Dental Clinic offers dental implants in Kochi. Permanent tooth replacement solution for missing teeth.',
  openGraph: {
    title: 'Dental Implants in Kochi | Dr. Thankappan\'s Dental Clinic',
    description: 'Permanent dental implant treatment in Kochi for replacing missing teeth.',
    url: '/services/dental-implants-kochi',
  },
  alternates: {
    canonical: '/services/dental-implants-kochi',
  },
};

const faqs = [
  { question: 'How long do dental implants last?', answer: 'With proper care and oral hygiene, dental implants can last many years, often a lifetime. Regular dental check-ups help maintain implant health.' },
  { question: 'Is dental implant surgery painful?', answer: 'The procedure is performed under local anesthesia. Most patients report minimal discomfort during and after implant placement.' },
];

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: baseUrl },
  { name: 'Dental Implants in Kochi', url: '/services/dental-implants-kochi' },
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
                Restorative Dentistry
              </span>
              <h1 className="mt-4 font-display text-fluid-h1 font-bold tracking-tight text-slate-900">
                Dental Implants in Kochi
              </h1>
              <p className="mt-6 text-fluid-body text-pretty text-slate-600">
                Dr. Thankappan's Dental Clinic offers dental implants in Kochi for patients with missing teeth who want a permanent and natural-looking replacement solution.
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">What are Dental Implants?</h2>
            <p className="mt-4 text-fluid-body text-pretty text-slate-600">
              Dental implants are titanium posts surgically placed into the jawbone to replace missing tooth roots. They provide a stable foundation for crowns, bridges, or dentures, offering a permanent solution that looks and functions like natural teeth.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Benefits</h2>
            <ul className="mt-4 space-y-3 text-fluid-body text-slate-600">
              <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Permanent tooth replacement solution</li>
              <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Natural-looking and comfortable</li>
              <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Preserves jawbone health</li>
              <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />Restores chewing function and smile</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Who Needs This Treatment?</h2>
            <p className="mt-4 text-fluid-body text-pretty text-slate-600">
              Patients with one or more missing teeth due to injury, decay, or gum disease who want a long-term, stable replacement option.
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
