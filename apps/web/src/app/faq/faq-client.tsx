'use client';

import * as React from 'react';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { motion, AnimatePresence } from 'framer-motion';

export function FAQClient() {
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const filteredFaqs = t.faq.items.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div key={locale} className="max-w-4xl mx-auto px-4 py-20">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-[var(--color-on-background)] mb-6 tracking-tight"
        >
          {t.faq.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[var(--color-on-surface-variant)] max-w-2xl mx-auto"
        >
          {t.faq.subtitle}
        </motion.p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-16">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-[var(--color-on-surface-variant)] opacity-50">search</span>
        </div>
        <input
          type="text"
          placeholder={t.faq.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-16 pr-8 py-6 bg-white dark:bg-slate-900 border border-[var(--color-divider)] rounded-[32px] shadow-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-premium text-lg"
        />
      </div>

      {/* Accordion */}
      <div className="space-y-4 mb-20">
        <AnimatePresence mode="popLayout">
          {filteredFaqs.map((faq, idx) => (
            <motion.div 
              key={faq.q}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className={`rounded-[32px] border transition-premium overflow-hidden ${
                openIndex === idx 
                ? 'bg-white dark:bg-slate-900 border-[var(--color-primary)] shadow-2xl' 
                : 'bg-[var(--color-surface-container-low)] border-[var(--color-divider)] hover:border-[var(--color-on-surface-variant)]'
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-8 py-6 text-left flex justify-between items-center gap-4"
              >
                <span className={`text-xl font-bold transition-colors ${openIndex === idx ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-background)]'}`}>
                  {faq.q}
                </span>
                <span className={`material-symbols-outlined transition-transform duration-500 ${openIndex === idx ? 'rotate-180 text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>
                  expand_more
                </span>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-8 pb-8 text-[var(--color-on-surface-variant)] leading-relaxed text-lg border-t border-[var(--color-divider)] pt-6">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Contact CTA */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-[48px] p-12 text-white relative overflow-hidden group shadow-3xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-primary)] opacity-20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">{t.faq.contactTitle}</h2>
            <p className="opacity-60 text-lg max-w-md">{t.faq.contactDesc}</p>
          </div>
          <button className="px-10 py-5 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:bg-[var(--color-primary-hover)] transition-premium shadow-xl active:scale-95 whitespace-nowrap">
            {t.faq.contactCta}
          </button>
        </div>
      </div>
    </div>
  );
}
