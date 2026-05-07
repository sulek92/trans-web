import { Metadata } from 'next';
import { getCmsContent, getCmsPageRecord } from '@/lib/cms';
import { PalletTypesClient } from './pallet-types-client';

interface PalletType {
  name: string;
  dims: string;
  weight: string;
  capacity: string;
  desc: string;
  icon: string;
}

const FALLBACK = {
  palletTypes: [
    { name: 'Paleta Euro (EPAL)', dims: '1200 x 800 mm', weight: 'ok. 25 kg', capacity: 'do 1500 kg', desc: 'Najpopularniejszy standard w Europie. Posiada standaryzowane oznaczenia EPAL/EUR. Idealna do transportu międzynarodowego.', icon: 'widgets' },
    { name: 'Paleta Przemysłowa', dims: '1200 x 1000 mm', weight: 'ok. 30 kg', capacity: 'do 2000 kg', desc: 'Szersza wersja palety, często stosowana w przemyśle spożywczym i chemicznym. Zapewnia większą powierzchnię załadunku.', icon: 'category' },
    { name: 'Półpaleta', dims: '600 x 800 mm', weight: 'ok. 10 kg', capacity: 'do 500 kg', desc: 'Zajmuje połowę miejsca palety Euro. Często wykorzystywana do ekspozycji towaru w sklepach (tzw. paleta displayowa).', icon: 'view_quilt' },
  ] as PalletType[],
  measurementTips: [
    'Zawsze podawaj wymiary całkowite (podstawa + towar).',
    'Towar nie powinien wystawać poza obrys palety.',
    'Wysokość palety mierzymy od podłoża do najwyższego punktu towaru.',
    'Waga rzeczywista obejmuje wagę towaru wraz z paletą i opakowaniem.',
  ] as string[],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageRecord('typy-palet');
  return {
    title: page?.metaTitle || 'Typy palet – Euro, przemysłowa, półpaleta | PaletyBroker',
    description: page?.metaDescription || 'Poznaj wszystkie typy palet transportowych: Euro EPAL (1200x800), przemysłowa (1200x1000) i półpaleta (600x800). Sprawdź wymiary, nośność i porady ekspertów.',
    openGraph: {
      title: page?.metaTitle || 'Przewodnik po typach palet transportowych',
      description: page?.metaDescription || 'Wszystko o typach palet: wymiary, nośność, zastosowanie. Porady ekspertów.',
      images: ['/og-image.png'],
    },
  };
}

export default async function PalletTypesPage() {
  const cms = await getCmsContent<typeof FALLBACK>('typy-palet');
  const data = { ...FALLBACK, ...cms };
  return <PalletTypesClient data={data} />;
}
