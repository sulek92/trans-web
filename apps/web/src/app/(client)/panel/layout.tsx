'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useWebsocket } from '@/hooks/use-websocket';
import { jwtDecode } from 'jwt-decode';

const ChatWidget = dynamic(
  () => import('@/components/chat/chat-widget').then((mod) => ({ default: mod.ChatWidget })),
  { ssr: false },
);

function getCookie(name: string) {
  if (typeof window === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

const MENU_ITEMS = [
  { label: 'Pulpit', href: '/panel', icon: 'dashboard' },
  { label: 'Zlecenia', href: '/panel/orders', icon: 'local_shipping' },
  { label: 'Adresy', href: '/panel/addresses', icon: 'location_on' },
  { label: 'Moja firma', href: '/panel/company', icon: 'corporate_fare' },
  { label: 'Ustawienia', href: '/panel/settings', icon: 'settings' },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const [userId, setUserId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const token = getCookie('pb_auth_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.sub);
      } catch (e) {
        console.error('Failed to decode token', e);
      }
    }
  }, []);

  useWebsocket(userId);

  return (
    <div className="flex-grow min-h-screen bg-[var(--color-background)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar - Desktop */}
        <aside className="w-72 shrink-0 space-y-4 hidden lg:block">
          <div className="bg-white rounded-[32px] border border-[var(--color-divider)] p-4 shadow-sm sticky top-8">
            <div className="px-4 py-6 border-b border-slate-50 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-highlight)] flex items-center justify-center text-[var(--color-primary)] font-bold">
                  PB
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--color-on-background)]">Konto Klienta</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Strefa B2B</div>
                </div>
              </div>
            </div>
            
            <nav className="space-y-1">
              {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-premium ${
                      isActive 
                        ? 'bg-[var(--color-primary)] text-white shadow-lg' 
                        : 'text-[var(--color-on-surface-variant)] hover:bg-slate-50'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t border-slate-50 px-4 pb-2">
              <button className="flex items-center gap-3 text-red-500 font-bold text-sm hover:opacity-70 transition-opacity">
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Wyloguj się
              </button>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Potrzebujesz pomocy?</div>
              <div className="text-sm font-bold mb-4 leading-relaxed">Twój opiekun handlowy jest dostępny online.</div>
              <button className="w-full bg-[var(--color-primary)] py-3.5 rounded-xl font-bold text-xs hover:brightness-110 transition-all shadow-lg">Czatuj teraz</button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-7xl opacity-10 group-hover:scale-110 transition-transform">support_agent</span>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden sticky top-4 z-40">
          <div className="bg-white rounded-2xl border border-[var(--color-divider)] p-2 shadow-xl flex justify-around overflow-x-auto no-scrollbar">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 p-3 min-w-[70px] rounded-xl transition-colors ${
                    isActive ? 'text-[var(--color-primary)]' : 'text-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow min-w-0">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}
