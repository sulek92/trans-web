'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

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
  return (
    <main className="pb-24 bg-[var(--color-background)] min-h-screen transition-colors duration-500">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center max-w-4xl mx-auto pt-24">
          <span className="inline-block bg-[var(--color-primary-highlight)] text-[var(--color-primary)] text-[10px] font-black px-5 py-2 rounded-full mb-8 tracking-widest uppercase border border-[var(--color-primary)]/10 shadow-sm">
            {data.heroBadge}
          </span>
          <h1 className="font-display font-bold text-5xl sm:text-6xl text-[var(--color-on-background)] mb-8 tracking-tight">{data.heroTitle}</h1>
          <p className="text-[var(--color-text-muted)] text-xl leading-relaxed max-w-2xl mx-auto">{data.heroDesc}</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12">
            <Link href="/kontakt" className="bg-[var(--color-primary)] text-white px-10 py-5 rounded-[20px] font-bold text-lg hover:scale-[1.02] hover:shadow-2xl transition-all shadow-xl active:scale-95 inline-flex items-center justify-center gap-3">
              Zapytaj o ofertę <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link href="/wycena" className="bg-[var(--color-surface-primary)] border border-[var(--color-divider)] text-[var(--color-on-background)] px-10 py-5 rounded-[20px] font-bold text-lg hover:border-[var(--color-primary)] transition-premium shadow-lg inline-flex items-center justify-center">
              Wyceń przesyłkę
            </Link>
          </div>
        </motion.div>

        {/* Benefits */}
        {data.benefits && data.benefits.length > 0 && (
          <div className="mb-32">
             <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-16">
              <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-4 block">Zalety programu</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-[var(--color-on-background)]">Dlaczego warto?</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.benefits.map((benefit, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-10 bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)] shadow-sm hover:shadow-2xl transition-premium group text-left">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
                    <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[var(--color-on-background)] tracking-tight">{benefit.title}</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations */}
        {data.integrations && data.integrations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center p-16 sm:p-24 bg-[var(--color-surface-secondary)] rounded-[60px] border border-[var(--color-divider)] shadow-inner group overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-primary)] opacity-5 rounded-full group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10">
              <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-6 block">Technologia</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-[var(--color-on-background)]">Integracje z Twoimi narzędziami</h2>
              <p className="text-[var(--color-text-muted)] text-lg mb-16 max-w-xl mx-auto leading-relaxed">Łączymy się bezpośrednio z najpopularniejszymi systemami ERP i platformami e-commerce, aby zautomatyzować Twoją logistykę.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {data.integrations.map((name, i) => (
                  <span key={i} className="px-8 py-4 bg-[var(--color-surface-primary)] rounded-[20px] text-sm font-bold text-[var(--color-on-background)] border border-[var(--color-divider)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-lg transition-all cursor-default shadow-sm">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};
