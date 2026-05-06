// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_AWAITED_DOWNSTREAM_CHAIN_CONNECTOR_TNT_v6
// Full-file replacement. Runtime authority only.
// Purpose: keep runtime import-safe while ensuring canvas/Gauges receive a resolved downstream sampler.
// Runtime consumes: topology → terrain → hydration → oceans → deep-ocean.
// Runtime does not invent land, water, terrain, hydration, or oceans.
// No GraphicBox. No image generation. No visual-pass claim.

const AUDRALIA_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_AWAITED_DOWNSTREAM_CHAIN_CONNECTOR_TNT_v6";
const DEEP_OCEAN_PATH = "/assets/audralia/audralia/hydration/deep-ocean.render.js";

const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;
const TARGET_LIQUID_WATER_RATIO = 0.708;
const TARGET_LIQUID_WATER_RATIO_MIN = 0.69;
const TARGET_LIQUID_WATER_RATIO_MAX = 0.76;

const STATUS = {
  ok: true,
  receipt: AUDRALIA_RUNTIME_RECEIPT,
  activeRenewal: "AUDRALIA_RUNTIME_AWAITED_DOWNSTREAM_CHAIN_CONNECTOR_CONTRACT_v1",
  file: "assets/audralia/audralia.runtime.js",
  role: "audralia-runtime-awaited-downstream-chain-connector",
  lineage: "tectonics→topology→terrain→hydration→oceans→deep-ocean→runtime→canvas-renderer→route",
  downstreamPath: DEEP_OCEAN_PATH,

  downstreamImportAttempted: false,
  downstreamImported: false,
  downstreamImportError: "",
  downstreamSamplerReady: false,
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
  topologyStable: true,
  terrainStable: true,
  hydrationStable: true,
  oceansStable: true,
  deepOceanStable: true,
  continuousFieldActive: true,

  fallbackAllowed: true,
  fallbackReason: "only-if-downstream-import-or-sampler-fails",
  fallbackSamples: 0,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  compatibilityReceipts: [
    "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1",
    "AUDRALIA_RUNTIME_IMPORT_SAFE_TOPOLOGY_ALIGNMENT_STABILIZER_TNT_v1",
    "AUDRALIA_RUNTIME_IMPORT_SAFE_DOWNSTREAM_CHAIN_CONNECTOR_TNT_v5",
    "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_CONTINUOUS_TERRAIN_CONDUCTION_SWEEP_TNT_v2",
    "AUDRALIA_TERRAIN_CONTINUOUS_RELIEF_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_TOPOLOGY_CONTINUOUS_LAND_VOID_BOUNDARY_SWEEP_TNT_v2",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],

  api: {
    createAudraliaRuntime: true,
    createAudraliaRuntimeAsync: true,
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

let downstreamModule = null;
let downstreamEngine = null;
let downstreamSampler = null;
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

function fallbackRawSample(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);

  const n = hash3(
    Math.round(point.x * 9),
    Math.round(point.y * 9),
    Math.round(point.z * 9)
  );

  const polarIce = Math.abs(point.y) > 0.92;
  const land = n > 0.9 && Math.abs(point.y) < 0.84;
  const shelf = n > 0.84 && n <= 0.9 && Math.abs(point.y) < 0.88;
  const water = !land && !polarIce;

  const visualSurfaceClass = polarIce
    ? "glacier_ice_snowpack_surface"
    : land
      ? "inland_terrain_land_surface"
      : shelf
        ? "shelf_water_surface"
        : "ocean_water_surface";

  return {
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
    liquidWater: water,
    water,
    ocean: water && !shelf,
    shelf,
    land,
    exposedTerrainLand: land,
    solidSurfaceLand: land || polarIce,
    ice: polarIce,
    glacier: polarIce,
    elevation: land || polarIce ? 0.34 : 0,
    terrainRelief: land || polarIce ? 0.28 : 0,
    depth: water ? 0.56 : 0,
    hydration: water ? 0.72 : 0.32,
    hydrationIndex: water ? 0.72 : 0.32,
    surfaceWaterIndex: water ? 0.72 : 0.18,
    coastlineIndex: shelf ? 0.7 : 0,
    turquoise: shelf ? 0.68 : water ? 0.2 : 0.08,
    fallback: true,
    fallbackSample: true
  };
}

function selectSampler(module, engine) {
  const candidates = [
    engine?.sampleDeepOcean,
    engine?.sampleDeepOceanField,
    engine?.sampleSurface,
    engine?.buildDeepOceanField,
    module?.sampleDeepOcean,
    module?.sampleDeepOceanField,
    module?.sampleSurface,
    module?.buildDeepOceanField
  ];

  return candidates.find((candidate) => typeof candidate === "function") || null;
}

async function initializeDownstream() {
  STATUS.downstreamImportAttempted = true;
  exposeRuntimeStatus();

  try {
    downstreamModule = await import(`${DEEP_OCEAN_PATH}?runtime=${AUDRALIA_RUNTIME_RECEIPT}`);

    if (typeof downstreamModule.createAudraliaDeepOcean === "function") {
      try {
        downstreamEngine = await downstreamModule.createAudraliaDeepOcean();
      } catch (_) {
        downstreamEngine = null;
      }
    }

    if (!downstreamEngine && typeof downstreamModule.default === "function") {
      try {
        downstreamEngine = await downstreamModule.default();
      } catch (_) {
        downstreamEngine = null;
      }
    }

    downstreamSampler = selectSampler(downstreamModule, downstreamEngine);

    if (!downstreamSampler) {
      throw new Error("deep-ocean module imported, but no compatible sampler export was found");
    }

    downstreamImportError = "";

    exposeRuntimeStatus({
      downstreamImported: true,
      downstreamSamplerReady: true,
      downstreamImportError: "",
      downstreamChainConsumed: true,
      fallbackAllowed: false,
      fallbackReason: "downstream-chain-ready"
    });

    return true;
  } catch (error) {
    downstreamModule = null;
    downstreamEngine = null;
    downstreamSampler = null;
    downstreamImportError = String(error?.message || error || "unknown downstream import failure");

    exposeRuntimeStatus({
      downstreamImported: false,
      downstreamSamplerReady: false,
      downstreamImportError,
      downstreamChainConsumed: false,
      fallbackAllowed: true,
      fallbackReason: "downstream-import-or-sampler-failed"
    });

    return false;
  }
}

await initializeDownstream();

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
    source: "audralia-runtime-awaited-downstream-chain-connector",
    downstream: raw,
    downstreamReceipt: raw?.receipt || "",
    downstreamChainConsumed: Boolean(STATUS.downstreamChainConsumed),

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
    fallbackAllowed: Boolean(!STATUS.downstreamSamplerReady),

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

function callDownstreamSampler(input, lonArg, uArg, vArg) {
  if (!downstreamSampler) {
    return normalizeRuntimeSample(fallbackRawSample(input, lonArg, uArg, vArg), lonArg, uArg, vArg);
  }

  try {
    const result = downstreamSampler.call(
      downstreamEngine || downstreamModule,
      input,
      lonArg,
      uArg,
      vArg
    );

    if (result && typeof result === "object") {
      return normalizeRuntimeSample(result, lonArg, uArg, vArg);
    }
  } catch (error) {
    downstreamImportError = String(error?.message || error || "downstream sampler failure");
    exposeRuntimeStatus({
      downstreamImportError,
      downstreamChainConsumed: false,
      fallbackAllowed: true,
      fallbackReason: "downstream-sampler-threw"
    });
  }

  return normalizeRuntimeSample(fallbackRawSample(input, lonArg, uArg, vArg), lonArg, uArg, vArg);
}

function computeStats() {
  if (cachedStats) return cachedStats;

  const width = 192;
  const height = 96;
  const totalSamples = width * height;

  const classCounts = {};
  const rowDominance = [];

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
  let hardDeepOceanRouteClassSamples = 0;
  let trenchSamples = 0;
  let beachSamples = 0;
  let ridgeSamples = 0;
  let mountainSamples = 0;
  let cliffSamples = 0;
  let basinSamples = 0;
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
  let maxRawDepth = 0;
  let maxDeepOceanBlend = 0;
  let maxDeepOceanFeather = 0;
  let maxOrganicDeepOceanPresence = 0;
  let maxElevation = 0;
  let maxHydrationActivationIndex = 0;
  let maxSurfaceWaterIndex = 0;
  let maxHydrationConduction = 0;
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
      const sample = callDownstreamSampler({ lat, lon, u, v });

      const cls = sample.visualSurfaceClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

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
      if (!sample.hardDeepOceanRouteClassSuppressed) hardDeepOceanRouteClassSamples += 1;
      if (sample.trench) trenchSamples += 1;
      if (sample.beach) beachSamples += 1;
      if (cls.includes("ridge") || safeNumber(sample.ridgeIndex, 0) > 0.46) ridgeSamples += 1;
      if (cls.includes("mountain") || safeNumber(sample.mountainIndex, 0) > 0.52) mountainSamples += 1;
      if (cls.includes("cliff") || safeNumber(sample.coastalCliffIndex, 0) > 0.42) cliffSamples += 1;
      if (cls.includes("basin") || safeNumber(sample.basinIndex, 0) > 0.56) basinSamples += 1;
      if (sample.glacier || sample.ice) glacierSamples += 1;
      if (sample.river) riverSamples += 1;
      if (sample.stream) streamSamples += 1;
      if (sample.lake) lakeSamples += 1;
      if (sample.floodplain) floodplainSamples += 1;
      if (sample.delta) deltaSamples += 1;
      if (sample.spring) springSamples += 1;
      if (sample.subterranean) subterraneanSamples += 1;

      maxTurquoise = Math.max(maxTurquoise, sample.turquoise);
      maxDepth = Math.max(maxDepth, sample.depth);
      maxRawDepth = Math.max(maxRawDepth, safeNumber(sample.rawDepth, sample.depth));
      maxDeepOceanBlend = Math.max(maxDeepOceanBlend, safeNumber(sample.deepOceanBlend, 0));
      maxDeepOceanFeather = Math.max(maxDeepOceanFeather, safeNumber(sample.deepOceanFeather, 0));
      maxOrganicDeepOceanPresence = Math.max(maxOrganicDeepOceanPresence, safeNumber(sample.organicDeepOceanPresence, 0));
      maxElevation = Math.max(maxElevation, sample.elevation);
      maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, sample.hydrationIndex);
      maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, sample.surfaceWaterIndex);
      maxHydrationConduction = Math.max(maxHydrationConduction, sample.hydrationIndex);
      maxRainfall = Math.max(maxRainfall, sample.rainfall);
      maxEvaporation = Math.max(maxEvaporation, sample.evaporation);
      maxRidge = Math.max(maxRidge, safeNumber(sample.ridgeIndex, 0));
      maxMountain = Math.max(maxMountain, safeNumber(sample.mountainIndex, sample.elevation));
      maxCliff = Math.max(maxCliff, safeNumber(sample.coastalCliffIndex ?? sample.coastlineIndex, 0));
    }

    rowDominance.push(Math.max(...Object.values(rowCounts)) / width);
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
  const hardDeepOceanRouteClassRatio = hardDeepOceanRouteClassSamples / totalSamples;
  const trenchRatio = trenchSamples / totalSamples;
  const beachRatio = beachSamples / totalSamples;
  const ridgeRatio = ridgeSamples / totalSamples;
  const mountainRatio = mountainSamples / totalSamples;
  const cliffRatio = cliffSamples / totalSamples;
  const basinRatio = basinSamples / totalSamples;
  const glacierRatio = glacierSamples / totalSamples;
  const riverRatio = riverSamples / totalSamples;
  const streamRatio = streamSamples / totalSamples;
  const lakeRatio = lakeSamples / totalSamples;
  const floodplainRatio = floodplainSamples / totalSamples;
  const deltaRatio = deltaSamples / totalSamples;
  const springRatio = springSamples / totalSamples;
  const subterraneanRatio = subterraneanSamples / totalSamples;

  const maxDominantRowRatio = Math.max(...rowDominance);
  const averageRowDominance = rowDominance.reduce((sum, value) => sum + value, 0) / rowDominance.length;

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
    hardDeepOceanRouteClassSamples,
    trenchSamples,
    beachSamples,
    ridgeSamples,
    mountainSamples,
    canyonSamples: 0,
    cliffSamples,
    basinSamples,
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

    maxRawDepth,
    maxDeepOceanBlend,
    maxDeepOceanFeather,
    maxOrganicDeepOceanPresence,
    maxHydrationActivationIndex,
    maxSurfaceWaterIndex,
    maxHydrationConduction,
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
    hardDeepOceanRouteClassRatio,
    trenchRatio,
    beachRatio,
    ridgeRatio,
    mountainRatio,
    canyonRatio: 0,
    cliffRatio,
    basinRatio,
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

    landRatioTargetMet: exposedTerrainLandRatio >= 0.16 && exposedTerrainLandRatio <= 0.24,
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
    averageRowDominance,
    rowBandingSuppressed: averageRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,

    downstreamImportAttempted: STATUS.downstreamImportAttempted,
    downstreamImported: STATUS.downstreamImported,
    downstreamSamplerReady: STATUS.downstreamSamplerReady,
    downstreamImportError,
    downstreamChainConsumed: STATUS.downstreamChainConsumed,

    oceansStatusReceipt: "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2",
    deepOceanChildReceipt: "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2",
    deepOceanChildLoaded: STATUS.downstreamImported,
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

    ecologyEnabled: false,
    foliageEnabled: false,
    treesEnabled: false,
    vegetationEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    solidSurfaceAccounting: "swept-downstream-chain solidSurfaceLand"
  };

  exposeRuntimeStatus({
    fallbackSamples,
    fallbackAllowed: fallbackSamples > 0,
    fallbackReason: fallbackSamples > 0 ? "fallback-samples-observed" : "downstream-chain-ready"
  });

  return cachedStats;
}

