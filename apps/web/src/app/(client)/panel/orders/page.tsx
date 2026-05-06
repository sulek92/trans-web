'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToastStore } from '@/lib/store/toast-store';

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
  const addToast = useToastStore(state => state.addToast);

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
        } else {
          addToast({ title: 'Błąd', description: 'Nie udało się pobrać historii zamówień.', type: 'error' });
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOrders();
  }, [API_URL, addToast]);

  const getStatusStyle = (status: string) => {
    const s = status.toUpperCase();
    if (['DORĘCZONE', 'DELIVERED', 'COMPLETED'].includes(s)) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (['ANULOWANE', 'CANCELLED', 'ERROR'].includes(s)) return 'bg-red-50 text-red-600 border-red-100';
    if (['W DRODZE', 'IN_TRANSIT', 'SHIPPED'].includes(s)) return 'bg-blue-50 text-blue-600 border-blue-100';
    return 'bg-amber-50 text-amber-600 border-amber-100';
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2">Moje zamówienia</h1>
        <p className="text-[var(--color-on-surface-variant)]">Historia i status wszystkich Twoich zleceń transportowych.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-8 items-center">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 flex-grow" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-20" />
              </div>
            ))}
          </div>
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
                      <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase">{new Date(order.createdAt).toLocaleDateString('pl-PL')}</div>
                      <div className="font-bold text-sm text-[var(--color-on-background)] group-hover:text-[var(--color-primary)] transition-colors">{order.orderNumber}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-[var(--color-on-background)]">{order.recipientAddress?.name || '---'}</div>
                      <div className="text-xs text-slate-400">{order.recipientAddress?.city}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-sm">
                      {order.priceBrutto} PLN
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const token = getCookie('pb_auth_token');
                            const res = await fetch(`${API_URL}/documents/label/${order.id}`, {
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (res.ok) {
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `etykieta-${order.orderNumber}.pdf`;
                              a.click();
                            }
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-50 transition-all material-symbols-outlined text-[20px]"
                          title="Pobierz etykietę"
                        >
                          label
                        </button>
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const token = getCookie('pb_auth_token');
                            const res = await fetch(`${API_URL}/documents/invoice/${order.id}`, {
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (res.ok) {
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `faktura-${order.orderNumber}.pdf`;
                              a.click();
                            }
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-all material-symbols-outlined text-[20px]"
                          title="Pobierz fakturę"
                        >
                          receipt_long
                        </button>
                      </div>
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
