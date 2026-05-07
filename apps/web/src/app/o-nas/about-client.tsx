'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface AboutStat {
  value: string;
  label: string;
}

interface AboutValue {
  title: string;
  icon: string;
  desc: string;
}

interface TeamMember {
  name: string;
  role: string;
  icon: string;
}

interface AboutData {
  heroTitle?: string;
  heroDesc?: string;
  heroStats?: AboutStat[];
  quote?: string;
  quoteAuthor?: string;
  values?: AboutValue[];
  team?: TeamMember[];
  ctaTitle?: string;
}

export const AboutClient = ({ data }: { data: AboutData }) => {
  return (
    <main className="pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center max-w-4xl mx-auto">
          <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-6 block">O nas</span>
          <h1 className="font-display-bold text-5xl font-bold text-[var(--color-on-background)] mb-6 tracking-tight">{data.heroTitle}</h1>
          <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed opacity-80 max-w-2xl mx-auto">{data.heroDesc}</p>
        </motion.div>

        {/* Stats */}
        {data.heroStats && data.heroStats.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-8 mb-24">
            {data.heroStats.map((stat, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-[32px] border border-[var(--color-divider)] shadow-sm">
                <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">{stat.value}</div>
                <div className="text-sm text-slate-500 font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Quote */}
        {data.quote && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mb-24 text-center max-w-3xl mx-auto">
            <span className="material-symbols-outlined text-6xl text-[var(--color-primary)] opacity-20 mb-4 block">format_quote</span>
            <blockquote className="text-2xl font-medium text-[var(--color-on-background)] italic leading-relaxed mb-4">
              {data.quote}
            </blockquote>
            <cite className="text-slate-400 not-italic font-bold">{data.quoteAuthor}</cite>
          </motion.div>
        )}

        {/* Values */}
        {data.values && data.values.length > 0 && (
          <div className="mb-24">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Nasze wartości</h2>
              <p className="text-slate-500 text-lg">Co nas wyróżnia na rynku logistyki paletowej</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.values.map((val, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-10 bg-white rounded-[32px] border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium group">
                  <span className="material-symbols-outlined text-5xl text-[var(--color-primary)] mb-6 block group-hover:scale-110 transition-transform">{val.icon}</span>
                  <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Team */}
        {data.team && data.team.length > 0 && (
          <div className="mb-24">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Zespół</h2>
              <p className="text-slate-500 text-lg">Ludzie, którzy stoją za sukcesem PaletyBroker</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.team.map((member, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white rounded-[28px] border border-[var(--color-divider)] shadow-sm text-center hover:shadow-lg transition-premium group">
                  <span className="material-symbols-outlined text-5xl text-slate-300 mb-4 block group-hover:text-[var(--color-primary)] transition-colors">{member.icon}</span>
                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-slate-400">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {data.ctaTitle && (
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center p-16 bg-[var(--color-primary)] rounded-[40px] text-white">
            <h2 className="text-3xl font-bold mb-6 whitespace-pre-line">{data.ctaTitle}</h2>
            <Link href="/kontakt" className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
              Skontaktuj się z nami <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
};
