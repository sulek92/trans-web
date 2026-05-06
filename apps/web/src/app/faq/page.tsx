import { Metadata } from 'next';
import { FAQClient } from './faq-client';

export const metadata: Metadata = {
  title: 'FAQ - Często zadawane pytania | PaletyBroker',
  description: 'Dowiedz się więcej o tym, jak wysłać paletę, jakie są koszty i zasady pakowania.',
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <FAQClient />
    </main>
  );
}
