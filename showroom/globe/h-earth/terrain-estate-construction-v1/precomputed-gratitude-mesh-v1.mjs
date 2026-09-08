const PART_LENGTHS = Object.freeze([1200000, 1200000, 1200000, 1200000, 1200000, 1200000, 1200000, 769742]);
const MESH_URLS = Object.freeze(PART_LENGTHS.map((_, index) =>
  new URL(`./gratitude-mesh-v1.part-${String(index).padStart(2, '0')}.gz`, import.meta.url)
));
const MAGIC = 'AUDGMV1';

const readMagic = buffer => new TextDecoder().decode(new Uint8Array(buffer, 0, 7));

export async function loadPrecomputedGratitudeMesh() {
  const startedAt = performance.now();
  if (typeof DecompressionStream !== 'function') {
    throw new Error('AUDRALIA_MESH_DECOMPRESSION_UNAVAILABLE');
  }
  const parts = await Promise.all(MESH_URLS.map(async (url, index) => {
    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`AUDRALIA_MESH_PART_${index}_FETCH_FAILED_${response.status}`);
    if (!response.body) throw new Error(`AUDRALIA_MESH_PART_${index}_BODY_UNAVAILABLE`);
    const part = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    if (part.byteLength !== PART_LENGTHS[index]) throw new Error(`AUDRALIA_MESH_PART_${index}_LENGTH_INVALID`);
    return new Uint8Array(part);
  }));
  const totalLength = parts.reduce((total, part) => total + part.byteLength, 0);
  const merged = new Uint8Array(totalLength);
  let mergedOffset = 0;
  for (const part of parts) {
    merged.set(part, mergedOffset);
    mergedOffset += part.byteLength;
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
    verifiedChunkCount: parts.length,
    loadMilliseconds: performance.now() - startedAt,
    landMesh: Object.freeze({ vertices: landVertices, indices: landIndices, statistics: Object.freeze(statistics.land) }),
    coastalWaterMesh: Object.freeze({ vertices: waterVertices, indices: waterIndices, statistics: Object.freeze(statistics.water) })
  });
  return window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__;
}

export default loadPrecomputedGratitudeMesh;
