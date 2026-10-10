import Link from "next/link";
import { Arrow } from "./icons";

export const features = {
 preview: { title: "SmilePreview IA™", label: "Aperçu du sourire", href: "/smile-preview/", description: "Un espace pour explorer visuellement vos envies et préparer la conversation.", reserved: "Réservé à votre aperçu du sourire" },
 photos: { title: "Photos guidées", label: "Capture depuis votre téléphone", href: "/photos-guidees/", description: "Un espace pour ajouter vos photos, avec un guide à chaque étape.", reserved: "Réservé à la capture de photos guidée" },
 booking: { title: "Votre rendez-vous", label: "Préparer la première rencontre", href: "/rendez-vous/", description: "Un espace pour choisir un créneau souhaité et transmettre votre demande.", reserved: "Réservé à la prise de rendez-vous" },
};
export type FeatureKind = keyof typeof features;

export function FeatureSymbol({kind}:{kind:FeatureKind}) {
 return <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
  {kind==="preview"?<><path d="M32 10c0 14-8 22-22 22 14 0 22 8 22 22 0-14 8-22 22-22-14 0-22-8-22-22Z"/><path d="M51 8v12m-6-6h12"/></>:kind==="photos"?<><rect x="8" y="18" width="48" height="34" rx="5"/><path d="m20 18 5-8h14l5 8"/><circle cx="32" cy="35" r="10"/></>:<><rect x="10" y="14" width="44" height="40" rx="4"/><path d="M10 25h44M22 8v12M42 8v12m-21 16h4m7 0h4m7 0h1m-23 9h4m7 0h4"/></>}
 </svg>;
}

export function ReservedFeature({kind,large=false}:{kind:FeatureKind;large?:boolean}) {
 const feature=features[kind];
 if(kind==="photos")return <Link className="photo-feature-card" href={feature.href}><div><span>PHOTOS GUIDÉES</span><span>Disponible sur votre appareil</span></div><FeatureSymbol kind="photos"/><h3>Votre sourire.<br/>Un angle à la fois.</h3><p>Caméra ou galerie · deux à trois photos</p><span>Commencer mes photos <Arrow/></span></Link>;
 return <div className={`reserved-feature${large?" reserved-feature-large":""}`} data-reserved={kind}>
  <div className="reserved-feature-label"><span className="reserved-dot"/> ESPACE RÉSERVÉ <span>Fonctionnalité principale</span></div>
  <div className="reserved-feature-center"><FeatureSymbol kind={kind}/><h3>{feature.reserved}</h3><p>{kind==="preview"?"Aperçu indicatif · avant / après":"Créneau souhaité · coordonnées · confirmation"}</p></div>
  <div className="reserved-feature-bottom"><span>{feature.title}</span><span>Intégration à venir</span></div>
 </div>;
}

export function FeatureSpaces({id="fonctionnalites"}:{id?:string}) {
 return <section className="feature-spaces wrap" id={id}>
  <div className="section-heading"><div><p className="eyebrow">VOTRE PARCOURS DIGITAL.</p><h2>La suite,<br/><em>en toute simplicité.</em></h2></div><p>Des espaces pensés pour vous guider.<br/>Commencez par vos photos, si vous le souhaitez.</p></div>
  <div className="feature-spaces-grid">{(["preview","photos","booking"] as FeatureKind[]).map(kind=><article key={kind}><ReservedFeature kind={kind}/><h3>{features[kind].title}</h3><p>{features[kind].description}</p><Link href={features[kind].href} className="text-link">{kind==="photos"?"Prendre mes photos":"Découvrir cet espace"} <Arrow/></Link></article>)}</div>
 </section>;
}
