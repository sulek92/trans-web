'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Box, Layers, Package } from 'lucide-react';

export type PalletType = 'euro' | 'semi_euro' | 'industrial' | 'semi_industrial' | 'custom';

interface PalletTypeSelectorProps {
  value?: PalletType;
  onChange: (value: PalletType) => void;
  error?: string;
}

const PALLET_OPTIONS = [
  { id: 'euro', label: 'Paleta Euro', desc: '120x80 cm', icon: Package },
  { id: 'semi_euro', label: 'Półpaleta', desc: '80x60 cm', icon: Box },
  { id: 'industrial', label: 'Przemysłowa', desc: '120x100 cm', icon: Layers },
  { id: 'custom', label: 'Niestandard.', desc: 'Inne wymiary', icon: Package },
] as const;

export function PalletTypeSelector({ value, onChange, error }: PalletTypeSelectorProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {PALLET_OPTIONS.map((opt) => {
          const isSelected = value === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id as PalletType)}
              className={cn(
                "flex flex-col items-center justify-center p-4 md:p-6 text-center rounded-xl border-2 transition-all",
                isSelected 
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-highlight)] text-[var(--color-primary-active)] shadow-sm" 
                  : "border-[var(--color-outline-variant)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] text-[var(--color-on-background)]",
                error && !isSelected && "border-[var(--color-error)]"
              )}
            >
              <Icon className={cn("h-6 w-6 md:h-8 md:w-8 mb-2 md:mb-3 transition-colors", isSelected ? "text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]")} />
              <span className="font-semibold text-xs md:text-sm font-display mb-1">{opt.label}</span>
              <span className="text-[10px] md:text-xs text-[var(--color-on-surface-variant)]">{opt.desc}</span>
            </button>
          );
        })}
      </div>
      {error && <span className="text-xs text-[var(--color-error)] mt-2 inline-block">{error}</span>}
    </div>
  );
}
