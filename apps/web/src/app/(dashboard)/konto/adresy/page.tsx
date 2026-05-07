'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api-url';
import { useToastStore } from '@/lib/store/toast-store';

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
}

export default function AddressBookPage() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { addToast } = useToastStore();

  React.useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/users/me/addresses`, {
          credentials: 'include',
        });
        if (res.ok) {
          setAddresses(await res.json());
        }
      } catch {
        addToast({ title: 'Błąd', description: 'Nie udało się pobrać adresów.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    void fetchAddresses();
  }, [addToast]);

  return (
    <main className="pb-24">
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Panel Klienta</span>
          <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-2 tracking-tight">Książka adresowa</h1>
          <p className="text-[var(--color-on-surface-variant)] text-lg">Zarządzaj adresami nadawców i odbiorców.</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-[40px] p-20 text-center text-slate-300">Ładowanie...</div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-dashed border-slate-200 p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-slate-300">location_on</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Brak zapisanych adresów</h3>
            <p className="text-slate-500">Dodaj swój pierwszy adres, aby przyspieszyć nadawanie przesyłek.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                    {addr.label || 'Adres'}
                  </span>
                </div>
                <div className="font-bold text-slate-900 mb-1">{addr.name}</div>
                {addr.companyName && <div className="text-sm text-slate-500 mb-1">{addr.companyName}</div>}
                <div className="text-sm text-slate-500">{addr.addressLine}</div>
                <div className="text-sm text-slate-500">{addr.postalCode} {addr.city}, {addr.country}</div>
                {addr.phone && <div className="text-sm text-slate-400 mt-2">{addr.phone}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
