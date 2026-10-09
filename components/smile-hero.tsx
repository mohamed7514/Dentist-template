"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./smile-hero.css";

const stages = [
  { number: "01", label: "Votre point de départ", title: "Chaque sourire a son histoire.", text: "Une dent manquante, une couleur qui vous gêne. Tout commence par vous." },
  { number: "02", label: "Les possibilités", title: "Et si vous imaginiez la suite ?", text: "Retrouver de l’éclat, de l’harmonie, un sourire plus complet." },
  { number: "03", label: "Un nouveau regard", title: "Le plaisir de sourire. À nouveau.", text: "Vos envies méritent une conversation. À votre rythme, avec votre dentiste." },
];

export function SmileHero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      const section = root.current;
      if (!section) return;
      const scene = section.querySelector<HTMLElement>(".smile-scene")!;
      const before = section.querySelector(".smile-before");
      const photograph = section.querySelector(".smile-photograph");
      const toothLeft = section.querySelector(".smile-tooth-left");
      const toothRight = section.querySelector(".smile-tooth-right");
      const toothPatches = section.querySelector(".smile-tooth-patches");
      const captions = gsap.utils.toArray<HTMLElement>(".smile-caption", section);
      const cue = section.querySelector(".smile-scroll-cue");
      const line = section.querySelector(".smile-progress-fill");
      const tabs = Array.from(section.querySelectorAll<HTMLElement>(".smile-step"));

      const markStage = (index: number, progress: number) => {
        section.dataset.stage = String(index);
        section.dataset.progress = progress.toFixed(3);
        tabs.forEach((tab, i) => tab.toggleAttribute("data-current", index === i));
      };

      if (context.conditions?.reduced) {
        gsap.set(before, { opacity: 0 });
        gsap.set(toothPatches, { opacity: 0 });
        gsap.set(captions, { opacity: 0, y: 0 });
        gsap.set(captions[2], { opacity: 1 });
        gsap.set(line, { scaleX: 1 });
        gsap.set(cue, { opacity: 0 });
        markStage(2, 1);
        return;
      }

      gsap.set(before, { opacity: 1, filter: "saturate(1) brightness(1)" });
      gsap.set(toothPatches, { opacity: 1 });
      gsap.set([toothLeft, toothRight], { attr: { height: 0 } });
      gsap.set(captions, { opacity: 0, y: 14 });
      gsap.set(captions[0], { opacity: 1, y: 0 });
      gsap.set(photograph, { scale: 1.025 });
      gsap.set(line, { scaleX: 0 });
      markStage(0, 0);

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "smile-hero",
          trigger: section,
          pin: scene,
          start: () => `top top+=${document.querySelector(".header")?.getBoundingClientRect().height ?? 0}`,
          end: () => `+=${Math.max(1100, Math.round(window.innerHeight * 1.8))}`,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate() {
          const progress = this.progress();
          markStage(progress < 0.30 ? 0 : progress < 0.76 ? 1 : 2, progress);
        },
      });
      timeline
        .to(line, { scaleX: 1, duration: 1 }, 0)
        .to(photograph, { scale: 1, duration: 0.9 }, 0)
        .to(cue, { opacity: 0, duration: 0.10 }, 0.02)
        .to(toothLeft, { attr: { height: 235 }, duration: 0.26, ease: "power1.inOut" }, 0.15)
        .to(toothRight, { attr: { height: 235 }, duration: 0.26, ease: "power1.inOut" }, 0.28)
        .to(before, { filter: "saturate(.9) brightness(1.02)", duration: 0.28 }, 0.35)
        .to(before, { opacity: 0, duration: 0.32, ease: "power1.inOut" }, 0.48)
        .to(toothPatches, { opacity: 0, duration: 0.12 }, 0.81)
        .to(captions[0], { opacity: 0, y: -12, duration: 0.08 }, 0.25)
        .fromTo(captions[1], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.10 }, 0.33)
        .to(captions[1], { opacity: 0, y: -12, duration: 0.08 }, 0.68)
        .fromTo(captions[2], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.10 }, 0.76);

      // The frame has a fixed aspect ratio; fonts are the only late layout change.
      let active = true;
      document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
      return () => { active = false; };
    }, root);
    return () => media.revert();
  }, []);

  return (
    <section ref={root} className="smile-hero" id="accueil" aria-labelledby="smile-heading" data-stage="0">
      <div className="smile-scene">
        <div className="smile-heading">
          <p className="smile-eyebrow"><span /> VOTRE SOURIRE. VOTRE RYTHME.</p>
          <h1 id="smile-heading">Le plaisir de sourire,<br /><em>à nouveau.</em></h1>
        </div>

        <div className="smile-frame" role="img" aria-label="Animation illustrative : au fil du défilement, un sourire avec des dents tachées et manquantes évolue vers un sourire complet et naturel.">
          <div className="smile-photograph" aria-hidden="true">
            <Image className="smile-final" src="/assets/smile-final.webp" alt="" width={1536} height={1024} priority sizes="(max-width: 700px) 100vw, 85vw" />
            <Image className="smile-before" src="/assets/smile-before.webp" alt="" width={1536} height={1024} priority sizes="(max-width: 700px) 100vw, 85vw" />
            <svg className="smile-tooth-patches" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <filter id="smile-soft-mask"><feGaussianBlur stdDeviation="4" /></filter>
                <clipPath id="smile-left-boundary"><ellipse cx="554" cy="391" rx="78" ry="111" /></clipPath>
                <clipPath id="smile-right-boundary"><ellipse cx="1150" cy="382" rx="58" ry="102" /></clipPath>
                <mask id="smile-left-reveal" maskUnits="userSpaceOnUse" x="465" y="260" width="180" height="270"><rect className="smile-tooth-left" x="465" y="275" width="180" height="0" fill="white" filter="url(#smile-soft-mask)" /></mask>
                <mask id="smile-right-reveal" maskUnits="userSpaceOnUse" x="1080" y="260" width="140" height="270"><rect className="smile-tooth-right" x="1080" y="275" width="140" height="0" fill="white" filter="url(#smile-soft-mask)" /></mask>
              </defs>
              <g clipPath="url(#smile-left-boundary)" mask="url(#smile-left-reveal)"><image href="/assets/smile-final.webp" width="1536" height="1024" /></g>
              <g clipPath="url(#smile-right-boundary)" mask="url(#smile-right-reveal)"><image href="/assets/smile-final.webp" width="1536" height="1024" /></g>
            </svg>
          </div>
          <div className="smile-frame-top" aria-hidden="true"><span>UNE HISTOIRE DE SOURIRE</span><span>ÉPURE — 01</span></div>
          <div className="smile-scroll-cue" aria-hidden="true"><span>Faites défiler pour imaginer la suite</span><svg width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M8 1v16m-5-5 5 5 5-5" stroke="currentColor" strokeWidth="1.2" /></svg></div>
        </div>

        <div className="smile-story">
          <div className="smile-captions" aria-hidden="true">
            {stages.map((stage, index) => <div className="smile-caption" key={stage.number} data-caption={index}><h2>{stage.title}</h2><p>{stage.text}</p></div>)}
          </div>
          <div className="smile-progress" aria-hidden="true">
            <div className="smile-progress-track"><span className="smile-progress-fill" /></div>
            <div className="smile-steps">{stages.map((stage, index) => <span className="smile-step" key={stage.number} data-current={index === 0 ? "" : undefined}><b>{stage.number}</b> {stage.label}</span>)}</div>
          </div>
          <p className="smile-disclaimer">Transformation fictive à visée illustrative. Aucun résultat de traitement n’est garanti.</p>
        </div>
      </div>
    </section>
  );
}
