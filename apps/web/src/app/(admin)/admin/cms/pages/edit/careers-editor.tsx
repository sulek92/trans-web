'use client';

import * as React from 'react';
import { 
  TextField, 
  ListEditor, 
  SectionHeader 
} from '../../components';

type ValueItem = { title: string; desc: string; icon: string };
type OfferItem = { title: string; location: string; type: string };

type CareersContent = {
  title?: string;
  subtitle?: string;
  applyNow?: string;
  whyJoin?: string;
  values?: ValueItem[];
  openPositions?: string;
  offers?: OfferItem[];
  noPositions?: string;
};

interface CareersEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  saving: boolean;
}

export function CareersEditor({ initialContent, onSave, saving }: CareersEditorProps) {
  const [data, setData] = React.useState<CareersContent>(() => {
    try {
      return JSON.parse(initialContent || '{}');
    } catch {
      return {};
    }
  });

  const updateField = (key: keyof CareersContent, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSave} className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Sekcja Hero (Kariera)" icon="work" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Tytuł Hero" value={data.title || ''} onChange={(v) => updateField('title', v)} />
          <TextField label="Podtytuł Hero" value={data.subtitle || ''} onChange={(v) => updateField('subtitle', v)} rows={2} />
          <TextField label="Tekst przycisku (Aplikuj)" value={data.applyNow || ''} onChange={(v) => updateField('applyNow', v)} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Dlaczego my?" icon="favorite" />
        <TextField label="Nagłówek sekcji" value={data.whyJoin || ''} onChange={(v) => updateField('whyJoin', v)} />
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
        <SectionHeader title="Oferty Pracy" icon="list_alt" />
        <TextField label="Nagłówek sekcji ofert" value={data.openPositions || ''} onChange={(v) => updateField('openPositions', v)} />
        <TextField label="Komunikat o braku ofert" value={data.noPositions || ''} onChange={(v) => updateField('noPositions', v)} />
        <ListEditor
          label="Lista stanowisk"
          addLabel="Dodaj ofertę"
          items={(data.offers || []) as any}
          onChange={(items) => updateField('offers', items)}
          fields={[
            { key: 'title', label: 'Stanowisko' },
            { key: 'location', label: 'Lokalizacja (np. Warszawa / Zdalnie)' },
            { key: 'type', label: 'Rodzaj (np. Pełny etat)' }
          ]}
        />
      </section>

      <div className="sticky bottom-6 left-0 right-0 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[24px] border border-white/10 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4 px-4">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-white text-sm font-bold">Edytujesz Karierę</span>
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="px-10 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Zapisuję...' : 'Zapisz Karierę'}
          </button>
        </div>
      </div>
    </form>
  );
}
