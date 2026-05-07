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
    <main className="pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center max-w-4xl mx-auto">
          <span className="inline-block bg-[var(--color-primary)] text-white text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest uppercase">
            {data.heroBadge}
          </span>
          <h1 className="font-display-bold text-5xl font-bold text-[var(--color-on-background)] mb-6 tracking-tight">{data.heroTitle}</h1>
          <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed opacity-80 max-w-2xl mx-auto">{data.heroDesc}</p>
          <div className="flex gap-4 justify-center mt-10">
            <Link href="/kontakt" className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform inline-flex items-center gap-2">
              Zapytaj o ofertę <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link href="/wycena" className="border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
              Wyceń przesyłkę
            </Link>
          </div>
        </motion.div>

        {/* Benefits */}
        {data.benefits && data.benefits.length > 0 && (
          <div className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.benefits.map((benefit, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white rounded-[28px] border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium group">
                  <span className="material-symbols-outlined text-4xl text-[var(--color-primary)] mb-4 block group-hover:scale-110 transition-transform">{benefit.icon}</span>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations */}
        {data.integrations && data.integrations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center p-16 bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Integracje z Twoimi narzędziami</h2>
            <p className="text-slate-500 mb-10 max-w-xl mx-auto">Łączymy się bezpośrednio z najpopularniejszymi systemami ERP i platformami e-commerce.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {data.integrations.map((name, i) => (
                <span key={i} className="px-6 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-700 border border-slate-100 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-default">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};
