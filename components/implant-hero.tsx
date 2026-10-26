"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./icons";

export function ImplantHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const paused = useRef(false);
  const syncPlayback = useRef<(() => void) | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = video.current;
    const section = root.current;
    if (!element || !section) return;
    let alive = true;
    let inView = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    element.muted = true;
    const sync = () => {
      if (!alive) return;
      setReduced(preference.matches);
      if (inView && !document.hidden && !paused.current && !preference.matches) {
        element.play().then(() => { if (alive) setBlocked(false); }).catch(error => { if (alive && error.name !== "AbortError") setBlocked(true); });
      } else element.pause();
    };
    syncPlayback.current = sync;
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      section.dataset.inView = String(inView);
      sync();
    }, { threshold: .1 });
    observer.observe(section);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    element.addEventListener("canplay", sync);
    sync();
    return () => {
      alive = false;
      observer.disconnect();
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      element.removeEventListener("canplay", sync);
      element.pause();
      syncPlayback.current = null;
    };
  }, []);

  const toggle = () => {
    paused.current = blocked ? false : !paused.current;
    setIsPaused(paused.current);
    syncPlayback.current?.();
  };

  return <section ref={root} id="implant-hero" className="implant-cinematic-hero" aria-labelledby="implant-heading" data-reduced={reduced}>
    <div className="implant-cinematic-media" data-ready={ready}>
      <Image src="/assets/implant-hero/poster-v2.webp" className="implant-cinematic-poster" alt="" width={1080} height={1080} priority sizes="(max-width: 700px) 120vw, 75vw" />
      <video ref={video} className="implant-cinematic-video" muted loop playsInline preload="auto" disablePictureInPicture poster="/assets/implant-hero/poster-v2.webp" onLoadedData={() => setReady(true)} aria-label="Animation illustrative en coupe : un implant descend dans l’os de la mâchoire, puis le pilier et la couronne viennent s’assembler.">
        <source src="/assets/implant-hero/assembly-v2.mp4" type="video/mp4" />
      </video>
    </div>
    <Link className="implant-cinematic-breadcrumb" href="/soins/">← Nos soins <span aria-hidden="true">/</span> Implants dentaires</Link>
    {!reduced && <button type="button" className="implant-cinematic-playback" aria-label={blocked ? "Lire l’animation de l’implant" : isPaused ? "Reprendre l’animation de l’implant" : "Mettre l’animation de l’implant en pause"} onClick={toggle}>
      <svg viewBox="0 0 12 12" fill="currentColor" width="12" height="12" aria-hidden="true">{isPaused || blocked ? <path d="M3 1.5 10 6l-7 4.5z" /> : <path d="M2 1h3v10H2zm5 0h3v10H7z" />}</svg>{blocked ? "Lire" : isPaused ? "Reprendre" : "Pause"}
    </button>}
    <div className="implant-cinematic-copy">
      <p className="implant-cinematic-eyebrow"><span aria-hidden="true" />IMPLANTS DENTAIRES</p>
      <h1 id="implant-heading">Une dent à remplacer.<br /><em>Une suite à imaginer.</em></h1>
      <p className="implant-cinematic-intro">Un nouvel appui pour votre sourire.<br />Commençons par en parler, à votre rythme.</p>
      <Link href="/rendez-vous/" className="btn implant-cinematic-cta">Préparer mon évaluation <Arrow /></Link>
    </div>
    <p className="implant-cinematic-note">Reconstitution 3D illustrative. Le traitement est adapté à chaque patient.</p>
  </section>;
}
