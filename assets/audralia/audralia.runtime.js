// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_CONSUME_TECTONIC_GENEALOGY_HYDRATION_PARENT_TNT_v1
//
// Role:
// - Audralia runtime authority.
// - Consumes the nested tectonic genealogy.
// - Tectonics begot topology.
// - Topology begot terrain.
// - Runtime consumes hydration parent after terrain.
// - Runtime does not import oceans directly.
// - Runtime emits final visualSurfaceClass and diagnostics.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No camera control.
// - No zoom control.
// - No spin control.
// - No land generation.
// - No tectonic overwrite.
// - No topology overwrite.
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
  sampleTectonics,
  buildTectonicsField,
  getTectonicsSampleFromField,
  getTectonicsStatus
} from "./audralia/tectonics/render.js?v=AUDRALIA_TECTONICS_DERIVATIVE_ORIGIN_PARENT_TNT_v1";

import {
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  getTopologyStatus
} from "./audralia/tectonics/topology/render.js?v=AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1";

import {
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
} from "./audralia/tectonics/topology/terrain.render.js?v=AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1";

import {
  sampleHydration,
  buildHydrationField,
  getHydrationSampleFromField,
  getHydrationStatus
} from "./audralia/hydration/render.js?v=AUDRALIA_HYDRATION_PARENT_TECTONIC_GENEALOGY_ALIGNMENT_TNT_v1";

const RECEIPT = "AUDRALIA_RUNTIME_CONSUME_TECTONIC_GENEALOGY_HYDRATION_PARENT_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_RUNTIME_PATH_ALIGNMENT_TO_HYDRATION_PARENT_TREE_TNT_v1",
  "AUDRALIA_RUNTIME_CONSUME_HYDRATION_PARENT_OCEANS_CHILD_TNT_v1",
  "AUDRALIA_RUNTIME_ALLOW_VISIBLE_HYDRATION_DEPTH_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_RUNTIME_TECTONIC_GENEALOGY_HYDRATION_PARENT";
const FILE = "/assets/audralia/audralia.runtime.js";

const AUTHORITY_PATHS = Object.freeze({
  tectonicsParent: "/assets/audralia/audralia/tectonics/render.js",
  topologyChild: "/assets/audralia/audralia/tectonics/topology/render.js",
  terrainGrandchild: "/assets/audralia/audralia/tectonics/topology/terrain.render.js",
  hydrationParent: "/assets/audralia/audralia/hydration/render.js",
  oceansChild: "/assets/audralia/audralia/hydration/oceans.render.js"
});

const CONTRACTS = Object.freeze({
  runtime: RECEIPT,
  previousRuntime: "AUDRALIA_RUNTIME_PATH_ALIGNMENT_TO_HYDRATION_PARENT_TREE_TNT_v1",
  tectonicsParent: "AUDRALIA_TECTONICS_DERIVATIVE_ORIGIN_PARENT_TNT_v1",
  topologyChild: "AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1",
  terrainGrandchild: "AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1",
  hydrationParent: "AUDRALIA_HYDRATION_PARENT_TECTONIC_GENEALOGY_ALIGNMENT_TNT_v1",
  oceansChild: "AUDRALIA_HYDRATION_OCEANS_CHILD_TURQUOISE_DEPTH_GRADIENT_TNT_v1",
  routeExpected: "AUDRALIA_ROUTE_RUNTIME_HYDRATION_WATER_RENDER_TNT_v1"
});

