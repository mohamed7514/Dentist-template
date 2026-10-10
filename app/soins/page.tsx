import Link from "next/link";
import {Arrow} from "@/components/icons";
import {services} from "@/lib/services";
import {FeatureSpaces} from "@/components/reserved-feature";
export const metadata={title:"Nos soins",description:"Implants, blanchiment et alignement : découvrez les espaces de soins Épure."};
export default function Page(){return <main id="main">
 <section className="directory-hero wrap"><p className="eyebrow">NOS SOINS</p><h1>Qu’est-ce qui<br/><em>compte pour vous ?</em></h1><p>Une dent à remplacer. Une envie d’éclat. Un sourire à harmoniser.<br/>Choisissez votre point de départ. Nous vous guidons pour la suite.</p></section>
 <section className="service-directory wrap" aria-label="Les soins">{services.map(service=><Link className="directory-card" key={service.href} href={service.href}><span className="directory-number">{service.number}</span><div><p className="eyebrow">{service.verb.toUpperCase()}</p><h2>{service.name}</h2><p>{service.description}</p><span className="directory-link">Découvrir ce soin <Arrow/></span></div><span className="directory-editorial">{service.title}</span></Link>)}</section>
 <section className="service-unsure wrap"><span>VOUS HÉSITEZ ENCORE ?</span><h2>Une question suffit<br/><em>pour commencer.</em></h2><p>Vous n’avez pas à choisir un traitement aujourd’hui.<br/>Vous pouvez simplement préparer un premier échange.</p><Link href="/rendez-vous/" className="btn">Préparer ma visite <Arrow/></Link></section>
 <FeatureSpaces/>
 </main>}
