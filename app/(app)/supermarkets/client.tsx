"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Pencil, Trash2, X, Store, Tag } from "lucide-react";
import { confirmDelete } from "@/lib/alerts";
import {
  createSupermarketType, updateSupermarketType, deleteSupermarketType,
  createSupermarket, updateSupermarket, deleteSupermarket,
} from "@/actions/supermarkets";
import { SRI_LANKA_DISTRICTS, SRI_LANKA_PROVINCES, formatDate } from "@/lib/utils";

type SMType = { id: number; name: string; description: string | null };
type Supermarket = {
  id: number; name: string; branchName: string; contactPerson: string | null;
  phone: string | null; email: string | null; address: string | null;
  district: string | null; province: string | null; status: string;
  lastSupplyDate: string | null; supermarketTypeId: number; typeName: string | null;
};

const INIT = { success: false, error: undefined as string | undefined };
const tabs = ["Chain Types", "Branches"] as const;
type Tab = (typeof tabs)[number];

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full rounded-md px-4 py-2 text-sm font-medium bg-accent text-accent-foreground disabled:opacity-60">
      {pending ? "Saving…" : label}
    </button>
  );
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
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-surface-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent";
const labelCls = "block text-sm font-medium text-text-primary mb-1";

// ── Chain Types Tab ───────────────────────────────────────────────────────────

