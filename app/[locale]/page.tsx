import Image from "next/image";
import type { Metadata } from "next";
import Link from "@/components/locale-link";
import { SmileHero } from "@/components/smile-hero";
import { FeatureSpaces } from "@/components/reserved-feature";
import { ReviewsSection, LocationSection } from "@/components/reviews-location";
import { alternates, type Locale } from "@/lib/i18n/config";
import { home } from "@/lib/i18n/dict/home";
import { rich } from "@/lib/i18n/rich";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternates("/", locale as Locale) };
}

const Arrow = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const cardHrefs = ["/implants/", "/invisalign/", "/pont-dentaire/"];
const cardIcons = [
  <svg key="a" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 21c-12-10-25-2-23 14 1 8 5 28 11 28 6 0 4-17 12-17s6 17 12 17c6 0 10-20 11-28 2-16-11-24-23-14Z" stroke="currentColor" strokeWidth="1.5"/><path d="M34 23c4 3 8 4 13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  <svg key="b" viewBox="0 0 80 80" fill="none" aria-hidden="true"><rect x="15" y="26" width="12" height="28" rx="5" stroke="currentColor" strokeWidth="1.5"/><rect x="34" y="21" width="12" height="33" rx="5" stroke="currentColor" strokeWidth="1.5"/><rect x="53" y="26" width="12" height="28" rx="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 61h58" stroke="currentColor" strokeWidth="1.5"/></svg>,
  <svg key="c" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M12 28q8-9 17 0l3 24q-11 5-18 0zM32 31q8-8 16 0l2 19q-10 5-20 0zM51 28q9-9 17 0l-2 24q-8 5-18 0zM29 35h4m14 0h5M19 57v8h7v-8m29 0v8h7v-8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
];

export default async function Page({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  const t = home[locale];
  return (
<main id="main">
<SmileHero />
<div className="values wrap">{t.values.map((value, index) => <div key={value.title}><span>0{index + 1}</span><p><strong>{value.title}</strong><br />{value.text}</p></div>)}</div>
<section className="services wrap" id="soins"><div className="section-heading"><div><p className="eyebrow">{t.servicesEyebrow}</p><h2>{rich(t.servicesTitle)}</h2></div><p>{rich(t.servicesIntro)}</p></div>
<div className="service-grid service-grid-expanded">{t.cards.map((card, index) => <Link key={card.tag} href={cardHrefs[index]} className={"service-card" + (index === 0 ? " featured" : "")}><div className="service-top"><span>{card.tag}</span>{cardIcons[index]}</div><h3>{rich(card.title)}</h3><p>{rich(card.text)}</p><span className="service-link">{card.link} <Arrow /></span></Link>)}</div><Link href="/rendez-vous/" className="unsure-link">{t.unsure} <span>↗</span></Link></section>
<section className="approach wrap" id="approche"><div className="approach-image"><Image src="/assets/clinic.png" alt={t.approachAlt} loading="lazy" width={1536} height={1024} /><span>{t.approachCaption}</span></div><div className="approach-copy"><p className="eyebrow">{t.approachEyebrow}</p><h2>{rich(t.approachTitle)}</h2><p>{t.approachText}</p>{t.approachLines.map((line, index) => <div className="approach-line" key={line.title}><span>0{index + 1}</span><div><h3>{line.title}</h3><p>{line.text}</p></div></div>)}<Link href="/rendez-vous/" className="text-link">{t.approachLink} <Arrow /></Link></div></section>
<section className="path-section" id="parcours"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">{t.pathEyebrow}</p><h2>{rich(t.pathTitle)}</h2></div><Link href="/rendez-vous/" className="text-link">{t.pathLink} <Arrow /></Link></div><div className="path-grid">{t.path.map((step, index) => <article key={step.tag}><span className="step-number">0{index + 1}</span><h3>{rich(step.title)}</h3><p>{step.text}</p><span className="path-tag">{step.tag}</span></article>)}</div></div></section>
<FeatureSpaces locale={locale}/>
<ReviewsSection locale={locale}/>
<section className="faq-section wrap" id="questions"><div className="faq-intro"><p className="eyebrow">{t.faqEyebrow}</p><h2>{rich(t.faqTitle)}</h2><p>{rich(t.faqIntro)}</p><Link href="/rendez-vous/" className="text-link">{t.faqLink} <Arrow /></Link></div><div className="faq-list">
{t.faq.map((item) => <details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}
</div></section>
<LocationSection locale={locale}/>
</main>
  );
}
