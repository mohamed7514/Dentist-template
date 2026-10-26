"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import Link from "next/link";
import {Arrow} from "./icons";
import {usePhotoSession,type PreparedPhoto} from "./photo-session";
import "./photo-flow.css";

const guides=[
 {label:"Sourire de face",short:"De face",title:"Votre sourire, de face.",hint:"Placez votre visage dans le contour et souriez."},
 {label:"Dents de près",short:"De près",title:"Un peu plus près.",hint:"Rapprochez le téléphone : vos dents dans le contour."},
 {label:"Profil",short:"Profil",title:"Un profil, si vous voulez.",hint:"Tournez la tête de côté, visage dans le contour."},
];

// Drawings on a 300x400 canvas. `outline` is one closed silhouette (the window kept clear in the camera overlay); `lines` are the facial details.
const shapes=[
 { // smiling face, front
  outline:"M22 400C26 354 64 330 112 316L118 284C100 272 84 252 78 226C68 228 58 218 58 200C58 184 66 176 76 178C78 118 106 72 150 72C194 72 222 118 224 178C234 176 242 184 242 200C242 218 232 228 222 226C216 252 200 272 182 284L188 316C236 330 274 354 278 400",
  lines:<><path className="pc-soft" d="M84 236C94 270 120 292 150 292C180 292 206 270 216 236M100 148Q118 136 138 146M162 146Q182 136 200 148M106 166Q120 157 134 166Q120 173 106 166ZM166 166Q180 157 194 166Q180 173 166 166ZM150 160V204M140 212Q150 220 160 212"/><path d="M108 236Q150 252 192 236Q150 288 108 236Z"/><path className="pc-soft" d="M120 243V252M133 247V262M150 249V266M167 247V262M180 243V252M112 238Q150 246 188 238"/></>,
 },
 { // open smile, lips and teeth
  outline:"M22 208C44 190 78 166 108 160C124 157 138 160 150 168C162 160 176 157 192 160C222 166 256 190 278 208C260 254 214 288 150 290C86 288 40 254 22 208",
  lines:<><path className="pc-soft" d="M44 210C80 190 118 184 150 188C182 184 220 190 256 210C226 246 190 264 150 264C110 264 74 246 44 210ZM44 210Q150 236 256 210M92 195V216M120 189V222M150 188V225M180 189V222M208 195V216M104 224V240M127 228V252M150 229V258M173 228V252M196 224V240"/></>,
 },
 { // profile, facing right
  outline:"M62 400C66 352 92 330 122 318L126 292C100 276 84 246 84 206C84 140 114 86 170 84C214 84 238 118 240 158C241 174 243 186 250 198C258 212 272 226 278 238C281 246 274 250 266 250L252 252C250 258 258 262 258 268C258 272 252 274 250 275C256 278 258 286 252 290C246 292 244 298 246 304C250 312 248 322 236 326L210 326C200 328 194 334 192 342C230 352 262 372 270 400",
  lines:<path className="pc-soft" d="M140 190C132 206 138 232 152 238C162 226 160 200 146 192M214 168Q226 162 238 168M222 180Q230 176 236 182"/>,
 },
];

