'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  role: string;
  companyName: string | null;
  nip: string | null;
  status: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  React.useEffect(() => {
    const fetchUsers = async () => {
      const token = getCookie('pb_auth_token');
      try {
        const response = await fetch(`${API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        // Mock data for demo
        setUsers([
          { id: '1', nip: '5252223334', companyName: 'Global Logistics Sp. z o.o.', email: 'logistyka@global.pl', status: 'ACTIVE', role: 'customer' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUsers();
  }, [API_URL]);

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-800';
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'BLOCKED': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display-bold text-3xl font-bold text-[var(--color-on-background)] mb-2">Baza Klientów B2B</h1>
          <p className="text-[var(--color-on-surface-variant)]">Zarządzaj kontami firmowymi i ich uprawnieniami.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-divider)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-slate-400 font-bold">Ładowanie bazy klientów...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-[var(--color-on-surface-variant)]">
                  <th className="px-8 py-5">Firma / NIP</th>
                  <th className="px-8 py-5">Kontakt</th>
                  <th className="px-8 py-5">Rola</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-divider)]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-[var(--color-on-background)]">{u.companyName || 'Osoba prywatna'}</div>
                      <div className="text-xs text-[var(--color-on-surface-variant)] mt-1 font-data-mono">NIP: {u.nip || 'N/A'}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm text-[var(--color-on-surface-variant)]">{u.email}</div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium">{u.role}</td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full ${getStatusStyle(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-[var(--color-primary)] font-bold text-xs hover:underline">Zarządzaj</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
