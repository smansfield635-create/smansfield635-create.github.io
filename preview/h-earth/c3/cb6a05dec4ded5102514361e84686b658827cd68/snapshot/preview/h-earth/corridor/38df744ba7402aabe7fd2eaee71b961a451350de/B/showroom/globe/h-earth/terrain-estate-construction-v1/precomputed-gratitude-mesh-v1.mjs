const PROVENANCE_URL = new URL('./gratitude-mesh-v1.provenance.json', import.meta.url);
const PART_COUNT = 8;
const MESH_URLS = Object.freeze(Array.from({length:PART_COUNT},(_,index)=>
  new URL(`./gratitude-mesh-v1.part-${String(index).padStart(2,'0')}.gz`, import.meta.url)
));
const MAGIC = 'AUDGMV1';
const EXPECTED_GEOGRAPHY_BLOB = '50991dd777ccd015fd8a6d8eae7b4d02b4a8450c';
const EXPECTED_TERRAIN_BLOB = 'f4f65b05ab303a11fb1d9c4e25de211fde73722a';
const EXPECTED_GEOGRAPHY_CONTRACT = 'AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_AUTHORITY_v1';
const PROHIBITED_LEGACY_RIVER_IDS = Object.freeze(['GRATITUDE_RIVER_WEST','GRATITUDE_RIVER_CENTRAL','GRATITUDE_RIVER_EAST']);

