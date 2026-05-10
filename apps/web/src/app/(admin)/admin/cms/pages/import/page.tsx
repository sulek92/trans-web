"use client";

import React from 'react';
import { getApiBaseUrl } from '@/lib/api-url';
import { getCookie } from '@/lib/utils';

export default function CmsPagesImport() {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const content = JSON.parse(String(reader.result));
        if (!Array.isArray(content.pages)) {
          setStatus('Invalid payload: expected { pages: [...] }');
          return;
        }
        setLoading(true);
        const payload = { pages: content.pages };
        const token = getCookie('pb_auth_token');
        const res = await fetch(`${getApiBaseUrl()}/cms/pages/import`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        if (res.ok) {
          setStatus('Import successful');
        } else {
          const data = await res.json();
          setStatus(`Import failed: ${data?.message ?? 'unknown error'}`);
        }
      } catch (err) {
        setStatus('Import failed: network error');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(f);
  };

  return (
    <div className="p-6 space-y-4 bg-[var(--color-surface-primary)] border rounded-md shadow-sm">
      <h3 className="text-lg font-bold">Import /CMS Pages</h3>
      <p className="text-sm text-[var(--color-text-muted)]">Wgraj plik JSON z atrybutem {'{ "pages": [{ "slug": "...", "title": "...", "content": "...", "metaTitle": "...", "metaDescription": "...", "isPublished": true }] }'}</p>
      <input type="file" accept="application/json" onChange={onFile} />
      {fileName && <div className="text-sm text-[var(--color-text-muted)]">Wybrano plik: {fileName}</div>}
      {loading && <div className="text-sm text-[var(--color-text-muted)]">Wgrywanie...</div>}
      {status && <div className="mt-2 text-sm font-bold">{status}</div>}
    </div>
  );
}
