"use client";
import {useEffect,useState} from "react";
import Link from "./locale-link";
import {Arrow} from "./icons";
import {PrivacyButton} from "./actions";
import "./site-header.css";
import {getServices} from "@/lib/services";
import {shell} from "@/lib/i18n/dict/shell";
import {rich} from "@/lib/i18n/rich";
import {EmergencyAccess} from "./emergency-access";
import {LanguageSwitcher} from "./language-switcher";
import {useCanonicalPath,useLocale} from "./locale-provider";
const immersiveHeroIds:Record<string,string>={"/implants":"implant-hero","/invisalign":"invisalign-hero","/pont-dentaire":"bridge-hero"};
export function Brand(){const t=shell[useLocale()];return <Link className="brand" href="/" aria-label={t.brandAria}>épure<span>.</span><small>{t.brandSub}</small></Link>}
export function SiteHeader(){
 const t=shell[useLocale()];const services=getServices(useLocale());
 const [menu,setMenu]=useState(false);
 const pathname=useCanonicalPath();
 const home=pathname==="/";
 const serviceRoute=pathname.replace(/\/$/,"");
 const heroId=home?"accueil":immersiveHeroIds[serviceRoute];
 const immersive=Boolean(heroId);
 const [overHero,setOverHero]=useState(true);
 useEffect(()=>{
  setMenu(false);
  if(!heroId) return;
  setOverHero(true);
  const hero=document.getElementById(heroId);
  if(!hero) return;
  const observer=new IntersectionObserver(([entry])=>setOverHero(entry.isIntersecting),{rootMargin:"-92px 0px 0px 0px"});
  observer.observe(hero);
  return ()=>observer.disconnect();
 },[heroId,pathname]);
 if(pathname==="/rendez-vous/")return <header className="header booking-header"><Brand/><div className="booking-header-end"><LanguageSwitcher/><Link href="/" className="booking-exit">{t.backToSite} <span aria-hidden="true">↗</span></Link></div></header>;
 return <>
 <header className={`header${immersive?" header-overlay":""}${immersive&&overHero?" header-on-hero":""}`}><Brand/><nav className="desktop-nav" aria-label={t.nav}><details className="services-dropdown" onKeyDown={event=>{if(event.key==="Escape"){event.currentTarget.open=false;event.currentTarget.querySelector("summary")?.focus()}}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))event.currentTarget.open=false}}><summary>{t.treatments} <svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m2 4 4 4 4-4" stroke="currentColor"/></svg></summary><div className="services-dropdown-panel">{services.map(service=><Link href={service.href} key={service.href} onClick={event=>event.currentTarget.closest("details")?.removeAttribute("open")}><span>{service.number}</span>{service.name}</Link>)}<Link href="/soins/" onClick={event=>event.currentTarget.closest("details")?.removeAttribute("open")}>{t.allTreatments} <Arrow/></Link></div></details><Link href="/clinique/">{t.clinic}</Link></nav>
 <div className="header-end"><span className="model-label">{t.modelLabel}</span><LanguageSwitcher/><button type="button" className="header-emergency" onClick={()=>window.dispatchEvent(new Event("epure:open-emergency"))}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8.2 3 2.1 4.8-2.1 2.1a15.6 15.6 0 0 0 5.9 5.9l2.1-2.1 4.8 2.1v3.1a2 2 0 0 1-2.2 2A18.8 18.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>{t.emergency}</button><Link href="/rendez-vous/" className="btn small">{t.appointment} <Arrow/></Link><button className="menu-button" type="button" aria-label={menu?t.closeMenu:t.openMenu} aria-expanded={menu} aria-controls="mobile-menu" onClick={()=>setMenu(!menu)}><span/><span/></button></div></header>
 <nav className={`mobile-menu${immersive&&overHero?" mobile-menu-on-hero":""}`} id="mobile-menu" aria-label={t.mobileNav} hidden={!menu} onClick={()=>setMenu(false)} onKeyDown={event=>{if(event.key==="Escape")setMenu(false)}}>
 <Link href="/soins/">{t.treatments} <Arrow/></Link>{services.map(service=><Link className="mobile-service-link" href={service.href} key={service.href}>{service.name}</Link>)}<Link href="/clinique/">{t.clinic}</Link><Link href="/photos-guidees/">{t.guidedPhotos}</Link><Link href="/rendez-vous/">{t.prepareVisit} <Arrow/></Link></nav>
 </>;
}
export function SiteFooter(){
 const t=shell[useLocale()];const services=getServices(useLocale());
 const pathname=useCanonicalPath();
 if(pathname==="/rendez-vous/")return <EmergencyAccess/>;
 if(pathname==="/photos-guidees/")return <EmergencyAccess/>;
 return <>
 <section className="closing wrap"><div className="closing-copy"><p className="eyebrow">{t.closingEyebrow}</p><h2>{rich(t.closingTitle)}</h2></div><div className="closing-action"><Link href="/rendez-vous/" className="btn light">{t.closingCta} <Arrow/></Link><span className="closing-note">{t.closingNote}</span></div></section>
 <footer className="footer wrap"><div className="footer-top"><Brand/><p>{rich(t.tagline)}</p><div><Link href="/soins/">{t.allTreatments}</Link>{services.map(service=><Link href={service.href} key={service.href}>{service.name}</Link>)}</div><div><Link href="/clinique/">{t.clinic}</Link><Link href="/photos-guidees/">{t.guidedPhotos}</Link><Link href="/rendez-vous/">{t.appointment}</Link><PrivacyButton/></div></div><div className="footer-bottom"><span>{t.copyright}</span><span>{t.disclaimer}</span><span>{t.credit}</span></div></footer>
 <EmergencyAccess/>
 </>;
}
