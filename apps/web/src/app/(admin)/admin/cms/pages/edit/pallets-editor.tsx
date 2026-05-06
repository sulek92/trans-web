'use client';

import * as React from 'react';
import { 
  TextField, 
  ListEditor, 
  StringListEditor,
  SectionHeader 
} from '../../components';

type PalletType = { 
  name: string; 
  dims: string; 
  weight: string; 
  capacity: string; 
  desc: string; 
  icon: string 
};

type PalletsContent = {
  palletTypes?: PalletType[];
  measurementTips?: string[];
};

interface PalletsEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  saving: boolean;
}

export function PalletsEditor({ initialContent, onSave, saving }: PalletsEditorProps) {
  const [data, setData] = React.useState<PalletsContent>(() => {
    try {
      return JSON.parse(initialContent || '{}');
    } catch {
      return {};
    }
  });

  const updateField = (key: keyof PalletsContent, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSave} className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Rodzaje Palet" icon="widgets" />
        <ListEditor
          label="Lista palet"
          addLabel="Dodaj typ palety"
          items={(data.palletTypes || []) as any}
          onChange={(items) => updateField('palletTypes', items)}
          fields={[
            { key: 'name', label: 'Nazwa (np. Paleta Euro)' },
            { key: 'dims', label: 'Wymiary (np. 1200 x 800 mm)' },
            { key: 'weight', label: 'Waga własna' },
            { key: 'capacity', label: 'Nośność' },
            { key: 'desc', label: 'Opis', type: 'textarea' },
            { key: 'icon', label: 'Ikona (Material Symbol)' }
          ]}
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Porady dotyczące pomiarów" icon="straighten" />
        <StringListEditor
          label="Wskazówki (każda w nowej linii)"
          addLabel="Dodaj poradę"
          items={data.measurementTips || []}
          onChange={(items) => updateField('measurementTips', items)}
        />
      </section>

      <div className="sticky bottom-6 left-0 right-0 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[24px] border border-white/10 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4 px-4">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white text-sm font-bold">Edytujesz Typy Palet</span>
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="px-10 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Zapisuję...' : 'Zapisz Typy Palet'}
          </button>
        </div>
      </div>
    </form>
  );
}
