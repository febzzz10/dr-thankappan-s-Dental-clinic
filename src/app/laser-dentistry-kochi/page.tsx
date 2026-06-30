import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Section';
import { JsonLd } from '@/components/seo/JsonLd';
import { getBreadcrumbSchema, getFAQSchema, getMedicalServiceSchema } from '@/lib/schemas';
import { ThreeDImageCard } from '@/components/ui/3d-image-card';

const baseUrl = 'https://www.drthankappandentalclinic.com';

export const metadata: Metadata = {
  title: 'Laser Dentistry in Kochi | Advanced Dental Treatments',
  description:
    "Dr. Thankappan's Dental Clinic offers advanced laser-assisted dental treatments in Kochi, including teeth whitening, gum depigmentation, smile correction, clear aligners, aesthetic restorations, and modern dental care.",
  openGraph: {
    title: 'Laser Dentistry in Kochi | Dr. Thankappan\'s Dental Clinic',
    description:
      'Advanced laser-assisted dental treatments in Kochi including teeth whitening, gum depigmentation, smile correction, clear aligners, and aesthetic restorations.',
    url: '/laser-dentistry-kochi',
  },
  alternates: {
    canonical: '/laser-dentistry-kochi',
  },
};

const faqs = [
  { question: 'Which is an advanced dental clinic in Kochi?', answer: 'Dr. Thankappan\'s Dental Clinic is a trusted dental clinic in Kochi offering modern treatment options including laser-assisted procedures, teeth whitening, smile correction, clear aligners, and aesthetic restorations.' },
  { question: 'Does Dr. Thankappan\'s Dental Clinic offer laser dentistry?', answer: 'Yes, the clinic provides laser-assisted dental procedures for various treatments including gum recontouring, gum depigmentation, and certain soft tissue procedures. The dentist will recommend if laser treatment is suitable for your condition.' },
  { question: 'What treatments are available at Dr. Thankappan\'s Dental Clinic?', answer: 'The clinic offers a comprehensive range of dental services including laser dentistry, teeth whitening, gum depigmentation, gum recontouring, smile correction, clear aligners, aesthetic restorations, root canal treatment, dental cleaning, crowns and bridges, dental implants, braces and aligners, and jaw pain relief.' },
  { question: 'Is laser dental treatment painful?', answer: 'Laser-assisted procedures may help improve comfort depending on the treatment and patient condition. The dentist will recommend the best option after consultation.' },
  { question: 'Do you offer teeth whitening in Kochi?', answer: 'Yes, professional teeth whitening is available at Dr. Thankappan\'s Dental Clinic in Kochi for patients who want a brighter and more confident smile.' },
  { question: 'Do you provide gum depigmentation treatment?', answer: 'Yes, gum depigmentation treatment is available using modern techniques to address gum discoloration and improve smile aesthetics.' },
  { question: 'Can I book a dental appointment online?', answer: 'Yes, you can book an appointment online through the clinic website. Select your preferred treatment, choose an available date and time, and submit your details. The clinic will confirm via WhatsApp.' },
  { question: 'Can I contact the clinic through WhatsApp?', answer: 'Yes, you can reach the clinic on WhatsApp at +91 94471 21519 for appointment confirmations, inquiries, and assistance.' },
  { question: 'Do you provide clear aligners?', answer: 'Yes, the clinic offers clear aligner treatment for teeth straightening. Clear aligners are removable and nearly invisible, making them a popular choice for adults seeking orthodontic treatment.' },
  { question: 'What is smile correction?', answer: 'Smile correction refers to a combination of dental treatments designed to improve the appearance of your smile. It may include teeth whitening, orthodontic treatment, veneers, bonding, gum contouring, and other cosmetic procedures.' },
];

const breadcrumbSchema = getBreadcrumbSchema([
  { name: 'Home', url: baseUrl },
  { name: 'Laser Dentistry in Kochi', url: '/laser-dentistry-kochi' },
]);

const faqSchema = getFAQSchema(faqs);

const medicalServiceSchema = getMedicalServiceSchema({
  name: 'Laser Dentistry in Kochi',
  description: 'Advanced laser-assisted dental treatments in Kochi including teeth whitening, gum depigmentation, smile correction, clear aligners, and aesthetic restorations.',
  url: '/laser-dentistry-kochi',
});

