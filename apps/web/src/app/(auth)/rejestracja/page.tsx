'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/konto');
    }, 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] py-20 px-8">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-premium">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary-highlight)]">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-on-background)]">PaletBroker</span>
          </Link>
          <h1 className="text-4xl font-display-bold font-bold text-[var(--color-on-background)] mb-2 text-balance">Dołącz do liderów logistyki</h1>
          <p className="text-[var(--color-on-surface-variant)] text-lg">Załóż darmowe konto firmowe i zacznij oszczędzać na transporcie.</p>
        </div>

        <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-[var(--color-divider)] relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[var(--color-primary-highlight)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
              <p className="mt-4 font-bold text-sm text-[var(--color-primary)]">Tworzenie konta firmowego...</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nazwa Firmy</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[var(--color-primary)] transition-colors">corporate_fare</span>
                <input 
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium" 
                  placeholder="Np. Global Trans Sp. z o.o." 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Numer NIP</label>
              <input 
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium" 
                placeholder="1234567890" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail służbowy</label>
              <input 
                required
                type="email"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium" 
                placeholder="biuro@firma.pl" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hasło</label>
              <input 
                required
                type="password" 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium" 
                placeholder="••••••••" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Powtórz hasło</label>
              <input 
                required
                type="password" 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium" 
                placeholder="••••••••" 
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <label className="flex gap-4 cursor-pointer group">
                <input required type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-[var(--color-primary)] focus:ring-[var(--color-primary-highlight)] mt-1" />
                <span className="text-xs text-slate-500 leading-relaxed">
                  Akceptuję <Link href="/regulamin" className="text-[var(--color-primary)] font-bold hover:underline">Regulamin</Link> oraz <Link href="/polityka-prywatnosci" className="text-[var(--color-primary)] font-bold hover:underline">Politykę Prywatności</Link> platformy PaletBroker. Wyrażam zgodę na przetwarzanie danych firmy w celach logistycznych.
                </span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 bg-[var(--color-primary)] text-white py-5 rounded-2xl font-bold shadow-xl shadow-[var(--color-primary-highlight)] hover:bg-[var(--color-surface-tint)] transition-premium active:scale-[0.98] mt-4 disabled:opacity-50"
            >
              Zarejestruj konto B2B
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Masz już konto w naszym systemie?{' '}
              <Link href="/logowanie" className="text-[var(--color-primary)] font-bold hover:underline">Zaloguj się</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

