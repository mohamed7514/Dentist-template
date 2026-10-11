"use client";

import {useEffect, useRef, useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {Arrow} from "./icons";
import {emergencyContact} from "@/lib/emergency-contact";
import "./emergency-access.css";

function Phone(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8.2 3 2.1 4.8-2.1 2.1a15.6 15.6 0 0 0 5.9 5.9l2.1-2.1 4.8 2.1v3.1a2 2 0 0 1-2.2 2A18.8 18.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3.1Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Close(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
const phoneHref=(phone:string)=>`tel:${phone.replace(/[^+\d]/g, "")}`;

export function EmergencyAccess(){
  const dialog=useRef<HTMLDialogElement>(null);
  const [open,setOpen]=useState(false);
  const pathname=usePathname();
  useEffect(()=>{
    const handle=()=>{if(dialog.current&&!dialog.current.open){dialog.current.showModal();setOpen(true)}};
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
    if(!dialog.current||dialog.current.open)return;
    dialog.current.showModal();
    setOpen(true);
  }
  function close(){dialog.current?.close()}
  const triggerProps={type:"button" as const,onClick:show,"aria-haspopup":"dialog" as const,"aria-controls":"emergency-dialog","aria-expanded":open};

  return <>
    <button {...triggerProps} className="emergency-float"><span className="emergency-float-icon"><Phone/></span><span>Urgence dentaire</span><Arrow/></button>
    <nav className="patient-action-bar" aria-label="Contact rapide"><button {...triggerProps}><Phone/><span>Urgence dentaire</span></button><Link href="/rendez-vous/">Rendez-vous <Arrow/></Link></nav>
    <dialog ref={dialog} id="emergency-dialog" className="emergency-dialog" aria-labelledby="emergency-title" aria-describedby="emergency-intro" onClose={()=>setOpen(false)} onKeyDown={event=>{
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
        <div className="emergency-panel-top"><span><Phone/> URGENCE DENTAIRE</span><button type="button" className="emergency-close" aria-label="Fermer le panneau d’urgence" onClick={close} autoFocus><Close/></button></div>
        <h2 id="emergency-title">Besoin d’aide<br/><em>pour votre sourire ?</em></h2>
        <p id="emergency-intro">Une douleur, une dent cassée, une inquiétude ? Contactez la clinique pour savoir quoi faire.</p>
        <div className="emergency-clinic-contact">
          {emergencyContact.phone?<a className="emergency-call" href={phoneHref(emergencyContact.phone)}><Phone/><span>Appeler la clinique<small>{emergencyContact.phoneLabel??emergencyContact.phone}</small></span><Arrow/></a>:<button className="emergency-call" type="button" disabled aria-describedby="emergency-demo"><Phone/><span>Appeler la clinique<small>Numéro du cabinet à renseigner</small></span><Arrow/></button>}
          <p className="emergency-hours">{emergencyContact.hoursLabel??"Horaires du cabinet à préciser"}</p>
        </div>
        {!emergencyContact.phone&&<p id="emergency-demo" className="emergency-demo">Site de démonstration : le numéro et les horaires seront ajoutés avec le cabinet choisi. Aucun appel à la clinique n’est disponible pour le moment.</p>}
        <div className="emergency-after-hours"><h3>Si la clinique est fermée</h3>{emergencyContact.afterHours?<p>Contactez {emergencyContact.afterHours.name} : <a href={phoneHref(emergencyContact.afterHours.phone)}>{emergencyContact.afterHours.phone}</a>.</p>:<p>Les coordonnées du service de garde seront précisées avec le cabinet.</p>}<p>Pour un conseil de santé non urgent au Québec : <a href="tel:811">Info-Santé 811, option 1</a>.</p></div>
        <div className="emergency-critical"><span>EN CAS DE SITUATION GRAVE</span><p>Difficulté à respirer ou à avaler, saignement abondant qui ne s’arrête pas, blessure grave au visage : <a href="tel:911">appelez le 911</a>. N’attendez pas un rendez-vous dentaire.</p></div>
        <div className="emergency-panel-bottom"><span>Aucun formulaire à remplir.</span><a href="https://www.quebec.ca/sante/trouver-une-ressource/info-sante-811" target="_blank" rel="noopener noreferrer">Repères santé ↗</a></div>
      </div>
    </dialog>
  </>;
}
