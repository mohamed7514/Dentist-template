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
- `app/layout.tsx` : structure partagée et métadonnées.
- `app/globals.css` : design blanc, anthracite et beige.
- `components/` : navigation, comparaison, formulaires, photos et modales React.
- `lib/journey.ts` : types, questions, validation et dates illustratives.
- `public/assets/` : images.
- `package-lock.json` : versions reproductibles.
- `dist/` : ancienne version HTML conservée comme archive ; ce dossier n’est plus déployé.

Les pages sont des composants React avec de vraies routes Next.js. Le parcours utilise les états React ; aucun ancien script HTML n’est exécuté par la nouvelle application.

## Parcours et limites

Photos guidées importées ou prises avec la caméra, alternative sans photo, comparaison illustrative, trois questions, formulaire contrôlé, choix de créneau et récapitulatif téléchargeable. Les informations restent en mémoire pendant la visite et sont conservées lors de la navigation entre les deux pages, puis effacées au rechargement.

Épure est une identité fictive. Le comparateur montre un exemple indépendant des photos du visiteur. Aucun moteur IA personnalisé, calendrier réel, stockage, notification SMS/email ou invitation à laisser un avis n’est connecté. Aucun rendez-vous réel n’est réservé.

La phase prévue repose sur un calendrier maître, une validation de la réception et une saisie manuelle dans le logiciel dentaire. Aucune API Dentitek/Dentrix/Progident n’est prévue.

## Contrôles

`npm run typecheck` et `npm run build` ont réussi. Depuis le dossier parent : `node tools/next-check.mjs`, avec l’export servi sur le port 3090 (`node scripts/preview.mjs --port 3090` depuis ce projet). Le contrôle couvre la navigation Next.js, les images, les états React, les photos, la validation, les créneaux, la reprise de session, les largeurs 1440/1024/768/390/320 et les erreurs JavaScript/hydratation.

Captures dans `../preview/next/`.

## Visuels et contenu

Les images précédentes sont réutilisées sans génération supplémentaire. Provenance et prompts : `visual-prompts.txt` et `comparison-prompt.txt`. Le lien de l’Association dentaire canadienne est conservé sur la page implants.
