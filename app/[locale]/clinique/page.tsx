import Image from "next/image";
import type {Metadata} from "next";
import Link from "@/components/locale-link";
import {Arrow} from "@/components/icons";
import {ReviewsSection, LocationSection} from "@/components/reviews-location";
import {alternates,type Locale} from "@/lib/i18n/config";
import {clinique} from "@/lib/i18n/dict/pages";
import {rich} from "@/lib/i18n/rich";

export async function generateMetadata({params}:PageProps<"/[locale]/clinique">):Promise<Metadata>{
 const locale=(await params).locale as Locale;
 return {title:clinique[locale].metaTitle,description:clinique[locale].metaDescription,alternates:alternates("/clinique/",locale)};
}
export default async function Page({params}:PageProps<"/[locale]/clinique">){
 const locale=(await params).locale as Locale;const t=clinique[locale];
 return <main id="main" className="clinic-page">
 <section className="directory-hero wrap"><p className="eyebrow">{t.eyebrow}</p><h1>{rich(t.title)}</h1><p>{rich(t.intro)}</p></section>
 <figure className="clinic-panorama wrap"><Image src="/assets/clinic.png" alt={t.panoramaAlt} width={1536} height={1024} priority/><figcaption>{t.panoramaCaption}</figcaption></figure>
 <section className="service-conversation clinic-values"><div className="wrap"><p className="eyebrow">{t.valuesEyebrow}</p><h2>{rich(t.valuesTitle)}</h2><div className="service-conversation-grid">{t.values.map((value,index)=><article key={value.title}><span>0{index+1}</span><h3>{value.title}</h3><p>{value.text}</p></article>)}</div></div></section>
 <section className="clinic-reservations wrap"><p className="eyebrow">{t.reservationsEyebrow}</p><div>{t.reservations.map(item=><article key={item.title}><span>{t.reserved}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</div><Link className="btn" href="/rendez-vous/">{t.cta} <Arrow/></Link></section>
 <ReviewsSection locale={locale}/>
 <LocationSection locale={locale}/>
 </main>}
