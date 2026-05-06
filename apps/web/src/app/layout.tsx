import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LanguageProvider } from "@/lib/i18n/i18n-context";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${outfit.variable} ${plusJakarta.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
