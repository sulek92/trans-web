'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';

export default function AdminFinancePage() {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [isExporting, setIsExporting] = React.useState(false);
  const { addToast } = useToastStore();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const handleExportZip = async () => {
    if (!startDate || !endDate) {
      addToast({ title: 'Błąd', description: 'Wybierz zakres dat.', type: 'error' });
      return;
    }

    setIsExporting(true);
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/invoices/export/zip?startDate=${startDate}&endDate=${endDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `faktury-${startDate}-${endDate}.zip`;
        a.click();
        addToast({ title: 'Eksport gotowy', description: 'Paczka ZIP została pobrana.', type: 'success' });
      } else {
        const text = await response.text();
        addToast({ title: 'Brak danych', description: text || 'Nie znaleziono faktur w tym zakresie.', type: 'error' });
      }
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się wyeksportować faktur.', type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2">Finanse i Księgowość</h1>
        <p className="text-slate-500 font-medium">Zarządzanie fakturami, korektami i eksportem danych księgowych.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm p-10">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-[var(--color-primary)]">archive</span>
              Eksport Faktur do ZIP
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Data początkowa</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[var(--color-primary)] transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Data końcowa</label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[var(--color-primary)] transition-all"
                />
              </div>
            </div>

            <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 mb-10">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-indigo-600">info</span>
                <div>
                  <h4 className="text-sm font-bold text-indigo-900 mb-1">Informacja o eksporcie</h4>
                  <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                    System wygeneruje paczkę ZIP zawierającą wszystkie faktury VAT oraz faktury korygujące wystawione w wybranym zakresie dat. Pliki PDF zostaną nazwane zgodnie z numeracją dokumentów.
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleExportZip}
              disabled={isExporting || !startDate || !endDate}
              className="w-full py-5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-2xl text-xs font-bold transition-all shadow-xl shadow-[var(--color-primary)]/20 uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">{isExporting ? 'sync' : 'download'}</span>
              {isExporting ? 'Generowanie paczki...' : 'Pobierz paczkę ZIP (PDF)'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-6">Podsumowanie Okresu</h3>
            <div className="space-y-6">
              <div className="pb-6 border-b border-white/10">
                <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Przychód Netto</div>
                <div className="text-2xl font-bold">--- PLN</div>
              </div>
              <div className="pb-6 border-b border-white/10">
                <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Podatek VAT</div>
                <div className="text-2xl font-bold">--- PLN</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[var(--color-primary)] tracking-widest mb-1">Do zapłaty (Brutto)</div>
                <div className="text-3xl font-bold text-white">--- PLN</div>
              </div>
            </div>
            <p className="mt-8 text-[10px] text-white/30 font-medium leading-relaxed italic">
              * Statystyki zostaną przeliczone po wybraniu zakresu dat w przyszłych aktualizacjach modułu analitycznego.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
