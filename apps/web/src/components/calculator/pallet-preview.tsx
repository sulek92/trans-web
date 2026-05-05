'use client';

import * as React from 'react';

interface PalletPreviewProps {
  width: number;
  length: number;
  height: number;
  type: string;
}

export function PalletPreview({ width, length, height, type }: PalletPreviewProps) {
  // Normalize dimensions for preview (base is 100px)
  const scale = 0.5;
  const w = width * scale;
  const l = length * scale;
  const h = height * scale;

  return (
    <div className="relative h-48 w-full flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 overflow-hidden group">
      <div className="absolute top-2 left-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10">Podgląd ładunku</div>
      
      <div 
        className="relative transition-all duration-500 preserve-3d"
        style={{ 
          transform: 'rotateX(-20deg) rotateY(35deg)',
          width: `${l}px`,
          height: `${h}px`,
        }}
      >
        {/* Base (Pallet) */}
        <div 
          className="absolute bottom-0 left-0 bg-amber-800/80 border border-amber-900 shadow-xl"
          style={{ 
            width: `${l}px`, 
            height: '8px',
            transform: 'translateZ(0px)'
          }}
        ></div>

        {/* Cargo Box */}
        <div 
          className="absolute bottom-[8px] left-0 bg-[var(--color-primary)] opacity-80 border border-white/20 transition-all duration-500"
          style={{ 
            width: `${l}px`, 
            height: `${h - 8}px`,
            transform: 'translateZ(0px)'
          }}
        >
          <div className="absolute top-0 right-0 p-2 text-[8px] text-white/50 font-mono">
            {width}x{length}x{height}
          </div>
        </div>

        {/* Top Face */}
        <div 
          className="absolute bg-[var(--color-primary)] opacity-60"
          style={{ 
            width: `${l}px`, 
            height: `${w}px`,
            top: 0,
            left: 0,
            transform: `rotateX(90deg) translateZ(${w/2}px) translateY(-${w/2}px)`
          }}
        ></div>

        {/* Side Face */}
        <div 
          className="absolute bg-[var(--color-primary-container)] opacity-90"
          style={{ 
            width: `${w}px`, 
            height: `${h - 8}px`,
            top: '8px',
            right: 0,
            transform: `rotateY(90deg) translateZ(${w/2}px) translateX(${w/2}px)`
          }}
        ></div>
      </div>

      {/* Info Overlay on Hover */}
      <div className="absolute bottom-0 left-0 w-full p-3 bg-white/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform flex justify-between items-center border-t border-slate-100">
        <span className="text-[10px] font-bold text-slate-500 uppercase">{type}</span>
        <span className="text-[10px] font-data-mono font-bold text-[var(--color-primary)]">{width} x {length} x {height} cm</span>
      </div>
    </div>
  );
}
