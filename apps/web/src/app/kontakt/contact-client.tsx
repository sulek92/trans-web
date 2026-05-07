'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { createLead } from '@/lib/leads';
import { useToastStore } from '@/lib/store/toast-store';

interface ContactData {
  title: string; subtitle: string; phone: string; phoneHours: string;
  email: string; emailResponseTime: string; companyName: string; street: string; city: string;
}

export function ContactClient({ data: d }: { data: ContactData }) {
  const [isSending, setIsSending] = React.useState(false);
  const addToast = useToastStore((state) => state.addToast);
  const titleParts = d.title.split('\n');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();

    try {
      await createLead({
        name,
        email,
        company: company || undefined,
        phone: phone || undefined,
        description: message,
      });
      addToast({
        title: 'Wiadomość wysłana',
        description: 'Dziękujemy. Odpowiemy na Twoje zapytanie w ciągu 2 godzin.',
        type: 'success',
      });
      form.reset();
    } catch (error) {
      addToast({
        title: 'Błąd wysyłki',
        description: error instanceof Error ? error.message : 'Nie udało się wysłać formularza.',
        type: 'error',
      });
    } finally {
      setIsSending(false);
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
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-primary)] opacity-[0.03] rounded-full blur-3xl -mr-96 -mt-96 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500 opacity-[0.02] rounded-full blur-3xl -ml-72 -mb-72 pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-8 relative z-10">
        {/* Top Section: Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-24">
          
          {/* Left Column: Info */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-primary-highlight)] text-[var(--color-primary)] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                Centrum Kontaktu
              </span>
              <h1 className="font-display-bold text-5xl md:text-6xl font-bold text-[var(--color-on-background)] mb-8 leading-[1.1] tracking-tight">
                {titleParts[0]}<br/>
                <span className="text-[var(--color-primary)]">{titleParts[1] || ''}</span>
              </h1>
              <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed max-w-2xl">{d.subtitle}</p>
            </motion.div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white p-12 rounded-[56px] shadow-3xl border border-[var(--color-divider)] relative overflow-hidden"
          >
            {isSending && (
              <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[4px] flex items-center justify-center animate-fade-in">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin shadow-2xl"></div>
                  <span className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-widest">Wysyłanie zlecenia...</span>
                </div>
              </div>
            )}

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Wyślij zapytanie</h2>
              <p className="text-slate-400 font-medium text-lg">Skontaktuj się z nami w dowolnej sprawie logistycznej.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Imię i Nazwisko</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[var(--color-primary)] transition-colors">person</span>
                    <input required name="name" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-slate-900" placeholder="Jan Kowalski" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nazwa Firmy</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[var(--color-primary)] transition-colors">business</span>
                    <input name="company" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-slate-900" placeholder="Twoja firma Sp. z o.o." />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Adres E-mail</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[var(--color-primary)] transition-colors">alternate_email</span>
                    <input required name="email" type="email" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-slate-900" placeholder="kontakt@domena.pl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Numer Telefonu</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[var(--color-primary)] transition-colors">call</span>
                    <input name="phone" type="tel" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-slate-900" placeholder="+48 000 000 000" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Twoja Wiadomość</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-6 text-slate-300 group-focus-within:text-[var(--color-primary)] transition-colors">chat</span>
                  <textarea required name="message" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-slate-900 min-h-[160px] resize-none" placeholder="W czym możemy pomóc? Napisz nam szczegóły swojego zapytania..."></textarea>
                </div>
              </div>

              <button type="submit" disabled={isSending} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl hover:bg-black hover:scale-[1.01] transition-premium active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                {isSending ? 'Trwa wysyłanie...' : (
                  <>
                    Wyślij wiadomość
                    <span className="material-symbols-outlined text-xl">send</span>
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-slate-400 text-center leading-relaxed px-8">
                Klikając &quot;Wyślij wiadomość&quot; akceptujesz naszą politykę prywatności. Dane będą przetwarzane wyłącznie w celu odpowiedzi na zapytanie.
              </p>
            </form>
          </motion.div>

        </div>

        {/* Bottom Section: Contact Tiles */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[32px] border border-[var(--color-divider)] shadow-[var(--shadow-premium)] hover:shadow-2xl transition-premium group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-premium">
                <span className="material-symbols-outlined text-3xl">call</span>
              </div>
              <div className="font-bold text-xl mb-2 text-slate-900">Zadzwoń do nas</div>
              <div className="text-[var(--color-primary)] font-bold text-lg mb-2">{d.phone}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{d.phoneHours}</div>
            </div>

            <div className="bg-white p-10 rounded-[32px] border border-[var(--color-divider)] shadow-[var(--shadow-premium)] hover:shadow-2xl transition-premium group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-premium">
                <span className="material-symbols-outlined text-3xl">mail</span>
              </div>
              <div className="font-bold text-xl mb-2 text-slate-900">Napisz e-mail</div>
              <div className="text-[var(--color-primary)] font-bold text-lg mb-2">{d.email}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{d.emailResponseTime}</div>
            </div>
          </motion.div>

          <motion.div variants={item} className="p-10 bg-slate-900 rounded-[40px] shadow-2xl relative overflow-hidden text-white group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="flex gap-8 items-start relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner shrink-0">
                <span className="material-symbols-outlined text-white text-3xl">location_on</span>
              </div>
              <div>
                <h3 className="font-bold text-2xl mb-4 tracking-tight">Siedziba Główna</h3>
                <p className="text-white/60 text-lg leading-relaxed font-medium">
                  {d.companyName}<br/>
                  {d.street}, {d.city}
                </p>
                <button className="mt-8 text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-2 transition-transform">
                  Otwórz w mapach <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
