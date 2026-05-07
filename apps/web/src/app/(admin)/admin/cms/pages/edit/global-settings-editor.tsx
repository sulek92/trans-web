"use client";

import * as React from 'react';
import { TextField, ToggleSwitch, ListEditor, SectionHeader } from '../../components';

interface NavLink {
  label?: string;
  href?: string;
}

interface GlobalSettingsData {
  brandName?: string;
  footerTagline?: string;
  bannerText?: string;
  bannerCode?: string;
  bannerEnabled?: boolean;
  maintenanceMode?: boolean;
  fuelSurcharge?: number;
  newsletterEnabled?: boolean;
  supportStatusLabel?: string;
  navLinks?: NavLink[];
  footerCompanyLinks?: NavLink[];
  footerToolLinks?: NavLink[];
  footerSupportLinks?: NavLink[];
  footerDesc?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  street?: string;
  city?: string;
  cookieEnabled?: boolean;
  cookieBannerTitle?: string;
  cookieBannerText?: string;
  cookieAcceptAllButton?: string;
  cookieRejectAllButton?: string;
  cookieSettingsButton?: string;
  cookiePrivacyPolicyLabel?: string;
  cookieSettingsTitle?: string;
  cookieSettingsSubtitle?: string;
  cookieEssentialLabel?: string;
  cookieEssentialDesc?: string;
  cookieAnalyticsLabel?: string;
  cookieAnalyticsDesc?: string;
  cookieMarketingLabel?: string;
  cookieMarketingDesc?: string;
  cookieCancelButton?: string;
  cookieSaveButton?: string;
}

interface Props {
  initialContent: string;
  onSave: (json: string) => Promise<void>;
  saving: boolean;
}

