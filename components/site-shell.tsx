"use client";
import {useEffect,useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {Arrow} from "./icons";
import {PrivacyButton} from "./actions";
import "./site-header.css";
import {services} from "@/lib/services";
import {EmergencyAccess} from "./emergency-access";
export function Brand(){return <Link className="brand" href="/" aria-label="Épure, accueil">épure<span>.</span><small>CLINIQUE DENTAIRE</small></Link>}
export function SiteHeader(){
 const [menu,setMenu]=useState(false);
 const pathname=usePathname();
 const home=pathname==="/";
 const immersive=home||pathname.replace(/\/$/,"")==="/implants";
 const [overHero,setOverHero]=useState(true);
 useEffect(()=>{
  setMenu(false);
  if(!immersive) return;
  setOverHero(true);
  const hero=document.querySelector(home?"#accueil":"#implant-hero");
  if(!hero) return;
  const observer=new IntersectionObserver(([entry])=>setOverHero(entry.isIntersecting),{rootMargin:"-92px 0px 0px 0px"});
  observer.observe(hero);
  return ()=>observer.disconnect();
 },[home,immersive,pathname]);
 if(pathname==="/rendez-vous/"||pathname==="/rendez-vous")return <header className="header booking-header"><Brand/><Link href="/" className="booking-exit">Retour au site <span aria-hidden="true">↗</span></Link></header>;
 return <>
 <header className={`header${immersive?" header-overlay":""}${immersive&&overHero?" header-on-hero":""}`}><Brand/><nav className="desktop-nav" aria-label="Navigation principale"><details className="services-dropdown" onKeyDown={event=>{if(event.key==="Escape"){event.currentTarget.open=false;event.currentTarget.querySelector("summary")?.focus()}}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))event.currentTarget.open=false}}><summary>Nos soins <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2 4 4 4 4-4" stroke="currentColor"/></svg></summary><div className="services-dropdown-panel">{services.map(service=><Link href={service.href} key={service.href} onClick={event=>event.currentTarget.closest("details")?.removeAttribute("open")}><span>{service.number}</span>{service.name}</Link>)}<Link href="/soins/" onClick={event=>event.currentTarget.closest("details")?.removeAttribute("open")}>Tous les soins <Arrow/></Link></div></details><Link href="/clinique/">La clinique</Link></nav>
 <div className="header-end"><span className="model-label">Clinique modèle</span><button type="button" className="header-emergency" onClick={()=>window.dispatchEvent(new Event("epure:open-emergency"))}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8.2 3 2.1 4.8-2.1 2.1a15.6 15.6 0 0 0 5.9 5.9l2.1-2.1 4.8 2.1v3.1a2 2 0 0 1-2.2 2A18.8 18.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Urgence dentaire</button><Link href="/rendez-vous/" className="btn small">Rendez-vous <Arrow/></Link><button className="menu-button" type="button" aria-label={menu?"Fermer le menu":"Ouvrir le menu"} aria-expanded={menu} aria-controls="mobile-menu" onClick={()=>setMenu(!menu)}><span/><span/></button></div></header>
 <nav className={`mobile-menu${immersive&&overHero?" mobile-menu-on-hero":""}`} id="mobile-menu" aria-label="Navigation mobile" hidden={!menu} onClick={()=>setMenu(false)} onKeyDown={event=>{if(event.key==="Escape")setMenu(false)}}>
 <Link href="/soins/">Nos soins <Arrow/></Link>{services.map(service=><Link className="mobile-service-link" href={service.href} key={service.href}>{service.name}</Link>)}<Link href="/clinique/">La clinique</Link><Link href="/photos-guidees/">Photos guidées</Link><Link href="/rendez-vous/">Préparer ma visite <Arrow/></Link></nav>
 </>;
}
export function SiteFooter(){
 const pathname=usePathname();
 if(pathname==="/rendez-vous/"||pathname==="/rendez-vous")return <EmergencyAccess/>;
 if(pathname.replace(/\/$/,"")==="/photos-guidees")return <EmergencyAccess/>;
 return <>
 <section className="closing wrap"><div className="closing-copy"><p className="eyebrow">COMMENÇONS PAR VOUS.</p><h2>Un premier pas.<br/><em>À votre rythme.</em></h2></div><div className="closing-action"><Link href="/rendez-vous/" className="btn light">Préparer ma première visite <Arrow/></Link><span className="closing-note">Aucune décision de traitement à prendre aujourd’hui.</span></div></section>
 <footer className="footer wrap"><div className="footer-top"><Brand/><p>Votre sourire.<br/>Votre histoire. Votre rythme.</p><div><Link href="/soins/">Tous les soins</Link>{services.map(service=><Link href={service.href} key={service.href}>{service.name}</Link>)}</div><div><Link href="/clinique/">La clinique</Link><Link href="/photos-guidees/">Photos guidées</Link><Link href="/rendez-vous/">Rendez-vous</Link><PrivacyButton/></div></div><div className="footer-bottom"><span>© 2026 Épure · Identité de démonstration</span><span>Clinique fictive et images illustratives. Demandes simulées.</span><span>Une création Karwisoft Marketing</span></div></footer>
 <EmergencyAccess/>
 </>;
}
