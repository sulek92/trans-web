import * as React from 'react';

export default function TermsPage() {
  const terms = [
    { title: 'Postanowienia Ogólne', content: 'Niniejszy regulamin określa zasady korzystania z platformy PaletBroker oraz zasady pośrednictwa w świadczeniu usług transportowych.' },
    { title: 'Składanie Zamówień', content: 'Użytkownik składa zamówienie poprzez wypełnienie formularza wyceny i opłacenie zlecenia. Broker przekazuje zlecenie do wybranego Przewoźnika.' },
    { title: 'Pakowanie i Przygotowanie', content: 'Zlecający jest zobowiązany do prawidłowego przygotowania przesyłki zgodnie z instrukcjami dostępnymi na stronie "Typy palet".' },
    { title: 'Reklamacje', content: 'Reklamacje dotyczące uszkodzeń towaru należy zgłaszać w ciągu 24h od doręczenia przesyłki wraz z protokołem szkody.' }
  ];

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[800px] mx-auto px-8">
        <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-12">Regulamin Świadczenia Usług</h1>
        
        <div className="space-y-10">
          {terms.map((t, i) => (
            <section key={i} className="border-b border-[var(--color-divider)] pb-8 last:border-0">
              <h2 className="text-xl font-bold text-[var(--color-on-background)] mb-4">{i + 1}. {t.title}</h2>
              <p className="text-[var(--color-on-surface-variant)] leading-relaxed text-sm">
                {t.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
