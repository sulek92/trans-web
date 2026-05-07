import { Metadata } from 'next';
import { getCmsContent, getCmsPageRecord } from '@/lib/cms';
import { ContactClient } from './contact-client';

const FALLBACK = {
  title: 'Jesteśmy tu,\nby Ci pomóc.',
  subtitle: 'Masz pytania dotyczące transportu lub potrzebujesz indywidualnej wyceny dla swojej firmy? Skontaktuj się z nami w najwygodniejszy dla Ciebie sposób.',
  phone: '+48 22 123 45 67',
  phoneHours: 'Pon - Pt: 8:00 - 17:00',
  email: 'kontakt@paletbroker.pl',
  emailResponseTime: 'Odpowiemy w 2 godziny',
  companyName: 'PaletBroker Sp. z o.o.',
  street: 'ul. Logistyczna 12',
  city: '00-001 Warszawa',
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageRecord('kontakt');
  return {
    title: page?.metaTitle || 'Kontakt – Skontaktuj się z PaletyBroker | Obsługa klienta B2B',
    description: page?.metaDescription || 'Potrzebujesz wyceny transportu paletowego? Skontaktuj się z nami telefonicznie, mailowo lub przez formularz. Odpowiadamy w 2 godziny. Sprawdź dane kontaktowe.',
    openGraph: {
      title: page?.metaTitle || 'Kontakt z PaletyBroker – jesteśmy do Twojej dyspozycji',
      description: page?.metaDescription || 'Skontaktuj się z nami: telefon, email, formularz kontaktowy. Odpowiadamy w 2 godziny.',
      images: ['/og-image.png'],
    },
  };
}

export default async function ContactPage() {
  const cms = await getCmsContent<typeof FALLBACK>('kontakt');
  const data = { ...FALLBACK, ...cms };
  return <ContactClient data={data} />;
}
