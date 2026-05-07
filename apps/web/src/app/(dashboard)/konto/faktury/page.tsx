'use client';

import Link from 'next/link';

export default function InvoicesPage() {
  return (
    <main className="pb-24">
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Panel Klienta</span>
          <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-2 tracking-tight">Faktury</h1>
          <p className="text-[var(--color-on-surface-variant)] text-lg">Przeglądaj i pobieraj faktury za swoje zamówienia.</p>
        </div>

        <div className="bg-white rounded-[40px] border border-dashed border-slate-200 p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-slate-300">receipt_long</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Brak faktur</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Faktury za zrealizowane zamówienia będą dostępne tutaj.
          </p>
          <Link href="/zamowienia" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold hover:underline">
            Przejdź do zamówień <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
