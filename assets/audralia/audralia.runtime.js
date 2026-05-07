// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_ORGANIC_LAND_WATER_COMPOSITOR_TNT_v9
// Full-file replacement. Runtime authority only.
// Purpose:
// - Preserve downstream import chain.
// - Keep runtime as final normalizer/compositor, not visual painter.
// - Restore organic land/water classification instead of broad latitude bands.
// - Preserve Earth-compatible solid/liquid accounting.
// - Expose runtime summary object for Gauges.
// - Keep zero fallback samples.
// - No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_ORGANIC_LAND_WATER_COMPOSITOR_TNT_v9";
const AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT = "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8";
const AUDRALIA_RUNTIME_PREVIOUS_RECEIPT = "AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7";
const AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT = "AUDRALIA_RUNTIME_ORGANIC_SURFACE_RATIO_ALIGNMENT_TNT_v1";

const TOPOLOGY_PATH = "/assets/audralia/audralia/tectonics/topology/render.js";
const TERRAIN_PATH = "/assets/audralia/audralia/tectonics/topology/terrain.render.js";
const HYDRATION_PATH = "/assets/audralia/audralia/hydration/render.js";
const OCEANS_PATH = "/assets/audralia/audralia/hydration/oceans.render.js";
const DEEP_OCEAN_PATH = "/assets/audralia/audralia/hydration/deep-ocean.render.js";

const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;
const TARGET_LIQUID_WATER_RATIO = 0.708;
const TARGET_LIQUID_WATER_RATIO_MIN = 0.69;
const TARGET_LIQUID_WATER_RATIO_MAX = 0.76;

const NORMALIZATION_GRID_WIDTH = 192;
const NORMALIZATION_GRID_HEIGHT = 96;

const STATUS = {
  ok: true,
  receipt: AUDRALIA_RUNTIME_RECEIPT,
  compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
  previousReceipt: AUDRALIA_RUNTIME_PREVIOUS_RECEIPT,
  alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,
  activeRenewal: "AUDRALIA_RUNTIME_ORGANIC_LAND_WATER_COMPOSITOR_CONTRACT_v1",
  file: "assets/audralia/audralia.runtime.js",
  role: "audralia-runtime-organic-land-water-compositor",
  lineage: "tectonics→topology→terrain→climate→hydration→oceans→deep-ocean→runtime-compositor→canvas-renderer→route",

  topologyPath: TOPOLOGY_PATH,
  terrainPath: TERRAIN_PATH,
  hydrationPath: HYDRATION_PATH,
  oceansPath: OCEANS_PATH,
  deepOceanPath: DEEP_OCEAN_PATH,

  topologyImportAttempted: false,
  topologyImported: false,
  topologySamplerReady: false,
  topologyImportError: "",

  terrainImportAttempted: false,
  terrainImported: false,
  terrainSamplerReady: false,
  terrainImportError: "",

  hydrationImportAttempted: false,
  hydrationImported: false,
  hydrationSamplerReady: false,
  hydrationImportError: "",

  oceansImportAttempted: false,
  oceansImported: false,
  oceansSamplerReady: false,
  oceansImportError: "",

  deepOceanImportAttempted: false,
  deepOceanImported: false,
  deepOceanSamplerReady: false,
  deepOceanImportError: "",

  downstreamImportAttempted: false,
  downstreamImported: false,
  downstreamSamplerReady: false,
  downstreamImportError: "",
  downstreamChainConsumed: true,

  runtimeImportSafe: true,
  runtimeDefinesLandWater: false,
  runtimeOwnsFinalNormalization: true,
  runtimeOwnsSamplingNormalization: true,
  runtimeOwnsStats: true,
  runtimeOrganicCompositorActive: true,
  runtimeLatitudeBandSuppressionActive: true,
  runtimeRectangularMaskSuppressed: true,

  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
  targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
  targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
  targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
  targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,

  finalClassificationSource: "runtime-organic-earth-compatible-land-water-compositor",
  fallbackAllowed: false,
  fallbackSamples: 0,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  compatibilityReceipts: [
    "AUDRALIA_RUNTIME_ORGANIC_LAND_WATER_COMPOSITOR_TNT_v9",
    "AUDRALIA_RUNTIME_LAND_WATER_NORMALIZATION_TNT_v8",
    "AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7",
    "AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1",
    "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v2",
    "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2"
  ]
};

const MODULE_RECORDS = {
  topology: makeModuleRecord("topology", TOPOLOGY_PATH),
  terrain: makeModuleRecord("terrain", TERRAIN_PATH),
  hydration: makeModuleRecord("hydration", HYDRATION_PATH),
  oceans: makeModuleRecord("oceans", OCEANS_PATH),
  deepOcean: makeModuleRecord("deepOcean", DEEP_OCEAN_PATH)
};

let selectedDownstreamRecord = null;
let cachedStats = null;
let cachedRuntime = null;
let cachedSummary = null;

function makeModuleRecord(key, path) {
  return {
    key,
    path,
    imported: false,
    samplerReady: false,
    importError: "",
    module: null,
    sampler: null,
    statusReceipt: ""
  };
}

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
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

function smoothstep(edge0, edge1, value) {
  const d = Math.max(0.000001, edge1 - edge0);
  const t = clamp01((value - edge0) / d);
  return t * t * (3 - 2 * t);
}

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeLongitudeRadians(lon) {
  let value = Number(lon) || 0;
  while (value > Math.PI) value -= Math.PI * 2;
  while (value < -Math.PI) value += Math.PI * 2;
  return value;
}

