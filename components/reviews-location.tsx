import {Arrow} from "./icons";
import {clinicLocation} from "@/lib/clinic-content";
import {location,reviews} from "@/lib/i18n/dict/sections";
import {rich} from "@/lib/i18n/rich";
import type {Locale} from "@/lib/i18n/config";
import "./reviews-location.css";

function Pin(){return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/></svg>}

export function ReviewsSection({locale}:{locale:Locale}){const t=reviews[locale];return <section className="reviews-section" id="avis" aria-labelledby="reviews-title"><div className="wrap">
  <div className="reviews-heading"><div><p className="eyebrow">{t.eyebrow}</p><h2 id="reviews-title">{rich(t.title)}</h2></div><div className="reviews-disclosure"><span className="example-label">{t.exampleLabel}</span><p>{rich(t.disclosure)}</p></div></div>
  <p className="reviews-scroll-hint">{t.scrollHint} <span aria-hidden="true">→</span></p>
  <div className="reviews-grid" role="region" aria-label={t.regionAria} tabIndex={0}>{t.items.map(review=><article className="review-card" key={review.initials}>
    <div className="review-card-top"><span>{review.context}</span><span className="review-stars" aria-hidden="true">★★★★★</span></div>
    <blockquote><span className="review-quote-mark" aria-hidden="true">“</span><p>{review.quote}</p></blockquote>
    <div className="review-author"><span className="review-avatar" aria-hidden="true">{review.initials}</span><div><span>{review.name}</span><small>{t.fictional}</small></div></div>
  </article>)}</div>
  <p className="reviews-bottom">{t.bottom}<span>{t.bottomSub}</span></p>
</div></section>}

export function LocationSection({locale}:{locale:Locale}){
 const t=location[locale];
 const mapsUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinicLocation.query)}`;
 const directionsUrl=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinicLocation.query)}`;
 return <section className="location-section wrap" id="nous-trouver" aria-labelledby="location-title">
  <div className="location-heading"><p className="eyebrow">{t.eyebrow}</p><h2 id="location-title">{rich(t.title)}</h2></div>
  <div className="location-layout"><div className="location-info"><span className="location-city">{t.city}</span><div className="location-address"><Pin/><div><span>{t.addressLabel}</span><address>{clinicLocation.street}<br/><span>{t.addressCity}</span></address></div></div>
    <a className="btn" href={directionsUrl} target="_blank" rel="noopener noreferrer">{t.directions} <Arrow/></a>
    <div className="location-practical"><span>{t.practicalLabel}</span><p>{t.practical}</p></div>
    <p className="location-disclosure"><strong>{t.disclosureStrong}</strong>{t.disclosure}</p>
  </div><div className="location-map"><div className="map-placeholder" aria-hidden="true"><Pin/><span>{t.mapPlace}</span></div><iframe title={t.mapTitle(clinicLocation.street)} src={`https://maps.google.com/maps?q=${encodeURIComponent(clinicLocation.query)}&z=15&output=embed&hl=${locale}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><a className="map-open" href={mapsUrl} target="_blank" rel="noopener noreferrer">{t.openMaps} <Arrow/></a></div></div>
  <p className="location-source">{t.sourceLabel}<a href={clinicLocation.source} target="_blank" rel="noopener noreferrer">{clinicLocation.exampleClinic} ↗</a><span>{t.sourceNote}</span></p>
 </section>
}
