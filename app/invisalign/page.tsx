import Link from "next/link";
import { CinematicTreatmentHero } from "@/components/cinematic-treatment-hero";
import { Arrow } from "@/components/icons";
import "./invisalign.css";

export const metadata = {
  title: "Invisalign® · Aligneurs transparents",
  description: "Découvrez les aligneurs transparents Invisalign à travers une animation 3D et préparez votre évaluation pour un projet d’alignement personnalisé.",
};

const questions = [
  ["Comment fonctionnent les aligneurs Invisalign ?", "Une série de gouttières transparentes, fabriquées sur mesure, accompagne le déplacement progressif des dents. Le plan et les changements d’aligneurs sont définis avec le professionnel."],
  ["Puis-je les retirer pour manger ?", "Les aligneurs sont amovibles. Ils se retirent notamment pour les repas et l’hygiène buccodentaire. Le praticien vous explique les consignes de port et d’entretien."],
  ["Est-ce adapté à mon sourire ?", "Un examen permet d’évaluer votre dentition, votre occlusion et vos attentes. Le dentiste détermine les options adaptées à votre situation."],
  ["Combien de temps dure le traitement ?", "La durée dépend des mouvements à réaliser et de votre situation. Elle est estimée après l’évaluation, avec un suivi tout au long du traitement."],
  ["Quel budget dois-je prévoir ?", "Le coût varie selon le plan de traitement. Un devis personnalisé permet de comprendre les frais et les possibilités de couverture avant de décider."],
  ["Que se passe-t-il après l’alignement ?", "Une phase de rétention est généralement nécessaire pour maintenir la position des dents. Le praticien vous explique la solution et le suivi à prévoir."],
] as const;

export default function Page() {
  return <main id="main" className="invisalign-page treatment-page">
    <CinematicTreatmentHero
      id="invisalign-hero"
      headingId="invisalign-heading"
      service="Invisalign®"
      eyebrow="INVISALIGN® · ALIGNEURS TRANSPARENTS"
      heading="Votre sourire."
      accent="En toute discrétion."
      intro={"Des gouttières transparentes.\nUn projet à discuter, à votre rythme."}
      videoSrc="/assets/invisalign-hero/alignment.mp4"
      posterSrc="/assets/invisalign-hero/poster.webp"
      description="Animation 3D illustrative : une gouttière transparente se pose sur une arcade dentaire, les dents s’alignent progressivement, puis la gouttière se retire."
      playbackLabel="des aligneurs"
      note="Animation 3D illustrative et accélérée. Aucun résultat individuel n’est garanti."
    />
    <section className="invisalign-understand wrap" aria-labelledby="invisalign-understand-heading">
      <div><p className="eyebrow">DISCRET AU QUOTIDIEN.</p><h2 id="invisalign-understand-heading">Un projet personnel.<br /><em>Un suivi bien réel.</em></h2></div>
      <div><p>Les aligneurs Invisalign sont transparents, amovibles et conçus pour votre dentition. Ils se succèdent selon un plan personnalisé pour faire évoluer la position des dents.</p><p>Tout commence par une évaluation : vos attentes, les possibilités et les contraintes du traitement se discutent ensemble.</p><a href="https://www.invisalign.ca/fr/fonctionnement-du-traitement" className="invisalign-source" target="_blank" rel="noopener noreferrer">Comprendre le traitement · Invisalign Canada ↗</a></div>
    </section>
    <section className="faq-section treatment-faq wrap" id="questions" aria-labelledby="invisalign-faq-heading">
      <div className="faq-intro"><p className="eyebrow">VOS QUESTIONS ONT LEUR PLACE.</p><h2 id="invisalign-faq-heading">Imaginer la suite.<br /><em>Puis en parler.</em></h2><p>Votre sourire, votre quotidien, vos attentes.<br />Préparons un premier échange.</p><Link href="/rendez-vous/" className="text-link">Parler de mon sourire <Arrow /></Link></div>
      <div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </section>
  </main>;
}
