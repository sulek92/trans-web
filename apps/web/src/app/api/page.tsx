'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function APIPage() {
  const [progress, setProgress] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(68), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="pb-32 bg-[var(--color-background)] min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-primary)] opacity-[0.03] rounded-full blur-3xl -mr-96 -mt-96 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500 opacity-[0.02] rounded-full blur-3xl -ml-72 -mb-72 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-8 relative z-10">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left Column */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary-highlight)] text-[var(--color-primary)] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                Developer Center
              </span>
              <h1 className="font-display-bold text-5xl md:text-6xl font-bold text-[var(--color-on-background)] mb-6 leading-[1.1] tracking-tight">
                API jest w{' '}
                <span className="text-gradient">budowie</span>
              </h1>
              <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed max-w-xl">
                Nasz zespół deweloperów pracuje nad udostępnieniem potężnego interfejsu REST API, 
                który pozwoli Ci zintegrować logistykę paletową z Twoim systemem.
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-4">
              <Link 
                href="/wycena"
                className="px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-surface-tint)] transition-premium active:scale-95 shadow-xl shadow-[var(--color-primary)]/20"
              >
                Zamów wycenę
              </Link>
              <Link 
                href="/kontakt"
                className="px-8 py-4 rounded-2xl bg-white border border-[var(--color-divider)] text-[var(--color-on-background)] font-bold hover:bg-slate-50 transition-premium shadow-sm"
              >
                Skontaktuj się z nami
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Construction Icon */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-[40px] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-surface-tint)] flex items-center justify-center shadow-2xl shadow-[var(--color-primary)]/20 animate-float">
                <span className="material-symbols-outlined text-white text-[120px] md:text-[160px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  construction
                </span>
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-[40px] border-2 border-[var(--color-primary)] opacity-20 animate-ping" />
              {/* Status badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[var(--color-primary)] font-bold text-sm shadow-lg border border-[var(--color-divider)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                W trakcie prac
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-3xl p-10 shadow-sm border border-[var(--color-divider)] mb-20"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h3 className="font-bold text-xl text-[var(--color-on-background)] mb-1">Postęp prac deweloperskich</h3>
              <p className="text-[var(--color-on-surface-variant)] text-sm">Śledzimy na bieżąco nasz harmonogram implementacji</p>
            </div>
            <span className="text-4xl font-display-bold font-bold text-[var(--color-primary)]">{progress}%</span>
          </div>
          <div className="h-4 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-surface-tint)] rounded-full"
            />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
        >
          {[
            { 
              icon: 'code', 
              title: 'REST API', 
              desc: 'Czyste i intuicyjne endpointy zgodne ze standardami REST. Pełna dokumentacja OpenAPI 3.0.',
              status: 'W implementacji'
            },
            { 
              icon: 'sync_alt', 
              title: 'Webhooks', 
              desc: 'Powiadomienia w czasie rzeczywistym o statusach przesyłek i zmianach cen.',
              status: 'Planowane'
            },
            { 
              icon: 'security', 
              title: 'OAuth 2.0', 
              desc: 'Bezpieczna autoryzacja z kluczami API, tokenami JWT i rotacją sekretów.',
              status: 'W implementacji'
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.15 }}
              className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-premium border border-[var(--color-divider)] hover:border-[var(--color-primary)]/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-premium">
                <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
              </div>
              <h3 className="font-bold text-xl text-[var(--color-on-background)] mb-3">{feature.title}</h3>
              <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-5">{feature.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-warning)] bg-amber-50 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] animate-pulse" />
                {feature.status}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Notification & Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Notification Signup */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[40px] p-10 md:p-12 relative overflow-hidden h-full">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-secondary)] opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-white text-3xl">notifications_active</span>
                </div>
                
                <h2 className="font-display-bold text-2xl md:text-3xl font-bold text-white mb-4">
                  Bądź pierwszy, gdy API wystartuje
                </h2>
                <p className="text-[var(--color-text-faint)] text-lg mb-8 leading-relaxed">
                  Zostaw swój adres email, a powiadomimy Cię o premierze z ekskluzywnym dostępem do wersji beta.
                </p>

                {subscribed ? (
                  <div className="flex items-center gap-3 text-emerald-400 bg-emerald-400/10 px-6 py-4 rounded-2xl">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span className="font-bold">Dziękujemy! Powiadomimy Cię o starcie.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="twoj@email.pl"
                      className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-premium"
                      required
                    />
                    <button 
                      type="submit"
                      className="w-full px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-surface-tint)] transition-premium active:scale-95 shadow-xl shadow-[var(--color-primary)]/30"
                    >
                      Powiadom mnie
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 }}
          >
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-[var(--color-divider)] h-full">
              <h3 className="font-bold text-xl text-[var(--color-on-background)] mb-8">Harmonogram prac</h3>
              <div className="space-y-8">
                {[
                  { date: 'Q4 2025', title: 'Projektowanie architektury', desc: 'Definiowanie endpointów i modeli danych', done: true },
                  { date: 'Q1 2026', title: 'Implementacja endpointów', desc: 'Tworzenie rdzenia API i autoryzacji', done: true },
                  { date: 'Q2 2026', title: 'Testy beta z partnerami', desc: 'Walidacja z wybranymi klientami', done: false, current: true },
                  { date: 'Q3 2026', title: 'Publiczna premiera API', desc: 'Otwarcie dostępu dla wszystkich', done: false }
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.done 
                          ? 'bg-emerald-500 text-white' 
                          : step.current 
                            ? 'bg-[var(--color-primary)] text-white' 
                            : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
                      }`}>
                        {step.done ? (
                          <span className="material-symbols-outlined text-lg">check</span>
                        ) : step.current ? (
                          <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                        ) : (
                          <span className="text-sm font-bold">{i + 1}</span>
                        )}
                      </div>
                      {i < 3 && (
                        <div className={`w-0.5 h-10 ${step.done ? 'bg-emerald-500' : 'bg-[var(--color-divider)]'}`} />
                      )}
                    </div>
                    <div className="pb-2">
                      <span className={`text-xs font-bold block mb-1 ${step.current ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                        {step.date}
                      </span>
                      <p className={`font-bold text-base ${step.done || step.current ? 'text-[var(--color-on-background)]' : 'text-[var(--color-text-muted)]'}`}>
                        {step.title}
                      </p>
                      <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