const RUNTIME_LAW = Object.freeze({
  genealogy: "tectonics→topology→terrain→hydration(parent→oceans_child)",
  layerOrder: Object.freeze(["tectonics_parent", "topology_child", "terrain_grandchild", "hydration_parent"]),
  tectonicsFirst: true,
  topologySecond: true,
  terrainThird: true,
  hydrationParentFourth: true,

  consumesTectonicsParent: true,
  consumesTopologyChild: true,
  consumesTerrainGrandchild: true,
  consumesHydrationParent: true,
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

  ownsTectonics: false,
  ownsTopology: false,
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

function buildSafeField(label, fallback, fn) {
  try {
    const field = fn();
    return Object.freeze({
      field: field || fallback,
      fallbackUsed: !field,
      label
    });
  } catch (error) {
    return Object.freeze({
      field: fallback,
      fallbackUsed: true,
      label,
      error: error && error.message ? error.message : String(error)
    });
  }
}

function getRuntimeOptions(options = {}) {
  return Object.freeze({
    fieldWidth: normalizeDimension(options.fieldWidth, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth),
    fieldHeight: normalizeDimension(options.fieldHeight, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight),
    tectonicsContext: Object.freeze({ ...(options.tectonicsContext || {}) }),
    topologyContext: Object.freeze({ ...(options.topologyContext || {}) }),
    terrainContext: Object.freeze({ ...(options.terrainContext || {}) }),
    hydrationContext: Object.freeze({ ...(options.hydrationContext || {}) }),
    hydrationEnabled: true,
    hydrationHeld: false,
    hydrationAllowedToRender: true,
    consumesTectonicGenealogy: true,
    consumesHydrationParent: true,
    oceansChildConsumedThroughHydrationParent: true,
    runtimeImportsOceansDirectly: false,
    waterFirstVisualAuthority: true,
    visualPassClaimed: false
  });
}

function fallbackTectonics(u, v) {
  const point = normalizeUV(u, v);
  return Object.freeze({
    receipt: "RUNTIME_GENEALOGY_FALLBACK_TECTONICS",
    fallbackUsed: true,
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    tectonicType: "fallback_stable_crust",
    crustalStressIndex: 0,
    trenchReinforcementPermission: 0,
    terrainPressureHandoff: 0,
    visualPassClaimed: false
  });
}

function fallbackTopology(u, v) {
  const point = normalizeUV(u, v);
  const ice = point.lat < -0.82 || point.lat > 0.90;

  return Object.freeze({
    receipt: "RUNTIME_GENEALOGY_FALLBACK_TOPOLOGY",
    fallbackUsed: true,
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    isLandFootprint: false,
    isAboveWaterLandFootprint: false,
    isVoidFootprint: !ice,
    isWaterFootprint: !ice,
    isPolarIceFootprint: ice,
    isSouthPolarIceFootprint: point.lat < -0.82,
    isNorthPolarIceFootprint: point.lat > 0.90,
    isBeach: false,
    isSand: false,
    surfaceClass: ice ? "polar_ice_footprint" : "fallback_open_ocean_blueprint",
    topologySurfaceClass: ice ? "polar_ice_footprint" : "fallback_open_ocean_blueprint",
    oceanDepthIndex: ice ? 0 : 0.62,
    bathymetryBlueprintIndex: ice ? 0 : 0.58,
    shelfDepthIndex: ice ? 0 : 0.18,
    trenchDepthIndex: 0,
    shorelinePressure: 0,
    beachOutlinePressure: 0,
    visualPassClaimed: false
  });
}

function fallbackTerrain(u, v, topology) {
  const land = Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint));
  const ice = Boolean(topology && (topology.isPolarIceFootprint || topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint));

  return Object.freeze({
    receipt: "RUNTIME_GENEALOGY_FALLBACK_TERRAIN",
    fallbackUsed: true,
    u,
    v,
    isLand: land,
    isIce: ice,
    normalizedElevation: land ? 0.24 : -0.48,
    riverbedPressure: 0,
    streamPressure: 0,
    lakeBasinPressure: 0,
    glacierSeatPressure: ice ? 0.8 : 0,
    hydrologyReadinessIndex: 0,
    visualPassClaimed: false
  });
}

function fallbackHydration(u, v, topology) {
  const land = Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint));
  const ice = Boolean(topology && (topology.isPolarIceFootprint || topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint));
  const ocean = !land && !ice;

  return Object.freeze({
    receipt: "RUNTIME_GENEALOGY_FALLBACK_HYDRATION",
    fallbackUsed: true,
    u,
    v,
    hydrationParentActive: true,
    hydrationParentTectonicGenealogyAligned: false,
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
    landStillVisibleAfterHydration: land,
    exposedLandAfterSeaLevel: land,
    hydrationColorInfluence: null
  });
}

function getTectonics(cache, u, v) {
  if (cache.tectonicsField) return getTectonicsSampleFromField(cache.tectonicsField, u, v);
  return safeCall(fallbackTectonics(u, v), () => sampleTectonics(u, v, cache.runtimeOptions.tectonicsContext));
}

function getTopology(cache, u, v, tectonics) {
  if (cache.topologyField) return getTopologySampleFromField(cache.topologyField, u, v);
  return safeCall(fallbackTopology(u, v), () => sampleTopology(u, v, { ...cache.runtimeOptions.topologyContext, tectonics }));
}

function getTerrain(cache, u, v, topology, tectonics) {
  if (cache.terrainField) return getTerrainSampleFromField(cache.terrainField, u, v);
  return safeCall(fallbackTerrain(u, v, topology), () => sampleTerrain(u, v, { ...cache.runtimeOptions.terrainContext, topology, tectonics }));
}

