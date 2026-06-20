import { locales } from "@/types/locale";
import type { SiteConfig } from "@/types/site";

export const siteConfig: SiteConfig = {
  name: "Kumaran Natural Products",
  legalName: "Kumaran Natural Products",
  domain: "kumarannaturalproducts.com",
  url: "https://kumarannaturalproducts.com",
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
