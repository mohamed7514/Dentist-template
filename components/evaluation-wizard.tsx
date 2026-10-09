"use client";
import {useCallback,useEffect,useRef,useState,type FormEvent} from "react";
import {Arrow} from "./icons";
import {Comparison} from "./comparison";
import {PhotoStep} from "./photo-step";
import {businessDates,budgets,emptyContact,formatDate,goals,times,timings,validateContact,type Contact,type Goal,type Photo,type Stage} from "@/lib/journey";

type Props={open:boolean;onClose:()=>void;request:{id:number;goal?:Goal}};
const phaseFor:Record<Stage,number>={photos:0,preview:0,quiz:1,contact:2,booking:3,recap:3,success:3};
export function EvaluationWizard({open,onClose,request}:Props){
 const dialogRef=useRef<HTMLDialogElement>(null),viewRef=useRef<HTMLDivElement>(null);
 const [stage,setStage]=useState<Stage>("photos"),[need,setNeed]=useState<Goal>("avis");
 const [photos,setPhotos]=useState<(Photo|null)[]>([null,null,null]),photosRef=useRef<(Photo|null)[]>([null,null,null]);
 const [photoIndex,setPhotoIndex]=useState(0),[question,setQuestion]=useState(0);
 const [answers,setAnswers]=useState<(string|null)[]>([null,null,null]),answersRef=useRef<(string|null)[]>([null,null,null]);
 const [contact,setContact]=useState<Contact>(emptyContact);
 const [dates,setDates]=useState<Date[]>([]),[date,setDate]=useState<number|null>(null),[time,setTime]=useState<string|null>(null),[week,setWeek]=useState(0),[error,setError]=useState("");
 const phase=phaseFor[stage];
 useEffect(()=>{answersRef.current=answers},[answers]);
 useEffect(()=>{
  if(!request.id||!request.goal)return;
  setNeed(request.goal);
  if(answersRef.current[0]&&answersRef.current[0]!==goals[request.goal]){
   setAnswers([null,null,null]);setQuestion(0);setStage("quiz");setDate(null);setTime(null);
  }
 },[request.id,request.goal]);
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
 function restart(){clearPhotos();setStage("photos");setPhotoIndex(0);setQuestion(0);setAnswers([null,null,null]);setContact(emptyContact());setDate(null);setTime(null);setWeek(0);setNeed(request.goal??"avis")}
 function back(){
  if(stage==="photos"&&photoIndex>0){setPhotoIndex(photoIndex-1);return}
  if(stage==="quiz"&&question>0){setQuestion(question-1);return}
  const previous:Partial<Record<Stage,Stage>>={preview:"photos",quiz:photos.some(Boolean)?"preview":"photos",contact:"quiz",booking:"contact",recap:"booking"};
  if(previous[stage])setStage(previous[stage]!);
 }
 function submitContact(event:FormEvent<HTMLFormElement>){event.preventDefault();const message=validateContact(contact);if(message){setError(message);return}setStage("booking")}
 const goalOrder=[need,...(Object.keys(goals) as Goal[]).filter(goal=>goal!==need)];
 const choices=question===0?goalOrder.map(goal=>goals[goal]):question===1?timings:budgets;
 function answer(choice:string){
  setAnswers(previous=>previous.map((value,i)=>i===question?choice:value));
  if(question===0){const goal=(Object.keys(goals) as Goal[]).find(key=>goals[key]===choice);if(goal)setNeed(goal)}
  if(question<2)setQuestion(question+1);else setStage("contact");
 }
 function changeContact<K extends keyof Contact>(key:K,value:Contact[K]){setContact(previous=>({...previous,[key]:value}))}
 const chosenDate=date===null?null:dates[date];
 const slot=chosenDate?formatDate(chosenDate)+(time?" · "+time:""):"";
 const rows:[string,string][]=[
  ["Votre projet",answers[0]??""],["Votre échéance",answers[1]??""],["Votre budget",answers[2]??""],
  ["Photos ajoutées",photos.filter(Boolean).length+" / 3"],["Votre nom",contact.name],
  ["Contact préféré",contact.preference==="Email"?contact.email:contact.phone],["Créneau souhaité",slot]
 ];
 if(contact.message)rows.push(["Votre question",contact.message]);
 rows.push(["Rappels après confirmation",contact.reminders?"Souhaités":"Non souhaités"]);
 const recap=<dl className="recap-list">{rows.map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>;
 function download(){
  const lines=["ÉPURE — RÉCAPITULATIF DE DÉMONSTRATION","Aucune demande envoyée. Aucun rendez-vous réservé.","",...rows.map(([key,value])=>key+": "+value),"Téléphone: "+contact.phone,"Email: "+contact.email,"","Le créneau devra être vérifié et confirmé par la réception. Les photos ne sont pas incluses dans ce fichier."];
  const url=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");
  a.href=url;a.download="mon-projet-de-sourire.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <dialog ref={dialogRef} id="evaluation-dialog" className="evaluation-dialog" aria-labelledby="flow-title" onCancel={onClose} onClose={onClose}>
  <div className="flow-header"><button className="brand" type="button" style={{background:"none",padding:0}} aria-label="Fermer le parcours et revenir au site" onClick={onClose}>épure<span>.</span></button><span>UN PREMIER PAS, TOUT SIMPLEMENT</span><button type="button" className="close-dialog" id="close-flow" aria-label="Fermer le parcours" onClick={onClose}>×</button></div>
  <div className="flow-layout"><aside className="flow-aside"><p className="eyebrow">VOTRE ÉVALUATION</p><h2>Commençons<br/>par <em>vous.</em></h2><p>Quelques étapes pour préparer un échange qui vous ressemble.</p><ol id="flow-steps">{["Vos photos","Votre projet","Vos coordonnées","Votre créneau"].map((label,i)=><li key={label} className={i===phase?"active":i<phase?"complete":""} data-phase={i}><span>0{i+1}</span>{label}{i===0&&<small>Facultatif</small>}</li>)}</ol><div className="aside-note">Vous gardez le choix.<br/>Vous pouvez fermer et reprendre ce parcours pendant votre visite.</div></aside>
  <div className="flow-content"><div className="flow-status"><span id="flow-counter">{stage==="success"?"PARCOURS TERMINÉ":"ÉTAPE "+(phase+1)+" SUR 4"}</span><span id="flow-topic">{stage==="quiz"?"QUESTION "+(question+1)+" / 3":["VOS PHOTOS","VOTRE PROJET","VOS COORDONNÉES","VOTRE CRÉNEAU"][phase]}</span></div>
  <div id="flow-view" ref={viewRef}>
   {stage==="photos"&&<PhotoStep open={open} photos={photos} index={photoIndex} onIndex={setPhotoIndex} onPhoto={updatePhoto} onNext={()=>setStage("preview")} onSkip={()=>{clearPhotos();setPhotoIndex(0);setStage("quiz")}} onError={setError}/>}
   {stage==="preview"&&<div className="preview-flow"><h2>Un aperçu pour<br/><em>ouvrir la conversation.</em></h2><p className="flow-intro">Explorez une possibilité en déplaçant le curseur.</p><Comparison id="flow-range"/><p className="flow-note">Exemple fictif : cet aperçu n’est pas généré à partir de vos photos. Il ne constitue ni un diagnostic ni une prédiction de résultat.</p><div className="flow-cta-row"><button className="btn" type="button" id="preview-next" onClick={()=>setStage("quiz")}>Parler de mon projet <Arrow/></button></div></div>}
   {stage==="quiz"&&<>
    <div className="quiz-subprogress" aria-label={"Question "+(question+1)+" sur 3"}>{[0,1,2].map(i=><span key={i} className={i<=question?"active":""}/>)}</div>
    <h2>{["Qu’aimeriez-vous explorer ?","Quand aimeriez-vous avancer ?","Où en êtes-vous avec le budget ?"][question]}</h2>
    <p className="flow-intro">{["Choisissez ce qui correspond le mieux à votre projet.","Votre rythme compte. Il n’y a pas de bonne ou de mauvaise réponse.","Une indication pour préparer la discussion, sans vous engager."][question]}</p>
    <div className="quiz-options">{choices.map((choice,i)=><button className={"quiz-option "+(answers[question]===choice?"chosen":"")} type="button" key={choice} data-answer={i} aria-pressed={answers[question]===choice} onClick={()=>answer(choice)}><span>{choice}</span><span aria-hidden="true">↗</span></button>)}</div>
    <p className="flow-note">Vos réponses préparent l’échange. Elles ne déterminent pas votre admissibilité à un traitement.</p>
   </>}
   {stage==="contact"&&<>
    <h2>Comment pouvons-nous<br/><em>vous joindre ?</em></h2><p className="flow-intro">Quelques coordonnées pour préparer la suite de votre demande.</p>
    <form className="contact-form" id="contact-form" onSubmit={submitContact}>
     <label className="field">Votre nom<input name="name" autoComplete="name" required maxLength={80} placeholder="Prénom et nom" value={contact.name} onChange={event=>changeContact("name",event.target.value)}/></label>
     <div className="form-grid"><label className="field">Téléphone<input name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="514 555 0000" value={contact.phone} onChange={event=>changeContact("phone",event.target.value)}/></label><label className="field">Email<input name="email" type="email" autoComplete="email" maxLength={254} placeholder="vous@exemple.ca" value={contact.email} onChange={event=>changeContact("email",event.target.value)}/></label></div>
     <label className="field">Votre préférence de contact<select name="preference" value={contact.preference} onChange={event=>changeContact("preference",event.target.value as Contact["preference"])}>{["SMS","Email","Appel"].map(value=><option key={value}>{value}</option>)}</select></label>
     <label className="field">Une question à ajouter ? <span>(facultatif)</span><textarea name="message" maxLength={500} placeholder="Ce que vous aimeriez aborder pendant votre évaluation…" value={contact.message} onChange={event=>changeContact("message",event.target.value)}/></label>
     <label className="check-label"><input type="checkbox" name="consent" required checked={contact.consent} onChange={event=>changeContact("consent",event.target.checked)}/><span>J’accepte d’être contacté au sujet de ma demande. Le créneau souhaité devra être confirmé par l’équipe.</span></label>
     <label className="check-label"><input type="checkbox" name="reminders" checked={contact.reminders} onChange={event=>changeContact("reminders",event.target.checked)}/><span>Je souhaite recevoir les rappels de mon rendez-vous une fois confirmé.</span></label>
     <p className="flow-note">Site modèle : vos réponses restent dans cette session. Aucun message n’est envoyé et aucune donnée n’est conservée après rechargement.</p>
     <button type="submit" className="btn">Choisir mon créneau <Arrow/></button>
    </form>
   </>}
   {stage==="booking"&&<>
    <h2>Un moment<br/><em>qui vous convient.</em></h2><p className="flow-intro">Proposez un créneau pour votre évaluation. La réception devra ensuite vérifier le planning et vous confirmer le rendez-vous.</p>
    <span className="booking-demo">Créneaux illustratifs · aucune réservation réelle</span>
    <div className="date-navigation"><strong>{dates[week*5]?.toLocaleDateString("fr-CA",{month:"long",year:"numeric"})}</strong><div><button type="button" id="week-prev" disabled={week===0} aria-label="Dates précédentes" onClick={()=>setWeek(week-1)}>‹</button><button type="button" id="week-next" disabled={week===2} aria-label="Dates suivantes" onClick={()=>setWeek(week+1)}>›</button></div></div>
    <div className="date-options">{dates.slice(week*5,week*5+5).map((day,i)=>{const index=week*5+i;return <button type="button" className={"date-button "+(date===index?"chosen":"")} data-date={index} key={day.toISOString()} aria-pressed={date===index} onClick={()=>{setDate(index);setTime(null)}}><span>{day.toLocaleDateString("fr-CA",{weekday:"short"})}</span><strong>{day.getDate()}</strong><span>{day.toLocaleDateString("fr-CA",{month:"short"})}</span></button>})}</div>
    <p className="time-label">VOTRE PRÉFÉRENCE HORAIRE</p><div className="time-options">{times.map(hour=><button key={hour} type="button" className={"time-button "+(time===hour?"chosen":"")} data-time={hour} disabled={date===null} aria-pressed={time===hour} onClick={()=>setTime(hour)}>{hour}</button>)}</div>
    <p className="slot-summary">{chosenDate?<><strong>{formatDate(chosenDate)}</strong>{time?" · "+time:" · choisissez une heure"}</>:"Choisissez un jour pour découvrir les heures."}</p>
    <p className="booking-note">Le choix d’un créneau est une demande. Le rendez-vous est confirmé uniquement après validation par la réception.</p>
    <div className="flow-cta-row"><button type="button" className="btn" id="booking-next" disabled={date===null||!time} onClick={()=>setStage("recap")}>Vérifier ma demande <Arrow/></button></div>
   </>}
   {stage==="recap"&&<><h2>Votre projet,<br/><em>en quelques mots.</em></h2><p className="flow-intro">Vérifiez votre demande avant de terminer le parcours.</p>{recap}<p className="recap-small">Le créneau devra être confirmé par la réception. Dans cette démonstration, aucune demande n’est transmise et aucun rendez-vous n’est réservé.</p><div className="flow-cta-row"><button type="button" className="btn" id="finish-request" onClick={()=>setStage("success")}>Terminer ma demande simulée <Arrow/></button><button type="button" className="text-button" id="edit-contact" onClick={()=>setStage("contact")}>Modifier mes coordonnées</button></div></>}
   {stage==="success"&&<div className="success-view"><span className="success-symbol" aria-hidden="true">✓</span><h2>Votre premier pas<br/><em>est fait.</em></h2><span className="success-status">Demande simulée · aucun rendez-vous réservé</span><p>Votre récapitulatif est prêt. Vous pouvez le conserver pour préparer une conversation avec le cabinet.</p>{recap}<div className="flow-cta-row"><button type="button" className="btn" id="download-summary" onClick={download}>Conserver mon récapitulatif <Arrow/></button><button type="button" className="text-button" id="restart-flow" onClick={restart}>Recommencer le parcours</button></div><div className="success-next"><strong>La prochaine étape, dans le parcours prévu :</strong><br/>La réception vérifie la demande et confirme le rendez-vous ou propose un autre créneau. Les rappels interviennent après cette confirmation.</div></div>}
  </div>
  {error&&<p id="flow-error" role="alert">{error}</p>}
  <div className="flow-bottom"><button className="text-button" id="flow-back" type="button" hidden={stage==="success"||(stage==="photos"&&photoIndex===0)} onClick={back}>← Retour</button><span>Démonstration · aucune donnée envoyée</span></div>
 </div></div>
 </dialog>;
}
