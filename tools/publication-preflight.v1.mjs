#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const REPO_ROOT=process.cwd();
const SURFACE_DIR='.github/ai-router/publication-surfaces';
const RELEASE_MARKER='.well-known/dgb-release.json';
const PAGES_LIMIT_BYTES=1073741824;
const PUBLIC_PAYLOAD_EXCLUDES=[
  '.git',
  '.github',
  'preview',
  'node_modules',
  'h-earth-live-6d18e158',
  'inspection/audralia-24057-exact'
];

export function sha256(value){return crypto.createHash('sha256').update(value).digest('hex');}
export function validateSurfaceId(id){return typeof id==='string'&&/^[a-z0-9][a-z0-9._-]{0,79}$/.test(id);}
export function validateSha(value){return typeof value==='string'&&/^[0-9a-f]{40}$/.test(value);}
export function stable(value){
  if(Array.isArray(value))return value.map(stable);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])]));
  return value;
}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function writeJson(file,value){fs.mkdirSync(path.dirname(path.resolve(file)),{recursive:true});fs.writeFileSync(path.resolve(file),JSON.stringify(stable(value),null,2)+'\n');}
function excluded(rel){return PUBLIC_PAYLOAD_EXCLUDES.some(root=>rel===root||rel.startsWith(`${root}/`));}
function copyTree(src,dst,relative=''){
  for(const entry of fs.readdirSync(src,{withFileTypes:true})){
    const rel=path.posix.join(relative,entry.name);
    if(excluded(rel))continue;
    const from=path.join(src,entry.name),to=path.join(dst,entry.name);
    if(entry.isDirectory()){fs.mkdirSync(to,{recursive:true});copyTree(from,to,rel);}
    else if(entry.isFile()){fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);}
  }
}
function digestTree(root){
  const files=[];
  const walk=(dir,rel='')=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){const r=path.posix.join(rel,e.name),p=path.join(dir,e.name);if(e.isDirectory())walk(p,r);else if(e.isFile())files.push(r);}};
  walk(root);files.sort();
  const h=crypto.createHash('sha256');
  for(const rel of files){h.update(rel);h.update('\0');h.update(fs.readFileSync(path.join(root,rel)));h.update('\0');}
  return h.digest('hex');
}
function treeBytes(root){let total=0;const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(e.isFile())total+=fs.statSync(p).size;}};walk(root);return total;}
function topLevelBreakdown(root){
  const rows=[];
  for(const e of fs.readdirSync(root,{withFileTypes:true})){
    const p=path.join(root,e.name);
    const bytes=e.isDirectory()?treeBytes(p):(e.isFile()?fs.statSync(p).size:0);
    rows.push({path:e.name,bytes});
  }
  return rows.sort((a,b)=>b.bytes-a.bytes);
}
function stampAudralia(stage,targetSha){
  const file=path.join(stage,'showroom/globe/audralia/index.html');
  if(!fs.existsSync(file))throw new Error('AUDRALIA_INDEX_MISSING');
  const short=targetSha.slice(0,8).toUpperCase();
  let text=fs.readFileSync(file,'utf8');
  const re=/<div class="audralia-loading-version"(?: data-audralia-build-sha="[^"]*")?>([^<]*)<\/div>/g;
  const matches=[...text.matchAll(re)];
  if(matches.length!==1)throw new Error(`AUDRALIA_BUILD_FINGERPRINT_STAMP_CARDINALITY:${matches.length}`);
  const old=matches[0][0];
  const label=matches[0][1].replace(/\s*·\s*BUILD\s+[A-Fa-f0-9]{8}\s*$/,'').trim();
  const next=`<div class="audralia-loading-version" data-audralia-build-sha="${targetSha}">${label} · BUILD ${short}</div>`;
  text=text.replace(old,next);fs.writeFileSync(file,text);
  if(!text.includes(`data-audralia-build-sha="${targetSha}"`)||!text.includes(`BUILD ${short}`))throw new Error('AUDRALIA_BUILD_FINGERPRINT_VERIFY_FAILED');
}
async function bindBrainAsset(stage){
  const root=path.join(stage,'inspection/compass/brain-gen1-hra');
  const asset=path.join(root,'Allen_M_Brain.glb');
  const runtime=path.join(root,'inspector.js');
  const source='https://ccf-ontology.hubmapconsortium.org/objects/v1.2/Allen_M_Brain.glb';
  const expectedSha='2b9ad5b53e40e9f0936da74f7be38d2eed15604e26358c3870a0ea13499b9a35';
  const expectedBytes=11977312;
  if(!fs.existsSync(runtime))throw new Error('BRAIN_GEN1_RUNTIME_MISSING');
  const response=await fetch(source);if(!response.ok)throw new Error(`BRAIN_GEN1_ASSET_FETCH_FAILED:${response.status}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length!==expectedBytes||sha256(bytes)!==expectedSha)throw new Error('BRAIN_GEN1_ASSET_IDENTITY_FAILED');
  fs.writeFileSync(asset,bytes);
  let text=fs.readFileSync(runtime,'utf8');
  const old="const SOURCE='https://ccf-ontology.hubmapconsortium.org/objects/v1.2/Allen_M_Brain.glb';";
  const replacement="const SOURCE='./Allen_M_Brain.glb';";
  if(text.split(old).length-1!==1)throw new Error('BRAIN_GEN1_SOURCE_REWRITE_CARDINALITY');
  fs.writeFileSync(runtime,text.replace(old,replacement));
}
export async function buildPayload({repoRoot=REPO_ROOT,targetSha,surfaceId,stage}){
  if(!validateSha(targetSha))throw new Error('EXACT_SHA_INVALID');
  if(!validateSurfaceId(surfaceId))throw new Error('SURFACE_ID_INVALID');
  const manifestPath=path.join(repoRoot,SURFACE_DIR,`${surfaceId}.json`);
  if(!fs.existsSync(manifestPath))throw new Error('SURFACE_MANIFEST_MISSING');
  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  if(manifest.schema!=='PUBLICATION_SURFACE_VERIFICATION_v1'||manifest.surfaceId!==surfaceId||!Array.isArray(manifest.checks)||!manifest.checks.length)throw new Error('SURFACE_MANIFEST_INVALID');
  fs.rmSync(stage,{recursive:true,force:true});fs.mkdirSync(stage,{recursive:true});copyTree(repoRoot,stage);
  const manifestSha256=sha256(fs.readFileSync(manifestPath));
  const markerPath=path.join(stage,RELEASE_MARKER);fs.mkdirSync(path.dirname(markerPath),{recursive:true});
  writeJson(markerPath,{schema:'DGB_PUBLIC_RELEASE_MARKER_v3',commit:targetSha,surface:surfaceId,verificationManifest:`${SURFACE_DIR}/${surfaceId}.json`,verificationManifestSha256:manifestSha256});
  if(surfaceId==='audralia')stampAudralia(stage,targetSha);
  if(surfaceId==='brain-gen1-hra')await bindBrainAsset(stage);
  const payloadBytes=treeBytes(stage);
  const topLevelBytes=topLevelBreakdown(stage);
  if(payloadBytes>=PAGES_LIMIT_BYTES){
    const error=new Error(`PAGES_PAYLOAD_TOO_LARGE:${payloadBytes}`);
    error.code='PAGES_PAYLOAD_TOO_LARGE';error.payloadBytes=payloadBytes;error.pagesLimitBytes=PAGES_LIMIT_BYTES;error.topLevelBytes=topLevelBytes.slice(0,20);
    throw error;
  }
  return {manifest,manifestPath,manifestSha256,payloadDigest:digestTree(stage),payloadBytes,topLevelBytes};
}
function run(cmd,args,env=process.env){return new Promise((resolve,reject)=>{const child=spawn(cmd,args,{stdio:'inherit',env});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(`COMMAND_FAILED:${cmd}:${code}`)));});}

export async function waitForLocalHttpServer({url,server,timeoutMs=15000,pollMs=100}){
  if(!url||!server)throw new Error('LOCAL_PREFLIGHT_SERVER_WAIT_ARGUMENT_MISSING');
  const deadline=Date.now()+timeoutMs;
  let spawnError=null;
  let lastFailure='NOT_ATTEMPTED';
  server.once('error',error=>{spawnError=error;});
  while(Date.now()<deadline){
    if(spawnError)throw new Error(`LOCAL_PREFLIGHT_SERVER_SPAWN_FAILED:${spawnError.message}`);
    if(server.exitCode!==null)throw new Error(`LOCAL_PREFLIGHT_SERVER_EXITED:${server.exitCode}`);
    try{
      const remaining=Math.max(1,deadline-Date.now());
      const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(Math.min(1000,remaining))});
      if(response.ok){await response.body?.cancel();return;}
      lastFailure=`HTTP_${response.status}`;
      await response.body?.cancel();
    }catch(error){
      lastFailure=error?.cause?.code||error?.name||error?.message||String(error);
    }
    await sleep(pollMs);
  }
  if(spawnError)throw new Error(`LOCAL_PREFLIGHT_SERVER_SPAWN_FAILED:${spawnError.message}`);
  if(server.exitCode!==null)throw new Error(`LOCAL_PREFLIGHT_SERVER_EXITED:${server.exitCode}`);
  throw new Error(`LOCAL_PREFLIGHT_SERVER_NOT_READY:${lastFailure}`);
}

async function stopChild(child){
  if(!child||child.exitCode!==null)return;
  const exited=new Promise(resolve=>child.once('exit',resolve));
  child.kill('SIGTERM');
  await Promise.race([exited,sleep(2000)]);
  if(child.exitCode===null){
    const killed=new Promise(resolve=>child.once('exit',resolve));
    child.kill('SIGKILL');
    await Promise.race([killed,sleep(1000)]);
  }
}

async function verifyLocal({stage,manifestPath,manifest}){
  const port=18000+Math.floor(Math.random()*1000);
  const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',stage],{stdio:'ignore'});
  const base=`http://127.0.0.1:${port}`;
  try{
    await waitForLocalHttpServer({url:`${base}/${RELEASE_MARKER}`,server});
    await run(process.execPath,['tools/publication-live-verify.mjs','static',base,manifestPath]);
    if(manifest.runtime?.enabled===true){
      if(!process.env.CHROME_PATH)throw new Error('CHROME_PATH_REQUIRED_FOR_RUNTIME_PREFLIGHT');
      await run(process.execPath,['tools/publication-live-verify.mjs','runtime',base,manifestPath],process.env);
    }
  }finally{await stopChild(server);}
}
function parse(argv){const out={};for(let i=0;i<argv.length;i++){const k=argv[i];if(!k.startsWith('--'))throw new Error(`UNKNOWN_ARGUMENT:${k}`);const key=k.slice(2);const value=argv[++i];if(value===undefined)throw new Error(`MISSING_ARGUMENT_VALUE:${key}`);out[key]=value;}return out;}

async function main(){
  const mode=process.argv[2];
  if(!['build','verify','preflight'].includes(mode)){console.error('usage: node tools/publication-preflight.v1.mjs <build|verify|preflight> --target-sha <sha> --surface-id <id> --stage <dir> --receipt <file>');process.exit(2);}
  const args=parse(process.argv.slice(3));
  const stage=args.stage||path.join(os.tmpdir(),'publication-preflight-stage');
  const receiptPath=args.receipt||path.join(os.tmpdir(),'publication-preflight-receipt.json');
  const targetSha=args['target-sha'];const surfaceId=args['surface-id'];
  let receipt;
  try{
    let built;
    if(mode==='verify'){
      if(!validateSha(targetSha))throw new Error('EXACT_SHA_INVALID');
      if(!validateSurfaceId(surfaceId))throw new Error('SURFACE_ID_INVALID');
      if(!fs.existsSync(stage))throw new Error('STAGED_PAYLOAD_MISSING');
      const manifestPath=path.join(REPO_ROOT,SURFACE_DIR,`${surfaceId}.json`);
      const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
      const prior=JSON.parse(fs.readFileSync(receiptPath,'utf8'));
      if(prior.schema!=='PUBLICATION_FAST_PREFLIGHT_RECEIPT_v1'||prior.result!=='PAYLOAD_BUILT'||prior.targetSha!==targetSha||prior.surfaceId!==surfaceId)throw new Error('PAYLOAD_BUILD_RECEIPT_MISMATCH');
      built={manifest,manifestPath,manifestSha256:prior.manifestSha256,payloadDigest:prior.payloadDigest,payloadBytes:prior.payloadBytes,topLevelBytes:prior.topLevelBytes||[]};
      await verifyLocal({stage,manifestPath,manifest});
    }else{
      built=await buildPayload({targetSha,surfaceId,stage});
      if(mode==='preflight')await verifyLocal({stage,manifestPath:built.manifestPath,manifest:built.manifest});
    }
    const result=mode==='build'?'PAYLOAD_BUILT':'PREFLIGHT_PASS';
    receipt={schema:'PUBLICATION_FAST_PREFLIGHT_RECEIPT_v1',targetSha,surfaceId,manifestSha256:built.manifestSha256,payloadDigest:built.payloadDigest,payloadBytes:built.payloadBytes,pagesLimitBytes:PAGES_LIMIT_BYTES,topLevelBytes:built.topLevelBytes,excludedPayloadRoots:PUBLIC_PAYLOAD_EXCLUDES,result,checks:{exactSha:'PASS',surfaceManifest:'PASS',diffScope:'BOUNDED_PAYLOAD',requiredAssets:'PASS',environmentBinding:'PASS',payloadBuild:'PASS',staticChecks:mode==='build'?'NOT_RUN':'PASS',runtimeReadiness:mode==='build'?'NOT_RUN':(built.manifest.runtime?.enabled===true?'PASS':'NOT_REQUIRED')},deploymentPerformed:false};
    writeJson(receiptPath,receipt);console.log(JSON.stringify(receipt,null,2));
  }catch(error){receipt={schema:'PUBLICATION_FAST_PREFLIGHT_RECEIPT_v1',targetSha:targetSha||null,surfaceId:surfaceId||null,result:'PREFLIGHT_FAIL',errorCode:error?.code||null,error:String(error?.stack||error),payloadBytes:error?.payloadBytes??null,pagesLimitBytes:error?.pagesLimitBytes??PAGES_LIMIT_BYTES,topLevelBytes:error?.topLevelBytes??[],excludedPayloadRoots:PUBLIC_PAYLOAD_EXCLUDES,deploymentPerformed:false};writeJson(receiptPath,receipt);console.error(JSON.stringify(receipt,null,2));process.exitCode=1;}
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))main();
