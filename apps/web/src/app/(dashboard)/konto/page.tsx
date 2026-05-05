'use client';

import * as React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState('overview');

  const stats = [
    { label: 'Aktywne przesyłki', value: '3', sub: 'W drodze do celu', icon: 'local_shipping', trend: '+1' },
    { label: 'Wysłane (30 dni)', value: '18', sub: 'Suma 4 520 kg', icon: 'package_2', trend: '+12%' },
    { label: 'Oszczędności B2B', value: '840 PLN', sub: 'Dzięki umowie stałej', icon: 'payments', trend: 'Premium' },
  ];

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-[10px] bg-[var(--color-primary-highlight)] px-2 py-0.5 rounded">Partner Gold B2B</span>
               <span className="text-slate-300">•</span>
               <span className="text-slate-400 text-xs font-medium">Ostatnie logowanie: Dzisiaj, 08:12</span>
            </div>
            <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-1">Cześć, Marek 👋</h1>
            <p className="text-[var(--color-on-surface-variant)]">Zarządzaj logistyką GlobalCargo Sp. z o.o.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Link href="/" className="flex-1 md:flex-none bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[var(--color-surface-tint)] transition-premium flex items-center justify-center gap-2 shadow-xl shadow-[var(--color-primary-highlight)]">
              <span className="material-symbols-outlined text-xl">add</span>
              Zleć nową paletę
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm hover:shadow-md transition-premium group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[var(--color-primary)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-premium">
                  <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {s.trend}
                </span>
              </div>
              <div className="text-4xl font-bold text-[var(--color-on-background)] mb-1">{s.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
              <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-medium">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden">
               <div className="flex border-b border-[var(--color-divider)]">
                  {['overview', 'active', 'history'].map((tab) => (
                     <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-6 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-[var(--color-primary)]' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                        {tab === 'overview' ? 'Przegląd' : tab === 'active' ? 'W drodze' : 'Historia'}
                        {activeTab === tab && <div className="absolute bottom-0 left-8 right-8 h-1 bg-[var(--color-primary)] rounded-t-full"></div>}
                     </button>
                  ))}
               </div>
               
               <div className="p-10">
                  {activeTab === 'overview' && (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="font-bold text-xl">Ostatnia aktywność</h3>
                           <Link href="/zamowienia" className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest hover:underline">Wszystkie</Link>
                        </div>
                        
                        {[
                           { id: 'PB-2918', status: 'W doręczeniu', date: 'Dzisiaj, 08:45', carrier: 'DHL', loc: 'Warszawa → Kraków' },
                           { id: 'PB-2892', status: 'Odebrana', date: 'Wczoraj, 14:20', carrier: 'Raben', loc: 'Łódź → Poznań' },
                        ].map((order, i) => (
                           <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] text-[var(--color-primary)] shadow-sm">
                                    {order.carrier}
                                 </div>
                                 <div>
                                    <div className="text-sm font-bold text-slate-800">{order.id} <span className="text-slate-300 font-normal ml-2">• {order.loc}</span></div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{order.date}</div>
                                 </div>
                              </div>
                              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${order.status === 'W doręczeniu' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                 {order.status}
                              </span>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-primary)] opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-all"></div>
               <h3 className="font-bold text-lg mb-4 relative z-10">Mój Opiekun Klienta</h3>
               <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-xl border border-white/10">AK</div>
                  <div>
                     <div className="font-bold">Adam Kowalski</div>
                     <div className="text-xs opacity-60">Key Account Manager</div>
                  </div>
               </div>
               <div className="space-y-3 relative z-10">
                  <button className="w-full py-4 rounded-2xl bg-[var(--color-primary)] font-bold text-sm hover:scale-[1.02] transition-premium shadow-lg active:scale-95">Zadzwoń teraz</button>
                  <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm hover:bg-white/10 transition-premium">Wyślij zapytanie</button>
               </div>
            </div>

            <div className="bg-white rounded-[40px] border border-[var(--color-divider)] p-8 shadow-sm">
               <h3 className="font-bold text-lg mb-6">Szybkie narzędzia</h3>
               <div className="grid grid-cols-2 gap-4">
                  {[
                     { label: 'Ustawienia', icon: 'settings', href: '/konto/ustawienia' },
                     { label: 'Adresy', icon: 'location_on', href: '/konto/adresy' },
                     { label: 'Faktury', icon: 'description', href: '/konto/faktury' },
                     { label: 'API', icon: 'code', href: '/api' },
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

