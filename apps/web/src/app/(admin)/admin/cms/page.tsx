'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { TextField, ToggleSwitch, ListEditor, StringListEditor, SectionHeader } from './components';

/* eslint-disable @typescript-eslint/no-explicit-any */
type CmsContent = Record<string, any>;

interface CmsPage {
  slug: string;
  title: string;
  content: string | CmsContent;
  isPublished: boolean;
}

type HomeMediaField = 'heroVisualImage' | 'supportVisualImage' | 'ctaVisualImage';

type CmsMediaItem = {
  url: string;
  fileName: string;
  size: number;
  updatedAt: string;
};

const SECTIONS = [
  { id: 'home', label: 'Strona Główna', icon: 'home' },
  { id: 'o-nas', label: 'O nas', icon: 'info' },
  { id: 'cennik', label: 'Cennik', icon: 'payments' },
  { id: 'dla-firm', label: 'Oferta B2B', icon: 'corporate_fare' },
  { id: 'faq', label: 'FAQ', icon: 'quiz' },
  { id: 'pomoc', label: 'Centrum Pomocy', icon: 'help' },
  { id: 'kontakt', label: 'Kontakt', icon: 'mail' },
  { id: 'blog', label: 'Blog', icon: 'article' },
  { id: 'kariera', label: 'Kariera', icon: 'work' },
  { id: 'typy-palet', label: 'Typy palet', icon: 'inventory_2' },
  { id: 'regulamin', label: 'Regulamin', icon: 'gavel' },
  { id: 'polityka-prywatnosci', label: 'Polityka Prywatności', icon: 'lock' },
  { id: 'global-settings', label: 'Ustawienia Globalne', icon: 'settings' },
];

const SECTION_IDS = new Set(SECTIONS.map((section) => section.id));
const SECTION_LABEL_BY_ID = Object.fromEntries(
  SECTIONS.map((section) => [section.id, section.label]),
) as Record<string, string>;

const PREVIEW_PATH_BY_SECTION: Record<string, string> = {
  home: '/',
  'o-nas': '/o-nas',
  cennik: '/cennik',
  'dla-firm': '/dla-firm',
  faq: '/faq',
  pomoc: '/pomoc',
  kontakt: '/kontakt',
  blog: '/blog',
  kariera: '/kariera',
  'typy-palet': '/typy-palet',
  regulamin: '/regulamin',
  'polityka-prywatnosci': '/polityka-prywatnosci',
};

function resolveInitialSection(): string {
  if (typeof window === 'undefined') return 'home';
  const selected = new URLSearchParams(window.location.search).get('section');
  if (selected && SECTION_IDS.has(selected)) {
    return selected;
  }
  return 'home';
}

