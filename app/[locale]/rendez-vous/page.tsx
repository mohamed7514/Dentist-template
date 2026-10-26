import type {Metadata} from "next";
import {BookingJourney} from "@/components/booking-journey";
import {alternates,type Locale} from "@/lib/i18n/config";
import {rendezVousMeta} from "@/lib/i18n/dict/pages";

export async function generateMetadata({params}:PageProps<"/[locale]/rendez-vous">):Promise<Metadata>{
 const locale=(await params).locale as Locale;
 return {title:rendezVousMeta[locale].title,description:rendezVousMeta[locale].description,alternates:alternates("/rendez-vous/",locale)};
}
export default function Page(){return <main id="main" className="booking-page"><BookingJourney/></main>}
