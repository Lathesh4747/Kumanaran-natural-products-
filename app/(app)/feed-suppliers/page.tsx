import { db } from "@/db";
import { feedSuppliers, feedPurchases } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FeedSuppliersClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Feed Suppliers" };

export default async function FeedSuppliersPage() {
  const [allSuppliers, allPurchases] = await Promise.all([
    db.select().from(feedSuppliers).orderBy(feedSuppliers.name),
    db
      .select({
        id: feedPurchases.id,
        feedSupplierId: feedPurchases.feedSupplierId,
        purchaseDate: feedPurchases.purchaseDate,
        feedType: feedPurchases.feedType,
        quantity: feedPurchases.quantity,
        unit: feedPurchases.unit,
        cost: feedPurchases.cost,
        remarks: feedPurchases.remarks,
        supplierName: feedSuppliers.name,
      })
      .from(feedPurchases)
      .leftJoin(feedSuppliers, eq(feedPurchases.feedSupplierId, feedSuppliers.id))
      .orderBy(feedPurchases.purchaseDate),
  ]).catch(() => [[], []]);

  return <FeedSuppliersClient suppliers={allSuppliers} purchases={allPurchases} />;
}
