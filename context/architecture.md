# Architecture

System architecture, technology stack, folder structure, and the complete data model for KumaranNaturalProducts. Read this before implementing any feature. Never assume — verify against this file and project-overview.md.

---

## Technology Stack

| Layer            | Technology                                          |
| ---------------- | --------------------------------------------------- |
| Framework        | Next.js (App Router) + React 19                     |
| Language         | TypeScript (strict mode)                            |
| Database         | Neon (serverless Postgres)                          |
| ORM              | Drizzle ORM (`drizzle-orm`, `drizzle-kit`)          |
| Auth             | Clerk — Google, Facebook, email + password          |
| Security         | Arcjet — rate limiting, bot detection, shield       |
| Blog / CMS / SEO | Ghost (headless) at `/ghost`, consumed via Content API |
| AI               | OpenAI GPT-4o (`openai`)                            |
| Charts           | `recharts`                                          |
| PDF reports      | `@react-pdf/renderer`                              |
| Email            | Resend (`resend`)                                  |
| Scheduling       | Vercel Cron → `/api/cron/supply-reminders`         |
| Validation       | `zod`                                              |
| Styling          | Tailwind CSS v4 (`@theme` tokens), Liquid Glass UI |
| UI primitives    | shadcn/ui                                          |
| Icons            | `lucide-react`                                     |

No InsForge, no Browserbase, no Adzuna. Auth and DB are now fully separate (Clerk + Neon/Drizzle).

---

## High-Level Architecture

```
                        Public visitors
                              │
                ┌─────────────┴──────────────┐
                │  Public website (no auth)   │
                │  trilingual /[lang]/...     │
                │  Home / Products / About    │
                │  Blog (from Ghost) / Contact│
                └─────────────┬──────────────┘
                   │                       │
       WhatsApp buy link        Ghost Content API (blog + SEO)
       wa.me/94705920748                  │
                                      Ghost (/ghost)

                        Company users (Clerk auth)
                              │
                ┌─────────────┴──────────────┐
                │   Operations app (auth)     │
                │   Dashboard / Supply / etc. │
                └─────────────┬──────────────┘
                              │
   ┌──────────────┬──────────┼───────────┬───────────────┐
   ▼              ▼          ▼           ▼               ▼
 Neon+Drizzle   OpenAI    Resend       Arcjet         Vercel Cron
 (Postgres)     GPT-4o    (email)      (security)     daily reminders
```

- The public site and the app live in the same Next.js project, separated by route groups.
- All dashboard figures are computed from Postgres via Drizzle (recharts renders them).
- Arcjet guards API routes, the contact form, and auth-adjacent endpoints.
- A daily Vercel Cron job hits `/api/cron/supply-reminders` to send supply follow-up emails via Resend.

---

## Route Groups & Folder Structure

```
app/
  (site)/                      # public website — no auth, trilingual
    [lang]/                    # si | ta | en
      layout.tsx               # SiteNavbar (language switcher) + footer
      page.tsx                 # Home
      products/page.tsx
      about/page.tsx
      blog/page.tsx            # list from Ghost Content API
      blog/[slug]/page.tsx     # single Ghost post
  (app)/                       # authenticated operations app (English only)
    layout.tsx                 # AppNavbar, Clerk auth guard
    dashboard/page.tsx
    production/page.tsx
    supply/page.tsx
    returns/page.tsx
    supermarkets/page.tsx
    payments/page.tsx
    expenses/page.tsx
    feed-suppliers/page.tsx
    vehicle/page.tsx
    products-admin/page.tsx
    pricing/page.tsx           # per supermarket-type selling prices
    reports/page.tsx           # period PDF report builder
    insights/page.tsx
  api/
    insights/generate/route.ts
    contact/route.ts
    reports/[type]/route.ts    # supply | returns | net-profit | expenses PDF
    cron/supply-reminders/route.ts
  layout.tsx                   # root: html, fonts (Inter + Noto Sinhala/Tamil), ClerkProvider
  globals.css                  # @theme tokens (see ui-tokens.md)

middleware.ts                  # composes: Clerk auth + Arcjet + locale detection

db/
  schema.ts                    # Drizzle table definitions (source of truth)
  index.ts                     # Neon client + drizzle() instance
  queries/                     # reusable typed query helpers

locales/                       # static UI dictionaries (public site only)
  en.ts  si.ts  ta.ts

actions/                       # Server Actions only
  products.ts  productPrices.ts  costPrices.ts  production.ts
  supply.ts  returns.ts  payments.ts  expenses.ts
  supermarkets.ts  feed.ts  vehicle.ts  contact.ts

ai/
  insights.ts                  # GPT-4o marketing & sales suggestions

lib/
  arcjet.ts                    # Arcjet client + rules
  ghost.ts                     # Ghost Content API client
  email.ts                     # Resend client + reminder templates
  openai.ts
  pdf.ts                       # report PDF documents
  whatsapp.ts                  # wa.me buy links
  utils.ts                     # constants + helpers

components/
  ui/                          # shadcn/ui primitives (themed glass)
  layout/                      # SiteNavbar, AppNavbar, Footer, LanguageSwitcher
  site/                        # Hero, ProductCard, BlogCard, ContactForm, LocationMap
  dashboard/                   # StatsBar, SalesChart, NetProfitChart, DistrictSalesCard,
                               #   TopSupermarketsCard, TopProductsCard, AlertsCard, InsightsCard
  forms/  tables/

types/
  index.ts
```

