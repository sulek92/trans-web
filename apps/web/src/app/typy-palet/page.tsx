import * as React from 'react';
import Link from 'next/link';

export default function PalletTypesPage() {
  const types = [
    {
      name: 'Paleta Euro (EPAL)',
      dims: '1200 x 800 mm',
      weight: 'ok. 25 kg',
      capacity: 'do 1500 kg',
      desc: 'Najpopularniejszy standard w Europie. Posiada standaryzowane oznaczenia EPAL/EUR. Idealna do transportu międzynarodowego.',
      icon: 'widgets'
    },
    {
      name: 'Paleta Przemysłowa',
      dims: '1200 x 1000 mm',
      weight: 'ok. 30 kg',
      capacity: 'do 2000 kg',
      desc: 'Szersza wersja palety, często stosowana w przemyśle spożywczym i chemicznym. Zapewnia większą powierzchnię załadunku.',
      icon: 'category'
    },
    {
      name: 'Półpaleta',
      dims: '600 x 800 mm',
      weight: 'ok. 10 kg',
      capacity: 'do 500 kg',
      desc: 'Zajmuje połowę miejsca palety Euro. Często wykorzystywana do ekspozycji towaru w sklepach (tzw. paleta displayowa).',
      icon: 'view_quilt'
    }
  ];

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-4">Przewodnik po typach palet</h1>
          <p className="text-[var(--color-on-surface-variant)] text-lg">
            Wybierz odpowiednią paletę dla swojego towaru. Prawidłowy dobór nośnika to klucz do bezpiecznego i ekonomicznego transportu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {types.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-[var(--color-divider)] overflow-hidden flex flex-col">
              <div className="p-8 bg-[var(--color-surface-container-low)] flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-[var(--color-primary)] opacity-80">{t.icon}</span>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h2 className="text-2xl font-bold mb-4">{t.name}</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm py-2 border-b border-[var(--color-divider)]">
                    <span className="text-[var(--color-on-surface-variant)]">Wymiary:</span>
                    <span className="font-bold text-[var(--color-on-background)]">{t.dims}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-[var(--color-divider)]">
                    <span className="text-[var(--color-on-surface-variant)]">Waga własna:</span>
                    <span className="font-bold text-[var(--color-on-background)]">{t.weight}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-[var(--color-divider)]">
                    <span className="text-[var(--color-on-surface-variant)]">Nośność:</span>
                    <span className="font-bold text-[var(--color-on-background)]">{t.capacity}</span>
                  </div>
                </div>
                <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed mb-8">
                  {t.desc}
                </p>
                <Link 
                  href={`/?palletType=${t.name.includes('Euro') ? 'euro' : t.name.includes('Przemysłowa') ? 'industrial' : 'half'}`}
                  className="mt-auto w-full py-4 rounded-xl border border-[var(--color-primary)] text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary)] hover:text-white transition-premium text-center"
                >
                  Wyceń transport tej palety
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-white rounded-3xl border border-[var(--color-divider)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Jak zmierzyć paletę?</h2>
              <ul className="space-y-4">
                {[
                  'Zawsze podawaj wymiary całkowite (podstawa + towar).',
                  'Towar nie powinien wystawać poza obrys palety.',
                  'Wysokość palety mierzymy od podłoża do najwyższego punktu towaru.',
                  'Waga rzeczywista obejmuje wagę towaru wraz z paletą i opakowaniem.'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">check_circle</span>
                    <span className="text-[var(--color-on-background)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-video bg-[var(--color-surface-container-low)] rounded-xl flex items-center justify-center border border-[var(--color-divider)]">
              <span className="material-symbols-outlined text-7xl text-[var(--color-outline-variant)]">straighten</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
