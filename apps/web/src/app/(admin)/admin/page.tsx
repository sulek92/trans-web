'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

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

interface ActivityLog {
  createdAt: string;
  action: string;
  actorEmail: string;
}

type AnalyticsData = {
  chartData: { date: string; value: number }[];
  carrierStats: Record<string, number>;
  recentActivity: ActivityLog[];
  revenueByCurrency: { currency: string; total: number }[];
  topCustomers: { userId: string; orderCount: number; totalSpend: number }[];
  summary: {
    totalRevenue: number;
    avgOrderValue: number;
    ordersCount: number;
  };
};

export default function AdminDashboard() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  React.useEffect(() => {
    const fetchDashboard = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetch(`${API_URL}/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/admin/analytics`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (statsRes.ok) setData(await statsRes.json());
        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboard();
  }, [API_URL]);

  const totalRevenue = analytics?.summary?.totalRevenue ?? 0;

  if (isLoading) return (
    <div className="animate-fade-in space-y-10">
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-48 rounded-[32px]" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Skeleton className="lg:col-span-8 h-96 rounded-[40px]" />
        <Skeleton className="lg:col-span-4 h-96 rounded-[40px]" />
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-2">Witaj, Administratorze</h1>
          <p className="text-[var(--color-on-surface-variant)]">Oto podsumowanie operacji w systemie PaletBroker.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data?.stats.map((s, i: number) => (
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
        {/* Revenue Chart Widget */}
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden flex flex-col p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-on-background)]">Trend Przychodów</h2>
              <p className="text-sm text-slate-400 font-bold">Ostatnie 30 dni • Kwoty Brutto</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600">+{totalRevenue.toLocaleString('pl-PL')} PLN</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Suma z 30 dni</div>
            </div>
          </div>

          <div className="h-64 w-full relative flex items-end gap-2 group">
            {analytics?.chartData && analytics.chartData.length > 0 ? (
              analytics.chartData.map((d, i) => {
                const maxVal = Math.max(...analytics.chartData.map(cd => cd.value));
                const height = (d.value / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 bg-slate-50 relative group/bar rounded-t-lg transition-all hover:bg-[var(--color-primary)]/10" style={{ height: '100%' }}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-[var(--color-primary)] rounded-t-lg transition-all duration-700 ease-out group-hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {d.value} zł • {new Date(d.date).toLocaleDateString('pl-PL')}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold italic">Brak danych historycznych do wykresu.</div>
            )}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <span>30 dni temu</span>
            <span>Dzisiaj</span>
          </div>
        </div>

        {/* Activity Feed Widget */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm p-10 flex flex-col">
            <h2 className="text-xl font-bold mb-6">Przychody per Waluta</h2>
            <div className="space-y-4">
              {analytics?.revenueByCurrency && analytics.revenueByCurrency.map((c, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{c.currency}</span>
                  <span className="text-lg font-bold text-[var(--color-on-background)]">{Number(c.total).toLocaleString()} {c.currency}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm p-10 flex flex-col">
            <h2 className="text-xl font-bold mb-6">Top Klienci</h2>
            <div className="space-y-4">
              {analytics?.topCustomers && analytics.topCustomers.map((u, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <div className="text-xs font-bold text-[var(--color-on-background)] truncate max-w-[120px]">{u.userId}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600">{Number(u.totalSpend).toLocaleString()} zł</div>
                    <div className="text-[9px] text-slate-400 uppercase font-bold">{u.orderCount} zleceń</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm p-10 flex flex-col">
            <h2 className="text-xl font-bold mb-6">Przewoźnicy</h2>
            <div className="space-y-4">
              {analytics?.carrierStats && Object.entries(analytics.carrierStats).map(([carrier, count], i) => {
                const total = Object.values(analytics.carrierStats).reduce((a, b) => a + b, 0);
                const percent = Math.round((count / total) * 100);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <span>{carrier}</span>
                      <span>{count} ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-grow bg-[#1e293b] rounded-[40px] shadow-2xl text-white p-10 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-amber-400">history</span>
              <h2 className="font-bold text-xl">Ostatnia Aktywność</h2>
            </div>
            
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
                analytics.recentActivity.map((log, i) => (
                  <div key={i} className="flex gap-4 group cursor-default">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 z-10 relative"></div>
                      {i !== analytics.recentActivity.length - 1 && (
                        <div className="absolute top-3 left-[3.5px] bottom-0 w-[1px] bg-white/10 h-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                        {new Date(log.createdAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-sm font-bold text-white/90 group-hover:text-[var(--color-primary)] transition-colors">{log.action}</div>
                      <div className="text-[11px] text-white/60 mt-1 italic">{log.actorEmail}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white/30 italic text-sm">Brak zarejestrowanych działań.</div>
              )}
            </div>
            
            <Link href="/admin/logi-systemowe" className="mt-8 block w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all border border-white/10 uppercase tracking-widest text-center">
              Zobacz wszystkie logi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
