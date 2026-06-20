import { db } from "@/db";
import { returns, supplies, supplyDetails, products, supermarkets } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ReturnsClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns" };

export default async function ReturnsPage() {
  const [allReturns, supplyRows, lineRows] = await Promise.all([
    db
      .select({
        id: returns.id,
        returnDate: returns.returnDate,
        returnQuantity: returns.returnQuantity,
        returnReason: returns.returnReason,
        weightUnit: returns.weightUnit,
        status: returns.status,
        productName: products.name,
        supermarketName: supermarkets.name,
        branchName: supermarkets.branchName,
        supplyDate: supplies.supplyDate,
      })
      .from(returns)
      .leftJoin(supplies, eq(returns.supplyId, supplies.id))
      .leftJoin(products, eq(returns.productId, products.id))
      .leftJoin(supermarkets, eq(supplies.supermarketId, supermarkets.id))
      .orderBy(desc(returns.returnDate)),
    db
      .select({
        id: supplies.id,
        supplyDate: supplies.supplyDate,
        supermarketName: supermarkets.name,
        branchName: supermarkets.branchName,
      })
      .from(supplies)
      .leftJoin(supermarkets, eq(supplies.supermarketId, supermarkets.id))
      .orderBy(desc(supplies.supplyDate)),
    db
      .select({
        supplyId: supplyDetails.supplyId,
        productId: supplyDetails.productId,
        quantitySupplied: supplyDetails.quantitySupplied,
        productName: products.name,
        weightUnit: products.weightUnit,
      })
      .from(supplyDetails)
      .leftJoin(products, eq(supplyDetails.productId, products.id)),
  ]).catch(() => [[], [], []]);

  // Group supply line items by supply for the cascade product picker
  const linesBySupply: Record<number, { productId: number; productName: string | null; weightUnit: string; quantitySupplied: number }[]> = {};
  for (const l of lineRows) {
    (linesBySupply[l.supplyId] ??= []).push({
      productId: l.productId,
      productName: l.productName,
      weightUnit: l.weightUnit ?? "500g",
      quantitySupplied: l.quantitySupplied,
    });
  }
  const supplyOptions = supplyRows.filter((s) => linesBySupply[s.id]?.length);

  return <ReturnsClient returns={allReturns} supplies={supplyOptions} linesBySupply={linesBySupply} />;
}
