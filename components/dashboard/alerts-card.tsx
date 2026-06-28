import { AlertTriangle, PackageX, Clock, CalendarClock, CheckCircle2 } from "lucide-react";
import type { Alert } from "@/db/queries/dashboard";

const ICONS = {
  "high-return": AlertTriangle,
  "low-stock": PackageX,
  "overdue-payment": Clock,
  "follow-up": CalendarClock,
} as const;

const TONES = {
  error: { dot: "bg-error", iconBg: "bg-error-light", iconColor: "text-error" },
  warning: { dot: "bg-warning", iconBg: "bg-warning-light", iconColor: "text-warning" },
  info: { dot: "bg-info", iconBg: "bg-info-light", iconColor: "text-info" },
} as const;

export function AlertsCard({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="glass-card p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        {alerts.length > 0 && <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />}
        <h2 className="text-sm font-semibold text-text-primary">Alerts</h2>
        {alerts.length > 0 && (
          <span className="ml-auto rounded-full bg-warning-light text-warning text-xs font-medium px-2.5 py-0.5">
            {alerts.length}
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center px-6">
          <CheckCircle2 className="w-7 h-7 text-success" />
          <p className="text-sm text-text-muted">All clear — nothing needs your attention.</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {alerts.map((a) => {
            const Icon = ICONS[a.kind];
            const tone = TONES[a.tone];
            return (
              <div key={a.kind} className="flex items-start gap-3 px-5 py-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tone.iconBg}`}>
                  <Icon className={`w-4 h-4 ${tone.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">{a.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{a.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
