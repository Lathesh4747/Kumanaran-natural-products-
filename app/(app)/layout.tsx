import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/app-navbar";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "pathmanlathesh474@gmail.com";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const primaryEmail =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";

  const isAdminEmail = primaryEmail === ADMIN_EMAIL;
  const meta = user.publicMetadata as { role?: string; approved?: boolean };
  const isAdmin = meta.role === "admin";
  const isApproved = meta.approved === true;

  if (isAdminEmail && !isAdmin) {
    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { role: "admin", approved: true },
    });
  }

  if (!isAdminEmail && !isAdmin && !isApproved) {
    redirect("/pending-approval");
  }

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
