import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api-url';

export async function GET() {
  // Dynamically generate sitemap entries from CMS pages
  const apiUrl = getApiBaseUrl();
  let slugs: string[] = [];
  try {
    const res = await fetch(`${apiUrl}/cms/pages`);
    if (res.ok) {
      const data = await res.json();
      // Expect an array of pages with at least a 'slug' property
      if (Array.isArray(data)) {
        slugs = data
          .map((p: any) => p?.slug)
          .filter((s) => typeof s === 'string' && s.length > 0);
      }
    }
  } catch {
    // fall back to static pages if CMS fetch fails
    slugs = ['polityka-prywatnosci', 'regulamin', 'kontakt', 'home'];
  }

  const base = 'https://paletbroker.pl';
  const pages = [
    { slug: '', url: '/' },
  ];
  // Build URL list from slugs (avoid duplicating home slug then ensure pathing)
  const urls = slugs
    .map((s) => ({ slug: s, url: `/${s}` }))
    .concat([{ slug: '', url: '/' }]);

  const xmlParts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((p) => `<url><loc>${base}${p.url}</loc><lastmod>2026-05-06</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`),
    '</urlset>'
  ];

  const body = xmlParts.join('');
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
