import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api-url';

export async function GET() {
  const apiUrl = getApiBaseUrl();
  let slugs: string[] = [];
  try {
    const res = await fetch(`${apiUrl}/cms/pages`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        slugs = data.map((p: any) => p.slug).filter((s) => typeof s === 'string' && s.length > 0);
      }
    }
  } catch {
    slugs = ['polityka-prywatnosci', 'regulamin', 'kontakt'];
  }

  const base = 'https://paletbroker.pl';
  const urls = slugs.map((slug) => `<url><loc>${base}/${slug}</loc><lastmod>2026-05-06</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
  urls.unshift(`<url><loc>${base}/</loc><lastmod>2026-05-06</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>`);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">${urls.join('')}\n</urlset>`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
