'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';

interface Address {
  id: string;
  label: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
  isDefaultSender: boolean;
  isDefaultRecipient: boolean;
}

export default function ClientAddressesPage() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Partial<Address> | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const addToast = useToastStore(state => state.addToast);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchAddresses = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/users/me/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać adresów.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, addToast]);

  React.useEffect(() => {
    void fetchAddresses();
  }, [fetchAddresses]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    setIsSaving(true);
    const token = getCookie('pb_auth_token');
    const method = editingAddress.id ? 'PUT' : 'POST';
    const url = editingAddress.id ? `${API_URL}/users/me/addresses/${editingAddress.id}` : `${API_URL}/users/me/addresses`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editingAddress),
      });
      if (res.ok) {
        await fetchAddresses();
        setIsModalOpen(false);
        setEditingAddress(null);
        addToast({ 
          title: 'Sukces', 
          description: editingAddress.id ? 'Adres został zaktualizowany.' : 'Nowy adres został dodany.', 
          type: 'success' 
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Nie udało się zapisać adresu.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten adres?')) return;
    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${API_URL}/users/me/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchAddresses();
        addToast({ title: 'Usunięto', description: 'Adres został usunięty z Twojej książki.', type: 'success' });
      } else {
        throw new Error('Failed to delete');
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Nie udało się usunąć adresu.', type: 'error' });
    }
  };

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2">Książka adresowa</h1>
          <p className="text-[var(--color-on-surface-variant)]">Zarządzaj zapisanymi punktami odbioru i dostawy.</p>
        </div>
        <button 
          onClick={() => { setEditingAddress({ country: 'PL', isDefaultSender: false, isDefaultRecipient: false }); setIsModalOpen(true); }}
          className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Dodaj adres
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </>
        ) : addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-3xl border border-[var(--color-divider)] p-6 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{address.label || 'Adres'}</div>
                  <div className="text-lg font-bold text-[var(--color-on-background)]">{address.name}</div>
                  {address.companyName && <div className="text-sm text-slate-500 font-medium">{address.companyName}</div>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingAddress(address); setIsModalOpen(true); }}
                    className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-300 text-lg">location_on</span>
                  {address.addressLine}, {address.postalCode} {address.city}
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-300 text-lg">call</span>
                  {address.phone}
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-300 text-lg">mail</span>
                  {address.email}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                {address.isDefaultSender && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-full">Domyślny nadawca</span>
                )}
                {address.isDefaultRecipient && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-full">Domyślny odbiorca</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-20 text-center text-slate-300 font-bold bg-white rounded-[40px] border border-[var(--color-divider)]">
            <span className="material-symbols-outlined text-6xl mb-4 block opacity-20">map</span>
            Nie masz jeszcze zapisanych żadnych adresów.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editingAddress?.id ? 'Edytuj adres' : 'Nowy adres'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Etykieta (np. Magazyn)</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] transition-colors" value={editingAddress?.label || ''} onChange={e => setEditingAddress({...editingAddress, label: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Imię i Nazwisko / Kontakt</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] transition-colors" value={editingAddress?.name || ''} onChange={e => setEditingAddress({...editingAddress, name: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Nazwa firmy (opcjonalnie)</label>
                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] transition-colors" value={editingAddress?.companyName || ''} onChange={e => setEditingAddress({...editingAddress, companyName: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Telefon</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] transition-colors" value={editingAddress?.phone || ''} onChange={e => setEditingAddress({...editingAddress, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">E-mail</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] transition-colors" value={editingAddress?.email || ''} onChange={e => setEditingAddress({...editingAddress, email: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Ulica i numer</label>
                <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] transition-colors" value={editingAddress?.addressLine || ''} onChange={e => setEditingAddress({...editingAddress, addressLine: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Kod pocztowy</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] transition-colors" value={editingAddress?.postalCode || ''} onChange={e => setEditingAddress({...editingAddress, postalCode: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Miasto</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] transition-colors" value={editingAddress?.city || ''} onChange={e => setEditingAddress({...editingAddress, city: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-1 col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Kraj</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] transition-colors bg-white" value={editingAddress?.country || 'PL'} onChange={e => setEditingAddress({...editingAddress, country: e.target.value})}>
                    <option value="PL">Polska</option>
                    <option value="DE">Niemcy</option>
                    <option value="CZ">Czechy</option>
                    <option value="SK">Słowacja</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" checked={editingAddress?.isDefaultSender || false} onChange={e => setEditingAddress({...editingAddress, isDefaultSender: e.target.checked})} />
                  <span className="text-sm font-medium text-slate-700">Ustaw jako domyślny nadawca</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" checked={editingAddress?.isDefaultRecipient || false} onChange={e => setEditingAddress({...editingAddress, isDefaultRecipient: e.target.checked})} />
                  <span className="text-sm font-medium text-slate-700">Ustaw jako domyślny odbiorca</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white py-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">Anuluj</button>
                <button type="submit" disabled={isSaving} className="flex-1 px-6 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-50">
                  {isSaving ? 'Zapisywanie...' : 'Zapisz adres'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
