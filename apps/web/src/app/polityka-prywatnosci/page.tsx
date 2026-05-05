import * as React from 'react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Administrator Danych',
      content: 'Administratorem Twoich danych osobowych jest PaletBroker Sp. z o.o. z siedzibą w Warszawie, ul. Logistyczna 12, 00-001 Warszawa, NIP: 5252223334.'
    },
    {
      title: 'Cel przetwarzania danych',
      content: 'Dane są przetwarzane w celu realizacji usług transportowych, obsługi zleceń w systemie, wystawiania faktur oraz komunikacji z przewoźnikami biorącymi udział w procesie logistycznym.'
    },
    {
      title: 'Twoje prawa',
      content: 'Zgodnie z RODO przysługuje Ci prawo do dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz przenoszenia danych.'
    },
    {
      title: 'Pliki Cookies',
      content: 'Nasza witryna wykorzystuje pliki cookies w celu zapewnienia prawidłowego działania panelu klienta oraz w celach analitycznych (Google Analytics).'
    }
  ];

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[800px] mx-auto px-8">
        <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-12">Polityka Prywatności</h1>
        
        <div className="space-y-12">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold text-[var(--color-on-background)] mb-4">{s.title}</h2>
              <p className="text-[var(--color-on-surface-variant)] leading-relaxed text-sm">
                {s.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-16 p-8 bg-[var(--color-surface-container-low)] rounded-2xl border border-[var(--color-divider)]">
          <p className="text-xs text-[var(--color-on-surface-variant)] italic">
            Ostatnia aktualizacja: 05 maja 2024 r. PaletBroker zastrzega sobie prawo do wprowadzania zmian w niniejszej polityce.
          </p>
        </div>
      </div>
    </main>
  );
}
