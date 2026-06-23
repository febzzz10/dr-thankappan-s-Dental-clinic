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
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: pageEase },
  },
};

export default function ContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
  }, []);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const waUrl = generateWhatsAppUrl(
    settings.whatsapp_number || '919447121519',
    'Hi! I\'d like to enquire about dental services.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const addr = settings.clinic_address || 'Clinic Address, City, State';
  const phone = settings.clinic_phone || '+91 94471 21519';
  const email = settings.clinic_email || 'contact@dentalclinic.com';

  return (
    <phantom-ui loading={loading}>
      <div className="min-h-dvh bg-white">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: pageEase }}
          className="bg-gradient-to-br from-teal-50 via-white to-teal-50/80 py-20 md:py-28"
        >
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
                Contact Us
              </span>
              <h1 className="mt-4 font-display text-fluid-h1 font-bold tracking-tight text-slate-900">
                Get In Touch
              </h1>
              <p className="mt-6 text-fluid-body text-slate-600">
                Have a question? Need to reschedule? We&apos;re here to help. Reach out any way that works for you.
              </p>
            </div>
          </Container>
        </motion.section>

        <Container className="py-16 md:py-24">
          <div className="grid gap-12 grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))]">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                {[
                  { icon: PiMapPin, title: 'Address', content: addr, href: null },
                  { icon: PiPhone, title: 'Phone', content: phone, href: `tel:${phone}` },
                  { icon: PiEnvelope, title: 'Email', content: email, href: `mailto:${email}` },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={item.title} variants={itemVariants} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-display text-fluid-h4 font-bold text-slate-900">{item.title}</h3>
                        {item.href ? (
                          <a href={item.href} className="mt-1 block text-fluid-sm text-slate-600 hover:text-teal-600">
                            {item.content}
                          </a>
                        ) : (
                          <p className="mt-1 text-fluid-sm text-slate-600">{item.content}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                <motion.div variants={itemVariants} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <PiClock className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-fluid-h4 font-bold text-slate-900">Working Hours</h3>
                    <div className="mt-1 space-y-0.5 text-fluid-sm text-slate-600">
                      <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                      <p>Saturday: 9:00 AM – 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md sm:w-auto"
                >
                  <PiChatCircle className="h-5 w-5" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.3 }}
                className="overflow-hidden rounded-2xl border border-slate-100"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d879!2d76.2580093!3d9.9520519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b086d9fb895f799%3A0xe3659d763cda8f64!2sDr.%20Thankappan%20Dental%20Clinic!5e0!3m2!1sen!2sin"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Clinic Location"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: pageEase }}
            >
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <h2 className="font-display text-fluid-h3 font-bold text-slate-900">Send a Message</h2>
                <p className="mt-2 text-fluid-sm text-slate-600">
                  We&apos;ll get back to you within 24 hours.
                </p>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 rounded-xl bg-teal-50 p-6 text-center"
                  >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                      <PiCheckCircle className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="font-semibold text-teal-800">Message sent!</p>
                    <p className="mt-1 text-sm text-teal-600">
                      We&apos;ll respond within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-600">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="fullName"
                        type="text"
                        required
                        placeholder="Your full name e.g. John Doe"
                        autoComplete="name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-600">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        spellCheck={false}
                        placeholder="your@email.com"
                        autoComplete="email"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-600">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 94471 21519…"
                        autoComplete="tel"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-600">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        placeholder="How can we help you?…"
                        autoComplete="off"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Button type="submit" size="lg" className="w-full">
                        <PiPaperPlaneTilt className="h-4 w-4" aria-hidden="true" />
                        Send Message
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </div>
    </phantom-ui>
  );
}
