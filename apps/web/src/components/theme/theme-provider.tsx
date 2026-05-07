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
    `--color-background: ${theme.colorBackground};`,
    `--color-surface: ${theme.colorBackground};`,
    `--color-surface-primary: ${theme.colorSurface};`,
    `--color-surface-container-lowest: #ffffff;`,
    `--color-surface-container-low: ${lighten(theme.colorBackground, 0.02)};`,
    `--color-surface-container: ${lighten(theme.colorBackground, 0.04)};`,
    `--color-surface-container-high: ${lighten(theme.colorBackground, 0.06)};`,
    `--color-surface-container-highest: ${darken(theme.colorBackground, 0.05)};`,
    `--color-divider: ${theme.colorDivider};`,
    `--color-cta-bg: ${theme.colorCtaBg || p};`,
    `--gradient-from: ${theme.gradientFrom || p};`,
    `--gradient-to: ${theme.gradientTo || lighten(p, 0.5)};`,
    ...getRadiusVars(theme.radiusScale),
  ];

  const fontLines: string[] = [];
  if (theme.fontDisplay) {
    fontLines.push(
      `--font-display-bold: '${theme.fontDisplay}', var(--font-plus-jakarta), sans-serif;`,
      `--font-h1-medium: '${theme.fontDisplay}', var(--font-plus-jakarta), sans-serif;`,
      `--font-h2-medium: '${theme.fontDisplay}', var(--font-plus-jakarta), sans-serif;`,
      `--font-sans: '${theme.fontDisplay}', var(--font-plus-jakarta), sans-serif;`,
    );
  }
  if (theme.fontBody) {
    fontLines.push(
      `--font-body-base: '${theme.fontBody}', var(--font-outfit), sans-serif;`,
      `--font-body-medium: '${theme.fontBody}', var(--font-outfit), sans-serif;`,
      `--font-label-sm: '${theme.fontBody}', var(--font-outfit), sans-serif;`,
      `--font-data-mono: '${theme.fontBody}', sans-serif;`,
    );
  }

  const allLight = lightLines.concat(fontLines);

  let css = `:root { ${allLight.join(' ')} }`;

  if (theme.darkModeEnabled) {
    const darkLines = [
      `--color-primary: ${theme.colorDarkPrimary};`,
      `--color-primary-container: ${darken(theme.colorDarkPrimary, 0.2)};`,
      `--color-primary-highlight: ${lighten(theme.colorDarkPrimary, 0.15)};`,
      `--color-surface-tint: ${lighten(theme.colorDarkPrimary, 0.1)};`,
      `--color-background: ${theme.colorDarkBg};`,
      `--color-surface: ${theme.colorDarkBg};`,
      `--color-surface-primary: ${theme.colorDarkSurface};`,
      `--color-on-background: #eef1f1;`,
      `--color-on-surface: #eef1f1;`,
      `--color-on-surface-variant: #bec8c9;`,
      `--color-divider: rgba(255,255,255,0.08);`,
      `--color-border-default: rgba(255,255,255,0.1);`,
      `--color-bg-main: ${theme.colorDarkBg};`,
      `--color-surface-container-lowest: ${theme.colorDarkSurface};`,
      `--color-surface-container-low: ${lighten(theme.colorDarkSurface, 0.05)};`,
      `--color-surface-container: ${lighten(theme.colorDarkSurface, 0.1)};`,
      `--color-surface-container-high: ${lighten(theme.colorDarkSurface, 0.15)};`,
      `--color-surface-container-highest: ${lighten(theme.colorDarkSurface, 0.2)};`,
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
