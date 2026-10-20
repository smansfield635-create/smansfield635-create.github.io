#!/usr/bin/env node
// Gen2835: bounded direct RGB edit of accepted f136 buffers. No geometry build.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {fileURLToPath,pathToFileURL} from 'node:url';

const ROOT=fileURLToPath(new URL('../../',import.meta.url));
const BASE=process.env.AUDRALIA_COASTAL_EARTH_BASELINE_DIR;
const TARGET='showroom/globe/h-earth/terrain-estate-construction-v1/';
const INDEX='showroom/globe/audralia/index.html';
const SNAP='inspection/audralia-24057-exact/snapshot/';
const RENDER=SNAP+'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';
const GEO=SNAP+'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const ORIGINAL='f136a8c696e38ef72e062bb69ae8e5a625000cc88ab436967f4df766637cee28';
const GENERATOR='tools/audralia-canonical-geography-rebind/repair-precomputed-gratitude-coastal-earth-v4.mjs';
const VERIFIER='tools/audralia-canonical-geography-rebind/validate-precomputed-gratitude-coastal-earth-v4.mjs';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const fail=s=>{throw Error('FAIL_CLOSED_'+s)};
const read=(root,p)=>fs.readFileSync(path.join(root,p));
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
const mix=(a,b,t)=>a.map((x,k)=>x+(b[k]-x)*t);
// Smooth seeded value noise: fixed seed, no RNG, no distance contours.
function noise(u,v,scale){
 const x=u/scale,z=v/scale,ix=Math.floor(x),iz=Math.floor(z);
 const h=(a,b)=>{let n=Math.imul(a,374761393)^Math.imul(b,668265263)^2835;n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295};
 const tx=smooth(0,1,x-ix),tz=smooth(0,1,z-iz);
 return (h(ix,iz)*(1-tx)+h(ix+1,iz)*tx)*(1-tz)+(h(ix,iz+1)*(1-tx)+h(ix+1,iz+1)*tx)*tz;
}
const EARTH={compactEarth:[.390,.248,.148],coastalSilt:[.520,.440,.270],fertileEarth:[.300,.235,.155],shelteredEarth:[.235,.188,.130],dryFoothill:[.480,.315,.140],erodedMineral:[.355,.333,.305]};
if(!BASE||process.argv.length!==2||path.resolve(BASE)===path.resolve(ROOT))fail('SEPARATE_EXPLICIT_BASELINE_REQUIRED');
for(const [p,pin] of [[RENDER,'872d20b17bb0cd89d9613ca0262b25350890a617'],[GEO,'50991dd777ccd015fd8a6d8eae7b4d02b4a8450c'],[TARGET+'precomputed-gratitude-mesh-v1.mjs','a0233d6c49fa095b99ace977fe0e3a5ca79403de']]){
 if(blob(read(ROOT,p))!==pin||blob(read(BASE,p))!==pin)fail('SOURCE_PIN:'+p);
}
const original=zlib.gunzipSync(read(BASE,TARGET+'gratitude-mesh-v1.bin.gz'));
if(sha(original)!==ORIGINAL||original.length!==9169742||original.subarray(0,8).toString('ascii')!=='AUDGMV1\0')fail('BASELINE_PAYLOAD');
[1,1284360,192624,671188,143856,1598].forEach((n,i)=>{if(original.readUInt32LE(8+4*i)!==n)fail('HEADER_'+i)});
const next=Buffer.from(original),cache=new Map(),counts={changedVertices:0,changedWords:0,protectedInterior:0,protectedSandbar:0,protectedBeach:0,eligible:0};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'audralia-coastal-earth-v4-'));
try{
 const source=read(ROOT,RENDER).toString(),marker="from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';";
 if(source.split(marker).length!==2)fail('SAMPLER_IMPORT');
 const sampler=path.join(temp,'sampler.mjs');
 fs.writeFileSync(sampler,source.replace(marker,'from '+JSON.stringify(pathToFileURL(path.join(ROOT,GEO)).href)+';')+'\nexport {sampleCanonicalCoast,sampleLocalSource,tangentCoordinatesFromDirection,HYDRO,SANDBARS};\n');
 const m=await import(pathToFileURL(sampler).href),sandbarIds=new Set(m.SANDBARS.map(bar=>bar.id));
 for(let i=0;i<1284360;i+=10){
  const at=32+4*i,xyz=[0,1,2].map(k=>original.readFloatLE(at+4*k)),old=[0,1,2].map(k=>original.readFloatLE(at+24+4*k));
  const key=xyz.join(',');let s=cache.get(key);
  if(!s){const direction=[xyz[0],xyz[1]+6200,xyz[2]],radius=Math.hypot(...direction),{u,v}=m.tangentCoordinatesFromDirection(direction),coast=m.sampleCanonicalCoast(u,v);
   if(!coast.inside&&coast.distance>9)fail('NONLAND_VERTEX');
   const normal=[0,1,2].map(k=>original.readFloatLE(at+12+4*k)),normalLength=Math.hypot(...normal)||1;
   const radialDot=clamp(normal.reduce((sum,n,k)=>sum+n*direction[k]/radius,0)/normalLength),slope=Math.sqrt(Math.max(0,1-radialDot*radialDot));
   const local=m.sampleLocalSource(u,v-128),terrain=local?.terrain,forest=clamp((terrain?.biome?.forestWeight??0)*(local?.weight??0));
   const wet=clamp(Math.max(terrain?.hydrology?.riverWeight??0,terrain?.hydrology?.lakeWeight??0)*(local?.weight??0));
   const exposure=clamp(.5+.25*Math.sin(u*.0027-v*.0019)+.25*(noise(u,v,480)*2-1));
   const width=96+48*noise(u,v,180),elevation=clamp((radius-6200-m.HYDRO.seaLevelY)/50);
   const patch=smooth(.30,.70,noise(u,v,220)+.28*(noise(u,v,70)-.5)+.10*(exposure-.5)+.10*slope);
   let earth=mix(EARTH.coastalSilt,EARTH.compactEarth,clamp(.55*elevation+.35*exposure));
   earth=mix(earth,EARTH.fertileEarth,.35*forest);
   earth=mix(earth,EARTH.shelteredEarth,.40*forest*(1-exposure));
   earth=mix(earth,EARTH.dryFoothill,.42*exposure*noise(u,v,260));
   earth=mix(earth,EARTH.erodedMineral,.70*smooth(.08,.45,slope));
   // Patch weight can be exactly zero beside water. Existing vegetation remains
   // between irregular earth patches; neither palette nor support is a fixed belt.
   const weight=.96*(1-smooth(0,width,coast.distance))*patch*(1-.72*forest)*(1-.80*wet);
   s={distance:coast.distance,sandbar:Boolean(coast.sandbar?.inside)||sandbarIds.has(coast.component),earth,weight};cache.set(key,s);
  }
  if(s.distance>=144){counts.protectedInterior++;continue}
  if(s.sandbar){counts.protectedSandbar++;continue}
  // Preserve the accepted pale sand/beach RGB rather than painting it brown.
  if(old[0]>=.50&&old[0]>old[1]&&old[1]>old[2]){counts.protectedBeach++;continue}
  counts.eligible++;
  if(s.weight===0)continue;
  let changed=false;
  for(let k=0;k<3;k++){const p=at+24+4*k,value=old[k]+(s.earth[k]-old[k])*s.weight;if(!Number.isFinite(value)||value<0||value>1)fail('RGB_RANGE');next.writeFloatLE(value,p);if(next.readUInt32LE(p)!==original.readUInt32LE(p)){counts.changedWords++;changed=true}}
  if(changed)counts.changedVertices++;
 }
 if(counts.changedVertices===0)fail('NO_DELTA');
 const parts=[],compressed=[];
 for(let offset=0,i=0;offset<next.length;offset+=1200000,i++){const expanded=next.subarray(offset,Math.min(offset+1200000,next.length)),gz=zlib.gzipSync(expanded,{level:9,mtime:0}),file='gratitude-mesh-v1.part-'+String(i).padStart(2,'0')+'.gz';compressed.push(gz);parts.push({index:i,file,expandedBytes:expanded.length,compressedBytes:gz.length,expandedSha256:sha(expanded),compressedSha256:sha(gz)})}
 if(parts.length!==8)fail('PART_COUNT');
 const full=zlib.gzipSync(next,{level:9,mtime:0}),baseProvenance=JSON.parse(read(BASE,TARGET+'gratitude-mesh-v1.provenance.json'));
 const provenance={...baseProvenance,operationId:'AUDRALIA_COASTAL_EARTH_RING_REPAIR_V4_20261020_001',governingHead:'651face00d5687a22b710925141dbebc58165f5e',parentCandidate:{commit:'d20700ecb0e1e4b7a0ba3c03cf4f1c67d2632dfe',payloadSha256:ORIGINAL,provenanceSha256:sha(read(BASE,TARGET+'gratitude-mesh-v1.provenance.json'))},generator:{path:GENERATOR,sha256:sha(read(ROOT,GENERATOR)),deterministicGzipMtime:0,targetExpandedPartBytes:1200000,mode:'DIRECT_EXISTING_BUFFER_RGB_REPAIR_NO_GEOMETRY_GENERATION'},verifier:{path:VERIFIER,sha256:sha(read(ROOT,VERIFIER)),ownerPhysicalAcceptance:false},loader:{...baseProvenance.loader,gitBlobShaBeforeFinalCommit:'a0233d6c49fa095b99ace977fe0e3a5ca79403de'},material:{...baseProvenance.material,repair:'PATCHY_COASTAL_EARTH_V4',sourcePayloadSha256:ORIGINAL,earthPaletteReferenceGitBlob:'a6e1d794faabee033be4404f87fcdc6a8d715e45',earthPalette:EARTH,acceptedInteriorRgbProtected:true,acceptedInteriorMinimumCoastDistance:144,shorelineUnchangedDistance:0,coastFullWeightDistance:null,blend:'SPATIAL_EARTH_VEGETATION_PATCHES_WITH_VARIABLE_96_144_CUBIC_DECAY',sandbarRgbProtected:true,paleBeachRgbProtected:true,noiseSeed:2835,existingElevationAndNormalsUsedReadOnly:true},mesh:{...baseProvenance.mesh,payloadSha256:sha(next),fullGzipBytes:full.length,fullGzipSha256:sha(full),parts},review:{status:'OWNER_TABLET_REVIEW_PENDING',productionPublished:false}};
 const before=read(BASE,INDEX).toString(),oldTag='GRATITUDE_EXACT_MESH_DELIVERY_GEN2833',newTag='GRATITUDE_COASTAL_EARTH_V4_GEN2835';
 if(before.split(ORIGINAL).length!==2||before.split(oldTag).length!==2)fail('BASELINE_ENTRY');
 const after=before.replace(ORIGINAL,sha(next)).replace(oldTag,newTag);
 fs.writeFileSync(path.join(ROOT,TARGET+'gratitude-mesh-v1.bin.gz'),full);compressed.forEach((b,i)=>fs.writeFileSync(path.join(ROOT,TARGET+parts[i].file),b));
 fs.writeFileSync(path.join(ROOT,TARGET+'gratitude-mesh-v1.provenance.json'),JSON.stringify(provenance,null,2)+'\n');fs.writeFileSync(path.join(ROOT,INDEX),after);
 console.log(JSON.stringify({result:'GENERATED_PENDING_INDEPENDENT_REVIEW',baselineSha256:ORIGINAL,candidateSha256:sha(next),counts,uniquePositions:cache.size,geometryRegenerated:false,ownerPhysicalAcceptance:false},null,2));
}finally{fs.rmSync(temp,{recursive:true,force:true})}
