import Link from "next/link";
export default function NotFound() {
  return <main id="main" className="wrap" style={{padding:"100px 0"}}><p className="eyebrow">PAGE INTROUVABLE</p><h1>Retrouvons<br /><em>votre chemin.</em></h1><p style={{margin:"30px 0"}}>Cette page n’existe pas ou a changé d’adresse.</p><Link href="/" className="btn">Retour à l’accueil →</Link></main>;
}
