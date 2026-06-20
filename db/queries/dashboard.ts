import { db } from "@/db";
import {
  supplies,
  supplyDetails,
  supermarkets,
  products,
  returns,
  costPrices,
  expenses,
  feedPurchases,
  payments,
} from "@/db/schema";
import { and, gte, lte, eq, desc } from "drizzle-orm";
import { TOP_SUPERMARKETS_LIMIT } from "@/lib/utils";

export type PeriodType = "week" | "month" | "year" | "custom";
export type Period = { type: PeriodType; from: string; to: string; label: string };

const iso = (d: Date): string => d.toISOString().split("T")[0];

const fmtRange = (from: string, to: string): string => {
  const f = new Date(from + "T00:00:00");
  const t = new Date(to + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  return `${f.toLocaleDateString("en-GB", opts)} – ${t.toLocaleDateString("en-GB", opts)}`;
};

export function resolvePeriod(params: { period?: string; from?: string; to?: string }): Period {
  const type = (["week", "month", "year", "custom"].includes(params.period ?? "")
    ? params.period
    : "month") as PeriodType;
  const now = new Date();
  const to = iso(now);

  if (type === "custom" && params.from && params.to) {
    const from = params.from <= params.to ? params.from : params.to;
    const end = params.from <= params.to ? params.to : params.from;
    return { type, from, to: end, label: fmtRange(from, end) };
  }
  if (type === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    return { type, from: iso(start), to, label: "Last 7 days" };
  }
  if (type === "year") {
    const start = new Date(now.getFullYear(), 0, 1);
    return { type, from: iso(start), to, label: String(now.getFullYear()) };
  }
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    type: "month",
    from: iso(start),
    to,
    label: now.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
  };
}

export type Scope = { isAdmin: boolean; userId: string };

export type UserNetProfit = {
  userId: string;
  revenue: number;
  grossProfit: number;
  returnsLoss: number;
  expenses: number;
  netProfit: number;
};

export type DashboardData = {
  stats: { packets: number; grossProfit: number; returnRate: number; pendingPayments: number };
  netProfit: {
    revenue: number;
    grossProfit: number;
    returnsLoss: number;
    expenses: number;
    netProfit: number;
  };
  perUser: UserNetProfit[];
  topProductsBySale: { productId: number; name: string; qty: number; value: number }[];
  topProductsByProfit: { productId: number; name: string; profit: number }[];
  topDistricts: { district: string; value: number }[];
  topSupermarkets: { supermarketId: number; name: string; branch: string; value: number }[];
};

const n = (v: string | null): number => (v == null ? 0 : parseFloat(v) || 0);

