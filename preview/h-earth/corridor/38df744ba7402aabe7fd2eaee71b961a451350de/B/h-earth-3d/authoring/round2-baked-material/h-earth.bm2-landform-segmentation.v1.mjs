import crypto from 'node:crypto';
import {
  H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD,
  sampleHEarthRun8BSuccessorTerrainElevation
} from '../../terrain/h-earth.successor-terrain-field.run8b.js';

export const H_EARTH_BM2_ANALYSIS_WIDTH = 256;
export const H_EARTH_BM2_ANALYSIS_HEIGHT = 256;
export const H_EARTH_BM2_VARIANT_COUNT = 16;
export const H_EARTH_BM2_LANDFORM_CLASSES = Object.freeze([
  'FLAT', 'SUMMIT', 'RIDGE', 'SHOULDER', 'SPUR',
  'SLOPE', 'HOLLOW', 'FOOTSLOPE', 'VALLEY', 'DEPRESSION'
]);

const W = H_EARTH_BM2_ANALYSIS_WIDTH;
const H = H_EARTH_BM2_ANALYSIS_HEIGHT;
const N = W * H;
const DOMAIN = Object.freeze({ ...H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_FIELD.worldDomain });
const STEP_X = (DOMAIN.xMaximum - DOMAIN.xMinimum) / (W - 1);
const STEP_Z = (DOMAIN.zMaximum - DOMAIN.zMinimum) / (H - 1);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);
const at = (array, x, y) => array[clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1)];
const hash32 = (value) => {
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return (value ^ (value >>> 16)) >>> 0;
};
const hash01 = (value) => hash32(value) / 0xffffffff;
const sha256Typed = (...arrays) => {
  const hash = crypto.createHash('sha256');
  for (const array of arrays) hash.update(Buffer.from(array.buffer, array.byteOffset, array.byteLength));
  return hash.digest('hex');
};
const meanAndDeviation = (array) => {
  let sum = 0;
  let square = 0;
  for (const value of array) { sum += value; square += value * value; }
  const mean = sum / array.length;
  return { mean, deviation: Math.sqrt(Math.max(0, square / array.length - mean * mean)) };
};

function sampleHeights() {
  const heights = new Float64Array(N);
  let minimum = Infinity;
  let maximum = -Infinity;
  for (let y = 0; y < H; y += 1) {
    const z = DOMAIN.zMinimum + y * STEP_Z;
    for (let x = 0; x < W; x += 1) {
      const worldX = DOMAIN.xMinimum + x * STEP_X;
      const value = sampleHEarthRun8BSuccessorTerrainElevation(worldX, z);
      if (!Number.isFinite(value)) throw new Error(`BM2_TERRAIN_SAMPLE_INVALID:${x}:${y}`);
      const index = y * W + x;
      heights[index] = Object.is(value, -0) ? 0 : value;
      minimum = Math.min(minimum, heights[index]);
      maximum = Math.max(maximum, heights[index]);
    }
  }
  return { heights, minimum, maximum };
}

function integralImage(values) {
  const stride = W + 1;
  const integral = new Float64Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y += 1) {
    let row = 0;
    for (let x = 0; x < W; x += 1) {
      row += values[y * W + x];
      integral[(y + 1) * stride + x + 1] = integral[y * stride + x + 1] + row;
    }
  }
  return integral;
}

function windowMean(integral, x, y, radius) {
  const stride = W + 1;
  const x0 = Math.max(0, x - radius);
  const y0 = Math.max(0, y - radius);
  const x1 = Math.min(W - 1, x + radius);
  const y1 = Math.min(H - 1, y + radius);
  const sum = integral[(y1 + 1) * stride + x1 + 1]
    - integral[y0 * stride + x1 + 1]
    - integral[(y1 + 1) * stride + x0]
    + integral[y0 * stride + x0];
  return sum / ((x1 - x0 + 1) * (y1 - y0 + 1));
}

