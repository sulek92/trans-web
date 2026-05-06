'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface AboutData {
  heroTitle: string;
  heroDesc: string;
  heroStats: { value: string; label: string }[];
  quote: string;
  quoteAuthor: string;
  values: { title: string; icon: string; desc: string }[];
  team: { name: string; role: string; icon: string }[];
  ctaTitle: string;
}

export function AboutClient({ data: d }: { data: AboutData }) {
  const ctaParts = d.ctaTitle.split('\n');

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-8 mb-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10"
          >
            <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-4 block">Nasza Historia</span>
            <h1 className="font-display-bold text-6xl font-bold text-[var(--color-on-background)] mb-8 leading-[1.1]">
              {d.heroTitle.includes('logistyce') ? (<>{d.heroTitle.split('logistyce')[0]}<span className="text-[var(--color-primary)]">logistyce{d.heroTitle.split('logistyce')[1]}</span></>) : d.heroTitle}
            </h1>
            <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed mb-10">{d.heroDesc}</p>
            <div className="flex gap-12 border-t border-[var(--color-divider)] pt-10">
              {d.heroStats.map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-4xl font-bold text-[var(--color-on-background)] mb-1">{s.value}</div>
                  <div className="text-xs text-[var(--color-on-surface-variant)] uppercase font-bold tracking-widest opacity-50">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative group"
          >
            <div className="aspect-[4/5] bg-slate-200 rounded-[60px] overflow-hidden border-8 border-white shadow-2xl relative">
               <div className="absolute inset-0 bg-[var(--color-primary)] opacity-10 group-hover:opacity-0 transition-opacity"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[200px] text-white opacity-20 group-hover:scale-110 transition-premium">inventory_2</span>
               </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[40px] shadow-2xl border border-[var(--color-divider)] max-w-[280px]"
            >
               <div className="font-bold text-xl leading-tight mb-4">&ldquo;{d.quote}&rdquo;</div>
               <div className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest">{d.quoteAuthor}</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-32 border-b border-[var(--color-divider)] relative">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold mb-6">Wartości, które nas definiują</h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg max-w-2xl mx-auto">Dlaczego najwięksi gracze na rynku wybierają współpracę z PaletBroker?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {d.values.map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-3xl bg-[var(--color-surface-container-low)] text-[var(--color-primary)] flex items-center justify-center mb-8 shadow-inner transition-premium group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-4xl">{v.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Placeholder (Premium) */}
      <section className="py-32 bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-24">
            <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-4 block">Nasza Droga</span>
            <h2 className="text-4xl font-bold">Kamienie milowe</h2>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block"></div>
            <div className="space-y-24">
              {[
                { year: '2019', title: 'Start projektu', desc: 'Pierwsza wersja algorytmu wyceny.' },
                { year: '2021', title: '100 000 palet', desc: 'Dynamiczny wzrost i zaufanie kluczowych partnerów.' },
                { year: '2023', title: 'Nowy system API', desc: 'Pełna automatyzacja procesów dla e-commerce.' },
                { year: 'Dziś', title: 'Lider innowacji', desc: 'Ciągły rozwój i wyznaczanie standardów w B2B.' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-0`}
                >
                  <div className="flex-1 md:w-1/2 flex justify-center">
                    <div className={`max-w-sm p-8 bg-white rounded-3xl border border-slate-100 shadow-xl ${i % 2 === 0 ? 'md:mr-16' : 'md:ml-16'}`}>
                      <div className="text-[var(--color-primary)] font-bold text-2xl mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] border-4 border-white shadow-xl z-10 hidden md:flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  </div>
                  <div className="flex-1 md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 bg-[var(--color-background)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
            <div className="max-w-2xl">
              <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-4 block">Eksperci</span>
              <h2 className="text-4xl font-bold mb-6">Ludzie, którzy napędzają Twoją logistykę</h2>
              <p className="text-[var(--color-on-surface-variant)] text-lg">Nasz zespół to połączenie pasji do transportu i nowoczesnych technologii IT.</p>
            </div>
            <Link href="/kariera" className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-bold hover:bg-[var(--color-surface-tint)] transition-premium shadow-lg">Dołącz do nas</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {d.team.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[40px] border border-[var(--color-divider)] text-center group hover:shadow-2xl transition-premium"
              >
                <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto mb-6 flex items-center justify-center text-slate-300 group-hover:bg-[var(--color-primary-highlight)] group-hover:text-[var(--color-primary)] transition-colors">
                  <span className="material-symbols-outlined text-5xl">{m.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{m.name}</h3>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-8 mb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-[1280px] mx-auto bg-[var(--color-primary)] rounded-[60px] p-20 text-white text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <h2 className="text-5xl font-bold mb-8 relative z-10 leading-tight">{ctaParts[0]}<br/>{ctaParts[1] || ''}</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Link href="/wycena" className="bg-white text-[var(--color-primary)] px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-premium shadow-xl">Wyceń pierwszą paletę</Link>
            <Link href="/kontakt" className="bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-premium">Porozmawiaj z doradcą</Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
