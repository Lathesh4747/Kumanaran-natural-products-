import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products as productsTable, productTypes } from "@/db/schema";
import { products as staticProducts, type Product, type ProductType } from "@/lib/data/products";

// The public site shows live catalogue rows when the owner has added products in
// the ops app; until then it falls back to the curated trilingual marketing set so
// the page is never empty. DB rows are English-only and carry no sale price.
function normalizeType(typeName: string): ProductType {
  return typeName.trim().toLowerCase() === "meat" ? "Meat" : "Egg";
}

export async function getPublicProducts(): Promise<readonly Product[]> {
  try {
    const rows = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        weightUnit: productsTable.weightUnit,
        mrp: productsTable.mrp,
        originalPrice: productsTable.originalPrice,
        description: productsTable.description,
        typeName: productTypes.name,
      })
      .from(productsTable)
      .innerJoin(productTypes, eq(productsTable.productTypeId, productTypes.id))
      .where(eq(productsTable.isActive, true));

    if (rows.length === 0) return staticProducts;

    return rows.map((row): Product => {
      const mrp = Number(row.mrp);
      const original = row.originalPrice != null ? Number(row.originalPrice) : undefined;
      return {
        id: `db-${row.id}`,
        type: normalizeType(row.typeName),
        packLabel: row.weightUnit,
        name: { en: row.name, si: "", ta: "" },
        description: { en: row.description ?? "", si: "", ta: "" },
        // Only treat it as a discount when the original is genuinely higher.
        mrpOriginal: original != null && original > mrp ? original : undefined,
        mrp,
        isActive: true,
      };
    });
  } catch (error) {
    console.error("[db/queries/products] getPublicProducts", error);
    return staticProducts;
  }
}
