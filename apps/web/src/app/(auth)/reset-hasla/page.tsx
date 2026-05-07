'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToastStore } from '@/lib/store/toast-store';
import { getApiBaseUrl } from '@/lib/api-url';

const API_URL = getApiBaseUrl();

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
        title: 'Instrukcja wysłana',
        description: message,
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Błąd',
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
        title: 'Hasło zbyt krótkie',
        description: 'Nowe hasło musi mieć co najmniej 8 znaków.',
        type: 'error',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({
        title: 'Hasła się różnią',
        description: 'Wpisz identyczne hasło w obu polach.',
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
        title: 'Hasło zmienione',
        description: message,
        type: 'success',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      addToast({
        title: 'Błąd resetu',
        description: error instanceof Error ? error.message : 'Nie udało się ustawić nowego hasła.',
        type: 'error',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <main className="min-h-dvh bg-[var(--color-background)] px-3 py-6 sm:px-6 sm:py-10 lg:py-12 transition-colors duration-500">
      <div className="mx-auto w-full max-w-[64rem] animate-fade-in">
        <div className="mb-12 text-center sm:mb-16">
          <Link href="/logowanie" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-premium">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-on-background)]">PaletBroker</span>
          </Link>
          <h1 className="mb-4 text-4xl font-display font-bold text-[var(--color-on-background)]">Reset hasła</h1>
          <p className="text-[var(--color-text-muted)] text-xl max-w-2xl mx-auto">
            Poproś o token resetu i ustaw nowe hasło do konta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section className="rounded-[40px] border border-[var(--color-divider)] bg-[var(--color-surface-primary)] p-6 shadow-[var(--shadow-premium)] sm:p-10 relative overflow-hidden">
            <h2 className="text-2xl font-bold text-[var(--color-on-background)] mb-3 tracking-tight">1. Wyślij prośbę o reset</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-8 font-medium leading-relaxed">
              Wpisz e-mail przypisany do konta. Jeśli konto istnieje, otrzymasz instrukcje resetu.
            </p>

            <form onSubmit={handleRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">
                  E-mail
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                  placeholder="np. jan.kowalski@firma.pl"
                />
              </div>

              <button
                type="submit"
                disabled={isRequesting}
                className="w-full bg-[var(--color-on-background)] text-[var(--color-background)] py-4 rounded-2xl font-bold shadow-2xl hover:bg-[var(--color-primary)] hover:text-white transition-premium disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {isRequesting ? 'Wysyłanie...' : 'Wyślij instrukcje'}
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </form>

            {requestMessage && (
              <p className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4 text-sm font-bold text-emerald-500">
                {requestMessage}
              </p>
            )}
          </section>

          <section className="rounded-[40px] border border-[var(--color-divider)] bg-[var(--color-surface-primary)] p-6 shadow-[var(--shadow-premium)] sm:p-10 relative overflow-hidden">
            <h2 className="text-2xl font-bold text-[var(--color-on-background)] mb-3 tracking-tight">2. Ustaw nowe hasło</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-8 font-medium leading-relaxed">
              Wklej token resetu i podaj nowe hasło.
            </p>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">
                  Token resetu
                </label>
                <textarea
                  required
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  className="w-full min-h-[100px] px-6 py-4 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner text-xs font-mono resize-none"
                  placeholder="Wklej token otrzymany e-mailem"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">
                  Nowe hasło
                </label>
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                  placeholder="Minimum 8 znaków"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">
                  Potwierdź hasło
                </label>
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                  placeholder="Powtórz nowe hasło"
                />
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full bg-[var(--color-on-background)] text-[var(--color-background)] py-4 rounded-2xl font-bold shadow-2xl hover:bg-[var(--color-primary)] hover:text-white transition-premium disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {isResetting ? 'Zapisywanie...' : 'Zmień hasło'}
                <span className="material-symbols-outlined text-xl">lock_reset</span>
              </button>
            </form>

            {debugToken && (
              <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">
                  Token testowy (dev)
                </div>
                <code className="block break-all text-xs text-blue-500/80 font-mono">{debugToken}</code>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
