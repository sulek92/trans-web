import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { getCmsContent } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'FAQ - Często zadawane pytania | PaletyBroker',
  description: 'Dowiedz się więcej o tym, jak wysłać paletę, jakie są koszty i zasady pakowania.',
};

const FALLBACK_FAQS = [
  { q: "Jak zapakować paletę?", a: "Paleta musi być owinięta folią stretch. Towar nie może wystawać poza obrys palety." },
  { q: "Ile kosztuje wysyłka palety?", a: "Cena zależy od wymiarów, wagi i kodu pocztowego. Użyj naszego kalkulatora aby sprawdzić cenę." },
  { q: "Czy mogę ubezpieczyć przesyłkę?", a: "Tak, oferujemy dodatkowe ubezpieczenie w kroku wyboru usług w koszyku." }
];

export default async function FAQPage() {
  const cms = await getCmsContent<{ items: { q: string; a: string }[] }>('faq');
  const faqs = cms?.items ?? FALLBACK_FAQS;

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl min-h-[calc(100vh-10rem)]">
      <h1 className="text-4xl font-display font-bold text-[var(--color-on-background)] mb-8 text-center">
        Często zadawane pytania (FAQ)
      </h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg text-[var(--color-on-background)] mb-2">{faq.q}</h3>
              <p className="text-[var(--color-on-surface-variant)]">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
