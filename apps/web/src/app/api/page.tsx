'use client';

import * as React from 'react';

export default function APIPage() {
  const [copied, setCopied] = React.useState(false);
  
  const codeSample = `POST /api/v1/quotes
{
  "origin": "00-001",
  "destination": "30-001",
  "pallet": {
    "type": "EURO",
    "weight": 450,
    "height": 120
  }
}

// Response 200 OK
{
  "quote_id": "Q_88219",
  "offers": [
    { "carrier": "DHL", "price": 185.00 },
    { "carrier": "DPD", "price": 192.50 }
  ]
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-24 animate-fade-in">
          <div className="lg:w-1/2">
            <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-[10px] mb-4 block">Developer Center</span>
            <h1 className="font-display-bold text-6xl font-bold text-[var(--color-on-background)] mb-6 leading-tight">Zintegruj swoją logistykę z PaletBroker API</h1>
            <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed mb-10">
              Automatyzuj nadawanie przesyłek paletowych bezpośrednio ze swojego systemu ERP, WMS lub e-commerce. Nasze REST API to prostota i niezawodność, którą pokochają Twoi deweloperzy.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[var(--color-primary)] text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-[var(--color-primary-highlight)] hover:bg-[var(--color-surface-tint)] transition-premium active:scale-95">Pobierz Specyfikację OpenAPI</button>
              <button className="bg-white border border-[var(--color-divider)] px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-premium shadow-sm active:scale-95">Klucz Testowy</button>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-[#0f172a] rounded-[40px] p-10 shadow-2xl overflow-hidden border border-white/5 relative group">
              <div className="flex justify-between items-center mb-8">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                 </div>
                 <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                 >
                    <span className="material-symbols-outlined text-sm">{copied ? 'done' : 'content_copy'}</span>
                    {copied ? 'Skopiowano!' : 'Kopiuj kod'}
                 </button>
              </div>
              <pre className="font-data-mono text-sm leading-relaxed text-blue-400">
                {codeSample}
              </pre>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { title: 'Webhooks', icon: 'sync_alt', desc: 'Otrzymuj powiadomienia o każdej zmianie statusu przesyłki w czasie rzeczywistym.' },
            { title: 'SDK (JS/PHP)', icon: 'terminal', desc: 'Gotowe biblioteki ułatwiające integrację z Twoim ulubionym językiem programowania.' },
            { title: 'Szybkość', icon: 'bolt', desc: 'Czas odpowiedzi endpointów wyceny poniżej 200ms dzięki architekturze edge.' }
          ].map((f, i) => (
            <div key={i} className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">{f.icon}</span>
              </div>
              <h3 className="font-bold text-xl">{f.title}</h3>
              <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
