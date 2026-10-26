import type {Goal} from "./journey";
import {define} from "./i18n/define";
import type {Locale} from "./i18n/config";
export type AssistantAction="start_dent"|"start_multiple"|"start_eclat"|"start_alignement"|"start_avis"|"implants"|"alignement"|"pont"|"emergency";
export type LeadState={need:string;turns:number;linked:boolean;shown:number};
export type AssistantReply={text:string;actions:AssistantAction[];chips?:string[];state?:LeadState;source?:"guide"|"ai"};
type ActionConfig={label:string;href?:string;goal?:Goal;primary?:boolean};

const copy=define({
 book:"Prendre rendez-vous",implants:"Découvrir les implants",pont:"Découvrir le pont dentaire",alignement:"Découvrir Invisalign",emergency:"Joindre la clinique",
 triageProblem:"J’ai un problème ou une question",triageService:"Découvrir un soin",
 chips:{bridges:"Les ponts dentaires",implants:"Les implants",alignment:"L’alignement"},
 chipQuestions:{bridges:"Je voudrais en savoir plus sur les ponts dentaires",implants:"Je voudrais en savoir plus sur les implants",alignment:"Je voudrais en savoir plus sur l’alignement"},
 defaultIntro:{welcome:"Bonjour, je suis l’assistant Épure. Que puis-je faire pour vous ?",teaser:"Une question sur votre sourire ? Je suis là."},
 intros:{
  "/pont-dentaire":{welcome:"Bonjour ! Une question sur le pont dentaire fixe ? Je vous aide à préparer votre premier échange avec l’équipe.",teaser:"Une question sur le pont dentaire ?"},
  "/invisalign":{welcome:"Bonjour ! Une question sur les aligneurs Invisalign ? Je vous réponds, ou vous pouvez préparer votre première évaluation.",teaser:"Une question sur Invisalign ?"},
  "/implants":{welcome:"Bonjour ! Une dent manquante ? Posez-moi vos questions sur les implants, ou prenez rendez-vous directement.",teaser:"Une question sur les implants ?"},
  "/rendez-vous":{welcome:"Besoin d’aide pour votre demande ? Posez-moi vos questions.",teaser:"Une question avant de continuer ?"},
  "/photos-guidees":{welcome:"Des questions sur les photos ? Deux suffisent, la troisième est facultative, et vous pouvez continuer sans.",teaser:"Des questions sur les photos ?"},
 } as Record<string,{welcome:string;teaser:string}>,
 answers:{
  emergency:"Pour une douleur, une dent cassée ou une inquiétude urgente, contactez un professionnel. Ouvrez le panneau de contact pour les repères utiles. Cet assistant ne peut pas évaluer la gravité de votre situation.",
  cost:"Les coûts dépendent du traitement et de votre situation, et aucun tarif n’est confirmé sur ce site modèle. L’évaluation permet d’en discuter avec l’équipe avant tout engagement.",
  booking:"Avec plaisir : la demande prend environ 2 minutes, sans engagement. Rien n’est confirmé tant que la réception ne l’a pas validé.",
  fallback:"Je veux bien vous orienter. Est-ce plutôt une dent à remplacer ou des dents à aligner ? Choisissez, ou prenez directement rendez-vous.",
  pont:"Un pont fixe peut remplacer une dent en s’appuyant sur les dents voisines. Le dentiste évalue cette possibilité après examen.",
  multiple:"Remplacer plusieurs dents se discute après un examen, avec les options, leurs limites et les coûts. Vous pouvez préparer votre demande en quelques clics.",
  dent:"Une dent manquante se discute après un examen : le dentiste présente les options, leurs limites et les coûts. Vous pouvez préparer votre demande en quelques clics.",
  eclat:"Pour un sourire plus lumineux, l’équipe explique les possibilités, leurs limites et les coûts après évaluation. Vous pouvez préparer votre demande en quelques clics.",
  alignement:"Seul un professionnel peut déterminer les options adaptées à votre situation. Vous pouvez préparer votre demande en quelques clics.",
 },
 emailRemoved:"[courriel retiré]",phoneRemoved:"[téléphone retiré]",
},{
 book:"Book an appointment",implants:"Discover implants",pont:"Discover the dental bridge",alignement:"Discover Invisalign",emergency:"Contact the clinic",
 triageProblem:"I have a problem or a question",triageService:"Discover a treatment",
 chips:{bridges:"Dental bridges",implants:"Implants",alignment:"Alignment"},
 chipQuestions:{bridges:"I would like to know more about dental bridges",implants:"I would like to know more about implants",alignment:"I would like to know more about alignment"},
 defaultIntro:{welcome:"Hello, I’m the Épure assistant. How can I help you?",teaser:"A question about your smile? I’m here."},
 intros:{
  "/pont-dentaire":{welcome:"Hello! A question about the fixed dental bridge? I can help you prepare your first conversation with the team.",teaser:"A question about the dental bridge?"},
  "/invisalign":{welcome:"Hello! A question about Invisalign aligners? I can answer, or you can prepare your first evaluation.",teaser:"A question about Invisalign?"},
  "/implants":{welcome:"Hello! A missing tooth? Ask me your questions about implants, or book an appointment directly.",teaser:"A question about implants?"},
  "/rendez-vous":{welcome:"Need help with your request? Ask me your questions.",teaser:"A question before you continue?"},
  "/photos-guidees":{welcome:"Questions about the photos? Two are enough, the third is optional, and you can continue without any.",teaser:"Questions about the photos?"},
 } as Record<string,{welcome:string;teaser:string}>,
 answers:{
  emergency:"For pain, a broken tooth or an urgent concern, contact a professional. Open the contact panel for useful information. This assistant cannot assess how serious your situation is.",
  cost:"Costs depend on the treatment and on your situation, and no price is confirmed on this model site. The evaluation lets you discuss it with the team before any commitment.",
  booking:"Gladly: the request takes about 2 minutes, with no commitment. Nothing is confirmed until the front desk has validated it.",
  fallback:"I’m happy to guide you. Is it more of a tooth to replace or teeth to align? Choose one, or book an appointment directly.",
  pont:"A fixed bridge can replace a tooth by relying on the neighbouring teeth. The dentist assesses this option after an examination.",
  multiple:"Replacing several teeth is discussed after an examination, with the options, their limits and the costs. You can prepare your request in a few taps.",
  dent:"A missing tooth is discussed after an examination: the dentist presents the options, their limits and the costs. You can prepare your request in a few taps.",
  eclat:"For a brighter smile, the team explains the possibilities, their limits and the costs after an evaluation. You can prepare your request in a few taps.",
  alignement:"Only a professional can determine the options suited to your situation. You can prepare your request in a few taps.",
 },
 emailRemoved:"[email removed]",phoneRemoved:"[phone removed]",
});

