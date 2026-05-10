'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { SiteBanner } from '@/components/layout/site-banner';
import { Toaster } from '@/components/ui/toaster';

const CookieConsent = dynamic(
  () => import('@/components/layout/cookie-consent').then((mod) => ({ default: mod.CookieConsent })),
  { ssr: false },
);

export const AppShell = React.memo(function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isAuth =
    pathname?.startsWith('/logowanie') ||
    pathname?.startsWith('/rejestracja') ||
    pathname?.startsWith('/reset-hasla');

  React.useEffect(() => {
    if (isAdmin || isAuth) return;

    let ticking = false;
    const updateScrollProgress = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
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
          ticking = false;
        });
        ticking = true;
      }
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [isAdmin, isAuth]);

  const headerRef = React.useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = React.useState(120); // Default safe value
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!headerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeaderHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(headerRef.current);
    setMounted(true);
    return () => resizeObserver.disconnect();
  }, []);

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
      <div ref={headerRef} className="fixed top-0 left-0 w-full z-50 flex flex-col">
        <SiteBanner />
        <Navbar />
      </div>
      <div
        className="fixed top-0 left-0 w-full h-1 bg-[var(--color-primary)] origin-left scale-x-0 z-[100] transition-transform duration-100"
        id="scroll-progress"
      ></div>
      {/* Dynamic spacer to push content down below fixed header - only on client after mount to avoid mismatch */}
      <div 
        style={{ height: mounted ? headerHeight : 120 }} 
        className={cn("shrink-0 transition-all duration-300", !mounted && "h-32")}
        suppressHydrationWarning
      />
      
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
      <Toaster />
      <CookieConsent />
    </>
  );
});
