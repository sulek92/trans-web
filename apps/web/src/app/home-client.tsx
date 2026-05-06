'use client';

import * as React from 'react';
import { QuoteForm } from '@/components/calculator/quote-form';
import { Counter } from '@/components/ui/counter';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { createLead } from '@/lib/leads';
import { useToastStore } from '@/lib/store/toast-store';

type CmsManagedImageProps = {
  src?: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

function CmsManagedImage({
  src,
  fallbackSrc,
  alt,
  className = '',
  imgClassName = '',
}: CmsManagedImageProps) {
  const normalizedSrc = React.useMemo(() => {
    const trimmed = (src || '').trim();
    return trimmed.length > 0 ? trimmed : fallbackSrc;
  }, [src, fallbackSrc]);

  const [currentSrc, setCurrentSrc] = React.useState(normalizedSrc);

  React.useEffect(() => {
    setCurrentSrc(normalizedSrc);
  }, [normalizedSrc]);

  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        className={imgClassName}
        onError={() => {
          if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
        }}
      />
    </div>
  );
}

export function HomePageClient({
  initialCmsData,
}: {
  initialCmsData: Record<string, unknown> | null;
}) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isSending, setIsSending] = React.useState<string | null>(null);
  const [showQuickBar, setShowQuickBar] = React.useState(false);
  const addToast = useToastStore((state) => state.addToast);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (initialCmsData ?? {}) as Record<string, any>;

  const heroTitle = (c.heroTitle as string) || t.hero.title;
  const heroSubtitle = (c.heroSubtitle as string) || t.hero.subtitle;
  const heroBadge = (c.heroBadge as string) || 'Logistyka B2B dla profesjonalistów';
  const heroVisualImage = (c.heroVisualImage as string) || '/images/home-hero-logistics.jpg';
  const heroVisualCaption = (c.heroVisualCaption as string) || 'Operacje paletowe 24/7';
  const partners = (c.partners as string[]) || ['DHL Freight', 'FedEx Express', 'Raben', 'DSV', 'DB Schenker'];
  const activityTicker = (c.activityTicker as {city:string;status:string;time:string}[]) || [
    { city: 'Warszawa', status: 'Odebrano', time: '2 min temu' },
    { city: 'Berlin', status: 'W trasie', time: '5 min temu' },
    { city: 'Kraków', status: 'Dostarczono', time: '12 min temu' },
    { city: 'Praga', status: 'Odebrano', time: '15 min temu' },
    { city: 'Wrocław', status: 'Dostarczono', time: '20 min temu' },
  ];
  const howItWorks = (c.howItWorks as {step:string;title:string;desc:string;icon:string}[]) || [
    { step: '01', title: 'Wyceń online', desc: 'Podaj kody pocztowe i wymiary palety w naszym kalkulatorze.', icon: 'search' },
    { step: '02', title: 'Wybierz kuriera', desc: 'Porównaj ceny i czasy dostawy topowych przewoźników B2B.', icon: 'compare_arrows' },
    { step: '03', title: 'Zleć odbiór', desc: 'Opłać zamówienie i czekaj na kuriera. Etykietę dostaniesz na maila.', icon: 'local_shipping' },
  ];
  const stats = (c.stats as {label:string;end:number;suffix:string}[]) || [
    { label: 'Obsłużonych palet', end: 45000, suffix: '+' },
    { label: 'Aktywnych klientów', end: 1200, suffix: '+' },
    { label: 'Krajów w sieci', end: 28, suffix: '' },
    { label: 'Średnia oszczędność', end: 22, suffix: '%' },
  ];
  const testimonials = (c.testimonials as {name:string;role:string;text:string;avatar:string;avatarImage?: string}[]) || [
    {
      name: 'Marek Jankowski',
      role: 'CEO, E-com Group',
      text: 'Przejście na PaletBroker skróciło czas nadawania przesyłek o połowę.',
      avatar: 'person',
      avatarImage: '/images/avatars/client-1.jpg',
    },
    {
      name: 'Anna Nowak',
      role: 'Logistics Manager, TechFood',
      text: 'Najbardziej cenimy sobie dedykowanego opiekuna.',
      avatar: 'person_3',
      avatarImage: '/images/avatars/client-2.jpg',
    },
    {
      name: 'Robert Wilk',
      role: 'Właściciel, Wilk Meble',
      text: 'Ceny są bezkonkurencyjne.',
      avatar: 'person_4',
      avatarImage: '/images/avatars/client-3.jpg',
    },
  ];
  const supportTitle = (c.supportTitle as string) || 'Zawsze do Twojej dyspozycji';
  const supportSubtitle = (c.supportSubtitle as string) || 'Logistyka to branża, w której liczy się czas i precyzja. Nasz zespół wsparcia czuwa nad Twoimi przesyłkami i odpowie na każde pytanie w mniej niż 15 minut.';
  const supportVisualImage = (c.supportVisualImage as string) || '/images/home-support-team.jpg';
  const ctaTitle = (c.ctaTitle as string) || 'Zacznij wysyłać taniej już dziś';
  const ctaSubtitle = (c.ctaSubtitle as string) || 'Dołącz do 1200+ firm, które zaufały technologii PaletBroker. Twoja pierwsza przesyłka może być u odbiorcy już jutro.';
  const ctaVisualImage = (c.ctaVisualImage as string) || '/images/home-cta-warehouse.jpg';
  const totalTestimonials = testimonials.length;

  React.useEffect(() => {
    const handleScroll = () => setShowQuickBar(window.scrollY > 800);
    window.addEventListener('scroll', handleScroll);
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
        title: 'Wiadomosc wyslana',
        description: 'Dziekujemy. Odpowiemy w ciagu 15 minut.',
        type: 'success',
      });
      form.reset();
    } catch (error) {
      addToast({
        title: 'Blad wysylki',
        description: error instanceof Error ? error.message : 'Nie udalo sie wyslac formularza.',
        type: 'error',
      });
    } finally {
      setIsSending(null);
    }
  };

  return (
    <main className="pt-24 pb-16 bg-[var(--color-background)]">
      {/* Quick Quote Bar */}
      <div className={`fixed top-0 left-0 w-full glass z-[60] py-3 px-8 transition-all duration-500 transform ${showQuickBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} hidden md:flex items-center justify-between shadow-lg`}>
        <div className="flex items-center gap-6">
          <div className="font-display-bold font-bold text-[var(--color-primary)]">PaletBroker</div>
          <div className="h-4 w-px bg-[var(--color-divider)]"></div>
          <div className="text-sm font-medium text-slate-500">Błyskawiczna wycena palet B2B</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ceny od 149 PLN</div>
          <button 
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-premium shadow-lg"
          >
            Wyceń teraz
          </button>
        </div>
      </div>
      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-8 mb-24 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-lg">
            <div>
              <span className="inline-block px-3 py-1 bg-[var(--color-primary-highlight)] text-[var(--color-on-primary-fixed-variant)] font-label-sm text-[14px] font-bold rounded-full mb-6 border border-[var(--color-primary)] transition-premium hover:scale-105 cursor-default">{heroBadge}</span>
              <h1 className="font-display-bold text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.1] text-[var(--color-on-background)] mb-6 font-bold tracking-tight">
                {heroTitle}
              </h1>
              <p className="font-body-base text-[16px] sm:text-[18px] lg:text-[20px] text-[var(--color-on-surface-variant)] max-w-2xl leading-relaxed mb-10">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[var(--color-primary)] text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:bg-[var(--color-surface-tint)] transition-premium active:scale-95 flex items-center justify-center gap-3 text-lg"
                >
                  {t.hero.cta}
                  <span className="material-symbols-outlined">calculate</span>
                </button>
                <Link href="/dla-firm" className="bg-white border border-[var(--color-divider)] text-[var(--color-on-background)] px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-premium flex items-center justify-center gap-2 text-lg">
                  Oferta B2B
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Calculator & Tracking */}
          <div id="calculator" className="lg:col-span-5 flex flex-col gap-6 animate-float">
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-divider)] shadow-xl bg-slate-900">
              <CmsManagedImage
                src={heroVisualImage}
                fallbackSrc="/images/home-hero-logistics.jpg"
                alt="Centrum operacyjne logistyki paletowej"
                className="aspect-[16/10] w-full"
                imgClassName="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/85">
                  <span className="material-symbols-outlined text-sm">monitoring</span>
                  {heroVisualCaption}
                </div>
              </div>
            </div>

            {/* Calculator */}
            <div className="bg-[var(--color-surface-primary)] p-8 rounded-2xl shadow-xl border border-[var(--color-divider)] relative transition-premium hover:shadow-2xl">
              <div className="absolute -top-3 -right-3 bg-[var(--color-secondary)] text-white text-[10px] font-bold px-2 py-1 rounded rotate-12 shadow-sm animate-pulse">NAJTANIEJ</div>
              <h2 className="font-h2-medium text-[20px] font-bold text-[var(--color-on-surface)] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-primary)]">calculate</span>
                Błyskawiczna wycena
              </h2>
              <React.Suspense fallback={<div className="h-[400px] flex items-center justify-center text-slate-300 font-bold">Ładowanie kalkulatora...</div>}>
                <QuoteForm />
              </React.Suspense>
            </div>

            {/* Quick Tracking */}
            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 text-white group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-premium">
                <span className="material-symbols-outlined text-6xl">location_searching</span>
              </div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-400">track_changes</span>
                Gdzie jest moja paleta?
              </h3>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem('trackingNumber') as HTMLInputElement | null;
                  const val = input?.value;
                  if (!val) return alert('Wpisz numer zlecenia');
                  simulateSend('tracking', `Szukanie zlecenia: ${val}... (Funkcja w przygotowaniu)`);
                }}
                className="flex gap-2"
              >
                <input 
                  name="trackingNumber"
                  type="text" 
                  placeholder="Numer zlecenia (np. OR-1234)" 
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm flex-grow outline-none focus:border-teal-400 transition-colors placeholder:text-white/30 font-data-mono"
                />
                <button 
                  type="submit" 
                  disabled={isSending === 'tracking'}
                  className="bg-teal-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-50 relative overflow-hidden"
                >
                  {isSending === 'tracking' ? <span className="animate-pulse">Szukanie...</span> : 'Szukaj'}
                  {isSending === 'tracking' && <div className="absolute inset-0 animate-shimmer"></div>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-white py-16 border-y border-[var(--color-divider)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Oficjalni Partnerzy Logistyczni</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center justify-items-center opacity-40 grayscale">
            {partners.map((p, i) => (
              <div key={i} className="font-display-bold text-xl font-bold hover:opacity-100 hover:grayscale-0 hover:text-[var(--color-primary)] transition-premium cursor-default">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Ticker */}
      <div className="bg-slate-50/50 py-4 overflow-hidden border-b border-[var(--color-divider)] glass relative z-20">
        <div className="flex gap-12 animate-float whitespace-nowrap px-8">
          {activityTicker.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-400">{item.time}</span>
              <span className="font-bold">{item.city}</span>
              <span className="text-slate-400">—</span>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <section className="py-24 max-w-[1280px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[var(--color-on-background)] mb-4">Jak to działa?</h2>
          <p className="text-[var(--color-on-surface-variant)]">Wysyłka palety nigdy nie była tak prosta.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {howItWorks.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="text-[64px] font-display-bold font-bold text-[var(--color-primary)] opacity-10 absolute -top-8 left-0">{item.step}</div>
              <div className="relative pt-4">
                <div className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-[1280px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-2">
                  <Counter end={Number(stat.end)} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-[var(--color-on-background)] mb-4">Zaufali nam liderzy branż</h2>
              <p className="text-[var(--color-on-surface-variant)] text-lg">Zobacz, co o współpracy z PaletBroker mówią nasi stali partnerzy biznesowi.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={prevTestimonial} className="w-12 h-12 rounded-full border border-[var(--color-divider)] flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-90">
                <span className="material-symbols-outlined">west</span>
              </button>
              <button onClick={nextTestimonial} className="w-12 h-12 rounded-full border border-[var(--color-divider)] flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-90">
                <span className="material-symbols-outlined">east</span>
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((t, i) => (
                  <div key={i} className="w-full flex-shrink-0 px-4">
                    <div className="bg-slate-50 p-12 rounded-[40px] border border-slate-100 relative h-full">
                      <div className="text-[var(--color-primary)] opacity-20 mb-8">
                        <span className="material-symbols-outlined text-6xl">format_quote</span>
                      </div>
                      <p className="text-2xl text-[var(--color-on-background)] font-medium italic mb-12 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                      <div className="flex items-center gap-6">
                        {t.avatarImage ? (
                          <CmsManagedImage
                            src={t.avatarImage}
                            fallbackSrc="/images/avatars/client-1.jpg"
                            alt={t.name}
                            className="w-16 h-16 rounded-full overflow-hidden border border-[var(--color-divider)]"
                            imgClassName="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-[var(--color-primary-highlight)] flex items-center justify-center text-[var(--color-primary)]">
                            <span className="material-symbols-outlined text-3xl">{t.avatar}</span>
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-lg">{t.name}</div>
                          <div className="text-sm text-slate-400 font-medium uppercase tracking-widest">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-slate-50 border-y border-[var(--color-divider)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{supportTitle}</h2>
              <p className="text-lg text-[var(--color-on-surface-variant)] mb-10 leading-relaxed">
                {supportSubtitle}
              </p>
              <div className="overflow-hidden rounded-3xl border border-[var(--color-divider)] shadow-lg">
                <CmsManagedImage
                  src={supportVisualImage}
                  fallbackSrc="/images/home-support-team.jpg"
                  alt="Zespół wsparcia klienta PaletBroker"
                  className="aspect-[16/10] w-full"
                  imgClassName="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 relative z-10">
              <h3 className="text-xl font-bold mb-6">Napisz do nas</h3>
              <form 
                onSubmit={submitSupportLead}
                className="flex flex-col gap-4"
              >
                <input required name="name" type="text" placeholder="Imię i nazwisko" className="p-4 bg-slate-50 rounded-xl border border-transparent focus:border-[var(--color-primary)] outline-none transition-colors" />
                <input required name="email" type="email" placeholder="E-mail firmowy" className="p-4 bg-slate-50 rounded-xl border border-transparent focus:border-[var(--color-primary)] outline-none transition-colors" />
                <textarea required name="message" placeholder="W czym możemy pomóc?" rows={4} className="p-4 bg-slate-50 rounded-xl border border-transparent focus:border-[var(--color-primary)] outline-none transition-colors resize-none"></textarea>
                <button 
                  type="submit" 
                  disabled={isSending === 'support'}
                  className="bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[var(--color-surface-tint)] transition-premium active:scale-95 disabled:opacity-50 relative overflow-hidden"
                >
                  {isSending === 'support' ? <span className="animate-pulse">Wysyłanie...</span> : 'Wyślij wiadomość'}
                  {isSending === 'support' && <div className="absolute inset-0 animate-shimmer"></div>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-8 mb-24">
        <div className="max-w-4xl mx-auto rounded-[60px] p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <CmsManagedImage
            src={ctaVisualImage}
            fallbackSrc="/images/home-cta-warehouse.jpg"
            alt="Magazyn i transport palet"
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#005258]/85" />

          <div className="relative z-10">
            <h2 className="text-5xl font-bold mb-8">{ctaTitle}</h2>
            <p className="text-xl opacity-80 mb-12 max-w-2xl mx-auto">{ctaSubtitle}</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/rejestracja" className="bg-white text-[#005258] px-10 py-5 rounded-2xl font-bold shadow-xl hover:bg-slate-100 transition-premium active:scale-95">
                Załóż konto B2B
              </Link>
              <Link href="/wycena" className="bg-transparent border-2 border-white/20 px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-premium active:scale-95">
                Sprawdź ceny bez konta
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
