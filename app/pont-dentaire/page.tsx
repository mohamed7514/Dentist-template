import Link from "next/link";
import { CinematicTreatmentHero } from "@/components/cinematic-treatment-hero";
import { Arrow } from "@/components/icons";
import "./bridge.css";

export const metadata = {
  title: "Pont dentaire fixe · Appui sur dents naturelles",
  description: "Découvrez le pont dentaire fixe sur dents naturelles grâce à une animation 3D et préparez votre évaluation pour remplacer une dent manquante.",
};

const questions = [
  ["Sur quoi tient ce pont fixe ?", "Les deux couronnes aux extrémités recouvrent des dents naturelles préparées. La dent de remplacement est reliée entre elles."],
  ["Faut-il préparer les dents voisines ?", "Oui. Un pont traditionnel implique de remodeler les dents piliers pour recevoir les couronnes."],
  ["Puis-je l’enlever pour le nettoyer ?", "Le pont est fixé par le dentiste. Un nettoyage quotidien sous le pont reste nécessaire."],
  ["Quelles autres solutions évaluer ?", "Un implant ou une prothèse amovible peuvent être discutés selon l’état de vos dents et de vos gencives."],
  ["Combien de visites faut-il prévoir ?", "La préparation, la fabrication puis l’ajustement nécessitent plusieurs rendez-vous. Le calendrier se précise après l’examen."],
  ["Quel budget dois-je prévoir ?", "Un devis personnalisé détaille le traitement et les coûts avant votre décision."],
] as const;

export default function Page() {
  return <main id="main" className="bridge-page treatment-page">
    <CinematicTreatmentHero
      id="bridge-hero"
      headingId="bridge-heading"
      service="Pont dentaire fixe"
      eyebrow="PONT FIXE SUR DENTS NATURELLES"
      heading="Une dent manquante."
      accent="Un nouvel équilibre."
      intro={"Un appui de chaque côté.\nUne solution à évaluer ensemble."}
      videoSrc="/assets/bridge-hero/placement-v3.mp4"
      posterSrc="/assets/bridge-hero/poster-v3.webp"
      description="Animation 3D illustrative : un pont de trois éléments descend sur deux dents naturelles préparées. Les couronnes recouvrent les dents piliers et l’élément central remplace la dent manquante."
      playbackLabel="du pont dentaire"
      note="Animation 3D illustrative. Le choix d’un pont nécessite un examen."
    />
    <section className="bridge-understand wrap" aria-labelledby="bridge-understand-heading">
      <div><p className="eyebrow">UN LIEN POUR VOTRE SOURIRE.</p><h2 id="bridge-understand-heading">Deux dents d’appui.<br /><em>Une restauration fixe.</em></h2></div>
      <div><p>Un pont traditionnel remplace une dent en s’appuyant sur les dents naturelles voisines. Les couronnes et la dent de remplacement forment une pièce fabriquée sur mesure.</p><p>Le dentiste vérifie les dents piliers, les gencives et votre situation avant de proposer cette option.</p><a href="https://www.cda-adc.ca/fr/pour-le-public/comprendre-votre-sante-buccodentaire/procdures-dentaires/ponts" target="_blank" rel="noopener noreferrer" className="bridge-source">En savoir plus · Association dentaire canadienne ↗</a></div>
    </section>
    <section className="faq-section treatment-faq wrap" id="questions" aria-labelledby="bridge-faq-heading">
      <div className="faq-intro"><p className="eyebrow">COMPRENDRE AVANT DE DÉCIDER.</p><h2 id="bridge-faq-heading">Un projet de sourire.<br /><em>Des questions à poser.</em></h2><p>Vos possibilités se discutent ensemble.<br />Un premier échange pour y voir plus clair.</p><Link href="/rendez-vous/" className="text-link">Préparer mon évaluation <Arrow /></Link></div>
      <div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </section>
  </main>;
}
