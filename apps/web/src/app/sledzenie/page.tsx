'use client';

import * as React from 'react';

interface TrackingStep {
  status: string;
  time: string;
  loc: string;
  active: boolean;
  icon: string;
  msg?: string;
}

interface TrackingStatus {
  main: string;
  type: 'success' | 'error' | 'primary';
  eta: string;
  steps: TrackingStep[];
  hasPhoto: boolean;
  carrier: string;
}

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [searched, setSearched] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [status, setStatus] = React.useState<TrackingStatus | null>(null);

  const getStatusData = (id: string): TrackingStatus => {
    if (id.includes('DELIVERED') || id.includes('001')) {
      return {
        main: 'Dostarczono',
        type: 'success',
        eta: 'Wczoraj, 14:20',
        steps: [
          { status: 'Dostarczono', time: '14:20', loc: 'Wrocław, PL', active: true, icon: 'check_circle' },
          { status: 'W doręczeniu', time: '08:15', loc: 'Wrocław, PL', active: true, icon: 'local_shipping' },
          { status: 'Odebrano', time: '10:00', loc: 'Poznań, PL', active: true, icon: 'package_2' },
        ],
        hasPhoto: true,
        carrier: 'Raben Logistics'
      };
    }
    if (id.includes('DELAY') || id.includes('003')) {
       return {
         main: 'Opóźnienie',
         type: 'error',
         eta: 'Jutro, do 12:00',
         steps: [
           { status: 'Zatrzymano w sortowni', time: '12:45', loc: 'Gdańsk, PL', active: true, icon: 'warning', msg: 'Wymagana korekta adresu' },
           { status: 'W trasie', time: '04:30', loc: 'Warszawa, PL', active: true, icon: 'hub' },
           { status: 'Zlecono odbiór', time: '18:00', loc: 'Białystok, PL', active: true, icon: 'package' },
         ],
         hasPhoto: false,
         carrier: 'DHL Freight'
       };
    }
    return {
      main: 'W doręczeniu',
      type: 'primary',
      eta: 'Dzisiaj, do 17:00',
      steps: [
        { status: 'W doręczeniu', time: '09:45', loc: 'Kraków, PL', active: true, icon: 'local_shipping' },
        { status: 'W trasie', time: '22:30', loc: 'Warszawa, PL', active: false, icon: 'hub' },
        { status: 'Zlecono odbiór', time: '10:15', loc: 'Lublin, PL', active: false, icon: 'package' },
      ],
      hasPhoto: false,
      carrier: 'FedEx Heavy'
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSearched(true);
        setStatus(getStatusData(trackingNumber.toUpperCase()));
      }, 1200);
    }
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
                  placeholder="Numer listu PB-..." 
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
            <div className="mt-4 flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
               <span>Przykłady:</span>
               <button onClick={() => setTrackingNumber('DELIVERED')} className="hover:text-[var(--color-primary)] underline">DELIVERED</button>
               <button onClick={() => setTrackingNumber('DELAY')} className="hover:text-[var(--color-primary)] underline">DELAY</button>
            </div>
          </form>
        </div>

        {searched && !isLoading && status && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
            {/* Status Timeline */}
            <div className="lg:col-span-8 space-y-8">
               <div className="bg-white rounded-[40px] shadow-sm border border-[var(--color-divider)] p-12 relative overflow-hidden">
                  {status.type === 'error' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>}
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-10 border-b border-[var(--color-divider)] gap-6">
                     <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status przesyłki</div>
                        <h2 className={`text-4xl font-bold flex items-center gap-4 ${
                          status.type === 'success' ? 'text-emerald-600' : 
                          status.type === 'error' ? 'text-red-500' : 'text-[var(--color-primary)]'
                        }`}>
                           {status.main}
                           <span className={`w-3 h-3 rounded-full animate-pulse ${
                             status.type === 'success' ? 'bg-emerald-500' : 
                             status.type === 'error' ? 'bg-red-500' : 'bg-[var(--color-primary)]'
                           }`}></span>
                        </h2>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[200px]">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Przewidywane doręczenie</div>
                        <div className="text-xl font-bold">{status.eta}</div>
                     </div>
                  </div>

                  <div className="relative pl-6">
                     <div className="absolute top-2 bottom-2 left-[23px] w-[2px] bg-slate-100"></div>
                     {status.steps.map((step, i) => (
                        <div key={i} className={`relative flex gap-10 mb-12 last:mb-0 ${!step.active && i > 0 ? 'opacity-30' : ''}`}>
                           <div className={`w-12 h-12 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center relative z-10 shrink-0 transition-transform hover:scale-110 ${
                             step.active ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                           }`}>
                              <span className="material-symbols-outlined">{step.icon}</span>
                           </div>
                           <div className="pt-1">
                              <div className="flex items-center gap-3 mb-1">
                                 <div className={`font-bold text-xl ${step.active ? 'text-slate-900' : 'text-slate-400'}`}>{step.status}</div>
                                 <div className="text-xs font-bold text-slate-300">{step.time}</div>
                              </div>
                              <div className="text-sm text-slate-500 font-medium">{step.loc}</div>
                              {step.msg && (
                                <div className="mt-2 py-2 px-4 bg-red-50 text-red-700 text-xs font-bold rounded-lg inline-block border border-red-100">
                                   {step.msg}
                                </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {status.hasPhoto && (
                  <div className="bg-white rounded-[40px] border border-[var(--color-divider)] p-12 shadow-sm animate-fade-in-up">
                     <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-emerald-500">photo_library</span>
                        Cyfrowy Dowód Dostarczenia (POD)
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative border border-slate-200 shadow-inner group">
                           <div className="absolute inset-0 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform duration-700">
                              <span className="material-symbols-outlined text-8xl">image</span>
                           </div>
                           {/* Simulated delivery photo overlay */}
                           <div className="absolute inset-4 border-2 border-white/40 rounded-2xl pointer-events-none"></div>
                           <div className="absolute bottom-6 left-6 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Podpisano: Jan Kowalski</div>
                        </div>
                        <div className="space-y-6">
                           <p className="text-slate-500 text-sm leading-relaxed">Przesyłka została odebrana i podpisana przez odbiorcę. Dokumentacja zdjęciowa potwierdza brak uszkodzeń zewnętrznych palety.</p>
                           <div className="space-y-3">
                              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-2">
                                 <span>Godzina doręczenia</span>
                                 <span className="text-slate-900">14:20:12</span>
                              </div>
                              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-2">
                                 <span>Współrzędne GPS</span>
                                 <span className="text-slate-900">51.1079° N, 17.0385° E</span>
                              </div>
                           </div>
                           <button className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold hover:bg-white hover:shadow-lg transition-all flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-sm">download</span>
                              Pobierz PDF z podpisem
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Carrier & Order Details Side */}
            <div className="lg:col-span-4 space-y-8">
               <div className="bg-[#1e293b] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                  <h3 className="text-xl font-bold mb-8 relative z-10">Obsługa Logistyczna</h3>
                  <div className="flex items-center gap-6 mb-8 relative z-10">
                     <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <span className="material-symbols-outlined text-3xl">local_shipping</span>
                     </div>
                     <div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Przewoźnik</div>
                        <div className="text-xl font-bold">{status.carrier}</div>
                     </div>
                  </div>
                  <div className="space-y-4 relative z-10 pt-6 border-t border-white/10">
                     <div className="flex justify-between text-xs font-medium opacity-60">
                        <span>Waga przesyłki</span>
                        <span>350.00 kg</span>
                     </div>
                     <div className="flex justify-between text-xs font-medium opacity-60">
                        <span>Typ palety</span>
                        <span>Euro (EPAL)</span>
                     </div>
                     <div className="flex justify-between text-xs font-medium opacity-60">
                        <span>Ubezpieczenie</span>
                        <span className="text-emerald-400 font-bold">CARGO (Aktywne)</span>
                     </div>
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
                     <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold hover:bg-white hover:shadow-lg transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-emerald-500">call</span>
                        Infolinia B2B
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

