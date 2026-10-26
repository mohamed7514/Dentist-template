import { define } from "../define";

export const reviews = define(
  {
    eyebrow: "LA CONFIANCE SE RACONTE.",
    title: "Derrière chaque sourire,\n*une expérience.*",
    exampleLabel: "AVIS DE DÉMONSTRATION",
    disclosure: "Des exemples fictifs pour présenter cette section.\n Les avis réels du cabinet prendront leur place ici.",
    scrollHint: "Faites défiler les exemples",
    regionAria: "Exemples fictifs d’avis, défilement horizontal sur mobile",
    fictional: "Exemple fictif · aucun avis patient réel",
    bottom: "L’écoute. La clarté. Le temps de choisir.",
    bottomSub: "Ce qui compte, au-delà du sourire.",
    items: [
      { initials: "ML", name: "Marie L.", context: "L’accueil", quote: "J’avais beaucoup de questions. Ce qui m’a rassurée, c’est de sentir qu’on prenait vraiment le temps de m’écouter." },
      { initials: "AT", name: "Alex T.", context: "Les explications", quote: "Des explications simples, un échange sans pression. J’ai pu comprendre les possibilités avant de décider de la suite." },
      { initials: "SD", name: "Sophie D.", context: "La première visite", quote: "Je ne savais pas par où commencer. Avoir un premier échange clair m’a aidée à avancer, à mon rythme." },
    ],
  },
  {
    eyebrow: "TRUST IS TOLD IN STORIES.",
    title: "Behind every smile,\n*an experience.*",
    exampleLabel: "DEMONSTRATION REVIEWS",
    disclosure: "Fictional examples to present this section.\n The practice’s real reviews will take their place here.",
    scrollHint: "Scroll through the examples",
    regionAria: "Fictional review examples, horizontal scrolling on mobile",
    fictional: "Fictional example · no real patient review",
    bottom: "Listening. Clarity. Time to choose.",
    bottomSub: "What matters, beyond the smile.",
    items: [
      { initials: "ML", name: "Marie L.", context: "The welcome", quote: "I had a lot of questions. What reassured me was feeling that they really took the time to listen to me." },
      { initials: "AT", name: "Alex T.", context: "The explanations", quote: "Simple explanations, a conversation without pressure. I was able to understand the options before deciding what came next." },
      { initials: "SD", name: "Sophie D.", context: "The first visit", quote: "I didn’t know where to start. Having a clear first conversation helped me move forward, at my own pace." },
    ],
  },
);

export const location = define(
  {
    eyebrow: "LE PREMIER PAS, TOUT PRÈS.",
    title: "Votre visite commence\n*par ici.*",
    city: "MONTRÉAL · QUÉBEC",
    addressLabel: "UNE ADRESSE POUR SE RENCONTRER",
    addressCity: "Montréal (Québec) H3G 1V8",
    directions: "Préparer mon itinéraire",
    practicalLabel: "AVANT VOTRE VISITE",
    practical: "Les horaires, le stationnement et les informations d’accès seront précisés avec le cabinet choisi.",
    disclosureStrong: "Emplacement de démonstration.",
    disclosure: " Adresse utilisée comme exemple, sans affiliation avec Épure. Elle sera remplacée par celle du cabinet choisi.",
    mapPlace: "Montréal",
    mapTitle: (street: string) => `Carte de démonstration : ${street}, Montréal`,
    openMaps: "Ouvrir dans Google Maps",
    sourceLabel: "Adresse d’exemple : ",
    sourceNote: "Cabinet de démonstration à remplacer.",
  },
  {
    eyebrow: "THE FIRST STEP, RIGHT NEARBY.",
    title: "Your visit starts\n*right here.*",
    city: "MONTRÉAL · QUEBEC",
    addressLabel: "AN ADDRESS TO MEET",
    addressCity: "Montréal (Quebec) H3G 1V8",
    directions: "Plan my route",
    practicalLabel: "BEFORE YOUR VISIT",
    practical: "Opening hours, parking and access information will be specified with the chosen practice.",
    disclosureStrong: "Demonstration location.",
    disclosure: " Address used as an example, with no affiliation with Épure. It will be replaced by that of the chosen practice.",
    mapPlace: "Montréal",
    mapTitle: (street: string) => `Demonstration map: ${street}, Montréal`,
    openMaps: "Open in Google Maps",
    sourceLabel: "Example address: ",
    sourceNote: "Demonstration practice to be replaced.",
  },
);

export const smileHero = define(
  {
    heading: "Le plaisir de sourire,\n*à nouveau.*",
    frameAria: "Animation illustrative : un sourire avec des dents tachées et manquantes évolue automatiquement vers un sourire complet et naturel.",
    stages: [
      { title: "Chaque sourire a son histoire.", text: "Une dent manquante, une couleur qui vous gêne. Tout commence par vous." },
      { title: "Et si vous imaginiez la suite ?", text: "Retrouver de l’éclat, de l’harmonie, un sourire plus complet." },
      { title: "Le plaisir de sourire. À nouveau.", text: "Vos envies méritent une conversation. À votre rythme, avec votre dentiste." },
    ],
  },
  {
    heading: "The joy of smiling,\n*again.*",
    frameAria: "Illustrative animation: a smile with stained and missing teeth automatically evolves into a complete, natural smile.",
    stages: [
      { title: "Every smile has its story.", text: "A missing tooth, a colour that bothers you. Everything starts with you." },
      { title: "What if you imagined what’s next?", text: "Regain brightness, harmony, a more complete smile." },
      { title: "The joy of smiling. Again.", text: "Your wishes deserve a conversation. At your own pace, with your dentist." },
    ],
  },
);

export const emergency = define(
  {
    quickContact: "Contact rapide",
    label: "Urgence dentaire",
    labelCaps: "URGENCE DENTAIRE",
    appointment: "Rendez-vous",
    close: "Fermer",
    call: "Appeler la clinique",
    phoneToFill: "Numéro à renseigner",
  },
  {
    quickContact: "Quick contact",
    label: "Dental emergency",
    labelCaps: "DENTAL EMERGENCY",
    appointment: "Book",
    close: "Close",
    call: "Call the clinic",
    phoneToFill: "Number to be added",
  },
);
