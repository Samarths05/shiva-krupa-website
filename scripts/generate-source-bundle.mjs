import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { zipSync } from "fflate";

const root=process.cwd();
const excluded=new Set([".git","node_modules","dist",".next",".sites-runtime",".wrangler"]);
const files={};
const publicAssets=[];
async function walk(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
   if(excluded.has(entry.name)||entry.name==="source-bundle.generated.ts")continue;
  const full=join(dir,entry.name);
  const path=relative(root,full).replaceAll("\\","/");
  if(entry.isDirectory()){
   if(path==="public")await collectPublic(full);
   else await walk(full);
  }else files[path]=new Uint8Array(await readFile(full));
 }
}
async function collectPublic(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const full=join(dir,entry.name);
  if(entry.isDirectory())await collectPublic(full);
  else publicAssets.push(relative(join(root,"public"),full).replaceAll("\\","/"));
 }
}
await walk(root);
const zipped=zipSync(files,{level:6});
const base64=Buffer.from(zipped).toString("base64");
await writeFile(join(root,"lib/source-bundle.generated.ts"),`// Generated during the production build. Do not edit.\nexport const sourceBundleBase64=${JSON.stringify(base64)};\nexport const publicAssetPaths=${JSON.stringify(publicAssets.sort())};\n`);
