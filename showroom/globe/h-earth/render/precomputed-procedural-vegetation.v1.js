/** Exact admitted procedural vegetation, generated offline; no runtime kernel bypass for new geometry. */
export const MANIFEST_SHA256 = 'fd84424ecfd9c7e2999f13de9c3bb981732ee7853c2f91a3790f3c57ea0faaa6';
export const GROUPS = ['palms','ivy','understory','oasisTrees'];
const TYPES = {Float32Array, Float64Array, Uint32Array, Uint16Array, Uint8Array, Int32Array};
export async function sha256(bytes) {return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
export function encodePrepared(value) {return JSON.stringify(value,(_,v)=>ArrayBuffer.isView(v)?{$typed:v.constructor.name,values:Array.from(v)}:v);}
export function decodePrepared(text) {return JSON.parse(text,(_,v)=>{
 if(v?.$typed){const T=TYPES[v.$typed];if(!T||!Array.isArray(v.values)||!v.values.every(Number.isFinite))throw Error('PREPARED_ARRAY_TYPE');return T.from(v.values);}return v;
});}
// Normalize input storage types: generation and runtime may store the same numbers in different arrays.
export async function inputBinding(model, source) {
 const parts=[JSON.stringify({site:model.site,route:model.route,spans:source.primitiveSpans})];
 const numeric=async value=>{const a=Float64Array.from(value);parts.push(await sha256(a.buffer));};
 for(const p of model.meshes){parts.push(JSON.stringify({role:p.role,part:p.part??null}));await numeric(p.mesh.positions);await numeric(p.mesh.indices);}
 for(const v of [source.buffers.positions,source.buffers.indices,source.buffers.baseColorsLinear,source.clearingAttributes])await numeric(v);
 return sha256(new TextEncoder().encode(parts.join('\n')));
}
export function validatePrepared(groups, manifest) {
 if(Object.keys(groups).sort().join()!==[...GROUPS].sort().join())throw Error('PREPARED_GROUPS');
 for(const key of GROUPS){const g=groups[key],spec=manifest.groups[key];if(!g?.receipt||!Array.isArray(g.meshes)||g.meshes.length!==spec.meshCount)throw Error('PREPARED_GROUP_SHAPE');
  let triangles=0;for(const p of g.meshes){const m=p.mesh,n=m?.vertexCount;
   if(!(m?.positions instanceof Float32Array)||!(m.indices instanceof Uint32Array)||!Number.isInteger(n)||n<=0||m.positions.length!==n*3||m.indices.length%3||m.triangleCount!==m.indices.length/3||!m.positions.every(Number.isFinite)||!m.indices.every(i=>i<n)||p.colors?.length!==n)throw Error('PREPARED_MESH_SHAPE');
   if(!p.colors.every(c=>c.length===3&&Array.from(c).every(Number.isFinite)))throw Error('PREPARED_COLORS');
   if(key==='oasisTrees'&&(!p.clearingAttributes||p.clearingAttributes.length!==n||!p.clearingAttributes.every(c=>c.length===3&&Array.from(c).every(Number.isFinite))))throw Error('PREPARED_MATERIALS');
   triangles+=m.triangleCount;
  }if(triangles!==spec.triangleCount||g.receipt.triangleCount!==triangles)throw Error('PREPARED_COUNTS');
 }return groups;
}
export async function loadPreparedVegetation(model,source,{fetcher=globalThis.fetch,now=()=>performance.now(),manifestHash=MANIFEST_SHA256}={}) {
 const timing={schema:'GRATITUDE_PREPARED_VEGETATION_v1',path:'PREPARED',failure:null,phases:{},compressedBytes:0,rawBytes:0};const start=now();
 const measure=async(name,fn)=>{const t=now();try{return await fn();}finally{timing.phases[name]=now()-t;}};
 try{
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
  let manifest,compressed;
  try{
   const bytes=await measure('manifestFetch',async()=>{const r=await fetcher(new URL('./assets/precomputed-procedural-vegetation.v1.json',import.meta.url),{signal:controller.signal});if(!r.ok)throw Error('PREPARED_MANIFEST_HTTP');return r.arrayBuffer();});
   manifest=await measure('manifestVerification',async()=>{if(await sha256(bytes)!==manifestHash)throw Error('PREPARED_MANIFEST_HASH');const m=JSON.parse(new TextDecoder().decode(bytes));if(m.schema!=='H_EARTH_PREPARED_PROCEDURAL_VEGETATION_v1'||m.compressedBytes>8*1024*1024||m.rawBytes>32*1024*1024)throw Error('PREPARED_MANIFEST_SCHEMA');return m;});
   await measure('inputVerification',async()=>{if(await inputBinding(model,source)!==manifest.inputBinding)throw Error('PREPARED_INPUT_MISMATCH');});
   compressed=await measure('download',async()=>{const r=await fetcher(new URL('./assets/precomputed-procedural-vegetation.v1.bin.gz',import.meta.url),{signal:controller.signal});if(!r.ok)throw Error('PREPARED_PAYLOAD_HTTP');return r.arrayBuffer();});
  }finally{clearTimeout(timeout);}
  timing.compressedBytes=compressed.byteLength;timing.groups=manifest.groups;timing.scope='Exact offline-admitted geometry; CPU wall timings, not GPU execution';
  await measure('payloadVerification',async()=>{if(compressed.byteLength!==manifest.compressedBytes||await sha256(compressed)!==manifest.payloadSha256)throw Error('PREPARED_PAYLOAD_HASH');});
  let raw=await measure('decompression',async()=>new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());compressed=null;timing.rawBytes=raw.byteLength;
  if(raw.byteLength!==manifest.rawBytes)throw Error('PREPARED_RAW_LENGTH');
  const groups=await measure('decodeAndValidate',()=>validatePrepared(decodePrepared(new TextDecoder().decode(raw)),manifest));raw=null;
  timing.totalMilliseconds=now()-start;return {groups,timing};
 }catch(error){timing.path='RUNTIME_FALLBACK';timing.failure=String(error?.message??error);timing.totalMilliseconds=now()-start;return {groups:null,timing};}
}
