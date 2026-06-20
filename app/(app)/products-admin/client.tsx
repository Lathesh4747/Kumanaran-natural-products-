"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Pencil, Trash2, X, Package, Tag, DollarSign } from "lucide-react";
import { confirmDelete } from "@/lib/alerts";
import {
  createProductType, updateProductType, deleteProductType,
  createProduct, updateProduct, toggleProductActive,
  createCostPrice, deleteCostPrice,
} from "@/actions/products";
import { WEIGHT_UNITS, formatCurrency, formatDate } from "@/lib/utils";

type ProductType = { id: number; name: string; description: string | null };
type Product = {
  id: number; name: string; weightUnit: string; mrp: string; description: string | null;
  isActive: boolean; productTypeId: number; typeName: string | null;
};
type CostPrice = {
  id: number; productId: number; packingCost: string; productCost: string;
  butcherCost: string; productCostPrice: string; effectiveDate: string; productName: string | null;
};

const INIT = { success: false, error: undefined as string | undefined };
const tabs = ["Product Types", "Products", "Cost Prices"] as const;
type Tab = (typeof tabs)[number];

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md px-4 py-2 text-sm font-medium bg-accent text-accent-foreground disabled:opacity-60 transition-opacity"
    >
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
      <div className="relative glass-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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

// ── Product Types Tab ─────────────────────────────────────────────────────────

