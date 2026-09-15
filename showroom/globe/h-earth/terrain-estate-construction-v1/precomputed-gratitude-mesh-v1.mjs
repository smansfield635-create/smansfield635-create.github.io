const MAGIC='AUDGMV1';
export const CANONICAL_GEOGRAPHY_GIT_BLOB_SHA='50991dd777ccd015fd8a6d8eae7b4d02b4a8450c';
export const CANONICAL_TERRAIN_GIT_BLOB_SHA='f4f65b05ab303a11fb1d9c4e25de211fde73722a';
export const CANONICAL_GEOGRAPHY_CONTRACT_ID='AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1';
export const CANONICAL_GEOGRAPHY_REVISION=5;
const PROVENANCE_URL=new URL('./gratitude-mesh-v1.provenance.json',import.meta.url);
const readMagic=buffer=>new TextDecoder().decode(new Uint8Array(buffer,0,7));
const yieldToPaint=()=>new Promise(resolve=>{if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>resolve());else setTimeout(resolve,0);});
const hex=buffer=>[...new Uint8Array(buffer)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
const sha256=async value=>hex(await crypto.subtle.digest('SHA-256',value));
const invariant=(ok,code)=>{if(!ok)throw new Error(code);};

async function loadProvenance(){
  const response=await fetch(PROVENANCE_URL,{cache:'no-cache'});
  invariant(response.ok,`AUDRALIA_MESH_PROVENANCE_FETCH_FAILED_${response.status}`);
  const provenance=await response.json();
  invariant(provenance?.schema==='AUDRALIA_PRECOMPUTED_GEOGRAPHY_PROVENANCE_v1','AUDRALIA_MESH_PROVENANCE_SCHEMA_INVALID');
  invariant(provenance?.status==='BOUND_TO_CANONICAL_AUTHORITY','AUDRALIA_MESH_PROVENANCE_NOT_BOUND');
  invariant(provenance?.canonicalGeography?.gitBlobSha===CANONICAL_GEOGRAPHY_GIT_BLOB_SHA,'AUDRALIA_MESH_GEOGRAPHY_FINGERPRINT_MISMATCH');
  invariant(provenance?.canonicalGeography?.contractId===CANONICAL_GEOGRAPHY_CONTRACT_ID,'AUDRALIA_MESH_GEOGRAPHY_CONTRACT_MISMATCH');
  invariant(provenance?.canonicalGeography?.revision===CANONICAL_GEOGRAPHY_REVISION,'AUDRALIA_MESH_GEOGRAPHY_REVISION_MISMATCH');
  invariant(provenance?.canonicalTerrain?.gitBlobSha===CANONICAL_TERRAIN_GIT_BLOB_SHA,'AUDRALIA_MESH_TERRAIN_FINGERPRINT_MISMATCH');
  invariant(provenance?.invariants?.precomputedAssetProvenanceBound===true,'AUDRALIA_MESH_PROVENANCE_GATE_NOT_BOUND');
  invariant(provenance?.invariants?.retiredRev3Reachable===false,'AUDRALIA_MESH_RETIRED_REV3_REACHABLE');
  invariant(Array.isArray(provenance?.mesh?.parts)&&provenance.mesh.parts.length===8,'AUDRALIA_MESH_PART_PROVENANCE_INVALID');
  return Object.freeze(provenance);
}

export async function loadPrecomputedGratitudeMesh({onProgress=null,yieldBetweenChunks=false}={}){
  const startedAt=performance.now();
  invariant(typeof DecompressionStream==='function','AUDRALIA_MESH_DECOMPRESSION_UNAVAILABLE');
  invariant(globalThis.crypto?.subtle,'AUDRALIA_MESH_CRYPTO_DIGEST_UNAVAILABLE');
  const provenance=await loadProvenance();
  const records=provenance.mesh.parts;
  const totalLength=records.reduce((total,record)=>total+record.expandedLength,0);
  invariant(totalLength===provenance.mesh.expandedLength,'AUDRALIA_MESH_PROVENANCE_EXPANDED_LENGTH_INVALID');
  const merged=new Uint8Array(totalLength);
  let mergedOffset=0;
  if(typeof onProgress==='function')onProgress(Object.freeze({stage:'START',index:-1,total:records.length,expandedBytes:0,totalExpandedBytes:totalLength}));
  for(let index=0;index<records.length;index++){
    const record=records[index];
    const url=new URL(`./${record.name}`,import.meta.url);
    const response=await fetch(url,{cache:'force-cache'});
    invariant(response.ok,`AUDRALIA_MESH_PART_${index}_FETCH_FAILED_${response.status}`);
    const compressed=await response.arrayBuffer();
    invariant(compressed.byteLength===record.gzipLength,`AUDRALIA_MESH_PART_${index}_GZIP_LENGTH_INVALID`);
    invariant(await sha256(compressed)===record.gzipSha256,`AUDRALIA_MESH_PART_${index}_GZIP_DIGEST_INVALID`);
    const expanded=await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    invariant(expanded.byteLength===record.expandedLength,`AUDRALIA_MESH_PART_${index}_LENGTH_INVALID`);
    invariant(await sha256(expanded)===record.expandedSha256,`AUDRALIA_MESH_PART_${index}_EXPANDED_DIGEST_INVALID`);
    merged.set(new Uint8Array(expanded),mergedOffset);
    mergedOffset+=expanded.byteLength;
    if(typeof onProgress==='function')onProgress(Object.freeze({stage:'PART',index,total:records.length,expandedBytes:mergedOffset,totalExpandedBytes:totalLength}));
    if(yieldBetweenChunks)await yieldToPaint();
  }
  const buffer=merged.buffer;
  invariant(await sha256(buffer)===provenance.mesh.expandedSha256,'AUDRALIA_MESH_EXPANDED_DIGEST_INVALID');
  const view=new DataView(buffer);
  invariant(readMagic(buffer)===MAGIC&&view.getUint32(8,true)===1,'AUDRALIA_MESH_HEADER_INVALID');
  const landVertexLength=view.getUint32(12,true),landIndexLength=view.getUint32(16,true),waterVertexLength=view.getUint32(20,true),waterIndexLength=view.getUint32(24,true),statisticsLength=view.getUint32(28,true);
  let offset=32;
  const take=(Type,length)=>{const count=length*Type.BYTES_PER_ELEMENT;invariant(offset+count<=buffer.byteLength,'AUDRALIA_MESH_PAYLOAD_TRUNCATED');const value=new Type(buffer,offset,length);offset+=count;return value;};
  const landVertices=take(Float32Array,landVertexLength),landIndices=take(Uint32Array,landIndexLength),waterVertices=take(Float32Array,waterVertexLength),waterIndices=take(Uint32Array,waterIndexLength);
  invariant(offset+statisticsLength===buffer.byteLength,'AUDRALIA_MESH_LENGTH_INVALID');
  const statistics=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,offset,statisticsLength)));
  window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__=Object.freeze({
    schema:'AUDRALIA_PRECOMPUTED_GRATITUDE_MESH_v2_CANONICAL_PROVENANCE',
    identicalApprovedGeometry:false,
    canonicalAuthorityBound:true,
    canonicalGeographyGitBlobSha:CANONICAL_GEOGRAPHY_GIT_BLOB_SHA,
    canonicalTerrainGitBlobSha:CANONICAL_TERRAIN_GIT_BLOB_SHA,
    geographyAuthorityCount:1,
    retiredRev3Reachable:false,
    provenance,
    browserConstructionRemoved:true,
    verifiedChunkCount:records.length,
    peakExpandedMeshCopies:1,
    sequentialChunkAssembly:true,
    sameOriginCriticalPath:records.every(record=>new URL(`./${record.name}`,import.meta.url).origin===location.origin),
    loadMilliseconds:performance.now()-startedAt,
    landMesh:Object.freeze({vertices:landVertices,indices:landIndices,statistics:Object.freeze(statistics.land)}),
    coastalWaterMesh:Object.freeze({vertices:waterVertices,indices:waterIndices,statistics:Object.freeze(statistics.water)})
  });
  window.__AUDRALIA_CANONICAL_GEOGRAPHY_AUTHORITY__=Object.freeze({
    schema:'AUDRALIA_CANONICAL_GEOGRAPHY_RUNTIME_BINDING_v1',
    geographyGitBlobSha:CANONICAL_GEOGRAPHY_GIT_BLOB_SHA,
    terrainGitBlobSha:CANONICAL_TERRAIN_GIT_BLOB_SHA,
    geographyContractId:CANONICAL_GEOGRAPHY_CONTRACT_ID,
    reconstructionRevision:CANONICAL_GEOGRAPHY_REVISION,
    hydrologyFingerprintSha256:provenance.hydrologyFingerprintSha256,
    precomputedMeshExpandedSha256:provenance.mesh.expandedSha256
  });
  if(typeof onProgress==='function')onProgress(Object.freeze({stage:'COMPLETE',index:records.length-1,total:records.length,expandedBytes:totalLength,totalExpandedBytes:totalLength}));
  return window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__;
}
export default loadPrecomputedGratitudeMesh;
