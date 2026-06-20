"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Trash2, X, RotateCcw } from "lucide-react";
import { createReturn, deleteReturn } from "@/actions/returns";
import { confirmDelete } from "@/lib/alerts";
import { RETURN_REASONS, WEIGHT_UNITS, formatDate, today } from "@/lib/utils";

type ReturnRow = { id: number; returnDate: string; returnQuantity: number; returnReason: string; weightUnit: string; status: string; productName: string | null; supermarketName: string | null; branchName: string | null; supplyDate: string | null };
type SupplyOption = { id: number; supplyDate: string; supermarketName: string | null; branchName: string | null };
type Line = { productId: number; productName: string | null; weightUnit: string; quantitySupplied: number };

const INIT = { success: false, error: undefined as string | undefined };

const reasonColors: Record<string, string> = {
  Expired: "bg-error-light text-error",
  Damaged: "bg-error-light text-error",
  "Quality Issue": "bg-warning-light text-warning",
  "Near Expiry": "bg-warning-light text-warning",
  Unsold: "bg-surface-secondary text-text-secondary",
};

const inputCls = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent";
const labelCls = "block text-sm font-medium text-text-primary mb-1";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="w-full rounded-md px-4 py-2 text-sm font-medium bg-accent text-accent-foreground disabled:opacity-60">{pending ? "Saving…" : "Record Return"}</button>;
}

export function ReturnsClient({
  returns,
  supplies,
  linesBySupply,
}: {
  returns: ReturnRow[];
  supplies: SupplyOption[];
  linesBySupply: Record<number, Line[]>;
}) {
  const [open, setOpen] = useState(false);
  const [supplyId, setSupplyId] = useState<number | "">("");
  const [productId, setProductId] = useState<number | "">("");
  const [state, action] = useActionState(createReturn, INIT);

  useEffect(() => {
    if (state.success) { setOpen(false); setSupplyId(""); setProductId(""); }
  }, [state.success]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const lines = supplyId === "" ? [] : linesBySupply[supplyId] ?? [];
  const selectedLine = lines.find((l) => l.productId === productId);

  const totalReturned = returns.reduce((acc, r) => acc + r.returnQuantity, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-semibold text-text-primary">Returns</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {returns.length} record{returns.length !== 1 ? "s" : ""} · {totalReturned.toLocaleString()} packets returned
          </p>
        </div>
        <button
          onClick={() => { setSupplyId(""); setProductId(""); setOpen(true); }}
          disabled={supplies.length === 0}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium bg-accent text-accent-foreground disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" /> Record Return
        </button>
      </div>

      {supplies.length === 0 && (
        <div className="glass-card-tint rounded-2xl px-5 py-4 text-sm text-text-secondary">
          Returns are linked to supply records. Record a supply first, then log returns against it.
        </div>
      )}

      {returns.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-3">
            <RotateCcw className="w-6 h-6 text-text-muted" />
          </div>
          <p className="text-sm font-medium text-text-primary">No returns recorded</p>
          <p className="text-xs text-text-muted mt-1">Log unsold or rejected packets against a supply</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Return Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Product</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Branch</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Reason</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Qty</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Weight</th>
                  <th className="px-5 py-3 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {returns.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-5 py-3 text-text-primary whitespace-nowrap">{formatDate(r.returnDate)}</td>
                    <td className="px-5 py-3 font-medium text-text-primary">{r.productName ?? "—"}</td>
                    <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">
                      <p>{r.supermarketName}</p>
                      <p className="text-xs text-text-muted">{r.branchName}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full text-xs font-medium px-2.5 py-0.5 ${reasonColors[r.returnReason] ?? "bg-surface-secondary text-text-secondary"}`}>
                        {r.returnReason}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-error">{r.returnQuantity}</td>
                    <td className="px-5 py-3 hidden md:table-cell"><span className="rounded-full bg-accent-light text-accent-dark text-xs font-medium px-2 py-0.5">{r.weightUnit}</span></td>
                    <td className="px-5 py-3">
                      <button onClick={async () => { if (await confirmDelete("This return record will be permanently deleted.")) deleteReturn(r.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-overlay/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-text-primary">Record Return</h2>
              <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:bg-surface-secondary"><X className="w-4 h-4" /></button>
            </div>
            <form action={action} className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Supply <span className="text-error">*</span></label>
                <select name="supplyId" value={supplyId} onChange={(e) => { setSupplyId(e.target.value === "" ? "" : Number(e.target.value)); setProductId(""); }} className={inputCls}>
                  <option value="">Select supply</option>
                  {supplies.map((s) => <option key={s.id} value={s.id}>{formatDate(s.supplyDate)} — {s.supermarketName} ({s.branchName})</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Product <span className="text-error">*</span></label>
                <select name="productId" value={productId} onChange={(e) => setProductId(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls} disabled={supplyId === ""}>
                  <option value="">Select product</option>
                  {lines.map((l) => <option key={l.productId} value={l.productId}>{l.productName} ({l.quantitySupplied} supplied)</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Return date <span className="text-error">*</span></label>
                  <input name="returnDate" type="date" defaultValue={today()} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Quantity <span className="text-error">*</span></label>
                  <input name="returnQuantity" type="number" min="1" step="1" className={inputCls} placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Reason <span className="text-error">*</span></label>
                  <select name="returnReason" defaultValue="" className={inputCls}>
                    <option value="">Select reason</option>
                    {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Weight <span className="text-error">*</span></label>
                  <select name="weightUnit" defaultValue={selectedLine?.weightUnit ?? ""} className={inputCls} key={selectedLine?.weightUnit ?? "none"}>
                    <option value="">Select</option>
                    {WEIGHT_UNITS.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              {state.error && <p className="text-xs text-error">{state.error}</p>}
              <SubmitBtn />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
