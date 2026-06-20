"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Trash2, X } from "lucide-react";
import { upsertProductPrice, deleteProductPrice } from "@/actions/productPrices";
import { confirmDelete } from "@/lib/alerts";
import { formatCurrency, formatDate, today } from "@/lib/utils";

type Product = { id: number; name: string; weightUnit: string; mrp: string };
type SMType = { id: number; name: string };
type Price = { id: number; productId: number; supermarketTypeId: number; sellingPrice: string; effectiveDate: string; productName: string | null; typeName: string | null };

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

export function PricingClient({ products, types, prices }: { products: Product[]; types: SMType[]; prices: Price[] }) {
  const [modal, setModal] = useState(false);
  const [state, action] = useActionState(upsertProductPrice, INIT);

  useEffect(() => { if (state.success) setModal(false); }, [state.success]);

  // Group prices by product for the grid view
  const priceMap = new Map<number, Map<number, Price>>();
  for (const p of prices) {
    if (!priceMap.has(p.productId)) priceMap.set(p.productId, new Map());
    priceMap.get(p.productId)!.set(p.supermarketTypeId, p);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-text-primary">Pricing</h1>
          <p className="text-xs text-text-muted mt-0.5">Set selling prices per product per supermarket chain type</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium bg-accent text-accent-foreground">
          <Plus className="w-3.5 h-3.5" /> Set Price
        </button>
      </div>

      {/* Info callout */}
      <div className="glass-card-tint rounded-2xl px-5 py-4 text-sm text-text-secondary">
        <strong className="text-text-primary">How pricing works:</strong> Set one selling price per (product, chain type). Cargills and Keells typically share the same price; Private supermarkets may differ. When a supply is recorded, the price is automatically snapshotted from this table.
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No active products — add products first.</div>
      ) : types.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No supermarket types — add chain types first.</div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Product</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">MRP</th>
                  {types.map((t) => (
                    <th key={t.id} className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-text-primary">{product.name}</p>
                      <span className="rounded-full bg-accent-light text-accent-dark text-xs font-medium px-2 py-0.5">{product.weightUnit}</span>
                    </td>
                    <td className="px-5 py-3 text-right text-text-secondary">{formatCurrency(product.mrp)}</td>
                    {types.map((t) => {
                      const price = priceMap.get(product.id)?.get(t.id);
                      return (
                        <td key={t.id} className="px-5 py-3 text-right">
                          {price ? (
                            <div className="flex items-center justify-end gap-2">
                              <div className="text-right">
                                <p className="font-semibold text-text-primary">{formatCurrency(price.sellingPrice)}</p>
                                <p className="text-xs text-text-muted">{formatDate(price.effectiveDate)}</p>
                              </div>
                              <button onClick={async () => { if (await confirmDelete("This price will be permanently deleted.")) deleteProductPrice(price.id); }} className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light flex-shrink-0">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-text-muted">Not set</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Set Product Price">
        <form action={action} className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Product <span className="text-error">*</span></label>
            <select name="productId" className={inputCls}>
              <option value="">Select product</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Chain Type <span className="text-error">*</span></label>
            <select name="supermarketTypeId" className={inputCls}>
              <option value="">Select type</option>
              {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Selling Price (LKR) <span className="text-error">*</span></label>
            <input name="sellingPrice" type="number" step="0.01" min="0" className={inputCls} placeholder="0.00" />
          </div>
          <div>
            <label className={labelCls}>Effective Date <span className="text-error">*</span></label>
            <input name="effectiveDate" type="date" defaultValue={today()} className={inputCls} />
          </div>
          <p className="text-xs text-text-muted">If a price already exists for this product + type combination, it will be updated.</p>
          {state.error && <p className="text-xs text-error">{state.error}</p>}
          <SubmitBtn label="Save Price" />
        </form>
      </Modal>
    </div>
  );
}
