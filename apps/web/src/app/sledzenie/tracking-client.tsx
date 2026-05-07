'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { getApiBaseUrl } from '@/lib/api-url';
import { useTranslation } from '@/lib/i18n/i18n-context';

interface TrackingEvent {
  internalStatus: string;
  carrierStatus: string;
  carrierDescription: string;
  location: string;
  occurredAt: string;
}

export const TrackingClient = () => {
  const { t, locale } = useTranslation();
  const [orderNumber, setOrderNumber] = React.useState('');
  const [events, setEvents] = React.useState<TrackingEvent[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searched, setSearched] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setEvents([]);
    setSearched(true);

    try {
      const res = await fetch(`${getApiBaseUrl()}/orders/track/${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        throw new Error(t.tracking.notFound);
      }
      const data = await res.json();
      setEvents(Array.isArray(data?.events) ? data.events : Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.tracking.searchError);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (s: string): string => {
    return (t.tracking.status as Record<string, string>)[s] || s;
  };

  const statusColor = (s: string): string => {
    const map: Record<string, string> = {
      delivered: 'bg-emerald-500',
      in_transit: 'bg-blue-500',
      pickup: 'bg-amber-500',
      confirmed: 'bg-purple-500',
      paid: 'bg-cyan-500',
      cancelled: 'bg-red-500',
    };
    return map[s] || 'bg-slate-400';
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-[900px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-24 pb-12 text-center">
          <span className="text-[var(--color-primary)] font-bold tracking-[0.3em] uppercase text-[11px] mb-4 block">{t.tracking.label}</span>
          <h1 className="font-display-bold text-5xl font-bold text-[var(--color-on-background)] mb-4 tracking-tight">{t.tracking.title}</h1>
          <p className="text-[var(--color-on-surface-variant)] text-lg opacity-80 max-w-2xl mx-auto">{t.tracking.subtitle}</p>
        </motion.div>

        <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex gap-3 mb-12 max-w-2xl mx-auto">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder={t.tracking.placeholder}
            className="flex-1 p-5 rounded-2xl bg-white border-2 border-slate-100 text-lg outline-none focus:border-[var(--color-primary)] transition-colors shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--color-primary)] text-white px-8 py-5 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined">{loading ? 'hourglass_top' : 'search'}</span>
            {loading ? t.tracking.searching : t.tracking.search}
          </button>
        </motion.form>

        <div className="pb-24">
          {error && (
            <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm mb-8">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {events.length > 0 && (
            <div className="space-y-0 relative">
              <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-slate-200" />
              {events.map((event, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex gap-6 pb-8 relative">
                  <div className={`w-12 h-12 rounded-full ${statusColor(event.internalStatus)} flex items-center justify-center flex-shrink-0 z-10 shadow-md`}>
                    <span className="material-symbols-outlined text-white text-xl">local_shipping</span>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">{statusLabel(event.internalStatus)}</h3>
                        <p className="text-slate-500 mt-1">{event.carrierDescription || event.carrierStatus}</p>
                        {event.location && <p className="text-xs text-slate-400 mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> {event.location}</p>}
                      </div>
                      <span className="text-xs text-slate-400 whitespace-nowrap mt-1">
                        {new Date(event.occurredAt).toLocaleString(locale === 'pl' ? 'pl-PL' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {searched && events.length === 0 && !error && !loading && (
            <div className="text-center p-16">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">inventory_2</span>
              <p className="text-slate-400 font-bold text-lg">{t.tracking.noEvents}</p>
              <p className="text-slate-300 text-sm mt-2">{t.tracking.checkNumber}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
