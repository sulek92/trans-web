'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  Mail, 
  Globe, 
  MapPin, 
  CreditCard,
  Save,
  Loader2
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface CompanyData {
  id: string;
  name: string;
  nip: string;
  vatEu?: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
  creditLimit: string;
}

export default function SettingsPage() {
  const [user, setUser] = React.useState<UserData | null>(null);
  const [company, setCompany] = React.useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const { addToast } = useToastStore();

  const fetchProfile = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const [userRes, companyRes] = await Promise.all([
        fetch(`${getApiBaseUrl()}/users/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${getApiBaseUrl()}/users/me/company`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (userRes.ok) setUser(await userRes.json());
      if (companyRes.ok) setCompany(await companyRes.json());
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać danych profilu.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  React.useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const handleCompanySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setIsSaving(true);
    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${getApiBaseUrl()}/users/me/company`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(company)
      });

      if (res.ok) {
        addToast({ title: 'Sukces', description: 'Dane firmy zostały zaktualizowane.', type: 'success' });
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się zapisać zmian.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-24 max-w-[1280px] mx-auto px-8 space-y-12">
        <Skeleton className="h-12 w-1/4 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <Skeleton className="lg:col-span-4 h-96 rounded-[40px]" />
           <Skeleton className="lg:col-span-8 h-[600px] rounded-[40px]" />
        </div>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="mb-12 animate-fade-in">
          <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Panel Klienta</span>
          <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-2 tracking-tight">Ustawienia Profilu</h1>
          <p className="text-[var(--color-on-surface-variant)] text-lg">Zarządzaj swoimi danymi osobowymi i firmowymi.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* User Info Card */}
          <div className="lg:col-span-4 space-y-8 animate-fade-in delay-100">
            <div className="bg-white rounded-[40px] border border-[var(--color-divider)] p-10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-10 group-hover:bg-[var(--color-primary-highlight)] transition-colors opacity-50" />
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 rounded-3xl bg-[var(--color-primary)] text-white flex items-center justify-center mb-6 shadow-xl shadow-[var(--color-primary)]/20 text-3xl font-bold">
                  {user?.email.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{user?.email.split('@')[0]}</h3>
                <p className="text-sm text-slate-400 font-medium">{user?.email}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <ShieldCheck className="h-4 w-4" /> Status konta
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${user?.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {user?.isVerified ? 'Zweryfikowany' : 'W trakcie weryfikacji'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <User className="h-4 w-4" /> Rola
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{user?.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <CreditCard className="h-4 w-4" /> Limit B2B
                  </div>
                  <span className="text-sm font-bold text-slate-900">{company?.creditLimit || '0.00'} PLN</span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-[10px] text-slate-400 font-medium leading-relaxed">
                Członek od: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }) : '---'}
              </div>
            </div>
          </div>

          {/* Company Settings Form */}
          <div className="lg:col-span-8 animate-fade-in delay-200">
            <div className="bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden">
               <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Dane Firmowe</h2>
                      <p className="text-sm text-slate-400 font-medium">Uzupełnij dane do faktur i zamówień B2B.</p>
                    </div>
                  </div>
               </div>

               <form onSubmit={handleCompanySave} className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Nazwa Firmy</label>
                      <input 
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                        value={company?.name || ''}
                        onChange={e => company && setCompany({...company, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">NIP</label>
                      <input 
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                        value={company?.nip || ''}
                        onChange={e => company && setCompany({...company, nip: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Ulica i numer</label>
                      <input 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                        value={company?.addressLine || ''}
                        onChange={e => company && setCompany({...company, addressLine: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Kod pocztowy</label>
                      <input 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                        value={company?.postalCode || ''}
                        onChange={e => company && setCompany({...company, postalCode: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Miasto</label>
                      <input 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                        value={company?.city || ''}
                        onChange={e => company && setCompany({...company, city: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Kraj</label>
                      <select 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner appearance-none"
                        value={company?.country || 'PL'}
                        onChange={e => company && setCompany({...company, country: e.target.value})}
                      >
                        <option value="PL">Polska</option>
                        <option value="DE">Niemcy</option>
                        <option value="CZ">Czechy</option>
                        <option value="SK">Słowacja</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-50 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSaving || !company}
                      className="px-12 py-5 rounded-2xl bg-[var(--color-primary)] text-white font-bold shadow-xl shadow-[var(--color-primary)]/20 hover:bg-[var(--color-surface-tint)] transition-premium disabled:opacity-50 active:scale-95 flex items-center gap-3"
                    >
                      {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                      {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                    </button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
