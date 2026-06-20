"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ApproveButtonsProps {
  targetUserId: string;
  isApproved: boolean;
}

export default function ApproveButtons({ targetUserId, isApproved }: ApproveButtonsProps) {
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
    <div className="flex items-center gap-2">
      {error && (
        <span className="text-xs text-error mr-1">{error}</span>
      )}
      {!isApproved ? (
        <button
          onClick={() => handleAction("approve")}
          disabled={loading !== null}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium bg-success-lightest text-success-foreground hover:bg-success-light transition-colors disabled:opacity-50"
        >
          {loading === "approve" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5" />
          )}
          Approve
        </button>
      ) : (
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
    </div>
  );
}
