'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiBaseUrl } from '@/lib/api-url';

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
  const [updatingUserId, setUpdatingUserId] = React.useState<string | null>(null);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const { addToast } = useToastStore();

  const API_URL = getApiBaseUrl();

  const fetchUsers = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
          user.id === userId ? { ...user, status } : user
        )
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
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'BLOCKED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Administracja</span>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Klienci B2B</h1>
          <p className="text-slate-500 text-lg">Zarządzaj kontami firmowymi, rolami i dostępem do platformy.</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <th className="px-8 py-5">Firma / Podmiot</th>
                  <th className="px-8 py-5">Kontakt & Rola</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Zarządzanie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-premium group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs uppercase group-hover:bg-[var(--color-primary-highlight)] group-hover:text-[var(--color-primary)] transition-colors">
                          {u.companyName ? u.companyName.substring(0, 2) : 'OP'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{u.companyName || 'Osoba prywatna'}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">NIP: {u.nip || '---'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-medium text-slate-700">{u.email}</div>
                      <div className="inline-flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          disabled={updatingUserId === u.id}
                          onClick={() => updateUserStatus(u.id, u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE')}
                          className={`h-10 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                            u.status === 'ACTIVE' 
                              ? 'border-red-100 text-red-600 hover:bg-red-50' 
                              : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                          } disabled:opacity-50`}
                        >
                          {updatingUserId === u.id ? '...' : u.status === 'ACTIVE' ? 'Zablokuj' : 'Aktywuj'}
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

      {/* Edit Modal */}
      {editingUser && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setEditingUser(null)}
        >
          <div 
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Edytuj Profil</h2>
                <p className="text-sm text-slate-400 font-medium">Zarządzaj danymi systemowymi użytkownika.</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditUser} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Adres E-mail</label>
                <input 
                  type="email"
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner"
                  value={editingUser.email}
                  onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-1">Rola w Systemie</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all shadow-inner appearance-none"
                  value={editingUser.role}
                  onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="customer">Klient Biznesowy</option>
                  <option value="broker">Broker / Agent</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex gap-6 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-8 py-5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-premium"
                >
                  Anuluj
                </button>
                <button 
                  type="submit"
                  disabled={updatingUserId === editingUser.id}
                  className="flex-[2] px-8 py-5 rounded-2xl bg-slate-900 text-white font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-premium disabled:opacity-50 active:scale-95"
                >
                  {updatingUserId === editingUser.id ? 'Zapisywanie...' : 'Zapisz Zmiany'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