---

## Data Model

Tables are defined in `db/schema.ts` with Drizzle. Postgres columns are **snake_case**; Drizzle/TS fields are **camelCase**. All money columns are `numeric(10,2)` (or `numeric(12,2)` for aggregates). Identity is owned by Clerk — there is no local users table; rows that need an owner store the Clerk `user_id` (text).

### product_types
`id` (PK) · `name` (Egg | Meat) · `description` · `created_at`

### products
`id` (PK) · `product_type_id` (FK) · `name` (includes weight, e.g. "Quail Eggs 500g") · `weight_unit` (500g | 1000g) · `mrp` numeric(10,2) · `description` · `is_active` bool · `created_at`

### cost_prices
`id` (PK) · `product_id` (FK) · `packing_cost` · `product_cost` · `butcher_cost` · `product_cost_price` (total packet cost) · `effective_date` · `created_at` — all costs numeric(10,2)

### product_prices  *(NEW — selling price per supermarket type)*
`id` (PK) · `product_id` (FK) · `supermarket_type_id` (FK) · `selling_price` numeric(10,2) · `effective_date` · `created_at`
> One selling price per (product, supermarket type). Cargills and Keells are set to the same value; Private differs. Supply lines snapshot the price at supply time.

### before_supply  *(production batches + inventory)*
`id` (PK) · `product_id` (FK) · `cost_price_id` (FK) · `batch_number` · `production_date` · `best_before_date` · `weight_unit` · `quantity_produced` · `quantity_remaining` · `mrp` · `created_at`

### supermarket_types
`id` (PK) · `name` (Cargills | Keells | Private) · `description`

### supermarkets  *(each row = one branch)*
`id` (PK) · `supermarket_type_id` (FK) · `name` · `branch_name` · `contact_person` · `phone` · `email` · `address` · `district` · `province` · `status` · `last_supply_date`

### vehicles
`id` (PK) · `name` · `registration_number` · `driver_name` · `capacity` · `status`

### vehicle_loadings
`id` (PK) · `vehicle_id` (FK) · `loading_date` · `total_packets` · `status` · `remarks`

### supplies
`id` (PK) · `supermarket_id` (FK) · `vehicle_id` (FK, null) · `supply_date` · `total_amount` numeric(10,2) · `status` · `remarks` · `reminder_sent_at` timestamptz (null) · `created_at`
> `reminder_sent_at` is set by the cron job so each supply only triggers one follow-up email.

### supply_details
`id` (PK) · `supply_id` (FK) · `product_id` (FK) · `cost_price_id` (FK) · `before_supply_id` (FK, null) · `quantity_supplied` · `selling_price` numeric(10,2) (snapshot from product_prices) · `profit_price` numeric(10,2) (per-packet margin = selling − product_cost_price) · `remarks`

### returns
`id` (PK) · `supply_id` (FK) · `product_id` (FK) · `return_date` · `return_quantity` · `return_reason` (Expired | Damaged | Unsold | Quality Issue | Near Expiry) · `weight_unit` · `status`

### payments
`id` (PK) · `supermarket_id` (FK) · `supply_id` (FK, null) · `amount` numeric(10,2) · `payment_date` · `status` (paid | pending) · `method` · `remarks`

### expenses
`id` (PK) · `expense_category` · `expense_date` · `amount` numeric(10,2) · `description`

### feed_suppliers
`id` (PK) · `name` · `phone` · `address` · `feed_type` · `status`

### feed_purchases
`id` (PK) · `feed_supplier_id` (FK) · `purchase_date` · `feed_type` · `quantity` numeric(10,2) · `unit` · `cost` numeric(10,2) · `remarks`

