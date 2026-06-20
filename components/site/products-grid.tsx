"use client";

import { useState } from "react";
import type { Product, ProductType } from "@/lib/data/products";
import { ProductCard } from "@/components/site/product-card";

type Filter = "All" | ProductType;

const filters: Filter[] = ["All", "Egg", "Meat"];

interface ProductsGridProps {
  products: readonly Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const [active, setActive] = useState<Filter>("All");

  const visible =
    active === "All" ? products : products.filter((p) => p.type === active);

  const count = (f: Filter) =>
    f === "All" ? products.length : products.filter((p) => p.type === f).length;

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => {
          const isActive = active === f;
          return (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all"
              style={
                isActive
                  ? {
                      background: "var(--color-accent)",
                      color: "var(--color-accent-foreground)",
                      boxShadow: "0 2px 8px rgba(46,125,70,0.25)",
                    }
                  : {
                      background: "var(--color-glass)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-dark)",
                    }
              }
            >
              {f}
              <span
                className="rounded-full px-1.5 py-0.5 text-xs font-semibold leading-none"
                style={
                  isActive
                    ? {
                        background: "rgba(255,255,255,0.25)",
                        color: "var(--color-accent-foreground)",
                      }
                    : {
                        background: "var(--color-accent-light)",
                        color: "var(--color-accent-dark)",
                      }
                }
              >
                {count(f)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-3 py-10">
          <span style={{ color: "var(--color-text-muted)", fontSize: 40 }}>
            🌿
          </span>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            No products in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}
