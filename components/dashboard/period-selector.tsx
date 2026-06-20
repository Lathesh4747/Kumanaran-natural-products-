"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { PeriodType } from "@/db/queries/dashboard";

const OPTIONS: { value: PeriodType; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "custom", label: "Custom" },
];

export function PeriodSelector({ active, from, to }: { active: PeriodType; from: string; to: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [customFrom, setCustomFrom] = useState(from);
  const [customTo, setCustomTo] = useState(to);

  function select(value: PeriodType) {
    const next = new URLSearchParams(params.toString());
    next.set("period", value);
    if (value !== "custom") {
      next.delete("from");
      next.delete("to");
    } else {
      next.set("from", customFrom);
      next.set("to", customTo);
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  function applyCustom() {
    const next = new URLSearchParams(params.toString());
    next.set("period", "custom");
    next.set("from", customFrom);
    next.set("to", customTo);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => select(o.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === o.value
                ? "bg-accent text-accent-foreground"
                : "bg-surface border border-border text-text-dark hover:bg-surface-secondary"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {active === "custom" && (
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">From</label>
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">To</label>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <button onClick={applyCustom} className="rounded-md px-4 py-1.5 text-sm font-medium bg-accent text-accent-foreground">Apply</button>
        </div>
      )}
    </div>
  );
}
