import { Metadata } from 'next';
import { CareersClient } from './careers-client';

export const metadata: Metadata = {
  title: 'Kariera - Dołącz do zespołu | PaletyBroker',
  description: 'Buduj z nami przyszłość logistyki. Szukamy pasjonatów technologii i transportu.',
};

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <CareersClient />
    </main>
  );
}
