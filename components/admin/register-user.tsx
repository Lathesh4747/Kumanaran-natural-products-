"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";
import { alertSuccess, alertError } from "@/lib/alerts";

const inputCls =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-1 focus:ring-accent focus:border-accent";
const labelCls = "text-xs font-medium text-text-secondary";

export function RegisterUser() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  function reset() {
    setForm({ firstName: "", lastName: "", email: "", password: "" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!data.success) throw new Error(data.error ?? "Could not create the user");
      reset();
      setOpen(false);
      router.refresh();
      await alertSuccess(`${form.email} can now sign in with the password you set.`, "User registered");
    } catch (err) {
      await alertError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        Register user
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="glass-card-tint rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold text-text-primary">Register a new user</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelCls} htmlFor="ru-first">First name</label>
          <input id="ru-first" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputCls} placeholder="Nimal" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls} htmlFor="ru-last">Last name</label>
          <input id="ru-last" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputCls} placeholder="Perera (optional)" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls} htmlFor="ru-email">Email</label>
          <input id="ru-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="staff@example.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelCls} htmlFor="ru-pass">Temporary password</label>
          <input id="ru-pass" type="text" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} placeholder="At least 8 characters" />
        </div>
      </div>
      <p className="text-xs text-text-muted">
        The user is created already approved. Share the password with them — they can change it after signing in.
      </p>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => { setOpen(false); reset(); }}
          disabled={submitting}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Create user
        </button>
      </div>
    </form>
  );
}
