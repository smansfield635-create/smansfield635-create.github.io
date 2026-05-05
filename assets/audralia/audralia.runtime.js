// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_PATH_ALIGNMENT_TO_HYDRATION_PARENT_TREE_TNT_v1
//
// Role:
// - Audralia runtime authority.
// - Aligns imports to the new custody tree.
// - Imports topology, tectonics, and terrain from /assets/audralia/audralia/.
// - Imports hydration parent from /assets/audralia/audralia/hydration/render.js.
// - Does not import the oceans child directly.
// - Runtime consumes hydration parent only.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No camera control.
// - No zoom control.
// - No spin control.
// - No land generation outside topology.
// - No tectonic overwrite.
// - No terrain land expansion.
// - No hydration overclaim.
// - No direct oceans-child ownership.
// - No climate.
// - No ecology.
// - No foliage.
// - No trees.
// - No vegetation.
// - No animals.
// - No marine life.
// - No construct civilization.
// - No graphic box.
// - No image generation.
// - No visual pass claim.

import {
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  estimateEarthEquivalentSeaLevel,
  getTopologyStatus
} from "./audralia/topology.render.js?v=AUDRALIA_TOPOLOGY_BEACH_OUTLINE_ONLY_WATER_DOMINANT_TNT_v1";

import {
  sampleTectonics,
  buildTectonicsField,
  getTectonicsSampleFromField,
  getTectonicsStatus
} from "./audralia/tectonics.render.js?v=AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1";

import {
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
} from "./audralia/terrain.render.js?v=AUDRALIA_G1_TERRAIN_STRONG_RELIEF_TOPOLOGY_TECTONICS_LOCK_TNT_v2";

import {
  sampleHydration,
  buildHydrationField,
  getHydrationSampleFromField,
  getHydrationStatus
} from "./audralia/hydration/render.js?v=AUDRALIA_HYDRATION_PARENT_TREE_PATH_ALIGNMENT_TNT_v1";

const RECEIPT = "AUDRALIA_RUNTIME_PATH_ALIGNMENT_TO_HYDRATION_PARENT_TREE_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_RUNTIME_CONSUME_HYDRATION_PARENT_OCEANS_CHILD_TNT_v1",
  "AUDRALIA_RUNTIME_ALLOW_VISIBLE_HYDRATION_DEPTH_TNT_v1",
  "AUDRALIA_RUNTIME_CONSUME_BEACH_OUTLINE_TOPOLOGY_SEA_LEVEL_HYDRATION_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_RUNTIME_PARENT_TREE_PATH_ALIGNED";
const FILE = "/assets/audralia/audralia.runtime.js";

const AUTHORITY_PATHS = Object.freeze({
  topology: "/assets/audralia/audralia/topology.render.js",
  tectonics: "/assets/audralia/audralia/tectonics.render.js",
  terrain: "/assets/audralia/audralia/terrain.render.js",
  hydrationParent: "/assets/audralia/audralia/hydration/render.js",
  oceansChild: "/assets/audralia/audralia/hydration/oceans.render.js"
});

const CONTRACTS = Object.freeze({
  runtime: RECEIPT,
  previousRuntime: "AUDRALIA_RUNTIME_CONSUME_HYDRATION_PARENT_OCEANS_CHILD_TNT_v1",
  topologyCurrent: "AUDRALIA_TOPOLOGY_BEACH_OUTLINE_ONLY_WATER_DOMINANT_TNT_v1",
  tectonics: "AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1",
  terrainCurrent: "AUDRALIA_G1_TERRAIN_STRONG_RELIEF_TOPOLOGY_TECTONICS_LOCK_TNT_v2",
  hydrationParentCurrent: "AUDRALIA_HYDRATION_PARENT_TREE_PATH_ALIGNMENT_TNT_v1",
  oceansChildCurrent: "AUDRALIA_HYDRATION_OCEANS_CHILD_TURQUOISE_DEPTH_GRADIENT_TNT_v1",
  routeExpected: "AUDRALIA_ROUTE_RUNTIME_HYDRATION_WATER_RENDER_TNT_v1"
});

