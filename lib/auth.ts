import { auth, currentUser } from "@clerk/nextjs/server";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

/** Clerk user id for stamping ownership on operational rows (server-only). */
export async function getOwnerId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/** Full session user for the dashboard — `isAdmin` decides company-wide vs own-only views. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const user = await currentUser();
  if (!user) return null;
  const meta = user.publicMetadata as { role?: string };
  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    email ||
    "User";
  return { id: user.id, name, email, isAdmin: meta.role === "admin" };
}
