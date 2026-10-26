# Séquence 3D des implants

Visuels créés avec l’outil intégré `image_gen` le 25 octobre 2026, à partir de `ch1.png`, fourni comme référence de style et de qualité anatomique. Les images sont des reconstitutions illustratives, et non des photographies cliniques ou une simulation personnalisée.

- Source conservée : `implant-sequence-3d.png`.
- Images du lecteur : `public/assets/implants/frame-01.webp` à `frame-16.webp`.
- Préparation mécanique : `scripts/prepare-implant-frames.mjs` découpe la grille en seize images et les encode en WebP. L’image source comporte 1254 × 1254 pixels ; les images découpées sont redimensionnées à 628 × 628 pour le lecteur, sans ajout de détail.
- Lecture : évaluation, insertion de l’implant, cicatrisation, pilier, couronne. Les étapes et proportions sont simplifiées ; la durée de l’animation ne représente pas celle d’un traitement.
- Contenu clinique de référence : https://www.cda-adc.ca/fr/pour-le-public/comprendre-votre-sante-buccodentaire/procdures-dentaires/implants-dentaires

## Prompt de génération

Use case: scientific-educational.
Asset type: a frame-by-frame medical animation sprite sheet for a French dental clinic website, NOT an infographic or webpage.
Input image 1 is a STYLE AND ANATOMICAL QUALITY REFERENCE ONLY. Create new original imagery with its same photorealistic high-end 3D dental educational rendering quality.
OUTPUT: ONE seamless 4-column by 4-row grid containing EXACTLY 16 EQUAL SQUARE FRAMES, ordered left-to-right then top-to-bottom. Request 2560x2560 pixels total or the highest available square resolution. No gutters, no dividers, no borders, no captions, no numbering, no text, no arrows, no watermark. Each frame has exactly the same medium gray studio background, identical fixed orthographic three-quarter front camera, lighting, scale, model position and crop. This is a registered animation contact sheet that will be sliced into separate frames.
SUBJECT IN EVERY FRAME: An isolated section of LOWER jaw showing exactly TWO intact natural ivory premolar teeth, one to the left and one to the right of a single missing central tooth space. Beautiful glossy realistic pink gingiva. A clean vertical cutaway of the jaw exposes realistic porous beige cancellous bone, natural tooth roots on the sides, and the central prepared implant site. The cutaway is straight across the front and thick, like a physical dental teaching model. The jaw model occupies the central 75% of each frame, with generous clear margins above and below so nothing ever touches frame edges. No tongue, no face, no surgical tools, no blood. Excellent photorealistic enamel reflections, realistic pink gum texture and accurately detailed titanium screw threads like the reference. Implant axis vertical, front visible through bone cutaway.
THE SEQUENCE:
Frame 01: missing center tooth, healed empty gum ridge and bone visible, no implant/pilier/crown.
Frame 02: identical scene, a single titanium screw-shaped dental implant aligned vertically just above the empty central site, no abutment, no crown.
Frame 03: same implant lowered slightly toward the site.
Frame 04: implant tip entering the center prepared site, body still partly above gum.
Frame 05: implant inserted halfway down.
Frame 06: implant fully inserted in the bone, top flush with ridge. Metallic cylindrical implant, tapered bottom, clearly modeled accurate helical threads. No abutment, no crown.
Frame 07: fully inserted implant, soft gum edges gradually closing around top and a small realistic healing cap.
Frame 08: identical implanted scene, bone visibly snug around screw, healed gingiva with healing cap, no crown.
Frame 09: identical healed implant scene with healing cap now removed; socket in top of implant visible.
Frame 10: a single realistic metallic abutment hovering on implant axis just above the implant, no crown.
Frame 11: abutment lowered halfway into top of implant.
Frame 12: abutment fully seated and attached, a small conical titanium post projecting above gum; no crown.
Frame 13: one beautiful ivory ceramic premolar crown hovering just above this abutment, matching neighboring teeth in size.
Frame 14: ceramic crown lowered toward abutment.
Frame 15: crown almost seated, tiny gap at gum.
Frame 16: crown fully seated covering the abutment, clinical realistic final implant restoration matching neighboring teeth, implant visible in the bone cutaway beneath. Exactly three visible crowns now.
CRITICAL INVARIANTS: the two neighboring teeth, jaw bone boundary, pores, gum shape, camera perspective, lighting and background remain visually identical in all 16 frames. Only the implant insertion and healing stage, abutment, and final crown change. No extra implants, no extra teeth, no duplicated metal components. Smooth tiny differences between intermediate frames. Realistic anatomically plausible proportions. This must look like stills from a professional dental 3D explainer video, not flat vector art, not a diagram, not cartoon.

