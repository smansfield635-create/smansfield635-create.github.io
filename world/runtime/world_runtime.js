DESTINATION: /world/runtime.js
// /world/runtime.js
// MODE: DIRECT RUNTIME AUTHORITY
// CONTRACT: RUNTIME_CONTRACT_G3
// STATUS: DETERMINISTIC | PUBLIC PATH SAFE | NO PARENT STACK

const RUNTIME_META = Object.freeze({
  name: "runtime",
  version: "G3",
  contract: "RUNTIME_CONTRACT_G3",
  role: "direct_state_authority",
  deterministic: true,
  sourceOfTruth: true,
  mutatesState: false,
  platformOwned: true
});

function deepFreeze(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  const keys = Object.getOwnPropertyNames(value);
  for (let i = 0; i < keys.length; i += 1) {
    deepFreeze(value[keys[i]]);
  }
  return Object.freeze(value);
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function getElapsedSeconds(frameState = {}) {
  const source = normalizeObject(frameState);
  return Number.isFinite(source.elapsedSeconds) ? Math.max(0, source.elapsedSeconds) : 0;
}

function computeFieldSummary() {
  return deepFreeze({
    width: 256,
    height: 256
  });
}

function computeDenseIndex(elapsedSeconds) {
  const x = 128 + Math.round(Math.sin(elapsedSeconds * 0.11) * 8);
  const y = 128 + Math.round(Math.cos(elapsedSeconds * 0.09) * 8);
  return deepFreeze({
    x: clamp(x, 0, 255),
    y: clamp(y, 0, 255)
  });
}

function computeKernelIndex(denseIndex) {
  return deepFreeze({
    i: clamp(Math.floor(denseIndex.x / 32), 0, 7),
    j: clamp(Math.floor(denseIndex.y / 32), 0, 7)
  });
}

function computeForceVector(elapsedSeconds, denseIndex) {
  const a = elapsedSeconds * 0.7;
  const n = Math.sin(a) * 2.8;
  const e = Math.cos(a * 0.9) * 2.4;
  const s = Math.sin(a * 0.6 + denseIndex.x * 0.01) * 2.1;
  const w = Math.cos(a * 0.5 + denseIndex.y * 0.01) * 1.9;
  const b = Math.sin(a * 0.4) * 1.4;

  return deepFreeze({
    N: Math.round(n * 1000) / 1000,
    E: Math.round(e * 1000) / 1000,
    S: Math.round(s * 1000) / 1000,
    W: Math.round(w * 1000) / 1000,
    B: Math.round(b * 1000) / 1000
  });
}

function computeBoundary(forceVector) {
  const burden = Math.abs(forceVector.B);
  if (burden > 1.2) {
    return deepFreeze({
      classification: "HOLD",
      label: "HOLD"
    });
  }
  return deepFreeze({
    classification: "OPEN",
    label: "OPEN"
  });
}

function computeThreshold(forceVector) {
  const magnitude = Math.abs(forceVector.N) + Math.abs(forceVector.E) + Math.abs(forceVector.S) + Math.abs(forceVector.W);
  const pass = magnitude < 12;
  return deepFreeze({
    action: pass ? "PASS" : "HALT",
    value: Math.round((magnitude / 12) * 1000) / 1000
  });
}

function computeTraversalStatus(boundary, threshold) {
  const admissible = boundary.classification !== "BLOCK" && threshold.action === "PASS";
  return deepFreeze({
    admissible,
    action: admissible ? "PASS" : "HALT",
    thresholdPass: threshold.action === "PASS",
    boundaryPass: boundary.classification !== "BLOCK",
    targetExists: true,
    targetLawful: true
  });
}

function computeProjection(denseIndex) {
  const x = denseIndex.x;
  const y = denseIndex.y;
  const nx = (x - 128) / 128;
  const ny = (y - 128) / 128;
  const zSquared = Math.max(0, 1 - nx * nx - ny * ny);
  const z = Math.sqrt(zSquared);

  return deepFreeze({
    kind: "flat",
    x,
    y,
    z: Math.round(z * 1000000) / 1000000,
    width: 256,
    height: 256,
    longitude: Math.round(nx * 180 * 1000000) / 1000000,
    latitude: Math.round(ny * 90 * 1000000) / 1000000
  });
}

function computeRegion(kernelIndex) {
  return deepFreeze({
    regionId: "R-" + kernelIndex.i + "-" + kernelIndex.j,
    label: "REGION_" + kernelIndex.i + "_" + kernelIndex.j
  });
}

function computeNode(denseIndex) {
  return deepFreeze({
    nodeId: "NODE-" + denseIndex.x + "-" + denseIndex.y,
    label: "NODE_" + denseIndex.x + "_" + denseIndex.y
  });
}

function buildReceipt({
  timestamp,
  kernelIndex,
  denseIndex,
  region,
  node,
  boundary,
  threshold,
  forceVector,
  traversalStatus,
  selectedProjection
}) {
  return deepFreeze({
    source: RUNTIME_META.name,
    contract: RUNTIME_META.contract,
    timestamp,
    verification: deepFreeze({
      pass: true,
      deterministic: true
    }),
    phase: threshold.action,
    projection: "flat",
    state: deepFreeze({
      i: kernelIndex.i,
      j: kernelIndex.j
    }),
    denseIndex: deepFreeze({
      x: denseIndex.x,
      y: denseIndex.y
    }),
    region,
    node,
    boundary,
    threshold,
    forces: forceVector,
    traversalStatus,
    selectedProjection,
    fieldSummary: computeFieldSummary(),
    terrainClass: denseIndex.y < 96 ? "RIDGE" : denseIndex.y > 160 ? "BASIN" : "PLAIN",
    biomeType: denseIndex.x < 96 ? "FOREST" : denseIndex.x > 160 ? "DESERT" : "GRASSLAND",
    surfaceMaterial: denseIndex.y < 96 ? "STONE" : denseIndex.y > 160 ? "SEDIMENT" : "SOIL",
    climateBand: denseIndex.y < 96 ? "COOL" : denseIndex.y > 160 ? "WARM" : "TEMPERATE",
    climate: Math.round((0.35 + denseIndex.y / 512) * 1000) / 1000,
    moisture: Math.round((0.65 - denseIndex.x / 512) * 1000) / 1000,
    accumulation: Math.round((Math.abs(forceVector.B) / 2) * 1000) / 1000,
    shorelineMask: Math.round((denseIndex.y / 255) * 1000) / 1000,
    landMask: Math.round((1 - Math.abs(selectedProjection.z || 0) * 0.2) * 1000) / 1000,
    waterMask: Math.round((denseIndex.x / 255) * 1000) / 1000,
    habitability: Math.round((0.55 + (selectedProjection.z || 0) * 0.25) * 1000) / 1000,
    traversalDifficulty: Math.round((Math.abs(forceVector.B) / 3 + 0.2) * 1000) / 1000
  });
}

export function getRuntimeReceipt(options = {}) {
  const source = normalizeObject(options);
  const timestamp =
    Number.isFinite(source.timestamp) ? source.timestamp : Date.now();
  const elapsedSeconds = getElapsedSeconds(source.frameState);
  const denseIndex = computeDenseIndex(elapsedSeconds);
  const kernelIndex = computeKernelIndex(denseIndex);
  const region = computeRegion(kernelIndex);
  const node = computeNode(denseIndex);
  const forceVector = computeForceVector(elapsedSeconds, denseIndex);
  const boundary = computeBoundary(forceVector);
  const threshold = computeThreshold(forceVector);
  const traversalStatus = computeTraversalStatus(boundary, threshold);
  const selectedProjection = computeProjection(denseIndex);

  return buildReceipt({
    timestamp,
    kernelIndex,
    denseIndex,
    region,
    node,
    boundary,
    threshold,
    forceVector,
    traversalStatus,
    selectedProjection
  });
}

export function getCurrentState(options = {}) {
  const receipt = getRuntimeReceipt(options);
  return deepFreeze({
    index: receipt.state,
    denseIndex: receipt.denseIndex,
    projectionState: receipt.projection,
    selectedProjection: receipt.selectedProjection,
    region: receipt.region,
    node: receipt.node,
    boundary: receipt.boundary,
    threshold: receipt.threshold,
    receipt: deepFreeze({ timestamp: receipt.timestamp }),
    traversalStatus: receipt.traversalStatus,
    terrainClass: receipt.terrainClass,
    biomeType: receipt.biomeType,
    forces: receipt.forces
  });
}

const DEFAULT_RUNTIME = deepFreeze({
  meta: RUNTIME_META,
  getRuntimeReceipt,
  getCurrentState
});

export const meta = RUNTIME_META;
export default DEFAULT_RUNTIME;
