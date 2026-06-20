# UI Tokens

Design tokens for KumaranNaturalProducts. A natural / green farm palette — fresh leaf greens, warm cream surfaces, and a harvest-amber highlight for the "egg" feel. Use these exact values throughout the codebase — never hardcode colors or use raw Tailwind color classes in components.

---

## How to Use

This project uses **Tailwind CSS v4**. All design tokens are defined using the `@theme` directive in `app/globals.css`. No `tailwind.config.ts` needed for colors or tokens.

Tailwind v4 automatically generates utility classes from `@theme` variables:

- `--color-accent` → `bg-accent`, `text-accent`, `border-accent`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`

```tsx
// Correct — uses generated utility classes
className="bg-surface text-text-primary border-border"

// Also correct — references CSS variable directly
style={{ color: 'var(--color-text-primary)' }}

// Never — hardcoded hex values
className="bg-[#F7F6F1] text-[#16241C]"

// Never — raw Tailwind color classes
className="bg-green-500 text-gray-600"
```

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Font — combined stack: Inter (Latin/numbers), Noto Sans Sinhala, Noto Sans Tamil.
     The browser picks the font that covers each glyph, so Sinhala/Tamil fall through
     to Noto while English stays Inter. Load all three via next/font/google. */
  --font-sans: var(--font-inter), var(--font-sinhala), var(--font-tamil), sans-serif;

  /* Page and surface backgrounds — warm natural paper under glass */
  --color-background: #f3f7f3;
  --color-surface: #ffffff;
  --color-surface-secondary: #f3f5f0;
  --color-surface-tertiary: #eef1ea;
  --color-surface-muted: #f1f7f2;

  /* Liquid Glass — translucent surfaces layered over the green gradient background.
     Pair every glass color with backdrop-blur and a glass border for the effect. */
  --color-glass: rgba(255, 255, 255, 0.55);
  --color-glass-strong: rgba(255, 255, 255, 0.72);
  --color-glass-tint: rgba(46, 125, 70, 0.10);   /* green-tinted glass */
  --color-glass-border: rgba(255, 255, 255, 0.55);
  --color-glass-highlight: rgba(255, 255, 255, 0.75); /* top inner edge */
  --blur-glass: 18px;
  --blur-glass-strong: 28px;

  /* Page background gradient (set on body, gives glass something to refract) */
  --gradient-page: radial-gradient(1200px 600px at 15% -10%, #e6f4ea 0%, transparent 60%),
                   radial-gradient(1000px 700px at 110% 10%, #dcefe0 0%, transparent 55%),
                   linear-gradient(180deg, #f3f7f3 0%, #eef4ee 100%);

  /* Borders */
  --color-border: #e3e7df;
  --color-border-light: #eaece5;
  --color-border-muted: #d8ddd2;

  /* Text */
  --color-text-primary: #16241c;
  --color-text-secondary: #56655b;
  --color-text-muted: #8a988f;
  --color-text-dark: #2c3a31;
  --color-text-darkest: #0f1a13;

  /* Primary accent — leaf green */
  --color-accent: #2e7d46;
  --color-accent-dark: #1f5c32;
  --color-accent-darker: #15462550;
  --color-accent-light: #e3f1e7;
  --color-accent-muted: #f1f8f3;
  --color-accent-foreground: #ffffff;

  /* Harvest — amber / egg-yolk highlight (secondary brand) */
  --color-harvest: #e0a526;
  --color-harvest-dark: #b97f1c;
  --color-harvest-light: #fbf1d8;
  --color-harvest-foreground: #5a4410;

  /* Earth — warm terracotta accent for variety */
  --color-earth: #b97a2b;
  --color-earth-light: #f5e7d6;

  /* Success — green (functional, brighter than brand) */
  --color-success: #16a34a;
  --color-success-dark: #0f7a37;
  --color-success-darker: #0c6b30;
  --color-success-light: #d6f4df;
  --color-success-lightest: #ecfdf2;
  --color-success-foreground: #0c6b30;

  /* Info — sky blue */
  --color-info: #2b8fd6;
  --color-info-dark: #1c6fab;
  --color-info-light: #dbeefb;
  --color-info-lightest: #eff8fe;
  --color-info-foreground: #1c6fab;

  /* Warning — orange (used for returns / near expiry) */
  --color-warning: #e0780a;
  --color-warning-light: #fdedd7;
  --color-warning-foreground: #ffffff;

  /* Error — red (used for damaged / expired / losses) */
  --color-error: #dc2626;
  --color-error-light: #fde4e4;
  --color-error-foreground: #ffffff;

  /* Dark overlays */
  --color-overlay: #16241c;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

Tailwind v4 generates utility classes automatically from every `--color-*` token above:

- `bg-accent`, `text-accent`, `border-accent`
- `bg-surface`, `text-surface-secondary`
- `bg-harvest-light`, `text-text-muted`
- etc.

---

## Color Usage Guide

### Page Layout

| Element           | Token                  |
| ----------------- | ---------------------- |
| Page background   | `bg-background`        |
| Card / surface    | `bg-surface`           |
| Secondary surface | `bg-surface-secondary` |
| Default border    | `border-border`        |
| Light border      | `border-border-light`  |

### Typography

| Element                | Token                           |
| ---------------------- | ------------------------------- |
| Headings, primary text | `text-text-primary` (#16241C)   |
| Secondary text, labels | `text-text-secondary` (#56655B) |
| Placeholder, muted     | `text-text-muted` (#8A988F)     |
| Dark labels            | `text-text-dark` (#2C3A31)      |

### Accent (Primary Green)

Used for: primary buttons, active nav items, logo, key highlights, focus rings

| Element                | Token                    |
| ---------------------- | ------------------------ |
| Button background      | `bg-accent`              |
| Button text            | `text-accent-foreground` |
| Light badge background | `bg-accent-light`        |
| Subtle background      | `bg-accent-muted`        |

### Harvest (Amber highlight)

Used sparingly for the egg/harvest feel — featured product tags, hero highlights, callouts.

| Element     | Token                    |
| ----------- | ------------------------ |
| Background  | `bg-harvest-light`       |
| Text/icon   | `text-harvest`           |

### Product Type Badges

| Type | Background        | Text                  |
| ---- | ----------------- | --------------------- |
| Egg  | `bg-harvest-light`| `text-harvest-foreground` |
| Meat | `bg-earth-light`  | `text-earth`          |

### Return Reason Colors

| Reason        | Token            |
| ------------- | ---------------- |
| Expired       | `text-error` / `bg-error-light`     |
| Damaged       | `text-error` / `bg-error-light`     |
| Quality Issue | `text-warning` / `bg-warning-light` |
| Near Expiry   | `text-warning` / `bg-warning-light` |
| Unsold        | `text-text-secondary` / `bg-surface-secondary` |

### Status Badges

| Status                | Background            | Text                      |
| --------------------- | -------------------- | ------------------------- |
| Paid / Delivered      | `bg-success-lightest`| `text-success-foreground` |
| Pending / Partial     | `bg-warning-light`   | `text-warning`            |
| Inactive              | `bg-surface-secondary`| `text-text-secondary`    |

### Net Profit Indicators

| Direction      | Token            |
| -------------- | ---------------- |
| Profit / up    | `text-success`   |
| Loss / down    | `text-error`     |

---

## Typography

| Element              | Size | Weight | Line height | Color token           |
| -------------------- | ---- | ------ | ----------- | --------------------- |
| Logo text            | 19px | 700    | 28px        | `text-text-darkest`   |
| Stat number          | 30px | 600    | 36px        | `text-text-primary`   |
| Section heading      | 16px | 600    | 24px        | `text-text-primary`   |
| Nav item (active)    | 14px | 500    | 20px        | `text-accent`         |
| Nav item (inactive)  | 14px | 500    | 20px        | `text-text-dark`      |
| Card label           | 14px | 500    | 20px        | `text-text-secondary` |
| Body / row text      | 14px | 500    | 20px        | `text-text-primary`   |
| Trend badge text     | 12px | 500    | 16px        | `text-success-darker` |
| Timestamp / muted    | 12px | 400    | 16px        | `text-text-muted`     |
| Chart axis labels    | 12px | 400    | 15px        | `#9AA79F`             |
| Stat subtitle        | 12px | 400    | 16px        | `text-text-muted`     |

