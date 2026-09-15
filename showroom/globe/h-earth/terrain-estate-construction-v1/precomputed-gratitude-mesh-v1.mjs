const PART_LENGTHS = Object.freeze([1200000, 1200000, 1200000, 1200000, 1200000, 1200000, 1200000, 769742]);
const MESH_URLS = Object.freeze(PART_LENGTHS.map((_, index) =>
  new URL(`./gratitude-mesh-v1.part-${String(index).padStart(2, '0')}.gz`, import.meta.url)
));
const MAGIC = 'AUDGMV1';

const readMagic = buffer => new TextDecoder().decode(new Uint8Array(buffer, 0, 7));
const yieldToPaint = () => new Promise(resolve => {
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
  else setTimeout(resolve, 0);
});

const AUDRALIA_PATCH_MODULES = Object.freeze({
  acf1: '/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/acf1-cloud-presentation-v1.mjs?cb=EXACT_24057',
  xyz: '/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/fap1-xyz-volumetric-depth-v1.mjs?cb=EXACT_24057',
  parity: '/showroom/globe/audralia/atmospheric-parity-v1.mjs?cb=AUDRALIA_FULL_ATMOSPHERIC_PARITY_3265_v1',
  weather: '/inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/fap1-weather-presentation-v1.mjs?cb=EXACT_24057'
});

function beginAudraliaPresentationWarmup() {
  if (typeof window === 'undefined' || !window.__AUDRALIA_LIVE_PLANETARY_INTEGRATION__) return null;
  if (window.__AUDRALIA_PRESENTATION_PATCH_WARMUP__) return window.__AUDRALIA_PRESENTATION_PATCH_WARMUP__;

  const constrainedTablet = window.__AUDRALIA_RENDER_PIXEL_BUDGET__?.active === true;
  const startedAt = performance.now();
  const warmup = (async () => {
    await import(AUDRALIA_PATCH_MODULES.acf1);
    await yieldToPaint();
    await import(AUDRALIA_PATCH_MODULES.xyz);
    await yieldToPaint();
    if (!constrainedTablet) {
      await import(AUDRALIA_PATCH_MODULES.parity);
      await yieldToPaint();
    }
    await import(AUDRALIA_PATCH_MODULES.weather);
    return Object.freeze({
      schema: 'AUDRALIA_PRESENTATION_PATCH_WARMUP_v1',
      ready: true,
      constrainedTablet,
      loadMilliseconds: performance.now() - startedAt,
      patchOrder: Object.freeze(constrainedTablet
        ? ['ACF1', 'FAP1_XYZ', 'FAP1_WEATHER']
        : ['ACF1', 'FAP1_XYZ', 'ATMOSPHERIC_PARITY', 'FAP1_WEATHER'])
    });
  })().catch(error => Object.freeze({
    schema: 'AUDRALIA_PRESENTATION_PATCH_WARMUP_v1',
    ready: false,
    constrainedTablet,
    loadMilliseconds: performance.now() - startedAt,
    error: String(error?.message || error)
  }));

  Object.defineProperty(window, '__AUDRALIA_PRESENTATION_PATCH_WARMUP__', {
    value: warmup,
    writable: false,
    configurable: false
  });
  return warmup;
}

async function fetchMeshPart(index) {
  const response = await fetch(MESH_URLS[index], { cache: 'force-cache' });
  if (!response.ok) throw new Error(`AUDRALIA_MESH_PART_${index}_FETCH_FAILED_${response.status}`);
  if (!response.body) throw new Error(`AUDRALIA_MESH_PART_${index}_BODY_UNAVAILABLE`);
  return response;
}

export async function loadPrecomputedGratitudeMesh({onProgress=null,yieldBetweenChunks=false}={}) {
  const startedAt = performance.now();
  const presentationWarmup = beginAudraliaPresentationWarmup();
  if (typeof DecompressionStream !== 'function') {
    throw new Error('AUDRALIA_MESH_DECOMPRESSION_UNAVAILABLE');
  }
  const totalLength = PART_LENGTHS.reduce((total, length) => total + length, 0);
  const merged = new Uint8Array(totalLength);
  let mergedOffset = 0;
  if (typeof onProgress === 'function') onProgress(Object.freeze({stage:'START',index:-1,total:MESH_URLS.length,expandedBytes:0,totalExpandedBytes:totalLength}));

  let pendingResponse = fetchMeshPart(0);
  for (let index = 0; index < MESH_URLS.length; index += 1) {
    const response = await pendingResponse;
    if (!yieldBetweenChunks && index + 1 < MESH_URLS.length) {
      pendingResponse = fetchMeshPart(index + 1);
    }
    const part = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    if (part.byteLength !== PART_LENGTHS[index]) throw new Error(`AUDRALIA_MESH_PART_${index}_LENGTH_INVALID`);
    merged.set(new Uint8Array(part), mergedOffset);
    mergedOffset += part.byteLength;
    if (typeof onProgress === 'function') onProgress(Object.freeze({stage:'PART',index,total:MESH_URLS.length,expandedBytes:mergedOffset,totalExpandedBytes:totalLength}));
    if (yieldBetweenChunks) {
      await yieldToPaint();
      if (index + 1 < MESH_URLS.length) pendingResponse = fetchMeshPart(index + 1);
    }
  }
  const buffer = merged.buffer;
  const view = new DataView(buffer);
  if (readMagic(buffer) !== MAGIC || view.getUint32(8, true) !== 1) {
    throw new Error('AUDRALIA_MESH_HEADER_INVALID');
  }

  const landVertexLength = view.getUint32(12, true);
  const landIndexLength = view.getUint32(16, true);
  const waterVertexLength = view.getUint32(20, true);
  const waterIndexLength = view.getUint32(24, true);
  const statisticsLength = view.getUint32(28, true);
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
  const statistics = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, offset, statisticsLength)));

  window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__ = Object.freeze({
    schema: 'AUDRALIA_PRECOMPUTED_GRATITUDE_MESH_v1',
    identicalApprovedGeometry: true,
    browserConstructionRemoved: true,
    verifiedChunkCount: MESH_URLS.length,
    peakExpandedMeshCopies: 1,
    sequentialChunkAssembly: true,
    oneRequestLookahead: !yieldBetweenChunks,
    presentationWarmupConcurrent: Boolean(presentationWarmup),
    sameOriginCriticalPath: MESH_URLS.every(url => url.origin === location.origin),
    loadMilliseconds: performance.now() - startedAt,
    landMesh: Object.freeze({ vertices: landVertices, indices: landIndices, statistics: Object.freeze(statistics.land) }),
    coastalWaterMesh: Object.freeze({ vertices: waterVertices, indices: waterIndices, statistics: Object.freeze(statistics.water) })
  });
  if (typeof onProgress === 'function') onProgress(Object.freeze({stage:'COMPLETE',index:MESH_URLS.length-1,total:MESH_URLS.length,expandedBytes:totalLength,totalExpandedBytes:totalLength}));
  return window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__;
}

export default loadPrecomputedGratitudeMesh;