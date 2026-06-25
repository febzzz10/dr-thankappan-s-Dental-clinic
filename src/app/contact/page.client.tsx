'use client';

import { useEffect, useState } from 'react';
import { PiMapPin, PiPhone, PiEnvelope, PiClock, PiChatCircle, PiPaperPlaneTilt, PiCheckCircle } from 'react-icons/pi';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { getSettings } from '@/lib/api';
import { generateWhatsAppUrl } from '@/lib/utils';

const pageEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: pageEase },
  },
};

function ContactContent() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);

  const phone = settings.clinic_phone || '+91 94471 21519';
  const address = settings.clinic_address || 'Kochi, Kerala';
  const mapsUrl = settings.google_maps_link || 'https://maps.google.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const waUrl = generateWhatsAppUrl(
    phone,
    `Hi Dr.Thankappan's Dental Clinic, I would like to know more about your dental services.`
  );

  return (
    <div className="min-h-dvh">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: pageEase }}
        className="bg-gradient-to-br from-teal-50/70 via-white to-teal-50/70 pt-20 pb-4 md:pt-28 md:pb-6"
      >
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
              Contact Us
            </span>
            <h1 className="mt-4 font-display text-fluid-h1 font-bold tracking-tight text-slate-900">
              Get In Touch
            </h1>
            <p className="mt-6 text-fluid-body text-pretty text-slate-600">
              Have a question or want to schedule a visit? We&apos;re here to help. Reach out to us through any of the channels below.
            </p>
          </div>
        </Container>
      </motion.section>

      <Container className="py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            variants={containerVariants}
            initial={prefersReduced ? undefined : 'hidden'}
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <PiMapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900">Clinic Address</h3>
                <p className="mt-1 text-sm text-slate-600">{address}</p>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs font-medium text-teal-600 hover:underline">
                  View on Google Maps
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <PiPhone className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900">Phone</h3>
                <a href={`tel:${phone}`} className="mt-1 block text-sm font-medium text-teal-600 hover:underline">
                  {phone}
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <PiEnvelope className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900">Email</h3>
                <a href="mailto:drthankappandentalclinic@gmail.com" className="mt-1 block text-sm font-medium text-teal-600 hover:underline">
                  drthankappandentalclinic@gmail.com
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <PiClock className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900">Working Hours</h3>
                <p className="mt-1 text-sm text-slate-600">Monday – Friday: 9:00 AM – 6:00 PM</p>
                <p className="text-sm text-slate-600">Saturday: 9:00 AM – 2:00 PM</p>
                <p className="text-sm text-slate-600">Sunday: Closed</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md active:scale-[0.97]"
              >
                <PiChatCircle className="h-5 w-5" aria-hidden="true" />
                Chat with Us on WhatsApp
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: pageEase }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-green-100 bg-green-50 p-12 text-center">
                <PiCheckCircle className="h-12 w-12 text-green-500" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-bold text-slate-900">Message Sent!</h3>
                <p className="mt-2 text-sm text-slate-600">Thank you for reaching out. We will get back to you shortly.</p>
                <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
                <h3 className="font-display text-lg font-bold text-slate-900">Send Us a Message</h3>
                <p className="mt-1 text-sm text-slate-500">Fill out the form below and we&apos;ll get back to you.</p>
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                      Your Name
                    </label>
                    <Input id="contact-name" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="mt-1" aria-label="Your Name" />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                      Phone Number
                    </label>
                    <Input id="contact-phone" type="tel" required value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} className="mt-1" aria-label="Phone Number" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                      Email (optional)
                    </label>
                    <Input id="contact-email" type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="mt-1" aria-label="Email" />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                      Your Message
                    </label>
                    <Textarea id="contact-message" rows={4} required value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="mt-1" aria-label="Your Message" />
                  </div>
                  <Button type="submit" className="w-full">
                    <PiPaperPlaneTilt className="h-4 w-4" aria-hidden="true" />
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </Container>

      <section className="pb-12 md:pb-16">
        <Container>
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.058146655282!2d76.2673!3d9.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNTUnNTIuMyJOIDc2wrAxNiwwMi4zIkU!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dr.Thankappan's Dental Clinic — Kochi Location"
            />
          </div>
        </Container>
      </section>
    </div>
  );
}

export default ContactContent;
