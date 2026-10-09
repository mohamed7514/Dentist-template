import http from "node:http";
import {readFile,stat} from "node:fs/promises";
import {resolve,extname,sep} from "node:path";
const root=resolve("out");
const requestedPort=process.argv.indexOf("--port");
const port=Number(requestedPort>=0?process.argv[requestedPort+1]:process.env.PORT||3000);
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".txt":"text/plain; charset=utf-8",".png":"image/png",".webp":"image/webp",".jpg":"image/jpeg",".svg":"image/svg+xml",".ico":"image/x-icon",".woff2":"font/woff2"};
const server=http.createServer(async(request,response)=>{
 try{
  const pathname=decodeURIComponent(new URL(request.url,"http://localhost").pathname);
  let filename=resolve(root,"."+pathname);
  if(filename!==root&&!filename.startsWith(root+sep)){response.writeHead(403);response.end("Forbidden");return}
  const metadata=await stat(filename).catch(()=>null);
  if(metadata?.isDirectory())filename=resolve(filename,"index.html");
  const data=await readFile(filename).catch(()=>null);
  if(!data){const page=await readFile(resolve(root,"404.html")).catch(()=>Buffer.from("Not found"));response.writeHead(404,{"Content-Type":"text/html; charset=utf-8"});response.end(page);return}
  response.writeHead(200,{"Content-Type":types[extname(filename)]||"application/octet-stream","Cache-Control":"no-cache","X-Content-Type-Options":"nosniff"});
  response.end(request.method==="HEAD"?undefined:data);
 }catch{response.writeHead(400);response.end("Bad request")}
});
server.listen(port,"127.0.0.1",()=>console.log("Épure Next.js — Local: http://127.0.0.1:"+port));
for(const signal of ["SIGINT","SIGTERM"])process.on(signal,()=>server.close(()=>process.exit(0)));
