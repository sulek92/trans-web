'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';

interface SavedAddress {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
}

interface AddressBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: SavedAddress) => void;
}

export function AddressBookModal({ isOpen, onClose, onSelect }: AddressBookModalProps) {
  const [addresses, setAddresses] = React.useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const API_URL = getApiBaseUrl();

  React.useEffect(() => {
    if (!isOpen) return;
    
    const fetchAddresses = async () => {
      const token = getCookie('pb_auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/users/addresses`, {
          headers: { 'Authorization': `Bearer ${token}` }
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
  }, [isOpen, API_URL]);

  // ESC to close
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-[var(--color-surface-primary)] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-[var(--color-divider)] flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-primary)]">menu_book</span>
            Twoja książka adresowa
          </h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => onSelect(addr)}
                  className="text-left p-6 rounded-3xl border border-[var(--color-divider)] hover:border-[var(--color-primary)] hover:bg-blue-50/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] bg-blue-50 px-2 py-1 rounded">
                      {addr.label || 'Adres'}
                    </span>
                    <span className="material-symbols-outlined text-[var(--color-text-faint)] group-hover:text-[var(--color-primary)]">chevron_right</span>
                  </div>
                  <div className="font-bold text-[var(--color-on-background)]">{addr.name}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{addr.street}, {addr.postalCode} {addr.city}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-[var(--color-text-faint)] mb-4 block">contact_page</span>
              <p className="text-[var(--color-text-faint)] font-medium">Nie masz jeszcze zapisanych adresów.</p>
              <p className="text-xs text-[var(--color-text-faint)] mt-1">Zapisz adresy w panelu klienta, aby korzystać z nich szybciej.</p>
            </div>
          )}
        </div>
        
        <div className="p-8 bg-[var(--color-surface-container)] border-t border-[var(--color-divider)] text-center">
          <p className="text-xs text-[var(--color-text-faint)]">Wybierz adres z listy, aby automatycznie uzupełnić formularz.</p>
        </div>
      </div>
    </div>
  );
}
