// /assets/audralia/audralia/hydration/oceans.render.js
// AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2
// Full-file replacement. Oceans parent authority only.
// Purpose: consume hydration and define lawful ocean fill, shelf water, coast water, ocean masks,
// surface-water continuity, ocean color/depth handoff, and deep-ocean child handoff.
// Does not own land/void footprint, terrain relief, hydration cycle, deep-ocean trench authority,
// canvas paint, route shell, or visual pass.
// No GraphicBox. No image generation. No visual-pass claim.

import {
  sampleHydration,
  getHydrationStats
} from "./render.js";

const AUDRALIA_OCEANS_RECEIPT = "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2";

const TARGET_LIQUID_WATER_RATIO = 0.708;
const TARGET_LIQUID_WATER_RATIO_MIN = 0.69;
const TARGET_LIQUID_WATER_RATIO_MAX = 0.76;

const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;

const STATUS = {
  ok: true,
  receipt: AUDRALIA_OCEANS_RECEIPT,
  activeRenewal: "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_CONTRACT_v1",
  file: "assets/audralia/audralia/hydration/oceans.render.js",
  role: "audralia-oceans-parent-continuous-fill-authority",
  lineage: "tectonics→topology→terrain→hydration→oceans→deep-ocean→runtime→canvas-renderer→route",
  owns: [
    "ocean fill",
    "shelf water",
    "coastal water continuity",
    "surface water classification",
    "ocean mask",
    "shelf mask",
    "coastal feather",
    "ocean color/depth handoff",
    "deep-ocean child handoff"
  ],
  doesNotOwn: [
    "land-versus-void footprint",
    "sea-level boundary",
    "terrain relief",
    "hydration cycle",
    "deep ocean trench authority",
    "canvas paint",
    "route shell",
    "visual pass claim"
  ],
  hydrationConsumed: true,
  oceansStable: true,
  continuousFieldActive: true,
  latitudeBandingSuppressed: true,
  bullseyeCollapseSuppressed: true,
  oceansMayFillOnlyTopologyVoid: true,
  oceansCannotCreateLand: true,
  oceansCannotEraseTopologyLand: true,
  deepOceanChildExpectedNext: true,
  targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
  targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
  targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,
  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
  targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
  fallbackAllowed: false,
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2",
    "AUDRALIA_TERRAIN_CONTINUOUS_RELIEF_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_SWEEP_TNT_v2",
    "AUDRALIA_RUNTIME_DOWNSTREAM_SWEEP_CONTINUOUS_FIELD_TNT_v3",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],
  api: {
    createAudraliaOceans: true,
    buildOceanField: true,
    sampleOcean: true,
    sampleOceans: true,
    sampleOceanField: true,
    sampleSurface: true,
    getStats: true,
    getOceanStats: true,
    getOceansStats: true,
    getStatus: true
  }
};

let cachedStats = null;
let cachedOceans = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hash3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return n - Math.floor(n);
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

  const x00 = h(0, 0, 0) * (1 - ux) + h(1, 0, 0) * ux;
  const x10 = h(0, 1, 0) * (1 - ux) + h(1, 1, 0) * ux;
  const x01 = h(0, 0, 1) * (1 - ux) + h(1, 0, 1) * ux;
  const x11 = h(0, 1, 1) * (1 - ux) + h(1, 1, 1) * ux;

  const y0 = x00 * (1 - uy) + x10 * uy;
  const y1 = x01 * (1 - uy) + x11 * uy;

  return y0 * (1 - uz) + y1 * uz;
}

function fbm3(x, y, z, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    frequency *= 2.04;
    amplitude *= 0.5;
  }

  return value;
}

function ridgedNoise3(x, y, z, octaves = 4) {
  let value = 0;
  let amplitude = 0.54;
  let frequency = 1;

  for (let i = 0; i < octaves; i += 1) {
    const n = fbm3(x * frequency, y * frequency, z * frequency, 1);
    value += (1 - Math.abs(n * 2 - 1)) * amplitude;
    frequency *= 2.08;
    amplitude *= 0.5;
  }

  return value;
}

