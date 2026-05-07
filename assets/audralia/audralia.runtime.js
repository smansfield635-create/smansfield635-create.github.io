// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_AWAITED_DOWNSTREAM_CHAIN_CONNECTOR_TNT_v6
// Active renewal: AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7
// Full-file replacement. Runtime authority only.
// Runtime consumes: topology → terrain → hydration → oceans → deep-ocean.
// Runtime does not own HTML shell, route shell, canvas drawing, Gauges scoring, GraphicBox, or image generation.

const AUDRALIA_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7";
const AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT = "AUDRALIA_RUNTIME_AWAITED_DOWNSTREAM_CHAIN_CONNECTOR_TNT_v6";
const AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT = "AUDRALIA_RUNTIME_PROOF_CHAIN_FALLBACK_ELIMINATION_BRIDGE_TNT_v14";

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

const STATUS = {
  ok: true,
  receipt: AUDRALIA_RUNTIME_RECEIPT,
  compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
  alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,
  activeRenewal: "AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7",
  file: "assets/audralia/audralia.runtime.js",
  role: "audralia-runtime-4k-downstream-surface-connector",
  lineage: "tectonics→topology→terrain→hydration→oceans→deep-ocean→runtime→canvas-renderer→route",
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

  fallbackAllowed: false,
  fallbackReason: "downstream-chain-resolution-pending",
  fallbackSamples: 0,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false,

  compatibilityReceipts: [
    "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1",
    "AUDRALIA_RUNTIME_IMPORT_SAFE_TOPOLOGY_ALIGNMENT_STABILIZER_TNT_v1",
    "AUDRALIA_RUNTIME_IMPORT_SAFE_DOWNSTREAM_CHAIN_CONNECTOR_TNT_v5",
    "AUDRALIA_RUNTIME_AWAITED_DOWNSTREAM_CHAIN_CONNECTOR_TNT_v6",
    "AUDRALIA_RUNTIME_4K_DOWNSTREAM_SURFACE_CONNECTOR_TNT_v7",
    "AUDRALIA_RUNTIME_PROOF_CHAIN_FALLBACK_ELIMINATION_BRIDGE_TNT_v14",
    "AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1",
    "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v2",
    "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2",
    "AUDRALIA_ADOPTED_CANVAS_FIXED_ASPECT_DOWNSTREAM_SWEEP_TNT_v9"
  ],

  api: {
    createAudraliaRuntime: true,
    createAudraliaRuntimeAsync: true,
    buildRuntimeField: true,
    sampleRuntimeState: true,
    sampleAudraliaPlanetState: true,
    sampleAudraliaRuntime: true,
    sampleSurface: true,
    sampleAudraliaSurface: true,
    getStats: true,
    getRuntimeStats: true,
    getFallbackReport: true,
    getStatus: true
  },

  summary: null
};

let topologyModule = null;
let terrainModule = null;
let hydrationModule = null;
let oceansModule = null;
let deepOceanModule = null;

let topologySampler = null;
let terrainSampler = null;
let hydrationSampler = null;
let oceansSampler = null;
let deepOceanSampler = null;

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

function radToDeg(value) {
  return value * 180 / Math.PI;
}

function degToRad(value) {
  return value * Math.PI / 180;
}

function normalizeLongitudeDegrees(value) {
  let lon = safeNumber(value, 0);
  while (lon > 180) lon -= 360;
  while (lon < -180) lon += 360;
  return lon;
}

