import { define } from "../define";

type Faq = readonly [string, string];

export const soins = define(
  {
    metaTitle: "Nos soins",
    metaDescription: "Implants, Invisalign et ponts dentaires : découvrez les espaces de soins Épure.",
    eyebrow: "NOS SOINS",
    title: "Qu’est-ce qui\n*compte pour vous ?*",
    intro: "Une dent à remplacer. Un sourire à harmoniser.\nChoisissez votre point de départ. Nous vous guidons pour la suite.",
    listAria: "Les soins",
    discover: "Découvrir ce soin",
    unsureEyebrow: "VOUS HÉSITEZ ENCORE ?",
    unsureTitle: "Une question suffit\n*pour commencer.*",
    unsureText: "Vous n’avez pas à choisir un traitement aujourd’hui.\nVous pouvez simplement préparer un premier échange.",
    unsureCta: "Préparer ma visite",
  },
  {
    metaTitle: "Our treatments",
    metaDescription: "Implants, Invisalign and dental bridges: discover the Épure treatment areas.",
    eyebrow: "OUR TREATMENTS",
    title: "What matters\n*most to you?*",
    intro: "A tooth to replace. A smile to harmonize.\nChoose your starting point. We guide you from there.",
    listAria: "Treatments",
    discover: "Discover this treatment",
    unsureEyebrow: "STILL HESITATING?",
    unsureTitle: "One question is\n*enough to start.*",
    unsureText: "You don’t have to choose a treatment today.\nYou can simply prepare a first conversation.",
    unsureCta: "Prepare my visit",
  },
);

export const clinique = define(
  {
    metaTitle: "La clinique",
    metaDescription: "Découvrez l’esprit Épure : un accueil humain et une conversation à votre rythme.",
    eyebrow: "L’ESPRIT ÉPURE.",
    title: "Un lieu pour vous.\n*Du temps pour vous écouter.*",
    intro: "Avant de parler de soins, parlons de vous.\nDe vos attentes, de vos questions et de ce qui vous met à l’aise.",
    panoramaAlt: "Vue illustrative d’un accueil de clinique blanc et beige",
    panoramaCaption: "UN ACCUEIL PENSÉ POUR SE SENTIR À L’AISE · CLINIQUE FICTIVE",
    valuesEyebrow: "NOTRE FAÇON DE VOUS ACCUEILLIR.",
    valuesTitle: "Comprendre vos envies.\n*Respecter votre rythme.*",
    values: [
      { title: "Un accueil humain.", text: "Vos hésitations et vos questions ont leur place dès le premier échange." },
      { title: "Des explications claires.", text: "Le temps de parler des possibilités, des étapes et du budget avant de décider." },
      { title: "Votre décision.", text: "Vous avancez à votre rythme, avec les réponses dont vous avez besoin." },
    ],
    reservationsEyebrow: "DÉCOUVRIR LE CABINET.",
    reserved: "ESPACE RÉSERVÉ",
    reservations: [
      { title: "L’équipe.", text: "Les portraits, les noms et la présentation de votre équipe trouveront leur place ici." },
      { title: "Votre visite.", text: "L’adresse, les horaires, les coordonnées et les informations d’accès seront intégrés ici." },
    ],
    cta: "Préparer ma première visite",
  },
  {
    metaTitle: "The clinic",
    metaDescription: "Discover the Épure spirit: a human welcome and a conversation at your own pace.",
    eyebrow: "THE ÉPURE SPIRIT.",
    title: "A place for you.\n*Time to listen to you.*",
    intro: "Before talking about treatments, let’s talk about you.\nYour expectations, your questions and what puts you at ease.",
    panoramaAlt: "Illustrative view of a white and beige clinic reception",
    panoramaCaption: "A RECEPTION DESIGNED TO PUT YOU AT EASE · FICTIONAL CLINIC",
    valuesEyebrow: "OUR WAY OF WELCOMING YOU.",
    valuesTitle: "Understand your wishes.\n*Respect your pace.*",
    values: [
      { title: "A human welcome.", text: "Your hesitations and your questions have a place from the very first conversation." },
      { title: "Clear explanations.", text: "Time to talk about the options, the steps and the budget before deciding." },
      { title: "Your decision.", text: "You move at your own pace, with the answers you need." },
    ],
    reservationsEyebrow: "DISCOVER THE PRACTICE.",
    reserved: "RESERVED SPACE",
    reservations: [
      { title: "The team.", text: "The portraits, names and introduction of your team will find their place here." },
      { title: "Your visit.", text: "The address, opening hours, contact details and access information will be added here." },
    ],
    cta: "Prepare my first visit",
  },
);

