import { getCmsContent } from '@/lib/cms';
import { GlobalDataProvider, GlobalSettings } from '@/components/providers/global-data-provider';

interface ThemeConfig {
  colorPrimary: string;
  colorSecondary: string;
  colorTertiary: string;
  colorBackground: string;
  colorSurface: string;
  colorDivider: string;
  colorCtaBg: string;
  gradientFrom: string;
  gradientTo: string;
  darkModeEnabled: boolean;
  colorDarkBg: string;
  colorDarkSurface: string;
  colorDarkPrimary: string;
  fontDisplay: string;
  fontBody: string;
  radiusScale: string;
}

function hexToRgb(hex: string): [number, number, number] {
  if (!hex || typeof hex !== 'string') return [0, 0, 0];
  const h = hex.replace('#', '');
  if (h.length < 6) return [0, 0, 0];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount
  );
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function getRadiusVars(scale: string): string[] {
  switch (scale) {
    case 'sharp':
      return [
        '--radius-DEFAULT: 0.0625rem;',
        '--radius-lg: 0.125rem;',
        '--radius-xl: 0.25rem;',
        '--radius-full: 0.5rem;',
      ];
    case 'rounded':
      return [
        '--radius-DEFAULT: 0.5rem;',
        '--radius-lg: 0.75rem;',
        '--radius-xl: 1rem;',
        '--radius-full: 1.25rem;',
      ];
    case 'full':
      return [
        '--radius-DEFAULT: 0.75rem;',
        '--radius-lg: 1rem;',
        '--radius-xl: 1.5rem;',
        '--radius-full: 9999px;',
      ];
    default:
      return [
        '--radius-DEFAULT: 0.125rem;',
        '--radius-lg: 0.25rem;',
        '--radius-xl: 0.5rem;',
        '--radius-full: 0.75rem;',
      ];
  }
}