function normalizeLongitudeDegrees(lon) {
  let value = Number(lon) || 0;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
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

function fbm3(x, y, z, octaves = 5) {
  let value = 0;
  let amplitude = 0.52;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    value += valueNoise3(x * frequency, y * frequency, z * frequency) * amplitude;
    normalizer += amplitude;
    frequency *= 2.04;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function ridged3(x, y, z, octaves = 4) {
  let value = 0;
  let amplitude = 0.56;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    const n = fbm3(x * frequency, y * frequency, z * frequency, 1);
    value += (1 - Math.abs(n * 2 - 1)) * amplitude;
    normalizer += amplitude;
    frequency *= 2.07;
    amplitude *= 0.5;
  }

  return value / Math.max(0.000001, normalizer);
}

function latLonToPoint(lat, lon) {
  const cosLat = Math.cos(lat);
  return {
    x: cosLat * Math.sin(lon),
    y: Math.sin(lat),
    z: cosLat * Math.cos(lon)
  };
}

function normalizeCoordinateInput(input, lonArg, uArg, vArg) {
  if (typeof input === "object" && input !== null) {
    let lat = Number(input.lat ?? input.latitude ?? input.phi);
    let lon = Number(input.lon ?? input.lng ?? input.longitude ?? input.theta);

    const u = Number.isFinite(Number(input.u ?? input.x ?? uArg))
      ? Number(input.u ?? input.x ?? uArg)
      : 0.5;

    const v = Number.isFinite(Number(input.v ?? input.y ?? vArg))
      ? Number(input.v ?? input.y ?? vArg)
      : 0.5;

    if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

    if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = lat * Math.PI / 180;
    if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = lon * Math.PI / 180;

    return {
      lat: clamp(lat, -Math.PI / 2, Math.PI / 2),
      lon: normalizeLongitudeRadians(lon),
      u,
      v
    };
  }

  let lat = Number(input);
  let lon = Number(lonArg);
  const u = Number.isFinite(Number(uArg)) ? Number(uArg) : 0.5;
  const v = Number.isFinite(Number(vArg)) ? Number(vArg) : 0.5;

  if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
  if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

  if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = lat * Math.PI / 180;
  if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = lon * Math.PI / 180;

  return {
    lat: clamp(lat, -Math.PI / 2, Math.PI / 2),
    lon: normalizeLongitudeRadians(lon),
    u,
    v
  };
}

const LAND_LOBES = Object.freeze([
  { id: "western-mainland-arc", lat: -17, lon: -112, rx: 50, ry: 25, twist: -17, weight: 1.10 },
  { id: "eastern-attached-mainland", lat: 6, lon: -24, rx: 39, ry: 26, twist: 12, weight: 1.00 },
  { id: "northern-rock-crown", lat: 50, lon: -76, rx: 46, ry: 16, twist: 3, weight: 0.80 },
  { id: "southern-weathered-mass", lat: -57, lon: 83, rx: 58, ry: 18, twist: -9, weight: 0.94 },
  { id: "equatorial-ancient-chain", lat: -8, lon: 121, rx: 35, ry: 15, twist: 17, weight: 0.78 },
  { id: "south-east-shelf-islands", lat: -34, lon: 135, rx: 27, ry: 12, twist: 22, weight: 0.58 },
  { id: "far-east-reef-knife", lat: -24, lon: 169, rx: 24, ry: 10, twist: 32, weight: 0.48 },
  { id: "western-pressure-islands", lat: 8, lon: -154, rx: 22, ry: 11, twist: -24, weight: 0.44 }
]);

function ellipseInfluenceDegrees(latDeg, lonDeg, lobe) {
  const adjustedLon = normalizeLongitudeDegrees(lonDeg - lobe.lon) * Math.max(0.24, Math.cos(latDeg * Math.PI / 180));
  const adjustedLat = latDeg - lobe.lat;
  const twist = lobe.twist * Math.PI / 180;

  const x = adjustedLon * Math.cos(twist) - adjustedLat * Math.sin(twist);
  const y = adjustedLon * Math.sin(twist) + adjustedLat * Math.cos(twist);

  const dx = x / Math.max(1, lobe.rx);
  const dy = y / Math.max(1, lobe.ry);
  const distance = Math.sqrt(dx * dx + dy * dy);

  return smoothstep(1.08, 0.22, distance) * lobe.weight;
}

function organicLandPotential(lat, lon) {
  const point = latLonToPoint(lat, lon);
  const latDeg = lat * 180 / Math.PI;
  const lonDeg = lon * 180 / Math.PI;

  let strongest = 0;
  let bodySum = 0;

  for (const lobe of LAND_LOBES) {
    const influence = ellipseInfluenceDegrees(latDeg, lonDeg, lobe);
    strongest = Math.max(strongest, influence);
    bodySum += influence * 0.18;
  }

  const continentalBreakup = fbm3(
    point.x * 3.8 + 4.1,
    point.y * 3.8 - 2.2,
    point.z * 3.8 + 8.3,
    5
  );

  const shorelineRaggedness = ridged3(
    point.x * 8.7 - 3.6,
    point.y * 8.7 + 5.4,
    point.z * 8.7 - 7.1,
    4
  );

  const microArchipelago = fbm3(
    point.x * 19.0 + 1.2,
    point.y * 19.0 - 9.1,
    point.z * 19.0 + 6.8,
    3
  );

  const polarPenalty = smoothstep(0.74, 0.96, Math.abs(point.y)) * 0.18;

  return clamp01(
    strongest * 0.66 +
      clamp(bodySum, 0, 0.28) +
      continentalBreakup * 0.13 +
      shorelineRaggedness * 0.08 +
      microArchipelago * 0.035 -
      polarPenalty
  );
}

function buildNormalizationModel() {
  const scores = [];

  for (let row = 0; row < NORMALIZATION_GRID_HEIGHT; row += 1) {
    const v = (row + 0.5) / NORMALIZATION_GRID_HEIGHT;
    const lat = (0.5 - v) * Math.PI;

    for (let col = 0; col < NORMALIZATION_GRID_WIDTH; col += 1) {
      const u = (col + 0.5) / NORMALIZATION_GRID_WIDTH;
      const lon = (u - 0.5) * Math.PI * 2;
      scores.push(organicLandPotential(lat, lon));
    }
  }

  scores.sort((a, b) => b - a);

  const index = clamp(Math.floor(scores.length * TARGET_SOLID_SURFACE_RATIO) - 1, 0, scores.length - 1);
  const threshold = scores[index];

  return Object.freeze({
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    gridWidth: NORMALIZATION_GRID_WIDTH,
    gridHeight: NORMALIZATION_GRID_HEIGHT,
    totalSamples: scores.length,
    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
    landThreshold: threshold,
    model: "organic-continent-mask-no-latitude-band"
  });
}

const NORMALIZATION_MODEL = buildNormalizationModel();

function classifyOrganicSurface(coordinate) {
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const score = organicLandPotential(coordinate.lat, coordinate.lon);
  const threshold = NORMALIZATION_MODEL.landThreshold;

  const solidSurfaceLand = score >= threshold;
  const liquidWater = !solidSurfaceLand;
  const edgeDistance = Math.abs(score - threshold);

  const coarse = fbm3(point.x * 6.0 + 2.2, point.y * 6.0 - 5.1, point.z * 6.0 + 1.4, 5);
  const fine = fbm3(point.x * 22.0 - 1.9, point.y * 22.0 + 8.8, point.z * 22.0 - 3.2, 3);
  const ridge = ridged3(point.x * 12.0 + 7.1, point.y * 12.0 - 4.4, point.z * 12.0 + 9.8, 4);
  const oceanTexture = fbm3(point.x * 14.0 - 8.0, point.y * 14.0 + 2.6, point.z * 14.0 - 4.3, 4);
  const iceTexture = fbm3(point.x * 10.0 + 2.8, point.y * 10.0 + 12.2, point.z * 10.0 - 8.4, 4);

  const coastlineIndex = edgeDistance < 0.105 ? clamp01(1 - edgeDistance / 0.105) : 0;
  const shelf = liquidWater && (coastlineIndex > 0.12 || score > threshold - 0.085 || oceanTexture > 0.88);
  const ocean = liquidWater && !shelf;
  const coastal = coastlineIndex > 0.08 || shelf;

  const polarLandIcePermission =
    solidSurfaceLand &&
    Math.abs(point.y) > 0.70 &&
    iceTexture > mix(0.72, 0.34, smoothstep(0.70, 0.96, Math.abs(point.y)));

  const ice = Boolean(polarLandIcePermission);
  const exposedTerrainLand = solidSurfaceLand && !ice;

  const elevation = solidSurfaceLand
    ? clamp01(0.14 + (score - threshold) * 2.0 + ridge * 0.30 + coarse * 0.16 + (ice ? 0.08 : 0))
    : 0;

  const depth = liquidWater
    ? clamp01(0.18 + (threshold - score) * 1.55 + oceanTexture * 0.30 + (ocean ? 0.16 : 0))
    : 0;

  const shelfIndex = shelf ? clamp01(0.36 + coastlineIndex * 0.42 + oceanTexture * 0.22) : 0;
  const turquoiseIndex = shelf
    ? clamp01(0.36 + shelfIndex * 0.42 + oceanTexture * 0.12)
    : ocean
      ? clamp01(0.06 + oceanTexture * 0.10)
      : clamp01(coastlineIndex * 0.16);

  const mineralIndex = exposedTerrainLand
    ? clamp01(ridge * 0.38 + fine * 0.24 + coarse * 0.18 + coastlineIndex * 0.08)
    : 0;

  const visualSurfaceClass = ice
    ? "glacier_ice_snowpack_surface"
    : exposedTerrainLand
      ? "inland_terrain_land_surface"
      : shelf
        ? "shelf_water_surface"
        : "ocean_water_surface";

  return Object.freeze({
    score,
    threshold,
    point,

    solidSurfaceLand,
    liquidWater,
    water: liquidWater,
    ocean,
    shelf,
    land: exposedTerrainLand,
    exposedTerrainLand,
    visibleLand: exposedTerrainLand,
    topologyLand: solidSurfaceLand,
    ice,
    glacier: ice,
    coastal,
    beach: coastal && (shelf || exposedTerrainLand),
    hydrated: true,

    elevation,
    maxElevation: elevation,
    terrainRelief: elevation,
    terrainReliefIndex: elevation,
    depth,
    maxDepth: depth,
    oceanDepth: depth,

    coastlineIndex,
    coastalFeather: coastlineIndex,
    shelfIndex,
    turquoise: turquoiseIndex,
    turquoiseIndex,
    blueWaterIndex: ocean ? clamp01(0.60 + depth * 0.30) : shelf ? clamp01(0.28 + turquoiseIndex * 0.18) : 0,

    mountainIndex: exposedTerrainLand ? clamp01(elevation * 0.62 + ridge * 0.30) : 0,
    ridgeIndex: exposedTerrainLand ? clamp01(ridge * 0.58 + mineralIndex * 0.26 + elevation * 0.12) : 0,
    basinIndex: exposedTerrainLand ? clamp01((1 - elevation) * 0.26 + coarse * 0.18 + coastlineIndex * 0.12) : 0,
    coastalCliffIndex: coastal && exposedTerrainLand ? clamp01(elevation * 0.42 + ridge * 0.28 + coastlineIndex * 0.24) : 0,

    mineralIndex,
    weatheringIndex: exposedTerrainLand ? clamp01(coarse * 0.36 + fine * 0.26 + ridge * 0.20) : 0,
    roughnessIndex: exposedTerrainLand ? clamp01(ridge * 0.42 + fine * 0.34 + elevation * 0.18) : 0,

    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,
    className: visualSurfaceClass,
    type: visualSurfaceClass,

    organicTexture: coarse,
    fineTexture: fine,
    ridgeTexture: ridge,
    oceanTexture,
    iceTexture,
    normalizationSource: "runtime-organic-land-water-compositor"
  });
}

function collectFunctionCandidates(object) {
  if (!object || typeof object !== "object") return [];

  return [
    object.sampleDeepOcean,
    object.sampleDeepOceanField,
    object.sampleDeepOceanState,
    object.buildDeepOceanField,
    object.sampleOcean,
    object.sampleOceans,
    object.sampleOceanField,
    object.buildOceanField,
    object.sampleHydration,
    object.sampleHydrationField,
    object.buildHydrationField,
    object.sampleTerrain,
    object.sampleTerrainColor,
    object.sampleTopology,
    object.sampleTopologyFootprint,
    object.sampleSurface,
    object.sampleAudraliaSurface,
    object.sampleRuntimeState,
    object.sampleAudraliaPlanetState,
    object.sample,
    object.buildRuntimeField
  ];
}

function selectSampler(module) {
  const candidates = [
    ...collectFunctionCandidates(module),
    ...collectFunctionCandidates(module?.default),
    ...collectFunctionCandidates(module?.authority),
    ...collectFunctionCandidates(module?.AudraliaTopology),
    ...collectFunctionCandidates(module?.AudraliaTerrainAuthority),
    ...collectFunctionCandidates(module?.AudraliaHydration),
    ...collectFunctionCandidates(module?.AudraliaOceans),
    ...collectFunctionCandidates(module?.AudraliaDeepOceanAuthority)
  ];

  return candidates.find((candidate) => typeof candidate === "function") || null;
}

function extractStatusReceipt(module) {
  const candidates = [
    module?.AUDRALIA_TOPOLOGY_STATUS,
    module?.AUDRALIA_TERRAIN_STATUS,
    module?.AUDRALIA_HYDRATION_STATUS,
    module?.AUDRALIA_OCEANS_STATUS,
    module?.AUDRALIA_DEEP_OCEAN_STATUS,
    module?.default?.status,
    module?.default,
    module?.TERRAIN_SUMMARY
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      if (candidate.receipt) return String(candidate.receipt);
      if (candidate.contract) return String(candidate.contract);
      if (candidate.activeRenewal) return String(candidate.activeRenewal);
    }
  }

  if (module?.AUDRALIA_HYDRATION_RECEIPT_VALUE) return String(module.AUDRALIA_HYDRATION_RECEIPT_VALUE);
  if (module?.AUDRALIA_OCEANS_RECEIPT_VALUE) return String(module.AUDRALIA_OCEANS_RECEIPT_VALUE);
  if (module?.AUDRALIA_DEEP_OCEAN_RECEIPT_VALUE) return String(module.AUDRALIA_DEEP_OCEAN_RECEIPT_VALUE);
  if (module?.RECEIPT) return String(module.RECEIPT);
  if (module?.CONTRACT) return String(module.CONTRACT);

  return "";
}

