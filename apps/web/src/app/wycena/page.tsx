'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useCheckoutStore } from '@/lib/store/checkout-store';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { motion } from 'framer-motion';

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
            <div key={i} className="rounded-2xl border border-[var(--color-divider)] p-6 bg-white/50 flex flex-col items-center gap-3">
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
          <div key={i} className="rounded-[28px] border border-[var(--color-divider)] p-6 bg-white animate-pulse">
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
    <main className="pb-16 max-w-[1280px] mx-auto px-4 sm:px-8 min-h-screen">
      {/* --- Error Banner --- */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 flex items-center gap-3"
        >
          <span className="material-symbols-outlined text-amber-500">warning</span>
          <span>
            {error} — {t.quote.results.noOffers}
          </span>
        </motion.div>
      )}

      {/* ==================== ROUTE HERO BANNER ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[var(--color-primary)] via-[#00636e] to-[#003438] p-8 sm:p-10 lg:p-12 mb-12 text-white"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-[#2dd4bf]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/3 to-transparent rounded-full pointer-events-none" />

        <div className="relative z-10">
          {/* Top row: badge + edit link */}
          <div className="flex items-center justify-between mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/12 backdrop-blur-sm border border-white/15 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
              <span className="material-symbols-outlined text-[16px]">calculate</span>
              {t.quote.results.title}
            </span>
            <Link
              href={editUrl}
              className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors bg-white/8 hover:bg-white/15 px-4 py-2 rounded-full backdrop-blur-sm"
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
              <span className="text-3xl sm:text-4xl font-bold font-display-bold tracking-tight">
                {senderCode}
              </span>
              <span className="text-sm text-white/55 mt-1 font-medium">
                {senderCountryName}
              </span>
              {senderPrivate && (
                <span className="mt-2 px-3 py-0.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/50">
                  Prywatny
                </span>
              )}
            </div>

            {/* Animated route line */}
            <div className="flex-shrink-0 flex items-center gap-3 lg:px-6 relative">
              <div className="w-2.5 h-2.5 rounded-full bg-white/25" />
              <div className="w-20 sm:w-28 lg:w-36 h-[2px] bg-gradient-to-r from-white/20 via-white/50 to-white/20 relative overflow-hidden">
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
              <span className="text-3xl sm:text-4xl font-bold font-display-bold tracking-tight text-center lg:text-right">
                {recipientCode}
              </span>
              <span className="text-sm text-white/55 mt-1 font-medium">
                {recipientCountryName}
              </span>
              {recipientPrivate && (
                <span className="mt-2 px-3 py-0.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/50">
                  Prywatny
                </span>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/12 transition-colors">
              <span className="material-symbols-outlined text-xl text-white/50 mb-2">inventory_2</span>
              <span className="text-xl sm:text-2xl font-bold font-display-bold">{palletCount}</span>
              <span className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">{t.quote.palletCount}</span>
            </div>
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/12 transition-colors">
              <span className="material-symbols-outlined text-xl text-white/50 mb-2">scale</span>
              <span className="text-xl sm:text-2xl font-bold font-display-bold">{chargeableWeight}</span>
              <span className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">kg</span>
            </div>
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/12 transition-colors">
              <span className="material-symbols-outlined text-xl text-white/50 mb-2">straighten</span>
              <span className="text-xl sm:text-2xl font-bold font-display-bold">{length}x{width}x{height}</span>
              <span className="text-[11px] text-white/40 mt-1 uppercase tracking-wider">cm</span>
            </div>
            <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/12 transition-colors">
              <span className="material-symbols-outlined text-xl text-white/50 mb-2">pallet</span>
              <span className="text-base sm:text-lg font-bold font-display-bold leading-tight text-center">{palletDisplayName}</span>
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
          className="mb-10 rounded-[28px] border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-50/50 p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-amber-600 text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-900 mb-1">{t.quote.results.nonStandard}</h3>
              <p className="text-sm text-amber-700 mb-4">{results.nonStandardReason}</p>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-sm transition-colors"
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
              className="relative overflow-hidden rounded-[32px] border-2 border-[var(--color-primary)] bg-white mb-6 group"
              style={{ boxShadow: '0 4px 32px rgba(0,82,88,0.12)' }}
            >
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/4 via-transparent to-transparent pointer-events-none" />
              {/* Corner glow */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative p-6 sm:p-8">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-full text-[11px] font-bold uppercase tracking-wider mb-5">
                  <span className="material-symbols-outlined text-[16px]">military_tech</span>
                  {t.quote.results.bestPrice}
                </span>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-highlight)] border border-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-display-bold text-[var(--color-primary)] text-lg font-bold">
                        {bestOffer.carrierCode.slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg sm:text-xl text-[var(--color-on-background)] truncate">
                        {bestOffer.serviceName}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 text-sm text-[var(--color-on-surface-variant)]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">schedule</span>
                          {bestOffer.eta}
                        </span>
                        {bestOffer.priceNetto && (
                          <span className="text-xs opacity-60">
                            {bestOffer.priceNetto.toFixed(2).replace('.', ',')} PLN netto
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                    <div>
                      <div className="font-display-bold text-3xl sm:text-4xl text-[var(--color-on-background)] tabular-nums">
                        {bestOffer.priceBrutto.toFixed(2).replace('.', ',')}
                        <span className="text-base font-normal text-[var(--color-on-surface-variant)] ml-1">PLN</span>
                      </div>
                      <div className="text-[11px] text-[var(--color-on-surface-variant)] text-right">brutto</div>
                    </div>
                    <Link
                      href={`/zamowienie/${resolvedQuoteId || bestOffer.carrierId}`}
                      onClick={() => handleOrder(bestOffer)}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-surface-tint)] text-white font-bold text-sm rounded-xl shadow-lg shadow-[var(--color-primary)]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {t.pricing.result.orderNow}
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
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
                  className={`relative rounded-[28px] border bg-white overflow-hidden transition-all duration-300 group ${
                    isCheapest
                      ? 'border-[var(--color-primary)] shadow-[0_4px_24px_rgba(0,82,88,0.1)]'
                      : 'border-[var(--color-divider)] hover:border-[var(--color-primary)]/30 hover:shadow-lg'
                  }`}
                >
                  {isCheapest && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                        {t.quote.results.bestPrice}
                      </div>
                    </div>
                  )}

                  <div className={`p-5 sm:p-6 ${isCheapest ? 'pt-7' : ''}`}>
                    {/* Carrier identity */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] flex items-center justify-center flex-shrink-0 group-hover:border-[var(--color-primary)]/30 transition-colors">
                        <span className="font-display-bold text-sm text-[var(--color-primary)] font-bold">
                          {carrier.carrierCode.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-[var(--color-on-background)] truncate">
                          {carrier.serviceName}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-[var(--color-on-surface-variant)] mt-0.5">
                          <span className="material-symbols-outlined text-[14px] text-[var(--color-primary)]/70">schedule</span>
                          <span>{carrier.eta}</span>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[var(--color-divider)] pt-4">
                      {/* Price + CTA */}
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="font-display-bold text-2xl sm:text-3xl text-[var(--color-on-background)] tabular-nums">
                            {carrier.priceBrutto.toFixed(2).replace('.', ',')}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-[var(--color-on-surface-variant)]">
                            <span>PLN brutto</span>
                            {carrier.priceNetto && (
                              <span className="opacity-50">
                                ({carrier.priceNetto.toFixed(2).replace('.', ',')} netto)
                              </span>
                            )}
                          </div>
                        </div>

                        <Link
                          href={`/zamowienie/${resolvedQuoteId || carrier.carrierId}`}
                          onClick={() => handleOrder(carrier)}
                          className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] ${
                            isCheapest
                              ? 'bg-[var(--color-primary)] hover:bg-[var(--color-surface-tint)] text-white shadow-md shadow-[var(--color-primary)]/20'
                              : 'bg-[var(--color-surface-container)] hover:bg-[var(--color-primary-highlight)] text-[var(--color-on-background)] hover:text-[var(--color-primary)]'
                          }`}
                        >
                          {t.pricing.result.orderNow}
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
          className="mb-14 rounded-[40px] border-2 border-dashed border-[var(--color-divider)] p-16 text-center bg-[var(--color-surface-container-low)]"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-[var(--color-on-surface-variant)]/40">search_off</span>
          </div>
          <h3 className="font-bold text-xl text-[var(--color-on-background)] mb-2">{t.quote.results.noOffersTitle}</h3>
          <p className="text-[var(--color-on-surface-variant)] max-w-md mx-auto mb-8 text-sm">
            {t.quote.results.noOffers}
          </p>
          <Link
            href={editUrl}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-surface-tint)] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
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
          className="mb-14 rounded-[32px] bg-[var(--color-surface-container-low)] border border-[var(--color-divider)] p-6 sm:p-8"
        >
          <h3 className="font-bold text-sm uppercase tracking-[0.15em] text-[var(--color-on-surface-variant)] mb-6">
            {t.quote.results.includesTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-primary-highlight)] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">verified_user</span>
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--color-on-background)]">{t.quote.results.ocpTitle}</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{t.quote.results.ocpDesc}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-primary-highlight)] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">receipt_long</span>
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--color-on-background)]">{t.quote.results.invoiceTitle}</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{t.quote.results.invoiceDesc}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-primary-highlight)] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">local_gas_station</span>
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--color-on-background)]">{t.quote.results.fuelTitle}</div>
                <div className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{t.quote.results.fuelDesc}</div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ==================== CONFIGURATION SUMMARY ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-[32px] bg-white border border-[var(--color-divider)] shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 sm:p-8 pb-0">
          <h2 className="font-bold text-lg text-[var(--color-on-background)] flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-primary)]">tune</span>
            {t.quote.results.config}
          </h2>
          <Link
            href={editUrl}
            className="text-xs font-bold text-[var(--color-primary)] hover:underline uppercase tracking-widest flex items-center gap-1"
          >
            {t.quote.results.edit}
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </Link>
        </div>

        <div className="p-6 sm:p-8 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {/* Pallet type */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">pallet</span>
              </div>
              <div>
                <div className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t.quote.results.palletType}</div>
                <div className="font-bold text-sm text-[var(--color-on-background)]">{palletDisplayName}</div>
              </div>
            </div>

            {/* Pallet count */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">inventory_2</span>
              </div>
              <div>
                <div className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t.quote.results.palletCount}</div>
                <div className="font-bold text-sm text-[var(--color-on-background)]">{palletCount}</div>
              </div>
            </div>

            {/* Weight & dims */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">straighten</span>
              </div>
              <div>
                <div className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t.quote.results.weightDims}</div>
                <div className="font-bold text-sm text-[var(--color-on-background)]">{unitWeight} kg · {length}x{width}x{height} cm</div>
              </div>
            </div>

            {/* Chargeable weight */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">scale</span>
              </div>
              <div>
                <div className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t.quote.results.chargeableWeight}</div>
                <div className="font-bold text-sm text-[var(--color-on-background)]">{chargeableWeight} kg</div>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">route</span>
              </div>
              <div>
                <div className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wider">{t.quote.results.route}</div>
                <div className="font-bold text-sm text-[var(--color-on-background)]">
                  {senderCode} → {recipientCode}{' '}
                  <span className="text-[11px] font-normal text-[var(--color-on-surface-variant)]">
                    ({senderCountryName} → {recipientCountryName})
                  </span>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-lg">checklist</span>
              </div>
              <div>
                <div className="text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">{t.quote.results.conditions}</div>
                {hasSpecialConditions ? (
                  <div className="flex flex-wrap gap-1.5">
                    {stackable && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-md text-[11px] font-bold border border-green-100">
                        {t.quote.results.stackableYes}
                      </span>
                    )}
                    {fragile && (
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md text-[11px] font-bold border border-orange-100">
                        {t.quote.results.fragileYes}
                      </span>
                    )}
                    {adr && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-md text-[11px] font-bold border border-red-100">
                        {t.quote.results.adrYes}
                      </span>
                    )}
                    {(senderPrivate || recipientPrivate) && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold border border-blue-100">
                        {t.quote.results.privateAddressYes}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-[var(--color-on-surface-variant)]">{t.quote.results.noConditions}</span>
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
