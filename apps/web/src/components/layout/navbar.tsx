'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../ui/theme-toggle';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { useGlobalSettings } from '@/components/providers/global-data-provider';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();
  const settings = useGlobalSettings();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultNavLinks = React.useMemo(
    () => [
      { href: '/wycena', label: t.hero.cta, icon: 'calculate' },
      { href: '/cennik', label: t.nav.pricing, icon: 'payments' },
      { href: '/sledzenie', label: t.nav.tracking, icon: 'location_searching' },
      { href: '/o-nas', label: t.nav.about, icon: 'info' },
      { href: '/kontakt', label: t.nav.contact, icon: 'mail' },
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
        
        // Match icons for dynamic links
        const icon = 
          href === '/wycena' ? 'calculate' : 
          href === '/cennik' ? 'payments' :
          href === '/sledzenie' ? 'location_searching' :
          href === '/o-nas' ? 'info' :
          href === '/blog' ? 'article' : 'mail';

        return { href, label: rawLabel, icon };
      })
      .filter((link): link is { href: string; label: string; icon: string } => link !== null);
    return normalized.length > 0 ? normalized : defaultNavLinks;
  }, [defaultNavLinks, settings?.navLinks]);

  const brandName = settings?.brandName?.trim() || 'PaletBroker';

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500 py-4 px-6",
      isScrolled ? "pt-2" : "pt-4"
    )}>
      <nav className={cn(
        "max-w-[1280px] mx-auto transition-all duration-500 rounded-[24px] border border-transparent px-6",
        isScrolled 
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[var(--glass-shadow)] border-[var(--glass-border)] h-16" 
          : "bg-transparent h-20"
      )}>
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20 group-hover:scale-110 transition-premium">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
            </div>
            <span className="text-xl font-display-bold font-bold text-[var(--color-on-background)] tracking-tight">
              {brandName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-[var(--color-surface-container-low)]/50 p-1.5 rounded-2xl border border-[var(--color-divider)]/50">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-5 py-2 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-premium relative",
                    isActive 
                      ? "text-[var(--color-primary)] bg-white dark:bg-slate-800 shadow-sm" 
                      : "text-slate-500 hover:text-[var(--color-primary)] hover:bg-white/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 mr-2">
              <Link href="/logowanie" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[var(--color-primary)] transition-premium">
                {t.common.login}
              </Link>
              <Link href="/rejestracja" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-black/5 hover:scale-105 active:scale-95 transition-premium">
                {t.common.register}
              </Link>
            </div>
            
            <div className="flex items-center bg-[var(--color-surface-container-low)] p-1 rounded-xl border border-[var(--color-divider)]">
              <button 
                onClick={() => setLocale('pl')}
                className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-lg transition-premium",
                  locale === 'pl' ? "bg-[var(--color-primary)] text-white shadow-md" : "text-slate-500 hover:text-[var(--color-primary)]"
                )}
              >
                PL
              </button>
              <button 
                onClick={() => setLocale('en')}
                className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-lg transition-premium",
                  locale === 'en' ? "bg-[var(--color-primary)] text-white shadow-md" : "text-slate-500 hover:text-[var(--color-primary)]"
                )}
              >
                EN
              </button>
            </div>
            
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[var(--color-on-background)] hover:bg-[var(--color-surface-container-low)] rounded-xl transition-premium"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl z-[60] lg:hidden transition-all duration-500 flex flex-col",
        isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      )}>
        <div className="flex justify-between items-center p-8">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
             <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-2xl">pallet</span>
             </div>
             <span className="text-xl font-bold">{brandName}</span>
          </Link>
          <button 
            className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-2">
          {navLinks.map((link, idx) => (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center justify-between p-6 rounded-3xl transition-premium group",
                pathname === link.href ? "bg-[var(--color-primary-highlight)] text-[var(--color-primary)]" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-premium",
                  pathname === link.href ? "bg-white text-[var(--color-primary)]" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:scale-110"
                )}>
                  <span className="material-symbols-outlined text-2xl">{link.icon}</span>
                </div>
                <span className="text-xl font-bold">{link.label}</span>
              </div>
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
            </Link>
          ))}
        </div>

        <div className="p-8 border-t border-[var(--color-divider)] flex flex-col gap-4">
           <Link href="/logowanie" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 rounded-2xl text-center font-bold text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-premium">
              {t.common.login}
           </Link>
           <Link href="/rejestracja" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 rounded-2xl text-center font-bold bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/20 active:scale-95 transition-premium">
              {t.common.register}
           </Link>
        </div>
      </div>
    </header>
  );
}

