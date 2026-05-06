'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import Link from 'next/link';

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  actorEmail: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export default function AdminSettingsPage() {
  const [logs, setLogs] = React.useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  React.useEffect(() => {
    const fetchLogs = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const response = await fetch(`${API_URL}/admin/audit-log?limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) setLogs(await response.json());
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchLogs();
  }, [API_URL]);

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display-bold text-3xl font-bold text-[var(--color-on-background)] mb-2">Ustawienia i System</h1>
          <p className="text-[var(--color-on-surface-variant)]">Logi zdarzeń, status usług i konfiguracja zaawansowana.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/cms?section=global-settings" className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-sm">settings</span>
            Ustawienia Globalne CMS
          </Link>
          <Link href="/admin/wyglad" className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-sm">palette</span>
            Edytor Wyglądu
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* System Health */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              Status Systemu
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Baza Danych (PostgreSQL)', status: 'Online', color: 'text-emerald-600' },
                { label: 'Cache (Redis)', status: 'Online', color: 'text-emerald-600' },
                { label: 'API Gateway (NestJS)', status: 'v1.2.4', color: 'text-blue-600' },
                { label: 'Prerender Engine (Next.js)', status: 'Active', color: 'text-emerald-600' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl text-xs font-bold">
                  <span className="text-slate-500">{s.label}</span>
                  <span className={s.color}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-[32px] shadow-xl text-white space-y-4">
            <div className="flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined">info</span>
              Informacja
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Konfiguracja marż i reguł cennika znajduje się teraz w dedykowanej sekcji <strong>Cennik</strong> w menu bocznym.
            </p>
          </div>
        </div>

        {/* Audit Log */}
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold">Ostatnie działania (Audit Log)</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ostatnie 10 zdarzeń</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-[10px] uppercase font-bold text-slate-400">
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Użytkownik</th>
                  <th className="px-6 py-4">Działanie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={3} className="p-10 text-center text-slate-300">Ładowanie logów...</td></tr>
                ) : logs.map((log, index) => {
                  const rowKey =
                    (typeof log.id === 'string' && log.id.trim().length > 0)
                      ? log.id
                      : `${log.createdAt}-${log.action}-${log.actorEmail ?? 'unknown'}-${index}`;
                  return (
                  <tr key={rowKey} className="text-sm">
                    <td className="px-6 py-4 text-slate-500">{new Date(log.createdAt).toLocaleString('pl-PL')}</td>
                    <td className="px-6 py-4 font-medium">{log.actorEmail}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
                })}
                {!isLoading && logs.length === 0 && (
                  <tr><td colSpan={3} className="p-10 text-center text-slate-300 italic">Brak zarejestrowanych działań.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
