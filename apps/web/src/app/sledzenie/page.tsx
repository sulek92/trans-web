import { TrackingClient } from './tracking-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Śledzenie przesyłki | PaletBroker',
  description: 'Monitoruj status swojej przesyłki paletowej w czasie rzeczywistym. Wpisz numer zlecenia i sprawdź lokalizację swojego ładunku.',
};

export default function TrackingPage() {
  return (
    <main className="flex-grow pb-24 min-h-screen bg-[var(--color-background)]">
      <TrackingClient />
    </main>
  );
}