export default function AdminCMSPage() {
  const [activeSection, setActiveSection] = React.useState(resolveInitialSection);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [pages, setPages] = React.useState<CmsPage[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [mediaItems, setMediaItems] = React.useState<CmsMediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = React.useState(false);
  const [mediaError, setMediaError] = React.useState<string | null>(null);
  const [uploadingField, setUploadingField] = React.useState<HomeMediaField | null>(null);
  const [deletingMediaUrl, setDeletingMediaUrl] = React.useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const selectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('section', sectionId);
    window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}`);
  };

  const fetchPages = React.useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/cms/pages`);
      if (!res.ok) throw new Error('Nie udało się pobrać stron CMS');
      setPages(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Błąd');
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPages();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchPages]);

  const fetchMediaLibrary = React.useCallback(async () => {
    const token = getCookie('pb_auth_token');
    if (!token) {
      setMediaError('Brak tokenu autoryzacji do pobrania biblioteki mediów.');
      return;
    }

    setMediaLoading(true);
    setMediaError(null);
    try {
      const res = await fetch(`${API_URL}/cms/media`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Nie udało się pobrać biblioteki mediów.');
      }
      const payload = (await res.json()) as CmsMediaItem[];
      setMediaItems(Array.isArray(payload) ? payload : []);
    } catch (err: unknown) {
      setMediaError(
        err instanceof Error ? err.message : 'Błąd pobierania biblioteki mediów.',
      );
    } finally {
      setMediaLoading(false);
    }
  }, [API_URL]);

  React.useEffect(() => {
    if (activeSection !== 'home') return;
    const timeoutId = window.setTimeout(() => {
      void fetchMediaLibrary();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [activeSection, fetchMediaLibrary]);

  // Parse content for current section
  const getContent = React.useCallback((): CmsContent => {
    const page = pages.find(p => p.slug === activeSection);
    if (!page?.content) return {};
    if (typeof page.content !== 'string') return page.content;
    try { return JSON.parse(page.content); } catch { return {}; }
  }, [pages, activeSection]);

  const content = getContent();
  const previewPath = PREVIEW_PATH_BY_SECTION[activeSection];

  const update = React.useCallback((key: string, value: any) => {
    setPages(prev => {
      const hasActiveSection = prev.some((page) => page.slug === activeSection);
      if (!hasActiveSection) {
        return [
          ...prev,
          {
            slug: activeSection,
            title: SECTION_LABEL_BY_ID[activeSection] || activeSection,
            content: { [key]: value },
            isPublished: true,
          },
        ];
      }

      return prev.map((page) => {
        if (page.slug !== activeSection) return page;
        const old = typeof page.content === 'string'
          ? (() => {
              try {
                return JSON.parse(page.content);
              } catch {
                return {};
              }
            })()
          : (page.content || {});
        return { ...page, content: { ...old, [key]: value } };
      });
    });
  }, [activeSection]);

  const copyMediaUrl = React.useCallback(async (url: string) => {
    if (!navigator?.clipboard?.writeText) {
      setError('Kopiowanie do schowka nie jest dostępne w tej przeglądarce.');
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setSuccess('Skopiowano URL do schowka.');
      setTimeout(() => setSuccess(null), 2200);
    } catch {
      setError('Nie udało się skopiować URL do schowka.');
    }
  }, []);

  const handleMediaUpload = React.useCallback(
    async (field: HomeMediaField, file: File) => {
      const token = getCookie('pb_auth_token');
      if (!token) {
        setError('Brak tokenu autoryzacji. Odśwież panel i zaloguj się ponownie.');
        return;
      }

      setError(null);
      setSuccess(null);
      setUploadingField(field);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_URL}/cms/media/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const payload = (await res.json()) as { url?: string; message?: string };
        if (!res.ok || !payload?.url) {
          throw new Error(payload?.message || 'Nie udało się wgrać pliku.');
        }

        update(field, payload.url);
        setSuccess(`Wgrano grafikę i podpięto do pola "${field}".`);
        setTimeout(() => setSuccess(null), 3000);
        await fetchMediaLibrary();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Błąd wysyłki pliku.');
      } finally {
        setUploadingField(null);
      }
    },
    [API_URL, fetchMediaLibrary, update],
  );

  const handleDeleteMedia = React.useCallback(
    async (url: string) => {
      const token = getCookie('pb_auth_token');
      if (!token) {
        setError('Brak tokenu autoryzacji. Odśwież panel i zaloguj się ponownie.');
        return;
      }

      setDeletingMediaUrl(url);
      setError(null);
      setSuccess(null);
      try {
        const res = await fetch(`${API_URL}/cms/media`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url }),
        });

        if (!res.ok) {
          const payload = (await res.json()) as { message?: string };
          throw new Error(payload?.message || 'Nie udało się usunąć pliku.');
        }

        setSuccess('Plik usunięty z biblioteki mediów.');
        setTimeout(() => setSuccess(null), 3000);
        await fetchMediaLibrary();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Błąd usuwania pliku.');
      } finally {
        setDeletingMediaUrl(null);
      }
    },
    [API_URL, fetchMediaLibrary],
  );

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    const token = getCookie('pb_auth_token');
    const page = pages.find(p => p.slug === activeSection);
    const title = page?.title || SECTION_LABEL_BY_ID[activeSection] || activeSection;
    try {
      const body = { title, content: JSON.stringify(content), isPublished: true };
      const res = await fetch(`${API_URL}/cms/pages/${activeSection}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Nie udało się zapisać');
      setSuccess('Zmiany opublikowane!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Błąd zapisu');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-400">Ładowanie treści CMS...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2"><span className="material-symbols-outlined text-sm">check_circle</span>{success}</div>}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-display-bold text-3xl font-bold text-[var(--color-on-background)] mb-1">Zarządzanie treścią (CMS)</h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Edytuj wszystkie teksty, sekcje i dane widoczne na stronie.</p>
        </div>
        <div className="flex items-center gap-2">
          {previewPath && (
            <a
              href={previewPath}
              target="_blank"
              rel="noreferrer"
              className="bg-white text-[var(--color-primary)] border border-[var(--color-primary)] px-5 py-3 rounded-xl font-bold shadow-sm hover:bg-[var(--color-primary-highlight)] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Podgląd strony
            </a>
          )}
          <button onClick={handleSave} disabled={isSaving} className="bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[var(--color-surface-tint)] transition-all flex items-center gap-2 disabled:opacity-50 shrink-0">
            <span className="material-symbols-outlined text-sm">{isSaving ? 'hourglass_empty' : 'cloud_upload'}</span>
            {isSaving ? 'Publikowanie...' : 'Opublikuj zmiany'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => selectSection(s.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === s.id ? 'bg-white text-[var(--color-primary)] shadow-md border-l-4 border-[var(--color-primary)]' : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'}`}>
              <span className="material-symbols-outlined text-lg">{s.icon}</span>
              <span className="truncate">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-[var(--color-divider)] shadow-sm p-8 min-h-[500px]">
          {renderSection(activeSection, content, update, {
            mediaItems,
            mediaLoading,
            mediaError,
            uploadingField,
            deletingMediaUrl,
            onMediaUpload: handleMediaUpload,
            onMediaDelete: handleDeleteMedia,
            onCopyMediaUrl: copyMediaUrl,
          })}
        </div>
      </div>
    </div>
  );
}

