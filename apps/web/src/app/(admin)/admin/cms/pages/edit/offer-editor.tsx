"use client";

import * as React from 'react';
import { TextField, ListEditor, StringListEditor, SectionHeader } from '../../components';

interface OfferData {
  heroBadge?: string;
  heroTitle?: string;
  heroDesc?: string;
  benefits?: { title: string; icon: string; desc: string }[];
  integrations?: string[];
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): OfferData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

const benefitFields = [
  { key: 'title', label: 'Tytuł benefitu' },
  { key: 'icon', label: 'Ikona (Material Symbols)' },
  { key: 'desc', label: 'Opis', type: 'textarea' as const },
];

export const OfferEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<OfferData>(() => parseContent(initialContent));

  const update = (patch: Partial<OfferData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Sekcja Hero" icon="captive_portal" />
        <TextField label="Odznaka (heroBadge)" value={data.heroBadge || ''} onChange={(v) => update({ heroBadge: v })} />
        <TextField label="Tytuł Hero" value={data.heroTitle || ''} onChange={(v) => update({ heroTitle: v })} />
        <TextField label="Opis Hero" value={data.heroDesc || ''} onChange={(v) => update({ heroDesc: v })} rows={3} />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Benefity B2B" icon="card_giftcard" />
        <ListEditor
          label="Lista benefitów"
          items={(data.benefits || []) as unknown as Record<string, string>[]}
          fields={benefitFields}
          onChange={(v) => update({ benefits: v as unknown as OfferData['benefits'] })}
          addLabel="Dodaj benefit"
        />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Integracje" icon="integration_instructions" />
        <StringListEditor
          label="Lista integracji"
          items={data.integrations || []}
          onChange={(v) => update({ integrations: v })}
          addLabel="Dodaj integrację"
        />
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
