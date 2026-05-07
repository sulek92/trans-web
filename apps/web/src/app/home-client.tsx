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
import { TestimonialsModule } from '@/components/testimonials-module';

type Partner = { name: string; logo: string };

const DEFAULT_PARTNER_LOGOS: Record<string, string> = {
  'dhl freight': '/images/partners/dhl.svg',
  'dhl': '/images/partners/dhl.svg',
  'fedex express': '/images/partners/fedex.svg',
  'fedex': '/images/partners/fedex.svg',
  'raben': '/images/partners/raben.svg',
  'dsv': '/images/partners/dsv.svg',
  'db schenker': '/images/partners/dbschenker.svg',
  'db schenker logistics': '/images/partners/dbschenker.svg',
};

function normalizePartners(raw: unknown, defaults: Partner[]): Partner[] {
  if (!raw || !Array.isArray(raw)) return defaults;
  const parsed: Partner[] = [];
  for (const item of raw) {
    if (typeof item === 'string' && item.trim()) {
      const key = item.trim().toLowerCase();
      parsed.push({ name: item, logo: DEFAULT_PARTNER_LOGOS[key] || '' });
    } else if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;
      const name = String(obj.name || '').trim();
      const logo = String(obj.logo || '').trim() || DEFAULT_PARTNER_LOGOS[name.toLowerCase()] || '';
      if (name || logo) parsed.push({ name, logo });
    }
  }
  return parsed.length > 0 ? parsed : defaults;
}

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
interface CmsActivityTickerItem {
  city: string;
  status: string;
  time: string;
}

interface CmsHowItWorksItem {
  step: string;
  title: string;
  desc: string;
  icon: string;
}

interface CmsStatItem {
  label: string;
  end: number;
  suffix: string;
}

interface CmsPageData {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBadge?: string;
  heroVisualImage?: string;
  heroVisualCaption?: string;
  partners?: (string | Partner)[];
  activityTicker?: CmsActivityTickerItem[];
  howItWorks?: CmsHowItWorksItem[];
  stats?: CmsStatItem[];
  supportTitle?: string;
  supportSubtitle?: string;
  supportVisualImage?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaVisualImage?: string;
}

