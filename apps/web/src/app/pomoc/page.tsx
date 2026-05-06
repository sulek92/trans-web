import { getCmsContent } from '@/lib/cms';
import { HelpClient } from './help-client';

const FALLBACK = {
  title: 'W czym możemy pomóc?',
  subtitle: 'Przeszukaj bazę wiedzy lub wybierz kategorię poniżej.',
  categories: [
    { title: 'Pierwsze kroki', icon: 'rocket_launch', count: 12 },
    { title: 'Przygotowanie palet', icon: 'inventory_2', count: 8 },
    { title: 'Płatności i faktury', icon: 'payments', count: 5 },
    { title: 'Reklamacje', icon: 'gavel', count: 4 },
  ],
  faqItems: [
    { q: 'Jak przygotować paletę do wysyłki?', a: 'Paleta powinna być stabilna, a towar nie powinien wystawać poza jej obrys. Zalecamy owinięcie całości folią stretch.' },
    { q: 'Czy muszę mieć własną paletę?', a: 'Tak, kurier przyjeżdża odebrać gotową, zapakowaną przesyłkę.' },
    { q: 'Kiedy kurier odbierze moją przesyłkę?', a: 'Większość zleceń złożonych do godziny 11:00 jest odbierana tego samego dnia roboczego.' },
    { q: 'Jak otrzymać fakturę VAT?', a: 'Faktury są generowane automatycznie po opłaceniu zamówienia.' },
  ],
  ctaTitle: 'Nadal masz wątpliwości?',
  ctaSubtitle: 'Nasz zespół wsparcia technicznego i logistycznego jest do Twojej dyspozycji. Średni czas odpowiedzi to mniej niż 2 godziny.',
};

export default async function HelpPage() {
  const cms = await getCmsContent<typeof FALLBACK>('pomoc');
  const data = { ...FALLBACK, ...cms };
  return <HelpClient data={data} />;
}
