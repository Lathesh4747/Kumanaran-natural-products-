import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/site/hero-section";
import { ProductsSection } from "@/components/site/products-section";
import { BlogPreviewSection } from "@/components/site/blog-preview-section";
import { LocationSection } from "@/components/site/location-section";
import { ContactSection } from "@/components/site/contact-section";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";
import { WHATSAPP_NUMBER } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const logoUrl = `${siteConfig.url}/Kumaran%20natural%20product%20logo.png`;

// LocalBusiness models the physical farm/supplier for local + answer engines;
// it carries the geo, service area, and opening hours Organization can't.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}/#business`,
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  description: siteConfig.description,
  logo: logoUrl,
  image: logoUrl,
  priceRange: "$$",
  telephone: `+${WHATSAPP_NUMBER}`,
  currenciesAccepted: "LKR",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kalmunai",
    addressRegion: "Eastern Province",
    addressCountry: "LK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 7.4095,
    longitude: 81.8344,
  },
  areaServed: { "@type": "Country", name: "Sri Lanka" },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: `+${WHATSAPP_NUMBER}`,
    availableLanguage: ["en", "si", "ta"],
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
      <SiteHeader />
      <main>
        <HeroSection />
        <ProductsSection />
        <BlogPreviewSection />
        <LocationSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
