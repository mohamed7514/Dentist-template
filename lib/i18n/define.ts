import type { Locale } from "./config";

/** Both languages must have exactly the same shape: the compiler rejects a missing or extra key. */
export function define<T>(fr: T, en: T): Record<Locale, T> {
  return { fr, en };
}
