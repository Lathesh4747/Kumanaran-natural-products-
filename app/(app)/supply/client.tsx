"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createSupply, deleteSupply, type SupplyInput } from "@/actions/supply";
import { confirmDelete } from "@/lib/alerts";
import { formatCurrency, formatDate, today, SUPPLY_STATUSES } from "@/lib/utils";

type Supply = { id: number; supermarketId: number; vehicleId: number | null; supplyDate: string; totalAmount: string; status: string; remarks: string | null; createdAt: Date; supermarketName: string | null; branchName: string | null; district: string | null; vehicleName: string | null };
type Supermarket = { id: number; name: string; branchName: string; supermarketTypeId: number; district: string | null };
type Vehicle = { id: number; name: string; registrationNumber: string };
type Product = { id: number; name: string; weightUnit: string };
type Batch = { id: number; productId: number; batchNumber: string; quantityRemaining: number };

type Line = { key: number; productId: number | ""; beforeSupplyId: number | ""; quantitySupplied: number | "" };

const statusColors: Record<string, string> = {
  delivered: "bg-success-lightest text-success-foreground",
  partial: "bg-warning-light text-warning",
  cancelled: "bg-error-light text-error",
};

const inputCls = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent";
const labelCls = "block text-sm font-medium text-text-primary mb-1";

let lineSeq = 1;
const newLine = (): Line => ({ key: lineSeq++, productId: "", beforeSupplyId: "", quantitySupplied: "" });

