'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { motion } from 'framer-motion';
import { getApiBaseUrl } from '@/lib/api-url';

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

const COUNTRY_NAMES: Record<string, string> = {
  PL: 'Polska',
  DE: 'Niemcy',
  FR: 'Francja',
  IT: 'Włochy',
  NL: 'Holandia',
  ES: 'Hiszpania',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}

function toBoolean(value: string | null): boolean {
  return value === 'true';
}

const palletTypeLabels: Record<string, string> = {
  euro: 'Euro 120×80',
  semi_euro: 'Półpaleta 80×60',
  industrial: 'Przemysłowa 120×100',
  semi_industrial: 'Półprzemysłowa',
  custom: 'Niestandardowa',
};

export default function WycenaPage() {
  return (
    <React.Suspense fallback={<LoadingSkeleton />}>
      <WycenaContent />
    </React.Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <main className="pb-section-padding max-w-[1280px] mx-auto px-4 sm:px-8 min-h-screen">
      {/* Route banner skeleton */}
      <div className="rounded-[40px] bg-[var(--color-surface-container)] p-8 sm:p-12 mb-10 animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="w-32 h-7 bg-[var(--color-surface-container-high)] rounded-full" />
          <div className="w-28 h-5 bg-[var(--color-surface-container-high)] rounded-lg" />
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0 mb-10">
          <div className="flex-1 flex flex-col items-center lg:items-start gap-3">
            <div className="w-16 h-4 bg-[var(--color-surface-container-high)] rounded" />
            <div className="w-24 h-10 bg-[var(--color-surface-container-high)] rounded-lg" />
            <div className="w-20 h-4 bg-[var(--color-surface-container-high)] rounded" />
          </div>
          <div className="w-24 h-6 bg-[var(--color-surface-container-high)] rounded-full" />
          <div className="flex-1 flex flex-col items-center lg:items-end gap-3">
            <div className="w-16 h-4 bg-[var(--color-surface-container-high)] rounded" />
            <div className="w-24 h-10 bg-[var(--color-surface-container-high)] rounded-lg" />
            <div className="w-20 h-4 bg-[var(--color-surface-container-high)] rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-[var(--color-divider)] p-6 bg-[var(--color-surface-primary)]/50 flex flex-col items-center gap-3">
              <div className="w-8 h-8 bg-[var(--color-surface-container-high)] rounded-lg" />
              <div className="w-16 h-8 bg-[var(--color-surface-container-high)] rounded" />
              <div className="w-14 h-3 bg-[var(--color-surface-container-high)] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-[28px] border border-[var(--color-divider)] p-6 bg-[var(--color-surface-primary)] animate-pulse shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container-high)]" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-5 bg-[var(--color-surface-container-high)] rounded" />
                <div className="w-24 h-4 bg-[var(--color-surface-container-high)] rounded" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-6">
              <div className="space-y-2">
                <div className="w-20 h-8 bg-[var(--color-surface-container-high)] rounded" />
                <div className="w-16 h-4 bg-[var(--color-surface-container-high)] rounded" />
              </div>
              <div className="w-32 h-12 bg-[var(--color-surface-container-high)] rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function WycenaContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const setSelectedOffer = useCheckoutStore((s) => s.setSelectedOffer);
  const [results, setResults] = React.useState<QuoteResults | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const API_URL = getApiBaseUrl();

  const palletType = searchParams.get('palletType') || 'euro';
  const senderCode = searchParams.get('senderPostalCode') || '00-001';
  const senderCountry = searchParams.get('senderCountry') || 'PL';
  const recipientCode = searchParams.get('recipientPostalCode') || '31-001';
  const recipientCountry = searchParams.get('recipientCountry') || 'PL';
  const palletCount = Math.max(1, Number(searchParams.get('palletCount')) || 1);
  const unitWeight = Number(searchParams.get('weight')) || 350;
  const chargeableWeight = unitWeight * palletCount;
  const height = Number(searchParams.get('height')) || 140;
  const width = Number(searchParams.get('width')) || 80;
  const length = Number(searchParams.get('length')) || 120;
  const senderPrivate = toBoolean(searchParams.get('senderIsPrivate'));
  const recipientPrivate = toBoolean(searchParams.get('recipientIsPrivate'));
  const stackable = toBoolean(searchParams.get('isStackable'));
  const fragile = toBoolean(searchParams.get('isFragile'));
  const adr = toBoolean(searchParams.get('hasAdr'));

  React.useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/quotes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            palletType,
            weight: chargeableWeight,
            dimensions: { length, width, height },
            sender: { postalCode: senderCode, country: senderCountry },
            recipient: { postalCode: recipientCode, country: recipientCountry },
            options: { senderPrivate, recipientPrivate, stackable, fragile, adr },
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch quotes');
        const data = (await response.json()) as QuoteResults;
        setResults(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        setResults({
          results: [
            {
              carrierId: 'dhl',
              carrierCode: 'dhl',
              serviceName: 'DHL Freight Standard',
              priceBrutto: 245.0,
              priceNetto: 199.19,
              eta: '1-2 dni',
              logo: 'DHL',
            },
            {
              carrierId: 'fedex',
              carrierCode: 'fedex',
              serviceName: 'FedEx Priority',
              priceBrutto: 312.5,
              priceNetto: 254.06,
              eta: 'Jutro',
              logo: 'FedEx',
            },
            {
              carrierId: 'dpd',
              carrierCode: 'dpd',
              serviceName: 'DPD Classic',
              priceBrutto: 189.0,
              priceNetto: 153.66,
              eta: '2-3 dni',
              logo: 'DPD',
            },
          ],
          isNonStandard: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, [
    API_URL,
    adr,
    chargeableWeight,
    fragile,
    height,
    length,
    palletType,
    palletCount,
    recipientCode,
    recipientCountry,
    recipientPrivate,
    searchParams,
    senderCode,
    senderCountry,
    senderPrivate,
    stackable,
    unitWeight,
    width,
  ]);

  if (isLoading) return <LoadingSkeleton />;

  const carriers = results?.results || [];
  const resolvedQuoteId = results?.quoteId ?? '';
  const bestOffer =
    carriers.length > 1
      ? carriers.reduce((a, b) => (a.priceBrutto < b.priceBrutto ? a : b))
      : null;
  const otherCarriers = bestOffer
    ? carriers.filter((c) => c.carrierId !== bestOffer.carrierId)
    : carriers;
  const senderCountryName = COUNTRY_NAMES[senderCountry] || senderCountry;
  const recipientCountryName = COUNTRY_NAMES[recipientCountry] || recipientCountry;
  const palletDisplayName = palletTypeLabels[palletType] || palletType;
  const hasSpecialConditions = stackable || fragile || adr || senderPrivate || recipientPrivate;

  const handleOrder = (carrier: QuoteCarrier) => {
    setSelectedOffer({
      carrierId: carrier.carrierId,
      carrierCode: carrier.carrierCode,
      serviceName: carrier.serviceName,
      priceBrutto: carrier.priceBrutto,
      priceNetto: carrier.priceNetto,
      eta: carrier.eta,
      logo: carrier.logo || carrier.carrierCode,
      name: carrier.name || carrier.serviceName,
    });
  };

  const editUrl = `/?${searchParams.toString()}`;

  return (
    <main className="pb-16 max-w-[1280px] mx-auto px-4 sm:px-8 min-h-screen bg-[var(--color-background)] transition-colors duration-500">
      {/* --- Error Banner --- */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-[var(--color-error)] bg-[var(--color-error)]/5 px-5 py-4 text-sm text-[var(--color-error)] flex items-center gap-3"
        >
          <span className="material-symbols-outlined text-[var(--color-error)]">warning</span>
          <span className="font-medium">
            {error} — {t.quote.results.noOffers}
          </span>
        </motion.div>
      )}

      {/* ==================== ROUTE HERO BANNER ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark, #00636e)] to-[var(--color-surface-tint, #003438)] p-8 sm:p-10 lg:p-12 mb-12 text-white shadow-2xl shadow-[var(--color-primary)]/20"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/3 to-transparent rounded-full pointer-events-none" />

        <div className="relative z-10">
          {/* Top row: badge + edit link */}
          <div className="flex items-center justify-between mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/12 backdrop-blur-sm border border-white/15 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
              <span className="material-symbols-outlined text-[16px]">calculate</span>
              {t.quote.results.title}
            </span>
            <Link
              href={editUrl}
              className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors bg-white/8 hover:bg-white/15 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              {t.quote.results.edit}
            </Link>
          </div>

          {/* Route visualization */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 mb-10">
            {/* Sender */}
            <div className="flex-1 flex flex-col items-center lg:items-start lg:pr-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-2">
                {t.quote.sender.title}
              </span>
              <span className="text-3xl sm:text-4xl font-bold font-display tracking-tight">
                {senderCode}
              </span>
              <span className="text-sm text-white/55 mt-1 font-medium">
                {senderCountryName}
              </span>
              {senderPrivate && (
                <span className="mt-2 px-3 py-0.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/50 border border-white/5">
                  Prywatny
                </span>
              )}
            </div>

            {/* Animated route line */}
            <div className="flex-shrink-0 flex items-center gap-3 lg:px-6 relative">
              <div className="w-2.5 h-2.5 rounded-full bg-white/25" />
              <div className="w-20 sm:w-28 lg:w-36 h-[2px] bg-gradient-to-r from-white/10 via-white/40 to-white/10 relative overflow-hidden">
                <div className="absolute inset-0 animate-route-dash bg-gradient-to-r from-transparent via-white/90 to-transparent" />
              </div>
              <motion.span
                className="material-symbols-outlined text-2xl"
                animate={{ x: [-40, 40, -40] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'block', position: 'relative', zIndex: 1 }}
              >
                local_shipping
              </motion.span>
              <div className="w-2.5 h-2.5 rounded-full bg-white/25" />
            </div>

            {/* Recipient */}
            <div className="flex-1 flex flex-col items-center lg:items-end lg:pl-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-2">
                {t.quote.recipient.title}
              </span>
              <span className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-center lg:text-right">
                {recipientCode}
              </span>
              <span className="text-sm text-white/55 mt-1 font-medium">
                {recipientCountryName}
              </span>
              {recipientPrivate && (
                <span className="mt-2 px-3 py-0.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/50 border border-white/5">
                  Prywatny
                </span>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/12 transition-colors group">
              <span className="material-symbols-outlined text-xl text-white/50 mb-2 group-hover:text-white transition-colors">inventory_2</span>
              <span className="text-xl sm:text-2xl font-bold font-display">{palletCount}</span>
              <span className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">{t.quote.palletCount}</span>
            </div>
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/12 transition-colors group">
              <span className="material-symbols-outlined text-xl text-white/50 mb-2 group-hover:text-white transition-colors">scale</span>
              <span className="text-xl sm:text-2xl font-bold font-display">{chargeableWeight}</span>
              <span className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">kg</span>
            </div>
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/12 transition-colors group">
              <span className="material-symbols-outlined text-xl text-white/50 mb-2 group-hover:text-white transition-colors">straighten</span>
              <span className="text-xl sm:text-2xl font-bold font-display">{length}x{width}x{height}</span>
              <span className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">cm</span>
            </div>
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/12 transition-colors group">
              <span className="material-symbols-outlined text-xl text-white/50 mb-2 group-hover:text-white transition-colors">pallet</span>
              <span className="text-base sm:text-lg font-bold font-display leading-tight text-center">{palletDisplayName}</span>
              <span className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">{t.quote.results.palletType}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==================== NON-STANDARD WARNING ==================== */}
      {results?.isNonStandard && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-[28px] border-2 border-[var(--color-error)] bg-[var(--color-error)]/5 p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-error)]/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[var(--color-error)] text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[var(--color-on-background)] mb-1">{t.quote.results.nonStandard}</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">{results.nonStandardReason}</p>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-error)]/10 hover:bg-[var(--color-error)]/20 text-[var(--color-error)] rounded-xl font-bold text-sm transition-colors"
              >
                {t.quote.results.contactManual}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==================== RESULTS SECTION ==================== */}
      {carriers.length > 0 && (
        <section className="mb-14">
          {/* Results header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-h1-medium text-[22px] sm:text-[26px] text-[var(--color-on-background)]">
                {t.quote.results.found}{' '}
                <span className="text-[var(--color-primary)]">{carriers.length}</span>{' '}
{t.quote.results.offers}
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">
                {senderCode} ({senderCountryName}) {t.quote.results.to} {recipientCode} ({recipientCountryName})
              </p>
            </div>
          </div>

          {/* Best offer highlight (only when 2+ carriers) */}
          {bestOffer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-[40px] border-2 border-[var(--color-primary)] bg-[var(--color-surface-primary)] mb-8 group shadow-[var(--shadow-premium)]"
            >
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/4 via-transparent to-transparent pointer-events-none" />
              {/* Corner glow */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--color-primary)]/15 transition-colors" />

              <div className="relative p-8 sm:p-10">
                <div className="absolute top-0 right-10">
                  <span className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--color-primary)] text-white rounded-b-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                    {t.quote.results.bestPrice}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex flex-col sm:flex-row items-center gap-8 flex-1 min-w-0">
                    <div className="w-20 h-20 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] flex items-center justify-center flex-shrink-0 shadow-inner">
                      <span className="font-display font-black text-[var(--color-primary)] text-xl tracking-tighter">
                        {bestOffer.carrierCode.slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 text-center sm:text-left">
                      <h3 className="font-bold text-xl sm:text-2xl text-[var(--color-on-background)] tracking-tight mb-2">
                        {bestOffer.serviceName}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-2 font-medium">
                          <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">schedule</span>
                          {bestOffer.eta}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-divider)]" />
                        {bestOffer.priceNetto && (
                          <span className="text-xs font-medium opacity-60 tabular-nums">
                            {bestOffer.priceNetto.toFixed(2).replace('.', ',')} PLN netto
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-5 w-full md:w-auto">
                    <div className="text-center md:text-right">
                      <div className="font-display font-bold text-4xl sm:text-5xl text-[var(--color-primary)] tracking-tight tabular-nums">
                        {bestOffer.priceBrutto.toFixed(2).replace('.', ',')}
                        <span className="text-lg font-medium opacity-40 ml-1">PLN</span>
                      </div>
                      <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-[0.2em] mt-1">Łącznie brutto</div>
                    </div>
                    <Link
                      href={`/zamowienie/${resolvedQuoteId || bestOffer.carrierId}`}
                      onClick={() => handleOrder(bestOffer)}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-surface-tint)] text-white font-bold text-lg rounded-2xl shadow-xl shadow-[var(--color-primary)]/25 transition-all hover:scale-[1.03] active:scale-[0.97]"
                    >
                      {t.pricing.result.orderNow}
                      <span className="material-symbols-outlined">arrow_right_alt</span>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other offers grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {otherCarriers.map((carrier) => {
              const isCheapest = carrier === bestOffer;
              return (
                <motion.div
                  key={carrier.carrierId}
                  variants={itemVariants}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`relative rounded-[32px] border bg-[var(--color-surface-primary)] overflow-hidden transition-all duration-300 group ${
                    isCheapest
                      ? 'border-[var(--color-primary)] shadow-[var(--shadow-premium)]'
                      : 'border-[var(--color-divider)] hover:border-[var(--color-primary)]/30 hover:shadow-xl shadow-sm'
                  }`}
                >
                  {isCheapest && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-lg">
                        {t.quote.results.bestPrice}
                      </div>
                    </div>
                  )}

                  <div className={`p-6 sm:p-8 ${isCheapest ? 'pt-10' : ''}`}>
                    {/* Carrier identity */}
                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] flex items-center justify-center flex-shrink-0 group-hover:border-[var(--color-primary)]/30 transition-colors shadow-inner">
                        <span className="font-display font-black text-sm text-[var(--color-primary)]">
                          {carrier.carrierCode.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg text-[var(--color-on-background)] truncate tracking-tight mb-1">
                          {carrier.serviceName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] font-medium">
                          <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">schedule</span>
                          <span>{carrier.eta}</span>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[var(--color-divider)] pt-6">
                      {/* Price + CTA */}
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="font-display font-bold text-3xl text-[var(--color-on-background)] tabular-nums tracking-tight">
                            {carrier.priceBrutto.toFixed(2).replace('.', ',')}
                          </div>
                          <div className="flex flex-col text-[11px] text-[var(--color-text-faint)] font-bold uppercase tracking-widest mt-1">
                            <span>PLN brutto</span>
                            {carrier.priceNetto && (
                              <span className="opacity-60 normal-case font-medium lowercase">
                                ({carrier.priceNetto.toFixed(2).replace('.', ',')} netto)
                              </span>
                            )}
                          </div>
                        </div>

                        <Link
                          href={`/zamowienie/${resolvedQuoteId || carrier.carrierId}`}
                          onClick={() => handleOrder(carrier)}
                          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97] shadow-sm ${
                            isCheapest
                              ? 'bg-[var(--color-primary)] hover:bg-[var(--color-surface-tint)] text-white shadow-[var(--color-primary)]/20'
                              : 'bg-[var(--color-surface-container)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-on-background)]'
                          }`}
                        >
                          {t.pricing.result.orderNow}
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* ==================== EMPTY STATE ==================== */}
      {carriers.length === 0 && !isLoading && !results?.isNonStandard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14 rounded-[40px] border-2 border-dashed border-[var(--color-divider)] p-16 text-center bg-[var(--color-surface-container)]/30"
        >
          <div className="w-24 h-24 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <span className="material-symbols-outlined text-5xl text-[var(--color-text-faint)]">search_off</span>
          </div>
          <h3 className="font-bold text-2xl text-[var(--color-on-background)] mb-3 tracking-tight">{t.quote.results.noOffersTitle}</h3>
          <p className="text-[var(--color-text-muted)] max-w-md mx-auto mb-10 text-base font-medium">
            {t.quote.results.noOffers}
          </p>
          <Link
            href={editUrl}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-primary)] text-white font-bold rounded-2xl hover:bg-[var(--color-surface-tint)] transition-all shadow-xl shadow-[var(--color-primary)]/25 hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            {t.quote.results.edit}
          </Link>
        </motion.div>
      )}

      {/* ==================== TRUST BANNER ==================== */}
      {carriers.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16 rounded-[40px] bg-[var(--color-surface-container)]/30 border border-[var(--color-divider)] p-8 sm:p-10 shadow-sm"
        >
          <h3 className="font-bold text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-faint)] mb-10">
            {t.quote.results.includesTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary)]/15 transition-colors">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">verified_user</span>
              </div>
              <div>
                <div className="font-bold text-base text-[var(--color-on-background)] tracking-tight">{t.quote.results.ocpTitle}</div>
                <div className="text-sm text-[var(--color-text-muted)] mt-1.5 leading-relaxed font-medium">{t.quote.results.ocpDesc}</div>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary)]/15 transition-colors">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">receipt_long</span>
              </div>
              <div>
                <div className="font-bold text-base text-[var(--color-on-background)] tracking-tight">{t.quote.results.invoiceTitle}</div>
                <div className="text-sm text-[var(--color-text-muted)] mt-1.5 leading-relaxed font-medium">{t.quote.results.invoiceDesc}</div>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary)]/15 transition-colors">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-2xl">local_gas_station</span>
              </div>
              <div>
                <div className="font-bold text-base text-[var(--color-on-background)] tracking-tight">{t.quote.results.fuelTitle}</div>
                <div className="text-sm text-[var(--color-text-muted)] mt-1.5 leading-relaxed font-medium">{t.quote.results.fuelDesc}</div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ==================== CONFIGURATION SUMMARY ==================== */}
      {/* ==================== CONFIGURATION SUMMARY ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-[40px] bg-[var(--color-surface-primary)] border border-[var(--color-divider)] shadow-[var(--shadow-premium)] overflow-hidden"
      >
        <div className="flex items-center justify-between p-8 sm:p-10 pb-4">
          <h2 className="font-bold text-xl text-[var(--color-on-background)] flex items-center gap-4 tracking-tight">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">tune</span>
            {t.quote.results.config}
          </h2>
          <Link
            href={editUrl}
            className="text-[10px] font-bold text-[var(--color-primary)] hover:opacity-70 transition-opacity uppercase tracking-widest flex items-center gap-2 bg-[var(--color-primary)]/10 px-4 py-2 rounded-full"
          >
            {t.quote.results.edit}
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </Link>
        </div>

        <div className="p-8 sm:p-10 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {/* Pallet type */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">pallet</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mb-1">{t.quote.results.palletType}</div>
                <div className="font-bold text-base text-[var(--color-on-background)]">{palletDisplayName}</div>
              </div>
            </div>

            {/* Pallet count */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">inventory_2</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mb-1">{t.quote.results.palletCount}</div>
                <div className="font-bold text-base text-[var(--color-on-background)] tracking-tight">{palletCount} szt.</div>
              </div>
            </div>

            {/* Weight & dims */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">straighten</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mb-1">{t.quote.results.weightDims}</div>
                <div className="font-bold text-base text-[var(--color-on-background)] tabular-nums">{unitWeight} kg · {length}x{width}x{height} cm</div>
              </div>
            </div>

            {/* Chargeable weight */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">scale</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mb-1">{t.quote.results.chargeableWeight}</div>
                <div className="font-bold text-base text-[var(--color-on-background)] tabular-nums">{chargeableWeight} kg</div>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">route</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mb-1">{t.quote.results.route}</div>
                <div className="font-bold text-base text-[var(--color-on-background)] flex items-center gap-2">
                  {senderCode} <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">arrow_forward</span> {recipientCode}
                </div>
                <div className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">
                  {senderCountryName} → {recipientCountryName}
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">checklist</span>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mb-2">{t.quote.results.conditions}</div>
                {hasSpecialConditions ? (
                  <div className="flex flex-wrap gap-2">
                    {stackable && (
                      <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {t.quote.results.stackableYes}
                      </span>
                    )}
                    {fragile && (
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {t.quote.results.fragileYes}
                      </span>
                    )}
                    {adr && (
                      <span className="px-3 py-1 bg-red-500/10 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {t.quote.results.adrYes}
                      </span>
                    )}
                    {(senderPrivate || recipientPrivate) && (
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {t.quote.results.privateAddressYes}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-[var(--color-text-muted)] italic font-medium">{t.quote.results.noConditions}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Inline keyframe style for route dash animation */}
      <style jsx>{`
        @keyframes routeDash {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .animate-route-dash {
          animation: routeDash 2s ease-in-out infinite;
          width: 60%;
          height: 100%;
        }
      `}</style>
    </main>
  );
}