type HomeSectionEditorProps = {
  mediaItems: CmsMediaItem[];
  mediaLoading: boolean;
  mediaError: string | null;
  uploadingField: HomeMediaField | null;
  deletingMediaUrl: string | null;
  onMediaUpload: (field: HomeMediaField, file: File) => Promise<void>;
  onMediaDelete: (url: string) => Promise<void>;
  onCopyMediaUrl: (url: string) => Promise<void>;
};

// ── Section Renderers ──
function renderSection(
  slug: string,
  c: CmsContent,
  update: (k: string, v: any) => void,
  homeProps: HomeSectionEditorProps,
) {
  switch (slug) {
    case 'home': return <HomeEditor c={c} u={update} {...homeProps} />;
    case 'o-nas': return <AboutEditor c={c} u={update} />;
    case 'cennik': return <PricingEditor c={c} u={update} />;
    case 'dla-firm': return <BusinessEditor c={c} u={update} />;
    case 'faq': return <FaqEditor c={c} u={update} />;
    case 'pomoc': return <HelpEditor c={c} u={update} />;
    case 'kontakt': return <ContactEditor c={c} u={update} />;
    case 'blog': return <BlogEditor c={c} u={update} />;
    case 'kariera': return <CareersEditor c={c} u={update} />;
    case 'typy-palet': return <PalletsEditor c={c} u={update} />;
    case 'regulamin': return <LegalEditor c={c} u={update} title="Regulamin" />;
    case 'polityka-prywatnosci': return <PrivacyEditor c={c} u={update} />;
    case 'global-settings': return <GlobalEditor c={c} u={update} />;
    default: return <div className="text-slate-400 text-center p-10">Wybierz sekcję z menu.</div>;
  }
}

type EP = { c: CmsContent; u: (k: string, v: any) => void };

type HomeEditorProps = EP & HomeSectionEditorProps;

