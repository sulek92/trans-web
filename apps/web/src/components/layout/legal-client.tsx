'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

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
  const [activeSection, setActiveSection] = React.useState(0);

  return (
    <div key={title} className="max-w-[1280px] mx-auto px-4 py-20">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="sticky top-32 space-y-2">
            <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-8 tracking-tight">{title}</h1>
            <div className="space-y-1">
              {sections.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveSection(i);
                    const element = document.getElementById(`section-${i}`);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`w-full text-left px-6 py-3 rounded-xl text-sm font-medium transition-premium ${
                    activeSection === i 
                    ? 'bg-[var(--color-primary-highlight)] text-[var(--color-primary)] shadow-sm' 
                    : 'text-[var(--color-on-surface-variant)] hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {i + 1}. {s.title}
                </button>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-[var(--color-divider)]">
              <p className="text-xs text-[var(--color-on-surface-variant)] opacity-60 italic">
                {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            {sections.map((s, i) => (
              <section 
                key={i} 
                id={`section-${i}`}
                className="scroll-mt-32 border-b border-[var(--color-divider)] pb-16 last:border-0"
              >
                <h2 className="text-2xl font-bold text-[var(--color-on-background)] mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-sm font-bold text-[var(--color-primary)]">
                    {i + 1}
                  </span>
                  {s.title}
                </h2>
                <div className="text-[var(--color-on-surface-variant)] leading-relaxed text-lg prose dark:prose-invert max-w-none">
                  {s.content}
                </div>
              </section>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
