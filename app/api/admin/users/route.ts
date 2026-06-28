import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "pathmanlathesh474@gmail.com";

type AdminClient = Awaited<ReturnType<typeof clerkClient>>;

async function requireAdmin(): Promise<
  { ok: true; client: AdminClient } | { ok: false; status: number; error: string }
> {
  const { userId } = await auth();
  if (!userId) return { ok: false, status: 401, error: "Unauthorized" };

  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  const email = me.emailAddresses.find((e) => e.id === me.primaryEmailAddressId)?.emailAddress ?? "";
  const meta = me.publicMetadata as { role?: string };
  if (email !== ADMIN_EMAIL && meta.role !== "admin") {
    return { ok: false, status: 403, error: "Forbidden" };
  }
  return { ok: true, client };
}

const registerSchema = z.object({
  email: z.string().email("A valid email is required"),
  firstName: z.string().trim().min(1, "Name is required").max(60),
  lastName: z.string().trim().max(60).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/** Register (create) a new pre-approved operations user. */
export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return NextResponse.json({ success: false, error: guard.error }, { status: guard.status });

    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    const { email, firstName, lastName, password } = parsed.data;

    await guard.client.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName: lastName || undefined,
      publicMetadata: { approved: true, role: "user" },
      skipPasswordChecks: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/users] register", error);
    const message = clerkErrorMessage(error) ?? "Could not create the user";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

const removeSchema = z.object({ targetUserId: z.string().min(1) });

/** Permanently remove a user from the operations portal. */
export async function DELETE(req: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return NextResponse.json({ success: false, error: guard.error }, { status: guard.status });

    const parsed = removeSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }

    const target = await guard.client.users.getUser(parsed.data.targetUserId);
    const targetEmail = target.emailAddresses.find((e) => e.id === target.primaryEmailAddressId)?.emailAddress ?? "";
    if (targetEmail === ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: "Cannot remove the admin account" }, { status: 400 });
    }

    await guard.client.users.deleteUser(parsed.data.targetUserId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/users] remove", error);
    return NextResponse.json({ success: false, error: "Could not remove the user" }, { status: 500 });
  }
}

function clerkErrorMessage(error: unknown): string | null {
  if (error && typeof error === "object" && "errors" in error) {
    const errs = (error as { errors?: Array<{ message?: string; longMessage?: string }> }).errors;
    const first = errs?.[0];
    if (first) return first.longMessage ?? first.message ?? null;
  }
  return null;
}
