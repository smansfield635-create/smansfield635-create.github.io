import {
  sampleHEarthC2R1CandidateRendererMaterial
} from '../../h-earth.c2-r1.candidate-renderer-sampling.js';
import { getHEarthCanonicalShorelineZ } from '../../../../../terrain/h-earth.terrain-field.js';

export const H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT = Object.freeze({
  contractId: 'H_EARTH_C2_R1_R1_8_DETERMINISTIC_PREMATERIALIZED_REVIEW_MESH_v1',
  sourceHead: 'c53362c6f74b01c4e0b53be526b0e3a0b73edede',
  option: 'OPTION_B_DETERMINISTIC_PREMATERIALIZED_REVIEW_MESH',
  assetFile: 'h-earth.c2-r1.r1-8-review-mesh.bin',
  assetFormat: 'H_EARTH_C2_R1_R1_8_REVIEW_MESH_BINARY_LE_v1',
  headerByteLength: 128,
  alongCount: 49,
  crossCount: 73,
  alongMin: -180,
  alongMax: 180,
  inlandMin: -115,
  inlandMax: 135,
  completeSampleCount: 3577,
  terrainVertexCount: 3577,
  terrainIndexCount: 20736,
  waterRowCount: 37,
  waterVertexCount: 1813,
  waterIndexCount: 10368,
  fixedSampleOrder: true,
  fixedBatchBoundaries: [
    'TERRAIN_POSITIONS',
    'TERRAIN_NORMALS',
    'TERRAIN_MATERIAL_CONTROLS',
    'TERRAIN_INDICES',
    'WATER_POSITIONS',
    'WATER_NORMALS',
    'WATER_MATERIAL_CONTROLS',
    'WATER_INDICES'
  ],
  finalOutputIndependentOfScheduling: true,
  canonicalEncoding: 'LITTLE_ENDIAN_FLOAT32_AND_UINT32_TYPED_ARRAY_BYTES'
});

const MAGIC = new TextEncoder().encode('HERC2R1R18MESH1!');
const finite = Number.isFinite;
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const mix = (a, b, t) => a + (b - a) * t;
const vec3 = (x = 0, y = 0, z = 0) => new Float32Array([x, y, z]);
const add3 = (a, b) => vec3(a[0] + b[0], a[1] + b[1], a[2] + b[2]);
const sub3 = (a, b) => vec3(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const scale3 = (a, scale) => vec3(a[0] * scale, a[1] * scale, a[2] * scale);
const cross3 = (a, b) => vec3(
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
);
const normalize3 = value => {
  const length = Math.hypot(value[0], value[1], value[2]) || 1;
  return vec3(value[0] / length, value[1] / length, value[2] / length);
};
const yieldToMainThread = () => new Promise(resolve => setTimeout(resolve, 0));

export function getHEarthC2R1ReviewWorldAt(anchorX, signedInlandDistance) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(anchorX - step);
  const z1 = getHEarthCanonicalShorelineZ(anchorX + step);
  const tangent = normalize3(vec3(2 * step, 0, z1 - z0));
  let waterward = normalize3(vec3(-tangent[2], 0, tangent[0]));
  if (waterward[2] < 0) waterward = scale3(waterward, -1);
  const shoreline = vec3(anchorX, 0, getHEarthCanonicalShorelineZ(anchorX));
  return add3(shoreline, scale3(waterward, -signedInlandDistance));
}

function terrainNormal(records, row, column) {
  const { alongCount, crossCount } = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT;
  const recordAt = (r, c) => records[r * alongCount + c];
  const left = recordAt(row, Math.max(0, column - 1)).world;
  const right = recordAt(row, Math.min(alongCount - 1, column + 1)).world;
  const down = recordAt(Math.max(0, row - 1), column).world;
  const up = recordAt(Math.min(crossCount - 1, row + 1), column).world;
  return normalize3(cross3(sub3(up, down), sub3(right, left)));
}