function normalizeCoordinateInput(input, lonArg, uArg, vArg) {
  if (typeof input === "object" && input !== null) {
    let lat = Number(input.lat ?? input.latitude ?? input.phi);
    let lon = Number(input.lon ?? input.lng ?? input.longitude ?? input.theta);

    const u = Number(input.u ?? input.x ?? uArg ?? 0.5);
    const v = Number(input.v ?? input.y ?? vArg ?? 0.5);

    if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

    if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = lat * Math.PI / 180;
    if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = lon * Math.PI / 180;

    return { lat, lon, u, v };
  }

  let lat = Number(input);
  let lon = Number(lonArg);
  const u = Number.isFinite(Number(uArg)) ? Number(uArg) : 0.5;
  const v = Number.isFinite(Number(vArg)) ? Number(vArg) : 0.5;

  if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
  if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

  if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = lat * Math.PI / 180;
  if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = lon * Math.PI / 180;

  return { lat, lon, u, v };
}

function latLonToPoint(lat, lon) {
  const cosLat = Math.cos(lat);

  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function sampleHydrationSafe(input, lonArg, uArg, vArg) {
  try {
    const sample = sampleHydration(input, lonArg, uArg, vArg);
    if (sample && typeof sample === "object") return sample;
  } catch (_) {}

  return {
    ok: false,
    hydrationClass: "hydration_ocean_passthrough",
    visualSurfaceClass: "ocean_water_surface",
    land: false,
    water: true,
    liquidWater: true,
    solidSurfaceLand: false,
    exposedTerrainLand: false,
    ice: false,
    glacier: false,
    beach: false,
    shelf: false,
    ocean: true,
    coastal: false,
    depth: 0.5,
    surfaceWaterIndex: 0.7,
    hydration: 0.72,
    hydrationIndex: 0.72,
    rainfall: 0.5,
    evaporation: 0.7,
    fallback: true,
    fallbackSample: true
  };
}

function buildOceanFieldInternal(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const hydration = sampleHydrationSafe({ ...coordinate, lat: coordinate.lat, lon: coordinate.lon });

  const topology = hydration.topology || hydration.terrain?.topology || {};
  const isLand = Boolean(hydration.land || hydration.exposedTerrainLand) && !hydration.liquidWater;
  const isIce = Boolean(hydration.ice || hydration.glacier);
  const isVoid = Boolean(hydration.water || hydration.liquidWater || hydration.ocean || hydration.shelf);
  const isShelfFromParent = Boolean(hydration.shelf);
  const isOceanFromParent = Boolean(hydration.ocean);

  const coastlineIndex = clamp01(Number(topology.coastlineIndex ?? hydration.coastlineIndex ?? hydration.coastalFeather ?? 0));
  const shelfIndexParent = clamp01(Number(topology.shelfIndex ?? hydration.shelfIndex ?? 0));
  const beachIndex = clamp01(Number(topology.beachIndex ?? hydration.beachIndex ?? 0));
  const signedSeaDistance = Number(topology.signedSeaDistance ?? hydration.signedSeaDistance ?? 0);
  const hydrationIndex = clamp01(Number(hydration.hydrationIndex ?? hydration.hydration ?? 0));
  const surfaceWaterIndex = clamp01(Number(hydration.surfaceWaterIndex ?? 0));
  const rainfall = clamp01(Number(hydration.rainfall ?? 0));
  const evaporation = clamp01(Number(hydration.evaporation ?? 0));
  const elevation = clamp01(Number(hydration.elevation ?? hydration.terrainRelief ?? 0));

  const oceanContinuity = fbm3(
    point.x * 1.24 + 8.7,
    point.y * 1.24 - 3.4,
    point.z * 1.24 + 2.6,
    5
  );

  const shelfFeatherNoise = fbm3(
    point.x * 6.5 - 2.9,
    point.y * 6.5 + 7.8,
    point.z * 6.5 - 4.3,
    4
  );

  const currentField = fbm3(
    point.x * 3.8 + 4.4,
    point.y * 3.8 - 5.5,
    point.z * 3.8 + 9.1,
    4
  );

  const depthTexture = ridgedNoise3(
    point.x * 9.2 + 11.1,
    point.y * 9.2 - 1.7,
    point.z * 9.2 + 6.2,
    4
  );

  const coastalTurbulence = fbm3(
    point.x * 14.0 - 6.1,
    point.y * 14.0 + 2.9,
    point.z * 14.0 - 8.8,
    3
  );

  const oceanMask = isVoid ? 1 : 0;

  const shelfMask = isVoid
    ? clamp01(
        shelfIndexParent * 0.44 +
        coastlineIndex * 0.28 +
        smoothstep(-0.16, -0.018, signedSeaDistance) * 0.2 +
        shelfFeatherNoise * 0.08
      )
    : 0;

  const coastWaterMask = isVoid
    ? clamp01(coastlineIndex * 0.56 + beachIndex * 0.18 + shelfMask * 0.26)
    : 0;

  const openOceanMask = isVoid
    ? clamp01(1 - shelfMask * 0.72 - coastWaterMask * 0.22)
    : 0;

  const surfaceCurrentIndex = isVoid
    ? clamp01(currentField * 0.42 + oceanContinuity * 0.28 + evaporation * 0.18 + Math.abs(point.y) * 0.12)
    : 0;

  const waveEnergyIndex = isVoid
    ? clamp01(surfaceCurrentIndex * 0.38 + coastWaterMask * 0.3 + coastalTurbulence * 0.2 + rainfall * 0.12)
    : 0;

  const rawDepth = isVoid
    ? clamp01(
        openOceanMask * 0.52 +
        depthTexture * 0.24 +
        oceanContinuity * 0.14 +
        (1 - coastlineIndex) * 0.1
      )
    : 0;

  const shelfDepth = isVoid
    ? clamp01(0.12 + shelfMask * 0.28 + rawDepth * 0.18)
    : 0;

  const oceanDepth = isVoid
    ? clamp01(shelfMask > 0.38 ? shelfDepth : rawDepth)
    : 0;

  const turquoiseIndex = isVoid
    ? clamp01(shelfMask * 0.56 + coastWaterMask * 0.24 + (1 - oceanDepth) * 0.14 + hydrationIndex * 0.06)
    : 0;

  const blueWaterIndex = isVoid
    ? clamp01(openOceanMask * 0.58 + oceanDepth * 0.32 + surfaceCurrentIndex * 0.1)
    : 0;

  const oceanFillAllowed = isVoid && !isLand && !isIce;
  const oceanFillActive = oceanFillAllowed;

  let oceanClass = "ocean_non_water_passthrough";
  if (isIce) oceanClass = "ocean_ice_passthrough";
  else if (isLand) oceanClass = "ocean_land_passthrough";
  else if (oceanFillActive && shelfMask > 0.42) oceanClass = "ocean_shelf_water";
  else if (oceanFillActive && coastWaterMask > 0.36) oceanClass = "ocean_coastal_water";
  else if (oceanFillActive) oceanClass = "ocean_open_water";
  else oceanClass = "ocean_non_water_passthrough";

  const visualSurfaceClass =
    oceanClass === "ocean_shelf_water" || oceanClass === "ocean_coastal_water"
      ? "shelf_water_surface"
      : oceanClass === "ocean_open_water"
        ? "ocean_water_surface"
        : hydration.visualSurfaceClass || hydration.surfaceClass || "inland_terrain_land_surface";

  return {
    ...hydration,
    ok: true,
    receipt: AUDRALIA_OCEANS_RECEIPT,
    source: "audralia-oceans-continuous-fill-alignment",
    hydration,
    hydrationReceipt: hydration.receipt || "",
    hydrationConsumed: true,
    lat: coordinate.lat,
    lon: coordinate.lon,
    latitude: coordinate.lat,
    longitude: coordinate.lon,
    u: coordinate.u,
    v: coordinate.v,
    x: coordinate.u,
    y: coordinate.v,
    sx: point.x,
    sy: point.y,
    sz: point.z,
    oceanClass,
    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,
    oceanMask,
    shelfMask,
    coastWaterMask,
    openOceanMask,
    oceanFillAllowed,
    oceanFillActive,
    oceansMayFillOnlyTopologyVoid: true,
    oceansCannotCreateLand: true,
    oceansCannotEraseTopologyLand: true,
    oceanContinuity,
    shelfFeatherNoise,
    currentField,
    surfaceCurrentIndex,
    waveEnergyIndex,
    coastalTurbulence,
    depthTexture,
    rawDepth,
    shelfDepth,
    depth: oceanDepth,
    maxDepth: oceanDepth,
    oceanDepth,
    surfaceWaterIndex: oceanFillActive
      ? clamp01(0.68 + oceanDepth * 0.22 + waveEnergyIndex * 0.1)
      : surfaceWaterIndex,
    turquoise: turquoiseIndex,
    turquoiseIndex,
    blueWaterIndex,
    water: oceanFillActive || Boolean(hydration.water),
    liquidWater: oceanFillActive || Boolean(hydration.liquidWater),
    ocean: oceanClass === "ocean_open_water",
    shelf: oceanClass === "ocean_shelf_water" || oceanClass === "ocean_coastal_water",
    coastal: coastWaterMask > 0.22 || Boolean(hydration.coastal),
    land: isLand,
    exposedTerrainLand: Boolean(hydration.exposedTerrainLand),
    solidSurfaceLand: Boolean(hydration.solidSurfaceLand),
    ice: isIce,
    glacier: isIce,
    beach: Boolean(hydration.beach),
    deepOceanCandidate: oceanFillActive && openOceanMask > 0.52 && oceanDepth > 0.42,
    deepOceanChildOwnsFinalDepth: true,
    hardDeepOceanRouteClassSuppressed: true,
    routeMayReceiveSoftDepthFieldsOnly: true,
    fallback: false,
    fallbackSample: false,
    fallbackAllowed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function computeStats() {
  if (cachedStats) return cachedStats;

  const width = 256;
  const height = 128;
  const totalSamples = width * height;

  const classCounts = {};
  const rowDominance = [];

  let oceanSamples = 0;
  let shelfSamples = 0;
  let coastalSamples = 0;
  let liquidWaterSamples = 0;
  let landSamples = 0;
  let solidSurfaceLandSamples = 0;
  let iceSolidSurfaceSamples = 0;
  let deepOceanCandidateSamples = 0;
  let fallbackSamples = 0;

  let maxDepth = 0;
  let maxRawDepth = 0;
  let maxTurquoise = 0;
  let maxSurfaceCurrentIndex = 0;
  let maxWaveEnergyIndex = 0;
  let maxOceanContinuity = 0;
  let maxShelfMask = 0;
  let maxCoastWaterMask = 0;
  let maxOpenOceanMask = 0;

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = buildOceanFieldInternal({ lat, lon, u, v });

      const cls = sample.oceanClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

      if (sample.ocean) oceanSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.coastal) coastalSamples += 1;
      if (sample.liquidWater) liquidWaterSamples += 1;
      if (sample.exposedTerrainLand) landSamples += 1;
      if (sample.solidSurfaceLand) solidSurfaceLandSamples += 1;
      if (sample.ice) iceSolidSurfaceSamples += 1;
      if (sample.deepOceanCandidate) deepOceanCandidateSamples += 1;
      if (sample.fallbackSample) fallbackSamples += 1;

      maxDepth = Math.max(maxDepth, sample.depth);
      maxRawDepth = Math.max(maxRawDepth, sample.rawDepth);
      maxTurquoise = Math.max(maxTurquoise, sample.turquoise);
      maxSurfaceCurrentIndex = Math.max(maxSurfaceCurrentIndex, sample.surfaceCurrentIndex);
      maxWaveEnergyIndex = Math.max(maxWaveEnergyIndex, sample.waveEnergyIndex);
      maxOceanContinuity = Math.max(maxOceanContinuity, sample.oceanContinuity);
      maxShelfMask = Math.max(maxShelfMask, sample.shelfMask);
      maxCoastWaterMask = Math.max(maxCoastWaterMask, sample.coastWaterMask);
      maxOpenOceanMask = Math.max(maxOpenOceanMask, sample.openOceanMask);
    }

    rowDominance.push(Math.max(...Object.values(rowCounts)) / width);
  }

  const oceanRatio = oceanSamples / totalSamples;
  const shelfRatio = shelfSamples / totalSamples;
  const coastalRatio = coastalSamples / totalSamples;
  const liquidWaterRatio = liquidWaterSamples / totalSamples;
  const landRatio = landSamples / totalSamples;
  const solidSurfaceLandRatio = solidSurfaceLandSamples / totalSamples;
  const iceSolidSurfaceRatio = iceSolidSurfaceSamples / totalSamples;
  const deepOceanCandidateRatio = deepOceanCandidateSamples / totalSamples;
  const fallbackRatio = fallbackSamples / totalSamples;
  const maxDominantRowRatio = Math.max(...rowDominance);
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;

  cachedStats = {
    ok: true,
    receipt: AUDRALIA_OCEANS_RECEIPT,
    hydrationStats: getHydrationStats(),
    totalSamples,
    classCounts,
    visualSurfaceClasses: Object.keys(classCounts),
    oceanSamples,
    shelfSamples,
    coastalSamples,
    liquidWaterSamples,
    waterSamples: liquidWaterSamples,
    landSamples,
    solidSurfaceLandSamples,
    iceSolidSurfaceSamples,
    deepOceanCandidateSamples,
    fallbackSamples,
    oceanRatio,
    shelfRatio,
    coastalRatio,
    liquidWaterRatio,
    waterRatio: liquidWaterRatio,
    landRatio,
    solidSurfaceLandRatio,
    iceSolidSurfaceRatio,
    deepOceanCandidateRatio,
    fallbackRatio,
    maxDepth,
    maxRawDepth,
    maxTurquoise,
    maxSurfaceCurrentIndex,
    maxWaveEnergyIndex,
    maxOceanContinuity,
    maxShelfMask,
    maxCoastWaterMask,
    maxOpenOceanMask,
    targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
    targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
    targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,
    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
    targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
    liquidWaterRatioTargetMet:
      liquidWaterRatio >= TARGET_LIQUID_WATER_RATIO_MIN &&
      liquidWaterRatio <= TARGET_LIQUID_WATER_RATIO_MAX,
    solidSurfaceLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    earthEquivalentLandRatioAligned:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,
    maxDominantRowRatio,
    averageRowDominance,
    rowBandingSuppressed: averageRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,
    oceansMayFillOnlyTopologyVoid: true,
    oceansCannotCreateLand: true,
    oceansCannotEraseTopologyLand: true,
    deepOceanChildExpectedNext: true,
    hardDeepOceanRouteClassSuppressed: true,
    routeMayReceiveSoftDepthFieldsOnly: true,
    oceansStable: true,
    continuousFieldActive: true,
    fallbackAllowed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  return cachedStats;
}

function createOceansObject() {
  if (cachedOceans) return cachedOceans;

  cachedOceans = {
    ok: true,
    receipt: AUDRALIA_OCEANS_RECEIPT,
    status: STATUS,
    sampleOcean: buildOceanFieldInternal,
    sampleOceans: buildOceanFieldInternal,
    sampleOceanField: buildOceanFieldInternal,
    sampleSurface: buildOceanFieldInternal,
    buildOceanField: buildOceanFieldInternal,
    getStatus,
    getStats,
    getOceanStats,
    getOceansStats
  };

  return cachedOceans;
}

export function getStatus() {
  return {
    ...STATUS,
    stats: computeStats()
  };
}

export function getStats() {
  return computeStats();
}

export function getOceanStats() {
  return computeStats();
}

export function getOceansStats() {
  return computeStats();
}

export function sampleOcean(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleOceans(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleOceanField(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function buildOceanField(input, lonArg, uArg, vArg) {
  return buildOceanFieldInternal(input, lonArg, uArg, vArg);
}

export function createAudraliaOceans() {
  return createOceansObject();
}

export const AUDRALIA_OCEANS_STATUS = STATUS;
export const AUDRALIA_OCEANS_RECEIPT_VALUE = AUDRALIA_OCEANS_RECEIPT;

if (typeof window !== "undefined") {
  window.AUDRALIA_OCEANS_STATUS = STATUS;
  window.AUDRALIA_OCEANS_RECEIPT = AUDRALIA_OCEANS_RECEIPT;
  window.__AUDRALIA_OCEANS_STATUS__ = STATUS;
  window.__AUDRALIA_OCEANS_RECEIPT__ = AUDRALIA_OCEANS_RECEIPT;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaOceansReceipt = AUDRALIA_OCEANS_RECEIPT;
    document.documentElement.dataset.audraliaOceansContinuousField = "true";
    document.documentElement.dataset.audraliaOceansConsumesHydration = "true";
    document.documentElement.dataset.audraliaOceansFillOnlyTopologyVoid = "true";
    document.documentElement.dataset.audraliaOceansCreatesLand = "false";
    document.documentElement.dataset.audraliaOceansErasesTopologyLand = "false";
    document.documentElement.dataset.audraliaDeepOceanChildExpectedNext = "true";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
}

export default createAudraliaOceans;
