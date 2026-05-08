'use client';

import * as React from 'react';
import { apiFetch, getApiBaseUrl } from '@/lib/api-url';
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

  const API_URL = getApiBaseUrl();

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiFetch('/orders/my');
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
    if (['DORĘCZONE', 'DELIVERED', 'COMPLETED'].includes(s)) return 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20';
    if (['ANULOWANE', 'CANCELLED', 'ERROR'].includes(s)) return 'bg-[var(--color-error)]/10 text-[var(--color-error)] border-[var(--color-error)]/20';
    if (['W DRODZE', 'IN_TRANSIT', 'SHIPPED'].includes(s)) return 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20';
    return 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20';
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-2 tracking-tight">Moje zamówienia</h1>
        <p className="text-[var(--color-text-muted)] font-medium">Historia i status wszystkich Twoich zleceń transportowych.</p>
      </div>

      <div className="bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-8 items-center">
                <Skeleton className="h-10 w-32 rounded-xl" />
                <Skeleton className="h-10 flex-grow rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-20 rounded-xl" />
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-container)] text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-faint)]">
                  <th className="px-8 py-6">Data / Numer</th>
                  <th className="px-8 py-6">Odbiorca</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Kwota Brutto</th>
                  <th className="px-8 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-divider)]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--color-surface-container)]/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="text-[10px] text-[var(--color-text-faint)] font-bold mb-1 uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString('pl-PL')}</div>
                      <div className="font-bold text-sm text-[var(--color-on-background)] group-hover:text-[var(--color-primary)] transition-colors tracking-tight">{order.orderNumber}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-[var(--color-on-background)] tracking-tight">{order.recipientAddress?.name || '---'}</div>
                      <div className="text-xs text-[var(--color-text-faint)]">{order.recipientAddress?.city}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-sm text-[var(--color-on-background)]">
                      {order.priceBrutto} PLN
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const res = await apiFetch(`/documents/label/${order.id}`);
                            if (res.ok) {
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `etykieta-${order.orderNumber}.pdf`;
                              a.click();
                            }
                          }}
                          className="w-11 h-11 flex items-center justify-center rounded-xl text-[var(--color-primary)] bg-[var(--color-primary-highlight)] hover:scale-110 transition-premium material-symbols-outlined text-[22px] shadow-sm border border-[var(--color-primary)]/10"
                          title="Pobierz etykietę"
                        >
                          label
                        </button>
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            const res = await apiFetch(`/documents/invoice/${order.id}`);
                            if (res.ok) {
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `faktura-${order.orderNumber}.pdf`;
                              a.click();
                            }
                          }}
                          className="w-11 h-11 flex items-center justify-center rounded-xl text-[var(--color-success)] bg-[var(--color-success)]/10 hover:scale-110 transition-premium material-symbols-outlined text-[22px] shadow-sm border border-[var(--color-success)]/20"
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
          <div className="p-20 text-center text-[var(--color-text-faint)] font-bold">
            <span className="material-symbols-outlined text-6xl mb-4 block opacity-20">history</span>
            Nie złożyłeś jeszcze żadnego zamówienia.
          </div>
        )}
      </div>
    </div>
  );
}
