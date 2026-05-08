'use client';

import * as React from 'react';

// ── Text Field Editor ──
export function TextField({ label, value, onChange, rows = 1, className = '' }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest ml-1">{label}</label>
      {rows > 1 ? (
        <textarea
          className="w-full p-4 rounded-xl bg-[var(--color-surface-container)] border border-transparent focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-all text-sm"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
        />
      ) : (
        <input
          className="w-full p-4 rounded-xl bg-[var(--color-surface-container)] border border-transparent focus:bg-[var(--color-surface-primary)] focus:border-[var(--color-primary)] outline-none transition-all text-sm"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

// ── Toggle Switch ──
export function ToggleSwitch({ label, description, value, onChange }: {
  label: string; description?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-[var(--color-surface-container)] rounded-xl border border-[var(--color-divider)]">
      <div>
        <div className="font-bold text-sm">{label}</div>
        {description && <p className="text-xs text-[var(--color-text-faint)] mt-1">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-[var(--color-primary)]' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-[var(--color-surface-primary)] rounded-full shadow-sm transition-all ${value ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}

// ── List Editor (for FAQ, team, benefits, etc.) ──
interface ListField { key: string; label: string; type?: 'text' | 'textarea'; }

export function ListEditor({ label, items, fields, onChange, addLabel = 'Dodaj element' }: {
  label: string;
  items: Record<string, string>[];
  fields: ListField[];
  onChange: (items: Record<string, string>[]) => void;
  addLabel?: string;
}) {
  const addItem = () => {
    const empty: Record<string, string> = {};
    fields.forEach(f => { empty[f.key] = ''; });
    onChange([...items, empty]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    const newItems = [...items];
    const target = index + dir;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    onChange(newItems);
  };

  const updateItem = (index: number, key: string, value: string) => {
    onChange(items.map((item, i) => i === index ? { ...item, [key]: value } : item));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">{label}</label>
        <button type="button" onClick={addItem} className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">add</span> {addLabel}
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="p-4 bg-[var(--color-surface-container)] rounded-xl border border-[var(--color-divider)] space-y-3 relative group">
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => moveItem(i, -1)} className="p-1 hover:bg-[var(--color-surface-primary)] rounded text-[var(--color-text-faint)]"><span className="material-symbols-outlined text-sm">arrow_upward</span></button>
            <button type="button" onClick={() => moveItem(i, 1)} className="p-1 hover:bg-[var(--color-surface-primary)] rounded text-[var(--color-text-faint)]"><span className="material-symbols-outlined text-sm">arrow_downward</span></button>
            <button type="button" onClick={() => removeItem(i)} className="p-1 hover:bg-red-50 rounded text-red-400"><span className="material-symbols-outlined text-sm">delete</span></button>
          </div>
          <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase">#{i + 1}</div>
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea className="w-full p-3 rounded-lg bg-[var(--color-surface-primary)] border border-[var(--color-divider)] text-sm outline-none focus:border-[var(--color-primary)] mt-1" value={item[f.key] || ''} onChange={(e) => updateItem(i, f.key, e.target.value)} rows={2} />
              ) : (
                <input className="w-full p-3 rounded-lg bg-[var(--color-surface-primary)] border border-[var(--color-divider)] text-sm outline-none focus:border-[var(--color-primary)] mt-1" value={item[f.key] || ''} onChange={(e) => updateItem(i, f.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
      ))}
      {items.length === 0 && <div className="p-8 text-center text-[var(--color-text-faint)] text-sm border-2 border-dashed border-[var(--color-divider)] rounded-xl">Brak elementów. Kliknij &ldquo;{addLabel}&rdquo; aby dodać.</div>}
    </div>
  );
}

// ── Simple String List (for partners, integrations, tips) ──
export function StringListEditor({ label, items, onChange, addLabel = 'Dodaj' }: {
  label: string; items: string[]; onChange: (items: string[]) => void; addLabel?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">{label}</label>
        <button type="button" onClick={() => onChange([...items, ''])} className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">add</span> {addLabel}
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="flex-1 p-3 rounded-lg bg-[var(--color-surface-container)] border border-[var(--color-divider)] text-sm outline-none focus:border-[var(--color-primary)]"
            value={item}
            onChange={(e) => onChange(items.map((v, j) => j === i ? e.target.value : v))}
          />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Partner List Editor (name + logo upload) ──
import { getApiBaseUrl } from '@/lib/api-url';
import { getCookie } from '@/lib/utils';
import { useToastStore } from '@/lib/store/toast-store';
import Image from 'next/image';

export type PartnerItem = { name: string; logo: string };

export function PartnerListEditor({ label, items, onChange, addLabel = 'Dodaj partnera' }: {
  label: string; items: PartnerItem[]; onChange: (items: PartnerItem[]) => void; addLabel?: string;
}) {
  const [uploadingIdx, setUploadingIdx] = React.useState<number | null>(null);
  const apiUrl = getApiBaseUrl();
  const addToast = useToastStore((state) => state.addToast);

  const addItem = () => {
    onChange([...items, { name: '', logo: '' }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateName = (index: number, name: string) => {
    onChange(items.map((item, i) => i === index ? { ...item, name } : item));
  };

  const updateLogo = (index: number, logo: string) => {
    onChange(items.map((item, i) => i === index ? { ...item, logo } : item));
  };

  const handleUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(index);
    const formData = new FormData();
    formData.append('file', file);

    const token = getCookie('pb_auth_token');
    try {
      const res = await fetch(`${apiUrl}/cms/media/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        updateLogo(index, data.url);
        addToast({ title: 'Logo przesłane', type: 'success' });
      } else {
        const err = await res.json();
        addToast({ title: 'Błąd przesyłania', description: err.message, type: 'error' });
      }
    } catch {
      addToast({ title: 'Błąd sieci', type: 'error' });
    } finally {
      setUploadingIdx(null);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">{label}</label>
        <button type="button" onClick={addItem} className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">add</span> {addLabel}
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="p-4 bg-[var(--color-surface-container)] rounded-xl border border-[var(--color-divider)] space-y-3 relative group">
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => removeItem(i)} className="p-1 hover:bg-red-50 rounded text-red-400">
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
          <div className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase">#{i + 1}</div>
          <div>
            <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">Nazwa partnera</label>
            <input
              className="w-full p-3 rounded-lg bg-[var(--color-surface-primary)] border border-[var(--color-divider)] text-sm outline-none focus:border-[var(--color-primary)] mt-1"
              value={item.name}
              onChange={(e) => updateName(i, e.target.value)}
              placeholder="np. DHL Freight"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">Logo</label>
            <div className="flex items-center gap-3 mt-1">
              {item.logo ? (
                <div className="relative w-16 h-16 rounded-lg border border-[var(--color-divider)] bg-[var(--color-surface-primary)] overflow-hidden flex-shrink-0">
                  <Image src={item.logo} alt={item.name || 'Logo'} fill className="object-contain p-2" sizes="64px" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg border border-dashed border-slate-300 bg-[var(--color-surface-primary)] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[var(--color-text-faint)] text-2xl">image</span>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="cursor-pointer inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[var(--color-surface-primary)] border border-[var(--color-divider)] text-xs font-bold text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                  <span className="material-symbols-outlined text-sm">{uploadingIdx === i ? 'progress_activity' : 'upload'}</span>
                  {uploadingIdx === i ? 'Przesyłanie...' : item.logo ? 'Zmień logo' : 'Prześlij logo'}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(i, e)} disabled={uploadingIdx === i} />
                </label>
                {item.logo && (
                  <button
                    type="button"
                    onClick={() => updateLogo(i, '')}
                    className="text-xs text-red-400 hover:underline text-left px-1"
                  >
                    Usuń logo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="p-8 text-center text-[var(--color-text-faint)] text-sm border-2 border-dashed border-[var(--color-divider)] rounded-xl">
          Brak partnerów. Kliknij &ldquo;{addLabel}&rdquo; aby dodać.
        </div>
      )}
    </div>
  );
}

// ── Section Header in editor ──
export function SectionHeader({ title, icon }: { title: string; icon?: string }) {
  return (
    <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[var(--color-divider)]">
      {icon && <span className="material-symbols-outlined text-[var(--color-primary)]">{icon}</span>}
      <h3 className="font-bold text-xl">{title}</h3>
    </div>
  );
}