function parseContent(raw: string): GlobalSettingsData {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

const linkFields = [
  { key: 'label', label: 'Etykieta' },
  { key: 'href', label: 'Link (URL)' },
];

export const GlobalSettingsEditor: React.FC<Props> = ({ initialContent, onSave, saving }) => {
  const [data, setData] = React.useState<GlobalSettingsData>(() => parseContent(initialContent));

  const update = (patch: Partial<GlobalSettingsData>) => setData((prev) => ({ ...prev, ...patch }));

  const handleSave = () => {
    onSave(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-12">
      {/* Branding */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Branding" icon="storefront" />
        <TextField label="Nazwa marki (brandName)" value={data.brandName || ''} onChange={(v) => update({ brandName: v })} />
        <TextField label="Tagline w stopce (footerTagline)" value={data.footerTagline || ''} onChange={(v) => update({ footerTagline: v })} />
        <TextField label="Tekst w stopce (footerDesc)" value={data.footerDesc || ''} onChange={(v) => update({ footerDesc: v })} rows={3} />
        <TextField label="Etykieta statusu systemu" value={data.supportStatusLabel || ''} onChange={(v) => update({ supportStatusLabel: v })} />
      </section>

      {/* Banner & Maintenance */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Baner promocyjny i tryb serwisowy" icon="campaign" />
        <TextField label="Tekst banera (bannerText)" value={data.bannerText || ''} onChange={(v) => update({ bannerText: v })} />
        <TextField label="Kod promocyjny (bannerCode)" value={data.bannerCode || ''} onChange={(v) => update({ bannerCode: v })} />
        <ToggleSwitch label="Baner włączony (bannerEnabled)" value={!!data.bannerEnabled} onChange={(v) => update({ bannerEnabled: v })} />
        <ToggleSwitch label="Tryb serwisowy (maintenanceMode)" value={!!data.maintenanceMode} onChange={(v) => update({ maintenanceMode: v })} />
        <TextField label="Dopłata paliwowa % (fuelSurcharge)" value={String(data.fuelSurcharge ?? '')} onChange={(v) => update({ fuelSurcharge: parseFloat(v) || 0 })} />
        <ToggleSwitch label="Newsletter włączony" value={!!data.newsletterEnabled} onChange={(v) => update({ newsletterEnabled: v })} />
      </section>

      {/* Navigation */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Nawigacja główna (navLinks)" icon="navigation" />
        <ListEditor
          label="Linki w menu głównym"
          items={(data.navLinks || []) as unknown as Record<string, string>[]}
          fields={linkFields}
          onChange={(v) => update({ navLinks: v as unknown as NavLink[] })}
          addLabel="Dodaj link"
        />
      </section>

      {/* Footer Links */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Stopka - Firma" icon="business" />
        <ListEditor
          label="Linki w stopce (Firma)"
          items={(data.footerCompanyLinks || []) as unknown as Record<string, string>[]}
          fields={linkFields}
          onChange={(v) => update({ footerCompanyLinks: v as unknown as NavLink[] })}
          addLabel="Dodaj link"
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Stopka - Narzędzia" icon="build" />
        <ListEditor
          label="Linki w stopce (Narzędzia)"
          items={(data.footerToolLinks || []) as unknown as Record<string, string>[]}
          fields={linkFields}
          onChange={(v) => update({ footerToolLinks: v as unknown as NavLink[] })}
          addLabel="Dodaj link"
        />
      </section>

      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Stopka - Wsparcie" icon="support_agent" />
        <ListEditor
          label="Linki w stopce (Wsparcie)"
          items={(data.footerSupportLinks || []) as unknown as Record<string, string>[]}
          fields={linkFields}
          onChange={(v) => update({ footerSupportLinks: v as unknown as NavLink[] })}
          addLabel="Dodaj link"
        />
      </section>

      {/* Cookie Consent */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Zgoda na cookies (RODO)" icon="cookie" />
        <p className="text-sm text-slate-500 -mt-2 mb-2">
          Pozostaw puste pola, aby użyć domyślnych tłumaczeń. Wartości nadpisują wszystkie języki.
        </p>
        <ToggleSwitch label="Baner cookies włączony (cookieEnabled)" value={data.cookieEnabled !== false} onChange={(v) => update({ cookieEnabled: v })} />

        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Baner (pasek na dole)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Tytuł banera" value={data.cookieBannerTitle || ''} onChange={(v) => update({ cookieBannerTitle: v })} />
            <TextField label="Tekst 'Polityka prywatności'" value={data.cookiePrivacyPolicyLabel || ''} onChange={(v) => update({ cookiePrivacyPolicyLabel: v })} />
            <TextField label="Tekst opisu (cookieBannerText)" value={data.cookieBannerText || ''} onChange={(v) => update({ cookieBannerText: v })} rows={2} />
            <TextField label="Przycisk 'Akceptuj wszystkie'" value={data.cookieAcceptAllButton || ''} onChange={(v) => update({ cookieAcceptAllButton: v })} />
            <TextField label="Przycisk 'Odrzuć wszystkie'" value={data.cookieRejectAllButton || ''} onChange={(v) => update({ cookieRejectAllButton: v })} />
            <TextField label="Przycisk 'Ustawienia'" value={data.cookieSettingsButton || ''} onChange={(v) => update({ cookieSettingsButton: v })} />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Okno ustawień (modal)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Tytuł modala" value={data.cookieSettingsTitle || ''} onChange={(v) => update({ cookieSettingsTitle: v })} />
            <TextField label="Podtytuł modala" value={data.cookieSettingsSubtitle || ''} onChange={(v) => update({ cookieSettingsSubtitle: v })} />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Kategorie cookies</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <TextField label="Etykieta 'Niezbędne'" value={data.cookieEssentialLabel || ''} onChange={(v) => update({ cookieEssentialLabel: v })} />
              <TextField label="Opis 'Niezbędne'" value={data.cookieEssentialDesc || ''} onChange={(v) => update({ cookieEssentialDesc: v })} />
            </div>
            <div className="space-y-2">
              <TextField label="Etykieta 'Analityczne'" value={data.cookieAnalyticsLabel || ''} onChange={(v) => update({ cookieAnalyticsLabel: v })} />
              <TextField label="Opis 'Analityczne'" value={data.cookieAnalyticsDesc || ''} onChange={(v) => update({ cookieAnalyticsDesc: v })} />
            </div>
            <div className="space-y-2">
              <TextField label="Etykieta 'Marketingowe'" value={data.cookieMarketingLabel || ''} onChange={(v) => update({ cookieMarketingLabel: v })} />
              <TextField label="Opis 'Marketingowe'" value={data.cookieMarketingDesc || ''} onChange={(v) => update({ cookieMarketingDesc: v })} />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-sm font-bold text-slate-800 mb-4">Przyciski modala</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Przycisk 'Anuluj'" value={data.cookieCancelButton || ''} onChange={(v) => update({ cookieCancelButton: v })} />
            <TextField label="Przycisk 'Zapisz'" value={data.cookieSaveButton || ''} onChange={(v) => update({ cookieSaveButton: v })} />
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <SectionHeader title="Dane kontaktowe w stopce" icon="contact_phone" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Telefon" value={data.phone || ''} onChange={(v) => update({ phone: v })} />
          <TextField label="Email" value={data.email || ''} onChange={(v) => update({ email: v })} />
          <TextField label="Nazwa firmy" value={data.companyName || ''} onChange={(v) => update({ companyName: v })} />
          <TextField label="Ulica" value={data.street || ''} onChange={(v) => update({ street: v })} />
          <TextField label="Kod pocztowy i miasto" value={data.city || ''} onChange={(v) => update({ city: v })} />
        </div>
      </section>

      <div className="flex gap-4 pb-12">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span className="material-symbols-outlined">save</span>
          {saving ? 'Zapisuję...' : 'Zapisz stronę'}
        </button>
      </div>
    </div>
  );
};