export const implants = define(
  {
    metaTitle: "Implants dentaires · Retrouver le plaisir de sourire",
    metaDescription: "Découvrez les implants dentaires à travers une animation immersive et préparez votre première évaluation.",
    hero: {
      service: "Implants dentaires",
      eyebrow: "IMPLANTS DENTAIRES",
      heading: "Une dent à remplacer.",
      accent: "Une suite à imaginer.",
      intro: "Un nouvel appui pour votre sourire.\nCommençons par en parler, à votre rythme.",
      description: "Animation illustrative en coupe : un implant descend dans l’os de la mâchoire, puis le pilier et la couronne viennent s’assembler.",
      playbackLabel: "de l’implant",
      note: "Reconstitution 3D illustrative. Le traitement est adapté à chaque patient.",
    },
    faqEyebrow: "DES QUESTIONS NORMALES.",
    faqTitle: "Le temps\n*de comprendre.*",
    faqIntro: "Chaque sourire a son histoire.\nVoici quelques premiers repères pour la suite.",
    faqLink: "Parler de mon projet",
    faq: [
      ["Est-ce qu’un implant convient à tout le monde ?", "La possibilité d’un implant dépend notamment de la santé générale, des gencives et de l’os disponible. Le dentiste doit examiner votre situation pour vous conseiller. Un questionnaire ou des photos ne permettent pas de déterminer votre admissibilité."],
      ["Est-ce la seule solution pour remplacer une dent ?", "Non. Selon la situation, des ponts ou des prothèses peuvent également être envisagés. L’évaluation permet de discuter des options, de leurs limites et des coûts."],
      ["Combien de temps peut prendre le traitement ?", "Le traitement peut nécessiter plusieurs visites et une période de guérison de plusieurs mois. Des soins préparatoires peuvent aussi être nécessaires. Le dentiste vous expliquera le calendrier adapté à votre situation."],
      ["Quel budget dois-je prévoir ?", "Le coût dépend du plan de traitement et des soins nécessaires. Un devis personnalisé permet de comprendre les coûts avant de décider. Aucun prix clinique n’est fixé dans cette démonstration."],
      ["Je suis inquiet. Puis-je commencer par en parler ?", "Oui. Vos questions et vos hésitations ont leur place dès le premier échange, avant de décider d’un traitement. Vous pouvez également commencer sans envoyer de photos."],
      ["Que se passe-t-il après ma demande de créneau ?", "La réception doit vérifier le planning puis vous confirmer le rendez-vous ou proposer un autre créneau. Aucun rendez-vous réel n’est réservé depuis ce site modèle."],
    ] as readonly Faq[],
  },
  {
    metaTitle: "Dental implants · Rediscover the joy of smiling",
    metaDescription: "Discover dental implants through an immersive animation and prepare your first evaluation.",
    hero: {
      service: "Dental implants",
      eyebrow: "DENTAL IMPLANTS",
      heading: "A tooth to replace.",
      accent: "A next step to imagine.",
      intro: "A new foundation for your smile.\nLet’s start by talking about it, at your own pace.",
      description: "Illustrative cross-section animation: an implant goes down into the jawbone, then the abutment and the crown are assembled.",
      playbackLabel: "of the implant",
      note: "Illustrative 3D reconstruction. Treatment is adapted to each patient.",
    },
    faqEyebrow: "NORMAL QUESTIONS.",
    faqTitle: "Time\n*to understand.*",
    faqIntro: "Every smile has its story.\nHere are a few first landmarks for what comes next.",
    faqLink: "Talk about my project",
    faq: [
      ["Is an implant right for everyone?", "Whether an implant is possible depends on general health, the gums and the available bone, among other things. The dentist has to examine your situation to advise you. A questionnaire or photos cannot determine your eligibility."],
      ["Is it the only way to replace a tooth?", "No. Depending on the situation, bridges or dentures can also be considered. The evaluation lets you discuss the options, their limits and the costs."],
      ["How long can the treatment take?", "Treatment can require several visits and a healing period of several months. Preparatory care may also be needed. The dentist will explain the schedule that fits your situation."],
      ["What budget should I plan for?", "The cost depends on the treatment plan and the care needed. A personalized quote lets you understand the costs before deciding. No clinical price is set in this demonstration."],
      ["I’m worried. Can I start by talking about it?", "Yes. Your questions and hesitations have a place from the very first conversation, before any treatment decision. You can also start without sending photos."],
      ["What happens after my time slot request?", "The front desk has to check the schedule, then confirm the appointment or suggest another slot. No real appointment is booked from this model site."],
    ] as readonly Faq[],
  },
);

