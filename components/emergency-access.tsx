"use client";

import {useEffect, useRef, useState} from "react";
import {usePathname} from "next/navigation";
import Link from "./locale-link";
import {useLocale} from "./locale-provider";
import {emergency} from "@/lib/i18n/dict/sections";
import {Arrow} from "./icons";
import {emergencyContact} from "@/lib/emergency-contact";
import "./emergency-access.css";

function Phone(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8.2 3 2.1 4.8-2.1 2.1a15.6 15.6 0 0 0 5.9 5.9l2.1-2.1 4.8 2.1v3.1a2 2 0 0 1-2.2 2A18.8 18.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3.1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Close(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
const phoneHref=(phone:string)=>`tel:${phone.replace(/[^+\d]/g, "")}`;

export function EmergencyAccess(){
  const t=emergency[useLocale()];
  const dialog=useRef<HTMLDialogElement>(null);
  const [open,setOpen]=useState(false);
  const pathname=usePathname();
  useEffect(()=>{
    const handle=()=>show();
    window.addEventListener("epure:open-emergency",handle);
    return ()=>window.removeEventListener("epure:open-emergency",handle);
  },[]);
  useEffect(()=>{dialog.current?.close()},[pathname]);
  useEffect(()=>{
    if(!open)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return ()=>{document.body.style.overflow=previous};
  },[open]);
  function show(){
    if(emergencyContact.phone){window.location.href=phoneHref(emergencyContact.phone);return}
    if(!dialog.current||dialog.current.open)return;
    dialog.current.showModal();
    setOpen(true);
  }
  function close(){dialog.current?.close()}
  const triggerProps={type:"button" as const,onClick:show,"aria-haspopup":"dialog" as const,"aria-controls":"emergency-dialog","aria-expanded":open};

  return <>
    <button {...triggerProps} className="emergency-float"><span className="emergency-float-icon"><Phone/></span><span>{t.label}</span><Arrow/></button>
    <nav className="patient-action-bar" aria-label={t.quickContact}><button {...triggerProps}><Phone/><span>{t.label}</span></button><Link href="/rendez-vous/">{t.appointment} <Arrow/></Link></nav>
    <dialog ref={dialog} id="emergency-dialog" className="emergency-dialog" aria-labelledby="emergency-title" onClose={()=>setOpen(false)} onKeyDown={event=>{
      if(event.key!=="Tab")return;
      const controls=event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled])');
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
    }} onClick={event=>{
      if(event.target!==event.currentTarget)return;
      const rect=event.currentTarget.getBoundingClientRect();
      if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();
    }}>
      <div className="emergency-panel">
        <div className="emergency-panel-top"><span><Phone/> {t.labelCaps}</span><button type="button" className="emergency-close" aria-label={t.close} onClick={close} autoFocus><Close/></button></div>
        <button className="emergency-call" type="button" disabled><Phone/><span>{t.call}<small>{t.phoneToFill}</small></span><Arrow/></button>
      </div>
    </dialog>
  </>;
}
