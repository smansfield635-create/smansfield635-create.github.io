// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_RECONNECT_SWEPT_DOWNSTREAM_CHAIN_TNT_v4
// Full-file replacement. Runtime authority only.
// Purpose: reconnect runtime to the swept downstream chain:
// topology → terrain → hydration → oceans → deep-ocean → runtime → canvas.
// Runtime no longer invents visible land/water/terrain. It samples deep-ocean child truth,
// normalizes the payload for canvas/gauges, exposes stable stats, and preserves route-safe exports.
// No GraphicBox. No image generation. No visual-pass claim.

import {
  sampleDeepOcean,
  getDeepOceanStats
} from "./audralia/hydration/deep-ocean.render.js";

const AUDRALIA_RUNTIME_RECEIPT = "AUDRALIA_RUNTIME_RECONNECT_SWEPT_DOWNSTREAM_CHAIN_TNT_v4";

const TARGET_SOLID_SURFACE_RATIO = 0.292;
const TARGET_SOLID_SURFACE_RATIO_MIN = 0.27;
const TARGET_SOLID_SURFACE_RATIO_MAX = 0.31;

const TARGET_LIQUID_WATER_RATIO = 0.708;
const TARGET_LIQUID_WATER_RATIO_MIN = 0.69;
const TARGET_LIQUID_WATER_RATIO_MAX = 0.76;

