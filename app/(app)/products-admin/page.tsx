import { db } from "@/db";
import { productTypes, products, costPrices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProductsAdminClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsAdminPage() {
  const [allTypes, allProducts, allCostPrices] = await Promise.all([
    db.select().from(productTypes).orderBy(productTypes.name),
    db
      .select({
        id: products.id,
        name: products.name,
        weightUnit: products.weightUnit,
        mrp: products.mrp,
        description: products.description,
        isActive: products.isActive,
        createdAt: products.createdAt,
        productTypeId: products.productTypeId,
        typeName: productTypes.name,
      })
      .from(products)
      .leftJoin(productTypes, eq(products.productTypeId, productTypes.id))
      .orderBy(products.name),
    db
      .select({
        id: costPrices.id,
        productId: costPrices.productId,
        packingCost: costPrices.packingCost,
        productCost: costPrices.productCost,
        butcherCost: costPrices.butcherCost,
        productCostPrice: costPrices.productCostPrice,
        effectiveDate: costPrices.effectiveDate,
        productName: products.name,
      })
      .from(costPrices)
      .leftJoin(products, eq(costPrices.productId, products.id))
      .orderBy(costPrices.effectiveDate),
  ]).catch(() => [[], [], []]);

  return (
    <ProductsAdminClient
      types={allTypes}
      products={allProducts}
      costPrices={allCostPrices}
    />
  );
}
