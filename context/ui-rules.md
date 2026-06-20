# UI Rules

Concise rules for building KumaranNaturalProducts UI. The design tokens in ui-tokens.md are the source of truth for visual decisions. These rules cover the most important patterns and constraints to keep the public site and the app consistent without over-specifying every detail.

---

## Two Surfaces, One System

- **Public website** (`(site)/[lang]`) — marketing pages, warmer and more spacious, hero imagery allowed.
- **Operations app** (`(app)`) — dense, data-focused, card-based dashboards and tables.

Both share the same tokens, font, glass style, buttons, and badges. The only difference is layout density and the navbar.

## Visual Language — Liquid Glass, Green

- The whole UI is **Liquid Glass**: translucent, blurred panels layered over a soft green gradient background, with bright inner edges and soft shadows. Green is the brand color; harvest amber is a sparing highlight.
- The page background gradient (`--gradient-page`) is applied on `body`; cards, navbars, dropdowns, and dialogs are glass surfaces over it.
- Keep it legible — translucency applies to surfaces only, never to text. Maintain strong contrast on every screen.

## Responsive — mobile to 4K

- Mobile-first; every screen must work from 360px phones up to 2560px 4K displays. See the Responsive & Fluid Scaling section in ui-tokens.md for breakpoints, the growing container, fluid `clamp()` type, stacked-table behaviour, and reduced mobile blur.
- Never fix widths that break on small screens or leave huge dead margins on large ones.

---

## Font (multilingual)

The public site renders Sinhala, Tamil, and English. **Inter cannot render Sinhala or Tamil glyphs**, so the font is a combined stack — Inter for Latin/numbers, Noto Sans Sinhala for Sinhala, Noto Sans Tamil for Tamil. The browser automatically picks the font that covers each glyph.

Load all three via `next/font/google` in the root layout and apply all three variable classes to `<html>`:

```typescript
import { Inter, Noto_Sans_Sinhala, Noto_Sans_Tamil } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sinhala",
});
const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tamil",
});
// <html className={`${inter.variable} ${notoSinhala.variable} ${notoTamil.variable}`}>
```

`--font-sans` in `@theme` is the combined stack (see ui-tokens.md). Never use system fonts as the primary font. The dashboard app uses the same stack but in practice only renders Inter (English-only).

---

## Layout

- Page max-width: 1440px, centered
- Main content area padding: 32px on all sides
- Gap between page sections: 24px
- Header height: 64px, full width, white background, padding 0 24px
- All pages use a top navbar only — no sidebar, no drawer
- Public hero sections may go full-bleed width; all other content stays within max-width

---

## Navbars

### Public site navbar

Items: **Home, Products, About** on the left, a **language switcher** (`EN · සිං · தமிழ்`) and the **Login** button on the right.

- Active item: `text-accent`, font-weight 500, 14px
- Inactive item: `text-text-dark`, font-weight 500, 14px
- Login is a primary button (`bg-accent`)
- Logo (green gradient tile + company name) on the far left
- White background, full viewport width, no underline

### App navbar (after login)

Items: **Dashboard, Production, Supply, Returns, Supermarkets, Payments, Insights**, then a **More ▾** menu for Expenses, Feed Suppliers, Vehicle, Products admin.

- Same active/inactive color rules as the site navbar
- White background, full viewport width

---

## Cards (Liquid Glass)

Every content section lives in a translucent glass card floating over the green gradient page background.

```
background: var(--color-glass)
backdrop-filter: blur(18px) saturate(120%)
border: 1px solid var(--color-glass-border)
border-radius: 20px
box-shadow: 0 8px 32px rgba(16,36,28,0.10), inset 0 1px 0 var(--color-glass-highlight)
padding: 24px
```

- Always include the inset top highlight — that edge is what reads as glass.
- Surfaces are translucent; **text and numbers are always fully opaque** (`text-text-primary`) for readability.
- Accent cards may use `--color-glass-tint` (green-tinted glass); nested cards use `--color-glass-strong`.
- Never put a colored solid fill on a card surface — color lives in badges, bars, and text.

---

## Typography Hierarchy

Three levels used consistently throughout:

**Section headings** — card titles, page section titles

```
font-size: 16px
font-weight: 600
color: #16241C
line-height: 24px
```

**Body / primary content text**

```
font-size: 14px
font-weight: 500
color: #16241C
line-height: 20px
```

**Secondary / muted text** — labels, timestamps, subtitles

```
font-size: 12px
font-weight: 400
color: #8A988F
line-height: 16px
```

Stat numbers on dashboard use 30px / weight 600 / color #16241C.

---

## Badges

All badges use `border-radius: 9999px` (pill shape) unless specified otherwise.

```
padding: 2px 8px
font-size: 12px
font-weight: 500
```

