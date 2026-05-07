"use client";

import * as React from 'react';
import { TextField, ListEditor, SectionHeader } from '../../components';

interface LegalSection {
  title?: string;
  content?: string;
}

interface LegalData {
  lastUpdated?: string;
  sections?: LegalSection[];
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): LegalData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

const sectionFields = [
  { key: 'title', label: 'Tytuł sekcji' },
  { key: 'content', label: 'Treść sekcji', type: 'textarea' as const },
];

export const LegalEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<LegalData>(() => parseContent(initialContent));

  const update = (patch: Partial<LegalData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Informacje" icon="info" />
        <TextField label="Data ostatniej aktualizacji" value={data.lastUpdated || ''} onChange={(v) => update({ lastUpdated: v })} />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Sekcje dokumentu" icon="article" />
        <ListEditor
          label="Lista sekcji"
          items={(data.sections || []) as unknown as Record<string, string>[]}
          fields={sectionFields}
          onChange={(v) => update({ sections: v as unknown as LegalData['sections'] })}
          addLabel="Dodaj sekcję"
        />
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
