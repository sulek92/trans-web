import * as React from 'react';
import { HomePageClient } from './home-client';
import { Metadata } from 'next';
import { getApiBaseUrl } from '@/lib/api-url';

async function getCmsData() {
  const apiUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${apiUrl}/cms/pages/home`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cmsData = await getCmsData();
  return {
    title: cmsData?.metaTitle || "PaletyBroker - Tanie przesyłki paletowe B2B",
    description: cmsData?.metaDescription || "Porównaj oferty DHL, DPD, FedEx i wybierz najlepszą cenę na transport palety.",
    openGraph: {
      title: cmsData?.metaTitle,
      description: cmsData?.metaDescription,
      images: ['/og-image.png'],
    }
  };
}

export default async function HomePage() {
  const cmsData = await getCmsData();
  
  return (
    <HomePageClient initialCmsData={cmsData} />
  );
}
