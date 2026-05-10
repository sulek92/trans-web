import { getApiBaseUrl } from '@/lib/api-url';

export default async function CmsPagesIndex() {
  const apiBase = getApiBaseUrl();
  const res = await fetch(`${apiBase}/cms/pages`, { cache: 'no-store' });
  const pages = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CMS Pages ({pages.length})</h1>
      <div className="grid gap-3">
        {pages.map((p: any) => (
          <div key={p.slug} className="p-4 bg-[var(--color-surface-primary)] border rounded flex justify-between items-center">
            <div>
              <strong>{p.title || p.slug}</strong>
              <span className="text-xs text-gray-500 ml-2">/{p.slug}</span>
            </div>
            <a href={`/admin/cms/pages/edit/${encodeURIComponent(p.slug)}`} className="text-blue-600 font-bold text-sm">Edytuj</a>
          </div>
        ))}
      </div>
    </div>
  );
}
