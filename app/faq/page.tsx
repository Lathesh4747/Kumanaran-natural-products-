import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Kumaran Natural Products — quail eggs, quail meat, ordering on WhatsApp, freshness, storage, and where to buy across Sri Lanka.",
  alternates: { canonical: "/faq" },
};

const faqs: { question: string; answer: string }[] = [
  {
    question: "Where can I buy Kumaran Natural Products?",
    answer:
      "Our quail eggs and quail meat are stocked at Cargills Food City, Keells, and selected private supermarkets across Sri Lanka. You can also order directly from us on WhatsApp for home delivery or bulk supply.",
  },
  {
    question: "How do I place an order?",
    answer:
      "The fastest way is WhatsApp. Tap any \"Buy via WhatsApp\" button on our Products page and the chat opens pre-filled with the product you want. We confirm availability, price, and delivery from there.",
  },
  {
    question: "What pack sizes do you offer?",
    answer:
      "Quail meat is packed in 500g and 1000g vacuum-sealed packets. Quail eggs are sold in family-friendly packs. Each packet is labelled with the production date, best-before date, and batch number.",
  },
  {
    question: "How fresh are the products?",
    answer:
      "We pack to order and supply branches within roughly 24 hours of packing. Every batch is candled and quality-checked before it leaves the farm, and best-before dates are calculated conservatively.",
  },
  {
    question: "How should I store quail eggs and meat?",
    answer:
      "Keep quail eggs refrigerated and use them within the best-before window. Vacuum-sealed quail meat stays fresh for up to five days refrigerated, and significantly longer frozen.",
  },
  {
    question: "Do you supply supermarkets and wholesale buyers?",
    answer:
      "Yes. We supply supermarket branches and wholesale buyers across multiple districts. Message us on WhatsApp to discuss supply volumes, pricing by chain, and a regular delivery schedule.",
  },
  {
    question: "Why quail eggs and quail meat?",
    answer:
      "Quail eggs are exceptionally protein- and nutrient-dense, rich in iron, B-vitamins, and choline. Quail meat is lean, tender, and higher in absorbable iron than chicken — a nutritious, locally produced protein for Sri Lankan kitchens.",
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `FAQ | ${siteConfig.name}`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 400px at 50% -80px, rgba(46,125,70,0.12) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-10 pt-16 sm:px-10 sm:pt-20 lg:px-16">
            <p
              className="text-center text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent)" }}
            >
              Help &amp; Answers
            </p>
            <h1
              className="mx-auto mt-3 max-w-2xl text-center font-bold leading-tight"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                color: "var(--color-text-primary)",
              }}
            >
              Frequently asked questions
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-center text-sm leading-7"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Everything you need to know about ordering, freshness, storage, and
              where to find Kumaran Natural Products.
            </p>
          </div>
        </section>

        {/* FAQ list */}
        <section className="mx-auto w-full max-w-3xl px-6 pb-20 pt-6 sm:px-10">
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="glass-card group p-6"
              >
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold leading-6 marker:hidden"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {faq.question}
                  <span
                    className="shrink-0 text-lg transition-transform group-open:rotate-45"
                    style={{ color: "var(--color-accent)" }}
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p
                  className="mt-3 text-sm leading-7"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="glass-card-tint mt-10 flex flex-col items-center gap-4 px-6 py-10 text-center">
            <h2
              className="text-lg font-semibold leading-7"
              style={{ color: "var(--color-text-primary)" }}
            >
              Still have a question?
            </h2>
            <p
              className="max-w-md text-sm leading-6"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Message us on WhatsApp — we respond promptly to every enquiry.
            </p>
            <a
              className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94705920748"}`}
              rel="noopener noreferrer"
              style={{ background: "var(--color-success)", color: "#ffffff" }}
              target="_blank"
            >
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
