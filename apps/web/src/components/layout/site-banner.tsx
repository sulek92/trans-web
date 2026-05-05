'use client';

import * as React from 'react';

export function SiteBanner() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isMaintenance, setIsMaintenance] = React.useState(false);

  React.useEffect(() => {
    const checkStatus = () => {
      const banner = localStorage.getItem('site_banner');
      const maintenance = localStorage.getItem('maintenance_mode');
      setIsVisible(banner === 'true');
      setIsMaintenance(maintenance === 'true');
    };

    checkStatus();
    window.addEventListener('storage', checkStatus);
    return () => window.removeEventListener('storage', checkStatus);
  }, []);

  if (!isVisible && !isMaintenance) return null;

  if (isMaintenance) {
    return (
      <div className="bg-red-600 text-white py-3 px-8 text-center text-xs font-bold tracking-widest uppercase animate-in slide-in-from-top duration-500 z-[110] sticky top-0 shadow-lg">
        <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-4">
          <span className="material-symbols-outlined text-lg">engineering</span>
          Trwają prace konserwacyjne. Składanie nowych zleceń jest tymczasowo wstrzymane.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-primary)] text-white py-2 px-8 text-center text-xs font-bold tracking-widest uppercase animate-in slide-in-from-top duration-500 z-[110] sticky top-0">
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-4">
        <span className="material-symbols-outlined text-sm animate-pulse">campaign</span>
        Promocja: -10% na wszystkie kierunki UE z kodem: START2024
        <span className="material-symbols-outlined text-sm animate-pulse">campaign</span>
      </div>
    </div>
  );
}

