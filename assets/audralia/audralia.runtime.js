// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_IMPORT_SAFE_DOWNSTREAM_CHAIN_CONNECTOR_TNT_v5
// Full-file replacement. Runtime authority only.
// Purpose: keep runtime importable at all times, dynamically consume the swept downstream chain,
// expose any downstream import error as data, and prevent canvas from falling to runtime=unavailable.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_IMPORT_SAFE_DOWNSTREAM_CHAIN_CONNECTOR_TNT_v5";
const DEEP_OCEAN_PATH = "/assets/audralia/audralia/hydration/deep-ocean.render.js";

const STATUS = {
  ok: true,
  receipt: AUDRALIA_RUNTIME_RECEIPT,
  activeRenewal: "AUDRALIA_RUNTIME_IMPORT_SAFE_DOWNSTREAM_CHAIN_CONNECTOR_CONTRACT_v1",
  file: "assets/audralia/audralia.runtime.js",
  role: "audralia-runtime-import-safe-downstream-chain-connector",
  lineage: "tectonics→topology→terrain→hydration→oceans→deep-ocean→runtime→canvas-renderer→route",
  downstreamPath: DEEP_OCEAN_PATH,
  downstreamImportAttempted: false,
  downstreamImported: false,
  downstreamImportError: "",
  downstreamChainConsumed: false,
  runtimeImportSafe: true,
  runtimeDefinesLandWater: false,
  runtimeDefinesTerrain: false,
  runtimeDefinesHydration: false,
  runtimeDefinesOceans: false,
  runtimeOwnsSamplingNormalization: true,
  runtimeOwnsStats: true,
  canvasFinalRenderOnlyExpected: true,
  terrainReady: true,
  continuousFieldActive: true,
  fallbackAllowed: true,
  fallbackReason: "only-if-downstream-import-fails",
  fallbackSamples: 0,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,
  compatibilityReceipts: [
    "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2",
    "AUDRALIA_TERRAIN_CONTINUOUS_RELIEF_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_SWEEP_TNT_v2",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],
  api: {
    createAudraliaRuntime: true,
    buildRuntimeField: true,
    sampleRuntimeState: true,
    sampleAudraliaPlanetState: true,
    sampleSurface: true,
    getStats: true,
    getRuntimeStats: true,
    getFallbackReport: true,
    getStatus: true
  }
};

let downstreamModulePromise = null;
let downstreamModule = null;
let downstreamImportError = "";
let cachedRuntime = null;
let cachedStats = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function bool(value) {
  return Boolean(value);
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
    document.documentElement.dataset.audraliaRuntimeImportSafe = "true";
    document.documentElement.dataset.audraliaRuntimeDownstreamPath = DEEP_OCEAN_PATH;
    document.documentElement.dataset.audraliaRuntimeDownstreamImported = String(Boolean(STATUS.downstreamImported));
    document.documentElement.dataset.audraliaRuntimeDownstreamChainConsumed = String(Boolean(STATUS.downstreamChainConsumed));
    document.documentElement.dataset.audraliaRuntimeFallbackSamples = String(STATUS.fallbackSamples || 0);
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }

  return STATUS;
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

function hash3(x, y, z) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function fallbackSample(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);

  const islandSeed = hash3(
    Math.round(point.x * 7),
    Math.round(point.y * 7),
    Math.round(point.z * 7)
  );

  const polarIce = Math.abs(point.y) > 0.91;
  const island = islandSeed > 0.86 && Math.abs(point.y) < 0.82;
  const shelf = islandSeed > 0.78 && islandSeed <= 0.86 && Math.abs(point.y) < 0.86;
  const water = !island && !polarIce;

  const visualSurfaceClass = polarIce
    ? "glacier_ice_snowpack_surface"
    : island
      ? "inland_terrain_land_surface"
      : shelf
        ? "shelf_water_surface"
        : "ocean_water_surface";

  return normalizeRuntimeSample({
    ok: true,
    receipt: "AUDRALIA_RUNTIME_SAFE_INTERNAL_FALLBACK_SAMPLE",
    source: "runtime-safe-internal-fallback",
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
    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,
    water,
    liquidWater: water,
    ocean: water && !shelf,
    shelf,
    land: island,
    exposedTerrainLand: island,
    solidSurfaceLand: island || polarIce,
    ice: polarIce,
    glacier: polarIce,
    elevation: island || polarIce ? 0.34 : 0,
    terrainRelief: island || polarIce ? 0.28 : 0,
    depth: water ? 0.56 : 0,
    hydration: water ? 0.72 : 0.32,
    hydrationIndex: water ? 0.72 : 0.32,
    surfaceWaterIndex: water ? 0.72 : 0.18,
    coastlineIndex: shelf ? 0.7 : 0,
    turquoise: shelf ? 0.68 : water ? 0.2 : 0.08,
    fallback: true,
    fallbackSample: true
  });
}