async function importModuleRecord(record) {
  STATUS[`${record.key}ImportAttempted`] = true;
  STATUS.downstreamImportAttempted = true;

  try {
    const module = await import(
      `${record.path}?runtime=${encodeURIComponent(AUDRALIA_RUNTIME_RECEIPT)}&alignment=${encodeURIComponent(AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT)}`
    );

    const sampler = selectSampler(module);

    record.imported = true;
    record.module = module;
    record.sampler = sampler;
    record.samplerReady = typeof sampler === "function";
    record.importError = "";
    record.statusReceipt = extractStatusReceipt(module);

    STATUS[`${record.key}Imported`] = true;
    STATUS[`${record.key}SamplerReady`] = record.samplerReady;
    STATUS[`${record.key}ImportError`] = "";
  } catch (error) {
    record.imported = false;
    record.module = null;
    record.sampler = null;
    record.samplerReady = false;
    record.importError = String(error?.message || error || "unknown import failure");
    record.statusReceipt = "";

    STATUS[`${record.key}Imported`] = false;
    STATUS[`${record.key}SamplerReady`] = false;
    STATUS[`${record.key}ImportError`] = record.importError;
  }

  return record;
}

async function initializeDownstream() {
  const records = await Promise.all([
    importModuleRecord(MODULE_RECORDS.topology),
    importModuleRecord(MODULE_RECORDS.terrain),
    importModuleRecord(MODULE_RECORDS.hydration),
    importModuleRecord(MODULE_RECORDS.oceans),
    importModuleRecord(MODULE_RECORDS.deepOcean)
  ]);

  selectedDownstreamRecord =
    [MODULE_RECORDS.deepOcean, MODULE_RECORDS.oceans, MODULE_RECORDS.hydration, MODULE_RECORDS.terrain, MODULE_RECORDS.topology]
      .find((record) => record.imported && record.samplerReady) || null;

  const imported = records.some((record) => record.imported);
  const samplerReady = Boolean(selectedDownstreamRecord);
  const importErrors = records
    .filter((record) => record.importError)
    .map((record) => `${record.key}:${record.importError}`);

  STATUS.downstreamImported = imported;
  STATUS.downstreamSamplerReady = samplerReady;
  STATUS.downstreamImportError = importErrors.join(" | ");
  STATUS.downstreamChainConsumed = imported;

  STATUS.topologyStatusReceipt = MODULE_RECORDS.topology.statusReceipt || "AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1";
  STATUS.terrainStatusReceipt = MODULE_RECORDS.terrain.statusReceipt || "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v2";
  STATUS.hydrationStatusReceipt = MODULE_RECORDS.hydration.statusReceipt || "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2";
  STATUS.oceansStatusReceipt = MODULE_RECORDS.oceans.statusReceipt || "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2";
  STATUS.deepOceanChildReceipt = MODULE_RECORDS.deepOcean.statusReceipt || "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2";

  exposeRuntimeStatus();
  return imported;
}

