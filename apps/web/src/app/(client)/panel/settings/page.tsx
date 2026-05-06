'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchProfile = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
        <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2">Ustawienia profilu</h1>
        <p className="text-[var(--color-on-surface-variant)]">Zarządzaj swoimi danymi osobowymi i preferencjami konta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <div className="bg-white rounded-[40px] border border-[var(--color-divider)] p-10 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-[var(--color-primary)]">person</span>
              Informacje osobiste
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email</label>
                {isLoading ? (
                  <Skeleton className="h-14 w-full rounded-2xl" />
                ) : (
                  <div className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-500">
                    {profile?.email || '---'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Rola</label>
                {isLoading ? (
                  <Skeleton className="h-14 w-full rounded-2xl" />
                ) : (
                  <div className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium text-slate-500 uppercase">
                    {profile?.role || '---'}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 flex justify-end">
              <button disabled className="bg-slate-100 text-slate-400 px-8 py-4 rounded-2xl font-bold cursor-not-allowed">
                Profil zweryfikowany
              </button>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-[40px] border border-[var(--color-divider)] p-10 shadow-sm">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-[var(--color-primary)]">lock</span>
              Bezpieczeństwo
            </h2>
            
            <div className="space-y-6">
              {!isChangingPassword ? (
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <div className="font-bold text-sm">Hasło</div>
                    <div className="text-xs text-slate-400 mt-1">Ostatnia zmiana: Nieznana</div>
                  </div>
                  <button onClick={() => setIsChangingPassword(true)} className="bg-white border border-slate-200 px-6 py-3 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                    Zmień hasło
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4 bg-slate-50 p-6 rounded-2xl animate-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">Obecne hasło</label>
                    <input required type="password" value={passwords.old} onChange={e => setPasswords({...passwords, old: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-[var(--color-primary)] bg-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">Nowe hasło</label>
                      <input required type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-[var(--color-primary)] bg-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest px-1">Powtórz nowe hasło</label>
                      <input required type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:border-[var(--color-primary)] bg-white" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsChangingPassword(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 text-sm">Anuluj</button>
                    <button type="submit" disabled={isSaving} className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50">
                      {isSaving ? 'Zapisywanie...' : 'Zaktualizuj hasło'}
                    </button>
                  </div>
                </form>
              )}
              
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div>
                  <div className="font-bold text-sm">Logowanie dwuskładnikowe (2FA)</div>
                  <div className="text-xs text-slate-400 mt-1">Wkrótce dostępne</div>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-full relative opacity-50">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[var(--color-primary)] rounded-[40px] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl">account_circle</span>
              </div>
              <div className="text-2xl font-bold mb-2">Witaj, {profile?.email?.split('@')[0]}!</div>
              <div className="text-blue-100 text-sm mb-6">Pamiętaj o regularnej zmianie hasła dla zachowania bezpieczeństwa Twoich danych i zamówień.</div>
              <button className="w-full bg-white text-[var(--color-primary)] py-4 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">Wyloguj ze wszystkich urządzeń</button>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
