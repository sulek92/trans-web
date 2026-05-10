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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="pb-32 bg-background min-h-screen overflow-hidden">
        <section className="relative pt-32 pb-32 overflow-hidden">
           <div className="max-w-[1280px] mx-auto px-8 text-center">
             <h1 className="font-display-bold text-5xl sm:text-7xl lg:text-8xl font-bold text-[var(--color-on-background)] mb-12 tracking-tighter max-w-5xl mx-auto leading-[1.02]">
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
      <section className="relative pt-32 pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-[var(--color-primary)]/10 blur-[100px] rounded-full -z-10 animate-pulse" />
        
        <div className="max-w-[1280px] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-block px-6 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-[var(--color-primary)]/10">
              Nasza Misja & Wizja
            </span>
            <h1 className="font-display-bold text-5xl sm:text-7xl lg:text-8xl font-bold text-[var(--color-on-background)] mb-12 tracking-tighter max-w-5xl mx-auto leading-[1.02]">
              {data.heroTitle}
            </h1>
            <p className="text-[var(--color-text-muted)] text-xl sm:text-3xl mb-20 max-w-3xl mx-auto leading-relaxed opacity-90 font-medium">
              {data.heroDesc}
            </p>
          </motion.div>

          {/* Stats Grid */}
          {data.heroStats && data.heroStats.length > 0 && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {data.heroStats.map((stat, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="relative group p-12 bg-surface-primary rounded-[48px] border border-[var(--color-divider)]/50 shadow-2xl transition-all duration-500 hover:-translate-y-3"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[48px]" />
                  <div className="text-7xl font-display-bold font-bold text-[var(--color-primary)] mb-6 tracking-tighter drop-shadow-sm">{stat.value}</div>
                  <div className="text-[10px] text-[var(--color-text-faint)] font-black uppercase tracking-[0.3em]">{stat.label}</div>
                  
                  {/* Decorative corner icon */}
                  <div className="absolute bottom-10 right-10 w-10 h-10 rounded-xl bg-[var(--color-primary)]/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all">
                     <span className="material-symbols-outlined text-[var(--color-primary)] text-sm">trending_up</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-8">
        {/* --- QUOTE SECTION --- */}
        {data.quote && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="my-48 text-center max-w-4xl mx-auto relative group"
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 text-[var(--color-primary)] opacity-5 scale-[5]">
              <span className="material-symbols-outlined text-[140px]" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            </div>
            <blockquote className="text-4xl sm:text-5xl font-medium text-[var(--color-on-background)] italic leading-[1.3] mb-12 relative z-10 tracking-tight drop-shadow-sm">
              &ldquo;{data.quote}&rdquo;
            </blockquote>
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-40" />
              <cite className="text-[var(--color-text-faint)] not-italic font-black uppercase tracking-[0.4em] text-[11px]">
                {data.quoteAuthor}
              </cite>
            </div>
          </motion.div>
        )}

        {/* --- VALUES SECTION --- */}
        {data.values && data.values.length > 0 && (
          <div className="mb-56">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-28"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-6 block">Dlaczego My?</span>
              <h2 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tighter text-[var(--color-on-background)]">
                Filary naszej firmy
              </h2>
              <p className="text-[var(--color-text-muted)] text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed font-medium opacity-80">
                Łączymy pasję do technologii z praktycznym doświadczeniem w branży TSL, tworząc rozwiązania skrojone na miarę XXI wieku.
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {data.values.map((val, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="p-16 bg-surface-primary rounded-[60px] border border-[var(--color-divider)]/50 shadow-xl hover:shadow-3xl transition-all duration-700 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                  <div className="absolute -bottom-16 -right-16 text-[var(--color-primary)] opacity-[0.03] rotate-12 group-hover:rotate-0 group-hover:scale-125 transition-all duration-1000 ease-out">
                    <span className="material-symbols-outlined text-[200px]">{val.icon}</span>
                  </div>
                  
                  <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center mb-12 group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-700 shadow-2xl shadow-[var(--color-primary)]/10">
                    <span className="material-symbols-outlined text-4xl">{val.icon}</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-8 text-[var(--color-on-background)] tracking-tight">{val.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-xl leading-relaxed opacity-90 font-medium">{val.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* --- TEAM SECTION --- */}
        {data.team && data.team.length > 0 && (
          <div className="mb-56">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-28"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-6 block">Nasi Eksperci</span>
              <h2 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tighter text-[var(--color-on-background)]">
                Poznaj nasz zespół
              </h2>
              <p className="text-[var(--color-text-muted)] text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed font-medium opacity-80">
                Ludzie, którzy tworzą przyszłość logistyki każdego dnia, dbając o każdy detal Twojego transportu.
              </p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
            >
              {data.team.map((member, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="p-12 bg-surface-primary rounded-[48px] border border-[var(--color-divider)]/50 shadow-2xl text-center hover:shadow-3xl hover:-translate-y-4 transition-all duration-700 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="w-32 h-32 rounded-[40px] bg-surface-container flex items-center justify-center mx-auto mb-10 shadow-inner border border-[var(--color-divider)] group-hover:border-[var(--color-primary)]/30 group-hover:shadow-xl group-hover:shadow-[var(--color-primary)]/10 transition-all duration-700">
                    <span className="material-symbols-outlined text-6xl text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-1000">{member.icon}</span>
                  </div>
                  
                  <h3 className="font-bold text-2xl mb-3 text-[var(--color-on-background)] tracking-tight">{member.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] opacity-70 group-hover:opacity-100 transition-opacity">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* --- CTA SECTION --- */}
        {data.ctaTitle && (
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group mb-20"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-[var(--color-primary)]/20 blur-[140px] rounded-[60px] opacity-20 -z-10" />
            
            <div className="text-center p-20 sm:p-40 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover, #0d9488)] rounded-[80px] text-white shadow-3xl relative overflow-hidden">
              {/* Pattern */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.06] pointer-events-none" />
              <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-black/10 rounded-full blur-[120px]" />
              
              <div className="relative z-10 max-w-5xl mx-auto">
                <div className="w-24 h-24 bg-white/10 rounded-[32px] backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-14 shadow-inner group-hover:scale-110 transition-premium">
                   <span className="material-symbols-outlined text-5xl opacity-40">handshake</span>
                </div>
                
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-16 whitespace-pre-line tracking-tighter leading-[0.95] drop-shadow-2xl">
                  {data.ctaTitle}
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                  <Link 
                    href="/kontakt" 
                    className="group/btn inline-flex items-center gap-6 bg-white text-[var(--color-primary)] px-14 py-7 rounded-3xl font-black text-xl hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] transition-all duration-500 shadow-2xl active:scale-95 uppercase tracking-widest"
                  >
                    Napisz do nas 
                    <span className="material-symbols-outlined text-2xl group-hover/btn:translate-x-3 transition-transform">trending_flat</span>
                  </Link>
                  <Link 
                    href="/wycena" 
                    className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-14 py-7 rounded-3xl font-black text-xl hover:bg-white/20 transition-all duration-500 active:scale-95 uppercase tracking-widest"
                  >
                    Sprawdź wycenę
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};
