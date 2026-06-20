"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { supermarketTypes, supermarkets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

type ActionResult = { success: boolean; error?: string };

// ── Supermarket Types ─────────────────────────────────────────────────────────

const typeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export async function createSupermarketType(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = typeSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(supermarketTypes).values(parsed.data);
    revalidatePath("/supermarkets");
    return { success: true };
  } catch (error) {
    console.error("[actions/supermarkets] createSupermarketType", error);
    return { success: false, error: "Failed to create supermarket type" };
  }
}

export async function updateSupermarketType(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const id = Number(formData.get("id"));
    const parsed = typeSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.update(supermarketTypes).set(parsed.data).where(eq(supermarketTypes.id, id));
    revalidatePath("/supermarkets");
    return { success: true };
  } catch (error) {
    console.error("[actions/supermarkets] updateSupermarketType", error);
    return { success: false, error: "Failed to update supermarket type" };
  }
}

export async function deleteSupermarketType(id: number): Promise<ActionResult> {
  try {
    await db.delete(supermarketTypes).where(eq(supermarketTypes.id, id));
    revalidatePath("/supermarkets");
    return { success: true };
  } catch (error) {
    console.error("[actions/supermarkets] deleteSupermarketType", error);
    return { success: false, error: "Cannot delete — supermarkets may be linked" };
  }
}

// ── Supermarkets (branches) ───────────────────────────────────────────────────

const supermarketSchema = z.object({
  supermarketTypeId: z.coerce.number().int().positive("Type is required"),
  name: z.string().min(1, "Chain name is required"),
  branchName: z.string().min(1, "Branch name is required"),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export async function createSupermarket(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = supermarketSchema.safeParse({
      supermarketTypeId: formData.get("supermarketTypeId"),
      name: formData.get("name"),
      branchName: formData.get("branchName"),
      contactPerson: formData.get("contactPerson") || undefined,
      phone: formData.get("phone") || undefined,
      email: formData.get("email") || undefined,
      address: formData.get("address") || undefined,
      district: formData.get("district") || undefined,
      province: formData.get("province") || undefined,
      status: formData.get("status") || "active",
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(supermarkets).values({
      ...parsed.data,
      email: parsed.data.email || null,
    });
    revalidatePath("/supermarkets");
    return { success: true };
  } catch (error) {
    console.error("[actions/supermarkets] createSupermarket", error);
    return { success: false, error: "Failed to create supermarket branch" };
  }
}

export async function updateSupermarket(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const id = Number(formData.get("id"));
    const parsed = supermarketSchema.safeParse({
      supermarketTypeId: formData.get("supermarketTypeId"),
      name: formData.get("name"),
      branchName: formData.get("branchName"),
      contactPerson: formData.get("contactPerson") || undefined,
      phone: formData.get("phone") || undefined,
      email: formData.get("email") || undefined,
      address: formData.get("address") || undefined,
      district: formData.get("district") || undefined,
      province: formData.get("province") || undefined,
      status: formData.get("status") || "active",
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.update(supermarkets).set({ ...parsed.data, email: parsed.data.email || null }).where(eq(supermarkets.id, id));
    revalidatePath("/supermarkets");
    return { success: true };
  } catch (error) {
    console.error("[actions/supermarkets] updateSupermarket", error);
    return { success: false, error: "Failed to update supermarket branch" };
  }
}

export async function deleteSupermarket(id: number): Promise<ActionResult> {
  try {
    await db.delete(supermarkets).where(eq(supermarkets.id, id));
    revalidatePath("/supermarkets");
    return { success: true };
  } catch (error) {
    console.error("[actions/supermarkets] deleteSupermarket", error);
    return { success: false, error: "Cannot delete — supply records may be linked" };
  }
}
