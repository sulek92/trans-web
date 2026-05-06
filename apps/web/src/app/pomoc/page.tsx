import { getCmsContent } from '@/lib/cms';
import { HelpClient } from './help-client';

const FALLBACK = {
  title: 'W czym możemy pomóc?',
  subtitle: 'Najważniejsze zasady działania platformy, płatności i realizacji zleceń w jednym miejscu.',
  categories: [
    { title: 'Konto i logowanie', icon: 'badge', count: 4 },
    { title: 'Wycena i limity', icon: 'calculate', count: 5 },
    { title: 'Płatności i dokumenty', icon: 'payments', count: 4 },
    { title: 'Transport i statusy', icon: 'local_shipping', count: 5 },
  ],
  faqItems: [
    {
      q: 'Jakie dane są wymagane do szybkiej wyceny?',
      a: 'W formularzu podajesz typ palety, kod pocztowy nadania i dostawy, wagę oraz wymiary ładunku. Dla standardowych typów palet część wymiarów uzupełnia się automatycznie.',
    },
    {
      q: 'Jakie są limity automatycznej wyceny?',
      a: 'Automatyczna wycena działa dla parametrów do 300 cm (długość), 300 cm (szerokość), 250 cm (wysokość) i 1500 kg. Powyżej limitów system kieruje do ścieżki obsługi niestandardowej.',
    },
    {
      q: 'Jakie kody pocztowe i kraje obsługuje formularz?',
      a: 'System waliduje format kodu pocztowego PL (XX-XXX) lub DE (XXXXX). W aktualnej konfiguracji formularza dostępne są kierunki PL i DE.',
    },
    {
      q: 'Jakie metody płatności są dostępne?',
      a: 'Płatności online realizowane są przez Stripe. W checkout mogą być dostępne m.in. karta, BLIK i Przelewy24 – zależnie od konfiguracji i dostępności operatora.',
    },
    {
      q: 'Kiedy status zamówienia zmienia się na opłacone?',
      a: 'Po potwierdzeniu płatności przez webhook operatora płatności status zamówienia jest aktualizowany automatycznie, a system może uruchomić dalsze kroki realizacji.',
    },
    {
      q: 'Jak sprawdzić status przesyłki?',
      a: 'W zakładce Śledzenie wpisz numer zamówienia (np. OR-...). System pokaże aktualny status i historię zdarzeń, jeśli są dostępne dla przesyłki.',
    },
    {
      q: 'Czy mogę zresetować hasło samodzielnie?',
      a: 'Tak. Na stronie logowania dostępny jest reset hasła. Token resetu jest czasowy, a po ustawieniu nowego hasła poprzednie dane logowania przestają obowiązywać.',
    },
    {
      q: 'Jak skontaktować się w sprawie zlecenia lub reklamacji?',
      a: 'Najszybciej przez formularz kontaktowy lub e-mail z numerem zamówienia i opisem sprawy. Dzięki temu zespół może od razu sprawdzić historię operacyjną.',
    },
  ],
  ctaTitle: 'Nie widzisz odpowiedzi na swoje pytanie?',
  ctaSubtitle:
    'Skontaktuj się z nami bezpośrednio. W zgłoszeniu podaj numer zamówienia i opis problemu, a szybciej przeprowadzimy weryfikację.',
};

type HelpCategory = {
  title?: string;
  icon?: string;
  count?: number;
};

type HelpFaq = {
  q?: string;
  a?: string;
};

type HelpCmsContent = {
  title?: string;
  subtitle?: string;
  categories?: HelpCategory[];
  faqItems?: HelpFaq[];
  ctaTitle?: string;
  ctaSubtitle?: string;
};

function normalizeFaq(items: HelpFaq[] | undefined) {
  const base = new Map(FALLBACK.faqItems.map((item) => [item.q, item]));
  if (!Array.isArray(items)) return Array.from(base.values());

  for (const item of items) {
    const q = typeof item.q === 'string' ? item.q.trim() : '';
    const a = typeof item.a === 'string' ? item.a.trim() : '';
    if (!q || !a) continue;
    base.set(q, { q, a });
  }

  return Array.from(base.values());
}

function normalizeCategories(items: HelpCategory[] | undefined) {
  if (!Array.isArray(items)) return FALLBACK.categories;
  const normalized = items
    .map((item) => ({
      title: typeof item.title === 'string' ? item.title.trim() : '',
      icon:
        typeof item.icon === 'string' && item.icon.trim().length > 0
          ? item.icon.trim()
          : 'article',
      count: typeof item.count === 'number' && item.count > 0 ? item.count : 1,
    }))
    .filter((item) => item.title.length > 0);

  return normalized.length > 0 ? normalized : FALLBACK.categories;
}

export default async function HelpPage() {
  const [cms, global] = await Promise.all([
    getCmsContent<HelpCmsContent>('pomoc'),
    getCmsContent<{
      phone?: string;
      email?: string;
    }>('global-settings'),
  ]);

  const title =
    typeof cms?.title === 'string' && cms.title.trim().length > 0
      ? cms.title.trim()
      : FALLBACK.title;
  const subtitle =
    typeof cms?.subtitle === 'string' && cms.subtitle.trim().length > 0
      ? cms.subtitle.trim()
      : FALLBACK.subtitle;
  const ctaTitle =
    typeof cms?.ctaTitle === 'string' && cms.ctaTitle.trim().length > 0
      ? cms.ctaTitle.trim()
      : FALLBACK.ctaTitle;
  const ctaSubtitle =
    typeof cms?.ctaSubtitle === 'string' && cms.ctaSubtitle.trim().length > 0
      ? cms.ctaSubtitle.trim()
      : FALLBACK.ctaSubtitle;

  const data = {
    title,
    subtitle,
    categories: normalizeCategories(cms?.categories),
    faqItems: normalizeFaq(cms?.faqItems),
    ctaTitle,
    ctaSubtitle,
    contactPhone: global?.phone || '+48 22 123 45 67',
    contactEmail: global?.email || 'kontakt@paletbroker.pl',
  };
  return <HelpClient data={data} />;
}
