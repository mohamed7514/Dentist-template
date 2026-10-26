"use client";
import type {Photo} from "@/lib/journey";
import {GuidedPhotos} from "./photo-capture";

type Props={open:boolean;photos:(Photo|null)[];index:number;onIndex:(index:number)=>void;onPhoto:(index:number,photo:Photo|null)=>void;onNext:()=>void;onSkip:()=>void;onError:(message:string)=>void};

/** Photo stage of the evaluation pop-up: same guided full-screen camera as the photos page. */
export function PhotoStep({photos,onPhoto,onNext,onSkip}:Props){
 return <GuidedPhotos embedded photos={photos}
  replace={(index,photo)=>onPhoto(index,photo?{url:photo.url,name:"photo-"+(index+1)+".jpg"}:null)}
  clear={()=>photos.forEach((_,index)=>onPhoto(index,null))}
  onFinish={onNext} onSkip={onSkip}/>;
}
