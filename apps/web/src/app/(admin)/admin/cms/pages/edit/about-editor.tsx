"use client";

import * as React from 'react';
import { TextField, ListEditor, SectionHeader } from '../../components';

interface AboutData {
  heroTitle?: string;
  heroDesc?: string;
  heroStats?: { value: string; label: string }[];
  quote?: string;
  quoteAuthor?: string;
  values?: { title: string; icon: string; desc: string }[];
  team?: { name: string; role: string; icon: string }[];
  ctaTitle?: string;
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): AboutData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

const heroStatsFields = [
  { key: 'value', label: 'Wartość (np. 1200+)' },
  { key: 'label', label: 'Etykieta' },
];

const valuesFields = [
  { key: 'title', label: 'Tytuł wartości' },
  { key: 'icon', label: 'Ikona (Material Symbols)' },
  { key: 'desc', label: 'Opis', type: 'textarea' as const },
];

const teamFields = [
  { key: 'name', label: 'Imię i nazwisko' },
  { key: 'role', label: 'Stanowisko' },
  { key: 'icon', label: 'Ikona (Material Symbols)' },
];

export const AboutEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<AboutData>(() => parseContent(initialContent));

  const update = (patch: Partial<AboutData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Sekcja Hero" icon="captive_portal" />
        <TextField label="Tytuł Hero" value={data.heroTitle || ''} onChange={(v) => update({ heroTitle: v })} />
        <TextField label="Opis Hero" value={data.heroDesc || ''} onChange={(v) => update({ heroDesc: v })} rows={4} />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Statystyki Hero" icon="bar_chart" />
        <ListEditor
          label="Statystyki"
          items={(data.heroStats || []) as unknown as Record<string, string>[]}
          fields={heroStatsFields}
          onChange={(v) => update({ heroStats: v as unknown as AboutData['heroStats'] })}
          addLabel="Dodaj statystykę"
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Cytat" icon="format_quote" />
        <TextField label="Cytat" value={data.quote || ''} onChange={(v) => update({ quote: v })} rows={3} />
        <TextField label="Autor cytatu" value={data.quoteAuthor || ''} onChange={(v) => update({ quoteAuthor: v })} />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Wartości" icon="verified_user" />
        <ListEditor
          label="Wartości firmy"
          items={(data.values || []) as unknown as Record<string, string>[]}
          fields={valuesFields}
          onChange={(v) => update({ values: v as unknown as AboutData['values'] })}
          addLabel="Dodaj wartość"
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Zespół" icon="groups" />
        <ListEditor
          label="Członkowie zespołu"
          items={(data.team || []) as unknown as Record<string, string>[]}
          fields={teamFields}
          onChange={(v) => update({ team: v as unknown as AboutData['team'] })}
          addLabel="Dodaj osobę"
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Call to Action" icon="campaign" />
        <TextField label="Tytuł CTA" value={data.ctaTitle || ''} onChange={(v) => update({ ctaTitle: v })} rows={2} />
      </section>

      <div className="flex gap-4 pb-12">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">save</span>
          {saving ? 'Zapisuję...' : 'Zapisz stronę'}
        </button>
      </div>
    </div>
  );
};
