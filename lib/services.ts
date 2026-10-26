import { define } from "./i18n/define";
import type { Locale } from "./i18n/config";

const data = define(
  [
    { href: "/implants/", name: "Implants dentaires", number: "01", verb: "Retrouver", title: "Un sourire plus complet.", description: "Une ou plusieurs dents manquantes ? Prenez le temps de comprendre vos possibilités." },
    { href: "/invisalign/", name: "Invisalign®", number: "02", verb: "Harmoniser", title: "Un sourire plus harmonieux.", description: "Des aligneurs transparents pour votre projet de sourire. Découvrez les possibilités à évaluer ensemble." },
    { href: "/pont-dentaire/", name: "Pont dentaire fixe", number: "03", verb: "Remplacer", title: "Un nouvel équilibre.", description: "Un pont sur dents naturelles pour remplacer une dent manquante. Prenons le temps d’en parler." },
  ],
  [
    { href: "/implants/", name: "Dental implants", number: "01", verb: "Restore", title: "A more complete smile.", description: "One or more missing teeth? Take the time to understand your options." },
    { href: "/invisalign/", name: "Invisalign®", number: "02", verb: "Align", title: "A more harmonious smile.", description: "Clear aligners for your smile project. Discover the possibilities we can assess together." },
    { href: "/pont-dentaire/", name: "Fixed dental bridge", number: "03", verb: "Replace", title: "A new balance.", description: "A bridge on natural teeth to replace a missing tooth. Let’s take the time to talk about it." },
  ],
);

export const getServices = (locale: Locale) => data[locale];
