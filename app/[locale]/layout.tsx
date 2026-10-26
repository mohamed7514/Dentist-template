import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SiteProvider } from "@/components/site-provider";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { PhotoSessionProvider } from "@/components/photo-session";
import { BookingSessionProvider } from "@/components/booking-session";
import { LocaleProvider } from "@/components/locale-provider";
import { isLocale, locales } from "@/lib/i18n/config";
import { shell } from "@/lib/i18n/dict/shell";
import "../globals.css";
import "../site-pages.css";
import "@/components/photo-capture.css";
import "../editorial-layout.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = shell[locale];
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.siteTitle, template: "%s — Épure" },
    description: t.siteDescription,
    openGraph: { locale: locale === "fr" ? "fr_CA" : "en_CA", siteName: "Épure" },
  };
}
export const viewport: Viewport = { themeColor: "#282826", interactiveWidget: "resizes-content" };

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = shell[locale];
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <BookingSessionProvider><PhotoSessionProvider><SiteProvider>
            <a className="skip" href="#main">{t.skip}</a>
            <SiteHeader />
            {children}
            <SiteFooter />
          </SiteProvider></PhotoSessionProvider></BookingSessionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
