// /assets/audralia/audralia.relief.surface.js
// AUDRALIA_GRANDCHILD_RELIEF_FIELD_EXPRESSOR_TNT_v1
// Full-file replacement.
// Purpose:
// - Grandchild relief layer only.
// - Receives parent/child surface fields and returns relief-expression overlays.
// - Does not classify land/water/ice/shelf/ocean.
// - Does not alter land/water ratio.
// - Does not import runtime.
// - Does not paint canvas directly.
// - No GraphicBox. No image generation. No visual-pass claim.

const RECEIPT = "AUDRALIA_GRANDCHILD_RELIEF_FIELD_EXPRESSOR_TNT_v1";
const CONTRACT = "AUDRALIA_GRANDCHILD_RELIEF_FIELD_EXPRESSOR_CONTRACT_v1";
const PARENT_REQUIRED_RECEIPT = "AUDRALIA_SURFACE_PARENT_COASTLINE_RIDGE_FEATHER_TNT_v6";
const CHILD_REQUIRED_RECEIPT = "AUDRALIA_HEX_SURFACE_CHILD_PARENT_FIELD_EXPRESSOR_TNT_v3";
const VERSION = "2026-05-07.grandchild-relief-field-expressor.v1";

const STATUS = {
  ok: true,
  receipt: RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  parentRequiredReceipt: PARENT_REQUIRED_RECEIPT,
  childRequiredReceipt: CHILD_REQUIRED_RECEIPT,
  role: "audralia-grandchild-relief-field-expressor",

  grandchildLayer: true,
  reliefOnly: true,
  classificationAuthority: false,
  landWaterAuthority: false,
  parentRatioAuthority: false,
  runtimeAuthority: false,
  routeAuthority: false,
  canvasMountAuthority: false,

  owns: Object.freeze([
    "ridge_expression_overlay",
    "mountain_expression_overlay",
    "basin_shadow_overlay",
    "coastline_grit_overlay",
    "cliff_hint_overlay",
    "mineral_pressure_overlay",
    "subterranean_pressure_overlay",
    "micro_relief_overlay"
  ]),

  doesNotOwn: Object.freeze([
    "land_water_classification",
    "ice_classification",
    "shelf_classification",
    "ocean_classification",
    "parent_surface_truth",
    "runtime_motion",
    "canvas_mount",
    "route_boot",
    "gauges_scoring",
    "visual_pass_claim"
  ]),

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash3(x, y, z) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);
}

function valueNoise3(x, y, z) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);

  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  function h(dx, dy, dz) {
    return hash3(ix + dx, iy + dy, iz + dz);
  }

  const x00 = mix(h(0, 0, 0), h(1, 0, 0), ux);
  const x10 = mix(h(0, 1, 0), h(1, 1, 0), ux);
  const x01 = mix(h(0, 0, 1), h(1, 0, 1), ux);
  const x11 = mix(h(0, 1, 1), h(1, 1, 1), ux);

  return mix(mix(x00, x10, uy), mix(x01, x11, uy), uz);
}

