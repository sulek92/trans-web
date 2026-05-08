'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { getApiBaseUrl } from '@/lib/api-url';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const API_URL = getApiBaseUrl();

  React.useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchOrder();
  }, [orderId, API_URL]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="max-w-xl w-full bg-white rounded-[40px] p-12 border border-[var(--color-divider)] shadow-sm text-center">
          <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-10rem)] bg-[var(--color-background)]">
      <div className="max-w-xl w-full bg-[var(--color-surface-primary)] rounded-[40px] p-12 border border-[var(--color-divider)] shadow-sm text-center animate-fade-in">
        <div className="w-24 h-24 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        
        <h1 className="text-4xl font-bold text-[var(--color-on-background)] mb-4 tracking-tight">
          Dziękujemy za zamówienie!
        </h1>
        <p className="text-[var(--color-on-surface-variant)] text-lg mb-10">
          Twoje zlecenie transportowe zostało przyjęte do realizacji.
          {order && <span className="block mt-2 font-bold text-[var(--color-primary)]">Numer: {order.orderNumber}</span>}
        </p>

        <div className="bg-[var(--color-surface-container)] rounded-3xl p-8 text-left mb-10 border border-[var(--color-divider)]">
           <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--color-surface-primary)] rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                 <span className="material-symbols-outlined text-[var(--color-primary)]">description</span>
              </div>
              <div>
                 <h3 className="font-bold text-[var(--color-on-background)]">Twoje dokumenty są gotowe</h3>
                 <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-4">Etykieta przewozowa została wygenerowana i przesłana na Twój adres e-mail.</p>
                 <button className="bg-[var(--color-surface-primary)] border border-[var(--color-divider)] px-6 py-2 rounded-xl text-xs font-bold hover:bg-[var(--color-surface-container)] transition-all flex items-center gap-2 shadow-sm text-[var(--color-on-background)]">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Pobierz Etykietę (PDF)
                 </button>
              </div>
           </div>
        </div>

         <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/zamowienia" className="flex-1 py-4 bg-[var(--color-on-background)] text-[var(--color-background)] rounded-2xl font-bold hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-xl">
            Moje Zamówienia
          </Link>
          <Link href="/" className="flex-1 py-4 bg-[var(--color-surface-primary)] border border-[var(--color-divider)] text-[var(--color-on-background)] rounded-2xl font-bold hover:bg-[var(--color-surface-container)] transition-all">
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <React.Suspense fallback={
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="max-w-xl w-full bg-white rounded-[40px] p-12 border border-[var(--color-divider)] shadow-sm text-center">
          <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full mx-auto" />
        </div>
      </div>
    }>
      <SuccessContent />
    </React.Suspense>
  );
}
