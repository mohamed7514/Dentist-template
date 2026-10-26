"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { localizeHref, parsePath, type Locale } from "@/lib/i18n/config";
import { shell } from "@/lib/i18n/dict/shell";
import { useLocale } from "./locale-provider";

const labels: Record<Locale, string> = { fr: "FR", en: "EN" };

/** FR | EN toggle. It keeps the current page and remembers the choice for the next visit to the home page. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const { path } = parsePath(pathname);
  return (
    <div className={`language-switcher ${className}`.trim()} role="group" aria-label={shell[locale].languageAria}>
      {(["fr", "en"] as const).map((target) => (
        <NextLink
          key={target}
          href={localizeHref(path, target)}
          hrefLang={target}
          lang={target}
          aria-current={target === locale ? "true" : undefined}
          onClick={() => { document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`; }}
        >
          {labels[target]}
        </NextLink>
      ))}
    </div>
  );
}
