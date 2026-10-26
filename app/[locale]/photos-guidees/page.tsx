import type {Metadata} from "next";
import Link from "@/components/locale-link";
import {PhotoCapture} from "@/components/photo-capture";
import {alternates,type Locale} from "@/lib/i18n/config";
import {photosPage} from "@/lib/i18n/dict/pages";
import {rich} from "@/lib/i18n/rich";

export async function generateMetadata({params}:PageProps<"/[locale]/photos-guidees">):Promise<Metadata>{
 const locale=(await params).locale as Locale;
 return {title:photosPage[locale].metaTitle,description:photosPage[locale].metaDescription,alternates:alternates("/photos-guidees/",locale)};
}
export default async function Page({params}:PageProps<"/[locale]/photos-guidees">){
 const locale=(await params).locale as Locale;const t=photosPage[locale];
 return <main id="main" className="photo-page"><section className="photo-page-intro wrap"><Link className="breadcrumb" href="/">{t.breadcrumb}</Link><div><div><h1>{rich(t.title)}</h1></div></div></section><PhotoCapture/></main>}