async function importDownstreamModule() {
  STATUS.downstreamImportAttempted = true;
  exposeRuntimeStatus();

  if (downstreamModule) return downstreamModule;
  if (downstreamModulePromise) return downstreamModulePromise;

  downstreamModulePromise = import(`${DEEP_OCEAN_PATH}?runtime=${AUDRALIA_RUNTIME_RECEIPT}&t=${Date.now()}`)
    .then((module) => {
      downstreamModule = module;
      downstreamImportError = "";

      exposeRuntimeStatus({
        downstreamImported: true,
        downstreamImportError: "",
        downstreamChainConsumed: true
      });

      return module;
    })
    .catch((error) => {
      downstreamModule = null;
      downstreamImportError = String(error?.message || error || "unknown downstream import failure");

      exposeRuntimeStatus({
        downstreamImported: false,
        downstreamImportError,
        downstreamChainConsumed: false
      });

      return null;
    });

  return downstreamModulePromise;
}

function getSampleFunction(module) {
  if (!module) return null;

  const candidates = [
    module.sampleDeepOcean,
    module.sampleDeepOceanField,
    module.sampleSurface,
    module.buildDeepOceanField,
    module.default
  ];

  return candidates.find((candidate) => typeof candidate === "function") || null;
}

function normalizeRuntimeSample(raw, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(raw, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);

  const visualSurfaceClass = String(
    raw?.visualSurfaceClass ||
    raw?.surfaceClass ||
    raw?.className ||
    raw?.type ||
    "ocean_water_surface"
  );

  const liquidWater = bool(raw?.liquidWater || raw?.water || raw?.ocean || raw?.shelf);
  const ice = bool(raw?.ice || raw?.glacier || visualSurfaceClass.includes("ice") || visualSurfaceClass.includes("snow"));
  const exposedTerrainLand = bool(raw?.exposedTerrainLand || raw?.land) && !liquidWater && !ice;
  const solidSurfaceLand = bool(raw?.solidSurfaceLand || exposedTerrainLand || ice) && !liquidWater;
  const ocean = bool(raw?.ocean || visualSurfaceClass.includes("ocean")) && liquidWater;
  const shelf = bool(raw?.shelf || visualSurfaceClass.includes("shelf")) && liquidWater;
  const beach = bool(raw?.beach || visualSurfaceClass.includes("beach"));
  const coastal = bool(raw?.coastal || safeNumber(raw?.coastWaterMask, 0) > 0.22 || safeNumber(raw?.coastlineIndex, 0) > 0.16);

  const depth = liquidWater
    ? clamp01(safeNumber(raw?.depth ?? raw?.oceanDepth ?? raw?.finalDepth ?? raw?.routeSafeDepth, 0.42))
    : 0;

  const elevation = solidSurfaceLand
    ? clamp01(safeNumber(raw?.elevation ?? raw?.maxElevation ?? raw?.terrainRelief, ice ? 0.36 : 0.24))
    : 0;

  const terrainRelief = solidSurfaceLand
    ? clamp01(safeNumber(raw?.terrainRelief ?? raw?.terrainReliefIndex ?? elevation, elevation))
    : 0;

  const hydrationIndex = clamp01(safeNumber(raw?.hydrationIndex ?? raw?.hydration, liquidWater ? 0.72 : 0.28));
  const surfaceWaterIndex = liquidWater
    ? clamp01(safeNumber(raw?.surfaceWaterIndex, 0.7))
    : clamp01(safeNumber(raw?.surfaceWaterIndex, hydrationIndex * 0.52));

  const coastlineIndex = clamp01(safeNumber(raw?.coastlineIndex ?? raw?.coastalFeather ?? raw?.coastWaterMask, 0));
  const shelfIndex = clamp01(safeNumber(raw?.shelfIndex ?? raw?.shelfMask, shelf ? 0.5 : 0));
  const mineralIndex = clamp01(safeNumber(raw?.mineralIndex, 0.38));

  return {
    ...raw,
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    source: "audralia-runtime-import-safe-downstream-chain-connector",
    downstream: raw,
    downstreamReceipt: raw?.receipt || "",
    downstreamChainConsumed: Boolean(STATUS.downstreamImported),

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

    visualSurfaceClass,
    surfaceClass: visualSurfaceClass,
    className: visualSurfaceClass,
    type: visualSurfaceClass,

    solidSurface: solidSurfaceLand,
    solidSurfaceLand,
    liquidWater,
    water: liquidWater,
    land: exposedTerrainLand,
    exposedTerrainLand,
    visibleLand: exposedTerrainLand,
    topologyLand: solidSurfaceLand,
    ice,
    glacier: ice,
    beach,
    shelf,
    ocean,
    coastal,
    hydrated: hydrationIndex > 0.18 || liquidWater,

    fallback: Boolean(raw?.fallback),
    fallbackSample: Boolean(raw?.fallbackSample),
    fallbackAllowed: true,

    elevation,
    maxElevation: elevation,
    depth,
    maxDepth: depth,
    terrainRelief,
    terrainReliefIndex: terrainRelief,

    hydration: hydrationIndex,
    hydrationIndex,
    surfaceWaterIndex,
    rainfall: clamp01(safeNumber(raw?.rainfall, 0)),
    evaporation: clamp01(safeNumber(raw?.evaporation, 0)),
    climateConduit: true,

    coastlineIndex,
    coastalFeather: coastlineIndex,
    shelfIndex,
    mineralIndex,
    diamondSignal: clamp01(safeNumber(raw?.diamondSignal, mineralIndex * 0.58)),
    opalSignal: clamp01(safeNumber(raw?.opalSignal, coastlineIndex * 0.54)),
    graniteSignal: clamp01(safeNumber(raw?.graniteSignal, terrainRelief * 0.48)),
    slateSignal: clamp01(safeNumber(raw?.slateSignal, (1 - mineralIndex) * 0.32)),

    turquoise: clamp01(safeNumber(raw?.turquoise ?? raw?.visibleTurquoiseIndex, shelf ? 0.62 : ocean ? 0.2 : 0.08)),
    turquoiseIndex: clamp01(safeNumber(raw?.turquoiseIndex ?? raw?.visibleTurquoiseIndex, shelf ? 0.62 : ocean ? 0.2 : 0.08)),
    blueWaterIndex: clamp01(safeNumber(raw?.blueWaterIndex ?? raw?.abyssalBlueIndex, ocean ? 0.7 : 0)),

    deepOrganic: bool(raw?.deepOceanCandidate),
    deepOrganicPresence: clamp01(safeNumber(raw?.organicDeepOceanPresence, 0)),
    deepOceanBlend: clamp01(safeNumber(raw?.deepOceanBlend, 0)),
    deepOceanFeather: clamp01(safeNumber(raw?.deepOceanFeather, 0)),
    organicDeepOceanPresence: clamp01(safeNumber(raw?.organicDeepOceanPresence, 0)),
    hardDeepOceanRouteClassSamples: 0,
    hardDeepOceanRouteClassSuppressed: true,
    routeMayReceiveSoftDepthFieldsOnly: true,
    deepOceanIsDepthFieldNotRouteBlob: true,
    trench: false,

    runtimeDefinesLandWater: false,
    runtimeDefinesTerrain: false,
    runtimeDefinesHydration: false,
    runtimeDefinesOceans: false,
    runtimeNormalizesSweptChain: true,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function sampleSurfaceSync(input, lonArg, uArg, vArg) {
  if (downstreamModule) {
    const sampler = getSampleFunction(downstreamModule);

    if (sampler) {
      try {
        const sample = sampler(input, lonArg, uArg, vArg);
        if (sample && typeof sample === "object") return normalizeRuntimeSample(sample, lonArg, uArg, vArg);
      } catch (error) {
        downstreamImportError = String(error?.message || error || "downstream sampler failure");
        exposeRuntimeStatus({ downstreamImportError });
      }
    }
  }

  return fallbackSample(input, lonArg, uArg, vArg);
}

async function sampleSurfaceAsync(input, lonArg, uArg, vArg) {
  const module = await importDownstreamModule();
  const sampler = getSampleFunction(module);

  if (sampler) {
    try {
      const sample = sampler(input, lonArg, uArg, vArg);
      if (sample && typeof sample === "object") return normalizeRuntimeSample(sample, lonArg, uArg, vArg);
    } catch (error) {
      downstreamImportError = String(error?.message || error || "downstream sampler failure");
      exposeRuntimeStatus({ downstreamImportError });
    }
  }

  return fallbackSample(input, lonArg, uArg, vArg);
}

function computeStats() {
  if (cachedStats) return cachedStats;

  const width = 128;
  const height = 64;
  const totalSamples = width * height;

  const classCounts = {};
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
  let maxDepth = 0;
  let maxElevation = 0;
  let maxTurquoise = 0;

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = sampleSurfaceSync({ lat, lon, u, v });

      const cls = sample.visualSurfaceClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;

      if (sample.solidSurfaceLand) solidSurfaceLandSamples += 1;
      if (sample.liquidWater) liquidWaterSamples += 1;
      if (sample.exposedTerrainLand) exposedTerrainLandSamples += 1;
      if (sample.ice) iceSolidSurfaceSamples += 1;
      if (sample.fallbackSample) fallbackSamples += 1;
      if (sample.terrainRelief > 0) terrainReliefSamples += 1;
      if (sample.hydrated) hydratedSamples += 1;
      if (sample.ocean) oceanSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.coastal) coastalSamples += 1;
      if (sample.deepOrganic || sample.deepOceanCandidate) deepOrganicSamples += 1;

      maxDepth = Math.max(maxDepth, sample.depth);
      maxElevation = Math.max(maxElevation, sample.elevation);
      maxTurquoise = Math.max(maxTurquoise, sample.turquoise);
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

  cachedStats = {
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    totalSamples,
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
    beachSamples: 0,
    ridgeSamples: 0,
    mountainSamples: 0,
    canyonSamples: 0,
    cliffSamples: 0,
    basinSamples: 0,
    climateSamples: totalSamples,
    climateConduitSamples: totalSamples,
    rainfallSamples: totalSamples,
    glacierClimateSamples: iceSolidSurfaceSamples,
    oceanCycleClimateSamples: liquidWaterSamples,
    glacierSamples: iceSolidSurfaceSamples,
    snowpackSamples: iceSolidSurfaceSamples,
    riverSamples: 0,
    streamSamples: 0,
    lakeSamples: 0,
    floodplainSamples: 0,
    deltaSamples: 0,
    springSamples: 0,
    subterraneanSamples: 0,
    waterRatio: liquidWaterRatio,
    landRatio: exposedTerrainLandRatio,
    topologyLandRatio: solidSurfaceLandRatio,
    visibleLandRatio: exposedTerrainLandRatio,
    oceanRatio,
    coastalRatio,
    shelfRatio,
    deepOrganicRatio,
    targetLandRatio: 0.292,
    targetLandRatioMin: 0.27,
    targetLandRatioMax: 0.31,
    targetLiquidWaterRatio: 0.708,
    targetLiquidWaterRatioMin: 0.69,
    targetLiquidWaterRatioMax: 0.76,
    downstreamImportAttempted: STATUS.downstreamImportAttempted,
    downstreamImported: STATUS.downstreamImported,
    downstreamImportError,
    downstreamChainConsumed: STATUS.downstreamImported,
    runtimeImportSafe: true,
    fallbackAllowed: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };

  exposeRuntimeStatus({
    fallbackSamples,
    fallbackAllowed: true
  });

  return cachedStats;
}

function createRuntimeObject() {
  if (cachedRuntime) return cachedRuntime;

  importDownstreamModule();

  cachedRuntime = {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    status: STATUS,
    sampleSurface: sampleSurfaceSync,
    sampleSurfaceAsync,
    sampleAudraliaSurface: sampleSurfaceSync,
    sampleRuntimeState: sampleSurfaceSync,
    sampleAudraliaPlanetState: sampleSurfaceSync,
    getStatus,
    getStats,
    getRuntimeStats,
    getFallbackReport,
    buildRuntimeField: sampleSurfaceSync,
    importDownstreamModule
  };

  return cachedRuntime;
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

export function getRuntimeStats() {
  return computeStats();
}

export function getFallbackReport() {
  return {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    fallbackAllowed: true,
    fallbackSamples: cachedStats?.fallbackSamples ?? STATUS.fallbackSamples ?? 0,
    fallbackRatio: cachedStats?.fallbackRatio ?? 0,
    downstreamImportAttempted: STATUS.downstreamImportAttempted,
    downstreamImported: STATUS.downstreamImported,
    downstreamImportError,
    reason: STATUS.downstreamImported
      ? "downstream-chain-imported"
      : "runtime-import-safe-fallback-active-until-downstream-chain-imports"
  };
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return sampleSurfaceSync(input, lonArg, uArg, vArg);
}

export function sampleAudraliaSurface(input, lonArg, uArg, vArg) {
  return sampleSurfaceSync(input, lonArg, uArg, vArg);
}

export function sampleRuntimeState(input, lonArg, uArg, vArg) {
  return sampleSurfaceSync(input, lonArg, uArg, vArg);
}

export function sampleAudraliaPlanetState(input, lonArg, uArg, vArg) {
  return sampleSurfaceSync(input, lonArg, uArg, vArg);
}

export function buildRuntimeField(input, lonArg, uArg, vArg) {
  return sampleSurfaceSync(input, lonArg, uArg, vArg);
}

export function createAudraliaRuntime() {
  return createRuntimeObject();
}

export async function createAudraliaRuntimeAsync() {
  await importDownstreamModule();
  return createRuntimeObject();
}

export const buildRuntimeFieldRuntime = buildRuntimeField;
export const AUDRALIA_RUNTIME_STATUS = STATUS;
export const AUDRALIA_RUNTIME_RECEIPT_VALUE = AUDRALIA_RUNTIME_RECEIPT;

exposeRuntimeStatus();
importDownstreamModule();

export default createAudraliaRuntime;