export const invisalign = define(
  {
    metaTitle: "Invisalign® · Aligneurs transparents",
    metaDescription: "Découvrez les aligneurs transparents Invisalign à travers une animation 3D et préparez votre évaluation pour un projet d’alignement personnalisé.",
    hero: {
      service: "Invisalign®",
      eyebrow: "INVISALIGN® · ALIGNEURS TRANSPARENTS",
      heading: "Votre sourire.",
      accent: "En toute discrétion.",
      intro: "Des gouttières transparentes.\nUn projet à discuter, à votre rythme.",
      description: "Animation 3D illustrative : une gouttière transparente se pose sur une arcade dentaire, les dents s’alignent progressivement, puis la gouttière se retire.",
      playbackLabel: "des aligneurs",
      note: "Animation 3D illustrative et accélérée. Aucun résultat individuel n’est garanti.",
    },
    understandEyebrow: "DISCRET AU QUOTIDIEN.",
    understandTitle: "Un projet personnel.\n*Un suivi bien réel.*",
    understandText: [
      "Les aligneurs Invisalign sont transparents, amovibles et conçus pour votre dentition. Ils se succèdent selon un plan personnalisé pour faire évoluer la position des dents.",
      "Tout commence par une évaluation : vos attentes, les possibilités et les contraintes du traitement se discutent ensemble.",
    ],
    sourceLabel: "Comprendre le traitement · Invisalign Canada ↗",
    sourceUrl: "https://www.invisalign.ca/fr/fonctionnement-du-traitement",
    faqEyebrow: "VOS QUESTIONS ONT LEUR PLACE.",
    faqTitle: "Imaginer la suite.\n*Puis en parler.*",
    faqIntro: "Votre sourire, votre quotidien, vos attentes.\nPréparons un premier échange.",
    faqLink: "Parler de mon sourire",
    faq: [
      ["Comment fonctionnent les aligneurs Invisalign ?", "Une série de gouttières transparentes, fabriquées sur mesure, accompagne le déplacement progressif des dents. Le plan et les changements d’aligneurs sont définis avec le professionnel."],
      ["Puis-je les retirer pour manger ?", "Les aligneurs sont amovibles. Ils se retirent notamment pour les repas et l’hygiène buccodentaire. Le praticien vous explique les consignes de port et d’entretien."],
      ["Est-ce adapté à mon sourire ?", "Un examen permet d’évaluer votre dentition, votre occlusion et vos attentes. Le dentiste détermine les options adaptées à votre situation."],
      ["Combien de temps dure le traitement ?", "La durée dépend des mouvements à réaliser et de votre situation. Elle est estimée après l’évaluation, avec un suivi tout au long du traitement."],
      ["Quel budget dois-je prévoir ?", "Le coût varie selon le plan de traitement. Un devis personnalisé permet de comprendre les frais et les possibilités de couverture avant de décider."],
      ["Que se passe-t-il après l’alignement ?", "Une phase de rétention est généralement nécessaire pour maintenir la position des dents. Le praticien vous explique la solution et le suivi à prévoir."],
    ] as readonly Faq[],
  },
  {
    metaTitle: "Invisalign® · Clear aligners",
    metaDescription: "Discover Invisalign clear aligners through a 3D animation and prepare your evaluation for a personalized alignment project.",
    hero: {
      service: "Invisalign®",
      eyebrow: "INVISALIGN® · CLEAR ALIGNERS",
      heading: "Your smile.",
      accent: "Discreetly.",
      intro: "Clear aligners.\nA project to discuss, at your own pace.",
      description: "Illustrative 3D animation: a clear aligner is placed over a dental arch, the teeth gradually align, then the aligner is removed.",
      playbackLabel: "of the aligners",
      note: "Illustrative, sped-up 3D animation. No individual result is guaranteed.",
    },
    understandEyebrow: "DISCREET DAY TO DAY.",
    understandTitle: "A personal project.\n*Real follow-up.*",
    understandText: [
      "Invisalign aligners are clear, removable and designed for your teeth. They follow one another according to a personalized plan to gradually change the position of your teeth.",
      "Everything starts with an evaluation: your expectations, the possibilities and the constraints of the treatment are discussed together.",
    ],
    sourceLabel: "Understand the treatment · Invisalign Canada ↗",
    sourceUrl: "https://www.invisalign.ca/en/how-invisalign-works",
    faqEyebrow: "YOUR QUESTIONS BELONG HERE.",
    faqTitle: "Imagine what’s next.\n*Then talk about it.*",
    faqIntro: "Your smile, your daily life, your expectations.\nLet’s prepare a first conversation.",
    faqLink: "Talk about my smile",
    faq: [
      ["How do Invisalign aligners work?", "A series of custom-made clear trays gradually guides the movement of the teeth. The plan and the aligner changes are defined with the professional."],
      ["Can I take them out to eat?", "The aligners are removable. They come out for meals and oral hygiene, among other things. The practitioner explains how to wear and care for them."],
      ["Is it suited to my smile?", "An examination lets the dentist assess your teeth, your bite and your expectations, then determine the options suited to your situation."],
      ["How long does the treatment last?", "The duration depends on the movements to be made and on your situation. It is estimated after the evaluation, with follow-up throughout the treatment."],
      ["What budget should I plan for?", "The cost varies according to the treatment plan. A personalized quote lets you understand the fees and the coverage options before deciding."],
      ["What happens after the alignment?", "A retention phase is usually needed to keep the teeth in position. The practitioner explains the solution and the follow-up to plan."],
    ] as readonly Faq[],
  },
);

