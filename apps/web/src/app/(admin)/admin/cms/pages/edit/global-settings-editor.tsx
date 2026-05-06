'use client';

import * as React from 'react';
import { 
  TextField, 
  SectionHeader 
} from '../../components';

type GlobalSettings = {
  siteName?: string;
  contactEmail?: string;
  contactPhone?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  logoUrl?: string;
  footerCopy?: string;
};

interface GlobalSettingsEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  saving: boolean;
}

export function GlobalSettingsEditor({ initialContent, onSave, saving }: GlobalSettingsEditorProps) {
  const [data, setData] = React.useState<GlobalSettings>(() => {
    try {
      return JSON.parse(initialContent || '{}');
    } catch {
      return {};
    }
  });

  const updateField = (key: keyof GlobalSettings, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSave} className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Podstawowe informacje" icon="public" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Nazwa serwisu" value={data.siteName || ''} onChange={(v) => updateField('siteName', v)} />
          <TextField label="URL Logo" value={data.logoUrl || ''} onChange={(v) => updateField('logoUrl', v)} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Globalne dane kontaktowe" icon="contact_page" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Główny e-mail" value={data.contactEmail || ''} onChange={(v) => updateField('contactEmail', v)} />
          <TextField label="Główny telefon" value={data.contactPhone || ''} onChange={(v) => updateField('contactPhone', v)} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Media Społecznościowe" icon="share" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextField label="Facebook URL" value={data.facebookUrl || ''} onChange={(v) => updateField('facebookUrl', v)} />
          <TextField label="LinkedIn URL" value={data.linkedinUrl || ''} onChange={(v) => updateField('linkedinUrl', v)} />
          <TextField label="Instagram URL" value={data.instagramUrl || ''} onChange={(v) => updateField('instagramUrl', v)} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Stopka" icon="bottom_panel_open" />
        <TextField label="Tekst copyright w stopce" value={data.footerCopy || ''} onChange={(v) => updateField('footerCopy', v)} />
      </section>

      <div className="flex gap-4">
        <button 
          type="submit" 
          disabled={saving}
          className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50"
        >
          {saving ? 'Zapisuję...' : 'Zapisz ustawienia globalne'}
        </button>
      </div>
    </form>
  );
}
