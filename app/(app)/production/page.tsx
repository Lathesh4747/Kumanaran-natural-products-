import { db } from "@/db";
import { beforeSupply, products, costPrices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProductionClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Production" };

export default async function ProductionPage() {
  const [allBatches, allProducts, allCostPrices] = await Promise.all([
    db
      .select({
        id: beforeSupply.id,
        productId: beforeSupply.productId,
        costPriceId: beforeSupply.costPriceId,
        batchNumber: beforeSupply.batchNumber,
        productionDate: beforeSupply.productionDate,
        bestBeforeDate: beforeSupply.bestBeforeDate,
        weightUnit: beforeSupply.weightUnit,
        quantityProduced: beforeSupply.quantityProduced,
        quantityRemaining: beforeSupply.quantityRemaining,
        mrp: beforeSupply.mrp,
        productName: products.name,
        productCostPrice: costPrices.productCostPrice,
      })
      .from(beforeSupply)
      .leftJoin(products, eq(beforeSupply.productId, products.id))
      .leftJoin(costPrices, eq(beforeSupply.costPriceId, costPrices.id))
      .orderBy(beforeSupply.productionDate),
    db.select().from(products).where(eq(products.isActive, true)).orderBy(products.name),
    db
      .select({ id: costPrices.id, productId: costPrices.productId, productCostPrice: costPrices.productCostPrice, effectiveDate: costPrices.effectiveDate })
      .from(costPrices)
      .orderBy(costPrices.effectiveDate),
  ]).catch(() => [[], [], []]);

  return <ProductionClient batches={allBatches} products={allProducts} costPrices={allCostPrices} />;
}
