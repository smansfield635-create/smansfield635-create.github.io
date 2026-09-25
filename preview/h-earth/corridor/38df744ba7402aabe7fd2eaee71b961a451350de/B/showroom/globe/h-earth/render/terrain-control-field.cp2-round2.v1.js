/** H_EARTH_PRECOMPUTED_TERRAIN_CONTROL_FIELD_CP2_ROUND2_v1 */
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
const EPSILON = 1e-12;
const DOMAIN = Object.freeze({
  xMinimum: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.xMinimum,
  xMaximum: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.xMaximum,
  zMinimum: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.zMinimum,
  zMaximum: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain.zMaximum
});
const STEP_X = (DOMAIN.xMaximum - DOMAIN.xMinimum) / (WIDTH - 1);
const STEP_Z = (DOMAIN.zMaximum - DOMAIN.zMinimum) / (HEIGHT - 1);
const NEIGHBORS = Object.freeze([
  Object.freeze([-1, -1]), Object.freeze([0, -1]), Object.freeze([1, -1]),
  Object.freeze([-1, 0]), Object.freeze([1, 0]),
  Object.freeze([-1, 1]), Object.freeze([0, 1]), Object.freeze([1, 1])
]);

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const quantize = (value) => Math.round(clamp01(value) * 255);
const indexOf = (x, y) => y * WIDTH + x;
const worldX = (x) => DOMAIN.xMinimum + x * STEP_X;
const worldZ = (y) => DOMAIN.zMinimum + y * STEP_Z;
const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};
const fnv1a32 = (bytes) => {
  let value = 0x811c9dc5;
  for (const byte of bytes) {
    value ^= byte;
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return `fnv1a32:${value.toString(16).padStart(8, '0')}`;
};
const rotateRight = (value, amount) => (value >>> amount) | (value << (32 - amount));
const SHA256_K = new Uint32Array([
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
]);
function sha256(bytes) {
  const bitLength = bytes.length * 8;
  const paddedLength = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000), false);
  view.setUint32(paddedLength - 4, bitLength >>> 0, false);
  const state = new Uint32Array([
    0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,
    0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19
  ]);
  const words = new Uint32Array(64);
  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let i = 0; i < 16; i += 1) words[i] = view.getUint32(offset + i * 4, false);
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotateRight(words[i - 15], 7) ^ rotateRight(words[i - 15], 18) ^ (words[i - 15] >>> 3);
      const s1 = rotateRight(words[i - 2], 17) ^ rotateRight(words[i - 2], 19) ^ (words[i - 2] >>> 10);
      words[i] = (words[i - 16] + s0 + words[i - 7] + s1) >>> 0;
    }
    let [a,b,c,d,e,f,g,h] = state;
    for (let i = 0; i < 64; i += 1) {
      const sigma1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ (~e & g);
      const t1 = (h + sigma1 + choice + SHA256_K[i] + words[i]) >>> 0;
      const sigma0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (sigma0 + majority) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    state[0] = (state[0] + a) >>> 0; state[1] = (state[1] + b) >>> 0;
    state[2] = (state[2] + c) >>> 0; state[3] = (state[3] + d) >>> 0;
    state[4] = (state[4] + e) >>> 0; state[5] = (state[5] + f) >>> 0;
    state[6] = (state[6] + g) >>> 0; state[7] = (state[7] + h) >>> 0;
  }
  return [...state].map((value) => value.toString(16).padStart(8, '0')).join('');
}

function sampleGrid() {
  const heights = new Float64Array(COUNT);
  let minimumElevation = Infinity;
  let maximumElevation = -Infinity;
  for (let y = 0; y < HEIGHT; y += 1) {
    const z = worldZ(y);
    for (let x = 0; x < WIDTH; x += 1) {
      const elevation = sampleHEarthRun8BSuccessorTerrainElevation(worldX(x), z);
      if (!finite(elevation)) throw new Error(`H_EARTH_CONTROL_FIELD_TERRAIN_SAMPLE_INVALID:${x}:${y}`);
      const index = indexOf(x, y);
      heights[index] = Object.is(elevation, -0) ? 0 : elevation;
      minimumElevation = Math.min(minimumElevation, heights[index]);
      maximumElevation = Math.max(maximumElevation, heights[index]);
    }
  }
  return { heights, minimumElevation, maximumElevation };
}

