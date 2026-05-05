'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  return (
    <React.Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-10 sm:px-6 sm:py-12">Ladowanie...</main>}>
      <LoginContent />
    </React.Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.accessToken) {
        setError(payload?.message || 'Niepoprawne dane logowania.');
        return;
      }

      document.cookie = `pb_auth_token=${payload.accessToken}; Path=/; Max-Age=${payload.expiresIn || 43200}; SameSite=Lax`;
      if (payload.refreshToken) {
        document.cookie = `pb_refresh_token=${payload.refreshToken}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      }
      document.cookie = `pb_user_role=${payload.user?.role || 'customer'}; Path=/; Max-Age=${payload.expiresIn || 43200}; SameSite=Lax`;

      const nextPath = searchParams.get('next');
      if (payload.user?.role === 'admin') {
        router.push(nextPath || '/admin');
      } else {
        router.push('/konto');
      }
    } catch {
      setError('Nie udalo sie polaczyc z serwerem logowania.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-10 sm:px-6 sm:py-12">
      <div className="w-full max-w-[32rem] animate-fade-in">
        <div className="mb-8 text-center sm:mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-premium">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary-highlight)]">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-on-background)]">PaletBroker</span>
          </Link>
          <h1 className="mb-2 text-3xl font-display-bold font-bold text-[var(--color-on-background)]">Witaj ponownie</h1>
          <p className="text-[var(--color-on-surface-variant)]">Zaloguj się do swojego centrum logistycznego.</p>
          {searchParams.get('forbidden') === '1' && (
            <p className="mt-3 text-xs font-bold text-[var(--color-error)]">Brak uprawnien do panelu administratora.</p>
          )}
          {searchParams.get('expired') === '1' && (
            <p className="mt-3 text-xs font-bold text-[var(--color-error)]">Sesja wygasla. Zaloguj sie ponownie.</p>
          )}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[var(--color-divider)] bg-white p-6 shadow-2xl sm:rounded-[32px] sm:p-10">
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[var(--color-primary-highlight)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
              <p className="mt-4 font-bold text-sm text-[var(--color-primary)]">Autoryzacja...</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Konto firmowe (E-mail)</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[var(--color-primary)] transition-colors">mail</span>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium" 
                  placeholder="np. jan.kowalski@firma.pl" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hasło dostępu</label>
                <Link href="#" className="text-[10px] font-bold text-[var(--color-primary)] hover:underline uppercase tracking-wider">Nie pamiętasz?</Link>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[var(--color-primary)] transition-colors">lock</span>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-medium" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-primary)] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[var(--color-primary-highlight)] hover:bg-[var(--color-surface-tint)] transition-premium active:scale-[0.98] disabled:opacity-50"
            >
              Zaloguj się
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Nowy w PaletBroker?{' '}
              <Link href="/rejestracja" className="text-[var(--color-primary)] font-bold hover:underline">Utwórz konto firmowe</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-6 opacity-40 grayscale transition-all sm:mt-12 sm:gap-8">
          <Image src="/payment/paypal.svg" alt="PayPal" className="h-4 w-auto" width={70} height={16} priority unoptimized />
          <Image src="/payment/visa.svg" alt="Visa" className="h-4 w-auto" width={56} height={16} priority unoptimized />
          <Image src="/payment/mastercard.svg" alt="Mastercard" className="h-6 w-auto" width={64} height={24} priority unoptimized />
        </div>
      </div>
    </main>
  );
}
