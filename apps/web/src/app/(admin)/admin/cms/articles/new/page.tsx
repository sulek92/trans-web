"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-url';
import { ToggleSwitch, TextField, SectionHeader } from '../../components';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function CmsArticleCreate() {
  const router = useRouter();
  const [slug, setSlug] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [metaTitle, setMetaTitle] = React.useState('');
  const [metaDescription, setMetaDescription] = React.useState('');
  const [published, setPublished] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const apiUrl = getApiBaseUrl();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const computedSlug = slug.trim() || slugify(title);
    if (!computedSlug) {
      setError('Podaj slug lub tytuł, z którego zostanie wygenerowany.');
      return;
    }
    if (!title.trim()) {
      setError('Tytuł artykułu jest wymagany.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/cms/articles/${computedSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim() || null,
          content: content || null,
          category: category.trim() || null,
          metaTitle: metaTitle.trim() || null,
          metaDescription: metaDescription.trim() || null,
          isPublished: published,
        }),
      });
      if (res.ok) {
        router.push('/admin/cms/articles');
      } else {
        const data = await res.json();
        setError(data?.message ?? 'Nie udało się utworzyć artykułu.');
      }
    } catch {
      setError('Błąd sieci. Spróbuj ponownie.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-8 max-w-5xl mx-auto space-y-12">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">post_add</span>
            Nowy artykuł
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Utwórz nowy artykuł</h1>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="space-y-8">
        <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <SectionHeader title="Podstawowe informacje i SEO" icon="settings" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Slug (unikalny identyfikator URL)" value={slug} onChange={setSlug} />
            <TextField label="Tytuł artykułu *" value={title} onChange={setTitle} />
            <TextField label="Kategoria (np. Poradniki, Aktualności)" value={category} onChange={setCategory} />
            <ToggleSwitch
              label="Opublikowany"
              description="Włącz, aby artykuł był widoczny na blogu."
              value={published}
              onChange={setPublished}
            />
            <TextField label="Meta Title (SEO)" value={metaTitle} onChange={setMetaTitle} />
            <TextField label="Meta Description (SEO)" value={metaDescription} onChange={setMetaDescription} rows={2} />
          </div>
        </section>

        <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <SectionHeader title="Treść artykułu" icon="edit_note" />
          <TextField
            label="Zajawka (excerpt)"
            value={excerpt}
            onChange={setExcerpt}
            rows={3}
          />
          <TextField
            label="Treść (Markdown / HTML)"
            value={content}
            onChange={setContent}
            rows={25}
          />
        </section>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50"
          >
            {saving ? 'Tworzenie...' : 'Utwórz artykuł'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/cms/articles')}
            className="border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            Anuluj
          </button>
        </div>
      </div>
    </form>
  );
}
