import { Metadata } from 'next';
import { getCmsContent, getCmsPageRecord } from '@/lib/cms';
import { AboutClient } from './about-client';

const FALLBACK = {
  heroTitle: 'Budujemy mosty w logistyce paletowej.',
  heroDesc: 'PaletBroker powstał z połączenia pasji do technologii i wieloletniego doświadczenia w branży TSL. Naszym celem jest uproszczenie transportu ciężkiego dla każdego biznesu.',
  heroStats: [
    { value: '1200+', label: 'Zaufanych firm' },
    { value: '500k+', label: 'Wysłanych palet' },
    { value: '98%', label: 'Terminowości' },
  ],
  quote: 'Logistyka to nie tylko paczki, to obietnica dostarczona na czas.',
  quoteAuthor: '— Zarząd PaletBroker',
  values: [
    { title: 'Innowacja', icon: 'auto_awesome', desc: 'Nieustannie rozwijamy nasze systemy API i algorytmy optymalizacji tras, aby obniżać koszty Twojej logistyki.' },
    { title: 'Niezawodność', icon: 'verified_user', desc: 'Współpracujemy wyłącznie z certyfikowanymi przewoźnikami o ugruntowanej pozycji rynkowej i doskonałej opinii.' },
    { title: 'Ludzkie podejście', icon: 'groups', desc: 'Za zaawansowaną technologią stoją ludzie. Każdy nasz klient biznesowy posiada dedykowanego opiekuna, który zna specyfikę jego branży.' }
  ],
  team: [
    { name: 'Adam Nowicki', role: 'Founder & CEO', icon: 'person' },
    { name: 'Karolina Wiśniewska', role: 'Head of Operations', icon: 'support_agent' },
    { name: 'Michał Król', role: 'CTO', icon: 'code' },
    { name: 'Marta Kowalska', role: 'Customer Success', icon: 'sentiment_very_satisfied' }
  ],
  ctaTitle: 'Gotowy na nową jakość\nw transporcie Twojej firmy?',
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageRecord('o-nas');
  return {
    title: page?.metaTitle || 'O nas – Poznaj zespół PaletBroker | PaletyBroker',
    description: page?.metaDescription || 'Jesteśmy liderem w logistyce paletowej B2B. Łączymy technologię z doświadczeniem TSL, by dostarczać przewidywalne i tanie przesyłki paletowe w całej Europie. Sprawdź naszą misję.',
    openGraph: {
      title: page?.metaTitle || 'O nas – Poznaj zespół PaletBroker',
      description: page?.metaDescription || 'Jesteśmy liderem w logistyce paletowej B2B. Łączymy technologię z doświadczeniem TSL.',
      images: ['/og-image.png'],
    },
  };
}

export default async function AboutPage() {
  const cms = await getCmsContent<typeof FALLBACK>('o-nas');
  const d = { ...FALLBACK, ...cms };
  return <AboutClient data={d} />;
}
