'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BusinessLeadForm } from '@/components/business/lead-form';

interface BusinessData {
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  benefits: { title: string; icon: string; desc: string }[];
  integrations: string[];
}

export function BusinessClient({ data: d }: { data: BusinessData }) {
  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-8 mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="bg-[#005258] rounded-[40px] p-20 text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse"></div>
          <div className="relative z-10 max-w-2xl">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/20"
            >
              {d.heroBadge}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold mb-8 leading-[1.1]"
            >
              {d.heroTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl opacity-80 mb-12 leading-relaxed"
            >
              {d.heroDesc}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/rejestracja" className="bg-white text-[#005258] px-10 py-5 rounded-2xl font-bold hover:bg-slate-100 transition-premium shadow-xl active:scale-95">Załóż konto firmowe</Link>
              <Link href="/kontakt" className="border border-white/30 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-premium active:scale-95">Porozmawiaj z doradcą</Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Benefits Grid */}
      <section className="max-w-[1280px] mx-auto px-8 mb-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-[var(--color-on-background)] mb-4">Wartości dla Twojego biznesu</h2>
          <p className="text-[var(--color-on-surface-variant)] text-lg">Kompletny ekosystem logistyczny zaprojektowany dla profesjonalistów.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {d.benefits.map((benefit, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium hover:-translate-y-2 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center mb-8 transition-premium group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">{benefit.icon}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Integration Logos */}
      <section className="bg-white py-24 border-y border-[var(--color-divider)] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-16">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Gotowe integracje</h3>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="flex flex-wrap justify-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all"
          >
            {d.integrations.map(l => (
              <span key={l} className="text-2xl font-bold tracking-tighter">{l}</span>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Lead Form */}
      <section className="py-32 max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
             <h2 className="text-4xl font-bold mb-8">Zacznijmy współpracę</h2>
             <p className="text-lg text-[var(--color-on-surface-variant)] leading-relaxed mb-10">
                Wypełnij krótki formularz, a nasz doradca biznesowy przygotuje dla Ciebie indywidualną analizę kosztów logistycznych w ciągu 2 godzin.
             </p>
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">verified</span>
                   </div>
                   <div className="font-bold">Analiza kosztów bez zobowiązań</div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">verified</span>
                   </div>
                   <div className="font-bold">Dostęp do stawek hurtowych od 1. dnia</div>
                </div>
             </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <BusinessLeadForm />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