export const bridge = define(
  {
    metaTitle: "Pont dentaire fixe · Appui sur dents naturelles",
    metaDescription: "Découvrez le pont dentaire fixe sur dents naturelles grâce à une animation 3D et préparez votre évaluation pour remplacer une dent manquante.",
    hero: {
      service: "Pont dentaire fixe",
      eyebrow: "PONT FIXE SUR DENTS NATURELLES",
      heading: "Une dent manquante.",
      accent: "Un nouvel équilibre.",
      intro: "Un appui de chaque côté.\nUne solution à évaluer ensemble.",
      description: "Animation 3D illustrative : un pont de trois éléments descend sur deux dents naturelles préparées. Les couronnes recouvrent les dents piliers et l’élément central remplace la dent manquante.",
      playbackLabel: "du pont dentaire",
      note: "Animation 3D illustrative. Le choix d’un pont nécessite un examen.",
    },
    understandEyebrow: "UN LIEN POUR VOTRE SOURIRE.",
    understandTitle: "Deux dents d’appui.\n*Une restauration fixe.*",
    understandText: [
      "Un pont traditionnel remplace une dent en s’appuyant sur les dents naturelles voisines. Les couronnes et la dent de remplacement forment une pièce fabriquée sur mesure.",
      "Le dentiste vérifie les dents piliers, les gencives et votre situation avant de proposer cette option.",
    ],
    sourceLabel: "En savoir plus · Association dentaire canadienne ↗",
    sourceUrl: "https://www.cda-adc.ca/fr/pour-le-public/comprendre-votre-sante-buccodentaire/procdures-dentaires/ponts",
    faqEyebrow: "COMPRENDRE AVANT DE DÉCIDER.",
    faqTitle: "Un projet de sourire.\n*Des questions à poser.*",
    faqIntro: "Vos possibilités se discutent ensemble.\nUn premier échange pour y voir plus clair.",
    faqLink: "Préparer mon évaluation",
    faq: [
      ["Sur quoi tient ce pont fixe ?", "Les deux couronnes aux extrémités recouvrent des dents naturelles préparées. La dent de remplacement est reliée entre elles."],
      ["Faut-il préparer les dents voisines ?", "Oui. Un pont traditionnel implique de remodeler les dents piliers pour recevoir les couronnes."],
      ["Puis-je l’enlever pour le nettoyer ?", "Le pont est fixé par le dentiste. Un nettoyage quotidien sous le pont reste nécessaire."],
      ["Quelles autres solutions évaluer ?", "Un implant ou une prothèse amovible peuvent être discutés selon l’état de vos dents et de vos gencives."],
      ["Combien de visites faut-il prévoir ?", "La préparation, la fabrication puis l’ajustement nécessitent plusieurs rendez-vous. Le calendrier se précise après l’examen."],
      ["Quel budget dois-je prévoir ?", "Un devis personnalisé détaille le traitement et les coûts avant votre décision."],
    ] as readonly Faq[],
  },
  {
    metaTitle: "Fixed dental bridge · Supported by natural teeth",
    metaDescription: "Discover the fixed dental bridge on natural teeth through a 3D animation and prepare your evaluation to replace a missing tooth.",
    hero: {
      service: "Fixed dental bridge",
      eyebrow: "FIXED BRIDGE ON NATURAL TEETH",
      heading: "A missing tooth.",
      accent: "A new balance.",
      intro: "Support on each side.\nA solution to assess together.",
      description: "Illustrative 3D animation: a three-unit bridge comes down onto two prepared natural teeth. The crowns cover the abutment teeth and the central unit replaces the missing tooth.",
      playbackLabel: "of the dental bridge",
      note: "Illustrative 3D animation. Choosing a bridge requires an examination.",
    },
    understandEyebrow: "A LINK FOR YOUR SMILE.",
    understandTitle: "Two supporting teeth.\n*A fixed restoration.*",
    understandText: [
      "A traditional bridge replaces a tooth by relying on the neighbouring natural teeth. The crowns and the replacement tooth form one custom-made piece.",
      "The dentist checks the abutment teeth, the gums and your situation before suggesting this option.",
    ],
    sourceLabel: "Learn more · Canadian Dental Association ↗",
    sourceUrl: "https://www.cda-adc.ca/en/for-the-public/understanding-your-oral-health/procedures/bridges",
    faqEyebrow: "UNDERSTAND BEFORE DECIDING.",
    faqTitle: "A smile project.\n*Questions to ask.*",
    faqIntro: "Your options are discussed together.\nA first conversation to see more clearly.",
    faqLink: "Prepare my evaluation",
    faq: [
      ["What holds this fixed bridge in place?", "The two crowns at the ends cover prepared natural teeth. The replacement tooth is connected between them."],
      ["Do the neighbouring teeth need to be prepared?", "Yes. A traditional bridge involves reshaping the abutment teeth so they can receive the crowns."],
      ["Can I remove it to clean it?", "The bridge is fixed in place by the dentist. Daily cleaning under the bridge is still necessary."],
      ["What other solutions can be assessed?", "An implant or a removable denture can be discussed depending on the condition of your teeth and gums."],
      ["How many visits should I plan for?", "Preparation, fabrication and fitting require several appointments. The schedule becomes clearer after the examination."],
      ["What budget should I plan for?", "A personalized quote details the treatment and the costs before your decision."],
    ] as readonly Faq[],
  },
);

