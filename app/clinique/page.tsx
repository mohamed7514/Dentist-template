import Image from "next/image";
import Link from "next/link";
import {Arrow} from "@/components/icons";
import {ReviewsSection, LocationSection} from "@/components/reviews-location";
export const metadata={title:"La clinique",description:"Découvrez l’esprit Épure : un accueil humain et une conversation à votre rythme."};
export default function Page(){return <main id="main">
 <section className="directory-hero wrap"><p className="eyebrow">L’ESPRIT ÉPURE.</p><h1>Un lieu pour vous.<br/><em>Du temps pour vous écouter.</em></h1><p>Avant de parler de soins, parlons de vous.<br/>De vos attentes, de vos questions et de ce qui vous met à l’aise.</p></section>
 <figure className="clinic-panorama wrap"><Image src="/assets/clinic.png" alt="Vue illustrative d’un accueil de clinique blanc et beige" width={1536} height={1024} priority/><figcaption>UN ACCUEIL PENSÉ POUR SE SENTIR À L’AISE · CLINIQUE FICTIVE</figcaption></figure>
 <section className="service-conversation clinic-values"><div className="wrap"><p className="eyebrow">NOTRE FAÇON DE VOUS ACCUEILLIR.</p><h2>Comprendre vos envies.<br/><em>Respecter votre rythme.</em></h2><div className="service-conversation-grid"><article><span>01</span><h3>Un accueil humain.</h3><p>Vos hésitations et vos questions ont leur place dès le premier échange.</p></article><article><span>02</span><h3>Des explications claires.</h3><p>Le temps de parler des possibilités, des étapes et du budget avant de décider.</p></article><article><span>03</span><h3>Votre décision.</h3><p>Vous avancez à votre rythme, avec les réponses dont vous avez besoin.</p></article></div></div></section>
 <section className="clinic-reservations wrap"><p className="eyebrow">DÉCOUVRIR LE CABINET.</p><div><article><span>ESPACE RÉSERVÉ</span><h2>L’équipe.</h2><p>Les portraits, les noms et la présentation de votre équipe trouveront leur place ici.</p></article><article><span>ESPACE RÉSERVÉ</span><h2>Votre visite.</h2><p>L’adresse, les horaires, les coordonnées et les informations d’accès seront intégrés ici.</p></article></div><Link className="btn" href="/rendez-vous/">Préparer ma première visite <Arrow/></Link></section>
 <ReviewsSection/>
 <LocationSection/>
 </main>}
