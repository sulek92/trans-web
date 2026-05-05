'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';

type Company = {
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  React.useEffect(() => {
    const fetchCompany = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const response = await fetch(`${API_URL}/users/me/company`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = (await response.json()) as Company;
          setCompany(data);
        }
      } catch (err) {
        console.error('Failed to fetch company:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCompany();
  }, [API_URL]);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2">Moja firma</h1>
          <p className="text-[var(--color-on-surface-variant)]">Dane do faktury i informacje o Twojej działalności.</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-[var(--color-divider)] p-10 shadow-sm">
        {isLoading ? (
          <div className="text-center py-20 text-slate-400 font-bold italic">Ładowanie danych firmy...</div>
        ) : company ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nazwa firmy</label>
                <div className="bg-slate-50 rounded-2xl px-6 py-4 font-bold text-lg">{company.name}</div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">NIP</label>
                <div className="bg-slate-50 rounded-2xl px-6 py-4 font-bold text-lg">{company.nip}</div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Adres</label>
                <div className="bg-slate-50 rounded-2xl px-6 py-4 font-medium">{company.addressLine}</div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Miasto i Kod</label>
                <div className="bg-slate-50 rounded-2xl px-6 py-4 font-medium">{company.postalCode} {company.city}</div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-3xl flex gap-4 items-start">
              <span className="material-symbols-outlined text-blue-600">info</span>
              <div>
                <div className="font-bold text-blue-900 text-sm mb-1">Płatności odroczone</div>
                <div className="text-blue-700 text-xs">Twój obecny limit kredytowy to {company.creditLimit} PLN. Jeśli potrzebujesz wyższego limitu, skontaktuj się ze swoim opiekunem.</div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 flex justify-end gap-4">
              <button className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">Anuluj</button>
              <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">Edytuj dane</button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 space-y-6">
            <span className="material-symbols-outlined text-6xl text-slate-200">corporate_fare</span>
            <div>
              <div className="text-xl font-bold text-slate-400">Brak danych firmy</div>
              <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Dodaj dane firmy, aby móc otrzymywać faktury VAT za swoje zamówienia.</p>
            </div>
            <button className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold shadow-lg">Uzupełnij teraz</button>
          </div>
        )}
      </div>
    </div>
  );
}
