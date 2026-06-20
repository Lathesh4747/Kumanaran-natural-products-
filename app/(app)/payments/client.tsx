"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Trash2, X, Check } from "lucide-react";
import { createPayment, updatePaymentStatus, deletePayment } from "@/actions/payments";
import { confirmDelete } from "@/lib/alerts";
import { PAYMENT_METHODS, PAYMENT_STATUSES, formatCurrency, formatDate, today } from "@/lib/utils";

type Payment = { id: number; supermarketId: number; supplyId: number | null; amount: string; paymentDate: string; status: string; method: string | null; remarks: string | null; supermarketName: string | null; branchName: string | null; supplyDate: string | null };
type Supermarket = { id: number; name: string; branchName: string };
type Supply = { id: number; supplyDate: string; totalAmount: string };

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

export function PaymentsClient({ payments: paymentsData, supermarkets, supplyRecords }: { payments: Payment[]; supermarkets: Supermarket[]; supplyRecords: Supply[] }) {
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [state, action] = useActionState(createPayment, INIT);

  useEffect(() => { if (state.success) setModal(false); }, [state.success]);

  const filtered = filter === "all" ? paymentsData : paymentsData.filter((p) => p.status === filter);
  const totalPaid = paymentsData.filter((p) => p.status === "paid").reduce((a, p) => a + parseFloat(p.amount), 0);
  const totalPending = paymentsData.filter((p) => p.status === "pending").reduce((a, p) => a + parseFloat(p.amount), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-text-primary">Payments</h1>
          <p className="text-xs text-text-muted mt-0.5">{paymentsData.length} records</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium bg-accent text-accent-foreground">
          <Plus className="w-3.5 h-3.5" /> Record Payment
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-success-lightest flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-[24px] font-semibold text-text-primary">{formatCurrency(totalPaid)}</p>
            <p className="text-xs text-text-muted">Total Paid</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-warning-light flex items-center justify-center flex-shrink-0">
            <div className="w-5 h-5 text-warning flex items-center justify-center font-bold text-base">!</div>
          </div>
          <div>
            <p className="text-[24px] font-semibold text-text-primary">{formatCurrency(totalPending)}</p>
            <p className="text-xs text-text-muted">Pending</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1">
        {(["all", "paid", "pending"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-accent text-accent-foreground" : "text-text-secondary hover:bg-surface-secondary"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <p className="text-sm font-medium text-text-primary">No payments{filter !== "all" ? ` with status "${filter}"` : ""}</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Branch</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Method</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Status</th>
                  <th className="px-5 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-5 py-3 text-text-primary whitespace-nowrap">{formatDate(p.paymentDate)}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-text-primary">{p.supermarketName}</p>
                      <p className="text-xs text-text-muted">{p.branchName}</p>
                    </td>
                    <td className="px-5 py-3 text-text-secondary hidden md:table-cell">{p.method ?? "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold text-text-primary">{formatCurrency(p.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full text-xs font-medium px-2.5 py-0.5 ${p.status === "paid" ? "bg-success-lightest text-success-foreground" : "bg-warning-light text-warning"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {p.status === "pending" && (
                          <button onClick={() => updatePaymentStatus(p.id, "paid")} className="rounded-md px-2 py-1 text-xs font-medium bg-success-lightest text-success-foreground hover:bg-success-light">
                            Mark paid
                          </button>
                        )}
                        <button onClick={async () => { if (await confirmDelete("This payment record will be permanently deleted.")) deletePayment(p.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Record Payment">
        <form action={action} className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Supermarket Branch <span className="text-error">*</span></label>
            <select name="supermarketId" className={inputCls}>
              <option value="">Select branch</option>
              {supermarkets.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.branchName}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Linked Supply (optional)</label>
            <select name="supplyId" className={inputCls}>
              <option value="">None</option>
              {supplyRecords.map((s) => <option key={s.id} value={s.id}>{formatDate(s.supplyDate)} — {formatCurrency(s.totalAmount)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Amount (LKR) <span className="text-error">*</span></label>
            <input name="amount" type="number" step="0.01" min="0" className={inputCls} placeholder="0.00" />
          </div>
          <div>
            <label className={labelCls}>Payment Date <span className="text-error">*</span></label>
            <input name="paymentDate" type="date" defaultValue={today()} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Status <span className="text-error">*</span></label>
              <select name="status" defaultValue="pending" className={inputCls}>
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Method</label>
              <select name="method" className={inputCls}>
                <option value="">Select</option>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Remarks</label>
            <textarea name="remarks" rows={2} className={inputCls} />
          </div>
          {state.error && <p className="text-xs text-error">{state.error}</p>}
          <SubmitBtn label="Record Payment" />
        </form>
      </Modal>
    </div>
  );
}
