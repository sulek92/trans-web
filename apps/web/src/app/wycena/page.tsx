'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import Link from 'next/link';

type QuoteCarrier = {
  carrierId: string;
  carrierCode: string;
  serviceName: string;
  priceBrutto: number;
  priceNetto?: number;
  eta: string;
  logo?: string;
  name?: string;
};

type QuoteResults = {
  quoteId?: string;
  isNonStandard?: boolean;
  nonStandardReason?: string;
  results?: QuoteCarrier[];
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}

export default function WycenaPage() {
  return (
    <React.Suspense fallback={<main className="pt-24 pb-section-padding max-w-[1280px] mx-auto px-8 min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full"></div>
        <div className="font-bold text-slate-400">Analizowanie ofert...</div>
      </div>
    </main>}>
      <WycenaContent />
    </React.Suspense>
  );
}

function WycenaContent() {
  const searchParams = useSearchParams();
  const setSelectedOffer = useCheckoutStore((state) => state.setSelectedOffer);
  const [results, setResults] = React.useState<QuoteResults | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Pobieranie danych z URL
  const palletType = searchParams.get('palletType') || 'euro';
  const senderCode = searchParams.get('senderPostalCode') || '00-001';
  const recipientCode = searchParams.get('recipientPostalCode') || '31-001';
  const weight = Number(searchParams.get('weight')) || 350;
  const height = Number(searchParams.get('height')) || 140;
  const width = Number(searchParams.get('width')) || 80;
  const length = Number(searchParams.get('length')) || 120;

  React.useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/quotes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            palletType,
            weight,
            dimensions: { length, width, height },
            sender: { postalCode: senderCode, country: 'PL' },
            recipient: { postalCode: recipientCode, country: 'PL' },
            options: {
              senderPrivate: searchParams.get('senderIsPrivate') === 'true',
              recipientPrivate: searchParams.get('recipientIsPrivate') === 'true',
            }
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch quotes');
        const data = (await response.json()) as QuoteResults;
        setResults(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        // Mock data for demo
        setResults({
          results: [
            { carrierId: 'dhl', carrierCode: 'dhl', serviceName: 'DHL Freight Standard', priceBrutto: 245.00, priceNetto: 199.19, eta: '1-2 dni', logo: 'DHL' },
            { carrierId: 'fedex', carrierCode: 'fedex', serviceName: 'FedEx Priority', priceBrutto: 312.50, priceNetto: 254.06, eta: 'Jutro', logo: 'FedEx' },
          ],
          isNonStandard: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, [API_URL, height, length, palletType, recipientCode, senderCode, searchParams, weight, width]);

  if (isLoading) return <div className="pt-24 pb-section-padding max-w-[1280px] mx-auto px-8 min-h-screen flex items-center justify-center">Ładowanie ofert...</div>;

  const carriers = results?.results || [];
  const resolvedQuoteId = results?.quoteId ?? '';

  return (
    <main className="pt-24 pb-section-padding max-w-[1280px] mx-auto px-8 min-h-screen">
      {error && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}
      <div className="mb-8">
        <h1 className="font-h1-medium text-[24px] font-medium text-[var(--color-on-background)] mb-2">Wyniki Wyceny</h1>
        <p className="font-body-base text-[16px] text-[var(--color-on-surface-variant)]">Znaleźliśmy najlepsze oferty dla Twojej przesyłki z {senderCode} do {recipientCode}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <section className="bg-white rounded-[32px] shadow-sm p-10 border border-[var(--color-divider)] animate-fade-in">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-divider)]">
              <h2 className="font-bold text-xl text-[var(--color-on-background)] flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--color-primary)]">tune</span>
                Twoja Konfiguracja
              </h2>
              <Link href="/" className="text-xs font-bold text-[var(--color-primary)] hover:underline uppercase tracking-widest">Edytuj</Link>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center group">
                <span className="text-[var(--color-on-surface-variant)] text-sm">Typ palety</span>
                <span className="font-bold text-[var(--color-on-background)] bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 capitalize">{palletType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-[var(--color-on-surface-variant)] text-sm">Waga i Wymiary</span>
                <span className="font-bold text-[var(--color-on-background)]">{weight} kg • {height} cm (wys.)</span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-[var(--color-on-surface-variant)] text-sm">Trasa</span>
                <div className="text-right">
                   <div className="font-bold text-[var(--color-on-background)]">{senderCode} → {recipientCode}</div>
                   <div className="text-[10px] text-slate-400 font-bold uppercase">Polska Krajowy</div>
                </div>
              </div>
            </div>
          </section>

          {results?.isNonStandard && (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl animate-fade-in">
               <div className="flex items-center gap-3 text-amber-800 font-bold mb-2">
                  <span className="material-symbols-outlined">warning</span>
                  Wycena Niestandardowa
               </div>
               <p className="text-sm text-amber-700">{results.nonStandardReason}</p>
               <Link href="/kontakt" className="mt-4 inline-block font-bold text-sm underline">Skontaktuj się z nami po wycenę ręczną</Link>
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 flex flex-col gap-md">
          <div className="flex items-center justify-between bg-[var(--color-surface-container-low)] p-sm rounded border border-[var(--color-divider)]">
            <span className="font-body-medium text-[16px] font-medium text-[var(--color-on-background)]">Znaleziono <strong className="text-[var(--color-primary)]">{carriers.length}</strong> oferty</span>
          </div>

          {carriers.map((carrier) => (
            <div key={carrier.carrierId} className="bg-[var(--color-surface-primary)] rounded-xl shadow-md border border-[var(--color-divider)] overflow-hidden hover:border-[var(--color-primary)] transition-all group animate-fade-in">
              <div className="p-lg flex flex-col sm:flex-row gap-lg items-start sm:items-center justify-between">
                <div className="flex items-center gap-lg">
                  <div className="w-20 h-20 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded flex items-center justify-center p-2 shrink-0">
                    <div className="font-display-bold text-lg text-[var(--color-primary)] font-bold">{carrier.carrierCode.toUpperCase()}</div>
                  </div>
                  <div>
                    <h3 className="font-h2-medium text-[20px] font-medium text-[var(--color-on-background)] flex items-center gap-xs">
                      {carrier.serviceName}
                    </h3>
                    <div className="flex items-center gap-md mt-sm text-[var(--color-on-surface-variant)] font-label-sm text-[14px]">
                      <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">schedule</span> ETA: {carrier.eta}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end w-full sm:w-auto">
                  <div className="font-data-mono text-[var(--color-on-background)] text-2xl font-bold flex items-baseline gap-xs">
                    {carrier.priceBrutto.toFixed(2).replace('.', ',')} <span className="text-sm font-normal text-[var(--color-on-surface-variant)]">PLN brutto</span>
                  </div>
                  <Link 
                    href={`/zamowienie/${carrier.carrierId}?quoteId=${resolvedQuoteId}`} 
                    onClick={() => setSelectedOffer(carrier)}
                    className="mt-sm w-full sm:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-surface-tint)] text-[var(--color-on-primary)] font-body-medium text-[16px] font-medium py-xs px-lg rounded shadow-sm transition-colors flex items-center justify-center gap-xs"
                  >
                    Zamów teraz <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {carriers.length === 0 && !isLoading && !results?.isNonStandard && (
            <div className="p-20 text-center text-slate-400 font-bold border-2 border-dashed rounded-3xl">Nie znaleźliśmy ofert dla podanych parametrów. Spróbuj zmienić wymiary lub wagę.</div>
          )}
        </div>
      </div>
    </main>
  );
}
