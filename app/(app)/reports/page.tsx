import { BarChart3 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-base font-semibold text-text-primary">Reports</h1>
        <p className="text-xs text-text-muted mt-0.5">PDF reports — supply, returns, net profit, and expenses</p>
      </div>
      <div className="glass-card p-12 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent-muted flex items-center justify-center">
          <BarChart3 className="w-7 h-7 text-accent" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">PDF Reports</p>
          <p className="text-sm text-text-secondary mt-1 max-w-sm">
            Supply, returns, net profit, and expense reports for weekly / monthly / custom periods.
            Coming in Phase 5 after operations data is collected.
          </p>
        </div>
      </div>
    </div>
  );
}
