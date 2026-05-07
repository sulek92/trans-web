'use client';

import * as React from 'react';
import { QuoteForm } from '@/components/calculator/quote-form';
import { Counter } from '@/components/ui/counter';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { createLead } from '@/lib/leads';
import { useToastStore } from '@/lib/store/toast-store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type CmsManagedImageProps = {
  src?: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

const CmsManagedImage = React.memo(function CmsManagedImage({
  src,
  fallbackSrc,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
}: CmsManagedImageProps) {
  const [hasError, setHasError] = React.useState(false);
  const resolvedSrc = React.useMemo(() => {
    if (hasError) return fallbackSrc;
    return (src || '').trim() || fallbackSrc;
  }, [src, fallbackSrc, hasError]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        priority={priority}
        className={cn("object-cover", imgClassName)}
        onError={() => setHasError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
});
export function HomePageClient({
  initialCmsData,
}: {
  initialCmsData: Record<string, unknown> | null;
}) {
  const { t, locale } = useTranslation();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isSending, setIsSending] = React.useState<string | null>(null);
  const [showQuickBar, setShowQuickBar] = React.useState(false);
  const addToast = useToastStore((state) => state.addToast);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (initialCmsData ?? {}) as Record<string, any>;
  const heroTitle = (c?.heroTitle as string) || t?.hero?.title || '';
  const heroSubtitle = (c?.heroSubtitle as string) || t?.hero?.subtitle || '';
  const heroBadge = (c?.heroBadge as string) || t?.home?.hero?.badge || '';
  const heroVisualImage = (c?.heroVisualImage as string) || '/images/home-hero-logistics.webp';
  const heroVisualCaption = (c?.heroVisualCaption as string) || t?.home?.hero?.visualCaption || '';
  const partners = (c.partners as string[]) || ['DHL Freight', 'FedEx Express', 'Raben', 'DSV', 'DB Schenker'];
  const activityTicker = (c.activityTicker as {city:string;status:string;time:string}[]) || [
    { city: 'Warszawa', status: t.home.ticker.received, time: `2 ${t.home.ticker.ago}` },
    { city: 'Berlin', status: t.home.ticker.inTransit, time: `5 ${t.home.ticker.ago}` },
    { city: 'Kraków', status: t.home.ticker.delivered, time: `12 ${t.home.ticker.ago}` },
    { city: 'Praga', status: t.home.ticker.received, time: `15 ${t.home.ticker.ago}` },
    { city: 'Wrocław', status: t.home.ticker.delivered, time: `20 ${t.home.ticker.ago}` },
    { city: 'Gdańsk', status: t.home.ticker.received, time: `25 ${t.home.ticker.ago}` },
    { city: 'Poznań', status: t.home.ticker.inTransit, time: `28 ${t.home.ticker.ago}` },
  ];
  const howItWorks = (c.howItWorks as {step:string;title:string;desc:string;icon:string}[]) || [
    { step: '01', title: t.home.howItWorks.step1.title, desc: t.home.howItWorks.step1.desc, icon: 'search' },
    { step: '02', title: t.home.howItWorks.step2.title, desc: t.home.howItWorks.step2.desc, icon: 'compare_arrows' },
    { step: '03', title: t.home.howItWorks.step3.title, desc: t.home.howItWorks.step3.desc, icon: 'local_shipping' },
  ];
  const stats = (c.stats as {label:string;end:number;suffix:string}[]) || [
    { label: t.home.stats.pallets, end: 45000, suffix: '+' },
    { label: t.home.stats.clients, end: 1200, suffix: '+' },
    { label: t.home.stats.countries, end: 28, suffix: '' },
    { label: t.home.stats.savings, end: 22, suffix: '%' },
  ];
  const testimonials = (c.testimonials as {name:string;role:string;text:string;avatar:string;avatarImage?: string}[]) || [
    {
      name: t.home.testimonials.items[0].name,
      role: t.home.testimonials.items[0].role,
      text: t.home.testimonials.items[0].text,
      avatar: 'person',
      avatarImage: '/images/avatars/client-1.webp',
    },
    {
      name: t.home.testimonials.items[1].name,
      role: t.home.testimonials.items[1].role,
      text: t.home.testimonials.items[1].text,
      avatar: 'person_3',
      avatarImage: '/images/avatars/client-2.webp',
    },
    {
      name: t.home.testimonials.items[2].name,
      role: t.home.testimonials.items[2].role,
      text: t.home.testimonials.items[2].text,
      avatar: 'person_4',
      avatarImage: '/images/avatars/client-3.webp',
    },
  ];
  const supportTitle = (c.supportTitle as string) || t.home.support.title;
  const supportSubtitle = (c.supportSubtitle as string) || t.home.support.subtitle;
  const supportVisualImage = (c.supportVisualImage as string) || '/images/home-support-team.webp';
  const ctaTitle = (c.ctaTitle as string) || t.home.cta.title;
  const ctaSubtitle = (c.ctaSubtitle as string) || t.home.cta.subtitle;
  const ctaVisualImage = (c.ctaVisualImage as string) || '/images/home-cta-warehouse.webp';
  const totalTestimonials = testimonials.length;

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowQuickBar(window.scrollY > 800);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextTestimonial = () => setActiveIndex((prev) => (prev + 1) % totalTestimonials);
  const prevTestimonial = () => setActiveIndex((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);

  const simulateSend = (id: string, message: string, resetFn?: () => void) => {
    setIsSending(id);
    setTimeout(() => { alert(message); setIsSending(null); if (resetFn) resetFn(); }, 1500);
  };

  const submitSupportLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    setIsSending('support');
    try {
      await createLead({
        name,
        email,
        description: message,
        route: 'Homepage support form',
      });
      addToast({
        title: t.home.support.form.success.title,
        description: t.home.support.form.success.description,
        type: 'success',
      });
      form.reset();
    } catch (error) {
      addToast({
        title: t.home.support.form.error.title,
        description: error instanceof Error ? error.message : t.home.support.form.error.description,
        type: 'error',
      });
    } finally {
      setIsSending(null);
    }
  };

  return (
    <main key={locale} className="pb-12 sm:pb-16 bg-[var(--color-background)]">
      {/* Quick Quote Bar - Redesigned as a floating premium pill */}
      <div className={cn(
        "fixed top-32 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
        showQuickBar ? "translate-y-0 opacity-100 scale-100" : "-translate-y-20 opacity-0 scale-90 pointer-events-none"
      )}>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-full px-2 py-2 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-4 px-6 border-r border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20">
              <span className="material-symbols-outlined text-lg">pallet</span>
            </div>
              <div className="hidden sm:block">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">PaletBroker</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white leading-none">{t.home.quickQuoteLabel}</div>
                </div>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <div className="text-xs font-bold text-[var(--color-on-surface-variant)] line-through opacity-40">219 PLN</div>
            <div className="text-lg font-display-bold font-bold text-[var(--color-primary)] tracking-tight">149 PLN</div>
          </div>
          <button 
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-premium shadow-xl active:scale-95"
          >
            {t.home.quickQuoteButton}
          </button>
        </div>
      </div>


      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 lg:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-7 flex flex-col gap-lg lg:pt-2"
          >
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 bg-[var(--color-primary-highlight)] text-[var(--color-primary)] font-bold text-[12px] rounded-full mb-8 border border-[var(--color-primary)]/10 shadow-sm uppercase tracking-widest"
              >
                {heroBadge}
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-display-bold text-[42px] sm:text-[56px] lg:text-[72px] leading-[0.95] text-[var(--color-on-background)] mb-8 font-bold tracking-tighter"
              >
                {heroTitle}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-body-base text-[18px] sm:text-[20px] lg:text-[22px] text-[var(--color-on-surface-variant)] max-w-2xl leading-relaxed mb-12"
              >
                {heroSubtitle}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-5"
              >
                <button
                  onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[var(--color-primary)] text-white px-12 py-6 rounded-[24px] font-bold shadow-2xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] transition-premium active:scale-95 flex items-center justify-center gap-4 text-xl"
                >
                  {t.hero.cta}
                  <span className="material-symbols-outlined">calculate</span>
                </button>
                <Link href="/dla-firm" className="bg-white dark:bg-slate-900 border border-[var(--color-divider)] text-[var(--color-on-background)] px-12 py-6 rounded-[24px] font-bold hover:border-[var(--color-primary)] transition-premium flex items-center justify-center gap-3 text-xl shadow-lg">
                   {t.home.b2bOffer}
                  <span className="material-symbols-outlined text-sm opacity-40">arrow_forward</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            <div className="relative overflow-hidden rounded-[48px] border border-[var(--color-divider)] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] bg-slate-900 group">
              <CmsManagedImage
                src={heroVisualImage}
                fallbackSrc="/images/home-hero-logistics.webp"
                alt="Centrum operacyjne logistyki paletowej"
                className="aspect-[16/11] w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="inline-flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-xl px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.2em] text-white border border-white/20 shadow-2xl">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_8px_var(--color-primary)]"></span>
                  {heroVisualCaption}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-[var(--color-divider)] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 text-sm text-[var(--color-on-surface-variant)] shadow-sm font-medium flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                ))}
              </div>
              <span>{t.home.partnerComparison} <span className="text-[var(--color-primary)] font-bold">12{t.home.carriersSuffix} {t.home.carriers}</span> {t.home.realtimeComparison}</span>
            </div>
          </motion.div>
        </div>

        <div id="calculator" className="mt-16 lg:mt-24">
          {/* Calculator */}
          <div className="bg-white dark:bg-slate-900/50 p-8 sm:p-16 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border border-[var(--color-divider)] relative transition-premium group">
            <div className="absolute -top-6 right-16 bg-[var(--color-primary)] text-white text-[11px] font-bold px-6 py-3 rounded-full shadow-2xl animate-float tracking-widest uppercase">{t.home.calculator.badge}</div>
            <div className="mb-12 flex flex-col gap-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-on-surface)] flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-4xl">calculate</span>
                </div>
                {t.home.calculator.title}
              </h2>
              <p className="text-xl text-[var(--color-on-surface-variant)] max-w-3xl leading-relaxed">
                {t.home.calculator.subtitle}
              </p>
            </div>
            <React.Suspense fallback={<div className="h-[400px] flex items-center justify-center text-slate-300 font-bold">{t.home.calculator.loading}</div>}>
              <QuoteForm />
            </React.Suspense>
          </div>

          {/* Quick Tracking */}
          <div className="mt-12 bg-slate-900 dark:bg-slate-950 rounded-[48px] p-10 sm:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-800 text-white group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-premium">
              <span className="material-symbols-outlined text-[200px]">location_searching</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-3xl mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[var(--color-primary)]">
                  <span className="material-symbols-outlined text-2xl">track_changes</span>
                </div>
                {t.home.tracking.title}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem('trackingNumber') as HTMLInputElement | null;
                  const val = input?.value?.trim();
                  if (!val) return;
                  if (val.startsWith('OR-') || val.startsWith('ORD-')) {
                    window.location.href = `/sledzenie?orderNumber=${encodeURIComponent(val)}`;
                  } else {
                    alert(t.home.tracking.error);
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6"
              >
                <input
                  name="trackingNumber"
                  type="text"
                  placeholder={t.home.tracking.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] px-8 py-6 text-xl outline-none focus:border-[var(--color-primary)] transition-all placeholder:text-white/20 font-data-mono shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isSending === 'tracking'}
                  className="bg-[var(--color-primary)] text-white px-12 py-6 rounded-[24px] font-bold text-xl hover:bg-[var(--color-primary-hover)] transition-all shadow-2xl shadow-[var(--color-primary)]/20 active:scale-95 disabled:opacity-50"
                >
                  {isSending === 'tracking' ? t.home.tracking.searching : t.home.tracking.button}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section - Premium Monochrome Grid */}
      <section className="bg-slate-50 dark:bg-slate-950 py-24 border-y border-[var(--color-divider)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-4 block">{t.home.partners.title}</span>
            <div className="h-px w-20 bg-[var(--color-primary)] mx-auto opacity-30"></div>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000 ease-in-out"
          >
            {partners.map((p, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-4 group cursor-default"
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm group-hover:shadow-xl group-hover:border-[var(--color-primary)]/20 transition-premium">
                  <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40 group-hover:opacity-100 transition-opacity">verified</span>
                </div>
                <span className="font-display-bold text-lg font-bold text-slate-900 dark:text-white tracking-tight">{p}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-slate-900 border-y border-[var(--color-divider)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-6 block">Jak to działa</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-on-background)] mb-4 tracking-tight">Transport palet w 3 prostych krokach</h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg opacity-70">Szybko, przejrzyście i bez zbędnych formalności.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="bg-slate-50 dark:bg-slate-950 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-premium h-full">
                  <div className="text-[80px] font-display-bold font-bold text-slate-100 dark:text-slate-800 group-hover:text-[var(--color-primary)]/10 transition-colors mb-6 leading-none">{step.step}</div>
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-[var(--color-on-surface-variant)] leading-relaxed">{step.desc}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-5 w-10 h-0.5 bg-slate-200 dark:bg-slate-800 z-10">
                    <span className="material-symbols-outlined absolute -top-2 -right-2 text-[var(--color-primary)]">arrow_forward</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Ticker */}
      <div className="bg-white dark:bg-slate-900 py-8 overflow-hidden border-b border-[var(--color-divider)] relative z-20">
        <div className="flex gap-24 whitespace-nowrap animate-shimmer-slow px-8">
          {[...activityTicker, ...activityTicker].map((item, i) => (
            <div key={i} className="flex items-center gap-6 text-sm font-bold">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
                <span className="text-slate-400 uppercase tracking-[0.2em] text-[10px]">{item.time}</span>
              </div>
              <span className="text-slate-900 dark:text-white font-display-bold text-base">{item.city}</span>
              <span className="px-4 py-1.5 bg-[var(--color-primary-highlight)] text-[var(--color-primary)] rounded-full text-[11px] uppercase tracking-widest">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Counter */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-[var(--color-divider)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-6 block">Liczby mówią same za siebie</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-on-background)] tracking-tight">PaletyBroker w statystykach</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 rounded-[32px] p-8 text-center border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium"
              >
                <div className="text-4xl lg:text-5xl font-display-bold font-bold text-[var(--color-primary)] mb-3 flex items-baseline justify-center gap-1">
                  <Counter end={stat.end} duration={2000} suffix="" />
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Premium Card System */}
      <section className="py-32 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-2xl">
              <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-6 block">{t.home.testimonialsLabel}</span>
              <h2 className="text-5xl lg:text-6xl font-bold text-[var(--color-on-background)] mb-8 tracking-tight">{t.home.testimonialsTitle}</h2>
              <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed opacity-80">{t.home.testimonialsDesc}</p>
            </div>
            <div className="flex gap-6">
              <button aria-label="Poprzednia opinia" onClick={prevTestimonial} className="w-16 h-16 rounded-[24px] border border-[var(--color-divider)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:border-transparent transition-premium active:scale-90 shadow-sm">
                <span className="material-symbols-outlined text-2xl">west</span>
              </button>
              <button aria-label="Następna opinia" onClick={nextTestimonial} className="w-16 h-16 rounded-[24px] border border-[var(--color-divider)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white hover:border-transparent transition-premium active:scale-90 shadow-sm">
                <span className="material-symbols-outlined text-2xl">east</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-visible">
              <div 
                className="flex transition-transform duration-1000 cubic-bezier(0.23, 1, 0.32, 1)"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((t, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    viewport={{ once: true }}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-slate-50 dark:bg-slate-950 p-12 lg:p-24 rounded-[64px] border border-slate-100 dark:border-slate-800 relative group overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 p-16 text-[var(--color-primary)] opacity-[0.05] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                        <span className="material-symbols-outlined text-[240px]">format_quote</span>
                      </div>
                      <div className="relative z-10">
                        <div className="flex gap-1.5 mb-12">
                          {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined text-amber-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                        </div>
                        <p className="text-3xl lg:text-5xl text-[var(--color-on-background)] font-bold leading-[1.2] mb-16 tracking-tight">&ldquo;{t.text}&rdquo;</p>
                        <div className="flex items-center gap-8">
                          {t.avatarImage ? (
                            <CmsManagedImage
                              src={t.avatarImage}
                              fallbackSrc="/images/avatars/client-1.webp"
                              alt={t.name}
                              className="w-20 h-20 rounded-[28px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl"
                              imgClassName="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-[28px] bg-[var(--color-primary-highlight)] flex items-center justify-center text-[var(--color-primary)] shadow-inner">
                              <span className="material-symbols-outlined text-4xl">{t.avatar}</span>
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-2xl tracking-tight">{t.name}</div>
                            <div className="text-[11px] text-[var(--color-primary)] font-bold uppercase tracking-[0.2em] mt-2">{t.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-slate-50 border-y border-[var(--color-divider)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-[10px] mb-4 block">{t.home.support.badge}</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">{supportTitle}</h2>
              <p className="text-xl text-[var(--color-on-surface-variant)] mb-12 leading-relaxed">
                {supportSubtitle}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4"><span className="material-symbols-outlined">bolt</span></div>
                  <div className="font-bold text-lg">15 min</div>
                  <div className="text-xs text-slate-400 font-medium">{t.home.support.responseTime}</div>
                </div>
                <div className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4"><span className="material-symbols-outlined">support_agent</span></div>
                  <div className="font-bold text-lg">24/7</div>
                  <div className="text-xs text-slate-400 font-medium">{t.home.support.monitoring}</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[48px] shadow-2xl border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-2xl font-bold mb-8">{t.home.support.form.title}</h3>
              <form 
                onSubmit={submitSupportLead}
                className="flex flex-col gap-5 relative z-10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input required name="name" type="text" placeholder={t.home.support.form.name} className="p-5 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all" />
                  <input required name="email" type="email" placeholder={t.home.support.form.email} className="p-5 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all" />
                </div>
                <textarea required name="message" placeholder={t.home.support.form.message} rows={5} className="p-5 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all resize-none"></textarea>
                <button 
                  type="submit" 
                  disabled={isSending === 'support'}
                  className="bg-slate-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-black transition-premium active:scale-95 disabled:opacity-50"
                >
                  {isSending === 'support' ? t.home.support.form.sending : t.home.support.form.button}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 mb-24">
        <div className="max-w-5xl mx-auto rounded-[60px] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl group">
          <CmsManagedImage
            src={ctaVisualImage}
            fallbackSrc="/images/home-cta-warehouse.webp"
            alt={t.home.cta.imageAlt}
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-[var(--color-primary)]/90 backdrop-blur-[2px]" />

          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight">{ctaTitle}</h2>
            <p className="text-xl lg:text-2xl opacity-80 mb-12 max-w-3xl mx-auto leading-relaxed">{ctaSubtitle}</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/rejestracja" className="bg-white text-[var(--color-primary)] px-12 py-5 rounded-2xl font-bold shadow-2xl hover:bg-slate-100 transition-premium active:scale-95 text-lg">
                {t.home.cta.buttonRegister}
              </Link>
              <Link href="/wycena" className="bg-transparent border-2 border-white/30 px-12 py-5 rounded-2xl font-bold hover:bg-white/10 transition-premium active:scale-95 text-lg">
                {t.home.cta.buttonQuote}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

