"use client";
import {createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode} from "react";
import Link from "./locale-link";
import {useLocale} from "./locale-provider";
import {photos as photoDict} from "@/lib/i18n/dict/photos";

export type PreparedPhoto={url:string;width:number;height:number};
type PhotoSession={photos:(PreparedPhoto|null)[];replace:(index:number,photo:PreparedPhoto|null)=>void;clear:()=>void};
const Context=createContext<PhotoSession|null>(null);
export function PhotoSessionProvider({children}:{children:ReactNode}){
 const [photos,setPhotos]=useState<(PreparedPhoto|null)[]>([null,null,null]);
 const current=useRef(photos);
 const replace=useCallback((index:number,photo:PreparedPhoto|null)=>{
  const previous=current.current[index];
  current.current=current.current.map((item,i)=>i===index?photo:item);setPhotos(current.current);
  if(previous)URL.revokeObjectURL(previous.url);
 },[]);
 const clear=useCallback(()=>{current.current.forEach(photo=>{if(photo)URL.revokeObjectURL(photo.url)});current.current=[null,null,null];setPhotos(current.current)},[]);
 useEffect(()=>()=>{current.current.forEach(photo=>{if(photo)URL.revokeObjectURL(photo.url)})},[]);
 return <Context.Provider value={{photos,replace,clear}}>{children}</Context.Provider>;
}
export function usePhotoSession(){const value=useContext(Context);if(!value)throw new Error("Photo session provider is missing");return value}
export function PhotoSessionSummary(){
 const {photos,clear}=usePhotoSession();const t=photoDict[useLocale()];const count=photos.filter(Boolean).length;
 if(!count)return null;
 return <aside className="photo-session-summary" aria-label={t.summaryAria}><div className="photo-session-miniatures">{photos.map((photo,index)=>photo&&<img key={index} src={photo.url} alt={t.summaryAlt(t.guides[index].label)}/>)}</div><div><strong>{t.summaryCount(count)}</strong><p>{t.summaryNote}</p><Link href="/photos-guidees/">{t.summaryCheck}</Link><button type="button" onClick={clear}>{t.summaryClear}</button></div></aside>;
}