function makeCanonicalArrays(records, { water = false } = {}) {
  const { alongCount, crossCount } = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT;
  const rowMap = [];
  for (let row = 0; row < crossCount; row += 1) {
    const source = records[row * alongCount];
    if (water && source.inland > 10) continue;
    rowMap.push(row);
  }
  const vertexCount = rowMap.length * alongCount;
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const materialControls = new Float32Array(vertexCount * 4);
  let offset = 0;
  for (const row of rowMap) {
    for (let column = 0; column < alongCount; column += 1) {
      const record = records[row * alongCount + column];
      const sample = record.sample;
      const normal = water ? vec3(0, 1, 0) : terrainNormal(records, row, column);
      let position = record.world;
      let color;
      let alpha = 1;
      if (water) {
        position = vec3(record.world[0], 0.18, record.world[2]);
        const preserved = sample.preservedCandidateResponses;
        const waterColor = preserved.waterSurfaceColorLinear;
        const foam = clamp(preserved.foamIntensity * preserved.foamOpacity, 0, 1);
        color = waterColor.map((channel, index) =>
          clamp(mix(channel, preserved.foamColorLinear[index], foam), 0, 1)
        );
        alpha = clamp(preserved.waterSurfaceOpacity + foam * 0.18, 0.24, 0.88);
      } else {
        const ao = sample.material.cavityOrAmbientOcclusion;
        color = sample.material.colorLinear.map(channel =>
          clamp(channel * (0.76 + 0.24 * ao), 0, 1)
        );
      }
      positions.set(position, offset * 3);
      normals.set(normal, offset * 3);
      materialControls.set([color[0], color[1], color[2], alpha], offset * 4);
      offset += 1;
    }
  }
  const indices = new Uint32Array(Math.max(0, rowMap.length - 1) * Math.max(0, alongCount - 1) * 6);
  let indexOffset = 0;
  for (let rowIndex = 0; rowIndex < rowMap.length - 1; rowIndex += 1) {
    for (let column = 0; column < alongCount - 1; column += 1) {
      const a = rowIndex * alongCount + column;
      const b = a + 1;
      const c = a + alongCount;
      const d = c + 1;
      indices.set([a, c, b, b, c, d], indexOffset);
      indexOffset += 6;
    }
  }
  return { positions, normals, materialControls, indices, vertexCount, indexCount: indices.length };
}

export function buildHEarthC2R1ReviewMeshSynchronously() {
  const contract = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT;
  const records = new Array(contract.completeSampleCount);
  let candidateMaterialSampleCount = 0;
  let macroDifferentialCount = 0;
  for (let sampleIndex = 0; sampleIndex < contract.completeSampleCount; sampleIndex += 1) {
    const row = Math.floor(sampleIndex / contract.alongCount);
    const column = sampleIndex % contract.alongCount;
    const inland = mix(contract.inlandMin, contract.inlandMax, row / (contract.crossCount - 1));
    const anchor = mix(contract.alongMin, contract.alongMax, column / (contract.alongCount - 1));
    const world = getHEarthC2R1ReviewWorldAt(anchor, inland);
    const sample = sampleHEarthC2R1CandidateRendererMaterial(world[0], world[2], { timeSeconds: 0 });
    if (sample?.valid !== true || !finite(sample.world?.x) || !finite(sample.world?.y) || !finite(sample.world?.z)) {
      throw new Error(`R1_8_CANDIDATE_SAMPLE_FAILED:${anchor}:${inland}`);
    }
    candidateMaterialSampleCount += 1;
    const base = sample.baseMaterialBeforeMacro.colorLinear;
    const applied = sample.material.colorLinear;
    if (applied.some((value, index) => Math.abs(value - base[index]) > 1e-12)) {
      macroDifferentialCount += 1;
    }
    records[sampleIndex] = {
      anchor,
      inland,
      world: vec3(sample.world.x, sample.world.y, sample.world.z),
      sample
    };
  }
  const terrain = makeCanonicalArrays(records);
  const water = makeCanonicalArrays(records, { water: true });
  return {
    contract,
    terrain,
    water,
    completeSampleCount: records.length,
    candidateMaterialSampleCount,
    macroDifferentialCount
  };
}

function arraySections(mesh) {
  return [
    ['TERRAIN_POSITIONS', mesh.terrain.positions, Float32Array],
    ['TERRAIN_NORMALS', mesh.terrain.normals, Float32Array],
    ['TERRAIN_MATERIAL_CONTROLS', mesh.terrain.materialControls, Float32Array],
    ['TERRAIN_INDICES', mesh.terrain.indices, Uint32Array],
    ['WATER_POSITIONS', mesh.water.positions, Float32Array],
    ['WATER_NORMALS', mesh.water.normals, Float32Array],
    ['WATER_MATERIAL_CONTROLS', mesh.water.materialControls, Float32Array],
    ['WATER_INDICES', mesh.water.indices, Uint32Array]
  ];
}

