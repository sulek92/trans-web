'use client';

import * as React from 'react';

export interface GlobalSettings {
  bannerText?: string;
  bannerCode?: string;
  bannerEnabled?: boolean;
  maintenanceMode?: boolean;
  footerDesc?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  street?: string;
  city?: string;
  brandName?: string;
  footerTagline?: string;
  newsletterEnabled?: boolean;
  supportStatusLabel?: string;
  navLinks?: Array<{ label?: string; href?: string }>;
  footerCompanyLinks?: Array<{ label?: string; href?: string }>;
  footerToolLinks?: Array<{ label?: string; href?: string }>;
  footerSupportLinks?: Array<{ label?: string; href?: string }>;
}

const GlobalSettingsContext = React.createContext<GlobalSettings | null>(null);

export function GlobalDataProvider({ 
  children, 
  settings 
}: { 
  children: React.ReactNode; 
  settings: GlobalSettings | null;
}) {
  return (
    <GlobalSettingsContext.Provider value={settings}>
      {children}
    </GlobalSettingsContext.Provider>
  );
}

export function useGlobalSettings() {
  const context = React.useContext(GlobalSettingsContext);
  return context;
}
