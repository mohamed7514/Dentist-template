"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {assistantActions,assistantSuggestions,guidedAnswer,redactContactDetails,type AssistantAction,type AssistantReply} from "@/lib/assistant";
import "./patient-assistant.css";
type Message={id:number;role:"user"|"assistant";text:string;actions?:AssistantAction[];source?:"guide"|"ai"};
const welcome:Message={id:0,role:"assistant",text:"Bonjour, je suis l’assistant Épure. Je vous aide à explorer les soins et à préparer votre première visite. Qu’aimeriez-vous savoir ?"};
function ChatIcon(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 11h.01M11 11h.01M15 11h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
export function PatientAssistant(){
 const pathname=usePathname();const dialog=useRef<HTMLDialogElement>(null),input=useRef<HTMLInputElement>(null),list=useRef<HTMLDivElement>(null),launcher=useRef<HTMLButtonElement>(null),controller=useRef<AbortController|null>(null),serial=useRef(0);
 const [open,setOpen]=useState(false),[messages,setMessages]=useState<Message[]>([welcome]),[question,setQuestion]=useState(""),[ready,setReady]=useState(false),[checking,setChecking]=useState(true),[consent,setConsent]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
 useEffect(()=>{const abort=new AbortController();fetch("/api/chat/status.json",{signal:abort.signal,cache:"no-store"}).then(r=>r.ok?r.json():null).then(data=>setReady(data?.ready===true)).catch(()=>{}).finally(()=>setChecking(false));return()=>{abort.abort();controller.current?.abort()}},[]);
 useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=previous}},[open]);
 useEffect(()=>{list.current?.scrollTo({top:list.current.scrollHeight,behavior:"instant"})},[messages,busy]);
 useEffect(()=>{if(dialog.current?.open){dialog.current.close();setOpen(false)}},[pathname]);
 function show(){dialog.current?.showModal();setOpen(true)}
 function close(){dialog.current?.close();setOpen(false);launcher.current?.focus({preventScroll:true})}
 function reset(){serial.current++;controller.current?.abort();setBusy(false);setMessages([welcome]);setQuestion("");setError("");input.current?.focus()}
 function emergency(){close();window.dispatchEvent(new Event("epure:open-emergency"))}
 async function send(value:string){
  const text=value.trim();if(!text||busy)return;
  const guided=guidedAnswer(text,messages.filter(m=>m.role==="user").at(-1)?.text);
  if(ready&&!consent&&!guided.actions.includes("emergency")){setError("Avant de discuter avec l’IA, confirmez l’envoi de vos messages à OpenAI ci-dessous.");return}
  setError("");setQuestion("");const id=++serial.current;const next=[...messages,{id:id*2-1,role:"user" as const,text}];setMessages(next);
  if(!ready||guided.actions.includes("emergency")){setMessages([...next,{id:id*2,role:"assistant",...guided}]);return}
  setBusy(true);const abort=new AbortController();controller.current=abort;const timer=setTimeout(()=>abort.abort(),25000);
  try{
   const response=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({consent:true,page:pathname,messages:next.filter(m=>m.id!==0).slice(-11).map(m=>({role:m.role,content:redactContactDetails(m.text)}))}),signal:abort.signal});
   if(!response.ok)throw new Error(response.status===429?"Vous avez envoyé plusieurs messages. Patientez un moment avant de réessayer.":response.status===503?"La discussion IA est momentanément indisponible. Vous pouvez continuer avec les accès directs.":"La réponse n’a pas pu être reçue. Réessayez dans un instant.");
   const result:AssistantReply=await response.json();if(typeof result.text!=="string"||!result.text.trim())throw new Error("La réponse est incomplète. Réessayez.");
   if(id===serial.current)setMessages([...next,{id:id*2,role:"assistant",text:result.text,actions:Array.isArray(result.actions)?result.actions.filter(a=>Object.hasOwn(assistantActions,a)):[],source:result.source==="guide"?"guide":"ai"}]);
  }catch(cause){if(id===serial.current){setError(cause instanceof Error&&cause.name!=="AbortError"?cause.message:"La réponse prend trop de temps. Réessayez ou utilisez les accès directs.");setQuestion(text)}}finally{clearTimeout(timer);if(id===serial.current)setBusy(false)}
 }
 function submit(event:FormEvent){event.preventDefault();void send(question)}
 return <>
 <button ref={launcher} type="button" className="assistant-launcher" aria-haspopup="dialog" aria-controls="patient-assistant" aria-expanded={open} onClick={show}><span><ChatIcon/></span><span>Une question ?<small>Parlons de votre sourire</small></span><i aria-hidden="true">↗</i></button>
 <dialog ref={dialog} className="patient-assistant" id="patient-assistant" aria-labelledby="assistant-title" onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)}>
  <header className="assistant-header"><span className="assistant-mark">é.</span><div><h2 id="assistant-title">Votre assistant Épure</h2><p><i/>{checking?"Connexion…":ready?"Assistant IA · OpenAI":"Guide interactif · IA à activer"}</p></div><button type="button" className="assistant-close" aria-label="Fermer la discussion" onClick={close}>×</button></header>
  <div className="assistant-toolbar"><span>Un premier pas, à votre rythme.</span><button type="button" onClick={reset} aria-label="Effacer la conversation">Recommencer ↺</button></div>
  <div ref={list} className="assistant-messages" role="log" aria-label="Conversation avec l’assistant" aria-live="polite" aria-relevant="additions" aria-busy={busy}>
   {messages.map(message=><article key={message.id} className={`assistant-message ${message.role}`}><span className="assistant-speaker">{message.role==="user"?"Vous":message.source==="guide"?"Guide Épure":message.source==="ai"?"Assistant IA":"Épure"}</span><p>{message.text}</p>{message.actions&&<div className="assistant-links">{message.actions.map(action=>assistantActions[action].href?<Link key={action} href={assistantActions[action].href!} onClick={close}>{assistantActions[action].label} <span>↗</span></Link>:<button key={action} type="button" onClick={emergency}>{assistantActions[action].label} <span>↗</span></button>)}</div>}</article>)}
   {busy&&<div className="assistant-typing" role="status">L’assistant prépare sa réponse<span aria-hidden="true"> ● ● ●</span></div>}
   {messages.length===1&&<div className="assistant-suggestions" aria-label="Suggestions de questions">{assistantSuggestions.map(s=><button key={s} type="button" disabled={checking||busy} onClick={()=>void send(s)}>{s}<span>↗</span></button>)}</div>}
  </div>
  <div className="assistant-composer">
   {error&&<p className="assistant-error" role="alert">{error}</p>}
   {ready&&<label className="assistant-consent"><input type="checkbox" checked={consent} onChange={e=>{setConsent(e.target.checked);setError("")}}/>J’accepte l’envoi de mes messages à OpenAI pour obtenir une réponse.</label>}
   {!ready&&!checking&&<p className="assistant-mode-note">Réponses guidées disponibles. La conversation IA attend son activation.</p>}
   <form onSubmit={submit}><label className="assistant-input-label" htmlFor="assistant-question">Votre question</label><input ref={input} id="assistant-question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={1000} autoComplete="off" placeholder="Comment peut-on vous aider ?" disabled={busy||checking}/><button type="submit" disabled={!question.trim()||busy||checking} aria-label="Envoyer ma question">↑</button></form>
   <div className="assistant-footer"><span>Sans diagnostic. Ne partagez pas de données sensibles.</span><button type="button" onClick={emergency}>Une urgence ?</button></div>
   <details className="assistant-privacy"><summary>Vos messages et votre confidentialité</summary><p>La conversation reste en mémoire dans cet onglet et s’efface au rechargement. En mode IA, les derniers messages sont transmis au serveur puis à OpenAI, après votre accord. Les photos et le formulaire de rendez-vous ne sont pas transmis au chatbot. Évitez les noms, coordonnées et informations médicales personnelles. Épure est une clinique fictive ; aucune réservation réelle n’est effectuée.</p></details>
  </div>
 </dialog>
 </>;
}
