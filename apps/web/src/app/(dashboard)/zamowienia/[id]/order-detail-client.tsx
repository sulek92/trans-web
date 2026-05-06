'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  carrierCode: string;
  carrierService: string;
  carrierTrackingNumber?: string;
  carrierLabelUrl?: string;
  senderAddress: any;
  recipientAddress: any;
  palletData: any;
  additionalServices: any;
  priceNetto: string;
  priceVat: string;
  priceBrutto: string;
  invoiceId?: string;
}

export function OrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = React.useState<Order | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { addToast } = useToastStore();

  const fetchOrder = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${getApiBaseUrl()}/orders/my/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrder(await res.json());
      } else {
        addToast({ title: 'Błąd', description: 'Nie udało się pobrać szczegółów zamówienia.', type: 'error' });
      }
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Wystąpił błąd podczas ładowania danych.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [orderId, addToast]);

  React.useEffect(() => {
    void fetchOrder();
  }, [fetchOrder]);

  const downloadInvoice = async () => {
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
      a.download = `faktura-${order?.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać faktury.', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-24 max-w-[1280px] mx-auto px-8 space-y-12">
        <Skeleton className="h-12 w-1/4 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Skeleton className="lg:col-span-2 h-[600px] rounded-[48px]" />
           <Skeleton className="h-[600px] rounded-[48px]" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-32 text-center">
         <h2 className="text-2xl font-bold">Nie znaleziono zamówienia</h2>
         <Link href="/zamowienia" className="text-[var(--color-primary)] font-bold hover:underline mt-4 block">Wróć do listy</Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED': case 'DORĘCZONE': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'PENDING': case 'OCZEKIWANIE': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'IN_TRANSIT': case 'W TRANSPORCIE': return 'text-blue-500 bg-blue-50 border-blue-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const timeline = [
    { label: 'Zlecenie utworzone', date: order.createdAt, done: true, icon: 'add_task' },
    { label: 'Opłacone', date: order.createdAt, done: order.status !== 'PENDING', icon: 'payments' },
    { label: 'Oczekiwanie na kuriera', date: '', done: ['IN_TRANSIT', 'DELIVERED', 'DORĘCZONE', 'W TRANSPORCIE'].includes(order.status.toUpperCase()), icon: 'schedule' },
    { label: 'W transporcie', date: '', done: ['IN_TRANSIT', 'DELIVERED', 'DORĘCZONE', 'W TRANSPORCIE'].includes(order.status.toUpperCase()), icon: 'local_shipping' },
    { label: 'Doręczone', date: '', done: ['DELIVERED', 'DORĘCZONE'].includes(order.status.toUpperCase()), icon: 'verified' },
  ];

  return (
    <main className="pt-24 pb-32 bg-[var(--color-background)] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Back Button */}
        <Link href="/zamowienia" className="inline-flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-[var(--color-primary)] transition-premium mb-8 group">
           <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
           Powrót do listy
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12 animate-fade-in">
           <div>
              <div className="flex items-center gap-4 mb-4">
                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">{order.orderNumber}</h1>
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-widest ${getStatusColor(order.status)}`}>
                   {order.status}
                 </span>
              </div>
              <p className="text-slate-500 text-lg">Złożone {new Date(order.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
           </div>
           
           <div className="flex flex-wrap gap-4">
              {order.invoiceId && (
                <button 
                  onClick={downloadInvoice}
                  className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-50 transition-premium shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined">description</span>
                  Pobierz Fakturę
                </button>
              )}
              {order.carrierLabelUrl && (
                <a 
                  href={order.carrierLabelUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[var(--color-primary-highlight)] text-[var(--color-primary)] px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-[var(--color-primary)] hover:text-white transition-premium shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined">label</span>
                  Etykieta Przewozowa
                </a>
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Left Column: Timeline and Addresses */}
           <div className="lg:col-span-8 space-y-8">
              {/* Status Timeline */}
              <div className="bg-white rounded-[48px] p-12 border border-[var(--color-divider)] shadow-sm overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 -z-10" />
                 <h3 className="text-2xl font-bold mb-12">Status przesyłki</h3>
                 
                 <div className="relative">
                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100" />
                    <div className="space-y-10 relative">
                       {timeline.map((step, i) => (
                         <div key={i} className={`flex items-start gap-8 transition-opacity duration-500 ${step.done ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center z-10 shadow-lg transition-premium ${step.done ? 'bg-[var(--color-primary)] text-white scale-110' : 'bg-white border border-slate-100 text-slate-300'}`}>
                               <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                            </div>
                            <div>
                               <div className="font-bold text-lg mb-1">{step.label}</div>
                               <div className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                                 {step.date ? new Date(step.date).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }) : 'Oczekiwanie'}
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Address Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Sender */}
                 <div className="bg-white rounded-[40px] p-10 border border-[var(--color-divider)] shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined">upload</span>
                       </div>
                       <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Nadawca</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="text-xl font-bold text-slate-900">{order.senderAddress?.name}</div>
                       {order.senderAddress?.companyName && <div className="text-slate-600 font-medium">{order.senderAddress.companyName}</div>}
                       <div className="text-slate-500 leading-relaxed">
                          {order.senderAddress?.street} {order.senderAddress?.houseNumber}{order.senderAddress?.apartmentNumber ? `/${order.senderAddress.apartmentNumber}` : ''}<br />
                          {order.senderAddress?.postalCode} {order.senderAddress?.city}<br />
                          {order.senderAddress?.countryCode}
                       </div>
                       <div className="pt-4 border-t border-slate-50 space-y-2">
                          <div className="text-sm font-medium flex items-center gap-2 text-slate-400"><span className="material-symbols-outlined text-sm">mail</span> {order.senderAddress?.email}</div>
                          <div className="text-sm font-medium flex items-center gap-2 text-slate-400"><span className="material-symbols-outlined text-sm">call</span> {order.senderAddress?.phone}</div>
                       </div>
                    </div>
                 </div>

                 {/* Recipient */}
                 <div className="bg-white rounded-[40px] p-10 border border-[var(--color-divider)] shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined">download</span>
                       </div>
                       <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Odbiorca</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="text-xl font-bold text-slate-900">{order.recipientAddress?.name}</div>
                       {order.recipientAddress?.companyName && <div className="text-slate-600 font-medium">{order.recipientAddress.companyName}</div>}
                       <div className="text-slate-500 leading-relaxed">
                          {order.recipientAddress?.street} {order.recipientAddress?.houseNumber}{order.recipientAddress?.apartmentNumber ? `/${order.recipientAddress.apartmentNumber}` : ''}<br />
                          {order.recipientAddress?.postalCode} {order.recipientAddress?.city}<br />
                          {order.recipientAddress?.countryCode}
                       </div>
                       <div className="pt-4 border-t border-slate-50 space-y-2">
                          <div className="text-sm font-medium flex items-center gap-2 text-slate-400"><span className="material-symbols-outlined text-sm">mail</span> {order.recipientAddress?.email}</div>
                          <div className="text-sm font-medium flex items-center gap-2 text-slate-400"><span className="material-symbols-outlined text-sm">call</span> {order.recipientAddress?.phone}</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Order Details and Summary */}
           <div className="lg:col-span-4 space-y-8">
              {/* Shipment Info */}
              <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                 <h3 className="text-xl font-bold mb-8 relative z-10 flex items-center gap-2">
                   <span className="material-symbols-outlined text-[var(--color-primary)]">pallet</span>
                   Szczegóły ładunku
                 </h3>
                 <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                       <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Rodzaj</span>
                       <span className="font-bold">{order.palletData?.palletType}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                       <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Waga</span>
                       <span className="font-bold">{order.palletData?.weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                       <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Wymiary (DxSxW)</span>
                       <span className="font-bold">{order.palletData?.dimensions?.length}x{order.palletData?.dimensions?.width}x{order.palletData?.dimensions?.height} cm</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-white/5">
                       <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Przewoźnik</span>
                       <span className="font-bold text-[var(--color-primary)]">{order.carrierCode} ({order.carrierService})</span>
                    </div>
                    {order.carrierTrackingNumber && (
                      <div className="flex justify-between items-center py-4">
                         <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Tracking</span>
                         <span className="font-mono bg-white/5 px-3 py-1 rounded text-sm">{order.carrierTrackingNumber}</span>
                      </div>
                    )}
                 </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white rounded-[48px] p-10 border border-[var(--color-divider)] shadow-sm">
                 <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                   <span className="material-symbols-outlined text-[var(--color-primary)]">payments</span>
                   Podsumowanie kosztów
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400">Kwota netto</span>
                       <span className="font-bold">{order.priceNetto} PLN</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400">Podatek VAT (23%)</span>
                       <span className="font-bold">{order.priceVat} PLN</span>
                    </div>
                    {order.additionalServices?.insurance && (
                      <div className="flex justify-between text-xs text-emerald-600 font-bold">
                         <span>Dodatkowe ubezpieczenie</span>
                         <span>W cenie</span>
                      </div>
                    )}
                    <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-end">
                       <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Łącznie brutto</div>
                       <div className="text-3xl font-bold text-[var(--color-primary)] tracking-tighter">{order.priceBrutto} <span className="text-sm font-medium">PLN</span></div>
                    </div>
                 </div>
              </div>

              {/* Help Box */}
              <div className="bg-[var(--color-primary-highlight)] rounded-[40px] p-8 text-[var(--color-primary)] flex flex-col items-center text-center">
                 <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                    <span className="material-symbols-outlined">help</span>
                 </div>
                 <h4 className="font-bold mb-2">Potrzebujesz pomocy?</h4>
                 <p className="text-xs opacity-70 mb-6 font-medium">Nasz dział obsługi klienta jest do Twojej dyspozycji w sprawie tego zamówienia.</p>
                 <Link href="/kontakt" className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold text-xs hover:scale-105 transition-premium shadow-md">
                    Skontaktuj się
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
