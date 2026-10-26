"use client";
import Link from "@/components/locale-link";
import { useLocale } from "@/components/locale-provider";
import { shell } from "@/lib/i18n/dict/shell";
import { rich } from "@/lib/i18n/rich";

export default function NotFound() {
  const t = shell[useLocale()];
  return <main id="main" className="wrap" style={{padding:"100px 0"}}><p className="eyebrow">{t.notFoundEyebrow}</p><h1>{rich(t.notFoundTitle)}</h1><p style={{margin:"30px 0"}}>{t.notFoundText}</p><Link href="/" className="btn">{t.notFoundCta}</Link></main>;
}
