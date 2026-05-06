'use client';

import * as React from 'react';
import Link from 'next/link';
import { useGlobalSettings } from '@/components/providers/global-data-provider';
import { useTranslation } from '@/lib/i18n/i18n-context';

export function Footer() {
  const { t } = useTranslation();
  const settings = useGlobalSettings();
  const brandName = settings?.brandName?.trim() || 'PaletBroker';
  const footerTagline = settings?.footerTagline?.trim() || t.footer.tagline;
  const supportStatusLabel = settings?.supportStatusLabel?.trim() || 'System Status: Online';
  const newsletterEnabled = settings?.newsletterEnabled !== false;

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

  return (
    <footer className="w-full py-16 border-t border-slate-800 bg-[#0a0c10] text-slate-400 mt-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col gap-6">
          <div className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary-highlight)]/20">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
            </div>
            {brandName}
          </div>
          <p className="text-sm leading-relaxed opacity-60">
            {settings?.footerDesc || t.footer.desc}
          </p>
          {newsletterEnabled && (
            <div className="mt-2">
              <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 opacity-40">{t.footer.newsletterTitle}</div>
              <form className="flex gap-2">
                <input type="email" placeholder={t.footer.newsletterPlaceholder} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs flex-grow outline-none focus:border-[var(--color-primary)] transition-colors" />
                <button type="submit" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </form>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">{t.footer.sections.company}</h3>
          {companyLinks.map((link) => (
            <Link key={`${link.href}:${link.label}`} className="text-sm hover:text-teal-400 transition-colors" href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">{t.footer.sections.tools}</h3>
          {toolLinks.map((link) => (
            <Link key={`${link.href}:${link.label}`} className="text-sm hover:text-teal-400 transition-colors" href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">{t.footer.sections.support}</h3>
          {supportLinks.map((link) => (
            <Link
              key={`${link.href}:${link.label}`}
              className={`text-sm hover:text-teal-400 transition-colors ${link.href === '/admin' ? 'font-bold text-white/20' : ''}`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{supportStatusLabel}</span>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-8 mt-16 pt-8 border-t border-slate-900 flex justify-between items-center text-xs opacity-50">
        <p>© {new Date().getFullYear()} {settings?.companyName || 'PaletBroker Sp. z o.o.'} {t.footer.allRightsReserved}</p>
        <p>{footerTagline}</p>
      </div>
    </footer>
  );
}
