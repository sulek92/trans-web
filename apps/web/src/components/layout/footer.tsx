'use client';

import * as React from 'react';
import Link from 'next/link';
import { useGlobalSettings } from '@/components/providers/global-data-provider';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { useToastStore } from '@/lib/store/toast-store';
import { getApiBaseUrl } from '@/lib/api-url';
import { showCookieSettings } from '@/components/layout/cookie-consent';

export const Footer = React.memo(function Footer() {
  const { t } = useTranslation();
  const settings = useGlobalSettings();
  const addToast = useToastStore((state) => state.addToast);
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [isSubscribing, setIsSubscribing] = React.useState(false);
  const brandName = settings?.brandName?.trim() || 'PaletBroker';
  const footerTagline = settings?.footerTagline?.trim() || t.footer.tagline;
  const supportStatusLabel = settings?.supportStatusLabel?.trim() || 'System Status: Online';
  const newsletterEnabled = settings?.newsletterEnabled !== false;
  const phone = settings?.phone?.trim();
  const email = settings?.email?.trim();
  const street = settings?.street?.trim();
  const city = settings?.city?.trim();

  const defaultCompanyLinks = [
    { label: t.footer.links.about, href: '/o-nas' },
    { label: t.footer.links.career, href: '/kariera' },
    { label: t.footer.links.contact, href: '/kontakt' },
    { label: t.footer.links.blog, href: '/blog' },
  ];
  const defaultToolLinks = [
    { label: t.footer.links.calculator, href: '/wycena' },
    { label: t.footer.links.tracking, href: '/sledzenie' },
    { label: t.footer.links.api, href: '/api' },
    { label: t.footer.links.guide, href: '/typy-palet' },
  ];
  const defaultSupportLinks = [
    { label: t.footer.links.help, href: '/pomoc' },
    { label: t.footer.links.terms, href: '/regulamin' },
    { label: t.footer.links.privacy, href: '/polityka-prywatnosci' },
    { label: t.footer.links.admin, href: '/admin' },
  ];

  const normalizeLinks = (
    links: Array<{ label?: string; href?: string }> | undefined,
    fallback: Array<{ label: string; href: string }>,
  ) => {
    if (!links || links.length === 0) return fallback;
    const normalized = links
      .map((link) => {
        const label = (link.label || '').trim();
        const rawHref = (link.href || '').trim();
        if (!label || !rawHref) return null;
        return {
          label,
          href: rawHref.startsWith('/') ? rawHref : `/${rawHref}`,
        };
      })
      .filter((link): link is { label: string; href: string } => link !== null);
    return normalized.length > 0 ? normalized : fallback;
  };

  const companyLinks = normalizeLinks(settings?.footerCompanyLinks, defaultCompanyLinks);
  const toolLinks = normalizeLinks(settings?.footerToolLinks, defaultToolLinks);
  const supportLinks = normalizeLinks(settings?.footerSupportLinks, defaultSupportLinks);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = newsletterEmail.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      addToast({ title: 'Błąd', description: 'Podaj prawidłowy adres e-mail.', type: 'error' });
      return;
    }
    setIsSubscribing(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      if (res.ok) {
        addToast({ title: 'Sukces!', description: 'Zostałeś zapisany do newslettera.', type: 'success' });
        setNewsletterEmail('');
      } else {
        addToast({ title: 'Błąd', description: 'Nie udało się zapisać. Spróbuj ponownie.', type: 'error' });
      }
    } catch {
      addToast({ title: 'Błąd', description: 'Nie udało się zapisać. Spróbuj ponownie.', type: 'error' });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="w-full py-16 border-t border-[var(--color-divider)] bg-[var(--color-surface-container-low)] dark:bg-[#020617] text-[var(--color-text-muted)] mt-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col gap-6">
          <div className="text-2xl font-bold text-[var(--color-on-background)] flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
            </div>
            {brandName}
          </div>
          <p className="text-sm leading-relaxed opacity-70">
            {settings?.footerDesc || t.footer.desc}
          </p>
          {newsletterEnabled && (
            <div className="mt-2">
              <div className="text-[10px] font-bold text-[var(--color-on-background)] uppercase tracking-widest mb-3 opacity-40">{t.footer.newsletterTitle}</div>
              <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder={t.footer.newsletterPlaceholder}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-[var(--color-surface-primary)] border border-[var(--color-divider)] rounded-lg px-3 py-2 text-xs flex-grow outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-on-background)]"
                  required
                />
                <button type="submit" disabled={isSubscribing} className="bg-[var(--color-primary)] text-white p-2 rounded-lg transition-colors disabled:opacity-50 shadow-sm">
                  <span className="material-symbols-outlined text-sm">{isSubscribing ? 'hourglass_top' : 'send'}</span>
                </button>
              </form>
            </div>
          )}
          {(phone || email || street || city) && (
            <div className="mt-4 space-y-2">
              {phone && <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <span className="material-symbols-outlined text-base">call</span>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-[var(--color-primary)] transition-colors">{phone}</a>
              </div>}
              {email && <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <span className="material-symbols-outlined text-base">mail</span>
                <a href={`mailto:${email}`} className="hover:text-[var(--color-primary)] transition-colors">{email}</a>
              </div>}
              {street && <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>{street}{city ? `, ${city}` : ''}</span>
              </div>}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-[var(--color-on-background)] font-bold text-sm uppercase tracking-widest mb-2">{t.footer.sections.company}</h3>
          {companyLinks.map((link) => (
            <Link key={`${link.href}:${link.label}`} className="text-sm hover:text-[var(--color-primary)] transition-colors" href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-[var(--color-on-background)] font-bold text-sm uppercase tracking-widest mb-2">{t.footer.sections.tools}</h3>
          {toolLinks.map((link) => (
            <Link key={`${link.href}:${link.label}`} className="text-sm hover:text-[var(--color-primary)] transition-colors" href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-[var(--color-on-background)] font-bold text-sm uppercase tracking-widest mb-2">{t.footer.sections.support}</h3>
          {supportLinks.map((link) => (
            <Link
              key={`${link.href}:${link.label}`}
              className={`text-sm hover:text-[var(--color-primary)] transition-colors ${link.href === '/admin' ? 'font-bold opacity-30' : ''}`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          {settings?.cookieEnabled !== false && (
            <button
              onClick={showCookieSettings}
              className="text-sm hover:text-[var(--color-primary)] transition-colors text-left"
            >
              {settings?.cookieSettingsButton || t.cookies.settings}
            </button>
          )}
          <div className="mt-4 flex items-center gap-3 p-3 bg-[var(--color-surface-primary)] rounded-xl border border-[var(--color-divider)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{supportStatusLabel}</span>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-8 mt-16 pt-8 border-t border-[var(--color-divider)] flex justify-between items-center text-xs opacity-50 text-[var(--color-text-muted)]">
        <p>© {new Date().getFullYear()} {settings?.companyName || 'PaletBroker Sp. z o.o.'} {t.footer.allRightsReserved}</p>
        <p>{footerTagline}</p>
      </div>
    </footer>
  );
});
