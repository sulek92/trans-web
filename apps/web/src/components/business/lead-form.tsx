'use client';

import * as React from 'react';
import { createLead } from '@/lib/leads';
import { useToastStore } from '@/lib/store/toast-store';
import { useTranslation } from '@/lib/i18n/i18n-context';

export function BusinessLeadForm() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const volume = String(formData.get('volume') || '').trim();

    setIsSubmitting(true);
    try {
      await createLead({
        name,
        email,
        company,
        phone,
        description: `Zapytanie B2B. Deklarowany wolumen miesięczny: ${volume}.`,
      });
      addToast({
        title: t.business.lead.success,
        description: t.business.lead.successDesc,
        type: 'success',
      });
      form.reset();
    } catch (error) {
      addToast({
        title: t.business.lead.error,
        description: error instanceof Error ? error.message : t.business.lead.errorDesc,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-[var(--color-divider)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform"></div>
      <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              {t.business.lead.name}
            </label>
            <input
              required
              name="name"
              placeholder={t.business.lead.namePlaceholder}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              {t.business.lead.email}
            </label>
            <input
              required
              type="email"
              name="email"
              placeholder={t.business.lead.emailPlaceholder}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t.business.lead.company}</label>
            <input
              required
              name="company"
              placeholder={t.business.lead.companyPlaceholder}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t.business.lead.volume}</label>
            <select
              name="volume"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium appearance-none"
            >
              <option value="1-10 palet">1-10 palet</option>
              <option value="11-50 palet">11-50 palet</option>
              <option value="50+ palet">50+ palet</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t.business.lead.phone}</label>
          <input
            required
            type="tel"
            name="phone"
            placeholder={t.business.lead.phonePlaceholder}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold shadow-xl hover:bg-black transition-premium active:scale-95 disabled:opacity-60"
        >
          {isSubmitting ? t.business.lead.submitting : t.business.lead.submit}
        </button>
      </form>
    </div>
  );
}
