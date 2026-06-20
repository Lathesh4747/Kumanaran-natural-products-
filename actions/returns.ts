"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { returns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getOwnerId } from "@/lib/auth";
import { RETURN_REASONS, WEIGHT_UNITS } from "@/lib/utils";

type ActionResult = { success: boolean; error?: string };

const schema = z.object({
  supplyId: z.coerce.number().int().positive("Supply is required"),
  productId: z.coerce.number().int().positive("Product is required"),
  returnDate: z.string().min(1, "Return date is required"),
  returnQuantity: z.coerce.number().int().positive("Quantity must be positive"),
  returnReason: z.enum(RETURN_REASONS, { message: "Select a valid reason" }),
  weightUnit: z.enum(WEIGHT_UNITS, { message: "Select a weight" }),
  status: z.string().optional(),
});

function read(formData: FormData) {
  return {
    supplyId: formData.get("supplyId"),
    productId: formData.get("productId"),
    returnDate: formData.get("returnDate"),
    returnQuantity: formData.get("returnQuantity"),
    returnReason: formData.get("returnReason"),
    weightUnit: formData.get("weightUnit"),
    status: formData.get("status") || undefined,
  };
}

export async function createReturn(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getOwnerId();
    if (!userId) return { success: false, error: "Not authenticated" };
    const parsed = schema.safeParse(read(formData));
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(returns).values({
      ...parsed.data,
      status: parsed.data.status ?? "received",
      userId,
    });
    revalidatePath("/returns");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[actions/returns] createReturn", error);
    return { success: false, error: "Failed to record return" };
  }
}

export async function deleteReturn(id: number): Promise<ActionResult> {
  try {
    await db.delete(returns).where(eq(returns.id, id));
    revalidatePath("/returns");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[actions/returns] deleteReturn", error);
    return { success: false, error: "Failed to delete return" };
  }
}
