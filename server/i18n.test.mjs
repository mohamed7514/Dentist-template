import test from "node:test";
import assert from "node:assert/strict";
import {accepts, needFromText, needDirective, route, wantsBooking, emptyState} from "./lead-process.mjs";
import {createAssistantHandler} from "./assistant.mjs";

test("English messages are routed to the same services as French ones", () => {
  assert.equal(needFromText("I have a missing tooth"), "dent");
  assert.equal(needFromText("I lost a tooth last year"), "dent");
  assert.equal(needFromText("several teeth are missing"), "multiple");
  assert.equal(needFromText("how does a bridge work?"), "pont");
  assert.equal(needFromText("my teeth are crooked"), "alignement");
  assert.equal(needFromText("I want whiter teeth"), "inconnu");
  assert.equal(needFromText("can you whiten my teeth?"), "eclat");
});

test("English booking requests and confirmations are understood", () => {
  assert.equal(wantsBooking("I would like to book an appointment"), true);
  assert.equal(wantsBooking("what is the weather"), false);
  assert.equal(accepts("yes please"), true);
  assert.equal(accepts("yes"), true);
  assert.equal(accepts("sure, let's go"), true);
  const {actions} = route(emptyState(), {text: "I want to book an appointment", modelNeed: "inconnu"});
  assert.equal(actions[0], "start_avis");
});

test("the model directive follows the interface language", () => {
  const state = {...emptyState(), need: "dent"};
  assert.match(needDirective(state, "en"), /visitor is interested/);
  assert.match(needDirective(state, "fr"), /Le visiteur/);
  assert.match(needDirective(emptyState(), "en"), /need is not clear/);
});

async function ask(body, fetcher) {
  const handle = createAssistantHandler({fetcher});
  const request = new Request("https://site.test/api/chat", {method: "POST", headers: {"content-type": "application/json", origin: "https://site.test"}, body: JSON.stringify(body)});
  return handle(request, {OPENAI_API_KEY: "sk-test"}, {clientId: "test"});
}

test("an English emergency gets an English guided answer without calling the model", async () => {
  let called = false;
  const response = await ask({consent: true, locale: "en", messages: [{role: "user", content: "I have a terrible toothache"}]}, async () => { called = true; return new Response("{}"); });
  const data = await response.json();
  assert.equal(called, false);
  assert.deepEqual(data.actions, ["emergency"]);
  assert.match(data.text, /emergency contact panel/);
});

test("the English instructions and redaction labels are sent upstream", async () => {
  let sent;
  const upstream = async (_url, init) => {
    sent = JSON.parse(init.body);
    return new Response(JSON.stringify({status: "completed", output: [{type: "message", content: [{type: "output_text", text: JSON.stringify({text: "Happy to help.", need: "dent"})}]}]}), {status: 200});
  };
  const response = await ask({consent: true, locale: "en", page: "/implants/", messages: [{role: "user", content: "I lost a tooth, my email is jane@example.com"}]}, upstream);
  assert.equal(response.status, 200);
  assert.match(sent.instructions, /front-desk assistant/);
  assert.match(sent.instructions, /Current page/);
  assert.match(sent.input[0].content, /\[email removed\]/);
});

test("an unknown locale falls back to French", async () => {
  let sent;
  const upstream = async (_url, init) => {
    sent = JSON.parse(init.body);
    return new Response(JSON.stringify({status: "completed", output: [{type: "message", content: [{type: "output_text", text: JSON.stringify({text: "Avec plaisir.", need: "inconnu"})}]}]}), {status: 200});
  };
  await ask({consent: true, locale: "de", messages: [{role: "user", content: "Bonjour"}]}, upstream);
  assert.match(sent.instructions, /assistant d’accueil/);
});
