"use client";
import { useState, type CSSProperties } from "react";
export function Comparison({ id }: { id: string }) {
 const [split,setSplit]=useState(50);
 return <div className="comparison" data-comparison style={{"--split":split+"%"} as CSSProperties}>
  <div className="comparison-base" role="img" aria-label="Exemple fictif d’un sourire avec une dent remplacée" />
  <div className="comparison-before" role="img" aria-label="Exemple fictif d’un sourire avec une dent manquante" />
  <div className="comparison-labels"><span>Avant · exemple</span><span>Aperçu illustratif</span></div>
  <div className="comparison-line"><span>↔</span></div>
  <input id={id} type="range" min="0" max="100" value={split} onChange={event=>setSplit(Number(event.target.value))} aria-label="Comparer l’exemple avant et l’aperçu" />
 </div>;
}
