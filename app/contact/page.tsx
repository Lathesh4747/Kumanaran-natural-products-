import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactPageContent } from "@/components/site/contact-page-content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Kumaran Natural Products. Chat on WhatsApp, visit us in Kalmunai, or send a message. We respond promptly to all enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <ContactPageContent />
      <SiteFooter />
    </>
  );
}
