"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { PAYMENT_METHODS, PAYMENT_STATUSES } from "@/lib/utils";

type ActionResult = { success: boolean; error?: string };

const schema = z.object({
  supermarketId: z.coerce.number().int().positive("Supermarket is required"),
  supplyId: z.coerce.number().int().positive().optional(),
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentDate: z.string().min(1, "Date is required"),
  status: z.enum(PAYMENT_STATUSES),
  method: z.string().optional(),
  remarks: z.string().optional(),
});

export async function createPayment(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = schema.safeParse({
      supermarketId: formData.get("supermarketId"),
      supplyId: formData.get("supplyId") || undefined,
      amount: formData.get("amount"),
      paymentDate: formData.get("paymentDate"),
      status: formData.get("status"),
      method: formData.get("method") || undefined,
      remarks: formData.get("remarks") || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(payments).values({ ...parsed.data, amount: String(parsed.data.amount) });
    revalidatePath("/payments");
    return { success: true };
  } catch (error) {
    console.error("[actions/payments] createPayment", error);
    return { success: false, error: "Failed to record payment" };
  }
}

export async function updatePaymentStatus(id: number, status: string): Promise<ActionResult> {
  try {
    await db.update(payments).set({ status }).where(eq(payments.id, id));
    revalidatePath("/payments");
    return { success: true };
  } catch (error) {
    console.error("[actions/payments] updatePaymentStatus", error);
    return { success: false, error: "Failed to update payment status" };
  }
}

export async function deletePayment(id: number): Promise<ActionResult> {
  try {
    await db.delete(payments).where(eq(payments.id, id));
    revalidatePath("/payments");
    return { success: true };
  } catch (error) {
    console.error("[actions/payments] deletePayment", error);
    return { success: false, error: "Failed to delete payment" };
  }
}
