"use client";

import * as React from 'react';
import { TextField, SectionHeader } from '../../components';

interface BlogData {
  newsletterTitle?: string;
  newsletterDesc?: string;
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): BlogData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

export const BlogEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<BlogData>(() => parseContent(initialContent));

  const update = (patch: Partial<BlogData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Newsletter na blogu" icon="mail" />
        <TextField label="Tytuł newslettera" value={data.newsletterTitle || ''} onChange={(v) => update({ newsletterTitle: v })} />
        <TextField label="Opis newslettera" value={data.newsletterDesc || ''} onChange={(v) => update({ newsletterDesc: v })} rows={3} />
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
