'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', href: '/admin' },
    { label: 'Zamówienia', icon: 'inventory', href: '/admin/zamowienia' },
    { label: 'Klienci B2B', icon: 'corporate_fare', href: '/admin/uzytkownicy' },
    { label: 'Zapytania (Leady)', icon: 'contact_support', href: '/admin/leady' },
    { label: 'Zarządzanie treścią', icon: 'edit_note', href: '/admin/cms' },
    { label: 'Ustawienia marż', icon: 'settings', href: '/admin/ustawienia' },
  ];

  const handleLogout = () => {
    document.cookie = 'pb_auth_token=; Path=/; Max-Age=0; SameSite=Lax';
    document.cookie = 'pb_refresh_token=; Path=/; Max-Age=0; SameSite=Lax';
    document.cookie = 'pb_user_role=; Path=/; Max-Age=0; SameSite=Lax';
    router.push('/logowanie');
  };

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[var(--color-background)] lg:h-screen lg:flex-row">
      {/* Sidebar */}
      <aside className="z-20 flex w-full shrink-0 flex-col bg-[#1e293b] text-white shadow-2xl lg:w-72">
        <div className="flex items-center gap-3 border-b border-white/10 p-4 sm:p-6 lg:p-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]">
            <span className="material-symbols-outlined text-white">admin_panel_settings</span>
          </div>
          <div>
            <div className="font-bold tracking-tight text-lg leading-tight">AdminBroker</div>
            <div className="text-[10px] text-white/50 uppercase font-bold tracking-widest mt-0.5">Control Center</div>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-3 sm:p-4 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:py-8">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`group flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all lg:gap-4 lg:py-3.5 ${
                  isActive 
                    ? 'bg-[var(--color-primary)] text-white shadow-lg' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined transition-premium ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-white/10 p-6 lg:block">
          <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-highlight)] font-bold text-[var(--color-primary)]">
              AD
            </div>
            <div>
              <div className="text-sm font-bold">Admin User</div>
              <div className="text-[10px] text-white/40">Zalogowany: 14:32</div>
            </div>
            <button type="button" onClick={handleLogout} className="ml-auto text-white/30 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="z-10 flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--color-divider)] bg-white px-4 py-3 sm:px-6 lg:h-16 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">search</span>
            <input className="min-w-0 flex-1 border-none bg-transparent text-sm outline-none sm:max-w-64" placeholder="Wyszukaj w systemie..." />
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-6">
            <button className="relative text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="hidden h-6 w-px bg-[var(--color-divider)] sm:block"></div>
            <div className="hidden text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest sm:block">Wersja v1.2.4</div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
