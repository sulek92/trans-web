/** Admin CMS Pages index (list) page - shows CMS editing options. */
'use client';

import * as React from 'react';
import { getApiBaseUrl } from '@/lib/api-url';
import Link from 'next/link';
import { getApiBaseUrl } from '@/lib/api-url';

type CMSPage = { slug: string; title?: string; isPublished?: boolean };

export default function CmsPagesIndex() {
  const [pages, setPages] = React.useState<CMSPage[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/cms/pages`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setPages(data.map((p) => ({ slug: p.slug, title: p.title, isPublished: p.isPublished })));
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const deletePage = async (slug: string) => {
    if (!confirm(`Czy chcesz usunąć stronę: ${slug}?`)) return;
    try {
      const resp = await fetch(`${getApiBaseUrl()}/cms/pages/${slug}`, {
        method: 'DELETE',
      });
      if (resp.ok) {
        setPages((ps) => ps.filter((p) => p.slug !== slug));
      } else {
        // optional: show error
        // eslint-disable-next-line no-alert
        alert('Nie udało się usunąć strony.');
      }
    } catch {
      // ignore
      // eslint-disable-next-line no-alert
      alert('Błąd sieci. Spróbuj ponownie.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">CMS Pages</h2>
      {loading ? (
        <div className="text-sm text-slate-500">Ładowanie...</div>
      ) : (
        <ul className="space-y-3">
          {pages.map((p) => (
            <li key={p.slug} className="flex items-center justify-between border rounded-md p-3 bg-white shadow-sm">
              <div>
                <strong className="mr-4">{p.title ?? p.slug}</strong>
                <span className="text-xs text-slate-500">slug: {p.slug}</span>
              </div>
              <Link href={`/admin/cms?slug=${encodeURIComponent(p.slug)}`} className="text-sm font-bold text-blue-600">Edytuj</Link>
              <button onClick={() => deletePage(p.slug)} className="ml-2 text-sm font-bold text-red-600 hover:underline">Usuń</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
