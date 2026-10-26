import {handleAssistant} from "@/server/assistant.mjs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return handleAssistant(request, { OPENAI_API_KEY: process.env.OPENAI_API_KEY }, {});
}
