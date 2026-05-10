"use client";

import * as React from 'react';
import { TextField, ListEditor, SectionHeader } from '../../components';

interface DomesticRate {
  type?: string;
  price?: string;
  icon?: string;
}

interface InternationalRate {
  country?: string;
  price?: string;
  eta?: string;
}

interface GuaranteeBox {
  label?: string;
  value?: string;
  sub?: string;
}

interface PricingFaq {
  q?: string;
  a?: string;
}

interface CennikData {
  title?: string;
  subtitle?: string;
  exchangeRate?: number;
  domesticRates?: DomesticRate[];
  internationalRates?: InternationalRate[];
  guaranteeTitle?: string;
  guaranteeDesc?: string;
  guaranteeBoxes?: GuaranteeBox[];
  pricingFaq?: PricingFaq[];
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): CennikData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

const domesticRateFields = [
  { key: 'type', label: 'Typ palety' },
  { key: 'price', label: 'Cena (np. 145,00)' },
  { key: 'icon', label: 'Ikona (Material Symbols)' },
];

const internationalRateFields = [
  { key: 'country', label: 'Kraj' },
  { key: 'price', label: 'Cena (np. 85,00)' },
  { key: 'eta', label: 'Czas dostawy (np. 2-3 dni)' },
];

const guaranteeBoxFields = [
  { key: 'label', label: 'Etykieta' },
  { key: 'value', label: 'Wartość' },
  { key: 'sub', label: 'Podtytuł' },
];

const pricingFaqFields = [
  { key: 'q', label: 'Pytanie' },
  { key: 'a', label: 'Odpowiedź', type: 'textarea' as const },
];

export const CennikEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<CennikData>(() => parseContent(initialContent));

  const update = (patch: Partial<CennikData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Nagłówek" icon="title" />
        <TextField label="Tytuł" value={data.title || ''} onChange={(v) => update({ title: v })} />
        <TextField label="Podtytuł" value={data.subtitle || ''} onChange={(v) => update({ subtitle: v })} rows={3} />
        <TextField label="Kurs EUR/PLN (exchangeRate)" value={String(data.exchangeRate ?? '')} onChange={(v) => update({ exchangeRate: parseFloat(v) || 0 })} />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Stawki krajowe" icon="flag" />
        <ListEditor
          label="Lista stawek krajowych"
          items={(data.domesticRates || []) as unknown as Record<string, string>[]}
          fields={domesticRateFields}
          onChange={(v) => update({ domesticRates: v as unknown as CennikData['domesticRates'] })}
          addLabel="Dodaj stawkę"
        />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Stawki międzynarodowe" icon="public" />
        <ListEditor
          label="Lista stawek międzynarodowych"
          items={(data.internationalRates || []) as unknown as Record<string, string>[]}
          fields={internationalRateFields}
          onChange={(v) => update({ internationalRates: v as unknown as CennikData['internationalRates'] })}
          addLabel="Dodaj stawkę"
        />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="Gwarancja najniższej ceny" icon="verified" />
        <TextField label="Tytuł gwarancji" value={data.guaranteeTitle || ''} onChange={(v) => update({ guaranteeTitle: v })} />
        <TextField label="Opis gwarancji" value={data.guaranteeDesc || ''} onChange={(v) => update({ guaranteeDesc: v })} rows={3} />
        <ListEditor
          label="Ramki gwarancji"
          items={(data.guaranteeBoxes || []) as unknown as Record<string, string>[]}
          fields={guaranteeBoxFields}
          onChange={(v) => update({ guaranteeBoxes: v as unknown as CennikData['guaranteeBoxes'] })}
          addLabel="Dodaj ramkę"
        />
      </section>

      <section className="bg-[var(--color-surface-primary)] p-8 rounded-[32px] border border-[var(--color-divider)] shadow-sm space-y-6">
        <SectionHeader title="FAQ cenowe" icon="quiz" />
        <ListEditor
          label="Lista pytań"
          items={(data.pricingFaq || []) as unknown as Record<string, string>[]}
          fields={pricingFaqFields}
          onChange={(v) => update({ pricingFaq: v as unknown as CennikData['pricingFaq'] })}
          addLabel="Dodaj pytanie"
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
