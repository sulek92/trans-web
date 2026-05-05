'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  React.useEffect(() => {
    const fetchAddresses = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const response = await fetch(`${API_URL}/users/me/addresses`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAddresses();
  }, [API_URL]);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2">Książka adresowa</h1>
          <p className="text-[var(--color-on-surface-variant)]">Zarządzaj zapisanymi punktami odbioru i dostawy.</p>
        </div>
        <button className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          Dodaj adres
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full p-20 text-center text-slate-400 font-bold italic">Ładowanie adresów...</div>
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
                  <button className="p-2 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  );
}
