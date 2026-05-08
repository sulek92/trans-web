"use client";

import * as React from 'react';
import { TextField, ListEditor, StringListEditor, SectionHeader } from '../../components';

interface PalletType {
  name?: string;
  dims?: string;
  weight?: string;
  capacity?: string;
  desc?: string;
  icon?: string;
}

interface PalletsData {
  palletTypes?: PalletType[];
  measurementTips?: string[];
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): PalletsData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

const palletTypeFields = [
  { key: 'name', label: 'Nazwa palety' },
  { key: 'dims', label: 'Wymiary (np. 1200 x 800 mm)' },
  { key: 'weight', label: 'Waga (np. ok. 25 kg)' },
  { key: 'capacity', label: 'Udźwig (np. do 1500 kg)' },
  { key: 'desc', label: 'Opis', type: 'textarea' as const },
  { key: 'icon', label: 'Ikona (Material Symbols)' },
];

export const PalletsEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<PalletsData>(() => parseContent(initialContent));

  const update = (patch: Partial<PalletsData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Typy palet" icon="pallet" />
        <ListEditor
          label="Lista typów palet"
          items={(data.palletTypes || []) as unknown as Record<string, string>[]}
          fields={palletTypeFields}
          onChange={(v) => update({ palletTypes: v as unknown as PalletsData['palletTypes'] })}
          addLabel="Dodaj typ palety"
        />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Porady pomiarowe" icon="tips_and_updates" />
        <StringListEditor
          label="Lista porad"
          items={data.measurementTips || []}
          onChange={(v) => update({ measurementTips: v })}
          addLabel="Dodaj poradę"
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
