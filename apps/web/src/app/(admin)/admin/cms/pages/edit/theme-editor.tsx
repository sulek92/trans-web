"use client";

import * as React from 'react';
import { TextField, ToggleSwitch, SectionHeader } from '../../components';

interface ThemeData {
  presetName?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  colorTertiary?: string;
  colorBackground?: string;
  colorSurface?: string;
  colorDivider?: string;
  darkModeEnabled?: boolean;
  colorDarkBg?: string;
  colorDarkSurface?: string;
  colorDarkPrimary?: string;
  fontDisplay?: string;
  fontBody?: string;
  fontMono?: string;
  radiusScale?: string;
  colorCtaBg?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): ThemeData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

export const ThemeEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<ThemeData>(() => parseContent(initialContent));

  const update = (patch: Partial<ThemeData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Preset" icon="palette" />
        <TextField label="Nazwa presetu" value={data.presetName || ''} onChange={(v) => update({ presetName: v })} />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Kolory (Light Mode)" icon="palette" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Kolor główny (Primary)" value={data.colorPrimary || ''} onChange={(v) => update({ colorPrimary: v })} />
          <TextField label="Kolor drugi (Secondary)" value={data.colorSecondary || ''} onChange={(v) => update({ colorSecondary: v })} />
          <TextField label="Kolor trzeci (Tertiary)" value={data.colorTertiary || ''} onChange={(v) => update({ colorTertiary: v })} />
          <TextField label="Tło (Background)" value={data.colorBackground || ''} onChange={(v) => update({ colorBackground: v })} />
          <TextField label="Powierzchnia (Surface)" value={data.colorSurface || ''} onChange={(v) => update({ colorSurface: v })} />
          <TextField label="Rozdzielacz (Divider)" value={data.colorDivider || ''} onChange={(v) => update({ colorDivider: v })} />
          <TextField label="Tło CTA" value={data.colorCtaBg || ''} onChange={(v) => update({ colorCtaBg: v })} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Kolory (Dark Mode)" icon="dark_mode" />
        <ToggleSwitch label="Dark mode włączony" value={!!data.darkModeEnabled} onChange={(v) => update({ darkModeEnabled: v })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Tło Dark (colorDarkBg)" value={data.colorDarkBg || ''} onChange={(v) => update({ colorDarkBg: v })} />
          <TextField label="Powierzchnia Dark (colorDarkSurface)" value={data.colorDarkSurface || ''} onChange={(v) => update({ colorDarkSurface: v })} />
          <TextField label="Kolor główny Dark (colorDarkPrimary)" value={data.colorDarkPrimary || ''} onChange={(v) => update({ colorDarkPrimary: v })} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Gradienty" icon="gradient" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Gradient od (gradientFrom)" value={data.gradientFrom || ''} onChange={(v) => update({ gradientFrom: v })} />
          <TextField label="Gradient do (gradientTo)" value={data.gradientTo || ''} onChange={(v) => update({ gradientTo: v })} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Typografia" icon="text_fields" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TextField label="Font nagłówków" value={data.fontDisplay || ''} onChange={(v) => update({ fontDisplay: v })} />
          <TextField label="Font tekstu" value={data.fontBody || ''} onChange={(v) => update({ fontBody: v })} />
          <TextField label="Font mono" value={data.fontMono || ''} onChange={(v) => update({ fontMono: v })} />
        </div>
        <TextField label="Skala zaokrągleń (radiusScale)" value={data.radiusScale || ''} onChange={(v) => update({ radiusScale: v })} />
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
