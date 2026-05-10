import { Metadata } from 'next';
import { BusinessClient } from './business-client';
import { getCmsContent, getCmsPageRecord } from '@/lib/cms';

const FALLBACK = {
  heroBadge: 'Program Partnerski B2B',
  heroTitle: 'Zoptymalizuj logistykę w swojej firmie',
  heroDesc: 'Dedykowane rozwiązania dla e-commerce, hurtowni i producentów. Skaluj swój biznes z partnerem, który rozumie potrzeby transportu ciężkiego.',
  benefits: [
    { title: 'Faktura zbiorcza', icon: 'receipt_long', desc: 'Otrzymuj jedną fakturę za wszystkie zlecenia w miesiącu.' },
    { title: 'Dedykowane API', icon: 'integration_instructions', desc: 'Zintegruj swój sklep lub system ERP bezpośrednio z naszą platformą.' },
    { title: 'Opiekun konta', icon: 'support_agent', desc: 'Indywidualne wsparcie specjalisty.' },
    { title: 'Ceny negocjowane', icon: 'trending_down', desc: 'Indywidualny cennik z gwarancją stawek.' },
    { title: 'Ubezpieczenie CARGO', icon: 'security', desc: 'Rozszerzona ochrona ubezpieczeniowa.' },
    { title: 'Panel analityczny', icon: 'bar_chart', desc: 'Analizuj koszty logistyki w czasie rzeczywistym.' },
  ],
  integrations: ['SAP', 'Oracle', 'PrestaShop', 'WooCommerce', 'Allegro', 'Magento'],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageRecord('dla-firm');
  return {
    title: page?.metaTitle || 'Oferta B2B – Transport palet dla firm | PaletyBroker',
    description: page?.metaDescription || 'Faktura zbiorcza, dedykowane API, opiekun konta i ceny negocjowane. Zoptymalizuj logistykę paletową w swojej firmie z programem partnerskim PaletyBroker.',
    openGraph: {
      title: page?.metaTitle || 'Oferta B2B – Transport palet dla firm | PaletyBroker',
      description: page?.metaDescription || 'Program partnerski B2B: faktura zbiorcza, API, opiekun konta, ceny negocjowane.',
      images: ['/og-image.png'],
    },
  };
}

export default async function ForBusinessPage() {
  const cms = await getCmsContent<typeof FALLBACK>('dla-firm');
  const d = { ...FALLBACK, ...cms };
  return <BusinessClient data={d} />;
}
