import type { Metadata } from "next";
import { RouteShell } from "@/components/route-shell";
import { pageMeta } from "@/lib/seo";

// Placeholder page with no real content yet — keep it out of the index.
export const metadata: Metadata = pageMeta({
  title: "Product Prices",
  description:
    "Current Kumaran Natural Products prices for quail eggs and quail meat in Sri Lanka.",
  path: "/price",
  noindex: true,
});

export default function PricePage() {
  return (
    <RouteShell
      description="Current product prices, packet sizes, bulk order notes, and WhatsApp ordering details will be added here once confirmed."
      eyebrow="Price"
      title="Product prices"
    />
  );
}
