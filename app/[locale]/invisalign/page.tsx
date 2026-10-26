import type { Metadata } from "next";
import Link from "@/components/locale-link";
import { CinematicTreatmentHero } from "@/components/cinematic-treatment-hero";
import { Arrow } from "@/components/icons";
import { alternates, type Locale } from "@/lib/i18n/config";
import { invisalign } from "@/lib/i18n/dict/pages";
import { rich } from "@/lib/i18n/rich";
import "./invisalign.css";

export async function generateMetadata({ params }: PageProps<"/[locale]/invisalign">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return { title: invisalign[locale].metaTitle, description: invisalign[locale].metaDescription, alternates: alternates("/invisalign/", locale) };
}

export default async function Page({ params }: PageProps<"/[locale]/invisalign">) {
  const locale = (await params).locale as Locale;
  const t = invisalign[locale];
  return <main id="main" className="invisalign-page treatment-page">
    <CinematicTreatmentHero
      id="invisalign-hero"
      headingId="invisalign-heading"
      service={t.hero.service}
      eyebrow={t.hero.eyebrow}
      heading={t.hero.heading}
      accent={t.hero.accent}
      intro={t.hero.intro}
      videoSrc="/assets/invisalign-hero/alignment.mp4"
      posterSrc="/assets/invisalign-hero/poster.webp"
      description={t.hero.description}
      playbackLabel={t.hero.playbackLabel}
      note={t.hero.note}
    />
    <section className="invisalign-understand wrap" aria-labelledby="invisalign-understand-heading">
      <div><p className="eyebrow">{t.understandEyebrow}</p><h2 id="invisalign-understand-heading">{rich(t.understandTitle)}</h2></div>
      <div>{t.understandText.map((text) => <p key={text}>{text}</p>)}<a href={t.sourceUrl} className="invisalign-source" target="_blank" rel="noopener noreferrer">{t.sourceLabel}</a></div>
    </section>
    <section className="faq-section treatment-faq wrap" id="questions" aria-labelledby="invisalign-faq-heading">
      <div className="faq-intro"><p className="eyebrow">{t.faqEyebrow}</p><h2 id="invisalign-faq-heading">{rich(t.faqTitle)}</h2><p>{rich(t.faqIntro)}</p><Link href="/rendez-vous/" className="text-link">{t.faqLink} <Arrow /></Link></div>
      <div className="faq-list">{t.faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </section>
  </main>;
}
