import Link from "./locale-link";
import { Arrow } from "./icons";
import { features } from "@/lib/i18n/dict/pages";
import { rich } from "@/lib/i18n/rich";
import type { Locale } from "@/lib/i18n/config";

const hrefs = ["/photos-guidees/", "/rendez-vous/"];
const symbols = [
  <svg key="photos" viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect x="8" y="18" width="48" height="34" rx="5"/><path d="m20 18 5-8h14l5 8"/><circle cx="32" cy="35" r="10"/></svg>,
  <svg key="booking" viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect x="10" y="14" width="44" height="40" rx="4"/><path d="M10 25h44M22 8v12M42 8v12m-21 16h4m7 0h4m7 0h1m-23 9h4m7 0h4"/></svg>,
];

export function FeatureSpaces({ locale, id = "fonctionnalites" }: { locale: Locale; id?: string }) {
  const t = features[locale];
  return <section className="feature-spaces wrap" id={id}>
    <div className="section-heading"><div><p className="eyebrow">{t.eyebrow}</p><h2>{rich(t.title)}</h2></div></div>
    <div className="feature-links">{t.items.map((item, index) => <Link className="feature-shortcut" key={item.title} href={hrefs[index]}>{symbols[index]}<div><h3>{item.title}</h3><p>{item.text}</p></div><Arrow/></Link>)}</div>
  </section>;
}
