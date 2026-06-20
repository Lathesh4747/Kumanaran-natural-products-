import { db } from "@/db";
import { supermarketTypes, supermarkets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SupermarketsClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Supermarkets" };

export default async function SupermarketsPage() {
  const [allTypes, allSupermarkets] = await Promise.all([
    db.select().from(supermarketTypes).orderBy(supermarketTypes.name),
    db
      .select({
        id: supermarkets.id,
        name: supermarkets.name,
        branchName: supermarkets.branchName,
        contactPerson: supermarkets.contactPerson,
        phone: supermarkets.phone,
        email: supermarkets.email,
        address: supermarkets.address,
        district: supermarkets.district,
        province: supermarkets.province,
        status: supermarkets.status,
        lastSupplyDate: supermarkets.lastSupplyDate,
        supermarketTypeId: supermarkets.supermarketTypeId,
        typeName: supermarketTypes.name,
      })
      .from(supermarkets)
      .leftJoin(supermarketTypes, eq(supermarkets.supermarketTypeId, supermarketTypes.id))
      .orderBy(supermarkets.name, supermarkets.branchName),
  ]).catch(() => [[], []]);

  return <SupermarketsClient types={allTypes} supermarkets={allSupermarkets} />;
}
