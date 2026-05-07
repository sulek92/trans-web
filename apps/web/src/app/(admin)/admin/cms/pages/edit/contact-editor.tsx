"use client";

import * as React from 'react';
import { TextField, SectionHeader } from '../../components';

interface ContactData {
  title?: string;
  subtitle?: string;
  phone?: string;
  phoneHours?: string;
  email?: string;
  emailResponseTime?: string;
  companyName?: string;
  street?: string;
  city?: string;
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): ContactData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

export const ContactEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<ContactData>(() => parseContent(initialContent));

  const update = (patch: Partial<ContactData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Nagłówek" icon="title" />
        <TextField label="Tytuł" value={data.title || ''} onChange={(v) => update({ title: v })} />
        <TextField label="Podtytuł" value={data.subtitle || ''} onChange={(v) => update({ subtitle: v })} rows={3} />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Dane kontaktowe" icon="contact_phone" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Telefon" value={data.phone || ''} onChange={(v) => update({ phone: v })} />
          <TextField label="Godziny telefonu" value={data.phoneHours || ''} onChange={(v) => update({ phoneHours: v })} />
          <TextField label="Email" value={data.email || ''} onChange={(v) => update({ email: v })} />
          <TextField label="Czas odpowiedzi email" value={data.emailResponseTime || ''} onChange={(v) => update({ emailResponseTime: v })} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Adres firmy" icon="business" />
        <TextField label="Nazwa firmy" value={data.companyName || ''} onChange={(v) => update({ companyName: v })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Ulica" value={data.street || ''} onChange={(v) => update({ street: v })} />
          <TextField label="Kod pocztowy i miasto" value={data.city || ''} onChange={(v) => update({ city: v })} />
        </div>
      </section>

      <div className="flex gap-4 pb-12">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">save</span>
          {saving ? 'Zapisuję...' : 'Zapisz stronę'}
        </button>
      </div>
    </div>
  );
};
