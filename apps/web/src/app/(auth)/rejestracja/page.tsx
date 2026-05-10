'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-url';

type AccountType = 'company' | 'individual';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [accountType, setAccountType] = React.useState<AccountType>('company');

  const [companyName, setCompanyName] = React.useState('');
  const [nip, setNip] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne.');
      return;
    }

    if (password.length < 8) {
      setError('Hasło musi mieć co najmniej 8 znaków.');
      return;
    }

    setIsLoading(true);

    try {
      const body: Record<string, string> = {
        email,
        password,
        accountType,
      };

      if (accountType === 'company') {
        body.companyName = companyName;
        body.nip = nip;
      } else {
        body.firstName = firstName;
        body.lastName = lastName;
      }

      const response = await fetch(`${getApiBaseUrl()}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.message || 'Wystąpił błąd podczas rejestracji.');
        return;
      }

      router.push('/logowanie?registered=1');
    } catch {
      setError('Nie udało się połączyć z serwerem. Spróbuj ponownie później.');
    } finally {
      setIsLoading(false);
    }
  };

  const isCompany = accountType === 'company';

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] py-24 px-8 transition-colors duration-500">
      <div className="w-full max-w-3xl animate-fade-in">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-premium">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[var(--color-on-background)]">PaletBroker</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-on-background)] mb-4 text-balance">
            {isCompany ? 'Dołącz do liderów logistyki' : 'Załóż darmowe konto'}
          </h1>
          <p className="text-[var(--color-text-muted)] text-xl max-w-2xl mx-auto">
            {isCompany ? 'Załóż darmowe konto firmowe i zacznij oszczędzać na transporcie.' : 'Zarejestruj się jako klient indywidualny i zarządzaj swoimi przesyłkami.'}
          </p>
        </div>

        <div className="bg-[var(--color-surface-primary)] p-8 sm:p-14 rounded-[60px] shadow-[var(--shadow-premium)] border border-[var(--color-divider)] relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-[var(--color-surface-primary)]/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
              <p className="mt-4 font-bold text-sm text-[var(--color-primary)] uppercase tracking-widest">
                {isCompany ? 'Tworzenie konta firmowego...' : 'Tworzenie konta...'}
              </p>
            </div>
          )}

          {/* Account type toggle */}
          <div className="flex rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] p-1.5 mb-10 shadow-inner">
            <button
              type="button"
              onClick={() => setAccountType('company')}
              className={`flex-1 py-4 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 ${
                isCompany
                  ? 'bg-[var(--color-surface-primary)] text-[var(--color-on-background)] shadow-lg'
                  : 'text-[var(--color-text-faint)] hover:text-[var(--color-on-background)]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">corporate_fare</span>
              Firma / B2B
            </button>
            <button
              type="button"
              onClick={() => setAccountType('individual')}
              className={`flex-1 py-4 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 ${
                !isCompany
                  ? 'bg-[var(--color-surface-primary)] text-[var(--color-on-background)] shadow-lg'
                  : 'text-[var(--color-text-faint)] hover:text-[var(--color-on-background)]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">person</span>
              Klient Prywatny
            </button>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isCompany ? (
              <>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Pełna Nazwa Firmy</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">corporate_fare</span>
                    <input
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                      placeholder="Np. Global Trans Sp. z o.o."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Numer NIP</label>
                  <input
                    required
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                    placeholder="1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">E-mail służbowy</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                    placeholder="biuro@firma.pl"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Imię</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">person</span>
                    <input
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                      placeholder="Jan"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Nazwisko</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">person</span>
                    <input
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                      placeholder="Kowalski"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Adres e-mail</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">mail</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                      placeholder="jan.kowalski@email.com"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Hasło</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-2">Powtórz hasło</label>
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl bg-[var(--color-surface-container)]/50 border border-[var(--color-divider)] focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-premium font-bold text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] shadow-inner"
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            {error && (
              <div className="md:col-span-2 rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/5 px-6 py-4 text-sm font-bold text-[var(--color-error)]">
                {error}
              </div>
            )}

            <div className="md:col-span-2 pt-4">
              <label className="flex gap-4 cursor-pointer group items-start">
                <input required type="checkbox" className="w-5 h-5 rounded-lg border-[var(--color-divider)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20 mt-1 bg-[var(--color-surface-container)]" />
                <span className="text-xs text-[var(--color-text-muted)] leading-relaxed font-medium">
                  Akceptuję <Link href="/regulamin" className="text-[var(--color-primary)] font-bold hover:underline">Regulamin</Link> oraz <Link href="/polityka-prywatnosci" className="text-[var(--color-primary)] font-bold hover:underline">Politykę Prywatności</Link> platformy PaletBroker. Wyrażam zgodę na przetwarzanie danych w celach logistycznych.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 bg-[var(--color-on-background)] text-[var(--color-background)] py-5 rounded-2xl font-bold text-lg shadow-2xl hover:bg-[var(--color-primary)] hover:text-white transition-premium active:scale-[0.98] mt-4 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isCompany ? 'Zarejestruj konto B2B' : 'Zarejestruj konto'}
              <span className="material-symbols-outlined text-xl">person_add</span>
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-[var(--color-divider)] text-center">
            <p className="text-sm text-[var(--color-text-muted)] font-medium">
              Masz już konto w naszym systemie?{' '}
              <Link href="/logowanie" className="text-[var(--color-primary)] font-bold hover:underline">Zaloguj się</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
