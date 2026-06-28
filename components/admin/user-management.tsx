import { clerkClient } from "@clerk/nextjs/server";
import { Users } from "lucide-react";
import { RegisterUser } from "./register-user";
import { UserActions } from "./user-actions";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "pathmanlathesh474@gmail.com";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Admin-only user management: register, approve/revoke, and remove users.
 * Reused on `/admin/users` and embedded below the dashboard. Renders nothing
 * unless the Clerk list resolves; failures degrade to an empty state.
 */
export async function UserManagement() {
  let users: Awaited<ReturnType<Awaited<ReturnType<typeof clerkClient>>["users"]["getUserList"]>>["data"] = [];
  try {
    const client = await clerkClient();
    const res = await client.users.getUserList({ limit: 100, orderBy: "-created_at" });
    users = res.data;
  } catch (error) {
    console.error("[UserManagement] getUserList", error);
  }

  const regular = users.filter((u) => {
    const email = u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ?? "";
    return email !== ADMIN_EMAIL;
  });

  const pendingCount = regular.filter((u) => !(u.publicMetadata as { approved?: boolean }).approved).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-text-primary">User Management</h2>
          {pendingCount > 0 && (
            <span className="rounded-full bg-warning-light text-warning text-xs font-medium px-2.5 py-0.5">
              {pendingCount} pending
            </span>
          )}
        </div>
        <RegisterUser />
      </div>

      <div className="glass-card overflow-hidden p-0">
        {regular.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center px-6">
            <Users className="w-8 h-8 text-text-muted" />
            <p className="text-sm text-text-muted">No staff users yet. Register one to grant portal access.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase text-text-secondary tracking-wide">User</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase text-text-secondary tracking-wide hidden sm:table-cell">Joined</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase text-text-secondary tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium uppercase text-text-secondary tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {regular.map((u) => {
                  const email = u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ?? "—";
                  const approved = (u.publicMetadata as { approved?: boolean }).approved === true;
                  const displayName = u.firstName ? `${u.firstName}${u.lastName ? " " + u.lastName : ""}` : email;
                  return (
                    <tr key={u.id} className="hover:bg-surface-secondary transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-text-primary">{displayName}</p>
                        <p className="text-xs text-text-muted mt-0.5">{email}</p>
                      </td>
                      <td className="px-5 py-4 text-text-secondary text-xs hidden sm:table-cell">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-4">
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
                      <td className="px-5 py-4">
                        <UserActions targetUserId={u.id} email={email} isApproved={approved} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-text-muted">
        Approved users must sign out and back in for access changes to take effect. Removing a user is immediate and permanent.
      </p>
    </div>
  );
}
