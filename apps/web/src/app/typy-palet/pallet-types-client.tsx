'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

interface PalletType {
  name: string;
  dims: string;
  weight: string;
  capacity: string;
  desc: string;
  icon: string;
}

interface PalletData {
  palletTypes?: PalletType[];
  measurementTips?: string[];
}

const HARDCODED_FALLBACK: PalletData = {
  palletTypes: [
    { name: 'Paleta Euro (EPAL)', dims: '1200 x 800 mm', weight: 'ok. 25 kg', capacity: 'do 1500 kg', desc: 'Najpopularniejszy standard w Europie. Posiada standaryzowane oznaczenia EPAL/EUR. Idealna do transportu międzynarodowego.', icon: 'widgets' },
    { name: 'Paleta Przemysłowa', dims: '1200 x 1000 mm', weight: 'ok. 30 kg', capacity: 'do 2000 kg', desc: 'Szersza wersja palety, często stosowana w przemyśle spożywczym i chemicznym. Zapewnia większą powierzchnię załadunku.', icon: 'category' },
    { name: 'Półpaleta', dims: '600 x 800 mm', weight: 'ok. 10 kg', capacity: 'do 500 kg', desc: 'Zajmuje połowę miejsca palety Euro. Często wykorzystywana do ekspozycji towaru w sklepach (tzw. paleta displayowa).', icon: 'view_quilt' },
  ],
  measurementTips: [
    'Zawsze podawaj wymiary całkowite (podstawa + towar).',
    'Towar nie powinien wystawać poza obrys palety.',
    'Wysokość palety mierzymy od podłoża do najwyższego punktu towaru.',
    'Waga rzeczywista obejmuje wagę towaru wraz z paletą i opakowaniem.',
  ],
};

export const PalletTypesClient = ({ data }: { data: PalletData }) => {
  const types = data?.palletTypes?.length ? data.palletTypes : HARDCODED_FALLBACK.palletTypes!;
  const tips = data?.measurementTips?.length ? data.measurementTips : HARDCODED_FALLBACK.measurementTips!;

  const palletTypeParam = (name: string) => {
    if (name.includes('Euro') && !name.includes('Pół')) return 'euro';
    if (name.includes('Przemysłowa')) return 'industrial';
    return 'half';
  };

  return (
    <main className="pb-32 bg-[var(--color-background)] min-h-screen overflow-hidden">
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
              Przewodnik po Standardach
            </span>
            <h1 className="font-display-bold text-5xl md:text-8xl font-bold text-[var(--color-on-background)] mb-10 tracking-tighter leading-none">
              Typy Palet <span className="text-[var(--color-primary)]">Transportowych</span>
            </h1>
            <p className="text-[var(--color-on-surface-variant)] text-xl md:text-3xl mb-16 max-w-4xl mx-auto leading-relaxed opacity-80 font-medium">
              Prawidłowy dobór nośnika to klucz do bezpiecznego i ekonomicznego transportu. Poznaj wymiary, nośności i standardy stosowane w logistyce.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-8 relative z-10">
        {/* --- PALLET CARDS GRID --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {types.map((t, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="bg-[var(--color-surface-primary)] rounded-[56px] border border-[var(--color-divider)] shadow-xl overflow-hidden flex flex-col hover:shadow-3xl transition-all duration-500 group relative"
            >
              <div className="p-16 bg-[var(--color-surface-container)]/50 flex items-center justify-center relative overflow-hidden">
                {/* Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="material-symbols-outlined text-[120px] text-[var(--color-primary)] opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700">
                  {t.icon}
                </span>
              </div>
              
              <div className="p-12 flex-grow flex flex-col">
                <h2 className="text-3xl font-bold mb-10 tracking-tight text-[var(--color-on-background)] leading-tight">{t.name}</h2>
                
                <div className="space-y-6 mb-12">
                  {[
                    { l: 'Wymiary', v: t.dims, icon: 'straighten' }, 
                    { l: 'Waga własna', v: t.weight, icon: 'weight' }, 
                    { l: 'Nośność', v: t.capacity, icon: 'fitness_center' }
                  ].map((row, j) => (
                    <div key={j} className="flex justify-between items-center py-4 border-b border-[var(--color-divider)] last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-sm text-[var(--color-primary)] opacity-40">{row.icon}</span>
                        <span className="text-[var(--color-text-faint)] font-bold text-[10px] uppercase tracking-widest">{row.l}</span>
                      </div>
                      <span className="font-bold text-[var(--color-on-background)] text-lg tracking-tight">{row.v}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-[var(--color-text-muted)] text-lg leading-relaxed mb-12 font-medium opacity-80">{t.desc}</p>
                
                <Link 
                  href={`/wycena?palletType=${palletTypeParam(t.name)}`} 
                  className="mt-auto w-full py-6 rounded-2xl bg-[var(--color-surface-primary)] border-2 border-[var(--color-divider)] text-[var(--color-on-background)] font-bold text-lg hover:bg-[var(--color-primary)] hover:text-white hover:border-transparent transition-all duration-300 text-center block shadow-sm active:scale-95"
                >
                  Wyceń transport
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* --- MEASUREMENT GUIDE SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 p-16 md:p-32 bg-[var(--color-surface-primary)] rounded-[60px] border border-[var(--color-divider)] shadow-3xl relative overflow-hidden group"
        >
          {/* Background Patterns */}
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
            <span className="material-symbols-outlined text-[300px] group-hover:rotate-12 transition-transform duration-1000">straighten</span>
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            <div>
              <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[10px] mb-8 block">Wsparcie Eksperckie</span>
              <h2 className="text-4xl md:text-7xl font-bold mb-12 tracking-tighter leading-none text-[var(--color-on-background)]">Jak prawidłowo zmierzyć przesyłkę?</h2>
              
              <ul className="space-y-8">
                {tips.map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex gap-6 items-start group/tip"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-1 group-hover/tip:scale-110 group-hover/tip:bg-[var(--color-primary)] group-hover/tip:text-white transition-all duration-300 shadow-inner">
                      <span className="material-symbols-outlined text-lg font-bold">check</span>
                    </div>
                    <span className="text-[var(--color-text-muted)] text-xl leading-relaxed font-medium opacity-80">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] bg-[var(--color-surface-container)] rounded-[60px] flex items-center justify-center border border-[var(--color-divider)] group-hover:shadow-2xl transition-all duration-700 relative overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-50" />
                <span className="material-symbols-outlined text-[160px] text-[var(--color-divider)] group-hover:scale-110 group-hover:text-[var(--color-primary)] transition-all duration-700">
                  architecture
                </span>
                
                {/* Decorative Dimension Lines */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-px bg-[var(--color-primary)]/20 animate-pulse">
                  <div className="absolute left-0 -top-1 w-px h-3 bg-[var(--color-primary)]/40" />
                  <div className="absolute right-0 -top-1 w-px h-3 bg-[var(--color-primary)]/40" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};
