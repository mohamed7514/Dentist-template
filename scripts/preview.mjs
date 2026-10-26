import http from "node:http";
import {readFile,stat} from "node:fs/promises";
import {readFileSync} from "node:fs";
import {resolve,extname,sep} from "node:path";
import {handleAssistant} from "../server/assistant.mjs";
// Local secrets stay in .env.local (git-ignored); never expose them through NEXT_PUBLIC_*.
// The file is read on every chat request, so adding or changing the key needs no restart.
function secrets(){
 const env={OPENAI_API_KEY:process.env.OPENAI_API_KEY,OPENAI_MODEL:process.env.OPENAI_MODEL};
 try{for(const line of readFileSync(".env.local","utf8").split(/\r?\n/)){const match=/^\s*(OPENAI_API_KEY|OPENAI_MODEL)\s*=\s*(.*?)\s*$/.exec(line);if(match&&env[match[1]]===undefined)env[match[1]]=match[2].replace(/^['"]|['"]$/g,"")}}catch{}
 return env;
}
const root=resolve("out");
const requestedPort=process.argv.indexOf("--port");
const port=Number(requestedPort>=0?process.argv[requestedPort+1]:process.env.PORT||3000);
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".txt":"text/plain; charset=utf-8",".png":"image/png",".webp":"image/webp",".gif":"image/gif",".mp4":"video/mp4",".jpg":"image/jpeg",".svg":"image/svg+xml",".ico":"image/x-icon",".woff2":"font/woff2"};
const server=http.createServer(async(request,response)=>{
 try{
  const pathname=decodeURIComponent(new URL(request.url,"http://localhost").pathname);
  if(pathname.startsWith("/api/chat")){
   const origin="http://127.0.0.1:"+port;
   const incoming=new Request(new URL(request.url,origin),{method:request.method,headers:request.headers,...(!["GET","HEAD"].includes(request.method)?{body:request,duplex:"half"}:{})});
   const result=await handleAssistant(incoming,secrets(),{clientId:request.socket.remoteAddress,allowedOrigins:(process.env.CHAT_ALLOWED_ORIGINS||"").split(",").filter(Boolean)});
   response.writeHead(result.status,Object.fromEntries(result.headers));response.end(Buffer.from(await result.arrayBuffer()));return;
  }
  let filename=resolve(root,"."+pathname);
  if(filename!==root&&!filename.startsWith(root+sep)){response.writeHead(403);response.end("Forbidden");return}
  const metadata=await stat(filename).catch(()=>null);
  if(metadata?.isDirectory())filename=resolve(filename,"index.html");
  const data=await readFile(filename).catch(()=>null);
  if(!data){const page=await readFile(resolve(root,"404.html")).catch(()=>Buffer.from("Not found"));response.writeHead(404,{"Content-Type":"text/html; charset=utf-8"});response.end(page);return}
  const headers={"Content-Type":types[extname(filename)]||"application/octet-stream","Cache-Control":"no-cache","X-Content-Type-Options":"nosniff","Accept-Ranges":"bytes"};
  if(request.headers.range){
   const match=/^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
   const suffix=match&&match[1]==="";
   const start=match?(suffix?Math.max(0,data.length-Number(match[2])):Number(match[1])):NaN;
   const end=match?(suffix||match[2]===""?data.length-1:Math.min(Number(match[2]),data.length-1)):NaN;
   if(!match||(!match[1]&&!match[2])||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=data.length||end<start){response.writeHead(416,{...headers,"Content-Range":"bytes */"+data.length});response.end();return}
   response.writeHead(206,{...headers,"Content-Range":`bytes ${start}-${end}/${data.length}`,"Content-Length":end-start+1});response.end(request.method==="HEAD"?undefined:data.subarray(start,end+1));return;
  }
  response.writeHead(200,{...headers,"Content-Length":data.length});
  response.end(request.method==="HEAD"?undefined:data);
 }catch{response.writeHead(400);response.end("Bad request")}
});
server.listen(port,"127.0.0.1",()=>console.log("Épure Next.js — Local: http://127.0.0.1:"+port));
for(const signal of ["SIGINT","SIGTERM"])process.on(signal,()=>server.close(()=>process.exit(0)));
