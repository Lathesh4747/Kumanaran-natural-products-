import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroSection } from "@/components/site/hero-section";
import { ProductsSection } from "@/components/site/products-section";
import { BlogPreviewSection } from "@/components/site/blog-preview-section";
import { LocationSection } from "@/components/site/location-section";
import { ContactSection } from "@/components/site/contact-section";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, localBusinessNode, webPageNode, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Fresh Quail Eggs & Quail Meat in Sri Lanka",
  description:
    "Kumaran Natural Products — farm-fresh quail eggs and quail meat from Kalmunai, Sri Lanka, supplied to Cargills Food City, Keells, and private supermarkets. Order on WhatsApp.",
  path: "/",
});

// Home emits a connected graph: the physical business (geo / service area)
// linked to the global WebSite + Organization entities defined in the layout.
const homeGraph = graph([
  localBusinessNode(),
  webPageNode({
    path: "/",
    name: "Kumaran Natural Products — Fresh Quail Eggs & Quail Meat",
    description:
      "Farm-fresh quail eggs and quail meat from Kalmunai, Sri Lanka, available at Cargills Food City, Keells, and private supermarkets.",
  }),
]);

export default function Home() {
  return (
    <>
      <JsonLd data={homeGraph} />
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
