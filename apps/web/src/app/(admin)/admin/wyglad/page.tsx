'use client';

import * as React from 'react';
import { getCookie } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api-url';

interface ThemeConfig {
  presetName: string;
  colorPrimary: string;
  colorSecondary: string;
  colorTertiary: string;
  colorBackground: string;
  colorSurface: string;
  colorDivider: string;
  darkModeEnabled: boolean;
  colorDarkBg: string;
  colorDarkSurface: string;
  colorDarkPrimary: string;
  fontDisplay: string;
  fontBody: string;
  radiusScale: string;
  colorCtaBg: string;
  gradientFrom: string;
  gradientTo: string;
}

const DEFAULT_THEME: ThemeConfig = {
  presetName: 'PaletBroker Teal',
  colorPrimary: '#005258',
  colorSecondary: '#006d30',
  colorTertiary: '#713c17',
  colorBackground: '#f7fafa',
  colorSurface: '#ffffff',
  colorDivider: '#dde0e5',
  darkModeEnabled: true,
  colorDarkBg: '#0f1117',
  colorDarkSurface: '#1a1d27',
  colorDarkPrimary: '#2dd4bf',
  fontDisplay: 'Plus Jakarta Sans',
  fontBody: 'Outfit',
  radiusScale: 'default',
  colorCtaBg: '#005258',
  gradientFrom: '#005258',
  gradientTo: '#00a1a1',
};

const PRESETS: { name: string; primary: string; secondary: string; tertiary: string; bg: string }[] = [
  { name: 'PaletBroker Teal', primary: '#005258', secondary: '#006d30', tertiary: '#713c17', bg: '#f7fafa' },
  { name: 'Royal Blue', primary: '#1a237e', secondary: '#0d47a1', tertiary: '#4a148c', bg: '#f5f6fa' },
  { name: 'Forest Green', primary: '#1b5e20', secondary: '#33691e', tertiary: '#bf360c', bg: '#f5faf5' },
  { name: 'Slate Dark', primary: '#334155', secondary: '#475569', tertiary: '#78350f', bg: '#f8fafc' },
  { name: 'Crimson Red', primary: '#991b1b', secondary: '#9a3412', tertiary: '#713f12', bg: '#faf5f5' },
  { name: 'Purple Accent', primary: '#6b21a8', secondary: '#7e22ce', tertiary: '#a16207', bg: '#faf5ff' },
];

const FONT_OPTIONS = [
  'Plus Jakarta Sans', 'Inter', 'Roboto', 'Poppins', 'Outfit', 'Montserrat', 'Lato', 'Open Sans', 'Nunito', 'DM Sans',
];

const RADIUS_OPTIONS = [
  { label: 'Ostre', value: 'sharp', preview: '4px' },
  { label: 'Domyślne', value: 'default', preview: '16px' },
  { label: 'Zaokrąglone', value: 'rounded', preview: '28px' },
  { label: 'Maksymalne', value: 'full', preview: '9999px' },
];

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-12 h-12 rounded-xl border-2 border-[var(--color-divider)] cursor-pointer appearance-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-lg" />
      </div>
      <div className="flex-grow">
        <div className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-1">{label}</div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="text-sm font-mono bg-[var(--color-surface-container-low)] border border-[var(--color-divider)] rounded-lg px-3 py-1.5 w-28 outline-none focus:border-[var(--color-primary)]" />
      </div>
    </div>
  );
}