function fbm3(x, y, z, octaves = 4) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let normalizer = 0;

  for (let index = 0; index < octaves; index += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    frequency *= 2.06;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function ridged3(x, y, z, octaves = 4) {
  let value = 0;
  let amplitude = 0.56;
  let frequency = 1;
  let normalizer = 0;

  for (let index = 0; index < octaves; index += 1) {
    const n = valueNoise3(x * frequency, y * frequency, z * frequency);
    value += (1 - Math.abs(n * 2 - 1)) * amplitude;
    normalizer += amplitude;
    frequency *= 2.14;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function resolvePoint(sample) {
  const sx = safeNumber(sample?.sx, safeNumber(sample?.x, 0.5) * 2 - 1);
  const sy = safeNumber(sample?.sy, safeNumber(sample?.y, 0.5) * 2 - 1);
  const sz = safeNumber(sample?.sz, 0.5);

  return { sx, sy, sz };
}

function preserveClass(sample) {
  return {
    visualSurfaceClass: sample?.visualSurfaceClass || sample?.surfaceClass || sample?.className || "unknown_surface",
    surfaceClass: sample?.surfaceClass || sample?.visualSurfaceClass || sample?.className || "unknown_surface",
    className: sample?.className || sample?.surfaceClass || sample?.visualSurfaceClass || "unknown_surface",
    type: sample?.type || sample?.visualSurfaceClass || sample?.surfaceClass || "unknown_surface",

    solidSurfaceLand: Boolean(sample?.solidSurfaceLand),
    topologyLand: Boolean(sample?.topologyLand),
    exposedTerrainLand: Boolean(sample?.exposedTerrainLand || sample?.land || sample?.visibleLand),
    visibleLand: Boolean(sample?.visibleLand || sample?.exposedTerrainLand || sample?.land),
    land: Boolean(sample?.land || sample?.exposedTerrainLand || sample?.visibleLand),

    liquidWater: Boolean(sample?.liquidWater || sample?.water),
    water: Boolean(sample?.water || sample?.liquidWater),
    ocean: Boolean(sample?.ocean),
    shelf: Boolean(sample?.shelf),
    ice: Boolean(sample?.ice),
    glacier: Boolean(sample?.glacier || sample?.ice),
    coastal: Boolean(sample?.coastal),
    beach: Boolean(sample?.beach)
  };
}

export function refineAudraliaReliefSample(sample = {}, context = {}) {
  const point = resolvePoint(sample);
  const cls = preserveClass(sample);

  const parentRidge = clamp01(sample.ridgeIndex ?? 0);
  const parentMountain = clamp01(sample.mountainIndex ?? 0);
  const parentBasin = clamp01(sample.basinIndex ?? 0);
  const parentCoast = clamp01(sample.coastlineIndex ?? sample.coastalFeather ?? 0);
  const parentShelf = clamp01(sample.shelfGradientIndex ?? sample.shelfIndex ?? 0);
  const parentCliff = clamp01(sample.coastalCliffIndex ?? 0);
  const parentMineral = clamp01(sample.mineralIndex ?? 0);
  const parentMicro = clamp01(sample.microTerrainIndex ?? sample.parentHexDetailIndex ?? 0);
  const parentGlaze = clamp01(sample.microGlazeIndex ?? 0);
  const parentElevation = clamp01(sample.elevation ?? sample.terrainReliefIndex ?? sample.terrainRelief ?? 0);
  const parentDepth = clamp01(sample.depth ?? sample.oceanDepth ?? 0);

  const seed = safeNumber(context.seed, safeNumber(sample.hexRing, 0) + safeNumber(sample.hexQ, 0) * 0.37 + safeNumber(sample.hexR, 0) * 0.19);
  const phase = safeNumber(context.phase, 0);

  const reliefNoise = ridged3(
    point.sx * 18.0 + seed * 0.19 + phase,
    point.sy * 18.0 - seed * 0.11,
    point.sz * 18.0 + 4.7,
    4
  );

  const microNoise = fbm3(
    point.sx * 48.0 - 7.4,
    point.sy * 48.0 + 9.2 + seed * 0.07,
    point.sz * 48.0 - 1.6,
    3
  );

  const fractureNoise = ridged3(
    point.sx * 31.0 + 11.3,
    point.sy * 31.0 - 5.8,
    point.sz * 31.0 + seed * 0.13,
    3
  );

  const basinNoise = fbm3(
    point.sx * 13.0 - 3.2,
    point.sy * 13.0 + 2.8,
    point.sz * 13.0 - 8.1,
    4
  );

  const landMask = cls.exposedTerrainLand ? 1 : 0;
  const waterMask = cls.liquidWater ? 1 : 0;
  const shelfMask = cls.shelf ? 1 : 0;
  const iceMask = cls.ice ? 1 : 0;
  const coastMask = clamp01(parentCoast + parentShelf * 0.65);

  const ridgeOverlay = landMask * clamp01(parentRidge * 0.58 + reliefNoise * 0.28 + fractureNoise * 0.18);
  const mountainOverlay = landMask * clamp01(parentMountain * 0.62 + ridgeOverlay * 0.24 + reliefNoise * 0.16);
  const basinShadowOverlay = landMask * clamp01(parentBasin * 0.58 + (1 - parentElevation) * 0.18 + basinNoise * 0.18);
  const coastlineGritOverlay = clamp01(coastMask * 0.54 + fractureNoise * 0.18 + parentCliff * 0.24);
  const cliffHintOverlay = landMask * clamp01(parentCliff * 0.62 + parentCoast * parentElevation * 0.28 + reliefNoise * 0.10);
  const shelfReliefOverlay = shelfMask * clamp01(parentShelf * 0.62 + microNoise * 0.20 + coastMask * 0.18);
  const mineralPressureOverlay = landMask * clamp01(parentMineral * 0.34 + ridgeOverlay * 0.18 + parentMicro * 0.18 + microNoise * 0.18);
  const subterraneanPressureOverlay = landMask * clamp01((sample.subterraneanCandidate ?? 0) * 0.48 + parentMineral * 0.20 + fractureNoise * 0.20 + parentBasin * 0.12);
  const iceRidgeOverlay = iceMask * clamp01(parentElevation * 0.30 + reliefNoise * 0.26 + microNoise * 0.14);
  const deepWaterVariationOverlay = waterMask * clamp01(parentDepth * 0.30 + basinNoise * 0.18 + microNoise * 0.10);

  const reliefContrast = clamp01(
    ridgeOverlay * 0.24 +
    mountainOverlay * 0.24 +
    coastlineGritOverlay * 0.18 +
    cliffHintOverlay * 0.14 +
    mineralPressureOverlay * 0.12 +
    subterraneanPressureOverlay * 0.08
  );

  const shadeLift = clamp01(
    mountainOverlay * 0.08 +
    mineralPressureOverlay * 0.05 +
    shelfReliefOverlay * 0.06 +
    iceRidgeOverlay * 0.05
  );

  const shadeDrop = clamp01(
    ridgeOverlay * 0.09 +
    basinShadowOverlay * 0.12 +
    cliffHintOverlay * 0.09 +
    subterraneanPressureOverlay * 0.06 +
    deepWaterVariationOverlay * 0.05
  );

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    contract: CONTRACT,
    version: VERSION,
    source: "audralia-grandchild-relief-field-expressor",

    parentReceipt: sample.receipt || "",
    childReceipt: context.childReceipt || CHILD_REQUIRED_RECEIPT,
    parentRequiredReceipt: PARENT_REQUIRED_RECEIPT,
    childRequiredReceipt: CHILD_REQUIRED_RECEIPT,

    ...cls,

    reliefOnly: true,
    classificationAuthority: false,
    classificationChanged: false,
    landWaterAuthority: false,
    parentRatioAuthority: false,
    runtimeAuthority: false,

    reliefNoise,
    microNoise,
    fractureNoise,
    basinNoise,

    ridgeOverlay,
    mountainOverlay,
    basinShadowOverlay,
    coastlineGritOverlay,
    cliffHintOverlay,
    shelfReliefOverlay,
    mineralPressureOverlay,
    subterraneanPressureOverlay,
    iceRidgeOverlay,
    deepWaterVariationOverlay,

    reliefContrast,
    shadeLift,
    shadeDrop,

    expressiveRidge: ridgeOverlay > 0.34,
    expressiveMountain: mountainOverlay > 0.34,
    expressiveCoastline: coastlineGritOverlay > 0.32,
    expressiveCliff: cliffHintOverlay > 0.28,
    expressiveShelf: shelfReliefOverlay > 0.28,
    expressiveSubterranean: subterraneanPressureOverlay > 0.30,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function sampleReliefSurface(sample = {}, context = {}) {
  return refineAudraliaReliefSample(sample, context);
}

export function getAudraliaReliefSurfaceStatus() {
  return Object.freeze({
    ...STATUS
  });
}

export const AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE = RECEIPT;
export const AUDRALIA_RELIEF_SURFACE_CONTRACT_VALUE = CONTRACT;
export const AUDRALIA_RELIEF_SURFACE_PARENT_REQUIRED_RECEIPT_VALUE = PARENT_REQUIRED_RECEIPT;
export const AUDRALIA_RELIEF_SURFACE_CHILD_REQUIRED_RECEIPT_VALUE = CHILD_REQUIRED_RECEIPT;
export const AUDRALIA_RELIEF_SURFACE_STATUS = STATUS;

const api = Object.freeze({
  receipt: RECEIPT,
  contract: CONTRACT,
  version: VERSION,
  parentRequiredReceipt: PARENT_REQUIRED_RECEIPT,
  childRequiredReceipt: CHILD_REQUIRED_RECEIPT,
  refineAudraliaReliefSample,
  sampleReliefSurface,
  getAudraliaReliefSurfaceStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaReliefSurface = api;
  window.DGBAudraliaReliefSurfaceStatus = STATUS;
}

export default api;
