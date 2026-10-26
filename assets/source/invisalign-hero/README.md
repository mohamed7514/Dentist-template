# Page Invisalign — aperçu local

Préparée le 26 octobre 2026. La publication attend la validation visuelle de l’utilisateur.

## Livrables

- Page : `/invisalign/`.
- Vidéo : `public/assets/invisalign-hero/alignment.mp4` — 1080 × 1080, H.264, 60 images/seconde, 768 images, 12,8 secondes, sans audio et en boucle.
- Image fixe : `public/assets/invisalign-hero/poster.webp`.
- Sources conservées : `aligned-original.png`, `before-original.png` et `tray-original.png` dans ce dossier.
- Rendu : `node scripts/render-invisalign-hero.mjs`, avec FFmpeg sur le PATH.
- Contrôle navigateur : `node tools/invisalign-check.mjs <origine>`, depuis le dossier parent du projet.

## Visuels et mouvement

Mode de création : outil intégré **image_gen**, sans appel de génération via la clé API de la clinique. La référence de style et de cadrage est l’image fournie par l’utilisateur, `att.QMZDMfCu_j55dxQ4RTDNNijTAQKGL7ydXMiZgosYPxs.png`.

Les images sont des rendus 3D illustratifs générés, et non des photos cliniques, une planification Invisalign ClinCheck ou une simulation personnalisée. Les positions dentaires avant/après sont des modèles fictifs. La vidéo pose la gouttière en mouvement continu, interpole le changement de position des dents, puis retire la gouttière. La membrane laisse passer le modèle et conserve ses reflets. La durée du film ne représente pas celle d’un traitement.

La page reprend le composant de hero des implants et ses règles mobiles : lecture inline muette, pause manuelle, pause hors écran, image fixe si le mouvement réduit est demandé. Aucun parcours par étapes ou curseur n’est affiché.

## Sources du contenu patient

- [Fonctionnement du traitement — Invisalign Canada](https://www.invisalign.ca/fr/fonctionnement-du-traitement)
- [Questions fréquentes — Invisalign Canada](https://www.invisalign.ca/fr/foire-aux-questions)
- [Présentation des aligneurs — Invisalign Canada](https://www.invisalign.ca/fr/pourquoi-invisalign)
- [Interpolation vidéo — documentation FFmpeg](https://ffmpeg.org/ffmpeg-filters.html#minterpolate)

Le site est une clinique modèle. Aucune certification, disponibilité clinique, durée de traitement, couverture d’assurance ou promesse de résultat n’est inventée.

## Prompts utilisés

### Arcade alignée

Use case: scientific-educational.
Asset type: ONE photorealistic 3D dental arch asset for a smooth clear-aligner hero animation.
Input image is a style and clinical rendering reference, not a collage layout to copy.
Create exactly ONE isolated LOWER dental arch with the full natural U-shaped row of teeth, shown from a fixed nearly frontal three-quarter elevation: orthographic camera, centered, 25 degrees above the occlusal plane, no horizontal yaw. All teeth are ALIGNED in a natural harmonious arch. Healthy ivory enamel, detailed realistic crown anatomy, subtle natural translucency and glossy studio reflections; realistic soft pink gum supporting the teeth. The two central incisors and lateral incisors should be clearly visible at the front; canines at the corners; premolars and molars receding on the two sides into the U. The model is a compact clean teaching model with a smooth gum base, NOT a jaw bone cross section.
Quality: luxurious, anatomically plausible photorealistic medical 3D rendering like the reference, fine natural surface details, beautifully lit from upper left with broad soft key light and gentle cool rim illumination so it reads well over dark charcoal.
Composition: the entire single arch fits comfortably inside the frame, equal transparent margins left/right, no cropping of back teeth; centered and with room above for an aligner later. Genuinely transparent background with clean RGBA alpha. No mouth, no lips, no tongue, no face, no tools, no exposed roots or bone, no screws, NO ALIGNER YET, no floating teeth. No text, arrows, circles, panels, numbers, logos or watermark. A single image, not a montage.

### before

Use case: precise-object-edit. Edit target: the supplied isolated aligned lower dental arch. Create the INITIAL, mildly crowded version of this exact same jaw model for an orthodontic alignment animation.
CHANGE ONLY THE FOUR FRONT INCISOR POSITIONS: slightly rotate the left central incisor about 12 degrees and shift it forward by a few millimeters; slightly turn the right lateral incisor inward and allow gentle crowding of the other two incisors. A subtle, natural, mild crowding pattern, not extreme malocclusion. Each incisor remains anatomically intact. Their roots remain hidden in healthy gum, no floating teeth.
CRITICAL INVARIANTS: keep the EXACT same canvas size, camera, scale, perspective, arch silhouette, gum base, background transparency, molars, premolars, canines, material, tooth color and lighting. The unchanged rear teeth and gum must occupy exactly the same pixels as the input; only the front four teeth may change. This will be animated into the supplied original aligned version. Do not change the scene composition or crop. High-end realistic medical 3D render. No new teeth, no missing teeth, no duplicate structures. No aligner, text, arrows or panels. Preserve the genuinely transparent RGBA background.

### tray

Use case: scientific-educational. Asset type: ONE isolated transparent clear-aligner layer for a continuously animated orthodontic hero.
The supplied jaw model is an EXACT geometry, scale and camera reference. Create ONLY the empty removable clear-plastic lower dental aligner that fits precisely over this model's teeth. The tray must follow this same U-shaped arch and match the individual crowns in the reference, with hollow tooth-shaped pockets for incisors in front, canines at corners, and premolars and molars receding at the sides. It is a very THIN clinically realistic transparent orthodontic aligner, not solid teeth and not a thick glass sculpture.
Camera exactly matches the reference: fixed orthographic nearly frontal view from 25 degrees above the occlusal plane, no horizontal yaw. Keep the SAME canvas size, same horizontal center, same projected U shape, with tray in the exact position it would occupy when seated on the reference crowns. The front edge of the tray should end at the reference's tooth/gum boundary; no tooth roots.
TRUE transparent RGBA background. The clear plastic itself is partially transparent: a transparent thin membrane with delicate pale-blue/cool-white specular highlights tracing the tooth pockets and the thin rim. Most of the tray interior must remain translucent so teeth can show through when composited underneath. No opaque white enamel, NO TEETH INSIDE, no gums, no bone, no face, no human. No text, logos, arrows, numbers, no multiple views or frames. One single complete high-resolution clear-aligner cutout, cleanly isolated, realistic polished medical 3D rendering, consistent studio lighting from upper left. Not a montage.
