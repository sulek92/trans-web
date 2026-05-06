'use client';

import * as React from 'react';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQClientProps {
  cmsContent?: string;
}

export function FAQClient({ cmsContent }: FAQClientProps) {
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const [feedbackGiven, setFeedbackGiven] = React.useState<Record<number, boolean>>({});

  // Parse CMS content or fallback to i18n dictionary
  const content = React.useMemo(() => {
    if (!cmsContent) return t.faq;
    try {
      const parsed = JSON.parse(cmsContent);
      return {
        title: parsed.title || t.faq.title,
        subtitle: parsed.subtitle || t.faq.subtitle,
        items: parsed.items && parsed.items.length > 0 ? parsed.items : t.faq.items,
        searchPlaceholder: t.faq.searchPlaceholder,
        contactTitle: parsed.contactTitle || t.faq.contactTitle,
        contactDesc: parsed.contactDesc || t.faq.contactDesc,
        contactCta: parsed.contactCta || t.faq.contactCta,
      };
    } catch {
      return t.faq;
    }
  }, [cmsContent, t.faq]);

  const filteredFaqs = content.items.filter((item: any) => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFeedback = (idx: number) => {
    setFeedbackGiven(prev => ({ ...prev, [idx]: true }));
  };

  return (
    <div key={locale} className="max-w-[1000px] mx-auto px-8 py-32 min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-3xl pointer-events-none -mt-96"></div>

      {/* Hero Section */}
      <div className="text-center mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm text-slate-400"
        >
          <span className="material-symbols-outlined text-sm">live_help</span>
          Centrum Wiedzy
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight"
        >
          {content.title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          {content.subtitle}
        </motion.p>
      </div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative max-w-2xl mx-auto mb-24 z-10"
      >
        <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-300 text-2xl">search</span>
        </div>
        <input
          type="text"
          placeholder={content.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-20 pr-10 py-7 bg-white border border-slate-100 rounded-[40px] shadow-2xl focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:border-[var(--color-primary)] outline-none transition-premium text-xl font-medium text-slate-900 placeholder:text-slate-300"
        />
      </motion.div>

      {/* Accordion List */}
      <div className="space-y-6 mb-32 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredFaqs.map((faq: any, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div 
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                layout
                className={`rounded-[40px] border transition-premium overflow-hidden ${
                  isOpen 
                  ? 'bg-white border-transparent shadow-[var(--shadow-premium)]' 
                  : 'bg-white/50 border-slate-50 hover:bg-white hover:border-slate-100 hover:shadow-xl'
                }`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-10 py-8 text-left flex justify-between items-center gap-8 group"
                >
                  <span className={`text-2xl font-bold transition-premium tracking-tight ${isOpen ? 'text-[var(--color-primary)]' : 'text-slate-900 group-hover:text-[var(--color-primary)]'}`}>
                    {faq.q}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-premium ${isOpen ? 'bg-[var(--color-primary)] text-white rotate-180' : 'bg-slate-50 text-slate-300'}`}>
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-10 pb-10 border-t border-slate-50 pt-10">
                        <p className="text-xl text-slate-500 leading-relaxed max-w-3xl mb-12">
                          {faq.a}
                        </p>
                        
                        {/* Helpfulness Interaction */}
                        <div className="flex items-center justify-between py-6 px-8 bg-slate-50 rounded-3xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Czy ta odpowiedź była pomocna?</span>
                          <div className="flex gap-4">
                            {feedbackGiven[idx] ? (
                              <motion.span 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Dziękujemy za opinię!
                              </motion.span>
                            ) : (
                              <>
                                <button onClick={() => handleFeedback(idx)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-200 transition-premium shadow-sm">
                                  <span className="material-symbols-outlined text-lg">thumb_up</span>
                                </button>
                                <button onClick={() => handleFeedback(idx)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-premium shadow-sm">
                                  <span className="material-symbols-outlined text-lg">thumb_down</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filteredFaqs.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100"
          >
             <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">search_off</span>
             <h3 className="text-2xl font-bold text-slate-400">Brak pasujących pytań</h3>
             <p className="text-slate-400 mt-2">Spróbuj wpisać inną frazę lub skontaktuj się z nami.</p>
          </motion.div>
        )}
      </div>

      {/* Modern Contact CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-900 rounded-[64px] p-16 md:p-24 text-white relative overflow-hidden group shadow-3xl"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-[0.15] rounded-full -mr-64 -mt-64 blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600 opacity-[0.1] rounded-full -ml-48 -mb-48 blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="text-center lg:text-left max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">{content.contactTitle}</h2>
            <p className="text-white/60 text-xl leading-relaxed mb-12">{content.contactDesc}</p>
            <div className="flex items-center justify-center lg:justify-start gap-8">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Dostępność</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online 24/7
                  </span>
               </div>
               <div className="w-px h-10 bg-white/10"></div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Reakcja</span>
                  <span className="font-bold text-white tracking-tight">Do 15 minut</span>
               </div>
            </div>
          </div>
          <button className="px-12 py-6 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:bg-[var(--color-primary-hover)] transition-premium shadow-2xl shadow-[var(--color-primary)]/20 active:scale-95 text-lg flex items-center gap-3">
            {content.contactCta}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
