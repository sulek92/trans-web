'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../ui/theme-toggle';
import { useTranslation } from '@/lib/i18n/i18n-context';
import { useGlobalSettings } from '@/components/providers/global-data-provider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Locale = 'pl' | 'en' | 'de' | 'fr' | 'it' | 'nl' | 'es';

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export const Navbar = React.memo(function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const langRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();
  const settings = useGlobalSettings();

  React.useEffect(() => {
    setMounted(true);
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
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

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  return (
      <header className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-4 px-6",
        (mounted && isScrolled) ? "pt-2" : "pt-4"
      )}>
      <nav className={cn(
        "max-w-[1280px] mx-auto transition-all duration-500 rounded-[24px] border px-6 flex items-center justify-between",
        (mounted && isScrolled) 
          ? "glass shadow-[var(--glass-shadow)] border-[var(--glass-border)] h-16" 
          : "bg-transparent border-transparent h-20"
      )}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20 group-hover:scale-110 transition-premium">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
          </div>
          <span className="text-xl font-display font-bold text-[var(--color-on-background)] tracking-tight">
            {brandName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 bg-[var(--color-surface-container)]/30 backdrop-blur-sm p-1.5 rounded-2xl border border-[var(--color-divider)]/30">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={cn(
                  "px-5 py-2 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-premium relative overflow-hidden group/link",
                  isActive 
                    ? "text-[var(--color-primary)] bg-[var(--color-surface-primary)] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] dark:shadow-none" 
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-primary)]/50"
                )}
              >
                <span className="relative z-10">{link.label}</span>
                {!isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-primary)] scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 mr-2">
            <Link href="/logowanie" className="px-4 py-2 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-premium">
              {t.common.login}
            </Link>
            <Link href="/rejestracja" className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[var(--color-primary)]/20 hover:scale-105 hover:bg-[var(--color-primary-hover)] active:scale-95 transition-premium relative overflow-hidden group/reg">
              <span className="relative z-10">{t.common.register}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/reg:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
          
          {/* Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-premium border",
                langOpen
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md"
                  : "bg-[var(--color-surface-container)] text-[var(--color-text-muted)] border-[var(--color-divider)] hover:border-[var(--color-text-faint)]"
              )}
            >
              <span className="text-base leading-none translate-y-[1px]">{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
              <span className={cn("material-symbols-outlined text-xs transition-transform", langOpen && "rotate-180")}>expand_more</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-44 glass rounded-2xl shadow-2xl py-1 overflow-hidden z-50 border-[var(--glass-border)]"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left",
                        locale === lang.code
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-container)]"
                      )}
                    >
                      <span className="text-base w-7 text-center">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center text-[var(--color-on-background)] hover:bg-[var(--color-surface-container)] rounded-xl transition-premium border border-[var(--color-divider)]/30"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-[var(--color-background)]/98 backdrop-blur-2xl z-[150] lg:hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-8">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-2xl">pallet</span>
                </div>
                <span className="text-xl font-bold text-[var(--color-on-background)] tracking-tight">{brandName}</span>
              </Link>
              <button 
                className="w-12 h-12 flex items-center justify-center bg-[var(--color-surface-container)] rounded-2xl text-[var(--color-on-background)] border border-[var(--color-divider)]/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-3xl transition-premium group border border-transparent",
                      pathname === link.href 
                        ? "bg-[var(--color-primary-highlight)] text-[var(--color-primary)] border-[var(--color-primary)]/20 shadow-sm" 
                        : "hover:bg-[var(--color-surface-container)] hover:border-[var(--color-divider)]"
                    )}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-premium",
                        pathname === link.href 
                          ? "bg-[var(--color-surface-primary)] text-[var(--color-primary)] shadow-sm" 
                          : "bg-[var(--color-surface-container)] text-[var(--color-text-muted)] group-hover:scale-110"
                      )}>
                        <span className="material-symbols-outlined text-2xl">{link.icon}</span>
                      </div>
                      <span className="text-xl font-bold">{link.label}</span>
                    </div>
                    <span className="material-symbols-outlined opacity-30 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">chevron_right</span>
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Language Switcher */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLocale(lang.code); setIsMobileMenuOpen(false); }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-premium border",
                      locale === lang.code
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20"
                        : "bg-[var(--color-surface-container)] text-[var(--color-text-muted)] border-[var(--color-divider)]/30 hover:border-[var(--color-divider)]"
                    )}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-[var(--color-divider)]/30 flex flex-col gap-4 bg-[var(--color-surface-container)]/20">
              <Link href="/logowanie" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 rounded-2xl text-center font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-container)] transition-premium border border-transparent hover:border-[var(--color-divider)]">
                  {t.common.login}
              </Link>
              <Link href="/rejestracja" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-5 rounded-2xl text-center font-bold bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/30 active:scale-95 transition-premium">
                  {t.common.register}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});
