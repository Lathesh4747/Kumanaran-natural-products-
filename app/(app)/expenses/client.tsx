"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createExpense, updateExpense, deleteExpense } from "@/actions/expenses";
import { confirmDelete } from "@/lib/alerts";
import { EXPENSE_CATEGORIES, formatCurrency, formatDate, today } from "@/lib/utils";

type Expense = { id: number; expenseCategory: string; expenseDate: string; amount: string; description: string | null };

const INIT = { success: false, error: undefined as string | undefined };

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="w-full rounded-md px-4 py-2 text-sm font-medium bg-accent text-accent-foreground disabled:opacity-60">{pending ? "Saving…" : label}</button>;
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-overlay/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:bg-surface-secondary"><X className="w-4 h-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent";
const labelCls = "block text-sm font-medium text-text-primary mb-1";

const categoryColors: Record<string, string> = {
  Transport: "bg-info-lightest text-info-foreground",
  Packaging: "bg-harvest-light text-harvest-foreground",
  Utilities: "bg-accent-light text-accent-dark",
  Labour: "bg-earth-light text-earth",
  Maintenance: "bg-warning-light text-warning",
  Marketing: "bg-success-lightest text-success-foreground",
  Other: "bg-surface-secondary text-text-secondary",
};

export function ExpensesClient({ expenses }: { expenses: Expense[] }) {
  const [modal, setModal] = useState<"create" | Expense | null>(null);
  const [createState, createAction] = useActionState(createExpense, INIT);
  const [editState, editAction] = useActionState(updateExpense, INIT);

  useEffect(() => { if (createState.success) setModal(null); }, [createState.success]);
  useEffect(() => { if (editState.success) setModal(null); }, [editState.success]);

  const editing = modal && modal !== "create" ? modal : null;
  const total = expenses.reduce((acc, e) => acc + parseFloat(e.amount), 0);

  const ExpenseForm = ({ e }: { e?: Expense }) => (
    <div className="flex flex-col gap-4">
      {e && <input type="hidden" name="id" value={e.id} />}
      <div>
        <label className={labelCls}>Category <span className="text-error">*</span></label>
        <select name="expenseCategory" defaultValue={e?.expenseCategory ?? ""} className={inputCls}>
          <option value="">Select category</option>
          {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Date <span className="text-error">*</span></label>
        <input name="expenseDate" type="date" defaultValue={e?.expenseDate ?? today()} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Amount (LKR) <span className="text-error">*</span></label>
        <input name="amount" type="number" step="0.01" min="0" defaultValue={e?.amount ?? ""} className={inputCls} placeholder="0.00" />
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea name="description" defaultValue={e?.description ?? ""} rows={2} className={inputCls} placeholder="Optional details" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-text-primary">Expenses</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {expenses.length} record{expenses.length !== 1 ? "s" : ""} · Total: {formatCurrency(total)}
          </p>
        </div>
        <button onClick={() => setModal("create")} className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium bg-accent text-accent-foreground">
          <Plus className="w-3.5 h-3.5" /> Add Expense
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <p className="text-sm font-medium text-text-primary">No expenses recorded</p>
          <p className="text-xs text-text-muted mt-1">Add your first expense above</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Description</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Amount</th>
                  <th className="px-5 py-3 w-20" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-5 py-3 text-text-primary whitespace-nowrap">{formatDate(e.expenseDate)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full text-xs font-medium px-2.5 py-0.5 ${categoryColors[e.expenseCategory] ?? "bg-surface-secondary text-text-secondary"}`}>
                        {e.expenseCategory}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-secondary hidden md:table-cell">{e.description ?? "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold text-text-primary">{formatCurrency(e.amount)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setModal(e)} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-accent hover:bg-accent-muted"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={async () => { if (await confirmDelete("This expense will be permanently deleted.")) deleteExpense(e.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-surface-secondary">
                  <td colSpan={3} className="px-5 py-3 text-sm font-medium text-text-secondary hidden md:table-cell">Total</td>
                  <td colSpan={1} className="px-5 py-3 text-sm font-medium text-text-secondary md:hidden">Total</td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-text-primary">{formatCurrency(total)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Add Expense">
        <form action={createAction} className="flex flex-col gap-4">
          <ExpenseForm />
          {createState.error && <p className="text-xs text-error">{createState.error}</p>}
          <SubmitBtn label="Save Expense" />
        </form>
      </Modal>
      <Modal open={!!editing} onClose={() => setModal(null)} title="Edit Expense">
        {editing && (
          <form action={editAction} className="flex flex-col gap-4">
            <ExpenseForm e={editing} />
            {editState.error && <p className="text-xs text-error">{editState.error}</p>}
            <SubmitBtn label="Save Changes" />
          </form>
        )}
      </Modal>
    </div>
  );
}
