import type { Metadata } from "next";
import { Inter, Noto_Sans_Sinhala, Noto_Sans_Tamil } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { LocaleProvider } from "@/lib/locale-context";
import { siteConfig } from "@/lib/config";
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
    default: "Kumaran Natural Products",
    template: "%s | Kumaran Natural Products",
  },
  description: DESCRIPTION,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Kumaran Natural Products",
    description: DESCRIPTION,
    url: siteConfig.url,
    locale: "en_LK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kumaran Natural Products",
    description: DESCRIPTION,
  },
};

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
          <LocaleProvider>{children}</LocaleProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
