import type {Metadata} from "next";
import Link from "@/components/locale-link";
import {Arrow} from "@/components/icons";
import {getServices} from "@/lib/services";
import {FeatureSpaces} from "@/components/reserved-feature";
import {alternates,type Locale} from "@/lib/i18n/config";
import {soins} from "@/lib/i18n/dict/pages";
import {rich} from "@/lib/i18n/rich";

export async function generateMetadata({params}:PageProps<"/[locale]/soins">):Promise<Metadata>{
 const locale=(await params).locale as Locale;
 return {title:soins[locale].metaTitle,description:soins[locale].metaDescription,alternates:alternates("/soins/",locale)};
}
export default async function Page({params}:PageProps<"/[locale]/soins">){
 const locale=(await params).locale as Locale;const t=soins[locale];
 return <main id="main">
 <section className="directory-hero wrap"><p className="eyebrow">{t.eyebrow}</p><h1>{rich(t.title)}</h1><p>{rich(t.intro)}</p></section>
 <section className="service-directory wrap" aria-label={t.listAria}>{getServices(locale).map(service=><Link className="directory-card" key={service.href} href={service.href}><span className="directory-number">{service.number}</span><div><p className="eyebrow">{service.verb.toUpperCase()}</p><h2>{service.name}</h2><p>{service.description}</p><span className="directory-link">{t.discover} <Arrow/></span></div><span className="directory-editorial">{service.title}</span></Link>)}</section>
 <section className="service-unsure wrap"><span>{t.unsureEyebrow}</span><h2>{rich(t.unsureTitle)}</h2><p>{rich(t.unsureText)}</p><Link href="/rendez-vous/" className="btn">{t.unsureCta} <Arrow/></Link></section>
 <FeatureSpaces locale={locale}/>
 </main>}
