"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, RotateCcw } from "lucide-react";

export type UserStatus = "pending" | "approved" | "rejected";

interface ApproveButtonsProps {
  targetUserId: string;
  status: UserStatus;
}

export default function ApproveButtons({ targetUserId, status }: ApproveButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    setError(null);
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
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {status === "pending" && (
          <>
            <button
              onClick={() => handleAction("approve")}
              disabled={loading !== null}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-accent text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {loading === "approve" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              Approve
            </button>
            <button
              onClick={() => handleAction("reject")}
              disabled={loading !== null}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-error-light text-error hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loading === "reject" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              Reject
            </button>
          </>
        )}

        {status === "approved" && (
          <button
            onClick={() => handleAction("reject")}
            disabled={loading !== null}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-error-light text-error hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading === "reject" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            Revoke
          </button>
        )}

        {status === "rejected" && (
          <button
            onClick={() => handleAction("approve")}
            disabled={loading !== null}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border border-border bg-surface text-text-secondary hover:bg-surface-secondary transition-colors disabled:opacity-50"
          >
            {loading === "approve" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            Re-approve
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-error">{error}</span>
      )}
    </div>
  );
}
