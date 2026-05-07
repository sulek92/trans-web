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
      <div className="max-w-[800px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-24 pb-12 text-center">
          <span className="text-[var(--color-primary)] font-bold tracking-[0.4em] uppercase text-[11px] mb-4 block">{t.tracking.label}</span>
          <h1 className="font-display-bold text-5xl font-bold text-[var(--color-on-background)] mb-4 tracking-tighter">{t.tracking.title}</h1>
          <p className="text-[var(--color-text-muted)] text-lg font-medium max-w-2xl mx-auto leading-relaxed">{t.tracking.subtitle}</p>
        </motion.div>

        <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex gap-4 mb-16 max-w-2xl mx-auto">
          <div className="flex-1 relative group">
             <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">qr_code_scanner</span>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder={t.tracking.placeholder}
              className="w-full pl-14 pr-6 py-5 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-lg outline-none focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] transition-premium shadow-inner text-[var(--color-on-background)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--color-primary)] text-white px-10 py-5 rounded-2xl font-bold hover:scale-[1.02] transition-premium disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/20 active:scale-95"
          >
            <span className="material-symbols-outlined">{loading ? 'hourglass_top' : 'track_changes'}</span>
            {loading ? t.tracking.searching : t.tracking.search}
          </button>
        </motion.form>

        <div className="pb-24">
          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 font-bold text-sm mb-8 animate-shake">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {events.length > 0 && (
            <div className="space-y-0 relative">
              <div className="absolute left-[23px] top-8 bottom-0 w-1 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-divider)] rounded-full opacity-20" />
              {events.map((event, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex gap-8 pb-10 relative group">
                  <div className={`w-12 h-12 rounded-2xl ${statusColor(event.internalStatus)} flex items-center justify-center flex-shrink-0 z-10 shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-white text-2xl">
                      {['delivered', 'completed'].includes(event.internalStatus.toLowerCase()) ? 'done_all' : 
                       ['cancelled', 'error'].includes(event.internalStatus.toLowerCase()) ? 'close' : 'local_shipping'}
                    </span>
                  </div>
                  <div className="bg-[var(--color-surface-primary)] rounded-[32px] p-8 border border-[var(--color-divider)] shadow-sm flex-1 group-hover:border-[var(--color-primary)]/20 transition-premium">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-2">
                           <h3 className="font-bold text-xl tracking-tight text-[var(--color-on-background)]">{statusLabel(event.internalStatus)}</h3>
                           <span className="px-3 py-1 bg-[var(--color-surface-container)] rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-faint)]">{event.carrierStatus}</span>
                        </div>
                        <p className="text-[var(--color-text-muted)] font-medium leading-relaxed">{event.carrierDescription || event.carrierStatus}</p>
                        {event.location && <p className="text-xs text-[var(--color-text-faint)] mt-4 flex items-center gap-2 font-bold uppercase tracking-widest bg-[var(--color-surface-container)] w-fit px-3 py-1.5 rounded-lg"><span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">location_on</span> {event.location}</p>}
                      </div>
                      <span className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-[0.2em] bg-[var(--color-surface-container)] px-4 py-2 rounded-xl h-fit border border-[var(--color-divider)]">
                        {new Date(event.occurredAt).toLocaleString(locale === 'pl' ? 'pl-PL' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {searched && events.length === 0 && !error && !loading && (
            <div className="text-center p-20 bg-[var(--color-surface-container)] rounded-[48px] border border-dashed border-[var(--color-divider)]">
              <span className="material-symbols-outlined text-7xl text-[var(--color-text-faint)] mb-6 block opacity-20">inventory_2</span>
              <p className="text-[var(--color-on-background)] font-bold text-2xl tracking-tight">{t.tracking.noEvents}</p>
              <p className="text-[var(--color-text-faint)] text-lg mt-2 font-medium">{t.tracking.checkNumber}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
