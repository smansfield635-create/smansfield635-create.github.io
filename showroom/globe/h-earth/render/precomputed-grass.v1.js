/** Lossless, hash-bound output of the accepted ground-admission compiler. */
const MANIFEST_SHA256='a080b661751e2fe50d0f4fa5b2b53bd1074f7099a25c7276871c018b4c42d1b1';
const fail=reason=>{throw Error('PRECOMPUTED_GRASS_'+reason);};
const sha=async bytes=>Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
export async function decodePrecomputedGrass(manifest,bytes,{yieldControl=async()=>{},onProgress=()=>{}}={}){
 if(manifest.schema!=='H_EARTH_PRECOMPUTED_GRASS_v1'||manifest.rootCount!==1250134||manifest.stride!==52||manifest.receipt?.contactCount!==1250134)fail('IDENTITY_MISMATCH');
 if(bytes.byteLength!==manifest.rawBytes||await sha(bytes)!==manifest.rawSha256)fail('DATA_INTEGRITY');
 const h=manifest.habitat;
 if(h?.width!==384||h.height!==192||h.size!==192||bytes.byteLength!==manifest.rootCount*52+h.width*h.height)fail('LAYOUT_MISMATCH');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),tiles=[];let index=0;
 for(const tile of manifest.tiles){
  if(!Number.isInteger(tile.count)||tile.count<1||tile.count>1600||index+tile.count>manifest.rootCount)fail('TILE_COUNT');
  const roots=new Array(tile.count);
  for(let j=0;j<tile.count;j++,index++){
   const o=index*52,region=view.getUint32(o+48,true);
   if(region>2)fail('REGION');
   roots[j]={x:view.getFloat64(o,true),y:view.getFloat64(o+8,true),z:view.getFloat64(o+16,true),angle:view.getFloat64(o+24,true),slope:view.getFloat64(o+32,true),seed:view.getUint32(o+40,true),triangleId:view.getUint32(o+44,true),...(region?{region:region===1?'RAVINE':'RAVINE_SUPPLEMENT'}:{})};
  }
  tiles.push({id:tile.id,minX:tile.minX,minZ:tile.minZ,roots});
  if((tiles.length&255)===0){onProgress({phase:'SINGLE_POPULATION_DECODING',loadedContacts:index});await yieldControl();}
 }
 if(index!==manifest.rootCount)fail('ROOT_COUNT');
 return{tiles,receipt:manifest.receipt,habitat:{...h,pixels:new Uint8Array(bytes.subarray(index*52))}};
}
export async function loadPrecomputedGrass({fetchImpl=globalThis.fetch,yieldControl,onProgress}={}){
 const started=performance.now();
 const response=await fetchImpl(new URL('./assets/precomputed-grass.v1.json',import.meta.url));
 if(!response.ok)fail('MANIFEST_HTTP_'+response.status);
 const manifestBytes=new Uint8Array(await response.arrayBuffer());
 if(await sha(manifestBytes)!==MANIFEST_SHA256)fail('MANIFEST_INTEGRITY');
 const manifest=JSON.parse(new TextDecoder().decode(manifestBytes));
 const data=await fetchImpl(new URL('./assets/precomputed-grass.v1.bin.gz',import.meta.url));
 if(!data.ok)fail('DATA_HTTP_'+data.status);
 const compressed=new Uint8Array(await data.arrayBuffer());
 if(compressed.byteLength!==manifest.compressedBytes||await sha(compressed)!==manifest.compressedSha256)fail('COMPRESSED_INTEGRITY');
 const bytes=new Uint8Array(await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
 const presentation=await decodePrecomputedGrass(manifest,bytes,{yieldControl,onProgress});
 return{...presentation,loading:{milliseconds:performance.now()-started,compressedBytes:compressed.byteLength,rawBytes:bytes.byteLength,source:'PRECOMPUTED_EXACT_ACCEPTED_PLANTING'}};
}
