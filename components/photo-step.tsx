"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import type {Photo} from "@/lib/journey";
import {Arrow} from "./icons";
const guides=[
 {name:"De face",title:"Votre sourire de face",text:"Visage au centre, lumière naturelle."},
 {name:"Votre sourire",title:"Une vue rapprochée",text:"Rapprochez le téléphone de vos dents."},
 {name:"De profil",title:"Votre profil",text:"Tournez légèrement la tête."}
];
type Props={open:boolean;photos:(Photo|null)[];index:number;onIndex:(index:number)=>void;onPhoto:(index:number,photo:Photo|null)=>void;onNext:()=>void;onSkip:()=>void;onError:(message:string)=>void};
export function PhotoStep({open,photos,index,onIndex,onPhoto,onNext,onSkip,onError}:Props){
 const [live,setLive]=useState(false),[busy,setBusy]=useState(false);
 const cameraRef=useRef<MediaStream|null>(null),videoRef=useRef<HTMLVideoElement>(null);
 const fileRef=useRef<HTMLInputElement>(null),cameraInputRef=useRef<HTMLInputElement>(null),active=useRef(false);
 const guide=guides[index],photo=photos[index],count=photos.filter(Boolean).length;
 const stop=useCallback(()=>{cameraRef.current?.getTracks().forEach(track=>track.stop());cameraRef.current=null;setLive(false)},[]);
 useEffect(()=>{active.current=open;stop();return()=>{active.current=false;cameraRef.current?.getTracks().forEach(track=>track.stop());cameraRef.current=null}},[open,index,stop]);
 useEffect(()=>{if(live&&videoRef.current&&cameraRef.current){videoRef.current.srcObject=cameraRef.current;videoRef.current.play().catch(()=>onError("La caméra n’a pas pu démarrer. Vous pouvez importer une photo."))}},[live,onError]);
 async function readPhoto(file?:File){
  if(!file||busy)return;
  if(!file.type.startsWith("image/")){onError("Choisissez un fichier image JPG, PNG ou WebP.");return}
  if(file.size>12*1024*1024){onError("Choisissez une photo de moins de 12 Mo.");return}
  setBusy(true);const url=URL.createObjectURL(file),target=index;
  try{
   await new Promise<void>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve();image.onerror=reject;image.src=url});
   if(!active.current){URL.revokeObjectURL(url);return}
   onPhoto(target,{url,name:file.name});stop();onError("");
  }catch{URL.revokeObjectURL(url);if(active.current)onError("Ce format ne peut pas être affiché. Essayez une photo JPG, PNG ou WebP.")}
  finally{if(active.current)setBusy(false)}
 }
 async function camera(){
  if(cameraRef.current&&videoRef.current){
   const video=videoRef.current;if(!video.videoWidth){onError("La caméra se prépare. Attendez un instant.");return}
   const canvas=document.createElement("canvas");canvas.width=video.videoWidth;canvas.height=video.videoHeight;
   canvas.getContext("2d")?.drawImage(video,0,0);
   canvas.toBlob(blob=>{if(blob&&active.current)void readPhoto(new File([blob],"photo-"+index+".jpg",{type:"image/jpeg"}))},"image/jpeg",.9);
   return;
  }
  if(!navigator.mediaDevices?.getUserMedia){cameraInputRef.current?.click();return}
  try{
   const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});
   if(!active.current){stream.getTracks().forEach(track=>track.stop());return}
   cameraRef.current=stream;setLive(true);onError("");
  }catch{if(active.current){stop();onError("La caméra n’est pas accessible. Importez une photo ou continuez sans photos.")}}
 }
 return <>
  <h2>Vos <em>photos.</em> <small>Facultatif</small></h2>
  <div className="camera-layout"><div className="camera-frame" id="camera-frame">
   {live?<video ref={videoRef} autoPlay muted playsInline/>:photo?<img src={photo.url} alt={"Votre photo "+guide.name}/>:<svg viewBox="0 0 130 190" fill="none" stroke="#8b7c66" strokeWidth="1.5" aria-hidden="true">
    {index===0?<><ellipse cx="65" cy="72" rx="40" ry="53"/><path d="M12 176c0-35 23-53 53-53s53 18 53 53M49 65h2m28 0h2M49 93q16 15 32 0"/></>:index===1?<path d="M8 55q57-46 114 0v46q-57 47-114 0ZM8 79h114M28 50v58m20-64v74m20-75v74m20-67v60m20-52v42"/>:<path d="M36 127V98c-20-13-21-56-1-73 18-15 49-10 54 20l18 25-18 7v18c0 15-11 24-28 24v13M16 179c0-25 14-46 45-47 25 1 42 15 48 40M74 48h3"/>}
   </svg>}
   <div className="camera-overlay"/><span className="camera-view-label">{index+1} / 3 · {guide.name}</span>
  </div><div className="photo-guide-copy"><h3>{guide.title}</h3><p>{guide.text}</p>
  <div className="photo-actions"><button type="button" id="camera-button" disabled={busy} onClick={()=>void camera()}>{live?"Prendre la photo":photo?"Reprendre":"Ouvrir la caméra"}</button><button type="button" id="import-button" disabled={busy} onClick={()=>fileRef.current?.click()}>Importer</button>{photo&&<button type="button" id="remove-photo" onClick={()=>{stop();onPhoto(index,null)}}>Retirer</button>}</div>
  <input type="file" id="photo-input" ref={fileRef} accept="image/*" hidden onChange={event=>{void readPhoto(event.target.files?.[0]);event.target.value=""}}/>
  <input type="file" id="camera-input" ref={cameraInputRef} accept="image/*" capture="user" hidden onChange={event=>{void readPhoto(event.target.files?.[0]);event.target.value=""}}/>
  </div></div>
  <div className="photo-thumbs">{guides.map((item,i)=><button key={item.name} type="button" className={"photo-thumb "+(index===i?"active ":"")+(photos[i]?"filled":"")} data-photo-index={i} onClick={()=>onIndex(i)}>{photos[i]?<img src={photos[i]!.url} alt=""/>:<span>0{i+1}</span>}<span>{item.name}</span></button>)}</div>
  <div className="flow-cta-row"><button className="btn" type="button" id="photo-next" disabled={!photo||busy} onClick={()=>index<2?onIndex(index+1):onNext()}>{busy?"Chargement…":index===2?"Continuer":"Photo suivante"} <Arrow/></button>{index===2&&count>=2&&<button className="text-button" type="button" id="skip-profile" onClick={onNext}>Passer le profil</button>}<button className="text-button" type="button" id="skip-photos" onClick={onSkip}>Passer</button></div>
 </>;
}
