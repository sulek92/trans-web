'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export function TrackingClient() {
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

  const getStatusStep = (status: string): number => {
    const s = status.toUpperCase();
    if (['ORDERED', 'PENDING', 'ZAREJESTROWANO', 'OCZEKIWANIE'].some(k => s.includes(k))) return 1;
    if (['PICKED_UP', 'COLLECTED', 'ODEBRANO'].some(k => s.includes(k))) return 2;
    if (['IN_TRANSIT', 'TRANSPORT', 'W TRANSPORCIE'].some(k => s.includes(k))) return 3;
    if (['OUT_FOR_DELIVERY', 'W DORĘCZENIU'].some(k => s.includes(k))) return 4;
    if (['DELIVERED', 'COMPLETED', 'DORĘCZONO'].some(k => s.includes(k))) return 5;
    return 3; // Default to middle
  };

  const steps = [
    { label: 'Zlecenie', icon: 'assignment' },
    { label: 'Odbiór', icon: 'inventory_2' },
    { label: 'Transport', icon: 'local_shipping' },
    { label: 'Doręczenie', icon: 'home_pin' },
    { label: 'Sukces', icon: 'check_circle' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <span className="inline-block px-3 py-1 bg-white border border-[var(--color-divider)] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-sm">
          Real-time Monitoring
        </span>
        <h1 className="font-display-bold text-5xl md:text-6xl font-bold text-[var(--color-on-background)] mb-6 tracking-tight">
          System Śledzenia Palet
        </h1>
        <p className="text-[var(--color-on-surface-variant)] text-xl max-w-2xl mx-auto mb-12">
          Monitoruj swoją przesyłkę na każdym etapie podróży. Wpisz numer OR-XXXX, aby zacząć.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-teal-400 rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${isLoading ? 'animate-pulse' : ''}`}></div>
          <div className="relative flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-[28px] border border-[var(--color-divider)] shadow-2xl transition-all">
            <div className="relative flex-grow flex items-center">
              <span className="material-symbols-outlined absolute left-5 text-slate-300">search</span>
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
              className="bg-slate-900 hover:bg-black text-white font-bold py-4 px-12 rounded-2xl shadow-xl transition-premium active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Lokalizuję...
                </>
              ) : (
                <>Lokalizuj</>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            <div className="lg:col-span-8 space-y-8">
              <Skeleton className="h-[500px] w-full rounded-[48px]" />
            </div>
            <div className="lg:col-span-4 space-y-8">
              <Skeleton className="h-[250px] w-full rounded-[40px]" />
              <Skeleton className="h-[250px] w-full rounded-[40px]" />
            </div>
          </motion.div>
        ) : searched && data ? (
          <motion.div 
            key="data"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10"
          >
            {/* Main Status Card */}
            <div className="lg:col-span-8 space-y-8">
               <div className="bg-white rounded-[48px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)] p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] rounded-full -mr-48 -mt-48 blur-3xl"></div>
                  
                  {/* Status Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 pb-12 border-b border-slate-50 gap-8 relative z-10">
                     <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Aktualny status</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-on-background)] tracking-tight">
                           {data.status}
                        </h2>
                     </div>
                     <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 min-w-[240px]">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Przewidywane doręczenie</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {data.estimatedDelivery ? new Date(data.estimatedDelivery).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long' }) : 'Wkrótce...'}
                        </div>
                     </div>
                  </div>

                  {/* Visual Progress Steps */}
                  <div className="mb-20 px-4 relative z-10">
                    <div className="relative flex justify-between">
                      {/* Background line */}
                      <div className="absolute top-6 left-0 right-0 h-1 bg-slate-100 rounded-full"></div>
                      {/* Active line */}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(getStatusStep(data.status) - 1) * 25}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute top-6 left-0 h-1 bg-[var(--color-primary)] rounded-full"
                      ></motion.div>

                      {steps.map((step, i) => {
                        const stepNum = i + 1;
                        const active = stepNum <= getStatusStep(data.status);
                        const current = stepNum === getStatusStep(data.status);

                        return (
                          <div key={i} className="relative z-10 flex flex-col items-center">
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2 + i * 0.1 }}
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-premium border-4 border-white shadow-xl ${
                                active ? 'bg-[var(--color-primary)] text-white' : 'bg-slate-100 text-slate-300'
                              } ${current ? 'ring-4 ring-[var(--color-primary)]/20 scale-110' : ''}`}
                            >
                              <span className="material-symbols-outlined text-xl">{step.icon}</span>
                            </motion.div>
                            <span className={`mt-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                              active ? 'text-slate-900' : 'text-slate-300'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Event Timeline */}
                  <div className="relative pl-8 relative z-10">
                     <div className="absolute top-2 bottom-2 left-[31px] w-[2px] bg-slate-50"></div>
                     <div className="space-y-12">
                       {data.events.map((event, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative flex gap-10"
                          >
                             <div className={`w-12 h-12 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center relative z-10 shrink-0 transition-premium hover:scale-110 ${
                               i === 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-50'
                             }`}>
                                <span className="material-symbols-outlined text-xl">{i === 0 ? 'local_shipping' : 'history'}</span>
                             </div>
                             <div className="pt-1 flex-grow">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                   <div className={`font-bold text-2xl ${i === 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                                     {event.status}
                                   </div>
                                   <div className="text-xs font-bold text-slate-300 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                     {new Date(event.date).toLocaleDateString('pl-PL')} • {new Date(event.date).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                   </div>
                                </div>
                                <div className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
                                  {event.description}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest mt-4">
                                   <span className="material-symbols-outlined text-sm">location_on</span>
                                   {event.location}
                                </div>
                             </div>
                          </motion.div>
                       ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Side Info Cards */}
            <div className="lg:col-span-4 space-y-8">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="bg-[#1e293b] rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl group"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                  <h3 className="text-xl font-bold mb-10 relative z-10 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                    Szczegóły logistyczne
                  </h3>
                  
                  <div className="space-y-10 relative z-10">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                          <span className="material-symbols-outlined text-3xl text-[var(--color-primary)]">local_shipping</span>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Przewoźnik</div>
                          <div className="text-2xl font-bold tracking-tight">{data.carrier}</div>
                       </div>
                    </div>
                    
                    <div className="pt-10 border-t border-white/10">
                       <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Identyfikator zlecenia</div>
                       <div className="text-2xl font-data-mono font-bold text-[var(--color-primary)]">{data.trackingNumber}</div>
                    </div>
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="bg-white rounded-[48px] border border-[var(--color-divider)] p-12 shadow-[var(--shadow-premium)] relative overflow-hidden group"
               >
                  <h3 className="font-bold text-2xl mb-6 tracking-tight">Wsparcie Klienta</h3>
                  <p className="text-lg text-slate-500 leading-relaxed mb-10">
                    Twój opiekun jest gotowy odpowiedzieć na pytania dotyczące tej przesyłki 24 godziny na dobę.
                  </p>
                  <div className="space-y-4">
                     <button className="w-full py-5 bg-[var(--color-primary-highlight)] text-[var(--color-primary)] border border-[var(--color-primary)]/10 rounded-2xl text-sm font-bold hover:bg-[var(--color-primary)] hover:text-white transition-premium flex items-center justify-center gap-3 active:scale-95 shadow-sm">
                        <span className="material-symbols-outlined">chat</span>
                        Konsultacja Live
                     </button>
                     <button className="w-full py-5 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-premium flex items-center justify-center gap-3 active:scale-95">
                        <span className="material-symbols-outlined">help</span>
                        Centrum Pomocy
                     </button>
                  </div>
               </motion.div>
            </div>
          </motion.div>
        ) : searched && !isLoading && (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-24 bg-white rounded-[60px] border-2 border-dashed border-slate-100 shadow-inner"
          >
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
               <span className="material-symbols-outlined text-5xl text-slate-300">search_off</span>
             </div>
             <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Nie znaleziono przesyłki</h3>
             <p className="text-slate-400 text-lg max-w-md mx-auto">
               System nie zarejestrował numeru <strong>{trackingNumber}</strong>. Sprawdź poprawność identyfikatora lub skontaktuj się z obsługą.
             </p>
             <button 
               onClick={() => { setSearched(false); setTrackingNumber(''); }}
               className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
             >
               Spróbuj ponownie
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