function deriveField(heights) {
  const receiver = new Int32Array(COUNT); receiver.fill(-1);
  const directionX = new Float64Array(COUNT);
  const directionZ = new Float64Array(COUNT);
  const curvature = new Float64Array(COUNT);
  let sinkCount = 0;
  const heightAt = (x, y) => heights[indexOf(Math.max(0, Math.min(WIDTH - 1, x)), Math.max(0, Math.min(HEIGHT - 1, y)))];

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const index = indexOf(x, y);
      const center = heights[index];
      let selected = -1;
      let selectedSlope = -Infinity;
      let selectedOffsetX = 0;
      let selectedOffsetY = 0;
      for (const [offsetX, offsetY] of NEIGHBORS) {
        const nx = x + offsetX;
        const ny = y + offsetY;
        if (nx < 0 || nx >= WIDTH || ny < 0 || ny >= HEIGHT) continue;
        const neighbor = heights[indexOf(nx, ny)];
        const drop = center - neighbor;
        if (!(drop > EPSILON)) continue;
        const worldDistance = Math.hypot(offsetX * STEP_X, offsetY * STEP_Z);
        const slope = drop / worldDistance;
        if (slope > selectedSlope + EPSILON) {
          selectedSlope = slope;
          selected = indexOf(nx, ny);
          selectedOffsetX = offsetX;
          selectedOffsetY = offsetY;
        }
      }
      let dx;
      let dz;
      if (selected >= 0) {
        dx = selectedOffsetX * STEP_X;
        dz = selectedOffsetY * STEP_Z;
      } else {
        const left = x > 0 ? heightAt(x - 1, y) : center;
        const right = x + 1 < WIDTH ? heightAt(x + 1, y) : center;
        const down = y > 0 ? heightAt(x, y - 1) : center;
        const up = y + 1 < HEIGHT ? heightAt(x, y + 1) : center;
        const gradientX = x > 0 && x + 1 < WIDTH ? (right - left) / (2 * STEP_X) : x === 0 ? (right - center) / STEP_X : (center - left) / STEP_X;
        const gradientZ = y > 0 && y + 1 < HEIGHT ? (up - down) / (2 * STEP_Z) : y === 0 ? (up - center) / STEP_Z : (center - down) / STEP_Z;
        dx = -gradientX;
        dz = -gradientZ;
        sinkCount += 1;
      }
      let magnitude = Math.hypot(dx, dz);
      if (!(magnitude > EPSILON)) { dx = 0; dz = -1; magnitude = 1; }
      directionX[index] = dx / magnitude;
      directionZ[index] = dz / magnitude;
      receiver[index] = selected;
      const left = heightAt(x - 1, y);
      const right = heightAt(x + 1, y);
      const down = heightAt(x, y - 1);
      const up = heightAt(x, y + 1);
      curvature[index] = (left - 2 * center + right) / (STEP_X * STEP_X) + (down - 2 * center + up) / (STEP_Z * STEP_Z);
    }
  }

  const order = Array.from({ length: COUNT }, (_, index) => index);
  order.sort((left, right) => heights[right] - heights[left] || left - right);
  const accumulation = new Float64Array(COUNT); accumulation.fill(1);
  for (const index of order) {
    const downstream = receiver[index];
    if (downstream >= 0) {
      if (!(heights[downstream] < heights[index] - EPSILON)) throw new Error(`H_EARTH_CONTROL_FIELD_RECEIVER_NOT_STRICTLY_LOWER:${index}:${downstream}`);
      accumulation[downstream] += accumulation[index];
    }
  }
  return { receiver, directionX, directionZ, curvature, accumulation, sinkCount };
}

