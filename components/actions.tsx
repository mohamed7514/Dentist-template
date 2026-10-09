"use client";
import type {ButtonHTMLAttributes} from "react";
import {usePathname} from "next/navigation";
import {useJourney} from "./journey-context";
import type {Goal} from "@/lib/journey";
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{goal?:Goal};
export function StartButton({goal,children,...props}:Props){
 const {start}=useJourney();const pathname=usePathname();
 return <button {...props} type="button" data-start={goal??""} onClick={()=>start(goal??(pathname.startsWith("/implants")?"dent":undefined))}>{children}</button>;
}
export function TreatmentButton({goal,children,...props}:Props){
 const {showInfo}=useJourney();
 return <button {...props} type="button" data-treatment={goal} onClick={()=>showInfo(goal==="eclat"?"eclat":"alignement")}>{children}</button>;
}
export function PrivacyButton(){const{showInfo}=useJourney();return <button type="button" data-privacy onClick={()=>showInfo("privacy")}>Confidentialité</button>}
