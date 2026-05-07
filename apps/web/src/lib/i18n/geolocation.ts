type Locale = 'pl' | 'en' | 'de' | 'fr' | 'it' | 'nl' | 'es';

interface AcceptLanguageEntry {
  locale: Locale;
  quality: number;
}

const TAG_MAP: Record<string, Locale> = {
  pl: 'pl',
  en: 'en',
  de: 'de',
  fr: 'fr',
  it: 'it',
  nl: 'nl',
  es: 'es',
};

export function parseAcceptLanguage(header: string | null): Locale {
  if (!header) return 'pl';

  const entries: AcceptLanguageEntry[] = [];

  for (const part of header.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const match = trimmed.match(/^([a-zA-Z]{2,3})(?:-[a-zA-Z]{2,4})?(?:;q=(\d+(?:\.\d+)?))?$/);
    if (match) {
      const tag = match[1].toLowerCase();
      const quality = match[2] ? parseFloat(match[2]) : 1.0;

      const mapped = TAG_MAP[tag];
      if (mapped) {
        entries.push({ locale: mapped, quality });
      }
    }
  }

  entries.sort((a, b) => b.quality - a.quality);
  return entries.length > 0 ? entries[0].locale : 'pl';
}
