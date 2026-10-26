"use client";

import Link from "./locale-link";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {Arrow} from "./icons";
import {usePhotoSession} from "./photo-session";
import {GuidedPhotos} from "./photo-capture";
import {useLocale} from "./locale-provider";
import {getServices} from "@/lib/services";
import {booking,budgetKeys,insuranceKeys,needKeys,periodKeys,timingKeys} from "@/lib/i18n/dict/booking";
import {rich} from "@/lib/i18n/rich";
import {useBookingSession,type BookingDraft} from "./booking-session";
import "./booking-journey.css";

type Option={key:string;label:string};
const zip=(keys:readonly string[],labels:readonly string[]):Option[]=>keys.map((key,index)=>({key,label:labels[index]}));

function localDate(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}
function openEmergency(){window.dispatchEvent(new Event("epure:open-emergency"))}

function JourneyIcon({kind=0}:{kind?:number}){
 return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">{kind===5?<path d="m10 5 3 6-3 3a17 17 0 0 0 8 8l3-3 6 3v4c0 2-2 3-4 2C11 26 6 21 4 9c-1-2 0-4 2-4h4Z"/>:kind===1?<><path d="M16 3c0 8-5 13-13 13 8 0 13 5 13 13 0-8 5-13 13-13C21 16 16 11 16 3Z"/><path d="M26 3v6m-3-3h6"/></>:kind===3?<><rect x="5" y="7" width="22" height="21" rx="3"/><path d="M5 14h22M10 4v6m12-6v6m-12 9h4m4 0h4m-12 5h4"/></>:kind===4?<><path d="M11 11a5 5 0 1 1 10 0c0 4-5 4-5 7"/><path d="M16 24h.01"/><circle cx="16" cy="16" r="13"/></>:<><path d="M16 7c-5-5-13-2-11 6 1 4 2 15 6 15 3 0 2-10 5-10s2 10 5 10c4 0 5-11 6-15 2-8-6-11-11-6Z"/>{kind===2?<path d="M8 13h16m-13-2v4m10-4v4"/>:<path d="m13 7 3 2 3-2"/>}</>}</svg>;
}

function Calendar({value,minimum,onChange}:{value:string;minimum:string;onChange:(value:string)=>void}){
 const t=booking[useLocale()];
 const [month,setMonth]=useState("");
 useEffect(()=>{setMonth((value||minimum).slice(0,7))},[minimum]); // Retain the browsed month until the minimum date is known.
 if(!month)return <div className="booking-calendar-loading" aria-busy="true">{t.calendarLoading}</div>;
 const [year,number]=month.split("-").map(Number);
 const first=new Date(year,number-1,1,12);
 const offset=(first.getDay()+6)%7;
 const length=new Date(year,number,0).getDate();
 const label=first.toLocaleDateString(t.dateLocale,{month:"long",year:"numeric"});
 const dayLabel=(date:string)=>new Date(date+"T12:00:00").toLocaleDateString(t.dateLocale,{weekday:"long",day:"numeric",month:"long"});
 function move(delta:number){setMonth(localDate(new Date(year,number-1+delta,1,12)).slice(0,7))}
 return <div className="booking-calendar"><div className="booking-calendar-top"><button type="button" aria-label={t.previousMonth} disabled={month<=minimum.slice(0,7)} onClick={()=>move(-1)}>←</button><span aria-live="polite">{label}</span><button type="button" aria-label={t.nextMonth} onClick={()=>move(1)}>→</button></div><div className="booking-weekdays" aria-hidden="true">{t.weekdays.map((day,index)=><span key={index}>{day}</span>)}</div><div className="booking-days" role="group" aria-label={t.preferredDates(label)}>{Array.from({length:offset},(_,index)=><span key={`empty-${index}`}/>)}{Array.from({length},(_,index)=>{const date=`${month}-${String(index+1).padStart(2,"0")}`;return <button key={date} type="button" data-date={date} aria-label={dayLabel(date)} aria-pressed={value===date} disabled={date<minimum} className={value===date?"selected":""} onClick={()=>onChange(date)}>{index+1}</button>})}</div></div>;
}

