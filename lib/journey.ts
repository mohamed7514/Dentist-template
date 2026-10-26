export type Goal = "dent" | "multiple" | "eclat" | "alignement" | "avis";
export type Stage = "photos" | "quiz" | "contact" | "booking" | "recap" | "success";
export type Contact = { name:string; phone:string; email:string; preference:"SMS"|"Email"|"Appel"; message:string; consent:boolean; reminders:boolean };
export type Photo = { url:string; name:string };
export const goals:Record<Goal,string>={dent:"Remplacer une dent",multiple:"Remplacer plusieurs dents",eclat:"Explorer le blanchiment",alignement:"Explorer l’alignement",avis:"Comprendre mes possibilités"};
export const emptyContact = ():Contact => ({name:"",phone:"",email:"",preference:"SMS",message:"",consent:false,reminders:true});
export const timings=["Dès que possible","Dans les prochains mois","Je prends le temps de m’informer"];
export const insurances=["Oui, j’en ai une","Non","Je ne sais pas"];
export const budgets=["Moins de 5 000 $ CAD","De 5 000 à 10 000 $ CAD","De 10 000 à 25 000 $ CAD","Plus de 25 000 $ CAD","J’ai besoin d’un devis"];
export const times=["9 h 00","11 h 00","14 h 30","16 h 00"];
export function businessDates(now=new Date()) {
 const dates:Date[]=[];const next=new Date(now);
 next.setHours(12,0,0,0);next.setDate(next.getDate()+1);
 while(dates.length<15){if(next.getDay()!==0&&next.getDay()!==6)dates.push(new Date(next));next.setDate(next.getDate()+1)}
 return dates;
}
export function formatDate(date:Date|null|undefined) {
 return date?.toLocaleDateString("fr-CA",{weekday:"long",day:"numeric",month:"long",year:"numeric"})??"";
}
export function validateContact(contact:Contact):string|null {
 if(!contact.name.trim())return "Veuillez indiquer votre nom.";
 if(!contact.consent)return "Veuillez confirmer votre accord pour être contacté au sujet de votre demande.";
 if(contact.preference==="Email"){
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))return "Indiquez un email valide pour être contacté par email.";
 }else{
  const digits=contact.phone.replace(/\D/g,"");
  if(digits.length<10||digits.length>15)return "Indiquez un numéro complet pour être contacté par téléphone ou SMS.";
 }
 return null;
}
