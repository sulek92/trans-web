import { Metadata } from 'next';
import { getCmsContent, getCmsPageRecord } from '@/lib/cms';
import { PricingClient } from './pricing-client';

const FALLBACK = {
  title: 'Stawki skrojone pod biznes',
  subtitle: 'Podane stawki są cenami bazowymi netto. Dzięki umowom z największymi przewoźnikami oferujemy ceny o 40% niższe niż cenniki detaliczne.',
  exchangeRate: 4.32,
  domesticRates: [
    { type: 'Półpaleta (do 200kg)', price: '120,00', icon: 'inventory_2' },
    { type: 'Paleta Euro (do 300kg)', price: '145,00', icon: 'pallet' },
    { type: 'Paleta Euro (do 600kg)', price: '165,00', icon: 'pallet' },
    { type: 'Paleta Euro (do 1000kg)', price: '195,00', icon: 'pallet' },
    { type: 'Przemysłowa (do 1200kg)', price: '240,00', icon: 'widgets' },
  ],
  internationalRates: [
    { country: 'Niemcy', price: '85,00', eta: '2-3 dni' },
    { country: 'Czechy', price: '75,00', eta: '1-2 dni' },
    { country: 'Francja', price: '120,00', eta: '3-4 dni' },
    { country: 'Włochy', price: '135,00', eta: '3-5 dni' },
    { country: 'Benelux', price: '115,00', eta: '2-4 dni' },
  ],
  guaranteeTitle: 'Gwarancja najniższej ceny',
  guaranteeDesc: 'Jeśli znajdziesz tańszą ofertę na transport paletowy o tych samych parametrach, zwrócimy Ci różnicę i damy dodatkowe 5% rabatu na kolejne zlecenie.',
  guaranteeBoxes: [
    { label: 'Ubezpieczenie', value: 'W cenie', sub: 'OCP Przewoźnika' },
    { label: 'Dopłata paliwowa', value: '0%', sub: 'Zawsze w cenie' },
  ],
  pricingFaq: [
    { q: 'Czy podane ceny są brutto?', a: 'Nie, wszystkie ceny w cenniku i kalkulatorze są cenami netto. Należy doliczyć 23% VAT dla usług krajowych.' },
    { q: 'Kiedy otrzymam fakturę?', a: 'Faktura VAT jest generowana automatycznie po opłaceniu zlecenia i przesyłana na Twój adres e-mail.' },
    { q: 'Jakie są metody płatności?', a: 'Obsługujemy szybkie przelewy (PayU), BLIK, karty płatnicze oraz przelewy tradycyjne (dla stałych klientów).' },
    { q: 'Czy ceny się zmieniają?', a: 'Stawki mogą ulegać zmianie w zależności od sezonowości i cen paliw, ale po opłaceniu zlecenia cena jest gwarantowana.' },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageRecord('cennik');
  return {
    title: page?.metaTitle || 'Cennik transportu palet – DHL, DPD, FedEx od 120 zł | PaletyBroker',
    description: page?.metaDescription || 'Sprawdź aktualny cennik transportu paletowego. Stawki krajowe od 120 zł, międzynarodowe od 75 zł. Porównaj oferty DHL, DPD, FedEx. Gwarancja najniższej ceny.',
    openGraph: {
      title: page?.metaTitle || 'Cennik transportu palet – najlepsze stawki B2B',
      description: page?.metaDescription || 'Cennik transportu paletowego: stawki krajowe i międzynarodowe. Gwarancja najniższej ceny.',
      images: ['/og-image.png'],
    },
  };
}

export default async function PricingPage() {
  const cms = await getCmsContent<typeof FALLBACK>('cennik');
  const data = { ...FALLBACK, ...cms };
  return <PricingClient data={data} />;
}
