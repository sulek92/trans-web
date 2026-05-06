'use client';

import * as React from 'react';
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
        title: 'Wiadomosc wyslana',
        description: 'Dziekujemy. Odpowiemy na Twoje zapytanie w ciagu 2 godzin.',
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
      setIsSending(false);
    }
  };

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="animate-fade-in">
            <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-4 block">Kontakt</span>
            <h1 className="font-display-bold text-5xl font-bold text-[var(--color-on-background)] mb-6 leading-tight">
              {titleParts[0]}<br/>
              <span className="text-[var(--color-primary)]">{titleParts[1] || ''}</span>
            </h1>
            <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed mb-12">{d.subtitle}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm hover:shadow-md transition-premium">
                <span className="material-symbols-outlined text-[var(--color-primary)] mb-4 text-3xl">call</span>
                <div className="font-bold text-lg mb-1">Zadzwoń do nas</div>
                <div className="text-[var(--color-primary)] font-bold">{d.phone}</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] mt-2">{d.phoneHours}</div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm hover:shadow-md transition-premium">
                <span className="material-symbols-outlined text-[var(--color-primary)] mb-4 text-3xl">mail</span>
                <div className="font-bold text-lg mb-1">Napisz e-mail</div>
                <div className="text-[var(--color-primary)] font-bold">{d.email}</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] mt-2">{d.emailResponseTime}</div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-[var(--color-surface-container-low)] rounded-3xl border border-[var(--color-divider)]">
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-[var(--color-primary)] mt-1">location_on</span>
                <div>
                  <div className="font-bold text-lg">Siedziba firmy</div>
                  <p className="text-[var(--color-on-surface-variant)] mt-2">
                    {d.companyName}<br/>{d.street}<br/>{d.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-[var(--color-divider)] animate-fade-in delay-200 relative overflow-hidden">
            {isSending && <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[2px] flex items-center justify-center animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-bold text-[var(--color-primary)]">Wysyłanie wiadomości...</span>
              </div>
            </div>}
            <h2 className="text-2xl font-bold mb-8">Wyślij szybką wiadomość</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Imię i Nazwisko</label>
                  <input required name="name" className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium" placeholder="Jan Kowalski" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Firma (opcjonalnie)</label>
                  <input name="company" className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium" placeholder="Nazwa Twojej firmy" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">E-mail</label>
                  <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium" placeholder="twoj@email.pl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Telefon (opcjonalnie)</label>
                  <input name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium" placeholder="+48 000 000 000" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Wiadomość</label>
                <textarea required name="message" className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium min-h-[150px]" placeholder="W czym możemy pomóc?"></textarea>
              </div>
              <button type="submit" disabled={isSending} className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[var(--color-surface-tint)] transition-premium active:scale-[0.98] disabled:opacity-50">
                {isSending ? 'Trwa wysyłanie...' : 'Wyślij wiadomość'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