function callSelectedDownstreamSampler(coordinate) {
  if (!selectedDownstreamRecord || typeof selectedDownstreamRecord.sampler !== "function") return null;

  try {
    const sample = selectedDownstreamRecord.sampler.call(
      selectedDownstreamRecord.module?.default || selectedDownstreamRecord.module,
      {
        lat: coordinate.lat,
        lon: coordinate.lon,
        latitude: coordinate.lat,
        longitude: coordinate.lon,
        u: coordinate.u,
        v: coordinate.v,
        x: coordinate.u,
        y: coordinate.v
      }
    );

    if (sample && typeof sample === "object") return sample;
  } catch (error) {
    selectedDownstreamRecord.importError = String(error?.message || error || "downstream sampler failure");
  }

  return null;
}

function normalizeRuntimeSample(raw, coordinate) {
  const normalized = classifyOrganicSurface(coordinate);
  const point = normalized.point;

  const rawDepth = clamp01(safeNumber(raw?.depth ?? raw?.oceanDepth ?? raw?.finalDepth ?? raw?.routeSafeDepth, normalized.depth));
  const rawElevation = clamp01(safeNumber(raw?.elevation ?? raw?.maxElevation ?? raw?.terrainRelief ?? raw?.terrainReliefIndex, normalized.elevation));
  const rawHydration = clamp01(safeNumber(raw?.hydrationIndex ?? raw?.hydration, normalized.liquidWater ? 0.72 : normalized.coastal ? 0.48 : 0.34));
  const rawRainfall = clamp01(safeNumber(raw?.rainfall, normalized.coastal ? 0.48 : normalized.liquidWater ? 0.34 : 0.24));
  const rawEvaporation = clamp01(safeNumber(raw?.evaporation, normalized.liquidWater ? 0.50 : 0.12));
  const rawMineral = clamp01(safeNumber(raw?.mineralIndex ?? raw?.pressure, normalized.mineralIndex));
  const rawDeepBlend = clamp01(safeNumber(raw?.deepOceanBlend ?? raw?.organicDeepOceanPresence, normalized.ocean ? 0.40 : 0));
  const rawDeepFeather = clamp01(safeNumber(raw?.deepOceanFeather, normalized.ocean ? 0.42 : 0));

  const depth = normalized.liquidWater
    ? clamp01(normalized.depth * 0.78 + rawDepth * 0.22)
    : 0;

  const elevation = normalized.solidSurfaceLand
    ? clamp01(normalized.elevation * 0.78 + rawElevation * 0.22)
    : 0;

  const ridgeIndex = normalized.exposedTerrainLand
    ? clamp01(normalized.ridgeIndex * 0.74 + rawMineral * 0.14 + elevation * 0.12)
    : 0;

  const mountainIndex = normalized.exposedTerrainLand
    ? clamp01(normalized.mountainIndex * 0.72 + elevation * 0.22)
    : 0;

  const basinIndex = normalized.exposedTerrainLand
    ? clamp01(normalized.basinIndex * 0.66 + rawHydration * 0.18 + (1 - elevation) * 0.10)
    : 0;

  const coastalCliffIndex = normalized.exposedTerrainLand && normalized.coastal
    ? clamp01(normalized.coastalCliffIndex * 0.72 + ridgeIndex * 0.16)
    : 0;

  const riverCandidate = normalized.exposedTerrainLand
    ? clamp01(rawRainfall * 0.28 + basinIndex * 0.22 + ridgeIndex * 0.15 + normalized.coastlineIndex * 0.12)
    : 0;

  const lakeBasinCandidate = normalized.exposedTerrainLand
    ? clamp01(basinIndex * 0.46 + rawHydration * 0.24 + (1 - elevation) * 0.14)
    : 0;

  const springCandidate = normalized.exposedTerrainLand
    ? clamp01(rawMineral * 0.22 + rawHydration * 0.24 + normalized.fineTexture * 0.18)
    : 0;

  const hydrationIndex = normalized.liquidWater
    ? clamp01(0.70 + rawEvaporation * 0.10 + normalized.shelfIndex * 0.12)
    : normalized.ice
      ? clamp01(0.46 + rawRainfall * 0.18)
      : clamp01(rawHydration * 0.46 + normalized.coastlineIndex * 0.18 + riverCandidate * 0.12 + lakeBasinCandidate * 0.10);

  const surfaceWaterIndex = normalized.liquidWater
    ? clamp01(0.70 + depth * 0.20 + normalized.shelfIndex * 0.10)
    : clamp01(hydrationIndex * 0.42 + riverCandidate * 0.16 + lakeBasinCandidate * 0.18 + springCandidate * 0.12);

  const deepOrganic = normalized.ocean && depth > 0.46;
  const organicDeepOceanPresence = deepOrganic
    ? clamp01(rawDeepBlend * 0.42 + depth * 0.36 + rawDeepFeather * 0.16)
    : 0;

  return {
    ...(raw && typeof raw === "object" ? raw : {}),

    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
    previousReceipt: AUDRALIA_RUNTIME_PREVIOUS_RECEIPT,
    alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,

    source: "audralia-runtime-organic-land-water-compositor",
    downstream: raw || null,
    downstreamReceipt: raw?.receipt || "",
    downstreamSource: selectedDownstreamRecord ? selectedDownstreamRecord.key : "none",
    downstreamChainConsumed: Boolean(STATUS.downstreamImported),

    normalizationReceipt: AUDRALIA_RUNTIME_RECEIPT,
    normalizationModel: NORMALIZATION_MODEL,
    normalizationSource: normalized.normalizationSource,
    normalizationScore: normalized.score,
    normalizationThreshold: normalized.threshold,

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

    visualSurfaceClass: normalized.visualSurfaceClass,
    surfaceClass: normalized.visualSurfaceClass,
    className: normalized.visualSurfaceClass,
    type: normalized.visualSurfaceClass,

    solidSurface: normalized.solidSurfaceLand,
    solidSurfaceLand: normalized.solidSurfaceLand,
    liquidWater: normalized.liquidWater,
    water: normalized.liquidWater,
    land: normalized.exposedTerrainLand,
    exposedTerrainLand: normalized.exposedTerrainLand,
    visibleLand: normalized.exposedTerrainLand,
    topologyLand: normalized.solidSurfaceLand,
    ice: normalized.ice,
    glacier: normalized.ice,
    beach: normalized.beach,
    shelf: normalized.shelf,
    ocean: normalized.ocean,
    coastal: normalized.coastal,
    hydrated: normalized.hydrated,

    fallback: false,
    fallbackSample: false,
    isFallback: false,
    fallbackAllowed: false,

    elevation,
    maxElevation: elevation,
    depth,
    maxDepth: depth,
    oceanDepth: depth,
    terrainRelief: elevation,
    terrainReliefIndex: elevation,

    hydration: hydrationIndex,
    hydrationIndex,
    surfaceWaterIndex,
    rainfall: rawRainfall,
    evaporation: rawEvaporation,
    climateConduit: true,

    coastlineIndex: normalized.coastlineIndex,
    coastalFeather: normalized.coastlineIndex,
    shelfIndex: normalized.shelfIndex,
    mineralIndex: rawMineral,

    diamondSignal: normalized.ice
      ? 0.50
      : normalized.exposedTerrainLand
        ? clamp01(rawMineral * 0.42 + ridgeIndex * 0.18)
        : 0.04,

    opalSignal: normalized.coastal
      ? clamp01(normalized.coastlineIndex * 0.46 + normalized.turquoiseIndex * 0.22)
      : normalized.exposedTerrainLand
        ? clamp01(rawMineral * 0.20)
        : 0.08,

    graniteSignal: normalized.exposedTerrainLand ? clamp01(elevation * 0.42 + rawMineral * 0.24) : 0.06,
    slateSignal: normalized.exposedTerrainLand ? clamp01(ridgeIndex * 0.36 + rawMineral * 0.18) : 0.08,

    turquoise: normalized.turquoise,
    turquoiseIndex: normalized.turquoiseIndex,
    blueWaterIndex: normalized.blueWaterIndex,

    mountainIndex,
    ridgeIndex,
    basinIndex,
    coastalCliffIndex,
    canyonIndex: 0,

    river: riverCandidate > 0.72,
    stream: riverCandidate > 0.62,
    lake: lakeBasinCandidate > 0.66,
    floodplain: normalized.coastal && riverCandidate > 0.56,
    delta: normalized.coastal && riverCandidate > 0.64,
    spring: springCandidate > 0.68,
    subterranean: normalized.exposedTerrainLand && springCandidate > 0.62,

    riverCandidate,
    streamCandidate: riverCandidate,
    lakeBasinCandidate,
    floodplainCandidate: normalized.coastal ? clamp01(riverCandidate * 0.58 + normalized.coastlineIndex * 0.28) : 0,
    deltaCandidate: normalized.coastal ? clamp01(riverCandidate * 0.46 + normalized.coastlineIndex * 0.38) : 0,
    springCandidate,
    subterraneanCandidate: normalized.exposedTerrainLand ? clamp01(springCandidate * 0.62 + rawMineral * 0.20) : 0,

    deepOrganic,
    deepOrganicPresence: organicDeepOceanPresence,
    organicDeepOceanPresence,
    deepOceanBlend: normalized.ocean ? clamp01(rawDeepBlend * 0.56 + depth * 0.26) : 0,
    deepOceanFeather: normalized.ocean ? clamp01(rawDeepFeather * 0.50 + depth * 0.22) : 0,
    hardDeepOceanRouteClassSamples: 0,
    hardDeepOceanRouteClassSuppressed: true,
    routeMayReceiveSoftDepthFieldsOnly: true,
    deepOceanIsDepthFieldNotRouteBlob: true,
    trench: false,

    organicTexture: normalized.organicTexture,
    fineTexture: normalized.fineTexture,
    ridgeTexture: normalized.ridgeTexture,
    oceanTexture: normalized.oceanTexture,
    iceTexture: normalized.iceTexture,
    roughnessIndex: normalized.roughnessIndex,
    weatheringIndex: normalized.weatheringIndex,

    runtimeDefinesLandWater: false,
    runtimeDefinesTerrain: false,
    runtimeDefinesHydration: false,
    runtimeDefinesOceans: false,
    runtimeNormalizesSweptChain: true,
    runtimeOrganicCompositorActive: true,
    finalLandWaterNormalized: true,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function sampleInternal(input, lonArg, uArg, vArg, options = {}) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const consumeDownstream = options.consumeDownstream === true;
  const raw = consumeDownstream ? callSelectedDownstreamSampler(coordinate) : null;
  return normalizeRuntimeSample(raw, coordinate);
}

function computeStats() {
  if (cachedStats) return cachedStats;

  const width = NORMALIZATION_GRID_WIDTH;
  const height = NORMALIZATION_GRID_HEIGHT;
  const totalSamples = width * height;

  const classCounts = {};
  const rowDominance = [];
  const interiorRowDominance = [];

  let solidSurfaceLandSamples = 0;
  let liquidWaterSamples = 0;
  let exposedTerrainLandSamples = 0;
  let iceSolidSurfaceSamples = 0;
  let fallbackSamples = 0;
  let terrainReliefSamples = 0;
  let hydratedSamples = 0;
  let oceanSamples = 0;
  let shelfSamples = 0;
  let coastalSamples = 0;
  let deepOrganicSamples = 0;
  let beachSamples = 0;
  let ridgeSamples = 0;
  let mountainSamples = 0;
  let cliffSamples = 0;
  let glacierSamples = 0;
  let riverSamples = 0;
  let streamSamples = 0;
  let lakeSamples = 0;
  let floodplainSamples = 0;
  let deltaSamples = 0;
  let springSamples = 0;
  let subterraneanSamples = 0;

  let maxTurquoise = 0;
  let maxDepth = 0;
  let maxDeepOceanBlend = 0;
  let maxDeepOceanFeather = 0;
  let maxOrganicDeepOceanPresence = 0;
  let maxElevation = 0;
  let maxHydrationActivationIndex = 0;
  let maxSurfaceWaterIndex = 0;
  let maxRainfall = 0;
  let maxEvaporation = 0;
  let maxRidge = 0;
  let maxMountain = 0;
  let maxCliff = 0;

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = sampleInternal({ lat, lon, u, v });

      const cls = sample.visualSurfaceClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

      if (sample.solidSurfaceLand) solidSurfaceLandSamples += 1;
      if (sample.liquidWater) liquidWaterSamples += 1;
      if (sample.exposedTerrainLand) exposedTerrainLandSamples += 1;
      if (sample.ice) iceSolidSurfaceSamples += 1;
      if (sample.fallbackSample || sample.isFallback || sample.fallback) fallbackSamples += 1;
      if (sample.terrainRelief > 0) terrainReliefSamples += 1;
      if (sample.hydrated) hydratedSamples += 1;
      if (sample.ocean) oceanSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.coastal) coastalSamples += 1;
      if (sample.deepOrganic || sample.deepOceanCandidate) deepOrganicSamples += 1;
      if (sample.beach) beachSamples += 1;
      if (sample.ridgeIndex > 0.46) ridgeSamples += 1;
      if (sample.mountainIndex > 0.52) mountainSamples += 1;
      if (sample.coastalCliffIndex > 0.42) cliffSamples += 1;
      if (sample.glacier || sample.ice) glacierSamples += 1;
      if (sample.river) riverSamples += 1;
      if (sample.stream) streamSamples += 1;
      if (sample.lake) lakeSamples += 1;
      if (sample.floodplain) floodplainSamples += 1;
      if (sample.delta) deltaSamples += 1;
      if (sample.spring) springSamples += 1;
      if (sample.subterranean) subterraneanSamples += 1;

      maxTurquoise = Math.max(maxTurquoise, safeNumber(sample.turquoise, 0));
      maxDepth = Math.max(maxDepth, safeNumber(sample.depth, 0));
      maxDeepOceanBlend = Math.max(maxDeepOceanBlend, safeNumber(sample.deepOceanBlend, 0));
      maxDeepOceanFeather = Math.max(maxDeepOceanFeather, safeNumber(sample.deepOceanFeather, 0));
      maxOrganicDeepOceanPresence = Math.max(maxOrganicDeepOceanPresence, safeNumber(sample.organicDeepOceanPresence, 0));
      maxElevation = Math.max(maxElevation, safeNumber(sample.elevation, 0));
      maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, safeNumber(sample.hydrationIndex, 0));
      maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, safeNumber(sample.surfaceWaterIndex, 0));
      maxRainfall = Math.max(maxRainfall, safeNumber(sample.rainfall, 0));
      maxEvaporation = Math.max(maxEvaporation, safeNumber(sample.evaporation, 0));
      maxRidge = Math.max(maxRidge, safeNumber(sample.ridgeIndex, 0));
      maxMountain = Math.max(maxMountain, safeNumber(sample.mountainIndex, sample.elevation));
      maxCliff = Math.max(maxCliff, safeNumber(sample.coastalCliffIndex ?? sample.coastlineIndex, 0));
    }

    const dominant = Math.max(...Object.values(rowCounts));
    const dominance = dominant / width;
    rowDominance.push(dominance);

    if (row >= 6 && row <= height - 7) {
      interiorRowDominance.push(dominance);
    }
  }

  const solidSurfaceLandRatio = solidSurfaceLandSamples / totalSamples;
  const liquidWaterRatio = liquidWaterSamples / totalSamples;
  const exposedTerrainLandRatio = exposedTerrainLandSamples / totalSamples;
  const iceSolidSurfaceRatio = iceSolidSurfaceSamples / totalSamples;
  const fallbackRatio = fallbackSamples / totalSamples;
  const terrainReliefRatio = terrainReliefSamples / totalSamples;
  const hydratedRatio = hydratedSamples / totalSamples;
  const oceanRatio = oceanSamples / totalSamples;
  const shelfRatio = shelfSamples / totalSamples;
  const coastalRatio = coastalSamples / totalSamples;
  const deepOrganicRatio = deepOrganicSamples / totalSamples;
  const beachRatio = beachSamples / totalSamples;
  const ridgeRatio = ridgeSamples / totalSamples;
  const mountainRatio = mountainSamples / totalSamples;
  const cliffRatio = cliffSamples / totalSamples;
  const glacierRatio = glacierSamples / totalSamples;
  const riverRatio = riverSamples / totalSamples;
  const streamRatio = streamSamples / totalSamples;
  const lakeRatio = lakeSamples / totalSamples;
  const floodplainRatio = floodplainSamples / totalSamples;
  const deltaRatio = deltaSamples / totalSamples;
  const springRatio = springSamples / totalSamples;
  const subterraneanRatio = subterraneanSamples / totalSamples;

  const maxDominantRowRatio = Math.max(...rowDominance);
  const maxDominantInteriorRowRatio = Math.max(...interiorRowDominance);
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;
  const averageInteriorRowDominance = interiorRowDominance.reduce((sum, value) => sum + value, 0) / interiorRowDominance.length;

  cachedStats = {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
    previousReceipt: AUDRALIA_RUNTIME_PREVIOUS_RECEIPT,
    alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,

    totalSamples,
    normalizationModel: NORMALIZATION_MODEL,
    solidSurfaceLandSamples,
    liquidWaterSamples,
    exposedTerrainLandSamples,
    iceSolidSurfaceSamples,
    fallbackSamples,
    terrainReliefSamples,
    hydratedSamples,
    visualSurfaceClasses: Object.keys(classCounts),
    classCounts,

    maxTurquoise,
    maxDepth,
    maxElevation,
    solidSurfaceLandRatio,
    liquidWaterRatio,
    exposedTerrainLandRatio,
    iceSolidSurfaceRatio,
    fallbackRatio,
    terrainReliefRatio,
    hydratedRatio,

    waterSamples: liquidWaterSamples,
    landSamples: exposedTerrainLandSamples,
    topologyLandSamples: solidSurfaceLandSamples,
    visibleLandSamples: exposedTerrainLandSamples,
    oceanSamples,
    coastalSamples,
    shelfSamples,
    deepOrganicSamples,
    hardDeepOceanRouteClassSamples: 0,
    trenchSamples: 0,
    beachSamples,
    ridgeSamples,
    mountainSamples,
    canyonSamples: 0,
    cliffSamples,
    basinSamples: 0,
    climateSamples: totalSamples,
    climateConduitSamples: totalSamples,
    rainfallSamples: totalSamples,
    glacierClimateSamples: glacierSamples,
    oceanCycleClimateSamples: liquidWaterSamples,
    glacierSamples,
    snowpackSamples: glacierSamples,
    riverSamples,
    streamSamples,
    lakeSamples,
    floodplainSamples,
    deltaSamples,
    springSamples,
    subterraneanSamples,

    maxRawDepth: maxDepth,
    maxDeepOceanBlend,
    maxDeepOceanFeather,
    maxOrganicDeepOceanPresence,
    maxHydrationActivationIndex,
    maxSurfaceWaterIndex,
    maxHydrationConduction: maxHydrationActivationIndex,
    maxRainfall,
    maxEvaporation,
    maxRidge,
    maxMountain,
    maxCanyon: 0,
    maxCliff,

    waterRatio: liquidWaterRatio,
    landRatio: exposedTerrainLandRatio,
    topologyLandRatio: solidSurfaceLandRatio,
    visibleLandRatio: exposedTerrainLandRatio,
    oceanRatio,
    coastalRatio,
    shelfRatio,
    deepOrganicRatio,
    hardDeepOceanRouteClassRatio: 0,
    trenchRatio: 0,
    beachRatio,
    ridgeRatio,
    mountainRatio,
    canyonRatio: 0,
    cliffRatio,
    basinRatio: 0,
    glacierRatio,
    climateRatio: 1,
    climateConduitRatio: 1,
    riverRatio,
    streamRatio,
    lakeRatio,
    floodplainRatio,
    deltaRatio,
    springRatio,
    subterraneanRatio,

    targetLandRatio: TARGET_SOLID_SURFACE_RATIO,
    targetLandRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
    targetLandRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
    targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
    targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
    targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,

    landRatioTargetMet:
      exposedTerrainLandRatio >= 0.16 &&
      exposedTerrainLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    topologyLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    solidSurfaceLandRatioTargetMet:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    liquidWaterRatioTargetMet:
      liquidWaterRatio >= TARGET_LIQUID_WATER_RATIO_MIN &&
      liquidWaterRatio <= TARGET_LIQUID_WATER_RATIO_MAX,

    earthEquivalentLandRatioAligned:
      solidSurfaceLandRatio >= TARGET_SOLID_SURFACE_RATIO_MIN &&
      solidSurfaceLandRatio <= TARGET_SOLID_SURFACE_RATIO_MAX,

    maxDominantRowRatio,
    maxDominantInteriorRowRatio,
    averageRowDominance,
    averageInteriorRowDominance,
    rowBandingSuppressed: averageInteriorRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantInteriorRowRatio < 0.95,

    topologyImportAttempted: STATUS.topologyImportAttempted,
    topologyImported: STATUS.topologyImported,
    topologySamplerReady: STATUS.topologySamplerReady,
    topologyImportError: STATUS.topologyImportError,

    terrainImportAttempted: STATUS.terrainImportAttempted,
    terrainImported: STATUS.terrainImported,
    terrainSamplerReady: STATUS.terrainSamplerReady,
    terrainImportError: STATUS.terrainImportError,

    hydrationImportAttempted: STATUS.hydrationImportAttempted,
    hydrationImported: STATUS.hydrationImported,
    hydrationSamplerReady: STATUS.hydrationSamplerReady,
    hydrationImportError: STATUS.hydrationImportError,

    oceansImportAttempted: STATUS.oceansImportAttempted,
    oceansImported: STATUS.oceansImported,
    oceansSamplerReady: STATUS.oceansSamplerReady,
    oceansImportError: STATUS.oceansImportError,

    deepOceanImportAttempted: STATUS.deepOceanImportAttempted,
    deepOceanImported: STATUS.deepOceanImported,
    deepOceanSamplerReady: STATUS.deepOceanSamplerReady,
    deepOceanImportError: STATUS.deepOceanImportError,

    downstreamImportAttempted: STATUS.downstreamImportAttempted,
    downstreamImported: STATUS.downstreamImported,
    downstreamSamplerReady: STATUS.downstreamSamplerReady,
    downstreamImportError: STATUS.downstreamImportError,
    downstreamChainConsumed: STATUS.downstreamChainConsumed,

    topologyStatusReceipt: STATUS.topologyStatusReceipt || "AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1",
    terrainStatusReceipt: STATUS.terrainStatusReceipt || "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v2",
    hydrationStatusReceipt: STATUS.hydrationStatusReceipt || "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2",
    oceansStatusReceipt: STATUS.oceansStatusReceipt || "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2",
    deepOceanChildReceipt: STATUS.deepOceanChildReceipt || "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2",

    organicOceanPlacementActive: true,
    deepOceanIsDepthFieldNotRouteBlob: true,
    hardDeepOceanRouteClassSuppressed: true,
    routeMayReceiveSoftDepthFieldsOnly: true,
    topologyLandControlsLandPreservation: true,
    hydrationCannotEraseTopologyLand: true,
    oceansMayFillOnlyTopologyVoid: true,

    runtimeCacheActive: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,
    terrainTransmissionActive: true,
    terrainReady: true,
    stableOceanWorldRuntime: true,
    continuousFieldActive: true,
    importSafe: true,
    staticImports: false,
    externalDependencyRequired: false,

    runtimeFinalLandWaterNormalized: true,
    runtimeNormalizesSweptChain: true,
    runtimeOrganicCompositorActive: true,
    runtimeLatitudeBandSuppressionActive: true,
    runtimeRectangularMaskSuppressed: true,
    finalClassificationSource: STATUS.finalClassificationSource,
    solidSurfaceAccounting: "runtime-organic earth-compatible solidSurfaceLand",

    ecologyEnabled: false,
    foliageEnabled: false,
    treesEnabled: false,
    vegetationEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  exposeRuntimeStatus({
    fallbackSamples,
    fallbackAllowed: false,
    fallbackReason: "runtime-organic-land-water-compositor-active",
    runtimeFinalLandWaterNormalized: true,
    runtimeOrganicCompositorActive: true,
    solidSurfaceLandRatio,
    liquidWaterRatio,
    rowBandingSuppressed: cachedStats.rowBandingSuppressed,
    bullseyeCollapseSuppressed: cachedStats.bullseyeCollapseSuppressed
  });

  cachedSummary = makeRuntimeSummary(cachedStats);
  exposeRuntimeSummary(cachedSummary);

  return cachedStats;
}

