"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createBatch, updateBatch, deleteBatch } from "@/actions/production";
import { confirmDelete } from "@/lib/alerts";
import { WEIGHT_UNITS, formatCurrency, formatDate, today } from "@/lib/utils";

type Batch = { id: number; productId: number; costPriceId: number; batchNumber: string; productionDate: string; bestBeforeDate: string; weightUnit: string; quantityProduced: number; quantityRemaining: number; mrp: string; productName: string | null; productCostPrice: string | null };
type Product = { id: number; name: string; weightUnit: string; mrp: string };
type CostPrice = { id: number; productId: number; productCostPrice: string; effectiveDate: string };

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
      <div className="relative glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
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

function BatchForm({
  batch,
  products,
  costPrices,
}: {
  batch?: Batch;
  products: Product[];
  costPrices: CostPrice[];
}) {
  const [selectedProductId, setSelectedProductId] = useState<number>(batch?.productId ?? 0);
  const relevantCostPrices = costPrices.filter((c) => c.productId === selectedProductId);

  return (
    <div className="flex flex-col gap-4">
      {batch && <input type="hidden" name="id" value={batch.id} />}
      <div>
        <label className={labelCls}>Product <span className="text-error">*</span></label>
        <select name="productId" defaultValue={batch?.productId ?? ""} className={inputCls} onChange={(e) => setSelectedProductId(Number(e.target.value))}>
          <option value="">Select product</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Cost Price <span className="text-error">*</span></label>
        <select name="costPriceId" defaultValue={batch?.costPriceId ?? ""} className={inputCls}>
          <option value="">Select cost price</option>
          {relevantCostPrices.map((c) => (
            <option key={c.id} value={c.id}>
              {formatCurrency(c.productCostPrice)} — effective {formatDate(c.effectiveDate)}
            </option>
          ))}
        </select>
        {selectedProductId > 0 && relevantCostPrices.length === 0 && (
          <p className="text-xs text-warning mt-1">No cost prices for this product — add one in Products &amp; Costs first.</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Batch Number <span className="text-error">*</span></label>
          <input name="batchNumber" defaultValue={batch?.batchNumber ?? ""} className={inputCls} placeholder="e.g. B-2024-001" />
        </div>
        <div>
          <label className={labelCls}>Weight Unit <span className="text-error">*</span></label>
          <select name="weightUnit" defaultValue={batch?.weightUnit ?? ""} className={inputCls}>
            <option value="">Select</option>
            {WEIGHT_UNITS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Production Date <span className="text-error">*</span></label>
          <input name="productionDate" type="date" defaultValue={batch?.productionDate ?? today()} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Best Before <span className="text-error">*</span></label>
          <input name="bestBeforeDate" type="date" defaultValue={batch?.bestBeforeDate ?? ""} className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Qty Produced <span className="text-error">*</span></label>
          <input name="quantityProduced" type="number" min="1" defaultValue={batch?.quantityProduced ?? ""} className={inputCls} placeholder="0" />
        </div>
        <div>
          <label className={labelCls}>MRP (LKR) <span className="text-error">*</span></label>
          <input name="mrp" type="number" step="0.01" min="0" defaultValue={batch?.mrp ?? ""} className={inputCls} placeholder="0.00" />
        </div>
      </div>
    </div>
  );
}

export function ProductionClient({ batches, products, costPrices }: { batches: Batch[]; products: Product[]; costPrices: CostPrice[] }) {
  const [modal, setModal] = useState<"create" | Batch | null>(null);
  const [createState, createAction] = useActionState(createBatch, INIT);
  const [editState, editAction] = useActionState(updateBatch, INIT);

  useEffect(() => { if (createState.success) setModal(null); }, [createState.success]);
  useEffect(() => { if (editState.success) setModal(null); }, [editState.success]);

  const editing = modal && modal !== "create" ? modal : null;

  const totalInventory = batches.reduce((acc, b) => acc + b.quantityRemaining, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-text-primary">Production</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {batches.length} batch{batches.length !== 1 ? "es" : ""} · {totalInventory.toLocaleString()} packets in inventory
          </p>
        </div>
        <button onClick={() => setModal("create")} className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium bg-accent text-accent-foreground">
          <Plus className="w-3.5 h-3.5" /> New Batch
        </button>
      </div>

      {batches.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <p className="text-sm font-medium text-text-primary">No batches yet</p>
          <p className="text-xs text-text-muted mt-1">Record your first production batch above</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Batch</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Product</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Produced</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Best Before</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Produced</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Remaining</th>
                  <th className="px-5 py-3 w-20" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {batches.map((b) => {
                  const low = b.quantityRemaining <= 20 && b.quantityRemaining > 0;
                  const empty = b.quantityRemaining === 0;
                  return (
                    <tr key={b.id} className="hover:bg-surface-secondary transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-text-primary">{b.batchNumber}</p>
                        <span className="rounded-full bg-accent-light text-accent-dark text-xs font-medium px-2 py-0.5">{b.weightUnit}</span>
                      </td>
                      <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{b.productName ?? "—"}</td>
                      <td className="px-5 py-3 text-text-muted hidden md:table-cell">{formatDate(b.productionDate)}</td>
                      <td className="px-5 py-3 text-text-muted hidden md:table-cell">{formatDate(b.bestBeforeDate)}</td>
                      <td className="px-5 py-3 text-right text-text-primary">{b.quantityProduced.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-semibold ${empty ? "text-text-muted" : low ? "text-warning" : "text-success"}`}>
                          {b.quantityRemaining.toLocaleString()}
                        </span>
                        {low && !empty && <span className="ml-1 text-xs text-warning">low</span>}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => setModal(b)} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-accent hover:bg-accent-muted"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={async () => { if (await confirmDelete("This production batch will be permanently deleted.")) deleteBatch(b.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="New Production Batch">
        <form action={createAction} className="flex flex-col gap-4">
          <BatchForm products={products} costPrices={costPrices} />
          {createState.error && <p className="text-xs text-error">{createState.error}</p>}
          <SubmitBtn label="Create Batch" />
        </form>
      </Modal>
      <Modal open={!!editing} onClose={() => setModal(null)} title="Edit Batch">
        {editing && (
          <form action={editAction} className="flex flex-col gap-4">
            <BatchForm batch={editing} products={products} costPrices={costPrices} />
            {editState.error && <p className="text-xs text-error">{editState.error}</p>}
            <SubmitBtn label="Save Changes" />
          </form>
        )}
      </Modal>
    </div>
  );
}