function ProductTypesTab({ types }: { types: ProductType[] }) {
  const [modal, setModal] = useState<"create" | ProductType | null>(null);
  const [createState, createAction] = useActionState(createProductType, INIT);
  const [editState, editAction] = useActionState(updateProductType, INIT);

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
        <div className="text-center py-12 text-text-muted text-sm">No product types yet — add one above.</div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Description</th>
                <th className="px-5 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {types.map((t) => (
                <tr key={t.id} className="hover:bg-surface-secondary transition-colors">
                  <td className="px-5 py-3 font-medium text-text-primary">{t.name}</td>
                  <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{t.description ?? "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setModal(t)} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-accent hover:bg-accent-muted">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={async () => { if (await confirmDelete("This product type will be permanently deleted.")) deleteProductType(t.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create modal */}
      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Add Product Type">
        <form action={createAction} className="flex flex-col gap-4">
          <div><label className={labelCls}>Name <span className="text-error">*</span></label><input name="name" className={inputCls} placeholder="e.g. Egg" /></div>
          <div><label className={labelCls}>Description</label><input name="description" className={inputCls} placeholder="Optional description" /></div>
          {createState.error && <p className="text-xs text-error">{createState.error}</p>}
          <SubmitBtn label="Create Type" />
        </form>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setModal(null)} title="Edit Product Type">
        {editing && (
          <form action={editAction} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={editing.id} />
            <div><label className={labelCls}>Name <span className="text-error">*</span></label><input name="name" defaultValue={editing.name} className={inputCls} /></div>
            <div><label className={labelCls}>Description</label><input name="description" defaultValue={editing.description ?? ""} className={inputCls} /></div>
            {editState.error && <p className="text-xs text-error">{editState.error}</p>}
            <SubmitBtn label="Save Changes" />
          </form>
        )}
      </Modal>
    </div>
  );
}

// ── Products Tab ──────────────────────────────────────────────────────────────

function ProductsTab({ types, products }: { types: ProductType[]; products: Product[] }) {
  const [modal, setModal] = useState<"create" | Product | null>(null);
  const [createState, createAction] = useActionState(createProduct, INIT);
  const [editState, editAction] = useActionState(updateProduct, INIT);

  useEffect(() => { if (createState.success) setModal(null); }, [createState.success]);
  useEffect(() => { if (editState.success) setModal(null); }, [editState.success]);

  const editing = modal && modal !== "create" ? modal : null;

  const ProductForm = ({ product }: { product?: Product }) => (
    <div className="flex flex-col gap-4">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div>
        <label className={labelCls}>Product Type <span className="text-error">*</span></label>
        <select name="productTypeId" defaultValue={product?.productTypeId ?? ""} className={inputCls}>
          <option value="">Select type</option>
          {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Product Name (with weight) <span className="text-error">*</span></label>
        <input name="name" defaultValue={product?.name ?? ""} className={inputCls} placeholder="e.g. Quail Eggs 500g" />
      </div>
      <div>
        <label className={labelCls}>Weight Unit <span className="text-error">*</span></label>
        <select name="weightUnit" defaultValue={product?.weightUnit ?? ""} className={inputCls}>
          <option value="">Select weight</option>
          {WEIGHT_UNITS.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>MRP (LKR) <span className="text-error">*</span></label>
        <input name="mrp" type="number" step="0.01" min="0" defaultValue={product?.mrp ?? ""} className={inputCls} placeholder="0.00" />
      </div>
      <div>
        <label className={labelCls}>Description</label>
        <textarea name="description" defaultValue={product?.description ?? ""} rows={2} className={inputCls} placeholder="Optional description" />
      </div>
      {product && (
        <div>
          <label className={labelCls}>Status</label>
          <select name="isActive" defaultValue={String(product.isActive)} className={inputCls}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setModal("create")} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-accent text-accent-foreground">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No products yet — add one above.</div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Product</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Weight</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">MRP</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Status</th>
                  <th className="px-5 py-3 w-20" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-5 py-3 font-medium text-text-primary">{p.name}</td>
                    <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{p.typeName ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-accent-light text-accent-dark text-xs font-medium px-2 py-0.5">{p.weightUnit}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-text-primary">{formatCurrency(p.mrp)}</td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className={`rounded-full text-xs font-medium px-2.5 py-0.5 ${p.isActive ? "bg-success-lightest text-success-foreground" : "bg-surface-secondary text-text-secondary"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setModal(p)} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-accent hover:bg-accent-muted">
                          <Pencil className="w-3.5 h-3.5" />
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

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Add Product">
        <form action={createAction} className="flex flex-col gap-4">
          <ProductForm />
          {createState.error && <p className="text-xs text-error">{createState.error}</p>}
          <SubmitBtn label="Create Product" />
        </form>
      </Modal>

      <Modal open={!!editing} onClose={() => setModal(null)} title="Edit Product">
        {editing && (
          <form action={editAction} className="flex flex-col gap-4">
            <ProductForm product={editing} />
            {editState.error && <p className="text-xs text-error">{editState.error}</p>}
            <SubmitBtn label="Save Changes" />
          </form>
        )}
      </Modal>
    </div>
  );
}

// ── Cost Prices Tab ───────────────────────────────────────────────────────────

function CostPricesTab({ products, costPrices }: { products: Product[]; costPrices: CostPrice[] }) {
  const [modal, setModal] = useState(false);
  const [state, action] = useActionState(createCostPrice, INIT);

  useEffect(() => { if (state.success) setModal(false); }, [state.success]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{costPrices.length} record{costPrices.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-accent text-accent-foreground">
          <Plus className="w-3.5 h-3.5" /> Add Cost Price
        </button>
      </div>

      {costPrices.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No cost prices yet — add one above.</div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Product</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Packing</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Product</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Butcher</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Total Cost</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Effective</th>
                  <th className="px-5 py-3 w-14" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {costPrices.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-5 py-3 font-medium text-text-primary">{c.productName ?? "—"}</td>
                    <td className="px-5 py-3 text-right text-text-secondary">{formatCurrency(c.packingCost)}</td>
                    <td className="px-5 py-3 text-right text-text-secondary hidden sm:table-cell">{formatCurrency(c.productCost)}</td>
                    <td className="px-5 py-3 text-right text-text-secondary hidden md:table-cell">{formatCurrency(c.butcherCost)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-text-primary">{formatCurrency(c.productCostPrice)}</td>
                    <td className="px-5 py-3 text-text-muted hidden sm:table-cell">{formatDate(c.effectiveDate)}</td>
                    <td className="px-5 py-3">
                      <button onClick={async () => { if (await confirmDelete("This cost price will be permanently deleted.")) deleteCostPrice(c.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light mx-auto">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Cost Price">
        <form action={action} className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Product <span className="text-error">*</span></label>
            <select name="productId" className={inputCls}>
              <option value="">Select product</option>
              {products.filter((p) => p.isActive).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Packing (LKR)</label>
              <input name="packingCost" type="number" step="0.01" min="0" defaultValue="0" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Product (LKR)</label>
              <input name="productCost" type="number" step="0.01" min="0" defaultValue="0" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Butcher (LKR)</label>
              <input name="butcherCost" type="number" step="0.01" min="0" defaultValue="0" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Effective Date <span className="text-error">*</span></label>
            <input name="effectiveDate" type="date" className={inputCls} />
          </div>
          {state.error && <p className="text-xs text-error">{state.error}</p>}
          <SubmitBtn label="Save Cost Price" />
        </form>
      </Modal>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function ProductsAdminClient({
  types,
  products,
  costPrices,
}: {
  types: ProductType[];
  products: Product[];
  costPrices: CostPrice[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("Product Types");

  const tabIcons: Record<Tab, React.ReactNode> = {
    "Product Types": <Tag className="w-4 h-4" />,
    "Products": <Package className="w-4 h-4" />,
    "Cost Prices": <DollarSign className="w-4 h-4" />,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-base font-semibold text-text-primary">Products & Costs</h1>
        <p className="text-xs text-text-muted mt-0.5">Manage product types, products, and cost prices</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
            }`}
          >
            {tabIcons[tab]}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Product Types" && <ProductTypesTab types={types} />}
      {activeTab === "Products" && <ProductsTab types={types} products={products} />}
      {activeTab === "Cost Prices" && <CostPricesTab products={products} costPrices={costPrices} />}
    </div>
  );
}
