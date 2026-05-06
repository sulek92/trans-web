import { Metadata } from 'next';
import { CareersClient } from './careers-client';
import { getApiBaseUrl } from '@/lib/api-url';

async function getCareersData() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/cms/pages/kariera`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getCareersData();
  
  return {
    title: cmsPage?.metaTitle || 'Kariera - Dołącz do zespołu | PaletyBroker',
    description: cmsPage?.metaDescription || 'Buduj z nami przyszłość logistyki. Szukamy pasjonatów technologii i transportu.',
  };
}

export default async function CareersPage() {
  const cmsPage = await getCareersData();
  
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <CareersClient cmsContent={cmsPage?.content} />
    </main>
  );
}