function writeHeader(view, mesh, totalByteLength) {
  const contract = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT;
  new Uint8Array(view.buffer, 0, 16).set(MAGIC);
  view.setUint32(16, 1, true);
  view.setUint32(20, contract.headerByteLength, true);
  view.setUint32(24, totalByteLength, true);
  view.setUint32(28, mesh.completeSampleCount, true);
  view.setUint32(32, mesh.terrain.vertexCount, true);
  view.setUint32(36, mesh.terrain.indexCount, true);
  view.setUint32(40, mesh.water.vertexCount, true);
  view.setUint32(44, mesh.water.indexCount, true);
  let offset = 48;
  for (const [, array] of arraySections(mesh)) {
    view.setUint32(offset, array.length, true);
    offset += 4;
  }
}

function readHeader(buffer) {
  const contract = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT;
  const bytes = new Uint8Array(buffer, 0, 16);
  if (bytes.some((value, index) => value !== MAGIC[index])) throw new Error('R1_8_REVIEW_MESH_MAGIC_MISMATCH');
  const view = new DataView(buffer);
  const version = view.getUint32(16, true);
  const headerByteLength = view.getUint32(20, true);
  const totalByteLength = view.getUint32(24, true);
  if (version !== 1 || headerByteLength !== contract.headerByteLength || totalByteLength !== buffer.byteLength) {
    throw new Error('R1_8_REVIEW_MESH_HEADER_MISMATCH');
  }
  const header = {
    version,
    headerByteLength,
    totalByteLength,
    completeSampleCount: view.getUint32(28, true),
    terrainVertexCount: view.getUint32(32, true),
    terrainIndexCount: view.getUint32(36, true),
    waterVertexCount: view.getUint32(40, true),
    waterIndexCount: view.getUint32(44, true),
    sectionLengths: []
  };
  for (let offset = 48; offset < 80; offset += 4) header.sectionLengths.push(view.getUint32(offset, true));
  if (
    header.completeSampleCount !== contract.completeSampleCount ||
    header.terrainVertexCount !== contract.terrainVertexCount ||
    header.terrainIndexCount !== contract.terrainIndexCount ||
    header.waterVertexCount !== contract.waterVertexCount ||
    header.waterIndexCount !== contract.waterIndexCount
  ) throw new Error('R1_8_REVIEW_MESH_COUNT_IDENTITY_MISMATCH');
  return header;
}

export function serializeHEarthC2R1ReviewMesh(mesh) {
  const contract = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT;
  const sections = arraySections(mesh);
  const dataByteLength = sections.reduce((sum, [, array]) => sum + array.byteLength, 0);
  const buffer = new ArrayBuffer(contract.headerByteLength + dataByteLength);
  const view = new DataView(buffer);
  writeHeader(view, mesh, buffer.byteLength);
  let byteOffset = contract.headerByteLength;
  for (const [, array] of sections) {
    new Uint8Array(buffer, byteOffset, array.byteLength).set(
      new Uint8Array(array.buffer, array.byteOffset, array.byteLength)
    );
    byteOffset += array.byteLength;
  }
  return new Uint8Array(buffer);
}

function decodeSections(buffer, header, copier) {
  const constructors = [
    Float32Array, Float32Array, Float32Array, Uint32Array,
    Float32Array, Float32Array, Float32Array, Uint32Array
  ];
  const names = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.fixedBatchBoundaries;
  let byteOffset = header.headerByteLength;
  return names.map((name, index) => {
    const Constructor = constructors[index];
    const length = header.sectionLengths[index];
    const byteLength = length * Constructor.BYTES_PER_ELEMENT;
    const source = new Constructor(buffer, byteOffset, length);
    const value = copier(source, name, index);
    byteOffset += byteLength;
    return [name, value];
  });
}

