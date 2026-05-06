'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToastStore } from '@/lib/store/toast-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type ApiResponse = {
  message?: string | string[];
  resetToken?: string;
};

function extractMessage(payload: ApiResponse, fallback: string): string {
  if (Array.isArray(payload.message)) {
    const first = payload.message.find((item) => typeof item === 'string');
    return typeof first === 'string' ? first : fallback;
  }
  return typeof payload.message === 'string' ? payload.message : fallback;
}

export default function PasswordResetPage() {
  return (
    <React.Suspense
      fallback={
        <main className="min-h-dvh flex items-center justify-center bg-[var(--color-background)] px-4 py-10 sm:px-6 sm:py-12">
          Ladowanie...
        </main>
      }
    >
      <PasswordResetContent />
    </React.Suspense>
  );
}

function PasswordResetContent() {
  const searchParams = useSearchParams();
  const queryToken = searchParams.get('token') || '';
  const addToast = useToastStore((state) => state.addToast);

  const [email, setEmail] = React.useState('');
  const [token, setToken] = React.useState(queryToken);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [requestMessage, setRequestMessage] = React.useState<string | null>(null);
  const [debugToken, setDebugToken] = React.useState<string | null>(null);

  const handleRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRequesting(true);
    setDebugToken(null);
    setRequestMessage(null);

    try {
      const response = await fetch(`${API_URL}/auth/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as ApiResponse;
      const message = extractMessage(
        payload,
        'Jesli konto istnieje, instrukcja resetu zostala wyslana.',
      );
      setRequestMessage(message);

      if (!response.ok) {
        throw new Error(message);
      }

      if (payload.resetToken) {
        setDebugToken(payload.resetToken);
        setToken(payload.resetToken);
      }

      addToast({
        title: 'Instrukcja wyslana',
        description: message,
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Blad',
        description: error instanceof Error ? error.message : 'Nie udalo sie wyslac instrukcji resetu.',
        type: 'error',
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      addToast({
        title: 'Haslo zbyt krotkie',
        description: 'Nowe haslo musi miec co najmniej 8 znakow.',
        type: 'error',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({
        title: 'Hasla sie roznia',
        description: 'Wpisz identyczne haslo w obu polach.',
        type: 'error',
      });
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch(`${API_URL}/auth/password-reset/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const payload = (await response.json()) as ApiResponse;
      const message = extractMessage(payload, 'Haslo zostalo zresetowane.');

      if (!response.ok) {
        throw new Error(message);
      }

      addToast({
        title: 'Haslo zmienione',
        description: message,
        type: 'success',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      addToast({
        title: 'Blad resetu',
        description: error instanceof Error ? error.message : 'Nie udalo sie ustawic nowego hasla.',
        type: 'error',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[var(--color-background)] px-3 py-6 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[64rem] animate-fade-in">
        <div className="mb-8 text-center sm:mb-10">
          <Link href="/logowanie" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-premium">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary-highlight)]">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-on-background)]">PaletBroker</span>
          </Link>
          <h1 className="mb-2 text-3xl font-display-bold font-bold text-[var(--color-on-background)]">Reset hasla</h1>
          <p className="text-[var(--color-on-surface-variant)]">
            Popros o token resetu i ustaw nowe haslo do konta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-2xl border border-[var(--color-divider)] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-8">
            <h2 className="text-lg font-bold text-[var(--color-on-background)] mb-2">1. Wyslij prosbe o reset</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
              Wpisz e-mail przypisany do konta. Jesli konto istnieje, otrzymasz instrukcje resetu.
            </p>

            <form onSubmit={handleRequest} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  E-mail
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium"
                  placeholder="np. jan.kowalski@firma.pl"
                />
              </div>

              <button
                type="submit"
                disabled={isRequesting}
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[var(--color-surface-tint)] transition-premium disabled:opacity-60"
              >
                {isRequesting ? 'Wysylanie...' : 'Wyslij instrukcje'}
              </button>
            </form>

            {requestMessage && (
              <p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {requestMessage}
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--color-divider)] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-8">
            <h2 className="text-lg font-bold text-[var(--color-on-background)] mb-2">2. Ustaw nowe haslo</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">
              Wklej token resetu i podaj nowe haslo.
            </p>

            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Token resetu
                </label>
                <textarea
                  required
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  className="w-full min-h-[90px] px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium font-data-mono text-xs"
                  placeholder="Wklej token otrzymany e-mailem"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Nowe haslo
                </label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium"
                  placeholder="Minimum 8 znakow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Potwierdz haslo
                </label>
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-divider)] focus:border-[var(--color-primary)] outline-none transition-premium"
                  placeholder="Powtorz nowe haslo"
                />
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-premium disabled:opacity-60"
              >
                {isResetting ? 'Zapisywanie...' : 'Zmien haslo'}
              </button>
            </form>

            {debugToken && (
              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-700 mb-2">
                  Token testowy (dev)
                </div>
                <code className="block break-all text-xs text-blue-900">{debugToken}</code>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