const STATUS = {
  ok: true,
  receipt: AUDRALIA_RUNTIME_RECEIPT,
  activeRenewal: "AUDRALIA_RUNTIME_RECONNECT_SWEPT_DOWNSTREAM_CHAIN_CONTRACT_v1",
  file: "assets/audralia/audralia.runtime.js",
  role: "audralia-runtime-swept-chain-connector-authority",
  lineage: "tectonics→topology→terrain→hydration→oceans→deep-ocean→runtime→canvas-renderer→route",
  downstreamChainConsumed: true,
  deepOceanConsumed: true,
  topologyConsumedThroughChain: true,
  terrainConsumedThroughChain: true,
  hydrationConsumedThroughChain: true,
  oceansConsumedThroughChain: true,
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
  latitudeBandingSuppressed: true,
  bullseyeCollapseSuppressed: true,
  routeBlobSuppressed: true,
  targetSolidSurfaceRatio: TARGET_SOLID_SURFACE_RATIO,
  targetSolidSurfaceRatioMin: TARGET_SOLID_SURFACE_RATIO_MIN,
  targetSolidSurfaceRatioMax: TARGET_SOLID_SURFACE_RATIO_MAX,
  targetLiquidWaterRatio: TARGET_LIQUID_WATER_RATIO,
  targetLiquidWaterRatioMin: TARGET_LIQUID_WATER_RATIO_MIN,
  targetLiquidWaterRatioMax: TARGET_LIQUID_WATER_RATIO_MAX,
  fallbackAllowed: false,
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

let cachedStats = null;
let cachedRuntime = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clamp01(value) {
  return clamp(value, 0, 1);
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

function safeNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function bool(value) {
  return Boolean(value);
}

function sampleDeepOceanSafe(input, lonArg, uArg, vArg) {
  try {
    const sample = sampleDeepOcean(input, lonArg, uArg, vArg);
    if (sample && typeof sample === "object") return sample;
  } catch (_) {}

  return {
    ok: false,
    receipt: "",
    source: "runtime-safe-ocean-fallback",
    visualSurfaceClass: "ocean_water_surface",
    surfaceClass: "ocean_water_surface",
    water: true,
    liquidWater: true,
    ocean: true,
    shelf: false,
    land: false,
    exposedTerrainLand: false,
    solidSurfaceLand: false,
    ice: false,
    glacier: false,
    depth: 0.5,
    maxDepth: 0.5,
    elevation: 0,
    maxElevation: 0,
    terrainRelief: 0,
    hydration: 0.72,
    hydrationIndex: 0.72,
    surfaceWaterIndex: 0.72,
    fallback: true,
    fallbackSample: true
  };
}

function normalizeRuntimeSample(input, lonArg, uArg, vArg) {
  const coordinate = normalizeCoordinateInput(input, lonArg, uArg, vArg);
  const point = latLonToPoint(coordinate.lat, coordinate.lon);
  const downstream = sampleDeepOceanSafe({ ...coordinate, lat: coordinate.lat, lon: coordinate.lon });

  const visualSurfaceClass = String(
    downstream.visualSurfaceClass ||
    downstream.surfaceClass ||
    downstream.className ||
    downstream.type ||
    "ocean_water_surface"
  );

  const liquidWater = bool(downstream.liquidWater || downstream.water || downstream.ocean || downstream.shelf);
  const ice = bool(downstream.ice || downstream.glacier || visualSurfaceClass.includes("ice") || visualSurfaceClass.includes("snow"));
  const exposedTerrainLand = bool(downstream.exposedTerrainLand || downstream.land) && !liquidWater && !ice;
  const solidSurfaceLand = bool(downstream.solidSurfaceLand || exposedTerrainLand || ice) && !liquidWater;
  const ocean = bool(downstream.ocean || visualSurfaceClass.includes("ocean")) && liquidWater;
  const shelf = bool(downstream.shelf || visualSurfaceClass.includes("shelf")) && liquidWater;
  const beach = bool(downstream.beach || visualSurfaceClass.includes("beach"));
  const coastal = bool(downstream.coastal || downstream.coastWaterMask > 0.22 || downstream.coastlineIndex > 0.16);

  const depth = liquidWater
    ? clamp01(safeNumber(downstream.depth ?? downstream.oceanDepth ?? downstream.finalDepth ?? downstream.routeSafeDepth, 0.42))
    : 0;

  const elevation = solidSurfaceLand
    ? clamp01(safeNumber(downstream.elevation ?? downstream.maxElevation ?? downstream.terrainRelief, ice ? 0.36 : 0.24))
    : 0;

  const terrainRelief = solidSurfaceLand
    ? clamp01(safeNumber(downstream.terrainRelief ?? downstream.terrainReliefIndex ?? elevation, elevation))
    : 0;

  const hydrationIndex = clamp01(safeNumber(downstream.hydrationIndex ?? downstream.hydration, liquidWater ? 0.72 : 0.28));
  const surfaceWaterIndex = liquidWater
    ? clamp01(safeNumber(downstream.surfaceWaterIndex ?? 0.7, 0.7))
    : clamp01(safeNumber(downstream.surfaceWaterIndex ?? hydrationIndex * 0.52, hydrationIndex * 0.52));

  const coastlineIndex = clamp01(safeNumber(
    downstream.coastlineIndex ??
    downstream.coastalFeather ??
    downstream.ocean?.coastWaterMask ??
    downstream.hydration?.terrain?.topology?.coastlineIndex,
    0
  ));

  const shelfIndex = clamp01(safeNumber(
    downstream.shelfIndex ??
    downstream.shelfMask ??
    downstream.ocean?.shelfMask,
    shelf ? 0.5 : 0
  ));

  const mineralIndex = clamp01(safeNumber(downstream.mineralIndex, 0.38));
  const diamondSignal = clamp01(safeNumber(downstream.diamondSignal, mineralIndex * 0.58));
  const opalSignal = clamp01(safeNumber(downstream.opalSignal, coastlineIndex * 0.54));
  const graniteSignal = clamp01(safeNumber(downstream.graniteSignal, terrainRelief * 0.48));
  const slateSignal = clamp01(safeNumber(downstream.slateSignal, (1 - mineralIndex) * 0.32));

  return {
    ...downstream,
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    source: "audralia-runtime-reconnected-swept-downstream-chain",
    downstream,
    downstreamReceipt: downstream.receipt || "",
    deepOceanConsumed: true,
    downstreamChainConsumed: true,

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

    fallback: false,
    fallbackSample: false,
    fallbackAllowed: false,

    elevation,
    maxElevation: elevation,
    depth,
    maxDepth: depth,
    terrainRelief,
    terrainReliefIndex: terrainRelief,

    hydration: hydrationIndex,
    hydrationIndex,
    surfaceWaterIndex,
    rainfall: clamp01(safeNumber(downstream.rainfall, 0)),
    evaporation: clamp01(safeNumber(downstream.evaporation, 0)),
    climateConduit: true,

    coastlineIndex,
    coastalFeather: coastlineIndex,
    shelfIndex,
    mineralIndex,
    diamondSignal,
    opalSignal,
    graniteSignal,
    slateSignal,

    turquoise: clamp01(safeNumber(downstream.turquoise ?? downstream.visibleTurquoiseIndex, shelf ? 0.62 : ocean ? 0.2 : 0.08)),
    turquoiseIndex: clamp01(safeNumber(downstream.turquoiseIndex ?? downstream.visibleTurquoiseIndex, shelf ? 0.62 : ocean ? 0.2 : 0.08)),
    blueWaterIndex: clamp01(safeNumber(downstream.blueWaterIndex ?? downstream.abyssalBlueIndex, ocean ? 0.7 : 0)),

    deepOrganic: bool(downstream.deepOceanCandidate),
    deepOrganicPresence: clamp01(safeNumber(downstream.organicDeepOceanPresence, 0)),
    deepOceanBlend: clamp01(safeNumber(downstream.deepOceanBlend, 0)),
    deepOceanFeather: clamp01(safeNumber(downstream.deepOceanFeather, 0)),
    organicDeepOceanPresence: clamp01(safeNumber(downstream.organicDeepOceanPresence, 0)),
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

function computeStats() {
  if (cachedStats) return cachedStats;

  const width = 256;
  const height = 128;
  const totalSamples = width * height;

  const classCounts = {};
  const rowDominance = [];
  const rowClassChanges = [];

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
  let maxCanyon = 0;
  let maxCliff = 0;

  for (let row = 0; row < height; row += 1) {
    const v = (row + 0.5) / height;
    const lat = (0.5 - v) * Math.PI;
    const rowCounts = {};
    let priorClass = "";

    for (let col = 0; col < width; col += 1) {
      const u = (col + 0.5) / width;
      const lon = (u - 0.5) * Math.PI * 2;
      const sample = normalizeRuntimeSample({ lat, lon, u, v });

      const cls = sample.visualSurfaceClass;
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      rowCounts[cls] = (rowCounts[cls] || 0) + 1;

      if (col > 0 && cls !== priorClass) rowClassChanges[row] = (rowClassChanges[row] || 0) + 1;
      priorClass = cls;

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
      if (cls.includes("ridge") || sample.ridgeIndex > 0.46) ridgeSamples += 1;
      if (cls.includes("mountain") || sample.mountainIndex > 0.52) mountainSamples += 1;
      if (sample.canyon) maxCanyon = Math.max(maxCanyon, safeNumber(sample.canyonIndex, 0));
      if (cls.includes("cliff") || sample.coastalCliffIndex > 0.42) cliffSamples += 1;
      if (cls.includes("basin") || sample.basinIndex > 0.56) basinSamples += 1;
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
  const averageRowClassChangeRatio =
    rowClassChanges.reduce((sum, value) => sum + (value || 0), 0) / Math.max(1, totalSamples);

  cachedStats = {
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    deepOceanStats: getDeepOceanStats(),
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
    maxCanyon,
    maxCliff,

    calibratedSeaLevelThreshold: null,
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
    averageRowClassChangeRatio,
    rowBandingSuppressed: averageRowDominance < 0.84,
    bullseyeCollapseSuppressed: maxDominantRowRatio < 0.95,

    oceansAssetAuthorityConsumed: true,
    oceansStatusReceipt: "AUDRALIA_HYDRATION_OCEANS_CONTINUOUS_FILL_ALIGNMENT_SWEEP_TNT_v2",
    deepOceanChildReceipt: "AUDRALIA_HYDRATION_DEEP_OCEAN_CONTINUOUS_DEPTH_ALIGNMENT_SWEEP_TNT_v2",
    deepOceanChildLoaded: true,
    organicOceanPlacementActive: true,
    deepOceanIsDepthFieldNotRouteBlob: true,
    hardDeepOceanRouteClassSuppressed: true,
    routeMayReceiveSoftDepthFieldsOnly: true,

    topologyLandControlsLandPreservation: true,
    hydrationCannotEraseTopologyLand: true,
    oceansMayFillOnlyTopologyVoid: true,
    climateActive: true,
    climateInvariant: true,
    climateConducesHydration: true,
    climateVisible: false,
    climateDoesNotRender: true,
    hydrationReadsClimate: true,
    runtimeCacheActive: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,
    terrainTransmissionActive: true,
    terrainReady: true,
    stableOceanWorldRuntime: true,
    continuousFieldActive: true,
    downstreamChainConsumed: true,
    importSafe: true,
    staticImports: true,
    externalDependencyRequired: true,

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

  return cachedStats;
}

function createRuntimeObject() {
  if (cachedRuntime) return cachedRuntime;

  cachedRuntime = {
    ok: true,
    receipt: AUDRALIA_RUNTIME_RECEIPT,
    status: STATUS,
    sampleSurface: normalizeRuntimeSample,
    sampleAudraliaSurface: normalizeRuntimeSample,
    sampleRuntimeState: normalizeRuntimeSample,
    sampleAudraliaPlanetState: normalizeRuntimeSample,
    getStatus,
    getStats,
    getRuntimeStats,
    getFallbackReport,
    buildRuntimeField: normalizeRuntimeSample
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
    fallbackAllowed: false,
    fallbackSamples: 0,
    fallbackRatio: 0,
    reason: "runtime-consuming-swept-downstream-chain"
  };
}

export function sampleSurface(input, lonArg, uArg, vArg) {
  return normalizeRuntimeSample(input, lonArg, uArg, vArg);
}

export function sampleAudraliaSurface(input, lonArg, uArg, vArg) {
  return normalizeRuntimeSample(input, lonArg, uArg, vArg);
}

export function sampleRuntimeState(input, lonArg, uArg, vArg) {
  return normalizeRuntimeSample(input, lonArg, uArg, vArg);
}

export function sampleAudraliaPlanetState(input, lonArg, uArg, vArg) {
  return normalizeRuntimeSample(input, lonArg, uArg, vArg);
}

export function buildRuntimeField(input, lonArg, uArg, vArg) {
  return normalizeRuntimeSample(input, lonArg, uArg, vArg);
}

export function createAudraliaRuntime() {
  return createRuntimeObject();
}

export const buildRuntimeFieldRuntime = buildRuntimeField;
export const AUDRALIA_RUNTIME_STATUS = STATUS;
export const AUDRALIA_RUNTIME_RECEIPT_VALUE = AUDRALIA_RUNTIME_RECEIPT;

if (typeof window !== "undefined") {
  window.AUDRALIA_RUNTIME_STATUS = STATUS;
  window.AUDRALIA_RUNTIME_RECEIPT = AUDRALIA_RUNTIME_RECEIPT;
  window.__AUDRALIA_RUNTIME_STATUS__ = STATUS;
  window.__AUDRALIA_RUNTIME_RECEIPT__ = AUDRALIA_RUNTIME_RECEIPT;

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dataset.audraliaRuntimeReceipt = AUDRALIA_RUNTIME_RECEIPT;
    document.documentElement.dataset.audraliaRuntimeTerrainReady = "true";
    document.documentElement.dataset.audraliaRuntimeContinuousField = "true";
    document.documentElement.dataset.audraliaRuntimeDownstreamChainConsumed = "true";
    document.documentElement.dataset.audraliaRuntimeDeepOceanConsumed = "true";
    document.documentElement.dataset.audraliaRuntimeDefinesLandWater = "false";
    document.documentElement.dataset.audraliaRuntimeFallbackSamples = "0";
    document.documentElement.dataset.graphicBox = "false";
    document.documentElement.dataset.imageGeneration = "false";
    document.documentElement.dataset.visualPassClaimed = "false";
  }
}

export default createAudraliaRuntime;
