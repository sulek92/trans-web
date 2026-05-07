"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-url';
import { TextField, SectionHeader, ToggleSwitch } from '../../../components';
import DOMPurify from 'dompurify';

type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
};

export default function CmsArticleEditor() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getApiBaseUrl()}/cms/articles/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        const a = await res.json() as Article;

        setTitle(a.title || '');
        setExcerpt(a.excerpt || '');
        setContent(a.content || '');
        setCategory(a.category || '');
        setMetaTitle(a.metaTitle || '');
        setMetaDescription(a.metaDescription || '');
        setPublished(!!a.isPublished);
      } catch {
        setError('Nie udało się wczytać danych artykułu.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  const onSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`${getApiBaseUrl()}/cms/articles/${slug}`, {
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
        throw new Error('Update failed');
      }
    } catch {
      setError('Wystąpił błąd podczas zapisywania zmian.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold">Wczytywanie edytora...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Edytor Artykułu
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{title || slug}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            published
              ? 'bg-green-50 text-green-600 border border-green-100'
              : 'bg-amber-50 text-amber-600 border border-amber-100'
          }`}>
            {published ? 'Opublikowany' : 'Szkic'}
          </span>
          <div className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500">
            slug: {slug}
          </div>
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
            <TextField label="Tytuł artykułu" value={title} onChange={setTitle} />
            <TextField label="Kategoria" value={category} onChange={setCategory} />
            <ToggleSwitch
              label="Status publikacji"
              description="Jeśli wyłączone, artykuł nie będzie widoczny na blogu."
              value={published}
              onChange={setPublished}
            />
            <TextField label="Meta Title (Google)" value={metaTitle} onChange={setMetaTitle} />
            <TextField label="Meta Description" value={metaDescription} onChange={setMetaDescription} rows={2} />
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <SectionHeader title="Edytor treści" icon="edit_note" />
            <TextField
              label="Zajawka (excerpt) — krótki opis widoczny na liście bloga"
              value={excerpt}
              onChange={setExcerpt}
              rows={3}
            />
            <TextField
              label="Treść (Markdown / HTML)"
              value={content}
              onChange={setContent}
              rows={25}
              className="font-mono text-sm"
            />
            <div className="flex gap-4 pt-4">
              <button
                onClick={onSave}
                disabled={saving}
                className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50"
              >
                {saving ? 'Zapisuję...' : 'Zapisz zmiany'}
              </button>
              <button
                onClick={() => router.push('/admin/cms/articles')}
                className="border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                Anuluj
              </button>
            </div>
          </section>

          <section className="bg-[var(--color-surface-container-low)] p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <SectionHeader title="Podgląd Live" icon="visibility" />
            <div className="prose prose-slate max-w-none bg-white p-8 rounded-2xl border border-slate-100 min-h-[500px]">
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
              ) : (
                <p className="text-slate-300 italic text-center py-20">Treść artykułu pojawi się tutaj podczas edycji...</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
