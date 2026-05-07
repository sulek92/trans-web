'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-url';

export default function LoginPage() {
  return (
    <React.Suspense fallback={<main className="min-h-dvh flex items-center justify-center bg-[var(--color-background)] px-4 py-10 sm:px-6 sm:py-12">Ladowanie...</main>}>
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
      const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
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
      if (payload.user?.role === 'admin' || payload.user?.role === 'superadmin') {
        router.push(nextPath || '/admin');
      } else {
        router.push(nextPath || '/konto');
      }
    } catch {
      setError('Nie udalo sie polaczyc z serwerem logowania.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[var(--color-background)] px-3 py-6 sm:px-6 sm:py-10 lg:py-12 transition-colors duration-500">
      <div className="mx-auto w-full max-w-[36rem] animate-fade-in">
        <div className="mb-8 text-center sm:mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-premium">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-on-background)]">PaletBroker</span>
          </Link>
          <h1 className="mb-2 text-3xl font-display font-bold text-[var(--color-on-background)]">Witaj ponownie</h1>
          <p className="text-[var(--color-text-muted)]">Zaloguj się do swojego centrum logistycznego.</p>
          {searchParams.get('forbidden') === '1' && (
            <p className="mt-4 text-xs font-bold text-[var(--color-error)] uppercase tracking-widest bg-[var(--color-error)]/10 px-4 py-2 rounded-lg">Brak uprawnien do panelu administratora.</p>
          )}
          {searchParams.get('expired') === '1' && (
            <p className="mt-4 text-xs font-bold text-[var(--color-error)] uppercase tracking-widest bg-[var(--color-error)]/10 px-4 py-2 rounded-lg">Sesja wygasla. Zaloguj sie ponownie.</p>
          )}
          {searchParams.get('registered') === '1' && (
            <p className="mt-4 text-sm font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4">
              Konto zostało utworzone! Możesz się teraz zalogować.
            </p>
          )}
        </div>

        <div className="relative rounded-[40px] border border-[var(--color-divider)] bg-[var(--color-surface-primary)] p-6 shadow-[var(--shadow-premium)] sm:p-10 md:p-12 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-[var(--color-surface-primary)]/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
              <p className="mt-4 font-bold text-sm text-[var(--color-primary)] uppercase tracking-widest">Autoryzacja...</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Adres e-mail</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">mail</span>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner" 
                  placeholder="np. jan.kowalski@firma.pl" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">Hasło dostępu</label>
                <Link href="/reset-hasla" className="text-[10px] font-bold text-[var(--color-primary)] hover:underline uppercase tracking-widest">Nie pamiętasz?</Link>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">lock</span>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {error && (
              <p className="rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/5 px-6 py-4 text-sm font-bold text-[var(--color-error)]">{error}</p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-on-background)] text-[var(--color-background)] py-5 rounded-2xl font-bold text-lg shadow-2xl hover:bg-[var(--color-primary)] hover:text-white transition-premium active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              Zaloguj się
              <span className="material-symbols-outlined text-xl">login</span>
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-[var(--color-divider)] text-center">
            <p className="text-sm text-[var(--color-text-muted)] font-medium">
              Nowy w PaletBroker?{' '}
              <Link href="/rejestracja" className="text-[var(--color-primary)] font-bold hover:underline">Utwórz konto</Link>
            </p>
          </div>
        </div>
        
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all sm:mt-16 sm:gap-10">
          <Image src="/payment/paypal.svg" alt="PayPal" width={70} height={16} className="h-5 w-auto dark:invert" />
          <Image src="/payment/visa.svg" alt="Visa" width={56} height={16} className="h-5 w-auto dark:invert" />
          <Image src="/payment/mastercard.svg" alt="Mastercard" width={64} height={24} className="h-7 w-auto dark:invert" />
        </div>
      </div>
    </main>
  );
}
