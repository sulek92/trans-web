'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';

type Profile = {
  id: string;
  email: string;
  role: string;
};

export default function ClientSettingsPage() {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [passwords, setPasswords] = React.useState({ old: '', new: '', confirm: '' });
  const [isSaving, setIsSaving] = React.useState(false);
  const addToast = useToastStore(state => state.addToast);

  const API_URL = getApiBaseUrl();

  const fetchProfile = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = (await response.json()) as Profile;
        setProfile(data);
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać profilu.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, addToast]);

  React.useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      addToast({ title: 'Błąd', description: 'Hasła nie są identyczne', type: 'error' });
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ oldPassword: passwords.old, newPassword: passwords.new }),
      });
      if (res.ok) {
        addToast({ title: 'Sukces', description: 'Hasło zostało zmienione.', type: 'success' });
        setIsChangingPassword(false);
        setPasswords({ old: '', new: '', confirm: '' });
      } else {
        const error = await res.json();
        addToast({ title: 'Błąd', description: error.message || 'Niepoprawne obecne hasło.', type: 'error' });
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Wystąpił problem z połączeniem.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2 tracking-tight">Ustawienia profilu</h1>
        <p className="text-[var(--color-text-muted)] font-medium">Zarządzaj swoimi danymi osobowymi i preferencjami konta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <div className="bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)] p-10 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 tracking-tight">
              <span className="material-symbols-outlined text-[var(--color-primary)]">person</span>
              Informacje osobiste
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-[0.2em] px-1">Email</label>
                {isLoading ? (
                  <Skeleton className="h-14 w-full rounded-2xl" />
                ) : (
                  <div className="w-full bg-[var(--color-surface-container)] border border-transparent rounded-2xl px-5 py-4 font-medium text-[var(--color-text-muted)] shadow-inner">
                    {profile?.email || '---'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-[0.2em] px-1">Rola</label>
                {isLoading ? (
                  <Skeleton className="h-14 w-full rounded-2xl" />
                ) : (
                  <div className="w-full bg-[var(--color-surface-container)] border border-transparent rounded-2xl px-5 py-4 font-medium text-[var(--color-text-muted)] uppercase shadow-inner">
                    {profile?.role || '---'}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-[var(--color-divider)] flex justify-end">
              <button disabled className="bg-[var(--color-surface-container)] text-[var(--color-text-faint)] px-8 py-4 rounded-2xl font-bold cursor-not-allowed border border-[var(--color-divider)]">
                Profil zweryfikowany
              </button>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)] p-10 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 tracking-tight">
              <span className="material-symbols-outlined text-[var(--color-primary)]">lock</span>
              Bezpieczeństwo
            </h2>
            
            <div className="space-y-6">
              {!isChangingPassword ? (
                <div className="flex justify-between items-center p-6 bg-[var(--color-surface-container)] rounded-2xl border border-[var(--color-divider)]">
                  <div>
                    <div className="font-bold text-sm text-[var(--color-on-background)] tracking-tight">Hasło</div>
                    <div className="text-[10px] text-[var(--color-text-faint)] font-bold uppercase tracking-widest mt-1">Ostatnia zmiana: Nieznana</div>
                  </div>
                  <button onClick={() => setIsChangingPassword(true)} className="bg-[var(--color-surface-primary)] border border-[var(--color-divider)] px-6 py-3 rounded-xl text-xs font-bold hover:bg-[var(--color-surface-container)] transition-premium shadow-sm">
                    Zmień hasło
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-6 bg-[var(--color-surface-container)] p-8 rounded-3xl animate-in slide-in-from-top-2 border border-[var(--color-divider)]">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-[var(--color-text-faint)] tracking-[0.2em] px-1">Obecne hasło</label>
                    <input required type="password" value={passwords.old} onChange={e => setPasswords({...passwords, old: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-[var(--color-divider)] outline-none focus:border-[var(--color-primary)] bg-[var(--color-surface-primary)] transition-premium" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-[var(--color-text-faint)] tracking-[0.2em] px-1">Nowe hasło</label>
                      <input required type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-[var(--color-divider)] outline-none focus:border-[var(--color-primary)] bg-[var(--color-surface-primary)] transition-premium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-[var(--color-text-faint)] tracking-[0.2em] px-1">Powtórz nowe hasło</label>
                      <input required type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-[var(--color-divider)] outline-none focus:border-[var(--color-primary)] bg-[var(--color-surface-primary)] transition-premium" />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsChangingPassword(false)} className="flex-1 px-4 py-4 rounded-2xl font-bold text-[var(--color-text-muted)] text-sm hover:bg-[var(--color-surface-primary)] transition-premium">Anuluj</button>
                    <button type="submit" disabled={isSaving} className="flex-1 px-4 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-sm hover:brightness-110 transition-premium disabled:opacity-50 shadow-lg shadow-[var(--color-primary)]/20 active:scale-95">
                      {isSaving ? 'Zapisywanie...' : 'Zaktualizuj hasło'}
                    </button>
                  </div>
                </form>
              )}
              
              <div className="flex justify-between items-center p-6 bg-[var(--color-surface-container)] rounded-2xl border border-[var(--color-divider)] opacity-60">
                <div>
                  <div className="font-bold text-sm text-[var(--color-on-background)] tracking-tight">Logowanie dwuskładnikowe (2FA)</div>
                  <div className="text-[10px] text-[var(--color-text-faint)] font-bold uppercase tracking-widest mt-1">Wkrótce dostępne</div>
                </div>
                <div className="w-12 h-6 bg-[var(--color-divider)] rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-[var(--color-text-faint)] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[var(--color-primary)] rounded-[40px] p-8 text-white shadow-xl shadow-[var(--color-primary)]/20 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl">account_circle</span>
              </div>
              <div className="text-2xl font-bold mb-2 tracking-tight">Witaj, {profile?.email?.split('@')[0]}!</div>
              <div className="text-white/70 text-sm mb-6 leading-relaxed">Pamiętaj o regularnej zmianie hasła dla zachowania bezpieczeństwa Twoich danych i zamówień.</div>
              <button onClick={() => {
                document.cookie = 'pb_auth_token=; path=/; max-age=0; SameSite=Lax';
                document.cookie = 'pb_refresh_token=; path=/; max-age=0; SameSite=Lax';
                document.cookie = 'pb_user_role=; path=/; max-age=0; SameSite=Lax';
                window.location.href = '/logowanie';
              }} className="w-full bg-white text-[var(--color-primary)] py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-premium shadow-lg active:scale-95">Wyloguj ze wszystkich urządzeń</button>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