export const photosPage = define(
  {
    metaTitle: "Vos photos guidées",
    metaDescription: "Préparez deux à trois photos de votre sourire avec un guide à chaque étape. Photos facultatives, conservées uniquement sur votre appareil dans cette démonstration.",
    breadcrumb: "← Accueil / Photos guidées",
    title: "Vos photos.\n*On vous guide.*",
  },
  {
    metaTitle: "Your guided photos",
    metaDescription: "Prepare two to three photos of your smile with a guide at each step. Photos are optional and kept only on your device in this demonstration.",
    breadcrumb: "← Home / Guided photos",
    title: "Your photos.\n*We guide you.*",
  },
);

export const rendezVousMeta = define(
  { title: "Votre première visite", description: "Préparez votre consultation à votre rythme : votre besoin, vos préférences et vos coordonnées." },
  { title: "Your first visit", description: "Prepare your consultation at your own pace: your need, your preferences and your contact details." },
);

export const features = define(
  {
    eyebrow: "À VOTRE RYTHME.",
    title: "Préparez\n*votre visite.*",
    items: [
      { title: "Photos guidées", text: "Préparer vos photos, si vous le souhaitez" },
      { title: "Votre rendez-vous", text: "Votre besoin, vos préférences, votre visite" },
    ],
  },
  {
    eyebrow: "AT YOUR OWN PACE.",
    title: "Prepare\n*your visit.*",
    items: [
      { title: "Guided photos", text: "Prepare your photos, if you wish" },
      { title: "Your appointment", text: "Your need, your preferences, your visit" },
    ],
  },
);

export const cinematic = define(
  {
    backToTreatments: "← Nos soins",
    prepare: "Préparer mon évaluation",
    play: "Lire",
    resume: "Reprendre",
    pause: "Pause",
    playAria: (what: string) => `Lire l’animation ${what}`,
    resumeAria: (what: string) => `Reprendre l’animation ${what}`,
    pauseAria: (what: string) => `Mettre l’animation ${what} en pause`,
  },
  {
    backToTreatments: "← Our treatments",
    prepare: "Prepare my evaluation",
    play: "Play",
    resume: "Resume",
    pause: "Pause",
    playAria: (what: string) => `Play the animation ${what}`,
    resumeAria: (what: string) => `Resume the animation ${what}`,
    pauseAria: (what: string) => `Pause the animation ${what}`,
  },
);
