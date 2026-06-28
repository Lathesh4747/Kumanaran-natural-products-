"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Trash2, Loader2 } from "lucide-react";
import { confirmDelete, alertError } from "@/lib/alerts";

type Busy = "approve" | "reject" | "remove" | null;

export function UserActions({
  targetUserId,
  email,
  isApproved,
}: {
  targetUserId: string;
  email: string;
  isApproved: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<Busy>(null);

  async function setApproval(action: "approve" | "reject") {
    setBusy(action);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, action }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!data.success) throw new Error(data.error ?? "Unknown error");
      router.refresh();
    } catch (err) {
      await alertError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    const ok = await confirmDelete(
      `Permanently remove ${email}? They will lose all access immediately. This cannot be undone.`,
      "Remove user",
    );
    if (!ok) return;
    setBusy("remove");
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!data.success) throw new Error(data.error ?? "Unknown error");
      router.refresh();
    } catch (err) {
      await alertError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {isApproved ? (
        <button
          onClick={() => setApproval("reject")}
          disabled={busy !== null}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-warning-light text-warning hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {busy === "reject" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
          Revoke
        </button>
      ) : (
        <button
          onClick={() => setApproval("approve")}
          disabled={busy !== null}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-success-lightest text-success-foreground hover:bg-success-light transition-colors disabled:opacity-50"
        >
          {busy === "approve" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
          Approve
        </button>
      )}
      <button
        onClick={remove}
        disabled={busy !== null}
        aria-label="Remove user"
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-error-light text-error hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {busy === "remove" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        Remove
      </button>
    </div>
  );
}