export function generateHEarthTerrainControlField() {
  const { heights, minimumElevation, maximumElevation } = sampleGrid();
  const { receiver, directionX, directionZ, curvature, accumulation, sinkCount } = deriveField(heights);
  let maximumAccumulation = 1;
  let maximumAbsoluteCurvature = 0;
  for (let index = 0; index < COUNT; index += 1) {
    maximumAccumulation = Math.max(maximumAccumulation, accumulation[index]);
    maximumAbsoluteCurvature = Math.max(maximumAbsoluteCurvature, Math.abs(curvature[index]));
  }
  const bytes = new Uint8Array(H_EARTH_TERRAIN_CONTROL_FIELD_BYTE_LENGTH);
  const logMaximumFlow = Math.log1p(maximumAccumulation);
  for (let index = 0; index < COUNT; index += 1) {
    const offset = index * 4;
    bytes[offset] = quantize(directionX[index] * 0.5 + 0.5);
    bytes[offset + 1] = quantize(directionZ[index] * 0.5 + 0.5);
    bytes[offset + 2] = quantize(Math.log1p(accumulation[index]) / logMaximumFlow);
    const normalizedCurvature = maximumAbsoluteCurvature === 0
      ? 0
      : Math.tanh(curvature[index] / (maximumAbsoluteCurvature * 0.22));
    bytes[offset + 3] = quantize(normalizedCurvature * 0.5 + 0.5);
  }
  const metadata = deepFreeze({
    fieldId: H_EARTH_TERRAIN_CONTROL_FIELD_ID,
    sourceContractId: H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD_CONTRACT_ID,
    width: WIDTH,
    height: HEIGHT,
    channelCount: 4,
    storage: 'RGBA8_UNORM',
    baseByteLength: bytes.byteLength,
    mipmapsRequired: true,
    domain: { ...DOMAIN },
    texelWorldStep: { x: STEP_X, z: STEP_Z },
    channels: {
      red: 'ENCODED_DOWNSLOPE_DIRECTION_X',
      green: 'ENCODED_DOWNSLOPE_DIRECTION_Z',
      blue: 'NORMALIZED_FLOW_ACCUMULATION_OR_DRAINAGE_STRENGTH',
      alpha: 'NORMALIZED_SIGNED_CURVATURE_OR_LANDFORM_CLASS'
    },
    minimumElevation,
    maximumElevation,
    maximumFlowAccumulation: maximumAccumulation,
    maximumAbsoluteCurvature,
    sinkCount,
    receiverCount: COUNT - sinkCount,
    strictLowerReceiverLaw: true,
    canonicalDigestAlgorithm: 'SHA-256',
    canonicalSha256: sha256(bytes),
    runtimeFastDigest: fnv1a32(bytes),
    deterministicGeneration: true,
    immutablePrivateStorage: true
  });
  return Object.freeze({ ...metadata, bytes: new Uint8Array(bytes) });
}

let cachedField = null;
function resolveCachedField() {
  if (cachedField === null) cachedField = generateHEarthTerrainControlField();
  return cachedField;
}
export function getHEarthTerrainControlField() {
  const field = resolveCachedField();
  return Object.freeze({ ...field, domain: Object.freeze({ ...field.domain }), texelWorldStep: Object.freeze({ ...field.texelWorldStep }), channels: Object.freeze({ ...field.channels }), bytes: new Uint8Array(field.bytes) });
}
export function getHEarthTerrainControlFieldReceipt() {
  const field = resolveCachedField();
  const { bytes: _bytes, ...receipt } = field;
  return deepFreeze({ ...receipt, domain: { ...receipt.domain }, texelWorldStep: { ...receipt.texelWorldStep }, channels: { ...receipt.channels } });
}

export default getHEarthTerrainControlField;
