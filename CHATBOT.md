# Assistant Épure

La bulle est disponible sur les neuf pages. Elle conserve la conversation en mémoire pendant la navigation et propose des liens fixes vers les soins, les photos et la demande de rendez-vous. Rechargement et « Recommencer » effacent la discussion. Aucun historique persistant, accès aux photos, dossier patient ou envoi du formulaire n’est ajouté.

## État de cette version

L’export Sites publié reste statique. Il propose **un guide interactif clairement indiqué**, pas des réponses générées par OpenAI. `public/api/chat/status.json` annonce `ready:false` pour ce déploiement. Le code du serveur OpenAI est prêt et testé avec des réponses simulées ; aucun appel réel à OpenAI n’a été exécuté faute de clé configurée.

Le serveur local (`npm start`) prend en charge `/api/chat/status.json` et `/api/chat`, en plus de l’export Next.js. S’il reçoit `OPENAI_API_KEY` via son environnement serveur, il active automatiquement l’interface IA. Ne jamais ajouter cette variable à `NEXT_PUBLIC_*`, aux sources, aux arguments de commande ou au navigateur. Le modèle par défaut est `gpt-4.1-mini-2025-04-14`, remplaçable via `OPENAI_MODEL`.

Pour activer OpenAI sur Sites : connecter OpenAI Developers et suivre le workflow `openai-platform-api-key` avec son approbation, configurer le secret de Site, puis migrer l’hébergement statique vers un Worker compatible avec les actifs Next.js. Le module `server/assistant.mjs` utilise les API Web Request/Response et peut être repris par cet adaptateur. Conserver l’identité et l’audience du Site. **Configurer le secret seul n’ajoute pas de serveur à l’export statique.** Cette migration n’a pas été faite dans cette version sans clé.

## Parcours et boutons

Trois choix dès l’ouverture : **Prendre rendez-vous** (ouvre directement la demande, sans IA), **J’ai un problème ou une question** (le visiteur écrit, l’assistant l’oriente vers un soin) et **Découvrir un soin** (implants, blanchiment, alignement). `server/lead-process.mjs` décide des boutons, pas le modèle : au maximum 2 par réponse, « Prendre rendez-vous » (pré-rempli avec le soin compris) et le lien vers la page du soin. Une demande explicite ou un « oui » affiche toujours le bouton ; les propositions spontanées se limitent à la première identification du soin et à une relance après 3 échanges, 2 au maximum. Le modèle ne propose pas de rendez-vous dans son texte. L’état (soin, tours, lien déjà montré, propositions) est renvoyé par le navigateur et validé côté serveur ; rien n’est stocké. Tests : `npm run test:assistant`.

## Activer l’IA

Copier `.env.example` en `.env.local`, renseigner `OPENAI_API_KEY`, puis `npm run build && npm start`. `next dev` ne sert pas `/api/chat` (export statique).

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

`node tools/chat-conversion-check.mjs` (boutons, réponses rapides, consentement, barre de conversion, bulle) puis `node tools/chat-check.mjs` depuis `C:/Dev/dentist`, export servi sur le port 3090 : parcours guidé, liens, urgence, clavier, tailles desktop/mobile et mode IA simulé avec accord, historique, erreur et effacement.

Documentation : [Responses API](https://developers.openai.com/api/docs/guides/text), [sorties structurées](https://developers.openai.com/api/docs/guides/structured-outputs), [modèle](https://developers.openai.com/api/docs/models/gpt-4.1-mini).


## Langue de l’assistant

Le navigateur envoie `locale` (`fr` ou `en`) avec chaque message. Le serveur choisit alors les instructions du modèle, les libellés de retrait des coordonnées et la réponse d’urgence dans cette langue ; une valeur inconnue retombe sur le français. Les mots-clés de routage (soins, urgence, rendez-vous) couvrent les deux langues. Tests : `server/i18n.test.mjs`.
