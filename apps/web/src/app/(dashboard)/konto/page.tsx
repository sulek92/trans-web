'use client';

import * as React from 'react';
import Link from 'next/link';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';

interface User {
  id: string;
  email: string;
  role: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  carrierCode: string;
  senderAddress: { city?: string };
  recipientAddress: { city?: string };
}

export default function DashboardOverviewPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [recentOrders, setRecentOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { addToast } = useToastStore();

  const fetchDashboardData = React.useCallback(async () => {
    try {
      const [userRes, ordersRes] = await Promise.all([
        fetch(`${getApiBaseUrl()}/users/me`, { credentials: 'include' }),
        fetch(`${getApiBaseUrl()}/orders/my`, { credentials: 'include' })
      ]);

      if (userRes.ok) setUser(await userRes.json());
      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        setRecentOrders(orders.slice(0, 3));
      }
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać danych profilu.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  React.useEffect(() => {
    void fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="pb-24 max-w-[1280px] mx-auto px-8 space-y-12">
        <Skeleton className="h-20 w-1/3 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-[32px]" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-[40px]" />
      </div>
    );
  }

  const activeOrdersCount = recentOrders.filter(o => ['PENDING', 'IN_TRANSIT', 'OCZEKIWANIE', 'W TRANSPORCIE'].includes(o.status.toUpperCase())).length;

  const stats = [
    { label: 'Aktywne przesyłki', value: activeOrdersCount.toString(), sub: 'W drodze do celu', icon: 'local_shipping', color: 'text-blue-600' },
    { label: 'Wszystkie zlecenia', value: recentOrders.length.toString(), sub: 'Historia zamówień', icon: 'package_2', color: 'text-[var(--color-primary)]' },
    { label: 'Twój status', value: user?.role === 'customer' ? 'B2B Basic' : 'Partner B2B', sub: 'Poziom partnerstwa', icon: 'verified', color: 'text-emerald-600' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': case 'DORĘCZONE': return 'bg-emerald-100 text-emerald-700';
      case 'PENDING': case 'OCZEKIWANIE': return 'bg-amber-100 text-amber-700';
      case 'IN_TRANSIT': case 'W TRANSPORCIE': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <main className="pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-[10px] bg-[var(--color-primary-highlight)] px-2 py-0.5 rounded">
                 {user?.role === 'admin' ? 'Administrator' : 'Partner Biznesowy'}
               </span>
               <span className="text-slate-300">•</span>
               <span className="text-slate-400 text-xs font-medium">{user?.email}</span>
            </div>
            <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-1">
              Cześć, {user?.email.split('@')[0]} 👋
            </h1>
            <p className="text-[var(--color-on-surface-variant)] text-lg">Witaj z powrotem w swoim centrum logistycznym.</p>
          </div>
          <Link href="/" className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[var(--color-surface-tint)] transition-premium flex items-center gap-2 shadow-xl shadow-[var(--color-primary)]/20 active:scale-95">
            <span className="material-symbols-outlined">add</span>
            Zleć nową paletę
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in delay-100">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium group">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-premium ${s.color}`}>
                  <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                </div>
              </div>
              <div className="text-4xl font-bold text-[var(--color-on-background)] mb-1 tracking-tight">{s.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
              <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-medium">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in delay-200">
          {/* Recent Orders */}
          <div className="lg:col-span-8 bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
               <h3 className="font-bold text-xl text-slate-900">Ostatnia aktywność</h3>
               <Link href="/zamowienia" className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest hover:underline flex items-center gap-1">
                 Zobacz wszystko <span className="material-symbols-outlined text-xs">arrow_forward</span>
               </Link>
            </div>
            
            <div className="p-8 space-y-4 flex-grow">
               {recentOrders.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-300">
                   <span className="material-symbols-outlined text-5xl mb-4 opacity-20">history</span>
                   <p className="font-medium italic">Brak niedawnej aktywności.</p>
                 </div>
               ) : (
                 recentOrders.map((order) => (
                   <div key={order.id} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 hover:bg-slate-100/80 transition-premium cursor-pointer border border-transparent hover:border-slate-200 group">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-bold text-[10px] text-[var(--color-primary)] shadow-sm group-hover:scale-110 transition-transform">
                            {order.carrierCode}
                         </div>
                         <div>
                            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                              {order.orderNumber} 
                              <span className="text-slate-300 font-normal">• {order.senderAddress?.city || '---'} → {order.recipientAddress?.city || '---'}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                              {new Date(order.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long' })}
                            </div>
                         </div>
                      </div>
                      <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm ${getStatusStyle(order.status)}`}>
                         {order.status}
                      </span>
                   </div>
                 ))
               )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-primary)] opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-all"></div>
               <h3 className="font-bold text-lg mb-6 relative z-10 flex items-center gap-2">
                 <span className="material-symbols-outlined text-amber-400">support_agent</span>
                 Twoje Wsparcie
               </h3>
               <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-2xl border border-white/10 shadow-inner">PB</div>
                  <div>
                     <div className="font-bold text-lg leading-tight">Dział Logistyki</div>
                     <div className="text-xs opacity-50 uppercase tracking-widest font-bold mt-1">Dostępny 24/7</div>
                  </div>
               </div>
               <div className="space-y-3 relative z-10">
                  <a href="tel:+48221234567" className="w-full py-4 rounded-2xl bg-[var(--color-primary)] font-bold text-sm hover:scale-[1.02] transition-premium shadow-lg flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">call</span> Zadzwoń
                  </a>
                  <Link href="/kontakt" className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm hover:bg-white/10 transition-premium flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">mail</span> Napisz wiadomość
                  </Link>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-[var(--color-divider)] p-8 shadow-sm">
               <h3 className="font-bold text-lg mb-6">Szybki dostęp</h3>
               <div className="grid grid-cols-2 gap-4">
                  {[
                     { label: 'Ustawienia', icon: 'settings', href: '/konto/ustawienia' },
                     { label: 'Adresy', icon: 'location_on', href: '/konto/adresy' },
                     { label: 'Zamówienia', icon: 'package_2', href: '/zamowienia' },
                     { label: 'Pomoc', icon: 'help_center', href: '/pomoc' },
                  ].map((tool, i) => (
                     <Link key={i} href={tool.href} className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 hover:bg-[var(--color-primary-highlight)] hover:text-[var(--color-primary)] transition-premium group border border-transparent hover:border-[var(--color-primary)]">
                        <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{tool.label}</span>
                     </Link>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
