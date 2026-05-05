'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  senderAddress?: { name?: string; companyName?: string };
  recipientAddress?: { city?: string };
  carrierCode: string;
  status: string;
  priceBrutto: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = React.useState('wszystkie');
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  React.useEffect(() => {
    const fetchOrders = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const response = await fetch(`${API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        // Mock data for demo if API fails
        setOrders([
          { 
            id: '1', 
            orderNumber: 'OR-9871', 
            createdAt: new Date().toISOString(), 
            senderAddress: { name: 'Logistyk Sp. z o.o.' },
            recipientAddress: { city: 'Kraków' },
            carrierCode: 'DHL', 
            status: 'Doręczone', 
            priceBrutto: '185.00' 
          },
          { 
            id: '2', 
            orderNumber: 'OR-1022', 
            createdAt: new Date().toISOString(), 
            senderAddress: { name: 'Tech Solutions' },
            recipientAddress: { city: 'Warszawa' },
            carrierCode: 'DPD', 
            status: 'OCZEKIWANIE', 
            priceBrutto: '215.50' 
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOrders();
  }, [API_URL]);

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': case 'DORĘCZONE': return 'bg-emerald-100 text-emerald-800';
      case 'PENDING': case 'OCZEKIWANIE': return 'bg-amber-100 text-amber-800';
      case 'ERROR': case 'BŁĄD': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.senderAddress?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.senderAddress?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'wszystkie') return matchesSearch;
    if (activeTab === 'nowe') return matchesSearch && (order.status.toUpperCase() === 'PENDING' || order.status.toUpperCase() === 'OCZEKIWANIE');
    if (activeTab === 'zakonczone') return matchesSearch && (order.status.toUpperCase() === 'DELIVERED' || order.status.toUpperCase() === 'DORĘCZONE');
    if (activeTab === 'problemy') return matchesSearch && (order.status.toUpperCase() === 'ERROR' || order.status.toUpperCase() === 'BŁĄD');
    
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in space-y-8">
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display-bold text-3xl font-bold text-[var(--color-on-background)] mb-2">Zarządzanie Zamówieniami</h1>
          <p className="text-[var(--color-on-surface-variant)]">Podgląd i edycja wszystkich zleceń transportowych w systemie.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-[var(--color-primary)]">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-[var(--color-divider)] rounded-xl text-xs font-bold outline-none focus:border-[var(--color-primary)] transition-premium" 
              placeholder="Szukaj ID lub klienta..." 
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[var(--color-divider)] pb-px">
        {['wszystkie', 'nowe', 'zakonczone', 'problemy'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeTab === tab ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-[var(--color-divider)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-slate-400 font-bold">Ładowanie zamówień...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <th className="px-8 py-5">Data / ID</th>
                  <th className="px-8 py-5">Klient / Firma</th>
                  <th className="px-8 py-5">Przewoźnik</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Kwota (Brutto)</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-divider)]">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="text-xs text-slate-400 mb-1">{new Date(o.createdAt).toLocaleDateString('pl-PL')}</div>
                      <div className="font-bold text-sm text-[var(--color-primary)] group-hover:underline">{o.orderNumber}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-[var(--color-on-background)]">{o.senderAddress?.name || o.senderAddress?.companyName || 'Brak danych'}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{o.carrierCode}</div>
                        <span className="text-sm font-medium text-slate-600">{o.carrierCode}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full ${getStatusStyle(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-sm">
                      {o.priceBrutto} PLN
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="material-symbols-outlined text-slate-300 hover:text-[var(--color-primary)] transition-colors">more_vert</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-bold">Brak zamówień spełniających kryteria.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
