'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, SectionHeader } from '@/components/ui/Section';
import { getFAQs } from '@/lib/api';
import type { FAQ } from '@/lib/api';

const pageEase = [0.16, 1, 0.3, 1] as const;

function FaqContent() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getFAQs()
      .then(setFaqs)
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-dvh">
      <section className="bg-gradient-to-br from-teal-50/70 via-white to-teal-50/70 pt-20 pb-4 md:pt-28 md:pb-6">
        <Container>
          <SectionHeader
            as="h1"
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our dental services, appointments, and clinic."
            className="mb-4 md:mb-6"
          />
        </Container>
      </section>

      <Container className="pb-16 md:pb-24">
        <div className="relative mx-auto mb-10 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-3.5 pl-12 pr-5 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            aria-label="Search FAQs"
          />
        </div>

        {loading ? (
          <div className="mx-auto max-w-3xl space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500">No FAQs found. Try a different search term.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-sm">
            {filtered.map((faq) => (
              <motion.div
                key={faq.id}
                initial={false}
                animate={{ backgroundColor: selectedId === faq.id ? '#f0fdfa' : '#ffffff' }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => handleToggle(faq.id)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-teal-50/50"
                  aria-expanded={selectedId === faq.id}
                >
                  <span className="pr-4 font-display text-base font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <motion.svg
                    animate={{ rotate: selectedId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-5 w-5 shrink-0 text-teal-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                {selectedId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.25, ease: pageEase }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-slate-100 px-6 py-4">
                      <p className="text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default FaqContent;
