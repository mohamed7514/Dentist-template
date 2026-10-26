# Hero mobile — extension en hauteur

Mode : édition avec l’outil intégré **image_gen**, sans appel API de génération via la clé de la clinique.

Référence / cible : `public/assets/smile-final.webp`.
Source générée conservée : `assets/source/mobile-hero-height/extension-original.png` (1254 × 1254).
Asset WebP utilisé : `public/assets/smile-mobile-extension.webp` (1254 × 1254).

Le visuel est prolongé verticalement pour fournir le contexte au-dessus et en dessous de la bouche. Le nouveau fond apparaît uniquement dans les styles mobiles (largeurs ≤ 700 px). Les images originales avant/après et le SVG de révélation restent superposés dans la même zone centrale et gardent leurs proportions. Un fondu léger aux bords du rectangle d’origine raccorde ce rectangle au fond prolongé. L’extension n’est pas une image clinique.

La hauteur du cadre passe de 4:3 à 1:1 sur les téléphones hauts, de 3:2 à 4:3 sur les téléphones courts, et de 4:3 à 6:5 sur les mobiles plus larges. La mise à l’échelle horizontale de la bouche est conservée. Les styles ordinateur ne sont pas modifiés par cette correction.

Le rythme mobile a ensuite été ajusté à la demande de l’utilisateur : sourire initial pendant 2,5 secondes, transformation pendant 5 secondes, sourire final pendant 10 secondes et fondu de retour pendant 1 seconde, soit une boucle de 18,5 secondes. Le sourire final reste ainsi quatre fois plus longtemps que l’état initial, avec la même vitesse de transition douce.

Contrôle local : `node tools/mobile-hero-height-preview.mjs`, depuis `C:/Dev/dentist`. Captures et mesures : `C:/Dev/dentist/preview/mobile-hero-height/`.

Vérification réussie sur les largeurs mobiles 320, 360, 375, 390, 430 et 700 px : cadre plus haut, même échelle horizontale du sourire, bouche entière visible, texte au-dessus des actions fixes et calques alignés. Les mesures ordinateur à 701, 768, 1024 et 1440 px restent identiques à la référence. Le passage avant/après, le mode mouvement réduit et le menu mobile ont également été vérifiés.

## Prompt final

Use case: precise-object-edit.
Asset type: square mobile extension of an existing photographic dental hero.
Edit target: the supplied 1536x1024 landscape photograph of a smiling lower face.
Primary request: OUTPAINT vertically into a 1536x1536 SQUARE image. Keep the original full 1536x1024 image at its exact original horizontal scale, centered vertically, so its rectangle occupies x=0..1535 and y=256..1279 of the new square. Add 256 pixels above and 256 pixels below. Extend the same person's skin and lower-face anatomy naturally: above, the bottom of the nose and adjacent cheeks; below, the continuation of the chin and upper neck. The view remains a close crop of the lower face. Do not show the eyes or create a full portrait.
CRITICAL: preserve the exact mouth, teeth, lips, skin color, facial proportions, lighting, camera and sharp detail of the input. The smile must not be enlarged, reduced, moved sideways, retouched, whitened or changed. No stretching. Both corners of the mouth stay visible. The central original rectangle must remain in the same pixel positions after the 256px vertical offset because it will be overlaid with the original before/after animation. Generate only the new upper and lower context, seamlessly continuing the existing image. Match all edge textures and colors. No horizontal expansion.
Photorealistic, same warm studio light and natural fine skin texture. No text, panels, diagrams, borders, arrows, extra teeth, props or watermark. Opaque photographic background, no transparency. Output one square image.

