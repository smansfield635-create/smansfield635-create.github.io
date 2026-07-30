/**
 * H_EARTH_PRECOMPUTED_TERRAIN_CONTROL_FIELD_CP2_ROUND2_v1
 *
 * Derives one deterministic 256x256 RGBA8 presentation-control field from the
 * frozen Run 8B successor terrain sampler. The private byte field is generated
 * once and exposed only through defensive copies.
 */
import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
  sampleHEarthRun8BSuccessorTerrainElevation
} from '../../../../h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js';

export const H_EARTH_TERRAIN_CONTROL_FIELD_ID =
  'H_EARTH_PRECOMPUTED_TERRAIN_CONTROL_FIELD_CP2_ROUND2_v1';
export const H_EARTH_TERRAIN_CONTROL_FIELD_WIDTH = 256;
export const H_EARTH_TERRAIN_CONTROL_FIELD_HEIGHT = 256;
export const H_EARTH_TERRAIN_CONTROL_FIELD_BYTE_LENGTH =
  H_EARTH_TERRAIN_CONTROL_FIELD_WIDTH * H_EARTH_TERRAIN_CONTROL_FIELD_HEIGHT * 4;

const WIDTH = H_EARTH_TERRAIN_CONTROL_FIELD_WIDTH;
const HEIGHT = H_EARTH_TERRAIN_CONTROL_FIELD_HEIGHT;
const COUNT = WIDTH * HEIGHT;
const DOMAIN = Object.freeze({
  xMinimum: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.xMinimum,
  xMaximum: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.xMaximum,
  zMinimum: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.zMinimum,
  zMaximum: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.zMaximum
});
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const byte = (value) => Math.round(clamp01(value) * 255);
const fnv1a32 = (bytes) => {
  let value = 0x811c9dc5;
  for (const member of bytes) {
    value ^= member;
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return `fnv1a32:${value.toString(16).padStart(8, '0')}`;
};
const indexOf = (x, y) => y * WIDTH + x;
const xWorld = (x) =>
  DOMAIN.xMinimum + (DOMAIN.xMaximum - DOMAIN.xMinimum) * x / (WIDTH - 1);
const zWorld = (y) =>
  DOMAIN.zMinimum + (DOMAIN.zMaximum - DOMAIN.zMinimum) * y / (HEIGHT - 1);

let privateField = null;

function buildControlField() {
  const started = globalThis.performance?.now?.() ?? Date.now();
  const heights = new Float64Array(COUNT);
  let minimumElevation = Infinity;
  let maximumElevation = -Infinity;

  for (let y = 0; y < HEIGHT; y += 1) {
    const z = zWorld(y);
    for (let x = 0; x < WIDTH; x += 1) {
      const elevation = sampleHEarthRun8BSuccessorTerrainElevation(xWorld(x), z);
      if (!finite(elevation)) {
        throw new Error(`H_EARTH_CONTROL_FIELD_TERRAIN_SAMPLE_INVALID:${x}:${y}`);
      }
      const index = indexOf(x, y);
      heights[index] = elevation;
      minimumElevation = Math.min(minimumElevation, elevation);
      maximumElevation = Math.max(maximumElevation, elevation);
    }
  }

  const receiver = new Int32Array(COUNT);
  receiver.fill(-1);
  const indegree = new Uint16Array(COUNT);
  const accumulation = new Float64Array(COUNT);
  accumulation.fill(1);
  const directionX = new Float32Array(COUNT);
  const directionZ = new Float32Array(COUNT);
  const curvature = new Float32Array(COUNT);
  const neighborOffsets = Object.freeze([
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],            [1, 0],
    [-1, 1],  [0, 1],   [1, 1]
  ]);

  const sampleHeight = (x, y) =>
    heights[indexOf(Math.max(0, Math.min(WIDTH - 1, x)), Math.max(0, Math.min(HEIGHT - 1, y)))];

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const index = indexOf(x, y);
      const left = sampleHeight(x - 1, y);
      const right = sampleHeight(x + 1, y);
      const down = sampleHeight(x, y - 1);
      const up = sampleHeight(x, y + 1);
      const gradientX = (right - left) * 0.5;
      const gradientZ = (up - down) * 0.5;
      let dx = -gradientX;
      let dz = -gradientZ;
      let magnitude = Math.hypot(dx, dz);
      let selected = -1;
      let selectedSlope = 0;

      for (const [offsetX, offsetY] of neighborOffsets) {
        const nx = x + offsetX;
        const ny = y + offsetY;
        if (nx < 0 || nx >= WIDTH || ny < 0 || ny >= HEIGHT) continue;
        const neighborIndex = indexOf(nx, ny);
        const distance = offsetX !== 0 && offsetY !== 0 ? Math.SQRT2 : 1;
        const slope = (heights[index] - heights[neighborIndex]) / distance;
        if (slope > selectedSlope + 1e-12) {
          selectedSlope = slope;
          selected = neighborIndex;
        }
      }

      if (magnitude < 1e-10 && selected >= 0) {
        const selectedX = selected % WIDTH;
        const selectedY = Math.floor(selected / WIDTH);
        dx = selectedX - x;
        dz = selectedY - y;
        magnitude = Math.hypot(dx, dz);
      }
      if (magnitude < 1e-10) {
        dx = 0;
        dz = -1;
        magnitude = 1;
      }
      directionX[index] = dx / magnitude;
      directionZ[index] = dz / magnitude;
      curvature[index] = left + right + down + up - 4 * heights[index];
      receiver[index] = selected;
      if (selected >= 0) indegree[selected] += 1;
    }
  }

  const queue = new Int32Array(COUNT);
  let head = 0;
  let tail = 0;
  for (let index = 0; index < COUNT; index += 1) {
    if (indegree[index] === 0) queue[tail++] = index;
  }
  while (head < tail) {
    const index = queue[head++];
    const downstream = receiver[index];
    if (downstream < 0) continue;
    accumulation[downstream] += accumulation[index];
    indegree[downstream] -= 1;
    if (indegree[downstream] === 0) queue[tail++] = downstream;
  }
  if (tail !== COUNT) {
    throw new Error(`H_EARTH_CONTROL_FIELD_FLOW_GRAPH_INCOMPLETE:${tail}:${COUNT}`);
  }

  let maximumAccumulation = 1;
  let maximumAbsoluteCurvature = 1e-9;
  for (let index = 0; index < COUNT; index += 1) {
    maximumAccumulation = Math.max(maximumAccumulation, accumulation[index]);
    maximumAbsoluteCurvature = Math.max(maximumAbsoluteCurvature, Math.abs(curvature[index]));
  }

  const bytes = new Uint8Array(H_EARTH_TERRAIN_CONTROL_FIELD_BYTE_LENGTH);
  const logMaximumFlow = Math.log1p(maximumAccumulation);
  for (let index = 0; index < COUNT; index += 1) {
    const offset = index * 4;
    bytes[offset] = byte(directionX[index] * 0.5 + 0.5);
    bytes[offset + 1] = byte(directionZ[index] * 0.5 + 0.5);
    bytes[offset + 2] = byte(Math.log1p(accumulation[index]) / logMaximumFlow);
    const normalizedCurvature = Math.tanh(
      curvature[index] / Math.max(1e-9, maximumAbsoluteCurvature * 0.22)
    );
    bytes[offset + 3] = byte(normalizedCurvature * 0.5 + 0.5);
  }

  const completed = globalThis.performance?.now?.() ?? Date.now();
  return Object.freeze({
    metadata: Object.freeze({
      fieldId: H_EARTH_TERRAIN_CONTROL_FIELD_ID,
      sourceContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
      width: WIDTH,
      height: HEIGHT,
      channelCount: 4,
      storage: 'RGBA8',
      baseByteLength: bytes.byteLength,
      mipmapsRequired: true,
      domain: DOMAIN,
      channels: Object.freeze({
        red: 'ENCODED_DOWNSLOPE_DIRECTION_X',
        green: 'ENCODED_DOWNSLOPE_DIRECTION_Z',
        blue: 'NORMALIZED_FLOW_ACCUMULATION_OR_DRAINAGE_STRENGTH',
        alpha: 'NORMALIZED_SIGNED_CURVATURE_OR_LANDFORM_CLASS'
      }),
      minimumElevation,
      maximumElevation,
      maximumFlowAccumulation: maximumAccumulation,
      canonicalByteDigest: fnv1a32(bytes),
      deterministicGeneration: true,
      immutablePrivateStorage: true,
      generationDurationMs: Math.max(0, completed - started)
    }),
    bytes
  });
}

function resolvePrivateField() {
  if (privateField === null) privateField = buildControlField();
  return privateField;
}

export function getHEarthTerrainControlField() {
  const field = resolvePrivateField();
  return Object.freeze({
    ...field.metadata,
    domain: Object.freeze({ ...field.metadata.domain }),
    channels: Object.freeze({ ...field.metadata.channels }),
    bytes: new Uint8Array(field.bytes)
  });
}

export function getHEarthTerrainControlFieldReceipt() {
  const field = resolvePrivateField();
  return Object.freeze({
    ...field.metadata,
    domain: Object.freeze({ ...field.metadata.domain }),
    channels: Object.freeze({ ...field.metadata.channels })
  });
}

export default getHEarthTerrainControlField;