function getHydration(cache, u, v, topology, terrain, tectonics) {
  if (cache.hydrationField) return getHydrationSampleFromField(cache.hydrationField, u, v);
  return safeCall(fallbackHydration(u, v, topology), () => sampleHydration(u, v, { ...cache.runtimeOptions.hydrationContext, topology, terrain, tectonics }));
}

function landFromTopology(topology) {
  return Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint || topology.topologyLandFootprint));
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

function waterFromHydration(hydration, topologyLand, ice) {
  if (ice) return true;

  const waterClass = String(hydration && hydration.waterClass ? hydration.waterClass : "");

  if (topologyLand) {
    return (
      waterClass === "river_flow" ||
      waterClass === "stream_flow" ||
      waterClass === "lake_fill" ||
      waterClass === "glacier_mass" ||
      waterClass === "snowpack_source" ||
      waterClass === "floodplain_wetland" ||
      waterClass === "delta_wetland" ||
      waterClass === "spring_seep"
    );
  }

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
        waterClass.includes("water") ||
        waterClass.includes("ocean") ||
        waterClass.includes("river") ||
        waterClass.includes("lake") ||
        waterClass.includes("glacier")
      )
  );
}

function visualSurfaceClass(hydration, topology, visibleLand, ice, water) {
  if (ice || hydration.isGlacier || hydration.waterClass === "glacier_mass") return "glacier_ice_snowpack_surface";
  if (visibleLand && (topology.isBeach || topology.isSand)) return "beach_outline_land_surface";
  if (visibleLand) return "inland_terrain_pending_surface";
  if (hydration.isTrenchWater || hydration.waterClass === "trench_water") return "trench_ocean_water_surface";
  if (hydration.isDeepOcean || hydration.waterClass === "deep_ocean_water") return "deep_ocean_water_surface";
  if (hydration.isShelfWater || hydration.waterClass === "shelf_water") return "shelf_water_surface";
  if (hydration.isCoastalWater || hydration.waterClass === "coastal_water") return "coastal_turquoise_water_surface";
  if (hydration.isOceanWater || hydration.waterClass === "ocean_water") return "ocean_water_surface";
  if (hydration.isLake) return "lake_water_surface";
  if (hydration.isRiver) return "river_water_surface";
  if (hydration.isStream) return "stream_water_surface";
  if (water) return "water_surface";
  return "open_ocean_water_surface";
}

