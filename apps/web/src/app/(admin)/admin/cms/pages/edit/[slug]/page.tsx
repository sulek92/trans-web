"use client";

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api-url';
import { HomepageEditor } from '../homepage-editor';
import { FAQEditor } from '../faq-editor';
import { ContactEditor } from '../contact-editor';
import { AboutEditor } from '../about-editor';
import { OfferEditor } from '../offer-editor';
import { CareersEditor } from '../careers-editor';
import { PalletsEditor } from '../pallets-editor';
import { LegalEditor } from '../legal-editor';
import { GlobalSettingsEditor } from '../global-settings-editor';
import ReactMarkdown from 'react-markdown';
import { TextField, SectionHeader, ToggleSwitch } from '../../../components';

type CmsPage = {
  slug: string;
  title: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
};

export default function CmsPageEditor() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const router = useRouter();
  
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [metaTitle, setMetaTitle] = React.useState('');
  const [metaDescription, setMetaDescription] = React.useState('');
  const [published, setPublished] = React.useState<boolean>(false);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${getApiBaseUrl()}/cms/pages/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch page');
        const p = await res.json() as CmsPage;
        
        setTitle(p.title || '');
        setContent(p.content || '');
        setMetaTitle(p.metaTitle || '');
        setMetaDescription(p.metaDescription || '');
        setPublished(!!p.isPublished);
      } catch (err) {
        setError('Nie udało się wczytać danych strony.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  const onSave = async (updatedContent?: string) => {
    setSaving(true);
    setError(null);
    
    const finalContent = updatedContent !== undefined ? updatedContent : content;
    
    try {
      const res = await fetch(`${getApiBaseUrl()}/cms/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content: finalContent, 
          metaTitle, 
          metaDescription, 
          isPublished: published 
        }),
      });
      
      if (res.ok) {
        router.push('/admin/cms/pages');
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

  const isHomepage = slug === 'home';

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Edytor Strony
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isHomepage ? 'Strona Główna' : title || slug}
          </h1>
        </div>
        <div className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500">
          slug: {slug}
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {/* Main Form Area */}
      <div className="space-y-8">
        {/* Basic Info & SEO */}
        <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
          <SectionHeader title="Podstawowe informacje i SEO" icon="settings" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Tytuł strony (Admin)" value={title} onChange={setTitle} />
            <ToggleSwitch 
              label="Status publikacji" 
              description="Jeśli wyłączone, strona nie będzie widoczna dla użytkowników."
              value={published} 
              onChange={setPublished} 
            />
            <TextField label="Meta Title (Google)" value={metaTitle} onChange={setMetaTitle} />
            <TextField label="Meta Description" value={metaDescription} onChange={setMetaDescription} rows={2} />
          </div>
        </section>

        {/* Specialized or Generic Content Editor */}
        {slug === 'home' && (
          <HomepageEditor initialContent={content} onSave={(json) => onSave(json)} saving={saving} />
        )}
        {slug === 'faq' && (
          <FAQEditor initialContent={content} onSave={(json) => onSave(json)} saving={saving} />
        )}
        {slug === 'kontakt' && (
          <ContactEditor initialContent={content} onSave={(json) => onSave(json)} saving={saving} />
        )}
        {slug === 'o-nas' && (
          <AboutEditor initialContent={content} onSave={(json) => onSave(json)} saving={saving} />
        )}
        {slug === 'dla-firm' && (
          <OfferEditor initialContent={content} onSave={(json) => onSave(json)} saving={saving} />
        )}
        {slug === 'kariera' && (
          <CareersEditor initialContent={content} onSave={(json) => onSave(json)} saving={saving} />
        )}
        {slug === 'typy-palet' && (
          <PalletsEditor initialContent={content} onSave={(json) => onSave(json)} saving={saving} />
        )}
        {['regulamin', 'polityka-prywatnosci'].includes(slug) && (
          <LegalEditor initialContent={content} onSave={(json) => onSave(json)} saving={saving} />
        )}
        {slug === 'global-settings' && (
          <GlobalSettingsEditor initialContent={content} onSave={(json) => onSave(json)} saving={saving} />
        )}

        {!['home', 'faq', 'kontakt', 'o-nas', 'dla-firm', 'kariera', 'typy-palet', 'regulamin', 'polityka-prywatnosci', 'global-settings'].includes(slug) && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <SectionHeader title="Edytor treści" icon="edit_note" />
              <TextField 
                label="Treść (Markdown / HTML)" 
                value={content} 
                onChange={setContent} 
                rows={25} 
                className="font-mono text-sm"
              />
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => onSave()} 
                  disabled={saving}
                  className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50"
                >
                  {saving ? 'Zapisuję...' : 'Zapisz stronę'}
                </button>
                <button 
                  onClick={() => router.push('/admin/cms/pages')}
                  className="border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  Anuluj
                </button>
              </div>
            </section>

            <section className="bg-[var(--color-surface-container-low)] p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <SectionHeader title="Podgląd Live" icon="visibility" />
              <div className="prose prose-slate max-w-none bg-white p-8 rounded-2xl border border-slate-100 min-h-[500px]">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
