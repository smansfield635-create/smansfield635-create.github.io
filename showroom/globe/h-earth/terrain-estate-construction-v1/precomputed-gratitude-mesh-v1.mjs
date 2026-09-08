const MESH_URL = new URL('./gratitude-mesh-v1.bin.gz?cb=AUDRALIA_GRATITUDE_MESH_v1', import.meta.url);
const MAGIC = 'AUDGMV1';

const readMagic = buffer => new TextDecoder().decode(new Uint8Array(buffer, 0, 7));

export async function loadPrecomputedGratitudeMesh() {
  const startedAt = performance.now();
  const response = await fetch(MESH_URL, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`AUDRALIA_MESH_FETCH_FAILED_${response.status}`);
  if (!response.body || typeof DecompressionStream !== 'function') {
    throw new Error('AUDRALIA_MESH_DECOMPRESSION_UNAVAILABLE');
  }
  const buffer = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
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
    loadMilliseconds: performance.now() - startedAt,
    landMesh: Object.freeze({ vertices: landVertices, indices: landIndices, statistics: Object.freeze(statistics.land) }),
    coastalWaterMesh: Object.freeze({ vertices: waterVertices, indices: waterIndices, statistics: Object.freeze(statistics.water) })
  });
  return window.__AUDRALIA_PRECOMPUTED_GRATITUDE_MESH__;
}

export default loadPrecomputedGratitudeMesh;