function composeRuntimeSample(cache, uInput, vInput) {
  const point = normalizeUV(uInput, vInput);

  const tectonics = getTectonics(cache, point.u, point.v);
  const topology = getTopology(cache, point.u, point.v, tectonics);
  const terrain = getTerrain(cache, point.u, point.v, topology, tectonics);
  const hydration = getHydration(cache, point.u, point.v, topology, terrain, tectonics);

  const topologyLand = landFromTopology(topology);
  const ice = iceFromTopology(topology);
  const water = waterFromHydration(hydration, topologyLand, ice);
  const visibleLand = topologyLand && !water && !ice;
  const surfaceClass = visualSurfaceClass(hydration, topology, visibleLand, ice, water);

  const fallbackFlags = Object.freeze({
    tectonicsFallbackUsed: Boolean(tectonics && tectonics.fallbackUsed),
    topologyFallbackUsed: Boolean(topology && topology.fallbackUsed),
    terrainFallbackUsed: Boolean(terrain && terrain.fallbackUsed),
    hydrationFallbackUsed: Boolean(hydration && hydration.fallbackUsed)
  });

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,
    fallbackFlags,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    runtimeChain: "tectonics→topology→terrain→hydration(parent→oceans_child)",
    tectonicsReceipt: tectonics.receipt || "unknown",
    topologyReceipt: topology.receipt || "unknown",
    terrainReceipt: terrain.receipt || "unknown",
    hydrationReceipt: hydration.receipt || "unknown",
    oceansReceipt: hydration.oceansReceipt || "unknown",

    consumesTectonicsParent: true,
    consumesTopologyChild: true,
    consumesTerrainGrandchild: true,
    consumesHydrationParent: true,
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
    isOceanWater: !topologyLand && Boolean(hydration.isOceanWater),
    isCoastalWater: !topologyLand && Boolean(hydration.isCoastalWater),
    isShelfWater: !topologyLand && Boolean(hydration.isShelfWater),
    isDeepOcean: !topologyLand && Boolean(hydration.isDeepOcean),
    isTrenchWater: !topologyLand && Boolean(hydration.isTrenchWater),
    isRiver: Boolean(hydration.isRiver),
    isStream: Boolean(hydration.isStream),
    isLake: Boolean(hydration.isLake),
    isGlacier: Boolean(hydration.isGlacier),

    oceanClass: hydration.oceanClass || "unknown",
    oceanClassId: Number(hydration.oceanClassId) || 0,
    oceanActive: !topologyLand && !ice && Boolean(hydration.oceanActive),
    oceanFromHydrationParent: true,
    oceansChildActive: Boolean(hydration.oceansChildActive),
    oceansMayFillOnlyTopologyVoid: true,
    oceanDoesNotOwnLand: true,
    landPreservedByTopology: true,

    visibleWaterDepthClass: !topologyLand ? hydration.visibleWaterDepthClass || "none" : "land_preserved",
    visibleWaterDepthIndex: !topologyLand ? clamp(Number(hydration.visibleWaterDepthIndex) || 0, 0, 1) : 0,
    waterVisibilityIndex: !topologyLand ? clamp(Number(hydration.waterVisibilityIndex) || 0, 0, 1) : 0,
    coastalTurquoiseIndex: !topologyLand ? clamp(Number(hydration.coastalTurquoiseIndex) || 0, 0, 1) : 0,
    coastalShelfBlueIndex: !topologyLand ? clamp(Number(hydration.coastalShelfBlueIndex) || 0, 0, 1) : 0,
    shelfWaterIndex: !topologyLand ? clamp(Number(hydration.shelfWaterIndex) || 0, 0, 1) : 0,
    openOceanIndex: !topologyLand ? clamp(Number(hydration.openOceanIndex) || 0, 0, 1) : 0,
    deepOceanIndex: !topologyLand ? clamp(Number(hydration.deepOceanIndex) || 0, 0, 1) : 0,
    trenchWaterIndex: !topologyLand ? clamp(Number(hydration.trenchWaterIndex) || 0, 0, 1) : 0,
    deepOceanBlueIndex: !topologyLand ? clamp(Number(hydration.deepOceanBlueIndex) || Number(hydration.deepOceanIndex) || 0, 0, 1) : 0,
    trenchDarknessIndex: !topologyLand ? clamp(Number(hydration.trenchDarknessIndex) || Number(hydration.trenchWaterIndex) || 0, 0, 1) : 0,

    oceanDepthIndex: !topologyLand ? clamp(Number(hydration.oceanDepthIndex) || Number(topology.oceanDepthIndex) || 0, 0, 1) : 0,
    bathymetryHydrationIndex: !topologyLand ? clamp(Number(hydration.bathymetryHydrationIndex) || Number(topology.bathymetryBlueprintIndex) || 0, 0, 1) : 0,
    trenchHydrationIndex: !topologyLand ? clamp(Number(hydration.trenchHydrationIndex) || Number(topology.trenchDepthIndex) || 0, 0, 1) : 0,
    shelfPressure: !topologyLand ? clamp(Number(hydration.shelfPressure) || Number(topology.shelfDepthIndex) || 0, 0, 1) : 0,
    coastalWaterPressure: !topologyLand ? clamp(Number(hydration.coastalWaterPressure) || Number(topology.coastalExposureIndex) || 0, 0, 1) : 0,

    beachOutlinePressure: clamp(Number(hydration.beachOutlinePressure) || Number(topology.beachOutlinePressure) || 0, 0, 1),
    beachContactRimIndex: clamp(Number(hydration.beachContactRimIndex) || 0, 0, 1),
    beachWaterContactIndex: clamp(Number(hydration.beachWaterContactIndex) || 0, 0, 1),
    beachRimStillVisible: Boolean(hydration.beachRimStillVisible),
    sandCoveredByHydration: false,

    exposedLandAfterSeaLevel: Boolean(hydration.exposedLandAfterSeaLevel),
    landStillVisibleAfterHydration: visibleLand,
    exposedLandVisibilityIndex: visibleLand ? clamp(Number(hydration.exposedLandVisibilityIndex) || 0.74, 0, 1) : 0,
    exposedLandClass: visibleLand ? hydration.exposedLandClass || "land_preserved_by_runtime" : "covered_or_not_land",

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

    ownsTectonics: false,
    ownsTopology: false,
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
  const tectonicsBuild = buildSafeField("tectonics", null, () => buildTectonicsField(options.fieldWidth, options.fieldHeight, options.tectonicsContext));
  const topologyBuild = buildSafeField("topology", null, () => buildTopologyField(options.fieldWidth, options.fieldHeight, { ...options.topologyContext, tectonicsField: tectonicsBuild.field }));
  const terrainBuild = buildSafeField("terrain", null, () => buildTerrainField(options.fieldWidth, options.fieldHeight, { ...options.terrainContext, topologyField: topologyBuild.field, tectonicsField: tectonicsBuild.field }));
  const hydrationBuild = buildSafeField("hydration", null, () => buildHydrationField(options.fieldWidth, options.fieldHeight, { ...options.hydrationContext, tectonicsField: tectonicsBuild.field, topologyField: topologyBuild.field, terrainField: terrainBuild.field }));

  const cache = {
    receipt: RECEIPT,
    runtimeOptions: options,
    fieldWidth: options.fieldWidth,
    fieldHeight: options.fieldHeight,
    tectonicsField: tectonicsBuild.field,
    topologyField: topologyBuild.field,
    terrainField: terrainBuild.field,
    hydrationField: hydrationBuild.field,
    fallbackReport: Object.freeze({
      tectonicsFallbackUsed: tectonicsBuild.fallbackUsed,
      topologyFallbackUsed: topologyBuild.fallbackUsed,
      terrainFallbackUsed: terrainBuild.fallbackUsed,
      hydrationFallbackUsed: hydrationBuild.fallbackUsed
    }),
    tectonicsStatus: safeCall(null, () => getTectonicsStatus()),
    topologyStatus: safeCall(null, () => getTopologyStatus()),
    terrainStatus: safeCall(null, () => getTerrainStatus()),
    hydrationStatus: safeCall(null, () => getHydrationStatus())
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
  let fallbackSamples = 0;
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

      if (
        sample.fallbackFlags &&
        (
          sample.fallbackFlags.tectonicsFallbackUsed ||
          sample.fallbackFlags.topologyFallbackUsed ||
          sample.fallbackFlags.terrainFallbackUsed ||
          sample.fallbackFlags.hydrationFallbackUsed
        )
      ) {
        fallbackSamples += 1;
      }

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
    tectonicsField: tectonicsBuild.field,
    topologyField: topologyBuild.field,
    terrainField: terrainBuild.field,
    hydrationField: hydrationBuild.field,
    fallbackReport: cache.fallbackReport,
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
        fallbackSamples,
        waterRatio: samples.length ? waterSamples / samples.length : 0,
        landRatio: samples.length ? landSamples / samples.length : 0,
        oceanRatio: samples.length ? oceanSamples / samples.length : 0,
        coastalRatio: samples.length ? coastalSamples / samples.length : 0,
        shelfRatio: samples.length ? shelfSamples / samples.length : 0,
        deepRatio: samples.length ? deepSamples / samples.length : 0,
        trenchRatio: samples.length ? trenchSamples / samples.length : 0,
        visibleLandRatio: samples.length ? visibleLandSamples / samples.length : 0,
        fallbackRatio: samples.length ? fallbackSamples / samples.length : 0,
        maxTurquoise,
        maxDepth,
        visualSurfaceClasses: Object.freeze(Array.from(visualSurfaceClasses)),
        consumesTectonicGenealogy: true,
        consumesHydrationParent: true,
        oceansChildConsumedThroughHydrationParent: true,
        runtimeImportsOceansDirectly: false,
        waterFirstVisualAuthority: true,
        visualPassClaimed: false
      })
    }),
    tectonicsStatus: cache.tectonicsStatus,
    topologyStatus: cache.topologyStatus,
    terrainStatus: cache.terrainStatus,
    hydrationStatus: cache.hydrationStatus,
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
        genealogy: RUNTIME_LAW.genealogy,

        tectonicsLoaded: Boolean(cache.tectonicsField && cache.tectonicsField.samples),
        topologyLoaded: Boolean(cache.topologyField && cache.topologyField.samples),
        terrainLoaded: Boolean(cache.terrainField && cache.terrainField.samples),
        hydrationLoaded: Boolean(cache.hydrationField && cache.hydrationField.samples),
        runtimeFieldLoaded: Boolean(cache.runtimeField && cache.runtimeField.samples),

        fallbackReport: cache.fallbackReport,

        tectonicsStatus: cache.tectonicsStatus,
        topologyStatus: cache.topologyStatus,
        terrainStatus: cache.terrainStatus,
        hydrationStatus: cache.hydrationStatus,
        runtimeFieldStats: cache.runtimeField.stats,

        consumesTectonicsParent: true,
        consumesTopologyChild: true,
        consumesTerrainGrandchild: true,
        consumesHydrationParent: true,
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

        ownsTectonics: false,
        ownsTopology: false,
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
