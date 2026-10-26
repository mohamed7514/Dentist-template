import { CinematicTreatmentHero } from "./cinematic-treatment-hero";

export function ImplantHero() {
  return <CinematicTreatmentHero
    id="implant-hero"
    headingId="implant-heading"
    service="Implants dentaires"
    eyebrow="IMPLANTS DENTAIRES"
    heading="Une dent à remplacer."
    accent="Une suite à imaginer."
    intro={"Un nouvel appui pour votre sourire.\nCommençons par en parler, à votre rythme."}
    videoSrc="/assets/implant-hero/assembly-v2.mp4"
    posterSrc="/assets/implant-hero/poster-v2.webp"
    description="Animation illustrative en coupe : un implant descend dans l’os de la mâchoire, puis le pilier et la couronne viennent s’assembler."
    playbackLabel="de l’implant"
    note="Reconstitution 3D illustrative. Le traitement est adapté à chaque patient."
  />;
}
