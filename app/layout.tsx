import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Sinhala, Noto_Sans_Tamil } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { LocaleProvider } from "@/lib/locale-context";
import { siteConfig } from "@/lib/config";
import { JsonLd } from "@/components/seo/json-ld";
import {
  graph,
  organizationNode,
  websiteNode,
  BRAND_KEYWORDS,
  OG_LOCALE,
  OG_LOCALE_ALTERNATES,
} from "@/lib/seo";
import "./globals.css";

const DESCRIPTION =
  "Farm-fresh quail eggs and quail meat from Kalmunai, Sri Lanka. Available at Cargills Food City, Keells, and private supermarkets.";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sinhala",
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tamil",
});

export const metadata: Metadata = {
  title: {
    default: "Kumaran Natural Products | Fresh Quail Eggs & Quail Meat Sri Lanka",
    template: "%s | Kumaran Natural Products",
  },
  description: DESCRIPTION,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  keywords: [...BRAND_KEYWORDS],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Food & Beverage",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, email: true, address: true },
  robots: {
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
    type: "website",
    siteName: siteConfig.name,
    title: "Kumaran Natural Products | Fresh Quail Eggs & Quail Meat Sri Lanka",
    description: DESCRIPTION,
    url: siteConfig.url,
    locale: OG_LOCALE,
    alternateLocale: [...OG_LOCALE_ALTERNATES],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kumaran Natural Products | Fresh Quail Eggs & Quail Meat Sri Lanka",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#2e7d46",
  colorScheme: "light",
};

// Sitewide identity graph — emitted once on every page so search and answer
// engines always resolve the brand entity and its sitelinks search box.
const siteGraph = graph([organizationNode(), websiteNode()]);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html
        lang="en"
        className={`${inter.variable} ${notoSinhala.variable} ${notoTamil.variable}`}
      >
        <body>
          <JsonLd data={siteGraph} />
          <LocaleProvider>{children}</LocaleProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
