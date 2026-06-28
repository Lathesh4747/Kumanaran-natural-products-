import { RotateCcw, PackageX, Scale } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { DashboardData } from "@/db/queries/dashboard";

type ReturnAnalytics = DashboardData["returnAnalytics"];

const REASON_TONE: Record<string, string> = {
  Expired: "bg-error-light text-error",
  Damaged: "bg-error-light text-error",
  "Quality Issue": "bg-warning-light text-warning",
  "Near Expiry": "bg-warning-light text-warning",
  Unsold: "bg-surface-secondary text-text-secondary",
};

function Bar({ value, max, fill = "bg-warning" }: { value: number; max: number; fill?: string }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-border-light">
      <div className={`h-1.5 rounded-full ${fill}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function ReturnAnalytics({ data, rateAlert }: { data: ReturnAnalytics; rateAlert: boolean }) {
  const maxReturned = Math.max(1, ...data.mostReturned.map((p) => p.qty));
  const maxWeight = Math.max(1, ...data.byWeight.map((w) => w.qty));
  const empty = data.totalReturns === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary */}
      <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-warning" />
          <h2 className="text-sm font-semibold text-text-primary">Return Analytics</h2>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Return rate</span>
            <span className={`text-2xl font-semibold ${rateAlert ? "text-error" : "text-text-primary"}`}>
              {data.returnRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Packets returned</span>
            <span className="font-medium text-text-primary">{data.totalReturns.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Returns loss</span>
            <span className="font-medium text-error">{formatCurrency(data.returnsLoss)}</span>
          </div>
        </div>
        {/* Reason breakdown */}
        <div className="border-t border-border pt-3 flex flex-col gap-2">
          <p className="text-xs font-medium uppercase text-text-secondary">By reason</p>
          {empty ? (
            <p className="text-sm text-text-muted">No returns in this period</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {data.byReason.map((r) => (
                <div key={r.reason} className="flex items-center justify-between text-sm">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${REASON_TONE[r.reason] ?? "bg-surface-secondary text-text-secondary"}`}>
                    {r.reason}
                  </span>
                  <span className="font-medium text-text-primary">{r.qty.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Most returned products */}
      <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <PackageX className="w-4 h-4 text-error" />
          <h2 className="text-sm font-semibold text-text-primary">Most Returned Products</h2>
        </div>
        {empty ? (
          <p className="text-sm text-text-muted py-4 text-center">No returns in this period</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.mostReturned.map((p) => (
              <div key={p.productId} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text-primary">{p.name}</span>
                  <span className="text-text-secondary">{p.qty.toLocaleString()} pkts</span>
                </div>
                <Bar value={p.qty} max={maxReturned} fill="bg-error" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weight split */}
      <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-harvest" />
          <h2 className="text-sm font-semibold text-text-primary">Returns by Packet Size</h2>
        </div>
        {empty ? (
          <p className="text-sm text-text-muted py-4 text-center">No returns in this period</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.byWeight.map((w) => (
              <div key={w.weightUnit} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text-primary">{w.weightUnit}</span>
                  <span className="text-text-secondary">
                    {w.qty.toLocaleString()} pkts ·{" "}
                    {data.totalReturns > 0 ? Math.round((w.qty / data.totalReturns) * 100) : 0}%
                  </span>
                </div>
                <Bar value={w.qty} max={maxWeight} fill={w.weightUnit === "500g" ? "bg-harvest" : "bg-accent"} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
