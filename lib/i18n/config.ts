export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

// The route folders are named in French (the canonical paths). English URLs use these segments instead.
const enSlugs: Record<string, string> = {
  "rendez-vous": "book",
  "photos-guidees": "guided-photos",
  soins: "treatments",
  clinique: "clinic",
  "pont-dentaire": "dental-bridge",
  alignement: "alignment",
};
const frSlugs: Record<string, string> = Object.fromEntries(Object.entries(enSlugs).map(([fr, en]) => [en, fr]));

const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//") && !/^\/(api|assets|_next)(\/|$)/.test(href) && !/\.[a-z0-9]+([?#]|$)/i.test(href);

/** Canonical (French) path to the public URL for a locale: "/rendez-vous/#x" -> "/en/book/#x". French URLs are unchanged. */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === "fr" || !isInternal(href)) return href;
  const [, path, rest] = /^([^?#]*)(.*)$/.exec(href)!;
  const segments = path.split("/").filter(Boolean).map((segment) => enSlugs[segment] ?? segment);
  return "/en/" + segments.join("/") + (segments.length ? "/" : "") + rest;
}

/** Public pathname -> locale and canonical (French) path with a trailing slash. */
export function parsePath(pathname: string): { locale: Locale; path: string } {
  const match = /^\/en(\/.*)?$/.exec(pathname);
  if (!match) return { locale: "fr", path: pathname.endsWith("/") ? pathname : pathname + "/" };
  const segments = (match[1] ?? "/").split("/").filter(Boolean).map((segment) => frSlugs[segment] ?? segment);
  return { locale: "en", path: "/" + segments.join("/") + (segments.length ? "/" : "") };
}

/** Metadata alternates (canonical + hreflang) for a canonical path. */
export function alternates(path: string, locale: Locale) {
  return { canonical: localizeHref(path, locale), languages: { fr: localizeHref(path, "fr"), en: localizeHref(path, "en"), "x-default": localizeHref(path, "fr") } };
}
