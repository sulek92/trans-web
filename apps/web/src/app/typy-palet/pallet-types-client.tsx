'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PalletType {
  name: string;
  dims: string;
  weight: string;
  capacity: string;
  desc: string;
  icon: string;
}

interface PalletData {
  palletTypes?: PalletType[];
  measurementTips?: string[];
}

const HARDCODED_FALLBACK: PalletData = {
  palletTypes: [
    { name: 'Paleta Euro (EPAL)', dims: '1200 x 800 mm', weight: 'ok. 25 kg', capacity: 'do 1500 kg', desc: 'Najpopularniejszy standard w Europie. Posiada standaryzowane oznaczenia EPAL/EUR. Idealna do transportu międzynarodowego.', icon: 'widgets' },
    { name: 'Paleta Przemysłowa', dims: '1200 x 1000 mm', weight: 'ok. 30 kg', capacity: 'do 2000 kg', desc: 'Szersza wersja palety, często stosowana w przemyśle spożywczym i chemicznym. Zapewnia większą powierzchnię załadunku.', icon: 'category' },
    { name: 'Półpaleta', dims: '600 x 800 mm', weight: 'ok. 10 kg', capacity: 'do 500 kg', desc: 'Zajmuje połowę miejsca palety Euro. Często wykorzystywana do ekspozycji towaru w sklepach (tzw. paleta displayowa).', icon: 'view_quilt' },
  ],
  measurementTips: [
    'Zawsze podawaj wymiary całkowite (podstawa + towar).',
    'Towar nie powinien wystawać poza obrys palety.',
    'Wysokość palety mierzymy od podłoża do najwyższego punktu towaru.',
    'Waga rzeczywista obejmuje wagę towaru wraz z paletą i opakowaniem.',
  ],
};

export const PalletTypesClient = ({ data }: { data: PalletData }) => {
  const types = data?.palletTypes?.length ? data.palletTypes : HARDCODED_FALLBACK.palletTypes!;
  const tips = data?.measurementTips?.length ? data.measurementTips : HARDCODED_FALLBACK.measurementTips!;

  const palletTypeParam = (name: string) => {
    if (name.includes('Euro') && !name.includes('Pół')) return 'euro';
    if (name.includes('Przemysłowa')) return 'industrial';
    return 'half';
  };

  return (
    <main className="pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-4 block">Specyfikacje</span>
          <h1 className="font-display-bold text-5xl font-bold text-[var(--color-on-background)] mb-6 tracking-tight">Przewodnik po typach palet</h1>
          <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed opacity-80">Wybierz odpowiednią paletę dla swojego towaru. Prawidłowy dobór nośnika to klucz do bezpiecznego i ekonomicznego transportu.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {types.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] shadow-sm border border-[var(--color-divider)] overflow-hidden flex flex-col hover:shadow-2xl transition-premium group"
            >
              <div className="p-12 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--color-primary)] opacity-0 group-hover:opacity-[0.03] transition-opacity"></div>
                <span className="material-symbols-outlined text-8xl text-[var(--color-primary)] opacity-40 group-hover:scale-110 group-hover:opacity-100 transition-premium">{t.icon}</span>
              </div>
              <div className="p-10 flex-grow flex flex-col">
                <h2 className="text-2xl font-bold mb-6 tracking-tight">{t.name}</h2>
                <div className="space-y-4 mb-8">
                  {[{ l: 'Wymiary:', v: t.dims }, { l: 'Waga własna:', v: t.weight }, { l: 'Nośność:', v: t.capacity }].map((row, j) => (
                    <div key={j} className="flex justify-between text-sm py-3 border-b border-slate-50 last:border-0">
                      <span className="text-slate-400 font-medium">{row.l}</span>
                      <span className="font-bold text-slate-900">{row.v}</span>
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-10">{t.desc}</p>
                <Link href={`/?palletType=${palletTypeParam(t.name)}`} className="mt-auto w-full py-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-bold hover:bg-[var(--color-primary)] hover:text-white hover:border-transparent transition-premium text-center block shadow-sm active:scale-[0.98]">
                  Wyceń transport
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-16 bg-white rounded-[50px] border border-[var(--color-divider)] shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
            <span className="material-symbols-outlined text-[200px]">straighten</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-6 block">Porady ekspertów</span>
              <h2 className="text-4xl font-bold mb-8 tracking-tight">Jak prawidłowo zmierzyć przesyłkę?</h2>
              <ul className="space-y-6">
                {tips.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    </div>
                    <span className="text-slate-600 font-medium leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="aspect-video bg-slate-50 rounded-[40px] flex items-center justify-center border border-slate-100 group">
              <span className="material-symbols-outlined text-[120px] text-slate-200 group-hover:scale-110 group-hover:text-[var(--color-primary)] transition-premium">straighten</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};
