import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

type DB = NeonHttpDatabase<typeof schema>;

// Lazily create the Drizzle/Neon client on first use. `neon()` throws when
// DATABASE_URL is missing; constructing at module load would crash the Vercel
// build while Next collects page data for routes that import this module.
let instance: DB | null = null;

function getDb(): DB {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    instance = drizzle(neon(url), { schema });
  }
  return instance;
}

// Proxy keeps the `import { db } from "@/db"` API identical everywhere while
// deferring the connection until the first query actually runs.
export const db = new Proxy({} as DB, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real as object, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
}) as DB;