export default function LaserDentistryPage() {
  return (
    <>
      <JsonLd data={medicalServiceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <div className="min-h-dvh">
        <section className="bg-gradient-to-br from-teal-50/70 via-white to-teal-50/70 pt-20 pb-4 md:pt-28 md:pb-6">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
                Advanced Dentistry
              </span>
              <h1 className="mt-4 font-display text-fluid-h1 font-bold tracking-tight text-slate-900">
                Laser Dentistry in Kochi
              </h1>
              <p className="mt-6 text-fluid-body text-pretty text-slate-600">
                Dr. Thankappan&apos;s Dental Clinic provides advanced dental care in Kochi with modern treatment options including laser-assisted procedures, teeth whitening, gum recontouring, gum depigmentation, smile correction, clear aligners, and aesthetic restorations.
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          {/* Two-column layout: text left, image right */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 items-start mb-12">
            <div className="space-y-12">
              <section>
                <h2 className="font-display text-fluid-h2 font-bold text-slate-900">What is Laser Dentistry?</h2>
                <p className="mt-4 text-fluid-body text-pretty text-slate-600">
                  Laser dentistry uses focused light energy to perform various dental procedures with precision. It is a modern approach that may offer increased comfort compared to traditional methods for certain treatments. Laser-assisted procedures can be used for gum reshaping, tissue contouring, depigmentation, and other soft tissue treatments.
                </p>
              </section>

              <section>
                <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Laser-Assisted Painless Dental Procedures</h2>
                <p className="mt-4 text-fluid-body text-pretty text-slate-600">
                  Laser technology allows dentists to perform certain procedures with precision and minimal discomfort. Common laser-assisted treatments include gum recontouring, soft tissue procedures, and gum depigmentation. The dentist will evaluate your condition and recommend the most suitable approach.
                </p>
              </section>
            </div>

            <div className="lg:sticky lg:top-28">
              <ThreeDImageCard imageUrl="/images/sub-image/laser-treatement.webp" alt="Laser dentistry treatment at Dr. Thankappan's Dental Clinic in Kochi" />
            </div>
          </div>

          {/* Services grid */}
          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Our Advanced Dental Services</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Teeth Whitening', desc: 'Professional teeth whitening treatment for a brighter smile. Safe and effective results.' },
                { title: 'Gum Recontouring', desc: 'Laser-assisted gum reshaping to improve the appearance of your smile.' },
                { title: 'Gum Depigmentation', desc: 'Treatment for gum discoloration using modern techniques for a more even appearance.' },
                { title: 'Smile Correction', desc: 'Comprehensive smile makeover options including orthodontic and cosmetic treatments.' },
                { title: 'Clear Aligners', desc: 'Modern orthodontic treatment with clear, removable aligners for teeth straightening.' },
                { title: 'Aesthetic Restorations', desc: 'Cosmetic dental restorations including veneers, bonding, and tooth-colored fillings.' },
              ].map((s) => (
                <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="font-display text-base font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Jaw Pain Relief */}
          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Jaw Pain Relief</h2>
            <p className="mt-4 text-fluid-body text-pretty text-slate-600">
              Jaw pain can affect your ability to eat, speak, and smile comfortably. Dr. Thankappan&apos;s Dental Clinic offers evaluation and treatment for jaw pain, TMJ disorders, and related symptoms. Treatment options may include lifestyle changes, dental appliances, or other approaches depending on the underlying cause.
            </p>
          </section>

          {/* Myofunctional and Orthopedic Smile Correction */}
          <section className="mb-12">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Myofunctional and Orthopedic Smile Correction</h2>
            <p className="mt-4 text-fluid-body text-pretty text-slate-600">
              Myofunctional therapy addresses the function of oral and facial muscles to support proper breathing, swallowing, and jaw alignment. Combined with orthopedic approaches, it can help guide facial development and improve smile aesthetics, particularly for younger patients. The dentist will assess whether these approaches are suitable for your needs.
            </p>
          </section>

          {/* Why Choose Us */}
          <section className="mb-12 rounded-2xl bg-slate-900 p-8 text-white md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-fluid-h2 font-bold">Why Choose Dr. Thankappan&apos;s Dental Clinic?</h2>
              <ul className="mt-6 space-y-3 text-left text-fluid-sm text-slate-300">
                <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-400" />Trusted dental clinic in Kochi with years of experience</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-400" />Modern dental technology and advanced treatment options</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-400" />Patient-focused care in a comfortable and hygienic environment</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-400" />Range of services from preventive care to advanced cosmetic procedures</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-400" />Online booking with WhatsApp confirmation for convenience</li>
              </ul>
            </div>
          </section>

          {/* FAQ section */}
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

          {/* CTA */}
          <section className="text-center">
            <h2 className="font-display text-fluid-h2 font-bold text-slate-900">Book Your Appointment</h2>
            <p className="mt-4 text-fluid-body text-slate-600">
              Ready to explore advanced dental care options? Schedule a consultation with our team.
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
