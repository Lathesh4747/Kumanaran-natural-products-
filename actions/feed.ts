"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { feedSuppliers, feedPurchases } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

type ActionResult = { success: boolean; error?: string };

// ── Feed Suppliers ────────────────────────────────────────────────────────────

const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  feedType: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export async function createFeedSupplier(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = supplierSchema.safeParse({
      name: formData.get("name"),
      phone: formData.get("phone") || undefined,
      address: formData.get("address") || undefined,
      feedType: formData.get("feedType") || undefined,
      status: formData.get("status") || "active",
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(feedSuppliers).values(parsed.data);
    revalidatePath("/feed-suppliers");
    return { success: true };
  } catch (error) {
    console.error("[actions/feed] createFeedSupplier", error);
    return { success: false, error: "Failed to create feed supplier" };
  }
}

export async function updateFeedSupplier(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const id = Number(formData.get("id"));
    const parsed = supplierSchema.safeParse({
      name: formData.get("name"),
      phone: formData.get("phone") || undefined,
      address: formData.get("address") || undefined,
      feedType: formData.get("feedType") || undefined,
      status: formData.get("status") || "active",
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.update(feedSuppliers).set(parsed.data).where(eq(feedSuppliers.id, id));
    revalidatePath("/feed-suppliers");
    return { success: true };
  } catch (error) {
    console.error("[actions/feed] updateFeedSupplier", error);
    return { success: false, error: "Failed to update feed supplier" };
  }
}

export async function deleteFeedSupplier(id: number): Promise<ActionResult> {
  try {
    await db.delete(feedSuppliers).where(eq(feedSuppliers.id, id));
    revalidatePath("/feed-suppliers");
    return { success: true };
  } catch (error) {
    console.error("[actions/feed] deleteFeedSupplier", error);
    return { success: false, error: "Cannot delete — feed purchases may be linked" };
  }
}

// ── Feed Purchases ────────────────────────────────────────────────────────────

const purchaseSchema = z.object({
  feedSupplierId: z.coerce.number().int().positive("Supplier is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  feedType: z.string().min(1, "Feed type is required"),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  cost: z.coerce.number().positive("Cost must be positive"),
  remarks: z.string().optional(),
});

export async function createFeedPurchase(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = purchaseSchema.safeParse({
      feedSupplierId: formData.get("feedSupplierId"),
      purchaseDate: formData.get("purchaseDate"),
      feedType: formData.get("feedType"),
      quantity: formData.get("quantity"),
      unit: formData.get("unit"),
      cost: formData.get("cost"),
      remarks: formData.get("remarks") || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(feedPurchases).values({
      ...parsed.data,
      quantity: String(parsed.data.quantity),
      cost: String(parsed.data.cost),
    });
    revalidatePath("/feed-suppliers");
    return { success: true };
  } catch (error) {
    console.error("[actions/feed] createFeedPurchase", error);
    return { success: false, error: "Failed to record feed purchase" };
  }
}

export async function deleteFeedPurchase(id: number): Promise<ActionResult> {
  try {
    await db.delete(feedPurchases).where(eq(feedPurchases.id, id));
    revalidatePath("/feed-suppliers");
    return { success: true };
  } catch (error) {
    console.error("[actions/feed] deleteFeedPurchase", error);
    return { success: false, error: "Failed to delete feed purchase" };
  }
}
