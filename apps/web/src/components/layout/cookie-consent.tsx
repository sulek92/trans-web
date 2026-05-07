'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { useGlobalSettings } from '@/components/providers/global-data-provider';
import { cn, setCookie } from '@/lib/utils';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface ConsentRecord extends CookiePreferences {
  version: string;
  createdAt: string;
  updatedAt?: string;
}

const COOKIE_CONSENT_KEY = 'pb_cookie_consent';
const CONSENT_VERSION = '2026-05-07';

let openSettingsCallback: (() => void) | null = null;

export function showCookieSettings() {
  openSettingsCallback?.();
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

function buildConsent(prefs: CookiePreferences, existingCreatedAt?: string): ConsentRecord {
  const now = new Date().toISOString();
  return {
    ...prefs,
    version: CONSENT_VERSION,
    createdAt: existingCreatedAt || now,
    ...(existingCreatedAt ? { updatedAt: now } : {}),
  };
}

export const CookieConsent = React.memo(function CookieConsent() {
  const { t } = useTranslation();
  const settings = useGlobalSettings();
  const [hasChoice, setHasChoice] = React.useState<boolean | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [preferences, setPreferences] = React.useState<CookiePreferences>(DEFAULT_PREFERENCES);

  React.useEffect(() => {
    openSettingsCallback = () => {
      setShowSettings(true);
    };
    return () => {
      openSettingsCallback = null;
    };
  }, []);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConsentRecord & Partial<CookiePreferences>;
        const { version, createdAt, updatedAt, essential, analytics, marketing } = parsed;

        if (!version || version !== CONSENT_VERSION) {
          setHasChoice(false);
          return;
        }

        setPreferences({
          essential: essential ?? true,
          analytics: analytics ?? false,
          marketing: marketing ?? false,
        });
        setHasChoice(true);
      } else {
        setHasChoice(false);
      }
    } catch {
      setHasChoice(false);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      const existing = (() => {
        try {
          const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
          return raw ? (JSON.parse(raw) as ConsentRecord) : null;
        } catch {
          return null;
        }
      })();

      const record = buildConsent(prefs, existing?.createdAt);
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
      setCookie(COOKIE_CONSENT_KEY, 'true', 365);
      setPreferences(prefs);
      setHasChoice(true);
      setShowSettings(false);
    } catch {
      // silently fail
    }
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  if (hasChoice === null) return null;

  if (settings?.cookieEnabled === false) return null;

  const txt = {
    bannerTitle: settings?.cookieBannerTitle || t.cookies.title,
    bannerText: settings?.cookieBannerText || t.cookies.text,
    privacyPolicy: settings?.cookiePrivacyPolicyLabel || t.cookies.privacyPolicy,
    settingsBtn: settings?.cookieSettingsButton || t.cookies.settings,
    acceptAll: settings?.cookieAcceptAllButton || t.cookies.acceptAll,
    rejectAll: settings?.cookieRejectAllButton || t.cookies.rejectAll,
    settingsTitle: settings?.cookieSettingsTitle || t.cookies.settingsTitle,
    settingsSubtitle: settings?.cookieSettingsSubtitle || t.cookies.settingsSubtitle,
    essential: settings?.cookieEssentialLabel || t.cookies.essential,
    essentialDesc: settings?.cookieEssentialDesc || t.cookies.essentialDesc,
    analytics: settings?.cookieAnalyticsLabel || t.cookies.analytics,
    analyticsDesc: settings?.cookieAnalyticsDesc || t.cookies.analyticsDesc,
    marketing: settings?.cookieMarketingLabel || t.cookies.marketing,
    marketingDesc: settings?.cookieMarketingDesc || t.cookies.marketingDesc,
    cancel: settings?.cookieCancelButton || t.cookies.cancel,
    save: settings?.cookieSaveButton || t.cookies.save,
  };

  const buttonClass = 'px-5 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-95 text-center whitespace-nowrap';
  const buttonPrimary = `${buttonClass} bg-[var(--color-primary)] text-white hover:brightness-110 shadow-[0_10px_20px_rgba(0,82,88,0.2)]`;
  const buttonOutline = `${buttonClass} border border-[var(--color-divider)] text-[var(--color-on-background)] hover:bg-[var(--color-surface-container)]`;

  return (
    <>
      {/* Banner */}
      <AnimatePresence>
        {!hasChoice && !showSettings && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full z-[100] p-4 sm:p-6"
          >
            <div className="max-w-[1200px] mx-auto glass dark:glass-dark p-6 sm:p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-2xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-3xl animate-pulse">cookie</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display-bold text-xl text-[var(--color-on-background)]">
                    {txt.bannerTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed max-w-2xl">
                    {txt.bannerText}{' '}
                    <a
                      href="/polityka-prywatnosci"
                      className="text-[var(--color-primary)] font-bold hover:underline underline-offset-4 decoration-2"
                    >
                      {txt.privacyPolicy}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                <button onClick={handleRejectAll} className={buttonOutline}>
                  {txt.rejectAll}
                </button>
                <button onClick={() => setShowSettings(true)} className={buttonOutline}>
                  {txt.settingsBtn}
                </button>
                <button onClick={handleAcceptAll} className={buttonPrimary}>
                  {txt.acceptAll}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            key="cookie-settings-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          >
            <div
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass dark:glass-dark rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10"
            >
              <div className="p-8 sm:p-10">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="font-display-bold text-3xl text-[var(--color-on-background)] mb-2">
                      {txt.settingsTitle}
                    </h2>
                    <p className="text-[var(--color-on-surface-variant)]">
                      {txt.settingsSubtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Essential */}
                  <div className="flex items-center justify-between p-5 rounded-[24px] bg-[var(--color-surface-container-low)] border border-white/5">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">security</span>
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-on-background)]">{txt.essential}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{txt.essentialDesc}</p>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full whitespace-nowrap ml-2">
                      {t.cookies.alwaysActive || 'Zawsze aktywne'}
                    </div>
                  </div>

                  {/* Analytics */}
                  <div
                    onClick={() => setPreferences((p) => ({ ...p, analytics: !p.analytics }))}
                    className="flex items-center justify-between p-5 rounded-[24px] bg-[var(--color-surface-container-low)] border border-white/5 cursor-pointer hover:border-[var(--color-primary)]/30 transition-all"
                    role="switch"
                    aria-checked={preferences.analytics}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setPreferences((p) => ({ ...p, analytics: !p.analytics }));
                      }
                    }}
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">analytics</span>
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-on-background)]">{txt.analytics}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{txt.analyticsDesc}</p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        'w-12 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ml-2',
                        preferences.analytics ? 'bg-[var(--color-primary)]' : 'bg-slate-300 dark:bg-slate-600',
                      )}
                    >
                      <motion.div
                        animate={{ x: preferences.analytics ? 24 : 0 }}
                        className="w-4 h-4 rounded-full bg-white shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Marketing */}
                  <div
                    onClick={() => setPreferences((p) => ({ ...p, marketing: !p.marketing }))}
                    className="flex items-center justify-between p-5 rounded-[24px] bg-[var(--color-surface-container-low)] border border-white/5 cursor-pointer hover:border-[var(--color-primary)]/30 transition-all"
                    role="switch"
                    aria-checked={preferences.marketing}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setPreferences((p) => ({ ...p, marketing: !p.marketing }));
                      }
                    }}
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">campaign</span>
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-on-background)]">{txt.marketing}</p>
                        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{txt.marketingDesc}</p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        'w-12 h-6 rounded-full transition-colors flex items-center px-1 shrink-0 ml-2',
                        preferences.marketing ? 'bg-[var(--color-primary)]' : 'bg-slate-300 dark:bg-slate-600',
                      )}
                    >
                      <motion.div
                        animate={{ x: preferences.marketing ? 24 : 0 }}
                        className="w-4 h-4 rounded-full bg-white shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-3">
                  <button onClick={handleRejectAll} className={`flex-1 ${buttonOutline}`}>
                    {txt.rejectAll}
                  </button>
                  <button onClick={() => saveConsent(preferences)} className={`flex-1 ${buttonPrimary}`}>
                    {txt.save}
                  </button>
                  <button onClick={handleAcceptAll} className={`flex-1 ${buttonPrimary}`}>
                    {txt.acceptAll}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
