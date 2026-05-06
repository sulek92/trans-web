'use client';

import * as React from 'react';
import { 
  TextField, 
  ListEditor, 
  StringListEditor, 
  SectionHeader 
} from '../../components';

type Testimonial = { name: string; role: string; text: string; avatarImage: string };
type Stat = { label: string; end: string; suffix: string };

type HomepageContent = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBadge?: string;
  heroVisualImage?: string;
  heroVisualCaption?: string;
  partners?: string[];
  stats?: Stat[];
  testimonials?: Testimonial[];
  supportTitle?: string;
  supportSubtitle?: string;
  supportVisualImage?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaVisualImage?: string;
};

interface HomepageEditorProps {
  initialContent: string; // Raw JSON string
  onSave: (content: string) => void;
  saving: boolean;
}

export function HomepageEditor({ initialContent, onSave, saving }: HomepageEditorProps) {
  const [data, setData] = React.useState<HomepageContent>(() => {
    try {
      return JSON.parse(initialContent || '{}');
    } catch {
      return {};
    }
  });

  const updateField = (key: keyof HomepageContent, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSave} className="space-y-12">
      {/* ── Section: Hero ── */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Sekcja Hero (Główna)" icon="rocket_launch" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField 
            label="Badge (Mały tekst nad tytułem)" 
            value={data.heroBadge || ''} 
            onChange={(v) => updateField('heroBadge', v)} 
          />
          <TextField 
            label="Tytuł Główny" 
            value={data.heroTitle || ''} 
            onChange={(v) => updateField('heroTitle', v)} 
          />
          <TextField 
            className="md:col-span-2"
            label="Podtytuł" 
            value={data.heroSubtitle || ''} 
            onChange={(v) => updateField('heroSubtitle', v)} 
            rows={3}
          />
          <TextField 
            label="Zdjęcie Hero (URL)" 
            value={data.heroVisualImage || ''} 
            onChange={(v) => updateField('heroVisualImage', v)} 
          />
          <TextField 
            label="Podpis pod zdjęciem" 
            value={data.heroVisualCaption || ''} 
            onChange={(v) => updateField('heroVisualCaption', v)} 
          />
        </div>
      </section>

      {/* ── Section: Stats ── */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Statystyki i Liczniki" icon="analytics" />
        <ListEditor
          label="Lista statystyk"
          addLabel="Dodaj licznik"
          items={(data.stats || []) as any}
          onChange={(items) => updateField('stats', items)}
          fields={[
            { key: 'label', label: 'Etykieta (np. Przesyłek)' },
            { key: 'end', label: 'Wartość końcowa (liczba)' },
            { key: 'suffix', label: 'Sufiks (np. + lub %)' }
          ]}
        />
      </section>

      {/* ── Section: Testimonials ── */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Opinie Klientów" icon="format_quote" />
        <ListEditor
          label="Referencje"
          addLabel="Dodaj opinię"
          items={(data.testimonials || []) as any}
          onChange={(items) => updateField('testimonials', items)}
          fields={[
            { key: 'name', label: 'Imię i Nazwisko / Firma' },
            { key: 'role', label: 'Stanowisko / Lokalizacja' },
            { key: 'text', label: 'Treść opinii', type: 'textarea' },
            { key: 'avatarImage', label: 'URL zdjęcia profilowego' }
          ]}
        />
      </section>

      {/* ── Section: Partners ── */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Partnerzy i Przewoźnicy" icon="handshake" />
        <StringListEditor
          label="Logotypy / Nazwy firm"
          addLabel="Dodaj partnera"
          items={data.partners || []}
          onChange={(items) => updateField('partners', items)}
        />
      </section>

      {/* ── Section: Support & CTA ── */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
        <div>
          <SectionHeader title="Sekcja Wsparcia" icon="support_agent" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Tytuł Wsparcia" value={data.supportTitle || ''} onChange={(v) => updateField('supportTitle', v)} />
            <TextField label="URL Zdjęcia Wsparcia" value={data.supportVisualImage || ''} onChange={(v) => updateField('supportVisualImage', v)} />
            <TextField className="md:col-span-2" label="Podtytuł Wsparcia" value={data.supportSubtitle || ''} onChange={(v) => updateField('supportSubtitle', v)} rows={2} />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <SectionHeader title="Sekcja Call to Action (Dół strony)" icon="ads_click" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Tytuł CTA" value={data.ctaTitle || ''} onChange={(v) => updateField('ctaTitle', v)} />
            <TextField label="URL Zdjęcia Tła CTA" value={data.ctaVisualImage || ''} onChange={(v) => updateField('ctaVisualImage', v)} />
            <TextField className="md:col-span-2" label="Podtytuł CTA" value={data.ctaSubtitle || ''} onChange={(v) => updateField('ctaSubtitle', v)} rows={2} />
          </div>
        </div>
      </section>

      {/* ── Action Bar ── */}
      <div className="sticky bottom-6 left-0 right-0 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[24px] border border-white/10 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4 px-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-sm font-bold">Edytujesz Stronę Główną</span>
          </div>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
            >
              Anuluj
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="px-10 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
              {saving ? 'Zapisuję...' : 'Zapisz zmiany'}
              {!saving && <span className="material-symbols-outlined text-sm">save</span>}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