const readMagic = buffer => new TextDecoder().decode(new Uint8Array(buffer, 0, 7));
const yieldToPaint = () => new Promise(resolve => {
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
  else setTimeout(resolve, 0);
});
const digestHex = async buffer => {
  if (!globalThis.crypto?.subtle) throw new Error('AUDRALIA_MESH_CRYPTO_UNAVAILABLE');
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return [...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');
};

async function loadVerifiedProvenance(){
  const response = await fetch(PROVENANCE_URL,{cache:'force-cache'});
  if(!response.ok) throw new Error(`AUDRALIA_MESH_PROVENANCE_FETCH_FAILED_${response.status}`);
  const provenance = await response.json();
  if(provenance?.schema!=='AUDRALIA_PRECOMPUTED_GEOGRAPHY_PROVENANCE_v1') throw new Error('AUDRALIA_MESH_PROVENANCE_SCHEMA_INVALID');
  if(provenance?.canonicalGeography?.gitBlobSha!==EXPECTED_GEOGRAPHY_BLOB) throw new Error('AUDRALIA_MESH_PROVENANCE_GEOGRAPHY_INVALID');
  if(provenance?.canonicalGeography?.contractId!==EXPECTED_GEOGRAPHY_CONTRACT) throw new Error('AUDRALIA_MESH_PROVENANCE_GEOGRAPHY_CONTRACT_INVALID');
  if(provenance?.canonicalTerrain?.gitBlobSha!==EXPECTED_TERRAIN_BLOB) throw new Error('AUDRALIA_MESH_PROVENANCE_TERRAIN_INVALID');
  if(provenance?.mesh?.partCount!==PART_COUNT||!Array.isArray(provenance?.mesh?.parts)||provenance.mesh.parts.length!==PART_COUNT) throw new Error('AUDRALIA_MESH_PROVENANCE_PART_COUNT_INVALID');
  if(provenance?.authority?.singleGeography!==true||provenance?.authority?.singleTerrain!==true||provenance?.authority?.precomputationIsPerformanceOnly!==true||provenance?.authority?.deviceMayChangePerformanceBudgetOnly!==true||provenance?.authority?.retiredRev3Reachable!==false||provenance?.authority?.importMapMayChangeGeographicTruth!==false) throw new Error('AUDRALIA_MESH_PROVENANCE_AUTHORITY_INVALID');
  const riverIds = provenance?.hydrology?.riverIds ?? [];
  if(PROHIBITED_LEGACY_RIVER_IDS.some(id=>riverIds.includes(id))) throw new Error('AUDRALIA_MESH_PROVENANCE_LEGACY_RIVER_REACHABLE');
  for(let index=0;index<PART_COUNT;index+=1){
    const part=provenance.mesh.parts[index];
    if(part?.index!==index||part?.file!==`gratitude-mesh-v1.part-${String(index).padStart(2,'0')}.gz`) throw new Error(`AUDRALIA_MESH_PROVENANCE_PART_${index}_IDENTITY_INVALID`);
    if(!Number.isInteger(part.expandedBytes)||part.expandedBytes<=0||typeof part.expandedSha256!=='string'||typeof part.compressedSha256!=='string') throw new Error(`AUDRALIA_MESH_PROVENANCE_PART_${index}_METADATA_INVALID`);
  }
  return Object.freeze(provenance);
}

export async function loadPrecomputedGratitudeMesh({onProgress=null,yieldBetweenChunks=false}={}) {
  const startedAt = performance.now();
  if (typeof DecompressionStream !== 'function') throw new Error('AUDRALIA_MESH_DECOMPRESSION_UNAVAILABLE');
  const provenance = await loadVerifiedProvenance();
  const totalLength = provenance.mesh.parts.reduce((total,part)=>total+part.expandedBytes,0);
  if(totalLength!==provenance.mesh.payloadBytes) throw new Error('AUDRALIA_MESH_PROVENANCE_PAYLOAD_LENGTH_INVALID');
  const merged = new Uint8Array(totalLength);
  let mergedOffset = 0;
  if (typeof onProgress === 'function') onProgress(Object.freeze({stage:'START',index:-1,total:MESH_URLS.length,expandedBytes:0,totalExpandedBytes:totalLength}));
  for (let index = 0; index < MESH_URLS.length; index += 1) {
    const metadata = provenance.mesh.parts[index];
    const response = await fetch(MESH_URLS[index], { cache: 'force-cache' });
    if (!response.ok) throw new Error(`AUDRALIA_MESH_PART_${index}_FETCH_FAILED_${response.status}`);
    const compressed = await response.arrayBuffer();
    if(compressed.byteLength!==metadata.compressedBytes) throw new Error(`AUDRALIA_MESH_PART_${index}_COMPRESSED_LENGTH_INVALID`);
    if(await digestHex(compressed)!==metadata.compressedSha256) throw new Error(`AUDRALIA_MESH_PART_${index}_COMPRESSED_DIGEST_INVALID`);
    const expanded = await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    if (expanded.byteLength !== metadata.expandedBytes) throw new Error(`AUDRALIA_MESH_PART_${index}_LENGTH_INVALID`);
    if(await digestHex(expanded)!==metadata.expandedSha256) throw new Error(`AUDRALIA_MESH_PART_${index}_EXPANDED_DIGEST_INVALID`);
    merged.set(new Uint8Array(expanded), mergedOffset);
    mergedOffset += expanded.byteLength;
    if (typeof onProgress === 'function') onProgress(Object.freeze({stage:'PART',index,total:MESH_URLS.length,expandedBytes:mergedOffset,totalExpandedBytes:totalLength}));
    if (yieldBetweenChunks) await yieldToPaint();
  }
  const buffer = merged.buffer;
  if(await digestHex(buffer)!==provenance.mesh.payloadSha256) throw new Error('AUDRALIA_MESH_PAYLOAD_DIGEST_INVALID');
  const view = new DataView(buffer);
  if (readMagic(buffer) !== MAGIC || view.getUint32(8, true) !== 1) throw new Error('AUDRALIA_MESH_HEADER_INVALID');

  const landVertexLength = view.getUint32(12, true);
  const landIndexLength = view.getUint32(16, true);
  const waterVertexLength = view.getUint32(20, true);
  const waterIndexLength = view.getUint32(24, true);
  const statisticsLength = view.getUint32(28, true);
  if(landVertexLength!==provenance.mesh.landVertexLength||landIndexLength!==provenance.mesh.landIndexLength||waterVertexLength!==provenance.mesh.waterVertexLength||waterIndexLength!==provenance.mesh.waterIndexLength) throw new Error('AUDRALIA_MESH_HEADER_PROVENANCE_MISMATCH');
  let offset = 32;
  const take = (Type, length) => {
    const bytes = length * Type.BYTES_PER_ELEMENT;
    if (offset + bytes > buffer.byteLength) throw new Error('AUDRALIA_MESH_PAYLOAD_TRUNCATED');
    const value = new Type(buffer, offset, length);
    offset += bytes;
    return value;
  };

  const landVertices = take(Float32Array, landVertexLength);
  const landIndices = take(Uint32Array, landIndexLength);
  const waterVertices = take(Float32Array, waterVertexLength);
  const waterIndices = take(Uint32Array, waterIndexLength);
  if (offset + statisticsLength !== buffer.byteLength) throw new Error('AUDRALIA_MESH_LENGTH_INVALID');
  const statisticsBytes = new Uint8Array(buffer, offset, statisticsLength);
  if(await digestHex(statisticsBytes)!==provenance.mesh.statisticsSha256) throw new Error('AUDRALIA_MESH_STATISTICS_DIGEST_INVALID');
  const statistics = JSON.parse(new TextDecoder().decode(statisticsBytes));

  window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__ = Object.freeze({
    schema: 'AUDRALIA_PRECOMPUTED_GRATITUDE_MESH_v2_CANONICAL_AUTHORITY_BOUND',
    identicalCanonicalGeometry: true,
    browserConstructionRemoved: true,
    verifiedChunkCount: MESH_URLS.length,
    peakExpandedMeshCopies: 1,
    sequentialChunkAssembly: true,
    sameOriginCriticalPath: MESH_URLS.every(url => url.origin === location.origin) && PROVENANCE_URL.origin === location.origin,
    loadMilliseconds: performance.now() - startedAt,
    authority: Object.freeze({
      geographyContract: provenance.canonicalGeography.contractId,
      geographyBlob: provenance.canonicalGeography.gitBlobSha,
      terrainBlob: provenance.canonicalTerrain.gitBlobSha,
      hydrologyRiverIds: Object.freeze([...(provenance.hydrology.riverIds??[])]),
      hydrologyLakeIds: Object.freeze([...(provenance.hydrology.lakeIds??[])]),
      meshPayloadSha256: provenance.mesh.payloadSha256,
      retiredRev3Reachable: false,
      deviceAuthorityDivergence: false
    }),
    landMesh: Object.freeze({ vertices: landVertices, indices: landIndices, statistics: Object.freeze(statistics.land) }),
    coastalWaterMesh: Object.freeze({ vertices: waterVertices, indices: waterIndices, statistics: Object.freeze(statistics.water) })
  });
  if (typeof onProgress === 'function') onProgress(Object.freeze({stage:'COMPLETE',index:MESH_URLS.length-1,total:MESH_URLS.length,expandedBytes:totalLength,totalExpandedBytes:totalLength}));
  return window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__;
}

export default loadPrecomputedGratitudeMesh;
