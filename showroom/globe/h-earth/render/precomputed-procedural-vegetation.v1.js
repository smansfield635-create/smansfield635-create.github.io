/** Exact admitted procedural vegetation, generated offline; no runtime kernel bypass for new geometry. */
export const MANIFEST_SHA256 = 'bd1b669acc8d1afc70801b11dacf14774fc39b86b24125d69f7046f91f2d6a9c';
export const GROUPS = ['palms','ivy','understory','oasisTrees'];
const TYPES = {Float32Array, Float64Array, Uint32Array, Uint16Array, Uint8Array, Int32Array};
export async function sha256(bytes) {return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
export function encodePrepared(value) {return JSON.stringify(value,(_,v)=>ArrayBuffer.isView(v)?{$typed:v.constructor.name,values:Array.from(v)}:v);}
export function decodePrepared(text) {return JSON.parse(text,(_,v)=>{
 if(v?.$typed){const T=TYPES[v.$typed];if(!T||!Array.isArray(v.values)||!v.values.every(Number.isFinite))throw Error('PREPARED_ARRAY_TYPE');return T.from(v.values);}return v;
});}
// Normalize input storage types: generation and runtime may store the same numbers in different arrays.
export async function inputFingerprint(model, source) {
 const parts=[JSON.stringify({site:model.site,route:model.route,spans:source.primitiveSpans})],components={};
 const textHash=value=>sha256(new TextEncoder().encode(JSON.stringify(value)));
 for(const [name,value] of Object.entries({site:model.site,route:model.route,spans:source.primitiveSpans}))components[name]=await textHash(value);
 const numeric=async(name,value)=>{const a=Float64Array.from(value),hash=await sha256(a.buffer);parts.push(hash);components[name]=hash;};
 for(const [i,p] of model.meshes.entries()){
  const descriptor={role:p.role,part:p.part??null};parts.push(JSON.stringify(descriptor));
  components[`mesh.${i}.descriptor`]=await textHash(descriptor);
  await numeric(`mesh.${i}.positions`,p.mesh.positions);await numeric(`mesh.${i}.indices`,p.mesh.indices);
 }
 for(const name of ['positions','indices','baseColorsLinear'])await numeric(`source.${name}`,source.buffers[name]);
 await numeric('source.clearingAttributes',source.clearingAttributes);
 return {hash:await sha256(new TextEncoder().encode(parts.join('\n'))),components};
}
export async function inputBinding(model,source){return (await inputFingerprint(model,source)).hash;}
// Diagnostic only: exact leaf comparison never participates in acceptance.
export function routeDifferences(expected,actual,limit=12){
 const differences=[];let total=0;
 const walk=(a,b,path)=>{
  if(Object.is(a,b))return;
  if(a&&b&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)){
   for(const key of new Set([...Object.keys(a),...Object.keys(b)]))walk(a[key],b[key],path+'.'+key);
  }else{total++;if(differences.length<limit)differences.push({path,expected:a??null,actual:b??null,...(typeof a==='number'&&typeof b==='number'?{delta:b-a}:{})});}
 };
 walk(expected,actual,'route');return {total,limit,differences};
}
export function compareInputFingerprint(actual,manifest){
 const expected=manifest.inputComponents??{};
 const names=[...new Set([...Object.keys(expected),...Object.keys(actual.components)])];
 return {expected:manifest.inputBinding,actual:actual.hash,
  source:'ACTUAL_RENDERER_MODEL_AND_CANONICAL_PACKAGE',
  componentCount:names.length,
  mismatches:names.filter(name=>expected[name]!==actual.components[name]).map(name=>({name,expected:expected[name]??null,actual:actual.components[name]??null}))};
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
   await measure('inputVerification',async()=>{const actual=await inputFingerprint(model,source);timing.inputVerification=compareInputFingerprint(actual,manifest);if(actual.hash!==manifest.inputBinding){timing.inputVerification.routeDifferences=routeDifferences(manifest.inputRoute,model.route);throw Error('PREPARED_INPUT_MISMATCH');}});
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
