import { db } from "@/db";
import {
  supplies,
  supermarkets,
  vehicles,
  products,
  productPrices,
  costPrices,
  beforeSupply,
} from "@/db/schema";
import { eq, desc, gt } from "drizzle-orm";
import { SupplyClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Supply" };

export default async function SupplyPage() {
  const [
    allSupplies,
    allSupermarkets,
    allVehicles,
    activeProducts,
    priceRows,
    costRows,
    batchRows,
  ] = await Promise.all([
    db
      .select({
        id: supplies.id,
        supermarketId: supplies.supermarketId,
        vehicleId: supplies.vehicleId,
        supplyDate: supplies.supplyDate,
        totalAmount: supplies.totalAmount,
        status: supplies.status,
        remarks: supplies.remarks,
        createdAt: supplies.createdAt,
        supermarketName: supermarkets.name,
        branchName: supermarkets.branchName,
        district: supermarkets.district,
        vehicleName: vehicles.name,
      })
      .from(supplies)
      .leftJoin(supermarkets, eq(supplies.supermarketId, supermarkets.id))
      .leftJoin(vehicles, eq(supplies.vehicleId, vehicles.id))
      .orderBy(desc(supplies.supplyDate)),
    db
      .select({
        id: supermarkets.id,
        name: supermarkets.name,
        branchName: supermarkets.branchName,
        supermarketTypeId: supermarkets.supermarketTypeId,
        district: supermarkets.district,
      })
      .from(supermarkets)
      .where(eq(supermarkets.status, "active"))
      .orderBy(supermarkets.name),
    db
      .select({ id: vehicles.id, name: vehicles.name, registrationNumber: vehicles.registrationNumber })
      .from(vehicles)
      .where(eq(vehicles.status, "active"))
      .orderBy(vehicles.name),
    db
      .select({ id: products.id, name: products.name, weightUnit: products.weightUnit })
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(products.name),
    db
      .select({
        productId: productPrices.productId,
        supermarketTypeId: productPrices.supermarketTypeId,
        sellingPrice: productPrices.sellingPrice,
      })
      .from(productPrices)
      .orderBy(desc(productPrices.effectiveDate)),
    db
      .select({ productId: costPrices.productId, productCostPrice: costPrices.productCostPrice })
      .from(costPrices)
      .orderBy(desc(costPrices.effectiveDate)),
    db
      .select({
        id: beforeSupply.id,
        productId: beforeSupply.productId,
        batchNumber: beforeSupply.batchNumber,
        quantityRemaining: beforeSupply.quantityRemaining,
      })
      .from(beforeSupply)
      .where(gt(beforeSupply.quantityRemaining, 0))
      .orderBy(desc(beforeSupply.productionDate)),
  ]).catch(() => [[], [], [], [], [], [], []]);

  // Latest selling price per (product, supermarket type)
  const prices: Record<string, string> = {};
  for (const r of priceRows) {
    const key = `${r.productId}:${r.supermarketTypeId}`;
    if (!(key in prices)) prices[key] = r.sellingPrice;
  }
  // Latest cost price per product
  const costs: Record<number, string> = {};
  for (const r of costRows) if (!(r.productId in costs)) costs[r.productId] = r.productCostPrice;

  return (
    <SupplyClient
      supplies={allSupplies}
      supermarkets={allSupermarkets}
      vehicles={allVehicles}
      products={activeProducts}
      prices={prices}
      costs={costs}
      batches={batchRows}
    />
  );
}
