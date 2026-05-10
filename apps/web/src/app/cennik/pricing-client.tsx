'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/i18n-context';

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

interface PricingData {
  title: string; subtitle: string; exchangeRate: number;
  domesticRates: { type: string; price: string; icon: string }[];
  internationalRates: { country: string; price: string; eta: string }[];
  guaranteeTitle: string; guaranteeDesc: string;
  guaranteeBoxes: { label: string; value: string; sub: string }[];
  pricingFaq: { q: string; a: string }[];
}

export function PricingClient({ data: d }: { data: PricingData }) {
  const { t } = useTranslation();
  const [currency, setCurrency] = React.useState('PLN');
  const [unit, setUnit] = React.useState<'kg' | 'lbs'>('kg');
  const [mounted, setMounted] = React.useState(false);
  const exchangeRate = d.exchangeRate;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: string) => {
    const val = parseFloat(price.replace(',', '.'));
    if (currency === 'EUR') return (val / exchangeRate).toFixed(2).replace('.', ',');
    return price;
  };

  const formatRateType = (label: string) => {
    let result = label;

    const palletMappings: Record<string, string> = {
      'Półpaleta': (t.pricing.pallets as any).semi_euro,
      'Paleta Euro': (t.pricing.pallets as any).euro,
      'Przemysłowa': (t.pricing.pallets as any).industrial,
      'Półprzemysłowa': (t.pricing.pallets as any).semi_industrial,
      'do': t.common?.to || 'up to',
    };

    Object.entries(palletMappings).forEach(([pl, target]) => {
      result = result.replace(new RegExp(pl, 'g'), target);
    });

    if (unit === 'lbs') {
      result = result.replace(/(\d+)kg/g, (_, kg) => {
        const lbs = Math.round(parseInt(kg) * 2.20462);
        return `${lbs}lbs`;
      });
    }

    return result;
  };

  const translateCountry = (country: string) => {
    const key = country.toLowerCase().replace(' ', '');
    return (t.pricing.countries as any)[key] || country;
  };

  if (!mounted) {
    return (
      <main className="pb-24 bg-background min-h-screen overflow-hidden">
        <section className="relative pt-24 pb-32 overflow-hidden px-8">
           <div className="max-w-[1280px] mx-auto text-center">
             <h1 className="text-5xl md:text-8xl font-bold text-[var(--color-on-background)] mb-8 tracking-tighter leading-none">{t.pricing.title}</h1>
           </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pb-24 bg-background min-h-screen overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-32 overflow-hidden px-8">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-[var(--color-primary)]/10 blur-[100px] rounded-full -z-10 animate-pulse" />
        
        <div className="max-w-[1280px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Switchers Container */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
              {/* Currency Switcher */}
              <div className="flex bg-surface-container p-1.5 rounded-2xl border border-[var(--color-divider)] shadow-inner backdrop-blur-md">
                <button 
                  onClick={() => setCurrency('PLN')} 
                  className={cn(
                    "px-10 py-3 rounded-xl text-xs font-bold transition-all duration-300",
                    currency === 'PLN' ? 'bg-surface-primary text-[var(--color-primary)] shadow-lg' : 'text-[var(--color-text-faint)] hover:text-[var(--color-on-background)]'
                  )}
                >
                  PLN
                </button>
                <button 
                  onClick={() => setCurrency('EUR')} 
                  className={cn(
                    "px-10 py-3 rounded-xl text-xs font-bold transition-all duration-300",
                    currency === 'EUR' ? 'bg-surface-primary text-[var(--color-primary)] shadow-lg' : 'text-[var(--color-text-faint)] hover:text-[var(--color-on-background)]'
                  )}
                >
                  EUR
                </button>
              </div>

              {/* Unit Switcher */}
              <div className="flex bg-surface-container p-1.5 rounded-2xl border border-[var(--color-divider)] shadow-inner backdrop-blur-md">
                <button 
                  onClick={() => setUnit('kg')} 
                  className={cn(
                    "px-10 py-3 rounded-xl text-xs font-bold transition-all duration-300",
                    unit === 'kg' ? 'bg-surface-primary text-[var(--color-primary)] shadow-lg' : 'text-[var(--color-text-faint)] hover:text-[var(--color-on-background)]'
                  )}
                >
                  KG
                </button>
                <button 
                  onClick={() => setUnit('lbs')} 
                  className={cn(
                    "px-10 py-3 rounded-xl text-xs font-bold transition-all duration-300",
                    unit === 'lbs' ? 'bg-surface-primary text-[var(--color-primary)] shadow-lg' : 'text-[var(--color-text-faint)] hover:text-[var(--color-on-background)]'
                  )}
                >
                  LBS
                </button>
              </div>
            </div>

            <span className="inline-block px-6 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
              Transparentny Cennik B2B
            </span>
            <h1 className="text-5xl md:text-8xl font-bold text-[var(--color-on-background)] mb-8 tracking-tighter leading-none">{t.pricing.title}</h1>
            <p className="text-[var(--color-text-muted)] text-xl md:text-3xl max-w-4xl mx-auto leading-relaxed font-medium">
              {t.pricing.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-8">
        <Tabs defaultValue="domestic" className="mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-24"
          >
            <TabsList className="p-2 bg-surface-container border border-[var(--color-divider)] shadow-inner rounded-[32px] h-auto backdrop-blur-sm">
              <TabsTrigger value="domestic" className="px-12 py-5 rounded-[24px] data-[state=active]:bg-surface-primary data-[state=active]:shadow-2xl data-[state=active]:text-[var(--color-primary)] transition-all duration-500 font-bold text-lg">
                <span className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-2xl">flag</span> {t.pricing.tabs.domestic}
                </span>
              </TabsTrigger>
              <TabsTrigger value="international" className="px-12 py-5 rounded-[24px] data-[state=active]:bg-surface-primary data-[state=active]:shadow-2xl data-[state=active]:text-[var(--color-primary)] transition-all duration-500 font-bold text-lg">
                <span className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-2xl">public</span> {t.pricing.tabs.international}
                </span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value="domestic" key="domestic">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto"
              >
                <div className="bg-surface-primary p-10 md:p-20 rounded-[60px] shadow-3xl border border-[var(--color-divider)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] rounded-full -mr-48 -mt-48 blur-3xl"></div>
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-8 relative z-10">
                    <h2 className="text-4xl font-bold tracking-tight">{t.pricing.labels.standardRates}</h2>
                    <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-6 py-3 rounded-2xl uppercase tracking-[0.25em] border border-emerald-500/20">
                      Najlepsza Oferta B2B
                    </div>
                  </div>
                  
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4 relative z-10"
                  >
                    {d.domesticRates.map((rate, i) => (
                      <motion.div 
                        key={i} 
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row justify-between items-center p-10 rounded-[40px] border border-[var(--color-divider)] bg-surface-container/30 hover:bg-surface-container transition-all duration-500 group/row gap-8"
                      >
                        <div className="flex items-center gap-8 w-full sm:w-auto">
                          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover/row:scale-110 group-hover/row:bg-[var(--color-primary)] group-hover/row:text-white transition-all duration-500 shadow-inner">
                            <span className="material-symbols-outlined text-3xl">{rate.icon}</span>
                          </div>
                          <span className="text-[var(--color-on-background)] font-bold text-2xl tracking-tight">{formatRateType(rate.type)}</span>
                        </div>
                        <div className="text-right w-full sm:w-auto flex items-baseline gap-4">
                          <span className="text-[10px] text-[var(--color-text-faint)] font-bold uppercase tracking-widest">{t.pricing.labels.from}</span>
                          <span className="font-bold text-5xl text-[var(--color-on-background)] tracking-tighter">
                            {formatPrice(rate.price)} 
                            <span className="text-base opacity-30 font-medium ml-2 uppercase tracking-widest">{currency}</span>
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <Link href="/wycena" className="w-full mt-16 bg-[var(--color-primary)] text-white py-8 rounded-3xl font-bold flex items-center justify-center gap-4 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 shadow-xl shadow-[var(--color-primary)]/20 active:scale-95 text-xl">
                    <span className="material-symbols-outlined text-2xl">calculate</span> {t.pricing.labels.customRoute}
                  </Link>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="international" key="international">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="max-w-5xl mx-auto"
              >
                <div className="bg-surface-primary p-10 md:p-20 rounded-[60px] shadow-3xl border border-[var(--color-divider)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-[0.03] rounded-full -mr-48 -mt-48 blur-3xl"></div>
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-8 relative z-10">
                    <h2 className="text-4xl font-bold tracking-tight">{t.pricing.labels.europeanRoutes}</h2>
                    <div className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-6 py-3 rounded-2xl uppercase tracking-[0.25em] border border-blue-500/20">
                      Obsługa Całej Europy
                    </div>
                  </div>
                  
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4 relative z-10"
                  >
                    {d.internationalRates.map((rate, i) => (
                      <motion.div 
                        key={i} 
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row justify-between items-center p-10 rounded-[40px] border border-[var(--color-divider)] bg-surface-container/30 hover:bg-surface-container transition-all duration-500 group/row gap-8"
                      >
                        <div className="w-full sm:w-auto text-center sm:text-left">
                          <div className="font-bold text-3xl text-[var(--color-on-background)] tracking-tight">{translateCountry(rate.country)}</div>
                          <div className="text-[10px] text-[var(--color-text-faint)] font-bold uppercase tracking-widest mt-3 opacity-60">
                            Przewidywany czas: <span className="text-[var(--color-on-background)]">{rate.eta}</span>
                          </div>
                        </div>
                        <div className="text-right w-full sm:w-auto flex items-baseline gap-4">
                          <span className="text-[10px] text-[var(--color-text-faint)] font-bold uppercase tracking-widest">{t.pricing.labels.from}</span>
                          <span className="font-bold text-5xl text-[var(--color-on-background)] tracking-tighter">
                            {currency === 'EUR' ? (parseFloat(rate.price.replace(',','.'))).toFixed(2).replace('.',',') : (parseFloat(rate.price.replace(',','.')) * exchangeRate).toFixed(2).replace('.',',')} 
                            <span className="text-base opacity-30 font-medium ml-2 uppercase tracking-widest">{currency}</span>
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <Link href="/kontakt" className="w-full mt-16 bg-[var(--color-on-background)] text-[var(--color-background)] py-8 rounded-3xl font-bold flex items-center justify-center gap-4 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 shadow-xl active:scale-95 text-xl">
                    <span className="material-symbols-outlined text-2xl">mail</span> {t.pricing.labels.askOther}
                  </Link>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        {/* --- GUARANTEE SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group mb-40"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-[var(--color-primary)]/20 blur-[100px] rounded-[60px] opacity-20 -z-10" />
          
          <div className="bg-[#0f172a] dark:bg-[#020617] text-white rounded-[60px] p-12 md:p-24 relative overflow-hidden shadow-3xl">
            {/* Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="flex flex-col lg:flex-row gap-20 relative z-10">
              <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 shadow-inner">
                  <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
                <h3 className="text-4xl sm:text-6xl font-bold mb-10 tracking-tighter leading-none">{t.pricing.guarantee.title}</h3>
                <p className="text-white/60 text-xl leading-relaxed font-medium">
                  {t.pricing.guarantee.desc}
                </p>
              </div>
              
              <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-12 bg-white/5 rounded-[48px] border border-white/10 hover:bg-white/10 transition-all duration-500 group/card backdrop-blur-md">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-6">{t.pricing.guarantee.insurance}</div>
                  <div className="text-4xl font-bold text-[var(--color-primary)] mb-4 tracking-tight leading-none">{t.pricing.guarantee.included}</div>
                  <p className="text-sm text-white/40 font-medium leading-relaxed">{t.pricing.guarantee.carrierOcp}</p>
                </div>
                <div className="p-12 bg-white/5 rounded-[48px] border border-white/10 hover:bg-white/10 transition-all duration-500 group/card backdrop-blur-md">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-6">{t.pricing.guarantee.fuelSurcharge}</div>
                  <div className="text-4xl font-bold text-[var(--color-primary)] mb-4 tracking-tight leading-none">0%</div>
                  <p className="text-sm text-white/40 font-medium leading-relaxed">{t.pricing.guarantee.alwaysIncluded}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- FAQ SECTION --- */}
        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Centrum Wiedzy</span>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter text-[var(--color-on-background)]">{t.pricing.labels.billingQuestions}</h3>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto"
          >
            {[
              { q: t.pricing.faq.q1, a: t.pricing.faq.a1 },
              { q: t.pricing.faq.q2, a: t.pricing.faq.a2 },
              { q: t.pricing.faq.q3, a: t.pricing.faq.a3 },
              { q: t.pricing.faq.q4, a: t.pricing.faq.a4 },
            ].map((faq, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="bg-surface-primary p-12 rounded-[56px] border border-[var(--color-divider)] hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 text-[var(--color-primary)] opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <span className="material-symbols-outlined text-[140px]">help</span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-500 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">help</span>
                </div>
                <h4 className="font-bold text-2xl mb-6 group-hover:text-[var(--color-primary)] transition-colors tracking-tight leading-tight">{faq.q}</h4>
                <p className="text-[var(--color-text-muted)] text-lg leading-relaxed font-medium">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
