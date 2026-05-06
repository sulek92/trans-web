'use client';

import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  TextField, 
  ListEditor, 
  SectionHeader 
} from '../../components';

type LegalSection = { title: string; content: string };

type LegalContent = {
  lastUpdated?: string;
  sections?: LegalSection[];
};

interface LegalEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  saving: boolean;
}

export function LegalEditor({ initialContent, onSave, saving }: LegalEditorProps) {
  const [data, setData] = React.useState<LegalContent>(() => {
    try {
      return JSON.parse(initialContent || '{}');
    } catch {
      return { sections: [] };
    }
  });

  const updateField = (key: keyof LegalContent, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSave} className="space-y-12">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Editor Side */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <SectionHeader title="Informacje ogólne" icon="info" />
            <TextField 
              label="Data ostatniej aktualizacji" 
              value={data.lastUpdated || ''} 
              onChange={(v) => updateField('lastUpdated', v)} 
            />
          </section>

          <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <SectionHeader title="Sekcje dokumentu" icon="list_alt" />
            <ListEditor
              label="Rozdziały / Paragrafy"
              addLabel="Dodaj sekcję"
              items={(data.sections || []) as any}
              onChange={(items) => updateField('sections', items)}
              fields={[
                { key: 'title', label: 'Tytuł sekcji' },
                { key: 'content', label: 'Treść (Markdown)', type: 'textarea' }
              ]}
            />
          </section>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50"
            >
              {saving ? 'Zapisuję...' : 'Zapisz dokument'}
            </button>
          </div>
        </div>

        {/* Preview Side */}
        <div className="sticky top-8 space-y-6">
          <section className="bg-[var(--color-surface-container-low)] p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 max-h-[calc(100vh-80px)] overflow-y-auto">
            <SectionHeader title="Podgląd dokumentu" icon="visibility" />
            <div className="space-y-10">
              <p className="text-sm italic text-slate-500">{data.lastUpdated}</p>
              {(data.sections || []).map((s, i) => (
                <div key={i} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800">{i + 1}. {s.title}</h3>
                  <div className="prose prose-slate prose-sm max-w-none bg-white/50 p-4 rounded-xl border border-slate-100">
                    <ReactMarkdown>{s.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {(data.sections || []).length === 0 && (
                <div className="text-center py-20 text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2">article</span>
                  <p>Brak sekcji do podglądu</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
