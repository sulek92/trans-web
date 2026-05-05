'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  priceBrutto: string;
  recipientAddress?: { name?: string; city?: string };
}

export default function ClientOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  React.useEffect(() => {
    const fetchOrders = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const response = await fetch(`${API_URL}/orders/my`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
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

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2">Moje zamówienia</h1>
        <p className="text-[var(--color-on-surface-variant)]">Historia i status wszystkich Twoich zleceń transportowych.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-slate-400 font-bold italic">Ładowanie historii...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                  <th className="px-8 py-6">Data / Numer</th>
                  <th className="px-8 py-6">Odbiorca</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Kwota Brutto</th>
                  <th className="px-8 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-divider)]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="text-xs text-slate-400 mb-1">{new Date(order.createdAt).toLocaleDateString('pl-PL')}</div>
                      <div className="font-bold text-sm text-[var(--color-primary)] group-hover:underline">{order.orderNumber}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-[var(--color-on-background)]">{order.recipientAddress?.name || '---'}</div>
                      <div className="text-xs text-slate-400">{order.recipientAddress?.city}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-sm">
                      {order.priceBrutto} PLN
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="material-symbols-outlined text-slate-300 hover:text-[var(--color-primary)] transition-colors">description</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center text-slate-300 font-bold">
            <span className="material-symbols-outlined text-6xl mb-4 block opacity-20">history</span>
            Nie złożyłeś jeszcze żadnego zamówienia.
          </div>
        )}
      </div>
    </div>
  );
}
