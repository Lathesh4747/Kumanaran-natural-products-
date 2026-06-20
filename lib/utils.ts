export const CURRENCY = "LKR";
export const WEIGHT_UNITS = ["500g", "1000g"] as const;
export const RETURN_REASONS = [
  "Expired",
  "Damaged",
  "Unsold",
  "Quality Issue",
  "Near Expiry",
] as const;
export const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Cheque"] as const;
export const PAYMENT_STATUSES = ["paid", "pending"] as const;
export const SUPPLY_STATUSES = ["delivered", "partial", "cancelled"] as const;
export const EXPENSE_CATEGORIES = [
  "Transport",
  "Packaging",
  "Utilities",
  "Labour",
  "Maintenance",
  "Marketing",
  "Other",
] as const;
export const FEED_UNITS = ["kg", "g", "bag", "sack"] as const;
export const HIGH_RETURN_RATE_THRESHOLD = 15;
export const LOW_STOCK_THRESHOLD = 20;
export const SUPPLY_REMINDER_DAYS = 11;
export const TOP_SUPERMARKETS_LIMIT = 50;
export const WHATSAPP_NUMBER = "94705920748";
export const SRI_LANKA_DISTRICTS = [
  "Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle","Gampaha",
  "Hambantota","Jaffna","Kalutara","Kandy","Kegalle","Kilinochchi","Kurunegala",
  "Mannar","Matale","Matara","Monaragala","Mullaitivu","Nuwara Eliya",
  "Polonnaruwa","Puttalam","Ratnapura","Trincomalee","Vavuniya",
] as const;
export const SRI_LANKA_PROVINCES = [
  "Central","Eastern","North Central","Northern","North Western",
  "Sabaragamuwa","Southern","Uva","Western",
] as const;

export type WeightUnit = (typeof WEIGHT_UNITS)[number];
export type ReturnReason = (typeof RETURN_REASONS)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount == null) return `${CURRENCY} 0.00`;
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return `${CURRENCY} 0.00`;
  return `${CURRENCY} ${n.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function today(): string {
  return new Date().toISOString().split("T")[0];
}
