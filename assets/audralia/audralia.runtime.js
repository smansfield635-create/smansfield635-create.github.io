// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1
//
// Active renewal:
// - AUDRALIA_RUNTIME_ROUTE_COMPAT_SURFACE_DIAGNOSTIC_RENEWAL_TNT_v2
//
// Role:
// - Audralia runtime authority.
// - Consumes the renewed surface genealogy:
//   tectonics → topology → terrain → hydration(parent → oceans child)
// - Preserves topology-authorized land.
// - Allows terrain relief and beach outline to pass to the route.
// - Allows hydration/water to pass to the route.
// - Exposes fallback, land, water, relief, and visual-surface diagnostics.
// - Keeps route compatibility by preserving the expected runtime receipt.
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
// - No terrain overwrite.
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

const RECEIPT = "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_RUNTIME_ROUTE_COMPAT_SURFACE_DIAGNOSTIC_RENEWAL_TNT_v2";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_RUNTIME_CONSUME_TECTONIC_GENEALOGY_HYDRATION_PARENT_TNT_v1",
  "AUDRALIA_RUNTIME_PATH_ALIGNMENT_TO_HYDRATION_PARENT_TREE_TNT_v1",
  "AUDRALIA_RUNTIME_CONSUME_HYDRATION_PARENT_OCEANS_CHILD_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_RUNTIME_ROUTE_COMPAT_SURFACE_DIAGNOSTIC";
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
  activeRenewal: ACTIVE_RENEWAL,
  tectonicsParent: "AUDRALIA_TECTONICS_DERIVATIVE_ORIGIN_PARENT_TNT_v1",
  topologyChild: "AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1",
  terrainGrandchild: "AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1",
  hydrationParent: "AUDRALIA_HYDRATION_PARENT_TECTONIC_GENEALOGY_ALIGNMENT_TNT_v1",
  routeExpected: "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1"
});

const RUNTIME_LAW = Object.freeze({
  genealogy: "tectonics→topology→terrain→hydration(parent→oceans_child)",
  layerOrder: Object.freeze(["tectonics_parent", "topology_child", "terrain_grandchild", "hydration_parent"]),

  consumesTectonicsParent: true,
  consumesTopologyChild: true,
  consumesTerrainGrandchild: true,
  consumesHydrationParent: true,
  oceansChildConsumedThroughHydrationParent: true,
  runtimeImportsOceansDirectly: false,

  allowsTectonics: true,
  allowsTopology: true,
  allowsTerrain: true,
  allowsHydration: true,
  allowsWater: true,
  allowsLand: true,
  allowsBeachOutline: true,
  allowsRelief: true,

  topologyLandControlsLandPreservation: true,
  hydrationCannotEraseTopologyLand: true,
  oceansMayFillOnlyTopologyVoid: true,

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

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 256,
  fieldHeight: 128,
  minFieldWidth: 96,
  minFieldHeight: 48,
  maxFieldWidth: 320,
  maxFieldHeight: 160
});

let sharedRuntime = null;

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function normalizeDimension(value, fallback, min, max) {
  return clamp(Math.floor(Number(value) || fallback), min, max);
}

function normalizeUV(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);
  return Object.freeze({ u, v, lon: u * 2 - 1, lat: 1 - v * 2 });
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
      label,
      field: field || fallback,
      fallbackUsed: !field,
      error: null
    });
  } catch (error) {
    return Object.freeze({
      label,
      field: fallback,
      fallbackUsed: true,
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

    consumesTectonicGenealogy: true,
    consumesHydrationParent: true,
    runtimeImportsOceansDirectly: false,

    allowsTectonics: true,
    allowsTopology: true,
    allowsTerrain: true,
    allowsHydration: true,
    allowsWater: true,
    allowsLand: true,
    allowsBeachOutline: true,
    allowsRelief: true,

    topologyLandControlsLandPreservation: true,
    hydrationCannotEraseTopologyLand: true,
    oceansMayFillOnlyTopologyVoid: true,

    hydrationHeld: false,
    hydrationAllowedToRender: true,
    landPreservationFirst: true,

    foliageEnabled: false,
    climateEnabled: false,
    ecologyEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    visualPassClaimed: false
  });
}

