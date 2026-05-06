"use client";

import React from 'react';
import { getApiBaseUrl } from '@/lib/api-url';
import { getCookie } from '@/lib/utils';

type MediaItem = { url: string; fileName: string; size: number; updatedAt: string };

export default function CmsMediaPage() {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [renameName, setRenameName] = React.useState<string>('');
  const [renameTarget, setRenameTarget] = React.useState<string>('');
  const apiUrl = getApiBaseUrl();

  React.useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch(`${apiUrl}/cms/media`);
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, [apiUrl]);

  const onRename = async (oldName: string) => {
    if (!renameName && !renameTarget) return;
    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${apiUrl}/cms/media/rename`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ oldName, newName: renameTarget || renameName }),
        credentials: 'include',
      });
      if (res.ok) {
        // refresh list
        const updated = await res.json().catch(() => null);
        // reload list
        const r = await fetch(`${apiUrl}/cms/media`);
        if (r.ok) {
          const data = await r.json();
          setItems(Array.isArray(data) ? data : []);
        }
      } else {
        // eslint-disable-next-line no-alert
        alert('Rename failed');
      }
    } catch {
      // eslint-disable-next-line no-alert
      alert('Network error during rename');
    }
  };

  if (loading) return <div>Loading media...</div>;
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">CMS Media</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((m) => (
          <div key={m.fileName} className="p-3 border rounded-md bg-white">
            <div className="flex items-center justify-between mb-2">
              <strong className="text-sm">{m.fileName}</strong>
              <span className="text-xs text-slate-500">{(m.size / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex gap-2 items-center">
              <input className="border rounded p-1" placeholder="new name" value={renameTarget} onChange={(e) => setRenameTarget(e.target.value)} />
              <span className="text-xs text-slate-400">/</span>
              <input className="border rounded p-1" placeholder="new name" value={renameName} onChange={(e) => setRenameName(e.target.value)} />
              <button className="px-2 py-1 rounded bg-blue-600 text-white text-xs" onClick={() => onRename(m.fileName)}>Rename</button>
            </div>
            <div className="text-xs text-slate-400 mt-2">Updated: {m.updatedAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