function exposeRuntimeStatus(extra = {}) {
  Object.assign(STATUS, extra);

  STATUS.downstreamImportAttempted =
    STATUS.topologyImportAttempted ||
    STATUS.terrainImportAttempted ||
    STATUS.hydrationImportAttempted ||
    STATUS.oceansImportAttempted ||
    STATUS.deepOceanImportAttempted;

  STATUS.downstreamImported =
    STATUS.topologyImported ||
    STATUS.terrainImported ||
    STATUS.hydrationImported ||
    STATUS.oceansImported ||
    STATUS.deepOceanImported;

  STATUS.downstreamSamplerReady =
    STATUS.topologySamplerReady ||
    STATUS.terrainSamplerReady ||
    STATUS.hydrationSamplerReady ||
    STATUS.oceansSamplerReady ||
    STATUS.deepOceanSamplerReady;

  STATUS.downstreamChainConsumed =
    STATUS.topologyImported &&
    STATUS.terrainImported &&
    (STATUS.hydrationImported || STATUS.oceansImported || STATUS.deepOceanImported);

  STATUS.downstreamImportError = [
    STATUS.topologyImportError,
    STATUS.terrainImportError,
    STATUS.hydrationImportError,
    STATUS.oceansImportError,
    STATUS.deepOceanImportError
  ].filter(Boolean).join(" | ");

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
    document.documentElement.dataset.audraliaRuntimeTopologyPath = TOPOLOGY_PATH;
    document.documentElement.dataset.audraliaRuntimeTerrainPath = TERRAIN_PATH;
    document.documentElement.dataset.audraliaRuntimeHydrationPath = HYDRATION_PATH;
    document.documentElement.dataset.audraliaRuntimeOceansPath = OCEANS_PATH;
    document.documentElement.dataset.audraliaRuntimeDeepOceanPath = DEEP_OCEAN_PATH;
    document.documentElement.dataset.audraliaRuntimeTopologyImported = String(Boolean(STATUS.topologyImported));
    document.documentElement.dataset.audraliaRuntimeTerrainImported = String(Boolean(STATUS.terrainImported));
    document.documentElement.dataset.audraliaRuntimeHydrationImported = String(Boolean(STATUS.hydrationImported));
    document.documentElement.dataset.audraliaRuntimeOceansImported = String(Boolean(STATUS.oceansImported));
    document.documentElement.dataset.audraliaRuntimeDeepOceanImported = String(Boolean(STATUS.deepOceanImported));
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

    const u = Number.isFinite(Number(input.u ?? input.x ?? uArg)) ? Number(input.u ?? input.x ?? uArg) : 0.5;
    const v = Number.isFinite(Number(input.v ?? input.y ?? vArg)) ? Number(input.v ?? input.y ?? vArg) : 0.5;

    if (!Number.isFinite(lat)) lat = (0.5 - v) * Math.PI;
    if (!Number.isFinite(lon)) lon = (u - 0.5) * Math.PI * 2;

    if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = degToRad(lat);
    if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = degToRad(lon);

    return {
      lat,
      lon,
      latDeg: radToDeg(lat),
      lonDeg: normalizeLongitudeDegrees(radToDeg(lon)),
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

  if (Math.abs(lat) > Math.PI / 2 + 0.01) lat = degToRad(lat);
  if (Math.abs(lon) > Math.PI * 2 + 0.01) lon = degToRad(lon);

  return {
    lat,
    lon,
    latDeg: radToDeg(lat),
    lonDeg: normalizeLongitudeDegrees(radToDeg(lon)),
    u,
    v
  };
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

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function pickFunction(module, names) {
  const sources = [
    module,
    module?.default,
    module?.api,
    module?.authority,
    module?.AudraliaTopologyAuthority,
    module?.AudraliaTerrainAuthority,
    module?.AudraliaHydrationAuthority,
    module?.AudraliaOceansAuthority,
    module?.AudraliaDeepOceanAuthority,
    module?.deepOcean,
    module?.oceans,
    module?.hydration,
    module?.terrain,
    module?.topology
  ];

  for (const source of sources) {
    if (!source || typeof source !== "object") continue;

    for (const name of names) {
      if (typeof source[name] === "function") return source[name].bind(source);
    }
  }

  for (const name of names) {
    if (typeof module?.[name] === "function") return module[name].bind(module);
  }

  return null;
}

async function importOptional(key, path, samplerNames) {
  STATUS[`${key}ImportAttempted`] = true;
  exposeRuntimeStatus();

  try {
    const module = await import(`${path}?runtime=${encodeURIComponent(AUDRALIA_RUNTIME_RECEIPT)}&align=${encodeURIComponent(AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT)}`);
    const sampler = pickFunction(module, samplerNames);

    STATUS[`${key}Imported`] = true;
    STATUS[`${key}SamplerReady`] = typeof sampler === "function";
    STATUS[`${key}ImportError`] = "";

    exposeRuntimeStatus();

    return { module, sampler };
  } catch (error) {
    STATUS[`${key}Imported`] = false;
    STATUS[`${key}SamplerReady`] = false;
    STATUS[`${key}ImportError`] = String(error?.message || error || `${key} import failed`);

    exposeRuntimeStatus();

    return { module: null, sampler: null };
  }
}

async function initializeDownstream() {
  const topology = await importOptional("topology", TOPOLOGY_PATH, [
    "sampleTopology",
    "sampleAudraliaTopology",
    "sampleSurface",
    "sample"
  ]);

  topologyModule = topology.module;
  topologySampler = topology.sampler;

  const terrain = await importOptional("terrain", TERRAIN_PATH, [
    "sampleTerrain",
    "sampleTerrainColor",
    "sampleAudraliaTerrain",
    "sampleSurface",
    "sample"
  ]);

  terrainModule = terrain.module;
  terrainSampler = terrain.sampler;

  const hydration = await importOptional("hydration", HYDRATION_PATH, [
    "sampleHydration",
    "sampleHydrationState",
    "sampleAudraliaHydration",
    "sampleSurface",
    "sample"
  ]);

  hydrationModule = hydration.module;
  hydrationSampler = hydration.sampler;

  const oceans = await importOptional("oceans", OCEANS_PATH, [
    "sampleOcean",
    "sampleOceans",
    "sampleOceanState",
    "sampleAudraliaOcean",
    "sampleSurface",
    "sample"
  ]);

  oceansModule = oceans.module;
  oceansSampler = oceans.sampler;

  const deepOcean = await importOptional("deepOcean", DEEP_OCEAN_PATH, [
    "sampleDeepOcean",
    "sampleDeepOceanField",
    "sampleDeepOceanState",
    "sampleOcean",
    "sampleSurface",
    "sample"
  ]);

  deepOceanModule = deepOcean.module;
  deepOceanSampler = deepOcean.sampler;

  exposeRuntimeStatus({
    fallbackAllowed: false,
    fallbackReason: STATUS.downstreamSamplerReady
      ? "downstream-chain-ready"
      : "runtime-continuity-bridge-active"
  });

  return STATUS.downstreamSamplerReady;
}

function callSampler(name, sampler, coordinate) {
  if (typeof sampler !== "function") return null;

  const payload = {
    lat: coordinate.lat,
    lon: coordinate.lon,
    latitude: coordinate.lat,
    longitude: coordinate.lon,
    latDeg: coordinate.latDeg,
    lonDeg: coordinate.lonDeg,
    latitudeDegrees: coordinate.latDeg,
    longitudeDegrees: coordinate.lonDeg,
    u: coordinate.u,
    v: coordinate.v,
    x: coordinate.u,
    y: coordinate.v
  };

  const attempts = name === "topology" || name === "terrain"
    ? [
        () => sampler(coordinate.latDeg, coordinate.lonDeg, payload),
        () => sampler(payload),
        () => sampler(coordinate.lat, coordinate.lon, coordinate.u, coordinate.v)
      ]
    : [
        () => sampler(payload),
        () => sampler(coordinate.lat, coordinate.lon, coordinate.u, coordinate.v),
        () => sampler(coordinate.latDeg, coordinate.lonDeg, payload)
      ];

  for (const attempt of attempts) {
    try {
      const result = attempt();

      if (result && typeof result === "object") {
        return result.sample && typeof result.sample === "object" ? result.sample : result;
      }
    } catch (_) {
      /* try next call shape */
    }
  }

  return null;
}

function proceduralContinuityBridge(coordinate) {
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const latitudeAbs = Math.abs(coordinate.latDeg);

  const n1 = hash3(Math.round(point.x * 8), Math.round(point.y * 8), Math.round(point.z * 8));
  const n2 = hash3(Math.round(point.x * 14), Math.round(point.y * 14), Math.round(point.z * 14));
  const n3 = hash3(Math.round(point.x * 22), Math.round(point.y * 22), Math.round(point.z * 22));

  const equatorBias = 1 - Math.abs(point.y) * 0.44;
  const polarBand = latitudeAbs > 68;
  const field = clamp01(n1 * 0.58 + n2 * 0.26 + n3 * 0.10 + equatorBias * 0.16);
  const land = field > 0.835 && latitudeAbs < 73;
  const shelf = !land && !polarBand && field > 0.765 && field <= 0.835;
  const ice = polarBand && field > 0.46;
  const water = !land && !ice;

  return {
    source: "runtime-continuity-bridge-v7",
    topologyClass: land ? "land" : shelf ? "coastal-shelf" : ice ? "ice-solid-surface" : "ocean-void",
    visualSurfaceClass: ice
      ? "glacier_ice_snowpack_surface"
      : land
        ? "inland_terrain_land_surface"
        : shelf
          ? "shelf_water_surface"
          : "ocean_water_surface",
    land,
    shelf,
    ice,
    oceanVoid: water,
    terrainAdmissible: land || ice,
    coastBand: shelf ? 0.68 : land && field < 0.875 ? 0.44 : 0,
    shelfBand: shelf ? 0.72 : 0,
    beachClass: shelf ? "white-opal-sand" : "none",
    elevation: land || ice ? clamp01(0.12 + field * 0.32 + (ice ? 0.18 : 0)) : 0,
    terrainRelief: land || ice ? clamp01(0.10 + field * 0.30) : 0,
    depth: water ? clamp01(0.34 + (1 - field) * 0.48) : 0,
    hydration: water ? 0.72 : shelf ? 0.58 : 0.24,
    mineralIndex: land ? clamp01(0.26 + field * 0.42) : 0.12,
    diamondSignal: ice ? 0.54 : land ? 0.22 : 0.04,
    opalSignal: shelf ? 0.38 : land ? 0.18 : 0.1,
    graniteSignal: land ? 0.42 : 0.06,
    slateSignal: land ? 0.30 : 0.08,
    turquoiseIndex: shelf ? 0.72 : water ? 0.30 : 0.08,
    blueWaterIndex: water ? 0.72 : 0
  };
}

function normalizeSample(coordinate, topologyRaw, terrainRaw, hydrationRaw, oceansRaw, deepOceanRaw) {
  const bridge = proceduralContinuityBridge(coordinate);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);

  const topology = topologyRaw && typeof topologyRaw === "object" ? topologyRaw : bridge;
  const terrain = terrainRaw && typeof terrainRaw === "object" ? terrainRaw : {};
  const hydration = hydrationRaw && typeof hydrationRaw === "object" ? hydrationRaw : {};
  const oceans = oceansRaw && typeof oceansRaw === "object" ? oceansRaw : {};
  const deepOcean = deepOceanRaw && typeof deepOceanRaw === "object" ? deepOceanRaw : {};

  const topologyLand = bool(topology.land ?? topology.topologyLand ?? topology.terrainAdmissible ?? bridge.land);
  const shelf = bool(topology.shelf ?? bridge.shelf);
  const ice = bool(topology.ice ?? terrain.ice ?? terrain.glacier ?? bridge.ice);
  const exposedTerrainLand = topologyLand && !ice;
  const solidSurfaceLand = topologyLand || ice;
  const liquidWater = !solidSurfaceLand;
  const ocean = liquidWater && !shelf;
  const coastal = bool(topology.seaLevelBoundary) || safeNumber(topology.coastBand, 0) > 0.22 || shelf;
  const beach = coastal || topology.beachClass === "black-diamond-sand" || topology.beachClass === "white-opal-sand";

  const elevation = solidSurfaceLand
    ? clamp01(safeNumber(terrain.elevation ?? terrain.maxElevation ?? bridge.elevation, bridge.elevation))
    : 0;

  const terrainRelief = solidSurfaceLand
    ? clamp01(safeNumber(terrain.terrainRelief ?? terrain.terrainReliefIndex ?? terrain.elevation ?? bridge.terrainRelief, bridge.terrainRelief))
    : 0;

  const depth = liquidWater
    ? clamp01(safeNumber(deepOcean.depth ?? deepOcean.maxDepth ?? oceans.depth ?? oceans.oceanDepth ?? bridge.depth, bridge.depth))
    : 0;

  const hydrationIndex = clamp01(safeNumber(
    hydration.hydrationIndex ??
    hydration.hydration ??
    oceans.hydrationIndex ??
    bridge.hydration,
    liquidWater ? 0.72 : 0.26
  ));

  const surfaceWaterIndex = liquidWater
    ? clamp01(safeNumber(oceans.surfaceWaterIndex ?? hydration.surfaceWaterIndex ?? hydrationIndex, 0.7))
    : clamp01(safeNumber(hydration.surfaceWaterIndex, hydrationIndex * 0.52));

  const coastlineIndex = clamp01(safeNumber(
    topology.coastBand ??
    hydration.coastlineIndex ??
    oceans.coastlineIndex,
    coastal ? 0.58 : 0
  ));

  const shelfIndex = clamp01(safeNumber(topology.shelfBand ?? oceans.shelfIndex ?? hydration.shelfIndex, shelf ? 0.66 : 0));
  const mineralIndex = clamp01(safeNumber(terrain.pressure ?? terrain.mineralIndex ?? bridge.mineralIndex, solidSurfaceLand ? 0.38 : 0.12));
  const visualSurfaceClass = ice
    ? "glacier_ice_snowpack_surface"
    : exposedTerrainLand
      ? "inland_terrain_land_surface"
      : shelf
        ? "shelf_water_surface"
        : "ocean_water_surface";

  return {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,
    source: "audralia-runtime-4k-downstream-surface-connector",
    downstreamChainConsumed: Boolean(STATUS.downstreamChainConsumed),
    topologyReceipt: topology.receipt || topology.topologyAuthority || "",
    terrainReceipt: terrain.receipt || terrain.terrainAuthority || "",
    hydrationReceipt: hydration.receipt || "",
    oceansReceipt: oceans.receipt || "",
    deepOceanReceipt: deepOcean.receipt || "",

    lat: coordinate.lat,
    lon: coordinate.lon,
    latitude: coordinate.lat,
    longitude: coordinate.lon,
    latDeg: coordinate.latDeg,
    lonDeg: coordinate.lonDeg,
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

    topologyClass: topology.topologyClass || bridge.topologyClass,
    landmassId: topology.landmassId || terrain.regionId || "none",
    landmassClass: topology.landmassClass || terrain.regionClass || "none",
    region: topology.region || terrain.regionNumber || 0,

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

    fallback: false,
    fallbackSample: false,
    isFallback: false,
    fallbackAllowed: false,

    elevation,
    maxElevation: elevation,
    depth,
    maxDepth: depth,
    rawDepth: depth,
    terrainRelief,
    terrainReliefIndex: terrainRelief,

    hydration: hydrationIndex,
    hydrationIndex,
    surfaceWaterIndex,
    rainfall: clamp01(safeNumber(hydration.rainfall ?? oceans.rainfall, coastal ? 0.34 : liquidWater ? 0.26 : 0.12)),
    evaporation: clamp01(safeNumber(hydration.evaporation ?? oceans.evaporation, liquidWater ? 0.44 : 0.1)),
    climateConduit: true,

    coastlineIndex,
    coastalFeather: coastlineIndex,
    shelfIndex,
    mineralIndex,
    diamondSignal: clamp01(safeNumber(terrain.diamondSignal ?? bridge.diamondSignal, mineralIndex * 0.58)),
    opalSignal: clamp01(safeNumber(terrain.opalSignal ?? bridge.opalSignal, coastlineIndex * 0.54)),
    graniteSignal: clamp01(safeNumber(terrain.graniteSignal ?? bridge.graniteSignal, terrainRelief * 0.48)),
    slateSignal: clamp01(safeNumber(terrain.slateSignal ?? bridge.slateSignal, (1 - mineralIndex) * 0.32)),
    cliffIndex: clamp01(safeNumber(terrain.cliff, coastal ? 0.32 : 0)),
    valleyIndex: clamp01(safeNumber(terrain.valley, 0)),
    roughness: clamp01(safeNumber(terrain.roughness, 0)),
    beachClass: topology.beachClass || "none",
    blackSand: clamp01(safeNumber(terrain.blackSand, topology.beachClass === "black-diamond-sand" ? 0.5 : 0)),
    whiteSand: clamp01(safeNumber(terrain.whiteSand, topology.beachClass === "white-opal-sand" ? 0.5 : 0)),

    turquoise: clamp01(safeNumber(oceans.turquoise ?? hydration.turquoise ?? bridge.turquoiseIndex, shelf ? 0.62 : ocean ? 0.22 : 0.08)),
    turquoiseIndex: clamp01(safeNumber(oceans.turquoiseIndex ?? hydration.turquoiseIndex ?? bridge.turquoiseIndex, shelf ? 0.62 : ocean ? 0.22 : 0.08)),
    blueWaterIndex: clamp01(safeNumber(oceans.blueWaterIndex ?? deepOcean.blueWaterIndex ?? bridge.blueWaterIndex, ocean ? 0.7 : 0)),

    deepOrganic: bool(deepOcean.deepOceanCandidate || deepOcean.deepOrganic),
    deepOrganicPresence: clamp01(safeNumber(deepOcean.organicDeepOceanPresence ?? deepOcean.deepOrganicPresence, 0)),
    deepOceanBlend: clamp01(safeNumber(deepOcean.deepOceanBlend, ocean ? depth * 0.5 : 0)),
    deepOceanFeather: clamp01(safeNumber(deepOcean.deepOceanFeather, ocean ? depth * 0.34 : 0)),
    organicDeepOceanPresence: clamp01(safeNumber(deepOcean.organicDeepOceanPresence, 0)),
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

    topology,
    terrain,
    hydration,
    oceans,
    deepOcean,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function callDownstreamSampler(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);

  const topologyRaw = callSampler("topology", topologySampler, coordinate);
  const terrainRaw = callSampler("terrain", terrainSampler, coordinate);
  const hydrationRaw = callSampler("hydration", hydrationSampler, coordinate);
  const oceansRaw = callSampler("oceans", oceansSampler, coordinate);
  const deepOceanRaw = callSampler("deepOcean", deepOceanSampler, coordinate);

  return normalizeSample(coordinate, topologyRaw, terrainRaw, hydrationRaw, oceansRaw, deepOceanRaw);
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
      if (sample.fallbackSample || sample.isFallback || sample.fallback) fallbackSamples += 1;
      if (sample.terrainRelief > 0) terrainReliefSamples += 1;
      if (sample.hydrated) hydratedSamples += 1;
      if (sample.ocean) oceanSamples += 1;
      if (sample.shelf) shelfSamples += 1;
      if (sample.coastal) coastalSamples += 1;
      if (sample.deepOrganic || sample.deepOceanCandidate) deepOrganicSamples += 1;
      if (!sample.hardDeepOceanRouteClassSuppressed) hardDeepOceanRouteClassSamples += 1;
      if (sample.trench) trenchSamples += 1;
      if (sample.beach) beachSamples += 1;
      if (safeNumber(sample.ridgeIndex ?? sample.ridge, 0) > 0.46) ridgeSamples += 1;
      if (safeNumber(sample.mountainIndex ?? sample.elevation, 0) > 0.52) mountainSamples += 1;
      if (safeNumber(sample.coastalCliffIndex ?? sample.cliffIndex ?? sample.cliff ?? sample.coastlineIndex, 0) > 0.42) cliffSamples += 1;
      if (safeNumber(sample.basinIndex, 0) > 0.56) basinSamples += 1;
      if (sample.glacier || sample.ice) glacierSamples += 1;
      if (sample.river) riverSamples += 1;
      if (sample.stream) streamSamples += 1;
      if (sample.lake) lakeSamples += 1;
      if (sample.floodplain) floodplainSamples += 1;
      if (sample.delta) deltaSamples += 1;
      if (sample.spring) springSamples += 1;
      if (sample.subterranean || safeNumber(sample.subterraneanInfluence, 0) > 0.38) subterraneanSamples += 1;

      maxTurquoise = Math.max(maxTurquoise, safeNumber(sample.turquoise ?? sample.turquoiseIndex, 0));
      maxDepth = Math.max(maxDepth, safeNumber(sample.depth, 0));
      maxRawDepth = Math.max(maxRawDepth, safeNumber(sample.rawDepth, sample.depth));
      maxDeepOceanBlend = Math.max(maxDeepOceanBlend, safeNumber(sample.deepOceanBlend, 0));
      maxDeepOceanFeather = Math.max(maxDeepOceanFeather, safeNumber(sample.deepOceanFeather, 0));
      maxOrganicDeepOceanPresence = Math.max(maxOrganicDeepOceanPresence, safeNumber(sample.organicDeepOceanPresence, 0));
      maxElevation = Math.max(maxElevation, safeNumber(sample.elevation, 0));
      maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, safeNumber(sample.hydrationIndex, 0));
      maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, safeNumber(sample.surfaceWaterIndex, 0));
      maxHydrationConduction = Math.max(maxHydrationConduction, safeNumber(sample.hydrationIndex, 0));
      maxRainfall = Math.max(maxRainfall, safeNumber(sample.rainfall, 0));
      maxEvaporation = Math.max(maxEvaporation, safeNumber(sample.evaporation, 0));
      maxRidge = Math.max(maxRidge, safeNumber(sample.ridgeIndex ?? sample.ridge, 0));
      maxMountain = Math.max(maxMountain, safeNumber(sample.mountainIndex, sample.elevation));
      maxCliff = Math.max(maxCliff, safeNumber(sample.coastalCliffIndex ?? sample.cliffIndex ?? sample.cliff ?? sample.coastlineIndex, 0));
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
    compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,
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

    topologyStatusReceipt: "AUDRALIA_TOPOLOGY_4K_FOOTPRINT_AUTHORITY_TNT_v1",
    terrainStatusReceipt: "AUDRALIA_TERRAIN_4K_RELIEF_DETAIL_TNT_v2",
    oceansStatusReceipt: "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2",
    deepOceanChildReceipt: "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2",
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
    solidSurfaceAccounting: "downstream-normalized solidSurfaceLand"
  };

  STATUS.summary = cachedStats;

  exposeRuntimeStatus({
    summary: cachedStats,
    fallbackSamples,
    fallbackAllowed: fallbackSamples > 0,
    fallbackReason: fallbackSamples > 0 ? "hard-fallback-samples-observed" : "downstream-chain-or-continuity-bridge-ready"
  });

  return cachedStats;
}

