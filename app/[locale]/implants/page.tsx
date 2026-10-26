import type { Metadata } from "next";
import Link from "@/components/locale-link";
import { Arrow } from "@/components/icons";
import { ImplantHero } from "@/components/implant-hero";
import { alternates, type Locale } from "@/lib/i18n/config";
import { implants } from "@/lib/i18n/dict/pages";
import { rich } from "@/lib/i18n/rich";

export async function generateMetadata({ params }: PageProps<"/[locale]/implants">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return { title: implants[locale].metaTitle, description: implants[locale].metaDescription, alternates: alternates("/implants/", locale) };
}

export default async function Page({ params }: PageProps<"/[locale]/implants">) {
  const locale = (await params).locale as Locale;
  const t = implants[locale];
  return <main id="main" className="implants-page treatment-page">
    <ImplantHero locale={locale} />
    <section className="faq-section treatment-faq wrap" id="questions" aria-labelledby="implant-faq-heading">
      <div className="faq-intro"><p className="eyebrow">{t.faqEyebrow}</p><h2 id="implant-faq-heading">{rich(t.faqTitle)}</h2><p>{rich(t.faqIntro)}</p><Link href="/rendez-vous/" className="text-link">{t.faqLink} <Arrow /></Link></div>
      <div className="faq-list">{t.faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </section>
  </main>;
}
