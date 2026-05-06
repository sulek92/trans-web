import { NextResponse } from 'next/server';

export async function GET() {
  // Simple static sitemap with a few core routes. Extend to dynamic CMS pages later.
  const pages = [
    { url: '/', lastMod: '2026-05-06' },
    { url: '/polityka-prywatnosci', lastMod: '2026-05-06' },
    { url: '/regulamin', lastMod: '2026-05-06' },
    { url: '/kontakt', lastMod: '2026-05-06' },
  ];

  const xmlParts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map(p => `<url><loc>https://paletbroker.pl${p.url}</loc><lastmod>${p.lastMod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`),
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
