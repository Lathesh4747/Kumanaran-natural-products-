"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { beforeSupply } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

type ActionResult = { success: boolean; error?: string };

const batchSchema = z.object({
  productId: z.coerce.number().int().positive("Product is required"),
  costPriceId: z.coerce.number().int().positive("Cost price is required"),
  batchNumber: z.string().min(1, "Batch number is required"),
  productionDate: z.string().min(1, "Production date is required"),
  bestBeforeDate: z.string().min(1, "Best before date is required"),
  weightUnit: z.enum(["500g", "1000g"]),
  quantityProduced: z.coerce.number().int().positive("Quantity must be positive"),
  mrp: z.coerce.number().positive("MRP must be positive"),
});

export async function createBatch(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = batchSchema.safeParse({
      productId: formData.get("productId"),
      costPriceId: formData.get("costPriceId"),
      batchNumber: formData.get("batchNumber"),
      productionDate: formData.get("productionDate"),
      bestBeforeDate: formData.get("bestBeforeDate"),
      weightUnit: formData.get("weightUnit"),
      quantityProduced: formData.get("quantityProduced"),
      mrp: formData.get("mrp"),
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(beforeSupply).values({
      ...parsed.data,
      quantityRemaining: parsed.data.quantityProduced,
      mrp: String(parsed.data.mrp),
    });
    revalidatePath("/production");
    return { success: true };
  } catch (error) {
    console.error("[actions/production] createBatch", error);
    return { success: false, error: "Failed to create production batch" };
  }
}

export async function updateBatch(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const id = Number(formData.get("id"));
    const parsed = batchSchema.safeParse({
      productId: formData.get("productId"),
      costPriceId: formData.get("costPriceId"),
      batchNumber: formData.get("batchNumber"),
      productionDate: formData.get("productionDate"),
      bestBeforeDate: formData.get("bestBeforeDate"),
      weightUnit: formData.get("weightUnit"),
      quantityProduced: formData.get("quantityProduced"),
      mrp: formData.get("mrp"),
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.update(beforeSupply).set({ ...parsed.data, mrp: String(parsed.data.mrp) }).where(eq(beforeSupply.id, id));
    revalidatePath("/production");
    return { success: true };
  } catch (error) {
    console.error("[actions/production] updateBatch", error);
    return { success: false, error: "Failed to update production batch" };
  }
}

export async function deleteBatch(id: number): Promise<ActionResult> {
  try {
    await db.delete(beforeSupply).where(eq(beforeSupply.id, id));
    revalidatePath("/production");
    return { success: true };
  } catch (error) {
    console.error("[actions/production] deleteBatch", error);
    return { success: false, error: "Cannot delete — supply records may be linked" };
  }
}
