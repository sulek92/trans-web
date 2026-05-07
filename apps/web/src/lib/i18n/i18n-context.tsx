'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { pl } from './dictionaries/pl';

type Locale = 'pl' | 'en' | 'de' | 'fr' | 'it' | 'nl' | 'es';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof pl;
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const supportedLocales: Locale[] = ['pl', 'en', 'de', 'fr', 'it', 'nl', 'es'];

function readCookieLocale(): Locale | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
  const value = match?.[1]?.trim();
  if (value && supportedLocales.includes(value as Locale)) return value as Locale;
  return null;
}

export function LanguageProvider({
  children,
  resolvedLocale,
}: {
  children: React.ReactNode;
  resolvedLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(resolvedLocale || 'pl');
  const [dictionary, setDictionary] = useState<typeof pl>(pl);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadDictionary = useCallback(async (loc: Locale) => {
    setIsLoaded(false);
    try {
      if (loc === 'pl') {
        setDictionary(pl);
      } else {
        const dict = await import(`./dictionaries/${loc}`);
        setDictionary(dict[loc] || dict.default || dict);
      }
    } catch (error) {
      console.error(`Failed to load dictionary for ${loc}:`, error);
      setDictionary(pl);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    const cookieLocale = readCookieLocale();
    
    let initialLocale: Locale = 'pl';
    if (saved && supportedLocales.includes(saved)) {
      initialLocale = saved;
    } else if (cookieLocale) {
      initialLocale = cookieLocale;
    } else if (resolvedLocale && supportedLocales.includes(resolvedLocale)) {
      initialLocale = resolvedLocale;
    }

    setLocaleState(initialLocale);
    loadDictionary(initialLocale);
  }, [resolvedLocale, loadDictionary]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    loadDictionary(newLocale);
  }, [loadDictionary]);

  const value = {
    locale,
    setLocale,
    t: dictionary,
    isLoaded,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
