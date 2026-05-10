'use client';

import * as React from 'react';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface CareersClientProps {
  cmsContent?: string;
}

export function CareersClient({ cmsContent }: CareersClientProps) {
  const { t, locale } = useTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return (
      <div className="bg-background min-h-screen">
        <section className="relative pt-32 pb-32 overflow-hidden px-8">
           <div className="max-w-[1280px] mx-auto text-center">
             <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold mb-12 tracking-tighter leading-[0.9]">
                {content.title}
             </h1>
           </div>
        </section>
      </div>
    );
  }

  return (
    <div key={locale} className="bg-background min-h-screen overflow-hidden pb-40">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-32 overflow-hidden px-8">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-[var(--color-secondary)]/5 blur-[140px] rounded-full -z-10" />
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-[var(--color-secondary)]/10 blur-[100px] rounded-full -z-10 animate-float-slow" />

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1280px] mx-auto bg-gradient-to-br from-[var(--color-secondary)] to-[#1a1a1a] dark:from-[#0f172a] dark:to-[#020617] text-white rounded-[80px] p-12 md:p-32 relative overflow-hidden shadow-3xl group"
        >
          {/* Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[var(--color-primary)]/10 rounded-full blur-[120px]" />
          
          <div className="relative z-10 max-w-5xl">
            <span className="inline-block px-8 py-3 bg-white/10 backdrop-blur-xl text-white/90 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-white/10">
              Dołącz do PaletyBroker
            </span>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold mb-12 tracking-tighter leading-[0.9] drop-shadow-2xl">
               {content.title}
            </h1>
            <p className="text-xl md:text-3xl opacity-80 leading-relaxed mb-20 font-medium max-w-3xl drop-shadow-sm">
              {content.subtitle}
            </p>
            <button className="group/btn flex items-center gap-6 px-14 py-8 bg-white text-[var(--color-secondary)] font-black rounded-3xl hover:scale-105 transition-all duration-500 shadow-[0_20px_50px_rgba(255,255,255,0.2)] active:scale-95 text-xl uppercase tracking-widest">
              {content.applyNow}
              <span className="material-symbols-outlined text-2xl group-hover/btn:translate-x-3 transition-transform">trending_flat</span>
            </button>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 p-20 opacity-5 hidden lg:block rotate-12 group-hover:rotate-6 transition-transform duration-1000 ease-out">
            <span className="material-symbols-outlined text-[600px]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          </div>
        </motion.div>
      </section>

      <div className="max-w-[1280px] mx-auto px-8">
        {/* --- VALUES SECTION --- */}
        <div className="my-56">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-28"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-6 block">Dlaczego My?</span>
            <h2 className="text-5xl lg:text-7xl font-bold text-[var(--color-on-background)] tracking-tighter mb-8">{content.whyJoin}</h2>
            <p className="text-[var(--color-text-muted)] text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed font-medium opacity-80">
               Tworzymy środowisko, w którym technologia spotyka się z pasją do logistyki.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {content.values.map((v: any, i: number) => (
              <motion.div 
                key={v.title}
                variants={itemVariants}
                className="p-16 bg-surface-primary border border-[var(--color-divider)]/50 rounded-[60px] shadow-xl hover:shadow-3xl transition-all duration-700 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 text-[var(--color-primary)] opacity-[0.03] rotate-12 group-hover:rotate-0 group-hover:scale-125 transition-all duration-1000 ease-out">
                  <span className="material-symbols-outlined text-[200px]">{v.icon}</span>
                </div>
                
                <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-12 group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-700 shadow-2xl shadow-[var(--color-primary)]/10">
                  <span className="material-symbols-outlined text-4xl">{v.icon}</span>
                </div>
                
                <h3 className="text-3xl font-bold mb-8 text-[var(--color-on-background)] tracking-tight">{v.title}</h3>
                <p className="text-[var(--color-text-muted)] text-xl leading-relaxed opacity-90 font-medium">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* --- OPEN POSITIONS --- */}
        <div className="mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12"
          >
            <div className="text-left">
              <span className="text-[var(--color-primary)] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block">Aktualne oferty rekrutacyjne</span>
              <h2 className="text-5xl lg:text-8xl font-bold text-[var(--color-on-background)] tracking-tighter leading-none">{content.openPositions}</h2>
            </div>
            <p className="text-[var(--color-text-muted)] text-xl sm:text-2xl font-medium max-w-lg leading-relaxed opacity-80">
              Znajdź rolę, w której Twoje umiejętności zmienią przyszłość transportu paletowego w Polsce.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-8"
          >
            {content.offers.map((offer: any, i: number) => (
              <motion.div 
                key={offer.title}
                variants={itemVariants}
                className="group bg-surface-primary p-12 md:p-16 rounded-[60px] border border-[var(--color-divider)]/50 shadow-xl hover:border-[var(--color-primary)]/50 hover:shadow-3xl transition-all duration-700 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-12 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                
                <div className="text-center md:text-left relative z-10 flex-grow">
                  <h3 className="text-4xl md:text-5xl font-bold text-[var(--color-on-background)] group-hover:text-[var(--color-primary)] transition-all duration-500 mb-8 tracking-tighter leading-none">{offer.title}</h3>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-10 text-[var(--color-text-faint)] font-black text-[10px] uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-3 bg-surface-container px-6 py-3 rounded-2xl border border-[var(--color-divider)]/50 group-hover:bg-[var(--color-primary)]/5 group-hover:text-[var(--color-primary)] transition-all">
                       <span className="material-symbols-outlined text-sm text-[var(--color-primary)]">location_on</span>
                       {offer.location}
                    </span>
                    <span className="flex items-center gap-3 bg-surface-container px-6 py-3 rounded-2xl border border-[var(--color-divider)]/50 group-hover:bg-[var(--color-primary)]/5 group-hover:text-[var(--color-primary)] transition-all">
                       <span className="material-symbols-outlined text-sm text-[var(--color-primary)]">schedule</span>
                       {offer.type}
                    </span>
                  </div>
                </div>
                
                <div className="relative z-10">
                   <div className="w-24 h-24 rounded-[32px] bg-surface-container flex items-center justify-center text-[var(--color-text-faint)] group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:scale-110 transition-all duration-700 shadow-inner border border-[var(--color-divider)] group-hover:shadow-2xl group-hover:shadow-[var(--color-primary)]/30">
                     <span className="material-symbols-outlined text-4xl">trending_flat</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {content.offers.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center p-24 md:p-40 bg-surface-primary rounded-[80px] border border-[var(--color-divider)]/50 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
              <div className="w-32 h-32 bg-surface-container rounded-[40px] flex items-center justify-center mx-auto mb-12 shadow-inner border border-[var(--color-divider)]/50">
                <span className="material-symbols-outlined text-6xl text-[var(--color-text-faint)]">work_off</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter">{content.noPositions}</h3>
              <p className="text-[var(--color-text-muted)] text-xl md:text-2xl max-w-xl mx-auto mb-16 leading-relaxed font-medium opacity-80">
                Obecnie nie prowadzimy otwartych procesów rekrutacyjnych, ale nasza baza talentów jest zawsze otwarta na ambitne CV.
              </p>
              <button className="px-14 py-7 bg-[var(--color-primary)] text-white font-black rounded-3xl hover:scale-105 transition-all duration-500 shadow-2xl shadow-[var(--color-primary)]/30 uppercase tracking-widest text-lg">
                Zostaw CV w bazie
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