export function BookingJourney(){
 const locale=useLocale();const t=booking[locale];
 const {step,setStep,draft,setDraft}=useBookingSession();
 const {photos,replace,clear}=usePhotoSession();
 const [photoStage,setPhotoStage]=useState(false);
 const [minimum,setMinimum]=useState("");
 const [error,setError]=useState("");
 const [editing,setEditing]=useState(false);
 const card=useRef<HTMLElement>(null);
 const heading=useRef<HTMLHeadingElement>(null);
 const interacted=useRef(false);
 const group=step<=3?0:step===4?1:step===5?2:3;
 const needs=zip(needKeys,getServices(locale).map(service=>service.name));
 const timings=zip(timingKeys,t.timings),insurances=zip(insuranceKeys,t.insurances),budgets=zip(budgetKeys,t.budgets),periods=zip(periodKeys,t.periods);
 const labelOf=(options:Option[],key:string)=>options.find(option=>option.key===key)?.label??"";
 const displayDate=(value:string)=>value?new Date(value+"T12:00:00").toLocaleDateString(t.dateLocale,{weekday:"long",day:"numeric",month:"long"}):t.dateToChoose;
 useEffect(()=>{const today=new Date().toLocaleDateString("en-CA",{timeZone:"America/Toronto"});const tomorrow=new Date(today+"T12:00:00");tomorrow.setDate(tomorrow.getDate()+1);setMinimum(localDate(tomorrow))},[]);
 useEffect(()=>{
  if(!interacted.current)return;
  heading.current?.focus({preventScroll:true});
  if(card.current&&card.current.getBoundingClientRect().top<70)card.current.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth",block:"start"});
 },[step]);
 function update(key:keyof BookingDraft,value:string){setDraft(current=>({...current,[key]:value}));setError("")}
 function go(next:number){interacted.current=true;setError("");setStep(next)}
 function answer(key:keyof BookingDraft,value:string){update(key,value);if(key==="need"&&!editing){interacted.current=true;setPhotoStage(true);return}go(editing?6:step+1);setEditing(false)}
 function finishPhotos(){setPhotoStage(false);go(1)}
 function edit(next:number){setEditing(true);go(next)}
 function back(){if(photoStage){setPhotoStage(false);return}setEditing(false);go(editing?6:step-1)}
 function advance(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(step===4&&(!draft.date||draft.date<minimum||!draft.period)){setError(t.errorDay);return}
  if(step===5){
   const digits=draft.phone.replace(/\D/g,"");
   if(!draft.firstName.trim()||!draft.lastName.trim()){setError(t.errorName);return}
   if(!/^\+?[\d().\s-]+$/.test(draft.phone.trim())||!/^(?:1)?\d{10}$/.test(digits)||(draft.phone.trim().startsWith("+")&&!(digits.length===11&&digits.startsWith("1")))){setError(t.errorPhone);return}
  }
  if(step===6&&(!draft.need||!draft.timing||!draft.date||draft.date<minimum||!draft.period||!draft.firstName.trim()||!draft.lastName.trim()||!draft.phone)){setError(t.errorIncomplete);return}
  go(editing?6:step+1);setEditing(false);
 }
 function choice(options:Option[],key:keyof BookingDraft){return <div className={`booking-options${key==="need"?" booking-options-needs":""}`} role="group" aria-label={t.titles[step]}>{options.map((option,index)=><button type="button" className={`booking-option${draft[key]===option.key?" is-selected":""}`} key={option.key} data-answer={option.key} aria-pressed={draft[key]===option.key} onClick={()=>answer(key,option.key)}>{key==="need"&&<span className="booking-option-icon"><JourneyIcon kind={index}/></span>}<span>{option.label}</span><Arrow/></button>)}</div>}
 const periodLabel=labelOf(periods,draft.period);
 return <div className="booking-container">
  <article className={`booking-card${step===-1?" booking-card-entry":""}`} ref={card}>
   {step>=0&&step<7&&<div className="booking-navigation"><div><button type="button" className="booking-back" data-booking-back onClick={back}>{t.back}</button><span>{group+1}/4 <b>· {t.stages[group]}</b></span></div><div className="booking-progress" role="progressbar" aria-label={t.stages[group]} aria-valuemin={1} aria-valuemax={4} aria-valuenow={group+1}>{t.stages.map((label,index)=><span key={label} className={index<=group?"active":""}/>)}</div></div>}
   <div className="booking-stage" key={step}>
    {step===-1?<>
     <h1 ref={heading} tabIndex={-1}>{rich(t.entryTitle)}</h1>
     <div className="booking-entry"><button type="button" data-booking-consultation onClick={()=>go(0)}><span className="booking-entry-icon"><JourneyIcon/></span><strong>{t.consultation}</strong><span className="booking-entry-action">{t.start} <Arrow/></span></button><button type="button" data-booking-urgent onClick={openEmergency}><span className="booking-entry-icon"><JourneyIcon kind={5}/></span><strong>{t.urgent}</strong><span className="booking-entry-action">{t.seeContacts} <Arrow/></span></button></div>
    </>:step===7?<div className="booking-complete"><span className="booking-complete-icon" aria-hidden="true">✓</span><h1 ref={heading} tabIndex={-1}>{rich(t.sentTitle)}</h1><div className="booking-complete-date"><strong>{displayDate(draft.date)}</strong><span>{periodLabel}</span></div><p className="booking-confirmation-note">{t.sentNote}</p><Link href="/" className="booking-primary">{t.backToSite} <Arrow/></Link><button type="button" className="booking-text-button" onClick={()=>go(6)}>{t.review}</button></div>:<>
     <h1 ref={heading} tabIndex={-1}>{step===0&&photoStage?t.photosTitle:t.titles[step]}</h1>
     {step===0&&photoStage?<GuidedPhotos embedded photos={photos} replace={replace} clear={clear} onFinish={finishPhotos} onSkip={()=>{clear();finishPhotos()}}/>:step===0?choice(needs,"need"):step===1?choice(timings,"timing"):step===2?choice(insurances,"insurance"):step===3?<>{choice(budgets,"budget")}<button type="button" className="booking-skip" onClick={()=>answer("budget","")}>{t.skip} <Arrow/></button></>:<form onSubmit={advance} onInvalidCapture={event=>{if(event.target instanceof HTMLElement)event.target.closest("details")?.setAttribute("open","")}}>
      {step===4?<div className="booking-date-choice"><Calendar value={draft.date} minimum={minimum} onChange={value=>update("date",value)}/><fieldset className="booking-periods" aria-label={t.periodAria}><div>{periods.map(period=><label key={period.key} className={draft.period===period.key?"selected":""}><input type="radio" name="period" value={period.key} checked={draft.period===period.key} onChange={()=>update("period",period.key)}/>{period.label}</label>)}</div></fieldset><p className="booking-date-summary" aria-live="polite">{draft.date?`${displayDate(draft.date)}${draft.period?` · ${periodLabel}`:""}`:t.chooseDay}</p></div>:step===5?<>
       <div className="booking-fields"><label>{t.firstName}<input name="firstName" autoComplete="given-name" maxLength={80} required value={draft.firstName} onChange={event=>update("firstName",event.target.value)}/></label><label>{t.lastName}<input name="lastName" autoComplete="family-name" maxLength={80} required value={draft.lastName} onChange={event=>update("lastName",event.target.value)}/></label><label className="booking-field-wide">{t.phone}<input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={25} required placeholder="514 555-0123" value={draft.phone} onChange={event=>update("phone",event.target.value)}/></label></div>
       <details className="booking-extra" open={!!draft.email||!!draft.note||undefined}><summary>{t.emailOrQuestion} <span>{t.optional}</span></summary><div className="booking-fields"><label className="booking-field-wide">{t.email}<input name="email" type="email" autoComplete="email" maxLength={254} value={draft.email} onChange={event=>update("email",event.target.value)}/></label><label className="booking-field-wide">{t.question}<textarea name="note" rows={2} maxLength={500} value={draft.note} onChange={event=>update("note",event.target.value)}/></label></div></details>
      </>:<>
       <div className="booking-recap"><section><div><span>{t.recapNeed}</span><button type="button" onClick={()=>edit(0)}>{t.edit}</button></div><strong>{labelOf(needs,draft.need)}</strong><p>{labelOf(timings,draft.timing)}</p><div className="booking-budget-recap"><span>{t.budgetLabel}{labelOf(budgets,draft.budget)||t.budgetTbd}</span><button type="button" onClick={()=>edit(3)}>{t.edit}</button></div><div className="booking-budget-recap"><span>{t.insuranceLabel}{labelOf(insurances,draft.insurance)||t.insuranceTbd}</span><button type="button" onClick={()=>edit(2)}>{t.edit}</button></div><button type="button" className="booking-edit-timing" onClick={()=>edit(1)}>{t.edit}</button></section><section><div><span>{t.recapPreference}</span><button type="button" onClick={()=>edit(4)}>{t.edit}</button></div><strong>{displayDate(draft.date)}</strong><p>{periodLabel}</p></section><section><div><span>{t.recapContact}</span><button type="button" onClick={()=>edit(5)}>{t.edit}</button></div><strong>{draft.firstName.trim()} {draft.lastName.trim()}</strong><p>{draft.phone}</p>{draft.email&&<p>{draft.email}</p>}{draft.note&&<p className="booking-recap-note">{draft.note}</p>}</section></div>
      </>}
      {error&&<p className="booking-error" role="alert">{error}</p>}
      <div className="booking-actions"><button className="booking-primary" type="submit" disabled={step===4&&(!draft.date||!draft.period||draft.date<minimum)}>{editing?t.save:step===6?t.submit:t.next}<Arrow/></button></div>
     </form>}
    </>}
   </div>
  </article>
  <div className="booking-bottom"><p><span aria-hidden="true">◌</span> {t.demoNote}</p>{step>=0&&step<7&&<button type="button" onClick={openEmergency}>{t.askUrgent}</button>}</div>
 </div>;
}
