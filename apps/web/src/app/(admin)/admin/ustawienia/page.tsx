'use client';

import * as React from 'react';

export default function AdminSettingsPage() {
  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h1 className="font-display-bold text-3xl font-bold text-[var(--color-on-background)] mb-2">Ustawienia Systemowe</h1>
        <p className="text-[var(--color-on-surface-variant)]">Konfiguracja marż, stawek paliwowych i parametrów brokerstwa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Margins Management */}
        <div className="bg-white p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-primary)]">trending_up</span>
            <h2 className="text-xl font-bold">Zarządzanie marżami</h2>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-xl border border-[var(--color-divider)]">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-sm">Marża ogólna (domyślna)</span>
                <span className="text-[var(--color-primary)] font-bold">15.00 %</span>
              </div>
              <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]" min="0" max="50" defaultValue="15" />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Marże dla przewoźników</h3>
              {[
                { name: 'DHL Freight', value: 12 },
                { name: 'DPD Palety', value: 18 },
                { name: 'FedEx Heavy', value: 10 }
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-32">{m.name}</span>
                  <input type="number" className="w-24 px-4 py-2 rounded-lg border border-[var(--color-divider)] text-sm font-bold" defaultValue={m.value} />
                  <span className="text-sm font-bold text-slate-400">%</span>
                </div>
              ))}
            </div>
          </div>
          
          <button className="w-full py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold shadow-lg hover:bg-[var(--color-surface-tint)] transition-premium">
            Zapisz zmiany w marżach
          </button>
        </div>

        {/* Global Config */}
        <div className="bg-white p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-primary)]">tune</span>
            <h2 className="text-xl font-bold">Parametry globalne</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Aktualna dopłata paliwowa (%)</label>
              <input type="number" className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] text-sm font-bold" defaultValue="14.2" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Waluta systemowa</label>
              <select className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] text-sm font-bold bg-white">
                <option>PLN (Złoty polski)</option>
                <option>EUR (Euro)</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-600">notifications_active</span>
                <div className="text-xs">
                  <div className="font-bold text-amber-900">Tryb konserwacji</div>
                  <p className="text-amber-700">Blokuje możliwość składania nowych zamówień.</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
