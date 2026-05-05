'use client';

import { usePathname } from 'next/navigation';
import { CookieConsent } from '@/components/layout/cookie-consent';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { SiteBanner } from '@/components/layout/site-banner';
import { Toaster } from '@/components/ui/toaster';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isAuth = pathname?.startsWith('/logowanie') || pathname?.startsWith('/rejestracja');

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
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.addEventListener('scroll', () => {
            const h = document.documentElement,
                  b = document.body,
                  st = 'scrollTop',
                  sh = 'scrollHeight';
            const percent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
            document.getElementById('scroll-progress').style.transform = 'scaleX(' + percent/100 + ')';
          });
        `,
        }}
      />
      <Footer />
      <Toaster />
      <CookieConsent />
    </>
  );
}
