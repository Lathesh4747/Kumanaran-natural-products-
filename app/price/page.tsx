import type { Metadata } from "next";
import { RouteShell } from "@/components/route-shell";

export const metadata: Metadata = {
  title: "Price | Kumaran Natural Products",
  description:
    "Current Kumaran Natural Products prices for quail eggs and quail meat in Sri Lanka.",
};

export default function PricePage() {
  return (
    <RouteShell
      description="Current product prices, packet sizes, bulk order notes, and WhatsApp ordering details will be added here once confirmed."
      eyebrow="Price"
      title="Product prices"
    />
  );
}
