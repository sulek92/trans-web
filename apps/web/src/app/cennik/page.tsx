'use client';

import * as React from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [currency, setCurrency] = React.useState('PLN');
  const exchangeRate = 4.32;

  const formatPrice = (price: string) => {
    const val = parseFloat(price.replace(',', '.'));
    if (currency === 'EUR') {
      return (val / exchangeRate).toFixed(2).replace('.', ',');
    }
    return price;
  };

  const domesticRates = [
    { type: 'Półpaleta (do 200kg)', price: '120,00', icon: 'inventory_2' },
    { type: 'Paleta Euro (do 300kg)', price: '145,00', icon: 'pallet' },
    { type: 'Paleta Euro (do 600kg)', price: '165,00', icon: 'pallet' },
    { type: 'Paleta Euro (do 1000kg)', price: '195,00', icon: 'pallet' },
    { type: 'Przemysłowa (do 1200kg)', price: '240,00', icon: 'widgets' },
  ];

  const internationalRates = [
    { country: 'Niemcy', price: '85,00', eta: '2-3 dni' },
    { country: 'Czechy', price: '75,00', eta: '1-2 dni' },
    { country: 'Francja', price: '120,00', eta: '3-4 dni' },
    { country: 'Włochy', price: '135,00', eta: '3-5 dni' },
    { country: 'Benelux', price: '115,00', eta: '2-4 dni' },
  ];

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-20 text-center animate-fade-in relative">
          <div className="absolute top-0 right-0 flex bg-white p-1 rounded-2xl border border-[var(--color-divider)] shadow-sm">
             <button 
                onClick={() => setCurrency('PLN')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currency === 'PLN' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
                PLN
             </button>
             <button 
                onClick={() => setCurrency('EUR')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currency === 'EUR' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
                EUR
             </button>
          </div>
          <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-[10px] mb-4 block">Transparentność Cennika</span>
          <h1 className="font-display-bold text-6xl font-bold text-[var(--color-on-background)] mb-6 tracking-tight">Stawki skrojone pod biznes</h1>
          <p className="text-[var(--color-on-surface-variant)] text-xl max-w-2xl mx-auto">
            Podane stawki są cenami bazowymi netto. Dzięki umowom z największymi przewoźnikami oferujemy ceny o 40% niższe niż cenniki detaliczne.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Domestic */}
          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-[var(--color-divider)] animate-fade-in group hover:border-[var(--color-primary)] transition-all duration-500">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center">
                   <span className="material-symbols-outlined">flag</span>
                 </div>
                 <h2 className="text-3xl font-bold">Transport krajowy</h2>
              </div>
              <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">Najlepsza oferta</div>
            </div>
            <div className="space-y-2">
              {domesticRates.map((rate, i) => (
                <div key={i} className="flex justify-between items-center py-5 border-b border-slate-50 last:border-0 group/row hover:bg-slate-50 px-4 rounded-2xl transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-300 group-hover/row:text-[var(--color-primary)] transition-colors">{rate.icon}</span>
                    <span className="text-[var(--color-on-surface-variant)] font-medium">{rate.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mr-2">od</span>
                    <span className="font-bold text-2xl text-[var(--color-on-background)]">{formatPrice(rate.price)} <span className="text-xs opacity-40 font-medium">{currency}</span></span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/" className="w-full mt-10 bg-[var(--color-primary)] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[var(--color-surface-tint)] transition-premium shadow-xl shadow-[var(--color-primary-highlight)]/20 active:scale-95">
               <span className="material-symbols-outlined">calculate</span>
               Wyceń konkretną trasę
            </Link>
          </div>

          {/* International */}
          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-[var(--color-divider)] animate-fade-in delay-200 group hover:border-[var(--color-primary)] transition-all duration-500">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined">public</span>
              </div>
              <h2 className="text-3xl font-bold">Import / Eksport UE</h2>
            </div>
            <div className="space-y-2">
              {internationalRates.map((rate, i) => (
                <div key={i} className="flex justify-between items-center py-5 border-b border-slate-50 last:border-0 group/row hover:bg-slate-50 px-4 rounded-2xl transition-colors">
                  <div>
                    <div className="font-bold text-[var(--color-on-background)]">{rate.country}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ETA: {rate.eta}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mr-2">od</span>
                    <span className="font-bold text-2xl text-[var(--color-on-background)]">{currency === 'EUR' ? (parseFloat(rate.price.replace(',','.'))).toFixed(2).replace('.',',') : (parseFloat(rate.price.replace(',','.')) * exchangeRate).toFixed(2).replace('.',',')} <span className="text-xs opacity-40 font-medium">{currency}</span></span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/kontakt" className="w-full mt-10 bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-premium shadow-xl active:scale-95">
               <span className="material-symbols-outlined">mail</span>
               Zapytaj o inny kierunek
            </Link>
          </div>
        </div>

        {/* Dynamic Warning Section */}
        <div className="bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-primary)] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              <div className="md:col-span-2">
                 <h3 className="text-2xl font-bold mb-4">Gwarancja najniższej ceny</h3>
                 <p className="opacity-60 text-sm leading-relaxed max-w-sm">Jeśli znajdziesz tańszą ofertę na transport paletowy o tych samych parametrach, zwrócimy Ci różnicę i damy dodatkowe 5% rabatu na kolejne zlecenie.</p>
              </div>
              {[
                { label: 'Ubezpieczenie', value: 'W cenie', sub: 'OCP Przewoźnika' },
                { label: 'Dopłata paliwowa', value: '0%', sub: 'Zawsze w cenie' }
              ].map((info, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col justify-center">
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{info.label}</div>
                   <div className="text-2xl font-bold text-[var(--color-primary)]">{info.value}</div>
                   <div className="text-xs opacity-40 mt-1">{info.sub}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Pricing FAQ Section */}
        <section className="mt-32 mb-24">
           <h3 className="text-3xl font-bold text-center mb-16">Pytania dotyczące rozliczeń</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { q: 'Czy podane ceny są brutto?', a: 'Nie, wszystkie ceny w cenniku i kalkulatorze są cenami netto. Należy doliczyć 23% VAT dla usług krajowych.' },
                { q: 'Kiedy otrzymam fakturę?', a: 'Faktura VAT jest generowana automatycznie po opłaceniu zlecenia i przesyłana na Twój adres e-mail.' },
                { q: 'Jakie są metody płatności?', a: 'Obsługujemy szybkie przelewy (PayU), BLIK, karty płatnicze oraz przelewy tradycyjne (dla stałych klientów).' },
                { q: 'Czy ceny się zmieniają?', a: 'Stawki mogą ulegać zmianie w zależności od sezonowości i cen paliw, ale po opłaceniu zlecenia cena jest gwarantowana.' }
              ].map((faq, i) => (
                <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                   <h4 className="font-bold text-lg mb-4 text-[var(--color-primary)]">{faq.q}</h4>
                   <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </main>
  );
}

