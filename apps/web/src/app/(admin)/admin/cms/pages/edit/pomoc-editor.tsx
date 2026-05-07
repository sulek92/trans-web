"use client";

import * as React from 'react';
import { TextField, ListEditor, SectionHeader } from '../../components';

interface HelpCategory {
  title?: string;
  icon?: string;
  count?: number;
}

interface HelpFaq {
  q?: string;
  a?: string;
}

interface PomocData {
  title?: string;
  subtitle?: string;
  categories?: HelpCategory[];
  faqItems?: HelpFaq[];
  ctaTitle?: string;
  ctaSubtitle?: string;
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): PomocData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

const categoryFields = [
  { key: 'title', label: 'Tytuł kategorii' },
  { key: 'icon', label: 'Ikona (Material Symbols)' },
  { key: 'count', label: 'Liczba artykułów' },
];

const faqFields = [
  { key: 'q', label: 'Pytanie' },
  { key: 'a', label: 'Odpowiedź', type: 'textarea' as const },
];

export const PomocEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<PomocData>(() => parseContent(initialContent));

  const update = (patch: Partial<PomocData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Nagłówek" icon="title" />
        <TextField label="Tytuł" value={data.title || ''} onChange={(v) => update({ title: v })} />
        <TextField label="Podtytuł" value={data.subtitle || ''} onChange={(v) => update({ subtitle: v })} rows={3} />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Kategorie pomocy" icon="category" />
        <ListEditor
          label="Lista kategorii"
          items={(data.categories || []).map((c) => ({ title: c.title || '', icon: c.icon || '', count: String(c.count ?? '') }))}
          fields={categoryFields}
          onChange={(v) => update({ categories: v.map((c) => ({ title: c.title, icon: c.icon, count: Number(c.count) || 0 })) })}
          addLabel="Dodaj kategorię"
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Pytania i odpowiedzi" icon="quiz" />
        <ListEditor
          label="Lista pytań FAQ"
          items={(data.faqItems || []) as unknown as Record<string, string>[]}
          fields={faqFields}
          onChange={(v) => update({ faqItems: v as unknown as PomocData['faqItems'] })}
          addLabel="Dodaj pytanie"
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Call to Action" icon="campaign" />
        <TextField label="Tytuł CTA" value={data.ctaTitle || ''} onChange={(v) => update({ ctaTitle: v })} />
        <TextField label="Podtytuł CTA" value={data.ctaSubtitle || ''} onChange={(v) => update({ ctaSubtitle: v })} rows={3} />
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
