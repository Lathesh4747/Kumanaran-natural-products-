import { Resend } from "resend";
import { formatCurrency, formatDate, SUPPLY_REMINDER_DAYS } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const WHATSAPP_NUMBER = "94705920748";

// In development: Resend only allows sending from onboarding@resend.dev
// In production: replace with noreply@yourdomain.com after verifying domain in Resend
const FROM = "Kumaran Natural Products <onboarding@resend.dev>";

function isResendConfigured(): boolean {
  return (
    !!process.env.RESEND_API_KEY &&
    process.env.RESEND_API_KEY !== "re_your_resend_api_key_here"
  );
}

// Construct the client lazily — never at module load. `new Resend()` throws
// when the key is missing, which would crash the build while Next collects
// page data for routes that import this module.
function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

// ─── Shared email layout ──────────────────────────────────────────────────────

function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f3f7f3;font-family:Inter,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid #e3e7df;overflow:hidden;">
          <!-- Green accent bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#2e7d46,#1f5c32);"></td>
          </tr>
          <!-- Logo row -->
          <tr>
            <td style="padding:32px 40px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(45deg,#2e7d46,#1f5c32);text-align:center;line-height:44px;">
                      <span style="color:#fff;font-size:20px;">🌿</span>
                    </div>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <p style="margin:0;font-size:15px;font-weight:700;color:#0f1a13;">Kumaran Natural Products</p>
                    <p style="margin:2px 0 0;font-size:11px;color:#8a988f;">Operations Portal</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:28px 40px 32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:18px 40px;border-top:1px solid #e3e7df;background:#f9fbf9;">
              <p style="margin:0;font-size:11px;color:#8a988f;text-align:center;">
                Kumaran Natural Products · Kalmunai, Sri Lanka
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Approval email ───────────────────────────────────────────────────────────

function approvalBody(name: string): string {
  return `
    <div style="width:56px;height:56px;border-radius:50%;background:#ecfdf2;text-align:center;line-height:56px;margin-bottom:24px;">
      <span style="color:#16a34a;font-size:28px;">✓</span>
    </div>
    <h1 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#16241c;">
      Your account has been approved!
    </h1>
    <p style="margin:0 0 8px;font-size:14px;color:#56655b;line-height:1.6;">
      Hi <strong style="color:#16241c;">${name}</strong>,
    </p>
    <p style="margin:0 0 28px;font-size:14px;color:#56655b;line-height:1.6;">
      Great news — the admin has <strong style="color:#16a34a;">approved your account</strong> for the
      Kumaran Natural Products Operations Portal. You now have full access to the system.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td>
          <a href="${SITE_URL}/sign-in"
             style="display:inline-block;background:#2e7d46;color:#ffffff;text-decoration:none;
                    padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;">
            Sign In Now →
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:12px;color:#8a988f;line-height:1.5;">
      If the button doesn't work, paste this link in your browser:<br/>
      <a href="${SITE_URL}/sign-in" style="color:#2e7d46;">${SITE_URL}/sign-in</a>
    </p>`;
}

// ─── Rejection email ──────────────────────────────────────────────────────────

function rejectionBody(name: string): string {
  const whatsappMsg = encodeURIComponent(
    `Hi, my account request for the Kumaran Natural Products portal was not approved. Can you please reconsider? My name: ${name}`
  );

  return `
    <div style="width:56px;height:56px;border-radius:50%;background:#fde4e4;text-align:center;line-height:56px;margin-bottom:24px;">
      <span style="color:#dc2626;font-size:28px;">✕</span>
    </div>
    <h1 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#16241c;">
      Your access request was not approved
    </h1>
    <p style="margin:0 0 8px;font-size:14px;color:#56655b;line-height:1.6;">
      Hi <strong style="color:#16241c;">${name}</strong>,
    </p>
    <p style="margin:0 0 24px;font-size:14px;color:#56655b;line-height:1.6;">
      Unfortunately, the admin has <strong style="color:#dc2626;">not approved</strong> your request
      to access the Kumaran Natural Products Operations Portal at this time.
    </p>
    <p style="margin:0 0 28px;font-size:14px;color:#56655b;line-height:1.6;">
      If you believe this is a mistake or would like to request reconsideration,
      please contact the admin directly via WhatsApp.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td>
          <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}"
             style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;
                    padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;">
            Contact Admin on WhatsApp
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:12px;color:#8a988f;line-height:1.5;">
      If you have any questions, reach out to the admin directly.
    </p>`;
}

