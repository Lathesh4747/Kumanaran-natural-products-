import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductsGrid } from "@/components/site/products-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublicProducts } from "@/db/queries/products";
import { siteConfig } from "@/lib/config";
import { CURRENCY } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Products | ${siteConfig.name}`,
  description:
    "Farm-fresh quail eggs and quail meat packed in 500g and 1000g packets, available at Cargills, Keells, and supermarkets across Sri Lanka. Buy via WhatsApp.",
  openGraph: {
    title: `Products | ${siteConfig.name}`,
    description:
      "Farm-fresh quail eggs and quail meat packed in 500g and 1000g packets, available at supermarkets across Sri Lanka.",
    url: `${siteConfig.url}/products`,
    siteName: siteConfig.name,
  },
};

export default async function ProductsPage() {
  const activeProducts = (await getPublicProducts()).filter((p) => p.isActive);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Products | ${siteConfig.name}`,
    itemListElement: activeProducts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name.en,
        description: p.description.en || undefined,
        category: p.type,
        brand: { "@type": "Brand", name: siteConfig.name },
        offers: {
          "@type": "Offer",
          price: p.mrp,
          priceCurrency: CURRENCY,
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <SiteHeader />
      <main>
        {/* Page hero */}
        <section className="relative overflow-hidden">
          {/* Subtle top gradient accent */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 400px at 50% -80px, rgba(46,125,70,0.12) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-12 pt-16 sm:px-10 sm:pt-20 lg:px-16">
            {/* Eyebrow */}
            <p
              className="text-center text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent)" }}
            >
              Farm Fresh &middot; Sri Lanka
            </p>

            {/* Heading */}
            <h1
              className="mx-auto mt-3 max-w-2xl text-center font-bold leading-tight"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                color: "var(--color-text-primary)",
              }}
            >
              Our Products
            </h1>

            {/* Sub-heading in all 3 languages */}
            <p
              className="mx-auto mt-4 max-w-xl text-center text-sm leading-7"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Premium quail eggs and meat, raised and packed fresh at our farm
              in Kalmunai — available at Cargills, Keells, and private
              supermarkets across Sri Lanka.
            </p>
            <p
              className="mx-auto mt-1.5 max-w-xl text-center text-xs leading-6"
              style={{ color: "var(--color-text-muted)" }}
            >
              නැවුම් කුවේල් බිත්තර සහ මස් — ශ්‍රී ලංකාවේ සුපිරි වෙළෙඳ
              සැල්වල දිනපතාම &nbsp;&middot;&nbsp; புதிய காடை முட்டைகள் மற்றும்
              இறைச்சி — இலங்கை முழுவதும் கிடைக்கிறது
            </p>

            {/* Stats strip */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {[
                { value: "100%", label: "Farm Fresh" },
                { value: "500g & 1kg", label: "Packet Sizes" },
                { value: "Islandwide", label: "Delivery" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card flex items-center gap-3 px-5 py-3"
                  style={{ borderRadius: 12 }}
                >
                  <span
                    className="text-base font-semibold"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products section */}
        <section className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-4 sm:px-10 lg:px-16">
          <ProductsGrid products={activeProducts} />
        </section>

        {/* WhatsApp CTA banner */}
        <section
          className="mx-auto w-full max-w-[1440px] px-6 pb-24 sm:px-10 lg:px-16"
        >
          <div
            className="glass-card-tint flex flex-col items-center gap-6 px-6 py-12 text-center sm:flex-row sm:justify-between sm:text-left"
          >
            <div>
              <h2
                className="text-lg font-semibold leading-7"
                style={{ color: "var(--color-text-primary)" }}
              >
                Want to place a bulk order?
              </h2>
              <p
                className="mt-1 text-sm leading-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Reach us on WhatsApp for supermarket supply, wholesale pricing,
                or any product inquiry.
              </p>
            </div>
            <a
              className="inline-flex shrink-0 items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94705920748"}`}
              rel="noopener noreferrer"
              style={{
                background: "var(--color-success)",
                color: "#ffffff",
              }}
              target="_blank"
            >
              <svg
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="18"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