function HomeEditor({
  c,
  u,
  mediaItems,
  mediaLoading,
  mediaError,
  uploadingField,
  deletingMediaUrl,
  onMediaUpload,
  onMediaDelete,
  onCopyMediaUrl,
}: HomeEditorProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Sekcja Hero" icon="star" />
      <TextField label="Badge" value={c.heroBadge || ''} onChange={v => u('heroBadge', v)} />
      <TextField label="Nagłówek główny (H1)" value={c.heroTitle || ''} onChange={v => u('heroTitle', v)} rows={2} />
      <TextField label="Podtytuł" value={c.heroSubtitle || ''} onChange={v => u('heroSubtitle', v)} rows={3} />
      <TextField label="Etykieta grafiki hero" value={c.heroVisualCaption || ''} onChange={v => u('heroVisualCaption', v)} />

      <SectionHeader title="Grafiki strony głównej" icon="image" />
      <HomeImageFieldEditor
        field="heroVisualImage"
        label="Hero image URL"
        description="Rekomendacja: 1600x1000, JPG/WEBP"
        value={c.heroVisualImage || ''}
        fallback="/images/home-hero-logistics.jpg"
        isUploading={uploadingField === 'heroVisualImage'}
        onUrlChange={v => u('heroVisualImage', v)}
        onUpload={onMediaUpload}
      />
      <HomeImageFieldEditor
        field="supportVisualImage"
        label="Support image URL"
        description="Rekomendacja: 1600x1000, JPG/WEBP"
        value={c.supportVisualImage || ''}
        fallback="/images/home-support-team.jpg"
        isUploading={uploadingField === 'supportVisualImage'}
        onUrlChange={v => u('supportVisualImage', v)}
        onUpload={onMediaUpload}
      />
      <HomeImageFieldEditor
        field="ctaVisualImage"
        label="CTA image URL"
        description="Rekomendacja: 1600x1000, JPG/WEBP"
        value={c.ctaVisualImage || ''}
        fallback="/images/home-cta-warehouse.jpg"
        isUploading={uploadingField === 'ctaVisualImage'}
        onUrlChange={v => u('ctaVisualImage', v)}
        onUpload={onMediaUpload}
      />

      <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-slate-700">Biblioteka mediów</h4>
            <p className="text-xs text-slate-400">Wgrywaj obrazy raz i podpinaj je do sekcji homepage.</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{mediaItems.length} plików</span>
        </div>

        {mediaError && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            {mediaError}
          </div>
        )}

        {mediaLoading ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
            Ładowanie biblioteki mediów...
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
            Brak plików. Wgraj pierwszą grafikę przy polu powyżej.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaItems.slice(0, 16).map((item) => (
              <div key={item.url} className="rounded-xl border border-slate-200 bg-white p-3 space-y-3">
                <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.fileName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-1">
                  <div className="truncate text-xs font-bold text-slate-700">{item.fileName}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                    {(item.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => u('heroVisualImage', item.url)}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Ustaw Hero
                  </button>
                  <button
                    type="button"
                    onClick={() => u('supportVisualImage', item.url)}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Ustaw Support
                  </button>
                  <button
                    type="button"
                    onClick={() => u('ctaVisualImage', item.url)}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Ustaw CTA
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void onCopyMediaUrl(item.url);
                    }}
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Kopiuj URL
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => { void onMediaDelete(item.url); }}
                  disabled={deletingMediaUrl === item.url}
                  className="w-full rounded-lg border border-red-100 bg-red-50 px-2 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                >
                  {deletingMediaUrl === item.url ? 'Usuwanie...' : 'Usuń plik'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <SectionHeader title="Partnerzy" icon="handshake" />
      <StringListEditor label="Nazwy firm partnerskich" items={c.partners || []} onChange={v => u('partners', v)} addLabel="Dodaj partnera" />

      <SectionHeader title="Jak to działa" icon="route" />
      <ListEditor label="Kroki" items={c.howItWorks || []} fields={[{key:'step',label:'Numer'},{key:'title',label:'Tytuł'},{key:'desc',label:'Opis',type:'textarea'},{key:'icon',label:'Ikona (Material)'}]} onChange={v => u('howItWorks', v)} addLabel="Dodaj krok" />

      <SectionHeader title="Statystyki" icon="monitoring" />
      <ListEditor label="Liczby" items={c.stats || []} fields={[{key:'label',label:'Etykieta'},{key:'end',label:'Wartość'},{key:'suffix',label:'Suffix (np. +, %)'}]} onChange={v => u('stats', v)} />

      <SectionHeader title="Opinie klientów" icon="reviews" />
      <ListEditor label="Testimoniale" items={c.testimonials || []} fields={[{key:'name',label:'Imię i nazwisko'},{key:'role',label:'Stanowisko / Firma'},{key:'text',label:'Opinia',type:'textarea'},{key:'avatar',label:'Ikona avatar'},{key:'avatarImage',label:'Zdjęcie avatar URL (opcjonalnie)'}]} onChange={v => u('testimonials', v)} />

      <SectionHeader title="Sekcja Wsparcia" icon="support" />
      <TextField label="Tytuł" value={c.supportTitle || ''} onChange={v => u('supportTitle', v)} />
      <TextField label="Podtytuł" value={c.supportSubtitle || ''} onChange={v => u('supportSubtitle', v)} rows={3} />

      <SectionHeader title="CTA końcowy" icon="campaign" />
      <TextField label="Tytuł CTA" value={c.ctaTitle || ''} onChange={v => u('ctaTitle', v)} />
      <TextField label="Podtytuł CTA" value={c.ctaSubtitle || ''} onChange={v => u('ctaSubtitle', v)} rows={2} />

      <SectionHeader title="Live Activity Ticker" icon="notifications_active" />
      <ListEditor label="Wpisy tickera" items={c.activityTicker || []} fields={[{key:'city',label:'Miasto'},{key:'status',label:'Status'},{key:'time',label:'Czas'}]} onChange={v => u('activityTicker', v)} />
    </div>
  );
}

