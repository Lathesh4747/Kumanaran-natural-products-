import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactPageContent } from "@/components/site/contact-page-content";
import { JsonLd } from "@/components/seo/json-ld";
import { graph, webPageNode, breadcrumbNode, pageMeta, BUSINESS } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

const DESCRIPTION =
  "Get in touch with Kumaran Natural Products. Chat on WhatsApp, visit our quail farm in Kalmunai, or send a message — we respond promptly to every enquiry, in English, Sinhala, and Tamil.";

export const metadata: Metadata = pageMeta({
  title: "Contact Us — WhatsApp, Phone & Location",
  description: DESCRIPTION,
  path: "/contact",
  keywords: [
    "contact Kumaran Natural Products",
    "order quail eggs WhatsApp",
    "quail meat supplier contact Sri Lanka",
    "Kalmunai quail farm contact",
  ],
});

const contactGraph = graph([
  {
    ...webPageNode({
      path: "/contact",
      name: "Contact Kumaran Natural Products",
      description: DESCRIPTION,
      type: "ContactPage",
    }),
    mainEntity: { "@id": `${siteConfig.url}/#business` },
    contactOption: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: BUSINESS.telephone,
      url: BUSINESS.whatsapp,
      availableLanguage: ["en", "si", "ta"],
    },
  },
  breadcrumbNode([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]),
]);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactGraph} />
      <SiteHeader />
      <ContactPageContent />
      <SiteFooter />
    </>
  );
}
