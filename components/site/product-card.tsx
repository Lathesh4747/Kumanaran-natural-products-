import { MessageCircle } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function EggIcon() {
  return (
    <svg
      fill="none"
      height="28"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="28"
    >
      <path d="M12 22c5.523 0 8-3.86 8-8.5C20 8.358 16.418 2 12 2S4 8.358 4 13.5C4 18.14 6.477 22 12 22z" />
    </svg>
  );
}

function MeatIcon() {
  return (
    <svg
      fill="none"
      height="28"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="28"
    >
      <path d="M19 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
      <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
      <line x1="12" x2="12" y1="13" y2="19" />
    </svg>
  );
}

const typeMeta = {
  Egg: {
    icon: EggIcon,
    iconColor: "var(--color-harvest)",
    badgeBg: "var(--color-harvest-light)",
    badgeColor: "var(--color-harvest-foreground)",
    label: "Egg",
  },
  Meat: {
    icon: MeatIcon,
    iconColor: "var(--color-earth)",
    badgeBg: "var(--color-earth-light)",
    badgeColor: "var(--color-earth)",
    label: "Meat",
  },
} as const;

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const meta = typeMeta[product.type];
  const Icon = meta.icon;
  const whatsappLink = buildWhatsAppLink(product.name.en);
  const hasDiscount =
    product.mrpOriginal != null && product.mrpOriginal > product.mrp;
  const savingsPct = hasDiscount
    ? Math.round(((product.mrpOriginal! - product.mrp) / product.mrpOriginal!) * 100)
    : 0;
  const subName = [product.name.si, product.name.ta].filter(Boolean).join(" · ");

  return (
    <article className="glass-card flex flex-col gap-5 p-6">
      {/* Icon row */}
      <div className="flex items-start justify-between">
        <span style={{ color: meta.iconColor }}>
          <Icon />
        </span>
        <div className="flex items-center gap-2">
          {/* Pack size badge */}
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              background: "var(--color-accent-light)",
              color: "var(--color-accent-dark)",
            }}
          >
            {product.packLabel}
          </span>
          {/* Type badge */}
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: meta.badgeBg, color: meta.badgeColor }}
          >
            {meta.label}
          </span>
        </div>
      </div>

      {/* Name */}
      <div>
        <h3
          className="text-base font-semibold leading-6"
          style={{ color: "var(--color-text-primary)" }}
        >
          {product.name.en}
        </h3>
        {subName && (
          <p
            className="mt-0.5 text-xs leading-5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {subName}
          </p>
        )}
      </div>

      {/* Pricing — sale price, with strikethrough original + savings only when discounted */}
      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
        {/* Sale price */}
        <span
          className="text-2xl font-semibold leading-8"
          style={{ color: "var(--color-text-primary)" }}
        >
          {formatCurrency(product.mrp)}
        </span>

        {hasDiscount && (
          <>
            {/* Original price — strikethrough */}
            <span
              className="text-sm font-normal leading-8 line-through"
              style={{ color: "var(--color-text-muted)" }}
            >
              {formatCurrency(product.mrpOriginal)}
            </span>

            {/* Savings badge */}
            <span
              className="rounded-sm px-1.5 py-0.5 text-xs font-medium leading-none"
              style={{
                background: "var(--color-success-lightest)",
                color: "var(--color-success-foreground)",
              }}
            >
              Save {savingsPct}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p
        className="flex-1 text-sm leading-6"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {product.description.en}
      </p>

      {/* WhatsApp buy button */}
      <a
        className="mt-auto flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 active:opacity-80"
        href={whatsappLink}
        rel="noopener noreferrer"
        style={{
          background: "var(--color-success)",
          color: "#ffffff",
        }}
        suppressHydrationWarning
        target="_blank"
      >
        <MessageCircle size={16} strokeWidth={2} />
        Buy via WhatsApp
      </a>
    </article>
  );
}
