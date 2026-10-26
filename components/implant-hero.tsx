import { CinematicTreatmentHero } from "./cinematic-treatment-hero";
import { implants } from "@/lib/i18n/dict/pages";
import type { Locale } from "@/lib/i18n/config";

export function ImplantHero({ locale }: { locale: Locale }) {
  const t = implants[locale].hero;
  return <CinematicTreatmentHero
    id="implant-hero"
    headingId="implant-heading"
    service={t.service}
    eyebrow={t.eyebrow}
    heading={t.heading}
    accent={t.accent}
    intro={t.intro}
    videoSrc="/assets/implant-hero/assembly-v2.mp4"
    posterSrc="/assets/implant-hero/poster-v2.webp"
    description={t.description}
    playbackLabel={t.playbackLabel}
    note={t.note}
  />;
}