const RUNTIME_LAW = Object.freeze({
  chain: "topology→tectonics→terrain→hydration(parent→oceans_child)",
  layerOrder: Object.freeze(["topology", "tectonics", "terrain", "hydration_parent"]),
  topologyFirst: true,
  tectonicsSecond: true,
  terrainThird: true,
  hydrationParentFourth: true,

  pathTreeAligned: true,
  hydrationParentConsumed: true,
  oceansChildConsumedThroughHydrationParent: true,
  runtimeImportsOceansDirectly: false,

  hydrationHeld: false,
  hydrationAllowedToRender: true,
  waterFirstVisualAuthority: true,
  emitsVisualSurfaceClass: true,
  runtimeCompositeFieldActive: true,
  perPixelChainRecalculation: false,

  ownsRuntimeSampling: true,
  ownsChainComposition: true,
  ownsPerformanceCache: true,
  ownsRouteDataHandoff: true,
  ownsVisualSurfaceClassification: true,

  ownsTopology: false,
  ownsTectonics: false,
  ownsTerrain: false,
  ownsHydration: false,
  ownsOceansChild: false,
  ownsLandFootprint: false,
  ownsWaterFill: false,
  ownsCameraControl: false,
  ownsZoomControl: false,
  ownsSpinControl: false,
  ownsRouteRendering: false,
  ownsFinalRender: false,

  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 224,
  fieldHeight: 112,
  minFieldWidth: 96,
  minFieldHeight: 48,
  maxFieldWidth: 256,
  maxFieldHeight: 128
});

let sharedRuntime = null;

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function normalizeUV(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);
  return Object.freeze({ u, v, lon: u * 2 - 1, lat: 1 - v * 2 });
}

function normalizeDimension(value, fallback, min, max) {
  return clamp(Math.floor(Number(value) || fallback), min, max);
}

function safeCall(fallback, fn) {
  try {
    const value = fn();
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

function getRuntimeOptions(options = {}) {
  return Object.freeze({
    fieldWidth: normalizeDimension(options.fieldWidth, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth),
    fieldHeight: normalizeDimension(options.fieldHeight, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight),
    topologyContext: Object.freeze({ ...(options.topologyContext || {}) }),
    tectonicsContext: Object.freeze({ ...(options.tectonicsContext || {}) }),
    terrainContext: Object.freeze({ ...(options.terrainContext || {}) }),
    hydrationContext: Object.freeze({ ...(options.hydrationContext || {}) }),
    hydrationEnabled: true,
    hydrationHeld: false,
    hydrationAllowedToRender: true,
    hydrationParentConsumed: true,
    oceansChildConsumedThroughHydrationParent: true,
    runtimeImportsOceansDirectly: false,
    pathTreeAligned: true,
    waterFirstVisualAuthority: true,
    visualPassClaimed: false
  });
}

function fallbackTopology(u, v) {
  const point = normalizeUV(u, v);
  const ice = point.lat < -0.80 || point.lat > 0.88;

  return Object.freeze({
    receipt: "RUNTIME_TREE_FALLBACK_TOPOLOGY",
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    isLandFootprint: false,
    isAboveWaterLandFootprint: false,
    isVoidFootprint: !ice,
    isWaterFootprint: !ice,
    isPolarIceFootprint: ice,
    isSouthPolarIceFootprint: point.lat < -0.80,
    isNorthPolarIceFootprint: point.lat > 0.88,
    isBeach: false,
    surfaceClass: ice ? "polar_ice_footprint" : "open_ocean_blueprint",
    topologySurfaceClass: ice ? "polar_ice_footprint" : "open_ocean_blueprint",
    oceanDepthIndex: ice ? 0 : 0.62
  });
}

function fallbackTectonics(u, v, topology) {
  return Object.freeze({
    receipt: "RUNTIME_TREE_FALLBACK_TECTONICS",
    u,
    v,
    topologyLandFootprint: Boolean(topology && topology.isLandFootprint),
    trenchReinforcementPermission: 0
  });
}

function fallbackTerrain(u, v, topology) {
  const land = Boolean(topology && topology.isLandFootprint);
  const ice = Boolean(topology && (topology.isPolarIceFootprint || topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint));

  return Object.freeze({
    receipt: "RUNTIME_TREE_FALLBACK_TERRAIN",
    u,
    v,
    isLand: land,
    isIce: ice,
    normalizedElevation: land ? 0.24 : -0.48,
    riverbedPressure: 0,
    streamPressure: 0,
    lakeBasinPressure: 0,
    glacierSeatPressure: ice ? 0.8 : 0
  });
}

function fallbackHydration(u, v, topology) {
  const land = Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint));
  const ice = Boolean(topology && (topology.isPolarIceFootprint || topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint));
  const ocean = !land && !ice;

  return Object.freeze({
    receipt: "RUNTIME_TREE_FALLBACK_HYDRATION",
    u,
    v,
    hydrationParentActive: true,
    hydrationParentTreeAligned: true,
    oceansChildActive: false,
    waterClass: ice ? "glacier_mass" : ocean ? "ocean_water" : "dry_land",
    isHydrated: ocean || ice,
    isOceanWater: ocean,
    isCoastalWater: false,
    isShelfWater: false,
    isDeepOcean: false,
    isTrenchWater: false,
    isGlacier: ice,
    oceanActive: ocean,
    oceanClass: ocean ? "open_ocean" : ice ? "polar_ice" : "not_ocean",
    oceanDepthIndex: ocean ? 0.62 : 0,
    visibleWaterDepthIndex: ocean ? 0.62 : 0,
    waterVisibilityIndex: ocean ? 0.70 : 0,
    coastalTurquoiseIndex: 0,
    shelfWaterIndex: ocean ? 0.18 : 0,
    openOceanIndex: ocean ? 0.76 : 0,
    deepOceanIndex: ocean ? 0.46 : 0,
    trenchWaterIndex: 0,
    beachContactRimIndex: 0,
    landStillVisibleAfterHydration: land,
    exposedLandAfterSeaLevel: land,
    hydrationColorInfluence: null
  });
}

