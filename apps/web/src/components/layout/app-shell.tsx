'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { CookieConsent } from '@/components/layout/cookie-consent';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { SiteBanner } from '@/components/layout/site-banner';
import { Toaster } from '@/components/ui/toaster';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isAuth =
    pathname?.startsWith('/logowanie') ||
    pathname?.startsWith('/rejestracja') ||
    pathname?.startsWith('/reset-hasla');

  React.useEffect(() => {
    if (isAdmin || isAuth) return;

    const updateScrollProgress = () => {
      const root = document.documentElement;
      const body = document.body;
      const scrollTop = root.scrollTop || body.scrollTop;
      const scrollHeight = root.scrollHeight || body.scrollHeight;
      const maxScrollable = scrollHeight - root.clientHeight;
      const percent = maxScrollable > 0 ? scrollTop / maxScrollable : 0;
      const progressEl = document.getElementById('scroll-progress');
      if (progressEl) {
        progressEl.style.transform = `scaleX(${Math.max(0, Math.min(1, percent))})`;
      }
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [isAdmin, isAuth]);

  if (isAdmin || isAuth) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <>
      <SiteBanner />
      <Navbar />
      <div
        className="fixed top-0 left-0 w-full h-1 bg-[var(--color-primary)] origin-left scale-x-0 z-[100] transition-transform duration-100"
        id="scroll-progress"
      ></div>
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <Toaster />
      <CookieConsent />
    </>
  );
}
