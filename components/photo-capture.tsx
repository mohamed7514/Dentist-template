"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import Link from "next/link";
import {Arrow} from "./icons";
import {usePhotoSession,type PreparedPhoto} from "./photo-session";
import "./photo-capture.css";

const guides=[
 {label:"Sourire de face",title:"Votre sourire, de face.",hint:"Placez votre visage dans le gabarit, puis souriez naturellement.",tips:["Une lumière face à vous, sans flash.","Le téléphone à hauteur du visage.","Un sourire détendu, sans forcer."]},
 {label:"Dents de près",title:"Un peu plus près.",hint:"Rapprochez le téléphone pour cadrer votre sourire et vos dents.",tips:["Gardez une image nette et bien éclairée.","Cadrez votre sourire au centre.","Ne forcez pas l’ouverture de la bouche."]},
 {label:"Profil",title:"Un autre angle, si vous voulez.",hint:"Tournez légèrement la tête du côté de votre choix.",tips:["Gardez la même lumière.","Laissez votre profil visible dans le cadre.","Cette troisième photo est facultative."]},
];
function Camera(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 6 2-3h4l2 3h4a2 2 0 0 1 2 2v11H2V8a2 2 0 0 1 2-2h4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="12" cy="12.5" r="4" stroke="currentColor" strokeWidth="1.4"/></svg>}
function Check(){return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Lock(){return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="2" stroke="currentColor"/><path d="M6.5 8V5a3.5 3.5 0 0 1 7 0v3M10 12v2" stroke="currentColor" strokeLinecap="round"/></svg>}
export function PhotoGuide({index}:{index:number}){return <svg className={`capture-guide capture-guide-${index}`} viewBox="0 0 300 300" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
 {index===0?<><path d="M102 216v-35m96 35v-35M51 283c0-47 38-70 99-70s99 23 99 70"/><ellipse cx="150" cy="116" rx="66" ry="87"/><path d="M112 112h6m64 0h6m-54 17-4 19h20m-28 22q28 20 56 0M93 83c20-34 63-39 110-9"/></>:index===1?<><path d="M30 135q120-94 240 0-120 108-240 0Z"/><path d="M30 135q120-18 240 0M65 112v41m34-53v72m34-78v86m34-86v86m34-81v73m34-62v43M86 95q64-42 128 0"/></>:<><path d="M114 221v-46c-28-19-42-51-37-89 5-42 36-66 75-60 39 5 56 30 56 62l28 41-30 12v30c0 19-20 33-48 33v22M53 283c0-34 23-63 65-63h40c35 0 64 24 76 57M183 85h5m-2 66h19"/></>}
 </g></svg>}

async function preparePhoto(source:File|HTMLVideoElement):Promise<PreparedPhoto>{
 let originalUrl:string|undefined;
 try{
  let drawable:HTMLImageElement|HTMLVideoElement;
  if(source instanceof File){
   if(!/^image\/(jpeg|png|webp|avif|heic|heif)$/i.test(source.type))throw new Error("Choisissez une photo JPG, PNG, WebP ou un format photo pris en charge par votre navigateur.");
   if(source.size>12*1024*1024)throw new Error("Cette photo est trop lourde. Choisissez une image de 12 Mo maximum.");
   originalUrl=URL.createObjectURL(source);const image=new Image();image.src=originalUrl;
   try{await image.decode()}catch{throw new Error("Cette photo ne peut pas être lue. Essayez une version JPG ou PNG.")}
   drawable=image;
  }else drawable=source;
  const width=drawable instanceof HTMLVideoElement?drawable.videoWidth:drawable.naturalWidth;
  const height=drawable instanceof HTMLVideoElement?drawable.videoHeight:drawable.naturalHeight;
  if(!width||!height)throw new Error("L’image n’est pas encore prête. Réessayez dans un instant.");
  if(width*height>60000000)throw new Error("Les dimensions de cette image sont trop grandes. Choisissez une photo plus petite.");
  const ratio=Math.min(1,1600/Math.max(width,height));
  const canvas=document.createElement("canvas");canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
  const context=canvas.getContext("2d");if(!context)throw new Error("Impossible de préparer cette photo sur cet appareil.");
  context.fillStyle="#fff";context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(drawable,0,0,canvas.width,canvas.height);
  const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error("Impossible de préparer cette photo. Réessayez.")),"image/jpeg",.9));
  return {url:URL.createObjectURL(blob),width:canvas.width,height:canvas.height};
 }finally{if(originalUrl)URL.revokeObjectURL(originalUrl)}
}

