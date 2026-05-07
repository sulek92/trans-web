import { Metadata } from 'next';
import { getCmsContent, getCmsPageRecord } from '@/lib/cms';
import { getApiBaseUrl } from '@/lib/api-url';
import { BlogClient } from './blog-client';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageRecord('blog');
  return {
    title: page?.metaTitle || 'Blog – Ekspert logistyki paletowej | PaletyBroker',
    description: page?.metaDescription || 'Praktyczne artykuły o logistyce paletowej, trendach TSL i optymalizacji kosztów wysyłki. Zapisz się do newslettera i otrzymuj ekskluzywne treści raz w miesiącu.',
    openGraph: {
      title: page?.metaTitle || 'Blog logistyka paletowa – porady i trendy TSL',
      description: page?.metaDescription || 'Artykuły o logistyce paletowej, transporcie B2B i optymalizacji kosztów wysyłki.',
      images: ['/og-image.png'],
    },
  };
}

export default async function BlogPage() {
  const cms = await getCmsContent<{ newsletterTitle: string; newsletterDesc: string }>('blog');
  
  let articles: any[] = [];
  try {
    const res = await fetch(`${getApiBaseUrl()}/cms/articles?public=true`, { 
      cache: 'no-store' 
    });
    if (res.ok) {
      articles = await res.json();
    }
  } catch (e) {
    console.error('Failed to fetch blog articles', e);
  }

  return (
    <BlogClient
      articles={articles}
      newsletterTitle={cms?.newsletterTitle || 'Zostań ekspertem w logistyce'}
      newsletterDesc={cms?.newsletterDesc || 'Zapisz się do newslettera i otrzymuj raz w miesiącu wyselekcjonowane treści o rynku TSL oraz ekskluzywne rabaty na wysyłki.'}
    />
  );
}
