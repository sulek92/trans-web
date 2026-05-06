'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [error, setError] = React.useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = React.useState<string | null>(null);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const { addToast } = useToastStore();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchUsers = React.useCallback(async () => {
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
    } catch {
      addToast({ title: 'Błąd', description: 'Nie udało się pobrać listy użytkowników.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, addToast]);

  React.useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'BLOCKED') => {
    const token = getCookie('pb_auth_token');
    setUpdatingUserId(userId);

    try {
      const response = await fetch(`${API_URL}/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update user status');

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status }
            : user,
        ),
      );
      addToast({ title: 'Status zmieniony', description: `Użytkownik został ${status === 'ACTIVE' ? 'aktywowany' : 'zablokowany'}.`, type: 'success' });
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się zmienić statusu użytkownika.', type: 'error' });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    const token = getCookie('pb_auth_token');
    setUpdatingUserId(editingUser.id);
    
    try {
      const response = await fetch(`${API_URL}/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: editingUser.email,
          role: editingUser.role
        }),
      });
      if (response.ok) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
        setEditingUser(null);
        addToast({ title: 'Zapisano', description: 'Dane użytkownika zostały zaktualizowane.', type: 'success' });
      }
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się zapisać zmian.', type: 'error' });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-800';
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'BLOCKED': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditingUser(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="animate-fade-in space-y-8">
      {editingUser && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setEditingUser(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-md min-w-[320px] p-8 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edytuj Użytkownika</h2>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleEditUser} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2 block">Adres Email</label>
                <input 
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[var(--color-primary)] font-bold text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2 block">Rola Systemowa</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[var(--color-primary)] font-bold text-sm"
                >
                  <option value="customer">Klient B2B</option>
                  <option value="admin">Administrator</option>
                  <option value="broker">Broker</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Anuluj
                </button>
                <button 
                  type="submit"
                  disabled={updatingUserId === editingUser.id}
                  className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Zapisz Zmiany
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display-bold text-3xl font-bold text-[var(--color-on-background)] mb-2">Baza Klientów B2B</h1>
          <p className="text-[var(--color-on-surface-variant)]">Zarządzaj kontami firmowymi i ich uprawnieniami.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[var(--color-divider)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-[var(--color-on-surface-variant)]">
                  <th className="px-8 py-5">Firma / NIP</th>
                  <th className="px-8 py-5">Kontakt</th>
                  <th className="px-8 py-5">Rola</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Akcje</th>
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
                    <td className="px-8 py-5 text-sm font-medium uppercase tracking-tight text-slate-500">{u.role}</td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-full ${getStatusStyle(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          disabled={updatingUserId === u.id}
                          onClick={() => updateUserStatus(u.id, u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE')}
                          className={`rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            u.status === 'ACTIVE' 
                              ? 'border-red-200 text-red-700 hover:bg-red-50' 
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          } disabled:opacity-50`}
                        >
                          {u.status === 'ACTIVE' ? 'Zablokuj' : 'Aktywuj'}
                        </button>
                      </div>
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