function getTopology(cache, u, v) {
  if (cache.topologyField) return getTopologySampleFromField(cache.topologyField, u, v);
  return safeCall(fallbackTopology(u, v), () => sampleTopology(u, v, cache.runtimeOptions.topologyContext));
}

function getTectonics(cache, u, v, topology) {
  if (cache.tectonicsField) return getTectonicsSampleFromField(cache.tectonicsField, u, v);
  return safeCall(fallbackTectonics(u, v, topology), () => sampleTectonics(u, v, topology, cache.runtimeOptions.tectonicsContext));
}

function getTerrain(cache, u, v, topology) {
  if (cache.terrainField) return getTerrainSampleFromField(cache.terrainField, u, v);
  return safeCall(fallbackTerrain(u, v, topology), () => sampleTerrain(u, v, cache.runtimeOptions.terrainContext));
}

function getHydration(cache, u, v, topology, terrain) {
  if (cache.hydrationField) return getHydrationSampleFromField(cache.hydrationField, u, v);
  return safeCall(fallbackHydration(u, v, topology), () => sampleHydration(u, v, cache.runtimeOptions.hydrationContext));
}

function landFromTopology(topology) {
  return Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint));
}

function iceFromTopology(topology) {
  return Boolean(
    topology &&
      (
        topology.isPolarIceFootprint ||
        topology.isSouthPolarIceFootprint ||
        topology.isNorthPolarIceFootprint ||
        topology.surfaceClass === "polar_ice_footprint" ||
        topology.topologySurfaceClass === "polar_ice_footprint"
      )
  );
}

function waterFromHydration(hydration) {
  return Boolean(
    hydration &&
      (
        hydration.isOceanWater ||
        hydration.isCoastalWater ||
        hydration.isShelfWater ||
        hydration.isDeepOcean ||
        hydration.isTrenchWater ||
        hydration.isRiver ||
        hydration.isStream ||
        hydration.isLake ||
        hydration.isGlacier ||
        hydration.isSnowpack ||
        hydration.isFloodplain ||
        hydration.isDelta ||
        hydration.isSpring ||
        String(hydration.waterClass || "").includes("water") ||
        String(hydration.waterClass || "").includes("ocean") ||
        String(hydration.waterClass || "").includes("river") ||
        String(hydration.waterClass || "").includes("lake") ||
        String(hydration.waterClass || "").includes("glacier")
      )
  );
}

