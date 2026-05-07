import * as React from "react";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LanguageProvider } from "@/lib/i18n/i18n-context";
import { parseAcceptLanguage } from "@/lib/i18n/geolocation";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "PaletyBroker - Tanie przesyłki paletowe B2B",
    template: "%s | PaletyBroker"
  },
  description: "Porównaj oferty DHL, DPD, FedEx i wybierz najlepszą cenę na transport palety. Profesjonalne rozwiązania logistyczne dla firm.",
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://paletbroker.pl',
    siteName: 'PaletBroker',
    title: 'PaletyBroker - Logistyka B2B',
    description: 'Najtańszy transport paletowy w Polsce i Europie.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }]
  },
  manifest: '/manifest.json',
  twitter: {
    card: 'summary_large_image',
    title: 'PaletyBroker - Tanie palety',
    description: 'Porównaj ceny kurierów w jednym miejscu.',
    images: ['/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#123456',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  const resolvedLocale = parseAcceptLanguage(acceptLanguage);

  return (
    <html lang={resolvedLocale} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <script
          id="theme-flash"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${outfit.variable} ${plusJakarta.variable} antialiased min-h-screen flex flex-col`}>
        <React.Suspense fallback={<div className="min-h-screen bg-[#f7fafa]"></div>}>
          <ThemeProvider>
            <LanguageProvider resolvedLocale={resolvedLocale}>
              <AppShell>{children}</AppShell>
            </LanguageProvider>
          </ThemeProvider>
        </React.Suspense>
      </body>
    </html>
  );
}
