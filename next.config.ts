import type { NextConfig } from "next";
// Served by Next.js (Vercel): the chat API lives in app/api/chat and reads OPENAI_API_KEY from the server environment.
const config: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.*.*", "10.*.*.*"],
  experimental: { agentUpgrade: "security" },
};
export default config;
