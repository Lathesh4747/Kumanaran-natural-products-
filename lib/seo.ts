import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { WHATSAPP_NUMBER } from "@/lib/utils";
import type { JsonLdData } from "@/components/seo/json-ld";

// ── Single source of truth for SEO / SEM / AEO / GEO across every page ──────────
// All page metadata and schema.org structured data is built from the helpers here
// so titles, canonicals, Open Graph, Twitter cards, and JSON-LD stay consistent
// and answer / generative engines (Google SGE, ChatGPT, Perplexity, Gemini) can
// extract clean Organization / LocalBusiness / Product / Article / FAQ facts.

const BASE = siteConfig.url;

export const LOGO_URL = `${BASE}/Kumaran%20natural%20product%20logo.png`;
export const OG_IMAGE_URL = `${BASE}/opengraph-image`;

// Verified, honest business facts. The farm is in Kalmunai, Eastern Province, LK.
export const BUSINESS = {
  locality: "Kalmunai",
  region: "Eastern Province",
  country: "LK",
  latitude: 7.4095,
  longitude: 81.8344,
  telephone: `+${WHATSAPP_NUMBER}`,
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  email: null as string | null,
  priceRange: "$$",
  currency: "LKR",
  foundingLocation: "Kalmunai, Sri Lanka",
} as const;

// Trilingual reach (en/si/ta) — declared so social + answer engines know the
// content is served in all three Sri Lankan languages off the same URL.
export const OG_LOCALE = "en_LK";
export const OG_LOCALE_ALTERNATES = ["si_LK", "ta_LK"] as const;
export const SPOKEN_LANGUAGES = ["en", "si", "ta"] as const;

// Topical keyword corpus — the entity vocabulary the brand should rank and be
// cited for. Per-page metadata layers its own focus keywords on top of these.
export const BRAND_KEYWORDS = [
  "quail eggs Sri Lanka",
  "quail meat Sri Lanka",
  "Kumaran Natural Products",
  "buy quail eggs Sri Lanka",
  "fresh quail eggs Cargills",
  "quail meat Keells",
  "quail farm Kalmunai",
  "Eastern Province quail farm",
  "quail eggs price Sri Lanka",
  "quail meat 500g 1000g",
  "protein rich quail eggs",
  "wholesale quail eggs supermarket",
  "farm fresh quail products",
] as const;

const SOCIAL_PROFILES: string[] = [BUSINESS.whatsapp];

// ── Reusable schema.org node builders ──────────────────────────────────────────

export function organizationNode(): JsonLdData {
  return {
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: BASE,
    logo: {
      "@type": "ImageObject",
      "@id": `${BASE}/#logo`,
      url: LOGO_URL,
      caption: siteConfig.name,
    },
    image: OG_IMAGE_URL,
    description: siteConfig.description,
    email: BUSINESS.email ?? undefined,
    telephone: BUSINESS.telephone,
    foundingLocation: BUSINESS.foundingLocation,
    areaServed: { "@type": "Country", name: "Sri Lanka" },
    knowsLanguage: [...SPOKEN_LANGUAGES],
    sameAs: SOCIAL_PROFILES,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: BUSINESS.telephone,
      url: BUSINESS.whatsapp,
      areaServed: "LK",
      availableLanguage: [...SPOKEN_LANGUAGES],
    },
  };
}

export function websiteNode(): JsonLdData {
  return {
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: BASE,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${BASE}/#organization` },
    inLanguage: [...SPOKEN_LANGUAGES],
    // Sitelinks search box — lets engines surface an in-SERP search affordance.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessNode(): JsonLdData {
  return {
    "@type": "LocalBusiness",
    "@id": `${BASE}/#business`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: BASE,
    description: siteConfig.description,
    logo: LOGO_URL,
    image: OG_IMAGE_URL,
    priceRange: BUSINESS.priceRange,
    telephone: BUSINESS.telephone,
    currenciesAccepted: BUSINESS.currency,
    paymentAccepted: "Cash, Bank Transfer",
    parentOrganization: { "@id": `${BASE}/#organization` },
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    areaServed: { "@type": "Country", name: "Sri Lanka" },
    knowsLanguage: [...SPOKEN_LANGUAGES],
    sameAs: SOCIAL_PROFILES,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: BUSINESS.telephone,
      url: BUSINESS.whatsapp,
      availableLanguage: [...SPOKEN_LANGUAGES],
    },
  };
}

export function webPageNode(args: {
  path: string;
  name: string;
  description: string;
  type?: string;
  primaryImage?: string;
}): JsonLdData {
  const url = absolute(args.path);
  return {
    "@type": args.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: args.name,
    description: args.description,
    isPartOf: { "@id": `${BASE}/#website` },
    about: { "@id": `${BASE}/#organization` },
    inLanguage: "en-LK",
    primaryImageOfPage: { "@type": "ImageObject", url: args.primaryImage ?? OG_IMAGE_URL },
  };
}

// BreadcrumbList as a bare node (no @context) for embedding inside a @graph.
export function breadcrumbNode(
  items: readonly { name: string; path: string }[]
): JsonLdData {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

// Wraps any set of nodes into one connected @graph document — fewer scripts,
// shared @id references, the structure crawlers and LLMs parse most reliably.
export function graph(nodes: JsonLdData[]): JsonLdData {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function absolute(path: string): string {
  if (path.startsWith("http")) return path;
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

// ── Metadata helper ─────────────────────────────────────────────────────────────
// Produces a fully-formed Next.js Metadata object (canonical + Open Graph +
// Twitter + robots directives) so no page hand-rolls these and they never drift.

export function pageMeta(args: {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  type?: "website" | "article";
  images?: string[];
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = absolute(args.path);
  const images = args.images ?? [OG_IMAGE_URL];
  return {
    title: args.title,
    description: args.description,
    keywords: [...(args.keywords ?? BRAND_KEYWORDS)],
    alternates: { canonical: args.path },
    robots: args.noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: args.type ?? "website",
      siteName: siteConfig.name,
      title: args.title,
      description: args.description,
      url,
      locale: OG_LOCALE,
      alternateLocale: [...OG_LOCALE_ALTERNATES],
      images,
      ...(args.type === "article"
        ? { publishedTime: args.publishedTime, modifiedTime: args.modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: args.title,
      description: args.description,
      images,
    },
  };
}
