'use client';

import * as React from 'react';
import { 
  TextField, 
  ListEditor, 
  SectionHeader 
} from '../../components';

type FAQItem = { q: string; a: string };

type FAQContent = {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
  contactTitle?: string;
  contactDesc?: string;
  contactCta?: string;
};

interface FAQEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  saving: boolean;
}

export function FAQEditor({ initialContent, onSave, saving }: FAQEditorProps) {
  const [data, setData] = React.useState<FAQContent>(() => {
    try {
      return JSON.parse(initialContent || '{}');
    } catch {
      return {};
    }
  });

  const updateField = (key: keyof FAQContent, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSave} className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Nagłówek FAQ" icon="quiz" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField 
            label="Główny Tytuł" 
            value={data.title || ''} 
            onChange={(v) => updateField('title', v)} 
          />
          <TextField 
            label="Podtytuł" 
            value={data.subtitle || ''} 
            onChange={(v) => updateField('subtitle', v)} 
          />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Lista Pytań i Odpowiedzi" icon="format_list_bulleted" />
        <ListEditor
          label="Pytania"
          addLabel="Dodaj pytanie"
          items={(data.items || []) as any}
          onChange={(items) => updateField('items', items)}
          fields={[
            { key: 'q', label: 'Pytanie' },
            { key: 'a', label: 'Odpowiedź', type: 'textarea' }
          ]}
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Sekcja Kontaktu (CTA)" icon="contact_support" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField 
            label="Tytuł Kontaktu" 
            value={data.contactTitle || ''} 
            onChange={(v) => updateField('contactTitle', v)} 
          />
          <TextField 
            label="Tekst przycisku" 
            value={data.contactCta || ''} 
            onChange={(v) => updateField('contactCta', v)} 
          />
          <TextField 
            className="md:col-span-2"
            label="Opis kontaktu" 
            value={data.contactDesc || ''} 
            onChange={(v) => updateField('contactDesc', v)} 
            rows={2}
          />
        </div>
      </section>

      <div className="sticky bottom-6 left-0 right-0 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[24px] border border-white/10 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4 px-4">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-white text-sm font-bold">Edytujesz FAQ</span>
          </div>
          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={saving}
              className="px-10 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:scale-105 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? 'Zapisuję...' : 'Zapisz FAQ'}
              {!saving && <span className="material-symbols-outlined text-sm">save</span>}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
