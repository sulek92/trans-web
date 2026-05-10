"use client";

import * as React from 'react';
import { TextField, ListEditor, SectionHeader } from '../../components';

interface FAQData {
  title?: string;
  subtitle?: string;
  items?: { q: string; a: string }[];
  contactTitle?: string;
  contactDesc?: string;
  contactCta?: string;
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): FAQData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

const faqFields = [
  { key: 'q', label: 'Pytanie' },
  { key: 'a', label: 'Odpowiedź', type: 'textarea' as const },
];

export const FAQEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<FAQData>(() => parseContent(initialContent));

  const update = (patch: Partial<FAQData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Nagłówek strony" icon="title" />
        <TextField label="Tytuł strony (title)" value={data.title || ''} onChange={(v) => update({ title: v })} />
        <TextField label="Podtytuł (subtitle)" value={data.subtitle || ''} onChange={(v) => update({ subtitle: v })} rows={2} />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Pytania i odpowiedzi" icon="quiz" />
        <ListEditor
          label="Lista pytań FAQ (items)"
          items={(data.items || []) as unknown as Record<string, string>[]}
          fields={faqFields}
          onChange={(v) => setData((prev) => ({ ...prev, items: v as unknown as FAQData['items'] }))}
          addLabel="Dodaj pytanie"
        />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Sekcja kontaktu (CTA)" icon="contact_support" />
        <TextField label="Tytuł kontaktu (contactTitle)" value={data.contactTitle || ''} onChange={(v) => update({ contactTitle: v })} />
        <TextField label="Opis kontaktu (contactDesc)" value={data.contactDesc || ''} onChange={(v) => update({ contactDesc: v })} rows={2} />
        <TextField label="Tekst przycisku (contactCta)" value={data.contactCta || ''} onChange={(v) => update({ contactCta: v })} />
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
