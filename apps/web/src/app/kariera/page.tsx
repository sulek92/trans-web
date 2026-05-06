import * as React from 'react';
import { getCmsContent } from '@/lib/cms';

const FALLBACK = {
  heroTitle: 'Buduj z nami przyszłość logistyki',
  heroDesc: 'PaletBroker to nie tylko platforma, to zespół pasjonatów technologii i transportu. Szukamy osób, które chcą realnie zmieniać branżę TSL.',
  reasons: [
    { title: 'Nowoczesny Stack', icon: 'code', desc: 'Pracujemy na najnowszych technologiach (Next.js 15, AI), eliminując dług technologiczny.' },
    { title: 'Realny wpływ', icon: 'trending_up', desc: 'Twoje pomysły są wdrażane w życie. Cenimy inicjatywę i kreatywne podejście do problemów.' },
    { title: 'Elastyczność', icon: 'calendar_month', desc: 'Stawiamy na work-life balance. Oferujemy pracę zdalną i elastyczne godziny pracy.' }
  ],
  jobOffers: [
    { title: 'Spedytor Międzynarodowy', location: 'Warszawa / Hybrydowo', type: 'Pełny etat' },
    { title: 'Fullstack Developer (Next.js)', location: 'Zdalnie', type: 'B2B / Umowa o pracę' },
    { title: 'Key Account Manager B2B', location: 'Warszawa', type: 'Pełny etat' }
  ],
};

export default async function CareersPage() {
  const cms = await getCmsContent<typeof FALLBACK>('kariera');
  const d = { ...FALLBACK, ...cms };

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="bg-[#005258] rounded-[40px] p-16 text-white mb-24 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="font-display-bold text-5xl font-bold mb-6">{d.heroTitle}</h1>
            <p className="text-xl opacity-80 max-w-2xl leading-relaxed">{d.heroDesc}</p>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <span className="material-symbols-outlined text-[300px]">groups</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-8 text-[var(--color-on-background)]">Dlaczego PaletBroker?</h2>
            <div className="space-y-8">
              {d.reasons.map((b, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">{b.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{b.title}</h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-[var(--color-on-background)]">Aktualne oferty</h2>
            <div className="space-y-4">
              {d.jobOffers.map((j, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-[var(--color-divider)] shadow-sm hover:border-[var(--color-primary)] transition-premium flex justify-between items-center group cursor-pointer">
                  <div>
                    <h3 className="font-bold text-[var(--color-on-background)] group-hover:text-[var(--color-primary)] transition-colors">{j.title}</h3>
                    <div className="text-xs text-[var(--color-on-surface-variant)] mt-1">{j.location} • {j.type}</div>
                  </div>
                  <span className="material-symbols-outlined text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-premium">arrow_forward</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
