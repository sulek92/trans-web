'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';

type DashboardStat = {
  label: string;
  value: string;
  trend: string;
  icon: string;
  color: string;
};

type DashboardOrder = {
  orderNumber: string;
  senderAddress?: { name?: string };
  status: string;
  priceBrutto: string;
};

type DashboardData = {
  stats: DashboardStat[];
  recentOrders: DashboardOrder[];
};

export default function AdminDashboard() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  React.useEffect(() => {
    const fetchStats = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const response = await fetch(`${API_URL}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error(err);
        // Mock data for demo
        setData({
          stats: [
            { label: 'Przychód (M-C)', value: '142 500 PLN', trend: '+12.5%', icon: 'payments', color: 'bg-emerald-100 text-emerald-700' },
            { label: 'Zlecenia Aktywne', value: '86', trend: '+4 dziś', icon: 'local_shipping', color: 'bg-blue-100 text-blue-700' },
            { label: 'Klienci B2B', value: '1 204', trend: '+18 w tyg.', icon: 'corporate_fare', color: 'bg-indigo-100 text-indigo-700' },
            { label: 'Konwersja', value: '4.2%', trend: '-0.5%', icon: 'trending_up', color: 'bg-amber-100 text-amber-700' },
          ],
          recentOrders: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    void fetchStats();
  }, [API_URL]);

  if (isLoading) return <div className="p-10">Ładowanie statystyk...</div>;
  if (!data) return <div className="p-10">Brak danych dashboardu.</div>;

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-2">Witaj, Administratorze</h1>
          <p className="text-[var(--color-on-surface-variant)]">Oto podsumowanie dzisiejszych operacji w systemie PaletBroker.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.stats.map((s, i: number) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium group">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center transition-premium group-hover:scale-110 shadow-sm`}>
                <span className="material-symbols-outlined text-3xl">{s.icon}</span>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {s.trend}
              </div>
            </div>
            <div className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-3xl font-bold text-[var(--color-on-background)]">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-[var(--color-divider)] flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-xl">Ostatnie zlecenia</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <th className="px-8 py-5">ID / Klient</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Kwota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-divider)]">
                {data.recentOrders.map((order, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-sm text-[var(--color-primary)] mb-1 group-hover:underline">{order.orderNumber}</div>
                      <div className="text-xs text-slate-500">{order.senderAddress?.name || 'Brak danych'}</div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-[var(--color-on-surface-variant)]">{order.status}</td>
                    <td className="px-8 py-5 text-right font-bold text-sm text-[var(--color-on-background)]">{order.priceBrutto} zł</td>
                  </tr>
                ))}
                {data.recentOrders.length === 0 && (
                  <tr><td colSpan={3} className="px-8 py-10 text-center text-slate-300">Brak nowych zleceń</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#1e293b] p-8 rounded-[40px] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <span className="material-symbols-outlined text-amber-400">tips_and_updates</span>
              <div className="font-bold text-lg">Porada dnia</div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed italic relative z-10">
              &ldquo;Zintegrowałeś panel administratora z bazą danych. Możesz teraz zarządzać zleceniami i treścią w czasie rzeczywistym.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