function fallbackTectonics(u, v) {
  const point = normalizeUV(u, v);

  return Object.freeze({
    receipt: "RUNTIME_V2_FALLBACK_TECTONICS",
    fallbackUsed: true,
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    tectonicType: "fallback_stable_crust",
    plateId: 0,
    plateKey: "fallback_plate",
    boundaryId: "fallback_none",
    crustalStressIndex: 0,
    mountainChainPermission: 0,
    canyonPermission: 0,
    cliffPermission: 0,
    upliftPermission: 0,
    trenchReinforcementPermission: 0,
    terrainPressureHandoff: 0,
    diamondPressureIndex: 0,
    opalSeamIndex: 0,
    graniteCratonIndex: 0,
    slateFoldBeltIndex: 0,
    exposedMineralHardnessIndex: 0,
    visualPassClaimed: false
  });
}

function fallbackTopology(u, v) {
  const point = normalizeUV(u, v);
  const polar = Math.abs(point.lat) > 0.88;

  return Object.freeze({
    receipt: "RUNTIME_V2_FALLBACK_TOPOLOGY",
    fallbackUsed: true,
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    isLandFootprint: false,
    isAboveWaterLandFootprint: false,
    topologyLandFootprint: false,
    landPreservationGate: false,
    isVoidFootprint: !polar,
    isWaterFootprint: !polar,
    isPolarIceFootprint: polar,
    isSouthPolarIceFootprint: point.lat < -0.88,
    isNorthPolarIceFootprint: point.lat > 0.88,
    isBeach: false,
    isSand: false,
    isShelf: false,
    isCoastline: false,
    surfaceClass: polar ? "polar_ice_footprint" : "fallback_open_ocean_blueprint",
    topologySurfaceClass: polar ? "polar_ice_footprint" : "fallback_open_ocean_blueprint",
    surfaceClassId: polar ? 12 : 2,
    oceanDepthIndex: polar ? 0 : 0.62,
    bathymetryBlueprintIndex: polar ? 0 : 0.58,
    shelfDepthIndex: 0,
    trenchDepthIndex: 0,
    shorelinePressure: 0,
    beachOutlinePressure: 0,
    beachWaterContactIndex: 0,
    terrainRisePermission: 0,
    terrainBlockPermission: 1,
    hydrationMayNotConvertLandToOcean: true,
    visualPassClaimed: false
  });
}

function fallbackTerrain(u, v, topology) {
  const land = topologyIsLand(topology);
  const ice = topologyIsIce(topology);

  return Object.freeze({
    receipt: "RUNTIME_V2_FALLBACK_TERRAIN",
    fallbackUsed: true,
    u,
    v,
    isLand: land,
    isWater: !land && !ice,
    isIce: ice,
    normalizedElevation: land ? 0.24 : -0.48,
    elevationMeters: land ? 2200 : -2700,
    ridge: 0,
    mountainPressure: 0,
    basin: land ? 0.20 : 0.56,
    slope: 0,
    canyonPressure: 0,
    cliffPressure: 0,
    riverbedPressure: 0,
    streamPressure: 0,
    lakeBasinPressure: 0,
    glacierSeatPressure: ice ? 0.8 : 0,
    snowpackSourcePressure: ice ? 0.7 : 0,
    valleyChannelPressure: 0,
    floodplainPressure: 0,
    deltaReceiverPressure: 0,
    hydrologyReadinessIndex: 0,
    visualPassClaimed: false
  });
}