function Camera(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 6 2-3h4l2 3h4a2 2 0 0 1 2 2v11H2V8a2 2 0 0 1 2-2h4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="12" cy="12.5" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>}
function Check(){return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Gallery(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><circle cx="9" cy="10" r="1.7" stroke="currentColor" strokeWidth="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>}
function Flip(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2M20 4v4h-4M4 20v-4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}

/** Illustration of the framing for one photo. */
export function PhotoGuide({index}:{index:number}){const {outline,lines}=shapes[index];return <svg className="pc-guide" viewBox="0 0 300 400" fill="none" aria-hidden="true"><path d={outline+"Z"} fill="currentColor" fillOpacity=".07"/><g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={outline}/>{lines}</g></svg>}

/** Camera overlay: one even-odd path dims the whole screen except the silhouette (no mask, so it renders the same in every browser). */
function GuideOverlay({index}:{index:number}){
 const {outline,lines}=shapes[index];
 return <div className="pc-cam-guide" aria-hidden="true"><svg viewBox="0 0 300 400" fill="none">
  <path d={"M-3000 -3000H3300V3400H-3000Z"+outline+"Z"} fill="#0b0907" fillOpacity=".6" fillRule="evenodd"/>
  <g stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={outline}/>{lines}</g>
 </svg></div>;
}

async function preparePhoto(source:File|HTMLVideoElement,mirror=false):Promise<PreparedPhoto>{
 let originalUrl:string|undefined;
 try{
  let drawable:HTMLImageElement|HTMLVideoElement,sx=0,sy=0,sw:number,sh:number;
  if(source instanceof File){
   if(!/^image\/(jpeg|png|webp|avif|heic|heif)$/i.test(source.type))throw new Error("Choisissez une photo JPG, PNG, WebP ou un format photo pris en charge par votre navigateur.");
   if(source.size>12*1024*1024)throw new Error("Cette photo est trop lourde. Choisissez une image de 12 Mo maximum.");
   originalUrl=URL.createObjectURL(source);const image=new Image();image.src=originalUrl;
   try{await image.decode()}catch{throw new Error("Cette photo ne peut pas être lue. Essayez une version JPG ou PNG.")}
   drawable=image;sw=image.naturalWidth;sh=image.naturalHeight;
  }else{
   drawable=source;const vw=source.videoWidth,vh=source.videoHeight;
   if(!vw||!vh)throw new Error("L’image n’est pas encore prête. Réessayez dans un instant.");
   // Keep exactly what the screen shows: the video is displayed with object-fit: cover.
   const scale=Math.max((source.clientWidth||vw)/vw,(source.clientHeight||vh)/vh);
   sw=(source.clientWidth||vw)/scale;sh=(source.clientHeight||vh)/scale;sx=(vw-sw)/2;sy=(vh-sh)/2;
  }
  if(!sw||!sh)throw new Error("L’image n’est pas encore prête. Réessayez dans un instant.");
  if(sw*sh>60000000)throw new Error("Les dimensions de cette image sont trop grandes. Choisissez une photo plus petite.");
  const ratio=Math.min(1,1600/Math.max(sw,sh));
  const canvas=document.createElement("canvas");canvas.width=Math.round(sw*ratio);canvas.height=Math.round(sh*ratio);
  const context=canvas.getContext("2d");if(!context)throw new Error("Impossible de préparer cette photo sur cet appareil.");
  context.fillStyle="#fff";context.fillRect(0,0,canvas.width,canvas.height);
  if(mirror){context.translate(canvas.width,0);context.scale(-1,1)}
  context.drawImage(drawable,sx,sy,sw,sh,0,0,canvas.width,canvas.height);
  const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error("Impossible de préparer cette photo. Réessayez.")),"image/jpeg",.9));
  return {url:URL.createObjectURL(blob),width:canvas.width,height:canvas.height};
 }finally{if(originalUrl)URL.revokeObjectURL(originalUrl)}
}

type FlowProps={photos:({url:string}|null)[];replace:(index:number,photo:PreparedPhoto|null)=>void;clear:()=>void;onFinish?:()=>void;onSkip?:()=>void;embedded?:boolean};

/** The photos page: pictures live in the photo session shared with the booking page. */
export function PhotoCapture(){
 const session=usePhotoSession();
 return <GuidedPhotos {...session}/>;
}

