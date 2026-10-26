// Simple, deterministic routing for the assistant. The model only writes the reply and names the
// service it understood; this module decides which buttons appear (never more than two).
//
// Principles (generic conversational-sales practice, not a regulatory standard):
// - Triage first: book now / a problem or question / curious about a service.
// - A problem is matched to ONE service, with a single clear next step.
// - An explicit request (or a "yes") always shows the booking button. Unprompted offers happen when a
//   service is first identified or after a few turns, and never more than MAX_CTA times: no pressure.
export const NEEDS=["dent","multiple","eclat","alignement","pont"];
export const MAX_CTA=2;
export const CTA_AFTER_TURNS=3;
const known=need=>NEEDS.includes(need);
export const emptyState=()=>({need:"inconnu",turns:0,linked:false,shown:0});
export function sanitizeState(input){
 const state=emptyState();if(!input||typeof input!=="object")return state;
 if(known(input.need))state.need=input.need;
 if(typeof input.linked==="boolean")state.linked=input.linked;
 if(Number.isInteger(input.shown))state.shown=Math.min(Math.max(input.shown,0),MAX_CTA);
 if(Number.isInteger(input.turns))state.turns=Math.min(Math.max(input.turns,0),50);
 return state;
}
const plain=text=>String(text).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
// Keyword pass so routing never depends only on the model.
export function needFromText(text){
 const q=plain(text);
 if(/\bponts?\b|\bbridges?\b/.test(q))return "pont";
 if(/plusieurs (dents|implants)|dents manquantes|toutes mes dents|(several|multiple|many) (teeth|implants)|missing teeth|all my teeth/.test(q))return "multiple";
 if(/implant|dent (manquant|enlev|arrach|perdu|tomb|absent|extrait|vide|creuse|qui manque)|(perdu|enleve|arrache|extrait|tombe)e? (une|ma|la|mes|des) dents?|il me manque|me manque (une|des) dent|extraction|un trou|remplacer une dent|missing tooth|lost a tooth|lost my tooth|tooth (fell|removed|pulled|extracted)|knocked out|replace a tooth|gap in my/.test(q))return "dent";
 if(/blanch|eclat|jaune|plus lumineux|couleur de mes dents|whiten|bleach|yellow|stain|brighter|colou?r of my teeth/.test(q))return "eclat";
 if(/align|croche|orthodon|gouttiere|dents de travers|crooked|straighten|braces|aligner/.test(q))return "alignement";
 return "inconnu";
}
export const accepts=text=>/^(oui|ok|d.?accord|allons.?y|volontiers|avec plaisir|pourquoi pas|c.?est parti|je veux bien|yes|yeah|yep|sure|okay|let.?s go|gladly|why not|go ahead|please do)(\b|$)/.test(plain(text).trim());
export const wantsBooking=text=>/rendez.?vous|reserver|consultation|evaluation|disponibilit|je veux commencer|prendre un rdv|appointment|book( |$)|booking|availability|get started|schedule|i want to start/.test(plain(text));
export const servicePage={dent:"implants",multiple:"implants",alignement:"alignement",pont:"pont"};
export const bookingAction=state=>"start_"+(state.need==="pont"?"dent":known(state.need)?state.need:"avis");
// Route the turn. `turns` already includes the current user message.
export function route(previous,{text,modelNeed}){
 const state={...previous,turns:previous.turns+1};
 const found=[needFromText(text),modelNeed].find(known);
 if(found)state.need=found;
 const first=known(state.need)&&!state.linked;
 const asked=wantsBooking(text)||accepts(text);
 const actions=[];
 const offer=state.shown<MAX_CTA&&(first||(state.turns>=CTA_AFTER_TURNS&&state.shown===0));
 if(asked||offer){actions.push(bookingAction(state));state.shown=Math.min(state.shown+1,MAX_CTA)}
 if(first){const page=servicePage[state.need];if(page)actions.push(page);state.linked=true}
 return {state,actions:actions.slice(0,2)};
}
export function needDirective(state,locale="fr"){
 if(locale==="en")return known(state.need)
  ?`The visitor is interested in: ${state.need} (dent: one missing tooth; multiple: several teeth; eclat: whitening; alignement: alignment; pont: fixed bridge). Answer their question about this treatment precisely. Ask a question only if it is useful.`
  :"The need is not clear yet. If the person describes a problem, name the most relevant treatment among implants, dental bridge, alignment, explain in one sentence why an evaluation helps, and offer to continue. Otherwise ask ONE question to understand what bothers them.";
 return known(state.need)
  ?`Le visiteur s’intéresse à : ${state.need}. Réponds précisément à sa question sur ce soin. Pose une question seulement si elle est utile.`
  :"Le besoin n’est pas encore clair. Si la personne décrit un problème, nomme le soin le plus pertinent parmi implants, pont dentaire, alignement, explique en une phrase pourquoi une évaluation aide, et propose de continuer. Sinon pose UNE question pour comprendre ce qui la gêne.";
}
