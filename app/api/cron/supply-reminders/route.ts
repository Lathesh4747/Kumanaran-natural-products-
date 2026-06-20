import { NextRequest, NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { supplies, supermarkets } from "@/db/schema";
import { sendSupplyReminderEmail, type SupplyReminderInfo } from "@/lib/email";
import { SUPPLY_REMINDER_DAYS } from "@/lib/utils";

export const runtime = "nodejs";

const REMINDER_EMAIL =
  process.env.REMINDER_EMAIL ?? process.env.ADMIN_EMAIL ?? "pathmanlathesh474@gmail.com";

/** Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`; manual runs may pass `?secret=`. */
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;
  return req.nextUrl.searchParams.get("secret") === secret;
}

/** Returns today − `days` as a `YYYY-MM-DD` string in UTC, matching the stored `date` column. */
function dateMinusDays(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().split("T")[0];
}

export async function GET(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const targetDate = dateMinusDays(SUPPLY_REMINDER_DAYS);

    const dueSupplies = await db
      .select({
        id: supplies.id,
        supplyDate: supplies.supplyDate,
        totalAmount: supplies.totalAmount,
        supermarketName: supermarkets.name,
        branchName: supermarkets.branchName,
        district: supermarkets.district,
        contactPerson: supermarkets.contactPerson,
        phone: supermarkets.phone,
      })
      .from(supplies)
      .innerJoin(supermarkets, eq(supplies.supermarketId, supermarkets.id))
      .where(and(eq(supplies.supplyDate, targetDate), isNull(supplies.reminderSentAt)));

    let sent = 0;
    for (const supply of dueSupplies) {
      const info: SupplyReminderInfo = {
        supplyId: supply.id,
        supermarketName: supply.supermarketName,
        branchName: supply.branchName,
        district: supply.district,
        contactPerson: supply.contactPerson,
        phone: supply.phone,
        supplyDate: supply.supplyDate,
        totalAmount: supply.totalAmount,
      };

      try {
        await sendSupplyReminderEmail({ toEmail: REMINDER_EMAIL, info });
        // Only stamp the flag once the email is away, so a failed send retries next run.
        await db
          .update(supplies)
          .set({ reminderSentAt: new Date() })
          .where(eq(supplies.id, supply.id));
        sent += 1;
      } catch (err) {
        console.error(`[cron/supply-reminders] supply ${supply.id} failed:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      data: { targetDate, due: dueSupplies.length, sent },
    });
  } catch (error) {
    console.error("[cron/supply-reminders]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
