'use client';

import * as React from 'react';

// ── Text Field Editor ──
export function TextField({ label, value, onChange, rows = 1, className = '' }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {rows > 1 ? (
        <textarea
          className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all text-sm"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
        />
      ) : (
        <input
          className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[var(--color-primary)] outline-none transition-all text-sm"
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
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div>
        <div className="font-bold text-sm">{label}</div>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full relative transition-colors ${value ? 'bg-[var(--color-primary)]' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${value ? 'left-7' : 'left-1'}`} />
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
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
        <button type="button" onClick={addItem} className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">add</span> {addLabel}
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 relative group">
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => moveItem(i, -1)} className="p-1 hover:bg-white rounded text-slate-400"><span className="material-symbols-outlined text-sm">arrow_upward</span></button>
            <button type="button" onClick={() => moveItem(i, 1)} className="p-1 hover:bg-white rounded text-slate-400"><span className="material-symbols-outlined text-sm">arrow_downward</span></button>
            <button type="button" onClick={() => removeItem(i)} className="p-1 hover:bg-red-50 rounded text-red-400"><span className="material-symbols-outlined text-sm">delete</span></button>
          </div>
          <div className="text-[10px] font-bold text-slate-300 uppercase">#{i + 1}</div>
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea className="w-full p-3 rounded-lg bg-white border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] mt-1" value={item[f.key] || ''} onChange={(e) => updateItem(i, f.key, e.target.value)} rows={2} />
              ) : (
                <input className="w-full p-3 rounded-lg bg-white border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)] mt-1" value={item[f.key] || ''} onChange={(e) => updateItem(i, f.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
      ))}
      {items.length === 0 && <div className="p-8 text-center text-slate-300 text-sm border-2 border-dashed border-slate-100 rounded-xl">Brak elementów. Kliknij &ldquo;{addLabel}&rdquo; aby dodać.</div>}
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
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
        <button type="button" onClick={() => onChange([...items, ''])} className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">add</span> {addLabel}
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="flex-1 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm outline-none focus:border-[var(--color-primary)]"
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

// ── Section Header in editor ──
export function SectionHeader({ title, icon }: { title: string; icon?: string }) {
  return (
    <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
      {icon && <span className="material-symbols-outlined text-[var(--color-primary)]">{icon}</span>}
      <h3 className="font-bold text-xl">{title}</h3>
    </div>
  );
}
