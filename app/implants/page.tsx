import Link from "next/link";
import { Arrow } from "@/components/icons";
import { ImplantHero } from "@/components/implant-hero";
import "./implants.css";

export const metadata = {
  title: "Implants dentaires · Retrouver le plaisir de sourire",
  description: "Découvrez les implants dentaires à travers une animation immersive et préparez votre première évaluation.",
};

const questions = [
  ["Est-ce qu’un implant convient à tout le monde ?", "La possibilité d’un implant dépend notamment de la santé générale, des gencives et de l’os disponible. Le dentiste doit examiner votre situation pour vous conseiller. Un questionnaire ou des photos ne permettent pas de déterminer votre admissibilité."],
  ["Est-ce la seule solution pour remplacer une dent ?", "Non. Selon la situation, des ponts ou des prothèses peuvent également être envisagés. L’évaluation permet de discuter des options, de leurs limites et des coûts."],
  ["Combien de temps peut prendre le traitement ?", "Le traitement peut nécessiter plusieurs visites et une période de guérison de plusieurs mois. Des soins préparatoires peuvent aussi être nécessaires. Le dentiste vous expliquera le calendrier adapté à votre situation."],
  ["Quel budget dois-je prévoir ?", "Le coût dépend du plan de traitement et des soins nécessaires. Un devis personnalisé permet de comprendre les coûts avant de décider. Aucun prix clinique n’est fixé dans cette démonstration."],
  ["Je suis inquiet. Puis-je commencer par en parler ?", "Oui. Vos questions et vos hésitations ont leur place dès le premier échange, avant de décider d’un traitement. Vous pouvez également commencer sans envoyer de photos."],
  ["Que se passe-t-il après ma demande de créneau ?", "La réception doit vérifier le planning puis vous confirmer le rendez-vous ou proposer un autre créneau. Aucun rendez-vous réel n’est réservé depuis ce site modèle."],
] as const;

export default function Page() {
  return <main id="main" className="implants-page">
    <ImplantHero />


    <section className="faq-section implant-faq wrap" id="questions" aria-labelledby="implant-faq-heading">
      <div className="faq-intro"><p className="eyebrow">DES QUESTIONS NORMALES.</p><h2 id="implant-faq-heading">Le temps<br /><em>de comprendre.</em></h2><p>Chaque sourire a son histoire.<br />Voici quelques premiers repères pour la suite.</p><Link href="/rendez-vous/" className="text-link">Parler de mon projet <Arrow /></Link></div>
      <div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </section>
  </main>;
}
