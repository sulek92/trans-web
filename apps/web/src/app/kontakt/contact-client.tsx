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
    <main className="pb-32 bg-[var(--color-background)] min-h-screen relative overflow-hidden transition-colors duration-500">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-primary)] opacity-[0.05] rounded-full blur-3xl -mr-96 -mt-96 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-[0.02] rounded-full blur-3xl -ml-72 -mb-72 pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-8 relative z-10 pt-24">
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
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-primary-highlight)] text-[var(--color-primary)] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm border border-[var(--color-primary)]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                Centrum Kontaktu
              </span>
              <h1 className="font-display font-bold text-5xl md:text-7xl text-[var(--color-on-background)] mb-8 leading-[0.95] tracking-tight">
                {titleParts[0]}<br/>
                <span className="text-[var(--color-primary)]">{titleParts[1] || ''}</span>
              </h1>
              <p className="text-[var(--color-text-muted)] text-xl leading-relaxed max-w-2xl">{d.subtitle}</p>
            </motion.div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-[var(--color-surface-primary)] p-8 sm:p-14 rounded-[60px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)] relative overflow-hidden"
          >
            {isSending && (
              <div className="absolute inset-0 z-50 bg-[var(--color-surface-primary)]/60 backdrop-blur-[4px] flex items-center justify-center animate-fade-in">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin shadow-2xl"></div>
                  <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">Wysyłanie zlecenia...</span>
                </div>
              </div>
            )}

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-[var(--color-on-background)] tracking-tight mb-3">Wyślij zapytanie</h2>
              <p className="text-[var(--color-text-muted)] font-medium">Skontaktuj się z nami w dowolnej sprawie logistycznej.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest px-2">Imię i Nazwisko</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">person</span>
                    <input required name="name" className="w-full pl-16 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner" placeholder="Jan Kowalski" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest px-2">Nazwa Firmy</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">business</span>
                    <input name="company" className="w-full pl-16 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner" placeholder="Twoja firma Sp. z o.o." />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest px-2">Adres E-mail</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">alternate_email</span>
                    <input required name="email" type="email" className="w-full pl-16 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner" placeholder="kontakt@domena.pl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest px-2">Numer Telefonu</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">call</span>
                    <input name="phone" type="tel" className="w-full pl-16 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner" placeholder="+48 000 000 000" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest px-2">Twoja Wiadomość</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-6 top-6 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">chat</span>
                  <textarea required name="message" className="w-full pl-16 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner min-h-[160px] resize-none" placeholder="W czym możemy pomóc? Napisz nam szczegóły swojego zapytania..."></textarea>
                </div>
              </div>

              <button type="submit" disabled={isSending} className="w-full bg-[var(--color-on-background)] text-[var(--color-background)] py-6 rounded-2xl font-bold text-lg shadow-2xl hover:bg-[var(--color-primary)] hover:text-white hover:scale-[1.01] transition-premium active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4">
                {isSending ? 'Trwa wysyłanie...' : (
                  <>
                    Wyślij wiadomość
                    <span className="material-symbols-outlined text-xl">send</span>
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-[var(--color-text-faint)] text-center leading-relaxed px-8">
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
            <div className="bg-[var(--color-surface-primary)] p-10 rounded-[40px] border border-[var(--color-divider)] shadow-[var(--shadow-premium)] hover:shadow-2xl transition-premium group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)] opacity-[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center mb-8 group-hover:scale-110 transition-premium shadow-inner">
                <span className="material-symbols-outlined text-3xl">call</span>
              </div>
              <div className="font-bold text-2xl mb-2 text-[var(--color-on-background)] tracking-tight">Zadzwoń do nas</div>
              <div className="text-[var(--color-primary)] font-display font-bold text-xl mb-4 tracking-tight">{d.phone}</div>
              <div className="text-[10px] text-[var(--color-text-faint)] font-black uppercase tracking-widest">{d.phoneHours}</div>
            </div>

            <div className="bg-[var(--color-surface-primary)] p-10 rounded-[40px] border border-[var(--color-divider)] shadow-[var(--shadow-premium)] hover:shadow-2xl transition-premium group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)] opacity-[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center mb-8 group-hover:scale-110 transition-premium shadow-inner">
                <span className="material-symbols-outlined text-3xl">mail</span>
              </div>
              <div className="font-bold text-2xl mb-2 text-[var(--color-on-background)] tracking-tight">Napisz e-mail</div>
              <div className="text-[var(--color-primary)] font-display font-bold text-xl mb-4 tracking-tight">{d.email}</div>
              <div className="text-[10px] text-[var(--color-text-faint)] font-black uppercase tracking-widest">{d.emailResponseTime}</div>
            </div>
          </motion.div>

          <motion.div variants={item} className="p-10 sm:p-16 bg-[var(--color-on-background)] rounded-[60px] shadow-2xl relative overflow-hidden text-[var(--color-background)] group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
            <div className="flex flex-col sm:flex-row gap-10 items-start relative z-10">
              <div className="w-20 h-20 bg-[var(--color-background)]/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-[var(--color-background)]/10 shadow-inner shrink-0">
                <span className="material-symbols-outlined text-[var(--color-background)] text-4xl">location_on</span>
              </div>
              <div>
                <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Nasze biuro</span>
                <h3 className="font-bold text-3xl mb-4 tracking-tight text-[var(--color-background)]">Siedziba Główna</h3>
                <p className="text-[var(--color-background)] opacity-60 text-xl leading-relaxed font-medium">
                  {d.companyName}<br/>
                  {d.street}, {d.city}
                </p>
                <button className="mt-10 text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em] flex items-center gap-3 hover:translate-x-3 transition-transform">
                  Otwórz w mapach <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
