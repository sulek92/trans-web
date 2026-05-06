'use client';

import * as React from 'react';
import Link from 'next/link';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  carrierCode: string;
  carrierService: string;
  senderAddress: { city?: string };
  recipientAddress: { city?: string };
  status: string;
  priceBrutto: string;
  invoiceId?: string;
  carrierLabelUrl?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { addToast } = useToastStore();

  const fetchOrders = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${getApiBaseUrl()}/orders/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać historii zamówień.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  React.useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': case 'DORĘCZONE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PENDING': case 'OCZEKIWANIE': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'IN_TRANSIT': case 'W TRANSPORCIE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED': case 'ANULOWANE': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'ERROR': case 'BŁĄD': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'Oczekiwanie',
      'OCZEKIWANIE': 'Oczekiwanie',
      'IN_TRANSIT': 'W transporcie',
      'W TRANSPORCIE': 'W transporcie',
      'DELIVERED': 'Doręczone',
      'DORĘCZONE': 'Doręczone',
      'CANCELLED': 'Anulowane',
      'ANULOWANE': 'Anulowane',
      'ERROR': 'Błąd',
      'BŁĄD': 'Błąd'
    };
    return labels[status.toUpperCase()] || status;
  };

  const downloadInvoice = async (orderId: string) => {
    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${getApiBaseUrl()}/orders/my/${orderId}/invoice`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `faktura-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać faktury.', type: 'error' });
    }
  };

  return (
    <main className="pt-24 pb-24 min-h-screen bg-[var(--color-background)]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 animate-fade-in">
          <div>
            <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Panel Klienta</span>
            <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-2 tracking-tight">Moje Zamówienia</h1>
            <p className="text-[var(--color-on-surface-variant)] text-lg">Zarządzaj swoimi przesyłkami i śledź ich status w czasie rzeczywistym.</p>
          </div>
          <Link href="/" className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[var(--color-surface-tint)] transition-premium shadow-lg shadow-[var(--color-primary)]/20 active:scale-95">
            <span className="material-symbols-outlined">add</span>
            Nadaj nową przesyłkę
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-dashed border-slate-200 p-20 text-center animate-fade-in">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-slate-300">inventory_2</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Brak zamówień</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Wygląda na to, że nie złożyłeś jeszcze żadnego zamówienia. Nadaj swoją pierwszą paletę już dziś!</p>
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold hover:underline">
              Zacznij tutaj <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm hover:shadow-xl transition-premium group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-10 group-hover:bg-[var(--color-primary-highlight)] transition-colors opacity-50" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-bold text-xs text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                      {order.carrierCode}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-xl text-slate-900">{order.orderNumber}</span>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${getStatusStyle(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 font-medium">
                        {order.senderAddress?.city || '---'} → {order.recipientAddress?.city || '---'}
                        <span className="mx-2 text-slate-300">•</span>
                        {new Date(order.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="pr-8 border-r border-slate-100 text-right hidden sm:block">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Kwota</div>
                      <div className="text-xl font-bold text-slate-900">{order.priceBrutto} PLN</div>
                    </div>
                    
                    <div className="flex gap-2">
                      {order.invoiceId && (
                        <button 
                          onClick={() => downloadInvoice(order.id)}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-premium"
                        >
                          <span className="material-symbols-outlined text-sm">description</span>
                          Faktura
                        </button>
                      )}
                      {order.carrierLabelUrl && (
                        <a 
                          href={order.carrierLabelUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary-highlight)] text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-premium"
                        >
                          <span className="material-symbols-outlined text-sm">label</span>
                          Etykieta
                        </a>
                      )}
                      <Link 
                        href={`/zamowienia/${order.id}`}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-black transition-premium shadow-lg shadow-black/10"
                      >
                        Szczegóły
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