function visualSurfaceClass(hydration, topology, land, ice, water) {
  if (ice || hydration.isGlacier || hydration.waterClass === "glacier_mass") return "glacier_ice_snowpack_surface";
  if (hydration.isTrenchWater || hydration.waterClass === "trench_water") return "trench_ocean_water_surface";
  if (hydration.isDeepOcean || hydration.waterClass === "deep_ocean_water") return "deep_ocean_water_surface";
  if (hydration.isShelfWater || hydration.waterClass === "shelf_water") return "shelf_water_surface";
  if (hydration.isCoastalWater || hydration.waterClass === "coastal_water") return "coastal_turquoise_water_surface";
  if (hydration.isOceanWater || hydration.waterClass === "ocean_water") return "ocean_water_surface";
  if (hydration.isLake) return "lake_water_surface";
  if (hydration.isRiver) return "river_water_surface";
  if (hydration.isStream) return "stream_water_surface";
  if (water) return "water_surface";
  if (land) return "inland_terrain_pending_surface";
  return "open_ocean_water_surface";
}

function composeRuntimeSample(cache, uInput, vInput) {
  const point = normalizeUV(uInput, vInput);

  const topology = getTopology(cache, point.u, point.v);
  const tectonics = getTectonics(cache, point.u, point.v, topology);
  const terrain = getTerrain(cache, point.u, point.v, topology);
  const hydration = getHydration(cache, point.u, point.v, topology, terrain);

  const topologyLand = landFromTopology(topology);
  const ice = iceFromTopology(topology);
  const water = waterFromHydration(hydration);
  const visibleLand = topologyLand && !water && !ice;
  const surfaceClass = visualSurfaceClass(hydration, topology, visibleLand, ice, water);

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    runtimeChain: "topology→tectonics→terrain→hydration(parent→oceans_child)",
    topologyReceipt: topology.receipt || "unknown",
    tectonicsReceipt: tectonics.receipt || "unknown",
    terrainReceipt: terrain.receipt || "unknown",
    hydrationReceipt: hydration.receipt || "unknown",
    oceansReceipt: hydration.oceansReceipt || "unknown",

    pathTreeAligned: true,
    hydrationParentConsumed: true,
    oceansChildConsumedThroughHydrationParent: true,
    runtimeImportsOceansDirectly: false,
    hydrationHeld: false,
    hydrationAllowedToRender: true,
    hydrationActiveInRuntime: true,
    waterFirstVisualAuthority: true,

    visualSurfaceClass: surfaceClass,
    visualSurfaceAuthority: "runtime",
    routeShouldPaintFromVisualSurfaceClass: true,

    isLandFootprint: visibleLand,
    isAboveWaterLandFootprint: visibleLand,
    topologyLandFootprint: topologyLand,
    isVoidFootprint: !topologyLand && !ice,
    isWater: water || (!topologyLand && !ice),
    isLand: visibleLand,
    isIce: ice,
    isBeach: visibleLand && Boolean(topology.isBeach),
    isSand: visibleLand && Boolean(topology.isSand),

    waterClass: hydration.waterClass || "dry_land",
    waterClassId: Number(hydration.waterClassId) || 0,
    visualHydrationClass: hydration.visualHydrationClass || "unknown",

    isHydrated: Boolean(hydration.isHydrated),
    isOceanWater: Boolean(hydration.isOceanWater),
    isCoastalWater: Boolean(hydration.isCoastalWater),
    isShelfWater: Boolean(hydration.isShelfWater),
    isDeepOcean: Boolean(hydration.isDeepOcean),
    isTrenchWater: Boolean(hydration.isTrenchWater),
    isRiver: Boolean(hydration.isRiver),
    isStream: Boolean(hydration.isStream),
    isLake: Boolean(hydration.isLake),
    isGlacier: Boolean(hydration.isGlacier),

    oceanClass: hydration.oceanClass || "unknown",
    oceanClassId: Number(hydration.oceanClassId) || 0,
    oceanActive: Boolean(hydration.oceanActive),
    oceanFromHydrationParent: true,
    oceansChildActive: Boolean(hydration.oceansChildActive),
    oceanDoesNotOwnLand: true,
    landPreservedByTopology: Boolean(hydration.landPreservedByTopology),

    visibleWaterDepthClass: hydration.visibleWaterDepthClass || "none",
    visibleWaterDepthIndex: clamp(Number(hydration.visibleWaterDepthIndex) || 0, 0, 1),
    waterVisibilityIndex: clamp(Number(hydration.waterVisibilityIndex) || 0, 0, 1),
    coastalTurquoiseIndex: clamp(Number(hydration.coastalTurquoiseIndex) || 0, 0, 1),
    coastalShelfBlueIndex: clamp(Number(hydration.coastalShelfBlueIndex) || 0, 0, 1),
    shelfWaterIndex: clamp(Number(hydration.shelfWaterIndex) || 0, 0, 1),
    openOceanIndex: clamp(Number(hydration.openOceanIndex) || 0, 0, 1),
    deepOceanIndex: clamp(Number(hydration.deepOceanIndex) || 0, 0, 1),
    trenchWaterIndex: clamp(Number(hydration.trenchWaterIndex) || 0, 0, 1),
    deepOceanBlueIndex: clamp(Number(hydration.deepOceanBlueIndex) || Number(hydration.deepOceanIndex) || 0, 0, 1),
    trenchDarknessIndex: clamp(Number(hydration.trenchDarknessIndex) || Number(hydration.trenchWaterIndex) || 0, 0, 1),

    oceanDepthIndex: clamp(Number(hydration.oceanDepthIndex) || Number(topology.oceanDepthIndex) || 0, 0, 1),
    bathymetryHydrationIndex: clamp(Number(hydration.bathymetryHydrationIndex) || Number(topology.bathymetryBlueprintIndex) || 0, 0, 1),
    trenchHydrationIndex: clamp(Number(hydration.trenchHydrationIndex) || Number(topology.trenchDepthIndex) || 0, 0, 1),
    shelfPressure: clamp(Number(hydration.shelfPressure) || Number(topology.shelfDepthIndex) || 0, 0, 1),
    coastalWaterPressure: clamp(Number(hydration.coastalWaterPressure) || Number(topology.coastalExposureIndex) || 0, 0, 1),

    beachOutlinePressure: clamp(Number(hydration.beachOutlinePressure) || Number(topology.beachOutlinePressure) || 0, 0, 1),
    beachContactRimIndex: clamp(Number(hydration.beachContactRimIndex) || 0, 0, 1),
    beachWaterContactIndex: clamp(Number(hydration.beachWaterContactIndex) || 0, 0, 1),
    beachRimStillVisible: Boolean(hydration.beachRimStillVisible),
    sandCoveredByHydration: Boolean(hydration.sandCoveredByHydration),

    exposedLandAfterSeaLevel: Boolean(hydration.exposedLandAfterSeaLevel),
    landStillVisibleAfterHydration: Boolean(hydration.landStillVisibleAfterHydration),
    exposedLandVisibilityIndex: clamp(Number(hydration.exposedLandVisibilityIndex) || 0, 0, 1),
    exposedLandClass: hydration.exposedLandClass || "unknown",

    surfaceWaterIndex: clamp(Number(hydration.surfaceWaterIndex) || 0, 0, 1),
    hydrationActivationIndex: clamp(Number(hydration.hydrationActivationIndex) || 0, 0, 1),
    hydrationColorInfluence: hydration.hydrationColorInfluence || null,

    normalizedElevation: clamp(Number(terrain.normalizedElevation) || 0, -1, 1),
    terrainAllowedByTopology: topologyLand,
    terrainMustNotExpandLandArea: true,

    runtimeCacheActive: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,

    ownsRuntimeSampling: true,
    ownsChainComposition: true,
    ownsPerformanceCache: true,
    ownsRouteDataHandoff: true,
    ownsVisualSurfaceClassification: true,

    ownsTopology: false,
    ownsTectonics: false,
    ownsTerrain: false,
    ownsHydration: false,
    ownsOceansChild: false,
    ownsLandFootprint: false,
    ownsWaterFill: false,
    ownsCameraControl: false,
    ownsZoomControl: false,
    ownsSpinControl: false,
    ownsRouteRendering: false,
    ownsFinalRender: false,

    foliage: false,
    trees: false,
    vegetation: false,
    animals: false,
    marineLife: false,
    constructCivilization: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

function getRuntimeSampleFromField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) return null;

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || null;
}