function deriveDescriptors(heights) {
  const slope = new Float32Array(N);
  const aspect = new Float32Array(N);
  const profileCurvature = new Float32Array(N);
  const planCurvature = new Float32Array(N);
  const integral = integralImage(heights);
  const tpiSmall = new Float32Array(N);
  const tpiMedium = new Float32Array(N);
  const tpiLarge = new Float32Array(N);
  const radii = [2, 8, 24];

  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const index = y * W + x;
      const center = heights[index];
      tpiSmall[index] = center - windowMean(integral, x, y, radii[0]);
      tpiMedium[index] = center - windowMean(integral, x, y, radii[1]);
      tpiLarge[index] = center - windowMean(integral, x, y, radii[2]);
      const left = at(heights, x - 1, y);
      const right = at(heights, x + 1, y);
      const down = at(heights, x, y - 1);
      const up = at(heights, x, y + 1);
      const hxx = (left - 2 * center + right) / (STEP_X * STEP_X);
      const hzz = (down - 2 * center + up) / (STEP_Z * STEP_Z);
      const hxz = (
        at(heights, x + 1, y + 1) - at(heights, x + 1, y - 1)
        - at(heights, x - 1, y + 1) + at(heights, x - 1, y - 1)
      ) / (4 * STEP_X * STEP_Z);
      const gx = (right - left) / (2 * STEP_X);
      const gz = (up - down) / (2 * STEP_Z);
      const magnitude = Math.hypot(gx, gz);
      slope[index] = magnitude;
      aspect[index] = (Math.atan2(gz, gx) + Math.PI) / (2 * Math.PI);
      if (magnitude > 1e-9) {
        const ux = gx / magnitude;
        const uz = gz / magnitude;
        profileCurvature[index] = hxx * ux * ux + 2 * hxz * ux * uz + hzz * uz * uz;
        planCurvature[index] = hxx * uz * uz - 2 * hxz * ux * uz + hzz * ux * ux;
      } else {
        profileCurvature[index] = hxx + hzz;
        planCurvature[index] = 0;
      }
    }
  }

  const mediumStats = meanAndDeviation(tpiMedium);
  const largeStats = meanAndDeviation(tpiLarge);
  const slopeStats = meanAndDeviation(slope);
  const profileStats = meanAndDeviation(profileCurvature);
  const planStats = meanAndDeviation(planCurvature);
  const landformClass = new Uint8Array(N);
  const exposureWetness = new Float32Array(N);
  const ridgeMask = new Uint8Array(N);
  const valleyMask = new Uint8Array(N);
  const safe = (value) => Math.max(value, 1e-7);

  for (let index = 0; index < N; index += 1) {
    const tm = (tpiMedium[index] - mediumStats.mean) / safe(mediumStats.deviation);
    const tl = (tpiLarge[index] - largeStats.mean) / safe(largeStats.deviation);
    const s = slope[index] / safe(slopeStats.mean + slopeStats.deviation);
    const pc = (profileCurvature[index] - profileStats.mean) / safe(profileStats.deviation);
    const plc = (planCurvature[index] - planStats.mean) / safe(planStats.deviation);
    let cls = 5;
    if (s < 0.12 && Math.abs(tl) < 0.25) cls = 0;
    else if (tl > 1.15 && tm > 0.55) cls = 1;
    else if (tm > 0.80 && plc < 0.25) cls = 2;
    else if (tl > 0.35 && pc < -0.25) cls = 3;
    else if (plc < -0.75 && tm > 0.10) cls = 4;
    else if (plc > 0.75 && tm < 0.15) cls = 6;
    else if (tl < -0.35 && pc > 0.25) cls = 7;
    else if (tm < -0.80 && plc > -0.25) cls = 8;
    else if (tl < -1.15 && tm < -0.55) cls = 9;
    landformClass[index] = cls;
    if (cls === 1 || cls === 2 || cls === 4) ridgeMask[index] = 1;
    if (cls === 6 || cls === 8 || cls === 9) valleyMask[index] = 1;
    const aspectExposure = 0.5 + 0.5 * Math.cos(aspect[index] * 2 * Math.PI - 0.75);
    exposureWetness[index] = clamp01(0.50 + tl * 0.12 - s * 0.22 + (aspectExposure - 0.5) * 0.16);
  }

  const distanceTransform = (mask) => {
    const distance = new Float32Array(N);
    const inf = W + H;
    for (let index = 0; index < N; index += 1) distance[index] = mask[index] ? 0 : inf;
    const diagonal = Math.SQRT2;
    for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) {
      const i = y * W + x;
      if (x > 0) distance[i] = Math.min(distance[i], distance[i - 1] + 1);
      if (y > 0) distance[i] = Math.min(distance[i], distance[i - W] + 1);
      if (x > 0 && y > 0) distance[i] = Math.min(distance[i], distance[i - W - 1] + diagonal);
      if (x + 1 < W && y > 0) distance[i] = Math.min(distance[i], distance[i - W + 1] + diagonal);
    }
    for (let y = H - 1; y >= 0; y -= 1) for (let x = W - 1; x >= 0; x -= 1) {
      const i = y * W + x;
      if (x + 1 < W) distance[i] = Math.min(distance[i], distance[i + 1] + 1);
      if (y + 1 < H) distance[i] = Math.min(distance[i], distance[i + W] + 1);
      if (x + 1 < W && y + 1 < H) distance[i] = Math.min(distance[i], distance[i + W + 1] + diagonal);
      if (x > 0 && y + 1 < H) distance[i] = Math.min(distance[i], distance[i + W - 1] + diagonal);
    }
    return distance;
  };

  const ridgeDistance = distanceTransform(ridgeMask);
  const valleyDistance = distanceTransform(valleyMask);
  const signedRidgeValleyDistance = new Float32Array(N);
  for (let index = 0; index < N; index += 1) {
    signedRidgeValleyDistance[index] = clamp((valleyDistance[index] - ridgeDistance[index]) / 32, -1, 1);
  }

  return {
    tpiSmall, tpiMedium, tpiLarge, slope, aspect,
    profileCurvature, planCurvature, exposureWetness,
    landformClass, signedRidgeValleyDistance
  };
}

