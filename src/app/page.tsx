import type { Metadata } from 'next';
import Link from 'next/link';
import { GradientBackground } from '@/components/ui/gradient-background';
import { Container } from '@/components/ui/Section';
import { HeroSectionWrapper } from '@/components/home/HeroSectionWrapper';
import { FeatureHighlights } from '@/components/home/FeatureHighlights';
import { AboutSection } from '@/components/home/AboutSection';
import { MarqueeStrip } from '@/components/home/MarqueeStrip';
import { StatsSection } from '@/components/home/StatsSection';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { DoctorsPreview } from '@/components/home/DoctorsPreview';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { CTABanner } from '@/components/home/CTABanner';
import { JsonLd } from '@/components/seo/JsonLd';
import { getFAQSchema } from '@/lib/schemas';

export const metadata: Metadata = {
  title: {
    default: "Dr.Thankappan's Dental Clinic — Book Your Appointment Online",
    template: "%s | Dr.Thankappan's Dental Clinic",
  },
  description: 'Advanced dental care in Kochi. Laser dentistry, teeth whitening, smile correction, clear aligners, and more. Book online in 60 seconds.',
};

const dentalSoftGradients = [
  'linear-gradient(135deg, #d9fbff 0%, #f8ffff 45%, #c7f4f1 100%)',
  'linear-gradient(135deg, #e6ffff 0%, #ffffff 45%, #bdeeea 100%)',
  'linear-gradient(135deg, #c9f7ff 0%, #f9ffff 50%, #d7fff8 100%)',
  'linear-gradient(135deg, #eaffff 0%, #f7ffff 45%, #b8ebe7 100%)',
  'linear-gradient(135deg, #d9fbff 0%, #f8ffff 45%, #c7f4f1 100%)',
];

const faqItems = [
  { question: 'Which is an advanced dental clinic in Kochi?', answer: 'Dr. Thankappan\'s Dental Clinic is a trusted dental clinic in Kochi offering modern treatment options including laser-assisted procedures, teeth whitening, smile correction, clear aligners, and aesthetic restorations.' },
  { question: 'Does Dr. Thankappan\'s Dental Clinic offer laser dentistry?', answer: 'Yes, the clinic provides laser-assisted dental procedures for various treatments including gum recontouring, gum depigmentation, and certain soft tissue procedures.' },
  { question: 'What treatments are available at Dr. Thankappan\'s Dental Clinic?', answer: 'The clinic offers laser dentistry, teeth whitening, gum depigmentation, gum recontouring, smile correction, clear aligners, aesthetic restorations, root canal treatment, dental cleaning, crowns and bridges, dental implants, braces and aligners, and jaw pain relief.' },
  { question: 'Is laser dental treatment painful?', answer: 'Laser-assisted procedures may help improve comfort depending on the treatment and patient condition. The dentist will recommend the best option after consultation.' },
  { question: 'Do you offer teeth whitening in Kochi?', answer: 'Yes, professional teeth whitening is available for patients who want a brighter and more confident smile.' },
  { question: 'Do you provide gum depigmentation treatment?', answer: 'Yes, gum depigmentation treatment is available using modern techniques to address gum discoloration and improve smile aesthetics.' },
  { question: 'Can I book a dental appointment online?', answer: 'Yes, you can book an appointment online through the website. Select your preferred treatment, choose an available date and time, and submit your details.' },
  { question: 'Can I contact the clinic through WhatsApp?', answer: 'Yes, you can reach the clinic on WhatsApp at +91 94471 21519 for appointments and inquiries.' },
  { question: 'Do you provide clear aligners?', answer: 'Yes, the clinic offers clear aligner treatment for teeth straightening. Clear aligners are removable and nearly invisible.' },
  { question: 'What is smile correction?', answer: 'Smile correction refers to dental treatments designed to improve your smile, including whitening, orthodontic treatment, veneers, bonding, and gum contouring.' },
];

const faqSchema = getFAQSchema(faqItems);

export default function HomePage() {
  return (
    <GradientBackground gradients={dentalSoftGradients} animationDuration={10} overlay={false} className="min-h-screen">
      <JsonLd data={faqSchema} />
      <HeroSectionWrapper />
      <FeatureHighlights />
      <AboutSection />
      <MarqueeStrip />
      <StatsSection />
      <ServicesPreview />

      {/* Quick Information - AI-friendly summary */}
      <section className="bg-teal-50/80 py-16">
        <Container>
          <div className="mx-auto max-w-4xl rounded-2xl border border-teal-100 bg-white p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-slate-900">Quick Information</h2>
            <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
              <div><dt className="font-medium text-slate-500">Clinic Name</dt><dd className="mt-0.5 text-slate-900 font-medium">Dr. Thankappan&apos;s Dental Clinic</dd></div>
              <div><dt className="font-medium text-slate-500">Location</dt><dd className="mt-0.5 text-slate-900 font-medium">Kochi, Kerala</dd></div>
              <div><dt className="font-medium text-slate-500">Phone</dt><dd className="mt-0.5"><a href="tel:+919447121519" className="font-medium text-teal-600 hover:underline">+91 94471 21519</a></dd></div>
              <div><dt className="font-medium text-slate-500">Main Services</dt><dd className="mt-0.5 text-slate-900 font-medium">Laser dentistry, teeth whitening, gum depigmentation, smile correction, clear aligners, aesthetic restorations, root canal, implants, braces</dd></div>
              <div><dt className="font-medium text-slate-500">Booking</dt><dd className="mt-0.5 text-slate-900 font-medium">Online booking with WhatsApp confirmation</dd></div>
              <div><dt className="font-medium text-slate-500">Working Hours</dt><dd className="mt-0.5 text-slate-900 font-medium">Mon–Sat, 9 AM – 6 PM</dd></div>
            </dl>
          </div>
        </Container>
      </section>

      {/* Advanced Dental Care with Modern Technology */}
      <section className="bg-gradient-to-br from-teal-50/30 via-white to-teal-50/30 py-24">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700 shadow-sm">
              Advanced Dentistry
            </span>
            <h2 className="mt-4 font-display text-fluid-h2 font-bold tracking-tight text-slate-900">
              Advanced Dental Care with Modern Technology
            </h2>
            <p className="mt-6 text-fluid-body text-pretty text-slate-600">
              Dr. Thankappan&apos;s Dental Clinic offers modern dental care in Kochi with advanced treatment options including laser-assisted procedures, teeth whitening, smile correction, clear aligners, gum recontouring, gum depigmentation, and aesthetic restorations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/laser-dentistry-kochi" className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md">
                Laser Dentistry
              </Link>
              <Link href="/services/teeth-whitening-kochi" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md">
                Teeth Whitening
              </Link>
              <Link href="/services/braces-aligners-kochi" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md">
                Braces &amp; Aligners
              </Link>
              <Link href="/services/smile-correction-kochi" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md">
                Smile Correction
              </Link>
              <Link href="/book" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md">
                Book Appointment
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <DoctorsPreview />

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-teal-50/80 via-white to-teal-50/80 py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700 shadow-sm">
                Questions
              </span>
              <h2 className="mt-4 font-display text-fluid-h2 font-bold tracking-tight text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-fluid-body text-slate-600">
                Quick answers to common questions about our dental clinic and treatments.
              </p>
            </div>
            <div className="mt-10 space-y-4">
              {faqItems.map((faq) => (
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
          </div>
        </Container>
      </section>

      <TestimonialsSection />
      <CTABanner />
    </GradientBackground>
  );
}
