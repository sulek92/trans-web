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
  firstName: string | null;
  lastName: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [updatingUserId, setUpdatingUserId] = React.useState<string | null>(null);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { addToast } = useToastStore();

  const API_URL = getApiBaseUrl();

  const fetchUsers = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        credentials: 'include'
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
        },
        credentials: 'include',
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
        },
        credentials: 'include',
        body: JSON.stringify({
          email: editingUser.email,
          role: editingUser.role,
          firstName: editingUser.firstName,
          lastName: editingUser.lastName
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

  const bulkUpdateStatus = async (status: 'ACTIVE' | 'BLOCKED') => {
    if (selectedIds.length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/bulk-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ids: selectedIds, status }),
      });
      if (!response.ok) throw new Error('Failed to bulk update status');

      setUsers((prev) =>
        prev.map((user) =>
          selectedIds.includes(user.id) ? { ...user, status } : user
        )
      );
      setSelectedIds([]);
      addToast({ 
        title: 'Akcja masowa wykonana', 
        description: `Zaktualizowano status ${selectedIds.length} użytkowników na ${status}.`, 
        type: 'success' 
      });
    } catch (err) {
      addToast({ title: 'Błąd', description: 'Nie udało się wykonać akcji masowej.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (userId: string) => {
    setSelectedIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map(u => u.id));
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'BLOCKED': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-[var(--color-surface-container-high)] text-[var(--color-on-background)] border-[var(--color-divider)]';
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.nip || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-xs mb-3 block text-shadow-sm">Administracja</span>
          <h1 className="text-4xl font-bold text-[var(--color-on-background)] mb-2 tracking-tight">Baza Klientów B2B</h1>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl">Centralny system zarządzania kontami firmowymi, uprawnieniami i dostępem do platformy logistycznej.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] group-focus-within:text-[var(--color-primary)] transition-colors">search</span>
          <input 
            type="text"
            placeholder="Szukaj po email, NIP lub firmie..."
            className="w-full pl-12 pr-4 py-4 rounded-[20px] bg-[var(--color-surface-primary)] border border-[var(--color-divider)] outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all shadow-sm font-medium text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-[var(--color-on-background)] text-[var(--color-background)] p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center font-bold text-sm">
              {selectedIds.length}
            </div>
            <div>
              <div className="font-bold">Wybrano użytkowników</div>
              <div className="text-[10px] uppercase font-bold text-[var(--color-background)]/40 tracking-widest">Wybierz akcję dla zaznaczonych rekordów</div>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => bulkUpdateStatus('ACTIVE')}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Aktywuj zaznaczonych
            </button>
            <button 
              onClick={() => bulkUpdateStatus('BLOCKED')}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Zablokuj zaznaczonych
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="px-6 py-3 bg-[var(--color-surface-primary)]/10 hover:bg-[var(--color-surface-primary)]/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      <div className="bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--color-surface-container)]/50 border-b border-[var(--color-divider)]">
                <tr className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-faint)]">
                  <th className="px-8 py-5 w-10">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                      checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-8 py-5">Firma / Podmiot</th>
                  <th className="px-8 py-5">Kontakt & Rola</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Zarządzanie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr 
                    key={u.id} 
                    data-testid="user-row" 
                    data-user-email={u.email}
                    className={`hover:bg-[var(--color-surface-container)]/50 transition-premium group ${selectedIds.includes(u.id) ? 'bg-indigo-50/30' : ''}`}
                  >
                    <td className="px-8 py-6">
                      <input 
                        type="checkbox" 
                        data-testid="user-checkbox"
                        className="w-5 h-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                        checked={selectedIds.includes(u.id)}
                        onChange={() => toggleSelection(u.id)}
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container-high)] text-[var(--color-text-faint)] flex items-center justify-center font-bold text-xs uppercase group-hover:bg-[var(--color-primary-highlight)] group-hover:text-[var(--color-primary)] transition-colors">
                          {u.companyName ? u.companyName.substring(0, 2) : 'OP'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[var(--color-on-background)]">
                            {u.companyName || (u.firstName ? `${u.firstName} ${u.lastName || ''}` : 'Osoba prywatna')}
                          </div>
                          <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest mt-1">NIP: {u.nip || '---'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-medium text-[var(--color-text-muted)]">{u.email}</div>
                      <div className="inline-flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                        <span className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">{u.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span 
                        data-testid="user-status"
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(u.status)}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-surface-primary)] border border-[var(--color-divider)] text-[var(--color-text-faint)] hover:text-[var(--color-on-background)] hover:border-slate-900 transition-all shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          disabled={updatingUserId === u.id}
                          data-testid="status-toggle-btn"
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-on-background)]/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setEditingUser(null)}
        >
          <div 
            className="bg-[var(--color-surface-primary)] rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 border-b border-[var(--color-divider)] flex justify-between items-center bg-[var(--color-surface-container)]/30">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-on-background)]">Edytuj Profil</h2>
                <p className="text-sm text-[var(--color-text-faint)] font-medium">Zarządzaj danymi systemowymi użytkownika.</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="w-10 h-10 flex items-center justify-center bg-[var(--color-surface-primary)] rounded-full text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] shadow-sm border border-[var(--color-divider)]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditUser} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] tracking-widest px-1">Imię</label>
                  <input 
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-primary)] transition-all shadow-inner"
                    value={editingUser.firstName || ''}
                    onChange={e => setEditingUser({...editingUser, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] tracking-widest px-1">Nazwisko</label>
                  <input 
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-primary)] transition-all shadow-inner"
                    value={editingUser.lastName || ''}
                    onChange={e => setEditingUser({...editingUser, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] tracking-widest px-1">Adres E-mail</label>
                <input 
                  type="email"
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-primary)] transition-all shadow-inner"
                  value={editingUser.email}
                  onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[var(--color-text-faint)] tracking-widest px-1">Rola w Systemie</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-sm font-bold outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-primary)] transition-all shadow-inner appearance-none"
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
                  className="flex-1 px-8 py-5 rounded-2xl font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-container)] transition-premium"
                >
                  Anuluj
                </button>
                <button 
                  type="submit"
                  disabled={updatingUserId === editingUser.id}
                  className="flex-[2] px-8 py-5 rounded-2xl bg-[var(--color-on-background)] text-[var(--color-background)] font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-premium disabled:opacity-50 active:scale-95"
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
