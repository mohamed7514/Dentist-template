import Link from "next/link";
import {Arrow} from "./icons";
import {features,ReservedFeature,type FeatureKind} from "./reserved-feature";
import {PhotoSessionSummary} from "./photo-session";

const content={
 photos:{eyebrow:"MONTRER, SI VOUS LE SOUHAITEZ.",title:"Vos photos.",accent:"Un guide à chaque étape.",intro:"Depuis votre téléphone, un parcours visuel pour partager votre sourire à votre rythme.",steps:["Sourire de face","Vue rapprochée","Profil"],note:"Les photos seront facultatives. Cet espace de gabarit ne collecte et ne transmet aucune photo."},
 booking:{eyebrow:"LE PREMIER PAS PEUT ÊTRE SIMPLE.",title:"Une rencontre.",accent:"À votre rythme.",intro:"Un espace pour préparer votre demande, poser vos questions et proposer un créneau d’évaluation.",steps:["Votre projet","Votre créneau souhaité","La confirmation du cabinet"],note:"Un créneau souhaité devra être vérifié et confirmé par la réception. Aucun rendez-vous n’est réservé depuis cet espace de gabarit."},
};

export function FeaturePage({kind}:{kind:FeatureKind}){
 const page=content[kind];
 return <main id="main" className="feature-page"><section className="directory-hero wrap"><Link className="breadcrumb" href="/">← Accueil / {features[kind].title}</Link><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}<br/><em>{page.accent}</em></h1><p>{page.intro}</p></section>
 <section className="feature-workspace wrap" aria-label={features[kind].title}>{kind==="booking"&&<PhotoSessionSummary/>}<div className="feature-step-row">{page.steps.map((step,index)=><div key={step}><span>0{index+1}</span><p>{step}</p></div>)}</div>{kind==="booking"&&<div className="intake-reservation"><div><span>ESPACE RÉSERVÉ · MICRO-QUESTIONNAIRE</span><h2>Parlons de votre projet.</h2></div><div className="intake-fields"><span>Votre besoin</span><span>Votre échéance</span><span>Votre budget</span></div></div>}<ReservedFeature kind={kind} large/>{kind==="booking"&&<div className="followup-reservation"><span>ESPACE RÉSERVÉ</span><p>Confirmation du cabinet et rappels de rendez-vous.</p></div>}<p className="feature-page-note">{page.note}</p></section>
 <section className="feature-next wrap"><p className="eyebrow">CONTINUER VOTRE PARCOURS.</p><div>{(Object.keys(features) as FeatureKind[]).filter(key=>key!==kind).map(key=><Link key={key} href={features[key].href}><div><span>{features[key].label}</span><h2>{features[key].title}</h2></div><Arrow/></Link>)}</div><Link href="/soins/" className="text-link">Revenir aux soins <Arrow/></Link></section></main>;
}