function buildRuntimeCache(options) {
  const topologyField = safeCall(null, () => buildTopologyField(options.fieldWidth, options.fieldHeight, options.topologyContext));
  const tectonicsField = safeCall(null, () => buildTectonicsField(options.fieldWidth, options.fieldHeight, options.tectonicsContext));
  const terrainField = safeCall(null, () => buildTerrainField(options.fieldWidth, options.fieldHeight, options.terrainContext));
  const hydrationField = safeCall(null, () => buildHydrationField(options.fieldWidth, options.fieldHeight, options.hydrationContext));

  const cache = {
    receipt: RECEIPT,
    runtimeOptions: options,
    fieldWidth: options.fieldWidth,
    fieldHeight: options.fieldHeight,
    topologyField,
    tectonicsField,
    terrainField,
    hydrationField,
    topologyStatus: safeCall(null, () => getTopologyStatus()),
    tectonicsStatus: safeCall(null, () => getTectonicsStatus()),
    terrainStatus: safeCall(null, () => getTerrainStatus()),
    hydrationStatus: safeCall(null, () => getHydrationStatus()),
    seaLevelEstimate: safeCall(null, () => estimateEarthEquivalentSeaLevel(96, 48, options.topologyContext))
  };

  const samples = new Array(options.fieldWidth * options.fieldHeight);

  let waterSamples = 0;
  let landSamples = 0;
  let oceanSamples = 0;
  let coastalSamples = 0;
  let shelfSamples = 0;
  let deepSamples = 0;
  let trenchSamples = 0;
  let visibleLandSamples = 0;
  let maxTurquoise = 0;
  let maxDepth = 0;

  const visualSurfaceClasses = new Set();

  for (let y = 0; y < options.fieldHeight; y += 1) {
    const v = options.fieldHeight === 1 ? 0.5 : y / (options.fieldHeight - 1);

    for (let x = 0; x < options.fieldWidth; x += 1) {
      const u = options.fieldWidth === 1 ? 0.5 : x / (options.fieldWidth - 1);
      const sample = composeRuntimeSample(cache, u, v);

      samples[y * options.fieldWidth + x] = sample;
      visualSurfaceClasses.add(sample.visualSurfaceClass);

      if (sample.isWater) waterSamples += 1;
      if (sample.isLandFootprint) landSamples += 1;
      if (sample.oceanActive) oceanSamples += 1;
      if (sample.isCoastalWater) coastalSamples += 1;
      if (sample.isShelfWater) shelfSamples += 1;
      if (sample.isDeepOcean) deepSamples += 1;
      if (sample.isTrenchWater) trenchSamples += 1;
      if (sample.landStillVisibleAfterHydration) visibleLandSamples += 1;
      maxTurquoise = Math.max(maxTurquoise, sample.coastalTurquoiseIndex);
      maxDepth = Math.max(maxDepth, sample.visibleWaterDepthIndex);
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    fieldWidth: options.fieldWidth,
    fieldHeight: options.fieldHeight,
    runtimeOptions: options,
    topologyField,
    tectonicsField,
    terrainField,
    hydrationField,
    runtimeField: Object.freeze({
      receipt: RECEIPT,
      width: options.fieldWidth,
      height: options.fieldHeight,
      samples,
      stats: Object.freeze({
        totalSamples: samples.length,
        waterSamples,
        landSamples,
        oceanSamples,
        coastalSamples,
        shelfSamples,
        deepSamples,
        trenchSamples,
        visibleLandSamples,
        waterRatio: samples.length ? waterSamples / samples.length : 0,
        landRatio: samples.length ? landSamples / samples.length : 0,
        oceanRatio: samples.length ? oceanSamples / samples.length : 0,
        coastalRatio: samples.length ? coastalSamples / samples.length : 0,
        shelfRatio: samples.length ? shelfSamples / samples.length : 0,
        deepRatio: samples.length ? deepSamples / samples.length : 0,
        trenchRatio: samples.length ? trenchSamples / samples.length : 0,
        visibleLandRatio: samples.length ? visibleLandSamples / samples.length : 0,
        maxTurquoise,
        maxDepth,
        visualSurfaceClasses: Object.freeze(Array.from(visualSurfaceClasses)),
        pathTreeAligned: true,
        hydrationParentConsumed: true,
        oceansChildConsumedThroughHydrationParent: true,
        runtimeImportsOceansDirectly: false,
        waterFirstVisualAuthority: true,
        visualPassClaimed: false
      })
    }),
    topologyStatus: cache.topologyStatus,
    tectonicsStatus: cache.tectonicsStatus,
    terrainStatus: cache.terrainStatus,
    hydrationStatus: cache.hydrationStatus,
    seaLevelEstimate: cache.seaLevelEstimate,
    runtimeCacheActive: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false
  });
}

