"use client";
import {createContext,useContext} from "react";
import type {Goal} from "@/lib/journey";
export type StartOptions={timing?:number;prefill?:boolean};
export type JourneyContextValue = {start:(goal?:Goal,options?:StartOptions)=>void;showInfo:(kind:"eclat"|"alignement"|"privacy")=>void};
export const JourneyContext=createContext<JourneyContextValue|null>(null);
export function useJourney(){const value=useContext(JourneyContext);if(!value)throw new Error("Journey provider is missing");return value;}
