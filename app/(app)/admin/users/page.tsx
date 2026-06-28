import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { UserManagement } from "@/components/admin/user-management";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Management" };

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "pathmanlathesh474@gmail.com";

export default async function AdminUsersPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ?? "";
  const meta = user.publicMetadata as { role?: string };
  const isAdmin = primaryEmail === ADMIN_EMAIL || meta.role === "admin";
  if (!isAdmin) redirect("/dashboard");

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-text-primary">User Management</h1>
          <p className="text-xs text-text-muted">Register, approve, or remove access to the operations portal</p>
        </div>
      </div>

      <UserManagement />
    </div>
  );
}
