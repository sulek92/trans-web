'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api-url';
import { Skeleton } from '@/components/ui/skeleton';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  actorEmail: string | null;
  metadata: unknown;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);

  const API_URL = getApiBaseUrl();

  React.useEffect(() => {
    const fetchLogs = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const res = await fetch(`${API_URL}/admin/audit-log?limit=200`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const parsed = (await res.json()) as AuditLog[];
          setLogs(parsed);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchLogs();
  }, [API_URL]);

  if (isLoading) return <div className="p-10 space-y-4"><Skeleton className="h-10 w-64"/><Skeleton className="h-96 w-full"/></div>;

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-2">Logi Systemowe</h1>
          <p className="text-[var(--color-on-surface-variant)]">Szczegółowa historia zmian i aktywności w platformie.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[var(--color-surface-primary)] rounded-[32px] border border-[var(--color-divider)] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-container)] border-b border-[var(--color-divider)]">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-faint)]">Data</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-faint)]">Użytkownik</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-faint)]">Akcja</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-faint)]">Encja</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-divider)]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--color-surface-container)] transition-colors group cursor-pointer" onClick={() => setSelectedLog(log)}>
                    <td className="px-6 py-4 text-xs font-medium text-[var(--color-text-muted)]">
                      {new Date(log.createdAt).toLocaleString('pl-PL')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[var(--color-on-background)]">{log.actorEmail ?? 'system'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md text-[10px] font-bold uppercase">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--color-text-muted)] font-medium">
                      {log.entityType} ({(log.entityId ?? 'brak').slice(0, 8)}...)
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="material-symbols-outlined text-[var(--color-text-faint)] group-hover:text-[var(--color-primary)] transition-colors">chevron_right</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--color-on-background)] rounded-[32px] p-8 text-[var(--color-background)] shadow-2xl h-full min-h-[400px] sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400">analytics</span>
              Szczegóły Zmian
            </h2>
            
            {selectedLog ? (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="text-[10px] font-bold text-[var(--color-background)]/40 uppercase tracking-widest mb-1">Metadane i Diff</div>
                  <pre className="bg-black/50 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto text-emerald-400 border border-white/5">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
                <div className="p-4 bg-[var(--color-surface-primary)]/5 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-bold text-[var(--color-background)]/40 uppercase tracking-widest mb-2">Kontekst Wykonania</div>
                  <div className="text-xs space-y-2">
                    <p><span className="text-[var(--color-background)]/40">ID Logu:</span> {selectedLog.id}</p>
                    <p><span className="text-[var(--color-background)]/40">Typ Obiektu:</span> {selectedLog.entityType}</p>
                    <p><span className="text-[var(--color-background)]/40">Data:</span> {new Date(selectedLog.createdAt).toISOString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[var(--color-background)]/20 p-10">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-10">data_object</span>
                <p className="text-sm italic">Wybierz wpis z listy, aby zobaczyć szczegóły zmian (JSON diff).</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
