"use client";
import {shell} from "@/lib/i18n/dict/shell";
import {useLocale} from "./locale-provider";
import {useJourney} from "./journey-context";
export function PrivacyButton(){const{showInfo}=useJourney();const t=shell[useLocale()];return <button type="button" data-privacy onClick={()=>showInfo()}>{t.privacy}</button>}
