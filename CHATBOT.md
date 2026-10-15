# Assistant Épure

La bulle est disponible sur les neuf pages. Elle conserve la conversation en mémoire pendant la navigation et propose des liens fixes vers les soins, les photos, SmilePreview et la demande de rendez-vous. Rechargement et « Recommencer » effacent la discussion. Aucun historique persistant, accès aux photos, dossier patient ou envoi du formulaire n’est ajouté.

## État de cette version

L’export Sites publié reste statique. Il propose **un guide interactif clairement indiqué**, pas des réponses générées par OpenAI. `public/api/chat/status.json` annonce `ready:false` pour ce déploiement. Le code du serveur OpenAI est prêt et testé avec des réponses simulées ; aucun appel réel à OpenAI n’a été exécuté faute de clé configurée.

Le serveur local (`npm start`) prend en charge `/api/chat/status.json` et `/api/chat`, en plus de l’export Next.js. S’il reçoit `OPENAI_API_KEY` via son environnement serveur, il active automatiquement l’interface IA. Ne jamais ajouter cette variable à `NEXT_PUBLIC_*`, aux sources, aux arguments de commande ou au navigateur. Le modèle par défaut est `gpt-4.1-mini-2025-04-14`, remplaçable via `OPENAI_MODEL`.

Pour activer OpenAI sur Sites : connecter OpenAI Developers et suivre le workflow `openai-platform-api-key` avec son approbation, configurer le secret de Site, puis migrer l’hébergement statique vers un Worker compatible avec les actifs Next.js. Le module `server/assistant.mjs` utilise les API Web Request/Response et peut être repris par cet adaptateur. Conserver l’identité et l’audience du Site. **Configurer le secret seul n’ajoute pas de serveur à l’export statique.** Cette migration n’a pas été faite dans cette version sans clé.

## Comportement IA préparé

- Accord explicite avant l’envoi des messages ; accès d’urgence disponible sans cet accord.
- Historique borné à 11 messages côté interface / 12 au maximum côté serveur, 1000 caractères par message et 16 Ko par requête.
- Retrait des courriels et formats usuels de téléphones canadiens avant envoi (ce filtre n’anonymise pas toutes les informations personnelles).
- Instructions fixes, faits de la démonstration et actions limitées à une liste interne. Aucun diagnostic, prix inventé, faux horaire ou promesse de réservation.
- Responses API côté serveur, `store:false`, sortie structurée, délai maximum de 20 secondes, erreurs sans exposition du détail fournisseur. Aucun journal applicatif des conversations ou des clés.
- Limite locale au processus : 12 demandes/minute par identité réseau et 80/minute au total. Cette limite n’est pas un quota distribué et doit être complétée au niveau hébergement avant un lancement public.
- Les questions urgentes reconnues ouvrent le parcours de contact existant sans appel IA. Une détection par mots-clés n’est pas un triage clinique.

`store:false` ne constitue pas une garantie d’absence de conservation par OpenAI. Vérifier les conditions du fournisseur et définir les informations réelles de la clinique avant mise en service.

## Vérification

`npm run test:assistant` : configuration, consentement, origine, validation et taille, retrait des coordonnées usuelles, requête Responses, sortie structurée, urgences, limites, erreurs et délais. Aucune clé réelle n’est utilisée par les tests.

`node tools/chat-check.mjs` depuis `C:/Dev/dentist`, export servi sur le port 3090 : parcours guidé, liens, urgence, clavier, tailles desktop/mobile et mode IA simulé avec accord, historique, erreur et effacement.

Documentation : [Responses API](https://developers.openai.com/api/docs/guides/text), [sorties structurées](https://developers.openai.com/api/docs/guides/structured-outputs), [modèle](https://developers.openai.com/api/docs/models/gpt-4.1-mini).