function assembleParsedMesh(header, entries) {
  const map = Object.fromEntries(entries);
  return {
    contract: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT,
    completeSampleCount: header.completeSampleCount,
    candidateMaterialSampleCount: header.completeSampleCount,
    terrain: {
      positions: map.TERRAIN_POSITIONS,
      normals: map.TERRAIN_NORMALS,
      materialControls: map.TERRAIN_MATERIAL_CONTROLS,
      indices: map.TERRAIN_INDICES,
      vertexCount: header.terrainVertexCount,
      indexCount: header.terrainIndexCount
    },
    water: {
      positions: map.WATER_POSITIONS,
      normals: map.WATER_NORMALS,
      materialControls: map.WATER_MATERIAL_CONTROLS,
      indices: map.WATER_INDICES,
      vertexCount: header.waterVertexCount,
      indexCount: header.waterIndexCount
    }
  };
}

export function parseHEarthC2R1ReviewMeshSynchronously(bufferLike) {
  const buffer = bufferLike instanceof ArrayBuffer
    ? bufferLike
    : bufferLike.buffer.slice(bufferLike.byteOffset, bufferLike.byteOffset + bufferLike.byteLength);
  const header = readHeader(buffer);
  const entries = decodeSections(buffer, header, source => source.slice());
  return assembleParsedMesh(header, entries);
}

export async function parseHEarthC2R1ReviewMeshIncrementally(bufferLike, { onBatch = null } = {}) {
  const buffer = bufferLike instanceof ArrayBuffer
    ? bufferLike
    : bufferLike.buffer.slice(bufferLike.byteOffset, bufferLike.byteOffset + bufferLike.byteLength);
  const header = readHeader(buffer);
  const entries = [];
  const constructors = [
    Float32Array, Float32Array, Float32Array, Uint32Array,
    Float32Array, Float32Array, Float32Array, Uint32Array
  ];
  const names = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.fixedBatchBoundaries;
  let byteOffset = header.headerByteLength;
  for (let index = 0; index < names.length; index += 1) {
    const startedAt = performance.now();
    const Constructor = constructors[index];
    const length = header.sectionLengths[index];
    const byteLength = length * Constructor.BYTES_PER_ELEMENT;
    const value = new Constructor(buffer, byteOffset, length).slice();
    byteOffset += byteLength;
    entries.push([names[index], value]);
    onBatch?.({
      batchIndex: index,
      name: names[index],
      byteLength,
      durationMilliseconds: performance.now() - startedAt
    });
    if (index < names.length - 1) await yieldToMainThread();
  }
  return assembleParsedMesh(header, entries);
}

function concatenate(a, b, Constructor) {
  const output = new Constructor(a.length + b.length);
  output.set(a, 0);
  output.set(b, a.length);
  return output;
}

export function canonicalHEarthC2R1ReviewMeshArrays(mesh) {
  return {
    positions: concatenate(mesh.terrain.positions, mesh.water.positions, Float32Array),
    normals: concatenate(mesh.terrain.normals, mesh.water.normals, Float32Array),
    materialControls: concatenate(mesh.terrain.materialControls, mesh.water.materialControls, Float32Array),
    indices: concatenate(mesh.terrain.indices, mesh.water.indices, Uint32Array)
  };
}

async function sha256TypedArray(view) {
  if (!globalThis.crypto?.subtle) throw new Error('R1_8_SUBTLE_CRYPTO_UNAVAILABLE');
  const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
}

export async function digestHEarthC2R1ReviewMesh(mesh) {
  const arrays = canonicalHEarthC2R1ReviewMeshArrays(mesh);
  return {
    completeSampleCount: mesh.completeSampleCount,
    vertexCount: mesh.terrain.vertexCount + mesh.water.vertexCount,
    indexCount: mesh.terrain.indexCount + mesh.water.indexCount,
    positionBufferByteLength: arrays.positions.byteLength,
    normalBufferByteLength: arrays.normals.byteLength,
    materialControlBufferByteLength: arrays.materialControls.byteLength,
    indexBufferByteLength: arrays.indices.byteLength,
    finalPositionDataSha256: await sha256TypedArray(arrays.positions),
    finalNormalDataSha256: await sha256TypedArray(arrays.normals),
    finalMaterialControlDataSha256: await sha256TypedArray(arrays.materialControls),
    finalIndexDataSha256: await sha256TypedArray(arrays.indices)
  };
}
