'use client';

import * as React from 'react';

export default function ContactPage() {
  const [isSending, setIsSending] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      alert('Wiadomość została wysłana! Skontaktujemy się z Tobą w ciągu 2 godzin.');
      setIsSending(false);
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left Column: Info */}
          <div className="animate-fade-in">
            <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-4 block">Kontakt</span>
            <h1 className="font-display-bold text-5xl font-bold text-[var(--color-on-background)] mb-6 leading-tight">
              Jesteśmy tu,<br/>
              <span className="text-[var(--color-primary)]">by Ci pomóc.</span>
            </h1>
            <p className="text-[var(--color-on-surface-variant)] text-xl leading-relaxed mb-12">
              Masz pytania dotyczące transportu lub potrzebujesz indywidualnej wyceny dla swojej firmy? Skontaktuj się z nami w najwygodniejszy dla Ciebie sposób.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm hover:shadow-md transition-premium">
                <span className="material-symbols-outlined text-[var(--color-primary)] mb-4 text-3xl">call</span>
                <div className="font-bold text-lg mb-1">Zadzwoń do nas</div>
                <div className="text-[var(--color-primary)] font-bold">+48 22 123 45 67</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] mt-2">Pon - Pt: 8:00 - 17:00</div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm hover:shadow-md transition-premium">
                <span className="material-symbols-outlined text-[var(--color-primary)] mb-4 text-3xl">mail</span>
                <div className="font-bold text-lg mb-1">Napisz e-mail</div>
                <div className="text-[var(--color-primary)] font-bold">kontakt@paletbroker.pl</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] mt-2">Odpowiemy w 2 godziny</div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-[var(--color-surface-container-low)] rounded-3xl border border-[var(--color-divider)]">
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-[var(--color-primary)] mt-1">location_on</span>
                <div>
                  <div className="font-bold text-lg">Siedziba firmy</div>
                  <p className="text-[var(--color-on-surface-variant)] mt-2">
                    PaletBroker Sp. z o.o.<br/>
                    ul. Logistyczna 12<br/>
                    00-001 Warszawa
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-[var(--color-divider)] animate-fade-in delay-200 relative overflow-hidden">
            {isSending && <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[2px] flex items-center justify-center animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-bold text-[var(--color-primary)]">Wysyłanie wiadomości...</span>
              </div>
            </div>}
            
            <h2 className="text-2xl font-bold mb-8">Wyślij szybką wiadomość</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Imię i Nazwisko</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium" placeholder="Jan Kowalski" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Firma (opcjonalnie)</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium" placeholder="Nazwa Twojej firmy" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">E-mail</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium" placeholder="twoj@email.pl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Wiadomość</label>
                <textarea required className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium min-h-[150px]" placeholder="W czym możemy pomóc?"></textarea>
              </div>
              <button 
                type="submit"
                disabled={isSending}
                className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[var(--color-surface-tint)] transition-premium active:scale-[0.98] disabled:opacity-50"
              >
                {isSending ? 'Trwa wysyłanie...' : 'Wyślij wiadomość'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

