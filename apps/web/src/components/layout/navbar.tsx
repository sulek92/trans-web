'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../ui/theme-toggle';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 w-full h-16 z-50 border-b border-[var(--color-divider)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm transition-premium">
      <div className="flex justify-between items-center h-16 max-w-[1280px] mx-auto px-8">
        <Link href="/" className="text-xl font-bold text-[var(--color-on-background)] flex items-center gap-2 hover:opacity-80 transition-premium">
          <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontVariationSettings: "'FILL' 1" }}>pallet</span>
          PaletBroker
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 h-full">
          <Link className="font-display-bold text-[13px] font-bold uppercase tracking-widest text-[var(--color-on-background)] hover:text-[var(--color-primary)] transition-premium" href="/wycena">Wycena</Link>
          <Link className="font-display-bold text-[13px] font-bold uppercase tracking-widest text-[var(--color-on-background)] hover:text-[var(--color-primary)] transition-premium" href="/cennik">Cennik</Link>
          <Link className="font-display-bold text-[13px] font-bold uppercase tracking-widest text-[var(--color-on-background)] hover:text-[var(--color-primary)] transition-premium" href="/sledzenie">Śledzenie</Link>
          <Link className="font-display-bold text-[13px] font-bold uppercase tracking-widest text-[var(--color-on-background)] hover:text-[var(--color-primary)] transition-premium" href="/o-nas">O nas</Link>
          <Link className="font-display-bold text-[13px] font-bold uppercase tracking-widest text-[var(--color-on-background)] hover:text-[var(--color-primary)] transition-premium" href="/blog">Blog</Link>
          <Link className="font-display-bold text-[13px] font-bold uppercase tracking-widest text-[var(--color-on-background)] hover:text-[var(--color-primary)] transition-premium" href="/kontakt">Kontakt</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Link href="/logowanie" className="font-body-medium text-sm text-[var(--color-primary)] hover:text-[var(--color-surface-tint)] transition-premium font-bold">
              Zaloguj się
            </Link>
            <Link href="/rejestracja" className="bg-[var(--color-primary)] text-[var(--color-on-primary)] font-body-medium text-sm px-5 py-2.5 rounded shadow-sm hover:bg-[var(--color-surface-tint)] transition-premium font-bold active:scale-95">
              Zarejestruj się
            </Link>
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
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-[var(--color-divider)] shadow-xl p-8 flex flex-col gap-6 animate-fade-in z-40">
          <Link className="flex items-center gap-3 text-lg font-bold text-[var(--color-on-background)]" href="/wycena" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined text-[var(--color-primary)]">calculate</span>
            Wycena
          </Link>
          <Link className="flex items-center gap-3 text-lg font-bold text-[var(--color-on-background)]" href="/cennik" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined text-[var(--color-primary)]">payments</span>
            Cennik
          </Link>
          <Link className="flex items-center gap-3 text-lg font-bold text-[var(--color-on-background)]" href="/sledzenie" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined text-[var(--color-primary)]">location_searching</span>
            Śledzenie
          </Link>
          <Link className="flex items-center gap-3 text-lg font-bold text-[var(--color-on-background)]" href="/o-nas" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined text-[var(--color-primary)]">info</span>
            O nas
          </Link>
          <Link className="flex items-center gap-3 text-lg font-bold text-[var(--color-on-background)]" href="/blog" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined text-[var(--color-primary)]">article</span>
            Blog
          </Link>
          <Link className="flex items-center gap-3 text-lg font-bold text-[var(--color-on-background)]" href="/kontakt" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined text-[var(--color-primary)]">mail</span>
            Kontakt
          </Link>
          <hr className="border-[var(--color-divider)]" />
          <Link className="text-lg font-bold text-[var(--color-primary)]" href="/logowanie" onClick={() => setIsMobileMenuOpen(false)}>Zaloguj się</Link>
          <Link className="bg-[var(--color-primary)] text-white p-4 rounded-xl text-center font-bold shadow-lg" href="/rejestracja" onClick={() => setIsMobileMenuOpen(false)}>Zarejestruj się</Link>
        </div>
      )}
    </nav>
  );
}
