/** Admin CMS Pages index (list) page - shows CMS editing options. */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { getApiBaseUrl } from '@/lib/api-url';
import { getCookie } from '@/lib/utils';

type CMSPage = { slug: string; title?: string; isPublished?: boolean };

export default function CmsPagesIndex() {
  const [pages, setPages] = React.useState<CMSPage[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Quick action bar: create new CMS page
  const createNew = () => {
    window.location.assign('/admin/cms/pages/new');
  };

  const exportPages = async () => {
    try {
      const token = getCookie('pb_auth_token');
      const res = await fetch(`${getApiBaseUrl()}/cms/pages/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token ?? ''}`,
        },
        credentials: 'include',
      });
      if (!res.ok) {
        // show an error message
        alert('Eksport CMS nie powiódł się.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cms-pages-export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Błąd eksportu CMS.');
    }
  };

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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">CMS Pages</h2>
        <div className="flex items-center gap-2">
          <button onClick={createNew} className="px-4 py-2 rounded bg-[var(--color-primary)] text-white">Nowa strona CMS</button>
          <button onClick={exportPages} className="px-4 py-2 rounded bg-green-600 text-white">Eksportuj CMS</button>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={createNew} className="px-4 py-2 rounded bg-[var(--color-primary)] text-white">Nowa strona CMS</button>
      </div>
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
              <Link href={`/admin/cms/pages/edit/${encodeURIComponent(p.slug)}`} className="text-sm font-bold text-blue-600">Edytuj</Link>
              <button onClick={() => deletePage(p.slug)} className="ml-2 text-sm font-bold text-red-600 hover:underline">Usuń</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
