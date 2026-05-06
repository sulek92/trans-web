import { getCmsContent } from '@/lib/cms';
import { getApiBaseUrl } from '@/lib/api-url';
import { BlogClient } from './blog-client';

export default async function BlogPage() {
  const cms = await getCmsContent<{ newsletterTitle: string; newsletterDesc: string }>('blog');
  
  // Fetch real articles
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
