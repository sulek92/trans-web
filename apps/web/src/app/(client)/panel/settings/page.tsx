'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';

type Profile = {
  email: string;
  role: string;
};

export default function ClientSettingsPage() {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  React.useEffect(() => {
    const fetchProfile = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = (await response.json()) as Profile;
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProfile();
  }, [API_URL]);

  return (
    <div className="animate-fade-in space-y-8">
      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
          Ładowanie profilu...
        </div>
      )}
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
                <input 
                  type="email" 
                  defaultValue={profile?.email} 
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Rola</label>
                <input 
                  type="text" 
                  defaultValue={profile?.role} 
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-medium focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  disabled
                />
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 flex justify-end">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                Zapisz zmiany
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
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div>
                  <div className="font-bold text-sm">Hasło</div>
                  <div className="text-xs text-slate-400 mt-1">Zmień hasło do swojego konta</div>
                </div>
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                  Zmień
                </button>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div>
                  <div className="font-bold text-sm">Uwierzytelnianie dwuskładnikowe</div>
                  <div className="text-xs text-slate-400 mt-1">Dodaj dodatkową warstwę ochrony</div>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
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
              <div className="text-blue-100 text-sm mb-6">Twój profil jest uzupełniony w 65%. Uzupełnij dane firmy, aby odblokować płatności odroczone.</div>
              <button className="w-full bg-white text-[var(--color-primary)] py-4 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">Uzupełnij profil</button>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
