"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultLocale, locales } from "@/types/locale";
import { getDictionary } from "@/locales";
import type { Locale } from "@/types/locale";
import type { Dictionary } from "@/locales";

const STORAGE_KEY = "knp-locale";

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  t: getDictionary(defaultLocale),
  setLocale: () => undefined,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Read persisted locale once on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (locales as readonly string[]).includes(stored)) {
      setLocaleState(stored as Locale);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    // Update <html lang="..."> so screen readers announce the language change
    document.documentElement.lang =
      next === "si" ? "si" : next === "ta" ? "ta" : "en";
  }, []);

  return (
    <LocaleContext.Provider
      value={{ locale, t: getDictionary(locale), setLocale }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
