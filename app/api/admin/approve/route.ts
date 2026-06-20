import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "pathmanlathesh474@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const { userId: requestingUserId } = await auth();
    if (!requestingUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Verify the requesting user is the admin
    const client = await clerkClient();
    const requestingUser = await client.users.getUser(requestingUserId);
    const requestingEmail =
      requestingUser.emailAddresses.find(
        (e) => e.id === requestingUser.primaryEmailAddressId
      )?.emailAddress ?? "";

    const reqMeta = requestingUser.publicMetadata as { role?: string };
    const isAdmin = requestingEmail === ADMIN_EMAIL || reqMeta.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json()) as {
      targetUserId?: string;
      action?: "approve" | "reject";
    };
    const { targetUserId, action } = body;

    if (!targetUserId || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    // Fetch target user
    const targetUser = await client.users.getUser(targetUserId);
    const targetEmail =
      targetUser.emailAddresses.find(
        (e) => e.id === targetUser.primaryEmailAddressId
      )?.emailAddress ?? "";

    if (targetEmail === ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: "Cannot modify the admin account" },
        { status: 400 }
      );
    }

    const targetName = targetUser.firstName
      ? `${targetUser.firstName}${targetUser.lastName ? " " + targetUser.lastName : ""}`
      : targetEmail;

    // Update Clerk metadata
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        approved: action === "approve",
        role: "user",
      },
    });

    // Send email — fire-and-forget so a mail failure never breaks the response
    if (action === "approve") {
      sendApprovalEmail({ toEmail: targetEmail, toName: targetName }).catch((err) => {
        console.error("[admin/approve] approval email failed:", err);
      });
    } else {
      sendRejectionEmail({ toEmail: targetEmail, toName: targetName }).catch((err) => {
        console.error("[admin/approve] rejection email failed:", err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/approve]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
