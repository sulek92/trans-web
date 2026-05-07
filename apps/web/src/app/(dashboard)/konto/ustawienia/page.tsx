'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api-url';
import { useToastStore } from '@/lib/store/toast-store';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { addToast } = useToastStore();

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/users/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          setProfile(await res.json());
        }
      } catch {
        addToast({ title: 'Błąd', description: 'Nie udało się pobrać danych.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    void fetchProfile();
  }, [addToast]);

  if (isLoading) {
    return (
      <main className="pb-24">
        <div className="bg-white rounded-[40px] p-20 text-center text-slate-300">Ładowanie...</div>
      </main>
    );
  }

  const displayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ''}`
    : profile?.email?.split('@')[0] || 'Użytkownik';

  return (
    <main className="pb-24">
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Panel Klienta</span>
          <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-2 tracking-tight">Ustawienia konta</h1>
          <p className="text-[var(--color-on-surface-variant)] text-lg">Zarządzaj danymi swojego konta PaletBroker.</p>
        </div>

        <div className="bg-white rounded-[40px] border border-[var(--color-divider)] p-10 shadow-sm">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-50">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary-highlight)] flex items-center justify-center text-[var(--color-primary)] font-bold text-2xl">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{displayName}</h3>
              <p className="text-slate-400 font-medium">{profile?.email}</p>
              <span className={`inline-block mt-2 text-[10px] font-bold px-3 py-1 rounded-full ${
                profile?.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {profile?.role === 'admin' ? 'Administrator' : 'Klient'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Adres e-mail</div>
              <div className="font-bold text-slate-900">{profile?.email}</div>
            </div>
            {profile?.firstName && (
              <div className="p-6 rounded-2xl bg-slate-50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Imię i nazwisko</div>
                <div className="font-bold text-slate-900">{profile.firstName} {profile.lastName || ''}</div>
              </div>
            )}
            <div className="p-6 rounded-2xl bg-slate-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Typ konta</div>
              <div className="font-bold text-slate-900">{profile?.role === 'admin' ? 'Administrator' : 'Klient'}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
