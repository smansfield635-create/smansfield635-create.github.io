#!/usr/bin/env node
// Independent byte-boundary and native actual-loader verification; writes nothing.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash,webcrypto} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath,pathToFileURL} from 'node:url';
const ROOT=fileURLToPath(new URL('../../',import.meta.url));
const BASE=process.env.AUDRALIA_COASTAL_EARTH_BASELINE_DIR;
assert.ok(BASE&&path.resolve(BASE)!==path.resolve(ROOT),'explicit separate immutable baseline required');
const TARGET='showroom/globe/h-earth/terrain-estate-construction-v1/';
const SNAP='inspection/audralia-24057-exact/snapshot/';
const GEO=SNAP+'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const RENDER=SNAP+'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';
const INDEX='showroom/globe/audralia/index.html';
const OLD='f136a8c696e38ef72e062bb69ae8e5a625000cc88ab436967f4df766637cee28';
const read=(root,p)=>fs.readFileSync(path.join(root,p));
const sha=b=>createHash('sha256').update(b).digest('hex');
const blob=b=>createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const a=gunzipSync(read(BASE,TARGET+'gratitude-mesh-v1.bin.gz')),b=gunzipSync(read(ROOT,TARGET+'gratitude-mesh-v1.bin.gz'));
assert.equal(sha(a),OLD);assert.equal(b.length,a.length);assert.notEqual(sha(b),OLD);
assert.deepEqual(b.subarray(0,32),a.subarray(0,32),'header unchanged');
const p=JSON.parse(read(ROOT,TARGET+'gratitude-mesh-v1.provenance.json')),oldP=JSON.parse(read(BASE,TARGET+'gratitude-mesh-v1.provenance.json'));
assert.equal(p.operationId,'AUDRALIA_COASTAL_EARTH_RING_REPAIR_V4_20261020_001');assert.equal(p.mesh.payloadSha256,sha(b));assert.equal(p.parentCandidate.payloadSha256,OLD);
assert.equal(p.mesh.fullGzipSha256,sha(read(ROOT,TARGET+'gratitude-mesh-v1.bin.gz')));
assert.equal(p.mesh.fullGzipBytes,read(ROOT,TARGET+'gratitude-mesh-v1.bin.gz').length);
for(const key of ['canonicalGeography','canonicalTerrain','rendererGenerationSource','hydrology','authority'])assert.deepEqual(p[key],oldP[key],key+' unchanged');
for(const spec of [p.generator,p.verifier])assert.equal(sha(read(ROOT,spec.path)),spec.sha256,'source digest '+spec.path);
assert.equal(blob(read(ROOT,RENDER)),'872d20b17bb0cd89d9613ca0262b25350890a617');assert.equal(blob(read(ROOT,GEO)),'50991dd777ccd015fd8a6d8eae7b4d02b4a8450c');
assert.deepEqual(read(ROOT,TARGET+'precomputed-gratitude-mesh-v1.mjs'),read(BASE,TARGET+'precomputed-gratitude-mesh-v1.mjs'),'loader unchanged');
const landEnd=32+a.readUInt32LE(12)*4;
assert.deepEqual(b.subarray(landEnd),a.subarray(landEnd),'ALL land indices/water/indices/statistics unchanged');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'audralia-earth-independent-'));
const report={changedVertices:0,changedRgbWords:0,protectedInteriorVertices:0,protectedSandbarVertices:0,protectedPaleBeachVertices:0,coastalGreenBefore:0,coastalGreenAfter:0,coastalEarthBefore:0,coastalEarthAfter:0,coastalVertices:0,nearShoreGreenAfter:0,nearShoreEarthAfter:0,duplicatePositionVertices:0,protectedSandbarOutsideBoundaryVertices:0,maxBaselineDuplicateSpread:0,maxCandidateDuplicateSpread:0};
try{
 const source=read(ROOT,RENDER).toString(),marker="from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';";
 assert.equal(source.split(marker).length,2);
 const sampler=path.join(temp,'sampler.mjs');fs.writeFileSync(sampler,source.replace(marker,'from '+JSON.stringify(pathToFileURL(path.join(ROOT,GEO)).href)+';')+'\nexport {sampleCanonicalCoast,tangentCoordinatesFromDirection,SANDBARS};\n');
 const m=await import(pathToFileURL(sampler).href),samples=new Map(),duplicates=new Map(),sandbarIds=new Set(m.SANDBARS.map(bar=>bar.id)),sandbarBoundaryRegression=[];
 for(let at=32;at<landEnd;at+=40){
  assert.deepEqual(b.subarray(at,at+24),a.subarray(at,at+24),'position and normal unchanged');assert.deepEqual(b.subarray(at+36,at+40),a.subarray(at+36,at+40),'alpha unchanged');
  const xyz=[0,1,2].map(k=>a.readFloatLE(at+4*k)),key=xyz.join(','),old=[0,1,2].map(k=>a.readFloatLE(at+24+4*k)),next=[0,1,2].map(k=>b.readFloatLE(at+24+4*k));
  let coast=samples.get(key);if(!coast){const {u,v}=m.tangentCoordinatesFromDirection([xyz[0],xyz[1]+6200,xyz[2]]);coast=m.sampleCanonicalCoast(u,v);samples.set(key,coast)}
  const sandbar=Boolean(coast.sandbar?.inside)||sandbarIds.has(coast.component),beach=old[0]>=.50&&old[0]>old[1]&&old[1]>old[2];
  if(coast.distance>=144||sandbar||beach){assert.deepEqual(b.subarray(at+24,at+36),a.subarray(at+24,at+36),'protected RGB unchanged');if(coast.distance>=144)report.protectedInteriorVertices++;else if(sandbar)report.protectedSandbarVertices++;else report.protectedPaleBeachVertices++}
  if(sandbar&&!coast.inside)report.protectedSandbarOutsideBoundaryVertices++;
  const vertex=(at-32)/40;
  if(vertex===127210||vertex===127211){assert.equal(coast.component,'BAY_MOUTH_SANDBAR');assert.equal(coast.inside,vertex===127211);assert.equal(sandbar,true,'authoritative component protects both Float32 boundary sides');assert.deepEqual(b.subarray(at+24,at+36),a.subarray(at+24,at+36),'exact previously failed boundary RGB preserved');sandbarBoundaryRegression.push({vertex,component:coast.component,inside:coast.inside,distance:coast.distance,rgbUnchanged:true})}
  let changed=false;for(let k=0;k<3;k++){assert.ok(Number.isFinite(next[k])&&next[k]>=0&&next[k]<=1,'finite unit RGB');if(a.readUInt32LE(at+24+4*k)!==b.readUInt32LE(at+24+4*k)){report.changedRgbWords++;changed=true}}
  if(changed){report.changedVertices++;assert.ok(coast.distance<144&&!sandbar&&!beach,'only admitted coastal RGB changed')}
  if(coast.distance<144&&!sandbar){report.coastalVertices++;report.coastalGreenBefore+=Number(old[1]>old[0]);report.coastalGreenAfter+=Number(next[1]>next[0]);report.coastalEarthBefore+=Number(old[0]>old[1]&&old[1]>old[2]);report.coastalEarthAfter+=Number(next[0]>next[1]&&next[1]>next[2]);if(coast.distance<36&&!beach){report.nearShoreGreenAfter+=Number(next[1]>next[0]);report.nearShoreEarthAfter+=Number(next[0]>next[1]&&next[1]>next[2])}}
  const prior=duplicates.get(key);if(prior){report.duplicatePositionVertices++;const before=Math.max(...old.map((x,k)=>Math.abs(x-prior.old[k]))),after=Math.max(...next.map((x,k)=>Math.abs(x-prior.next[k])));report.maxBaselineDuplicateSpread=Math.max(report.maxBaselineDuplicateSpread,before);report.maxCandidateDuplicateSpread=Math.max(report.maxCandidateDuplicateSpread,after);assert.ok(after<=before+1e-7,'no increased RGB discontinuity at shared positions')}else duplicates.set(key,{old,next});
 }
 assert.equal(sandbarBoundaryRegression.length,2);assert.ok(report.protectedSandbarOutsideBoundaryVertices>0);report.sandbarBoundaryRegression=sandbarBoundaryRegression;
 assert.ok(report.changedVertices>0);assert.ok(report.coastalEarthAfter>report.coastalEarthBefore,'earth patches increase');assert.ok(report.coastalGreenAfter<report.coastalGreenBefore,'green halo reduced');assert.ok(report.nearShoreGreenAfter>0&&report.nearShoreEarthAfter>0,'shore-adjacent vegetation and earth both retained');
}finally{fs.rmSync(temp,{recursive:true,force:true})}
const parts=[];assert.equal(p.mesh.parts.length,8);
for(let i=0;i<8;i++){const part=p.mesh.parts[i];assert.equal(part.index,i);assert.equal(part.file,'gratitude-mesh-v1.part-'+String(i).padStart(2,'0')+'.gz');const gz=read(ROOT,TARGET+part.file),raw=gunzipSync(gz);assert.equal(gz.length,part.compressedBytes);assert.equal(raw.length,part.expandedBytes);assert.equal(sha(gz),part.compressedSha256);assert.equal(sha(raw),part.expandedSha256);parts.push(raw)}
assert.deepEqual(Buffer.concat(parts),b,'all8parts equal complete candidate');
assert.equal(read(ROOT,INDEX).toString(),read(BASE,INDEX).toString().replace(OLD,sha(b)).replace('GRATITUDE_EXACT_MESH_DELIVERY_GEN2833','GRATITUDE_COASTAL_EARTH_V4_GEN2835'),'entry has exactly digest/tag substitutions');
const loaderUrl=pathToFileURL(path.join(ROOT,TARGET+'precomputed-gratitude-mesh-v1.mjs')),originalGlobals=new Map(['fetch','window','location','crypto'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)])),loaderCases=[];
try{
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:webcrypto});const {loadPrecomputedGratitudeMesh}=await import(loaderUrl.href);
 const run=async(name,metadata,error,fetchCount,corrupt=false)=>{const calls=[];globalThis.window={};globalThis.location={origin:loaderUrl.origin};globalThis.fetch=async(input,init)=>{const url=new URL(input);calls.push(url.href);assert.equal(url.searchParams.get('mesh'),sha(b));assert.equal(init?.cache,'force-cache');const file=path.basename(url.pathname);if(file==='gratitude-mesh-v1.provenance.json')return new Response(JSON.stringify(metadata));assert.ok(p.mesh.parts.some(part=>part.file===file));const bytes=Buffer.from(read(ROOT,TARGET+file));if(corrupt&&file.endsWith('00.gz'))bytes[30]^=1;return new Response(bytes)};
  if(error){await assert.rejects(()=>loadPrecomputedGratitudeMesh({expectedPayloadSha256:sha(b)}),e=>e.message===error);assert.equal(window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__,undefined)}else{const mesh=await loadPrecomputedGratitudeMesh({expectedPayloadSha256:sha(b)});assert.equal(mesh.authority.meshPayloadSha256,sha(b));assert.equal(mesh.verifiedChunkCount,8);const land=Buffer.from(mesh.landMesh.vertices.buffer,mesh.landMesh.vertices.byteOffset,mesh.landMesh.vertices.byteLength);assert.deepEqual(land,b.subarray(32,landEnd));const waterStart=landEnd+mesh.landMesh.indices.byteLength,water=Buffer.from(mesh.coastalWaterMesh.vertices.buffer,mesh.coastalWaterMesh.vertices.byteOffset,mesh.coastalWaterMesh.vertices.byteLength);assert.deepEqual(water,b.subarray(waterStart,waterStart+water.length))}assert.equal(calls.length,fetchCount);loaderCases.push({name,result:'PASS',fetchCount:calls.length})};
 await run('actual new candidate accepted with9versionedURLs',p,null,9);
 await run('stale f136 provenance rejected before chunks',oldP,'AUDRALIA_MESH_EXPECTED_PAYLOAD_MISMATCH',1);
 await run('corrupted candidate chunk rejected',p,'AUDRALIA_MESH_PART_0_COMPRESSED_DIGEST_INVALID',2,true);
}finally{for(const[k,d]of originalGlobals){if(d)Object.defineProperty(globalThis,k,d);else delete globalThis[k]}}
console.log(JSON.stringify({result:'PASS_NATIVE_COASTAL_EARTH_V4',baselineSha256:OLD,candidateSha256:sha(b),report,allNonRgbBytesUnchanged:true,interior144AndSandbarAndPaleBeachRgbUnchanged:true,eightPartsEqualFullPayload:true,entryOnlyDigestAndTagChanged:true,loaderCases,nativeBrowserExecuted:false,ownerPhysicalAcceptance:false},null,2));
