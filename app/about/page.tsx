import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AboutPageContent } from "@/components/site/about-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, webPageNode, organizationNode, breadcrumbNode, pageMeta } from "@/lib/seo";

const DESCRIPTION =
  "Learn about Kumaran Natural Products — a quail farm in Kalmunai, Eastern Province, Sri Lanka, producing fresh quail eggs and quail meat for Cargills Food City, Keells, and private supermarkets across the island.";

export const metadata: Metadata = pageMeta({
  title: "About Us — Our Quail Farm in Kalmunai",
  description: DESCRIPTION,
  path: "/about",
  keywords: [
    "about Kumaran Natural Products",
    "quail farm Kalmunai",
    "Sri Lanka quail farm story",
    "quail egg producer Eastern Province",
  ],
});

const aboutGraph = graph([
  webPageNode({
    path: "/about",
    name: "About Kumaran Natural Products",
    description: DESCRIPTION,
    type: "AboutPage",
  }),
  organizationNode(),
  breadcrumbNode([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]),
]);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutGraph} />
      <SiteHeader />
      <AboutPageContent />
      <SiteFooter />
    </>
  );
}
