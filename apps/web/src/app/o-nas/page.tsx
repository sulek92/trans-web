import * as React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-8 mb-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-in relative z-10">
            <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-4 block">Nasza Historia</span>
            <h1 className="font-display-bold text-6xl font-bold text-[var(--color-on-background)] mb-8 leading-[1.1]">
              Budujemy mosty w <span className="text-[var(--color-primary)]">logistyce paletowej.</span>
            </h1>
            <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed mb-10">
              PaletBroker powstał z połączenia pasji do technologii i wieloletniego doświadczenia w branży TSL. Naszym celem jest uproszczenie transportu ciężkiego dla każdego biznesu.
            </p>
            <div className="flex gap-12 border-t border-[var(--color-divider)] pt-10">
              <div>
                <div className="text-4xl font-bold text-[var(--color-on-background)] mb-1">1200+</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] uppercase font-bold tracking-widest opacity-50">Zaufanych firm</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[var(--color-on-background)] mb-1">500k+</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] uppercase font-bold tracking-widest opacity-50">Wysłanych palet</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[var(--color-on-background)] mb-1">98%</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] uppercase font-bold tracking-widest opacity-50">Terminowości</div>
              </div>
            </div>
          </div>
          <div className="relative group animate-fade-in delay-200">
            <div className="aspect-[4/5] bg-slate-200 rounded-[60px] overflow-hidden border-8 border-white shadow-2xl relative">
               <div className="absolute inset-0 bg-[var(--color-primary)] opacity-10 group-hover:opacity-0 transition-opacity"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[200px] text-white opacity-20 group-hover:scale-110 transition-premium">inventory_2</span>
               </div>
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[40px] shadow-2xl border border-[var(--color-divider)] max-w-[280px]">
               <div className="font-bold text-xl leading-tight mb-4">&ldquo;Logistyka to nie tylko paczki, to obietnica dostarczona na czas.&rdquo;</div>
               <div className="text-xs text-[var(--color-primary)] font-bold uppercase tracking-widest">— Zarząd PaletBroker</div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-white py-32 border-b border-[var(--color-divider)] relative">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold mb-6">Wartości, które nas definiują</h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg max-w-2xl mx-auto">Dlaczego najwięksi gracze na rynku wybierają współpracę z PaletBroker?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: 'Innowacja', icon: 'auto_awesome', desc: 'Nieustannie rozwijamy nasze systemy API i algorytmy optymalizacji tras, aby obniżać koszty Twojej logistyki.' },
              { title: 'Niezawodność', icon: 'verified_user', desc: 'Współpracujemy wyłącznie z certyfikowanymi przewoźnikami o ugruntowanej pozycji rynkowej i doskonałej opinii.' },
              { title: 'Ludzkie podejście', icon: 'groups', desc: 'Za zaawansowaną technologią stoją ludzie. Każdy nasz klient biznesowy posiada dedykowanego opiekuna, który zna specyfikę jego branży.' }
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-3xl bg-[var(--color-surface-container-low)] text-[var(--color-primary)] flex items-center justify-center mb-8 shadow-inner transition-premium group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:-translate-y-2">
                  <span className="material-symbols-outlined text-4xl">{v.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-[var(--color-background)]">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
            <div className="max-w-2xl">
              <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-4 block">Eksperci</span>
              <h2 className="text-4xl font-bold mb-6">Ludzie, którzy napędzają Twoją logistykę</h2>
              <p className="text-[var(--color-on-surface-variant)] text-lg">Nasz zespół to połączenie pasji do transportu i nowoczesnych technologii IT.</p>
            </div>
            <button className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-bold hover:bg-[var(--color-surface-tint)] transition-premium shadow-lg">Dołącz do nas</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Adam Nowicki', role: 'Founder & CEO', icon: 'person' },
              { name: 'Karolina Wiśniewska', role: 'Head of Operations', icon: 'support_agent' },
              { name: 'Michał Król', role: 'CTO', icon: 'code' },
              { name: 'Marta Kowalska', role: 'Customer Success', icon: 'sentiment_very_satisfied' }
            ].map((m, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] border border-[var(--color-divider)] text-center group hover:shadow-2xl transition-premium">
                <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto mb-6 flex items-center justify-center text-slate-300 group-hover:bg-[var(--color-primary-highlight)] group-hover:text-[var(--color-primary)] transition-colors">
                  <span className="material-symbols-outlined text-5xl">{m.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{m.name}</h3>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-8 mb-24">
        <div className="max-w-[1280px] mx-auto bg-[var(--color-primary)] rounded-[60px] p-20 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <h2 className="text-5xl font-bold mb-8 relative z-10 leading-tight">Gotowy na nową jakość<br/>w transporcie Twojej firmy?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Link href="/wycena" className="bg-white text-[var(--color-primary)] px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-premium shadow-xl">Wyceń pierwszą paletę</Link>
            <Link href="/kontakt" className="bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-premium">Porozmawiaj z doradcą</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
