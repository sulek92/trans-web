'use client';

import * as React from 'react';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { motion } from 'framer-motion';

interface CareersClientProps {
  cmsContent?: string;
}

export function CareersClient({ cmsContent }: CareersClientProps) {
  const { t, locale } = useTranslation();

  const content = React.useMemo(() => {
    if (!cmsContent) return t.careers;
    try {
      const parsed = JSON.parse(cmsContent);
      return {
        title: parsed.title || t.careers.title,
        subtitle: parsed.subtitle || t.careers.subtitle,
        applyNow: parsed.applyNow || t.careers.applyNow,
        whyJoin: parsed.whyJoin || t.careers.whyJoin,
        values: parsed.values && parsed.values.length > 0 ? parsed.values : t.careers.values,
        openPositions: parsed.openPositions || t.careers.openPositions,
        offers: parsed.offers && parsed.offers.length > 0 ? parsed.offers : t.careers.offers,
        noPositions: parsed.noPositions || t.careers.noPositions,
      };
    } catch {
      return t.careers;
    }
  }, [cmsContent, t.careers]);

  return (
    <div key={locale} className="max-w-[1280px] mx-auto px-4 py-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-secondary)] text-[var(--color-on-secondary)] rounded-[60px] p-12 md:p-20 mb-24 relative overflow-hidden shadow-[var(--shadow-premium)]"
      >
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">{content.title}</h1>
          <p className="text-xl md:text-2xl opacity-80 leading-relaxed mb-10 font-medium">{content.subtitle}</p>
          <button className="px-10 py-5 bg-[var(--color-on-secondary)] text-[var(--color-secondary)] font-bold rounded-2xl hover:scale-105 transition-premium shadow-xl active:scale-95">
            {content.applyNow}
          </button>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10 hidden lg:block">
          <span className="material-symbols-outlined text-[400px]">groups</span>
        </div>
      </motion.div>

      {/* Values Section */}
      <div className="mb-32">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-[var(--color-on-background)] text-center tracking-tighter">{content.whyJoin}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.values.map((v: any, i: number) => (
            <motion.div 
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-[var(--color-surface-primary)] border border-[var(--color-divider)] rounded-[48px] shadow-xl hover:shadow-2xl transition-premium group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
                <span className="material-symbols-outlined text-3xl">{v.icon}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--color-on-background)] tracking-tight">{v.title}</h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-24">
        <h2 className="text-4xl lg:text-5xl font-bold mb-16 text-[var(--color-on-background)] text-center tracking-tighter">{content.openPositions}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {content.offers.map((offer: any, i: number) => (
            <motion.div 
              key={offer.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-[var(--color-surface-primary)] p-8 rounded-[40px] border border-[var(--color-divider)] shadow-lg hover:border-[var(--color-primary)] hover:shadow-2xl transition-premium cursor-pointer flex justify-between items-center"
            >
              <div className="text-left">
                <h3 className="text-2xl font-bold text-[var(--color-on-background)] group-hover:text-[var(--color-primary)] transition-colors mb-2 tracking-tight">{offer.title}</h3>
                <div className="flex items-center gap-4 text-[var(--color-text-muted)] font-medium text-sm">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span>{offer.location}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span>{offer.type}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-highlight)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-premium shadow-inner border border-[var(--color-primary)]/10">
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </motion.div>
          ))}
        </div>
        {content.offers.length === 0 && (
          <div className="text-center p-20 bg-[var(--color-surface-container)] rounded-[48px] border border-dashed border-[var(--color-divider)]">
            <p className="text-[var(--color-text-muted)] text-xl font-medium">{content.noPositions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
