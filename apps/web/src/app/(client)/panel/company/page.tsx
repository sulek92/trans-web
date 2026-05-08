'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';

type Company = {
  id: string;
  name: string;
  nip: string;
  addressLine: string;
  postalCode: string;
  city: string;
  creditLimit: string;
};

export default function ClientCompanyPage() {
  const [company, setCompany] = React.useState<Company | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<Company>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const addToast = useToastStore(state => state.addToast);

  const API_URL = getApiBaseUrl();

  const fetchCompany = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/users/me/company`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = (await response.json()) as Company;
        setCompany(data);
        setFormData(data);
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać danych firmy.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, addToast]);

  React.useEffect(() => {
    void fetchCompany();
  }, [fetchCompany]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${API_URL}/users/me/company`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updated = await res.json();
        setCompany(updated);
        setIsEditing(false);
        addToast({ title: 'Sukces', description: 'Dane firmy zostały zaktualizowane.', type: 'success' });
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Nie udało się zapisać danych firmy.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2">Moja firma</h1>
          <p className="text-[var(--color-on-surface-variant)]">Dane do faktury i informacje o Twojej działalności.</p>
        </div>
      </div>

      <div className="bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)] p-10 shadow-sm">
        {isLoading ? (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                </div>
              ))}
            </div>
            <Skeleton className="h-24 w-full rounded-3xl" />
          </div>
        ) : company ? (
          <form onSubmit={handleSave} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest px-1">Nazwa firmy</label>
                {isEditing ? (
                  <input required className="w-full px-6 py-4 rounded-2xl border border-[var(--color-divider)] outline-none focus:border-[var(--color-primary)] transition-premium" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                ) : (
                  <div className="bg-[var(--color-surface-container)] rounded-2xl px-6 py-4 font-bold text-lg">{company.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest px-1">NIP</label>
                {isEditing ? (
                  <input required className="w-full px-6 py-4 rounded-2xl border border-[var(--color-divider)] outline-none focus:border-[var(--color-primary)] transition-premium" value={formData.nip || ''} onChange={e => setFormData({...formData, nip: e.target.value})} />
                ) : (
                  <div className="bg-[var(--color-surface-container)] rounded-2xl px-6 py-4 font-bold text-lg">{company.nip}</div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest px-1">Adres</label>
                {isEditing ? (
                  <input required className="w-full px-6 py-4 rounded-2xl border border-[var(--color-divider)] outline-none focus:border-[var(--color-primary)] transition-premium" value={formData.addressLine || ''} onChange={e => setFormData({...formData, addressLine: e.target.value})} />
                ) : (
                  <div className="bg-[var(--color-surface-container)] rounded-2xl px-6 py-4 font-medium">{company.addressLine}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest px-1">Kod pocztowy</label>
                  {isEditing ? (
                    <input required className="w-full px-6 py-4 rounded-2xl border border-[var(--color-divider)] outline-none focus:border-[var(--color-primary)] transition-premium" value={formData.postalCode || ''} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
                  ) : (
                    <div className="bg-[var(--color-surface-container)] rounded-2xl px-6 py-4 font-medium">{company.postalCode}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest px-1">Miasto</label>
                  {isEditing ? (
                    <input required className="w-full px-6 py-4 rounded-2xl border border-[var(--color-divider)] outline-none focus:border-[var(--color-primary)] transition-premium" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} />
                  ) : (
                    <div className="bg-[var(--color-surface-container)] rounded-2xl px-6 py-4 font-medium">{company.city}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--color-primary-highlight)] rounded-3xl flex gap-4 items-start border border-[var(--color-primary)]/10">
              <span className="material-symbols-outlined text-[var(--color-primary)]">info</span>
              <div>
                <div className="font-bold text-[var(--color-on-background)] text-sm mb-1">Płatności odroczone</div>
                <div className="text-[var(--color-text-muted)] text-xs">Twój obecny limit kredytowy to {company.creditLimit} PLN. Jeśli potrzebujesz wyższego limitu, skontaktuj się ze swoim opiekunem.</div>
              </div>
            </div>

            <div className="pt-10 border-t border-[var(--color-divider)] flex justify-end gap-4">
              {isEditing ? (
                <>
                  <button type="button" onClick={() => { setIsEditing(false); setFormData(company); }} className="px-8 py-4 rounded-2xl font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-container)] transition-colors">Anuluj</button>
                  <button type="submit" disabled={isSaving} className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg disabled:opacity-50">
                    {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setIsEditing(true)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">Edytuj dane</button>
              )}
            </div>
          </form>
        ) : (
          <div className="text-center py-20 space-y-6">
            <span className="material-symbols-outlined text-6xl text-[var(--color-text-faint)]">corporate_fare</span>
            <div>
              <div className="text-xl font-bold text-[var(--color-text-faint)]">Brak danych firmy</div>
              <p className="text-[var(--color-text-faint)] text-sm mt-2 max-w-xs mx-auto">Dodaj dane firmy, aby móc otrzymywać faktury VAT za swoje zamówienia.</p>
            </div>
            <button className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold shadow-lg">Uzupełnij teraz</button>
          </div>
        )}
      </div>
    </div>
  );
}