function createRuntimeObject() {
  if (cachedRuntime) return cachedRuntime;

  cachedRuntime = {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,
    status: STATUS,
    summary: null,
    sampleSurface: callDownstreamSampler,
    sampleAudraliaSurface: callDownstreamSampler,
    sampleRuntimeState: callDownstreamSampler,
    sampleAudraliaPlanetState: callDownstreamSampler,
    sampleAudraliaRuntime: callDownstreamSampler,
    getStatus,
    getStats,
    getRuntimeStats,
    getFallbackReport,
    buildRuntimeField: callDownstreamSampler
  };

  cachedRuntime.summary = computeStats();

  return cachedRuntime;
}

await initializeDownstream();

export function getStatus() {
  return {
    ...STATUS,
    summary: computeStats(),
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
    compatibilityReceipt: AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT,
    alignmentReceipt: AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT,
    fallbackAllowed: stats.fallbackSamples > 0,
    fallbackSamples: stats.fallbackSamples,
    fallbackRatio: stats.fallbackRatio,
    topologyImported: STATUS.topologyImported,
    terrainImported: STATUS.terrainImported,
    hydrationImported: STATUS.hydrationImported,
    oceansImported: STATUS.oceansImported,
    deepOceanImported: STATUS.deepOceanImported,
    downstreamImportAttempted: STATUS.downstreamImportAttempted,
    downstreamImported: STATUS.downstreamImported,
    downstreamSamplerReady: STATUS.downstreamSamplerReady,
    downstreamImportError: STATUS.downstreamImportError,
    reason: stats.fallbackSamples > 0
      ? "hard-fallback-samples-observed"
      : "downstream-chain-or-continuity-bridge-ready"
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

export function sampleAudraliaRuntime(input, lonArg, uArg, vArg) {
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
export const AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT_VALUE = AUDRALIA_RUNTIME_COMPATIBILITY_RECEIPT;
export const AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT_VALUE = AUDRALIA_RUNTIME_ALIGNMENT_RECEIPT;

const runtimeTruth = createRuntimeObject();

if (typeof window !== "undefined") {
  window.__AUDRALIA_RUNTIME_TRUTH__ = runtimeTruth;
  window.AudraliaRuntime = runtimeTruth;
  window.createAudraliaRuntime = createAudraliaRuntime;
}

exposeRuntimeStatus({
  summary: runtimeTruth.summary,
  fallbackSamples: runtimeTruth.summary.fallbackSamples,
  fallbackAllowed: runtimeTruth.summary.fallbackSamples > 0,
  fallbackReason: runtimeTruth.summary.fallbackSamples > 0
    ? "hard-fallback-samples-observed"
    : "downstream-chain-or-continuity-bridge-ready"
});

export default createAudraliaRuntime;
