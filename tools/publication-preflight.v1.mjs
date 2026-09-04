#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawn,spawnSync} from 'node:child_process';
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
const AUTHORIZED_EXCLUDED_RUNTIME_DEPENDENCIES=Object.freeze({
  audralia:Object.freeze({
    mode:'EXACT_REFERENCED_CLOSURE_ONLY',
    entryPath:'showroom/globe/audralia/index.html',
    allowedPrefix:'inspection/audralia-24057-exact/snapshot/'
  }),
  'compass-holographic-orientation-20260904':Object.freeze({
    mode:'EXACT_REFERENCED_CLOSURE_ONLY',
    entryPath:'preview/compass/holographic-orientation-v1/full/index.html',
    allowedPrefix:'preview/compass/holographic-orientation-v1/full/'
  })
});
const PROTECTED_SURFACE_IDS=Object.freeze(['audralia']);

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
function appendMatches(target,text,re){let match;while((match=re.exec(text))!==null){if(match[1])target.push(match[1]);}}
function extractResourceSpecifiers(rel,text){
  const ext=path.posix.extname(rel).toLowerCase();
  const refs=[];
  if(ext==='.html'||ext==='.htm')appendMatches(refs,text,/<(?:script|link|img|source|video|audio|iframe)\b[^>]*?\b(?:src|href)\s*=\s*["']([^"']+)["'][^>]*>/gi);
  if(ext==='.mjs'||ext==='.js'||ext==='.cjs'){
    appendMatches(refs,text,/\b(?:import|export)\s+(?:[^'";]*?\s+from\s*)?["']([^"']+)["']/gs);
    appendMatches(refs,text,/\bimport\s*\(\s*["']([^"']+)["']\s*\)/gs);
    appendMatches(refs,text,/\bimportWrapper\s*\(\s*["'][^"']+["']\s*,\s*["']([^"']+)["']\s*\)/gs);
    appendMatches(refs,text,/\bnew\s+URL\s*\(\s*["']([^"']+)["']\s*,\s*import\.meta\.url\s*\)/gs);
    appendMatches(refs,text,/\bfetch\s*\(\s*["']([^"']+)["']/gs);
    appendMatches(refs,text,/\b(?:Worker|SharedWorker)\s*\(\s*["']([^"']+)["']/gs);
  }
  if(ext==='.css'){
    appendMatches(refs,text,/@import\s+(?:url\(\s*)?["']?([^"')\s;]+)["']?\s*\)?/gi);
    appendMatches(refs,text,/url\(\s*["']?([^"')]+)["']?\s*\)/gi);
  }
  if(ext==='.svg')appendMatches(refs,text,/\b(?:href|xlink:href)\s*=\s*["']([^"']+)["']/gi);
  return [...new Set(refs)];
}
function resolveResourcePath(importerRel,specifier){
  if(typeof specifier!=='string')return null;
  const value=specifier.trim();
  if(!value||value.startsWith('#')||value.startsWith('//')||/^[A-Za-z][A-Za-z0-9+.-]*:/.test(value))return null;
  if(!value.startsWith('.')&&!value.startsWith('/'))return null;
  const resource=value.split(/[?#]/,1)[0];
  if(!resource)return null;
  const candidate=resource.startsWith('/')?resource.slice(1):path.posix.join(path.posix.dirname(importerRel),resource);
  const normalized=path.posix.normalize(candidate);
  if(!normalized||normalized==='.'||normalized==='..'||normalized.startsWith('../')||normalized.includes('\0'))throw new Error(`PUBLIC_RUNTIME_DEPENDENCY_PATH_INVALID:${importerRel}:${specifier}`);
  return normalized;
}
function sourceFile(repoRoot,rel){
  const root=path.resolve(repoRoot),file=path.resolve(repoRoot,...rel.split('/'));
  if(file!==root&&!file.startsWith(`${root}${path.sep}`))throw new Error(`PUBLIC_RUNTIME_DEPENDENCY_PATH_ESCAPE:${rel}`);
  return file;
}
function readExactRepositoryFile({repoRoot,targetSha,rel}){
  if(!validateSha(targetSha))throw new Error('EXACT_SHA_INVALID');
  const from=sourceFile(repoRoot,rel);
  if(fs.existsSync(from)&&fs.statSync(from).isFile())return {bytes:fs.readFileSync(from),source:'WORKTREE'};
  const objectPath=`${targetSha}:${rel}`;
  const result=spawnSync('git',['-C',repoRoot,'show',objectPath],{encoding:null,maxBuffer:64*1024*1024});
  if(result.error||result.status!==0){
    const detail=result.error?.message||Buffer.from(result.stderr||'').toString('utf8').trim()||`status=${result.status}`;
    throw new Error(`AUTHORIZED_RUNTIME_DEPENDENCY_MISSING:${rel}:${detail}`);
  }
  return {bytes:Buffer.from(result.stdout),source:'EXACT_COMMIT_OBJECT'};
}
function loadSurfaceManifest(repoRoot,surfaceId){
  const manifestPath=path.join(repoRoot,SURFACE_DIR,`${surfaceId}.json`);
  if(!fs.existsSync(manifestPath))throw new Error(`SURFACE_MANIFEST_MISSING:${surfaceId}`);
  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  if(manifest.schema!=='PUBLICATION_SURFACE_VERIFICATION_v1'||manifest.surfaceId!==surfaceId||!Array.isArray(manifest.checks)||!manifest.checks.length)throw new Error(`SURFACE_MANIFEST_INVALID:${surfaceId}`);
  return {manifestPath,manifest};
}
function promoteProtectedSurface({repoRoot,stage,targetSha,protectedSurfaceId,policy}){
  const entryFile=path.join(stage,...policy.entryPath.split('/'));
  let entryBytes;
  if(excluded(policy.entryPath)){
    if(!policy.entryPath.startsWith(policy.allowedPrefix))throw new Error(`AUTHORIZED_RUNTIME_ENTRYPOINT_CROSSES_EXCLUDED_ROOT:${policy.entryPath}`);
    entryBytes=readExactRepositoryFile({repoRoot,targetSha,rel:policy.entryPath}).bytes;
  }else{
    if(!fs.existsSync(entryFile)||!fs.statSync(entryFile).isFile())throw new Error(`AUTHORIZED_RUNTIME_ENTRYPOINT_MISSING:${policy.entryPath}`);
    entryBytes=fs.readFileSync(entryFile);
  }
  const entryReferences=extractResourceSpecifiers(policy.entryPath,entryBytes.toString('utf8'))
    .map(specifier=>resolveResourcePath(policy.entryPath,specifier))
    .filter(Boolean);
  const queue=[policy.entryPath],seen=new Set(),files=[];
  while(queue.length){
    const rel=queue.shift();
    if(seen.has(rel))continue;
    seen.add(rel);
    let bytes;
    let source;
    if(excluded(rel)){
      if(!rel.startsWith(policy.allowedPrefix))throw new Error(`AUTHORIZED_RUNTIME_DEPENDENCY_CROSSES_EXCLUDED_ROOT:${rel}`);
      const recovered=readExactRepositoryFile({repoRoot,targetSha,rel});
      bytes=recovered.bytes;
      source=recovered.source;
      const to=path.join(stage,...rel.split('/'));
      fs.mkdirSync(path.dirname(to),{recursive:true});
      fs.writeFileSync(to,bytes);
      files.push({path:rel,bytes:bytes.length,sha256:sha256(bytes),source});
    }else{
      const staged=path.join(stage,...rel.split('/'));
      if(!fs.existsSync(staged)||!fs.statSync(staged).isFile())throw new Error(`PUBLIC_RUNTIME_DEPENDENCY_MISSING_FROM_STAGE:${rel}`);
      bytes=fs.readFileSync(staged);
      source='STAGED_PUBLIC_PAYLOAD';
    }
    const text=bytes.toString('utf8');
    for(const specifier of extractResourceSpecifiers(rel,text)){
      const dependency=resolveResourcePath(rel,specifier);
      if(!dependency)continue;
      if(excluded(dependency)&&!dependency.startsWith(policy.allowedPrefix))throw new Error(`AUTHORIZED_RUNTIME_DEPENDENCY_CROSSES_EXCLUDED_ROOT:${rel}:${dependency}`);
      if(!seen.has(dependency))queue.push(dependency);
    }
  }
  if(!files.length)throw new Error(`AUTHORIZED_RUNTIME_DEPENDENCY_ENTRY_REFERENCES_MISSING:${protectedSurfaceId}`);
  files.sort((a,b)=>a.path.localeCompare(b.path));
  const digest=crypto.createHash('sha256');
  for(const file of files){digest.update(file.path);digest.update('\0');digest.update(file.sha256);digest.update('\0');}
  return Object.freeze({
    protectedSurfaceId,
    status:'PROMOTED',
    mode:policy.mode,
    readbackMode:'WORKTREE_OR_EXACT_COMMIT_OBJECT',
    exactCommitObjectReadbackCount:files.filter(file=>file.source==='EXACT_COMMIT_OBJECT').length,
    entryPath:policy.entryPath,
    allowedPrefix:policy.allowedPrefix,
    entryReferenceCount:entryReferences.length,
    traversedResourceCount:seen.size,
    fileCount:files.length,
    bytes:files.reduce((sum,file)=>sum+file.bytes,0),
    digest:digest.digest('hex'),
    files
  });
}
export function promoteAuthorizedExcludedRuntimeDependencies({repoRoot=REPO_ROOT,stage,targetSha,surfaceId}){
  const promotedIds=[...PROTECTED_SURFACE_IDS];
  if(AUTHORIZED_EXCLUDED_RUNTIME_DEPENDENCIES[surfaceId]&&!promotedIds.includes(surfaceId))promotedIds.push(surfaceId);
  const promoted=promotedIds
    .map(protectedSurfaceId=>promoteProtectedSurface({repoRoot,stage,targetSha,protectedSurfaceId,policy:AUTHORIZED_EXCLUDED_RUNTIME_DEPENDENCIES[protectedSurfaceId]}));
  if(!promoted.length)return Object.freeze({status:'NOT_REQUIRED',mode:'NOT_REQUIRED',requestedSurfaceId:surfaceId,fileCount:0,bytes:0,digest:null,files:[]});
  if(promoted.length===1)return Object.freeze({...promoted[0],requestedSurfaceId:surfaceId,protectedSurfaceCount:1});
  const files=promoted.flatMap(item=>item.files).sort((a,b)=>a.path.localeCompare(b.path));
  const digest=crypto.createHash('sha256');
  for(const item of promoted){digest.update(item.protectedSurfaceId);digest.update('\0');digest.update(item.digest);digest.update('\0');}
  return Object.freeze({
    status:'PROMOTED',mode:'PROTECTED_SURFACE_CLOSURES',readbackMode:'WORKTREE_OR_EXACT_COMMIT_OBJECT',requestedSurfaceId:surfaceId,
    protectedSurfaceCount:promoted.length,surfaces:promoted,fileCount:files.length,
    exactCommitObjectReadbackCount:files.filter(file=>file.source==='EXACT_COMMIT_OBJECT').length,
    bytes:promoted.reduce((sum,item)=>sum+item.bytes,0),digest:digest.digest('hex'),files
  });
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
  const {manifestPath,manifest}=loadSurfaceManifest(repoRoot,surfaceId);
  fs.rmSync(stage,{recursive:true,force:true});fs.mkdirSync(stage,{recursive:true});copyTree(repoRoot,stage);
  const manifestSha256=sha256(fs.readFileSync(manifestPath));
  const markerPath=path.join(stage,RELEASE_MARKER);fs.mkdirSync(path.dirname(markerPath),{recursive:true});
  writeJson(markerPath,{schema:'DGB_PUBLIC_RELEASE_MARKER_v3',commit:targetSha,surface:surfaceId,verificationManifest:`${SURFACE_DIR}/${surfaceId}.json`,verificationManifestSha256:manifestSha256});
  if(PROTECTED_SURFACE_IDS.includes('audralia'))stampAudralia(stage,targetSha);
  const authorizedExcludedRuntimeDependencies=promoteAuthorizedExcludedRuntimeDependencies({repoRoot,stage,targetSha,surfaceId});
  if(surfaceId==='brain-gen1-hra')await bindBrainAsset(stage);
  const payloadBytes=treeBytes(stage);
  const topLevelBytes=topLevelBreakdown(stage);
  if(payloadBytes>=PAGES_LIMIT_BYTES){
    const error=new Error(`PAGES_PAYLOAD_TOO_LARGE:${payloadBytes}`);
    error.code='PAGES_PAYLOAD_TOO_LARGE';error.payloadBytes=payloadBytes;error.pagesLimitBytes=PAGES_LIMIT_BYTES;error.topLevelBytes=topLevelBytes.slice(0,20);
    throw error;
  }
  return {manifest,manifestPath,manifestSha256,payloadDigest:digestTree(stage),payloadBytes,topLevelBytes,authorizedExcludedRuntimeDependencies,protectedSurfaceIds:PROTECTED_SURFACE_IDS};
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
    }catch(error){lastFailure=error?.cause?.code||error?.name||error?.message||String(error);}
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
function verificationTargets({repoRoot,manifestPath,manifest}){
  const targets=[];
  const seen=new Set();
  for(const surfaceId of [manifest.surfaceId,...PROTECTED_SURFACE_IDS]){
    if(seen.has(surfaceId))continue;
    seen.add(surfaceId);
    if(surfaceId===manifest.surfaceId)targets.push({surfaceId,manifestPath,manifest});
    else{
      const loaded=loadSurfaceManifest(repoRoot,surfaceId);
      targets.push({surfaceId,manifestPath:loaded.manifestPath,manifest:loaded.manifest});
    }
  }
  return targets;
}
async function verifyLocal({repoRoot=REPO_ROOT,stage,manifestPath,manifest}){
  const port=18000+Math.floor(Math.random()*1000);
  const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',stage],{stdio:'ignore'});
  const base=`http://127.0.0.1:${port}`;
  try{
    await waitForLocalHttpServer({url:`${base}/${RELEASE_MARKER}`,server});
    for(const target of verificationTargets({repoRoot,manifestPath,manifest})){
      await run(process.execPath,['tools/publication-live-verify.mjs','static',base,target.manifestPath]);
      if(target.manifest.runtime?.enabled===true){
        if(!process.env.CHROME_PATH)throw new Error(`CHROME_PATH_REQUIRED_FOR_RUNTIME_PREFLIGHT:${target.surfaceId}`);
        await run(process.execPath,['tools/publication-live-verify.mjs','runtime',base,target.manifestPath],process.env);
      }
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
      const {manifestPath,manifest}=loadSurfaceManifest(REPO_ROOT,surfaceId);
      const prior=JSON.parse(fs.readFileSync(receiptPath,'utf8'));
      if(prior.schema!=='PUBLICATION_FAST_PREFLIGHT_RECEIPT_v1'||prior.result!=='PAYLOAD_BUILT'||prior.targetSha!==targetSha||prior.surfaceId!==surfaceId)throw new Error('PAYLOAD_BUILD_RECEIPT_MISMATCH');
      built={manifest,manifestPath,manifestSha256:prior.manifestSha256,payloadDigest:prior.payloadDigest,payloadBytes:prior.payloadBytes,topLevelBytes:prior.topLevelBytes||[],authorizedExcludedRuntimeDependencies:prior.authorizedExcludedRuntimeDependencies||{status:'UNKNOWN',mode:'UNKNOWN',fileCount:0,bytes:0,digest:null,files:[]},protectedSurfaceIds:prior.protectedSurfaceIds||PROTECTED_SURFACE_IDS};
      await verifyLocal({repoRoot:REPO_ROOT,stage,manifestPath,manifest});
    }else{
      built=await buildPayload({targetSha,surfaceId,stage});
      if(mode==='preflight')await verifyLocal({repoRoot:REPO_ROOT,stage,manifestPath:built.manifestPath,manifest:built.manifest});
    }
    const result=mode==='build'?'PAYLOAD_BUILT':'PREFLIGHT_PASS';
    const protectedRuntimeRequired=PROTECTED_SURFACE_IDS.some(id=>loadSurfaceManifest(REPO_ROOT,id).manifest.runtime?.enabled===true);
    const runtimeRequired=built.manifest.runtime?.enabled===true||protectedRuntimeRequired;
    receipt={schema:'PUBLICATION_FAST_PREFLIGHT_RECEIPT_v1',targetSha,surfaceId,manifestSha256:built.manifestSha256,payloadDigest:built.payloadDigest,payloadBytes:built.payloadBytes,pagesLimitBytes:PAGES_LIMIT_BYTES,topLevelBytes:built.topLevelBytes,excludedPayloadRoots:PUBLIC_PAYLOAD_EXCLUDES,protectedSurfaceIds:built.protectedSurfaceIds||PROTECTED_SURFACE_IDS,authorizedExcludedRuntimeDependencies:built.authorizedExcludedRuntimeDependencies,result,checks:{exactSha:'PASS',surfaceManifest:'PASS',diffScope:'BOUNDED_PAYLOAD',requiredAssets:'PASS',environmentBinding:'PASS',authorizedRuntimeDependencyClosure:built.authorizedExcludedRuntimeDependencies.status==='PROMOTED'?'PASS':'NOT_REQUIRED',payloadBuild:'PASS',staticChecks:mode==='build'?'NOT_RUN':'PASS',runtimeReadiness:mode==='build'?'NOT_RUN':(runtimeRequired?'PASS':'NOT_REQUIRED')},deploymentPerformed:false};
    writeJson(receiptPath,receipt);console.log(JSON.stringify(receipt,null,2));
  }catch(error){receipt={schema:'PUBLICATION_FAST_PREFLIGHT_RECEIPT_v1',targetSha:targetSha||null,surfaceId:surfaceId||null,result:'PREFLIGHT_FAIL',errorCode:error?.code||null,error:String(error?.stack||error),payloadBytes:error?.payloadBytes??null,pagesLimitBytes:error?.pagesLimitBytes??PAGES_LIMIT_BYTES,topLevelBytes:error?.topLevelBytes??[],excludedPayloadRoots:PUBLIC_PAYLOAD_EXCLUDES,protectedSurfaceIds:PROTECTED_SURFACE_IDS,deploymentPerformed:false};writeJson(receiptPath,receipt);console.error(JSON.stringify(receipt,null,2));process.exitCode=1;}
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))main();