function generateOverrides(theme: ThemeConfig): string {
  const p = theme.colorPrimary;
  const s = theme.colorSecondary;
  const t = theme.colorTertiary;

  const primaryContainer = darken(p, 0.1);
  const onPrimaryContainer = lighten(p, 0.7);
  const inversePrimary = lighten(p, 0.5);
  const primaryFixed = lighten(p, 0.65);
  const primaryFixedDim = lighten(p, 0.5);
  const primaryHighlight = lighten(p, 0.8);
  const surfaceTint = darken(p, 0.05);
  const onPrimaryFixed = darken(p, 0.6);
  const onPrimaryFixedVariant = darken(p, 0.1);

  const secondaryContainer = lighten(s, 0.6);
  const onSecondaryContainer = darken(s, 0.05);
  const secondaryFixed = lighten(s, 0.62);
  const secondaryFixedDim = lighten(s, 0.45);

  const tertiaryContainer = darken(t, 0.1);
  const onTertiaryContainer = lighten(t, 0.7);
  const tertiaryFixed = lighten(t, 0.7);
  const tertiaryFixedDim = lighten(t, 0.5);

  const lightLines = [
    `--color-primary: ${p};`,
    `--color-primary-hover: ${darken(p, 0.1)};`,
    `--color-primary-container: ${primaryContainer};`,
    `--color-on-primary-container: ${onPrimaryContainer};`,
    `--color-inverse-primary: ${inversePrimary};`,
    `--color-primary-fixed: ${primaryFixed};`,
    `--color-primary-fixed-dim: ${primaryFixedDim};`,
    `--color-on-primary-fixed: ${onPrimaryFixed};`,
    `--color-on-primary-fixed-variant: ${onPrimaryFixedVariant};`,
    `--color-primary-highlight: ${primaryHighlight};`,
    `--color-surface-tint: ${surfaceTint};`,
    `--color-secondary: ${s};`,
    `--color-secondary-container: ${secondaryContainer};`,
    `--color-on-secondary-container: ${onSecondaryContainer};`,
    `--color-secondary-fixed: ${secondaryFixed};`,
    `--color-secondary-fixed-dim: ${secondaryFixedDim};`,
    `--color-tertiary: ${t};`,
    `--color-tertiary-container: ${tertiaryContainer};`,
    `--color-on-tertiary-container: ${onTertiaryContainer};`,
    `--color-tertiary-fixed: ${tertiaryFixed};`,
    `--color-tertiary-fixed-dim: ${tertiaryFixedDim};`,
    `--color-background: ${theme.colorBackground || '#ffffff'};`,
    `--color-on-background: #0f172a;`,
    `--color-surface: ${theme.colorBackground || '#ffffff'};`,
    `--color-surface-primary: ${theme.colorSurface || '#ffffff'};`,
    `--color-surface-container-lowest: #ffffff;`,
    `--color-surface-container-low: ${lighten(theme.colorBackground || '#ffffff', 0.02)};`,
    `--color-surface-container: ${lighten(theme.colorBackground || '#ffffff', 0.04)};`,
    `--color-surface-container-high: ${lighten(theme.colorBackground || '#ffffff', 0.06)};`,
    `--color-surface-container-highest: ${darken(theme.colorBackground || '#ffffff', 0.05)};`,
    `--color-divider: ${theme.colorDivider || '#e2e8f0'};`,
    `--color-cta-bg: ${theme.colorCtaBg || p};`,
    `--gradient-from: ${theme.gradientFrom || p};`,
    `--gradient-to: ${theme.gradientTo || lighten(p, 0.5)};`,
    ...getRadiusVars(theme.radiusScale),
  ];

  const fontLines: string[] = [];
  if (theme.fontDisplay) {
    fontLines.push(
      `--font-display: '${theme.fontDisplay}', var(--font-plus-jakarta), sans-serif;`,
      `--font-display-bold: '${theme.fontDisplay}', var(--font-plus-jakarta), sans-serif;`,
      `--font-h1-medium: '${theme.fontDisplay}', var(--font-plus-jakarta), sans-serif;`,
      `--font-h2-medium: '${theme.fontDisplay}', var(--font-plus-jakarta), sans-serif;`,
      `--font-sans: '${theme.fontDisplay}', var(--font-plus-jakarta), sans-serif;`,
    );
  }
  if (theme.fontBody) {
    fontLines.push(
      `--font-body: '${theme.fontBody}', var(--font-outfit), sans-serif;`,
      `--font-body-base: '${theme.fontBody}', var(--font-outfit), sans-serif;`,
      `--font-body-medium: '${theme.fontBody}', var(--font-outfit), sans-serif;`,
      `--font-label-sm: '${theme.fontBody}', var(--font-outfit), sans-serif;`,
      `--font-mono: '${theme.fontBody}', monospace;`,
    );
  }

  const allLight = lightLines.concat(fontLines);

  let css = `:root { ${allLight.join(' ')} }`;

  if (theme.darkModeEnabled) {
    const darkP = theme.colorDarkPrimary || lighten(p, 0.2);
    const darkBg = theme.colorDarkBg || '#020617';
    const darkSurface = theme.colorDarkSurface || '#0f172a';

    const darkLines = [
      `--color-primary: ${darkP};`,
      `--color-primary-hover: ${lighten(darkP, 0.1)};`,
      `--color-primary-container: ${darken(darkP, 0.3)};`,
      `--color-primary-highlight: ${darken(darkP, 0.45)};`,
      `--color-surface-tint: ${lighten(darkP, 0.1)};`,
      `--color-background: ${darkBg};`,
      `--color-on-background: #f8fafc;`,
      `--color-surface: ${darkBg};`,
      `--color-surface-primary: ${darkSurface};`,
      `--color-on-surface: #f8fafc;`,
      `--color-on-surface-variant: #94a3b8;`,
      `--color-text-main: #f8fafc;`,
      `--color-text-muted: #cbd5e1;`,
      `--color-text-faint: #94a3b8;`,
      `--color-divider: rgba(255,255,255,0.08);`,
      `--color-border-default: rgba(255,255,255,0.12);`,
      `--color-bg-main: ${darkBg};`,
      `--color-surface-container-lowest: ${darkSurface};`,
      `--color-surface-container-low: ${lighten(darkSurface, 0.03)};`,
      `--color-surface-container: ${lighten(darkSurface, 0.06)};`,
      `--color-surface-container-high: ${lighten(darkSurface, 0.1)};`,
      `--color-surface-container-highest: ${lighten(darkSurface, 0.15)};`,
      `--glass-bg: rgba(15, 23, 42, 0.8);`,
      `--glass-border: rgba(255, 255, 255, 0.1);`,
      `--glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);`,
      `--shadow-premium: 0 10px 40px -10px rgba(0, 0, 0, 0.6);`,
    ];
    css += ` html.dark { ${darkLines.join(' ')} }`;
  }

  return css;
}

export async function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, globalSettings] = await Promise.all([
    getCmsContent<ThemeConfig>('theme'),
    getCmsContent<GlobalSettings>('global-settings')
  ]);

  const cssOverrides = theme?.colorPrimary ? generateOverrides(theme) : '';

  return (
    <GlobalDataProvider settings={globalSettings}>
      {cssOverrides && <style dangerouslySetInnerHTML={{ __html: cssOverrides }} />}
      {children}
    </GlobalDataProvider>
  );
}