function sampleFromRuntimeCache(cache, u, v) {
  return getRuntimeSampleFromField(cache.runtimeField, u, v) || composeRuntimeSample(cache, u, v);
}

export function createAudraliaRuntime(options = {}) {
  const runtimeOptions = getRuntimeOptions(options);
  const cache = buildRuntimeCache(runtimeOptions);

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    runtimeOptions,
    cache,

    sampleRuntimeState(u, v) {
      return sampleFromRuntimeCache(cache, u, v);
    },

    sampleAudraliaPlanetState(u, v) {
      return sampleFromRuntimeCache(cache, u, v);
    },

    getStatus() {
      return Object.freeze({
        ok: true,
        receipt: RECEIPT,
        previousReceipts: PREVIOUS_RECEIPTS,
        status: "active",
        planetaryObject: PLANETARY_OBJECT,
        generation: GENERATION,
        file: FILE,
        authorityPaths: AUTHORITY_PATHS,
        contracts: CONTRACTS,
        runtimeLaw: RUNTIME_LAW,

        layerOrder: RUNTIME_LAW.layerOrder,
        chain: RUNTIME_LAW.chain,

        topologyLoaded: Boolean(cache.topologyField && cache.topologyField.samples),
        tectonicsLoaded: Boolean(cache.tectonicsField && cache.tectonicsField.samples),
        terrainLoaded: Boolean(cache.terrainField && cache.terrainField.samples),
        hydrationLoaded: Boolean(cache.hydrationField && cache.hydrationField.samples),
        runtimeFieldLoaded: Boolean(cache.runtimeField && cache.runtimeField.samples),

        topologyStatus: cache.topologyStatus,
        tectonicsStatus: cache.tectonicsStatus,
        terrainStatus: cache.terrainStatus,
        hydrationStatus: cache.hydrationStatus,
        runtimeFieldStats: cache.runtimeField.stats,

        pathTreeAligned: true,
        hydrationParentConsumed: true,
        oceansChildConsumedThroughHydrationParent: true,
        runtimeImportsOceansDirectly: false,
        hydrationHeld: false,
        hydrationAllowedToRender: true,
        waterFirstVisualAuthority: true,
        emitsVisualSurfaceClass: true,

        ownsRuntimeSampling: true,
        ownsChainComposition: true,
        ownsPerformanceCache: true,
        ownsRouteDataHandoff: true,
        ownsVisualSurfaceClassification: true,

        ownsTopology: false,
        ownsTectonics: false,
        ownsTerrain: false,
        ownsHydration: false,
        ownsOceansChild: false,
        ownsRouteRendering: false,
        ownsFinalRender: false,

        graphicBox: false,
        imageGeneration: false,
        visualPassClaimed: false
      });
    }
  });
}

