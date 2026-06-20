# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior engineer. This means:

- **Think before implementing** — understand what is being built and why before writing a single line
- **Read context files first** — never assume, always verify against architecture.md and project-overview.md
- **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful
- **Every feature must be testable** — if it cannot be verified immediately after implementation, it is incomplete
- **Clean over clever** — simple readable code that a junior developer can understand
- **One thing at a time** — complete one feature fully before touching the next
- **Failures are expected** — wrap AI, email, and external calls in try/catch, log failures, never let one failure crash everything
- **Money is exact** — all money is `numeric(10,2)` in Postgres and handled as decimals in code. Never store money as plain integers

---

## TypeScript

- Strict mode enabled — no exceptions
- Never use `any` — use `unknown` and narrow
- Never use type assertions (`as`) unless absolutely necessary and commented why
- All function parameters and return types explicitly typed
- Use `type` for object shapes and unions — `interface` only for extendable component props
- All async functions have proper error handling — no floating promises
- Use `const` by default — `let` only when reassignment is necessary
- Prefer Drizzle-inferred types (`InferSelectModel` / `InferInsertModel`) over redefining row shapes

---

## Next.js Conventions

- App Router only — no Pages Router. React 19 APIs throughout.
- Public site lives in `(site)/[lang]`; the app lives in `(app)` with a Clerk auth guard in its layout
- Server Components by default. Add `"use client"` only for: useState/useReducer, useEffect, browser APIs, event listeners, client-only libs (recharts, Clerk client components)
- Never add `"use client"` to layouts unless required
- Data fetching happens in Server Components / Server Actions — never fetch in Client Components directly
- Route handlers live in `app/api/` — never put business logic in route handlers
- Server Actions live in `actions/` — never define them inline in components
- Always read the docs for Next.js, Clerk, Drizzle, Arcjet, and Ghost before implementing — APIs differ from training data

---

## Database — Neon + Drizzle

```typescript
// db/index.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
export const db = drizzle(neon(process.env.DATABASE_URL!));

// usage (server only)
import { db } from "@/db";
import { supplies } from "@/db/schema";
```

- `db/schema.ts` is the single source of truth for tables. Generate and run migrations with `drizzle-kit` — never hand-edit the DB out of band.
- All money columns use `numeric(10,2)` (aggregates `numeric(12,2)`). Read as numbers; round only at display.
- The DB client is server-only — never import `@/db` into a Client Component.
- Scope owner-specific rows by the Clerk `userId` where relevant; never trust a client-supplied id.
- Prefer typed query helpers in `db/queries/` for anything reused (e.g. period aggregates).

---

## Auth — Clerk

- Providers: Google, Facebook, email + password (configured in the Clerk dashboard).
- `ClerkProvider` wraps the root layout. `middleware.ts` protects `(app)` routes; `(site)` is public.
- Read the signed-in user with Clerk server helpers in Server Components / Actions (`auth()`), never by parsing tokens manually.
- After sign-in, redirect to `/dashboard`. There is no local users table — Clerk is the identity source.

---

## Security — Arcjet

- `lib/arcjet.ts` defines the client and rule sets (rate limit, bot detection, shield).
- Apply Arcjet in `middleware.ts` and explicitly on sensitive routes: `contact`, `insights/generate`, and `cron/supply-reminders`.
- On an Arcjet deny, return a clean `429` / generic error — never expose rule internals.
- The cron route additionally checks a `CRON_SECRET` header.

---

## API Route Handlers

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // arcjet check
    const body = await req.json();
    // validate with zod
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[insights/generate]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
```

- Every handler has try/catch and validates input with zod before processing
- Errors logged with route prefix: `[insights/generate]`
- Always return `{ success: boolean, data?: T, error?: string }` — never raw data

---

## Server Actions

```typescript
"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";