export default function ThemeEditorPage() {
  const [theme, setTheme] = React.useState<ThemeConfig>(DEFAULT_THEME);
  const [saving, setSaving] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    const apiUrl = getApiBaseUrl();
    fetch(`${apiUrl}/cms/pages/theme`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.content) {
          const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
          setTheme(prev => ({ ...prev, ...content }));
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const update = <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTheme(prev => ({
      ...prev,
      presetName: preset.name,
      colorPrimary: preset.primary,
      colorSecondary: preset.secondary,
      colorTertiary: preset.tertiary,
      colorBackground: preset.bg,
      colorCtaBg: preset.primary,
      gradientFrom: preset.primary,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const apiUrl = getApiBaseUrl();
      const token = getCookie('pb_auth_token');
      const res = await fetch(`${apiUrl}/cms/pages/theme`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: JSON.stringify(theme), title: 'Konfiguracja Wyglądu', isPublished: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage({ type: 'success', text: 'Zapisano! Zmiany pojawią się na stronie w ciągu 60 sekund.' });
    } catch (err) {
      setMessage({ type: 'error', text: `Błąd zapisu: ${err instanceof Error ? err.message : 'Nieznany błąd'}` });
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-background)] flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-3xl">palette</span>
            Edytor wyglądu
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-2">Zarządzaj kolorami, typografią i zaokrągleniami UI. Zmiany są stosowane globalnie.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--color-primary)] text-[var(--color-background)] px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-surface-tint)] transition-premium shadow-lg disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">{saving ? 'hourglass_top' : 'save'}</span>
          {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </button>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <span className="material-symbols-outlined text-lg">{message.type === 'success' ? 'check_circle' : 'error'}</span>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Presets */}
          <div className="bg-[var(--color-surface-primary)] p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--color-primary)]">auto_awesome</span>
              Presety kolorów
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    theme.presetName === preset.name 
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)] shadow-md' 
                      : 'border-[var(--color-divider)] hover:border-[var(--color-outline-variant)]'
                  }`}
                >
                  <div className="flex gap-2 mb-3">
                    {[preset.primary, preset.secondary, preset.tertiary].map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full shadow-inner border border-white/20" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="text-xs font-bold">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-[var(--color-surface-primary)] p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--color-primary)]">format_color_fill</span>
              Kolory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput label="Primary" value={theme.colorPrimary} onChange={v => update('colorPrimary', v)} />
              <ColorInput label="Secondary" value={theme.colorSecondary} onChange={v => update('colorSecondary', v)} />
              <ColorInput label="Tertiary" value={theme.colorTertiary} onChange={v => update('colorTertiary', v)} />
              <ColorInput label="Tło (Background)" value={theme.colorBackground} onChange={v => update('colorBackground', v)} />
              <ColorInput label="Powierzchnia" value={theme.colorSurface} onChange={v => update('colorSurface', v)} />
              <ColorInput label="Separator (Divider)" value={theme.colorDivider} onChange={v => update('colorDivider', v)} />
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-divider)]">
              <h3 className="text-sm font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-4">CTA i Gradient</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ColorInput label="CTA Background" value={theme.colorCtaBg} onChange={v => update('colorCtaBg', v)} />
                <ColorInput label="Gradient od" value={theme.gradientFrom} onChange={v => update('gradientFrom', v)} />
                <ColorInput label="Gradient do" value={theme.gradientTo} onChange={v => update('gradientTo', v)} />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-divider)]">
              <h3 className="text-sm font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-4">Tryb ciemny</h3>
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => update('darkModeEnabled', !theme.darkModeEnabled)}
                  className={`w-12 h-7 rounded-full transition-all relative ${theme.darkModeEnabled ? 'bg-[var(--color-primary)]' : 'bg-slate-300'}`}
                >
                  <div className={`absolute w-5 h-5 bg-[var(--color-surface-primary)] rounded-full top-1 shadow-md transition-all ${theme.darkModeEnabled ? 'left-6' : 'left-1'}`}></div>
                </button>
                <span className="text-sm font-bold">{theme.darkModeEnabled ? 'Włączony' : 'Wyłączony'}</span>
              </div>
              {theme.darkModeEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ColorInput label="Dark BG" value={theme.colorDarkBg} onChange={v => update('colorDarkBg', v)} />
                  <ColorInput label="Dark Surface" value={theme.colorDarkSurface} onChange={v => update('colorDarkSurface', v)} />
                  <ColorInput label="Dark Primary" value={theme.colorDarkPrimary} onChange={v => update('colorDarkPrimary', v)} />
                </div>
              )}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-[var(--color-surface-primary)] p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--color-primary)]">text_fields</span>
              Typografia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-2 block">Font nagłówków (Display)</label>
                <select
                  value={theme.fontDisplay}
                  onChange={e => update('fontDisplay', e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-divider)] bg-[var(--color-surface-primary)] outline-none focus:border-[var(--color-primary)] transition-colors"
                >
                  {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div className="mt-3 text-2xl font-bold" style={{ fontFamily: theme.fontDisplay }}>Aa Bb Cc 123</div>
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-2 block">Font treści (Body)</label>
                <select
                  value={theme.fontBody}
                  onChange={e => update('fontBody', e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-divider)] bg-[var(--color-surface-primary)] outline-none focus:border-[var(--color-primary)] transition-colors"
                >
                  {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div className="mt-3 text-base" style={{ fontFamily: theme.fontBody }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
              </div>
            </div>
          </div>

          {/* Border Radius */}
          <div className="bg-[var(--color-surface-primary)] p-8 rounded-2xl border border-[var(--color-divider)] shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--color-primary)]">rounded_corner</span>
              Zaokrąglenia (Border Radius)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {RADIUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update('radiusScale', opt.value)}
                  className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                    theme.radiusScale === opt.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-highlight)]'
                      : 'border-[var(--color-divider)] hover:border-[var(--color-outline-variant)]'
                  }`}
                >
                  <div
                    className="w-16 h-16 bg-[var(--color-primary)]"
                    style={{ borderRadius: opt.preview }}
                  />
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="bg-[var(--color-surface-primary)] p-6 rounded-2xl border border-[var(--color-divider)] shadow-sm">
              <h3 className="text-sm font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-4">Podgląd na żywo</h3>
              <div className="rounded-xl overflow-hidden border border-[var(--color-divider)]" style={{ backgroundColor: theme.colorBackground }}>
                {/* Mini navbar */}
                <div className="flex items-center gap-3 p-4 bg-[var(--color-surface-primary)] border-b border-[var(--color-divider)]">
                  <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: theme.colorPrimary }}></div>
                  <div className="text-xs font-bold" style={{ color: theme.colorPrimary }}>PaletBroker</div>
                  <div className="ml-auto flex gap-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-1.5 rounded-full bg-slate-200"></div>)}
                  </div>
                </div>

                {/* Mini hero */}
                <div className="p-6">
                  <div className="w-20 h-2 rounded mb-2" style={{ backgroundColor: theme.colorPrimary, opacity: 0.3 }}></div>
                  <div className="w-full h-3 rounded mb-1 bg-slate-800"></div>
                  <div className="w-3/4 h-3 rounded mb-4 bg-slate-800"></div>
                  <div className="w-2/3 h-2 rounded mb-4 bg-slate-300"></div>
                  <div className="flex gap-2">
                    <div className="h-8 px-4 rounded-lg text-[10px] text-[var(--color-background)] flex items-center font-bold" style={{ backgroundColor: theme.colorPrimary }}>CTA</div>
                    <div className="h-8 px-4 rounded-lg text-[10px] flex items-center font-bold border" style={{ borderColor: theme.colorDivider }}>Link</div>
                  </div>
                </div>

                {/* Mini cards */}
                <div className="px-6 pb-4 grid grid-cols-3 gap-2">
                  {[theme.colorPrimary, theme.colorSecondary, theme.colorTertiary].map((c, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[var(--color-surface-primary)] border" style={{ borderColor: theme.colorDivider }}>
                      <div className="w-6 h-6 rounded-md mb-2" style={{ backgroundColor: c, opacity: 0.2 }}></div>
                      <div className="w-full h-1.5 rounded bg-slate-200 mb-1"></div>
                      <div className="w-2/3 h-1 rounded bg-[var(--color-surface-container-high)]"></div>
                    </div>
                  ))}
                </div>

                {/* Mini CTA section */}
                <div className="m-4 p-4 rounded-xl text-center" style={{ backgroundColor: theme.colorCtaBg }}>
                  <div className="w-20 h-2 rounded bg-[var(--color-surface-primary)]/40 mx-auto mb-2"></div>
                  <div className="w-16 h-6 rounded-lg bg-[var(--color-surface-primary)] mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Gradient preview */}
            <div className="bg-[var(--color-surface-primary)] p-6 rounded-2xl border border-[var(--color-divider)] shadow-sm">
              <h3 className="text-sm font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-4">Gradient</h3>
              <div
                className="h-16 rounded-2xl shadow-inner"
                style={{ background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})` }}
              ></div>
            </div>

            {/* Dark mode preview */}
            {theme.darkModeEnabled && (
              <div className="p-6 rounded-2xl border border-slate-700 shadow-sm" style={{ backgroundColor: theme.colorDarkBg }}>
                <h3 className="text-sm font-bold text-[var(--color-background)]/40 uppercase tracking-widest mb-4">Dark mode</h3>
                <div className="p-4 rounded-xl" style={{ backgroundColor: theme.colorDarkSurface }}>
                  <div className="w-20 h-2 rounded mb-2" style={{ backgroundColor: theme.colorDarkPrimary }}></div>
                  <div className="w-full h-2 rounded bg-[var(--color-surface-primary)]/10 mb-1"></div>
                  <div className="w-2/3 h-2 rounded bg-[var(--color-surface-primary)]/5"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
