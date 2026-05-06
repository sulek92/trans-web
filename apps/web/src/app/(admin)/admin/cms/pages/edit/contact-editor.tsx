'use client';

import * as React from 'react';
import { 
  TextField, 
  SectionHeader 
} from '../../components';

type ContactContent = {
  title?: string;
  subtitle?: string;
  phone?: string;
  phoneHours?: string;
  email?: string;
  emailResponseTime?: string;
  companyName?: string;
  street?: string;
  city?: string;
  facebookUrl?: string;
  linkedInUrl?: string;
  mapEmbedUrl?: string;
};

interface ContactEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  saving: boolean;
}

export function ContactEditor({ initialContent, onSave, saving }: ContactEditorProps) {
  const [data, setData] = React.useState<ContactContent>(() => {
    try {
      const parsed = JSON.parse(initialContent || '{}');
      return parsed;
    } catch {
      return {};
    }
  });

  const updateField = (key: keyof ContactContent, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSave} className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Nagłówek Kontaktu" icon="contact_page" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField 
            label="Tytuł (użyj \n dla nowej linii)" 
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
        <SectionHeader title="Szybki Kontakt" icon="call" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Telefon" value={data.phone || ''} onChange={(v) => updateField('phone', v)} />
          <TextField label="Godziny pracy (np. Pon - Pt: 8:00 - 17:00)" value={data.phoneHours || ''} onChange={(v) => updateField('phoneHours', v)} />
          <TextField label="Email" value={data.email || ''} onChange={(v) => updateField('email', v)} />
          <TextField label="Czas odpowiedzi (np. Odpowiemy w 2 godziny)" value={data.emailResponseTime || ''} onChange={(v) => updateField('emailResponseTime', v)} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Dane firmy" icon="business" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextField label="Nazwa firmy" value={data.companyName || ''} onChange={(v) => updateField('companyName', v)} />
          <TextField label="Ulica i numer" value={data.street || ''} onChange={(v) => updateField('street', v)} />
          <TextField label="Kod pocztowy i miasto" value={data.city || ''} onChange={(v) => updateField('city', v)} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Social Media & Mapa" icon="share" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Facebook URL" value={data.facebookUrl || ''} onChange={(v) => updateField('facebookUrl', v)} />
          <TextField label="LinkedIn URL" value={data.linkedInUrl || ''} onChange={(v) => updateField('linkedInUrl', v)} />
          <TextField className="md:col-span-2" label="Google Maps Embed URL" value={data.mapEmbedUrl || ''} onChange={(v) => updateField('mapEmbedUrl', v)} />
        </div>
      </section>

      <div className="sticky bottom-6 left-0 right-0 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[24px] border border-white/10 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4 px-4">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-white text-sm font-bold">Edytujesz Kontakt</span>
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="px-10 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Zapisz Kontakt' : 'Zapisz Kontakt'}
          </button>
        </div>
      </div>
    </form>
  );
}
