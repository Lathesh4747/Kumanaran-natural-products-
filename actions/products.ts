"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { productTypes, products, costPrices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { pingIndexNow } from "@/lib/indexnow";

type ActionResult = { success: boolean; error?: string };

// Public pages that reflect the catalogue. There are no per-product detail
// routes, so a product change is surfaced on the products listing and the home
// page (which shows a products preview). Pushed to IndexNow on every save.
const PUBLIC_PRODUCT_URLS = ["/products", "/"] as const;

// ── Product Types ─────────────────────────────────────────────────────────────

const productTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export async function createProductType(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = productTypeSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(productTypes).values(parsed.data);
    revalidatePath("/products-admin");
    return { success: true };
  } catch (error) {
    console.error("[actions/products] createProductType", error);
    return { success: false, error: "Failed to create product type" };
  }
}

export async function updateProductType(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const id = Number(formData.get("id"));
    const parsed = productTypeSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.update(productTypes).set(parsed.data).where(eq(productTypes.id, id));
    revalidatePath("/products-admin");
    return { success: true };
  } catch (error) {
    console.error("[actions/products] updateProductType", error);
    return { success: false, error: "Failed to update product type" };
  }
}

export async function deleteProductType(id: number): Promise<ActionResult> {
  try {
    await db.delete(productTypes).where(eq(productTypes.id, id));
    revalidatePath("/products-admin");
    return { success: true };
  } catch (error) {
    console.error("[actions/products] deleteProductType", error);
    return { success: false, error: "Cannot delete — products may be linked to this type" };
  }
}

// ── Products ──────────────────────────────────────────────────────────────────

const productSchema = z.object({
  productTypeId: z.coerce.number().int().positive("Product type is required"),
  name: z.string().min(1, "Name is required"),
  weightUnit: z.enum(["500g", "1000g"]),
  mrp: z.coerce.number().positive("MRP must be positive"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function createProduct(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = productSchema.safeParse({
      productTypeId: formData.get("productTypeId"),
      name: formData.get("name"),
      weightUnit: formData.get("weightUnit"),
      mrp: formData.get("mrp"),
      description: formData.get("description") || undefined,
      isActive: true,
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(products).values({
      ...parsed.data,
      mrp: String(parsed.data.mrp),
    });
    revalidatePath("/products-admin");
    revalidatePath("/products");
    await pingIndexNow(PUBLIC_PRODUCT_URLS);
    return { success: true };
  } catch (error) {
    console.error("[actions/products] createProduct", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const id = Number(formData.get("id"));
    const parsed = productSchema.safeParse({
      productTypeId: formData.get("productTypeId"),
      name: formData.get("name"),
      weightUnit: formData.get("weightUnit"),
      mrp: formData.get("mrp"),
      description: formData.get("description") || undefined,
      isActive: formData.get("isActive") === "true",
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.update(products).set({ ...parsed.data, mrp: String(parsed.data.mrp) }).where(eq(products.id, id));
    revalidatePath("/products-admin");
    revalidatePath("/products");
    await pingIndexNow(PUBLIC_PRODUCT_URLS);
    return { success: true };
  } catch (error) {
    console.error("[actions/products] updateProduct", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function toggleProductActive(id: number, isActive: boolean): Promise<ActionResult> {
  try {
    await db.update(products).set({ isActive }).where(eq(products.id, id));
    revalidatePath("/products-admin");
    revalidatePath("/products");
    await pingIndexNow(PUBLIC_PRODUCT_URLS);
    return { success: true };
  } catch (error) {
    console.error("[actions/products] toggleProductActive", error);
    return { success: false, error: "Failed to update product status" };
  }
}

// ── Cost Prices ───────────────────────────────────────────────────────────────

const costPriceSchema = z.object({
  productId: z.coerce.number().int().positive("Product is required"),
  packingCost: z.coerce.number().min(0, "Must be ≥ 0"),
  productCost: z.coerce.number().min(0, "Must be ≥ 0"),
  butcherCost: z.coerce.number().min(0, "Must be ≥ 0"),
  effectiveDate: z.string().min(1, "Effective date is required"),
});

export async function createCostPrice(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = costPriceSchema.safeParse({
      productId: formData.get("productId"),
      packingCost: formData.get("packingCost"),
      productCost: formData.get("productCost"),
      butcherCost: formData.get("butcherCost"),
      effectiveDate: formData.get("effectiveDate"),
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    const total = parsed.data.packingCost + parsed.data.productCost + parsed.data.butcherCost;
    await db.insert(costPrices).values({
      productId: parsed.data.productId,
      packingCost: String(parsed.data.packingCost),
      productCost: String(parsed.data.productCost),
      butcherCost: String(parsed.data.butcherCost),
      productCostPrice: String(total),
      effectiveDate: parsed.data.effectiveDate,
    });
    revalidatePath("/products-admin");
    return { success: true };
  } catch (error) {
    console.error("[actions/products] createCostPrice", error);
    return { success: false, error: "Failed to save cost price" };
  }
}

export async function deleteCostPrice(id: number): Promise<ActionResult> {
  try {
    await db.delete(costPrices).where(eq(costPrices.id, id));
    revalidatePath("/products-admin");
    return { success: true };
  } catch (error) {
    console.error("[actions/products] deleteCostPrice", error);
    return { success: false, error: "Cannot delete — supply records may reference this cost price" };
  }
}
