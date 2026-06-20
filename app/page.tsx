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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  description: siteConfig.description,
  logo: `${siteConfig.url}/Kumaran natural product logo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kalmunai",
    addressRegion: "Eastern Province",
    addressCountry: "LK",
  },
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
      <JsonLd data={organizationJsonLd} />
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
