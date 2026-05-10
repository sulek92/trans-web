'use client';

import * as React from 'react';
import { useGlobalSettings } from '@/components/providers/global-data-provider';
import { useTranslation } from '@/lib/i18n/i18n-context';

export const SiteBanner = React.memo(function SiteBanner() {
  const settings = useGlobalSettings();
  const { t } = useTranslation();

  if (!settings) return null;
  if (!settings.bannerEnabled && !settings.maintenanceMode) return null;

  if (settings.maintenanceMode) {
    return (
      <div className="bg-red-600 text-white py-3 px-8 text-center text-xs font-bold tracking-widest uppercase animate-in slide-in-from-top duration-500 shadow-lg">
        <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-4">
          <span className="material-symbols-outlined text-lg">engineering</span>
          {t.banner.maintenance}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-primary)] text-white py-2 px-8 text-center text-xs font-bold tracking-widest uppercase animate-in slide-in-from-top duration-500">
      <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-4">
        <span className="material-symbols-outlined text-sm animate-pulse">campaign</span>
        {settings.bannerText}
        <span className="material-symbols-outlined text-sm animate-pulse">campaign</span>
      </div>
    </div>
  );
});