function createRuntimeObject() {
  if (cachedRuntime) return cachedRuntime;

  cachedRuntime = {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    status: STATUS,
    sampleSurface: callDownstreamSampler,
    sampleAudraliaSurface: callDownstreamSampler,
    sampleRuntimeState: callDownstreamSampler,
    sampleAudraliaPlanetState: callDownstreamSampler,
    getStatus,
    getStats,
    getRuntimeStats,
    getFallbackReport,
    buildRuntimeField: callDownstreamSampler
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
  const stats = cachedStats || computeStats();

  return {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    fallbackAllowed: stats.fallbackSamples > 0,
    fallbackSamples: stats.fallbackSamples,
    fallbackRatio: stats.fallbackRatio,
    downstreamImportAttempted: STATUS.downstreamImportAttempted,
    downstreamImported: STATUS.downstreamImported,
    downstreamSamplerReady: STATUS.downstreamSamplerReady,
    downstreamImportError,
    reason: stats.fallbackSamples > 0
      ? "fallback-samples-observed"
      : "downstream-chain-ready"
  };
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return callDownstreamSampler(input, lonArg, uArg, vArg);
}

export function sampleAudraliaSurface(input, lonArg, uArg, vArg) {
  return callDownstreamSampler(input, lonArg, uArg, vArg);
}

export function sampleRuntimeState(input, lonArg, uArg, vArg) {
  return callDownstreamSampler(input, lonArg, uArg, vArg);
}

export function sampleAudraliaPlanetState(input, lonArg, uArg, vArg) {
  return callDownstreamSampler(input, lonArg, uArg, vArg);
}

export function buildRuntimeField(input, lonArg, uArg, vArg) {
  return callDownstreamSampler(input, lonArg, uArg, vArg);
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

exposeRuntimeStatus();

export default createAudraliaRuntime;
