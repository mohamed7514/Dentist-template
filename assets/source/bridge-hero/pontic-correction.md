# Correction du pontique central

Mode : outil intégré **image_gen**, édition d’un visuel existant sur fond transparent.

La première édition augmente le volume du pontique, puis une seconde allonge encore sa couronne. Le rendu sélectionné est `bridge-v3-original.png`, enregistré avec les coordonnées de `layout-v3.json`. Les couronnes latérales restent en place; le pont entier suit la même translation verticale.

Livrables consommés : `public/assets/bridge-hero/placement-v3.mp4` et `public/assets/bridge-hero/poster-v3.webp`. Aperçu fixe : `seated-preview-v3.png`.

## Première passe

Entrées : `bridge-original.png` (cible) et `seated-preview.png` (contexte). Sortie : `bridge-v2-original.png`.

Use case: precise-object-edit.
Asset type: corrected transparent 3D tooth-supported fixed dental bridge layer for an existing animation.
Input image 1 is the EDIT TARGET, the isolated connected three-unit ivory ceramic bridge. Input image 2 is a supporting assembly reference showing the current error: the middle pontic is visibly undersized.
Change ONLY the MIDDLE replacement tooth (pontic) of image 1. Increase its visible crown HEIGHT by approximately 35 percent and its width about 12 percent so it is comparable in volume and height to its two neighboring retainer crowns. Raise its occlusal cusps into the same harmonious occlusal plane as those crowns. Extend its rounded lower body down to about the same lower level as the two outer crowns (approximately y=735 on this 1774x887 canvas). The underside should form a gentle convex surface that will meet the gum ridge when composited, without the old short dangling silhouette. Preserve realistic small embrasures and subtle side connectors; all three teeth must remain ONE connected bridge. Middle tooth should be anatomically natural, not a tiny bead between two big crowns.
CRITICAL INVARIANTS: keep the left and right retainer crowns EXACTLY unchanged in shape, pixel position, size, angle and lighting. Keep the SAME canvas dimensions, scale, perspective and transparent background as input 1. Do not recenter or resize the full object. Keep the existing warm ivory material, glossy fine enamel detail, upper-left studio lighting and fixed near-frontal elevated camera.
Output ONLY the corrected isolated single three-unit bridge, true transparent RGBA background. No jaw, gums, backdrop, black rectangle, text, arrows, extra teeth, metal, implant components or montage. Do not reproduce input 2 as the output; it is only a size/contact reference.

## Seconde passe — visuel sélectionné

Entrées : `bridge-v2-original.png` (cible) et `seated-preview-v2.png` (contexte). Sortie : `bridge-v3-original.png`.

Use case: precise-object-edit.
Input 1 is the EDIT TARGET: the transparent isolated three-unit ceramic dental bridge. Input 2 is supporting assembly reference only.
The center replacement tooth is STILL TOO SHORT compared with the neighboring crowns. Correct ONLY its shape, while preserving the two outer retainer crowns exactly.
Specific geometry on the 1774 x 887 image 1 canvas: extend the CENTER tooth occlusal cusps UPWARD from their current about y=245 to about y=160, matching the upper cusp height of the neighboring crowns. Keep its bottom down at about y=740. Make its body broader, occupying approximately x=610 to x=1160, a full-sized premolar comparable in crown volume to both neighbors, not a small bead or short tooth. The central facial crown surface must be tall and full. Preserve the natural occlusal grooves and ivory translucency. Keep rounded convex bottom for gentle gum contact. The three connected teeth should have visually comparable crown heights and natural side-to-side proportions.
DO NOT scale or reposition the full bridge. DO NOT change the left or right crown, not even their bottom margins. Same 1774x887 canvas, fixed camera, lighting, enamel material, position and size of side retainers. Keep the fixed bridge physically connected at both sides of the central tooth with subtle natural connectors and small embrasures. No gaps between connected crowns.
Output only the corrected isolated bridge on true transparent RGBA. No jaw, gum, backdrop, text, arrows, implants or extra teeth. Input 2 is context, not the output. This edit must visibly increase the CENTER crown height; preserve the side crowns.