export const assistantActions=(locale:Locale):Record<AssistantAction,ActionConfig>=>{
 const t=copy[locale];
 return {
  start_dent:{label:t.book,goal:"dent",primary:true},
  start_multiple:{label:t.book,goal:"multiple",primary:true},
  start_eclat:{label:t.book,goal:"eclat",primary:true},
  start_alignement:{label:t.book,goal:"alignement",primary:true},
  start_avis:{label:t.book,goal:"avis",primary:true},
  implants:{label:t.implants,href:"/implants/"},
  pont:{label:t.pont,href:"/pont-dentaire/"},
  alignement:{label:t.alignement,href:"/invisalign/"},
  emergency:{label:t.emergency},
 };
};
// First choices: the visitor's intent is known from the first click.
export const triage=(locale:Locale)=>({book:copy[locale].book,problem:copy[locale].triageProblem,service:copy[locale].triageService});
export const triageChips=(locale:Locale)=>Object.values(triage(locale));
export const serviceChips=(locale:Locale):Record<string,string>=>{const t=copy[locale];return {[t.chips.bridges]:t.chipQuestions.bridges,[t.chips.implants]:t.chipQuestions.implants,[t.chips.alignment]:t.chipQuestions.alignment}};
type PageIntro={welcome:string;teaser:string};
export function introFor(pathname:string,locale:Locale):PageIntro{const t=copy[locale];return t.intros[pathname.replace(/\/$/,"")]??t.defaultIntro}
const plain=(s:string)=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const answerKeys:Record<string,AssistantAction[]>={pont:["start_dent","pont"],multiple:["start_multiple","implants"],dent:["start_dent","implants"],eclat:["start_eclat"],alignement:["start_alignement","alignement"]};
// Guided mode, used when the AI is not activated: same routing, fixed answers. Keywords cover French and English, whatever the interface language.
export function guidedAnswer(question:string,locale:Locale="fr"):AssistantReply{
 const q=plain(question),t=copy[locale];
 if(/urgence|douleur|mal aux dents|dent cassee|saigne|gonfle|respir|avaler|emergency|urgent|toothache|tooth ache|bpainb|broken tooth|cracked tooth|bleed|swollen|swelling|breath|swallow/.test(q))return {text:t.answers.emergency,actions:["emergency"],source:"guide"};
 if(/prix|cout|tarif|combien|budget|assurance|financ|price|cost|how much|insurance|bfees?b/.test(q))return {text:t.answers.cost,actions:["start_avis"],source:"guide"};
 if(/\bponts?\b|\bbridges?\b/.test(q))return {text:t.answers.pont,actions:answerKeys.pont,source:"guide"};
 const key=/plusieurs|several|multiple|many teeth/.test(q)&&/dent|implant|teeth/.test(q)?"multiple":/implant|dent (manquant|enlev|arrach|perdu|tomb|absent|extrait|vide|creuse|qui manque)|(perdu|enleve|arrache|extrait|tombe)e? (une|ma|la|mes|des) dents?|il me manque|me manque (une|des) dent|extraction|un trou|manquant|remplac|missing tooth|lost a tooth|lost my tooth|tooth (fell|removed|pulled|extracted)|knocked out|gap in|replace/.test(q)?"dent":/blanch|eclat|jaune|couleur|whiten|bleach|yellow|stain|colou?r|brighter/.test(q)?"eclat":/align|orthodon|gouttiere|croche|crooked|straighten|braces|aligner|invisalign/.test(q)?"alignement":"";
 if(key)return {text:t.answers[key as "dent"],actions:answerKeys[key],source:"guide"};
 if(/rendez|visite|consult|reser|commenc|appointment|book|visit|schedule|get started/.test(q))return {text:t.answers.booking,actions:["start_avis"],source:"guide"};
 return {text:t.answers.fallback,actions:["start_avis"],chips:Object.keys(serviceChips(locale)),source:"guide"};
}
export function redactContactDetails(value:string,locale:Locale="fr"){const t=copy[locale];return value.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,t.emailRemoved).replace(/(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}/g,t.phoneRemoved)}
