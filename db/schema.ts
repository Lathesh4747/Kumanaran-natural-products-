import {
  pgTable,
  serial,
  text,
  numeric,
  boolean,
  timestamp,
  date,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const productTypes = pgTable("product_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const supermarketTypes = pgTable("supermarket_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  productTypeId: integer("product_type_id")
    .references(() => productTypes.id)
    .notNull(),
  name: text("name").notNull(),
  weightUnit: text("weight_unit").notNull(),
  mrp: numeric("mrp", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const costPrices = pgTable("cost_prices", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  packingCost: numeric("packing_cost", { precision: 10, scale: 2 }).notNull(),
  productCost: numeric("product_cost", { precision: 10, scale: 2 }).notNull(),
  butcherCost: numeric("butcher_cost", { precision: 10, scale: 2 }).notNull(),
  productCostPrice: numeric("product_cost_price", { precision: 10, scale: 2 }).notNull(),
  effectiveDate: date("effective_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const productPrices = pgTable("product_prices", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  supermarketTypeId: integer("supermarket_type_id")
    .references(() => supermarketTypes.id)
    .notNull(),
  sellingPrice: numeric("selling_price", { precision: 10, scale: 2 }).notNull(),
  effectiveDate: date("effective_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const supermarkets = pgTable("supermarkets", {
  id: serial("id").primaryKey(),
  supermarketTypeId: integer("supermarket_type_id")
    .references(() => supermarketTypes.id)
    .notNull(),
  name: text("name").notNull(),
  branchName: text("branch_name").notNull(),
  contactPerson: text("contact_person"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  district: text("district"),
  province: text("province"),
  status: text("status").default("active").notNull(),
  lastSupplyDate: date("last_supply_date"),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  registrationNumber: text("registration_number").notNull(),
  driverName: text("driver_name"),
  capacity: integer("capacity"),
  status: text("status").default("active").notNull(),
});

export const vehicleLoadings = pgTable("vehicle_loadings", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),
  loadingDate: date("loading_date").notNull(),
  totalPackets: integer("total_packets").notNull(),
  status: text("status").default("loaded").notNull(),
  remarks: text("remarks"),
  userId: text("user_id"),
});

export const beforeSupply = pgTable("before_supply", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  costPriceId: integer("cost_price_id")
    .references(() => costPrices.id)
    .notNull(),
  batchNumber: text("batch_number").notNull(),
  productionDate: date("production_date").notNull(),
  bestBeforeDate: date("best_before_date").notNull(),
  weightUnit: text("weight_unit").notNull(),
  quantityProduced: integer("quantity_produced").notNull(),
  quantityRemaining: integer("quantity_remaining").notNull(),
  mrp: numeric("mrp", { precision: 10, scale: 2 }).notNull(),
  userId: text("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const supplies = pgTable("supplies", {
  id: serial("id").primaryKey(),
  supermarketId: integer("supermarket_id")
    .references(() => supermarkets.id)
    .notNull(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  supplyDate: date("supply_date").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("delivered").notNull(),
  remarks: text("remarks"),
  reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
  userId: text("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const supplyDetails = pgTable("supply_details", {
  id: serial("id").primaryKey(),
  supplyId: integer("supply_id")
    .references(() => supplies.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  costPriceId: integer("cost_price_id")
    .references(() => costPrices.id)
    .notNull(),
  beforeSupplyId: integer("before_supply_id").references(() => beforeSupply.id),
  quantitySupplied: integer("quantity_supplied").notNull(),
  sellingPrice: numeric("selling_price", { precision: 10, scale: 2 }).notNull(),
  profitPrice: numeric("profit_price", { precision: 10, scale: 2 }).notNull(),
  remarks: text("remarks"),
});

export const returns = pgTable("returns", {
  id: serial("id").primaryKey(),
  supplyId: integer("supply_id")
    .references(() => supplies.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  returnDate: date("return_date").notNull(),
  returnQuantity: integer("return_quantity").notNull(),
  returnReason: text("return_reason").notNull(),
  weightUnit: text("weight_unit").notNull(),
  status: text("status").default("received").notNull(),
  userId: text("user_id"),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  supermarketId: integer("supermarket_id")
    .references(() => supermarkets.id)
    .notNull(),
  supplyId: integer("supply_id").references(() => supplies.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  status: text("status").notNull(),
  method: text("method"),
  remarks: text("remarks"),
  userId: text("user_id"),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  expenseCategory: text("expense_category").notNull(),
  expenseDate: date("expense_date").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  userId: text("user_id"),
});

export const feedSuppliers = pgTable("feed_suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  feedType: text("feed_type"),
  status: text("status").default("active").notNull(),
});

export const feedPurchases = pgTable("feed_purchases", {
  id: serial("id").primaryKey(),
  feedSupplierId: integer("feed_supplier_id")
    .references(() => feedSuppliers.id)
    .notNull(),
  purchaseDate: date("purchase_date").notNull(),
  feedType: text("feed_type").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  cost: numeric("cost", { precision: 10, scale: 2 }).notNull(),
  remarks: text("remarks"),
  userId: text("user_id"),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  periodType: text("period_type").notNull(),
  periodValue: text("period_value").notNull(),
  insightType: text("insight_type").notNull(),
  summary: text("summary").notNull(),
  suggestions: jsonb("suggestions").notNull(),
  sourceData: jsonb("source_data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const netProfitSnapshots = pgTable("net_profit_snapshots", {
  id: serial("id").primaryKey(),
  periodType: text("period_type").notNull(),
  periodValue: text("period_value").notNull(),
  revenue: numeric("revenue", { precision: 12, scale: 2 }),
  grossProfit: numeric("gross_profit", { precision: 12, scale: 2 }),
  returnsLoss: numeric("returns_loss", { precision: 12, scale: 2 }),
  expensesTotal: numeric("expenses", { precision: 12, scale: 2 }),
  netProfit: numeric("net_profit", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
