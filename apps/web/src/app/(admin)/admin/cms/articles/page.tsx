"use client";

import * as React from 'react';
import Link from 'next/link';
import { getApiBaseUrl } from '@/lib/api-url';
import { useToastStore } from '@/lib/store/toast-store';

type ArticleItem = { 
  slug: string; 
  title: string; 
  category?: string; 
  isPublished?: boolean;
  updatedAt: string;
};

export default function CmsArticlesPage() {
  const [items, setItems] = React.useState<ArticleItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const addToast = useToastStore((state) => state.addToast);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/cms/articles`);
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
    fetchArticles();
  }, []);

  const onDelete = async (slug: string) => {
    if (!confirm(`Czy chcesz usunąć artykuł: ${slug}?`)) return;
    
    try {
      const res = await fetch(`${getApiBaseUrl()}/cms/articles/${slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        addToast({ title: 'Artykuł usunięty', type: 'success' });
        setItems((prev) => prev.filter((a) => a.slug !== slug));
      } else {
        addToast({ title: 'Nie udało się usunąć artykułu', type: 'error' });
      }
    } catch {
      addToast({ title: 'Błąd połączenia', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold">Wczytywanie artykułów...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">article</span>
            Aktualności i Poradniki
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Artykuły i Blog</h1>
        </div>

        <Link 
          href="/admin/cms/articles/edit/new" 
          className="flex items-center justify-center gap-3 bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all active:scale-95 shadow-xl shadow-[var(--color-primary)]/20"
        >
          <span className="material-symbols-outlined">add</span>
          Nowy artykuł
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-[40px] p-24 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <span className="material-symbols-outlined text-4xl">post_add</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Brak artykułów</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-lg">Twój blog jest jeszcze pusty. Dodaj pierwszy artykuł, aby przyciągnąć klientów.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-6">Tytuł</th>
                <th className="px-6 py-6">Kategoria</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-6 py-6 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((a) => (
                <tr key={a.slug} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900">{a.title}</div>
                      <div className="text-xs text-slate-400">slug: {a.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-slate-500">
                    {a.category || '—'}
                  </td>
                  <td className="px-6 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${a.isPublished ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${a.isPublished ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                      {a.isPublished ? 'Opublikowany' : 'Szkic'}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right flex items-center justify-end gap-4">
                    <Link 
                      href={`/admin/cms/articles/edit/${a.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline"
                    >
                      Edytuj <span className="material-symbols-outlined text-sm">edit</span>
                    </Link>
                    <button 
                      onClick={() => onDelete(a.slug)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:underline"
                    >
                      Usuń <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
