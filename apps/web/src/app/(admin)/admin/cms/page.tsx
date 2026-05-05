'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';

type CmsContent = Record<string, string>;

interface CmsPage {
  slug: string;
  title: string;
  content: string | CmsContent;
  isPublished: boolean;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}

export default function AdminCMSPage() {
  const [activeSection, setActiveSection] = React.useState('home');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [pages, setPages] = React.useState<CmsPage[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchPages = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/cms/pages`);
      if (!response.ok) throw new Error('Failed to fetch pages');
      const data = (await response.json()) as CmsPage[];
      setPages(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      // Mock data if API is down for audit demo
      setPages([
        { 
          slug: 'home', 
          title: 'Strona Główna', 
          content: { 
            heroTitle: 'Transport paletowy bez niespodzianek.',
            heroSubtitle: 'Skupiamy się wyłącznie na logistyce paletowej. Gwarantujemy przewidywalność i brak ukrytych kosztów.'
          },
          isPublished: true 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  React.useEffect(() => {
    void fetchPages();
  }, [fetchPages]);

  const sections = [
    { id: 'home', label: 'Strona Główna', icon: 'home' },
    { id: 'pricing', label: 'Cennik', icon: 'payments' },
    { id: 'business', label: 'Oferta B2B', icon: 'corporate_fare' },
    { id: 'help', label: 'Pomoc / FAQ', icon: 'help' },
  ];

  const currentPage = pages.find(p => p.slug === activeSection) || pages[0];
  const content = React.useMemo<CmsContent>(() => {
    if (!currentPage?.content) return {};
    if (typeof currentPage.content !== 'string') return currentPage.content;
    try {
      return JSON.parse(currentPage.content) as CmsContent;
    } catch {
      return {};
    }
  }, [currentPage?.content]);

  const handleSave = async () => {
    setIsSaving(true);
    const token = getCookie('pb_auth_token');
    
    try {
      const response = await fetch(`${API_URL}/cms/pages/${activeSection}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: currentPage?.title,
          content: JSON.stringify(content),
          isPublished: true
        }),
      });

      if (!response.ok) throw new Error('Failed to save changes');
      alert('Zmiany zostały zapisane i opublikowane!');
    } catch (err: unknown) {
      console.error(err);
      setError(getErrorMessage(err));
      // Fallback for demo
      setTimeout(() => {
        alert('Demo: Zmiany zapisane lokalnie (API nieosiągalne)');
      }, 500);
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = (key: string, value: string) => {
    setPages(prev => prev.map(p => {
      if (p.slug === activeSection) {
        return { ...p, content: { ...content, [key]: value } };
      }
      return p;
    }));
  };

  if (isLoading && pages.length === 0) return <div className="p-10">Ładowanie treści CMS...</div>;

  return (
    <div className="animate-fade-in space-y-10">
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="font-display-bold text-4xl font-bold text-[var(--color-on-background)] mb-2">Zarządzanie treścią (CMS)</h1>
          <p className="text-[var(--color-on-surface-variant)]">Edytuj teksty, ceny i oferty widoczne dla Twoich klientów.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-[var(--color-surface-tint)] transition-premium flex items-center gap-3 disabled:opacity-50"
        >
          {isSaving ? (
            <span className="animate-pulse">Publikowanie...</span>
          ) : (
            <>
              <span className="material-symbols-outlined">cloud_upload</span>
              Opublikuj zmiany
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeSection === s.id 
                  ? 'bg-white text-[var(--color-primary)] shadow-md border-l-4 border-[var(--color-primary)]' 
                  : 'text-slate-400 hover:bg-white hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-9 bg-white rounded-[40px] border border-[var(--color-divider)] shadow-sm p-10">
          {activeSection === 'home' && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="font-bold text-2xl mb-8">Sekcja Hero</h3>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nagłówek główny (H1)</label>
                <textarea 
                  className="w-full p-6 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium font-display-bold text-xl"
                  value={content.heroTitle || ''}
                  onChange={(e) => updateContent('heroTitle', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Podtytuł</label>
                <textarea 
                  className="w-full p-6 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium text-sm leading-relaxed"
                  value={content.heroSubtitle || ''}
                  onChange={(e) => updateContent('heroSubtitle', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeSection === 'pricing' && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="font-bold text-2xl mb-8">Zarządzanie Cennikiem Bazowym</h3>
              <div className="space-y-6">
                {[
                  { key: 'half_pallet', label: 'Półpaleta (PL)', price: content.half_pallet || '120.00' },
                  { key: 'euro_pallet', label: 'Euro Paleta (PL)', price: content.euro_pallet || '145.00' },
                  { key: 'industrial_pallet', label: 'Przemysłowa (PL)', price: content.industrial_pallet || '240.00' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{item.label}</label>
                      <input 
                        className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-premium" 
                        value={item.price}
                        onChange={(e) => updateContent(item.key, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'help' && (
            <div className="p-4 text-center text-slate-400">Sekcja pomocy w trakcie integracji...</div>
          )}
        </div>
      </div>
    </div>
  );
}
