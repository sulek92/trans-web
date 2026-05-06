'use client';

import * as React from 'react';
import { 
  TextField, 
  ListEditor, 
  StringListEditor,
  SectionHeader 
} from '../../components';

type BenefitItem = { title: string; desc: string; icon: string };

type OfferContent = {
  heroBadge?: string;
  heroTitle?: string;
  heroDesc?: string;
  benefits?: BenefitItem[];
  integrations?: string[];
};

interface OfferEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  saving: boolean;
}

export function OfferEditor({ initialContent, onSave, saving }: OfferEditorProps) {
  const [data, setData] = React.useState<OfferContent>(() => {
    try {
      return JSON.parse(initialContent || '{}');
    } catch {
      return {};
    }
  });

  const updateField = (key: keyof OfferContent, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSave} className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Sekcja Hero (B2B)" icon="corporate_fare" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Badge (np. Program Partnerski)" value={data.heroBadge || ''} onChange={(v) => updateField('heroBadge', v)} />
          <TextField label="Tytuł Hero" value={data.heroTitle || ''} onChange={(v) => updateField('heroTitle', v)} />
          <TextField className="md:col-span-2" label="Opis Hero" value={data.heroDesc || ''} onChange={(v) => updateField('heroDesc', v)} rows={3} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Korzyści dla Biznesu" icon="military_tech" />
        <ListEditor
          label="Lista korzyści"
          addLabel="Dodaj korzyść"
          items={(data.benefits || []) as any}
          onChange={(items) => updateField('benefits', items)}
          fields={[
            { key: 'title', label: 'Tytuł' },
            { key: 'desc', label: 'Opis', type: 'textarea' },
            { key: 'icon', label: 'Ikona (np. receipt_long)' }
          ]}
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Integracje" icon="integration_instructions" />
        <StringListEditor
          label="Systemy (np. SAP, Allegro)"
          addLabel="Dodaj system"
          items={data.integrations || []}
          onChange={(items) => updateField('integrations', items)}
        />
      </section>

      <div className="sticky bottom-6 left-0 right-0 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[24px] border border-white/10 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4 px-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white text-sm font-bold">Edytujesz Ofertę B2B</span>
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="px-10 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Zapisuję...' : 'Zapisz Ofertę'}
          </button>
        </div>
      </div>
    </form>
  );
}
