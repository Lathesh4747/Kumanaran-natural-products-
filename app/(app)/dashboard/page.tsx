import { db } from "@/db";
import { beforeSupply, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";
import { getSessionUser } from "@/lib/auth";
import { resolvePeriod, getDashboardData } from "@/db/queries/dashboard";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { formatCurrency } from "@/lib/utils";
import { Package, TrendingUp, RotateCcw, Clock, FileDown, Trophy, MapPin, Store } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

type SP = Promise<{ period?: string; from?: string; to?: string }>;

async function resolveUserNames(ids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const real = ids.filter((id) => id);
  if (real.length === 0) return map;
  try {
    const client = await clerkClient();
    const res = await client.users.getUserList({ userId: real, limit: 100 });
    for (const u of res.data) {
      const email = u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ?? "";
      const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || email || u.id;
      map.set(u.id, name);
    }
  } catch (error) {
    console.error("[dashboard] resolveUserNames", error);
  }
  return map;
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-border-light">
      <div className="h-1.5 rounded-full bg-accent" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const session = await getSessionUser();
  const period = resolvePeriod(sp);
  const isAdmin = session?.isAdmin ?? false;
  const data = await getDashboardData(period, { isAdmin, userId: session?.id ?? "" }).catch((e) => {
    console.error("[dashboard] getDashboardData", e);
    return null;
  });

  const lowStock = await db
    .select({
      id: beforeSupply.id,
      batchNumber: beforeSupply.batchNumber,
      quantityRemaining: beforeSupply.quantityRemaining,
      productName: products.name,
    })
    .from(beforeSupply)
    .leftJoin(products, eq(beforeSupply.productId, products.id))
    .where(sql`${beforeSupply.quantityRemaining} > 0 and ${beforeSupply.quantityRemaining} <= 20`)
    .orderBy(beforeSupply.quantityRemaining)
    .limit(5)
    .catch(() => []);

  const d = data ?? {
    stats: { packets: 0, grossProfit: 0, returnRate: 0, pendingPayments: 0 },
    netProfit: { revenue: 0, grossProfit: 0, returnsLoss: 0, expenses: 0, netProfit: 0 },
    perUser: [],
    topProductsBySale: [],
    topProductsByProfit: [],
    topDistricts: [],
    topSupermarkets: [],
  };

  const userNames = isAdmin ? await resolveUserNames(d.perUser.map((u) => u.userId)) : new Map();

  const statCards = [
    { label: "Total Packets Supplied", value: d.stats.packets.toLocaleString(), icon: Package, iconBg: "bg-accent-light", iconColor: "text-accent" },
    { label: isAdmin ? "Net Profit" : "Your Net Profit", value: formatCurrency(d.netProfit.netProfit), icon: TrendingUp, iconBg: d.netProfit.netProfit >= 0 ? "bg-success-lightest" : "bg-error-light", iconColor: d.netProfit.netProfit >= 0 ? "text-success" : "text-error", profit: true },
    { label: "Return Rate", value: `${d.stats.returnRate.toFixed(1)}%`, icon: RotateCcw, iconBg: "bg-warning-light", iconColor: "text-warning" },
    { label: "Pending Payments", value: formatCurrency(d.stats.pendingPayments), icon: Clock, iconBg: "bg-harvest-light", iconColor: "text-harvest" },
  ];

  const q = (type: string) => `/api/reports/${type}?period=${period.type}&from=${period.from}&to=${period.to}`;
  const reports = [
    { type: "net-profit", label: "Net Profit" },
    { type: "sales", label: "Sales Analytics" },
    { type: "supply", label: "Supply" },
    { type: "returns", label: "Returns" },
  ];

  const maxSale = Math.max(1, ...d.topProductsBySale.map((p) => p.value));
  const maxDistrict = Math.max(1, ...d.topDistricts.map((p) => p.value));
  const maxSupermarket = Math.max(1, ...d.topSupermarkets.map((p) => p.value));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-semibold text-text-primary">Dashboard</h1>
        <p className="text-xs text-text-muted">
          {period.label}
          {!isAdmin && " · Your figures only"}
        </p>
      </div>

      <PeriodSelector active={period.type} from={period.from} to={period.to} />

      {/* PDF downloads */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-text-secondary flex items-center gap-1.5"><FileDown className="w-3.5 h-3.5" /> Download PDF:</span>
        {reports.map((r) => (
          <a key={r.type} href={q(r.type)} target="_blank" rel="noopener noreferrer" className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-secondary">
            {r.label}
          </a>
        ))}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, iconBg, iconColor, profit }) => (
          <div key={label} className="glass-card p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-[30px] font-semibold leading-9 truncate ${profit ? (d.netProfit.netProfit >= 0 ? "text-success" : "text-error") : "text-text-primary"}`}>{value}</p>
              <p className="text-xs text-text-muted mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Net profit breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-primary">Net Profit Breakdown</h2>
          {[
            { label: "Revenue", value: d.netProfit.revenue, tone: "text-text-primary" },
            { label: "Gross profit", value: d.netProfit.grossProfit, tone: "text-text-primary" },
            { label: "Returns loss", value: -d.netProfit.returnsLoss, tone: "text-error" },
            { label: "Expenses", value: -d.netProfit.expenses, tone: "text-error" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{row.label}</span>
              <span className={`font-medium ${row.tone}`}>{formatCurrency(row.value)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
            <span className="text-sm font-semibold text-text-primary">Net profit</span>
            <span className={`text-base font-semibold ${d.netProfit.netProfit >= 0 ? "text-success" : "text-error"}`}>{formatCurrency(d.netProfit.netProfit)}</span>
          </div>
        </div>

        {/* Per-user net profit (admin only) */}
        {isAdmin && (
          <div className="glass-card p-0 overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Net Profit by User</h2>
              <p className="text-xs text-text-muted mt-0.5">Each user&apos;s supplies minus their returns and expenses</p>
            </div>
            {d.perUser.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-text-muted">No activity in this period</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-left text-xs font-medium uppercase text-text-secondary">User</th>
                      <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary hidden sm:table-cell">Gross</th>
                      <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Returns</th>
                      <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary hidden md:table-cell">Expenses</th>
                      <th className="px-5 py-3 text-right text-xs font-medium uppercase text-text-secondary">Net Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {d.perUser.map((u) => (
                      <tr key={u.userId || "unattributed"} className="hover:bg-surface-secondary transition-colors">
                        <td className="px-5 py-3 font-medium text-text-primary">{u.userId ? userNames.get(u.userId) ?? "Unknown user" : "Unattributed"}</td>
                        <td className="px-5 py-3 text-right text-text-secondary hidden sm:table-cell">{formatCurrency(u.grossProfit)}</td>
                        <td className="px-5 py-3 text-right text-error hidden md:table-cell">{formatCurrency(u.returnsLoss)}</td>
                        <td className="px-5 py-3 text-right text-error hidden md:table-cell">{formatCurrency(u.expenses)}</td>
                        <td className={`px-5 py-3 text-right font-semibold ${u.netProfit >= 0 ? "text-success" : "text-error"}`}>{formatCurrency(u.netProfit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Analytics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products by sale */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">Top Products by Sales</h2>
          </div>
          {d.topProductsBySale.length === 0 ? (
            <p className="text-sm text-text-muted py-4 text-center">No sales in this period</p>
          ) : (
            <div className="flex flex-col gap-3">
              {d.topProductsBySale.map((p) => (
                <div key={p.productId} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-text-primary">{p.name}</span>
                    <span className="text-text-secondary">{formatCurrency(p.value)} · {p.qty.toLocaleString()} pkts</span>
                  </div>
                  <Bar value={p.value} max={maxSale} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products by profit */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <h2 className="text-sm font-semibold text-text-primary">Top Products by Profit</h2>
          </div>
          {d.topProductsByProfit.length === 0 ? (
            <p className="text-sm text-text-muted py-4 text-center">No sales in this period</p>
          ) : (
            <div className="divide-y divide-border">
              {d.topProductsByProfit.map((p, i) => (
                <div key={p.productId} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 text-xs font-semibold text-text-muted">{i + 1}</span>
                    <span className="font-medium text-text-primary">{p.name}</span>
                  </span>
                  <span className={`font-semibold ${p.profit >= 0 ? "text-success" : "text-error"}`}>{formatCurrency(p.profit)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top districts */}
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">Sales by District</h2>
          </div>
          {d.topDistricts.length === 0 ? (
            <p className="text-sm text-text-muted py-4 text-center">No sales in this period</p>
          ) : (
            <div className="flex flex-col gap-3">
              {d.topDistricts.slice(0, 10).map((p) => (
                <div key={p.district} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-text-primary">{p.district}</span>
                    <span className="text-text-secondary">{formatCurrency(p.value)}</span>
                  </div>
                  <Bar value={p.value} max={maxDistrict} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top supermarkets */}
        <div className="glass-card p-0 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Store className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">Top Supermarkets</h2>
            <span className="text-xs text-text-muted">(top {d.topSupermarkets.length})</span>
          </div>
          {d.topSupermarkets.length === 0 ? (
            <p className="text-sm text-text-muted py-8 text-center">No sales in this period</p>
          ) : (
            <div className="max-h-[360px] overflow-y-auto divide-y divide-border">
              {d.topSupermarkets.map((s, i) => (
                <div key={s.supermarketId} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="w-5 text-xs font-semibold text-text-muted flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{s.name}</p>
                    <p className="text-xs text-text-muted truncate">{s.branch}</p>
                  </div>
                  <div className="flex-shrink-0 w-24">
                    <Bar value={s.value} max={maxSupermarket} />
                  </div>
                  <span className="text-sm font-semibold text-text-primary flex-shrink-0 w-28 text-right">{formatCurrency(s.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="glass-card p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <h2 className="text-sm font-semibold text-text-primary">Low Stock</h2>
          </div>
          <div className="divide-y divide-border">
            {lowStock.map((b) => (
              <div key={b.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{b.productName}</p>
                  <p className="text-xs text-text-muted">Batch {b.batchNumber}</p>
                </div>
                <span className="flex-shrink-0 rounded-full bg-warning-light text-warning text-xs font-medium px-2.5 py-0.5 ml-3">{b.quantityRemaining} left</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
