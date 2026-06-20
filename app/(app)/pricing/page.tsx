import { db } from "@/db";
import { products, supermarketTypes, productPrices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PricingClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing" };

export default async function PricingPage() {
  const [allProducts, allTypes, allPrices] = await Promise.all([
    db.select().from(products).where(eq(products.isActive, true)).orderBy(products.name),
    db.select().from(supermarketTypes).orderBy(supermarketTypes.name),
    db
      .select({
        id: productPrices.id,
        productId: productPrices.productId,
        supermarketTypeId: productPrices.supermarketTypeId,
        sellingPrice: productPrices.sellingPrice,
        effectiveDate: productPrices.effectiveDate,
        productName: products.name,
        typeName: supermarketTypes.name,
      })
      .from(productPrices)
      .leftJoin(products, eq(productPrices.productId, products.id))
      .leftJoin(supermarketTypes, eq(productPrices.supermarketTypeId, supermarketTypes.id))
      .orderBy(products.name, supermarketTypes.name),
  ]).catch(() => [[], [], []]);

  return <PricingClient products={allProducts} types={allTypes} prices={allPrices} />;
}
