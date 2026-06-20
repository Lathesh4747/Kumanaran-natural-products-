"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Pencil, Trash2, X, Car, PackageOpen } from "lucide-react";
import { createVehicle, updateVehicle, deleteVehicle, createVehicleLoading, deleteVehicleLoading } from "@/actions/vehicle";
import { confirmDelete } from "@/lib/alerts";
import { formatDate, today } from "@/lib/utils";

type Vehicle = { id: number; name: string; registrationNumber: string; driverName: string | null; capacity: number | null; status: string };
type Loading = { id: number; vehicleId: number; loadingDate: string; totalPackets: number; status: string; remarks: string | null; vehicleName: string | null };

const INIT = { success: false, error: undefined as string | undefined };
const tabs = ["Vehicles", "Loading Records"] as const;
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

function VehiclesTab({ vehicles }: { vehicles: Vehicle[] }) {
  const [modal, setModal] = useState<"create" | Vehicle | null>(null);
  const [createState, createAction] = useActionState(createVehicle, INIT);
  const [editState, editAction] = useActionState(updateVehicle, INIT);

  useEffect(() => { if (createState.success) setModal(null); }, [createState.success]);
  useEffect(() => { if (editState.success) setModal(null); }, [editState.success]);

  const editing = modal && modal !== "create" ? modal : null;

  const VehicleForm = ({ v }: { v?: Vehicle }) => (
    <div className="flex flex-col gap-4">
      {v && <input type="hidden" name="id" value={v.id} />}
      <div><label className={labelCls}>Vehicle Name <span className="text-error">*</span></label><input name="name" defaultValue={v?.name ?? ""} className={inputCls} placeholder="e.g. Delivery Van" /></div>
      <div><label className={labelCls}>Registration No. <span className="text-error">*</span></label><input name="registrationNumber" defaultValue={v?.registrationNumber ?? ""} className={inputCls} placeholder="e.g. KA-1234" /></div>
      <div><label className={labelCls}>Driver Name</label><input name="driverName" defaultValue={v?.driverName ?? ""} className={inputCls} /></div>
      <div><label className={labelCls}>Capacity (packets)</label><input name="capacity" type="number" min="1" defaultValue={v?.capacity ?? ""} className={inputCls} /></div>
      <div>
        <label className={labelCls}>Status</label>
        <select name="status" defaultValue={v?.status ?? "active"} className={inputCls}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setModal("create")} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-accent text-accent-foreground">
          <Plus className="w-3.5 h-3.5" /> Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No vehicles yet.</div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Vehicle</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Registration</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Driver</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Status</th>
              <th className="px-5 py-3 w-20" />
            </tr></thead>
            <tbody className="divide-y divide-border">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-surface-secondary transition-colors">
                  <td className="px-5 py-3 font-medium text-text-primary">{v.name}</td>
                  <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{v.registrationNumber}</td>
                  <td className="px-5 py-3 text-text-secondary hidden md:table-cell">{v.driverName ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full text-xs font-medium px-2.5 py-0.5 ${v.status === "active" ? "bg-success-lightest text-success-foreground" : "bg-surface-secondary text-text-secondary"}`}>{v.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setModal(v)} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-accent hover:bg-accent-muted"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={async () => { if (await confirmDelete("This vehicle will be permanently deleted.")) deleteVehicle(v.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal === "create"} onClose={() => setModal(null)} title="Add Vehicle">
        <form action={createAction} className="flex flex-col gap-4"><VehicleForm />{createState.error && <p className="text-xs text-error">{createState.error}</p>}<SubmitBtn label="Create Vehicle" /></form>
      </Modal>
      <Modal open={!!editing} onClose={() => setModal(null)} title="Edit Vehicle">
        {editing && <form action={editAction} className="flex flex-col gap-4"><VehicleForm v={editing} />{editState.error && <p className="text-xs text-error">{editState.error}</p>}<SubmitBtn label="Save Changes" /></form>}
      </Modal>
    </div>
  );
}

function LoadingsTab({ vehicles, loadings }: { vehicles: Vehicle[]; loadings: Loading[] }) {
  const [modal, setModal] = useState(false);
  const [state, action] = useActionState(createVehicleLoading, INIT);

  useEffect(() => { if (state.success) setModal(false); }, [state.success]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">{loadings.length} record{loadings.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium bg-accent text-accent-foreground">
          <Plus className="w-3.5 h-3.5" /> Add Loading
        </button>
      </div>

      {loadings.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No loading records yet.</div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Vehicle</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Packets</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">Status</th>
                <th className="px-5 py-3 w-14" />
              </tr></thead>
              <tbody className="divide-y divide-border">
                {loadings.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-5 py-3 text-text-primary">{formatDate(l.loadingDate)}</td>
                    <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{l.vehicleName ?? "—"}</td>
                    <td className="px-5 py-3 text-right font-semibold text-text-primary">{l.totalPackets.toLocaleString()}</td>
                    <td className="px-5 py-3"><span className="rounded-full bg-accent-light text-accent-dark text-xs font-medium px-2.5 py-0.5">{l.status}</span></td>
                    <td className="px-5 py-3"><button onClick={async () => { if (await confirmDelete("This loading record will be permanently deleted.")) deleteVehicleLoading(l.id); }} className="w-7 h-7 flex items-center justify-center rounded text-text-muted hover:text-error hover:bg-error-light mx-auto"><Trash2 className="w-3.5 h-3.5" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Loading Record">
        <form action={action} className="flex flex-col gap-4">
          <div><label className={labelCls}>Vehicle <span className="text-error">*</span></label>
            <select name="vehicleId" className={inputCls}><option value="">Select vehicle</option>{vehicles.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.registrationNumber})</option>)}</select>
          </div>
          <div><label className={labelCls}>Loading Date <span className="text-error">*</span></label><input name="loadingDate" type="date" defaultValue={today()} className={inputCls} /></div>
          <div><label className={labelCls}>Total Packets <span className="text-error">*</span></label><input name="totalPackets" type="number" min="1" className={inputCls} placeholder="0" /></div>
          <div><label className={labelCls}>Status</label>
            <select name="status" defaultValue="loaded" className={inputCls}>
              <option value="loaded">Loaded</option>
              <option value="dispatched">Dispatched</option>
              <option value="returned">Returned</option>
            </select>
          </div>
          <div><label className={labelCls}>Remarks</label><textarea name="remarks" rows={2} className={inputCls} /></div>
          {state.error && <p className="text-xs text-error">{state.error}</p>}
          <SubmitBtn label="Save Loading" />
        </form>
      </Modal>
    </div>
  );
}

export function VehicleClient({ vehicles, loadings }: { vehicles: Vehicle[]; loadings: Loading[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("Vehicles");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-base font-semibold text-text-primary">Vehicle</h1>
        <p className="text-xs text-text-muted mt-0.5">Manage vehicles and daily loading records</p>
      </div>
      <div className="flex gap-1 p-1 glass-card rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab ? "bg-accent text-accent-foreground" : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"}`}>
            {tab === "Vehicles" ? <Car className="w-4 h-4" /> : <PackageOpen className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>
      {activeTab === "Vehicles" && <VehiclesTab vehicles={vehicles} />}
      {activeTab === "Loading Records" && <LoadingsTab vehicles={vehicles} loadings={loadings} />}
    </div>
  );
}
