# Épure — Next.js

Site patient construit avec **Next.js 16.4.0**, **React 19.3.0**, **TypeScript** et l’App Router. Le projet est dans `C:/Dev/dentist/site-patient`.

## Démarrage

```sh
npm install
npm run dev
```

Ouvrir `http://127.0.0.1:3000`. Node.js 20.9 ou plus récent est nécessaire.

## Production et vérification

```sh
npm run typecheck
npm run build
npm start
```

Next.js génère un export dans `out/` pour l’hébergement actuel. `npm start` sert cet export. La configuration peut être adaptée à un hébergement Node lorsque les fonctions serveur seront ajoutées.

## Organisation

- `app/page.tsx` : accueil.
- `app/implants/page.tsx` : page implants, métadonnées et navigation Next.js.
- `app/soins/`, `app/blanchiment/`, `app/alignement/` : catalogue et pages de services.
- `app/clinique/` : présentation et espaces réservés à l’équipe et aux coordonnées.
- `app/photos-guidees/` : capture guidée active, caméra ou galerie, deux photos conseillées et profil facultatif, récapitulatif et suppression.
- `app/smile-preview/`, `app/rendez-vous/` : espaces réservés aux prochaines fonctionnalités.
- `components/photo-capture.tsx`, `components/photo-session.tsx` : préparation locale des images et conservation en mémoire pendant la navigation Next.js. Les fichiers sont redimensionnés à 1600 px maximum et réencodés en JPEG sans envoi réseau. Formats photos lisibles par le navigateur, 12 Mo maximum ; HEIC/HEIF affichent un message de remplacement si le navigateur ne peut pas les lire. La caméra est arrêtée à la sortie, au changement d’angle ou quand la page est masquée. Les photos disparaissent au rechargement. La page rendez-vous montre un récapitulatif local ; elle ne transmet aucun fichier.
- `components/reserved-feature.tsx`, `components/feature-page.tsx`, `app/site-pages.css` : gabarit partagé des espaces réservés et nouvelles pages.
- `app/layout.tsx` : structure partagée et métadonnées.
- `app/globals.css` : design blanc, anthracite et beige.
- `components/` : navigation, comparaison, formulaires, photos et modales React.
- `lib/journey.ts` : types, questions, validation et dates illustratives.
- `public/assets/` : images.
- `package-lock.json` : versions reproductibles.
- `dist/` : ancienne version HTML conservée comme archive ; ce dossier n’est plus déployé.

Les pages sont des composants React avec de vraies routes Next.js. Le parcours utilise les états React ; aucun ancien script HTML n’est exécuté par la nouvelle application.

## Parcours et limites

Le site comporte neuf pages publiques. `/photos-guidees/` permet la capture locale et `/rendez-vous/` propose un parcours interactif : urgence ou consultation, besoin/échéance/budget facultatif, date et période souhaitées, coordonnées, récapitulatif modifiable et fin de simulation. Les disponibilités ne sont pas présentées comme réelles. Le formulaire ne transmet rien et n’effectue aucune réservation. Les confirmations et rappels restent à connecter ; SmilePreview reste illustratif.

La réservation utilise un écran centré avec une question à la fois. Les choix de besoin, échéance et budget avancent directement ; le budget peut être passé. La date se choisit dans un calendrier, puis une période de la journée. Les champs facultatifs sont repliés. La navigation et le pied de page marketing sont remplacés, sur cette route uniquement, par un accès au site et un accès d’urgence. La progression comporte quatre phases et les corrections du récapitulatif reviennent directement à la vérification.

`app/editorial-layout.css` harmonise la lecture des pages de contenu : titres internes limités à 60 px sur ordinateur et 36 px sur mobile, espacements réduits, liens de fonctionnalités compacts et appel à la visite moins haut. Le hero GSAP et l’interface de réservation conservent leurs échelles. Les trois avis fictifs se consultent horizontalement sur mobile, au toucher ou au clavier. Sur la page photos, les commandes apparaissent avant le gabarit vide ; la caméra et les photos préparées remontent ensuite au premier plan. Les conseils restent accessibles dans un volet dépliable. Les pages photos et aperçu n’affichent plus le pied de page promotionnel.

Vérification de cette mise en page : `node tools/density-check.mjs` depuis le dossier parent, neuf routes aux largeurs 1440/768/390/320, avec comparaison à l’audit précédent, captures et contrôle des actions visibles. Les contrôles de réservation et de caméra mobile simulée ont également réussi.

`BookingSessionProvider` garde les réponses en mémoire pendant la navigation interne, notamment vers les photos. Aucun stockage persistant n’est utilisé. Un rechargement efface réponses et photos. Le parcours accepte une consultation sans photos, vérifie les champs et le format du téléphone canadien, distingue la préférence de date d’un rendez-vous confirmé et ouvre directement le panneau existant pour une urgence. Utiliser des coordonnées fictives pour les essais.

Les composants du précédent parcours de démonstration sont conservés dans `components/` pour les itérations suivantes. Les comparateurs avant/après existants restent illustratifs. Le hero animé GSAP et sa navigation transparente sont conservés.

Épure est une identité fictive. Le comparateur montre un exemple indépendant des photos du visiteur. Aucun moteur IA personnalisé, calendrier réel, stockage, notification SMS/email ou invitation à laisser un avis n’est connecté. Aucun rendez-vous réel n’est réservé.

La phase prévue repose sur un calendrier maître, une validation de la réception et une saisie manuelle dans le logiciel dentaire. Aucune API Dentitek/Dentrix/Progident n’est prévue.

## Contrôles

`npm run build` inclut la compilation et TypeScript. Depuis le dossier parent : `node tools/booking-check.mjs`, avec l’export servi sur le port 3090 (`node scripts/preview.mjs --port 3090` depuis ce projet). Le contrôle couvre l’urgence, les validations, l’absence de photos/budget/courriel, les corrections, l’aller-retour avec photos sans perte du brouillon, les largeurs 1440/768/390/320, l’absence de transmission et les erreurs JavaScript. Les anciens contrôles de gabarit décrivent des espaces réservés désormais remplacés et doivent être adaptés avant réutilisation.

Captures du gabarit dans `../preview/template/`.

## Visuels et contenu

Le bouton « Urgence dentaire » ouvre un panneau accessible, disponible sur toutes les pages. Sur mobile, il partage la barre fixe avec « Rendez-vous ». Configurer les coordonnées confirmées dans `lib/emergency-contact.ts` ; elles sont volontairement vides pour ne pas appeler le cabinet dont l’adresse sert d’exemple. Aucun formulaire ni rappel automatique n’est ajouté. Le panneau propose les repères 811/911 et ne réalise aucun diagnostic. Vérification ciblée : `node tools/emergency-check.mjs` depuis le dossier parent.

Les images précédentes sont réutilisées sans génération supplémentaire. Provenance et prompts : `visual-prompts.txt` et `comparison-prompt.txt`. Le lien de l’Association dentaire canadienne est conservé sur la page implants.
