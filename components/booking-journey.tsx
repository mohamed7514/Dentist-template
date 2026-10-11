"use client";

import Link from "next/link";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {Arrow} from "./icons";
import {usePhotoSession} from "./photo-session";
import {useBookingSession,type BookingDraft} from "./booking-session";
import "./booking-journey.css";

const needs=["Remplacer une dent","Éclaircir mon sourire","Aligner mes dents","Un examen ou un autre besoin","Je ne sais pas encore"];
const timings=["Dès que possible","Dans les 3 prochains mois","Je prends le temps de me renseigner"];
const budgets=["J’ai besoin d’un devis","Moins de 5 000 $","5 000 à 10 000 $","Plus de 10 000 $"];
const periods=["Le matin","L’après-midi","Peu importe"];
const stages=["Votre besoin","Votre visite","Vos coordonnées","Vérification"];
const titles=["Quel est votre besoin ?","Quand aimeriez-vous commencer ?","Un budget en tête ?","Quel jour vous conviendrait ?","Comment vous joindre ?","Tout est bon pour vous ?"];
const hints=["Choisissez ce qui vous correspond.","Choisissez votre rythme.","Facultatif. Vous pourrez en parler au cabinet.","Votre préférence sera confirmée par la réception.","Pour cet essai, utilisez des coordonnées fictives.","Vérifiez vos informations avant de terminer l’essai."];

function localDate(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}
function displayDate(value:string){return value?new Date(value+"T12:00:00").toLocaleDateString("fr-CA",{weekday:"long",day:"numeric",month:"long"}):"Date à choisir"}
function openEmergency(){window.dispatchEvent(new Event("epure:open-emergency"))}

function JourneyIcon({kind=0}:{kind?:number}){
 return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">{kind===5?<path d="m10 5 3 6-3 3a17 17 0 0 0 8 8l3-3 6 3v4c0 2-2 3-4 2C11 26 6 21 4 9c-1-2 0-4 2-4h4Z"/>:kind===1?<><path d="M16 3c0 8-5 13-13 13 8 0 13 5 13 13 0-8 5-13 13-13C21 16 16 11 16 3Z"/><path d="M26 3v6m-3-3h6"/></>:kind===3?<><rect x="5" y="7" width="22" height="21" rx="3"/><path d="M5 14h22M10 4v6m12-6v6m-12 9h4m4 0h4m-12 5h4"/></>:kind===4?<><path d="M11 11a5 5 0 1 1 10 0c0 4-5 4-5 7"/><path d="M16 24h.01"/><circle cx="16" cy="16" r="13"/></>:<><path d="M16 7c-5-5-13-2-11 6 1 4 2 15 6 15 3 0 2-10 5-10s2 10 5 10c4 0 5-11 6-15 2-8-6-11-11-6Z"/>{kind===2?<path d="M8 13h16m-13-2v4m10-4v4"/>:<path d="m13 7 3 2 3-2"/>}</>}</svg>;
}

function Calendar({value,minimum,onChange}:{value:string;minimum:string;onChange:(value:string)=>void}){
 const [month,setMonth]=useState("");
 useEffect(()=>{setMonth((value||minimum).slice(0,7))},[minimum]); // Retain the browsed month until the minimum date is known.
 if(!month)return <div className="booking-calendar-loading" aria-busy="true">Chargement du calendrier…</div>;
 const [year,number]=month.split("-").map(Number);
 const first=new Date(year,number-1,1,12);
 const offset=(first.getDay()+6)%7;
 const length=new Date(year,number,0).getDate();
 const label=first.toLocaleDateString("fr-CA",{month:"long",year:"numeric"});
 function move(delta:number){setMonth(localDate(new Date(year,number-1+delta,1,12)).slice(0,7))}
 return <div className="booking-calendar"><div className="booking-calendar-top"><button type="button" aria-label="Mois précédent" disabled={month<=minimum.slice(0,7)} onClick={()=>move(-1)}>←</button><span aria-live="polite">{label}</span><button type="button" aria-label="Mois suivant" onClick={()=>move(1)}>→</button></div><div className="booking-weekdays" aria-hidden="true">{["L","M","M","J","V","S","D"].map((day,index)=><span key={index}>{day}</span>)}</div><div className="booking-days" role="group" aria-label={`Dates souhaitées, ${label}`}>{Array.from({length:offset},(_,index)=><span key={`empty-${index}`}/>)}{Array.from({length},(_,index)=>{const date=`${month}-${String(index+1).padStart(2,"0")}`;return <button key={date} type="button" data-date={date} aria-label={displayDate(date)} aria-pressed={value===date} disabled={date<minimum} className={value===date?"selected":""} onClick={()=>onChange(date)}>{index+1}</button>})}</div></div>;
}

