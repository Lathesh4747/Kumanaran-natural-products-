import { db } from "@/db";
import { expenses } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ExpensesClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Expenses" };

export default async function ExpensesPage() {
  const allExpenses = await db
    .select()
    .from(expenses)
    .orderBy(desc(expenses.expenseDate))
    .catch(() => []);

  return <ExpensesClient expenses={allExpenses} />;
}