Font family: combined stack — **Inter** (Latin/numbers) + **Noto Sans Sinhala** + **Noto Sans Tamil**, all via next/font/google. See ui-rules.md for the loader setup.

---

## Spacing

| Token       | Value      | Usage                 |
| ----------- | ---------- | --------------------- |
| `gap-1`     | 4px        | Tight inline gaps     |
| `gap-2`     | 8px        | Badge and tag gaps    |
| `gap-3`     | 12px       | Form field gaps       |
| `gap-4`     | 16px       | Section internal gaps |
| `gap-6`     | 24px       | Between sections      |
| `gap-8`     | 32px       | Page section gaps     |
| `p-4`       | 16px       | Card padding          |
| `p-6`       | 24px       | Large card padding    |
| `px-4 py-2` | 16px / 8px | Button padding        |
| `px-3 py-1` | 12px / 4px | Badge padding         |

---

## Component Tokens

### Cards (Liquid Glass)

Cards are translucent glass panels floating over the green gradient background.

```
background: var(--color-glass)            /* or --color-glass-tint for accent cards */
backdrop-filter: blur(var(--blur-glass)) saturate(120%)
border: 1px solid var(--color-glass-border)
border-radius: 20px (rounded-3xl)
box-shadow: 0 8px 32px rgba(16,36,28,0.10), inset 0 1px 0 var(--color-glass-highlight)
padding: 24px (p-6)
```

