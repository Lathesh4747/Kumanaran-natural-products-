import type { Locale } from "@/types/locale";

export type LocalizedText = Record<Locale, string>;

export interface SiteContact {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
}

export interface SiteAddress {
  street: string | null;
  locality: string | null;
  region: string | null;
  country: "LK";
}

export interface SiteConfig {
  name: string;
  legalName: string;
  domain: string;
  url: string;
  market: "LK";
  description: string;
  registrationNumber: string | null;
  contact: SiteContact;
  address: SiteAddress;
  supportedLocales: readonly Locale[];
}
