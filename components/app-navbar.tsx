"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Truck,
  RotateCcw,
  Store,
  CreditCard,
  BarChart3,
  Lightbulb,
  ChevronDown,
  Menu,
  X,
  Leaf,
  Factory,
  Tag,
  Receipt,
  ShoppingBasket,
  Car,
  Package,
} from "lucide-react";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/supply", label: "Supply", icon: Truck },
  { href: "/returns", label: "Returns", icon: RotateCcw },
  { href: "/supermarkets", label: "Supermarkets", icon: Store },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/insights", label: "Insights", icon: Lightbulb },
];

const moreNav = [
  { href: "/production", label: "Production", icon: Factory },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/feed-suppliers", label: "Feed Suppliers", icon: ShoppingBasket },
  { href: "/vehicle", label: "Vehicle", icon: Car },
  { href: "/products-admin", label: "Products", icon: Package },
];

export function AppNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isMoreActive = moreNav.some((item) => isActive(item.href));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{ background: "linear-gradient(45deg, #2e7d46 0%, #1f5c32 100%)" }}
          >
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span
            className="font-bold leading-7 hidden sm:block"
            style={{ fontSize: "19px", color: "var(--color-text-darkest)" }}
          >
            Kumaran
          </span>
        </Link>

        {/* Desktop primary nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryNav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(href)
                  ? "text-accent bg-accent-light"
                  : "text-text-dark hover:text-accent hover:bg-accent-muted"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isMoreActive
                  ? "text-accent bg-accent-light"
                  : "text-text-dark hover:text-accent hover:bg-accent-muted"
              }`}
            >
              More
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>

            {moreOpen && (
              <div className="absolute right-0 mt-1 w-52 glass-card py-1 overflow-hidden">
                {moreNav.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive(href)
                        ? "text-accent bg-accent-light"
                        : "text-text-dark hover:text-accent hover:bg-accent-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <UserButton />
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md text-text-dark hover:bg-surface-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border">
          <div className="mx-auto max-w-[1440px] px-4 py-3 flex flex-col gap-1">
            {[...primaryNav, ...moreNav].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "text-accent bg-accent-light"
                    : "text-text-dark hover:text-accent hover:bg-accent-muted"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            ))}
            <div className="pt-2 pb-1 px-3">
              <UserButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
