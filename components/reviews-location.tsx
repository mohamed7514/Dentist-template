import {Arrow} from "./icons";
import {clinicLocation, demoReviews} from "@/lib/clinic-content";
import "./reviews-location.css";

function Pin(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/></svg>}

export function ReviewsSection(){return <section className="reviews-section" id="avis" aria-labelledby="reviews-title"><div className="wrap">
  <div className="reviews-heading"><div><p className="eyebrow">LA CONFIANCE SE RACONTE.</p><h2 id="reviews-title">Derrière chaque sourire,<br/><em>une expérience.</em></h2></div><div className="reviews-disclosure"><span className="example-label">AVIS DE DÉMONSTRATION</span><p>Des exemples fictifs pour présenter cette section.<br/>Les avis réels du cabinet prendront leur place ici.</p></div></div>
  <div className="reviews-grid">{demoReviews.map(review=><article className="review-card" key={review.initials}>
    <div className="review-card-top"><span>{review.context}</span><span className="review-stars" aria-hidden="true">★★★★★</span></div>
    <blockquote><span className="review-quote-mark" aria-hidden="true">“</span><p>{review.quote}</p></blockquote>
    <div className="review-author"><span className="review-avatar" aria-hidden="true">{review.initials}</span><div><span>{review.name}</span><small>Exemple fictif · aucun avis patient réel</small></div></div>
  </article>)}</div>
  <p className="reviews-bottom">L’écoute. La clarté. Le temps de choisir.<span>Ce qui compte, au-delà du sourire.</span></p>
</div></section>}

export function LocationSection(){
 const mapsUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinicLocation.query)}`;
 const directionsUrl=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinicLocation.query)}`;
 return <section className="location-section wrap" id="nous-trouver" aria-labelledby="location-title">
  <div className="location-heading"><p className="eyebrow">LE PREMIER PAS, TOUT PRÈS.</p><h2 id="location-title">Votre visite commence<br/><em>par ici.</em></h2></div>
  <div className="location-layout"><div className="location-info"><span className="location-city">MONTRÉAL · QUÉBEC</span><div className="location-address"><Pin/><div><span>UNE ADRESSE POUR SE RENCONTRER</span><address>{clinicLocation.street}<br/><span>{clinicLocation.city}</span></address></div></div>
    <a className="btn" href={directionsUrl} target="_blank" rel="noopener noreferrer">Préparer mon itinéraire <Arrow/></a>
    <div className="location-practical"><span>AVANT VOTRE VISITE</span><p>Les horaires, le stationnement et les informations d’accès seront précisés avec le cabinet choisi.</p></div>
    <p className="location-disclosure"><strong>Emplacement de démonstration.</strong> Adresse utilisée comme exemple, sans affiliation avec Épure. Elle sera remplacée par celle du cabinet choisi.</p>
  </div><div className="location-map"><div className="map-placeholder" aria-hidden="true"><Pin/><span>Montréal</span></div><iframe title={`Carte de démonstration : ${clinicLocation.street}, Montréal`} src={`https://maps.google.com/maps?q=${encodeURIComponent(clinicLocation.query)}&z=15&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><a className="map-open" href={mapsUrl} target="_blank" rel="noopener noreferrer">Ouvrir dans Google Maps <Arrow/></a></div></div>
  <p className="location-source">Adresse d’exemple : <a href={clinicLocation.source} target="_blank" rel="noopener noreferrer">{clinicLocation.exampleClinic} ↗</a><span>Cabinet de démonstration à remplacer.</span></p>
 </section>
}
