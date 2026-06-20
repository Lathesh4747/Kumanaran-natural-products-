import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Users, ShieldCheck } from "lucide-react";
import ApproveButtons from "./approve-buttons";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Management" };

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "pathmanlathesh474@gmail.com";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminUsersPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";

  const meta = user.publicMetadata as { role?: string };
  const isAdmin = primaryEmail === ADMIN_EMAIL || meta.role === "admin";
  if (!isAdmin) redirect("/dashboard");

  const client = await clerkClient();
  const { data: allUsers } = await client.users.getUserList({
    limit: 100,
    orderBy: "-created_at",
  });

  // Separate admin from regular users
  const regularUsers = allUsers.filter((u) => {
    const email =
      u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
        ?.emailAddress ?? "";
    return email !== ADMIN_EMAIL;
  });

  const pendingCount = regularUsers.filter((u) => {
    const m = u.publicMetadata as { approved?: boolean };
    return !m.approved;
  }).length;

  return (
    <main className="min-h-screen px-6 py-12 max-w-[1440px] mx-auto">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-text-primary">
                User Management
              </h1>
              <p className="text-xs text-text-muted">
                Approve or revoke access to the operations portal
              </p>
            </div>
          </div>
          {pendingCount > 0 && (
            <span className="rounded-full bg-warning-light text-warning text-xs font-medium px-3 py-1">
              {pendingCount} pending
            </span>
          )}
        </div>

        {/* Users table */}
        <div className="glass-card overflow-hidden p-0">
          {regularUsers.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center px-6">
              <Users className="w-8 h-8 text-text-muted" />
              <p className="text-sm text-text-muted">No users have signed up yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase text-text-secondary tracking-wide">
                      User
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase text-text-secondary tracking-wide">
                      Joined
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium uppercase text-text-secondary tracking-wide">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium uppercase text-text-secondary tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {regularUsers.map((u) => {
                    const email =
                      u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
                        ?.emailAddress ?? "—";
                    const m = u.publicMetadata as { approved?: boolean };
                    const approved = m.approved === true;
                    const displayName =
                      u.firstName
                        ? `${u.firstName}${u.lastName ? " " + u.lastName : ""}`
                        : email;

                    return (
                      <tr
                        key={u.id}
                        className="border-b border-border last:border-0 hover:bg-surface-secondary transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-text-primary">{displayName}</p>
                          <p className="text-xs text-text-muted mt-0.5">{email}</p>
                        </td>
                        <td className="px-6 py-4 text-text-secondary text-xs">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          {approved ? (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-success-lightest text-success-foreground">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-warning-light text-warning">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ApproveButtons
                            targetUserId={u.id}
                            isApproved={approved}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-text-muted text-center">
          After approving a user, they must sign out and sign back in for access
          to take effect.
        </p>
      </div>
    </main>
  );
}
