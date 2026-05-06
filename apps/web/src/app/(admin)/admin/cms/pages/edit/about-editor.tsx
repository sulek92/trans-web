'use client';

import * as React from 'react';
import { 
  TextField, 
  ListEditor, 
  SectionHeader 
} from '../../components';

type TeamMember = { name: string; role: string; icon: string };
type ValueItem = { title: string; desc: string; icon: string };
type HeroStat = { value: string; label: string };

type AboutContent = {
  heroTitle?: string;
  heroDesc?: string;
  heroStats?: HeroStat[];
  quote?: string;
  quoteAuthor?: string;
  values?: ValueItem[];
  team?: TeamMember[];
  ctaTitle?: string;
};

interface AboutEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  saving: boolean;
}

export function AboutEditor({ initialContent, onSave, saving }: AboutEditorProps) {
  const [data, setData] = React.useState<AboutContent>(() => {
    try {
      return JSON.parse(initialContent || '{}');
    } catch {
      return {};
    }
  });

  const updateField = (key: keyof AboutContent, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSave} className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Sekcja Hero (Główna)" icon="info" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Tytuł Hero" value={data.heroTitle || ''} onChange={(v) => updateField('heroTitle', v)} />
          <TextField label="Podtytuł Hero" value={data.heroDesc || ''} onChange={(v) => updateField('heroDesc', v)} rows={3} />
        </div>
        <ListEditor
          label="Statystyki"
          addLabel="Dodaj statystykę"
          items={(data.heroStats || []) as any}
          onChange={(items) => updateField('heroStats', items)}
          fields={[
            { key: 'value', label: 'Wartość (np. 1200+)' },
            { key: 'label', label: 'Etykieta (np. Klientów)' }
          ]}
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Cytat i Misja" icon="format_quote" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Treść cytatu" value={data.quote || ''} onChange={(v) => updateField('quote', v)} />
          <TextField label="Autor cytatu" value={data.quoteAuthor || ''} onChange={(v) => updateField('quoteAuthor', v)} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Wartości Firmy" icon="stars" />
        <ListEditor
          label="Nasze wartości"
          addLabel="Dodaj wartość"
          items={(data.values || []) as any}
          onChange={(items) => updateField('values', items)}
          fields={[
            { key: 'title', label: 'Tytuł' },
            { key: 'desc', label: 'Opis', type: 'textarea' },
            { key: 'icon', label: 'Ikona (np. auto_awesome)' }
          ]}
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Zespół" icon="groups" />
        <ListEditor
          label="Członkowie zespołu"
          addLabel="Dodaj osobę"
          items={(data.team || []) as any}
          onChange={(items) => updateField('team', items)}
          fields={[
            { key: 'name', label: 'Imię i Nazwisko' },
            { key: 'role', label: 'Stanowisko' },
            { key: 'icon', label: 'Ikona profilu (np. person)' }
          ]}
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="CTA (Dół strony)" icon="ads_click" />
        <TextField label="Tytuł CTA" value={data.ctaTitle || ''} onChange={(v) => updateField('ctaTitle', v)} />
      </section>

      <div className="sticky bottom-6 left-0 right-0 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[24px] border border-white/10 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4 px-4">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-white text-sm font-bold">Edytujesz O Nas</span>
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="px-10 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Zapisuję...' : 'Zapisz O Nas'}
          </button>
        </div>
      </div>
    </form>
  );
}
