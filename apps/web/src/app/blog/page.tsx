import { getCmsContent } from '@/lib/cms';
import { BlogClient } from './blog-client';

export default async function BlogPage() {
  const cms = await getCmsContent<{ newsletterTitle: string; newsletterDesc: string }>('blog');
  return (
    <BlogClient
      newsletterTitle={cms?.newsletterTitle || 'Zostań ekspertem w logistyce'}
      newsletterDesc={cms?.newsletterDesc || 'Zapisz się do newslettera i otrzymuj raz w miesiącu wyselekcjonowane treści o rynku TSL oraz ekskluzywne rabaty na wysyłki.'}
    />
  );
}
