"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Pencil, Trash2, X, ShoppingBasket, Receipt } from "lucide-react";
import { createFeedSupplier, updateFeedSupplier, deleteFeedSupplier, createFeedPurchase, deleteFeedPurchase } from "@/actions/feed";
import { confirmDelete } from "@/lib/alerts";
import { FEED_UNITS, formatCurrency, formatDate, today } from "@/lib/utils";

type Supplier = { id: number; name: string; phone: string | null; address: string | null; feedType: string | null; status: string };
type Purchase = { id: number; feedSupplierId: number; purchaseDate: string; feedType: string; quantity: string; unit: string; cost: string; remarks: string | null; supplierName: string | null };

const INIT = { success: false, error: undefined as string | undefined };
const tabs = ["Suppliers", "Purchases"] as const;
type Tab = (typeof tabs)[number];

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

function SuppliersTab({ suppliers }: { suppliers: Supplier[] }) {
  const [modal, setModal] = useState<"create" | Supplier | null>(null);
  const [createState, createAction] = useActionState(createFeedSupplier, INIT);
  const [editState, editAction] = useActionState(updateFeedSupplier, INIT);

  useEffect(() => { if (createState.success) setModal(null); }, [createState.success]);
  useEffect(() => { if (editState.success) setModal(null); }, [editState.success]);

  const editing = modal && modal !== "create" ? modal : null;

  const SupplierForm = ({ s }: { s?: Supplier }) => (
    <div className="flex flex-col gap-4">
      {s && <input type="hidden" name="id" value={s.id} />}
      <div><label className={labelCls}>Supplier Name <span className="text-error">*</span></label><input name="name" defaultValue={s?.name ?? ""} className={inputCls} /></div>
      <div><label className={labelCls}>Phone</label><input name="phone" defaultValue={s?.phone ?? ""} className={inputCls} /></div>
      <div><label className={labelCls}>Address</label><textarea name="address" defaultValue={s?.address ?? ""} rows={2} className={inputCls} /></div>
      <div><label className={labelCls}>Feed Type</label><input name="feedType" defaultValue={s?.feedType ?? ""} className={inputCls} placeholder="e.g. Quail Feed" /></div>
      <div>
        <label className={labelCls}>Status</label>
        <select name="status" defaultValue={s?.status ?? "active"} className={inputCls}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setModal("create")} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-accent text-accent-foreground"><Plus className="w-3.5 h-3.5" /> Add Supplier</button>
      </div>
      {suppliers.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No feed suppliers yet.</div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Name</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Phone</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Feed Type</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Status</th>
              <th className="px-5 py-3 w-20" />
            </tr></thead>
            <tbody className="divide-y divide-border">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-surface-secondary transition-colors">
                  <td className="px-5 py-3 font-medium text-text-primary">{s.name}</td>
                  <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{s.phone ?? "—"}</td>
                  <td className="px-5 py-3 text-text-secondary hidden md:table-cell">{s.feedType ?? "—"}</td>
                  <td className="px-5 py-3"><span className={`rounded-full text-xs font-medium px-2.5 py-0.5 ${s.status === "active" ? "bg-success-lightest text-success-foreground" : "bg-surface-secondary text-text-secondary"}`}>{s.status}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setModal(s)} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-accent hover:bg-accent-muted"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={async () => { if (await confirmDelete("This feed supplier will be permanently deleted.")) deleteFeedSupplier(s.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Add Feed Supplier">
        <form action={createAction} className="flex flex-col gap-4"><SupplierForm />{createState.error && <p className="text-xs text-error">{createState.error}</p>}<SubmitBtn label="Create Supplier" /></form>
      </Modal>
      <Modal open={!!editing} onClose={() => setModal(null)} title="Edit Feed Supplier">
        {editing && <form action={editAction} className="flex flex-col gap-4"><SupplierForm s={editing} />{editState.error && <p className="text-xs text-error">{editState.error}</p>}<SubmitBtn label="Save Changes" /></form>}
      </Modal>
    </div>
  );
}

function PurchasesTab({ suppliers, purchases }: { suppliers: Supplier[]; purchases: Purchase[] }) {
  const [modal, setModal] = useState(false);
  const [state, action] = useActionState(createFeedPurchase, INIT);

  useEffect(() => { if (state.success) setModal(false); }, [state.success]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{purchases.length} purchase{purchases.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-accent text-accent-foreground"><Plus className="w-3.5 h-3.5" /> Add Purchase</button>
      </div>
      {purchases.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No purchases recorded yet.</div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Supplier</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Feed Type</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Qty</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Cost</th>
                <th className="px-5 py-3 w-14" />
              </tr></thead>
              <tbody className="divide-y divide-border">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-5 py-3 text-text-primary">{formatDate(p.purchaseDate)}</td>
                    <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{p.supplierName ?? "—"}</td>
                    <td className="px-5 py-3 text-text-secondary hidden md:table-cell">{p.feedType}</td>
                    <td className="px-5 py-3 text-right text-text-primary">{p.quantity} {p.unit}</td>
                    <td className="px-5 py-3 text-right font-semibold text-text-primary">{formatCurrency(p.cost)}</td>
                    <td className="px-5 py-3"><button onClick={async () => { if (await confirmDelete("This feed purchase will be permanently deleted.")) deleteFeedPurchase(p.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light mx-auto"><Trash2 className="w-3.5 h-3.5" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Modal open={modal} onClose={() => setModal(false)} title="Record Feed Purchase">
        <form action={action} className="flex flex-col gap-4">
          <div><label className={labelCls}>Supplier <span className="text-error">*</span></label>
            <select name="feedSupplierId" className={inputCls}><option value="">Select supplier</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          </div>
          <div><label className={labelCls}>Purchase Date <span className="text-error">*</span></label><input name="purchaseDate" type="date" defaultValue={today()} className={inputCls} /></div>
          <div><label className={labelCls}>Feed Type <span className="text-error">*</span></label><input name="feedType" className={inputCls} placeholder="e.g. Quail Starter Feed" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelCls}>Quantity <span className="text-error">*</span></label><input name="quantity" type="number" step="0.01" min="0" className={inputCls} /></div>
            <div><label className={labelCls}>Unit <span className="text-error">*</span></label>
              <select name="unit" className={inputCls}><option value="">Select</option>{FEED_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}</select>
            </div>
          </div>
          <div><label className={labelCls}>Total Cost (LKR) <span className="text-error">*</span></label><input name="cost" type="number" step="0.01" min="0" className={inputCls} /></div>
          <div><label className={labelCls}>Remarks</label><textarea name="remarks" rows={2} className={inputCls} /></div>
          {state.error && <p className="text-xs text-error">{state.error}</p>}
          <SubmitBtn label="Save Purchase" />
        </form>
      </Modal>
    </div>
  );
}

export function FeedSuppliersClient({ suppliers, purchases }: { suppliers: Supplier[]; purchases: Purchase[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("Suppliers");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-base font-semibold text-text-primary">Feed Suppliers</h1>
        <p className="text-xs text-text-muted mt-0.5">Manage feed suppliers and purchase records</p>
      </div>
      <div className="flex gap-1 p-1 glass-card rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab ? "bg-accent text-accent-foreground" : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"}`}>
            {tab === "Suppliers" ? <ShoppingBasket className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "Suppliers" && <SuppliersTab suppliers={suppliers} />}
      {activeTab === "Purchases" && <PurchasesTab suppliers={suppliers} purchases={purchases} />}
    </div>
  );
}