/** Guided capture. By default it ends on the booking page; the booking journey embeds it with its own callbacks. */
export function GuidedPhotos({photos,replace,clear,onFinish,onSkip,embedded=false}:FlowProps){
 const [index,setIndex]=useState(0),[review,setReview]=useState(false),[live,setLive]=useState(false),[pending,setPending]=useState(false),[videoReady,setVideoReady]=useState(false);
 const [facing,setFacing]=useState<"user"|"environment">("user"),[shot,setShot]=useState<PreparedPhoto|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const streamRef=useRef<MediaStream|null>(null),videoRef=useRef<HTMLVideoElement>(null),fileRef=useRef<HTMLInputElement>(null),nativeRef=useRef<HTMLInputElement>(null),headingRef=useRef<HTMLHeadingElement>(null),shutterRef=useRef<HTMLButtonElement>(null);
 const mounted=useRef(true),cameraEpoch=useRef(0),busyRef=useRef(false),shotRef=useRef<PreparedPhoto|null>(null);
 const count=photos.filter(Boolean).length,ready=!!photos[0]&&!!photos[1],guide=guides[index],photo=photos[index];

 const dropShot=useCallback(()=>{if(shotRef.current)URL.revokeObjectURL(shotRef.current.url);shotRef.current=null;if(mounted.current)setShot(null)},[]);
 const stopCamera=useCallback(()=>{
  cameraEpoch.current++;streamRef.current?.getTracks().forEach(track=>track.stop());streamRef.current=null;
  if(mounted.current){setLive(false);setPending(false);setVideoReady(false)}
  dropShot();
 },[dropShot]);
 useEffect(()=>{mounted.current=true;const hide=()=>{if(document.hidden)stopCamera()};document.addEventListener("visibilitychange",hide);return()=>{mounted.current=false;stopCamera();document.removeEventListener("visibilitychange",hide)}},[stopCamera]);
 useEffect(()=>{setError("")},[index,review]);
 useEffect(()=>{
  if(!live)return;
  const video=videoRef.current;
  if(video&&streamRef.current&&video.srcObject!==streamRef.current){video.srcObject=streamRef.current;video.play().catch(()=>{stopCamera();setError("La caméra ne peut pas démarrer. Choisissez plutôt une photo de votre galerie.")})}
  const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")stopCamera()};
  document.addEventListener("keydown",onKey);
  const scroll=document.documentElement.style.overflow;document.documentElement.style.overflow="hidden";
  shutterRef.current?.focus({preventScroll:true});
  return()=>{document.removeEventListener("keydown",onKey);document.documentElement.style.overflow=scroll};
 },[live,stopCamera]);

 function move(next:number){stopCamera();setIndex(next);setReview(false);requestAnimationFrame(()=>headingRef.current?.focus())}
 function showReview(){stopCamera();setReview(true);requestAnimationFrame(()=>headingRef.current?.focus())}

 async function startCamera(side:"user"|"environment"=facing){
  if(!navigator.mediaDevices?.getUserMedia){nativeRef.current?.click();return}
  setError("");setPending(true);const job=++cameraEpoch.current;
  try{
   const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:side,width:{ideal:1920},height:{ideal:1080}},audio:false});
   if(!mounted.current||job!==cameraEpoch.current||document.hidden){stream.getTracks().forEach(track=>track.stop());return}
   const previous=streamRef.current;streamRef.current=stream;previous?.getTracks().forEach(track=>track.stop());
   setFacing(side);setVideoReady(false);dropShot();
   if(videoRef.current){videoRef.current.srcObject=stream;videoRef.current.play().catch(()=>{})}
   setLive(true);
  }catch{if(mounted.current&&job===cameraEpoch.current)setError("La caméra n’est pas accessible. Autorisez-la dans votre navigateur ou choisissez une photo de votre galerie.")}
  finally{if(mounted.current&&job===cameraEpoch.current)setPending(false)}
 }
 async function capture(){
  const video=videoRef.current;if(!video||busyRef.current)return;
  busyRef.current=true;setBusy(true);setError("");
  try{
   const prepared=await preparePhoto(video,facing==="user");
   if(!mounted.current){URL.revokeObjectURL(prepared.url);return}
   navigator.vibrate?.(12);shotRef.current=prepared;setShot(prepared);
  }catch(reason){if(mounted.current)setError(reason instanceof Error?reason.message:"Impossible de prendre la photo.")}
  finally{busyRef.current=false;if(mounted.current)setBusy(false)}
 }
 async function fromFile(file?:File){
  if(!file||busyRef.current)return;
  busyRef.current=true;setBusy(true);setError("");
  try{
   const prepared=await preparePhoto(file);
   if(!mounted.current){URL.revokeObjectURL(prepared.url);return}
   if(live){dropShot();shotRef.current=prepared;setShot(prepared)}else replace(index,prepared);
  }catch(reason){if(mounted.current)setError(reason instanceof Error?reason.message:"Impossible de lire cette photo.")}
  finally{busyRef.current=false;if(mounted.current)setBusy(false)}
 }
 function acceptShot(){
  const prepared=shotRef.current;if(!prepared)return;
  shotRef.current=null;setShot(null);replace(index,prepared);
  if(index<2)setIndex(index+1);else showReview();
 }
 const next=()=>index<2?move(index+1):showReview();

 return <section className={"pc"+(embedded?" pc-embedded":" wrap")} aria-label="Prise de photos guidée">
  <div className="pc-steps" role="group" aria-label="Angles de prise de vue">{guides.map((item,i)=><button type="button" key={item.label} onClick={()=>move(i)} aria-current={!review&&index===i?"step":undefined} className={photos[i]?"has-photo":""}><span>{photos[i]?<Check/>:i+1}</span>{item.short}</button>)}</div>
  {review?<div className="pc-review">
   <h2 ref={headingRef} tabIndex={-1}>Vos photos.</h2>
   <div className="pc-review-grid">{guides.map((item,i)=><div key={item.label}>
    <button type="button" className="pc-thumb" onClick={()=>move(i)} aria-label={photos[i]?`Reprendre : ${item.label}`:`Ajouter : ${item.label}`}>{photos[i]?<img src={photos[i]!.url} alt={`Votre photo : ${item.label}`}/>:<><PhotoGuide index={i}/><b>+ Ajouter</b></>}</button>
    <p>{item.short}{photos[i]&&<button type="button" className="pc-remove" aria-label={`Supprimer la photo ${item.label}`} onClick={()=>replace(i,null)}>Retirer</button>}</p>
   </div>)}</div>
   <div className="pc-actions">{onFinish?<button type="button" className="pc-primary" onClick={onFinish}>Continuer <Arrow/></button>:<Link className="pc-primary" href="/rendez-vous/">Préparer mon rendez-vous <Arrow/></Link>}<button type="button" className="pc-link" onClick={()=>{clear();move(0)}}>Tout effacer</button></div>
  </div>:<div className="pc-step">
   <div className="pc-frame">{photo?<img src={photo.url} alt={`Votre photo : ${guide.label}`}/>:<PhotoGuide index={index}/>}{index===2&&!photo&&<span className="pc-tag">Facultatif</span>}</div>
   <div className="pc-side">
    <div className="pc-info"><h2 ref={headingRef} tabIndex={-1}>{guide.title}</h2><p>{guide.hint}</p></div>
    <div className="pc-actions">
     {error&&<p className="pc-error" role="alert">{error}</p>}
     {photo?<>
      <button type="button" className="pc-primary" onClick={next}>{index===2?"Vérifier mes photos":"Continuer"} <Arrow/></button>
      <div className="pc-row"><button type="button" className="pc-link" data-capture-camera disabled={busy||pending} onClick={()=>void startCamera()}>Reprendre</button><button type="button" className="pc-link" disabled={busy} onClick={()=>fileRef.current?.click()}>Autre photo</button></div>
     </>:<>
      <button type="button" className="pc-primary" data-capture-camera disabled={busy||pending} onClick={()=>void startCamera()}><Camera/>{pending?"Autorisez la caméra…":"Ouvrir la caméra"}</button>
      <div className="pc-row"><button type="button" className="pc-link" disabled={busy} onClick={()=>fileRef.current?.click()}>{busy?"Préparation…":"Choisir dans la galerie"}</button>{index===2&&count>0&&<button type="button" className="pc-link" onClick={showReview}>Passer</button>}</div>
     </>}
     {onSkip?<button type="button" className="pc-skip" onClick={()=>{stopCamera();onSkip()}}>Passer cette étape <Arrow/></button>:<Link className="pc-skip" href="/rendez-vous/" onClick={()=>{stopCamera();clear()}}>Passer cette étape <Arrow/></Link>}
    </div>
   </div>
  </div>}
  {live&&<div className="pc-cam" role="dialog" aria-modal="true" aria-label={`Caméra : ${guide.label}`}>
   <video ref={videoRef} className={facing==="user"?"is-mirror":undefined} autoPlay muted playsInline onCanPlay={()=>setVideoReady(true)}/>
   {shot?<img className="pc-cam-shot" src={shot.url} alt={`Aperçu : ${guide.label}`}/>:<GuideOverlay index={index}/>}
   <div className="pc-cam-top">
    <button type="button" className="pc-round" aria-label="Fermer la caméra" onClick={stopCamera}>×</button>
    <div className="pc-cam-title"><strong>{guide.label}</strong><span>{index+1} / 3{index===2?" · facultatif":""}</span></div>
    {index===2&&!shot&&count>0?<button type="button" className="pc-cam-skip" onClick={showReview}>Passer</button>:<i className="pc-round-spacer"/>}
   </div>
   {!shot&&<p className="pc-cam-hint">{guide.hint}</p>}
   {error&&<p className="pc-cam-error" role="alert">{error}</p>}
   <div className="pc-cam-bottom">
    {shot?<>
     <button type="button" className="pc-cam-ghost" onClick={dropShot}>Refaire</button>
     <button type="button" className="pc-cam-use" onClick={acceptShot}>{index===2?"Terminer":"Utiliser"} <Arrow/></button>
    </>:<>
     <button type="button" className="pc-round" aria-label="Choisir dans la galerie" disabled={busy} onClick={()=>fileRef.current?.click()}><Gallery/></button>
     <button ref={shutterRef} type="button" className="pc-shutter" data-capture-shutter aria-label="Prendre la photo" disabled={busy||!videoReady} onClick={()=>void capture()}/>
     <button type="button" className="pc-round" aria-label="Changer de caméra" disabled={busy||pending} onClick={()=>void startCamera(facing==="user"?"environment":"user")}><Flip/></button>
    </>}
   </div>
  </div>}
  <input ref={fileRef} data-photo-file type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif" hidden onChange={event=>{void fromFile(event.target.files?.[0]);event.target.value=""}}/>
  <input ref={nativeRef} data-photo-native type="file" accept="image/*" capture="user" hidden onChange={event=>{void fromFile(event.target.files?.[0]);event.target.value=""}}/>
 </section>;
}
