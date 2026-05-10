'use client';

import * as React from 'react';
import Link from 'next/link';
import { useGlobalSettings } from '@/components/providers/global-data-provider';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { useToastStore } from '@/lib/store/toast-store';
import { getApiBaseUrl } from '@/lib/api-url';
import { showCookieSettings } from '@/components/layout/cookie-consent';
import { cn } from '@/lib/utils';

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
    <footer className="w-full pt-24 pb-12 border-t border-[var(--color-divider)] bg-[var(--color-surface-container-low)] dark:bg-[#020617] text-[var(--color-text-muted)] mt-auto relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1280px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Link href="/" className="text-2xl font-bold text-[var(--color-on-background)] flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-xl shadow-[var(--color-primary)]/20 group-hover:scale-110 transition-premium">
                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
              </div>
              <span className="tracking-tighter">{brandName}</span>
            </Link>
            
            <p className="text-base leading-relaxed opacity-80 max-w-sm">
              {settings?.footerDesc || t.footer.desc}
            </p>

            {newsletterEnabled && (
              <div className="mt-4 bg-[var(--color-surface-primary)] p-6 rounded-[32px] border border-[var(--color-divider)]/50 shadow-sm">
                <div className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.2em] mb-4">
                  Bądź na bieżąco
                </div>
                <form className="relative group" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    placeholder={t.footer.newsletterPlaceholder}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-divider)]/50 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[var(--color-primary)] transition-all text-[var(--color-on-background)] placeholder:text-[var(--color-text-faint)] pr-16"
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={isSubscribing} 
                    className="absolute right-2 top-2 bottom-2 bg-[var(--color-primary)] text-white px-4 rounded-xl transition-all disabled:opacity-50 shadow-md hover:bg-[var(--color-primary-hover)] active:scale-95"
                  >
                    <span className="material-symbols-outlined text-xl">{isSubscribing ? 'hourglass_top' : 'arrow_forward'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-6">
              <h3 className="text-[var(--color-on-background)] font-black text-[10px] uppercase tracking-[0.2em]">{t.footer.sections.company}</h3>
              <div className="flex flex-col gap-4">
                {companyLinks.map((link) => (
                  <Link key={`${link.href}:${link.label}`} className="text-sm hover:text-[var(--color-primary)] transition-premium flex items-center gap-2 group/link" href={link.href}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] scale-0 group-hover/link:scale-100 transition-transform" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-[var(--color-on-background)] font-black text-[10px] uppercase tracking-[0.2em]">{t.footer.sections.tools}</h3>
              <div className="flex flex-col gap-4">
                {toolLinks.map((link) => (
                  <Link key={`${link.href}:${link.label}`} className="text-sm hover:text-[var(--color-primary)] transition-premium flex items-center gap-2 group/link" href={link.href}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] scale-0 group-hover/link:scale-100 transition-transform" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 col-span-2 md:col-span-1">
              <h3 className="text-[var(--color-on-background)] font-black text-[10px] uppercase tracking-[0.2em]">{t.footer.sections.support}</h3>
              <div className="flex flex-col gap-4">
                {supportLinks.map((link) => (
                  <Link
                    key={`${link.href}:${link.label}`}
                    className={cn(
                      "text-sm hover:text-[var(--color-primary)] transition-premium flex items-center gap-2 group/link",
                      link.href === '/admin' && "font-bold opacity-30"
                    )}
                    href={link.href}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] scale-0 group-hover/link:scale-100 transition-transform" />
                    {link.label}
                  </Link>
                ))}
                {settings?.cookieEnabled !== false && (
                  <button
                    onClick={showCookieSettings}
                    className="text-sm hover:text-[var(--color-primary)] transition-premium text-left flex items-center gap-2 group/link"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] scale-0 group-hover/link:scale-100 transition-transform" />
                    {settings?.cookieSettingsButton || t.cookies.settings}
                  </button>
                )}
              </div>

              <div className="mt-4 flex items-center gap-4 p-4 bg-[var(--color-surface-primary)] rounded-[24px] border border-[var(--color-divider)]/50 shadow-sm group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div>
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Live Status</div>
                  <div className="text-[11px] font-bold text-[var(--color-on-background)]">{supportStatusLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-[var(--color-surface-primary)] rounded-[40px] border border-[var(--color-divider)]/30 shadow-xl mb-16">
          {phone && (
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-5 group/item">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-primary)] group-hover/item:bg-[var(--color-primary)] group-hover/item:text-white transition-premium">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Zadzwoń do nas</div>
                <div className="text-sm font-bold text-[var(--color-on-background)]">{phone}</div>
              </div>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-5 group/item">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-primary)] group-hover/item:bg-[var(--color-primary)] group-hover/item:text-white transition-premium">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Napisz e-mail</div>
                <div className="text-sm font-bold text-[var(--color-on-background)]">{email}</div>
              </div>
            </a>
          )}
          {(street || city) && (
            <div className="flex items-center gap-5 group/item">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-primary)] group-hover/item:bg-[var(--color-primary)] group-hover/item:text-white transition-premium">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-faint)]">Nasze biuro</div>
                <div className="text-sm font-bold text-[var(--color-on-background)]">{street}{city ? `, ${city}` : ''}</div>
              </div>
            </div>
          )}
        </div>

        {/* Legal Bar */}
        <div className="pt-8 border-t border-[var(--color-divider)]/30 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-[var(--color-text-faint)] uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {settings?.companyName || 'PaletBroker Sp. z o.o.'} {t.footer.allRightsReserved}</p>
          <div className="flex items-center gap-8">
            <p>{footerTagline}</p>
            <div className="flex gap-4">
              <button className="hover:text-[var(--color-primary)] transition-colors">FB</button>
              <button className="hover:text-[var(--color-primary)] transition-colors">IN</button>
              <button className="hover:text-[var(--color-primary)] transition-colors">TW</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});
