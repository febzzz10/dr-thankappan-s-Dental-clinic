'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, SectionHeader } from '@/components/ui/Section';
import { mockData } from '@/lib/api';

const pageEase = [0.16, 1, 0.3, 1] as const;

export default function FaqPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filtered = mockData.faqs.filter(
    (faq) =>
      faq.is_visible &&
      (faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase()))
  );

  const selected = filtered.find((faq) => faq.id === selectedId);

  return (
    <div className="min-h-dvh bg-white">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: pageEase }}
        className="bg-gradient-to-br from-teal-50 via-white to-teal-50/80 py-20 md:py-28"
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <SectionHeader
              title="Frequently Asked Questions"
              subtitle="Find answers to common questions about our services, treatments, and policies."
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mx-auto mt-8 max-w-md"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search questions..."
                aria-label="Search FAQs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-full border border-slate-200 bg-white px-12 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </motion.div>
        </Container>
      </motion.section>

      <Container className="py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: pageEase }}
        >
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className="text-slate-500">No matching questions found.</p>
            </motion.div>
          ) : (
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.5fr]">
              <div className="space-y-1">
                {filtered.map((faq, i) => {
                  const isSelected = selectedId === faq.id;
                  return (
                    <motion.button
                      key={faq.id}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.04, ease: pageEase }}
                      onClick={() => setSelectedId(isSelected ? null : faq.id)}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-[transform,opacity] ${
                        isSelected
                          ? 'bg-teal-50 font-semibold text-teal-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {faq.question}
                    </motion.button>
                  );
                })}
              </div>
              <div className="hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-8 shadow-tinted">
                  {selected ? (
                    <motion.div
                      key={selected.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: pageEase }}
                    >
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        {selected.question}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-slate-600">
                        {selected.answer}
                      </p>
                    </motion.div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      Select a question to view the answer.
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-3 lg:hidden">
                {filtered.map((faq, i) => {
                  const isSelected = selectedId === faq.id;
                  return (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease: pageEase }}
                    >
                      <button
                        onClick={() => setSelectedId(isSelected ? null : faq.id)}
                        aria-expanded={isSelected}
                        className="w-full rounded-2xl border border-slate-100 px-5 py-4 text-left transition-shadow hover:shadow-tinted"
                      >
                        <span className="pr-2 text-sm font-semibold text-slate-900">
                          {faq.question}
                        </span>
                      </button>
                      {isSelected && (
                        <div className="px-5 pb-4 pt-2">
                          <p className="text-sm leading-relaxed text-slate-600">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
}
