# Library Docs

Per-library usage notes and gotchas for KumaranNaturalProducts. Always read the official docs before implementing anything library-specific — APIs differ from training data. This file captures the project's conventions and the traps to avoid.

---

## Neon (`@neondatabase/serverless`)

Serverless Postgres.

- Connect with the HTTP driver and pass it to Drizzle (`drizzle(neon(DATABASE_URL))`).
- `DATABASE_URL` is a server secret — never `NEXT_PUBLIC_`.
- Server-only. Never import the DB client into a Client Component.
- Use a pooled connection string for serverless functions.

---

## Drizzle ORM (`drizzle-orm`, `drizzle-kit`)

- `db/schema.ts` is the source of truth. Use `numeric` for money, `timestamp` for timestamps, proper FKs.
- Generate migrations with `drizzle-kit generate` and apply them — never hand-edit the DB schema out of band.
- Derive types with `InferSelectModel` / `InferInsertModel`; don't redefine row shapes by hand.
- Put reusable aggregate queries (period sums, top-50, district totals) in `db/queries/`.

---

## Clerk (`@clerk/nextjs`)

Auth — Google, Facebook, email + password.

- Enable the three providers in the Clerk dashboard.
- Wrap the root layout in `ClerkProvider`. Protect `(app)` routes in `middleware.ts`; keep `(site)` public.
- Read the user server-side with `auth()` / `currentUser()` — never parse tokens manually.
- Redirect to `/dashboard` after sign-in. Clerk is the only identity store — no local users table.

---

## Arcjet (`@arcjet/next`)

Security — rate limiting, bot detection, shield.

- Define rules in `lib/arcjet.ts`. Apply in `middleware.ts` and on `contact`, `insights/generate`, and the cron route.
- Compose carefully in middleware: Arcjet → Clerk → locale. Test that protected routes still authenticate.
- On deny, return a clean error — never leak rule details.

---

## Ghost (`@tryghost/content-api`)

Headless blog + SEO/AEO/GEO. Admin at `/ghost`.

- `lib/ghost.ts` is the only Ghost caller. Use the **Content API** key for reads; never expose the Admin API key client-side.
- Blog list and post pages fetch from Ghost; content is never stored in Postgres.
- Pull Ghost post metadata into Next `generateMetadata` and Article JSON-LD for SEO.

---

## OpenAI (`openai`) — GPT-4o

- Used only in `ai/insights.ts`, server-side. Send aggregated figures only (no raw rows / PII).
- Ask for structured JSON; validate with zod before saving to `ai_insights`.
- Wrap in try/catch; on failure show a friendly message. Persist results — don't regenerate per view.

Response contract: `{ summary, suggestions: [{ title, detail, priority }] }`.

---

## recharts

Dashboard charts — client components.

- Style with the chart tokens in ui-tokens.md; never hardcode colors. On glass surfaces keep chart backgrounds transparent.
- Sales line `#2E7D46`; net profit `#16A34A`; returns `#E0780A`; packet split `#E0A526` (500g) / `#2E7D46` (1000g).
- Data arrives pre-aggregated from the server; recharts only renders. Containers need an explicit height.

---

## @react-pdf/renderer

Period reports — supply, returns, net profit, expenses (weekly / monthly / custom).

- Define each report as a React-PDF document; render server-side in `/api/reports/[type]`.
- Take a period (from/to) as input; reuse the same `db/queries/` aggregates the dashboard uses, so numbers match.
- Download only — emailing reports is out of scope. Keep layouts simple: header, period, table, totals.

---

## Resend (`resend`)

Transactional email — supply reminders.

- `lib/email.ts` wraps Resend and holds templates. Server-only; `RESEND_API_KEY` is secret.
- Sent only from the cron job, idempotently (guarded by `reminder_sent_at`).
- Verify a sending domain in Resend for deliverability.

---

## Vercel Cron

- A daily schedule in `vercel.json` calls `/api/cron/supply-reminders`.
- The route checks `CRON_SECRET`, runs the reminder query, sends emails, and sets `reminder_sent_at`.
- Keep it idempotent — a re-run must not double-send.

---

## zod

- Validate every Server Action input, API body, GPT-4o response, and report period before use.
- Use enums for fixed lists (`RETURN_REASONS`, `WEIGHT_UNITS`, payment status, product type, period type).
- Derive types with `z.infer` to avoid drift.

---

## shadcn/ui (themed Liquid Glass)

- The only barrel-export folder (`components/ui/`). Check it first before building any primitive.
- Override variants to use project tokens and the glass surface tokens (translucent bg + backdrop-blur + glass border). Keep text fully opaque for contrast.
- Use shadcn Select for all fixed-list dropdowns and the dashboard period picker.

---

## lucide-react

- Icons for nav, empty states, buttons, stat cards, alerts. WhatsApp buy uses `MessageCircle`; logo uses `Egg`/`Leaf`.
- Consistent sizing: 16px inline, 20–24px in buttons/cards.

---

## Tailwind CSS v4 (Liquid Glass)

- Tokens via `@theme` in `globals.css` — no `tailwind.config.ts` for colors. Utilities are generated from `--color-*`.
- Glass = translucent surface token + `backdrop-blur` + glass border + soft shadow, over a green gradient page background. Never use raw color classes or hex literals in components.
- Add new tokens to `@theme`, then document them in ui-tokens.md.

---

## SweetAlert2 (`sweetalert2`)

Themed confirmation and alert dialogs — replaces native `window.confirm` / `alert`.

- The **only** caller is `lib/alerts.ts`, a `"use client"` helper exposing `confirmDelete()`, `alertSuccess()`, and `alertError()`. Never import `sweetalert2` directly into a component.
- Client-only (it touches the DOM); call the helpers from event handlers in `"use client"` components.
- `buttonsStyling` is off — visual styling lives in the `.knp-swal-*` rules in `globals.css`, written with project tokens (glass surface, `--color-accent` for confirm/`--color-error` for destructive). Never add raw hex in the helper.
- `confirmDelete()` resolves to a `boolean`; gate the destructive action on it: `if (await confirmDelete(...)) deleteX(id)`.

## next/font/google (multilingual)

- Load **Inter** (`latin`), **Noto Sans Sinhala** (`sinhala`), **Noto Sans Tamil** (`tamil`) once in the root layout.
- Combine into `--font-sans` (`var(--font-inter), var(--font-sinhala), var(--font-tamil), sans-serif`) so the browser auto-selects per glyph. Apply all three variable classes to `<html>`.
- Never fall back to a system font as the primary face — Inter alone cannot render Sinhala or Tamil.
