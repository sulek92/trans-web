"use client";

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-url';
import { TextField, SectionHeader, ToggleSwitch } from '../../../components';
import { useToastStore } from '@/lib/store/toast-store';
import ReactMarkdown from 'react-markdown';

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
  const slugParam = typeof params.slug === 'string' ? params.slug : '';
  const isNew = slugParam === 'new';
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  
  const [loading, setLoading] = React.useState(!isNew);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Form State
  const [slug, setSlug] = React.useState(isNew ? '' : slugParam);
  const [title, setTitle] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [metaTitle, setMetaTitle] = React.useState('');
  const [metaDescription, setMetaDescription] = React.useState('');
  const [published, setPublished] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/cms/articles/${slugParam}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        const a = await res.json() as Article;
        
        setTitle(a.title || '');
        setExcerpt(a.excerpt || '');
        setContent(a.content || '');
        setCategory(a.category || '');
        setMetaTitle(a.metaTitle || '');
        setMetaDescription(a.metaDescription || '');
        setPublished(!!a.isPublished);
      } catch (err) {
        setError('Nie udało się wczytać artykułu.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slugParam, isNew]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNew && !slug) {
      addToast({ title: 'Slug jest wymagany', type: 'error' });
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      const res = await fetch(`${getApiBaseUrl()}/cms/articles/${isNew ? slug : slugParam}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          excerpt,
          content, 
          category,
          metaTitle, 
          metaDescription, 
          isPublished: published 
        }),
      });
      
      if (res.ok) {
        addToast({ title: isNew ? 'Utworzono artykuł' : 'Zaktualizowano artykuł', type: 'success' });
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
    <div className="p-8 max-w-[1600px] mx-auto space-y-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">edit_document</span>
            {isNew ? 'Nowy Artykuł' : 'Edycja Artykułu'}
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            {isNew ? 'Utwórz nową treść' : title || slugParam}
          </h1>
        </div>
        
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => router.push('/admin/cms/articles')}
            className="border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
          >
            Anuluj
          </button>
          <button 
            onClick={onSave}
            disabled={saving}
            className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all active:scale-95 shadow-xl shadow-[var(--color-primary)]/20 disabled:opacity-50"
          >
            {saving ? 'Zapisuję...' : 'Zapisz artykuł'}
          </button>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <SectionHeader title="Dane podstawowe" icon="info" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Tytuł artykułu" value={title} onChange={setTitle} />
              <TextField 
                label="Slug (URL)" 
                value={slug} 
                onChange={setSlug} 
                className={!isNew ? 'opacity-50 pointer-events-none' : ''}
              />
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Kategoria</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)] transition-all outline-none appearance-none"
                >
                  <option value="">Wybierz kategorię...</option>
                  <option value="Poradniki">Poradniki</option>
                  <option value="Aktualności">Aktualności</option>
                  <option value="Technologia">Technologia</option>
                  <option value="Rynek TSL">Rynek TSL</option>
                  <option value="Case Study">Case Study</option>
                </select>
              </div>
              <div className="flex items-center pt-6">
                <ToggleSwitch 
                  label="Status publikacji" 
                  description="Widoczny na blogu."
                  value={published} 
                  onChange={setPublished} 
                />
              </div>
            </div>
            <TextField label="Krótki wstęp (Excerpt)" value={excerpt} onChange={setExcerpt} rows={3} />
          </section>

          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <SectionHeader title="Treść (Markdown)" icon="article" />
            <TextField label="" value={content} onChange={setContent} rows={30} className="font-mono text-sm" />
          </section>

          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <SectionHeader title="SEO" icon="search" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Meta Title" value={metaTitle} onChange={setMetaTitle} />
              <TextField label="Meta Description" value={metaDescription} onChange={setMetaDescription} rows={2} />
            </div>
          </section>
        </div>

        <div className="sticky top-8 space-y-6">
          <section className="bg-[var(--color-surface-container-low)] p-10 rounded-[40px] border border-slate-100 shadow-inner h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-10">
              <SectionHeader title="Podgląd artykułu" icon="visibility" />
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wersja desktop</div>
            </div>

            <article className="bg-white rounded-3xl p-12 shadow-xl border border-slate-50 space-y-10 min-h-full">
              <header className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="bg-[var(--color-primary-highlight)] text-[var(--color-primary)] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">{category || 'Kategoria'}</span>
                  <span className="text-xs text-slate-400 font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 leading-tight">{title || 'Tytuł artykułu'}</h1>
                <p className="text-xl text-slate-500 leading-relaxed italic">{excerpt || 'Podgląd wstępu pojawi się tutaj...'}</p>
                <div className="h-px bg-slate-100 w-full" />
              </header>

              <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-[var(--color-primary)] prose-strong:text-slate-900">
                {content ? (
                  <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                  <div className="py-20 text-center text-slate-300 italic">Zacznij pisać, aby zobaczyć podgląd treści...</div>
                )}
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
