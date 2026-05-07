'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api-url';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<{orders: Order[], leads: Lead[], users: User[]} | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);

interface Order { id: string; orderNumber: string; status: string; }
interface Lead { id: string; name: string; email: string; company?: string; }
interface User { id: string; email: string; role: string; }

  const API_URL = getApiBaseUrl();

  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', href: '/admin' },
    { label: 'Zamówienia', icon: 'inventory', href: '/admin/zamowienia' },
    { label: 'Klienci B2B', icon: 'corporate_fare', href: '/admin/uzytkownicy' },
    { label: 'Zapytania (Leady)', icon: 'contact_support', href: '/admin/leady' },
    { label: 'Zarządzanie treścią', icon: 'edit_note', href: '/admin/cms' },
    { label: 'Opinie klientów', icon: 'reviews', href: '/admin/cms/testimonials' },
    { label: 'Wygląd', icon: 'palette', href: '/admin/wyglad' },
    { label: 'Cennik', icon: 'payments', href: '/admin/cennik' },
    { label: 'Finanse', icon: 'receipt_long', href: '/admin/finanse' },
    { label: 'Newsletter', icon: 'mail', href: '/admin/newsletter' },
    { label: 'Logi systemowe', icon: 'history', href: '/admin/logi-systemowe' },
    { label: 'Ustawienia', icon: 'settings', href: '/admin/ustawienia' },
  ];

  const handleLogout = () => {
    document.cookie = 'pb_auth_token=; Path=/; Max-Age=0; SameSite=Lax';
    document.cookie = 'pb_refresh_token=; Path=/; Max-Age=0; SameSite=Lax';
    document.cookie = 'pb_user_role=; Path=/; Max-Age=0; SameSite=Lax';
    router.push('/logowanie');
  };

  const performSearch = React.useCallback(async (q: string) => {
    if (q.length < 2) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${API_URL}/admin/search?q=${encodeURIComponent(q)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        setShowResults(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }, [API_URL]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) void performSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  return (
    <AuthGuard requireAdmin>
    <div className="flex min-h-screen flex-col overflow-hidden bg-[var(--color-background)] lg:h-screen lg:flex-row">
      {/* Sidebar */}
      <aside className="z-20 flex w-full shrink-0 flex-col bg-[var(--color-primary)] text-white shadow-2xl lg:w-72">
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
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-md' 
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
        <header className="z-30 flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--color-divider)] bg-white px-4 py-3 sm:px-6 lg:h-16 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4 relative">
            <span className={`material-symbols-outlined ${isSearching ? 'animate-spin' : ''} text-[var(--color-on-surface-variant)]`}>
              {isSearching ? 'progress_activity' : 'search'}
            </span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              className="min-w-0 flex-1 border-none bg-transparent text-sm outline-none sm:max-w-64" 
              placeholder="Wyszukaj w systemie..." 
            />

            {/* Global Search Results Dropdown */}
            {showResults && searchResults && (searchQuery.length >= 2) && (
              <div className="absolute top-full left-0 mt-2 w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Wyniki wyszukiwania</span>
                  <button onClick={() => setShowResults(false)} className="material-symbols-outlined text-slate-400 text-sm hover:text-slate-600">close</button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                  {/* Orders */}
                  {searchResults.orders.length > 0 && (
                    <div className="p-2">
                      <div className="px-4 py-2 text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">Zamówienia</div>
                      {searchResults.orders.map(o => (
                        <Link key={o.id} href="/admin/zamowienia" onClick={() => setShowResults(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-[var(--color-primary)]">inventory</span>
                          <div>
                            <div className="text-sm font-bold">{o.orderNumber}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{o.status}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {/* Leads */}
                  {searchResults.leads.length > 0 && (
                    <div className="p-2 border-t border-slate-50">
                      <div className="px-4 py-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest">Leady</div>
                      {searchResults.leads.map(l => (
                        <Link key={l.id} href="/admin/leady" onClick={() => setShowResults(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-amber-500">contact_support</span>
                          <div>
                            <div className="text-sm font-bold">{l.name}</div>
                            <div className="text-[10px] text-slate-400">{l.company || l.email}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {/* Users */}
                  {searchResults.users.length > 0 && (
                    <div className="p-2 border-t border-slate-50">
                      <div className="px-4 py-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Klienci</div>
                      {searchResults.users.map(u => (
                        <Link key={u.id} href="/admin/uzytkownicy" onClick={() => setShowResults(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-500">person</span>
                          <div>
                            <div className="text-sm font-bold">{u.email}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{u.role}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.orders.length === 0 && searchResults.leads.length === 0 && searchResults.users.length === 0 && (
                    <div className="p-10 text-center text-slate-400 italic">Brak wyników dla &quot;{searchQuery}&quot;</div>
                  )}
                </div>
              </div>
            )}
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
      {showResults && (
        <div className="fixed inset-0 z-20" onClick={() => setShowResults(false)}></div>
      )}
    </div>
    </AuthGuard>
  );
}
