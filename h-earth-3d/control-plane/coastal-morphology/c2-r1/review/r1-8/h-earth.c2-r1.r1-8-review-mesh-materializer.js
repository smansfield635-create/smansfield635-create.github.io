import {
  sampleHEarthC2R1CandidateRendererMaterial
} from '../../h-earth.c2-r1.candidate-renderer-sampling.js';
import { getHEarthCanonicalShorelineZ } from '../../../../../terrain/h-earth.terrain-field.js';

export const H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT = Object.freeze({
  contractId: 'H_EARTH_C2_R1_R1_8_DETERMINISTIC_REVIEW_MESH_v1',
  sourceHead: 'c53362c6f74b01c4e0b53be526b0e3a0b73edede',
  option: 'OPTION_A_DETERMINISTIC_INCREMENTAL_CONSTRUCTION',
  alongCount: 49,
  crossCount: 73,
  alongMin: -180,
  alongMax: 180,
  inlandMin: -115,
  inlandMax: 135,
  fixedSampleOrder: true,
  fixedBatchSize: 24,
  fixedBatchBoundaries: true,
  completeSampleCount: 3577,
  finalOutputIndependentOfScheduling: true,
  canonicalEncoding: 'LITTLE_ENDIAN_FLOAT32_AND_UINT32_TYPED_ARRAY_BYTES'
});

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

function shorelineFrame(anchorX) {
  const step = 0.5;
  const z0 = getHEarthCanonicalShorelineZ(anchorX - step);
  const z1 = getHEarthCanonicalShorelineZ(anchorX + step);
  const tangent = normalize3(vec3(2 * step, 0, z1 - z0));
  let waterward = normalize3(vec3(-tangent[2], 0, tangent[0]));
  if (waterward[2] < 0) waterward = scale3(waterward, -1);
  return {
    shoreline: vec3(anchorX, 0, getHEarthCanonicalShorelineZ(anchorX)),
    inlandNormal: scale3(waterward, -1)
  };
}

function worldAt(anchorX, signedInlandDistance) {
  const frame = shorelineFrame(anchorX);
  return add3(frame.shoreline, scale3(frame.inlandNormal, signedInlandDistance));
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
        color = waterColor.map((channel, index) => clamp(mix(channel, preserved.foamColorLinear[index], foam), 0, 1));
        alpha = clamp(preserved.waterSurfaceOpacity + foam * 0.18, 0.24, 0.88);
      } else {
        const ao = sample.material.cavityOrAmbientOcclusion;
        color = sample.material.colorLinear.map(channel => clamp(channel * (0.76 + 0.24 * ao), 0, 1));
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

function finalize(records, counters) {
  const terrain = makeCanonicalArrays(records);
  const water = makeCanonicalArrays(records, { water: true });
  return {
    contract: H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT,
    records,
    terrain,
    water,
    completeSampleCount: records.length,
    candidateMaterialSampleCount: counters.candidateMaterialSampleCount,
    macroDifferentialCount: counters.macroDifferentialCount,
    canonical: {
      completeSampleCount: records.length,
      vertexCount: terrain.vertexCount + water.vertexCount,
      indexCount: terrain.indexCount + water.indexCount,
      positionBufferByteLength: terrain.positions.byteLength + water.positions.byteLength,
      normalBufferByteLength: terrain.normals.byteLength + water.normals.byteLength,
      materialControlBufferByteLength: terrain.materialControls.byteLength + water.materialControls.byteLength,
      indexBufferByteLength: terrain.indices.byteLength + water.indices.byteLength
    }
  };
}

function sampleOne(sampleIndex, records, counters) {
  const {
    alongCount,
    crossCount,
    alongMin,
    alongMax,
    inlandMin,
    inlandMax
  } = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT;
  const row = Math.floor(sampleIndex / alongCount);
  const column = sampleIndex % alongCount;
  const inland = mix(inlandMin, inlandMax, row / (crossCount - 1));
  const anchor = mix(alongMin, alongMax, column / (alongCount - 1));
  const world = worldAt(anchor, inland);
  const sample = sampleHEarthC2R1CandidateRendererMaterial(world[0], world[2], { timeSeconds: 0 });
  if (sample?.valid !== true || !finite(sample.world?.x) || !finite(sample.world?.y) || !finite(sample.world?.z)) {
    throw new Error(`R1_8_CANDIDATE_SAMPLE_FAILED:${anchor}:${inland}`);
  }
  counters.candidateMaterialSampleCount += 1;
  const base = sample.baseMaterialBeforeMacro.colorLinear;
  const applied = sample.material.colorLinear;
  if (applied.some((value, index) => Math.abs(value - base[index]) > 1e-12)) counters.macroDifferentialCount += 1;
  records[sampleIndex] = {
    anchor,
    inland,
    world: vec3(sample.world.x, sample.world.y, sample.world.z),
    sample
  };
}

export function buildHEarthC2R1ReviewMeshSynchronously() {
  const { completeSampleCount } = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT;
  const records = new Array(completeSampleCount);
  const counters = { candidateMaterialSampleCount: 0, macroDifferentialCount: 0 };
  for (let sampleIndex = 0; sampleIndex < completeSampleCount; sampleIndex += 1) {
    sampleOne(sampleIndex, records, counters);
  }
  return finalize(records, counters);
}

export async function buildHEarthC2R1ReviewMeshIncrementally({
  batchSize = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.fixedBatchSize,
  onBatch = null
} = {}) {
  const { completeSampleCount } = H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT;
  if (batchSize !== H_EARTH_C2_R1_R1_8_REVIEW_MESH_CONTRACT.fixedBatchSize) {
    throw new Error('R1_8_REVIEW_MESH_BATCH_SIZE_NOT_CANONICAL');
  }
  const records = new Array(completeSampleCount);
  const counters = { candidateMaterialSampleCount: 0, macroDifferentialCount: 0 };
  let batchIndex = 0;
  for (let start = 0; start < completeSampleCount; start += batchSize) {
    const end = Math.min(completeSampleCount, start + batchSize);
    const startedAt = performance.now();
    for (let sampleIndex = start; sampleIndex < end; sampleIndex += 1) {
      sampleOne(sampleIndex, records, counters);
    }
    onBatch?.({
      batchIndex,
      start,
      end,
      completedSampleCount: end,
      durationMilliseconds: performance.now() - startedAt
    });
    batchIndex += 1;
    if (end < completeSampleCount) await yieldToMainThread();
  }
  return finalize(records, counters);
}

export async function sha256TypedArray(view) {
  if (!globalThis.crypto?.subtle) throw new Error('R1_8_SUBTLE_CRYPTO_UNAVAILABLE');
  const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
}

export async function digestHEarthC2R1ReviewMesh(mesh) {
  const concatenate = (a, b, Constructor) => {
    const output = new Constructor(a.length + b.length);
    output.set(a, 0);
    output.set(b, a.length);
    return output;
  };
  const positions = concatenate(mesh.terrain.positions, mesh.water.positions, Float32Array);
  const normals = concatenate(mesh.terrain.normals, mesh.water.normals, Float32Array);
  const materialControls = concatenate(mesh.terrain.materialControls, mesh.water.materialControls, Float32Array);
  const indices = concatenate(mesh.terrain.indices, mesh.water.indices, Uint32Array);
  return {
    ...mesh.canonical,
    finalPositionDataSha256: await sha256TypedArray(positions),
    finalNormalDataSha256: await sha256TypedArray(normals),
    finalMaterialControlDataSha256: await sha256TypedArray(materialControls),
    finalIndexDataSha256: await sha256TypedArray(indices)
  };
}
