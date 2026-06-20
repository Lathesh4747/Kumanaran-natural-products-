import { en } from "./en";
import { si } from "./si";
import { ta } from "./ta";
import type { Locale } from "@/types/locale";
export type { Dictionary } from "./en";

export const dictionaries = { en, si, ta } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}
