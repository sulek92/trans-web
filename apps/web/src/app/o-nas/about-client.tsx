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
    <main className="pb-24 bg-[var(--color-background)] min-h-screen transition-colors duration-500">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20 text-center max-w-4xl mx-auto pt-24">
          <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-6 block">O nas</span>
          <h1 className="font-display font-bold text-5xl sm:text-6xl text-[var(--color-on-background)] mb-8 tracking-tight">{data.heroTitle}</h1>
          <p className="text-[var(--color-text-muted)] text-xl leading-relaxed max-w-2xl mx-auto">{data.heroDesc}</p>
        </motion.div>

        {/* Stats */}
        {data.heroStats && data.heroStats.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {data.heroStats.map((stat, i) => (
              <div key={i} className="text-center p-10 bg-[var(--color-surface-primary)] rounded-[32px] border border-[var(--color-divider)] shadow-sm">
                <div className="text-5xl font-display font-bold text-[var(--color-primary)] mb-3 tracking-tight">{stat.value}</div>
                <div className="text-xs text-[var(--color-text-faint)] font-black uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Quote */}
        {data.quote && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mb-32 text-center max-w-3xl mx-auto relative group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-primary)] opacity-5 scale-[3]">
              <span className="material-symbols-outlined text-[120px]">format_quote</span>
            </div>
            <blockquote className="text-3xl font-medium text-[var(--color-on-background)] italic leading-relaxed mb-6 relative z-10">
              &ldquo;{data.quote}&rdquo;
            </blockquote>
            <cite className="text-[var(--color-text-faint)] not-italic font-bold uppercase tracking-[0.2em] text-xs">{data.quoteAuthor}</cite>
          </motion.div>
        )}

        {/* Values */}
        {data.values && data.values.length > 0 && (
          <div className="mb-32">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-16">
              <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-4 block">Filary naszej firmy</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-[var(--color-on-background)]">Nasze wartości</h2>
              <p className="text-[var(--color-text-muted)] text-lg max-w-xl mx-auto">Co nas wyróżnia na rynku nowoczesnej logistyki paletowej.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.values.map((val, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-12 bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)] shadow-sm hover:shadow-2xl transition-premium group text-left">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
                    <span className="material-symbols-outlined text-3xl">{val.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[var(--color-on-background)] tracking-tight">{val.title}</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Team */}
        {data.team && data.team.length > 0 && (
          <div className="mb-32">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-16">
              <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-4 block">Eksperci TSL</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-[var(--color-on-background)]">Poznaj nasz zespół</h2>
              <p className="text-[var(--color-text-muted)] text-lg">Ludzie, którzy stoją za sukcesem PaletyBroker.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.team.map((member, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-10 bg-[var(--color-surface-primary)] rounded-[32px] border border-[var(--color-divider)] shadow-sm text-center hover:shadow-xl hover:-translate-y-2 transition-premium group">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-primary-highlight)] flex items-center justify-center mx-auto mb-6 shadow-inner border border-[var(--color-primary)]/10">
                    <span className="material-symbols-outlined text-5xl text-[var(--color-primary)] group-hover:scale-110 transition-transform">{member.icon}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-1 text-[var(--color-on-background)] tracking-tight">{member.name}</h3>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {data.ctaTitle && (
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center p-16 sm:p-24 bg-[var(--color-primary)] rounded-[60px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
               <span className="material-symbols-outlined text-[200px]">handshake</span>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-10 whitespace-pre-line tracking-tight">{data.ctaTitle}</h2>
              <Link href="/kontakt" className="inline-flex items-center gap-3 bg-white text-[var(--color-primary)] px-10 py-5 rounded-[20px] font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all shadow-xl active:scale-95">
                Skontaktuj się z nami <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};
