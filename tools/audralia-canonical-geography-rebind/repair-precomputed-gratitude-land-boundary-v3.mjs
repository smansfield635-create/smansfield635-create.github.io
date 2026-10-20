// Gen2829: direct RGB repair of the preserved Gen2826 buffers; never builds geometry.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createContinentalMaterialColor} from './continental-material-v2.mjs';

const ROOT=fileURLToPath(new URL('../../',import.meta.url));
const BASE=process.env.AUDRALIA_GEN2826_BASELINE_DIR;
const TARGET='showroom/globe/h-earth/terrain-estate-construction-v1/';
const TOOLS='tools/audralia-canonical-geography-rebind/';
const SNAP='inspection/audralia-24057-exact/snapshot/';
const GEO=SNAP+'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
const RENDER=SNAP+'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';
const TERRAIN=SNAP+'h-earth-3d/terrain/h-earth.terrain-field.js';
const INDEX='showroom/globe/audralia/index.html';
const HASH='305657c266ca8ce91227f31cb064b90ed9c744b68a0dcd77ef3914c3cb323c95';
const SHA=b=>crypto.createHash('sha256').update(b).digest('hex');
const gitBlob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const fail=s=>{throw Error('FAIL_CLOSED_'+s)};
const read=(root,p)=>fs.readFileSync(path.join(root,p));
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
const mix=(a,b,t)=>a.map((x,k)=>x+(b[k]-x)*t);
function pin(root,p,hash){const b=read(root,p);if(gitBlob(b)!==hash)fail('PIN:'+p);return b}
if(!BASE||process.argv.length!==2)fail('EXPLICIT_BASELINE_ENV_AND_NO_ARGUMENTS_REQUIRED');
if(path.resolve(BASE)===path.resolve(ROOT))fail('BASELINE_MUST_BE_SEPARATE');
for(const [p,hash] of [
 [TOOLS+'continental-material-v2.mjs','78316ef3fd9ed247c2423c0e0493b69714ebc399'],
 [TOOLS+'generate-precomputed-gratitude-material-v2.mjs','e98ad0117d5e1b07c5b64ffbf2da0daa0ea7c32c'],
 [TOOLS+'validate-precomputed-gratitude-material-v2.mjs','c3e378b99b2b44fc1b30f2853f82a88d028f1054'],
 [GEO,'50991dd777ccd015fd8a6d8eae7b4d02b4a8450c'],
 [TERRAIN,'f4f65b05ab303a11fb1d9c4e25de211fde73722a'],
 [TARGET+'precomputed-gratitude-mesh-v1.mjs','1000c4a56837f5ec8a06abfb51cdb3246780be77']
]){pin(ROOT,p,hash);pin(BASE,p,hash)}
const source=pin(ROOT,RENDER,'872d20b17bb0cd89d9613ca0262b25350890a617').toString();
const original=zlib.gunzipSync(read(BASE,TARGET+'gratitude-mesh-v1.bin.gz'));
if(SHA(original)!==HASH||original.length!==9169742)fail('BASELINE_PAYLOAD');
if(original.subarray(0,8).toString('ascii')!=='AUDGMV1\0')fail('FORMAT');
const counts=[1,1284360,192624,671188,143856,1598];
counts.forEach((n,i)=>{if(original.readUInt32LE(8+4*i)!==n)fail('HEADER_'+i)});
const next=Buffer.from(original),cache=new Map();
const categoryCounts={acceptedInterior:0,shoreline:0,sandbar:0,local:0,coastal:0};
const oldTag='GRATITUDE_MACRO_MATERIAL_V2_GEN2826',newTag='GRATITUDE_LAND_BOUNDARY_V3_GEN2829';
const indexBefore=read(BASE,INDEX).toString();
if(indexBefore.split(oldTag).length!==2)fail('BASELINE_LOADER_TAG');
const indexAfter=indexBefore.replace(oldTag,newTag);
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'audralia-land-rgb-v3-'));
let changedWords=0,changedVertices=0,uniqueBeachPositions=0;
try{
 const marker="from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';";
 if(source.split(marker).length!==2)fail('SAMPLER_IMPORT_MARKER');
 const samplerFile=path.join(tmp,'sampler.mjs');
 fs.writeFileSync(samplerFile,source.replace(marker,'from '+JSON.stringify(pathToFileURL(path.join(ROOT,GEO)).href)+';')+'\nexport {sampleCanonicalCoast,sampleLocalSource,macroElevation,tangentCoordinatesFromDirection,PALETTE,HYDRO};\n');
 const m=await import(pathToFileURL(samplerFile).href);
 const geo=await import(pathToFileURL(path.join(ROOT,GEO)).href);
 const field=createContinentalMaterialColor(geo.AUDRALIA_GRATITUDE_GEOGRAPHIC_PROVINCES,m.HYDRO.seaLevelY);
 for(let i=0;i<counts[1];i+=10){
  const offset=32+4*i;
  const xyz=[0,1,2].map(k=>original.readFloatLE(offset+4*k)),key=xyz.join(',');
  let sample=cache.get(key);
  if(!sample){
   const {u,v}=m.tangentCoordinatesFromDirection([xyz[0],xyz[1]+6200,xyz[2]]);
   const coast=m.sampleCanonicalCoast(u,v),local=m.sampleLocalSource(u,v-128);
   const type=coast.sandbar?.inside?'sandbar':coast.distance<=9?'shoreline':!local&&coast.distance>=144?'acceptedInterior':local?'local':'coastal';
   if(!coast.inside&&coast.distance>9)fail('NONLAND_VERTEX');
   const protectedColor=type==='sandbar'||type==='shoreline'||type==='acceptedInterior';
   let target=null,weight=0;
   if(!protectedColor){
    target=field(u,v,m.macroElevation(u,v,coast),coast);
    // Preserve the original local beach component in the natural-color target.
    const beach=Math.max(0,Math.min(1,local?.terrain?.coastline?.beachWeight??0));
    const beachContribution=.74*beach*(local?.weight??0);
    if(beachContribution>0){target=mix(target,m.PALETTE.beach,beachContribution);uniqueBeachPositions++}
    weight=smooth(9,72,coast.distance);
   }
   sample={type,target,weight};cache.set(key,sample);
  }
  categoryCounts[sample.type]++;
  if(!sample.target)continue;
  let changed=false;
  for(let k=0;k<3;k++){
   const at=offset+24+4*k,old=original.readFloatLE(at);
   const value=old+(sample.target[k]-old)*sample.weight;
   if(!Number.isFinite(value)||value<0||value>1)fail('RGB_RANGE');
   next.writeFloatLE(value,at);
   if(next.readUInt32LE(at)!==original.readUInt32LE(at)){changedWords++;changed=true}
  }
  if(changed)changedVertices++;
 }
 if(changedWords===0)fail('NO_REPAIR_DELTA');
 const baseProvenance=JSON.parse(read(BASE,TARGET+'gratitude-mesh-v1.provenance.json'));
 const parts=[],compressed=[];
 for(let offset=0,i=0;offset<next.length;offset+=1200000,i++){
  const expanded=next.subarray(offset,Math.min(offset+1200000,next.length));
  const gz=zlib.gzipSync(expanded,{level:9,mtime:0});
  const file='gratitude-mesh-v1.part-'+String(i).padStart(2,'0')+'.gz';
  compressed.push(gz);parts.push({index:i,file,expandedBytes:expanded.length,compressedBytes:gz.length,expandedSha256:SHA(expanded),compressedSha256:SHA(gz)});
 }
 if(parts.length!==8)fail('PART_COUNT');
 const full=zlib.gzipSync(next,{level:9,mtime:0});
 const generator=TOOLS+'repair-precomputed-gratitude-land-boundary-v3.mjs';
 const verifier=TOOLS+'validate-precomputed-gratitude-land-boundary-v3.mjs';
 const provenance={...baseProvenance,
  operationId:'AUDRALIA_GEN2826_LAND_COLOR_BOUNDARY_REPAIR_20261020_001',
  governingHead:'8c7f296f6fa378d139be71440b2d2cdf37971b77',
  parentCandidate:{commit:'69707b06a3ee1a3737df487060119bbc3d778c12',payloadSha256:HASH,provenanceSha256:SHA(read(BASE,TARGET+'gratitude-mesh-v1.provenance.json')),historicalSourceGoverningHead:baseProvenance.governingHead},
  generator:{path:generator,sha256:SHA(read(ROOT,generator)),deterministicGzipMtime:0,targetExpandedPartBytes:1200000,mode:'DIRECT_EXISTING_BUFFER_RGB_REPAIR_NO_GEOMETRY_GENERATION'},
  verifier:{path:verifier,sha256:SHA(read(ROOT,verifier)),ownerPhysicalAcceptance:false},
  material:{model:'GRATITUDE_MACRO_MATERIAL_V2',donorEcologyGitBlob:baseProvenance.material.donorEcologyGitBlob,modelSourceSha256:SHA(read(ROOT,TOOLS+'continental-material-v2.mjs')),eligibleLandOnly:true,colorChannels:[6,7,8],repair:'LAND_COLOR_BOUNDARY_V3',localHearthRgbRecolored:true,localGeometryProtected:true,acceptedInteriorRgbProtected:true,acceptedInteriorMinimumCoastDistance:144,shorelineUnchangedDistance:9,coastFullWeightDistance:72,blend:'CUBIC_SMOOTH_9_72_FROM_GEN2826_RGB',localBeachContribution:.74,localBeachFeatherWeightApplied:true,sandbarRgbProtected:true,provinceIds:baseProvenance.material.provinceIds},
  mesh:{...baseProvenance.mesh,payloadSha256:SHA(next),fullGzipBytes:full.length,fullGzipSha256:SHA(full),parts},
  review:{status:'OWNER_TABLET_REVIEW_PENDING',productionPublished:false}
 };
 fs.writeFileSync(path.join(ROOT,TARGET+'gratitude-mesh-v1.bin.gz'),full);
 compressed.forEach((b,i)=>fs.writeFileSync(path.join(ROOT,TARGET+parts[i].file),b));
 fs.writeFileSync(path.join(ROOT,TARGET+'gratitude-mesh-v1.provenance.json'),JSON.stringify(provenance,null,2)+'\n');
 fs.writeFileSync(path.join(ROOT,INDEX),indexAfter);
 console.log(JSON.stringify({schema:'AUDRALIA_LAND_COLOR_BOUNDARY_REPAIR_BUILD_v1',result:'GENERATED_NOT_INDEPENDENTLY_ACCEPTED',baselineSha256:HASH,candidateSha256:SHA(next),changedWords,changedVertices,categoryCounts,uniquePositions:cache.size,uniqueBeachPositions,geometryRegenerated:false,ownerPhysicalAcceptance:false},null,2));
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
