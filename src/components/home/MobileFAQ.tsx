'use client';

import { useState } from 'react';
import { PiCaretDown, PiQuestion } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: 'What services do you offer?', a: 'We offer general dentistry, cosmetic dentistry, orthodontics, root canal treatment, dental implants, teeth whitening, and more.' },
  { q: 'How do I book an appointment?', a: 'You can book online through our website or call us directly at +91 94471 21519.' },
  { q: 'Do you accept insurance?', a: 'Yes, we accept most major insurance plans. Contact us to verify your coverage.' },
  { q: 'What are your clinic hours?', a: 'We are open Mon–Fri: 9 AM – 6 PM and Sat: 9 AM – 2 PM. Sunday closed.' },
  { q: 'Is the first consultation free?', a: 'Yes, we offer a free initial consultation for new patients.' },
];

const cardEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function MobileFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="md:hidden bg-white px-4 py-14">
      <div className="mx-auto max-w-xs">
        <div className="mb-6 flex items-center gap-2">
          <PiQuestion aria-hidden="true" className="h-5 w-5 text-teal-600" />
          <h2 className="font-display text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="overflow-hidden rounded-xl border border-slate-200">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={"faq-answer-" + i}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800 transition-colors hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {faq.q}
                  <PiCaretDown aria-hidden="true"
                    className={`h-4 w-4 text-teal-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={"faq-answer-" + i}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: cardEase }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Have more questions?{' '}
          <a href="/faq" className="font-semibold text-teal-600 underline underline-offset-2">
            Visit full FAQ
          </a>
        </p>
      </div>
    </section>
  );
}
