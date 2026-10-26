import type { MetadataRoute } from "next";
import { localizeHref } from "@/lib/i18n/config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
const paths = ["/", "/soins/", "/implants/", "/invisalign/", "/pont-dentaire/", "/clinique/", "/photos-guidees/", "/rendez-vous/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: siteUrl + localizeHref(path, "fr"),
    alternates: { languages: { fr: siteUrl + localizeHref(path, "fr"), en: siteUrl + localizeHref(path, "en") } },
  })).concat(paths.map((path) => ({
    url: siteUrl + localizeHref(path, "en"),
    alternates: { languages: { fr: siteUrl + localizeHref(path, "fr"), en: siteUrl + localizeHref(path, "en") } },
  })));
}
