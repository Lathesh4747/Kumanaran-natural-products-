"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, Send } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { submitContactForm, type ContactState } from "@/actions/contact";

function WhatsAppIcon() {
  return (
    <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const initialState: ContactState = { success: false };

function SubmitButton({ label, sending }: { label: string; sending: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      aria-disabled={pending}
      className="mt-1 flex w-full items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
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
            style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#ffffff" }}
          />
          {sending}
        </>
      ) : (
        <>
          <Send size={14} />
          {label}
        </>
      )}
    </button>
  );
}

export function ContactSection() {
  const { t } = useLocale();
  const [state, formAction] = useActionState(submitContactForm, initialState);

  return (
    <section
      className="py-20"
      style={{ background: "var(--color-surface-muted)" }}
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left — copy */}
          <div className="flex flex-col justify-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-accent)" }}
            >
              {t.contact.eyebrow}
            </p>
            <h2
              className="mt-3 text-3xl font-bold leading-tight sm:text-4xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t.contact.heading}
            </h2>
            <p
              className="mt-4 text-sm leading-7"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t.contact.description}
            </p>

            <a
              className="mt-8 inline-flex w-fit items-center gap-2.5 rounded-md px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              href="https://wa.me/94705920748"
              rel="noopener noreferrer"
              style={{ background: "var(--color-success)", color: "#ffffff" }}
              suppressHydrationWarning
              target="_blank"
            >
              <WhatsAppIcon />
              {t.contact.whatsappCta}
            </a>

            <p className="mt-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
              {t.contact.orEmail}
            </p>
          </div>

          {/* Right — form */}
          <div className="glass-card p-6 sm:p-8">
            {state.success ? (
              <div className="flex flex-col items-center gap-5 py-8 text-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ background: "var(--color-success-lightest)" }}
                >
                  <CheckCircle size={28} style={{ color: "var(--color-success)" }} />
                </div>
                <div>
                  <p className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {t.contact.successTitle}
                  </p>
                  <p className="mt-1 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>
                    {t.contact.successText}
                  </p>
                </div>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-5" noValidate>
                {state.error && (
                  <div
                    className="rounded-md px-4 py-3 text-sm"
                    role="alert"
                    style={{ background: "var(--color-error-light)", color: "var(--color-error)" }}
                  >
                    {state.error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" htmlFor="cs-name" style={{ color: "var(--color-text-primary)" }}>
                    {t.contact.nameLabel}
                  </label>
                  <input
                    className="rounded-md border px-3 py-2 text-sm outline-none transition-shadow focus:ring-1"
                    id="cs-name"
                    name="name"
                    placeholder={t.contact.namePlaceholder}
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
                  <label className="text-sm font-medium" htmlFor="cs-phone" style={{ color: "var(--color-text-primary)" }}>
                    {t.contact.phoneLabel}{" "}
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {t.contact.phoneOptional}
                    </span>
                  </label>
                  <input
                    className="rounded-md border px-3 py-2 text-sm outline-none transition-shadow focus:ring-1"
                    id="cs-phone"
                    name="phone"
                    placeholder={t.contact.phonePlaceholder}
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" htmlFor="cs-message" style={{ color: "var(--color-text-primary)" }}>
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    className="min-h-[120px] resize-y rounded-md border px-3 py-2 text-sm outline-none transition-shadow focus:ring-1"
                    id="cs-message"
                    name="message"
                    placeholder={t.contact.messagePlaceholder}
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

                <SubmitButton label={t.contact.sendButton} sending={t.contact.sending} />
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
