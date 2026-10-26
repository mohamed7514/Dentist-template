// `npm run dev`: Next.js dev server plus the chat API (scripts/preview.mjs) so the AI works in development.
import {spawn} from "node:child_process";
import {resolve} from "node:path";
const apiPort=process.env.CHAT_API_PORT||"3001";
const webPort=process.env.PORT||(()=>{const i=process.argv.findIndex(a=>a==="-p"||a==="--port");return i>=0?process.argv[i+1]:"3000"})();
const allowedOrigins=["http://127.0.0.1:"+webPort,"http://localhost:"+webPort].join(",");
const api=spawn(process.execPath,["scripts/preview.mjs","--port",apiPort],{stdio:"inherit",env:{...process.env,CHAT_ALLOWED_ORIGINS:allowedOrigins}});
const next=spawn(process.execPath,[resolve("node_modules/next/dist/bin/next"),"dev","--hostname","127.0.0.1",...process.argv.slice(2)],{stdio:"inherit",env:{...process.env,CHAT_API_ORIGIN:"http://127.0.0.1:"+apiPort}});
const stop=()=>{api.kill();next.kill()};
for(const signal of ["SIGINT","SIGTERM"])process.on(signal,stop);
next.on("exit",code=>{api.kill();process.exit(code??0)});
api.on("exit",code=>{if(code)console.error("Chat API stopped with code "+code)});
