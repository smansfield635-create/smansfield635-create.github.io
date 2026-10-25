import {fetchStartupAsset} from './precomputed-oasis-soil.v1.js';
import {GRASS_CONTINUITY_ALLOCATION as allocation} from './grass-continuity-supplement.v1.js';
/** Lossless, hash-bound output of the accepted ground-admission compiler. */
const MANIFEST_SHA256='9d452a0906094e6e5ed828753e547ef24269afa173896453637b77832c6c3edf';
const fail=reason=>{throw Error('PRECOMPUTED_GRASS_'+reason);};
const sha=async bytes=>Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
export async function decodePrecomputedGrass(manifest,bytes,{yieldControl=async()=>{},onProgress=()=>{}}={}){
 if(manifest.schema!=='H_EARTH_PRECOMPUTED_GRASS_v1'||manifest.rootCount!==2858738||manifest.stride!==52||manifest.receipt?.contactCount!==2858738)fail('IDENTITY_MISMATCH');
 if(bytes.byteLength!==manifest.rawBytes||await sha(bytes)!==manifest.rawSha256)fail('DATA_INTEGRITY');
 const h=manifest.habitat;
 if(h?.width!==576||h.height!==192||h.size!==192||bytes.byteLength!==manifest.rootCount*52+h.width*h.height)fail('LAYOUT_MISMATCH');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),tiles=[];let index=0;
 for(const tile of manifest.tiles){
  if(!Number.isInteger(tile.count)||tile.count<1||tile.count>1600||index+tile.count>manifest.rootCount)fail('TILE_COUNT');
  if(!Number.isInteger(tile.baselineCount)||tile.baselineCount<0||tile.baselineCount>tile.count)fail('TILE_BASELINE_COUNT');
  const roots=new Array(tile.count);
  for(let j=0;j<tile.count;j++,index++){
   const o=index*52,region=view.getUint32(o+48,true);
   if(region>2)fail('REGION');
   roots[j]={x:view.getFloat64(o,true),y:view.getFloat64(o+8,true),z:view.getFloat64(o+16,true),angle:view.getFloat64(o+24,true),slope:view.getFloat64(o+32,true),seed:view.getUint32(o+40,true),triangleId:view.getUint32(o+44,true),...(region?{region:region===1?'RAVINE':'RAVINE_SUPPLEMENT'}:{})};
  }
  tiles.push({id:tile.id,minX:tile.minX,minZ:tile.minZ,baselineCount:tile.baselineCount,roots});
  if((tiles.length&255)===0){onProgress({phase:'SINGLE_POPULATION_DECODING',loadedContacts:index,totalContacts:manifest.rootCount});await yieldControl();}
 }
 if(index!==manifest.rootCount)fail('ROOT_COUNT');
 return{tiles,receipt:manifest.receipt,habitat:{...h,pixels:new Uint8Array(bytes.subarray(index*52))}};
}
// Only the pinned, fully authenticated loader can create a trusted plan. Taking it
// transfers ownership once; caller-provided metadata never authorizes this path.
const packedPlans=new WeakMap();
export function takePrecomputedGrassPlan(presentation){
 const plan=packedPlans.get(presentation);packedPlans.delete(presentation);return plan;
}
async function decodePackedGrass(manifest,bytes,{yieldControl=async()=>{},onProgress=()=>{}}={}){
 if(manifest.schema!=='H_EARTH_PRECOMPUTED_GRASS_v1'||manifest.rootCount!==2858738||manifest.stride!==52||manifest.receipt?.contactCount!==2858738)fail('IDENTITY_MISMATCH');
 if(bytes.byteLength!==manifest.rawBytes||await sha(bytes)!==manifest.rawSha256)fail('DATA_INTEGRITY');
 const h=manifest.habitat;
 if(h?.width!==576||h.height!==192||h.size!==192||bytes.byteLength!==manifest.rootCount*52+h.width*h.height)fail('LAYOUT_MISMATCH');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),tiles=[],tileIds=new Set(),controlRoots=[];
 let index=0,woodlandRoots=0,ravineRoots=0;
 for(const tile of manifest.tiles){
  if(typeof tile.id!=='string'||tileIds.has(tile.id)||!Number.isFinite(tile.minX)||!Number.isFinite(tile.minZ))fail('TILE_INVALID');
  tileIds.add(tile.id);
  if(!Number.isInteger(tile.count)||tile.count<1||tile.count>1600||index+tile.count>manifest.rootCount)fail('TILE_COUNT');
  if(!Number.isInteger(tile.baselineCount)||tile.baselineCount<0||tile.baselineCount>tile.count)fail('TILE_BASELINE_COUNT');
  const first=index,packed=new Float32Array(tile.count*4);
  for(let j=0;j<tile.count;j++,index++){
   const o=index*52,region=view.getUint32(o+48,true);
   if(region>2)fail('REGION');
   const x=view.getFloat64(o,true),y=view.getFloat64(o+8,true),z=view.getFloat64(o+16,true),angle=view.getFloat64(o+24,true),slope=view.getFloat64(o+32,true);
   const fx=Math.fround(x),fy=Math.fround(y),fz=Math.fround(z),fa=Math.fround(angle);
   if(!Number.isFinite(fx)||!Number.isFinite(fy)||!Number.isFinite(fz)||!Number.isFinite(fa)||!Number.isFinite(slope))fail('ROOT_NONFINITE');
   if(x<tile.minX||x>=tile.minX+4||z<tile.minZ||z>=tile.minZ+4)fail('ROOT_OUTSIDE_TILE');
   if(region)ravineRoots++;else woodlandRoots++;
   if(woodlandRoots>450000||ravineRoots>allocation.maximumRavineRoots||index+1>allocation.maximumRoots||(index+1)*16>allocation.maximumPackedBytes)fail('POPULATION_GPU_BUDGET_EXCEEDED');
   packed[j*4]=fx;packed[j*4+1]=fy;packed[j*4+2]=fz;packed[j*4+3]=fa;
   if(Math.hypot(fx+139.40267987050615,fz+194.5)<=2)controlRoots.push(`${fx}:${fy}:${fz}:${view.getUint32(o+40,true)}`);
  }
  tiles.push(Object.freeze({id:tile.id,minX:tile.minX,minZ:tile.minZ,packed,count:tile.count,baselineCount:tile.baselineCount,first}));
  if((tiles.length&15)===0){onProgress({phase:'SINGLE_POPULATION_DECODING',loadedContacts:index,totalContacts:manifest.rootCount});await yieldControl();}
 }
 if(index!==manifest.rootCount)fail('ROOT_COUNT');
 onProgress({phase:'SINGLE_POPULATION_DECODING',loadedContacts:index,totalContacts:manifest.rootCount});await yieldControl();
 // The pinned hashes bind uniqueness to the accepted packet. No per-root JS
 // objects, identity strings or duplicate Set are retained for this exact packet.
 return {plan:Object.freeze({tiles:Object.freeze(tiles),controlRoots:Object.freeze(controlRoots)}),
  presentation:{receipt:manifest.receipt,habitat:{...h,pixels:new Uint8Array(bytes.subarray(index*52))}}};
}
export async function loadPrecomputedGrass({fetchImpl=globalThis.fetch,yieldControl,onProgress=()=>{},packed=false}={}){
 const started=performance.now();
 const manifestBytes=await fetchStartupAsset(new URL('./assets/precomputed-grass.v1.json?sha='+MANIFEST_SHA256,import.meta.url),{fetchImpl});
 const manifestMilliseconds=performance.now()-started;
 if(await sha(manifestBytes)!==MANIFEST_SHA256)fail('MANIFEST_INTEGRITY');
 const manifest=JSON.parse(new TextDecoder().decode(manifestBytes));
 onProgress({phase:'SINGLE_POPULATION_DOWNLOADING',loadedBytes:0,totalBytes:manifest.compressedBytes});
 const downloadStarted=performance.now();
 let compressed=await fetchStartupAsset(new URL('./assets/precomputed-grass.v1.bin.gz?sha='+manifest.compressedSha256,import.meta.url),{fetchImpl,readBody:async data=>{
 let compressed;
 if(data.body?.getReader){
  compressed=new Uint8Array(manifest.compressedBytes);
  const reader=data.body.getReader();let offset=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;
   if(offset+value.byteLength>compressed.byteLength)fail('COMPRESSED_INTEGRITY_LENGTH');
   compressed.set(value,offset);offset+=value.byteLength;
   onProgress({phase:'SINGLE_POPULATION_DOWNLOADING',loadedBytes:offset,totalBytes:manifest.compressedBytes});
  }}catch(error){await reader.cancel().catch(()=>{});throw error;}finally{reader.releaseLock();}
  if(offset!==compressed.byteLength)fail('COMPRESSED_INTEGRITY_LENGTH');
 }else compressed=new Uint8Array(await data.arrayBuffer());
 return compressed;}});
 const downloadMilliseconds=performance.now()-downloadStarted,verifyStarted=performance.now();
 onProgress({phase:'SINGLE_POPULATION_VERIFYING'});
 if(compressed.byteLength!==manifest.compressedBytes||await sha(compressed)!==manifest.compressedSha256)fail('COMPRESSED_INTEGRITY');
 const verificationMilliseconds=performance.now()-verifyStarted,decompressStarted=performance.now();
 onProgress({phase:'SINGLE_POPULATION_DECOMPRESSING'});
 const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
 compressed=null;
 const bytes=new Uint8Array(await new Response(stream).arrayBuffer());
 const decompressionMilliseconds=performance.now()-decompressStarted,decodeStarted=performance.now();
 const decoded=packed?await decodePackedGrass(manifest,bytes,{yieldControl,onProgress}):null;
 const presentation=decoded?.presentation??await decodePrecomputedGrass(manifest,bytes,{yieldControl,onProgress});
 const result={...presentation,loading:{manifestMilliseconds,downloadMilliseconds,verificationMilliseconds,decompressionMilliseconds,decodeMilliseconds:performance.now()-decodeStarted,milliseconds:performance.now()-started,compressedBytes:manifest.compressedBytes,rawBytes:bytes.byteLength,source:'PRECOMPUTED_EXACT_ACCEPTED_PLANTING'}};
 if(decoded)packedPlans.set(result,decoded.plan);
 return result;
}
