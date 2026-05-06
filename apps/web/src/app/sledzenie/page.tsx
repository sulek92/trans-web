'use client';

import * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToastStore } from '@/lib/store/toast-store';

interface TrackingEvent {
  date: string;
  status: string;
  description: string;
  location: string;
}

interface TrackingData {
  trackingNumber: string;
  carrier: string;
  status: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [searched, setSearched] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<TrackingData | null>(null);
  const addToast = useToastStore(state => state.addToast);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setSearched(true);
    try {
      const response = await fetch(`${API_URL}/tracking/${trackingNumber}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setData(null);
        addToast({ title: 'Błąd', description: 'Nie znaleziono przesyłki o podanym numerze.', type: 'error' });
      }
    } catch (err) {
      console.error('Tracking fetch failed:', err);
      addToast({ title: 'Błąd', description: 'Wystąpił problem z połączeniem.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusType = (status: string): 'success' | 'error' | 'primary' => {
    const s = status.toUpperCase();
    if (['DELIVERED', 'COMPLETED'].includes(s)) return 'success';
    if (['CANCELLED', 'ERROR'].includes(s)) return 'error';
    return 'primary';
  };

  return (
    <main className="flex-grow pt-24 pb-16 min-h-screen bg-[var(--color-background)]">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="mb-16 text-center animate-fade-in">
          <span className="inline-block px-3 py-1 bg-white border border-[var(--color-divider)] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Real-time Monitoring</span>
          <h1 className="font-display-bold text-6xl font-bold text-[var(--color-on-background)] mb-6 tracking-tight">System Śledzenia Palet</h1>
          <p className="text-[var(--color-on-surface-variant)] text-xl max-w-2xl mx-auto mb-12">Wpisz numer zlecenia PB-XXXX, aby sprawdzić precyzyjną lokalizację swojego ładunku.</p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-teal-400 rounded-[24px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${isLoading ? 'animate-pulse' : ''}`}></div>
            <div className="relative flex flex-col sm:flex-row gap-4 p-3 bg-white rounded-[22px] border border-[var(--color-divider)] shadow-2xl transition-all">
              <div className="relative flex-grow flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-slate-300">location_searching</span>
                <input 
                  type="text" 
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-transparent font-data-mono text-xl text-[var(--color-on-background)] outline-none placeholder:text-slate-300" 
                  placeholder="Numer listu OR-..." 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-slate-900 hover:bg-black text-white font-bold py-4 px-12 rounded-xl shadow-xl transition-premium active:scale-95 disabled:opacity-50"
              >
                {isLoading ? 'Łączenie...' : 'Lokalizuj'}
              </button>
            </div>
          </form>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              <Skeleton className="h-[400px] w-full rounded-[40px]" />
            </div>
            <div className="lg:col-span-4 space-y-8">
              <Skeleton className="h-[200px] w-full rounded-[40px]" />
              <Skeleton className="h-[200px] w-full rounded-[40px]" />
            </div>
          </div>
        ) : searched && data ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
            {/* Status Timeline */}
            <div className="lg:col-span-8 space-y-8">
               <div className="bg-white rounded-[40px] shadow-sm border border-[var(--color-divider)] p-12 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-10 border-b border-[var(--color-divider)] gap-6">
                     <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status przesyłki</div>
                        <h2 className={`text-4xl font-bold flex items-center gap-4 ${
                          getStatusType(data.status) === 'success' ? 'text-emerald-600' : 
                          getStatusType(data.status) === 'error' ? 'text-red-500' : 'text-[var(--color-primary)]'
                        }`}>
                           {data.status}
                           <span className={`w-3 h-3 rounded-full animate-pulse ${
                             getStatusType(data.status) === 'success' ? 'bg-emerald-500' : 
                             getStatusType(data.status) === 'error' ? 'bg-red-500' : 'bg-[var(--color-primary)]'
                           }`}></span>
                        </h2>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[200px]">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Przewidywane doręczenie</div>
                        <div className="text-xl font-bold">{data.estimatedDelivery ? new Date(data.estimatedDelivery).toLocaleDateString('pl-PL') : 'W trakcie...'}</div>
                     </div>
                  </div>

                  <div className="relative pl-6">
                     <div className="absolute top-2 bottom-2 left-[23px] w-[2px] bg-slate-100"></div>
                     {data.events.map((event, i) => (
                        <div key={i} className="relative flex gap-10 mb-12 last:mb-0">
                           <div className={`w-12 h-12 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center relative z-10 shrink-0 transition-transform hover:scale-110 ${
                             i === 0 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                           }`}>
                              <span className="material-symbols-outlined">{i === 0 ? 'local_shipping' : 'history'}</span>
                           </div>
                           <div className="pt-1">
                              <div className="flex items-center gap-3 mb-1">
                                 <div className={`font-bold text-xl ${i === 0 ? 'text-slate-900' : 'text-slate-400'}`}>{event.status}</div>
                                 <div className="text-xs font-bold text-slate-300">{new Date(event.date).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</div>
                              </div>
                              <div className="text-sm text-slate-500 font-medium">{event.description}</div>
                              <div className="text-xs text-slate-400 mt-1">{event.location}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Carrier & Help Side */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-[#1e293b] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <h3 className="text-xl font-bold mb-8 relative z-10">Szczegóły zlecenia</h3>
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                     <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <span className="material-symbols-outlined text-3xl">local_shipping</span>
                     </div>
                     <div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Przewoźnik</div>
                        <div className="text-xl font-bold">{data.carrier}</div>
                     </div>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                     <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Numer zlecenia</div>
                     <div className="text-lg font-data-mono">{data.trackingNumber}</div>
                  </div>
               </div>

               <div className="bg-white rounded-[40px] border border-[var(--color-divider)] p-10 shadow-sm">
                  <h3 className="font-bold text-lg mb-8">Potrzebujesz pomocy?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-8">Jeśli masz pytania dotyczące statusu swojej przesyłki, nasz zespół wsparcia jest dostępny 24/7.</p>
                  <div className="space-y-4">
                     <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold hover:bg-white hover:shadow-lg transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-blue-500">chat</span>
                        Czat z opiekunem
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ) : searched && !isLoading && (
          <div className="text-center p-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
             <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">search_off</span>
             <h3 className="text-xl font-bold text-slate-400">Nie znaleziono przesyłki</h3>
             <p className="text-slate-400 mt-2">Upewnij się, że wpisany numer jest poprawny.</p>
          </div>
        )}
      </div>
    </main>
  );
}

