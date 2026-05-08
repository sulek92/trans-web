"use client";

import * as React from 'react';
import { TextField, ListEditor, SectionHeader } from '../../components';

interface CareersData {
  title?: string;
  subtitle?: string;
  applyNow?: string;
  whyJoin?: string;
  values?: { title: string; icon: string; desc: string }[];
  openPositions?: string;
  offers?: { title: string; location: string; type: string }[];
  noPositions?: string;
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): CareersData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

const valuesFields = [
  { key: 'title', label: 'Tytuł' },
  { key: 'icon', label: 'Ikona (Material Symbols)' },
  { key: 'desc', label: 'Opis', type: 'textarea' as const },
];

const offerFields = [
  { key: 'title', label: 'Stanowisko' },
  { key: 'location', label: 'Lokalizacja' },
  { key: 'type', label: 'Typ zatrudnienia' },
];

export const CareersEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<CareersData>(() => parseContent(initialContent));

  const update = (patch: Partial<CareersData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Sekcja Hero" icon="captive_portal" />
        <TextField label="Tytuł strony (title)" value={data.title || ''} onChange={(v) => update({ title: v })} />
        <TextField label="Podtytuł / Opis (subtitle)" value={data.subtitle || ''} onChange={(v) => update({ subtitle: v })} rows={3} />
        <TextField label="Tekst przycisku Aplikuj (applyNow)" value={data.applyNow || ''} onChange={(v) => update({ applyNow: v })} />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Dlaczego warto do nas dołączyć" icon="thumb_up" />
        <TextField label="Nagłówek sekcji (whyJoin)" value={data.whyJoin || ''} onChange={(v) => update({ whyJoin: v })} />
        <ListEditor
          label="Wartości (values)"
          items={(data.values || []) as unknown as Record<string, string>[]}
          fields={valuesFields}
          onChange={(v) => update({ values: v as unknown as CareersData['values'] })}
          addLabel="Dodaj wartość"
        />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Oferty pracy" icon="work" />
        <TextField label="Nagłówek sekcji (openPositions)" value={data.openPositions || ''} onChange={(v) => update({ openPositions: v })} />
        <ListEditor
          label="Oferty (offers)"
          items={(data.offers || []) as unknown as Record<string, string>[]}
          fields={offerFields}
          onChange={(v) => update({ offers: v as unknown as CareersData['offers'] })}
          addLabel="Dodaj ofertę"
        />
        <TextField label="Tekst gdy brak ofert (noPositions)" value={data.noPositions || ''} onChange={(v) => update({ noPositions: v })} />
      </section>

      <div className="flex gap-4 pb-12">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--color-primary)] text-[var(--color-background)] px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">save</span>
          {saving ? 'Zapisuję...' : 'Zapisz stronę'}
        </button>
      </div>
    </div>
  );
};
