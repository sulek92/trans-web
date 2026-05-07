"use client";

import * as React from 'react';
import { getApiBaseUrl } from '@/lib/api-url';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import Image from 'next/image';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  avatarImage: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

const EMPTY_FORM: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  role: '',
  text: '',
  avatar: 'person',
  avatarImage: '',
  isActive: true,
  sortOrder: 0,
};

export default function TestimonialsPage() {
  const [items, setItems] = React.useState<Testimonial[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [uploadingLogo, setUploadingLogo] = React.useState(false);
  const apiUrl = getApiBaseUrl();
  const addToast = useToastStore((state) => state.addToast);

  const fetchAll = async () => {
    const token = getCookie('pb_auth_token');
    const res = await fetch(`${apiUrl}/cms/testimonials`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    }
  };

  React.useEffect(() => {
    fetchAll().finally(() => setLoading(false));
  }, [apiUrl]);

  const saveItem = async () => {
    setSaving(true);
    const token = getCookie('pb_auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const method = editing ? 'PUT' : 'POST';
    const url = editing
      ? `${apiUrl}/cms/testimonials/${editing.id}`
      : `${apiUrl}/cms/testimonials`;

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
        credentials: 'include',
      });
      if (res.ok) {
        addToast({ title: editing ? 'Opinia zaktualizowana' : 'Opinia dodana', type: 'success' });
        setEditing(null);
        setForm(EMPTY_FORM);
        fetchAll();
      } else {
        const err = await res.json();
        addToast({ title: 'Błąd', description: err.message, type: 'error' });
      }
    } catch {
      addToast({ title: 'Błąd sieci', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    const token = getCookie('pb_auth_token');
    const res = await fetch(`${apiUrl}/cms/testimonials/${id}`, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      credentials: 'include',
    });
    if (res.ok) {
      addToast({ title: 'Opinia usunięta', type: 'success' });
      fetchAll();
    }
  };

  const startEdit = (item: Testimonial) => {
    setEditing(item);
    setForm({
      name: item.name,
      role: item.role,
      text: item.text,
      avatar: item.avatar,
      avatarImage: item.avatarImage,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('file', file);

    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${apiUrl}/cms/media/upload`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, avatarImage: data.url }));
        addToast({ title: 'Zdjęcie przesłane', type: 'success' });
      }
    } catch {
      addToast({ title: 'Błąd przesyłania', type: 'error' });
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold">Wczytywanie opinii...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">reviews</span>
            Opinie Klientów
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Zarządzaj opiniami</h1>
        </div>
      </header>

      {/* Form */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--color-primary)]">{editing ? 'edit' : 'add_circle'}</span>
          {editing ? 'Edytuj opinię' : 'Nowa opinia'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Imię i nazwisko</label>
            <input className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="np. Marek Jankowski" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Stanowisko / Firma</label>
            <input className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="np. CEO, E-com Group" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Treść opinii</label>
          <textarea className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all text-sm" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} placeholder="Treść opinii klienta..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ikona (Material Symbol)</label>
            <input className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all text-sm" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="person" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Zdjęcie (avatarImage)</label>
            <div className="flex items-center gap-3">
              {form.avatarImage ? (
                <div className="relative w-12 h-12 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
                  <Image src={form.avatarImage} alt="" fill className="object-cover" sizes="48px" />
                </div>
              ) : null}
              <label className="cursor-pointer inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                <span className="material-symbols-outlined text-sm">{uploadingLogo ? 'progress_activity' : 'upload'}</span>
                {uploadingLogo ? 'Przesyłanie...' : 'Prześlij zdjęcie'}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingLogo} />
              </label>
              {form.avatarImage && (
                <button type="button" onClick={() => setForm({ ...form, avatarImage: '' })} className="text-xs text-red-400 hover:underline">Usuń</button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kolejność</label>
            <input type="number" className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all text-sm" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <div className="font-bold text-sm">Aktywna</div>
            <p className="text-xs text-slate-400 mt-1">Nieaktywne opinie nie będą wyświetlane na stronie.</p>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, isActive: !form.isActive })}
            className={`w-12 h-6 rounded-full relative transition-colors ${form.isActive ? 'bg-[var(--color-primary)]' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${form.isActive ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex gap-4 pt-2">
          <button onClick={saveItem} disabled={saving || !form.name || !form.text} className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">
            <span className="material-symbols-outlined">save</span>
            {saving ? 'Zapisuję...' : editing ? 'Zapisz zmiany' : 'Dodaj opinię'}
          </button>
          {editing && (
            <button onClick={cancelEdit} className="border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">Anuluj</button>
          )}
        </div>
      </section>

      {/* List */}
      <section className="space-y-4">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--color-primary)]">list</span>
          Lista opinii ({items.length})
        </h2>

        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-300 text-sm border-2 border-dashed border-slate-100 rounded-xl">Brak opinii. Dodaj pierwszą opinię powyżej.</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-start gap-4 group hover:border-[var(--color-primary)]/20 transition-colors">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                  {item.avatarImage ? (
                    <Image src={item.avatarImage} alt={item.name} width={56} height={56} className="object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-slate-400 text-2xl">{item.avatar || 'person'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{item.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">{item.role}</span>
                    {!item.isActive && <span className="text-[9px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold">Nieaktywna</span>}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{item.text}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => startEdit(item)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[var(--color-primary)]" title="Edytuj">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button onClick={() => { if (confirm('Usunąć tę opinię?')) deleteItem(item.id); }} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500" title="Usuń">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
