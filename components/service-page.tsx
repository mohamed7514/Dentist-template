import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./icons";
import { FeatureSpaces } from "./reserved-feature";
import { services } from "@/lib/services";

export type ServicePageContent={
 number:string;name:string;eyebrow:string;title:string;accent:string;intro:string;image:"portrait"|"smile";
 wishes:string[];conversation:string;questions:{title:string;text:string}[];faqs:{q:string;a:string}[];
};

export function ServicePage({content}:{content:ServicePageContent}) {
 return <main id="main" className="service-page">
  <section className="service-detail-hero wrap">
   <Link href="/soins/" className="breadcrumb">← Nos soins / {content.name}</Link>
   <div className="service-detail-grid"><div className="service-detail-copy"><p className="eyebrow">{content.eyebrow}</p><h1>{content.title}<br/><em>{content.accent}</em></h1><p>{content.intro}</p><Link className="btn" href="/rendez-vous/">Préparer ma première visite <Arrow/></Link><a href="#comprendre" className="text-link">Prendre le temps de comprendre <span>↓</span></a><span className="service-detail-footnote">Vos questions d’abord. Votre décision ensuite.</span></div>
   <div className={`service-detail-image ${content.image==="smile"?"service-smile-image":""}`}><Image src={content.image==="portrait"?"/assets/hero.png":"/assets/smile-final.webp"} alt="Sourire fictif illustratif, sans lien avec un résultat de traitement" width={content.image==="portrait"?1122:1536} height={content.image==="portrait"?1402:1024} priority/><span>{content.number} / {content.name.toUpperCase()} · IMAGE ILLUSTRATIVE</span></div></div>
  </section>
  <section className="service-understand wrap" id="comprendre"><div><p className="eyebrow">CE QUI COMPTE POUR VOUS.</p><h2>Une envie de sourire.<br/><em>Des questions à poser.</em></h2><p>{content.conversation}</p><Link href="/rendez-vous/" className="text-link">Parler de mon projet <Arrow/></Link></div><div className="service-wishes"><span>VOUS VOUS RECONNAISSEZ ?</span>{content.wishes.map((wish,index)=><div key={wish}><b>0{index+1}</b><p>{wish}</p></div>)}</div></section>
  <section className="service-conversation"><div className="wrap"><p className="eyebrow">UN ÉCHANGE POUR Y VOIR PLUS CLAIR.</p><h2>Comprendre avant<br/><em>de vous décider.</em></h2><div className="service-conversation-grid">{content.questions.map((item,index)=><article key={item.title}><span>0{index+1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><p className="small-note">Les possibilités de traitement sont discutées avec le dentiste après une évaluation. Les photos et aperçus en ligne ne remplacent pas cet examen.</p></div></section>
  <FeatureSpaces/>
  <section className="faq-section wrap" id="questions"><div className="faq-intro"><p className="eyebrow">VOS QUESTIONS, TOUT SIMPLEMENT.</p><h2>Avant<br/><em>le premier pas.</em></h2><p>Vous avez le droit de prendre votre temps.</p><Link href="/rendez-vous/" className="text-link">Préparer ma visite <Arrow/></Link></div><div className="faq-list">{content.faqs.map(item=><details key={item.q}><summary>{item.q}<span>+</span></summary><p>{item.a}</p></details>)}</div></section>
  <section className="related-services wrap"><p className="eyebrow">CONTINUER À EXPLORER.</p><h2>À chaque envie,<br/><em>son point de départ.</em></h2><div>{services.filter(service=>service.number!==content.number).map(service=><Link href={service.href} key={service.href}><span>{service.number} / {service.verb}</span><h3>{service.name}</h3><Arrow/></Link>)}</div></section>
 </main>;
}