export function sampleRuntimeState(u, v, context = {}) {
  if (!sharedRuntime) sharedRuntime = createAudraliaRuntime(context);
  return sharedRuntime.sampleRuntimeState(u, v, context);
}

export function sampleAudraliaPlanetState(u, v, context = {}) {
  if (!sharedRuntime) sharedRuntime = createAudraliaRuntime(context);
  return sharedRuntime.sampleAudraliaPlanetState(u, v, context);
}

export function buildAudraliaRuntimeField(width = 128, height = 64, options = {}) {
  const w = normalizeDimension(width, 128, 16, 384);
  const h = normalizeDimension(height, 64, 8, 192);
  const runtime = createAudraliaRuntime({
    ...options,
    fieldWidth: options.fieldWidth || w,
    fieldHeight: options.fieldHeight || h
  });

  return runtime.cache.runtimeField;
}

export function getRuntimeStatus() {
  const runtime = sharedRuntime || createAudraliaRuntime();
  return runtime.getStatus();
}

const api = Object.freeze({
  createAudraliaRuntime,
  sampleRuntimeState,
  sampleAudraliaPlanetState,
  buildAudraliaRuntimeField,
  getRuntimeStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaRuntime = api;
  window.AudraliaRuntime = api;
  window.audraliaRuntime = api;
}

export default api;