function fallbackHydration(u, v, topology, terrain) {
  const land = topologyIsLand(topology);
  const ice = topologyIsIce(topology);
  const ocean = !land && !ice;

  return Object.freeze({
    receipt: "RUNTIME_V2_FALLBACK_HYDRATION",
    fallbackUsed: true,
    u,
    v,

    hydrationParentActive: true,
    hydrationParentTectonicGenealogyAligned: false,
    oceansChildActive: false,

    waterClass: ice ? "glacier_mass" : ocean ? "ocean_water" : "dry_land",
    waterClassId: ice ? 15 : ocean ? 70 : 0,
    visualHydrationClass: ice ? "glacier_mass" : ocean ? "ocean_water" : "exposed_land",

    isHydrated: ocean || ice,
    isOceanWater: ocean,
    isCoastalWater: false,
    isShelfWater: false,
    isDeepOcean: false,
    isTrenchWater: false,
    isRiver: false,
    isStream: false,
    isLake: false,
    isGlacier: ice,
    isSnowpack: false,
    isFloodplain: false,
    isDelta: false,
    isSpring: false,
    isSubterraneanWater: false,

    oceanActive: ocean,
    oceanClass: ocean ? "open_ocean" : ice ? "polar_ice" : "not_ocean",
    oceanClassId: ocean ? 70 : ice ? 15 : 0,
    oceanDepthIndex: ocean ? 0.62 : 0,
    visibleWaterDepthIndex: ocean ? 0.62 : 0,
    waterVisibilityIndex: ocean ? 0.70 : 0,
    coastalTurquoiseIndex: 0,
    coastalShelfBlueIndex: 0,
    shelfWaterIndex: ocean ? 0.18 : 0,
    openOceanIndex: ocean ? 0.76 : 0,
    deepOceanIndex: ocean ? 0.46 : 0,
    trenchWaterIndex: 0,

    landStillVisibleAfterHydration: land,
    exposedLandAfterSeaLevel: land,
    exposedLandVisibilityIndex: land ? 0.74 : 0,
    beachRimStillVisible: Boolean(topology && topology.isBeach),
    sandCoveredByHydration: false,

    surfaceWaterIndex: ocean || ice ? 0.70 : 0,
    hydrationActivationIndex: ocean || ice ? 0.70 : 0,

    riverFlowPressure: 0,
    streamFlowPressure: 0,
    lakeFillPressure: 0,
    glacierMassPressure: ice ? 0.8 : 0,
    snowpackPressure: ice ? 0.7 : 0,
    floodplainWetness: 0,
    deltaWetness: 0,
    springSeepPressure: 0,
    subterraneanWaterPressure: 0,

    hydrationColorInfluence: null,

    oceanDoesNotOwnLand: true,
    landPreservedByTopology: land,
    visualPassClaimed: false
  });
}

function topologyIsLand(topology) {
  return Boolean(
    topology &&
      (
        topology.isLandFootprint ||
        topology.isAboveWaterLandFootprint ||
        topology.topologyLandFootprint ||
        topology.landPreservationGate
      )
  );
}

