import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { clerkClient } from "@clerk/nextjs/server";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { db } from "@/db";
import { supplies, supermarkets, returns, products } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { resolvePeriod, getDashboardData } from "@/db/queries/dashboard";
import {
  netProfitDocument,
  salesDocument,
  supplyDocument,
  returnsDocument,
  type SupplyReportRow,
  type ReturnReportRow,
} from "@/lib/pdf";

export const runtime = "nodejs";

const VALID = ["net-profit", "sales", "supply", "returns"] as const;
type ReportType = (typeof VALID)[number];

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params;
    if (!VALID.includes(type as ReportType)) {
      return NextResponse.json({ success: false, error: "Unknown report type" }, { status: 400 });
    }

    const session = await getSessionUser();
    if (!session) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const sp = req.nextUrl.searchParams;
    const period = resolvePeriod({
      period: sp.get("period") ?? undefined,
      from: sp.get("from") ?? undefined,
      to: sp.get("to") ?? undefined,
    });
    const scope = { isAdmin: session.isAdmin, userId: session.id };
    const scopeNote = session.isAdmin ? "All users" : `Your records — ${session.name}`;
    const ownSupply = session.isAdmin ? undefined : eq(supplies.userId, session.id);

    let buffer: Buffer;
    let filename: string;

    if (type === "net-profit") {
      const data = await getDashboardData(period, scope);
      const perUserNames: Record<string, string> = {};
      const ids = data.perUser.map((u) => u.userId).filter((id) => id);
      if (ids.length) {
        try {
          const client = await clerkClient();
          const res = await client.users.getUserList({ userId: ids, limit: 100 });
          for (const u of res.data) {
            const email = u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ?? "";
            perUserNames[u.id] = [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || email || u.id;
          }
        } catch (e) {
          console.error("[api/reports] clerk names", e);
        }
      }
      buffer = await renderToBuffer(netProfitDocument({ period, data, scopeNote, perUserNames }));
      filename = "net-profit";
    } else if (type === "sales") {
      const data = await getDashboardData(period, scope);
      buffer = await renderToBuffer(salesDocument({ period, data, scopeNote }));
      filename = "sales-analytics";
    } else if (type === "supply") {
      const rows = await db
        .select({
          date: supplies.supplyDate,
          supermarket: supermarkets.name,
          branch: supermarkets.branchName,
          district: supermarkets.district,
          amount: supplies.totalAmount,
          status: supplies.status,
        })
        .from(supplies)
        .leftJoin(supermarkets, eq(supplies.supermarketId, supermarkets.id))
        .where(and(gte(supplies.supplyDate, period.from), lte(supplies.supplyDate, period.to), ownSupply))
        .orderBy(desc(supplies.supplyDate));
      const mapped: SupplyReportRow[] = rows.map((r) => ({
        date: r.date,
        supermarket: r.supermarket ?? "—",
        branch: r.branch ?? "",
        district: r.district ?? "",
        amount: parseFloat(r.amount) || 0,
        status: r.status,
      }));
      buffer = await renderToBuffer(supplyDocument({ period, rows: mapped, scopeNote }));
      filename = "supply-report";
    } else {
      const rows = await db
        .select({
          date: returns.returnDate,
          product: products.name,
          supermarket: supermarkets.name,
          branch: supermarkets.branchName,
          reason: returns.returnReason,
          weight: returns.weightUnit,
          qty: returns.returnQuantity,
        })
        .from(returns)
        .innerJoin(supplies, eq(returns.supplyId, supplies.id))
        .leftJoin(supermarkets, eq(supplies.supermarketId, supermarkets.id))
        .leftJoin(products, eq(returns.productId, products.id))
        .where(and(gte(returns.returnDate, period.from), lte(returns.returnDate, period.to), ownSupply))
        .orderBy(desc(returns.returnDate));
      const mapped: ReturnReportRow[] = rows.map((r) => ({
        date: r.date,
        product: r.product ?? "—",
        branch: r.supermarket ? `${r.supermarket}${r.branch ? ` (${r.branch})` : ""}` : "—",
        reason: r.reason,
        weight: r.weight,
        qty: r.qty,
      }));
      buffer = await renderToBuffer(returnsDocument({ period, rows: mapped, scopeNote }));
      filename = "returns-report";
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}-${period.from}-to-${period.to}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[api/reports]", error);
    return NextResponse.json({ success: false, error: "Failed to generate report" }, { status: 500 });
  }
}
