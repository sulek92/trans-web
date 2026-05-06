'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
    <div key={title} className="max-w-[1280px] mx-auto px-8 py-40 min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row gap-24 relative z-10">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="sticky top-40 space-y-12">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight"
              >
                {title}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full w-fit border border-slate-100"
              >
                <span className="material-symbols-outlined text-xs">update</span>
                {lastUpdated}
              </motion.div>
            </div>

            <nav className="space-y-1">
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
                    ? 'bg-slate-900 text-white shadow-xl translate-x-2' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] border transition-colors ${
                    activeSection === i ? 'bg-white/10 border-white/20' : 'bg-slate-100 border-slate-200'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="truncate">{s.title}</span>
                </motion.button>
              ))}
            </nav>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-8 bg-slate-50 rounded-[32px] border border-slate-100"
            >
               <h4 className="font-bold text-slate-900 mb-2">Masz pytania?</h4>
               <p className="text-xs text-slate-500 leading-relaxed mb-6">Nasz zespół prawny i operacyjny chętnie wyjaśni wszelkie wątpliwości dotyczące regulaminu.</p>
               <Link href="/kontakt" className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                 Skontaktuj się <span className="material-symbols-outlined text-xs">arrow_forward</span>
               </Link>
            </motion.div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-24"
          >
            {sections.map((s, i) => (
              <section 
                key={i} 
                id={`section-${i}`}
                className="scroll-mt-40 group"
              >
                <div className="flex items-start gap-8 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg font-bold text-[var(--color-primary)] shrink-0 shadow-sm group-hover:bg-[var(--color-primary)] group-hover:text-white transition-premium">
                    {i + 1}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight pt-3">
                    {s.title}
                  </h2>
                </div>
                <div className="text-slate-600 leading-relaxed text-xl prose prose-slate prose-p:text-slate-600 prose-p:leading-[1.8] max-w-none pl-22 border-l border-slate-50 ml-7 pl-15">
                  <div className="whitespace-pre-line">
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
