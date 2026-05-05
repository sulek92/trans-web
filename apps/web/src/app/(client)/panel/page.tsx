'use client';

import * as React from 'react';
import Link from 'next/link';

export default function PanelPage() {
  const stats = [
    { label: 'Aktywne zlecenia', value: '0', icon: 'local_shipping' },
    { label: 'Wszystkie zamówienia', value: '0', icon: 'history' },
    { label: 'Środki na koncie', value: '0.00 PLN', icon: 'account_balance_wallet' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2">Witaj w Panelu Klienta</h1>
          <p className="text-[var(--color-on-surface-variant)]">Zarządzaj swoimi przesyłkami i finansami w jednym miejscu.</p>
        </div>
        <Link 
          href="/wycena" 
          className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-[var(--color-surface-tint)] transition-premium flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Nowe zamówienie
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-[var(--color-divider)] shadow-sm hover:shadow-md transition-premium group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-[var(--color-on-background)]">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--color-divider)] flex justify-between items-center">
          <h2 className="text-xl font-bold">Ostatnie zlecenia</h2>
          <Link href="/panel/orders" className="text-[var(--color-primary)] font-bold text-sm hover:underline">Zobacz wszystkie</Link>
        </div>
        <div className="p-20 text-center text-slate-300 font-bold">
          <span className="material-symbols-outlined text-6xl mb-4 block opacity-20">inventory_2</span>
          Brak aktywnych zleceń w historii.
        </div>
      </div>
    </div>
  );
}
