"use client";

import * as React from 'react';
import Link from 'next/link';
import { getApiBaseUrl } from '@/lib/api-url';
import { getCookie } from '@/lib/utils';

type ArticleSummary = {
  slug: string;
  title: string;
  category?: string;
  excerpt?: string;
  isPublished?: boolean;
  updatedAt?: string;
  publishedAt?: string;
};

export default function CmsArticlesIndex() {
  const [articles, setArticles] = React.useState<ArticleSummary[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/cms/articles`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setArticles(data.map((a: any) => ({
              slug: a.slug,
              title: a.title,
              category: a.category,
              excerpt: a.excerpt,
              isPublished: a.isPublished,
              updatedAt: a.updatedAt,
              publishedAt: a.publishedAt,
            })));
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const deleteArticle = async (slug: string) => {
    if (!confirm(`Czy chcesz usunąć artykuł: ${slug}?`)) return;
    try {
      const token = getCookie('pb_auth_token');
      const resp = await fetch(`${getApiBaseUrl()}/cms/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      if (resp.ok) {
        setArticles((prev) => prev.filter((a) => a.slug !== slug));
      } else {
        alert('Nie udało się usunąć artykułu.');
      }
    } catch {
      alert('Błąd sieci. Spróbuj ponownie.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">article</span>
            Zarządzanie treścią
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Artykuły i Blog</h1>
          <p className="text-slate-500 text-lg">Publikuj aktualności, poradniki i artykuły eksperckie.</p>
        </div>

        <Link
          href="/admin/cms/articles/new"
          className="inline-flex items-center gap-3 bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all active:scale-95 shadow-xl shadow-[var(--color-primary)]/20"
        >
          <span className="material-symbols-outlined">add</span>
          Nowy artykuł
        </Link>
      </header>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold">Ładowanie artykułów...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-24 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <span className="material-symbols-outlined text-4xl">post_add</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Brak artykułów</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-lg">Dodaj pierwszy artykuł, aby zacząć budować centrum wiedzy dla klientów.</p>
          </div>
          <Link
            href="/admin/cms/articles/new"
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Utwórz pierwszy artykuł
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((a) => (
            <div key={a.slug} className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900 truncate">{a.title}</h3>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    a.isPublished
                      ? 'bg-green-50 text-green-600 border border-green-100'
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {a.isPublished ? 'Opublikowany' : 'Szkic'}
                  </span>
                  {a.category && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                      {a.category}
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-400">slug: {a.slug}</div>
                {a.excerpt && (
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{a.excerpt}</p>
                )}
                <div className="text-[10px] text-slate-400 font-medium">
                  {a.isPublished && a.publishedAt
                    ? `Opublikowano: ${new Date(a.publishedAt).toLocaleDateString('pl-PL')}`
                    : `Zaktualizowano: ${a.updatedAt ? new Date(a.updatedAt).toLocaleDateString('pl-PL') : '—'}`}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/cms/articles/edit/${encodeURIComponent(a.slug)}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edytuj
                </Link>
                <button
                  onClick={() => deleteArticle(a.slug)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
