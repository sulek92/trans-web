'use client';

import * as React from 'react';

interface PalletPreviewProps {
  width: number;
  length: number;
  height: number;
  type: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const palletTypeLabels: Record<string, string> = {
  euro: 'Euro 120x80',
  semi_euro: 'Półpaleta 80x60',
  industrial: 'Przemysłowa 120x100',
  semi_industrial: 'Półprzemysłowa 120x100',
  custom: 'Niestandardowa',
};

export function PalletPreview({ width, length, height, type }: PalletPreviewProps) {
  // Responsywna normalizacja podglądu, aby obiekt był czytelny
  // i zawsze dobrze wykorzystywał dostępną przestrzeń.
  const l = clamp((length / 300) * 360, 210, 360);
  const w = clamp((width / 300) * 240, 130, 240);
  const h = clamp((height / 250) * 220, 135, 220);
  const palletThickness = 12;
  const cargoHeight = Math.max(90, h - palletThickness);
  const palletLabel = palletTypeLabels[type] || type;

  return (
    <div className="relative h-[240px] sm:h-[280px] lg:h-[320px] w-full rounded-xl border border-slate-200 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="absolute top-3 left-3 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] z-10">
        Podgląd ładunku
      </div>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-4 pb-12 sm:pb-14" style={{ perspective: '1100px' }}>
        <div
          className="relative transition-all duration-500"
          style={{
            transform: 'rotateX(-20deg) rotateY(34deg)',
            transformStyle: 'preserve-3d',
            width: `${l}px`,
            height: `${h}px`,
          }}
        >
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-4 rounded-full bg-slate-400/35 blur-md"
            style={{ width: `${l * 0.9}px` }}
          />

          {/* Base (Pallet) */}
          <div
            className="absolute bottom-0 left-0 bg-amber-700 border border-amber-900 shadow-xl"
            style={{
              width: `${l}px`,
              height: `${palletThickness}px`,
              transform: 'translateZ(0px)',
            }}
          />

          {/* Cargo Box */}
          <div
            className="absolute left-0 bg-[var(--color-primary)]/90 border border-white/30 shadow-md"
            style={{
              width: `${l}px`,
              height: `${cargoHeight}px`,
              bottom: `${palletThickness}px`,
              transform: 'translateZ(0px)',
            }}
          >
            <div className="absolute top-2 right-2 text-[11px] text-white/90 font-semibold font-data-mono tracking-wide">
              {width}x{length}x{height}
            </div>
          </div>

          {/* Top Face */}
          <div
            className="absolute bg-[var(--color-primary)]/65"
            style={{
              width: `${l}px`,
              height: `${w}px`,
              top: `${h - cargoHeight - palletThickness}px`,
              left: 0,
              transform: `rotateX(90deg) translateZ(${w / 2}px) translateY(-${w / 2}px)`,
            }}
          />

          {/* Side Face */}
          <div
            className="absolute bg-[var(--color-primary-container)]/90"
            style={{
              width: `${w}px`,
              height: `${cargoHeight}px`,
              bottom: `${palletThickness}px`,
              right: 0,
              transform: `rotateY(90deg) translateZ(${w / 2}px) translateX(${w / 2}px)`,
            }}
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 bg-white/85 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 text-[11px] sm:text-xs">
          <span className="rounded-full border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-600">
            {palletLabel}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-2 py-1 font-data-mono text-[var(--color-primary)]">
            {length} × {width} × {height} cm
          </span>
        </div>
      </div>
    </div>
  );
}
