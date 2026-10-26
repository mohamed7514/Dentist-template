"use client";
import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { parsePath } from "@/lib/i18n/config";

const LocaleContext = createContext<Locale>("fr");
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
export const useLocale = () => useContext(LocaleContext);
/** Canonical (French) path of the current page, whatever the language of the URL. */
export function useCanonicalPath() {
  return parsePath(usePathname()).path;
}
