# Page Pont dentaire fixe — aperçu local

Préparée le 26 octobre 2026. La publication attend la validation visuelle de l’utilisateur.

## Livrables

- Page : `/pont-dentaire/`.
- Vidéo : `public/assets/bridge-hero/placement-v3.mp4` — 1080 × 1080, H.264, 60 images/seconde, 720 images, 12 secondes, sans audio et en boucle.
- Image fixe : `public/assets/bridge-hero/poster-v3.webp`.
- Sources originales conservées : `jaw-original.png` et `bridge-original.png`. La correction du pont est conservée dans `bridge-v3-original.png`.
- Couches enregistrées : `jaw.png`, `bridge-v3.png` et coordonnées dans `layout-v3.json`.
- Rendu : `node scripts/render-bridge-hero.mjs`, avec FFmpeg sur le PATH.
- Contrôle navigateur : `node tools/bridge-check.mjs <origine>`, depuis le dossier parent du projet.

## Visuels et mouvement

Mode de création : outil intégré **image_gen**. Aucun appel de génération via la clé API de la clinique. Référence de style fournie par l’utilisateur : `bal.png`.

Les sources sont des rendus 3D illustratifs générés, et non des photos cliniques ni une simulation personnalisée. Le modèle représente un pont traditionnel de trois éléments, supporté par deux dents naturelles préparées. Les deux couronnes recouvrent les dents piliers; le pontique central remplace la dent manquante. Le modèle ne comporte pas de vis ou de pièces d’implant.

Les couches ont été mises à l’échelle et enregistrées pour faire correspondre les couronnes aux deux dents piliers. La restauration descend d’un seul bloc, avec une courbe de mouvement douce, puis reste en position. Une transition en fondu relance la boucle. La durée du film ne représente pas celle d’un traitement.

Le pontique central a ensuite été agrandi pour corriger sa hauteur insuffisante et prolonger sa base jusqu’à la gencive en position finale. Les couronnes latérales et la trajectoire sont conservées. Les deux passes d’édition avec l’outil intégré image_gen sont documentées dans [pontic-correction.md](pontic-correction.md). Les fichiers vidéo et affiche sont versionnés pour éviter de réutiliser l’ancien visuel en cache.

La page reprend le hero cinématique des implants : lecture inline muette, pause manuelle, pause hors écran et affiche fixe si le mouvement réduit est demandé. Aucun sélecteur de frames ou parcours par étapes n’est affiché.

## Source du contenu patient

[Association dentaire canadienne — Ponts](https://www.cda-adc.ca/fr/pour-le-public/comprendre-votre-sante-buccodentaire/procdures-dentaires/ponts)

## Vérification locale

- Build Next.js de production dans une copie isolée du projet.
- 16 tests serveur réussis, dont le routage d’une question sur un pont vers la bonne page et le parcours existant de rendez-vous.
- Vérification Chrome : lecture vidéo réelle, pause au clavier, menu, FAQ, navigation entre soins et absence de débordement aux largeurs 320, 390, 768 et 1440 px.
- Résultats et captures : `C:/Dev/dentist/preview/bridge/`.
- Après correction du pontique : 37 contrôles navigateur réussis avec la vidéo version 3; captures mobiles et résultats dans `C:/Dev/dentist/preview/bridge-pontic-v3/`.

## Prompts utilisés

### Dents naturelles préparées

Use case: scientific-educational.
Asset type: ONE isolated photorealistic dental teaching model layer for a smooth TOOTH-SUPPORTED FIXED DENTAL BRIDGE animation.
The input image is a clinical rendering and anatomical reference, NOT a collage layout to reproduce.
Create a short LOWER dental arch segment with exactly FIVE tooth positions arranged in a gentle arc, viewed almost frontally with the camera 15 degrees above horizontal, no yaw, orthographic projection:
From left to right: one intact natural premolar, ONE PREPARED NATURAL ABUTMENT TOOTH, ONE MISSING TOOTH SPACE with healed pink gum ridge, ONE PREPARED NATURAL ABUTMENT TOOTH, one intact natural premolar.
Both prepared abutments are healthy ivory NATURAL teeth reduced to short smoothly tapered dentin stumps with rounded shoulders and a flat beveled top, ready for crown retainers. They emerge naturally from the gingiva on either side of the missing tooth gap. They are NOT metal implants, not artificial screw posts, not healing caps. The two stumps must be the same realistic height, clearly visible, parallel insertion axis, balanced placement with room for a three-unit bridge. Exactly one missing tooth gap between them.
A realistic textured healthy pink gum block supports the entire five-position model. Beautiful warm ivory enamel on the two intact outer teeth; exposed prepared tooth dentin ivory slightly warmer. Photorealistic high-end medical 3D render with very fine surface detail, realistic soft reflections, naturally translucent enamel. Soft studio key light from upper left, subtle rim illumination appropriate over dark charcoal.
Composition: single complete isolated model comfortably centered with generous clear margins and no cropping. Tooth positions symmetrical around the central missing-tooth axis. No bridge or crowns floating above yet. TRUE transparent RGBA background, no baked checkerboard or backdrop. No exposed roots or bone cutaway. No face, lips, tongue, blood, drills, metal, screws or surgical tools. No arrows, numbers, labels, inset circles, text, logo, border or watermark. ONE view, not a montage.

### Pont de trois éléments

Use case: scientific-educational.
Asset type: ONE photorealistic three-unit fixed dental bridge component, on transparent background, to be animated down onto the supplied prepared natural teeth.
The attached jaw model is an EXACT camera, canvas, scale, lighting and geometry reference. Output ONLY THE FIXED THREE-UNIT BRIDGE, with no jaw, gums, other teeth or objects.
Create one anatomically plausible all-ceramic TOOTH-SUPPORTED fixed bridge: a single connected unit consisting of the left hollow retainer crown, one middle pontic replacement tooth, and the right hollow retainer crown. The three crown shapes are physically joined side to side with subtle ceramic connectors at the contact points. The two end crowns are hollow underneath to slide over the two prepared natural tooth stumps in the reference; the middle pontic fills the SINGLE missing-tooth space between them.
CRITICAL POSITIONING: keep the EXACT same canvas dimensions and orthographic camera as the reference. Place the bridge in its fully SEATED projected position. Left retainer centered over the left prepared stump (about 32% across the canvas), right retainer centered over the right prepared stump (about 68% across the canvas), middle pontic centered between them. The lower margins of the two end crowns terminate precisely at the gingival shoulders of the prepared teeth. The pontic underside lightly meets the healed ridge in the missing-tooth gap. The crown tops align naturally with the two intact outer teeth when composited onto the reference. Keep the same gentle arc and insertion axes.
Color and materials: match the warm ivory enamel, highly realistic fine ceramic surface, soft translucent edges, subtle grooves and lovely soft studio reflections of the reference. Clinically plausible crown contours and heights, not oversized cubes. No metal or screws, no implants. No roots. The crowns must not contain exposed stump tips — they are shell crowns covering them.
ONE complete original connected three-unit bridge only; no detached single crowns or duplicated arch. True transparent RGBA background, not a white or gray backdrop or checkerboard. Soft key light from upper left, camera almost frontally from 15 degrees above horizontal, no yaw, matching the input. No labels, text, arrows, inset circles, logos, numbers or multiple panels.

