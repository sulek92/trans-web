'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Building2, 
  Phone, 
  Mail,
  CheckCircle2,
  X
} from 'lucide-react';

interface Address {
  id: string;
  label?: string;
  name: string;
  companyName?: string;
  phone?: string;
  email?: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
  isDefaultSender: boolean;
  isDefaultRecipient: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentAddress, setCurrentAddress] = React.useState<Partial<Address> | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const { addToast } = useToastStore();

  const fetchAddresses = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${getApiBaseUrl()}/users/me/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAddresses(await res.json());
      }
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać adresów.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  React.useEffect(() => {
    void fetchAddresses();
  }, [fetchAddresses]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAddress) return;

    setIsSaving(true);
    const token = getCookie('pb_auth_token');
    const isNew = !currentAddress.id;
    const url = isNew 
      ? `${getApiBaseUrl()}/users/me/addresses` 
      : `${getApiBaseUrl()}/users/me/addresses/${currentAddress.id}`;
    
    try {
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentAddress)
      });

      if (res.ok) {
        addToast({ 
          title: isNew ? 'Dodano adres' : 'Zaktualizowano adres', 
          description: 'Twoja książka adresowa została zaktualizowana.', 
          type: 'success' 
        });
        setIsEditing(false);
        void fetchAddresses();
      } else {
        throw new Error('Failed to save address');
      }
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się zapisać adresu.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten adres?')) return;

    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${getApiBaseUrl()}/users/me/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAddresses(prev => prev.filter(a => a.id !== id));
        addToast({ title: 'Usunięto', description: 'Adres został usunięty z książki.', type: 'success' });
      }
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się usunąć adresu.', type: 'error' });
    }
  };

  return (
    <main className="pb-24 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 animate-fade-in">
          <div>
            <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Panel Klienta</span>
            <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-2 tracking-tight">Książka Adresowa</h1>
            <p className="text-[var(--color-on-surface-variant)] text-lg">Zarządzaj swoimi punktami nadań i odbiorów.</p>
          </div>
          <button 
            onClick={() => {
              setCurrentAddress({ country: 'Polska', isDefaultSender: false, isDefaultRecipient: false });
              setIsEditing(true);
            }}
            className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[var(--color-surface-tint)] transition-premium shadow-lg shadow-[var(--color-primary)]/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Dodaj nowy adres
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <Skeleton key={i} className="h-64 w-full rounded-[32px]" />)}
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-dashed border-slate-200 p-20 text-center animate-fade-in">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pusta książka adresowa</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Dodaj swoje najczęstsze punkty logistyczne, aby przyspieszyć proces nadawania przesyłek.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {addresses.map((addr) => (
              <div key={addr.id} className="group bg-white rounded-[40px] border border-[var(--color-divider)] p-8 shadow-sm hover:shadow-2xl transition-premium relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-10 group-hover:bg-[var(--color-primary-highlight)] transition-colors opacity-50" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest bg-[var(--color-primary-highlight)] px-3 py-1 rounded-full">
                    {addr.label || 'Adres'}
                  </div>
                  <div className="flex gap-2">
                    {addr.isDefaultSender && <span title="Domyślny nadawca"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></span>}
                    {addr.isDefaultRecipient && <span title="Domyślny odbiorca"><CheckCircle2 className="h-5 w-5 text-blue-500" /></span>}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[var(--color-primary)] transition-colors">{addr.name}</h3>
                
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 opacity-40" />
                    <div>
                      {addr.addressLine}<br />
                      {addr.postalCode} {addr.city}<br />
                      {addr.country}
                    </div>
                  </div>
                  
                  {addr.companyName && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Building2 className="h-4 w-4 shrink-0 opacity-40" />
                      {addr.companyName}
                    </div>
                  )}
                  
                  {addr.phone && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone className="h-4 w-4 shrink-0 opacity-40" />
                      {addr.phone}
                    </div>
                  )}
                  
                  {addr.email && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail className="h-4 w-4 shrink-0 opacity-40" />
                      {addr.email}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex gap-4">
                  <button 
                    onClick={() => {
                      setCurrentAddress(addr);
                      setIsEditing(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-2xl text-xs font-bold text-slate-600 hover:bg-[var(--color-primary-highlight)] hover:text-[var(--color-primary)] transition-premium"
                  >
                    <Edit2 className="h-3 w-3" /> Edytuj
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="w-12 flex items-center justify-center py-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-premium"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && currentAddress && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditing(false)}>
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{currentAddress.id ? 'Edytuj Adres' : 'Nowy Adres'}</h2>
                <p className="text-sm text-slate-400 font-medium">Uzupełnij dane teleadresowe punktu logistycznego.</p>
              </div>
              <button onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Etykieta (np. Magazyn)</label>
                  <input 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                    value={currentAddress.label || ''}
                    onChange={e => setCurrentAddress({...currentAddress, label: e.target.value})}
                    placeholder="np. Biuro Główne"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Nazwa / Imię i Nazwisko *</label>
                  <input 
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                    value={currentAddress.name || ''}
                    onChange={e => setCurrentAddress({...currentAddress, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Firma (opcjonalnie)</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                  value={currentAddress.companyName || ''}
                  onChange={e => setCurrentAddress({...currentAddress, companyName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Email kontaktowy</label>
                  <input 
                    type="email"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                    value={currentAddress.email || ''}
                    onChange={e => setCurrentAddress({...currentAddress, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Telefon</label>
                  <input 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                    value={currentAddress.phone || ''}
                    onChange={e => setCurrentAddress({...currentAddress, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Ulica i numer *</label>
                <input 
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                  value={currentAddress.addressLine || ''}
                  onChange={e => setCurrentAddress({...currentAddress, addressLine: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Kod pocztowy *</label>
                  <input 
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                    value={currentAddress.postalCode || ''}
                    onChange={e => setCurrentAddress({...currentAddress, postalCode: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Miasto *</label>
                  <input 
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                    value={currentAddress.city || ''}
                    onChange={e => setCurrentAddress({...currentAddress, city: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4">
                <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all group">
                  <input 
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    checked={currentAddress.isDefaultSender || false}
                    onChange={e => setCurrentAddress({...currentAddress, isDefaultSender: e.target.checked})}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Domyślny Nadawca</span>
                    <span className="text-[10px] text-slate-400">Podpowiadaj przy wysyłce</span>
                  </div>
                </label>
                <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all group">
                  <input 
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    checked={currentAddress.isDefaultRecipient || false}
                    onChange={e => setCurrentAddress({...currentAddress, isDefaultRecipient: e.target.checked})}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Domyślny Odbiorca</span>
                    <span className="text-[10px] text-slate-400">Podpowiadaj przy odbiorze</span>
                  </div>
                </label>
              </div>

              <div className="flex gap-6 pt-8 border-t border-slate-50">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-8 py-5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-premium"
                >
                  Anuluj
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] px-8 py-5 rounded-2xl bg-[var(--color-primary)] text-white font-bold shadow-xl shadow-[var(--color-primary)]/20 hover:bg-[var(--color-surface-tint)] transition-premium disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                >
                  {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {isSaving ? 'Zapisywanie...' : 'Zapisz adres'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
