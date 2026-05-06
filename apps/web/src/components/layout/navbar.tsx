'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../ui/theme-toggle';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { useGlobalSettings } from '@/components/providers/global-data-provider';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();
  const settings = useGlobalSettings();

  const defaultNavLinks = React.useMemo(
    () => [
      { href: '/wycena', label: t.hero.cta },
      { href: '/cennik', label: t.nav.pricing },
      { href: '/sledzenie', label: t.nav.tracking },
      { href: '/o-nas', label: t.nav.about },
      { href: '/kontakt', label: t.nav.contact },
    ],
    [t],
  );

  const navLinks = React.useMemo(() => {
    if (!settings?.navLinks || settings.navLinks.length === 0) return defaultNavLinks;
    const normalized = settings.navLinks
      .map((link) => {
        const rawHref = (link.href || '').trim();
        const rawLabel = (link.label || '').trim();
        if (!rawHref || !rawLabel) return null;
        const href = rawHref.startsWith('/') ? rawHref : `/${rawHref}`;
        return { href, label: rawLabel };
      })
      .filter((link): link is { href: string; label: string } => link !== null);
    return normalized.length > 0 ? normalized : defaultNavLinks;
  }, [defaultNavLinks, settings?.navLinks]);

  const brandName = settings?.brandName?.trim() || 'PaletBroker';

  return (
    <nav className="fixed top-0 w-full h-16 z-50 border-b border-[var(--color-divider)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm transition-premium">
      <div className="flex justify-between items-center h-16 max-w-[1280px] mx-auto px-8">
        <Link href="/" className="text-xl font-bold text-[var(--color-on-background)] flex items-center gap-2 hover:opacity-80 transition-premium">
          <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
          {brandName}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 h-full">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={`font-display-bold text-[13px] font-bold uppercase tracking-widest transition-premium h-full flex items-center border-b-2 ${
                pathname === link.href 
                  ? 'text-[var(--color-primary)] border-[var(--color-primary)]' 
                  : 'text-[var(--color-on-background)] border-transparent hover:text-[var(--color-primary)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/logowanie" className="font-body-medium text-sm text-[var(--color-primary)] hover:text-[var(--color-surface-tint)] transition-premium font-bold">
              {t.common.login}
            </Link>
            <Link href="/rejestracja" className="bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-medium text-sm px-5 py-2.5 rounded shadow-sm hover:bg-[var(--color-surface-tint)] transition-premium font-bold active:scale-95">
              {t.common.register}
            </Link>
          </div>
          
          <div className="flex items-center gap-1 mr-2 bg-[var(--color-surface-container-low)] rounded-full p-1 border border-[var(--color-divider)]">
            <button 
              onClick={() => setLocale('pl')}
              className={`text-[10px] font-bold px-2 py-1 rounded-full transition-premium ${locale === 'pl' ? 'bg-[var(--color-primary)] text-white' : 'text-slate-500 hover:text-[var(--color-primary)]'}`}
            >
              PL
            </button>
            <button 
              onClick={() => setLocale('en')}
              className={`text-[10px] font-bold px-2 py-1 rounded-full transition-premium ${locale === 'en' ? 'bg-[var(--color-primary)] text-white' : 'text-slate-500 hover:text-[var(--color-primary)]'}`}
            >
              EN
            </button>
          </div>
          
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[var(--color-on-background)] hover:bg-[var(--color-surface-container-low)] rounded-lg transition-premium"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div className="md:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-[var(--color-divider)] shadow-2xl p-8 flex flex-col gap-6 animate-slide-down z-50">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                className={`flex items-center gap-4 text-lg font-bold transition-premium py-2 ${
                  pathname === link.href ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-background)]'
                }`} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pathname === link.href ? 'bg-[var(--color-primary-highlight)] text-[var(--color-primary)]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  <span className="material-symbols-outlined text-xl">{
                    link.href === '/wycena' ? 'calculate' : 
                    link.href === '/cennik' ? 'payments' :
                    link.href === '/sledzenie' ? 'location_searching' :
                    link.href === '/o-nas' ? 'info' :
                    link.href === '/blog' ? 'article' : 'mail'
                  }</span>
                </div>
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-[var(--color-divider)] my-2"></div>
            <div className="flex flex-col gap-4">
              <Link className="text-center py-4 font-bold text-[var(--color-primary)]" href="/logowanie" onClick={() => setIsMobileMenuOpen(false)}>{t.common.login}</Link>
              <Link className="bg-[var(--color-primary)] text-white py-4 rounded-2xl text-center font-bold shadow-xl active:scale-95 transition-premium" href="/rejestracja" onClick={() => setIsMobileMenuOpen(false)}>{t.common.register}</Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