type HomeImageFieldEditorProps = {
  field: HomeMediaField;
  label: string;
  description: string;
  value: string;
  fallback: string;
  isUploading: boolean;
  onUrlChange: (value: string) => void;
  onUpload: (field: HomeMediaField, file: File) => Promise<void>;
};

function HomeImageFieldEditor({
  field,
  label,
  description,
  value,
  fallback,
  isUploading,
  onUrlChange,
  onUpload,
}: HomeImageFieldEditorProps) {
  const inputId = React.useId();
  const normalizedValue = (value || '').trim();
  const previewSrc = normalizedValue || fallback;

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await onUpload(field, file);
    event.target.value = '';
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className="space-y-2 xl:col-span-7">
          <label
            htmlFor={`${inputId}-url`}
            className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1"
          >
            {label}
          </label>
          <input
            id={`${inputId}-url`}
            value={value || ''}
            onChange={(event) => onUrlChange(event.target.value)}
            placeholder={fallback}
            className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-[var(--color-primary)] outline-none transition-all text-sm"
          />
          <p className="text-[11px] text-slate-400">{description}</p>
          <div className="flex items-center gap-2">
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              onChange={(event) => {
                void handleFileUpload(event);
              }}
              className="hidden"
            />
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-sm">
                {isUploading ? 'hourglass_empty' : 'upload'}
              </span>
              {isUploading ? 'Wgrywanie...' : 'Wgraj plik'}
            </label>
            <button
              type="button"
              onClick={() => onUrlChange(fallback)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-white"
            >
              Przywróć domyślną
            </button>
          </div>
        </div>
        <div className="xl:col-span-5">
          <div className="aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt={label}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(event) => {
                if (event.currentTarget.src.endsWith(fallback)) return;
                event.currentTarget.src = fallback;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Hero O nas" icon="info" />
      <TextField label="Tytuł" value={c.heroTitle || ''} onChange={v => u('heroTitle', v)} />
      <TextField label="Opis" value={c.heroDesc || ''} onChange={v => u('heroDesc', v)} rows={3} />
      <ListEditor label="Statystyki Hero" items={c.heroStats || []} fields={[{key:'value',label:'Wartość (np. 1200+)'},{key:'label',label:'Etykieta'}]} onChange={v => u('heroStats', v)} />

      <SectionHeader title="Cytat" icon="format_quote" />
      <TextField label="Treść cytatu" value={c.quote || ''} onChange={v => u('quote', v)} rows={2} />
      <TextField label="Autor" value={c.quoteAuthor || ''} onChange={v => u('quoteAuthor', v)} />

      <SectionHeader title="Nasze wartości" icon="verified" />
      <ListEditor label="Wartości" items={c.values || []} fields={[{key:'title',label:'Tytuł'},{key:'icon',label:'Ikona'},{key:'desc',label:'Opis',type:'textarea'}]} onChange={v => u('values', v)} />

      <SectionHeader title="Zespół" icon="groups" />
      <ListEditor label="Członkowie zespołu" items={c.team || []} fields={[{key:'name',label:'Imię i nazwisko'},{key:'role',label:'Stanowisko'},{key:'icon',label:'Ikona'}]} onChange={v => u('team', v)} addLabel="Dodaj osobę" />

      <SectionHeader title="CTA" icon="campaign" />
      <TextField label="Tytuł CTA" value={c.ctaTitle || ''} onChange={v => u('ctaTitle', v)} rows={2} />
    </div>
  );
}

function PricingEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Nagłówek cennika" icon="payments" />
      <TextField label="Tytuł" value={c.title || ''} onChange={v => u('title', v)} />
      <TextField label="Podtytuł" value={c.subtitle || ''} onChange={v => u('subtitle', v)} rows={3} />
      <TextField label="Kurs EUR (PLN)" value={String(c.exchangeRate || '')} onChange={v => u('exchangeRate', parseFloat(v) || 0)} />

      <SectionHeader title="Stawki krajowe" icon="flag" />
      <ListEditor label="Stawki PL" items={c.domesticRates || []} fields={[{key:'type',label:'Typ'},{key:'price',label:'Cena netto'},{key:'icon',label:'Ikona'}]} onChange={v => u('domesticRates', v)} />

      <SectionHeader title="Stawki międzynarodowe" icon="public" />
      <ListEditor label="Stawki EU" items={c.internationalRates || []} fields={[{key:'country',label:'Kraj'},{key:'price',label:'Cena od (EUR)'},{key:'eta',label:'ETA'}]} onChange={v => u('internationalRates', v)} />

      <SectionHeader title="Gwarancja" icon="verified_user" />
      <TextField label="Tytuł gwarancji" value={c.guaranteeTitle || ''} onChange={v => u('guaranteeTitle', v)} />
      <TextField label="Opis gwarancji" value={c.guaranteeDesc || ''} onChange={v => u('guaranteeDesc', v)} rows={3} />

      <SectionHeader title="FAQ cennikowy" icon="quiz" />
      <ListEditor label="Pytania" items={c.pricingFaq || []} fields={[{key:'q',label:'Pytanie'},{key:'a',label:'Odpowiedź',type:'textarea'}]} onChange={v => u('pricingFaq', v)} addLabel="Dodaj pytanie" />
    </div>
  );
}

function BusinessEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Hero B2B" icon="corporate_fare" />
      <TextField label="Badge" value={c.heroBadge || ''} onChange={v => u('heroBadge', v)} />
      <TextField label="Tytuł" value={c.heroTitle || ''} onChange={v => u('heroTitle', v)} />
      <TextField label="Opis" value={c.heroDesc || ''} onChange={v => u('heroDesc', v)} rows={3} />

      <SectionHeader title="Korzyści" icon="thumb_up" />
      <ListEditor label="Lista korzyści" items={c.benefits || []} fields={[{key:'title',label:'Tytuł'},{key:'icon',label:'Ikona'},{key:'desc',label:'Opis',type:'textarea'}]} onChange={v => u('benefits', v)} />

      <SectionHeader title="Integracje" icon="integration_instructions" />
      <StringListEditor label="Platformy" items={c.integrations || []} onChange={v => u('integrations', v)} addLabel="Dodaj platformę" />
    </div>
  );
}

function FaqEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Lista FAQ" icon="quiz" />
      <ListEditor label="Pytania i odpowiedzi" items={c.items || []} fields={[{key:'q',label:'Pytanie'},{key:'a',label:'Odpowiedź',type:'textarea'}]} onChange={v => u('items', v)} addLabel="Dodaj pytanie" />
    </div>
  );
}

function HelpEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Nagłówek" icon="help" />
      <TextField label="Tytuł" value={c.title || ''} onChange={v => u('title', v)} />
      <TextField label="Podtytuł" value={c.subtitle || ''} onChange={v => u('subtitle', v)} rows={2} />

      <SectionHeader title="Kategorie" icon="category" />
      <ListEditor label="Kategorie pomocy" items={c.categories || []} fields={[{key:'title',label:'Tytuł'},{key:'icon',label:'Ikona'},{key:'count',label:'Liczba artykułów'}]} onChange={v => u('categories', v)} />

      <SectionHeader title="FAQ" icon="quiz" />
      <ListEditor label="Pytania" items={c.faqItems || []} fields={[{key:'q',label:'Pytanie'},{key:'a',label:'Odpowiedź',type:'textarea'}]} onChange={v => u('faqItems', v)} addLabel="Dodaj pytanie" />

      <SectionHeader title="CTA" icon="campaign" />
      <TextField label="Tytuł CTA" value={c.ctaTitle || ''} onChange={v => u('ctaTitle', v)} />
      <TextField label="Podtytuł CTA" value={c.ctaSubtitle || ''} onChange={v => u('ctaSubtitle', v)} rows={2} />
    </div>
  );
}

function ContactEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Dane kontaktowe" icon="contact_phone" />
      <TextField label="Tytuł strony" value={c.title || ''} onChange={v => u('title', v)} rows={2} />
      <TextField label="Podtytuł" value={c.subtitle || ''} onChange={v => u('subtitle', v)} rows={3} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Telefon" value={c.phone || ''} onChange={v => u('phone', v)} />
        <TextField label="Godziny tel." value={c.phoneHours || ''} onChange={v => u('phoneHours', v)} />
        <TextField label="Email" value={c.email || ''} onChange={v => u('email', v)} />
        <TextField label="Czas odpowiedzi email" value={c.emailResponseTime || ''} onChange={v => u('emailResponseTime', v)} />
      </div>

      <SectionHeader title="Adres firmy" icon="location_on" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Nazwa firmy" value={c.companyName || ''} onChange={v => u('companyName', v)} />
        <TextField label="Ulica" value={c.street || ''} onChange={v => u('street', v)} />
        <TextField label="Miasto i kod" value={c.city || ''} onChange={v => u('city', v)} />
      </div>
    </div>
  );
}

function BlogEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Newsletter CTA" icon="newspaper" />
      <TextField label="Tytuł newslettera" value={c.newsletterTitle || ''} onChange={v => u('newsletterTitle', v)} />
      <TextField label="Opis newslettera" value={c.newsletterDesc || ''} onChange={v => u('newsletterDesc', v)} rows={3} />
      <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
        <span className="material-symbols-outlined text-sm align-middle mr-2">info</span>
        Artykuły blogowe zarządzane są przez tabelę <code>cms_articles</code> w bazie danych.
      </div>
    </div>
  );
}

function CareersEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Hero Kariera" icon="work" />
      <TextField label="Tytuł" value={c.heroTitle || ''} onChange={v => u('heroTitle', v)} />
      <TextField label="Opis" value={c.heroDesc || ''} onChange={v => u('heroDesc', v)} rows={3} />

      <SectionHeader title="Dlaczego PaletBroker?" icon="thumb_up" />
      <ListEditor label="Powody" items={c.reasons || []} fields={[{key:'title',label:'Tytuł'},{key:'icon',label:'Ikona'},{key:'desc',label:'Opis',type:'textarea'}]} onChange={v => u('reasons', v)} />

      <SectionHeader title="Oferty pracy" icon="badge" />
      <ListEditor label="Ogłoszenia" items={c.jobOffers || []} fields={[{key:'title',label:'Stanowisko'},{key:'location',label:'Lokalizacja'},{key:'type',label:'Typ (np. Pełny etat)'}]} onChange={v => u('jobOffers', v)} addLabel="Dodaj ofertę" />
    </div>
  );
}

function PalletsEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Typy palet" icon="inventory_2" />
      <ListEditor label="Typy" items={c.palletTypes || []} fields={[{key:'name',label:'Nazwa'},{key:'dims',label:'Wymiary'},{key:'weight',label:'Waga'},{key:'capacity',label:'Nośność'},{key:'desc',label:'Opis',type:'textarea'},{key:'icon',label:'Ikona'}]} onChange={v => u('palletTypes', v)} addLabel="Dodaj typ" />

      <SectionHeader title="Wskazówki pomiarowe" icon="straighten" />
      <StringListEditor label="Wskazówki" items={c.measurementTips || []} onChange={v => u('measurementTips', v)} addLabel="Dodaj wskazówkę" />
    </div>
  );
}

function LegalEditor({ c, u, title }: EP & { title: string }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title={title} icon="gavel" />
      <ListEditor label="Sekcje" items={c.sections || []} fields={[{key:'title',label:'Tytuł sekcji'},{key:'content',label:'Treść',type:'textarea'}]} onChange={v => u('sections', v)} addLabel="Dodaj sekcję" />
    </div>
  );
}

function PrivacyEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Polityka Prywatności" icon="lock" />
      <ListEditor label="Sekcje" items={c.sections || []} fields={[{key:'title',label:'Tytuł sekcji'},{key:'content',label:'Treść',type:'textarea'}]} onChange={v => u('sections', v)} addLabel="Dodaj sekcję" />
      <TextField label="Data ostatniej aktualizacji" value={c.lastUpdated || ''} onChange={v => u('lastUpdated', v)} />
    </div>
  );
}