export async function getDashboardData(period: Period, scope: Scope): Promise<DashboardData> {
  const inPeriod = (col: typeof supplies.supplyDate) => and(gte(col, period.from), lte(col, period.to));
  const ownSupply = scope.isAdmin ? undefined : eq(supplies.userId, scope.userId);

  // Supply line items within the period (+ owner, branch, district, product)
  const lineRows = await db
    .select({
      supplyId: supplyDetails.supplyId,
      ownerId: supplies.userId,
      productId: supplyDetails.productId,
      productName: products.name,
      qty: supplyDetails.quantitySupplied,
      sellingPrice: supplyDetails.sellingPrice,
      profitPrice: supplyDetails.profitPrice,
      supermarketId: supplies.supermarketId,
      supermarketName: supermarkets.name,
      branchName: supermarkets.branchName,
      district: supermarkets.district,
    })
    .from(supplyDetails)
    .innerJoin(supplies, eq(supplyDetails.supplyId, supplies.id))
    .leftJoin(supermarkets, eq(supplies.supermarketId, supermarkets.id))
    .leftJoin(products, eq(supplyDetails.productId, products.id))
    .where(and(inPeriod(supplies.supplyDate), ownSupply));

  // Returns within the period, attributed to the supply's owner
  const returnRows = await db
    .select({
      productId: returns.productId,
      qty: returns.returnQuantity,
      ownerId: supplies.userId,
    })
    .from(returns)
    .innerJoin(supplies, eq(returns.supplyId, supplies.id))
    .where(and(gte(returns.returnDate, period.from), lte(returns.returnDate, period.to), ownSupply));

  // Latest cost price per product for returns-loss valuation
  const costRows = await db
    .select({ productId: costPrices.productId, cost: costPrices.productCostPrice })
    .from(costPrices)
    .orderBy(desc(costPrices.effectiveDate));
  const costByProduct = new Map<number, number>();
  for (const c of costRows) if (!costByProduct.has(c.productId)) costByProduct.set(c.productId, n(c.cost));

  const expenseRows = await db
    .select({ amount: expenses.amount, ownerId: expenses.userId })
    .from(expenses)
    .where(
      and(
        gte(expenses.expenseDate, period.from),
        lte(expenses.expenseDate, period.to),
        scope.isAdmin ? undefined : eq(expenses.userId, scope.userId),
      ),
    );

  const feedRows = await db
    .select({ cost: feedPurchases.cost, ownerId: feedPurchases.userId })
    .from(feedPurchases)
    .where(
      and(
        gte(feedPurchases.purchaseDate, period.from),
        lte(feedPurchases.purchaseDate, period.to),
        scope.isAdmin ? undefined : eq(feedPurchases.userId, scope.userId),
      ),
    );

  const pendingRows = await db
    .select({ amount: payments.amount })
    .from(payments)
    .where(
      and(eq(payments.status, "pending"), scope.isAdmin ? undefined : eq(payments.userId, scope.userId)),
    );

  // ---- Aggregation ----
  let packets = 0;
  let revenue = 0;
  let grossProfit = 0;
  const byProduct = new Map<number, { name: string; qty: number; value: number; profit: number }>();
  const byDistrict = new Map<string, number>();
  const bySupermarket = new Map<number, { name: string; branch: string; value: number }>();
  const userAgg = new Map<string, UserNetProfit>();
  const getUser = (id: string | null): UserNetProfit => {
    const key = id ?? "";
    let u = userAgg.get(key);
    if (!u) {
      u = { userId: key, revenue: 0, grossProfit: 0, returnsLoss: 0, expenses: 0, netProfit: 0 };
      userAgg.set(key, u);
    }
    return u;
  };

  for (const r of lineRows) {
    const lineValue = n(r.sellingPrice) * r.qty;
    const lineProfit = n(r.profitPrice) * r.qty;
    packets += r.qty;
    revenue += lineValue;
    grossProfit += lineProfit;

    const p = byProduct.get(r.productId) ?? { name: r.productName ?? "—", qty: 0, value: 0, profit: 0 };
    p.qty += r.qty;
    p.value += lineValue;
    p.profit += lineProfit;
    byProduct.set(r.productId, p);

    const district = r.district ?? "Unspecified";
    byDistrict.set(district, (byDistrict.get(district) ?? 0) + lineValue);

    if (r.supermarketId != null) {
      const s = bySupermarket.get(r.supermarketId) ?? { name: r.supermarketName ?? "—", branch: r.branchName ?? "", value: 0 };
      s.value += lineValue;
      bySupermarket.set(r.supermarketId, s);
    }

    const u = getUser(r.ownerId);
    u.revenue += lineValue;
    u.grossProfit += lineProfit;
  }

  let returnsLoss = 0;
  let returnsQty = 0;
  for (const r of returnRows) {
    const loss = r.qty * (costByProduct.get(r.productId) ?? 0);
    returnsLoss += loss;
    returnsQty += r.qty;
    getUser(r.ownerId).returnsLoss += loss;
  }

  let expensesTotal = 0;
  for (const e of expenseRows) {
    expensesTotal += n(e.amount);
    getUser(e.ownerId).expenses += n(e.amount);
  }
  for (const f of feedRows) {
    expensesTotal += n(f.cost);
    getUser(f.ownerId).expenses += n(f.cost);
  }

  const pendingPayments = pendingRows.reduce((acc, p) => acc + n(p.amount), 0);

  for (const u of userAgg.values()) {
    u.netProfit = u.grossProfit - u.returnsLoss - u.expenses;
  }

  const topProductsBySale = [...byProduct.entries()]
    .map(([productId, v]) => ({ productId, name: v.name, qty: v.qty, value: v.value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const topProductsByProfit = [...byProduct.entries()]
    .map(([productId, v]) => ({ productId, name: v.name, profit: v.profit }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

  const topDistricts = [...byDistrict.entries()]
    .map(([district, value]) => ({ district, value }))
    .sort((a, b) => b.value - a.value);

  const topSupermarkets = [...bySupermarket.entries()]
    .map(([supermarketId, v]) => ({ supermarketId, name: v.name, branch: v.branch, value: v.value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, TOP_SUPERMARKETS_LIMIT);

  const perUser = [...userAgg.values()].sort((a, b) => b.netProfit - a.netProfit);

  return {
    stats: {
      packets,
      grossProfit,
      returnRate: packets > 0 ? (returnsQty / packets) * 100 : 0,
      pendingPayments,
    },
    netProfit: {
      revenue,
      grossProfit,
      returnsLoss,
      expenses: expensesTotal,
      netProfit: grossProfit - returnsLoss - expensesTotal,
    },
    perUser,
    topProductsBySale,
    topProductsByProfit,
    topDistricts,
    topSupermarkets,
  };
}
