'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  description: string;
  route: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [savingNotesId, setSavingNotesId] = React.useState<string | null>(null);
  const { addToast } = useToastStore();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchLeads = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać leadów.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, addToast]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchLeads();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchLeads]);

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-800';
      case 'CLOSED': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/leads/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      addToast({ title: 'Status zaktualizowany', description: `Lead został zmieniony na ${newStatus}`, type: 'success' });
    } catch (err: unknown) {
      addToast({ title: 'Błąd', description: getErrorMessage(err), type: 'error' });
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    setSavingNotesId(id);
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/leads/${id}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes })
      });
      if (response.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, notes } : l));
        addToast({ title: 'Zapisano', description: 'Notatki zostały zaktualizowane.', type: 'success' });
      }
    } catch {
      addToast({ title: 'Błąd zapisu', description: 'Nie udało się zapisać notatki.', type: 'error' });
    } finally {
      setSavingNotesId(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display-bold text-3xl font-bold text-[var(--color-on-background)] mb-2">Zapytania i Leady</h1>
          <p className="text-[var(--color-on-surface-variant)]">Zarządzaj wiadomościami od potencjalnych klientów i zapytaniami ofertowymi.</p>
        </div>
        <button 
          onClick={async () => {
            const token = getCookie('pb_auth_token');
            const res = await fetch(`${API_URL}/leads/export/csv`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'leady.csv';
              a.click();
              addToast({ title: 'Eksport zakończony', description: 'Plik CSV został pobrany.', type: 'success' });
            }
          }}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-[var(--color-divider)] rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-premium shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Eksport CSV
        </button>
      </div>

      {isLoading ? (
        <div className="p-20 text-center text-slate-400 font-bold">Ładowanie zapytań...</div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {leads.map((l) => (
            <div key={l.id} className="bg-white rounded-[32px] border border-[var(--color-divider)] shadow-sm hover:shadow-md transition-premium overflow-hidden">
              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                <div className="flex-1 p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full ${getStatusStyle(l.status)}`}>
                      {l.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest">{new Date(l.createdAt).toLocaleString('pl-PL')}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-on-background)] mb-1">{l.name}</h3>
                  <div className="text-sm text-[var(--color-primary)] font-bold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">corporate_fare</span>
                    {l.company || 'Osoba prywatna'} • {l.email}
                  </div>
                  <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    {l.phone ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium">
                        <span className="material-symbols-outlined text-sm">call</span>
                        {l.phone}
                      </span>
                    ) : null}
                    {l.route ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium">
                        <span className="material-symbols-outlined text-sm">route</span>
                        {l.route}
                      </span>
                    ) : null}
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">Wiadomość od klienta</div>
                    <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed italic">
                      &ldquo;{l.description}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="w-full lg:w-96 p-8 lg:p-10 bg-slate-50/50 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1 flex justify-between">
                        Notatki wewnętrzne
                        {savingNotesId === l.id && <span className="animate-spin material-symbols-outlined text-xs">progress_activity</span>}
                      </label>
                      <textarea 
                        defaultValue={l.notes || ''}
                        onBlur={(e) => updateNotes(l.id, e.target.value)}
                        placeholder="Wpisz notatki handlowe..."
                        className="w-full min-h-[120px] bg-white border border-slate-200 rounded-2xl p-4 text-xs outline-none focus:border-[var(--color-primary)] transition-all resize-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col gap-3">
                    {l.status === 'NEW' && (
                      <button 
                        onClick={() => updateStatus(l.id, 'IN_PROGRESS')}
                        className="bg-slate-900 text-white w-full py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-premium flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10"
                      >
                        <span className="material-symbols-outlined text-sm">rocket_launch</span>
                        Przejmij lead
                      </button>
                    )}
                    {l.status === 'IN_PROGRESS' && (
                      <button 
                        onClick={() => updateStatus(l.id, 'CLOSED')}
                        className="bg-emerald-600 text-white w-full py-4 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-premium flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/10"
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Zamknij (Sukces)
                      </button>
                    )}
                    <a 
                      href={`mailto:${l.email}`}
                      className="bg-white border border-slate-200 text-slate-600 w-full py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-premium flex items-center justify-center gap-3"
                    >
                      <span className="material-symbols-outlined text-sm">mail</span>
                      Napisz e-mail
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {leads.length === 0 && (
            <div className="p-20 text-center text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl font-bold">Brak nowych zapytań w bazie.</div>
          )}
        </div>
      )}
    </div>
  );
}
