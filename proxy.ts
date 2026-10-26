import { NextResponse, type NextRequest } from "next/server";
import { localizeHref, parsePath } from "@/lib/i18n/config";

// French lives at the root (/implants/), English under /en/ with translated slugs (/en/dental-bridge/).
// Internally every page is rendered by app/[locale]/..., so the public URL is rewritten to /fr/... or /en/....
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const { path } = parsePath(pathname);
    const publicPath = localizeHref(path, "en");
    if (publicPath !== (pathname.endsWith("/") ? pathname : pathname + "/")) {
      url.pathname = publicPath;
      return NextResponse.redirect(url, 308);
    }
    url.pathname = "/en" + (path === "/" ? "/" : path);
    return NextResponse.rewrite(url);
  }
  if (pathname === "/" && request.cookies.get("NEXT_LOCALE")?.value === "en") {
    url.pathname = "/en/";
    return NextResponse.redirect(url, 307);
  }
  url.pathname = "/fr" + (pathname === "/" ? "/" : pathname);
  return NextResponse.rewrite(url);
}

export const config = { matcher: ["/((?!api|_next|assets|.*[.].*).*)"] };
