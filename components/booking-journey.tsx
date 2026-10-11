"use client";

import Link from "next/link";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {Arrow} from "./icons";
import {PhotoSessionSummary,usePhotoSession} from "./photo-session";
import {useBookingSession,type BookingDraft} from "./booking-session";
import "./booking-journey.css";

const needs=["Remplacer une dent","Éclaircir mon sourire","Aligner mes dents","Un examen ou un autre besoin","Je ne sais pas encore"];
const timings=["Dès que possible","Dans les 3 prochains mois","Je prends le temps de me renseigner"];
const budgets=["J’ai besoin d’un devis","Moins de 5 000 $","5 000 à 10 000 $","Plus de 10 000 $","Je préfère en parler"];
const periods=["Le matin","L’après-midi","Peu importe"];
const steps=["Votre besoin","Votre préférence","Vos coordonnées","Vérification"];
function localDate(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}
function displayDate(value:string){return value?new Date(value+"T12:00:00").toLocaleDateString("fr-CA",{weekday:"long",day:"numeric",month:"long",year:"numeric"}):"À choisir"}
function ChoiceGroup({label,options,value,onChange,optional=false}:{label:string;options:string[];value:string;onChange:(value:string)=>void;optional?:boolean}){
 return <fieldset className="booking-choices"><legend>{label}{optional&&<small>Facultatif</small>}</legend><div>{options.map(option=><label key={option} className={value===option?"is-selected":""}><input type="radio" name={label} value={option} checked={value===option} onChange={()=>onChange(option)}/><span>{option}</span><span className="booking-choice-mark" aria-hidden="true">{value===option?"✓":""}</span></label>)}</div></fieldset>;
}
export function BookingJourney(){
 const {step,setStep,draft,setDraft}=useBookingSession();
 const [acknowledged,setAcknowledged]=useState(false);
 const [minimum,setMinimum]=useState("");
 const [error,setError]=useState("");
 const {photos}=usePhotoSession();
 const photoCount=photos.filter(Boolean).length;
 const panel=useRef<HTMLDivElement>(null);
 const title=useRef<HTMLHeadingElement>(null);
 const interacted=useRef(false);
 useEffect(()=>{const date=new Date();date.setDate(date.getDate()+1);setMinimum(localDate(date))},[]);
 useEffect(()=>{
  if(!interacted.current)return;
  title.current?.focus({preventScroll:true});
  panel.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
 },[step]);
 function update(key:keyof BookingDraft,value:string){setDraft(current=>({...current,[key]:value}));setError("");setAcknowledged(false)}
 function go(next:number){interacted.current=true;setError("");setStep(next)}
 function advance(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(step===0&&(!draft.need||!draft.timing)){setError("Choisissez votre besoin et votre échéance pour continuer.");return}
  if(step===1&&(!draft.date||draft.date<minimum||!draft.period)){setError("Choisissez une date future et un moment de la journée.");return}
  if(step===2){
   const digits=draft.phone.replace(/\D/g,"");
   if(!draft.firstName.trim()||!draft.lastName.trim()){setError("Indiquez votre prénom et votre nom.");return}
   if(!/^\+?[\d().\s-]+$/.test(draft.phone.trim())||! /^(?:1)?\d{10}$/.test(digits)||(draft.phone.trim().startsWith("+")&&!(digits.length===11&&digits.startsWith("1")))){setError("Indiquez un numéro canadien de 10 chiffres, avec ou sans le préfixe +1.");return}
  }
  if(step===3&&!acknowledged){setError("Confirmez avoir compris le fonctionnement de cette démonstration.");return}
  go(step+1);
 }
 const stageTitle=step===-1?"Comment pouvons-nous vous aider ?":step===0?"Qu’aimeriez-vous explorer ?":step===1?"Quel moment vous conviendrait ?":step===2?"Comment vous joindre ?":step===3?"Tout vous ressemble ?":"Votre parcours est prêt.";
 return <section className="booking-workspace wrap" aria-label="Préparer votre rendez-vous">
  <div className="booking-demo"><span>DÉMONSTRATION</span><p>Ce parcours ne réserve aucun rendez-vous et n’envoie aucune donnée. Utilisez des coordonnées fictives pour l’essayer.</p></div>
  <div className="booking-shell" ref={panel}>
   <aside className="booking-aside"><div className="booking-aside-top"><span className="eyebrow">VOTRE PREMIÈRE RENCONTRE</span><p>Un peu de vous.<br/><em>Un premier pas.</em></p></div>
    <ol className="booking-progress" aria-label="Étapes de votre demande">{steps.map((label,index)=><li key={label} className={step===index?"current":step>index?"complete":""} aria-current={step===index?"step":undefined}><button type="button" disabled={step<index||step===4} onClick={()=>go(index)}><span>{step>index?"✓":`0${index+1}`}</span>{label}</button></li>)}</ol>
    <div className="booking-aside-note"><span>À VOTRE RYTHME.</span><p>Les photos sont facultatives. Le rendez-vous devra être confirmé par la réception.</p></div>
   </aside>
   <div className="booking-panel">
    <div className="booking-panel-top"><span>{step===-1?"BIENVENUE":step===4?"ESSAI TERMINÉ":`ÉTAPE 0${step+1} / 04`}</span><span>{step<3?"Sans engagement de traitement":"Aucune demande envoyée"}</span></div>
    <h2 ref={title} tabIndex={-1}>{stageTitle}</h2>
    {step===-1?<>
     <p className="booking-intro">Une urgence mérite un contact direct. Pour un projet ou une première visite, préparons votre consultation ensemble.</p>
     <div className="booking-entry"><button type="button" data-booking-consultation onClick={()=>go(0)}><span className="booking-entry-icon">01</span><div><strong>Je souhaite une consultation</strong><p>Un projet, une question, une première visite.</p></div><Arrow/></button><button type="button" data-booking-urgent onClick={()=>window.dispatchEvent(new Event("epure:open-emergency"))}><span className="booking-entry-icon">↗</span><div><strong>J’ai une urgence dentaire</strong><p>Accéder directement aux informations d’appel.</p></div><Arrow/></button></div>
     <p className="booking-footnote">Aucune photo ni questionnaire requis pour accéder au contact d’urgence.</p>
    </>:step===4?<div className="booking-done" role="status">
     <span className="booking-done-icon" aria-hidden="true">✓</span><p className="booking-intro">La simulation est terminée. <strong>Aucune demande n’a été envoyée et aucun rendez-vous n’est réservé.</strong></p>
     <div className="booking-preference"><span>VOTRE PRÉFÉRENCE SIMULÉE</span><strong>{displayDate(draft.date)}</strong><p>{draft.period} · Heure de Montréal</p></div>
     <h3>Une fois le service connecté</h3><ol className="booking-after"><li><span>01</span>La réception reçoit votre demande.</li><li><span>02</span>Elle vérifie le créneau et vous contacte.</li><li><span>03</span>Vous recevez la confirmation du rendez-vous.</li></ol>
     <p className="booking-footnote">Les notifications et rappels seront activés avec le cabinet. Vos coordonnées restent uniquement dans cet onglet jusqu’au rechargement.</p>
     <div className="booking-actions"><button type="button" className="booking-secondary" onClick={()=>go(3)}>Revoir mon récapitulatif</button><Link className="booking-primary" href="/">Retour au site <Arrow/></Link></div>
    </div>:<form onSubmit={advance}>
     {step===0?<>
      <p className="booking-intro">Pas besoin d’avoir toutes les réponses. Votre dentiste vous aidera à faire le point.</p>
      <ChoiceGroup label="Votre besoin" options={needs} value={draft.need} onChange={value=>update("need",value)}/>
      <ChoiceGroup label="Votre échéance" options={timings} value={draft.timing} onChange={value=>update("timing",value)}/>
      <ChoiceGroup label="Une idée de votre budget ?" options={budgets} value={draft.budget} onChange={value=>update("budget",value)} optional/>
      <p className="booking-footnote">Les montants ne sont pas des tarifs de soins. Un devis nécessite une évaluation par le cabinet.</p>
     </>:step===1?<>
      <p className="booking-intro">Choisissez votre préférence. La réception vérifiera ses disponibilités avant de vous confirmer un rendez-vous.</p>
      <div className="booking-date-field"><label htmlFor="booking-date">Votre date souhaitée</label><input id="booking-date" name="date" type="date" required min={minimum||undefined} value={draft.date} onChange={event=>update("date",event.target.value)}/><span>Heure de Montréal · Ce choix ne bloque aucun créneau.</span></div>
      <ChoiceGroup label="Votre moment de la journée" options={periods} value={draft.period} onChange={value=>update("period",value)}/>
      <div className="booking-callout"><span>UNE PRÉFÉRENCE, PUIS UNE CONFIRMATION.</span><p>Si ce moment n’est pas disponible, la réception pourra vous proposer une autre possibilité.</p></div>
     </>:step===2?<>
      <p className="booking-intro">Un moyen de vous contacter pour discuter de votre première visite.</p>
      <p className="booking-contact-demo">Pour cet essai, saisissez des coordonnées fictives.</p>
      <div className="booking-fields"><label>Prénom<input name="firstName" autoComplete="given-name" maxLength={80} required value={draft.firstName} onChange={event=>update("firstName",event.target.value)}/></label><label>Nom<input name="lastName" autoComplete="family-name" maxLength={80} required value={draft.lastName} onChange={event=>update("lastName",event.target.value)}/></label><label className="booking-field-wide">Téléphone<input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="514 555-0123" maxLength={25} required value={draft.phone} onChange={event=>update("phone",event.target.value)} aria-describedby="booking-phone-note"/><small id="booking-phone-note">Numéro canadien · 10 chiffres, avec ou sans +1.</small></label><label className="booking-field-wide">Courriel <span>Facultatif</span><input name="email" type="email" autoComplete="email" maxLength={254} value={draft.email} onChange={event=>update("email",event.target.value)}/></label><label className="booking-field-wide">Une question à préparer ? <span>Facultatif</span><textarea name="note" rows={3} maxLength={500} placeholder="Une préférence ou une question pour votre première visite…" value={draft.note} onChange={event=>update("note",event.target.value)}/><small>Évitez d’inscrire des renseignements médicaux sensibles dans cette démonstration.</small></label></div>
      <div className="booking-photo-block"><PhotoSessionSummary/>{!photoCount&&<div><span>VOS PHOTOS · FACULTATIVES</span><p>Vous pouvez préparer deux photos guidées, ou continuer simplement sans.</p><Link href="/photos-guidees/">Préparer mes photos →</Link><small>Vos réponses sont conservées lorsque vous revenez dans ce même onglet.</small></div>}</div>
     </>:<>
      <p className="booking-intro">Prenez un instant pour vérifier. Vous pouvez encore modifier chaque réponse.</p>
      <div className="booking-recap"><section><div><h3>Votre projet</h3><button type="button" onClick={()=>go(0)}>Modifier</button></div><dl><div><dt>Besoin</dt><dd>{draft.need}</dd></div><div><dt>Échéance</dt><dd>{draft.timing}</dd></div><div><dt>Budget</dt><dd>{draft.budget||"À discuter avec le cabinet"}</dd></div></dl></section><section><div><h3>Votre préférence</h3><button type="button" onClick={()=>go(1)}>Modifier</button></div><dl><div><dt>Date souhaitée</dt><dd>{displayDate(draft.date)}</dd></div><div><dt>Moment</dt><dd>{draft.period} · Heure de Montréal</dd></div></dl><p>À vérifier et confirmer par la réception.</p></section><section><div><h3>Vos coordonnées</h3><button type="button" onClick={()=>go(2)}>Modifier</button></div><dl><div><dt>Nom</dt><dd>{draft.firstName.trim()} {draft.lastName.trim()}</dd></div><div><dt>Téléphone</dt><dd>{draft.phone}</dd></div>{draft.email&&<div><dt>Courriel</dt><dd>{draft.email}</dd></div>}{draft.note&&<div><dt>Votre question</dt><dd>{draft.note}</dd></div>}</dl></section></div>
      <PhotoSessionSummary/>{!photoCount&&<p className="booking-footnote">Aucune photo préparée. Vous pouvez continuer sans photos.</p>}
      <label className="booking-ack"><input name="demoAcknowledged" type="checkbox" checked={acknowledged} onChange={event=>setAcknowledged(event.target.checked)}/><span>Je comprends que cet essai ne transmet aucune demande et ne réserve aucun rendez-vous.</span></label>
     </>}
     {error&&<p className="booking-error" role="alert">{error}</p>}
     <div className="booking-actions"><button type="button" className="booking-secondary" onClick={()=>go(step-1)}>← Retour</button><button className="booking-primary" type="submit">{step===3?"Terminer la simulation":step===2?"Vérifier ma demande":"Continuer"}<Arrow/></button></div>
     <p className="booking-footnote">{step===3?"Aucun envoi. Aucune réservation. Cette étape illustre le parcours final.":"Vos réponses restent dans cet onglet jusqu’au rechargement. Vous pouvez revenir à l’étape précédente."}</p>
    </form>}
   </div>
  </div>
 </section>;
}
