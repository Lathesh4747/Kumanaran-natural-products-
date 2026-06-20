"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { productPrices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

type ActionResult = { success: boolean; error?: string };

const schema = z.object({
  productId: z.coerce.number().int().positive("Product is required"),
  supermarketTypeId: z.coerce.number().int().positive("Supermarket type is required"),
  sellingPrice: z.coerce.number().positive("Selling price must be positive"),
  effectiveDate: z.string().min(1, "Effective date is required"),
});

export async function upsertProductPrice(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = schema.safeParse({
      productId: formData.get("productId"),
      supermarketTypeId: formData.get("supermarketTypeId"),
      sellingPrice: formData.get("sellingPrice"),
      effectiveDate: formData.get("effectiveDate"),
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    // Check for existing price for this product + supermarket type
    const existing = await db
      .select({ id: productPrices.id })
      .from(productPrices)
      .where(
        and(
          eq(productPrices.productId, parsed.data.productId),
          eq(productPrices.supermarketTypeId, parsed.data.supermarketTypeId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(productPrices)
        .set({
          sellingPrice: String(parsed.data.sellingPrice),
          effectiveDate: parsed.data.effectiveDate,
        })
        .where(eq(productPrices.id, existing[0].id));
    } else {
      await db.insert(productPrices).values({
        productId: parsed.data.productId,
        supermarketTypeId: parsed.data.supermarketTypeId,
        sellingPrice: String(parsed.data.sellingPrice),
        effectiveDate: parsed.data.effectiveDate,
      });
    }

    revalidatePath("/pricing");
    return { success: true };
  } catch (error) {
    console.error("[actions/productPrices] upsertProductPrice", error);
    return { success: false, error: "Failed to save product price" };
  }
}

export async function deleteProductPrice(id: number): Promise<ActionResult> {
  try {
    await db.delete(productPrices).where(eq(productPrices.id, id));
    revalidatePath("/pricing");
    return { success: true };
  } catch (error) {
    console.error("[actions/productPrices] deleteProductPrice", error);
    return { success: false, error: "Failed to delete product price" };
  }
}
