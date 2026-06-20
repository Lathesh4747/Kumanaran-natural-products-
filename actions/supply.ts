"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  supplies,
  supplyDetails,
  supermarkets,
  productPrices,
  costPrices,
  beforeSupply,
} from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getOwnerId } from "@/lib/auth";
import { SUPPLY_STATUSES } from "@/lib/utils";

type ActionResult = { success: boolean; error?: string; id?: number };

const lineSchema = z.object({
  productId: z.coerce.number().int().positive(),
  beforeSupplyId: z.coerce.number().int().positive().nullable().optional(),
  quantitySupplied: z.coerce.number().int().positive("Quantity must be positive"),
});

const supplySchema = z.object({
  supermarketId: z.coerce.number().int().positive("Branch is required"),
  vehicleId: z.coerce.number().int().positive().nullable().optional(),
  supplyDate: z.string().min(1, "Supply date is required"),
  status: z.enum(SUPPLY_STATUSES),
  remarks: z.string().optional(),
  lines: z.array(lineSchema).min(1, "Add at least one product line"),
});

export type SupplyInput = z.input<typeof supplySchema>;

export async function createSupply(input: SupplyInput): Promise<ActionResult> {
  try {
    const userId = await getOwnerId();
    if (!userId) return { success: false, error: "Not authenticated" };

    const parsed = supplySchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    const { supermarketId, vehicleId, supplyDate, status, remarks, lines } = parsed.data;

    const market = await db
      .select({ typeId: supermarkets.supermarketTypeId })
      .from(supermarkets)
      .where(eq(supermarkets.id, supermarketId))
      .limit(1);
    if (!market.length) return { success: false, error: "Branch not found" };
    const typeId = market[0].typeId;

    const productIds = [...new Set(lines.map((l) => l.productId))];

    const priceRows = await db
      .select({
        productId: productPrices.productId,
        sellingPrice: productPrices.sellingPrice,
      })
      .from(productPrices)
      .where(and(eq(productPrices.supermarketTypeId, typeId), inArray(productPrices.productId, productIds)))
      .orderBy(desc(productPrices.effectiveDate));
    const sellingByProduct = new Map<number, string>();
    for (const r of priceRows) if (!sellingByProduct.has(r.productId)) sellingByProduct.set(r.productId, r.sellingPrice);

    const costRows = await db
      .select({
        id: costPrices.id,
        productId: costPrices.productId,
        productCostPrice: costPrices.productCostPrice,
      })
      .from(costPrices)
      .where(inArray(costPrices.productId, productIds))
      .orderBy(desc(costPrices.effectiveDate));
    const latestCostByProduct = new Map<number, { id: number; cost: string }>();
    const costById = new Map<number, string>();
    for (const r of costRows) {
      costById.set(r.id, r.productCostPrice);
      if (!latestCostByProduct.has(r.productId)) latestCostByProduct.set(r.productId, { id: r.id, cost: r.productCostPrice });
    }

    const batchIds = lines
      .map((l) => l.beforeSupplyId)
      .filter((v): v is number => typeof v === "number");
    const batchRows = batchIds.length
      ? await db
          .select({
            id: beforeSupply.id,
            costPriceId: beforeSupply.costPriceId,
            quantityRemaining: beforeSupply.quantityRemaining,
          })
          .from(beforeSupply)
          .where(inArray(beforeSupply.id, batchIds))
      : [];
    const batchById = new Map(batchRows.map((b) => [b.id, b]));

    const details: {
      productId: number;
      costPriceId: number;
      beforeSupplyId: number | null;
      quantitySupplied: number;
      sellingPrice: string;
      profitPrice: string;
    }[] = [];
    const batchConsumption = new Map<number, number>();
    let total = 0;

    for (const line of lines) {
      const selling = sellingByProduct.get(line.productId);
      if (selling == null)
        return { success: false, error: `No price set for a product at this supermarket type — set it in Pricing first` };

      let costPriceId: number;
      let unitCost: string;
      const batchId = line.beforeSupplyId ?? null;
      if (batchId != null) {
        const batch = batchById.get(batchId);
        if (!batch) return { success: false, error: "Selected production batch not found" };
        costPriceId = batch.costPriceId;
        unitCost = costById.get(batch.costPriceId) ?? latestCostByProduct.get(line.productId)?.cost ?? "0";
        const consumed = (batchConsumption.get(batchId) ?? 0) + line.quantitySupplied;
        if (consumed > batch.quantityRemaining)
          return { success: false, error: "Not enough stock remaining in the selected batch" };
        batchConsumption.set(batchId, consumed);
      } else {
        const latest = latestCostByProduct.get(line.productId);
        if (!latest) return { success: false, error: "No cost price set for a product — add one in Products admin first" };
        costPriceId = latest.id;
        unitCost = latest.cost;
      }

      const profit = (parseFloat(selling) - parseFloat(unitCost)).toFixed(2);
      total += parseFloat(selling) * line.quantitySupplied;
      details.push({
        productId: line.productId,
        costPriceId,
        beforeSupplyId: batchId,
        quantitySupplied: line.quantitySupplied,
        sellingPrice: selling,
        profitPrice: profit,
      });
    }

    const inserted = await db
      .insert(supplies)
      .values({
        supermarketId,
        vehicleId: vehicleId ?? null,
        supplyDate,
        totalAmount: total.toFixed(2),
        status,
        remarks: remarks || null,
        userId,
      })
      .returning({ id: supplies.id });
    const supplyId = inserted[0].id;

    await db.insert(supplyDetails).values(details.map((d) => ({ ...d, supplyId })));

    for (const [batchId, qty] of batchConsumption) {
      const batch = batchById.get(batchId);
      if (batch) {
        await db
          .update(beforeSupply)
          .set({ quantityRemaining: batch.quantityRemaining - qty })
          .where(eq(beforeSupply.id, batchId));
      }
    }

    await db.update(supermarkets).set({ lastSupplyDate: supplyDate }).where(eq(supermarkets.id, supermarketId));

    revalidatePath("/supply");
    revalidatePath("/production");
    revalidatePath("/dashboard");
    return { success: true, id: supplyId };
  } catch (error) {
    console.error("[actions/supply] createSupply", error);
    return { success: false, error: "Failed to record supply" };
  }
}

export async function deleteSupply(id: number): Promise<ActionResult> {
  try {
    await db.delete(supplyDetails).where(eq(supplyDetails.supplyId, id));
    await db.delete(supplies).where(eq(supplies.id, id));
    revalidatePath("/supply");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[actions/supply] deleteSupply", error);
    return { success: false, error: "Cannot delete — returns or payments may be linked to this supply" };
  }
}
