import { Metadata } from 'next';
import { FAQClient } from './faq-client';
import { getApiBaseUrl } from '@/lib/api-url';

async function getFaqData() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/cms/pages/faq`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getFaqData();
  
  return {
    title: cmsPage?.metaTitle || 'FAQ - Często zadawane pytania | PaletyBroker',
    description: cmsPage?.metaDescription || 'Dowiedz się więcej o tym, jak wysłać paletę, jakie są koszty i zasady pakowania.',
  };
}

export default async function FAQPage() {
  const cmsPage = await getFaqData();
  
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <FAQClient cmsContent={cmsPage?.content} />
    </main>
  );
}
