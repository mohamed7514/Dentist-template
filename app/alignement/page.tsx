import {ServicePage, type ServicePageContent} from "@/components/service-page";
export const metadata={title:"Alignement du sourire",description:"Explorez vos envies d’harmonie et préparez un premier échange avec Épure."};
const content:ServicePageContent={
 number:"03",name:"Alignement du sourire",eyebrow:"HARMONISER. SANS VOUS PRÉCIPITER.",title:"Votre sourire.",accent:"Une nouvelle harmonie.",intro:"La position de certaines dents vous questionne ? Prenez le temps d’expliquer vos attentes et de découvrir les sujets à aborder avec le dentiste.",image:"smile",
 wishes:["Certaines dents me semblent mal alignées.","Je souhaite comprendre les possibilités pour mon sourire.","J’aimerais connaître les étapes avant de m’engager."],
 conversation:"Un projet d’alignement commence par vos questions. Ce que vous souhaitez changer, votre quotidien, vos attentes : chaque sujet mérite d’être entendu avant de parler de la suite.",
 questions:[{title:"Votre point de départ.",text:"Les détails qui vous préoccupent et les changements que vous aimeriez explorer."},{title:"Votre quotidien.",text:"Vos habitudes, votre échéance et les questions que vous avez sur le déroulement d’un traitement."},{title:"Une décision éclairée.",text:"Les options, leurs limites, les étapes et les coûts seront discutés avec le cabinet après l’évaluation."}],
 faqs:[{q:"Le site peut-il me dire quel traitement choisir ?",a:"Non. Le site vous aide à préparer vos questions. Le choix d’un traitement nécessite une évaluation avec le dentiste."},{q:"Puis-je parler de mes contraintes au quotidien ?",a:"Oui. Votre rythme de vie et vos questions ont leur place dans la conversation."},{q:"Et si je ne connais pas mon budget ?",a:"Vous pourrez indiquer que vous avez besoin d’un devis. Le cabinet devra préciser les coûts avant votre engagement."}]
};
export default function Page(){return <ServicePage content={content}/>}
