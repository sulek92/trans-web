import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polityka prywatności – RODO, cookies, dane osobowe | PaletyBroker',
  description: 'Jak przetwarzamy Twoje dane? Administrator, zakres danych, cele przetwarzania, Twoje prawa RODO, cookies i bezpieczeństwo na platformie.',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
