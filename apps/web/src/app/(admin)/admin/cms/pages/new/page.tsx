"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-url';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function CmsPageCreate() {
  const router = useRouter();
  const [slug, setSlug] = React.useState<string>('');
  const [title, setTitle] = React.useState<string>('');
  const [content, setContent] = React.useState<string>('');
  const [published, setPublished] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const apiUrl = getApiBaseUrl();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const computedSlug = slug.trim() || slugify(title);
    if (!computedSlug) {
      setError('Slug is required or derive from title.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/cms/pages/${computedSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, isPublished: published }),
      });
      setLoading(false);
      if (res.ok) {
        router.push('/admin/cms/pages');
      } else {
        const data = await res.json();
        setError(data?.message ?? 'Failed to create CMS page.');
      }
    } catch {
      setLoading(false);
      setError('Network error while creating CMS page.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4 bg-[var(--color-surface-primary)] border rounded-md shadow-sm">
      <h3 className="text-lg font-bold">Dodaj nową stronę CMS</h3>
      {error && <div className="text-sm text-red-700">{error}</div>}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-1">Slug (opcjonalnie)</label>
        <input className="w-full border rounded p-2" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="np. o-nas" />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest mb-1">Tytuł</label>
        <input className="w-full border rounded p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest mb-1">Treść</label>
        <textarea className="w-full border rounded p-2" rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <input id="published-new" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        <label htmlFor="published-new">Opublikowana</label>
      </div>
      <div className="flex gap-2">
        <button className="bg-[var(--color-primary)] text-[var(--color-background)] px-4 py-2 rounded" type="submit" disabled={loading}>
          {loading ? 'Tworzenie...' : 'Utwórz'}
        </button>
        <button className="border border-slate-400 px-4 py-2 rounded" type="button" onClick={() => router.push('/admin/cms/pages')}>
          Anuluj
        </button>
      </div>
    </form>
  );
}