// ─── Public send functions ────────────────────────────────────────────────────

export async function sendApprovalEmail({
  toEmail,
  toName,
}: {
  toEmail: string;
  toName: string;
}): Promise<void> {
  if (!isResendConfigured()) {
    console.warn("[email] RESEND_API_KEY not configured — approval email skipped");
    return;
  }

  const { error } = await getResend().emails.send({
    from: FROM,
    to: toEmail,
    subject: "✓ Your account has been approved — Kumaran Natural Products",
    html: emailWrapper(approvalBody(toName)),
  });

  if (error) {
    console.error("[email/sendApprovalEmail]", error);
    throw new Error("Failed to send approval email");
  }
}

export async function sendRejectionEmail({
  toEmail,
  toName,
}: {
  toEmail: string;
  toName: string;
}): Promise<void> {
  if (!isResendConfigured()) {
    console.warn("[email] RESEND_API_KEY not configured — rejection email skipped");
    return;
  }

  const { error } = await getResend().emails.send({
    from: FROM,
    to: toEmail,
    subject: "Your access request — Kumaran Natural Products",
    html: emailWrapper(rejectionBody(toName)),
  });

  if (error) {
    console.error("[email/sendRejectionEmail]", error);
    throw new Error("Failed to send rejection email");
  }
}

// ─── Supply reminder email ────────────────────────────────────────────────────

export type SupplyReminderInfo = {
  supplyId: number;
  supermarketName: string;
  branchName: string;
  district: string | null;
  contactPerson: string | null;
  phone: string | null;
  supplyDate: string;
  totalAmount: string;
};

function reminderRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;font-size:13px;color:#8a988f;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;font-size:13px;color:#16241c;font-weight:500;">${value}</td>
    </tr>`;
}

function reminderBody(info: SupplyReminderInfo): string {
  const branch = `${info.supermarketName} — ${info.branchName}`;
  const contact = info.contactPerson
    ? `${info.contactPerson}${info.phone ? ` · ${info.phone}` : ""}`
    : info.phone ?? "—";

  return `
    <div style="width:56px;height:56px;border-radius:50%;background:#fdedd7;text-align:center;line-height:56px;margin-bottom:24px;">
      <span style="color:#e0780a;font-size:26px;">🔔</span>
    </div>
    <h1 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#16241c;">
      Time to follow up on a supply
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#56655b;line-height:1.6;">
      It has been <strong style="color:#16241c;">${SUPPLY_REMINDER_DAYS} days</strong> since you supplied
      <strong style="color:#16241c;">${branch}</strong>. Consider visiting or contacting the branch to
      check on stock levels and collect any unsold or returned packets.
    </p>
    <table cellpadding="0" cellspacing="0" width="100%"
           style="background:#f9fbf9;border:1px solid #e3e7df;border-radius:12px;padding:8px 16px;margin-bottom:28px;">
      ${reminderRow("Branch", branch)}
      ${reminderRow("District", info.district ?? "—")}
      ${reminderRow("Supplied on", formatDate(info.supplyDate))}
      ${reminderRow("Supply total", formatCurrency(info.totalAmount))}
      ${reminderRow("Contact", contact)}
    </table>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td>
          <a href="${SITE_URL}/returns"
             style="display:inline-block;background:#2e7d46;color:#ffffff;text-decoration:none;
                    padding:12px 28px;border-radius:8px;font-size:14px;font-weight:500;">
            Record a Return →
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:12px;color:#8a988f;line-height:1.5;">
      You are receiving this because a supply reached its ${SUPPLY_REMINDER_DAYS}-day follow-up point.
      This reminder is sent only once per supply.
    </p>`;
}

export async function sendSupplyReminderEmail({
  toEmail,
  info,
}: {
  toEmail: string;
  info: SupplyReminderInfo;
}): Promise<void> {
  if (!isResendConfigured()) {
    console.warn("[email] RESEND_API_KEY not configured — supply reminder skipped");
    return;
  }

  const { error } = await getResend().emails.send({
    from: FROM,
    to: toEmail,
    subject: `🔔 Follow up: ${info.supermarketName} — ${info.branchName} (supplied ${SUPPLY_REMINDER_DAYS} days ago)`,
    html: emailWrapper(reminderBody(info)),
  });

  if (error) {
    console.error("[email/sendSupplyReminderEmail]", error);
    throw new Error("Failed to send supply reminder email");
  }
}
