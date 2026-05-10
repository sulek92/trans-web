'use client';

import * as React from 'react';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { useToastStore } from '@/lib/store/toast-store';
import { createLead } from '@/lib/leads';
import { cn } from '@/lib/utils';

interface CustomQuoteFormProps {
  palletType: string;
  palletCount: number;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  route: string;
}

export function CustomQuoteForm({ palletType, palletCount, weight, dimensions, route }: CustomQuoteFormProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState('');
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const message = String(formData.get('message') || '').trim();

    setIsSubmitting(true);
    try {
      await createLead({
        name,
        email,
        phone,
        company,
        palletType,
        weight: `${weight} kg`,
        dimensions: `${dimensions.length}x${dimensions.width}x${dimensions.height} cm`,
        route,
        description: `ZAPYTANIE O WYCENĘ INDYWIDUALNĄ. \nIlość: ${palletCount} szt. \nDodatkowe info: ${message}`,
        leadType: 'custom_quote',
      });

      setSubmittedEmail(email);
      setIsSuccess(true);
      addToast({
        title: "Wysłano zapytanie",
        description: "Nasz dział wycen skontaktuje się z Tobą wkrótce.",
        type: 'success',
      });
    } catch (err) {
      addToast({
        title: "Błąd wysyłania",
        description: "Nie udało się przesłać zapytania. Spróbuj ponownie.",
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-[32px] p-10 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
          <span className="material-symbols-outlined text-white text-4xl">done_all</span>
        </div>
        <h3 className="text-2xl font-bold text-[var(--color-on-background)] mb-2">Zapytanie zostało wysłane!</h3>
        <p className="text-[var(--color-text-muted)] max-w-sm mx-auto font-medium leading-relaxed">
          Dziękujemy. Nasz spedytor przygotuje dla Ciebie ofertę i skontaktuje się pod adresem <strong>{submittedEmail}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface-primary)] border border-[var(--color-divider)] rounded-[32px] shadow-[var(--shadow-premium)] overflow-hidden">
      <div className="p-8 sm:p-10 border-b border-[var(--color-divider)] bg-[var(--color-surface-container)]/30">
        <h3 className="text-xl font-bold text-[var(--color-on-background)] mb-1">Poproś o wycenę indywidualną</h3>
        <p className="text-sm text-[var(--color-text-muted)]">Uzupełnij swoje dane, a my prześlemy ofertę na Twojego e-maila.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-1">Imię i Nazwisko / Firma</label>
            <input 
              required 
              name="name"
              placeholder="Jan Kowalski"
              className="w-full px-5 py-4 rounded-xl bg-[var(--color-surface-container)] border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all font-medium text-[var(--color-on-background)]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-1">Adres E-mail</label>
            <input 
              required 
              type="email"
              name="email"
              placeholder="twoj@email.pl"
              className="w-full px-5 py-4 rounded-xl bg-[var(--color-surface-container)] border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all font-medium text-[var(--color-on-background)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-1">Telefon (opcjonalnie)</label>
            <input 
              name="phone"
              placeholder="+48 000 000 000"
              className="w-full px-5 py-4 rounded-xl bg-[var(--color-surface-container)] border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all font-medium text-[var(--color-on-background)]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-1">Nazwa firmy (opcjonalnie)</label>
            <input 
              name="company"
              placeholder="Opcjonalnie"
              className="w-full px-5 py-4 rounded-xl bg-[var(--color-surface-container)] border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all font-medium text-[var(--color-on-background)]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-1">Dodatkowe informacje / Uwagi</label>
          <textarea 
            name="message"
            rows={3}
            placeholder="Np. towar niebezpieczny ADR, wymagana winda, itp."
            className="w-full px-5 py-4 rounded-xl bg-[var(--color-surface-container)] border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all font-medium text-[var(--color-on-background)] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 rounded-2xl bg-[var(--color-on-background)] text-white font-bold text-lg shadow-xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Przesyłanie...
            </>
          ) : (
            <>
              Wyślij zapytanie
              <span className="material-symbols-outlined">send</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