export function BookingJourney(){
 const {step,setStep,draft,setDraft}=useBookingSession();
 const {photos,clear}=usePhotoSession();
 const photoCount=photos.filter(Boolean).length;
 const [minimum,setMinimum]=useState("");
 const [error,setError]=useState("");
 const [editing,setEditing]=useState(false);
 const card=useRef<HTMLElement>(null);
 const heading=useRef<HTMLHeadingElement>(null);
 const interacted=useRef(false);
 const group=step<=2?0:step===3?1:step===4?2:3;
 useEffect(()=>{const today=new Date().toLocaleDateString("en-CA",{timeZone:"America/Toronto"});const tomorrow=new Date(today+"T12:00:00");tomorrow.setDate(tomorrow.getDate()+1);setMinimum(localDate(tomorrow))},[]);
 useEffect(()=>{
  if(!interacted.current)return;
  heading.current?.focus({preventScroll:true});
  if(card.current&&card.current.getBoundingClientRect().top<70)card.current.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
 },[step]);
 function update(key:keyof BookingDraft,value:string){setDraft(current=>({...current,[key]:value}));setError("")}
 function go(next:number){interacted.current=true;setError("");setStep(next)}
 function answer(key:keyof BookingDraft,value:string){update(key,value);go(editing?5:step+1);setEditing(false)}
 function edit(next:number){setEditing(true);go(next)}
 function back(){setEditing(false);go(editing?5:step-1)}
 function advance(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(step===3&&(!draft.date||draft.date<minimum||!draft.period)){setError("Choisissez un jour et un moment de la journée.");return}
  if(step===4){
   const digits=draft.phone.replace(/\D/g,"");
   if(!draft.firstName.trim()||!draft.lastName.trim()){setError("Ajoutez votre prénom et votre nom.");return}
   if(!/^\+?[\d().\s-]+$/.test(draft.phone.trim())||!/^(?:1)?\d{10}$/.test(digits)||(draft.phone.trim().startsWith("+")&&!(digits.length===11&&digits.startsWith("1")))){setError("Vérifiez le téléphone : 10 chiffres, avec ou sans +1.");return}
  }
  if(step===5&&(!draft.need||!draft.timing||!draft.date||draft.date<minimum||!draft.period||!draft.firstName.trim()||!draft.lastName.trim()||!draft.phone)){setError("Votre demande est incomplète. Vérifiez les étapes précédentes.");return}
  go(editing?5:step+1);setEditing(false);
 }
 function choice(options:string[],key:keyof BookingDraft){return <div className={`booking-options${key==="need"?" booking-options-needs":""}`} role="group" aria-label={titles[step]}>{options.map((option,index)=><button type="button" className={`booking-option${draft[key]===option?" is-selected":""}`} key={option} data-answer={option} aria-pressed={draft[key]===option} onClick={()=>answer(key,option)}>{key==="need"&&<span className="booking-option-icon"><JourneyIcon kind={index}/></span>}<span>{option}</span><Arrow/></button>)}</div>}
 function photoRow(){return <div className="booking-photo-row"><div className="booking-photo-label">{photoCount>0&&<span className="booking-photo-thumbs">{photos.map((photo,index)=>photo&&<img key={index} src={photo.url} alt={`Photo ${index+1} préparée`}/>)}</span>}<span>{photoCount?`${photoCount} photo${photoCount>1?"s":""} préparée${photoCount>1?"s":""}`:"Des photos à ajouter ?"}<small>{photoCount?"Sur cet appareil uniquement":"Facultatif"}</small></span></div><Link href="/photos-guidees/">{photoCount?"Voir":"Ajouter"} <span aria-hidden="true">↗</span></Link></div>}
 return <div className="booking-container">
  <article className={`booking-card${step===-1?" booking-card-entry":""}`} ref={card}>
   {step>=0&&step<6&&<div className="booking-navigation"><div><button type="button" className="booking-back" data-booking-back onClick={back}>← Retour</button><span>{group+1}/4 <b>· {stages[group]}</b></span></div><div className="booking-progress" role="progressbar" aria-label={stages[group]} aria-valuemin={1} aria-valuemax={4} aria-valuenow={group+1}>{stages.map((label,index)=><span key={label} className={index<=group?"active":""}/>)}</div></div>}
   <div className="booking-stage" key={step}>
    {step===-1?<>
     <p className="booking-eyebrow">VOTRE PREMIÈRE VISITE</p><h1 ref={heading} tabIndex={-1}>De quoi avez-vous<br/><em>besoin ?</em></h1><p className="booking-hint">Choisissez une option pour commencer.</p>
     <div className="booking-entry"><button type="button" data-booking-consultation onClick={()=>go(0)}><span className="booking-entry-icon"><JourneyIcon/></span><strong>Une consultation</strong><span className="booking-entry-description">Préparer ma première visite</span><span className="booking-entry-action">Commencer <Arrow/></span></button><button type="button" data-booking-urgent onClick={openEmergency}><span className="booking-entry-icon"><JourneyIcon kind={5}/></span><strong>Une urgence</strong><span className="booking-entry-description">Contacter la clinique directement</span><span className="booking-entry-action">Voir les contacts <Arrow/></span></button></div>
    </>:step===6?<div className="booking-complete"><span className="booking-complete-icon" aria-hidden="true">✓</span><p className="booking-eyebrow">SIMULATION TERMINÉE</p><h1 ref={heading} tabIndex={-1}>C’est tout.<br/><em>Simplement.</em></h1><p className="booking-hint">Aucune demande envoyée. Aucun rendez-vous réservé.</p><div className="booking-complete-date"><strong>{displayDate(draft.date)}</strong><span>{draft.period} · Préférence simulée</span></div><p className="booking-confirmation-note">Avec le service connecté, la réception vous contactera pour confirmer.</p><Link href="/" className="booking-primary">Retour au site <Arrow/></Link><button type="button" className="booking-text-button" onClick={()=>go(5)}>Revoir mes informations</button></div>:<>
     <h1 ref={heading} tabIndex={-1}>{titles[step]}</h1><p className="booking-hint">{hints[step]}</p>
     {step===0?choice(needs,"need"):step===1?choice(timings,"timing"):step===2?<>{choice(budgets,"budget")}<button type="button" className="booking-skip" onClick={()=>answer("budget","")}>Passer cette question <Arrow/></button><p className="booking-price-note">Ces budgets ne sont pas des tarifs de soins.</p></>:<form onSubmit={advance} onInvalidCapture={event=>{if(event.target instanceof HTMLElement)event.target.closest("details")?.setAttribute("open","")}}>
      {step===3?<div className="booking-date-choice"><Calendar value={draft.date} minimum={minimum} onChange={value=>update("date",value)}/><fieldset className="booking-periods"><legend>À quel moment ?</legend><div>{periods.map(period=><label key={period} className={draft.period===period?"selected":""}><input type="radio" name="period" value={period} checked={draft.period===period} onChange={()=>update("period",period)}/>{period}</label>)}</div></fieldset><p className="booking-date-summary" aria-live="polite">{draft.date?`${displayDate(draft.date)}${draft.period?` · ${draft.period}`:""}`:"Choisissez un jour dans le calendrier."}</p></div>:step===4?<>
       <div className="booking-fields"><label>Prénom<input name="firstName" autoComplete="given-name" maxLength={80} required value={draft.firstName} onChange={event=>update("firstName",event.target.value)}/></label><label>Nom<input name="lastName" autoComplete="family-name" maxLength={80} required value={draft.lastName} onChange={event=>update("lastName",event.target.value)}/></label><label className="booking-field-wide">Téléphone<input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={25} required placeholder="514 555-0123" value={draft.phone} onChange={event=>update("phone",event.target.value)}/></label></div>
       <details className="booking-extra" open={!!draft.email||!!draft.note||undefined}><summary>Ajouter un courriel ou une question <span>Facultatif</span></summary><div className="booking-fields"><label className="booking-field-wide">Courriel<input name="email" type="email" autoComplete="email" maxLength={254} value={draft.email} onChange={event=>update("email",event.target.value)}/></label><label className="booking-field-wide">Votre question<textarea name="note" rows={2} maxLength={500} value={draft.note} onChange={event=>update("note",event.target.value)} placeholder="Évitez les renseignements médicaux sensibles."/></label></div></details>
       {photoRow()}
      </>:<>
       <div className="booking-recap"><section><div><span>Votre besoin</span><button type="button" onClick={()=>edit(0)}>Modifier</button></div><strong>{draft.need}</strong><p>{draft.timing}</p><div className="booking-budget-recap"><span>Budget : {draft.budget||"à discuter"}</span><button type="button" onClick={()=>edit(2)}>Modifier</button></div><button type="button" className="booking-edit-timing" onClick={()=>edit(1)}>Modifier l’échéance</button></section><section><div><span>Votre préférence</span><button type="button" onClick={()=>edit(3)}>Modifier</button></div><strong>{displayDate(draft.date)}</strong><p>{draft.period} · Heure de Montréal</p><small>À confirmer par la réception.</small></section><section><div><span>Vos coordonnées</span><button type="button" onClick={()=>edit(4)}>Modifier</button></div><strong>{draft.firstName.trim()} {draft.lastName.trim()}</strong><p>{draft.phone}</p>{draft.email&&<p>{draft.email}</p>}{draft.note&&<p className="booking-recap-note">{draft.note}</p>}</section></div>{photoRow()}{photoCount>0&&<button type="button" className="booking-remove-photos" onClick={clear}>Retirer les photos</button>}
      </>}
      {error&&<p className="booking-error" role="alert">{error}</p>}
      <div className="booking-actions"><button className="booking-primary" type="submit" disabled={step===3&&(!draft.date||!draft.period||draft.date<minimum)}>{editing?"Enregistrer la modification":step===5?"Terminer l’essai":step===4?"Vérifier mes informations":"Continuer"}<Arrow/></button></div>
     </form>}
    </>}
   </div>
  </article>
  <div className="booking-bottom"><p><span aria-hidden="true">◌</span> Démonstration · Aucun envoi ni réservation réelle.</p>{step>=0&&step<6&&<button type="button" onClick={openEmergency}>Une urgence ?</button>}</div>
 </div>;
}
