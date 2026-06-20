"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { vehicles, vehicleLoadings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

type ActionResult = { success: boolean; error?: string };

const vehicleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  driverName: z.string().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export async function createVehicle(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = vehicleSchema.safeParse({
      name: formData.get("name"),
      registrationNumber: formData.get("registrationNumber"),
      driverName: formData.get("driverName") || undefined,
      capacity: formData.get("capacity") || undefined,
      status: formData.get("status") || "active",
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(vehicles).values(parsed.data);
    revalidatePath("/vehicle");
    return { success: true };
  } catch (error) {
    console.error("[actions/vehicle] createVehicle", error);
    return { success: false, error: "Failed to create vehicle" };
  }
}

export async function updateVehicle(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const id = Number(formData.get("id"));
    const parsed = vehicleSchema.safeParse({
      name: formData.get("name"),
      registrationNumber: formData.get("registrationNumber"),
      driverName: formData.get("driverName") || undefined,
      capacity: formData.get("capacity") || undefined,
      status: formData.get("status") || "active",
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.update(vehicles).set(parsed.data).where(eq(vehicles.id, id));
    revalidatePath("/vehicle");
    return { success: true };
  } catch (error) {
    console.error("[actions/vehicle] updateVehicle", error);
    return { success: false, error: "Failed to update vehicle" };
  }
}

export async function deleteVehicle(id: number): Promise<ActionResult> {
  try {
    await db.delete(vehicles).where(eq(vehicles.id, id));
    revalidatePath("/vehicle");
    return { success: true };
  } catch (error) {
    console.error("[actions/vehicle] deleteVehicle", error);
    return { success: false, error: "Cannot delete — supply or loading records may be linked" };
  }
}

// ── Vehicle Loadings ──────────────────────────────────────────────────────────

const loadingSchema = z.object({
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  loadingDate: z.string().min(1, "Loading date is required"),
  totalPackets: z.coerce.number().int().positive("Total packets must be positive"),
  status: z.enum(["loaded", "dispatched", "returned"]).default("loaded"),
  remarks: z.string().optional(),
});

export async function createVehicleLoading(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = loadingSchema.safeParse({
      vehicleId: formData.get("vehicleId"),
      loadingDate: formData.get("loadingDate"),
      totalPackets: formData.get("totalPackets"),
      status: formData.get("status") || "loaded",
      remarks: formData.get("remarks") || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(vehicleLoadings).values(parsed.data);
    revalidatePath("/vehicle");
    return { success: true };
  } catch (error) {
    console.error("[actions/vehicle] createVehicleLoading", error);
    return { success: false, error: "Failed to create vehicle loading" };
  }
}

export async function deleteVehicleLoading(id: number): Promise<ActionResult> {
  try {
    await db.delete(vehicleLoadings).where(eq(vehicleLoadings.id, id));
    revalidatePath("/vehicle");
    return { success: true };
  } catch (error) {
    console.error("[actions/vehicle] deleteVehicleLoading", error);
    return { success: false, error: "Failed to delete loading record" };
  }
}
