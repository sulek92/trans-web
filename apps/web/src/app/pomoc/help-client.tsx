'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function HelpFaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'up' | 'down' | null>(null);

  return (
    <motion.div 
      variants={itemVariants}
      className="bg-surface-primary rounded-[40px] border border-[var(--color-divider)] shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl relative group"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.01] pointer-events-none" />
      
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left p-10 flex items-center justify-between group/btn relative z-10"
      >
        <h3 className={`font-bold text-2xl transition-colors duration-500 tracking-tight leading-snug ${isOpen ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-background)]'} group-hover/btn:text-[var(--color-primary)]`}>
          {question}
        </h3>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border border-[var(--color-divider)]/30 ${isOpen ? 'bg-[var(--color-primary)] text-white rotate-180 shadow-lg shadow-[var(--color-primary)]/20 border-transparent' : 'bg-surface-container text-[var(--color-text-faint)] group-hover/btn:bg-[var(--color-primary)] group-hover/btn:text-white'}`}>
          <span className="material-symbols-outlined text-3xl">expand_more</span>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-10 pb-10 pt-0 text-[var(--color-text-muted)] text-xl leading-relaxed border-t border-[var(--color-divider)]/30 bg-surface-container/5 relative z-10">
              <div className="pt-10">{answer}</div>
              <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-8 text-[11px] font-black text-[var(--color-text-faint)] uppercase tracking-[0.3em] border-t border-[var(--color-divider)]/20 pt-8">
                Czy ta odpowiedź była dla Ciebie pomocna?
                <div className="flex gap-4">
                  <button 
                    onClick={() => setFeedback('up')}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 font-black uppercase tracking-widest ${feedback === 'up' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-surface-container hover:bg-emerald-500 hover:text-white hover:shadow-lg'}`}
                  >
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: feedback === 'up' ? "'FILL' 1" : undefined }}>thumb_up</span> 
                    {feedback === 'up' ? 'Pomogło!' : 'Tak'}
                  </button>
                  <button 
                    onClick={() => setFeedback('down')}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 font-black uppercase tracking-widest ${feedback === 'down' ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' : 'bg-surface-container hover:bg-red-500 hover:text-white hover:shadow-lg'}`}
                  >
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: feedback === 'down' ? "'FILL' 1" : undefined }}>thumb_down</span> 
                    {feedback === 'down' ? 'Niezbyt' : 'Nie'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface HelpData {
  title: string;
  subtitle: string;
  categories: { title: string; icon: string; count: number }[];
  faqItems: { q: string; a: string; cat?: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
  contactPhone?: string;
  contactEmail?: string;
}

export function HelpClient({ data: d }: { data: HelpData }) {
  const [query, setQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const visibleFaq = React.useMemo(() => {
    let items = d.faqItems;
    
    if (selectedCategory) {
      items = items.filter(item => item.cat === selectedCategory);
    }
    
    if (normalizedQuery) {
      items = items.filter((item) =>
        `${item.q} ${item.a}`.toLowerCase().includes(normalizedQuery),
      );
    }
    
    return items;
  }, [d.faqItems, selectedCategory, normalizedQuery]);

  if (!mounted) {
    return (
      <main className="pb-32 bg-background min-h-screen">
        <section className="relative pt-32 pb-32 overflow-hidden">
           <div className="max-w-[1280px] mx-auto px-8 text-center">
             <h1 className="font-display-bold text-5xl sm:text-7xl lg:text-8xl font-bold text-[var(--color-on-background)] mb-12 tracking-tighter max-w-5xl mx-auto leading-[1.02]">
               {d.title}
             </h1>
           </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pb-32 bg-background min-h-screen overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-[var(--color-primary)]/5 blur-[140px] rounded-full -z-10" />
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[var(--color-primary)]/10 blur-[100px] rounded-full -z-10 animate-float-slow" />
        
        <div className="max-w-[1280px] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-8 py-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-[var(--color-primary)]/10">
              Centrum Pomocy PaletBroker
            </span>
            <h1 className="font-display-bold text-5xl sm:text-7xl lg:text-8xl font-bold text-[var(--color-on-background)] mb-12 tracking-tighter max-w-5xl mx-auto leading-[1.02] drop-shadow-sm">
              {d.title}
            </h1>
            <p className="text-[var(--color-text-muted)] text-xl sm:text-3xl mb-20 max-w-3xl mx-auto leading-relaxed opacity-90 font-medium">
              {d.subtitle}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-4xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-[var(--color-primary)]/30 blur-[60px] opacity-0 group-focus-within:opacity-30 transition-opacity duration-1000 -z-10" />
            <span className="material-symbols-outlined absolute left-10 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] text-4xl group-focus-within:text-[var(--color-primary)] group-focus-within:scale-110 transition-all duration-500">search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full pl-24 pr-12 py-9 rounded-[40px] border border-[var(--color-divider)]/50 shadow-3xl focus:border-[var(--color-primary)] outline-none transition-all duration-500 text-2xl bg-surface-primary/80 backdrop-blur-xl text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] font-bold"
              placeholder="Czego szukasz? Wpisz słowa kluczowe..."
            />
            {query && (
               <button 
                  onClick={() => setQuery('')}
                  className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
               >
                  <span className="material-symbols-outlined text-xl">close</span>
               </button>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-8">
        {/* --- CATEGORIES SECTION --- */}
        <div className="mb-40">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 text-center md:text-left">
            <div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-3 block">Wybierz Temat</span>
               <h2 className="text-4xl font-bold tracking-tighter text-[var(--color-on-background)]">Kategorie tematyczne</h2>
            </div>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 bg-[var(--color-primary)]/10 px-8 py-4 rounded-2xl border border-[var(--color-primary)]/10"
              >
                Pokaż wszystkie
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {d.categories.map((c, i) => {
              const isActive = selectedCategory === c.title;
              return (
                <motion.button
                  key={i}
                  variants={itemVariants}
                  onClick={() => setSelectedCategory(isActive ? null : c.title)}
                  className={`relative p-12 rounded-[48px] border transition-all duration-700 group text-center flex flex-col items-center overflow-hidden ${isActive ? 'bg-[var(--color-primary)] border-transparent shadow-2xl shadow-[var(--color-primary)]/30 scale-[1.05] -translate-y-4' : 'bg-surface-primary border-[var(--color-divider)]/50 shadow-xl hover:shadow-2xl hover:-translate-y-2'}`}
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                  <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-8 transition-all duration-700 shadow-inner ${isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white'}`}>
                    <span className="material-symbols-outlined text-4xl">{c.icon}</span>
                  </div>
                  <h3 className={`font-bold text-2xl mb-3 transition-colors tracking-tight ${isActive ? 'text-white' : 'text-[var(--color-on-background)]'}`}>{c.title}</h3>
                  <div className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isActive ? 'text-white/60' : 'text-[var(--color-text-faint)]'}`}>
                    {c.count} artykułów
                  </div>
                  
                  {isActive && (
                    <div className="absolute top-6 right-6 text-white/40">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-6 block">Baza Wiedzy</span>
            <h2 className="text-5xl sm:text-6xl font-bold mb-8 tracking-tighter text-[var(--color-on-background)]">Najczęściej zadawane pytania</h2>
            {selectedCategory && (
              <p className="text-[var(--color-text-muted)] text-xl font-medium">
                Przeglądasz: <span className="text-[var(--color-primary)] font-black uppercase tracking-widest text-sm bg-[var(--color-primary)]/5 px-6 py-2 rounded-xl ml-2">{selectedCategory}</span>
              </p>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {visibleFaq.length > 0 ? (
              <motion.div 
                key="faq-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                {visibleFaq.map((f) => (
                  <HelpFaqItem key={f.q} question={f.q || ''} answer={f.a || ''} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="no-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[60px] border border-[var(--color-divider)]/50 bg-surface-primary p-24 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                <div className="w-28 h-28 bg-surface-container rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-inner">
                  <span className="material-symbols-outlined text-6xl text-[var(--color-text-faint)]">search_off</span>
                </div>
                <h3 className="text-4xl font-bold mb-6 tracking-tighter">Brak wyników wyszukiwania</h3>
                <p className="text-[var(--color-text-muted)] text-xl max-w-lg mx-auto leading-relaxed font-medium opacity-80">
                  Niestety nie znaleźliśmy odpowiedzi na Twoje zapytanie. Spróbuj użyć innych słów kluczowych lub skontaktuj się z nami bezpośrednio.
                </p>
                <button 
                  onClick={() => { setQuery(''); setSelectedCategory(null); }}
                  className="mt-12 text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-4 mx-auto bg-[var(--color-primary)] px-12 py-6 rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--color-primary)]/20"
                >
                  Resetuj filtry
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- CTA SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 relative group"
        >
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 blur-[140px] rounded-[60px] opacity-20 -z-10" />
          
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover, #0d9488)] rounded-[80px] p-20 sm:p-40 text-center text-white shadow-3xl relative overflow-hidden">
            {/* Animated patterns */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.06] pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] animate-float-slow" />
            <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-black/10 rounded-full blur-[120px]" />
            
            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="w-24 h-24 bg-white/10 rounded-[32px] backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-14 shadow-inner group-hover:scale-110 transition-premium">
                 <span className="material-symbols-outlined text-5xl opacity-40">support_agent</span>
              </div>
              
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-16 tracking-tighter leading-[0.95] drop-shadow-2xl">
                 {d.ctaTitle}
              </h2>
              <p className="text-xl sm:text-2xl opacity-90 mb-20 max-w-3xl mx-auto leading-relaxed font-medium">
                {d.ctaSubtitle}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <a
                  href={`tel:${(d.contactPhone || '+48 22 123 45 67').replace(/\s+/g, '')}`}
                  className="group/btn bg-white text-[var(--color-primary)] px-8 py-8 rounded-[40px] font-black text-lg hover:scale-105 transition-all duration-500 shadow-2xl active:scale-95 flex flex-col items-center gap-6 uppercase tracking-widest"
                >
                  <div className="w-16 h-16 rounded-3xl bg-[var(--color-primary)]/5 flex items-center justify-center group-hover/btn:bg-[var(--color-primary)] group-hover/btn:text-white transition-all duration-500">
                    <span className="material-symbols-outlined text-3xl">call</span>
                  </div>
                  Infolinia
                </a>
                <a
                  href={`mailto:${d.contactEmail || 'kontakt@paletbroker.pl'}`}
                  className="group/btn bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-8 rounded-[40px] font-black text-lg hover:bg-white/20 transition-all duration-500 hover:scale-105 active:scale-95 flex flex-col items-center gap-6 uppercase tracking-widest"
                >
                  <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-[var(--color-primary)] transition-all duration-500">
                    <span className="material-symbols-outlined text-3xl">mail</span>
                  </div>
                  Napisz e-mail
                </a>
                <Link
                  href="/kontakt"
                  className="group/btn bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-8 rounded-[40px] font-black text-lg hover:bg-white/20 transition-all duration-500 hover:scale-105 active:scale-95 flex flex-col items-center gap-6 uppercase tracking-widest"
                >
                  <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-[var(--color-primary)] transition-all duration-500">
                    <span className="material-symbols-outlined text-3xl">chat</span>
                  </div>
                  Formularz
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

