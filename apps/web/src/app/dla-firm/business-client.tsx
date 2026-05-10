'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

interface Benefit {
  title: string;
  icon: string;
  desc: string;
}

interface BusinessData {
  heroBadge?: string;
  heroTitle?: string;
  heroDesc?: string;
  benefits?: Benefit[];
  integrations?: string[];
}

export const BusinessClient = ({ data }: { data: BusinessData }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="pb-32 bg-background min-h-screen overflow-hidden">
        <section className="relative pt-24 pb-32 overflow-hidden px-8">
           <div className="max-w-[1280px] mx-auto text-center">
             <h1 className="font-display-bold text-5xl md:text-8xl font-bold text-[var(--color-on-background)] mb-10 tracking-tighter leading-tight max-w-5xl mx-auto">
               {data.heroTitle}
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
        <div className="absolute top-0 right-0 w-[1000px] h-[800px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-[var(--color-primary)]/10 blur-[100px] rounded-full -z-10 animate-pulse" />
        
        <div className="max-w-[1280px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-block px-6 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border border-[var(--color-primary)]/10">
              {data.heroBadge}
            </span>
            <h1 className="font-display-bold text-5xl md:text-8xl font-bold text-[var(--color-on-background)] mb-10 tracking-tighter leading-tight max-w-5xl mx-auto">
              {data.heroTitle}
            </h1>
            <p className="text-[var(--color-on-surface-variant)] text-xl md:text-3xl mb-16 max-w-3xl mx-auto leading-relaxed opacity-80 font-medium">
              {data.heroDesc}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/kontakt" 
                className="group inline-flex items-center gap-4 bg-[var(--color-primary)] text-white px-12 py-6 rounded-2xl font-bold text-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl shadow-[var(--color-primary)]/20 active:scale-95"
              >
                Zapytaj o ofertę 
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
              <Link 
                href="/wycena" 
                className="inline-flex items-center gap-4 bg-surface-primary border border-[var(--color-divider)] text-[var(--color-on-background)] px-12 py-6 rounded-2xl font-bold text-xl hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-300 active:scale-95 shadow-sm"
              >
                Wyceń przesyłkę
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-8 relative z-10">
        {/* --- BENEFITS GRID --- */}
        {data.benefits && data.benefits.length > 0 && (
          <div className="mb-48">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Zalety programu partnerskiego</span>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter text-[var(--color-on-background)]">Dlaczego warto nam zaufać?</h2>
              <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto mt-8 opacity-20" />
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {data.benefits.map((benefit, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="p-12 bg-surface-primary rounded-[56px] border border-[var(--color-divider)] shadow-xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute -bottom-12 -right-12 text-[var(--color-primary)] opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <span className="material-symbols-outlined text-[160px]">{benefit.icon}</span>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-500 shadow-inner">
                    <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-[var(--color-on-background)] tracking-tight">{benefit.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-lg leading-relaxed font-medium opacity-80">{benefit.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* --- INTEGRATIONS SECTION --- */}
        {data.integrations && data.integrations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-16 md:p-32 bg-surface-container/50 rounded-[60px] border border-[var(--color-divider)] shadow-inner group overflow-hidden relative backdrop-blur-sm"
          >
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--color-primary)] opacity-5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[10px] mb-8 block">Ekosystem Technologiczny</span>
              <h2 className="text-4xl md:text-7xl font-bold mb-8 tracking-tighter text-[var(--color-on-background)] leading-none">Integracje, które oszczędzają czas</h2>
              <p className="text-[var(--color-text-muted)] text-xl md:text-2xl mb-16 leading-relaxed font-medium opacity-80">Łączymy się bezpośrednio z Twoim systemem ERP lub sklepem e-commerce, aby zautomatyzować proces wysyłki palet od A do Z.</p>
              
              <div className="flex flex-wrap gap-6 justify-center">
                {data.integrations.map((name, i) => (
                  <motion.span 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-10 py-5 bg-surface-primary rounded-3xl text-sm font-black uppercase tracking-widest text-[var(--color-on-background)] border border-[var(--color-divider)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-default shadow-sm"
                  >
                    {name}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};