export function PhotoCapture(){
 const {photos,replace,clear}=usePhotoSession();
 const [index,setIndex]=useState(0),[review,setReview]=useState(false),[live,setLive]=useState(false),[cameraPending,setCameraPending]=useState(false),[videoReady,setVideoReady]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const streamRef=useRef<MediaStream|null>(null),videoRef=useRef<HTMLVideoElement>(null),fileRef=useRef<HTMLInputElement>(null),nativeRef=useRef<HTMLInputElement>(null),headingRef=useRef<HTMLHeadingElement>(null),viewRef=useRef<HTMLDivElement>(null);
 const mounted=useRef(true),cameraEpoch=useRef(0),photoEpoch=useRef(0),busyRef=useRef(false);
 const count=photos.filter(Boolean).length,ready=!!photos[0]&&!!photos[1],guide=guides[index],photo=photos[index];
 const stopCamera=useCallback(()=>{
  cameraEpoch.current++;streamRef.current?.getTracks().forEach(track=>track.stop());streamRef.current=null;
  if(mounted.current){setLive(false);setCameraPending(false);setVideoReady(false)}
 },[]);
 useEffect(()=>{mounted.current=true;const hide=()=>{if(document.hidden)stopCamera()};document.addEventListener("visibilitychange",hide);return()=>{mounted.current=false;photoEpoch.current++;stopCamera();document.removeEventListener("visibilitychange",hide)}},[stopCamera]);
 useEffect(()=>{stopCamera();photoEpoch.current++;busyRef.current=false;setBusy(false);setError("");return()=>{photoEpoch.current++;stopCamera()}},[index,review,stopCamera]);
 useEffect(()=>{
  if(!live||!videoRef.current||!streamRef.current)return;
  const video=videoRef.current;video.srcObject=streamRef.current;
  video.play().catch(()=>{if(mounted.current){stopCamera();setError("La caméra ne peut pas démarrer. Vous pouvez choisir une photo sur votre appareil.")}});
  if(window.matchMedia("(max-width:700px)").matches)viewRef.current?.scrollIntoView({block:"center",behavior:window.matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth"});
 },[live,stopCamera]);
 function move(next:number){stopCamera();setIndex(next);setReview(false);requestAnimationFrame(()=>headingRef.current?.focus())}
 function showReview(){stopCamera();setReview(true);requestAnimationFrame(()=>headingRef.current?.focus())}
 async function ingest(source?:File|HTMLVideoElement){
  if(!source||busyRef.current)return;
  busyRef.current=true;setBusy(true);setError("");const job=++photoEpoch.current,target=index;
  try{
   const prepared=await preparePhoto(source);
   if(!mounted.current||job!==photoEpoch.current){URL.revokeObjectURL(prepared.url);return}
   replace(target,prepared);stopCamera();
  }catch(reason){if(mounted.current&&job===photoEpoch.current)setError(reason instanceof Error?reason.message:"Impossible de lire cette photo.")}
  finally{if(mounted.current&&job===photoEpoch.current){busyRef.current=false;setBusy(false)}}
 }
 async function openCamera(){
  if(!navigator.mediaDevices?.getUserMedia){nativeRef.current?.click();return}
  stopCamera();setError("");setCameraPending(true);const job=cameraEpoch.current;
  try{
   const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1600},height:{ideal:1200}},audio:false});
   if(!mounted.current||job!==cameraEpoch.current||document.hidden){stream.getTracks().forEach(track=>track.stop());return}
   streamRef.current=stream;setLive(true);
  }catch{if(mounted.current&&job===cameraEpoch.current)setError("La caméra n’est pas accessible. Autorisez-la dans votre navigateur, utilisez l’appareil photo du téléphone ou choisissez une image dans votre galerie.")}
  finally{if(mounted.current&&job===cameraEpoch.current)setCameraPending(false)}
 }
 return <section className="capture-workspace wrap" aria-label="Prise de photos guidée">
  <div className="capture-stepper" aria-label="Angles de prise de vue">{guides.map((item,i)=><button type="button" key={item.label} onClick={()=>move(i)} disabled={busy} aria-current={!review&&index===i?"step":undefined} className={photos[i]?"has-photo":""}><span>{photos[i]?<Check/>:`0${i+1}`}</span><div>{item.label}<small>{i===2?"Facultatif":photos[i]?"Photo ajoutée":"Photo conseillée"}</small></div></button>)}</div>
  {review?<div className="capture-review">
    <div className="capture-review-heading"><div><p className="eyebrow">LE TEMPS DE VÉRIFIER.</p><h2 ref={headingRef} tabIndex={-1}>Vos photos.<br/><em>À votre rythme.</em></h2></div><p>Une image à refaire ? Vous pouvez la remplacer.<br/>Aucune photo n’a été envoyée.</p></div>
    <div className="capture-review-grid">{guides.map((item,i)=><article key={item.label}><div className="capture-review-image">{photos[i]?<img src={photos[i]!.url} alt={`Votre photo : ${item.label}`}/>:<PhotoGuide index={i}/>}<span>{photos[i]?"PHOTO AJOUTÉE":"FACULTATIF"}</span></div><h3>{item.label}</h3><div><button type="button" onClick={()=>move(i)}>{photos[i]?"Vérifier ou remplacer":"Ajouter le profil"} <Arrow/></button>{photos[i]&&<button className="capture-remove" type="button" aria-label={`Supprimer la photo ${item.label}`} onClick={()=>{replace(i,null);move(i)}}>Supprimer</button>}</div></article>)}</div>
    <div className="capture-review-footer"><div><strong>{count} photo{count>1?"s":""} préparée{count>1?"s":""}.</strong><p>Elles restent sur cet appareil pendant votre navigation. Recharger la page les efface.</p></div><Link className="btn" href="/rendez-vous/">Préparer mon rendez-vous <Arrow/></Link><button className="capture-clear" type="button" onClick={()=>{clear();move(0)}}>Tout effacer</button></div>
  </div>:<div className={`capture-layout${live||photo||index===2?" capture-active":""}`}>
   <div className="capture-view"><div ref={viewRef} className={`capture-frame${live?" is-live":""}${photo&&!live?" has-image":""}`}>
    {live?<video ref={videoRef} autoPlay muted playsInline onCanPlay={()=>setVideoReady(true)}/>:photo?<img src={photo.url} alt={`Votre photo : ${guide.label}`}/>:<div className="capture-empty"><PhotoGuide index={index}/><span>UN REPÈRE POUR VOUS GUIDER</span></div>}
    {live&&<div className="capture-live-guide"><PhotoGuide index={index}/></div>}
    <div className="capture-frame-top"><span>{live?"CAMÉRA ACTIVE":photo?"VOTRE PHOTO":"APERÇU GUIDÉ"}</span><span>0{index+1} / 03</span></div>
    {!photo&&!live&&<div className="capture-corners" aria-hidden="true"><i/><i/><i/><i/></div>}
    <span className="capture-frame-label">{guide.label}{index===2?" · facultatif":""}</span>
    {live&&<div className="capture-mobile-actions"><button type="button" data-capture-mobile-shutter disabled={busy||!videoReady} onClick={()=>{if(videoRef.current)void ingest(videoRef.current)}}><Camera/>{busy?"Préparation…":"Prendre la photo"}</button><button type="button" aria-label="Fermer la caméra" disabled={busy} onClick={stopCamera}>×</button></div>}
    {!live&&photo&&<div className="capture-mobile-actions"><button type="button" disabled={busy||cameraPending||(index===2&&!ready)} onClick={()=>index<2?move(index+1):showReview()}>{index===2?"Vérifier mes photos":"Continuer"}<Arrow/></button></div>}
   </div><div className="capture-under-frame"><Lock/><span>Vos photos restent sur votre appareil. Aucun envoi.</span></div></div>
   <div className="capture-instructions"><p className="eyebrow">UNE CONSIGNE À LA FOIS · 0{index+1}</p><h2 ref={headingRef} tabIndex={-1}>{guide.title}</h2><p>{guide.hint}</p><details className="capture-tips"><summary>Conseils pour une photo nette</summary><ul>{guide.tips.map(tip=><li key={tip}><Check/>{tip}</li>)}</ul></details>
    <div className="capture-controls">
     {live?<><button className="btn" type="button" data-capture-shutter disabled={busy||!videoReady} onClick={()=>{if(videoRef.current)void ingest(videoRef.current)}}><Camera/>{busy?"Préparation…":"Prendre la photo"}</button><button className="capture-secondary" type="button" disabled={busy} onClick={stopCamera}>Fermer la caméra</button></>:<><button className="btn" type="button" data-capture-camera disabled={busy||cameraPending} onClick={()=>void openCamera()}><Camera/>{cameraPending?"Autorisez la caméra…":photo?"Reprendre la photo":"Ouvrir la caméra"}</button><button className="capture-secondary" type="button" disabled={busy} onClick={()=>fileRef.current?.click()}>{photo?"Remplacer depuis la galerie":"Choisir dans ma galerie"} <Arrow/></button></>}
     {cameraPending&&<button className="capture-text-button" type="button" onClick={stopCamera}>Annuler l’ouverture</button>}
     {error&&<p className="capture-error" role="alert">{error}</p>}
     {error&&!live&&<button className="capture-text-button" type="button" onClick={()=>nativeRef.current?.click()}>Utiliser l’appareil photo du téléphone</button>}
     <p className="capture-status" role="status" aria-live="polite">{busy?"Préparation de votre photo…":photo?"Photo ajoutée. Vous pouvez continuer ou la remplacer.":"JPG, PNG, WebP · 12 Mo maximum par photo."}</p>
     {photo&&!live&&<button className="capture-remove" type="button" disabled={busy} onClick={()=>replace(index,null)}>Supprimer cette photo</button>}
    </div>
    <div className="capture-next"><button className="btn" type="button" disabled={busy||live||cameraPending||(index<2?!photo:!ready)} onClick={()=>index<2?move(index+1):showReview()}>{index===2?"Vérifier mes photos":"Continuer"} <Arrow/></button>{index===2&&ready&&!live&&<button className="capture-text-button" type="button" disabled={busy} onClick={showReview}>Passer le profil</button>}</div>
   </div>
  </div>}
  <input ref={fileRef} data-photo-file type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif" hidden onChange={event=>{void ingest(event.target.files?.[0]);event.target.value=""}}/>
  <input ref={nativeRef} data-photo-native type="file" accept="image/*" capture="user" hidden onChange={event=>{void ingest(event.target.files?.[0]);event.target.value=""}}/>
  <div className="capture-bottom"><span><Lock/>Vous gardez le choix, à chaque étape.</span><Link href="/rendez-vous/" onClick={()=>{stopCamera();clear()}}>Continuer sans photos <Arrow/></Link></div>
  <p className="capture-session-note">Cette démonstration conserve les photos uniquement dans la mémoire de votre navigateur, pendant votre navigation sur le site. Elles sont effacées si vous rechargez ou fermez la page. Aucun fichier n’est transmis à la clinique ni à une IA.</p>
 </section>;
}
