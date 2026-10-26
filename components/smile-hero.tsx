"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useLocale } from "./locale-provider";
import { smileHero } from "@/lib/i18n/dict/sections";
import { rich } from "@/lib/i18n/rich";
import "./smile-hero.css";

export function SmileHero() {
  const t = smileHero[useLocale()];
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)", mobile: "(max-width: 700px)" }, (context) => {
      const section = root.current;
      if (!section) return;
      const before = section.querySelector(".smile-before");
      const photograph = section.querySelector(".smile-photograph");
      const toothLeft = section.querySelector(".smile-tooth-left");
      const toothRight = section.querySelector(".smile-tooth-right");
      const toothPatches = section.querySelector(".smile-tooth-patches");
      const captions = gsap.utils.toArray<HTMLElement>(".smile-caption", section);
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
        markStage(2, 1);
        return;
      }

      gsap.set(before, { opacity: 1, filter: "saturate(1) brightness(1)" });
      gsap.set(toothPatches, { opacity: 1 });
      gsap.set([toothLeft, toothRight], { attr: { height: 0 } });
      gsap.set(captions, { opacity: 0, y: 14 });
      gsap.set(captions[0], { opacity: 1, y: 0 });
      gsap.set(photograph, { scale: 1.025 });
      markStage(0, 0);

      const returnAt = context.conditions?.mobile ? 7 : 4.6;

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        paused: true,
        repeat: -1,
        onUpdate() {
          const progress = this.progress();
          const time = this.time();
          markStage(time < 1 || time >= returnAt + 0.2 ? 0 : time < 3 ? 1 : 2, progress);
        },
      });
      timeline
        .to(photograph, { scale: 1, duration: 3 }, 0)
        .to(toothLeft, { attr: { height: 235 }, duration: 0.9, ease: "power1.inOut" }, 1)
        .to(toothRight, { attr: { height: 235 }, duration: 0.9, ease: "power1.inOut" }, 1.3)
        .to(before, { filter: "saturate(.9) brightness(1.02)", duration: 0.8 }, 1.8)
        .to(before, { opacity: 0, duration: 0.9, ease: "power1.inOut" }, 2.1)
        .to(toothPatches, { opacity: 0, duration: 0.1 }, 2.9)
        .to(captions[0], { opacity: 0, y: -12, duration: 0.2 }, 0.9)
        .fromTo(captions[1], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2 }, 1.1)
        .to(captions[1], { opacity: 0, y: -12, duration: 0.2 }, 2.8)
        .fromTo(captions[2], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2 }, 3)
        // Hold the final smile longer on phones before fading back.
        .set([toothLeft, toothRight], { attr: { height: 0 } }, returnAt)
        .to(before, { opacity: 1, filter: "saturate(1) brightness(1)", duration: 0.4, ease: "power1.inOut" }, returnAt)
        .to(photograph, { scale: 1.025, duration: 0.4 }, returnAt)
        .to(captions[2], { opacity: 0, y: -12, duration: 0.2 }, returnAt)
        .fromTo(captions[0], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2, immediateRender: false }, returnAt + 0.2)
        .set(toothPatches, { opacity: 1 }, returnAt + 0.4);

      // Mobile: 2.5s initial, 5s transformation, 10s final, 1s return.
      timeline.timeScale(context.conditions?.mobile ? 0.4 : 1);

      let inView = false;
      const images = Array.from(section.querySelectorAll<HTMLImageElement>(".smile-photograph > img"));
      const syncPlayback = () => {
        const ready = images.every(image => image.complete && image.naturalWidth > 0);
        if (inView && ready && !document.hidden) timeline.play();
        else timeline.pause();
      };
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      });
      observer.observe(section);
      document.addEventListener("visibilitychange", syncPlayback);
      images.forEach(image => image.addEventListener("load", syncPlayback));
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", syncPlayback);
        images.forEach(image => image.removeEventListener("load", syncPlayback));
      };
    }, root);
    return () => media.revert();
  }, []);

  return (
    <section ref={root} className="smile-hero" id="accueil" aria-labelledby="smile-heading" data-stage="0">
      <div className="smile-scene">
        <div className="smile-frame" role="img" aria-label={t.frameAria}>
          <div className="smile-photograph" aria-hidden="true">
            <Image className="smile-final" src="/assets/smile-final.webp" alt="" width={1536} height={1024} priority sizes="100vw" />
            <Image className="smile-before" src="/assets/smile-before.webp" alt="" width={1536} height={1024} priority sizes="100vw" />
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
          
        </div>

        <div className="smile-story">
        <div className="smile-heading">
          <h1 id="smile-heading">{rich(t.heading)}</h1>
        </div>

          <div className="smile-captions" aria-hidden="true">
            {t.stages.map((stage, index) => <div className="smile-caption" key={index} data-caption={index}><h2>{stage.title}</h2><p>{stage.text}</p></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
