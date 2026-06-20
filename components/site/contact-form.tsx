"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, Send } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { submitContactForm, type ContactState } from "@/actions/contact";

const initialState: ContactState = { success: false };

function SubmitButton({ label, sending }: { label: string; sending: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      aria-disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      style={{
        background: "var(--color-accent)",
        color: "var(--color-accent-foreground)",
      }}
      type="submit"
    >
      {pending ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2"
            style={{
              borderColor: "rgba(255,255,255,0.3)",
              borderTopColor: "#ffffff",
            }}
          />
          {sending}
        </>
      ) : (
        <>
          <Send size={15} />
          {label}
        </>
      )}
    </button>
  );
}

export function ContactForm() {
  const { t } = useLocale();
  const c = t.contact;
  const [state, formAction] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-5 py-12 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "var(--color-success-lightest)" }}
        >
          <CheckCircle size={32} style={{ color: "var(--color-success)" }} />
        </div>
        <div>
          <p className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {c.successTitle}
          </p>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
            {c.successText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && (
        <div
          className="rounded-md px-4 py-3 text-sm"
          role="alert"
          style={{
            background: "var(--color-error-light)",
            color: "var(--color-error)",
          }}
        >
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="cf-name" style={{ color: "var(--color-text-primary)" }}>
            {c.nameLabel} <span style={{ color: "var(--color-error)" }}>*</span>
          </label>
          <input
            autoComplete="name"
            className="rounded-md border px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-1"
            id="cf-name"
            name="name"
            placeholder={c.namePlaceholder}
            required
            style={
              {
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
                "--tw-ring-color": "var(--color-accent)",
              } as React.CSSProperties
            }
            type="text"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="cf-phone" style={{ color: "var(--color-text-primary)" }}>
            {c.phoneLabel}{" "}
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {c.phoneOptional}
            </span>
          </label>
          <input
            autoComplete="tel"
            className="rounded-md border px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-1"
            id="cf-phone"
            name="phone"
            placeholder={c.phonePlaceholder}
            style={
              {
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
                "--tw-ring-color": "var(--color-accent)",
              } as React.CSSProperties
            }
            type="tel"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="cf-email" style={{ color: "var(--color-text-primary)" }}>
          {c.emailLabel} <span style={{ color: "var(--color-error)" }}>*</span>
        </label>
        <input
          autoComplete="email"
          className="rounded-md border px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-1"
          id="cf-email"
          name="email"
          placeholder={c.emailPlaceholder}
          required
          style={
            {
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
              "--tw-ring-color": "var(--color-accent)",
            } as React.CSSProperties
          }
          type="email"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="cf-message" style={{ color: "var(--color-text-primary)" }}>
          {c.messageLabel} <span style={{ color: "var(--color-error)" }}>*</span>
        </label>
        <textarea
          className="min-h-[140px] resize-y rounded-md border px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-1"
          id="cf-message"
          name="message"
          placeholder={c.messagePlaceholder}
          required
          style={
            {
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
              "--tw-ring-color": "var(--color-accent)",
            } as React.CSSProperties
          }
        />
      </div>

      <SubmitButton label={c.sendButton} sending={c.sending} />
    </form>
  );
}
