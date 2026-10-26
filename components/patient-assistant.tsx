"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {assistantActions,guidedAnswer,introFor,redactContactDetails,serviceChips,triage,triageChips,type AssistantAction,type AssistantReply,type LeadState} from "@/lib/assistant";
import type {Goal} from "@/lib/journey";
import {useJourney} from "./journey-context";
import "./patient-assistant.css";
type Message={id:number;role:"user"|"assistant";text:string;actions?:AssistantAction[];chips?:string[]};
const teaserKey="epure-assistant-teaser";
function ChatIcon(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 11h.01M11 11h.01M15 11h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
const welcomeFor=(pathname:string):Message=>({id:0,role:"assistant",text:introFor(pathname).welcome,chips:triageChips});
function safeStorage(action:"get"|"set"){try{if(action==="get")return window.sessionStorage.getItem(teaserKey);window.sessionStorage.setItem(teaserKey,"1")}catch{}return null}
export function PatientAssistant(){
 const pathname=usePathname();const {start}=useJourney();
 const dialog=useRef<HTMLDialogElement>(null),input=useRef<HTMLInputElement>(null),list=useRef<HTMLDivElement>(null),launcher=useRef<HTMLButtonElement>(null),controller=useRef<AbortController|null>(null),serial=useRef(0);
 const [open,setOpen]=useState(false),[messages,setMessages]=useState<Message[]>(()=>[welcomeFor(pathname)]),[question,setQuestion]=useState(""),[ready,setReady]=useState(false),[checking,setChecking]=useState(true),[consent,setConsent]=useState(false),[pending,setPending]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState(""),[teaser,setTeaser]=useState(false),[badge,setBadge]=useState(false),[lead,setLead]=useState<LeadState|null>(null);
 const intro=introFor(pathname);
 const last=messages.at(-1);
 const chips=!busy&&!pending&&last?.role==="assistant"?last.chips??[]:[];
 useEffect(()=>{const abort=new AbortController();fetch("/api/chat/status.json",{signal:abort.signal,cache:"no-store"}).then(r=>r.ok?r.json():null).then(data=>setReady(data?.ready===true)).catch(()=>{}).finally(()=>setChecking(false));return()=>{abort.abort();controller.current?.abort()}},[]);
 useEffect(()=>{list.current?.scrollTo({top:list.current.scrollHeight,behavior:"instant"})},[messages,busy,pending]);
 // Phones: the chat is a full-screen sheet that follows the visible area, so the on-screen keyboard never shifts or hides it.
 useEffect(()=>{
  if(!open)return;
  const vv=window.visualViewport,root=document.documentElement,phone=window.matchMedia("(max-width:700px)");
  const sync=()=>{
   if(!vv||!phone.matches){root.style.removeProperty("--chat-vh");root.style.removeProperty("--chat-top");return}
   root.style.setProperty("--chat-vh",vv.height+"px");root.style.setProperty("--chat-top",vv.offsetTop+"px");
   list.current?.scrollTo({top:list.current.scrollHeight,behavior:"instant"});
  };
  sync();root.classList.add("chat-open");
  vv?.addEventListener("resize",sync);vv?.addEventListener("scroll",sync);
  return()=>{vv?.removeEventListener("resize",sync);vv?.removeEventListener("scroll",sync);root.classList.remove("chat-open");root.style.removeProperty("--chat-vh");root.style.removeProperty("--chat-top")};
 },[open]);
 useEffect(()=>{if(dialog.current?.open){dialog.current.close();setOpen(false)}setTeaser(false);setMessages(current=>current.length===1&&current[0].id===0?[welcomeFor(pathname)]:current)},[pathname]);
 useEffect(()=>{
  if(open||safeStorage("get"))return;
  const badgeTimer=window.setTimeout(()=>{if(!safeStorage("get"))setBadge(true)},3000);
  const teaserTimer=window.setTimeout(()=>{if(!safeStorage("get"))setTeaser(true)},6000);
  return()=>{window.clearTimeout(badgeTimer);window.clearTimeout(teaserTimer)};
 },[open,pathname]);
 function dismissTeaser(){setTeaser(false);safeStorage("set")}
 function acknowledge(){setBadge(false);dismissTeaser()}
 function show(){acknowledge();dialog.current?.show();setOpen(true);if(!window.matchMedia("(pointer:coarse)").matches)window.setTimeout(()=>input.current?.focus({preventScroll:true}),50)}
 function close(){dialog.current?.close();setOpen(false);launcher.current?.focus({preventScroll:true})}
 function reset(){serial.current++;controller.current?.abort();setBusy(false);setLead(null);setMessages([welcomeFor(pathname)]);setQuestion("");setPending("");setError("")}
 function emergency(){close();window.dispatchEvent(new Event("epure:open-emergency"))}
 function launch(goal?:Goal){close();start(goal,{prefill:!!goal})}
 function say(user:string,reply:Omit<Message,"id"|"role">){const id=++serial.current*2;setMessages(current=>[...current.map(m=>({...m,chips:undefined})),{id:id-1,role:"user",text:user},{id,role:"assistant",...reply}])}
 function pick(label:string){
  if(label===triage.book){say(label,{text:"Très bien. La demande prend environ 2 minutes, sans engagement : rien n’est confirmé tant que la réception ne l’a pas validée."});launch();return}
  if(label===triage.problem){say(label,{text:"Décrivez-moi ce qui vous gêne ou votre question, je vous oriente vers le bon soin."});input.current?.focus();return}
  if(label===triage.service){say(label,{text:"Quel soin vous intéresse ?",chips:Object.keys(serviceChips)});return}
  void send(serviceChips[label]??label);
 }
 async function send(value:string,consented=consent){
  const text=value.trim();if(!text||busy)return;
  const guided=guidedAnswer(text);
  if(ready&&!consented&&!guided.actions.includes("emergency")){setPending(text);setQuestion("");setError("");return}
  setError("");setPending("");setQuestion("");const id=++serial.current;const next=[...messages.map(m=>({...m,chips:undefined})),{id:id*2-1,role:"user" as const,text}];setMessages(next);
  if(!ready||guided.actions.includes("emergency")){window.setTimeout(()=>{if(id===serial.current)setMessages([...next,{id:id*2,role:"assistant",text:guided.text,actions:guided.actions,chips:guided.chips}])},350);return}
  setBusy(true);const abort=new AbortController();controller.current=abort;const timer=setTimeout(()=>abort.abort(),25000);
  try{
   const response=await fetch("/api/chat/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({consent:true,page:pathname,state:lead??undefined,messages:next.filter(m=>m.id!==0).slice(-11).map(m=>({role:m.role,content:redactContactDetails(m.text)}))}),signal:abort.signal});
   if(!response.ok)throw new Error(response.status===429?"Vous avez envoyé plusieurs messages. Patientez un moment avant de réessayer.":response.status===503?"La discussion est momentanément indisponible. Réessayez dans un instant.":"La réponse n’a pas pu être reçue. Réessayez dans un instant.");
   const result:AssistantReply=await response.json();if(typeof result.text!=="string"||!result.text.trim())throw new Error("La réponse est incomplète. Réessayez.");
   if(id===serial.current&&result.state)setLead(result.state);
   if(id===serial.current)setMessages([...next,{id:id*2,role:"assistant",text:result.text,actions:Array.isArray(result.actions)?result.actions.filter(a=>Object.hasOwn(assistantActions,a)).slice(0,2):[]}]);
  }catch(cause){if(id===serial.current){setError(cause instanceof Error&&cause.name!=="AbortError"?cause.message:"La réponse prend trop de temps. Réessayez.");setQuestion(text)}}finally{clearTimeout(timer);if(id===serial.current)setBusy(false)}
 }
 function accept(){setConsent(true);const text=pending;setPending("");if(text)void send(text,true)}
 function submit(event:FormEvent){event.preventDefault();void send(question)}
 return <>
 {teaser&&!open&&<div className="chat-teaser" role="status"><span className="chat-teaser-avatar" aria-hidden="true">é</span><button type="button" className="chat-teaser-open" onClick={show}>{intro.teaser}</button><button type="button" className="chat-teaser-close" aria-label="Masquer" onClick={acknowledge}>×</button></div>}
 <button ref={launcher} type="button" className={"chat-launcher"+(badge?" has-badge":"")} aria-label={badge?"Ouvrir la discussion, 1 nouveau message":"Ouvrir la discussion"} aria-haspopup="dialog" aria-controls="patient-assistant" aria-expanded={open} onClick={show}><ChatIcon/>{badge&&<i className="chat-badge" aria-hidden="true">1</i>}</button>
 <dialog ref={dialog} className="chat" id="patient-assistant" aria-labelledby="assistant-title" onKeyDown={e=>{if(e.key==="Escape"){e.preventDefault();close()}}} onClose={()=>setOpen(false)}>
  <header className="chat-header"><span className="chat-avatar">é</span><div><h2 id="assistant-title">Assistant Épure</h2><p><i/>{checking?"Connexion…":"En ligne"}</p></div><button type="button" className="chat-icon-btn" aria-label="Recommencer la conversation" onClick={reset}>↺</button><button type="button" className="chat-icon-btn chat-close" aria-label="Fermer la discussion" onClick={close}>×</button></header>
  <div ref={list} className="chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" aria-busy={busy}>
   {messages.map(message=><div key={message.id} className={`chat-row ${message.role}`}><div className="chat-bubble">{message.text}</div>{message.actions&&message.actions.length>0&&<div className="chat-actions">{message.actions.map(action=>{const config=assistantActions[action];const cls=config.primary?"chat-btn primary":"chat-btn";return config.goal?<button key={action} type="button" className={cls} data-assistant-action={action} onClick={()=>launch(config.goal)}>{config.label}</button>:config.href?<Link key={action} href={config.href} className={cls} data-assistant-action={action} onClick={close}>{config.label}</Link>:<button key={action} type="button" className={cls} onClick={emergency}>{config.label}</button>})}</div>}</div>)}
   {busy&&<div className="chat-row assistant" role="status" aria-label="L’assistant écrit"><div className="chat-bubble chat-typing"><i/><i/><i/></div></div>}
   {pending&&<div className="chat-row assistant"><div className="chat-bubble">Pour répondre, vos messages sont envoyés à OpenAI. Évitez les données personnelles ou médicales.<div className="chat-actions"><button type="button" className="chat-btn primary" onClick={accept}>OK, continuer</button><button type="button" className="chat-btn" onClick={()=>setPending("")}>Annuler</button></div></div></div>}
   {chips.length>0&&<div className="chat-chips" aria-label="Choix rapides">{chips.map(label=><button key={label} type="button" disabled={checking||busy} onClick={()=>pick(label)}>{label}</button>)}</div>}
  </div>
  {error&&<p className="chat-error" role="alert">{error}</p>}
  <form className="chat-form" onSubmit={submit}><label className="chat-sr" htmlFor="assistant-question">Votre message</label><input ref={input} id="assistant-question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={1000} autoComplete="off" placeholder="Écrivez votre message…" disabled={busy||checking}/><button type="submit" disabled={!question.trim()||busy||checking} aria-label="Envoyer">↑</button></form>
  <p className="chat-foot">Sans diagnostic. <button type="button" onClick={emergency}>Urgence ?</button></p>
 </dialog>
 </>;
}
