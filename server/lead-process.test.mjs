import {test} from "node:test";
import assert from "node:assert/strict";
import {emptyState,route,needFromText,wantsBooking,bookingAction} from "./lead-process.mjs";
test("a tooth-supported bridge question links its page and keeps the existing missing-tooth booking flow",()=>{
 const first=route(emptyState(),{text:"Je voudrais un pont pour remplacer une dent"});
 assert.equal(first.state.need,"pont");
 assert.deepEqual(first.actions,["start_dent","pont"]);
 const next=route(first.state,{text:"Oui, je voudrais un rendez-vous"});
 assert.equal(next.state.need,"pont");
 assert.deepEqual(next.actions,["start_dent"]);
});
test("needs and booking intent are read from text, accents ignored",()=>{
 assert.equal(needFromText("J’ai perdu une dent"),"dent");assert.equal(needFromText("plusieurs dents manquantes"),"multiple");
 assert.equal(needFromText("mes dents sont jaunes"),"eclat");assert.equal(needFromText("dents croches"),"alignement");assert.equal(needFromText("bonjour"),"inconnu");
 for(const t of ["j ai un dent enleve","on m a arraché une dent","dent enlevée hier","je veux une extraction"])assert.equal(needFromText(t),"dent",t);
 assert.ok(wantsBooking("Je voudrais prendre un rendez-vous"));assert.ok(wantsBooking("Disponibilités ?"));assert.ok(!wantsBooking("Ça fait mal ?"));
});
test("never more than two buttons per reply, explicit requests always get the button, service linked once",()=>{
 let state=emptyState();const seen=[];
 for(const text of ["Implant ?","rendez-vous","rendez-vous","rendez-vous","rendez-vous"]){const r=route(state,{text});assert.ok(r.actions.length<=2);seen.push(...r.actions);state=r.state}
 assert.equal(seen.filter(a=>a==="start_dent").length,5);assert.ok(state.shown<=2);assert.equal(seen.filter(a=>a==="implants").length,1);
 assert.equal(bookingAction({need:"multiple"}),"start_multiple");assert.equal(bookingAction(emptyState()),"start_avis");
});
