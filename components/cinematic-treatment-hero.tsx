"use client";

import Image from "next/image";
import Link from "./locale-link";
import { useLocale } from "./locale-provider";
import { cinematic } from "@/lib/i18n/dict/pages";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./icons";
import "./cinematic-treatment-hero.css";

type Props = {
  id: string;
  headingId: string;
  service: string;
  eyebrow: string;
  heading: string;
  accent: string;
  intro: string;
  videoSrc: string;
  posterSrc: string;
  description: string;
  playbackLabel: string;
  note: string;
};

export function CinematicTreatmentHero({ id, headingId, service, eyebrow, heading, accent, intro, videoSrc, posterSrc, description, playbackLabel, note }: Props) {
  const t = cinematic[useLocale()];
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
    setReady(element.readyState >= 2);
    let alive = true;
    let inView = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    element.muted = true;
    const sync = () => {
      if (!alive) return;
      setReduced(preference.matches);
      if (element.readyState >= 2) setReady(true);
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
  }, [videoSrc]);

  const toggle = () => {
    paused.current = blocked ? false : !paused.current;
    setIsPaused(paused.current);
    syncPlayback.current?.();
  };

  return <section ref={root} id={id} className="treatment-cinematic-hero" aria-labelledby={headingId} data-reduced={reduced}>
    <div className="treatment-cinematic-media" data-ready={ready}>
      <Image src={posterSrc} className="treatment-cinematic-poster" alt="" width={1080} height={1080} priority sizes="(max-width: 700px) 120vw, 75vw" />
      <video key={videoSrc} ref={video} className="treatment-cinematic-video" muted loop playsInline preload="auto" disablePictureInPicture poster={posterSrc} onLoadedData={() => setReady(true)} aria-label={description}>
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
    <Link className="treatment-cinematic-breadcrumb" href="/soins/">{t.backToTreatments} <span aria-hidden="true">/</span> {service}</Link>
    {!reduced && <button type="button" className="treatment-cinematic-playback" aria-label={blocked ? t.playAria(playbackLabel) : isPaused ? t.resumeAria(playbackLabel) : t.pauseAria(playbackLabel)} onClick={toggle}>
      <svg viewBox="0 0 12 12" fill="currentColor" width="12" height="12" aria-hidden="true">{isPaused || blocked ? <path d="M3 1.5 10 6l-7 4.5z" /> : <path d="M2 1h3v10H2zm5 0h3v10H7z" />}</svg>{blocked ? t.play : isPaused ? t.resume : t.pause}
    </button>}
    <div className="treatment-cinematic-copy">
      <p className="treatment-cinematic-eyebrow"><span aria-hidden="true" />{eyebrow}</p>
      <h1 id={headingId}>{heading}<br /><em>{accent}</em></h1>
      <p className="treatment-cinematic-intro">{intro.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p>
      <Link href="/rendez-vous/" className="btn treatment-cinematic-cta">{t.prepare} <Arrow /></Link>
    </div>
    <p className="treatment-cinematic-note">{note}</p>
  </section>;
}