export function SupplyClient({
  supplies,
  supermarkets,
  vehicles,
  products,
  prices,
  costs,
  batches,
}: {
  supplies: Supply[];
  supermarkets: Supermarket[];
  vehicles: Vehicle[];
  products: Product[];
  prices: Record<string, string>;
  costs: Record<number, string>;
  batches: Batch[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [supermarketId, setSupermarketId] = useState<number | "">("");
  const [vehicleId, setVehicleId] = useState<number | "">("");
  const [supplyDate, setSupplyDate] = useState(today());
  const [status, setStatus] = useState<string>("delivered");
  const [remarks, setRemarks] = useState("");
  const [lines, setLines] = useState<Line[]>([newLine()]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const typeId = useMemo(
    () => supermarkets.find((s) => s.id === supermarketId)?.supermarketTypeId ?? null,
    [supermarkets, supermarketId],
  );

  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const computed = useMemo(() => {
    return lines.map((line) => {
      const pid = typeof line.productId === "number" ? line.productId : null;
      const qty = typeof line.quantitySupplied === "number" ? line.quantitySupplied : 0;
      const selling = pid != null && typeId != null ? prices[`${pid}:${typeId}`] : undefined;
      const cost = pid != null ? costs[pid] : undefined;
      const sellingN = selling != null ? parseFloat(selling) : null;
      const costN = cost != null ? parseFloat(cost) : null;
      const profit = sellingN != null && costN != null ? sellingN - costN : null;
      const lineTotal = sellingN != null ? sellingN * qty : null;
      const missingPrice = pid != null && typeId != null && selling == null;
      return { selling: sellingN, cost: costN, profit, lineTotal, missingPrice };
    });
  }, [lines, typeId, prices, costs]);

  const total = computed.reduce((acc, c) => acc + (c.lineTotal ?? 0), 0);
  const anyMissingPrice = computed.some((c) => c.missingPrice);
  const validLines = lines.filter((l) => typeof l.productId === "number" && typeof l.quantitySupplied === "number" && l.quantitySupplied > 0);
  const canSubmit = supermarketId !== "" && validLines.length > 0 && !anyMissingPrice && !pending;

  function reset() {
    setSupermarketId(""); setVehicleId(""); setSupplyDate(today()); setStatus("delivered");
    setRemarks(""); setLines([newLine()]); setError(null);
  }

  function updateLine(key: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  }

  function submit() {
    setError(null);
    if (supermarketId === "") { setError("Select a branch"); return; }
    const input: SupplyInput = {
      supermarketId,
      vehicleId: vehicleId === "" ? null : vehicleId,
      supplyDate,
      status: status as SupplyInput["status"],
      remarks: remarks || undefined,
      lines: validLines.map((l) => ({
        productId: l.productId as number,
        beforeSupplyId: l.beforeSupplyId === "" ? null : (l.beforeSupplyId as number),
        quantitySupplied: l.quantitySupplied as number,
      })),
    };
    startTransition(async () => {
      const res = await createSupply(input);
      if (res.success) { setOpen(false); reset(); router.refresh(); }
      else setError(res.error ?? "Failed to record supply");
    });
  }

  const totalAll = supplies.reduce((acc, s) => acc + parseFloat(s.totalAmount), 0);
  const hasMasterData = supermarkets.length > 0 && products.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-semibold text-text-primary">Supply Records</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {supplies.length} record{supplies.length !== 1 ? "s" : ""} · Total: {formatCurrency(totalAll)}
          </p>
        </div>
        <button
          onClick={() => { reset(); setOpen(true); }}
          disabled={!hasMasterData}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium bg-accent text-accent-foreground disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" /> Record Supply
        </button>
      </div>

      {!hasMasterData && (
        <div className="glass-card-tint rounded-2xl px-5 py-4">
          <p className="text-sm font-medium text-text-primary">Set up master data first</p>
          <p className="text-sm text-text-secondary mt-1">
            Recording a supply needs products with cost prices, per-type pricing, and supermarket branches.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {[
              { href: "/products-admin", label: "Products" },
              { href: "/pricing", label: "Pricing" },
              { href: "/supermarkets", label: "Supermarkets" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                {label} <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {supplies.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6 text-text-muted" />
          </div>
          <p className="text-sm font-medium text-text-primary">No supply records yet</p>
          <p className="text-xs text-text-muted mt-1">Record your first supply to start tracking sales and profit</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Branch</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">District</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden lg:table-cell">Vehicle</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Status</th>
                  <th className="px-5 py-3 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {supplies.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-5 py-3 text-text-primary whitespace-nowrap">{formatDate(s.supplyDate)}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-text-primary">{s.supermarketName}</p>
                      <p className="text-xs text-text-muted">{s.branchName}</p>
                    </td>
                    <td className="px-5 py-3 text-text-secondary hidden md:table-cell">{s.district ?? "—"}</td>
                    <td className="px-5 py-3 text-text-secondary hidden lg:table-cell">{s.vehicleName ?? "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold text-text-primary">{formatCurrency(s.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full text-xs font-medium px-2.5 py-0.5 ${statusColors[s.status] ?? "bg-surface-secondary text-text-secondary"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={async () => { if (await confirmDelete("This supply and all its line items will be removed.")) startTransition(async () => { await deleteSupply(s.id); router.refresh(); }); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light"><Trash2 className="w-3.5 h-3.5" /></button>
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
          <div className="relative glass-card p-6 w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-text-primary">Record Supply</h2>
              <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:bg-surface-secondary"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Branch <span className="text-error">*</span></label>
                  <select value={supermarketId} onChange={(e) => setSupermarketId(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls}>
                    <option value="">Select branch</option>
                    {supermarkets.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.branchName}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Vehicle</label>
                  <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value === "" ? "" : Number(e.target.value))} className={inputCls}>
                    <option value="">None</option>
                    {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber})</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Supply date <span className="text-error">*</span></label>
                  <input type="date" value={supplyDate} onChange={(e) => setSupplyDate(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                    {SUPPLY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls + " mb-0"}>Products <span className="text-error">*</span></label>
                  <button type="button" onClick={() => setLines((p) => [...p, newLine()])} className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                    <Plus className="w-3 h-3" /> Add line
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {lines.map((line, i) => {
                    const c = computed[i];
                    const lineBatches = batches.filter((b) => b.productId === line.productId);
                    return (
                      <div key={line.key} className="glass-card-tint rounded-xl p-3 flex flex-col gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                          <div className="sm:col-span-5">
                            <label className="block text-xs font-medium text-text-secondary mb-1">Product</label>
                            <select value={line.productId} onChange={(e) => updateLine(line.key, { productId: e.target.value === "" ? "" : Number(e.target.value), beforeSupplyId: "" })} className={inputCls}>
                              <option value="">Select product</option>
                              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                          </div>
                          <div className="sm:col-span-4">
                            <label className="block text-xs font-medium text-text-secondary mb-1">Batch (stock)</label>
                            <select value={line.beforeSupplyId} onChange={(e) => updateLine(line.key, { beforeSupplyId: e.target.value === "" ? "" : Number(e.target.value) })} className={inputCls} disabled={line.productId === ""}>
                              <option value="">Latest cost (no batch)</option>
                              {lineBatches.map((b) => <option key={b.id} value={b.id}>{b.batchNumber} · {b.quantityRemaining} left</option>)}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-text-secondary mb-1">Qty</label>
                            <input type="number" min="1" step="1" value={line.quantitySupplied} onChange={(e) => updateLine(line.key, { quantitySupplied: e.target.value === "" ? "" : Number(e.target.value) })} className={inputCls} placeholder="0" />
                          </div>
                          <div className="sm:col-span-1 flex justify-end">
                            <button type="button" onClick={() => setLines((p) => (p.length > 1 ? p.filter((l) => l.key !== line.key) : p))} disabled={lines.length === 1} className="w-9 h-9 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light disabled:opacity-30">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {line.productId !== "" && (
                          c.missingPrice ? (
                            <p className="text-xs text-error">No price set for {productMap.get(line.productId as number)?.name} at this branch&apos;s supermarket type — set it in <Link href="/pricing" className="underline">Pricing</Link>.</p>
                          ) : c.selling != null ? (
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                              <span>Sell: <span className="font-medium text-text-primary">{formatCurrency(c.selling)}</span></span>
                              <span>Cost: <span className="font-medium text-text-primary">{c.cost != null ? formatCurrency(c.cost) : "—"}</span></span>
                              <span>Profit/pkt: <span className={`font-medium ${c.profit != null && c.profit >= 0 ? "text-success" : "text-error"}`}>{c.profit != null ? formatCurrency(c.profit) : "—"}</span></span>
                              <span className="ml-auto">Line: <span className="font-semibold text-text-primary">{c.lineTotal != null ? formatCurrency(c.lineTotal) : "—"}</span></span>
                            </div>
                          ) : null
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={labelCls}>Remarks</label>
                <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className={inputCls} placeholder="Optional notes" />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-medium text-text-secondary">Total amount</span>
                <span className="text-base font-semibold text-text-primary">{formatCurrency(total)}</span>
              </div>

              {error && <p className="text-xs text-error">{error}</p>}

              <button onClick={submit} disabled={!canSubmit} className="w-full rounded-md px-4 py-2.5 text-sm font-medium bg-accent text-accent-foreground disabled:opacity-50">
                {pending ? "Recording…" : "Record Supply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
