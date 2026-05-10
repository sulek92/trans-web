'use client';

import * as React from 'react';
import { getApiBaseUrl } from '@/lib/api-url';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = React.useState<Subscriber[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [stats, setStats] = React.useState({ total: 0, active: 0 });
  const [newEmail, setNewEmail] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const fetchSubscribers = React.useCallback(async () => {
    try {
      const token = getCookie('pb_auth_token');
      const url = search
        ? `${getApiBaseUrl()}/newsletter/subscribers?search=${encodeURIComponent(search)}`
        : `${getApiBaseUrl()}/newsletter/subscribers`;
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(url, { headers, credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    }
  }, [search]);

  const fetchStats = React.useCallback(async () => {
    try {
      const token = getCookie('pb_auth_token');
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${getApiBaseUrl()}/newsletter/subscribers/stats`, { headers, credentials: 'include' });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([fetchSubscribers(), fetchStats()]).finally(() => setLoading(false));
  }, [fetchSubscribers, fetchStats]);

  const handleAdd = async () => {
    const email = newEmail.trim();
    if (!email || !email.includes('@')) {
      addToast({ title: 'Błąd', description: 'Podaj prawidłowy adres e-mail.', type: 'error' });
      return;
    }
    setAdding(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        addToast({ title: 'Dodano', description: `Subskrybent ${email} został dodany.`, type: 'success' });
        setNewEmail('');
        fetchSubscribers();
        fetchStats();
      } else {
        addToast({ title: 'Błąd', description: 'Nie udało się dodać subskrybenta.', type: 'error' });
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Wystąpił błąd sieci.', type: 'error' });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Usunąć subskrybenta: ${email}?`)) return;
    try {
      const token = getCookie('pb_auth_token');
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${getApiBaseUrl()}/newsletter/subscribers/${id}`, { method: 'DELETE', headers, credentials: 'include' });
      if (res.ok) {
        addToast({ title: 'Usunięto', description: `Subskrybent ${email} został usunięty.`, type: 'success' });
        fetchSubscribers();
        fetchStats();
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Nie udało się usunąć subskrybenta.', type: 'error' });
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Newsletter – Subskrybenci</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Szukaj po email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-sm outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Wszystkich', value: stats.total, color: 'bg-blue-500' },
          { label: 'Aktywnych', value: stats.active, color: 'bg-emerald-500' },
          { label: 'Nieaktywnych', value: stats.total - stats.active, color: 'bg-slate-400' },
          { label: 'W tym miesiącu', value: subscribers.filter(s => {
            const d = new Date(s.createdAt);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[var(--color-surface-primary)] p-6 rounded-2xl border border-[var(--color-divider)] shadow-sm">
            <div className={`w-3 h-3 rounded-full ${stat.color} mb-3`} />
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-xs font-bold text-[var(--color-text-faint)] uppercase mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      <div className="bg-[var(--color-surface-primary)] p-6 rounded-2xl border border-[var(--color-divider)] shadow-sm">
        <h3 className="font-bold text-lg mb-4">Dodaj subskrybenta ręcznie</h3>
        <div className="flex gap-3">
          <input
            type="email"
            placeholder="adres@email.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] outline-none focus:border-[var(--color-primary)]"
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="bg-[var(--color-primary)] text-[var(--color-background)] px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50"
          >
            {adding ? 'Dodaję...' : 'Dodaj'}
          </button>
        </div>
      </div>

      {/* Subscribers list */}
      <div className="bg-[var(--color-surface-primary)] rounded-2xl border border-[var(--color-divider)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[var(--color-text-faint)] font-bold">Ładowanie...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-text-faint)]">Brak subskrybentów{search ? ' dla podanego wyszukiwania' : ''}.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-divider)] bg-[var(--color-surface-container)]/50">
                <th className="text-left p-4 text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">Email</th>
                <th className="text-left p-4 text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">Status</th>
                <th className="text-left p-4 text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">Data zapisu</th>
                <th className="text-right p-4 text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-[var(--color-surface-container)]/30 transition-colors">
                  <td className="p-4 font-medium">{s.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${s.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-[var(--color-surface-container-high)] text-[var(--color-text-faint)]'}`}>
                      {s.isActive ? 'Aktywny' : 'Nieaktywny'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[var(--color-text-muted)]">{new Date(s.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(s.id, s.email)} className="text-red-500 hover:text-red-700 font-bold text-sm">
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