function radicalInverseBase2(value) {
  value = ((value & 0x55555555) << 1) | ((value >>> 1) & 0x55555555);
  value = ((value & 0x33333333) << 2) | ((value >>> 2) & 0x33333333);
  value = ((value & 0x0f0f0f0f) << 4) | ((value >>> 4) & 0x0f0f0f0f);
  value = ((value & 0x00ff00ff) << 8) | ((value >>> 8) & 0x00ff00ff);
  value = (value << 16) | (value >>> 16);
  return (value >>> 0) / 0x100000000;
}

function segmentRegions(descriptors) {
  const columns = 32;
  const rows = 32;
  const seedCount = columns * rows;
  const cellWidth = W / columns;
  const cellHeight = H / rows;
  const seeds = Array.from({ length: seedCount }, (_, id) => {
    const sx = id % columns;
    const sy = Math.floor(id / columns);
    const jitterX = (hash01(id * 2 + 101) - 0.5) * cellWidth * 0.70;
    const jitterY = (hash01(id * 2 + 211) - 0.5) * cellHeight * 0.70;
    const x = clamp((sx + 0.5) * cellWidth + jitterX, 0, W - 1);
    const y = clamp((sy + 0.5) * cellHeight + jitterY, 0, H - 1);
    const sampleIndex = Math.round(y) * W + Math.round(x);
    return { id, sx, sy, x, y, landformClass: descriptors.landformClass[sampleIndex] };
  });
  const regionId = new Uint16Array(N);
  const boundaryBlend = new Float32Array(N);
  const active = new Set();
  for (let y = 0; y < H; y += 1) {
    const gy = clamp(Math.floor(y / cellHeight), 0, rows - 1);
    for (let x = 0; x < W; x += 1) {
      const gx = clamp(Math.floor(x / cellWidth), 0, columns - 1);
      const pixelClass = descriptors.landformClass[y * W + x];
      let best = Infinity;
      let second = Infinity;
      let bestId = 0;
      for (let oy = -1; oy <= 1; oy += 1) for (let ox = -1; ox <= 1; ox += 1) {
        const sx = gx + ox;
        const sy = gy + oy;
        if (sx < 0 || sx >= columns || sy < 0 || sy >= rows) continue;
        const seed = seeds[sy * columns + sx];
        const dx = x - seed.x;
        const dy = y - seed.y;
        const mismatch = seed.landformClass === pixelClass ? 0 : cellWidth * cellWidth * 0.42;
        const score = dx * dx + dy * dy + mismatch;
        if (score < best) { second = best; best = score; bestId = seed.id; }
        else if (score < second) second = score;
      }
      const index = y * W + x;
      regionId[index] = bestId;
      active.add(bestId);
      boundaryBlend[index] = clamp01((Math.sqrt(second) - Math.sqrt(best)) / (Math.max(cellWidth, cellHeight) * 0.62));
    }
  }

  const adjacency = Array.from({ length: seedCount }, () => new Set());
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) {
    const i = y * W + x;
    const a = regionId[i];
    if (x + 1 < W) {
      const b = regionId[i + 1];
      if (a !== b) { adjacency[a].add(b); adjacency[b].add(a); }
    }
    if (y + 1 < H) {
      const b = regionId[i + W];
      if (a !== b) { adjacency[a].add(b); adjacency[b].add(a); }
    }
  }

  const regionVariant = new Uint8Array(seedCount);
  regionVariant.fill(255);
  for (const id of [...active].sort((a, b) => a - b)) {
    const used = new Set([...adjacency[id]].filter((neighbor) => regionVariant[neighbor] !== 255).map((neighbor) => regionVariant[neighbor]));
    const base = Math.floor(radicalInverseBase2(id + 1) * H_EARTH_BM2_VARIANT_COUNT) % H_EARTH_BM2_VARIANT_COUNT;
    let selected = base;
    for (let offset = 0; offset < H_EARTH_BM2_VARIANT_COUNT; offset += 1) {
      const candidate = (base + offset * 5) % H_EARTH_BM2_VARIANT_COUNT;
      if (!used.has(candidate)) { selected = candidate; break; }
    }
    regionVariant[id] = selected;
  }
  const materialVariantId = new Uint8Array(N);
  for (let index = 0; index < N; index += 1) materialVariantId[index] = regionVariant[regionId[index]];

  let adjacentSameVariantViolationCount = 0;
  for (const id of active) for (const neighbor of adjacency[id]) {
    if (neighbor > id && active.has(neighbor) && regionVariant[id] === regionVariant[neighbor]) adjacentSameVariantViolationCount += 1;
  }
  return {
    regionId,
    materialVariantId,
    boundaryBlend,
    activeRegionCount: active.size,
    adjacentSameVariantViolationCount,
    seedCount
  };
}

