'use client';

import * as React from 'react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/i18n-context';

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
  const exchangeRate = d.exchangeRate;

  const formatPrice = (price: string) => {
    const val = parseFloat(price.replace(',', '.'));
    if (currency === 'EUR') return (val / exchangeRate).toFixed(2).replace('.', ',');
    return price;
  };

  const formatRateType = (label: string) => {
    let result = label;

    // 1. Translate pallet names if they exist in the string
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

    // 2. Handle unit conversion if needed
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

  return (
    <main className="pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-20 text-center animate-fade-in relative pt-12">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
            {/* Currency Switcher */}
            <div className="flex bg-[var(--color-surface-container)] p-1.5 rounded-2xl border border-[var(--color-divider)] shadow-sm">
               <button 
                onClick={() => setCurrency('PLN')} 
                className={cn(
                  "px-8 py-2.5 rounded-xl text-xs font-bold transition-premium",
                  currency === 'PLN' ? 'bg-[var(--color-surface-primary)] text-[var(--color-primary)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-on-background)]'
                )}
              >
                PLN
              </button>
               <button 
                onClick={() => setCurrency('EUR')} 
                className={cn(
                  "px-8 py-2.5 rounded-xl text-xs font-bold transition-premium",
                  currency === 'EUR' ? 'bg-[var(--color-surface-primary)] text-[var(--color-primary)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-on-background)]'
                )}
              >
                EUR
              </button>
            </div>

            {/* Unit Switcher */}
            <div className="flex bg-[var(--color-surface-container)] p-1.5 rounded-2xl border border-[var(--color-divider)] shadow-sm">
               <button 
                onClick={() => setUnit('kg')} 
                className={cn(
                  "px-8 py-2.5 rounded-xl text-xs font-bold transition-premium",
                  unit === 'kg' ? 'bg-[var(--color-surface-primary)] text-[var(--color-primary)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-on-background)]'
                )}
              >
                KG
              </button>
               <button 
                onClick={() => setUnit('lbs')} 
                className={cn(
                  "px-8 py-2.5 rounded-xl text-xs font-bold transition-premium",
                  unit === 'lbs' ? 'bg-[var(--color-surface-primary)] text-[var(--color-primary)] shadow-md' : 'text-[var(--color-text-muted)] hover:text-[var(--color-on-background)]'
                )}
              >
                LBS
              </button>
            </div>
          </div>

          <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-[10px] mb-4 block">{t.pricing.labels.helpAndSupport}</span>
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-on-background)] mb-6 tracking-tighter">{t.pricing.title}</h1>
          <p className="text-[var(--color-text-muted)] text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">{t.pricing.subtitle}</p>
        </div>

        <Tabs defaultValue="domestic" className="mb-24">
          <div className="flex justify-center mb-16">
            <TabsList className="p-2 bg-[var(--color-surface-container)] border border-[var(--color-divider)] shadow-inner rounded-3xl h-auto">
              <TabsTrigger value="domestic" className="px-10 py-4 rounded-2xl data-[state=active]:bg-[var(--color-surface-primary)] data-[state=active]:shadow-lg data-[state=active]:text-[var(--color-primary)] transition-all font-bold text-sm">
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">flag</span> {t.pricing.tabs.domestic}
                </span>
              </TabsTrigger>
              <TabsTrigger value="international" className="px-10 py-4 rounded-2xl data-[state=active]:bg-[var(--color-surface-primary)] data-[state=active]:shadow-lg data-[state=active]:text-[var(--color-primary)] transition-all font-bold text-sm">
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">public</span> {t.pricing.tabs.international}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="domestic">
            <div className="max-w-4xl mx-auto px-4 sm:px-0">
              <div className="bg-[var(--color-surface-primary)] p-8 md:p-16 rounded-[48px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)] animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-[0.05] rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 relative z-10">
                  <h2 className="text-3xl font-bold">{t.pricing.labels.standardRates}</h2>
                  <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl uppercase tracking-[0.2em] border border-emerald-500/20">{t.pricing.labels.bestOffer}</div>
                </div>
                <div className="space-y-3 relative z-10">
                  {d.domesticRates.map((rate, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between items-center py-6 border-b border-[var(--color-divider)] last:border-0 group/row hover:bg-[var(--color-surface-container)] px-8 rounded-3xl transition-premium gap-4">
                      <div className="flex items-center gap-6 w-full sm:w-auto">
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-text-faint)] group-hover/row:text-[var(--color-primary)] group-hover/row:bg-[var(--color-primary-highlight)] transition-premium flex-shrink-0 shadow-inner">
                          <span className="material-symbols-outlined text-2xl">{rate.icon}</span>
                        </div>
                        <span className="text-[var(--color-on-background)] font-bold text-lg leading-tight">{formatRateType(rate.type)}</span>
                      </div>
                      <div className="text-right w-full sm:w-auto">
                        <span className="text-[10px] text-[var(--color-text-faint)] font-bold uppercase tracking-widest mr-3">{t.pricing.labels.from}</span>
                        <span className="font-bold text-4xl text-[var(--color-on-background)] tracking-tight">{formatPrice(rate.price)} <span className="text-sm opacity-40 font-medium ml-1">{currency}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/" className="w-full mt-12 bg-[var(--color-primary)] text-white py-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.01] transition-premium shadow-2xl shadow-[var(--color-primary)]/20 active:scale-95 text-lg">
                   <span className="material-symbols-outlined">calculate</span> {t.pricing.labels.customRoute}
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="international">
            <div className="max-w-4xl mx-auto px-4 sm:px-0">
              <div className="bg-[var(--color-surface-primary)] p-8 md:p-16 rounded-[48px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)] animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-[0.05] rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 relative z-10">
                  <h2 className="text-3xl font-bold">{t.pricing.labels.europeanRoutes}</h2>
                  <div className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-4 py-2 rounded-xl uppercase tracking-[0.2em] border border-blue-500/20">{t.pricing.labels.service247}</div>
                </div>
                <div className="space-y-3 relative z-10">
                  {d.internationalRates.map((rate, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between items-center py-6 border-b border-[var(--color-divider)] last:border-0 group/row hover:bg-[var(--color-surface-container)] px-8 rounded-3xl transition-premium gap-4">
                      <div className="w-full sm:w-auto text-center sm:text-left">
                        <div className="font-bold text-2xl text-[var(--color-on-background)] tracking-tight">{translateCountry(rate.country)}</div>
                        <div className="text-[10px] text-[var(--color-text-faint)] font-bold uppercase tracking-widest mt-2">{t.pricing.labels.guaranteedEta}: {rate.eta}</div>
                      </div>
                      <div className="text-right w-full sm:w-auto">
                        <span className="text-[10px] text-[var(--color-text-faint)] font-bold uppercase tracking-widest mr-3">{t.pricing.labels.from}</span>
                        <span className="font-bold text-4xl text-[var(--color-on-background)] tracking-tight">{currency === 'EUR' ? (parseFloat(rate.price.replace(',','.'))).toFixed(2).replace('.',',') : (parseFloat(rate.price.replace(',','.')) * exchangeRate).toFixed(2).replace('.',',')} <span className="text-sm opacity-40 font-medium ml-1">{currency}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/kontakt" className="w-full mt-12 bg-[var(--color-on-background)] text-[var(--color-background)] py-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.01] transition-premium shadow-2xl active:scale-95 text-lg">
                   <span className="material-symbols-outlined">mail</span> {t.pricing.labels.askOther}
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Guarantee Section */}
        <div className="bg-[var(--color-secondary)] text-[var(--color-on-secondary)] rounded-[60px] p-10 md:p-20 relative overflow-hidden group shadow-3xl mx-4 sm:mx-0">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
           <div className="flex flex-col lg:flex-row gap-16 relative z-10 w-full">
              <div className="w-full lg:w-1/2 flex flex-col items-start">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 shadow-xl"><span className="material-symbols-outlined text-white text-3xl">verified_user</span></div>
                 <h3 className="text-4xl sm:text-5xl font-bold mb-8 tracking-tighter w-full block">{t.pricing.guarantee.title}</h3>
                 <p className="opacity-70 text-xl leading-relaxed w-full block font-medium">{t.pricing.guarantee.desc}</p>
              </div>
              <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="p-10 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-premium group/card w-full backdrop-blur-sm">
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">{t.pricing.guarantee.insurance}</div>
                   <div className="text-4xl font-bold text-[var(--color-primary)] mb-2 group-hover/card:scale-105 transition-transform tracking-tight">{t.pricing.guarantee.included}</div>
                   <div className="text-sm opacity-40 font-medium">{t.pricing.guarantee.carrierOcp}</div>
                </div>
                <div className="p-10 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-premium group/card w-full backdrop-blur-sm">
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">{t.pricing.guarantee.fuelSurcharge}</div>
                   <div className="text-4xl font-bold text-[var(--color-primary)] mb-2 group-hover/card:scale-105 transition-transform tracking-tight">0%</div>
                   <div className="text-sm opacity-40 font-medium">{t.pricing.guarantee.alwaysIncluded}</div>
                </div>
              </div>
           </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-40 mb-32">
           <div className="text-center mb-20">
             <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-[10px] mb-4 block">{t.pricing.labels.helpAndSupport}</span>
             <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">{t.pricing.labels.billingQuestions}</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto px-4 sm:px-0">
              {[
                { q: t.pricing.faq.q1, a: t.pricing.faq.a1 },
                { q: t.pricing.faq.q2, a: t.pricing.faq.a2 },
                { q: t.pricing.faq.q3, a: t.pricing.faq.a3 },
                { q: t.pricing.faq.q4, a: t.pricing.faq.a4 },
              ].map((faq, i) => (
                <div key={i} className="bg-[var(--color-surface-primary)] p-12 rounded-[48px] border border-[var(--color-divider)] hover:shadow-3xl hover:-translate-y-2 transition-premium group shadow-sm">
                   <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center mb-8 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-premium shadow-inner">
                     <span className="material-symbols-outlined text-2xl">help</span>
                   </div>
                   <h4 className="font-bold text-2xl mb-6 group-hover:text-[var(--color-primary)] transition-colors tracking-tight leading-tight">{faq.q}</h4>
                   <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">{faq.a}</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </main>
  );
}

