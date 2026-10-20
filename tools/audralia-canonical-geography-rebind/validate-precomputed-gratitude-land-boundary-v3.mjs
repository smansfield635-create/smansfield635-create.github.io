// Reads the immutable parent independently of the repair program; no builder imports.
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
const TERRAIN=SNAP+'h-earth-3d/terrain/h-earth.terrain-field.js';
const RENDER=SNAP+'showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs';
const HASH='305657c266ca8ce91227f31cb064b90ed9c744b68a0dcd77ef3914c3cb323c95';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const must=(test,label)=>{if(!test)throw Error('FAIL_CLOSED_'+label)};
const read=(dir,p)=>fs.readFileSync(path.join(dir,p));
const cubic=x=>{const a=Math.max(0,Math.min(1,x));return a*a*(3-2*a)};
if(!BASE||process.argv.length!==2)throw Error('FAIL_CLOSED_EXPLICIT_BASELINE_ENV_AND_NO_ARGUMENTS_REQUIRED');
must(path.resolve(BASE)!==path.resolve(ROOT),'BASELINE_SEPARATE');
for(const [p,h] of [
 [TOOLS+'continental-material-v2.mjs','78316ef3fd9ed247c2423c0e0493b69714ebc399'],
 [TOOLS+'generate-precomputed-gratitude-material-v2.mjs','e98ad0117d5e1b07c5b64ffbf2da0daa0ea7c32c'],
 [TOOLS+'validate-precomputed-gratitude-material-v2.mjs','c3e378b99b2b44fc1b30f2853f82a88d028f1054'],
 [GEO,'50991dd777ccd015fd8a6d8eae7b4d02b4a8450c'],
 [TERRAIN,'f4f65b05ab303a11fb1d9c4e25de211fde73722a'],
 [RENDER,'872d20b17bb0cd89d9613ca0262b25350890a617'],
 [TARGET+'precomputed-gratitude-mesh-v1.mjs','1000c4a56837f5ec8a06abfb51cdb3246780be77']
])for(const dir of [BASE,ROOT])must(blob(read(dir,p))===h,'PIN:'+p);
const original=zlib.gunzipSync(read(BASE,TARGET+'gratitude-mesh-v1.bin.gz'));
const full=read(ROOT,TARGET+'gratitude-mesh-v1.bin.gz'),candidate=zlib.gunzipSync(full);
must(sha(original)===HASH&&original.length===9169742,'BASELINE_IDENTITY');
must(candidate.length===original.length,'PAYLOAD_LENGTH');
must(candidate.subarray(0,32).equals(original.subarray(0,32)),'HEADER_EXACT');
const landWords=original.readUInt32LE(12),landEnd=32+landWords*4;
must(landWords===1284360&&original.readUInt32LE(16)===192624&&original.readUInt32LE(20)===671188&&original.readUInt32LE(24)===143856,'COUNTS');
// This tail contains every land index, complete water buffers, and original statistics.
must(candidate.subarray(landEnd).equals(original.subarray(landEnd)),'INDICES_WATER_STATISTICS_EXACT');
for(let i=0;i<landWords;i++)if(i%10<6||i%10===9)must(original.readUInt32LE(32+4*i)===candidate.readUInt32LE(32+4*i),'NON_RGB_WORD_'+i);
const prov=JSON.parse(read(ROOT,TARGET+'gratitude-mesh-v1.provenance.json'));
const parentProv=JSON.parse(read(BASE,TARGET+'gratitude-mesh-v1.provenance.json'));
must(prov.parentCandidate?.commit==='69707b06a3ee1a3737df487060119bbc3d778c12'&&prov.parentCandidate.payloadSha256===HASH,'PARENT_CANDIDATE');
must(prov.governingHead==='8c7f296f6fa378d139be71440b2d2cdf37971b77'&&prov.operationId==='AUDRALIA_GEN2826_LAND_COLOR_BOUNDARY_REPAIR_20261020_001','AUTHORITY_CONTEXT');
for(const name of ['canonicalGeography','canonicalTerrain','rendererGenerationSource','hydrology','loader','authority'])must(JSON.stringify(prov[name])===JSON.stringify(parentProv[name]),'PRESERVED_PROVENANCE_'+name);
must(prov.mesh.payloadSha256===sha(candidate)&&prov.mesh.payloadBytes===candidate.length,'PAYLOAD_METADATA');
must(prov.mesh.fullGzipSha256===sha(full)&&prov.mesh.fullGzipBytes===full.length,'FULL_GZIP_METADATA');
must(prov.mesh.partCount===8&&prov.mesh.parts.length===8,'PART_COUNT');
const decoded=[];
for(let i=0;i<8;i++){
 const item=prov.mesh.parts[i],name='gratitude-mesh-v1.part-'+String(i).padStart(2,'0')+'.gz';
 must(item.index===i&&item.file===name,'PART_ID');
 const compressed=read(ROOT,TARGET+name),expanded=zlib.gunzipSync(compressed);
 must(compressed.length===item.compressedBytes&&sha(compressed)===item.compressedSha256,'COMPRESSED_PART_'+i);
 must(expanded.length===item.expandedBytes&&sha(expanded)===item.expandedSha256,'EXPANDED_PART_'+i);
 must(expanded.length===(i<7?1200000:769742),'EXPANDED_PART_SIZE_'+i);
 must(compressed.readUInt32LE(4)===0,'GZIP_MTIME_'+i);decoded.push(expanded);
}
must(Buffer.concat(decoded).equals(candidate),'EIGHT_PART_REASSEMBLY');
const index='showroom/globe/audralia/index.html';
must(read(ROOT,index).equals(Buffer.from(read(BASE,index).toString().replace('GRATITUDE_MACRO_MATERIAL_V2_GEN2826','GRATITUDE_LAND_BOUNDARY_V3_GEN2829'))),'INDEX_ONLY_CACHE_TAG');
must(read(ROOT,index).toString().includes('/'+TARGET+'precomputed-gratitude-mesh-v1.mjs?cb=GRATITUDE_LAND_BOUNDARY_V3_GEN2829'),'ACTUAL_LOADER_BINDING');
must(prov.material.localHearthProtected===undefined&&prov.material.localHearthRgbRecolored===true&&prov.material.localGeometryProtected===true,'HONEST_LOCAL_ELIGIBILITY');
must(prov.material.shorelineUnchangedDistance===9&&prov.material.coastFullWeightDistance===72&&prov.material.acceptedInteriorMinimumCoastDistance===144&&prov.material.localBeachContribution===.74&&prov.material.localBeachFeatherWeightApplied===true,'FROZEN_PARAMETERS');
for(const key of ['generator','verifier'])must(sha(read(ROOT,prov[key].path))===prov[key].sha256,'SOURCE_HASH_'+key);
must(sha(read(ROOT,TOOLS+'continental-material-v2.mjs'))===prov.material.modelSourceSha256,'MODEL_SOURCE_HASH');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'audralia-boundary-independent-'));
let changedWords=0,changedVertices=0,duplicatePositions=0,localBoundaryProbes=0;
const categories={acceptedInterior:0,shoreline:0,sandbar:0,local:0,coastal:0};
try{
 const source=read(ROOT,RENDER).toString(),marker="from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';";
 must(source.split(marker).length===2,'IMPORT_MARKER');
 const file=path.join(tmp,'sampler.mjs');
 fs.writeFileSync(file,source.replace(marker,'from '+JSON.stringify(pathToFileURL(path.join(ROOT,GEO)).href)+';')+'\nexport {sampleCanonicalCoast,sampleLocalSource,macroElevation,tangentCoordinatesFromDirection,sampleCanonicalGratitude,PALETTE,HYDRO,CANONICAL_SOURCE_DOMAIN};\n');
 const sampler=await import(pathToFileURL(file).href),geo=await import(pathToFileURL(path.join(ROOT,GEO)).href);
 const field=createContinentalMaterialColor(geo.AUDRALIA_GRATITUDE_GEOGRAPHIC_PROVINCES,sampler.HYDRO.seaLevelY);
 const positions=new Map(),colors=new Map();
 for(let i=0;i<landWords;i+=10){
  const offset=32+4*i,xyz=[0,1,2].map(k=>original.readFloatLE(offset+4*k)),key=xyz.join(',');
  let p=positions.get(key);
  if(!p){
   const {u,v}=sampler.tangentCoordinatesFromDirection([xyz[0],xyz[1]+6200,xyz[2]]);
   const coast=sampler.sampleCanonicalCoast(u,v),local=sampler.sampleLocalSource(u,v-128);
   const type=coast.sandbar?.inside?'sandbar':coast.distance<=9?'shoreline':local?'local':coast.distance>=144?'acceptedInterior':'coastal';
   const natural=field(u,v,sampler.macroElevation(u,v,coast),coast);
   const sandAmount=.74*Math.min(1,Math.max(0,local?.terrain?.coastline?.beachWeight??0))*(local?.weight??0);
   p={type,weight:cubic((coast.distance-9)/63),target:natural.map((x,k)=>x+(sampler.PALETTE.beach[k]-x)*sandAmount)};positions.set(key,p);
  }else duplicatePositions++;
  categories[p.type]++;
  const keep=['acceptedInterior','shoreline','sandbar'].includes(p.type);
  let changed=false;
  for(let k=0;k<3;k++){
   const at=offset+24+k*4,a=original.readFloatLE(at),b=candidate.readFloatLE(at);
   must(Number.isFinite(b)&&b>=0&&b<=1,'FINITE_RGB_'+i);
   if(keep)must(original.readUInt32LE(at)===candidate.readUInt32LE(at),'PROTECTED_RGB_'+i);
   else must(Object.is(b,Math.fround(a+(p.target[k]-a)*p.weight)),'EXPECTED_BLEND_'+i+'_'+k);
   if(original.readUInt32LE(at)!==candidate.readUInt32LE(at)){changedWords++;changed=true}
  }
  if(changed)changedVertices++;
  const rgb=candidate.subarray(offset+24,offset+36).toString('hex');
  if(colors.has(key))must(colors.get(key)===rgb,'DUPLICATE_VERTEX_COLOR_SEAM');else colors.set(key,rgb);
 }
 must(categories.acceptedInterior===40116&&categories.shoreline===7726&&categories.sandbar===1282&&categories.local===46460&&categories.coastal===32852,'FROZEN_DOMAIN_COUNTS');
 must(changedWords>0&&changedVertices>0,'REPAIR_DELTA_REQUIRED');
 // Full-weight new color must approach the same field on both sides of the old local-null edge.
 const d=sampler.CANONICAL_SOURCE_DOMAIN,eps=.001;
 const naturalAt=(x,z)=>{
  const v=z+128,coast=sampler.sampleCanonicalCoast(x,v),local=sampler.sampleLocalSource(x,z);
  if(!coast.inside||coast.distance<144||coast.sandbar?.inside)return null;
  const natural=field(x,v,sampler.macroElevation(x,v,coast),coast),sand=.74*Math.max(0,Math.min(1,local?.terrain?.coastline?.beachWeight??0))*(local?.weight??0);
  return natural.map((a,k)=>a+(sampler.PALETTE.beach[k]-a)*sand);
 };
 for(let j=0;j<=16;j++){
  const x=d.xMin+(d.xMax-d.xMin)*j/16,z=d.zMin+(d.zMax-d.zMin)*j/16;
  const pairs=[[[d.xMin-150-eps,z],[d.xMin-150+eps,z]],[[d.xMax+150-eps,z],[d.xMax+150+eps,z]],[[x,d.zMin-150-eps],[x,d.zMin-150+eps]],[[x,d.zMax+150-eps],[x,d.zMax+150+eps]]];
  for(const [a,b] of pairs){const ca=naturalAt(...a),cb=naturalAt(...b);if(!ca||!cb)continue;must(Math.max(...ca.map((q,k)=>Math.abs(q-cb[k])))<.0001,'LOCAL_NULL_COLOR_JUMP');localBoundaryProbes++}
 }
 must(localBoundaryProbes>=4,'LOCAL_EDGE_PROBES_PRESENT');
 // The exact cubic join has zero correction at 9, full correction at 72,
 // and continuous values approaching both endpoints from either side.
 for(const distance of [9,72]){
  const center=cubic((distance-9)/63),left=cubic((distance-1e-5-9)/63),right=cubic((distance+1e-5-9)/63);
  must((distance===9?center===0:center===1)&&Math.abs(left-right)<1e-9,'COAST_BLEND_JOIN_'+distance);
 }
 console.log(JSON.stringify({schema:'AUDRALIA_LAND_COLOR_BOUNDARY_REPAIR_VERIFICATION_v1',result:'PASS_BUFFER_AND_BOUNDARY_CHECKS',baselineSha256:HASH,candidateSha256:sha(candidate),categories,changedWords,changedVertices,uniquePositions:positions.size,duplicatePositions,localBoundaryProbes,nonRgbWordDeltas:0,waterAndIndexAndStatisticsByteDeltas:0,acceptedInteriorRgbDeltas:0,shorelineAndSandbarRgbDeltas:0,eightPartsReassembled:true,ownerPhysicalAcceptance:false,productionPublished:false},null,2));
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