function GlobalEditor({ c, u }: EP) {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader title="Brand" icon="branding_watermark" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Nazwa marki (Navbar/Stopka)" value={c.brandName || ''} onChange={v => u('brandName', v)} />
        <TextField label="Tagline w stopce" value={c.footerTagline || ''} onChange={v => u('footerTagline', v)} />
      </div>

      <SectionHeader title="Nawigacja główna" icon="menu" />
      <ListEditor
        label="Linki menu górnego"
        items={Array.isArray(c.navLinks) ? c.navLinks : []}
        fields={[
          { key: 'label', label: 'Etykieta' },
          { key: 'href', label: 'Link (np. /cennik)' },
        ]}
        onChange={v => u('navLinks', v)}
        addLabel="Dodaj link menu"
      />

      <SectionHeader title="Baner promocyjny" icon="campaign" />
      <ToggleSwitch label="Baner włączony" description="Wyświetla pasek promocyjny na górze strony" value={!!c.bannerEnabled} onChange={v => u('bannerEnabled', v)} />
      <TextField label="Tekst banera" value={c.bannerText || ''} onChange={v => u('bannerText', v)} />
      <TextField label="Kod promocyjny" value={c.bannerCode || ''} onChange={v => u('bannerCode', v)} />

      <SectionHeader title="Tryb konserwacji" icon="engineering" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <ToggleSwitch label="Tryb konserwacji" description="Blokuje składanie zamówień i wyświetla komunikat serwisowy" value={!!c.maintenanceMode} onChange={v => u('maintenanceMode', v)} />
        <TextField label="Dopłata paliwowa (%)" value={String(c.fuelSurcharge || '0')} onChange={v => u('fuelSurcharge', parseFloat(v) || 0)} />
      </div>

      <SectionHeader title="Dane firmy (Stopka)" icon="business" />
      <TextField label="Opis w stopce" value={c.footerDesc || ''} onChange={v => u('footerDesc', v)} rows={3} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Telefon" value={c.phone || ''} onChange={v => u('phone', v)} />
        <TextField label="Email" value={c.email || ''} onChange={v => u('email', v)} />
        <TextField label="Nazwa firmy" value={c.companyName || ''} onChange={v => u('companyName', v)} />
        <TextField label="Ulica" value={c.street || ''} onChange={v => u('street', v)} />
        <TextField label="Miasto i kod" value={c.city || ''} onChange={v => u('city', v)} />
      </div>

      <SectionHeader title="Stopka: kolumny linków" icon="link" />
      <ListEditor
        label="Kolumna: Firma"
        items={Array.isArray(c.footerCompanyLinks) ? c.footerCompanyLinks : []}
        fields={[
          { key: 'label', label: 'Etykieta' },
          { key: 'href', label: 'Link (np. /o-nas)' },
        ]}
        onChange={v => u('footerCompanyLinks', v)}
        addLabel="Dodaj link w kolumnie Firma"
      />
      <ListEditor
        label="Kolumna: Narzędzia"
        items={Array.isArray(c.footerToolLinks) ? c.footerToolLinks : []}
        fields={[
          { key: 'label', label: 'Etykieta' },
          { key: 'href', label: 'Link (np. /wycena)' },
        ]}
        onChange={v => u('footerToolLinks', v)}
        addLabel="Dodaj link w kolumnie Narzędzia"
      />
      <ListEditor
        label="Kolumna: Wsparcie"
        items={Array.isArray(c.footerSupportLinks) ? c.footerSupportLinks : []}
        fields={[
          { key: 'label', label: 'Etykieta' },
          { key: 'href', label: 'Link (np. /pomoc)' },
        ]}
        onChange={v => u('footerSupportLinks', v)}
        addLabel="Dodaj link w kolumnie Wsparcie"
      />

      <SectionHeader title="Dodatkowe opcje stopki" icon="tune" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <ToggleSwitch
          label="Newsletter w stopce"
          description="Pokazuje formularz zapisu na newsletter w kolumnie marki"
          value={c.newsletterEnabled !== false}
          onChange={v => u('newsletterEnabled', v)}
        />
        <TextField label="Etykieta statusu systemu" value={c.supportStatusLabel || ''} onChange={v => u('supportStatusLabel', v)} />
      </div>
    </div>
  );
}
