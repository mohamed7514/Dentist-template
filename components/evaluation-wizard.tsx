"use client";
import {useCallback,useEffect,useRef,useState,type FormEvent} from "react";
import {Arrow} from "./icons";
import {PhotoStep} from "./photo-step";
import {businessDates,budgets,insurances,emptyContact,formatDate,goals,times,timings,validateContact,type Contact,type Goal,type Photo,type Stage} from "@/lib/journey";

type Props={open:boolean;onClose:()=>void;request:{id:number;goal?:Goal;timing?:number;prefill?:boolean}};
const phaseFor:Record<Stage,number>={photos:0,quiz:1,contact:2,booking:3,recap:3,success:3};
export function EvaluationWizard({open,onClose,request}:Props){
 const dialogRef=useRef<HTMLDialogElement>(null),viewRef=useRef<HTMLDivElement>(null);
 const [stage,setStage]=useState<Stage>("photos"),[need,setNeed]=useState<Goal>("avis");
 const [photos,setPhotos]=useState<(Photo|null)[]>([null,null,null]),photosRef=useRef<(Photo|null)[]>([null,null,null]);
 const [photoIndex,setPhotoIndex]=useState(0),[question,setQuestion]=useState(0);
 const [answers,setAnswers]=useState<(string|null)[]>([null,null,null,null]),answersRef=useRef<(string|null)[]>([null,null,null,null]);
 const [contact,setContact]=useState<Contact>(emptyContact);
 const [dates,setDates]=useState<Date[]>([]),[date,setDate]=useState<number|null>(null),[time,setTime]=useState<string|null>(null),[week,setWeek]=useState(0),[error,setError]=useState("");
 const phase=phaseFor[stage];
 useEffect(()=>{answersRef.current=answers},[answers]);
 useEffect(()=>{
  if(!request.id||!request.goal)return;
  setNeed(request.goal);
  if(request.prefill){
   const timing=request.timing===undefined?null:timings[request.timing]??null;
   setAnswers([goals[request.goal],timing,null,null]);setQuestion(timing?2:1);setDate(null);setTime(null);return;
  }
  if(answersRef.current[0]&&answersRef.current[0]!==goals[request.goal]){
   setAnswers([null,null,null,null]);setQuestion(0);setStage("quiz");setDate(null);setTime(null);
  }
 },[request.id,request.goal,request.timing,request.prefill]);
 useEffect(()=>{
  const dialog=dialogRef.current;
  if(open&&!dialog?.open)dialog?.showModal();
  else if(!open&&dialog?.open)dialog.close();
  if(open&&!dates.length)setDates(businessDates());
 },[open,dates.length]);
 useEffect(()=>{
  setError("");
  if(open){
   const title=viewRef.current?.querySelector("h2");
   if(title){title.id="flow-title";title.tabIndex=-1;title.focus({preventScroll:true})}
   dialogRef.current?.scrollTo({top:0,behavior:"auto"});
  }
 },[open,stage,question,photoIndex]);
 useEffect(()=>()=>{photosRef.current.forEach(photo=>{if(photo)URL.revokeObjectURL(photo.url)})},[]);
 const updatePhoto=useCallback((index:number,photo:Photo|null)=>{
  const previous=photosRef.current[index];if(previous)URL.revokeObjectURL(previous.url);
  const next=photosRef.current.map((item,i)=>i===index?photo:item);photosRef.current=next;setPhotos(next);
 },[]);
 function clearPhotos(){photosRef.current.forEach(photo=>{if(photo)URL.revokeObjectURL(photo.url)});photosRef.current=[null,null,null];setPhotos([null,null,null])}
 function restart(){clearPhotos();setStage("photos");setPhotoIndex(0);setQuestion(0);setAnswers([null,null,null,null]);setContact(emptyContact());setDate(null);setTime(null);setWeek(0);setNeed(request.goal??"avis")}
 function back(){
  if(stage==="photos"&&photoIndex>0){setPhotoIndex(photoIndex-1);return}
  if(stage==="quiz"&&question>0){setQuestion(question-1);return}
  const previous:Partial<Record<Stage,Stage>>={quiz:"photos",contact:"quiz",booking:"contact",recap:"booking"};
  if(previous[stage])setStage(previous[stage]!);
 }
 function submitContact(event:FormEvent<HTMLFormElement>){event.preventDefault();const message=validateContact(contact);if(message){setError(message);return}setStage("booking")}
 const goalOrder=[need,...(Object.keys(goals) as Goal[]).filter(goal=>goal!==need)];
 const choices=question===0?goalOrder.map(goal=>goals[goal]):question===1?timings:question===2?insurances:budgets;
 function answer(choice:string){
  setAnswers(previous=>previous.map((value,i)=>i===question?choice:value));
  if(question===0){const goal=(Object.keys(goals) as Goal[]).find(key=>goals[key]===choice);if(goal)setNeed(goal)}
  if(question<3)setQuestion(question+1);else setStage("contact");
 }
 function changeContact<K extends keyof Contact>(key:K,value:Contact[K]){setContact(previous=>({...previous,[key]:value}))}
 const chosenDate=date===null?null:dates[date];
 const slot=chosenDate?formatDate(chosenDate)+(time?" · "+time:""):"";
 const rows:[string,string][]=[
  ["Votre projet",answers[0]??""],["Votre échéance",answers[1]??""],["Assurance",answers[2]??""],["Votre budget",answers[3]??""],
  ["Photos ajoutées",photos.filter(Boolean).length+" / 3"],["Votre nom",contact.name],
  ["Contact préféré",contact.preference==="Email"?contact.email:contact.phone],["Créneau souhaité",slot]
 ];
 if(contact.message)rows.push(["Votre question",contact.message]);
 rows.push(["Rappels",contact.reminders?"Oui":"Non"]);
 const recap=<dl className="recap-list">{rows.map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>;
 function download(){
  const lines=["ÉPURE — RÉCAPITULATIF DE DÉMONSTRATION","Aucune demande envoyée. Aucun rendez-vous réservé.","",...rows.map(([key,value])=>key+": "+value),"Téléphone: "+contact.phone,"Email: "+contact.email,"","Le créneau devra être vérifié et confirmé par la réception. Les photos ne sont pas incluses dans ce fichier."];
  const url=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");
  a.href=url;a.download="mon-projet-de-sourire.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <dialog ref={dialogRef} id="evaluation-dialog" className="evaluation-dialog" aria-labelledby="flow-title" onCancel={onClose} onClose={onClose}>
  <div className="flow-header"><button className="brand" type="button" style={{background:"none",padding:0}} aria-label="Fermer le parcours et revenir au site" onClick={onClose}>épure<span>.</span></button><button type="button" className="close-dialog" id="close-flow" aria-label="Fermer le parcours" onClick={onClose}>×</button></div>
  <div className="flow-layout"><aside className="flow-aside"><ol id="flow-steps">{["Vos photos","Votre projet","Vos coordonnées","Votre créneau"].map((label,i)=><li key={label} className={i===phase?"active":i<phase?"complete":""} data-phase={i}><span>0{i+1}</span>{label}{i===0&&<small>Facultatif</small>}</li>)}</ol></aside>
  <div className="flow-content"><div className="flow-status"><span id="flow-counter">{stage==="success"?"PARCOURS TERMINÉ":"ÉTAPE "+(phase+1)+" SUR 4"}</span></div>
  <div id="flow-view" ref={viewRef}>
   {stage==="photos"&&<PhotoStep open={open} photos={photos} index={photoIndex} onIndex={setPhotoIndex} onPhoto={updatePhoto} onNext={()=>setStage("quiz")} onSkip={()=>{clearPhotos();setPhotoIndex(0);setStage("quiz")}} onError={setError}/>}
   {stage==="quiz"&&<>
    <div className="quiz-subprogress" aria-label={"Question "+(question+1)+" sur 4"}>{[0,1,2,3].map(i=><span key={i} className={i<=question?"active":""}/>)}</div>
    <h2>{["Qu’aimeriez-vous explorer ?","Quand aimeriez-vous avancer ?","Une assurance dentaire ?","Votre budget ?"][question]}</h2>
    <div className="quiz-options">{choices.map((choice,i)=><button className={"quiz-option "+(answers[question]===choice?"chosen":"")} type="button" key={choice} data-answer={i} aria-pressed={answers[question]===choice} onClick={()=>answer(choice)}><span>{choice}</span><span aria-hidden="true">↗</span></button>)}</div>
   </>}
   {stage==="contact"&&<>
    <h2>Comment vous <em>joindre ?</em></h2>
    <form className="contact-form" id="contact-form" onSubmit={submitContact}>
     <label className="field">Votre nom<input name="name" autoComplete="name" required maxLength={80} placeholder="Prénom et nom" value={contact.name} onChange={event=>changeContact("name",event.target.value)}/></label>
     <div className="form-grid"><label className="field">Téléphone<input name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="514 555 0000" value={contact.phone} onChange={event=>changeContact("phone",event.target.value)}/></label><label className="field">Email<input name="email" type="email" autoComplete="email" maxLength={254} placeholder="vous@exemple.ca" value={contact.email} onChange={event=>changeContact("email",event.target.value)}/></label></div>
     <label className="field">Contact préféré<select name="preference" value={contact.preference} onChange={event=>changeContact("preference",event.target.value as Contact["preference"])}>{["SMS","Email","Appel"].map(value=><option key={value}>{value}</option>)}</select></label>
     <label className="check-label"><input type="checkbox" name="consent" required checked={contact.consent} onChange={event=>changeContact("consent",event.target.checked)}/><span>J’accepte d’être contacté au sujet de ma demande.</span></label>
     <button type="submit" className="btn">Continuer <Arrow/></button>
    </form>
   </>}
   {stage==="booking"&&<>
    <h2>Choisissez un <em>créneau.</em></h2>
    <div className="date-navigation"><strong>{dates[week*5]?.toLocaleDateString("fr-CA",{month:"long",year:"numeric"})}</strong><div><button type="button" id="week-prev" disabled={week===0} aria-label="Dates précédentes" onClick={()=>setWeek(week-1)}>‹</button><button type="button" id="week-next" disabled={week===2} aria-label="Dates suivantes" onClick={()=>setWeek(week+1)}>›</button></div></div>
    <div className="date-options">{dates.slice(week*5,week*5+5).map((day,i)=>{const index=week*5+i;return <button type="button" className={"date-button "+(date===index?"chosen":"")} data-date={index} key={day.toISOString()} aria-pressed={date===index} onClick={()=>{setDate(index);setTime(null)}}><span>{day.toLocaleDateString("fr-CA",{weekday:"short"})}</span><strong>{day.getDate()}</strong><span>{day.toLocaleDateString("fr-CA",{month:"short"})}</span></button>})}</div>
    <div className="time-options">{times.map(hour=><button key={hour} type="button" className={"time-button "+(time===hour?"chosen":"")} data-time={hour} disabled={date===null} aria-pressed={time===hour} onClick={()=>setTime(hour)}>{hour}</button>)}</div>
    <p className="slot-summary">{chosenDate?<><strong>{formatDate(chosenDate)}</strong>{time?" · "+time:" · choisissez une heure"}</>:"Choisissez un jour."}</p>
    <div className="flow-cta-row"><button type="button" className="btn" id="booking-next" disabled={date===null||!time} onClick={()=>setStage("recap")}>Continuer <Arrow/></button></div>
   </>}
   {stage==="recap"&&<><h2>Votre <em>demande.</em></h2>{recap}<div className="flow-cta-row"><button type="button" className="btn" id="finish-request" onClick={()=>setStage("success")}>Envoyer ma demande <Arrow/></button><button type="button" className="text-button" id="edit-contact" onClick={()=>setStage("contact")}>Modifier</button></div></>}
   {stage==="success"&&<div className="success-view"><span className="success-symbol" aria-hidden="true">✓</span><h2>Demande <em>envoyée.</em></h2><p>La réception vous confirme le rendez-vous.</p>{recap}<div className="flow-cta-row"><button type="button" className="btn" id="download-summary" onClick={download}>Télécharger le récapitulatif <Arrow/></button><button type="button" className="text-button" id="restart-flow" onClick={restart}>Recommencer</button></div></div>}
  </div>
  {error&&<p id="flow-error" role="alert">{error}</p>}
  <div className="flow-bottom"><button className="text-button" id="flow-back" type="button" hidden={stage==="success"||(stage==="photos"&&photoIndex===0)} onClick={back}>← Retour</button><span>Démonstration · rien n’est envoyé</span></div>
 </div></div>
 </dialog>;
}
