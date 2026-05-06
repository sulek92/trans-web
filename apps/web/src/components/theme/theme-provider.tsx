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

// Utility: lighten a hex color for highlight/container variants
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
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

function generateOverrides(theme: ThemeConfig): string {
  const p = theme.colorPrimary;
  const s = theme.colorSecondary;
  const t = theme.colorTertiary;

  // Generate derived colors from primary
  const primaryContainer = darken(p, 0.1);
  const onPrimaryContainer = lighten(p, 0.7);
  const inversePrimary = lighten(p, 0.5);
  const primaryFixed = lighten(p, 0.65);
  const primaryFixedDim = lighten(p, 0.5);
  const primaryHighlight = lighten(p, 0.8);
  const surfaceTint = darken(p, 0.05);
  const onPrimaryFixed = darken(p, 0.6);
  const onPrimaryFixedVariant = darken(p, 0.1);

  // Secondary
  const secondaryContainer = lighten(s, 0.6);
  const onSecondaryContainer = darken(s, 0.05);
  const secondaryFixed = lighten(s, 0.62);
  const secondaryFixedDim = lighten(s, 0.45);

  // Tertiary
  const tertiaryContainer = darken(t, 0.1);
  const onTertiaryContainer = lighten(t, 0.7);
  const tertiaryFixed = lighten(t, 0.7);
  const tertiaryFixedDim = lighten(t, 0.5);

  const lines = [
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
    `--color-divider: ${theme.colorDivider};`,
    `--color-dark-bg: ${theme.colorDarkBg};`,
    `--color-dark-surface: ${theme.colorDarkSurface};`,
    `--color-dark-primary: ${theme.colorDarkPrimary};`,
  ];

  return `:root { ${lines.join(' ')} }`;
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
