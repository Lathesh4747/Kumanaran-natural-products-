export const locales = ["en", "si", "ta"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeRegions: Record<Locale, string> = {
  en: "en-LK",
  si: "si-LK",
  ta: "ta-LK",
};
