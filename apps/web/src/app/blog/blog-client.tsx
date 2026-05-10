'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useToastStore } from '@/lib/store/toast-store';
import { getApiBaseUrl } from '@/lib/api-url';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
}

export function BlogClient({ 
  articles, 
  newsletterTitle, 
  newsletterDesc 
}: { 
  articles: Article[];
  newsletterTitle: string; 
  newsletterDesc: string 
}) {
  const [isSubscribing, setIsSubscribing] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { addToast } = useToastStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    const form = e.target as HTMLFormElement;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;

    try {
      const res = await fetch(`${getApiBaseUrl()}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        addToast({
          title: 'Sukces!',
          description: 'Dziękujemy za zapis do newslettera.',
          type: 'success',
        });
        form.reset();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Błąd zapisu.');
      }
    } catch (error) {
      addToast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się zapisać.',
        type: 'error',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!mounted) {
    return (
      <main className="pb-32 bg-background min-h-screen">
        <section className="relative pt-24 pb-32 overflow-hidden px-8">
           <div className="max-w-[1280px] mx-auto text-center">
             <h1 className="font-display-bold text-5xl md:text-8xl font-bold text-[var(--color-on-background)] mb-8 tracking-tighter leading-none">
               Centrum Wiedzy Logistycznej
             </h1>
           </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pb-32 bg-background min-h-screen overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-32 overflow-hidden px-8">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-[var(--color-primary)]/10 blur-[100px] rounded-full -z-10 animate-pulse" />
        
        <div className="max-w-[1280px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-block px-6 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border border-[var(--color-primary)]/10">
              Blog & Baza Wiedzy
            </span>
            <h1 className="font-display-bold text-5xl md:text-8xl font-bold text-[var(--color-on-background)] mb-8 tracking-tighter leading-none">
              Centrum Wiedzy <br />
              <span className="text-[var(--color-primary)]">Logistycznej</span>
            </h1>
            <p className="text-[var(--color-on-surface-variant)] text-xl md:text-3xl mb-16 max-w-3xl mx-auto leading-relaxed opacity-80 font-medium">
              Najnowsze wieści z branży, poradniki eksperckie i technologia, która rewolucjonizuje transport paletowy.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-8 relative z-10">
        {articles.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-32 text-center bg-surface-primary rounded-[60px] border border-[var(--color-divider)] shadow-inner relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
            <div className="w-24 h-24 bg-[var(--color-primary)]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-[var(--color-primary)]/10">
              <span className="material-symbols-outlined text-5xl text-[var(--color-primary)]">post_add</span>
            </div>
            <h3 className="text-3xl font-bold text-[var(--color-on-background)] mb-4 tracking-tight">Cisza przed burzą...</h3>
            <p className="text-[var(--color-text-faint)] text-xl font-medium max-w-md mx-auto leading-relaxed">
              Obecnie przygotowujemy nowe, merytoryczne artykuły. Zapraszamy do powrotu wkrótce!
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {articles.map((post) => (
              <motion.div key={post.slug} variants={itemVariants}>
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="group block bg-surface-primary rounded-[48px] overflow-hidden border border-[var(--color-divider)]/50 shadow-xl hover:shadow-3xl transition-all duration-500 flex flex-col h-full relative"
                >
                  <div className="aspect-[16/10] bg-surface-container flex items-center justify-center relative overflow-hidden">
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <span className="material-symbols-outlined text-8xl text-[var(--color-primary)] opacity-10 group-hover:scale-125 group-hover:opacity-30 transition-all duration-1000 ease-out">article</span>
                    
                    {/* Category Tag on Image */}
                    <div className="absolute top-6 left-6">
                      <span className="px-5 py-2.5 bg-white/90 dark:bg-surface-primary/90 backdrop-blur-xl rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)] shadow-xl border border-white/20">
                        {post.category || 'Logistyka'}
                      </span>
                    </div>

                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                       <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xl shadow-[var(--color-primary)]/30">
                          <span className="material-symbols-outlined">arrow_forward</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-10 flex-grow flex flex-col">
                    <div className="flex items-center gap-3 mb-6 text-[10px] text-[var(--color-text-faint)] font-black uppercase tracking-[0.2em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Aktualność'}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-[var(--color-on-background)] mb-6 leading-tight group-hover:text-[var(--color-primary)] transition-colors tracking-tighter line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-[var(--color-text-muted)] text-lg leading-relaxed mb-10 line-clamp-3 font-medium opacity-80">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-8 border-t border-[var(--color-divider)] flex items-center justify-between text-[var(--color-primary)] font-bold">
                      <span className="flex items-center gap-3 text-sm uppercase tracking-widest group-hover:gap-5 transition-all">
                        Czytaj więcej
                        <span className="material-symbols-outlined text-sm">trending_flat</span>
                      </span>
                      <div className="flex -space-x-3">
                         <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 border-2 border-[var(--color-surface-primary)] flex items-center justify-center text-[var(--color-primary)]">
                            <span className="material-symbols-outlined text-xs">share</span>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 border-2 border-[var(--color-surface-primary)] flex items-center justify-center text-[var(--color-primary)]">
                            <span className="material-symbols-outlined text-xs">bookmark</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* --- NEWSLETTER SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 relative group"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 blur-[120px] rounded-[60px] opacity-20 -z-10" />
          
          <div className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-surface-primary)] dark:from-[#0f172a] dark:to-[#020617] rounded-[60px] p-12 md:p-24 border border-[var(--color-divider)]/50 shadow-3xl relative overflow-hidden text-center">
            {/* Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
            
            <AnimatePresence>
              {isSubscribing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center rounded-[60px]"
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[var(--color-primary)]/20"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">Magia się dzieje...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="w-24 h-24 bg-[var(--color-primary)] rounded-[32px] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-[var(--color-primary)]/20 group-hover:scale-110 transition-premium">
                <span className="material-symbols-outlined text-white text-4xl">mail_lock</span>
              </div>
              
              <h2 className="text-4xl md:text-7xl font-bold mb-10 tracking-tighter leading-[1.1] text-[var(--color-on-background)]">
                {newsletterTitle.split(' ').map((word, i) => (
                  <span key={i} className={i === 2 ? 'text-[var(--color-primary)]' : ''}>{word} </span>
                ))}
              </h2>
              
              <p className="text-xl md:text-2xl text-[var(--color-text-muted)] mb-16 max-w-2xl mx-auto leading-relaxed font-medium opacity-90">
                {newsletterDesc}
              </p>
              
              <form onSubmit={handleSubscribe} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 p-3 bg-surface-container/50 backdrop-blur-md rounded-[32px] border border-[var(--color-divider)]/30">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)]">alternate_email</span>
                  <input 
                    required 
                    type="email" 
                    className="w-full pl-16 pr-6 py-5 rounded-2xl bg-transparent text-[var(--color-on-background)] outline-none transition-all placeholder:text-[var(--color-text-faint)] text-lg font-bold" 
                    placeholder="Adres e-mail" 
                  />
                </div>
                <button 
                  disabled={isSubscribing} 
                  className="bg-[var(--color-primary)] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[var(--color-primary-hover)] transition-all shadow-xl shadow-[var(--color-primary)]/20 active:scale-95 disabled:opacity-50"
                >
                  Dołącz teraz
                </button>
              </form>
              
              <div className="mt-10 flex items-center justify-center gap-8 text-[10px] font-black text-[var(--color-text-faint)] uppercase tracking-[0.3em]">
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[var(--color-primary)]">verified</span>
                    Brak spamu
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[var(--color-primary)]">lock</span>
                    Dane bezpieczne
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[var(--color-primary)]">bolt</span>
                    Zero nudy
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
