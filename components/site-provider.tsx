"use client";
import {useEffect,useRef,useState,type ReactNode} from "react";
import {JourneyContext} from "./journey-context";
import {EvaluationWizard} from "./evaluation-wizard";
import {Arrow} from "./icons";
import {PatientAssistant} from "./patient-assistant";
import type {Goal} from "@/lib/journey";
type InfoKind="eclat"|"alignement"|"privacy";
export function SiteProvider({children}:{children:ReactNode}){
 const [open,setOpen]=useState(false);
 const [request,setRequest]=useState<{id:number;goal?:Goal;timing?:number;prefill?:boolean}>({id:0});
 const [info,setInfo]=useState<InfoKind|null>(null);
 const infoRef=useRef<HTMLDialogElement>(null);
 function start(goal?:Goal,options?:{timing?:number;prefill?:boolean}){setInfo(null);setRequest(previous=>({id:previous.id+1,goal,timing:options?.timing,prefill:options?.prefill}));setOpen(true)}
 useEffect(()=>{document.body.classList.toggle("dialog-open",open||!!info);return()=>document.body.classList.remove("dialog-open")},[open,info]);
 useEffect(()=>{const dialog=infoRef.current;if(info&&!dialog?.open)dialog?.showModal();else if(!info&&dialog?.open)dialog.close()},[info]);
 const content=info==="eclat"?{eyebrow:"UN SOURIRE PLUS LUMINEUX",title:<>Parlons de l’éclat<br/><em>de votre sourire.</em></>,text:<><p>La couleur de vos dents vous préoccupe ? Une évaluation est un point de départ pour exprimer vos attentes et comprendre les possibilités.</p><p>Le professionnel pourra vous expliquer les options, leurs limites et les coûts avant que vous preniez une décision.</p><p>Vous pouvez préparer votre projet avec ou sans photos.</p></>}:info==="alignement"?{eyebrow:"UN SOURIRE PLUS HARMONIEUX",title:<>Comprendre<br/><em>vos possibilités.</em></>,text:<><p>Vous aimeriez parler de l’alignement de vos dents ? Commencez par ce qui vous gêne ou ce que vous souhaitez comprendre.</p><p>L’évaluation permet de discuter des options, du calendrier et des coûts avec le professionnel.</p><p>Le questionnaire prépare cet échange et ne remplace pas un examen.</p></>}:{
 eyebrow:"CONFIDENTIALITÉ DE CETTE DÉMONSTRATION",title:<>Vos données,<br/><em>en toute clarté.</em></>,
 text:<><p>Épure est une clinique fictive. Vos réponses et vos photos restent dans la mémoire de cette session du navigateur. Aucun rendez-vous réel n’est créé.</p><p>Aucune photo ni donnée du formulaire n’est transmise au chatbot. En mode IA, après votre accord, vos messages de discussion sont envoyés au serveur puis à OpenAI. Le mode guidé fonctionne sans cet envoi. Évitez les données personnelles ou médicales sensibles. Recharger la page efface le parcours et la conversation.</p><p>La caméra s’active uniquement à votre demande et se ferme à la sortie de l’étape. Les images du site sont illustratives.</p><p>Les liens externes et les polices peuvent contacter leurs fournisseurs. Le récapitulatif téléchargé est enregistré uniquement sur votre appareil.</p></>
 };
 return <JourneyContext.Provider value={{start,showInfo:setInfo}}>
  {children}
  <PatientAssistant/>
  <EvaluationWizard open={open} onClose={()=>setOpen(false)} request={request}/>
  <dialog ref={infoRef} id="info-dialog" className="info-dialog" aria-labelledby="info-title" onCancel={()=>setInfo(null)} onClose={()=>setInfo(null)}>
   <button className="close-dialog" type="button" data-close-info aria-label="Fermer" onClick={()=>setInfo(null)}>×</button>
   <p className="eyebrow">{content.eyebrow}</p><h2 id="info-title">{content.title}</h2><div id="info-content">{content.text}</div>
   {info!=="privacy"&&<button type="button" className="btn" data-info-start onClick={()=>start(info==="eclat"?"eclat":"alignement")}>Préparer mon évaluation <Arrow/></button>}
  </dialog>
 </JourneyContext.Provider>;
}
