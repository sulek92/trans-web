"use client";

import React from 'react';
import { getApiBaseUrl } from '@/lib/api-url';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';

type MediaItem = { 
  url: string; 
  fileName: string; 
  size: number; 
  updatedAt: string;
};

export default function CmsMediaPage() {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const apiUrl = getApiBaseUrl();
  const addToast = useToastStore((state) => state.addToast);

  const fetchMedia = async () => {
    try {
      const token = getCookie('pb_auth_token');
      const res = await fetch(`${apiUrl}/cms/media`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMedia();
  }, [apiUrl]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${apiUrl}/cms/media/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        addToast({ title: 'Przesłano pomyślnie', type: 'success' });
        fetchMedia();
      } else {
        const err = await res.json();
        addToast({ title: 'Błąd przesyłania', description: err.message, type: 'error' });
      }
    } catch {
      addToast({ title: 'Błąd sieci', type: 'error' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onDelete = async (url: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten plik?')) return;

    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${apiUrl}/cms/media`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ url }),
        credentials: 'include',
      });

      if (res.ok) {
        addToast({ title: 'Usunięto plik', type: 'success' });
        setItems(prev => prev.filter(item => item.url !== url));
      } else {
        addToast({ title: 'Nie udało się usunąć', type: 'error' });
      }
    } catch {
      addToast({ title: 'Błąd sieci', type: 'error' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({ title: 'Skopiowano URL', description: 'Możesz teraz wkleić go w edytorze CMS.', type: 'info' });
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold">Wczytywanie biblioteki...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">image_library</span>
            Zasoby graficzne
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Biblioteka Mediów</h1>
        </div>

        <label className="relative flex items-center justify-center gap-3 bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all active:scale-95 cursor-pointer shadow-xl shadow-[var(--color-primary)]/20">
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined">upload_file</span>
          )}
          {uploading ? 'Przesyłanie...' : 'Wgraj nowe zdjęcie'}
          <input type="file" className="hidden" accept="image/*" onChange={onUpload} disabled={uploading} />
        </label>
      </header>

      {items.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-24 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <span className="material-symbols-outlined text-4xl">image_not_supported</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Brak mediów w bibliotece</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-lg">Wgraj pierwsze zdjęcia, aby móc z nich korzystać przy tworzeniu treści na stronie.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {items.map((m) => (
            <div key={m.fileName} className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
              {/* Image Preview Container */}
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={m.url} 
                  alt={m.fileName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                  <button 
                    onClick={() => copyToClipboard(m.url)}
                    className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-[0ms]"
                    title="Kopiuj URL"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                  <button 
                    onClick={() => onDelete(m.url)}
                    className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-[50ms]"
                    title="Usuń plik"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-4 space-y-1">
                <p className="text-xs font-bold text-slate-900 truncate" title={m.fileName}>{m.fileName}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>{(m.size / 1024).toFixed(1)} KB</span>
                  <span>{new Date(m.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Usage Tip */}
      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined">lightbulb</span>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-blue-900">Jak używać biblioteki?</h4>
          <p className="text-sm text-blue-700 leading-relaxed">Skopiuj URL wybranego zdjęcia za pomocą przycisku na karcie, a następnie wklej go w odpowiednie pole w edytorze CMS (np. zdjęcie Hero lub avatar klienta).</p>
        </div>
      </div>
    </div>
  );
}
