"use client";

import * as React from 'react';
import { TextField, ToggleSwitch, ListEditor, StringListEditor, SectionHeader } from '../../components';

interface HomepageData {
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroVisualImage?: string;
  heroVisualCaption?: string;
  partners?: string[];
  activityTicker?: { city: string; status: string; time: string }[];
  howItWorks?: { step: string; title: string; desc: string; icon: string }[];
  stats?: { label: string; end: number; suffix: string }[];
  testimonials?: { name: string; role: string; text: string; avatar: string; avatarImage: string }[];
  supportTitle?: string;
  supportSubtitle?: string;
  supportVisualImage?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaVisualImage?: string;
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): HomepageData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

export const HomepageEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<HomepageData>(() => parseContent(initialContent));

  const update = (patch: Partial<HomepageData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  const activityFields = [
    { key: 'city', label: 'Miasto' },
    { key: 'status', label: 'Status' },
    { key: 'time', label: 'Czas' },
  ];

  const howItWorksFields = [
    { key: 'step', label: 'Krok (np. 01)' },
    { key: 'title', label: 'Tytuł' },
    { key: 'desc', label: 'Opis', type: 'textarea' as const },
    { key: 'icon', label: 'Ikona (Material Symbols)' },
  ];

  const statsFields = [
    { key: 'label', label: 'Etykieta' },
    { key: 'end', label: 'Wartość końcowa (liczba)' },
    { key: 'suffix', label: 'Przyrostek (np. +, %)' },
  ];

  const testimonialFields = [
    { key: 'name', label: 'Imię i nazwisko' },
    { key: 'role', label: 'Stanowisko' },
    { key: 'text', label: 'Treść opinii', type: 'textarea' as const },
    { key: 'avatar', label: 'Avatar (ikonka Material)' },
    { key: 'avatarImage', label: 'Ścieżka do zdjęcia' },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Sekcja Hero" icon="captive_portal" />
        <TextField label="Odznaka (heroBadge)" value={data.heroBadge || ''} onChange={(v) => update({ heroBadge: v })} />
        <TextField label="Tytuł Hero (heroTitle)" value={data.heroTitle || ''} onChange={(v) => update({ heroTitle: v })} />
        <TextField label="Podtytuł Hero (heroSubtitle)" value={data.heroSubtitle || ''} onChange={(v) => update({ heroSubtitle: v })} rows={3} />
        <TextField label="Zdjęcie Hero (heroVisualImage)" value={data.heroVisualImage || ''} onChange={(v) => update({ heroVisualImage: v })} />
        <TextField label="Podpis zdjęcia Hero (heroVisualCaption)" value={data.heroVisualCaption || ''} onChange={(v) => update({ heroVisualCaption: v })} />
      </section>

      {/* Partners */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Partnerzy" icon="handshake" />
        <StringListEditor label="Lista partnerów" items={data.partners || []} onChange={(v) => update({ partners: v })} addLabel="Dodaj partnera" />
      </section>

      {/* Activity Ticker */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Activity Ticker (aktywności na żywo)" icon="pulse_alert" />
        <ListEditor label="Elementy activity ticker" items={(data.activityTicker || []) as unknown as Record<string, string>[]} fields={activityFields} onChange={(v) => update({ activityTicker: v as unknown as HomepageData['activityTicker'] })} addLabel="Dodaj aktywność" />
      </section>

      {/* How It Works */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Jak to działa" icon="play_circle" />
        <ListEditor label="Kroki" items={(data.howItWorks || []) as unknown as Record<string, string>[]} fields={howItWorksFields} onChange={(v) => update({ howItWorks: v as unknown as HomepageData['howItWorks'] })} addLabel="Dodaj krok" />
      </section>

      {/* Stats */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Statystyki (liczniki)" icon="bar_chart" />
        <ListEditor label="Statystyki" items={(data.stats || []).map((s) => ({ label: String(s.label || ''), end: String(s.end ?? ''), suffix: String(s.suffix || '') }))} fields={statsFields} onChange={(v) => update({ stats: v.map((s) => ({ label: s.label, end: Number(s.end) || 0, suffix: s.suffix })) })} addLabel="Dodaj statystykę" />
      </section>

      {/* Testimonials */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Opinie klientów" icon="reviews" />
        <ListEditor label="Opinie" items={(data.testimonials || []) as unknown as Record<string, string>[]} fields={testimonialFields} onChange={(v) => update({ testimonials: v as unknown as HomepageData['testimonials'] })} addLabel="Dodaj opinię" />
      </section>

      {/* Support */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Sekcja Wsparcie" icon="support_agent" />
        <TextField label="Tytuł wsparcia (supportTitle)" value={data.supportTitle || ''} onChange={(v) => update({ supportTitle: v })} />
        <TextField label="Podtytuł wsparcia (supportSubtitle)" value={data.supportSubtitle || ''} onChange={(v) => update({ supportSubtitle: v })} rows={3} />
        <TextField label="Zdjęcie wsparcia (supportVisualImage)" value={data.supportVisualImage || ''} onChange={(v) => update({ supportVisualImage: v })} />
      </section>

      {/* CTA */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Call to Action" icon="campaign" />
        <TextField label="Tytuł CTA (ctaTitle)" value={data.ctaTitle || ''} onChange={(v) => update({ ctaTitle: v })} />
        <TextField label="Podtytuł CTA (ctaSubtitle)" value={data.ctaSubtitle || ''} onChange={(v) => update({ ctaSubtitle: v })} rows={3} />
        <TextField label="Zdjęcie CTA (ctaVisualImage)" value={data.ctaVisualImage || ''} onChange={(v) => update({ ctaVisualImage: v })} />
      </section>

      {/* Save Button */}
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