- **Product type:** Egg → `bg-harvest-light` / `text-harvest-foreground`; Meat → `bg-earth-light` / `text-earth`
- **Status:** Paid/Delivered → `bg-success-lightest` / `text-success-foreground`; Pending/Partial → `bg-warning-light` / `text-warning`
- Trend badges on stat cards use `rounded-sm` (4px) with `bg-success-lightest` / `text-success-darker`

---

## Buttons

**Primary button:**

```
background: #2E7D46
color: #FFFFFF
border-radius: 8px
padding: 8px 16px
font-size: 14px
font-weight: 500
```

**Secondary button:**

```
background: #FFFFFF
border: 1px solid #E3E7DF
color: #16241C
border-radius: 8px
padding: 8px 16px
```

**WhatsApp buy button (products only):** uses functional green `#16A34A` with a `MessageCircle` icon; opens `wa.me/94705920748` pre-filled with the product name (via `lib/whatsapp.ts`, number from `NEXT_PUBLIC_WHATSAPP_NUMBER`).

---

## Form Inputs

```
background: #FFFFFF
border: 1px solid #E3E7DF
border-radius: 8px
padding: 8px 12px
font-size: 14px
color: #16241C
placeholder color: #8A988F
focus: ring-1 ring-accent border-accent
```

- Use shadcn/ui form components; never build raw inputs from scratch
- Return reason, weight unit, product type, payment status are always dropdowns from the fixed constants — never free text

---

## Tables (Supply, Returns, Payments lists)

- No alternating row colors — white rows only, separated by border
- Row border: `1px solid #E3E7DF` between rows
- Column headers: uppercase, 12px, font-weight 500, color `#56655B`
- Row text: 14px, color `#16241C`
- Hover state: `background: #F3F5F0`
- Money columns right-aligned, formatted with `formatCurrency`
- Status and reason shown as badges, not plain text

---

## Charts

- Use recharts, styled with the chart tokens in ui-tokens.md
- Sales line: brand green; Net profit: success green; Returns: warning orange
- Packet-size splits use harvest amber (500g) and brand green (1000g)
- Grid lines dashed `#E3E7DF`; axis labels `#9AA79F` 12px
- Every chart has a title (section heading) and a short muted subtitle
- Charts read aggregated Postgres data (via Drizzle) — there is no third-party analytics tool

---

## Empty States

Every section that can be empty must have an empty state. Keep it minimal:

- Short descriptive text in `text-text-muted`
- Optional lucide icon above text
- CTA button if there's a logical next action (e.g. "Record first supply")

---

## Localization (public site only)

- Locales: `si` (Sinhala), `ta` (Tamil), `en` (English). Routed under `(site)/[lang]/...`.
- Default is auto-detected from the browser `Accept-Language` header via middleware, falling back to `en`. The chosen locale is remembered (cookie) so the switcher choice sticks.
- A **language switcher** sits on the right of the site navbar next to Login: `EN · සිං · தமிழ்`. Active locale uses `text-accent`; others `text-text-dark`.
- Only **static UI text** is translated, via locale dictionaries (`/locales/{si,ta,en}.ts`). Never hardcode user-facing strings in components — read from the dictionary.
- **Content is not translated** — product names (with weight), descriptions, and blog posts are entered once and shown as-is in every locale. English brand terms, the logo, and technical labels stay English in all locales.
- The dashboard app is **English-only** — no `[lang]` segment, no dictionary, no switcher.
- Sinhala and Tamil text can be taller/wider than English — never fix label widths or truncate nav items; let buttons and headings grow with content.

## Public Site Specifics

- **Home** sections in order: Hero → Products → Blogs → Location → Contact us
- **Hero** may use a full-width natural/farm background with the green-to-dark gradient overlay; headline uses primary text on light or white on dark
- **Product cards** show name (with weight), type badge, MRP, short description, and the WhatsApp buy button
- **Blog** content comes from **Ghost** (headless, Content API). Blog cards/list and post pages render Ghost posts; admin is at `/ghost`. Apply SEO metadata + Article JSON-LD per post
- **Location** section embeds a simple map (static or iframe) — no fixed positioning
- **Contact form** posts to `/api/contact`; on success show a friendly confirmation, never a raw response

---

## Tailwind v4 Note

This project uses Tailwind v4. Tokens are defined with `@theme` in globals.css — no `tailwind.config.ts` needed. Never define colors in a config file. Always use `@theme` for new tokens.

---

## Do Nots

- Never use Tailwind's built-in color classes (`bg-green-500`, `text-gray-600`) — use project tokens only
- Never define colors in `tailwind.config.ts` — use `@theme` in globals.css
- Never add gradients to card backgrounds (logo is the only gradient)
- Never use harvest amber as a large surface — highlight only
- Never use the brand green for negative figures (returns / losses use warning / error)
- Never use more than one font weight in a single UI element
- Never show raw error messages to users — always show human readable text
- Never stack more than 2 levels of border radius inside each other
- Never use `position: fixed` for arbitrary UI — use normal flow layout (a sticky navbar is allowed)
- Never make text or numbers translucent — glass applies to surfaces only
