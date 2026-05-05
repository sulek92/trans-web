'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENU_ITEMS = [
  { label: 'Pulpit', href: '/panel', icon: 'dashboard' },
  { label: 'Moje zamówienia', href: '/panel/orders', icon: 'local_shipping' },
  { label: 'Adresy', href: '/panel/addresses', icon: 'location_on' },
  { label: 'Moja firma', href: '/panel/company', icon: 'corporate_fare' },
  { label: 'Ustawienia', href: '/panel/settings', icon: 'settings' },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex-grow pt-8 pb-16 min-h-screen bg-[var(--color-background)]">
      <div className="max-w-[1440px] mx-auto px-8 flex gap-12">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 space-y-2 hidden lg:block">
          <div className="bg-white rounded-3xl border border-[var(--color-divider)] p-4 shadow-sm">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-premium ${
                    isActive 
                      ? 'bg-[var(--color-primary)] text-white shadow-lg' 
                      : 'text-[var(--color-on-surface-variant)] hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Potrzebujesz pomocy?</div>
              <div className="text-sm font-medium mb-4">Twój opiekun jest dostępny online.</div>
              <button className="w-full bg-teal-500 py-3 rounded-xl font-bold text-xs hover:bg-teal-400 transition-colors">Czatuj teraz</button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">support_agent</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
