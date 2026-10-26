"use client";
import {useEffect,useRef,useState,type ReactNode} from "react";
import {useRouter} from "next/navigation";
import {JourneyContext} from "./journey-context";
import {useBookingSession} from "./booking-session";
import {useLocale} from "./locale-provider";
import {needKeys} from "@/lib/i18n/dict/booking";
import {localizeHref} from "@/lib/i18n/config";
import {privacy} from "@/lib/i18n/dict/privacy";
import {rich} from "@/lib/i18n/rich";
import {PatientAssistant} from "./patient-assistant";
import type {Goal} from "@/lib/journey";
export function SiteProvider({children}:{children:ReactNode}){
 const router=useRouter();const locale=useLocale();const {setDraft,setStep}=useBookingSession();
 const [info,setInfo]=useState(false);
 const infoRef=useRef<HTMLDialogElement>(null);
 const t=privacy[locale];
 // Every "prepare my visit" entry point leads to the single booking page; photos stay in the shared photo session.
 function start(goal?:Goal){setInfo(false);if(goal){setDraft(current=>({...current,need:needKeys[goal==="alignement"?1:0]}));setStep(0)}router.push(localizeHref("/rendez-vous/",locale))}
 useEffect(()=>{document.body.classList.toggle("dialog-open",info);return()=>document.body.classList.remove("dialog-open")},[info]);
 useEffect(()=>{const dialog=infoRef.current;if(info&&!dialog?.open)dialog?.showModal();else if(!info&&dialog?.open)dialog.close()},[info]);
 return <JourneyContext.Provider value={{start,showInfo:()=>setInfo(true)}}>
  {children}
  <PatientAssistant/>
  <dialog ref={infoRef} id="info-dialog" className="info-dialog" aria-labelledby="info-title" onCancel={()=>setInfo(false)} onClose={()=>setInfo(false)}>
   <button className="close-dialog" type="button" data-close-info aria-label={t.close} onClick={()=>setInfo(false)}>×</button>
   <p className="eyebrow">{t.eyebrow}</p><h2 id="info-title">{rich(t.title)}</h2><div id="info-content">{t.paragraphs.map(text=><p key={text}>{text}</p>)}</div>
  </dialog>
 </JourneyContext.Provider>;
}
