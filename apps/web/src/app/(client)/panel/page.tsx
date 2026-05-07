'use client';

import * as React from 'react';
import Link from 'next/link';
import { getCookie } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  priceBrutto: string;
  carrierCode: string;
}

export default function PanelPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    active: 0,
    total: 0,
    balance: '0.00'
  });

  const API_URL = getApiBaseUrl();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/my`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data.slice(0, 5));
          setStats({
            active: data.filter((o: any) => !['DORĘCZONE', 'ANULOWANE'].includes(o.status)).length,
            total: data.length,
            balance: '0.00' // Mock balance as it might not be in API yet
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, [API_URL]);

  const statCards = [
    { label: 'Aktywne zlecenia', value: stats.active.toString(), icon: 'local_shipping' },
    { label: 'Wszystkie zamówienia', value: stats.total.toString(), icon: 'history' },
    { label: 'Środki na koncie', value: `${stats.balance} PLN`, icon: 'account_balance_wallet' },
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
        {isLoading ? (
          [1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-3xl" />)
        ) : statCards.map((stat, i) => (
          <div key={i} className="bg-[var(--color-surface-primary)] p-8 rounded-3xl border border-[var(--color-divider)] shadow-sm hover:shadow-md transition-premium group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform shadow-inner">
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span className="text-sm font-medium text-[var(--color-text-faint)] uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-[var(--color-on-background)] tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[var(--color-divider)] flex justify-between items-center bg-[var(--color-surface-container)]/30">
          <h2 className="text-xl font-bold tracking-tight">Ostatnie zlecenia</h2>
          <Link href="/panel/orders" className="text-[var(--color-primary)] font-bold text-sm hover:underline">Zobacz wszystkie</Link>
        </div>
        
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] bg-[var(--color-surface-container)]">
                  <th className="px-8 py-4">Numer</th>
                  <th className="px-8 py-4">Data</th>
                  <th className="px-8 py-4">Przewoźnik</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Cena</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-divider)]">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-[var(--color-surface-container)]/50 transition-colors">
                    <td className="px-8 py-4 font-bold text-[var(--color-on-background)]">{order.orderNumber}</td>
                    <td className="px-8 py-4 text-sm text-[var(--color-text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-4 text-sm uppercase font-bold text-[var(--color-text-faint)]">{order.carrierCode}</td>
                    <td className="px-8 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                        order.status === 'DORĘCZONE' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 font-bold text-[var(--color-on-background)]">{order.priceBrutto} PLN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center text-[var(--color-text-faint)] font-bold">
            <span className="material-symbols-outlined text-6xl mb-4 block opacity-20">inventory_2</span>
            Brak aktywnych zleceń w historii.
          </div>
        )}
      </div>
    </div>
  );
}
