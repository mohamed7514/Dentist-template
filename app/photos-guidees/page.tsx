import Link from "next/link";
import {PhotoCapture} from "@/components/photo-capture";
export const metadata={title:"Vos photos guidées",description:"Préparez deux à trois photos de votre sourire avec un guide à chaque étape. Photos facultatives, conservées uniquement sur votre appareil dans cette démonstration."};
export default function Page(){return <main id="main" className="photo-page"><section className="photo-page-intro wrap"><Link className="breadcrumb" href="/">← Accueil / Photos guidées</Link><div><div><h1>Vos photos.<br/><em>On vous guide.</em></h1></div></div></section><PhotoCapture/></main>}
