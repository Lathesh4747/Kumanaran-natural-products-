import { db } from "@/db";
import { payments, supermarkets, supplies } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { PaymentsClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payments" };

export default async function PaymentsPage() {
  const [allPayments, allSupermarkets, allSupplies] = await Promise.all([
    db
      .select({
        id: payments.id,
        supermarketId: payments.supermarketId,
        supplyId: payments.supplyId,
        amount: payments.amount,
        paymentDate: payments.paymentDate,
        status: payments.status,
        method: payments.method,
        remarks: payments.remarks,
        supermarketName: supermarkets.name,
        branchName: supermarkets.branchName,
        supplyDate: supplies.supplyDate,
      })
      .from(payments)
      .leftJoin(supermarkets, eq(payments.supermarketId, supermarkets.id))
      .leftJoin(supplies, eq(payments.supplyId, supplies.id))
      .orderBy(desc(payments.paymentDate)),
    db.select({ id: supermarkets.id, name: supermarkets.name, branchName: supermarkets.branchName }).from(supermarkets).where(eq(supermarkets.status, "active")).orderBy(supermarkets.name),
    db.select({ id: supplies.id, supplyDate: supplies.supplyDate, totalAmount: supplies.totalAmount }).from(supplies).orderBy(desc(supplies.supplyDate)).limit(100),
  ]).catch(() => [[], [], []]);

  return <PaymentsClient payments={allPayments} supermarkets={allSupermarkets} supplyRecords={allSupplies} />;
}
