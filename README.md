# Épure — site patient

Version autonome en blanc, anthracite et beige, séparée des présentations Karwisoft.

Pages : `dist/index.html` (accueil) et `dist/implants.html` (implants). Styles et interactions : `dist/site.css`, `dist/site.js`.

Le parcours permet d’importer ou de prendre jusqu’à trois photos, de passer cette étape, de parcourir un comparateur illustratif, de répondre à trois questions, de saisir ses coordonnées et sa préférence de contact, de proposer un créneau, puis de conserver un récapitulatif texte. La progression reste en mémoire pendant la visite ; aucun stockage durable ni transmission de formulaire.

L’identité Épure est fictive. Les images sont illustratives. Le comparateur montre un exemple fictif indépendant des photos du visiteur ; aucun moteur IA clinique n’est appelé. Le calendrier présente des créneaux illustratifs. Aucune demande réelle, aucun événement d’agenda, aucun SMS/email ni invitation à laisser un avis n’est envoyé.

Pour la mise en production : identité et contenu du vrai cabinet, stockage/transmission des photos et demandes, calendrier maître, notifications et confirmations/rappels à connecter. La réception reste responsable de la validation et de la saisie manuelle dans le logiciel dentaire. Aucune API Dentitek/Dentrix/Progident n’est prévue. SmilePreview personnalisé est une intégration à valider séparément.

Photographies hero et accueil : outil imagegen intégré, prompts exacts dans `visual-prompts.txt`. Comparaison fictive réutilisée : provenance et prompt dans `comparison-prompt.txt`.

Contenu informatif sur les implants vérifié à partir de l’Association dentaire canadienne, avec un lien de source dans la page implants.

Vérification : depuis le dossier parent, `node tools/patient-check.mjs`. Vérifie le parcours, le refus de la caméra, l’import réel d’une image, l’alternative sans photos, les dates et horaires, le récapitulatif, la reprise, les deux pages et les largeurs 1440/1024/768/390/320 px. Captures dans `preview/patient/`.
