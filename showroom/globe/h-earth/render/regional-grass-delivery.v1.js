// Gen3186 first-party regional delivery. This module is inert until the
// separately admitted, hash-pinned regional asset manifest is published.
// It never interprets a subset of roots as a complete accepted population.
const SOURCE_ROOTS=2858738;
const SOURCE_RAW_SHA256='bb5bdea6223aaea0422bac76f73da46d0370e51d81b3fdb280c970c408879a97';
const SOURCE_MANIFEST_SHA256='9d452a0906094e6e5ed828753e547ef24269afa173896453637b77832c6c3edf';
const REGION_SIDE=32,LOCAL_RADIUS=24,FULL_RADIUS=64;
// A network stall must settle into the authenticated global fallback, not
// occupy a regional fetch slot forever. The same deadline includes body read.
const REQUEST_TIMEOUT_MS=30000;
function boundedSignal(external,timeoutMs=REQUEST_TIMEOUT_MS){
 const controller=new AbortController();let timedOut=false;
 const forwardAbort=()=>controller.abort(external?.reason);
 if(external?.aborted)forwardAbort();else external?.addEventListener('abort',forwardAbort,{once:true});
 const timer=setTimeout(()=>{timedOut=true;controller.abort();},timeoutMs);
 return{signal:controller.signal,timedOut:()=>timedOut,
  release(){clearTimeout(timer);external?.removeEventListener('abort',forwardAbort);}};
}
const authenticatedPlans=new WeakSet();
function freezeIndex(value){
 if(value&&typeof value==='object'&&!Object.isFrozen(value)){
  for(const child of Object.values(value))freezeIndex(child);
  Object.freeze(value);
 }
 return value;
}
const fail=code=>{throw Error('H_EARTH_REGIONAL_DELIVERY_'+code);};
const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
const dist2=(x,z,region)=>{
 const [ix,iz]=region.id.split(':').map(Number);
 const minX=ix*REGION_SIDE,minZ=iz*REGION_SIDE;
 const dx=Math.max(minX-x,0,x-minX-REGION_SIDE);
 const dz=Math.max(minZ-z,0,z-minZ-REGION_SIDE);
 return dx*dx+dz*dz;
};
export function prioritizeRegionalPackets(regions,camera){
 if(!Number.isFinite(camera?.x)||!Number.isFinite(camera?.z))fail('CAMERA_INVALID');
 return [...regions].map(region=>({region,distanceSquared:dist2(camera.x,camera.z,region)}))
  .sort((a,b)=>a.distanceSquared-b.distanceSquared||a.region.id.localeCompare(b.region.id,'en',{numeric:true}));
}
async function fetchExact(url,{fetchImpl=globalThis.fetch,signal,byteLength,sha256,attempts=2}){
 for(let trial=0;trial<attempts;trial++){
  const deadline=boundedSignal(signal);
  try{
   const response=await fetchImpl(url,{signal:deadline.signal});
   if(!response.ok){
    const error=new Error('HTTP_'+response.status);
    error.retryable=[408,429,500,502,503,504].includes(response.status);
    await response.body?.cancel?.().catch(()=>{});
    throw error;
   }
   const bytes=new Uint8Array(await response.arrayBuffer());
   if(deadline.timedOut())fail('FETCH_TIMEOUT');
   if(bytes.length!==byteLength||await digest(bytes)!==sha256)fail('COMPRESSED_INTEGRITY');
   return bytes;
  }catch(error){
   if(signal?.aborted)throw error;
   if(deadline.timedOut())fail('FETCH_TIMEOUT');
   if(trial===0&&(error instanceof TypeError||error?.retryable===true))continue;
   throw error;
  }finally{deadline.release();}
 }
 fail('UNREACHABLE_TRANSPORT');
}
async function ungzip(gzip,{rawBytes,sha256}){
 const raw=new Uint8Array(await new Response(new Blob([gzip]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
 if(raw.length!==rawBytes||await digest(raw)!==sha256)fail('DECOMPRESSED_INTEGRITY');
 return raw;
}
function validateIndex(index){
 if(index?.schema!=='H_EARTH_PRECOMPUTED_GRASS_REGIONAL_v1'||index.sourceRoots!==SOURCE_ROOTS||
  index.sourceRawSha256!==SOURCE_RAW_SHA256||index.sourceManifestSha256!==SOURCE_MANIFEST_SHA256||
  index.totalRegionCount!==182||index.regionSideMeters!==REGION_SIDE||index.recordStride!==52||
  index.sourceManifest?.rootCount!==SOURCE_ROOTS||index.sourceManifest?.stride!==52||
  !Array.isArray(index.regions)||index.regions.length!==182)fail('MANIFEST_IDENTITY');
 const ids=new Set(),sourceTiles=new Set(),rootRanges=[],tiles=index.sourceManifest.tiles;
 let sum=0;
 for(const r of index.regions){
  if(typeof r.id!=='string'||ids.has(r.id)||!/^[-]?\d+:[-]?\d+$/.test(r.id)||
    !Number.isInteger(r.compressedBytes)||r.compressedBytes<1||r.compressedBytes>8000000||
    !/^[a-f0-9]{64}$/.test(r.compressedSha256)||!/^[a-f0-9]{64}$/.test(r.rawSha256)||
    !Array.isArray(r.tiles)||!r.tiles.length)fail('REGION_RECORD_INVALID');
  ids.add(r.id);
  let roots=0;
  for(const t of r.tiles){
   const original=tiles?.[t.tileIndex];
   if(!original||sourceTiles.has(t.tileIndex)||t.tileId!==original.id||
     t.sourceFirstRoot<0||t.count!==original.count||t.baselineCount!==original.baselineCount||
     Math.floor(original.minX/REGION_SIDE)+':'+Math.floor(original.minZ/REGION_SIDE)!==r.id)fail('SOURCE_TILE_BINDING');
   sourceTiles.add(t.tileIndex);rootRanges.push([t.sourceFirstRoot,t.sourceFirstRoot+t.count]);roots+=t.count;
  }
  if(r.roots!==roots||r.rawBytes!==roots*52)fail('REGION_ROOT_LENGTH');
  sum+=roots;
 }
 rootRanges.sort((a,b)=>a[0]-b[0]);let end=0;
 for(const range of rootRanges){if(range[0]!==end)fail('SOURCE_ROOT_ORDER_OR_DUPLICATION');end=range[1];}
 if(sum!==SOURCE_ROOTS||end!==SOURCE_ROOTS||sourceTiles.size!==tiles.length)fail('SOURCE_POPULATION_INCOMPLETE');
 if(!index.habitat||index.habitat.rawBytes!==576*192||
  !/^[a-f0-9]{64}$/.test(index.habitat.rawSha256))fail('HABITAT_INVALID');
 return index;
}
function decodeRegion(r,raw){
 const view=new DataView(raw.buffer,raw.byteOffset,raw.byteLength);
 const tiles=[];let cursor=0,roots=0;
 for(const t of r.tiles){
  const packed=new Float32Array(t.count*4);
  for(let i=0;i<t.count;i++){
   const off=cursor+i*52,region=view.getUint32(off+48,true);
   const x=view.getFloat64(off,true),y=view.getFloat64(off+8,true),z=view.getFloat64(off+16,true),
     angle=view.getFloat64(off+24,true),slope=view.getFloat64(off+32,true);
   if(region>2||![x,y,z,angle,slope].every(Number.isFinite)||
    x<t.minX||x>=t.minX+4||z<t.minZ||z>=t.minZ+4)fail('REGION_ROOT_RECORD');
   packed.set([Math.fround(x),Math.fround(y),Math.fround(z),Math.fround(angle)],i*4);
  }
  cursor+=t.count*52;roots+=t.count;
  tiles.push(Object.freeze({id:t.tileId,minX:t.minX,minZ:t.minZ,
    first:t.sourceFirstRoot,count:t.count,baselineCount:t.baselineCount,packed}));
 }
 if(cursor!==raw.length||roots!==r.roots)fail('REGION_DECODE_LENGTH');
 return Object.freeze({id:r.id,roots,tiles:Object.freeze(tiles)});
}
// The manifest SHA is mandatory. A fetched, self-declared digest does not
// authenticate a new planting source or permit product promotion.
export async function loadRegionalGrassIndex({manifestUrl,manifestSha256,fetchImpl=globalThis.fetch,signal}={}){
 if(!manifestUrl||!/^[a-f0-9]{64}$/.test(manifestSha256??''))fail('PINNED_MANIFEST_REQUIRED');
 const deadline=boundedSignal(signal);
 let bytes;
 try{
  const response=await fetchImpl(manifestUrl,{signal:deadline.signal});
  if(!response.ok)fail('MANIFEST_HTTP_'+response.status);
  bytes=new Uint8Array(await response.arrayBuffer());
  if(deadline.timedOut())fail('MANIFEST_TIMEOUT');
 }catch(error){
  if(deadline.timedOut())fail('MANIFEST_TIMEOUT');
  throw error;
 }finally{deadline.release();}
 if(await digest(bytes)!==manifestSha256)fail('MANIFEST_INTEGRITY');
 const index=freezeIndex(validateIndex(JSON.parse(new TextDecoder().decode(bytes))));
 const habitatCompressed=await fetchExact(new URL(index.habitat.path,manifestUrl),{
  fetchImpl,signal,byteLength:index.habitat.compressedBytes,sha256:index.habitat.compressedSha256
 });
 const habitatPixels=await ungzip(habitatCompressed,{rawBytes:index.habitat.rawBytes,sha256:index.habitat.rawSha256});
 const trusted=Object.freeze({index,manifestUrl,habitat:Object.freeze({
  ...index.sourceManifest.habitat,pixels:habitatPixels
 })});
 authenticatedPlans.add(trusted);
 return trusted;
}
// A verified region is emitted exactly once to its sole GPU owner.
// No rendering or WebGL call occurs inside the streaming scheduler.
export function createRegionalGrassStream({trusted,fetchImpl=globalThis.fetch,onRegion,onProgress=()=>{},
 onFatal=()=>{},maxInflight=2}={}){
 if(!authenticatedPlans.has(trusted)||typeof onRegion!=='function'||
  !Number.isInteger(maxInflight)||maxInflight<1||maxInflight>4)fail('STREAM_ARGUMENTS');
 const regions=trusted.index.regions;
 const loaded=new Set(),inflight=new Map();
 let camera=null,disposed=false,failed=false,bytes=0,installedRoots=0;
 const state=()=>Object.freeze({loadedRegions:loaded.size,totalRegions:regions.length,installedRoots,
  totalRoots:SOURCE_ROOTS,downloadedCompressedBytes:bytes,inflight:inflight.size,
  localReady:camera!==null&&regions.filter(r=>dist2(camera.x,camera.z,r)<=LOCAL_RADIUS**2).every(r=>loaded.has(r.id)),
  radius64Ready:camera!==null&&regions.filter(r=>dist2(camera.x,camera.z,r)<=FULL_RADIUS**2).every(r=>loaded.has(r.id)),
  worldComplete:loaded.size===regions.length,failed,disposed});
 const report=()=>{try{onProgress(state());}catch{/* Observers have no control authority */}};
 const pump=()=>{
  if(disposed||failed||!camera)return;
  const ranked=prioritizeRegionalPackets(regions,camera);
  while(inflight.size<maxInflight){
   const next=ranked.find(item=>!loaded.has(item.region.id)&&!inflight.has(item.region.id));
   if(!next)break;
   const r=next.region,ctrl=new AbortController();
   inflight.set(r.id,{controller:ctrl,stage:'fetching'});
   (async()=>{
    try{
     const compressed=await fetchExact(new URL(r.path,trusted.manifestUrl),{
      fetchImpl,signal:ctrl.signal,byteLength:r.compressedBytes,sha256:r.compressedSha256
     });
     const raw=await ungzip(compressed,{rawBytes:r.rawBytes,sha256:r.rawSha256});
     if(ctrl.signal.aborted||disposed)return;
     const decoded=decodeRegion(r,raw);
     inflight.get(r.id).stage='installing';
     await onRegion(decoded);
     if(ctrl.signal.aborted||disposed)return;
     if(loaded.has(r.id))fail('REGION_DUPLICATE_INSTALL');
     loaded.add(r.id);installedRoots+=r.roots;bytes+=r.compressedBytes;
     if(installedRoots>SOURCE_ROOTS)fail('REGION_TOTAL_OVERFLOW');
    }catch(error){
     if(ctrl.signal.aborted||disposed)return;
     failed=true;for(const other of inflight.values())if(other.stage==='fetching')other.controller.abort();
     try{onFatal({reason:String(error?.message??error),regionId:r.id,regionalFallbackRequired:true});}catch{/* A fallback observer cannot reactivate a failed stream. */}
    }finally{
     inflight.delete(r.id);report();if(!disposed&&!failed)queueMicrotask(pump);
    }
   })();
  }
 };
 function updateCamera(nextCamera){
  if(disposed||failed)return state();
  if(!Number.isFinite(nextCamera?.x)||!Number.isFinite(nextCamera?.z))fail('CAMERA_INVALID');
  camera={x:nextCamera.x,z:nextCamera.z};
  const ranked=prioritizeRegionalPackets(regions,camera);
  const closestPending=ranked.find(x=>!loaded.has(x.region.id)&&!inflight.has(x.region.id));
  if(closestPending)for(const [id,entry] of inflight){
   const region=regions.find(x=>x.id===id);
   if(entry.stage==='fetching'&&dist2(camera.x,camera.z,region)>96**2&&
    dist2(camera.x,camera.z,region)>closestPending.distanceSquared)entry.controller.abort();
  }
  pump();report();return state();
 }
 return Object.freeze({updateCamera,getStatus:state,dispose(){
  disposed=true;for(const entry of inflight.values())if(entry.stage==='fetching')entry.controller.abort();report();
 }});
}
