'use client';

import * as React from 'react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] p-6 animate-fade-in">
      <div className="max-w-[1280px] mx-auto bg-white/90 backdrop-blur-xl border border-[var(--color-divider)] p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">cookie</span>
          </div>
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            Stosujemy pliki cookies w celu zapewnienia prawidłowego funkcjonowania serwisu oraz w celach analitycznych. 
            Możesz zaakceptować wszystkie lub zarządzać ustawieniami. 
            <a href="/polityka-prywatnosci" className="text-[var(--color-primary)] font-bold ml-1 hover:underline">Polityka Prywatności</a>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={() => setIsVisible(false)}
            className="px-6 py-3 rounded-xl border border-[var(--color-divider)] text-sm font-bold hover:bg-slate-50 transition-premium"
          >
            Ustawienia
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="px-8 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-black transition-premium shadow-lg active:scale-95"
          >
            Akceptuję wszystkie
          </button>
        </div>
      </div>
    </div>
  );
}
