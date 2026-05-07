'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/i18n-context';

interface LegalSection {
  title: string;
  content: string;
}

interface LegalClientProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalClient({ title, lastUpdated, sections }: LegalClientProps) {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = React.useState(0);

  return (
    <div key={title} className="max-w-[1280px] mx-auto px-8 py-40 min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row gap-24 relative z-10">
        <div className="lg:w-1/4 text-left">
          <div className="sticky top-40 space-y-12">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold text-[var(--color-on-background)] mb-4 tracking-tighter leading-tight"
              >
                {title}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-[0.2em] bg-[var(--color-surface-container)] px-4 py-1.5 rounded-full w-fit border border-[var(--color-divider)]"
              >
                <span className="material-symbols-outlined text-xs">update</span>
                {lastUpdated}
              </motion.div>
            </div>

            <nav className="space-y-2">
              {sections.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => {
                    setActiveSection(i);
                    const element = document.getElementById(`section-${i}`);
                    if (element) {
                      const offset = 140;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = element.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-bold transition-premium flex items-center gap-4 group ${
                    activeSection === i 
                    ? 'bg-[var(--color-primary)] text-white shadow-xl translate-x-2' 
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-container)] hover:text-[var(--color-on-background)]'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] border transition-colors shrink-0 ${
                    activeSection === i ? 'bg-white/10 border-white/20' : 'bg-[var(--color-surface-container)] border-[var(--color-divider)]'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="truncate tracking-tight">{s.title}</span>
                </motion.button>
              ))}
            </nav>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-8 bg-[var(--color-surface-container)]/50 rounded-[40px] border border-[var(--color-divider)]"
            >
               <h4 className="font-bold text-[var(--color-on-background)] mb-2 tracking-tight">{t.legal.questions}</h4>
               <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-6 font-medium">{t.legal.questionsDesc}</p>
               <Link href="/kontakt" className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                 {t.legal.contactCta} <span className="material-symbols-outlined text-xs">arrow_forward</span>
               </Link>
            </motion.div>
          </div>
        </div>

        <div className="lg:w-3/4 max-w-4xl text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-32"
          >
            {sections.map((s, i) => (
              <section 
                key={i} 
                id={`section-${i}`}
                className="scroll-mt-40 group"
              >
                <div className="flex items-start gap-8 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] flex items-center justify-center text-xl font-bold text-[var(--color-primary)] shrink-0 shadow-sm group-hover:bg-[var(--color-primary)] group-hover:text-white transition-premium">
                    {i + 1}
                  </div>
                  <h2 className="text-3xl font-bold text-[var(--color-on-background)] tracking-tighter pt-3">
                    {s.title}
                  </h2>
                </div>
                <div className="text-[var(--color-text-muted)] leading-relaxed text-xl prose dark:prose-invert max-w-none ml-7 pl-15 border-l-2 border-[var(--color-divider)]/30 group-hover:border-[var(--color-primary)]/30 transition-premium">
                  <div className="whitespace-pre-line font-medium leading-[1.8]">
                    {s.content}
                  </div>
                </div>
              </section>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
