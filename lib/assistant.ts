import type {Goal} from "./journey";
export type AssistantAction="start_dent"|"start_multiple"|"start_eclat"|"start_alignement"|"start_avis"|"implants"|"alignement"|"pont"|"emergency";
export type LeadState={need:string;turns:number;linked:boolean;shown:number};
export type AssistantReply={text:string;actions:AssistantAction[];chips?:string[];state?:LeadState;source?:"guide"|"ai"};
type ActionConfig={label:string;href?:string;goal?:Goal;primary?:boolean};
export const assistantActions:Record<AssistantAction,ActionConfig>={
 start_dent:{label:"Prendre rendez-vous",goal:"dent",primary:true},
 start_multiple:{label:"Prendre rendez-vous",goal:"multiple",primary:true},
 start_eclat:{label:"Prendre rendez-vous",goal:"eclat",primary:true},
 start_alignement:{label:"Prendre rendez-vous",goal:"alignement",primary:true},
 start_avis:{label:"Prendre rendez-vous",goal:"avis",primary:true},
 implants:{label:"Découvrir les implants",href:"/implants/"},
 pont:{label:"Découvrir le pont dentaire",href:"/pont-dentaire/"},
 alignement:{label:"Découvrir Invisalign",href:"/invisalign/"},
 emergency:{label:"Joindre la clinique"},
};
// First choices: the visitor's intent is known from the first click.
export const triage={book:"Prendre rendez-vous",problem:"J’ai un problème ou une question",service:"Découvrir un soin"};
export const triageChips=[triage.book,triage.problem,triage.service];
export const serviceChips:Record<string,string>={"Les ponts dentaires":"Je voudrais en savoir plus sur les ponts dentaires","Les implants":"Je voudrais en savoir plus sur les implants","L’alignement":"Je voudrais en savoir plus sur l’alignement"};
type PageIntro={welcome:string;teaser:string};
const defaultIntro:PageIntro={welcome:"Bonjour, je suis l’assistant Épure. Que puis-je faire pour vous ?",teaser:"Une question sur votre sourire ? Je suis là."};
const intros:Record<string,PageIntro>={
 "/pont-dentaire":{welcome:"Bonjour ! Une question sur le pont dentaire fixe ? Je vous aide à préparer votre premier échange avec l’équipe.",teaser:"Une question sur le pont dentaire ?"},
 "/invisalign":{welcome:"Bonjour ! Une question sur les aligneurs Invisalign ? Je vous réponds, ou vous pouvez préparer votre première évaluation.",teaser:"Une question sur Invisalign ?"},
 "/implants":{welcome:"Bonjour ! Une dent manquante ? Posez-moi vos questions sur les implants, ou prenez rendez-vous directement.",teaser:"Une question sur les implants ?"},
 "/alignement":{welcome:"Bonjour ! Une question sur l’alignement ? Je vous réponds, ou vous pouvez prendre rendez-vous directement.",teaser:"Une question sur l’alignement ?"},
 "/rendez-vous":{welcome:"Besoin d’aide pour votre demande ? Posez-moi vos questions.",teaser:"Une question avant de continuer ?"},
 "/photos-guidees":{welcome:"Des questions sur les photos ? Deux suffisent, la troisième est facultative, et vous pouvez continuer sans.",teaser:"Des questions sur les photos ?"},
};
export function introFor(pathname:string):PageIntro{return intros[pathname.replace(/\/$/,"")]??defaultIntro}
const plain=(s:string)=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const answers:Record<string,{text:string;actions:AssistantAction[]}>={
 pont:{text:"Un pont fixe peut remplacer une dent en s’appuyant sur les dents voisines. Le dentiste évalue cette possibilité après examen.",actions:["start_dent","pont"]},
 multiple:{text:"Remplacer plusieurs dents se discute après un examen, avec les options, leurs limites et les coûts. Vous pouvez préparer votre demande en quelques clics.",actions:["start_multiple","implants"]},
 dent:{text:"Une dent manquante se discute après un examen : le dentiste présente les options, leurs limites et les coûts. Vous pouvez préparer votre demande en quelques clics.",actions:["start_dent","implants"]},
 eclat:{text:"Pour un sourire plus lumineux, l’équipe explique les possibilités, leurs limites et les coûts après évaluation. Vous pouvez préparer votre demande en quelques clics.",actions:["start_eclat"]},
 alignement:{text:"Seul un professionnel peut déterminer les options adaptées à votre situation. Vous pouvez préparer votre demande en quelques clics.",actions:["start_alignement","alignement"]},
};
// Guided mode, used when the AI is not activated: same routing, fixed answers.
export function guidedAnswer(question:string):AssistantReply{
 const q=plain(question);
 if(/urgence|douleur|mal aux dents|dent cassee|saigne|gonfle|respir|avaler/.test(q))return {text:"Pour une douleur, une dent cassée ou une inquiétude urgente, contactez un professionnel. Ouvrez le panneau de contact pour les repères utiles. Cet assistant ne peut pas évaluer la gravité de votre situation.",actions:["emergency"],source:"guide"};
 if(/prix|cout|tarif|combien|budget|assurance|financ/.test(q))return {text:"Les coûts dépendent du traitement et de votre situation, et aucun tarif n’est confirmé sur ce site modèle. L’évaluation permet d’en discuter avec l’équipe avant tout engagement.",actions:["start_avis"],source:"guide"};
 if(/\bponts?\b|\bbridges?\b/.test(q))return {...answers.pont,source:"guide"};
 const key=/plusieurs/.test(q)&&/dent|implant/.test(q)?"multiple":/implant|dent (manquant|enlev|arrach|perdu|tomb|absent|extrait|vide|creuse|qui manque)|(perdu|enleve|arrache|extrait|tombe)e? (une|ma|la|mes|des) dents?|il me manque|me manque (une|des) dent|extraction|un trou|manquant|remplac/.test(q)?"dent":/blanch|eclat|jaune|couleur/.test(q)?"eclat":/align|orthodon|gouttiere|croche/.test(q)?"alignement":"";
 if(key)return {...answers[key],source:"guide"};
 if(/rendez|visite|consult|reser|commenc/.test(q))return {text:"Avec plaisir : la demande prend environ 2 minutes, sans engagement. Rien n’est confirmé tant que la réception ne l’a pas validé.",actions:["start_avis"],source:"guide"};
 return {text:"Je veux bien vous orienter. Est-ce plutôt une dent à remplacer ou des dents à aligner ? Choisissez, ou prenez directement rendez-vous.",actions:["start_avis"],chips:Object.keys(serviceChips),source:"guide"};
}
export function redactContactDetails(value:string){return value.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,"[courriel retiré]").replace(/(?:\+?1[ .-]?)?\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}/g,"[téléphone retiré]")}