export async function recordSupply(data: SupplyFormData) {
  try {
    // validate with zod
    // insert supply + supply_details, snapshot selling_price from product_prices
    // decrement before_supply.quantity_remaining; recompute total_amount
    revalidatePath("/supply");
    return { success: true };
  } catch (error) {
    console.error("[actions/supply]", error);
    return { success: false, error: "Failed to record supply" };
  }
}
```

- Every Server Action has try/catch, validates with zod, returns `{ success, error? }`, and calls `revalidatePath` after mutations. Never throw — always return the error.

---

## AI Code

- `ai/insights.ts` returns `{ success, error? }`, has try/catch, receives only **aggregated** figures (never raw rows or PII), parses GPT-4o JSON and validates with zod, and persists to `ai_insights`. AI never imports from `components/` or `actions/`, never uses hooks/browser APIs, and is never regenerated on every page view.

---

## Email & Cron

- `lib/email.ts` wraps Resend and holds reminder templates. Sending is server-only.
- The reminder cron (`/api/cron/supply-reminders`) is idempotent: it only emails supplies where `reminder_sent_at IS NULL` and `supply_date + SUPPLY_REMINDER_DAYS = today`, then sets `reminder_sent_at`.
- Never email on every request — only via the scheduled cron.

---

## Ghost (blog / SEO)

- `lib/ghost.ts` is the only place that talks to the Ghost Content API. Blog pages fetch through it.
- Never store blog content in Postgres. Never expose the Ghost Admin API key client-side.
- Every public page sets metadata via `generateMetadata` and emits JSON-LD where relevant (Organization, Product, Article, FAQ).

---

## Analytics

Dashboard figures (sales, profit, returns, district, top supermarkets, top products) are computed from Postgres via Drizzle — there is no third-party analytics tool in this project. If usage analytics are added later, document the events here first.

---

## Error Handling

- Never use empty catch blocks — always log or handle
- Console errors include a context prefix: `[component/function name]`
- User-facing errors are human readable — never expose raw errors, DB errors, or rule internals
- AI / email failures are logged and shown as a friendly message

---

## Environment Variables

All env vars defined in `.env.local` for development. Never hardcode a key, URL, secret, or phone number anywhere.

| Variable                            | Used In                       |
| ----------------------------------- | ----------------------------- |
| `DATABASE_URL`                      | db/index.ts (Neon)            |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk client                  |
| `CLERK_SECRET_KEY`                  | Clerk server                  |
| `ARCJET_KEY`                        | lib/arcjet.ts                 |
| `OPENAI_API_KEY`                    | ai/ functions                 |
| `GHOST_URL`                         | lib/ghost.ts                  |
| `GHOST_CONTENT_API_KEY`             | lib/ghost.ts                  |
| `RESEND_API_KEY`                    | lib/email.ts                  |
| `REMINDER_EMAIL`                    | lib/email.ts (recipient)      |
| `CRON_SECRET`                       | cron route                    |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`       | lib/whatsapp.ts (94705920748) |
| `NEXT_PUBLIC_COMPANY_NAME`          | site components               |

`NEXT_PUBLIC_` is exposed to the browser — never prefix secret keys (`CLERK_SECRET_KEY`, `ARCJET_KEY`, `OPENAI_API_KEY`, `GHOST_CONTENT_API_KEY`, `RESEND_API_KEY`, `CRON_SECRET`, `DATABASE_URL`).

---

## Constants

```typescript
// lib/utils.ts
export const CURRENCY = "LKR";
export const WEIGHT_UNITS = ["500g", "1000g"] as const;
export const RETURN_REASONS = ["Expired", "Damaged", "Unsold", "Quality Issue", "Near Expiry"] as const;
export const HIGH_RETURN_RATE_THRESHOLD = 15; // percent — dashboard alert
export const LOW_STOCK_THRESHOLD = 20;        // packets remaining — dashboard alert
export const SUPPLY_REMINDER_DAYS = 11;       // 2 weeks minus 3 days
export const TOP_SUPERMARKETS_LIMIT = 50;
export const WHATSAPP_NUMBER = "94705920748";
```

Import these everywhere — never hardcode the values inline.

---

## Localization

The public site is trilingual (si / ta / en); the app is English-only.

- Static public-site strings live in `locales/{en,si,ta}.ts`. Never hardcode user-facing strings — read from the active dictionary. Keep all keys in sync; missing keys fall back to `en`.
- Never translate database or Ghost content. The app imports no dictionary and has no `[lang]` segment.
- Fonts: load Inter + Noto Sans Sinhala + Noto Sans Tamil via next/font/google (see ui-rules.md). Inter alone cannot render Sinhala/Tamil — never drop the Noto fonts.

---

## Import Aliases

Always use `@/` — never relative imports going up more than one level.

```typescript
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { RETURN_REASONS } from "@/lib/utils";
```

---

## Money & Formatting

- Money stored as `numeric(10,2)`, handled as 2-decimal numbers
- Format for display via one shared `formatCurrency` helper using `CURRENCY`
- Never round mid-calculation — round only at display time

---

## Comments

- No comments explaining *what* — code is self-explanatory. Comments only for *why* (non-obvious decisions). AI functions may briefly note the prompt/aggregation strategy. Never leave TODOs in committed code.

---

## Dependencies

Before installing anything: does shadcn/ui already have it? does Next.js provide it? is there a simpler native solution?

Approved dependencies:

- `drizzle-orm`, `drizzle-kit` — ORM + migrations
- `@neondatabase/serverless` — Neon Postgres driver
- `@clerk/nextjs` — auth
- `@arcjet/next` — security
- `openai` — GPT-4o
- `recharts` — charts
- `@react-pdf/renderer` — PDF reports
- `resend` — email
- `@tryghost/content-api` — Ghost Content API client
- `zod` — validation
- `lucide-react` — icons
- `tailwindcss` — styling
- `shadcn/ui` — UI primitives
- `sweetalert2` — themed confirmation / alert dialogs (delete confirms, success/error feedback)

Do not install anything else without updating this list first.
