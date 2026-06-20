import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AboutPageContent } from "@/components/site/about-page-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Kumaran Natural Products — a quail farm in Kalmunai, Sri Lanka, producing fresh quail eggs and quail meat for supermarkets across the island.",
  openGraph: {
    title: "About Us | Kumaran Natural Products",
    description:
      "Farm-fresh quail eggs and quail meat from Kalmunai, Eastern Province, Sri Lanka.",
  },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <AboutPageContent />
      <SiteFooter />
    </>
  );
}