- The inset highlight (top inner edge) is what reads as "glass" — always include it.
- Text and numbers inside cards stay fully opaque (`text-text-primary`) for contrast — never make text translucent.
- Nested cards use `--color-glass-strong` so they don't disappear into the parent.
- Charts inside glass cards keep transparent backgrounds.

### Buttons

**Primary:**

```
background: bg-accent
text: text-accent-foreground
border-radius: rounded-md
padding: px-4 py-2
font-weight: font-medium
```

**Secondary:**

```
background: bg-surface
border: border border-border
text: text-text-primary
border-radius: rounded-md
padding: px-4 py-2
```

**Ghost:**

```
background: transparent
text: text-text-secondary
hover: hover:bg-surface-secondary
border-radius: rounded-md
```

**WhatsApp buy (public site only):**

```
background: bg-success (use #16a34a — reads as WhatsApp green)
text: text-accent-foreground
border-radius: rounded-md
icon: lucide MessageCircle
```

### Input Fields

```
background: bg-surface
border: border border-border
border-radius: rounded-md
padding: px-3 py-2
text: text-text-primary
placeholder: text-text-muted
focus: ring-1 ring-accent
```

### Badges

```
border-radius: rounded-full
padding: px-2 py-0.5
font-size: text-xs
font-weight: font-medium
```

Trend badges on stat cards use `rounded-sm` (4px) with `bg-success-lightest` and `text-success-darker`.

### Match / Progress Bars (e.g. return rate, payment progress)

```
background track: bg-border-light
height: 4px
border-radius: rounded-full
fill: bg-accent (normal) / bg-warning (high return rate) / bg-error (loss)
```

### Dashboard Chart Colors

| Chart                          | Color                                                            |
| ------------------------------ | ---------------------------------------------------------------- |
| Sales over time (line)         | `#2E7D46` stroke, 3px width, gradient fill rgba(46,125,70,0.18)  |
| Net profit (line/area)         | `#16A34A` stroke, gradient fill rgba(22,163,74,0.15)             |
| Returns (bars)                 | `#E0780A`                                                        |
| Match / packet-size split      | `#E0A526` (500g) and `#2E7D46` (1000g)                          |
| Chart grid lines               | `1px dashed #E3E7DF`                                             |
| Chart axis labels              | `#9AA79F`, 12px                                                  |

### Logo

```
background: linear-gradient(45deg, #2E7D46 0%, #1F5C32 100%)
border-radius: 10px
size: 36x36px
icon: lucide Egg or Leaf in white
```

---

## Responsive & Fluid Scaling (mobile → 4K)

The UI must look right from a small phone to a 4K TV.

- **Mobile-first.** Build the small layout first, then enhance up. Breakpoints: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536 · plus a `4k` step at 2560px.
- **Container:** content max-width grows to `1600px` on large desktops; above 2560px, scale up rather than leaving huge empty margins — bump the root font-size and gaps at the `4k` breakpoint (e.g. `html { font-size: 18px }` ≥2560px) so everything scales proportionally.
- **Fluid type:** use `clamp()` for hero and large headings, e.g. `clamp(28px, 4vw, 56px)`, so text scales smoothly instead of jumping at breakpoints.
- **Touch targets:** minimum 44px tap height on mobile for buttons, nav, and the language switcher.
- **Tables:** on mobile, dense tables (supply, returns, payments) collapse to stacked cards; the full table returns at `md`+.
- **Glass on small screens:** reduce blur slightly on mobile (`--blur-glass` → ~12px) for performance; never disable it entirely.
- Test layouts at 360px, 768px, 1280px, 1920px, and 2560px before marking a screen done.

---

## Invariants

- Never use Tailwind's built-in color classes (`bg-green-500`, `text-gray-600`) or hex literals — use project tokens only; borders default to `--color-border`
- Font is the combined Inter + Noto Sans Sinhala + Noto Sans Tamil stack — always load via next/font/google, never a system font as the primary face. Inter alone cannot render Sinhala or Tamil
- Never use hex values directly in components — always use CSS variables via Tailwind tokens
- Liquid Glass: every glass surface pairs a translucent token + `backdrop-blur` + glass border + the inset top highlight. Never make text or numbers translucent — only surfaces
- The page background gradient (`--gradient-page`) is applied on `body` — glass needs it to refract against
- `--color-accent` (#2E7D46) is the only brand green — never use Tailwind's built-in green scale
- Harvest amber (#E0A526) is a highlight only — never a primary surface
- Returns and losses use warning / error tokens — never the brand green for negative figures
- All layouts must work from 360px to 2560px — never fix widths that break on mobile or leave dead space on 4K
- Never use more than one font weight in a single UI element
- Never use `position: fixed` for UI elements — use normal flow layout (sticky navbars are allowed)