### contact_submissions
`id` (PK) · `name` · `email` · `phone` · `message` · `status` (new | handled) · `created_at`

### ai_insights
`id` (PK) · `period_type` (week | month | year | custom) · `period_value` · `insight_type` (marketing | sales) · `summary` · `suggestions` jsonb · `source_data` jsonb · `created_at`

> **Blog posts are NOT stored here** — they live in Ghost and are fetched via the Ghost Content API.

### net_profit_snapshots  *(optional cache of a derived value)*
`id` (PK) · `period_type` · `period_value` · `revenue` · `gross_profit` · `returns_loss` · `expenses` · `net_profit` (all numeric(12,2)) · `created_at`

---

## Key Relationships

```
product_types 1─* products 1─* cost_prices
products 1─* product_prices *─1 supermarket_types
products 1─* before_supply *─1 cost_prices
supermarket_types 1─* supermarkets 1─* supplies 1─* supply_details *─1 products
supplies 1─* returns *─1 products
supplies 1─* payments *─1 supermarkets
vehicles 1─* vehicle_loadings
feed_suppliers 1─* feed_purchases
```

---

## Pricing & Profit

- Selling price is defined per **(product, supermarket type)** in `product_prices`. When a supply line is recorded, its `selling_price` is copied from the matching product price (snapshot), and `profit_price` = `selling_price − product_cost_price`.
- Because Cargills and Keells share a price and Private differs, profit per packet differs by supermarket type — so total profit is the sum across all supply lines, naturally reflecting each type's price.

```
gross_profit = Σ over supply_details ( profit_price × quantity_supplied )
returns_loss = Σ over returns ( return_quantity × product_cost_price )   # confirm treatment
expenses     = Σ expenses.amount + Σ feed_purchases.cost  (for the period)

net_profit   = gross_profit − returns_loss − expenses
```

Computed per week / month / year / custom period. Cache as `net_profit_snapshots` only if performance requires it.

---

## Dashboard Analytics (all from Postgres)

- Period selector: **weekly / monthly / yearly / custom** range applied to supply, returns, profit, and expenses.
- **District sales** — sales grouped by `supermarkets.district` (which district sells most).
- **Top 50 supermarkets** — branches ranked by total sales value.
- **Top products** — products ranked by quantity / value sold.
- **Return analytics** — rate, most-returned products, reason breakdown, 500g vs 1000g split.
- **Alerts** — surfaced on the dashboard (e.g. high return rate over `HIGH_RETURN_RATE_THRESHOLD`, low remaining stock, pending payments overdue, upcoming supply follow-ups).

---

## Supply Reminder Emails

- A daily **Vercel Cron** job calls `/api/cron/supply-reminders` (protected by `CRON_SECRET` + Arcjet).
- It finds supplies where `supply_date + SUPPLY_REMINDER_DAYS = today` and `reminder_sent_at IS NULL`.
- For each, it sends an email via **Resend** to `REMINDER_EMAIL` prompting the owner to visit/contact that branch (possible returns or out-of-stock), then sets `reminder_sent_at`.
- `SUPPLY_REMINDER_DAYS = 11` (2 weeks minus 3 days).

---

## Ghost, SEO / AEO / GEO

- The blog is powered by **headless Ghost**. Ghost admin lives at `/ghost`; Next.js fetches posts through the Ghost **Content API** (`lib/ghost.ts`) and renders `(site)/[lang]/blog` and `blog/[slug]`.
- SEO/AEO/GEO handled with: Next.js `generateMetadata` (titles, descriptions, Open Graph), JSON-LD structured data (Organization, Product, Article, FAQ), `sitemap.xml`, `robots.ts`, canonical URLs, and clean semantic headings so answer/generative engines can extract content.

---

## Auth & Security

- **Clerk** handles sign-up / sign-in (Google, Facebook, email + password). `middleware.ts` protects all `(app)` routes; public `(site)` routes stay open.
- **Arcjet** runs in `middleware.ts` and on sensitive API routes — rate limiting (contact form, insight generation, cron), bot detection, and shield against common attacks.
- The composed `middleware.ts` order: Arcjet checks → Clerk auth → locale detection (locale only for `(site)`).

---

## Localization (public site only)

- Locales `si` / `ta` / `en` under `(site)/[lang]`. Auto-detected from `Accept-Language` (fallback `en`), remembered via cookie, switchable in the navbar.
- Only static UI strings are translated (dictionaries in `locales/`). Product and Ghost blog content is shown as authored — no translated columns. The app is English-only.
