"use client";

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-url';

type CmsPage = {
  slug: string;
  title?: string;
  content?: string;
  isPublished?: boolean;
};

async function fetchPage(slug: string): Promise<CmsPage | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/cms/pages/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data as CmsPage;
  } catch {
    return null;
  }
}

async function updatePage(slug: string, payload: Partial<CmsPage>) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/cms/pages/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default function CmsPageEditor() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const router = useRouter();
  const [page, setPage] = React.useState<CmsPage | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [published, setPublished] = React.useState<boolean>(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const p = await fetchPage(slug);
      if (p) {
        setPage(p);
        setTitle(p.title ?? '');
        setContent(p.content ?? '');
        setPublished(!!p.isPublished);
      }
      setLoading(false);
    };
    if (slug) load();
  }, [slug]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const ok = await updatePage(slug, { title, content, isPublished: published });
    setSaving(false);
    if (ok) {
      router.push('/admin/cms/pages');
    } else {
      setError('Wystąpił błąd podczas aktualizacji strony.');
    }
  };

  if (loading) return <div>Ładowanie strony...</div>;

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4 bg-white border rounded-md shadow-sm">
      <h3 className="text-lg font-bold">Edycja strony CMS: {slug}</h3>
      {error && <div className="text-sm text-red-700">{error}</div>}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-1">Tytuł</label>
        <input className="w-full border rounded p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest mb-1">Treść</label>
        <textarea className="w-full border rounded p-2" rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <input id="published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        <label htmlFor="published">Opublikowana</label>
      </div>
      <div className="flex gap-2">
        <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded" type="submit" disabled={saving}>
          {saving ? 'Zapisuję...' : 'Zapisz'}
        </button>
        <button className="border border-slate-400 px-4 py-2 rounded" type="button" onClick={() => router.push('/admin/cms/pages')}>
          Anuluj
        </button>
      </div>
    </form>
  );
}