function topologyIsIce(topology) {
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

function topologyIsBeach(topology) {
  return Boolean(
    topology &&
      (
        topology.isBeach ||
        topology.isSand ||
        String(topology.beachType || "").includes("beach") ||
        String(topology.surfaceClass || "").includes("beach") ||
        String(topology.topologySurfaceClass || "").includes("beach") ||
        Number(topology.beachOutlinePressure) > 0.18
      )
  );
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
  return safeCall(fallbackHydration(u, v, topology, terrain), () => sampleHydration(u, v, { ...cache.runtimeOptions.hydrationContext, topology, terrain, tectonics }));
}

function hydrationWetsLand(hydration, topologyLand, ice) {
  if (!topologyLand && !ice) return false;
  if (ice) return true;

  const waterClass = String(hydration && hydration.waterClass ? hydration.waterClass : "");

  return (
    waterClass === "river_flow" ||
    waterClass === "stream_flow" ||
    waterClass === "lake_fill" ||
    waterClass === "glacier_mass" ||
    waterClass === "snowpack_source" ||
    waterClass === "floodplain_wetland" ||
    waterClass === "delta_wetland" ||
    waterClass === "spring_seep" ||
    Boolean(hydration && hydration.isRiver) ||
    Boolean(hydration && hydration.isStream) ||
    Boolean(hydration && hydration.isLake) ||
    Boolean(hydration && hydration.isGlacier) ||
    Boolean(hydration && hydration.isSnowpack) ||
    Boolean(hydration && hydration.isFloodplain) ||
    Boolean(hydration && hydration.isDelta) ||
    Boolean(hydration && hydration.isSpring)
  );
}

function hydrationIsVoidWater(hydration, topologyLand, ice) {
  if (topologyLand || ice) return false;

  const waterClass = String(hydration && hydration.waterClass ? hydration.waterClass : "");

  return Boolean(
    hydration &&
      (
        hydration.isOceanWater ||
        hydration.isCoastalWater ||
        hydration.isShelfWater ||
        hydration.isDeepOcean ||
        hydration.isTrenchWater ||
        waterClass === "ocean_water" ||
        waterClass === "coastal_water" ||
        waterClass === "shelf_water" ||
        waterClass === "deep_ocean_water" ||
        waterClass === "trench_water" ||
        waterClass.includes("ocean")
      )
  );
}

function surfaceClassFor(topology, terrain, hydration, topologyLand, ice, landWet, voidWater) {
  if (ice || hydration.isGlacier || hydration.waterClass === "glacier_mass") {
    return "glacier_ice_snowpack_surface";
  }

  if (topologyLand && landWet) {
    if (hydration.isLake || hydration.waterClass === "lake_fill") return "lake_water_on_land_surface";
    if (hydration.isRiver || hydration.waterClass === "river_flow") return "river_water_on_land_surface";
    if (hydration.isStream || hydration.waterClass === "stream_flow") return "stream_water_on_land_surface";
    if (hydration.isFloodplain || hydration.waterClass === "floodplain_wetland") return "floodplain_wetland_surface";
    if (hydration.isDelta || hydration.waterClass === "delta_wetland") return "delta_wetland_surface";
    if (hydration.isSpring || hydration.waterClass === "spring_seep") return "spring_seep_land_surface";
    return "land_water_feature_surface";
  }

  if (topologyLand) {
    if (topologyIsBeach(topology)) return "beach_outline_land_surface";
    if (Number(terrain.ridge) > 0.52 || Number(terrain.mountainPressure) > 0.52) return "mountain_relief_land_surface";
    if (Number(terrain.canyonPressure) > 0.50) return "canyon_cut_land_surface";
    if (Number(terrain.cliffPressure) > 0.50) return "cliff_rock_land_surface";
    return "inland_terrain_land_surface";
  }

  if (hydration.isTrenchWater || hydration.waterClass === "trench_water") return "trench_ocean_water_surface";
  if (hydration.isDeepOcean || hydration.waterClass === "deep_ocean_water") return "deep_ocean_water_surface";
  if (hydration.isShelfWater || hydration.waterClass === "shelf_water") return "shelf_water_surface";
  if (hydration.isCoastalWater || hydration.waterClass === "coastal_water") return "coastal_turquoise_water_surface";
  if (hydration.isOceanWater || hydration.waterClass === "ocean_water" || voidWater) return "ocean_water_surface";

  return "open_ocean_water_surface";
}

function composeRuntimeSample(cache, uInput, vInput) {
  const point = normalizeUV(uInput, vInput);

  const tectonics = getTectonics(cache, point.u, point.v);
  const topology = getTopology(cache, point.u, point.v, tectonics);
  const terrain = getTerrain(cache, point.u, point.v, topology, tectonics);
  const hydration = getHydration(cache, point.u, point.v, topology, terrain, tectonics);

  const topologyLand = topologyIsLand(topology);
  const ice = topologyIsIce(topology);
  const beach = topologyIsBeach(topology);

  const landWet = hydrationWetsLand(hydration, topologyLand, ice);
  const voidWater = hydrationIsVoidWater(hydration, topologyLand, ice);

  const landVisibleToRoute = topologyLand && !ice && !landWet;
  const waterVisibleToRoute = ice || landWet || voidWater || (!topologyLand && !ice);
  const surfaceClass = surfaceClassFor(topology, terrain, hydration, topologyLand, ice, landWet, voidWater);

  const fallbackFlags = Object.freeze({
    tectonicsFallbackUsed: Boolean(tectonics && tectonics.fallbackUsed),
    topologyFallbackUsed: Boolean(topology && topology.fallbackUsed),
    terrainFallbackUsed: Boolean(terrain && terrain.fallbackUsed),
    hydrationFallbackUsed: Boolean(hydration && hydration.fallbackUsed)
  });

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,
    runtimeLaw: RUNTIME_LAW,
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

    allowsTectonics: true,
    allowsTopology: true,
    allowsTerrain: true,
    allowsHydration: true,
    allowsWater: true,
    allowsLand: true,
    allowsBeachOutline: true,
    allowsRelief: true,

    topologyLandControlsLandPreservation: true,
    hydrationCannotEraseTopologyLand: true,
    oceansMayFillOnlyTopologyVoid: true,

    visualSurfaceClass: surfaceClass,
    visualSurfaceAuthority: "runtime",
    routeShouldPaintFromVisualSurfaceClass: true,

    isLandFootprint: landVisibleToRoute,
    isAboveWaterLandFootprint: landVisibleToRoute,
    isLand: landVisibleToRoute,
    isWater: waterVisibleToRoute,
    isIce: ice,

    topologyLandFootprint: topologyLand,
    topologyLandPreserved: topologyLand,
    landVisibleToRoute,
    waterVisibleToRoute,

    isVoidFootprint: !topologyLand && !ice,
    isWaterFootprint: !topologyLand && !ice,
    isBeach: landVisibleToRoute && beach,
    isSand: landVisibleToRoute && beach,

    topologySurfaceClass: topology.topologySurfaceClass || topology.surfaceClass || "unknown",
    topologySurfaceClassId: Number(topology.surfaceClassId) || 0,
    landBodyId: topology.landBodyId || 0,
    landBodyKey: topology.landBodyKey || "void_ocean",
    landBodyName: topology.landBodyName || "Void / Ocean Footprint",

    tectonicType: tectonics.tectonicType || "unknown",
    plateId: tectonics.plateId || 0,
    plateKey: tectonics.plateKey || "unknown",
    boundaryId: tectonics.boundaryId || "none",

    normalizedElevation: clamp(Number(terrain.normalizedElevation) || 0, -1, 1),
    elevationMeters: Number(terrain.elevationMeters) || 0,
    ridge: clamp(Number(terrain.ridge) || Number(terrain.mountainPressure) || 0, 0, 1),
    mountainPressure: clamp(Number(terrain.mountainPressure) || Number(terrain.ridge) || 0, 0, 1),
    basin: clamp(Number(terrain.basin) || 0, 0, 1),
    slope: clamp(Number(terrain.slope) || 0, 0, 1),
    canyonPressure: clamp(Number(terrain.canyonPressure) || 0, 0, 1),
    cliffPressure: clamp(Number(terrain.cliffPressure) || 0, 0, 1),
    riverbedPressure: clamp(Number(terrain.riverbedPressure) || 0, 0, 1),
    streamPressure: clamp(Number(terrain.streamPressure) || 0, 0, 1),
    lakeBasinPressure: clamp(Number(terrain.lakeBasinPressure) || 0, 0, 1),
    glacierSeatPressure: clamp(Number(terrain.glacierSeatPressure) || 0, 0, 1),
    valleyChannelPressure: clamp(Number(terrain.valleyChannelPressure) || 0, 0, 1),
    hydrologyReadinessIndex: clamp(Number(terrain.hydrologyReadinessIndex) || 0, 0, 1),

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
    isGlacier: Boolean(hydration.isGlacier) || ice,
    isSnowpack: Boolean(hydration.isSnowpack),
    isFloodplain: Boolean(hydration.isFloodplain),
    isDelta: Boolean(hydration.isDelta),
    isSpring: Boolean(hydration.isSpring),
    isSubterraneanWater: Boolean(hydration.isSubterraneanWater),

    oceanClass: hydration.oceanClass || "unknown",
    oceanClassId: Number(hydration.oceanClassId) || 0,
    oceanActive: !topologyLand && !ice && Boolean(hydration.oceanActive),
    oceanFromHydrationParent: true,
    oceansChildActive: Boolean(hydration.oceansChildActive),
    oceanDoesNotOwnLand: true,
    landPreservedByTopology: true,

    visibleWaterDepthClass: !topologyLand ? hydration.visibleWaterDepthClass || hydration.oceanClass || "none" : "land_preserved",
    visibleWaterDepthIndex: !topologyLand ? clamp(Number(hydration.visibleWaterDepthIndex) || Number(hydration.oceanDepthIndex) || 0, 0, 1) : 0,
    waterVisibilityIndex: !topologyLand ? clamp(Number(hydration.waterVisibilityIndex) || 0, 0, 1) : 0,
    coastalTurquoiseIndex: !topologyLand ? clamp(Number(hydration.coastalTurquoiseIndex) || 0, 0, 1) : 0,
    coastalShelfBlueIndex: !topologyLand ? clamp(Number(hydration.coastalShelfBlueIndex) || 0, 0, 1) : 0,
    shelfWaterIndex: !topologyLand ? clamp(Number(hydration.shelfWaterIndex) || 0, 0, 1) : 0,
    openOceanIndex: !topologyLand ? clamp(Number(hydration.openOceanIndex) || 0, 0, 1) : 0,
    deepOceanIndex: !topologyLand ? clamp(Number(hydration.deepOceanIndex) || 0, 0, 1) : 0,
    trenchWaterIndex: !topologyLand ? clamp(Number(hydration.trenchWaterIndex) || 0, 0, 1) : 0,

    oceanDepthIndex: !topologyLand ? clamp(Number(hydration.oceanDepthIndex) || Number(topology.oceanDepthIndex) || 0, 0, 1) : 0,
    bathymetryHydrationIndex: !topologyLand ? clamp(Number(hydration.bathymetryHydrationIndex) || Number(topology.bathymetryBlueprintIndex) || 0, 0, 1) : 0,
    trenchHydrationIndex: !topologyLand ? clamp(Number(hydration.trenchHydrationIndex) || Number(topology.trenchDepthIndex) || 0, 0, 1) : 0,
    shelfPressure: !topologyLand ? clamp(Number(hydration.shelfPressure) || Number(topology.shelfDepthIndex) || 0, 0, 1) : 0,
    coastalWaterPressure: !topologyLand ? clamp(Number(hydration.coastalWaterPressure) || Number(topology.coastalExposureIndex) || 0, 0, 1) : 0,

    beachOutlinePressure: clamp(Number(hydration.beachOutlinePressure) || Number(topology.beachOutlinePressure) || 0, 0, 1),
    beachContactRimIndex: clamp(Number(hydration.beachContactRimIndex) || 0, 0, 1),
    beachWaterContactIndex: clamp(Number(hydration.beachWaterContactIndex) || Number(topology.beachWaterContactIndex) || 0, 0, 1),
    beachRimStillVisible: Boolean(hydration.beachRimStillVisible) || beach,
    sandCoveredByHydration: false,

    exposedLandAfterSeaLevel: topologyLand && !ice,
    landStillVisibleAfterHydration: landVisibleToRoute,
    exposedLandVisibilityIndex: landVisibleToRoute ? clamp(Number(hydration.exposedLandVisibilityIndex) || 0.74, 0, 1) : 0,
    exposedLandClass: landVisibleToRoute
      ? beach
        ? "beach_outline_land_preserved_by_runtime"
        : "terrain_land_preserved_by_runtime"
      : "covered_or_not_land",

    surfaceWaterIndex: clamp(Number(hydration.surfaceWaterIndex) || 0, 0, 1),
    hydrationActivationIndex: clamp(Number(hydration.hydrationActivationIndex) || 0, 0, 1),

    riverFlowPressure: clamp(Number(hydration.riverFlowPressure) || 0, 0, 1),
    streamFlowPressure: clamp(Number(hydration.streamFlowPressure) || 0, 0, 1),
    lakeFillPressure: clamp(Number(hydration.lakeFillPressure) || 0, 0, 1),
    glacierMassPressure: clamp(Number(hydration.glacierMassPressure) || 0, 0, 1),
    snowpackPressure: clamp(Number(hydration.snowpackPressure) || 0, 0, 1),
    floodplainWetness: clamp(Number(hydration.floodplainWetness) || 0, 0, 1),
    deltaWetness: clamp(Number(hydration.deltaWetness) || 0, 0, 1),
    springSeepPressure: clamp(Number(hydration.springSeepPressure) || 0, 0, 1),
    subterraneanWaterPressure: clamp(Number(hydration.subterraneanWaterPressure) || 0, 0, 1),

    hydrationColorInfluence: hydration.hydrationColorInfluence || null,

    terrainAllowedByTopology: topologyLand || ice,
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
  const tectonicsBuild = buildSafeField("tectonics", null, () =>
    buildTectonicsField(options.fieldWidth, options.fieldHeight, options.tectonicsContext)
  );

  const topologyBuild = buildSafeField("topology", null, () =>
    buildTopologyField(options.fieldWidth, options.fieldHeight, {
      ...options.topologyContext,
      tectonicsField: tectonicsBuild.field
    })
  );

  const terrainBuild = buildSafeField("terrain", null, () =>
    buildTerrainField(options.fieldWidth, options.fieldHeight, {
      ...options.terrainContext,
      tectonicsField: tectonicsBuild.field,
      topologyField: topologyBuild.field
    })
  );

  const hydrationBuild = buildSafeField("hydration", null, () =>
    buildHydrationField(options.fieldWidth, options.fieldHeight, {
      ...options.hydrationContext,
      tectonicsField: tectonicsBuild.field,
      topologyField: topologyBuild.field,
      terrainField: terrainBuild.field
    })
  );

  const cache = {
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
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
      hydrationFallbackUsed: hydrationBuild.fallbackUsed,
      tectonicsError: tectonicsBuild.error,
      topologyError: topologyBuild.error,
      terrainError: terrainBuild.error,
      hydrationError: hydrationBuild.error
    }),
    tectonicsStatus: safeCall(null, () => getTectonicsStatus()),
    topologyStatus: safeCall(null, () => getTopologyStatus()),
    terrainStatus: safeCall(null, () => getTerrainStatus()),
    hydrationStatus: safeCall(null, () => getHydrationStatus())
  };

  const samples = new Array(options.fieldWidth * options.fieldHeight);

  let waterSamples = 0;
  let landSamples = 0;
  let topologyLandSamples = 0;
  let oceanSamples = 0;
  let coastalSamples = 0;
  let shelfSamples = 0;
  let deepSamples = 0;
  let trenchSamples = 0;
  let visibleLandSamples = 0;
  let beachSamples = 0;
  let terrainReliefSamples = 0;
  let hydratedSamples = 0;
  let fallbackSamples = 0;

  let maxTurquoise = 0;
  let maxDepth = 0;
  let maxElevation = -1;
  let maxHydrationActivationIndex = 0;

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
      if (sample.topologyLandFootprint) topologyLandSamples += 1;
      if (sample.oceanActive) oceanSamples += 1;
      if (sample.isCoastalWater) coastalSamples += 1;
      if (sample.isShelfWater) shelfSamples += 1;
      if (sample.isDeepOcean) deepSamples += 1;
      if (sample.isTrenchWater) trenchSamples += 1;
      if (sample.landStillVisibleAfterHydration) visibleLandSamples += 1;
      if (sample.isBeach) beachSamples += 1;
      if (sample.isHydrated) hydratedSamples += 1;
      if (sample.ridge > 0.38 || sample.canyonPressure > 0.38 || sample.cliffPressure > 0.38) terrainReliefSamples += 1;

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
      maxElevation = Math.max(maxElevation, sample.normalizedElevation);
      maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, sample.hydrationActivationIndex);
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
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
      activeRenewal: ACTIVE_RENEWAL,
      width: options.fieldWidth,
      height: options.fieldHeight,
      samples,
      stats: Object.freeze({
        totalSamples: samples.length,

        waterSamples,
        landSamples,
        topologyLandSamples,
        oceanSamples,
        coastalSamples,
        shelfSamples,
        deepSamples,
        trenchSamples,
        visibleLandSamples,
        beachSamples,
        terrainReliefSamples,
        hydratedSamples,
        fallbackSamples,

        waterRatio: samples.length ? waterSamples / samples.length : 0,
        landRatio: samples.length ? landSamples / samples.length : 0,
        topologyLandRatio: samples.length ? topologyLandSamples / samples.length : 0,
        oceanRatio: samples.length ? oceanSamples / samples.length : 0,
        coastalRatio: samples.length ? coastalSamples / samples.length : 0,
        shelfRatio: samples.length ? shelfSamples / samples.length : 0,
        deepRatio: samples.length ? deepSamples / samples.length : 0,
        trenchRatio: samples.length ? trenchSamples / samples.length : 0,
        visibleLandRatio: samples.length ? visibleLandSamples / samples.length : 0,
        beachRatio: samples.length ? beachSamples / samples.length : 0,
        terrainReliefRatio: samples.length ? terrainReliefSamples / samples.length : 0,
        hydratedRatio: samples.length ? hydratedSamples / samples.length : 0,
        fallbackRatio: samples.length ? fallbackSamples / samples.length : 0,

        maxTurquoise,
        maxDepth,
        maxElevation,
        maxHydrationActivationIndex,

        visualSurfaceClasses: Object.freeze(Array.from(visualSurfaceClasses)),

        consumesTectonicGenealogy: true,
        consumesHydrationParent: true,
        oceansChildConsumedThroughHydrationParent: true,
        runtimeImportsOceansDirectly: false,

        allowsTectonics: true,
        allowsTopology: true,
        allowsTerrain: true,
        allowsHydration: true,
        allowsWater: true,
        allowsLand: true,
        allowsBeachOutline: true,
        allowsRelief: true,

        topologyLandControlsLandPreservation: true,
        hydrationCannotEraseTopologyLand: true,
        oceansMayFillOnlyTopologyVoid: true,

        graphicBox: false,
        imageGeneration: false,
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
    activeRenewal: ACTIVE_RENEWAL,
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
        activeRenewal: ACTIVE_RENEWAL,
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

        allowsTectonics: true,
        allowsTopology: true,
        allowsTerrain: true,
        allowsHydration: true,
        allowsWater: true,
        allowsLand: true,
        allowsBeachOutline: true,
        allowsRelief: true,

        topologyLandControlsLandPreservation: true,
        hydrationCannotEraseTopologyLand: true,
        oceansMayFillOnlyTopologyVoid: true,

        hydrationHeld: false,
        hydrationAllowedToRender: true,
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
  if (!sharedRuntime) {
    sharedRuntime = createAudraliaRuntime(context);
  }

  return sharedRuntime.sampleRuntimeState(u, v, context);
}

export function sampleAudraliaPlanetState(u, v, context = {}) {
  if (!sharedRuntime) {
    sharedRuntime = createAudraliaRuntime(context);
  }

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
  if (sharedRuntime && typeof sharedRuntime.getStatus === "function") {
    return sharedRuntime.getStatus();
  }

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active-lightweight",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,
    runtimeLaw: RUNTIME_LAW,
    genealogy: RUNTIME_LAW.genealogy,
    runtimeFieldLoaded: false,
    note: "Lightweight status returned before runtime field construction.",
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
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