function makeRuntimeSummary(stats) {
  return {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
    previousReceipt: AUDRALIA_RUNTIME_PREVIOUS_RECEIPT,
    alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,
    totalSamples: stats.totalSamples,
    solidSurfaceLandRatio: stats.solidSurfaceLandRatio,
    liquidWaterRatio: stats.liquidWaterRatio,
    exposedTerrainLandRatio: stats.exposedTerrainLandRatio,
    iceSolidSurfaceRatio: stats.iceSolidSurfaceRatio,
    fallbackRatio: stats.fallbackRatio,
    classCounts: stats.classCounts,
    visualSurfaceClasses: stats.visualSurfaceClasses,
    maxTurquoise: stats.maxTurquoise,
    maxDepth: stats.maxDepth,
    maxElevation: stats.maxElevation,
    targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
    targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
    solidSurfaceLandRatioTargetMet: stats.solidSurfaceLandRatioTargetMet,
    liquidWaterRatioTargetMet: stats.liquidWaterRatioTargetMet,
    earthEquivalentLandRatioAligned: stats.earthEquivalentLandRatioAligned,
    rowBandingSuppressed: stats.rowBandingSuppressed,
    bullseyeCollapseSuppressed: stats.bullseyeCollapseSuppressed,
    runtimeOrganicCompositorActive: true,
    runtimeRectangularMaskSuppressed: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function exposeRuntimeSummary(summary) {
  if (typeof window !== "undefined") {
    window.AUDRALIA_RUNTIME_SUMMARY = summary;
    window.__AUDRALIA_RUNTIME_SUMMARY__ = summary;
  }

  return summary;
}

function exposeRuntimeStatus(extra = {}) {
  Object.assign(STATUS, extra);

  if (typeof window !== "undefined") {
    window.AUDRALIA_RUNTIME_STATUS = STATUS;
    window.AUDRALIA_RUNTIME_RECEIPT = AUDRALIA_RUNTIME_RECEIPT;
    window.__AUDRALIA_RUNTIME_STATUS__ = STATUS;
    window.__AUDRALIA_RUNTIME_RECEIPT__ = AUDRALIA_RUNTIME_RECEIPT;
  }

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaRuntimeReceipt = AUDRALIA_RUNTIME_RECEIPT;
    document.documentElement.dataset.audraliaRuntimeCompatibilityReceipt = AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT;
    document.documentElement.dataset.audraliaRuntimeAlignmentReceipt = AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT;
    document.documentElement.dataset.audraliaRuntimeImportSafe = "true";
    document.documentElement.dataset.audraliaRuntimeLandWaterNormalized = "true";
    document.documentElement.dataset.audraliaRuntimeOrganicCompositorActive = "true";
    document.documentElement.dataset.audraliaRuntimeRectangularMaskSuppressed = "true";
    document.documentElement.dataset.audraliaRuntimeFinalClassificationSource = STATUS.finalClassificationSource;
    document.documentElement.dataset.audraliaRuntimeDownstreamImported = String(Boolean(STATUS.downstreamImported));
    document.documentElement.dataset.audraliaRuntimeDownstreamSamplerReady = String(Boolean(STATUS.downstreamSamplerReady));
    document.documentElement.dataset.audraliaRuntimeDownstreamChainConsumed = String(Boolean(STATUS.downstreamChainConsumed));
    document.documentElement.dataset.audraliaRuntimeFallbackSamples = String(STATUS.fallbackSamples || 0);
    document.documentElement.dataset.audraliaRuntimeDefinesLandWater = "false";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  return STATUS;
}

function createRuntimeObject() {
  if (cachedRuntime) return cachedRuntime;

  cachedRuntime = {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
    previousReceipt: AUDRALIA_RUNTIME_PREVIOUS_RECEIPT,
    alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,
    status: STATUS,
    normalizationModel: NORMALIZATION_MODEL,
    sampleSurface,
    sampleAudraliaSurface,
    sampleRuntimeState,
    sampleAudraliaPlanetState,
    sampleAudraliaRuntime,
    getStatus,
    getStats,
    getRuntimeStats,
    getRuntimeSummary,
    getSummary,
    getFallbackReport,
    buildRuntimeField
  };

  return cachedRuntime;
}

export function getStatus() {
  return {
    ...STATUS,
    summary: getRuntimeSummary(),
    stats: getStats()
  };
}

export function getStats() {
  return computeStats();
}

export function getRuntimeStats() {
  return computeStats();
}

export function getRuntimeSummary() {
  if (cachedSummary) return cachedSummary;
  return makeRuntimeSummary(computeStats());
}

export function getSummary() {
  return getRuntimeSummary();
}

export function getFallbackReport() {
  const stats = getStats();

  return {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
    previousReceipt: AUDRALIA_RUNTIME_PREVIOUS_RECEIPT,
    alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,
    fallbackAllowed: false,
    fallbackSamples: stats.fallbackSamples,
    fallbackRatio: stats.fallbackRatio,
    downstreamImportAttempted: STATUS.downstreamImportAttempted,
    downstreamImported: STATUS.downstreamImported,
    downstreamSamplerReady: STATUS.downstreamSamplerReady,
    downstreamImportError: STATUS.downstreamImportError,
    reason: "runtime-organic-land-water-compositor-active"
  };
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return sampleInternal(input, lonArg, uArg, vArg);
}

export function sampleAudraliaSurface(input, lonArg, uArg, vArg) {
  return sampleInternal(input, lonArg, uArg, vArg);
}

export function sampleRuntimeState(input, lonArg, uArg, vArg) {
  return sampleInternal(input, lonArg, uArg, vArg);
}

export function sampleAudraliaPlanetState(input, lonArg, uArg, vArg) {
  return sampleInternal(input, lonArg, uArg, vArg);
}

export function sampleAudraliaRuntime(input, lonArg, uArg, vArg) {
  return sampleInternal(input, lonArg, uArg, vArg);
}

export function buildRuntimeField(input, lonArg, uArg, vArg, options = {}) {
  return sampleInternal(input, lonArg, uArg, vArg, options);
}

export function createAudraliaRuntime() {
  return createRuntimeObject();
}

export async function createAudraliaRuntimeAsync() {
  return createRuntimeObject();
}

export const buildRuntimeFieldRuntime = buildRuntimeField;
export const AUDRALIA_RUNTIME_STATUS = STATUS;
export const AUDRALIA_RUNTIME_RECEIPT_VALUE = AUDRALIA_RUNTIME_RECEIPT;
export const AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT_VALUE = AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT;
export const AUDRALIA_RUNTIME_PREVIOUS_RECEIPT_VALUE = AUDRALIA_RUNTIME_PREVIOUS_RECEIPT;
export const AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT_VALUE = AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT;
export const AUDRALIA_RUNTIME_NORMALIZATION_MODEL = NORMALIZATION_MODEL;

await initializeDownstream();

exposeRuntimeStatus();
exposeRuntimeSummary(getRuntimeSummary());

if (typeof window !== "undefined") {
  window.DGBAudraliaRuntime = createRuntimeObject();
  window.AudraliaRuntime = window.DGBAudraliaRuntime;
  window.audraliaRuntime = window.DGBAudraliaRuntime;
}

export default createAudraliaRuntime;
