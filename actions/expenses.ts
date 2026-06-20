"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { EXPENSE_CATEGORIES } from "@/lib/utils";

type ActionResult = { success: boolean; error?: string };

const schema = z.object({
  expenseCategory: z.enum(EXPENSE_CATEGORIES, { message: "Select a valid category" }),
  expenseDate: z.string().min(1, "Date is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().optional(),
});

export async function createExpense(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const parsed = schema.safeParse({
      expenseCategory: formData.get("expenseCategory"),
      expenseDate: formData.get("expenseDate"),
      amount: formData.get("amount"),
      description: formData.get("description") || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.insert(expenses).values({ ...parsed.data, amount: String(parsed.data.amount) });
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error("[actions/expenses] createExpense", error);
    return { success: false, error: "Failed to record expense" };
  }
}

export async function updateExpense(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const id = Number(formData.get("id"));
    const parsed = schema.safeParse({
      expenseCategory: formData.get("expenseCategory"),
      expenseDate: formData.get("expenseDate"),
      amount: formData.get("amount"),
      description: formData.get("description") || undefined,
    });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    await db.update(expenses).set({ ...parsed.data, amount: String(parsed.data.amount) }).where(eq(expenses.id, id));
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error("[actions/expenses] updateExpense", error);
    return { success: false, error: "Failed to update expense" };
  }
}

export async function deleteExpense(id: number): Promise<ActionResult> {
  try {
    await db.delete(expenses).where(eq(expenses.id, id));
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error("[actions/expenses] deleteExpense", error);
    return { success: false, error: "Failed to delete expense" };
  }
}
