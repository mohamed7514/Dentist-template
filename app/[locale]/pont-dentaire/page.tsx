import type { Metadata } from "next";
import Link from "@/components/locale-link";
import { CinematicTreatmentHero } from "@/components/cinematic-treatment-hero";
import { Arrow } from "@/components/icons";
import { alternates, type Locale } from "@/lib/i18n/config";
import { bridge } from "@/lib/i18n/dict/pages";
import { rich } from "@/lib/i18n/rich";
import "./bridge.css";

export async function generateMetadata({ params }: PageProps<"/[locale]/pont-dentaire">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return { title: bridge[locale].metaTitle, description: bridge[locale].metaDescription, alternates: alternates("/pont-dentaire/", locale) };
}

export default async function Page({ params }: PageProps<"/[locale]/pont-dentaire">) {
  const locale = (await params).locale as Locale;
  const t = bridge[locale];
  return <main id="main" className="bridge-page treatment-page">
    <CinematicTreatmentHero
      id="bridge-hero"
      headingId="bridge-heading"
      service={t.hero.service}
      eyebrow={t.hero.eyebrow}
      heading={t.hero.heading}
      accent={t.hero.accent}
      intro={t.hero.intro}
      videoSrc="/assets/bridge-hero/placement-v3.mp4"
      posterSrc="/assets/bridge-hero/poster-v3.webp"
      description={t.hero.description}
      playbackLabel={t.hero.playbackLabel}
      note={t.hero.note}
    />
    <section className="bridge-understand wrap" aria-labelledby="bridge-understand-heading">
      <div><p className="eyebrow">{t.understandEyebrow}</p><h2 id="bridge-understand-heading">{rich(t.understandTitle)}</h2></div>
      <div>{t.understandText.map((text) => <p key={text}>{text}</p>)}<a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" className="bridge-source">{t.sourceLabel}</a></div>
    </section>
    <section className="faq-section treatment-faq wrap" id="questions" aria-labelledby="bridge-faq-heading">
      <div className="faq-intro"><p className="eyebrow">{t.faqEyebrow}</p><h2 id="bridge-faq-heading">{rich(t.faqTitle)}</h2><p>{rich(t.faqIntro)}</p><Link href="/rendez-vous/" className="text-link">{t.faqLink} <Arrow /></Link></div>
      <div className="faq-list">{t.faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </section>
  </main>;
}
