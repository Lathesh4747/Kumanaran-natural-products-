import { locales } from "@/types/locale";
import type { SiteConfig } from "@/types/site";

// Resolve the public base URL per environment so every canonical, OG tag,
// sitemap entry, and JSON-LD URL points at the host the site is actually served
// from. Set NEXT_PUBLIC_SITE_URL on Vercel; falls back to the production domain.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kumarannaturalproducts.com"
).replace(/\/$/, "");

export const siteConfig: SiteConfig = {
  name: "Kumaran Natural Products",
  legalName: "Kumaran Natural Products",
  domain: new URL(SITE_URL).host,
  url: SITE_URL,
  market: "LK",
  description:
    "Sri Lankan premium food brand for farm-fresh quail eggs and quail meat.",
  registrationNumber: null,
  contact: {
    phone: null,
    whatsapp: null,
    email: null,
  },
  address: {
    street: null,
    locality: null,
    region: null,
    country: "LK",
  },
  supportedLocales: locales,
};
