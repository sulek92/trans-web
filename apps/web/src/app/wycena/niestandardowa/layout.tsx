import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wycena niestandardowa – transport palet ponadgabarytowych | PaletyBroker',
  description: 'Twoja przesyłka przekracza standardowe limity? Wyceń transport niestandardowy. Nasi eksperci przygotują indywidualną ofertę w ciągu 24h.',
};

export default function NiestandardowaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
