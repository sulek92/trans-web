/** Simple CMS pages list in Admin panel (read-only listing). */
'use client';

import * as React from 'react';
import { getApiBaseUrl } from '@/lib/api-url';
import Link from 'next/link';

type PageItem = { slug: string; title?: string; isPublished?: boolean };

export default function CmsPagesPage() {
  const [pages, setPages] = React.useState<PageItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/cms/pages`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setPages(data.map((p) => ({ slug: p.slug, title: p.title, isPublished: p.isPublished })));
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-6 bg-slate-200 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">CMS Pages</h2>
      {pages.length === 0 ? (
        <div className="text-sm text-slate-500">No pages found.</div>
      ) : (
        <ul className="space-y-3">
          {pages.map((p) => (
            <li key={p.slug} className="flex items-center justify-between border rounded-md p-3 bg-white shadow-sm">
              <div>
                <strong className="mr-4">{p.title ?? p.slug}</strong>
                <span className="text-xs text-slate-500">slug: {p.slug}</span>
              </div>
              <Link href={`/admin/cms?slug=${encodeURIComponent(p.slug)}`} className="text-sm font-bold text-blue-600">Edytuj</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