export function HomePageClient({
  initialCmsData,
}: {
  initialCmsData: Record<string, unknown> | null;
}) {
  const { t, locale } = useTranslation();
  const [isSending, setIsSending] = React.useState<string | null>(null);
  const [showQuickBar, setShowQuickBar] = React.useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const c = (initialCmsData ?? {}) as CmsPageData;
  const heroTitle = c.heroTitle || t?.hero?.title || '';
  const heroSubtitle = c.heroSubtitle || t?.hero?.subtitle || '';
  const heroBadge = c.heroBadge || t?.home?.hero?.badge || '';
  const heroVisualImage = c.heroVisualImage || '/images/home-hero-logistics.webp';
  const heroVisualCaption = c.heroVisualCaption || t?.home?.hero?.visualCaption || '';
  const partners = normalizePartners(c.partners, [
    { name: 'DHL Freight', logo: '/images/partners/dhl.svg' },
    { name: 'FedEx Express', logo: '/images/partners/fedex.svg' },
    { name: 'Raben', logo: '/images/partners/raben.svg' },
    { name: 'DSV', logo: '/images/partners/dsv.svg' },
    { name: 'DB Schenker', logo: '/images/partners/dbschenker.svg' },
  ]);
  const activityTicker = c.activityTicker || [
    { city: 'Warszawa', status: t.home.ticker.received, time: `2 ${t.home.ticker.ago}` },
    { city: 'Berlin', status: t.home.ticker.inTransit, time: `5 ${t.home.ticker.ago}` },
    { city: 'Kraków', status: t.home.ticker.delivered, time: `12 ${t.home.ticker.ago}` },
    { city: 'Praga', status: t.home.ticker.received, time: `15 ${t.home.ticker.ago}` },
    { city: 'Wrocław', status: t.home.ticker.delivered, time: `20 ${t.home.ticker.ago}` },
    { city: 'Gdańsk', status: t.home.ticker.received, time: `25 ${t.home.ticker.ago}` },
    { city: 'Poznań', status: t.home.ticker.inTransit, time: `28 ${t.home.ticker.ago}` },
  ];
  const howItWorks = c.howItWorks || [
    { step: '01', title: t.home.howItWorks.step1.title, desc: t.home.howItWorks.step1.desc, icon: 'search' },
    { step: '02', title: t.home.howItWorks.step2.title, desc: t.home.howItWorks.step2.desc, icon: 'compare_arrows' },
    { step: '03', title: t.home.howItWorks.step3.title, desc: t.home.howItWorks.step3.desc, icon: 'local_shipping' },
  ];
  const stats = c.stats || [
    { label: t.home.stats.pallets, end: 45000, suffix: '+' },
    { label: t.home.stats.clients, end: 1200, suffix: '+' },
    { label: t.home.stats.countries, end: 28, suffix: '' },
    { label: t.home.stats.savings, end: 22, suffix: '%' },
  ];
  const supportTitle = c.supportTitle || t.home.support.title;
  const supportSubtitle = c.supportSubtitle || t.home.support.subtitle;
  const supportVisualImage = c.supportVisualImage || '/images/home-support-team.webp';
  const ctaTitle = c.ctaTitle || t.home.cta.title;
  const ctaSubtitle = c.ctaSubtitle || t.home.cta.subtitle;
  const ctaVisualImage = c.ctaVisualImage || '/images/home-cta-warehouse.webp';

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
    <main key={locale} className="pb-12 sm:pb-16 bg-[var(--color-background)] text-[var(--color-on-background)] transition-colors duration-500">
      {/* Quick Quote Bar - Redesigned as a floating premium pill */}
      <div className={cn(
        "fixed top-32 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
        showQuickBar ? "translate-y-0 opacity-100 scale-100" : "-translate-y-20 opacity-0 scale-90 pointer-events-none"
      )}>
        <div className="glass rounded-full px-2 py-2 flex items-center gap-6 shadow-[var(--shadow-premium-hover)]">
          <div className="flex items-center gap-4 px-6 border-r border-[var(--color-divider)]">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20">
              <span className="material-symbols-outlined text-lg">pallet</span>
            </div>
              <div className="hidden sm:block text-left">
                  <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest leading-none mb-1">PaletBroker</div>
                  <div className="text-sm font-bold text-[var(--color-on-background)] leading-none">{t.home.quickQuoteLabel}</div>
                </div>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <div className="text-xs font-bold text-[var(--color-text-faint)] line-through opacity-40">219 PLN</div>
            <div className="text-lg font-display font-bold text-[var(--color-primary)] tracking-tight">149 PLN</div>
          </div>
          <button 
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[var(--color-on-background)] text-[var(--color-background)] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-premium shadow-xl active:scale-95"
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
                className="font-display text-[42px] sm:text-[56px] lg:text-[72px] leading-[0.95] text-[var(--color-on-background)] mb-8 font-bold tracking-tighter"
              >
                {heroTitle}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-body text-[18px] sm:text-[20px] lg:text-[22px] text-[var(--color-text-muted)] max-w-2xl leading-relaxed mb-12"
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
                <Link href="/dla-firm" className="bg-[var(--color-surface-primary)] border border-[var(--color-divider)] text-[var(--color-on-background)] px-12 py-6 rounded-[24px] font-bold hover:border-[var(--color-primary)] transition-premium flex items-center justify-center gap-3 text-xl shadow-lg">
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
            <div className="relative overflow-hidden rounded-[48px] border border-[var(--color-divider)] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] bg-[var(--color-surface-container)] group">
              <CmsManagedImage
                src={heroVisualImage}
                fallbackSrc="/images/home-hero-logistics.webp"
                alt="Centrum operacyjne logistyki paletowej"
                className="aspect-[16/11] w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="inline-flex items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-xl px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.2em] text-white border border-white/20 shadow-2xl">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_8px_var(--color-primary)]"></span>
                  {heroVisualCaption}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-[var(--color-divider)] bg-[var(--color-surface-primary)]/50 backdrop-blur-xl p-6 text-sm text-[var(--color-text-muted)] shadow-sm font-medium flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[var(--color-surface-container)] border-2 border-[var(--color-surface-primary)] flex items-center justify-center text-[10px] font-bold text-[var(--color-on-background)]">U{i}</div>
                ))}
              </div>
              <span>{t.home.partnerComparison} <span className="text-[var(--color-primary)] font-bold">12{t.home.carriersSuffix} {t.home.carriers}</span> {t.home.realtimeComparison}</span>
            </div>
          </motion.div>
        </div>

        <div id="calculator" className="mt-16 lg:mt-24">
          {/* Calculator */}
          <div className="bg-[var(--color-surface-primary)] p-8 sm:p-16 rounded-[60px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)] relative transition-premium group">
            <div className="absolute -top-6 right-16 bg-[var(--color-primary)] text-white text-[11px] font-bold px-6 py-3 rounded-full shadow-2xl animate-float tracking-widest uppercase">{t.home.calculator.badge}</div>
            <div className="mb-12 flex flex-col gap-6 text-left">
              <h2 className="text-4xl sm:text-5xl font-bold text-[var(--color-on-background)] flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-4xl">calculate</span>
                </div>
                {t.home.calculator.title}
              </h2>
              <p className="text-xl text-[var(--color-text-muted)] max-w-3xl leading-relaxed">
                {t.home.calculator.subtitle}
              </p>
            </div>
            <React.Suspense fallback={<div className="h-[400px] flex items-center justify-center text-[var(--color-text-faint)] font-bold">{t.home.calculator.loading}</div>}>
              <QuoteForm />
            </React.Suspense>
          </div>

          {/* Quick Tracking */}
          <div className="mt-12 bg-[var(--color-surface-primary)] rounded-[48px] p-10 sm:p-16 shadow-[var(--shadow-premium)] border border-[var(--color-divider)] group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-16 opacity-5 text-[var(--color-primary)] group-hover:scale-110 group-hover:rotate-12 transition-premium">
              <span className="material-symbols-outlined text-[200px]">location_searching</span>
            </div>
            <div className="relative z-10 text-left">
              <h3 className="font-bold text-3xl mb-8 flex items-center gap-4 text-[var(--color-on-background)]">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-highlight)] flex items-center justify-center text-[var(--color-primary)] shadow-inner">
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
                  className="w-full bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] rounded-[24px] px-8 py-6 text-xl outline-none focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] transition-all placeholder:text-[var(--color-text-faint)] font-mono shadow-inner text-[var(--color-on-background)]"
                />
                <button
                  type="submit"
                  disabled={isSending === 'tracking'}
                  className="bg-[var(--color-primary)] text-white px-12 py-6 rounded-[24px] font-bold text-xl hover:shadow-[var(--shadow-premium-hover)] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSending === 'tracking' ? t.home.tracking.searching : t.home.tracking.button}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section - Premium Monochrome Grid */}
      <section className="bg-[var(--color-background)] py-24 border-y border-[var(--color-divider)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[var(--color-text-faint)] mb-4 block">{t.home.partners.title}</span>
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
                <div className="w-20 h-20 rounded-full bg-[var(--color-surface-primary)] border border-[var(--color-divider)] flex items-center justify-center shadow-sm group-hover:shadow-xl group-hover:border-[var(--color-primary)]/20 transition-premium overflow-hidden">
                  {p.logo ? (
                    <Image
                      src={p.logo}
                      alt={p.name}
                      width={56}
                      height={56}
                      className="object-contain p-2 group-hover:scale-110 transition-transform duration-500 dark:brightness-110 dark:invert-[0.1]"
                      sizes="80px"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[var(--color-primary)] opacity-40 group-hover:opacity-100 transition-opacity text-2xl">verified</span>
                  )}
                </div>
                <span className="font-display text-lg font-bold text-[var(--color-on-background)] tracking-tight">{p.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[var(--color-background)] border-y border-[var(--color-divider)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-6 block">Jak to działa</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--color-on-background)] mb-4 tracking-tight">Transport palet w 3 prostych krokach</h2>
            <p className="text-[var(--color-text-muted)] text-lg opacity-70">Szybko, przejrzyście i bez zbędnych formalności.</p>
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
                <div className="bg-[var(--color-surface-secondary)] rounded-[40px] p-10 border border-[var(--color-divider)] shadow-sm hover:shadow-2xl transition-premium h-full text-left">
                  <div className="text-[80px] font-display font-bold text-[var(--color-on-background)] opacity-5 group-hover:text-[var(--color-primary)]/10 transition-colors mb-6 leading-none">{step.step}</div>
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight text-[var(--color-on-background)]">{step.title}</h3>
                  <p className="text-[var(--color-text-muted)] leading-relaxed">{step.desc}</p>
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-5 w-10 h-0.5 bg-[var(--color-divider)] z-10">
                    <span className="material-symbols-outlined absolute -top-2 -right-2 text-[var(--color-primary)]">arrow_forward</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Ticker */}
      <div className="bg-[var(--color-background)] py-8 overflow-hidden border-b border-[var(--color-divider)] relative z-20 transition-colors">
        <div className="flex gap-24 whitespace-nowrap animate-shimmer-slow px-8">
          {[...activityTicker, ...activityTicker].map((item, i) => (
            <div key={i} className="flex items-center gap-6 text-sm font-bold">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></div>
                <span className="text-[var(--color-text-faint)] uppercase tracking-[0.2em] text-[10px]">{item.time}</span>
              </div>
              <span className="text-[var(--color-on-background)] font-display text-base">{item.city}</span>
              <span className="px-4 py-1.5 bg-[var(--color-primary-highlight)] text-[var(--color-primary)] rounded-full text-[11px] uppercase tracking-widest">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Counter */}
      <section className="py-24 bg-[var(--color-surface-container)]/30 border-y border-[var(--color-divider)]">
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
                className="bg-[var(--color-surface-primary)] rounded-[32px] p-8 text-center border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium"
              >
                <div className="text-4xl lg:text-5xl font-display font-bold text-[var(--color-primary)] mb-3 flex items-baseline justify-center gap-1">
                  <Counter end={stat.end} duration={2000} suffix="" />
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-sm font-bold text-[var(--color-text-faint)] uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsModule
        fallbackTestimonials={[
          { name: t.home.testimonials.items[0].name, role: t.home.testimonials.items[0].role, text: t.home.testimonials.items[0].text, avatar: 'person', avatarImage: '/images/avatars/client-1.webp' },
          { name: t.home.testimonials.items[1].name, role: t.home.testimonials.items[1].role, text: t.home.testimonials.items[1].text, avatar: 'person_3', avatarImage: '/images/avatars/client-2.webp' },
          { name: t.home.testimonials.items[2].name, role: t.home.testimonials.items[2].role, text: t.home.testimonials.items[2].text, avatar: 'person_4', avatarImage: '/images/avatars/client-3.webp' },
        ]}
      />

      {/* Support Section */}
      <section className="py-24 bg-[var(--color-surface-secondary)] border-y border-[var(--color-divider)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="text-left">
              <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-[10px] mb-4 block">{t.home.support.badge}</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight text-[var(--color-on-background)]">{supportTitle}</h2>
              <p className="text-xl text-[var(--color-text-muted)] mb-12 leading-relaxed">
                {supportSubtitle}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-[var(--color-surface-primary)] rounded-[24px] border border-[var(--color-divider)] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4"><span className="material-symbols-outlined">bolt</span></div>
                  <div className="font-bold text-lg text-[var(--color-on-background)]">15 min</div>
                  <div className="text-xs text-[var(--color-text-faint)] font-medium">{t.home.support.responseTime}</div>
                </div>
                <div className="p-6 bg-[var(--color-surface-primary)] rounded-[24px] border border-[var(--color-divider)] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4"><span className="material-symbols-outlined">support_agent</span></div>
                  <div className="font-bold text-lg text-[var(--color-on-background)]">24/7</div>
                  <div className="text-xs text-[var(--color-text-faint)] font-medium">{t.home.support.monitoring}</div>
                </div>
              </div>
            </div>
            <div className="bg-[var(--color-surface-primary)] p-10 rounded-[48px] shadow-2xl border border-[var(--color-divider)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-2xl font-bold mb-8 text-[var(--color-on-background)] text-left">{t.home.support.form.title}</h3>
              <form 
                onSubmit={submitSupportLead}
                className="flex flex-col gap-5 relative z-10 text-left"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input required name="name" type="text" placeholder={t.home.support.form.name} className="p-5 bg-[var(--color-surface-secondary)] rounded-2xl border border-transparent focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-all text-[var(--color-on-background)]" />
                  <input required name="email" type="email" placeholder={t.home.support.form.email} className="p-5 bg-[var(--color-surface-secondary)] rounded-2xl border border-transparent focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-all text-[var(--color-on-background)]" />
                </div>
                <textarea required name="message" placeholder={t.home.support.form.message} rows={5} className="p-5 bg-[var(--color-surface-secondary)] rounded-2xl border border-transparent focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-all resize-none text-[var(--color-on-background)]"></textarea>
                <button 
                  type="submit" 
                  disabled={isSending === 'support'}
                  className="bg-[var(--color-on-background)] text-[var(--color-background)] py-5 rounded-2xl font-bold shadow-xl hover:bg-[var(--color-primary)] hover:text-white transition-premium active:scale-95 disabled:opacity-50"
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
              <Link href="/rejestracja" className="bg-white text-[var(--color-primary)] px-12 py-5 rounded-2xl font-bold shadow-2xl hover:bg-white/90 transition-premium active:scale-95 text-lg">
                {t.home.cta.buttonRegister}
              </Link>
              <Link href="/wycena" className="bg-transparent border-2 border-white/30 px-12 py-5 rounded-2xl font-bold hover:bg-white/10 transition-premium active:scale-95 text-lg text-white">
                {t.home.cta.buttonQuote}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

