# Hero animé des implants — aperçu local

Version préparée le 25 octobre 2026, en attente de validation visuelle avant publication.

Un seul hero avec assemblage en mouvement continu. Aucun parcours par étapes, onglet, compteur ou curseur n’est affiché.

## Livrables

- Vidéo corrigée : `public/assets/implant-hero/assembly-v2.mp4`, 1080 × 1080, H.264, 60 images/seconde, 768 images, 12,8 secondes, environ 1 Mo, sans audio, boucle.
- Image fixe corrigée : `public/assets/implant-hero/poster-v2.webp`.
- Aperçu animé à partager : `public/assets/implant-hero/preview-v2.gif`.
- Sources 3D avec transparence : `assets/source/implant-hero/*-original.png`.
- Rendu reproductible : `node scripts/render-implant-hero.mjs`, avec FFmpeg sur le PATH. Le script réutilise les images conservées dans le projet.

Les quatre éléments sont des images issues de l’outil intégré **image_gen**, avec la référence utilisateur `ch1.png` pour le style. Le mouvement continu est composé et encodé avec FFmpeg à partir de ces éléments transparents : translation de l’implant, du pilier puis de la couronne, avec ralentissement à l’arrivée. La scène et les proportions sont illustratives ; il ne s’agit pas d’une simulation clinique ni d’une vidéo d’un traitement réel.

La version 2 corrige l’emboîtement du pilier : sa position finale descend de 12 pixels et la paroi avant de l’implant masque la partie de la tige entrée dans le logement. Le rebord arrière reste derrière le pilier. Ce masquage s’applique pendant toute l’insertion, avant la pose de la couronne. Les premiers exports sont conservés pour comparaison.

## Prompts

### Modèle de mâchoire

Use case: scientific-educational.
Asset type: ONE photorealistic 3D model layer for a smooth dental implant animation, on a genuinely transparent RGBA background.
Input image is a rendering quality / anatomical realism reference, not a layout to reproduce.
Create a single isolated lower-jaw dental teaching model: exactly two healthy natural ivory premolar teeth flanking ONE missing premolar in the center. The broad pink gingival ridge is healed, with a small prepared central implant opening. A clean frontal vertical cutaway exposes both natural tooth roots in realistic porous cancellous beige bone and an empty narrow vertical central implant socket. The socket extends vertically down from the gum into the bone, accurately sized for a titanium implant, but there is NO implant, no healing cap, no abutment, no crown in the empty central space.
Camera: fixed almost frontal orthographic 3D view, just 10 degrees above horizontal so the top opening is subtly visible, without yaw; implant socket axis perfectly vertical at exactly the horizontal center. Clinical, elegant, high-end 3D medical visualization like the reference: glossy translucent ivory enamel, naturally textured soft pink gums, fine porous bone, accurate natural roots. No gore.
Composition: the entire physical model is visible with generous transparent padding, centered; compact block of jaw bone lower half, two crowns above it, the missing center crown position clearly open. Flat cutaway face toward the camera. Realistic consistent soft studio illumination from upper left with subtle highlights; soft contact shadow can be translucent. The lighting must work over a dark charcoal backdrop. No surrounding mouth, no face, no tongue, no tools. No floating components.
Output one high-resolution image, NOT a montage or storyboard. No text, numbers, logos, arrows, panels, lines or watermarks. Transparent background, no checkerboard baked into the image.

### implant

Use case: scientific-educational. Asset type: one isolated photorealistic 3D dental component layer for a continuously animated implant assembly. The attached lower jaw model is a camera, material, lighting and anatomical scale reference only. Output ONLY the requested isolated component, NOT the jaw or any teeth/gums/bone surrounding it. Genuinely transparent RGBA background, no baked checkerboard, no floor, no shadow outside the component, no captions, no text, no labels, no arrows, no multiple panels or duplicates. Fixed orthographic almost frontal view, 10 degrees above horizontal, no horizontal yaw; long axis perfectly vertical. Soft studio illumination from upper left matching the reference. High-end realistic medical 3D render. A single complete object centered in the image with clear transparent padding, unclipped. SUBJECT: a single modern screw-shaped titanium dental implant fixture, without abutment or crown. Accurate cylindrical gently tapered body, fine sharply modeled continuous helical screw threads, slight rounded conical tip, flat open top with small dark internal connection hole and realistic elliptical rim visible at this camera angle. Satin gray titanium, strong but realistic metallic highlights with subtle surface texture, not mirror chrome. Slender ratio of overall width to height about 1:3.2. Object suitable to fit into the central narrow socket of the reference model. No other objects.

### abutment

Use case: scientific-educational. Asset type: one isolated photorealistic 3D dental component layer for a continuously animated implant assembly. The attached lower jaw model is a camera, material, lighting and anatomical scale reference only. Output ONLY the requested isolated component, NOT the jaw or any teeth/gums/bone surrounding it. Genuinely transparent RGBA background, no baked checkerboard, no floor, no shadow outside the component, no captions, no text, no labels, no arrows, no multiple panels or duplicates. Fixed orthographic almost frontal view, 10 degrees above horizontal, no horizontal yaw; long axis perfectly vertical. Soft studio illumination from upper left matching the reference. High-end realistic medical 3D render. A single complete object centered in the image with clear transparent padding, unclipped. SUBJECT: a single small titanium dental abutment, the connection piece between an implant and the artificial crown. A realistic short tapered conical post with narrower top, wider circular collar below, short connecting peg below the collar. Top small dark socket just visible. No crown, no implant fixture, no bone. Satin titanium with smooth highlights; broad metallic collar not excessively wide, medically plausible proportions, total height to widest diameter about 1.5:1. Object shaped like the abutment in a clinical dental implant exploded view. No other objects.

### crown

Use case: scientific-educational. Asset type: one isolated photorealistic 3D dental component layer for a continuously animated implant assembly. The attached lower jaw model is a camera, material, lighting and anatomical scale reference only. Output ONLY the requested isolated component, NOT the jaw or any teeth/gums/bone surrounding it. Genuinely transparent RGBA background, no baked checkerboard, no floor, no shadow outside the component, no captions, no text, no labels, no arrows, no multiple panels or duplicates. Fixed orthographic almost frontal view, 10 degrees above horizontal, no horizontal yaw; long axis perfectly vertical. Soft studio illumination from upper left matching the reference. High-end realistic medical 3D render. A single complete object centered in the image with clear transparent padding, unclipped. SUBJECT: a single beautiful realistic ivory ceramic PREMOLAR dental crown, sized to match and replace the missing center tooth in the reference jaw. Broad rounded natural premolar occlusal surface with two soft cusps, subtle central groove, anatomically plausible contours, a slightly narrower neck at its base. Match the color, shape and appearance of the neighboring natural premolar crowns in the reference: translucent warm ivory enamel with highly detailed glossy soft reflections. NO tooth root or metal visible below it, ONLY the enamel-colored ceramic crown shell. Straight vertical axis, base horizontal. Natural tooth, not a block or cartoon. No other objects.
