"use client";
import {useState} from "react";
import Link from "next/link";
import {Arrow} from "./icons";
import {StartButton,PrivacyButton} from "./actions";
export function Brand(){return <Link className="brand" href="/" aria-label="Épure, accueil">épure<span>.</span><small>CLINIQUE DENTAIRE</small></Link>}
export function SiteHeader(){
 const [menu,setMenu]=useState(false);
 return <>
 <header className="header"><Brand/><nav className="desktop-nav" aria-label="Navigation principale"><Link href="/#soins">Nos soins</Link><Link href="/#approche">L’approche</Link><Link href="/#questions">Vos questions</Link></nav>
 <div className="header-end"><span className="model-label">Clinique modèle</span><StartButton className="btn small">Mon évaluation <Arrow/></StartButton><button className="menu-button" type="button" aria-label={menu?"Fermer le menu":"Ouvrir le menu"} aria-expanded={menu} aria-controls="mobile-menu" onClick={()=>setMenu(!menu)}><span/><span/></button></div></header>
 <nav className="mobile-menu" id="mobile-menu" aria-label="Navigation mobile" hidden={!menu} onClick={()=>setMenu(false)} onKeyDown={event=>{if(event.key==="Escape")setMenu(false)}}>
 <Link href="/#soins">Nos soins</Link><Link href="/implants/">Les implants</Link><Link href="/#approche">Notre approche</Link><Link href="/#questions">Vos questions</Link><StartButton>Préparer mon évaluation <Arrow/></StartButton></nav>
 </>;
}
export function SiteFooter(){
 return <>
 <section className="closing wrap"><p className="eyebrow">ET SI ON COMMENÇAIT PAR VOUS ?</p><h2>Un premier pas.<br/><em>À votre rythme.</em></h2><p>Vous n’avez pas besoin d’avoir toutes les réponses<br className="desktop-only"/> pour commencer à poser vos questions.</p><StartButton className="btn light">Préparer mon évaluation <Arrow/></StartButton><span className="closing-note">Aucune décision de traitement à prendre aujourd’hui.</span></section>
 <footer className="footer wrap"><div className="footer-top"><Brand/><p>Votre sourire.<br/>Votre histoire. Votre rythme.</p><div><Link href="/#soins">Nos soins</Link><Link href="/implants/">Les implants</Link><StartButton>Mon évaluation</StartButton></div><div><Link href="/#approche">Notre approche</Link><Link href="/#questions">Vos questions</Link><PrivacyButton/></div></div><div className="footer-bottom"><span>© 2026 Épure · Identité de démonstration</span><span>Clinique fictive et images illustratives. Demandes simulées.</span><span>Une création Karwisoft Marketing</span></div></footer>
 <div className="mobile-cta"><span>Votre prochain pas ?</span><StartButton>Mon évaluation <Arrow/></StartButton></div>
 </>;
}