export function generateHEarthBM2LandformSegmentation() {
  const { heights, minimum, maximum } = sampleHeights();
  const descriptors = deriveDescriptors(heights);
  const segmentation = segmentRegions(descriptors);
  const classHistogram = Array(H_EARTH_BM2_LANDFORM_CLASSES.length).fill(0);
  for (const value of descriptors.landformClass) classHistogram[value] += 1;
  const descriptorDigest = sha256Typed(
    descriptors.tpiSmall, descriptors.tpiMedium, descriptors.tpiLarge,
    descriptors.slope, descriptors.aspect, descriptors.profileCurvature,
    descriptors.planCurvature, descriptors.exposureWetness,
    descriptors.landformClass, descriptors.signedRidgeValleyDistance
  );
  const segmentationDigest = sha256Typed(
    segmentation.regionId, segmentation.materialVariantId, segmentation.boundaryBlend
  );
  return Object.freeze({
    schemaVersion: 'H_EARTH_BM2_LANDFORM_SEGMENTATION_OUTPUT_v1',
    width: W,
    height: H,
    domain: Object.freeze({ ...DOMAIN }),
    texelWorldStep: Object.freeze({ x: STEP_X, z: STEP_Z }),
    minimumElevation: minimum,
    maximumElevation: maximum,
    descriptorDigest,
    segmentationDigest,
    classHistogram: Object.freeze(classHistogram),
    representedClassCount: classHistogram.filter((count) => count > 0).length,
    activeRegionCount: segmentation.activeRegionCount,
    seedCount: segmentation.seedCount,
    adjacentSameVariantViolationCount: segmentation.adjacentSameVariantViolationCount,
    descriptors,
    segmentation,
    deterministic: true
  });
}

export default generateHEarthBM2LandformSegmentation;
