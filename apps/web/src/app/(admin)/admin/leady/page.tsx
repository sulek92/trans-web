'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  description: string;
  status: string;
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  React.useEffect(() => {
    const fetchLeads = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const response = await fetch(`${API_URL}/leads`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch leads');
        const data = await response.json();
        setLeads(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        // Mock data for demo
        setLeads([
          { 
            id: 'LD-102', 
            name: 'Marek Wiśniewski', 
            email: 'marek@global.com',
            company: 'Global Logistics', 
            description: 'Szukam stałej współpracy na trasach DE-PL...', 
            status: 'NEW', 
            createdAt: new Date().toISOString() 
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchLeads();
  }, [API_URL]);

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
      
      // Update local state
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    } catch (err: unknown) {
      alert(`Błąd: ${getErrorMessage(err)}`);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}
      <div>
        <h1 className="font-display-bold text-3xl font-bold text-[var(--color-on-background)] mb-2">Zapytania i Leady</h1>
        <p className="text-[var(--color-on-surface-variant)]">Zarządzaj wiadomościami od potencjalnych klientów i zapytaniami ofertowymi.</p>
      </div>

      {isLoading ? (
        <div className="p-20 text-center text-slate-400 font-bold">Ładowanie zapytań...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {leads.map((l) => (
            <div key={l.id} className="bg-white p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm hover:shadow-md transition-premium">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${getStatusStyle(l.status)}`}>
                      {l.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest">{new Date(l.createdAt).toLocaleString('pl-PL')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-on-background)] mb-1">{l.name}</h3>
                  <div className="text-sm text-[var(--color-primary)] font-bold mb-4">{l.company || 'Osoba prywatna'} ({l.email})</div>
                  <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                    &ldquo;{l.description}&rdquo;
                  </p>
                </div>
                <div className="shrink-0 flex flex-row md:flex-col gap-3 justify-end">
                  {l.status === 'NEW' && (
                    <button 
                      onClick={() => updateStatus(l.id, 'IN_PROGRESS')}
                      className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[var(--color-surface-tint)] transition-premium flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">rocket_launch</span>
                      Przejmij lead
                    </button>
                  )}
                  {l.status === 'IN_PROGRESS' && (
                    <button 
                      onClick={() => updateStatus(l.id, 'CLOSED')}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-premium flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Zamknij (Sukces)
                    </button>
                  )}
                  <button className="bg-white border border-[var(--color-divider)] text-[var(--color-on-surface-variant)] px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-premium flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    Napisz e-mail
                  </button>
                </div>
              </div>
            </div>
          ))}
          {leads.length === 0 && (
            <div className="p-20 text-center text-slate-300 border-2 border-dashed border-slate-100 rounded-3xl">Brak nowych zapytań.</div>
          )}
        </div>
      )}
    </div>
  );
}
