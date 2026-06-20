import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Clock, LogOut, MessageCircle, XCircle } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Account Status" };

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "pathmanlathesh474@gmail.com";
const WHATSAPP_NUMBER = "94705920748";

export default async function PendingApprovalPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";

  // Admin and approved users should not be here
  const isAdminEmail = primaryEmail === ADMIN_EMAIL;
  const meta = user.publicMetadata as { role?: string; approved?: boolean };
  if (isAdminEmail || meta.role === "admin" || meta.approved === true) {
    redirect("/dashboard");
  }

  // Distinguish: explicitly rejected (false) vs still pending (undefined)
  const isRejected = meta.approved === false;

  const displayName = user.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : primaryEmail;

  const whatsappMsg = encodeURIComponent(
    isRejected
      ? `Hi, my account for the Kumaran Natural Products portal was rejected. Can you reconsider? Email: ${primaryEmail}`
      : `Hi, I need access to the Kumaran Natural Products operations portal. My email: ${primaryEmail}`
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image
            alt="Kumaran Natural Products logo"
            height={56}
            src="/Kumaran natural product logo.png"
            style={{ width: 56, height: 56 }}
            width={56}
          />
          <p className="text-[19px] font-bold leading-7 text-text-darkest">
            Kumaran Natural Products
          </p>
        </div>

        {/* Glass card */}
        <div className="glass-card p-8 flex flex-col items-center gap-6 text-center">
          {/* Status icon */}
          {isRejected ? (
            <div className="w-16 h-16 rounded-full bg-error-light flex items-center justify-center">
              <XCircle className="w-8 h-8 text-error" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-harvest-light flex items-center justify-center">
              <Clock className="w-8 h-8 text-harvest" />
            </div>
          )}

          {/* Message */}
          <div className="flex flex-col gap-2">
            <h1 className="text-base font-semibold text-text-primary">
              {isRejected ? "Access Request Rejected" : "Waiting for Approval"}
            </h1>
            <p className="text-sm text-text-secondary">
              {isRejected ? (
                <>
                  Hi <span className="font-medium text-text-primary">{displayName}</span>,
                  your request to access the operations portal has been rejected by the admin.
                  You can contact the admin to request reconsideration.
                </>
              ) : (
                <>
                  Hi <span className="font-medium text-text-primary">{displayName}</span>,
                  your account has been created and is waiting for admin approval before
                  you can access the operations portal.
                </>
              )}
            </p>
          </div>

          {/* Email display */}
          <div className="w-full rounded-lg bg-surface-secondary border border-border px-4 py-3">
            <p className="text-xs text-text-muted">Signed in as</p>
            <p className="text-sm font-medium text-text-primary mt-0.5">{primaryEmail}</p>
          </div>

          {/* Status badge */}
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${
              isRejected
                ? "bg-error-light text-error"
                : "bg-harvest-light text-harvest-foreground"
            }`}
          >
            {isRejected ? (
              <XCircle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            {isRejected ? "Request rejected" : "Pending admin approval"}
          </div>

          <div className="w-full flex flex-col gap-3">
            {/* Contact admin via WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-md px-4 py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: "#16a34a" }}
            >
              <MessageCircle className="w-4 h-4" />
              Contact Admin on WhatsApp
            </a>

            {/* Sign out */}
            <SignOutButton redirectUrl="/sign-in">
              <button className="flex items-center justify-center gap-2 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors">
                <LogOut className="w-4 h-4 text-text-secondary" />
                Sign Out
              </button>
            </SignOutButton>
          </div>

          <p className="text-xs text-text-muted">
            {isRejected
              ? "If you believe this is a mistake, please contact the admin."
              : "Once approved, sign back in and you will have full access."}
          </p>
        </div>
      </div>
    </main>
  );
}
