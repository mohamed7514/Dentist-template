"use client";
import {createContext,useContext,useState,type ReactNode,type Dispatch,type SetStateAction} from "react";
export type BookingDraft={need:string;timing:string;budget:string;date:string;period:string;firstName:string;lastName:string;phone:string;email:string;note:string};
const initial:BookingDraft={need:"",timing:"",budget:"",date:"",period:"",firstName:"",lastName:"",phone:"",email:"",note:""};
const Context=createContext<{draft:BookingDraft;setDraft:Dispatch<SetStateAction<BookingDraft>>;step:number;setStep:Dispatch<SetStateAction<number>>}|null>(null);
export function BookingSessionProvider({children}:{children:ReactNode}){
 const [draft,setDraft]=useState(initial);const [step,setStep]=useState(-1);
 return <Context.Provider value={{draft,setDraft,step,setStep}}>{children}</Context.Provider>;
}
export function useBookingSession(){const context=useContext(Context);if(!context)throw new Error("Booking session provider is missing");return context}
