import Link from "next/link";
import {BookingJourney} from "@/components/booking-journey";
export const metadata={title:"Votre première visite",description:"Préparez votre consultation à votre rythme : votre besoin, vos préférences et vos coordonnées."};
export default function Page(){return <main id="main" className="booking-page"><section className="booking-hero wrap"><Link className="breadcrumb" href="/">← Accueil / Votre rendez-vous</Link><p className="eyebrow">LE PREMIER PAS, SIMPLEMENT.</p><h1>Commençons<br/><em>par vous.</em></h1><p>Quelques questions pour préparer votre première rencontre.<br/>Vous avancez à votre rythme. Nous vous guidons.</p></section><BookingJourney/></main>}