function ChainTypesTab({ types }: { types: SMType[] }) {
  const [modal, setModal] = useState<"create" | SMType | null>(null);
  const [createState, createAction] = useActionState(createSupermarketType, INIT);
  const [editState, editAction] = useActionState(updateSupermarketType, INIT);

  useEffect(() => { if (createState.success) setModal(null); }, [createState.success]);
  useEffect(() => { if (editState.success) setModal(null); }, [editState.success]);

  const editing = modal && modal !== "create" ? modal : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{types.length} type{types.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setModal("create")} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-accent text-accent-foreground">
          <Plus className="w-3.5 h-3.5" /> Add Type
        </button>
      </div>

      {types.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No chain types yet. Add Cargills, Keells, or Private.</div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Name</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Description</th>
              <th className="px-5 py-3 w-20" />
            </tr></thead>
            <tbody className="divide-y divide-border">
              {types.map((t) => (
                <tr key={t.id} className="hover:bg-surface-secondary transition-colors">
                  <td className="px-5 py-3 font-medium text-text-primary">{t.name}</td>
                  <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{t.description ?? "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setModal(t)} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-accent hover:bg-accent-muted"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={async () => { if (await confirmDelete("This chain type will be permanently deleted.")) deleteSupermarketType(t.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Add Chain Type">
        <form action={createAction} className="flex flex-col gap-4">
          <div><label className={labelCls}>Name <span className="text-error">*</span></label><input name="name" className={inputCls} placeholder="e.g. Cargills" /></div>
          <div><label className={labelCls}>Description</label><input name="description" className={inputCls} /></div>
          {createState.error && <p className="text-xs text-error">{createState.error}</p>}
          <SubmitBtn label="Create Type" />
        </form>
      </Modal>

      <Modal open={!!editing} onClose={() => setModal(null)} title="Edit Chain Type">
        {editing && (
          <form action={editAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={editing.id} />
            <div><label className={labelCls}>Name</label><input name="name" defaultValue={editing.name} className={inputCls} /></div>
            <div><label className={labelCls}>Description</label><input name="description" defaultValue={editing.description ?? ""} className={inputCls} /></div>
            {editState.error && <p className="text-xs text-error">{editState.error}</p>}
            <SubmitBtn label="Save Changes" />
          </form>
        )}
      </Modal>
    </div>
  );
}

// ── Branches Tab ──────────────────────────────────────────────────────────────

function BranchesTab({ types, supermarkets }: { types: SMType[]; supermarkets: Supermarket[] }) {
  const [modal, setModal] = useState<"create" | Supermarket | null>(null);
  const [createState, createAction] = useActionState(createSupermarket, INIT);
  const [editState, editAction] = useActionState(updateSupermarket, INIT);
  const [search, setSearch] = useState("");

  useEffect(() => { if (createState.success) setModal(null); }, [createState.success]);
  useEffect(() => { if (editState.success) setModal(null); }, [editState.success]);

  const editing = modal && modal !== "create" ? modal : null;
  const filtered = supermarkets.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.branchName.toLowerCase().includes(search.toLowerCase()) ||
      (s.district ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const BranchForm = ({ sm }: { sm?: Supermarket }) => (
    <div className="flex flex-col gap-4">
      {sm && <input type="hidden" name="id" value={sm.id} />}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Chain Type <span className="text-error">*</span></label>
          <select name="supermarketTypeId" defaultValue={sm?.supermarketTypeId ?? ""} className={inputCls}>
            <option value="">Select type</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select name="status" defaultValue={sm?.status ?? "active"} className={inputCls}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Chain Name <span className="text-error">*</span></label>
          <input name="name" defaultValue={sm?.name ?? ""} className={inputCls} placeholder="e.g. Cargills Food City" />
        </div>
        <div>
          <label className={labelCls}>Branch Name <span className="text-error">*</span></label>
          <input name="branchName" defaultValue={sm?.branchName ?? ""} className={inputCls} placeholder="e.g. Kalmunai" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Contact Person</label>
          <input name="contactPerson" defaultValue={sm?.contactPerson ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input name="phone" defaultValue={sm?.phone ?? ""} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Email</label>
        <input name="email" type="email" defaultValue={sm?.email ?? ""} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Address</label>
        <textarea name="address" defaultValue={sm?.address ?? ""} rows={2} className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>District</label>
          <select name="district" defaultValue={sm?.district ?? ""} className={inputCls}>
            <option value="">Select district</option>
            {SRI_LANKA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Province</label>
          <select name="province" defaultValue={sm?.province ?? ""} className={inputCls}>
            <option value="">Select province</option>
            {SRI_LANKA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or district…"
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button onClick={() => setModal("create")} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-accent text-accent-foreground whitespace-nowrap">
          <Plus className="w-3.5 h-3.5" /> Add Branch
        </button>
      </div>

      <p className="text-xs text-text-muted">{filtered.length} branch{filtered.length !== 1 ? "es" : ""}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No branches found.</div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Branch</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Type</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">District</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden lg:table-cell">Last Supply</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Status</th>
                <th className="px-5 py-3 w-20" />
              </tr></thead>
              <tbody className="divide-y divide-border">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-text-primary">{s.name}</p>
                      <p className="text-xs text-text-muted">{s.branchName}</p>
                    </td>
                    <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{s.typeName ?? "—"}</td>
                    <td className="px-5 py-3 text-text-secondary hidden md:table-cell">{s.district ?? "—"}</td>
                    <td className="px-5 py-3 text-text-muted hidden lg:table-cell">{s.lastSupplyDate ? formatDate(s.lastSupplyDate) : "Never"}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full text-xs font-medium px-2.5 py-0.5 ${s.status === "active" ? "bg-success-lightest text-success-foreground" : "bg-surface-secondary text-text-secondary"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setModal(s)} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-accent hover:bg-accent-muted"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={async () => { if (await confirmDelete("This branch will be permanently deleted.")) deleteSupermarket(s.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Add Branch">
        <form action={createAction} className="flex flex-col gap-4">
          <BranchForm />
          {createState.error && <p className="text-xs text-error">{createState.error}</p>}
          <SubmitBtn label="Create Branch" />
        </form>
      </Modal>

      <Modal open={!!editing} onClose={() => setModal(null)} title="Edit Branch">
        {editing && (
          <form action={editAction} className="flex flex-col gap-4">
            <BranchForm sm={editing} />
            {editState.error && <p className="text-xs text-error">{editState.error}</p>}
            <SubmitBtn label="Save Changes" />
          </form>
        )}
      </Modal>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function SupermarketsClient({ types, supermarkets }: { types: SMType[]; supermarkets: Supermarket[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("Chain Types");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-base font-semibold text-text-primary">Supermarkets</h1>
        <p className="text-xs text-text-muted mt-0.5">Manage chain types and branch locations</p>
      </div>

      <div className="flex gap-1 p-1 glass-card rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-accent text-accent-foreground" : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
            }`}
          >
            {tab === "Chain Types" ? <Tag className="w-4 h-4" /> : <Store className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Chain Types" && <ChainTypesTab types={types} />}
      {activeTab === "Branches" && <BranchesTab types={types} supermarkets={supermarkets} />}
    </div>
  );
}
