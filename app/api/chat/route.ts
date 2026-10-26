import {handleAssistant} from "@/server/assistant.mjs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// The OpenAI key is read from the server environment only (Vercel project settings / .env.local).
export async function POST(request: Request) {
  const clientId = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "shared";
  return handleAssistant(request, { OPENAI_API_KEY: process.env.OPENAI_API_KEY, OPENAI_MODEL: process.env.OPENAI_MODEL }, { clientId, allowedOrigins: (process.env.CHAT_ALLOWED_ORIGINS || "").split(",").filter(Boolean) });
}
