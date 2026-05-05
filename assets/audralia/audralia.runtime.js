// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_ALLOW_VISIBLE_HYDRATION_DEPTH_TNT_v1
//
// Role:
// - Audralia runtime authority.
// - Consumes topology first.
// - Consumes tectonics second.
// - Consumes terrain third.
// - Consumes visible-depth hydration fourth.
// - Allows hydration to reach the route/render chain.
// - Builds one composed runtime field so the route does not recompute the full chain per visible pixel.
// - Emits final visualSurfaceClass and water-first runtime flags.
//
// Core correction:
// - Runtime now imports the current hydration contract:
//   AUDRALIA_HYDRATION_VISIBLE_DEPTH_BEACH_RIM_EXPOSED_LAND_TNT_v1
// - Runtime no longer holds the render at the older sea-level hydration contract.
// - If no water is visible after this runtime is deployed and cache is cleared, the remaining failure is downstream route/render consumption.
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
// - No hydration overclaim of topology/terrain.
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
} from "./audralia.topology.render.js?v=AUDRALIA_TOPOLOGY_BEACH_OUTLINE_ONLY_WATER_DOMINANT_TNT_v1";

import {
  sampleTectonics,
  buildTectonicsField,
  getTectonicsSampleFromField,
  getTectonicsStatus
} from "./audralia.tectonics.render.js?v=AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1";

import {
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
} from "./audralia.terrain.render.js?v=AUDRALIA_G1_TERRAIN_STRONG_RELIEF_TOPOLOGY_TECTONICS_LOCK_TNT_v2";

import {
  sampleHydration,
  buildHydrationField,
  getHydrationSampleFromField,
  getHydrationStatus
} from "./audralia.hydration.render.js?v=AUDRALIA_HYDRATION_VISIBLE_DEPTH_BEACH_RIM_EXPOSED_LAND_TNT_v1";

const RECEIPT = "AUDRALIA_RUNTIME_ALLOW_VISIBLE_HYDRATION_DEPTH_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_RUNTIME_CONSUME_BEACH_OUTLINE_TOPOLOGY_SEA_LEVEL_HYDRATION_TNT_v1",
  "AUDRALIA_RUNTIME_SEA_LEVEL_HYDRATION_COMPOSITE_CACHE_TNT_v1",
  "AUDRALIA_RUNTIME_LOW_LAG_COMPOSITE_HYDRATION_CACHE_TNT_v1",
  "AUDRALIA_RUNTIME_CONSUME_HYDRATION_AFTER_TERRAIN_TNT_v1",
  "AUDRALIA_RUNTIME_CACHED_TOPOLOGY_TECTONICS_TERRAIN_CHAIN_TNT_v2"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_RUNTIME_VISIBLE_HYDRATION_DEPTH_ALLOWED";
const FILE = "/assets/audralia/audralia.runtime.js";

const TOPOLOGY_AUTHORITY = "/assets/audralia/audralia.topology.render.js";
const TECTONICS_AUTHORITY = "/assets/audralia/audralia.tectonics.render.js";
const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";
const HYDRATION_AUTHORITY = "/assets/audralia/audralia.hydration.render.js";

const CONTRACTS = Object.freeze({
  runtime: RECEIPT,
  previousRuntime: "AUDRALIA_RUNTIME_CONSUME_BEACH_OUTLINE_TOPOLOGY_SEA_LEVEL_HYDRATION_TNT_v1",
  topologyCurrent: "AUDRALIA_TOPOLOGY_BEACH_OUTLINE_ONLY_WATER_DOMINANT_TNT_v1",
  tectonics: "AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1",
  terrainCurrent: "AUDRALIA_G1_TERRAIN_STRONG_RELIEF_TOPOLOGY_TECTONICS_LOCK_TNT_v2",
  hydrationCurrent: "AUDRALIA_HYDRATION_VISIBLE_DEPTH_BEACH_RIM_EXPOSED_LAND_TNT_v1",
  hydrationPrevious: "AUDRALIA_HYDRATION_SEA_LEVEL_WATER_DEPTH_BEACH_OUTLINE_TNT_v1",
  routeExpected: "AUDRALIA_ROUTE_RUNTIME_HYDRATION_WATER_RENDER_TNT_v1"
});

const RUNTIME_LAW = Object.freeze({
  layerOrder: Object.freeze(["topology", "tectonics", "terrain", "hydration"]),
  chain: "topology→tectonics→terrain→hydration",
  topologyFirst: true,
  tectonicsSecond: true,
  terrainThird: true,
  hydrationFourth: true,

  consumesBeachOutlineTopology: true,
  consumesVisibleDepthHydration: true,
  consumesSeaLevelHydration: true,
  hydrationConsumedAfterTerrain: true,
  hydrationHeld: false,
  hydrationAllowedToRender: true,
  hydrationActiveInRuntime: true,
  seaLevelHydrationActive: true,
  waterDepthActive: true,
  depthVisibilityActive: true,
  beachRimActive: true,
  exposedLandReportActive: true,

  runtimeCompositeFieldActive: true,
  perPixelChainRecalculation: false,
  routeSamplesCompositeField: true,
  emitsVisualSurfaceClass: true,
  waterFirstVisualAuthority: true,

  ownsRuntimeSampling: true,
  ownsChainComposition: true,
  ownsPerformanceCache: true,
  ownsRouteDataHandoff: true,
  ownsVisualSurfaceClassification: true,

  ownsTopology: false,
  ownsTectonics: false,
  ownsTerrain: false,
  ownsHydration: false,
  ownsLandFootprint: false,
  ownsLandExpansion: false,
  ownsAboveSeaElevation: false,
  ownsWaterPlacement: false,
  ownsWaterFill: false,
  ownsCameraControl: false,
  ownsZoomControl: false,
  ownsSpinControl: false,
  ownsRouteRendering: false,
  ownsFinalRender: false,

  ownsClimate: false,
  ownsEcology: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsAnimals: false,
  ownsMarineLife: false,
  ownsConstructCivilization: false,

  terrainMustRespectTopologyLandArea: true,
  hydrationMustRespectTopologyTerrainChain: true,
  routeMustNotGenerateLand: true,
  routeMustNotGenerateWater: true,
  routeMustConsumeRuntime: true,
  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 224,
  fieldHeight: 112,
  maxFieldWidth: 256,
  maxFieldHeight: 128,
  minFieldWidth: 96,
  minFieldHeight: 48,

  topologyContext: Object.freeze({
    blueprintResolution: 0.88,
    coastlineComplexity: 0.94,
    connectionStrength: 0.92,
    subterraneanPressure: 0.72,
    landExpansionMultiplier: 2,
    enforceEarthEquivalentLandRatio: true,
    beachWidth: 0.050,
    shelfWidth: 0.145,
    cliffWidth: 0.075
  }),

  tectonicsContext: Object.freeze({
    tectonicStressDemand: 0.84,
    ancientMountainMemory: 0.96,
    mineralExposureDemand: 0.88,
    erosionAge: 1
  }),

  terrainContext: Object.freeze({
    coherenceIndex: 0.96,
    collaborativeExpression: 0.92,
    reliefDemand: 1.0,
    canyonDemand: 0.94,
    cliffDemand: 0.90,
    hydrologyReadinessDemand: 0.90,
    glacierDemand: 0.78
  }),

  hydrationContext: Object.freeze({
    seaLevelFill: 1.0,
    waterdownStrength: 1.0,
    visibleDepthDemand: 1.0,
    oceanFillDemand: 1.0,
    coastalFillDemand: 0.96,
    shelfFillDemand: 0.95,
    openOceanDemand: 0.92,
    deepOceanDemand: 0.96,
    trenchDemand: 0.98,
    beachRimDemand: 0.94,
    beachContactDemand: 0.92,
    exposedLandReportDemand: 1.0,
    riverActivationDemand: 0.78,
    streamActivationDemand: 0.70,
    lakeActivationDemand: 0.76,
    glacierActivationDemand: 0.76,
    snowpackActivationDemand: 0.68,
    floodplainActivationDemand: 0.66,
    deltaActivationDemand: 0.68,
    springActivationDemand: 0.58,
    subterraneanActivationDemand: 0.64
  })
});

let sharedRuntime = null;

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function safeBool(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function normalizeUV(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  return Object.freeze({
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2
  });
}

function safeCall(fallback, fn) {
  try {
    const value = fn();
    return value == null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function normalizeDimension(value, fallback, min, max) {
  return clamp(Math.floor(Number(value) || fallback), min, max);
}

function getRuntimeOptions(options = {}) {
  const fieldWidth = normalizeDimension(
    options.fieldWidth,
    DEFAULTS.fieldWidth,
    DEFAULTS.minFieldWidth,
    DEFAULTS.maxFieldWidth
  );

  const fieldHeight = normalizeDimension(
    options.fieldHeight,
    DEFAULTS.fieldHeight,
    DEFAULTS.minFieldHeight,
    DEFAULTS.maxFieldHeight
  );

  return Object.freeze({
    fieldWidth,
    fieldHeight,

    topologyContext: Object.freeze({
      ...DEFAULTS.topologyContext,
      ...(options.topologyContext || {}),
      ...(Number.isFinite(Number(options.landExpansionMultiplier))
        ? { landExpansionMultiplier: Number(options.landExpansionMultiplier) }
        : {})
    }),

    tectonicsContext: Object.freeze({
      ...DEFAULTS.tectonicsContext,
      ...(options.tectonicsContext || {})
    }),

    terrainContext: Object.freeze({
      ...DEFAULTS.terrainContext,
      ...(options.terrainContext || {})
    }),

    hydrationContext: Object.freeze({
      ...DEFAULTS.hydrationContext,
      ...(options.hydrationContext || {}),
      seaLevelFill: Number.isFinite(Number(options.seaLevelFill))
        ? Number(options.seaLevelFill)
        : (options.hydrationContext && Number.isFinite(Number(options.hydrationContext.seaLevelFill)))
          ? Number(options.hydrationContext.seaLevelFill)
          : DEFAULTS.hydrationContext.seaLevelFill
    }),

    hydrationEnabled: true,
    hydrationHeld: false,
    hydrationAllowedToRender: true,
    hydrationConsumedAfterTerrain: true,
    seaLevelHydrationActive: true,
    depthVisibilityActive: true,
    consumesBeachOutlineTopology: true,
    consumesVisibleDepthHydration: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,

    foliageEnabled: false,
    climateEnabled: false,
    ecologyEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    visualPassClaimed: false
  });
}

function fallbackTopologySample(u, v) {
  const point = normalizeUV(u, v);
  const polarIce = point.lat < -0.80 || point.lat > 0.88;

  return Object.freeze({
    receipt: "RUNTIME_FALLBACK_BEACH_OUTLINE_TOPOLOGY_SAMPLE",
    planetaryObject: PLANETARY_OBJECT,
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    isLandFootprint: false,
    isAboveWaterLandFootprint: false,
    isVoidFootprint: !polarIce,
    isWaterFootprint: !polarIce,
    isSouthPolarIceFootprint: point.lat < -0.80,
    isNorthPolarIceFootprint: point.lat > 0.88,
    isPolarIceFootprint: polarIce,

    isBeach: false,
    isSand: false,
    isRock: false,
    isShelf: !polarIce,
    isCoastline: false,
    isCoastalCliff: false,

    beachOutlineOnly: true,
    sandInteriorBlocked: true,
    wholeLandBeachBlocked: true,
    inlandTerrainPlaceholderActive: true,
    waterDominatesSeaLevel: true,

    surfaceClass: polarIce ? "polar_ice_footprint" : "open_ocean_blueprint",
    topologySurfaceClass: polarIce ? "polar_ice_footprint" : "open_ocean_blueprint",
    surfaceClassId: polarIce ? 12 : 2,

    landBodyId: 0,
    landBodyKey: "void_ocean",
    landBodyName: "Void / Ocean Footprint",

    oceanDepthIndex: polarIce ? 0 : 0.64,
    bathymetryBlueprintIndex: polarIce ? 0 : 0.60,
    trenchDepthIndex: 0,
    shelfDepthIndex: polarIce ? 0 : 0.20,
    basinDepthIndex: polarIce ? 0 : 0.52,
    depthClassKey: polarIce ? "polar_ice" : "open_ocean",

    seaLevelThreshold: 0.5,
    seaLevelBoundary: 0.5,
    seaLevelDistance: 1,
    coastalExposureIndex: 0,

    shorelinePressure: 0,
    beachPressure: 0,
    beachOutlinePressure: 0,
    beachWaterContactIndex: 0,
    sandPressure: 0,
    rockPressure: 0,
    coastalCliffPressure: 0,
    seaLevelErosionPressure: 0,
    cliffBaseCut: 0,

    blackSandPressure: 0,
    whiteSandPressure: 0,
    opalSoftnessIndex: 0,
    diamondDarkSandIndex: 0,
    beachCloudSoftnessIndex: 0,

    terrainRisePermission: 0,
    terrainBlockPermission: 1,
    terrainSeedClass: polarIce ? "polar_ice_no_terrain" : "void_water_no_terrain",

    subterraneanDepthIndex: polarIce ? 0.3 : 0.58,
    foundationDensityIndex: 0.44,
    rockMassBoundaryIndex: 0.32,

    ownsHydration: false,
    ownsFoliage: false,
    visualPassClaimed: false
  });
}

function fallbackTectonicsSample(u, v, topology) {
  return Object.freeze({
    receipt: "RUNTIME_FALLBACK_TECTONICS_SAMPLE",
    planetaryObject: PLANETARY_OBJECT,
    u,
    v,
    topologyLandFootprint: Boolean(topology && topology.isLandFootprint),
    tectonicType: "runtime_fallback_pressure",
    plateId: 0,
    plateKey: "runtime_fallback_plate",
    boundaryId: "none",
    crustalStressIndex: 0,
    ancientCrustStabilityIndex: 0,
    primordialMountainMemoryIndex: 0,
    weatheredRemnantIndex: 0,
    mountainChainPermission: 0,
    canyonPermission: 0,
    cliffPermission: 0,
    trenchReinforcementPermission: 0,
    upliftPermission: 0,
    diamondPressureIndex: 0,
    opalSeamIndex: 0,
    graniteCratonIndex: 0,
    slateFoldBeltIndex: 0,
    exposedMineralHardnessIndex: 0,
    terrainPressureHandoff: 0,
    ownsLandFootprint: false,
    ownsAboveSeaElevation: false,
    ownsHydration: false,
    ownsFoliage: false,
    visualPassClaimed: false
  });
}

function fallbackTerrainSample(u, v, topology) {
  const land = Boolean(topology && topology.isLandFootprint);
  const ice = Boolean(topology && (topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint || topology.isPolarIceFootprint));

  return Object.freeze({
    receipt: "RUNTIME_FALLBACK_TERRAIN_SAMPLE",
    planetaryObject: PLANETARY_OBJECT,
    u,
    v,

    isLand: land,
    isWater: !land && !ice,
    isIce: ice,

    normalizedElevation: land
      ? clamp(Number(topology.terrainRisePermission) || 0.28, 0, 1)
      : -clamp(Number(topology.oceanDepthIndex) || 0.44, 0, 1),

    elevationMeters: land ? Math.round((Number(topology.terrainRisePermission) || 0.28) * 9200) : 0,

    ridge: 0,
    mountainPressure: 0,
    canyonPressure: 0,
    basin: land ? 0.28 : 0,
    slope: 0,

    coastPressure: Number(topology.shorelinePressure) || 0,
    shelfPermission: Number(topology.reefShelfPermission) || Number(topology.shelfDepthIndex) || 0,

    riverbedPressure: 0,
    streamPressure: 0,
    lakeBasinPressure: 0,
    glacierSeatPressure: ice ? 0.8 : 0,
    snowpackSourcePressure: ice ? 0.7 : 0,
    valleyChannelPressure: 0,
    floodplainPressure: 0,
    deltaReceiverPressure: 0,
    hydrologyReadinessIndex: 0,

    watershedId: land ? "runtime_fallback_land_watershed" : "ocean",
    watershedStrength: 0,

    ownsHydration: false,
    ownsFoliage: false,
    visualPassClaimed: false
  });
}

function fallbackHydrationSample(u, v, topology, terrain) {
  const land = Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint));
  const ice = Boolean(topology && (topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint || topology.isPolarIceFootprint));
  const ocean = !land && !ice;

  const oceanDepth = clamp(
    Number(topology && (topology.oceanDepthIndex || topology.bathymetryBlueprintIndex)) || 0.64,
    0,
    1
  );

  const shelf = clamp(Number(topology && topology.shelfDepthIndex) || 0, 0, 1);
  const trench = clamp(Number(topology && topology.trenchDepthIndex) || 0, 0, 1);
  const shoreline = clamp(Number(topology && topology.shorelinePressure) || 0, 0, 1);
  const beach = clamp(Number(topology && (topology.beachOutlinePressure || topology.beachPressure || topology.sandPressure)) || 0, 0, 1);

  const river = land ? clamp(Number(terrain && terrain.riverbedPressure) || 0, 0, 1) : 0;
  const stream = land ? clamp(Number(terrain && terrain.streamPressure) || 0, 0, 1) : 0;
  const lake = land ? clamp(Number(terrain && terrain.lakeBasinPressure) || 0, 0, 1) : 0;
  const glacier = ice ? 0.8 : land ? clamp(Number(terrain && terrain.glacierSeatPressure) || 0, 0, 1) : 0;

  let waterClass = "dry_land";

  if (ocean && trench > 0.58) waterClass = "trench_water";
  else if (ocean && oceanDepth > 0.72) waterClass = "deep_ocean_water";
  else if (ocean && shelf > 0.44) waterClass = "shelf_water";
  else if (ocean && shoreline > 0.38) waterClass = "coastal_water";
  else if (ocean) waterClass = "ocean_water";
  else if (glacier > 0.62) waterClass = "glacier_mass";
  else if (lake > 0.58) waterClass = "lake_fill";
  else if (river > 0.56) waterClass = "river_flow";
  else if (stream > 0.52) waterClass = "stream_flow";

  const activation = ocean ? 1 : Math.max(river, stream, lake, glacier);
  const visibleDepth = ocean ? clamp(oceanDepth * 0.74 + trench * 0.16 + (1 - shelf) * 0.10, 0, 1) : 0;

  return Object.freeze({
    receipt: "RUNTIME_FALLBACK_VISIBLE_DEPTH_HYDRATION_SAMPLE",
    planetaryObject: PLANETARY_OBJECT,
    u,
    v,

    seaLevelHydrationActive: true,
    oceanFillActive: true,
    waterDepthActive: true,
    depthVisibilityActive: true,
    bathymetryActive: true,
    beachRimActive: true,
    exposedLandReportActive: true,
    hydrationMayCoverSand: true,

    waterClass,
    waterClassId:
      waterClass === "trench_water" ? 90 :
      waterClass === "deep_ocean_water" ? 80 :
      waterClass === "ocean_water" ? 70 :
      waterClass === "shelf_water" ? 60 :
      waterClass === "coastal_water" ? 50 :
      waterClass === "lake_fill" ? 40 :
      waterClass === "river_flow" ? 35 :
      waterClass === "stream_flow" ? 30 :
      waterClass === "glacier_mass" ? 15 :
      0,

    visualHydrationClass: waterClass === "dry_land" ? "exposed_land" : waterClass,

    isHydrated: waterClass !== "dry_land",
    isOceanWater: waterClass === "ocean_water",
    isCoastalWater: waterClass === "coastal_water",
    isShelfWater: waterClass === "shelf_water",
    isDeepOcean: waterClass === "deep_ocean_water",
    isTrenchWater: waterClass === "trench_water",
    isRiver: waterClass === "river_flow",
    isStream: waterClass === "stream_flow",
    isLake: waterClass === "lake_fill",
    isGlacier: waterClass === "glacier_mass",
    isSnowpack: false,
    isFloodplain: false,
    isDelta: false,
    isSpring: false,
    isSubterraneanWater: false,

    visibleWaterDepthClass:
      waterClass === "trench_water" ? "trench" :
      waterClass === "deep_ocean_water" ? "deep_ocean" :
      waterClass === "shelf_water" ? "shelf" :
      waterClass === "coastal_water" ? "coastal" :
      waterClass === "ocean_water" ? "open_ocean" :
      "none",
    visibleWaterDepthIndex: visibleDepth,
    waterVisibilityIndex: ocean ? clamp(0.60 + visibleDepth * 0.36, 0, 1) : 0,
    coastalShelfBlueIndex: ocean ? clamp(shelf * 0.62 + shoreline * 0.24, 0, 1) : 0,
    deepOceanBlueIndex: ocean ? clamp(oceanDepth * 0.72 + (1 - shelf) * 0.18, 0, 1) : 0,
    trenchDarknessIndex: ocean ? clamp(trench * 0.72 + oceanDepth * 0.18, 0, 1) : 0,

    oceanDepthIndex: oceanDepth,
    bathymetryHydrationIndex: oceanDepth,
    trenchHydrationIndex: trench,
    shelfPressure: shelf,
    coastalWaterPressure: shoreline,

    beachOutlinePressure: beach,
    beachContactRimIndex: clamp(beach * 0.52 + shoreline * 0.36, 0, 1),
    beachWaterContactIndex: clamp(beach * 0.38 + shoreline * 0.42 + shelf * 0.14, 0, 1),
    beachRimStillVisible: beach > 0.22 && !ocean,
    sandCoveredByHydration: beach > 0.34 && shoreline > 0.44,

    exposedLandAfterSeaLevel: land && !ice,
    landStillVisibleAfterHydration: land && !ice && waterClass === "dry_land",
    exposedLandVisibilityIndex: land && !ice && waterClass === "dry_land" ? 0.72 : 0,
    exposedLandClass: land && !ice && waterClass === "dry_land" ? "land_remaining" : "covered_or_not_land",

    riverFlowPressure: river,
    streamFlowPressure: stream,
    lakeFillPressure: lake,
    glacierMassPressure: glacier,
    snowpackPressure: glacier * 0.6,
    floodplainWetness: 0,
    deltaWetness: 0,
    springSeepPressure: 0,
    subterraneanWaterPressure: 0,

    surfaceWaterIndex: ocean ? clamp(0.76 + oceanDepth * 0.22, 0, 1) : activation,
    hydrationActivationIndex: ocean ? 1 : activation,

    hydrationColorInfluence: Object.freeze({
      waterDominance: ocean ? 1 : activation,
      coastalBlue: shelf,
      deepBlue: oceanDepth,
      trenchDark: trench,
      beachRim: beach,
      exposedLand: land && waterClass === "dry_land" ? 1 : 0,
      glacierWhite: glacier,
      riverBlue: river,
      lakeBlue: lake
    }),

    ownsHydration: true,
    ownsLandFootprint: false,
    ownsTerrainElevation: false,
    ownsFoliage: false,
    visualPassClaimed: false
  });
}

function getSampleFromField(field, getter, fallback, u, v, directSample) {
  if (field && field.samples && field.width && field.height && typeof getter === "function") {
    return safeCall(fallback, () => getter(field, u, v));
  }

  return safeCall(fallback, directSample);
}

function getTopologyFromLayerCache(cache, u, v) {
  const fallback = fallbackTopologySample(u, v);

  return getSampleFromField(
    cache.topologyField,
    getTopologySampleFromField,
    fallback,
    u,
    v,
    () => sampleTopology(u, v, cache.runtimeOptions.topologyContext)
  );
}

function getTectonicsFromLayerCache(cache, u, v, topologySample) {
  const fallback = fallbackTectonicsSample(u, v, topologySample);

  return getSampleFromField(
    cache.tectonicsField,
    getTectonicsSampleFromField,
    fallback,
    u,
    v,
    () => sampleTectonics(u, v, topologySample, cache.runtimeOptions.tectonicsContext)
  );
}

function getTerrainFromLayerCache(cache, u, v, topologySample) {
  const fallback = fallbackTerrainSample(u, v, topologySample);

  return getSampleFromField(
    cache.terrainField,
    getTerrainSampleFromField,
    fallback,
    u,
    v,
    () => sampleTerrain(u, v, cache.runtimeOptions.terrainContext)
  );
}

function getHydrationFromLayerCache(cache, u, v, topologySample, terrainSample) {
  const fallback = fallbackHydrationSample(u, v, topologySample, terrainSample);

  return getSampleFromField(
    cache.hydrationField,
    getHydrationSampleFromField,
    fallback,
    u,
    v,
    () => sampleHydration(u, v, cache.runtimeOptions.hydrationContext)
  );
}

function topologyAllowsLand(topology) {
  return Boolean(
    topology &&
      (
        topology.isLandFootprint ||
        topology.isAboveWaterLandFootprint ||
        topology.topologyLandFootprint
      )
  );
}

function topologyAllowsIce(topology) {
  return Boolean(
    topology &&
      (
        topology.isSouthPolarIceFootprint ||
        topology.isNorthPolarIceFootprint ||
        topology.isPolarIceFootprint ||
        topology.surfaceClass === "polar_ice_footprint" ||
        topology.topologySurfaceClass === "polar_ice_footprint"
      )
  );
}

function topologyAllowsBeach(topology) {
  return Boolean(
    topology &&
      (
        topology.isBeach ||
        String(topology.beachType || "").includes("beach") ||
        String(topology.surfaceClass || "").includes("beach_outline") ||
        Number(topology.beachOutlinePressure) > 0.22
      )
  );
}

function topologyAllowsSand(topology) {
  return Boolean(
    topology &&
      topologyAllowsBeach(topology) &&
      (
        topology.isSand ||
        Number(topology.sandPressure) > 0.16 ||
        Number(topology.blackSandPressure) > 0.16 ||
        Number(topology.whiteSandPressure) > 0.16
      )
  );
}

function topologyAllowsRock(topology) {
  return Boolean(
    topology &&
      (
        topology.isRock ||
        topology.isCoastalCliff ||
        String(topology.surfaceClass || "").includes("rock") ||
        String(topology.surfaceClass || "").includes("cliff") ||
        Number(topology.rockPressure) > 0.44 ||
        Number(topology.coastalCliffPressure) > 0.38
      )
  );
}

function hydrationIsWater(hydration) {
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
        String(hydration.waterClass || "").includes("river") ||
        String(hydration.waterClass || "").includes("lake") ||
        String(hydration.waterClass || "").includes("glacier")
      )
  );
}

function deriveVisualSurfaceClass(topology, terrain, hydration, landAllowed, iceAllowed) {
  const waterClass = String(hydration && hydration.waterClass ? hydration.waterClass : "dry_land");
  const topologySurfaceClass = String(topology && (topology.topologySurfaceClass || topology.surfaceClass) || "unknown");

  if (iceAllowed || waterClass === "glacier_mass" || waterClass === "snowpack_source") {
    return "glacier_ice_snowpack_surface";
  }

  if (hydration) {
    if (hydration.isTrenchWater || waterClass === "trench_water") return "trench_ocean_water_surface";
    if (hydration.isDeepOcean || waterClass === "deep_ocean_water") return "deep_ocean_water_surface";
    if (hydration.isShelfWater || waterClass === "shelf_water") return "shelf_water_surface";
    if (hydration.isCoastalWater || waterClass === "coastal_water") return "coastal_water_surface";
    if (hydration.isOceanWater || waterClass === "ocean_water") return "ocean_water_surface";
    if (hydration.isLake || waterClass === "lake_fill") return "lake_water_surface";
    if (hydration.isRiver || waterClass === "river_flow") return "river_water_surface";
    if (hydration.isStream || waterClass === "stream_flow") return "stream_water_surface";
    if (hydration.isDelta || waterClass === "delta_wetland") return "delta_wetland_surface";
    if (hydration.isFloodplain || waterClass === "floodplain_wetland") return "floodplain_wet_surface";
    if (hydration.isSpring || waterClass === "spring_seep") return "spring_seep_surface";
  }

  if (topologyAllowsBeach(topology)) return "beach_outline_surface";
  if (topology && topology.isCoastalCliff) return "coastal_cliff_surface";
  if (landAllowed) return "inland_terrain_pending_surface";

  if (topologySurfaceClass.includes("shelf")) return "shelf_water_surface";
  if (topologySurfaceClass.includes("deep_ocean")) return "deep_ocean_water_surface";
  if (topologySurfaceClass.includes("trench")) return "trench_ocean_water_surface";
  if (topologySurfaceClass.includes("coastal_water")) return "coastal_water_surface";

  return "open_ocean_water_surface";
}

function composeRuntimeSampleFromLayers(cache, uInput, vInput) {
  const point = normalizeUV(uInput, vInput);

  const topology = getTopologyFromLayerCache(cache, point.u, point.v);
  const tectonics = getTectonicsFromLayerCache(cache, point.u, point.v, topology);
  const terrain = getTerrainFromLayerCache(cache, point.u, point.v, topology);
  const hydration = getHydrationFromLayerCache(cache, point.u, point.v, topology, terrain);

  const topologyLandAllowed = topologyAllowsLand(topology);
  const iceAllowed = topologyAllowsIce(topology);
  const hydrationWater = hydrationIsWater(hydration);

  const landAllowed = topologyLandAllowed && !hydrationWater;
  const beachAllowed = topologyAllowsBeach(topology) && !hydrationWater;
  const sandAllowed = topologyAllowsSand(topology) && !hydrationWater;
  const rockAllowed = topologyAllowsRock(topology) && !hydrationWater;

  const terrainRisePermission = clamp(Number(topology.terrainRisePermission) || 0, 0, 1);
  const terrainBlockPermission = clamp(Number(topology.terrainBlockPermission) || 0, 0, 1);
  const terrainPressureHandoff = clamp(Number(tectonics.terrainPressureHandoff) || 0, 0, 1);

  const terrainElevationRaw = clamp(
    Number(terrain.normalizedElevation) ||
      Number(terrain.elevation) ||
      terrainRisePermission ||
      0,
    -1,
    1
  );

  const normalizedElevation = iceAllowed
    ? 0
    : topologyLandAllowed
      ? clamp(
          terrainElevationRaw * 0.38 +
            terrainRisePermission * 0.24 +
            terrainPressureHandoff * 0.26 +
            clamp(Number(tectonics.mountainChainPermission) || 0, 0, 1) * 0.12,
          0,
          1
        )
      : -clamp(
          Number(topology.oceanDepthIndex) ||
            Number(topology.bathymetryBlueprintIndex) ||
            Number(topology.basinDepthIndex) ||
            0.42,
          0,
          1
        );

  const ridge = topologyLandAllowed
    ? clamp(
        (Number(terrain.ridge) || 0) * 0.34 +
          (Number(tectonics.mountainChainPermission) || 0) * 0.36 +
          (Number(tectonics.upliftPermission) || 0) * 0.18 +
          (Number(topology.cliffRisePermission) || 0) * 0.12,
        0,
        1
      )
    : 0;

  const canyon = topologyLandAllowed
    ? clamp(
        (Number(terrain.canyonPressure) || 0) * 0.30 +
          (Number(terrain.riverIncisionPressure) || 0) * 0.20 +
          (Number(tectonics.canyonPermission) || 0) * 0.34 +
          (Number(topology.seaLevelErosionPressure) || 0) * 0.10,
        0,
        1
      )
    : 0;

  const cliff = clamp(
    (Number(topology.cliffBaseCut) || 0) * 0.36 +
      (Number(topology.coastalCliffPressure) || 0) * 0.26 +
      (Number(tectonics.cliffPermission) || 0) * 0.30 +
      (Number(terrain.cliffPressure) || 0) * 0.08,
    0,
    1
  );

  const hydrologyReadinessIndex = topologyLandAllowed
    ? clamp(
        (Number(terrain.hydrologyReadinessIndex) || 0) * 0.42 +
          (Number(terrain.riverbedPressure) || 0) * 0.16 +
          (Number(terrain.streamPressure) || 0) * 0.12 +
          (Number(terrain.lakeBasinPressure) || 0) * 0.10 +
          canyon * 0.14 +
          ridge * 0.06,
        0,
        1
      )
    : 0;

  const hydrationActivationIndex = clamp(Number(hydration.hydrationActivationIndex) || 0, 0, 1);
  const surfaceWaterIndex = clamp(Number(hydration.surfaceWaterIndex) || 0, 0, 1);
  const visualSurfaceClass = deriveVisualSurfaceClass(topology, terrain, hydration, topologyLandAllowed, iceAllowed);

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    runtimeChain: "topology→tectonics→terrain→hydration",
    runtimeCacheActive: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,
    hydrationCacheActive: true,
    hydrationConsumedAfterTerrain: true,
    hydrationAllowedToRender: true,
    seaLevelHydrationActive: true,
    waterDepthActive: true,
    depthVisibilityActive: true,
    beachRimActive: true,
    exposedLandReportActive: true,

    visualSurfaceClass,
    visualSurfaceAuthority: "runtime",
    routeShouldPaintFromVisualSurfaceClass: true,
    waterFirstVisualAuthority: true,

    topologyReceipt: topology.receipt || topology.runtimeCompatibleReceipt || "unknown",
    topologyActiveContract: topology.activeContract || topology.latestContract || topology.receipt || "unknown",
    topologySurfaceClass: topology.surfaceClass || "unknown",
    topologySurfaceClassId: topology.surfaceClassId ?? -1,

    tectonicsReceipt: tectonics.receipt || "unknown",
    tectonicType: tectonics.tectonicType || "unknown",
    plateId: tectonics.plateId || 0,
    plateKey: tectonics.plateKey || "unknown",
    boundaryId: tectonics.boundaryId || "none",

    terrainReceipt: terrain.receipt || "unknown",
    hydrationReceipt: hydration.receipt || "unknown",
    hydrationContract: CONTRACTS.hydrationCurrent,

    isLandFootprint: landAllowed,
    isAboveWaterLandFootprint: landAllowed && !iceAllowed,
    isVoidFootprint: !landAllowed && !iceAllowed,
    topologyLandFootprint: topologyLandAllowed,
    topologyVoidFootprint: !topologyLandAllowed && !iceAllowed,

    isWater: hydrationWater || (!topologyLandAllowed && !iceAllowed),
    isLand: landAllowed,
    isIce: iceAllowed,
    isSouthPolarIceFootprint: Boolean(topology.isSouthPolarIceFootprint),
    isNorthPolarIceFootprint: Boolean(topology.isNorthPolarIceFootprint),
    southIce: Boolean(topology.isSouthPolarIceFootprint),

    isBeach: beachAllowed,
    isSand: sandAllowed,
    isRock: rockAllowed,
    isShelf: Boolean(topology.isShelf),
    isCoastline: Boolean(topology.isCoastline),
    isCoastalCliff: Boolean(topology.isCoastalCliff),
    isIslandFootprint: Boolean(topology.isIslandFootprint),
    isConnectedLandSystem: Boolean(topology.isConnectedLandSystem),
    isSmallContinentFootprint: Boolean(topology.isSmallContinentFootprint),
    inlandTerrainPlaceholder: Boolean(topology.inlandTerrainPlaceholder),
    inlandSandBlocked: Boolean(topology.inlandSandBlocked),

    beachOutlineOnly: true,
    sandInteriorBlocked: true,
    wholeLandBeachBlocked: true,
    inlandTerrainPlaceholderActive: true,
    waterDominatesSeaLevel: true,
    hydrationMayCoverSand: true,

    landBodyId: topology.landBodyId || 0,
    landBodyKey: topology.landBodyKey || "void_ocean",
    landBodyName: topology.landBodyName || "Void / Ocean Footprint",
    landConnectionId: topology.landConnectionId || "none",
    islandArcId: topology.islandArcId || "none",

    landExpansionActive: safeBool(topology.landExpansionActive),
    landExpansionAreaMultiplier: Number(topology.landExpansionAreaMultiplier) || 1,
    landExpansionRadiusScale: Number(topology.landExpansionRadiusScale) || 1,
    smallContinentFormationPermission: safeBool(topology.smallContinentFormationPermission),

    targetLandRatio: topology.targetLandRatio,
    approximateEarthExposedLandRatio: topology.approximateEarthExposedLandRatio,
    seaLevelThreshold: topology.seaLevelThreshold,
    seaLevelBoundary: topology.seaLevelBoundary,
    seaLevelDistance: topology.seaLevelDistance,
    coastalExposureIndex: topology.coastalExposureIndex,

    oceanDepthIndex: clamp(
      Number(hydration.oceanDepthIndex) ||
        Number(topology.oceanDepthIndex) ||
        0,
      0,
      1
    ),
    bathymetryBlueprintIndex: clamp(Number(topology.bathymetryBlueprintIndex) || 0, 0, 1),
    bathymetryHydrationIndex: clamp(
      Number(hydration.bathymetryHydrationIndex) ||
        Number(topology.bathymetryBlueprintIndex) ||
        0,
      0,
      1
    ),
    trenchDepthIndex: clamp(Number(topology.trenchDepthIndex) || Number(tectonics.trenchReinforcementPermission) || 0, 0, 1),
    trenchHydrationIndex: clamp(
      Number(hydration.trenchHydrationIndex) ||
        Number(topology.trenchDepthIndex) ||
        Number(tectonics.trenchReinforcementPermission) ||
        0,
      0,
      1
    ),
    shelfDepthIndex: clamp(Number(topology.shelfDepthIndex) || Number(topology.reefShelfPermission) || 0, 0, 1),
    shelfPressure: clamp(
      Number(hydration.shelfPressure) ||
        Number(topology.shelfDepthIndex) ||
        Number(topology.reefShelfPermission) ||
        0,
      0,
      1
    ),
    basinDepthIndex: clamp(Number(topology.basinDepthIndex) || 0, 0, 1),
    depthClassKey: topology.depthClassKey || topology.oceanDepthClass || "land",

    visibleWaterDepthClass: hydration.visibleWaterDepthClass || "none",
    visibleWaterDepthIndex: clamp(Number(hydration.visibleWaterDepthIndex) || 0, 0, 1),
    waterVisibilityIndex: clamp(Number(hydration.waterVisibilityIndex) || 0, 0, 1),
    coastalShelfBlueIndex: clamp(Number(hydration.coastalShelfBlueIndex) || 0, 0, 1),
    deepOceanBlueIndex: clamp(Number(hydration.deepOceanBlueIndex) || 0, 0, 1),
    trenchDarknessIndex: clamp(Number(hydration.trenchDarknessIndex) || 0, 0, 1),

    subterraneanDepthIndex: clamp(Number(topology.subterraneanDepthIndex) || 0, 0, 1),
    foundationDensityIndex: clamp(Number(topology.foundationDensityIndex) || 0, 0, 1),
    rockMassBoundaryIndex: clamp(Number(topology.rockMassBoundaryIndex) || 0, 0, 1),

    shorelinePressure: clamp(Number(topology.shorelinePressure) || 0, 0, 1),
    beachPressure: clamp(Number(topology.beachPressure) || 0, 0, 1),
    sandPressure: clamp(Number(topology.sandPressure) || 0, 0, 1),
    rockPressure: clamp(Number(topology.rockPressure) || 0, 0, 1),
    coastalCliffPressure: clamp(Number(topology.coastalCliffPressure) || 0, 0, 1),
    seaLevelErosionPressure: clamp(Number(topology.seaLevelErosionPressure) || 0, 0, 1),
    cliffBaseCut: clamp(Number(topology.cliffBaseCut) || 0, 0, 1),
    coastlineIrregularityIndex: clamp(Number(topology.coastlineIrregularityIndex) || 0, 0, 1),

    beachType: topology.beachType || "none",
    beachOutlinePressure: clamp(Number(hydration.beachOutlinePressure) || Number(topology.beachOutlinePressure) || 0, 0, 1),
    beachContactRimIndex: clamp(Number(hydration.beachContactRimIndex) || 0, 0, 1),
    beachWaterContactIndex: clamp(Number(hydration.beachWaterContactIndex) || Number(topology.beachWaterContactIndex) || 0, 0, 1),
    beachRimStillVisible: Boolean(hydration.beachRimStillVisible),
    sandCoveredByHydration: Boolean(hydration.sandCoveredByHydration),

    blackSandPressure: clamp(Number(topology.blackSandPressure) || 0, 0, 1),
    whiteSandPressure: clamp(Number(topology.whiteSandPressure) || 0, 0, 1),
    opalSoftnessIndex: clamp(Number(topology.opalSoftnessIndex) || 0, 0, 1),
    diamondDarkSandIndex: clamp(Number(topology.diamondDarkSandIndex) || 0, 0, 1),
    beachCloudSoftnessIndex: clamp(Number(topology.beachCloudSoftnessIndex) || 0, 0, 1),

    crustalStressIndex: clamp(Number(tectonics.crustalStressIndex) || 0, 0, 1),
    primordialMountainMemoryIndex: clamp(Number(tectonics.primordialMountainMemoryIndex) || 0, 0, 1),
    weatheredRemnantIndex: clamp(Number(tectonics.weatheredRemnantIndex) || 0, 0, 1),
    mountainChainPermission: clamp(Number(tectonics.mountainChainPermission) || 0, 0, 1),
    canyonPermission: clamp(Number(tectonics.canyonPermission) || 0, 0, 1),
    cliffPermission: clamp(Number(tectonics.cliffPermission) || 0, 0, 1),
    upliftPermission: clamp(Number(tectonics.upliftPermission) || 0, 0, 1),
    terrainPressureHandoff,

    diamondPressureIndex: clamp(Number(tectonics.diamondPressureIndex) || 0, 0, 1),
    opalSeamIndex: clamp(Number(tectonics.opalSeamIndex) || 0, 0, 1),
    graniteCratonIndex: clamp(Number(tectonics.graniteCratonIndex) || 0, 0, 1),
    slateFoldBeltIndex: clamp(Number(tectonics.slateFoldBeltIndex) || 0, 0, 1),
    exposedMineralHardnessIndex: clamp(Number(tectonics.exposedMineralHardnessIndex) || 0, 0, 1),

    terrainRisePermission,
    terrainBlockPermission,
    terrainAllowedByTopology: topologyLandAllowed,
    terrainMustNotExpandLandArea: true,

    normalizedElevation,
    elevationMeters: topologyLandAllowed ? Math.round(normalizedElevation * 9200) : Math.round(normalizedElevation * 5600),
    ridge,
    mountainPressure: clamp(Number(terrain.mountainPressure) || ridge, 0, 1),
    basin: clamp(Number(terrain.basin) || Number(topology.basinDepressionPermission) || 0, 0, 1),
    slope: clamp(Number(terrain.slope) || ridge * 0.42 + canyon * 0.24 + cliff * 0.18, 0, 1),
    canyonPressure: canyon,
    riverIncisionPressure: clamp(Number(terrain.riverIncisionPressure) || canyon * 0.62, 0, 1),
    valleyChannelPressure: clamp(Number(terrain.valleyChannelPressure) || canyon * 0.58, 0, 1),
    riverbedPressure: topologyLandAllowed ? clamp(Number(terrain.riverbedPressure) || canyon * 0.48, 0, 1) : 0,
    streamPressure: topologyLandAllowed ? clamp(Number(terrain.streamPressure) || canyon * 0.34, 0, 1) : 0,
    lakeBasinPressure: topologyLandAllowed ? clamp(Number(terrain.lakeBasinPressure) || Number(terrain.basin) || 0, 0, 1) : 0,
    glacierSeatPressure: clamp(Number(terrain.glacierSeatPressure) || (iceAllowed ? 0.8 : 0), 0, 1),
    snowpackSourcePressure: clamp(Number(terrain.snowpackSourcePressure) || (iceAllowed ? 0.7 : 0), 0, 1),
    floodplainPressure: clamp(Number(terrain.floodplainPressure) || 0, 0, 1),
    deltaReceiverPressure: clamp(Number(terrain.deltaReceiverPressure) || 0, 0, 1),
    hydrologyReadinessIndex,

    hydrationEnabled: true,
    hydrationHeld: false,
    hydrationAllowedToRender: true,
    hydrationActiveInRuntime: true,
    hydrationConsumedAfterTerrain: true,

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
    isSnowpack: Boolean(hydration.isSnowpack),
    isFloodplain: Boolean(hydration.isFloodplain),
    isDelta: Boolean(hydration.isDelta),
    isSpring: Boolean(hydration.isSpring),
    isSubterraneanWater: Boolean(hydration.isSubterraneanWater),

    exposedLandAfterSeaLevel: Boolean(hydration.exposedLandAfterSeaLevel),
    landStillVisibleAfterHydration: Boolean(hydration.landStillVisibleAfterHydration),
    exposedLandVisibilityIndex: clamp(Number(hydration.exposedLandVisibilityIndex) || 0, 0, 1),
    exposedLandClass: hydration.exposedLandClass || "unknown",

    watershedId: hydration.watershedId || terrain.watershedId || "ocean",
    flowDirection: hydration.flowDirection || "none",
    flowVectorX: clamp(Number(hydration.flowVectorX) || 0, -1, 1),
    flowVectorY: clamp(Number(hydration.flowVectorY) || 0, -1, 1),
    flowStrength: clamp(Number(hydration.flowStrength) || 0, 0, 1),

    riverFlowPressure: clamp(Number(hydration.riverFlowPressure) || 0, 0, 1),
    streamFlowPressure: clamp(Number(hydration.streamFlowPressure) || 0, 0, 1),
    lakeFillPressure: clamp(Number(hydration.lakeFillPressure) || 0, 0, 1),
    glacierMassPressure: clamp(Number(hydration.glacierMassPressure) || 0, 0, 1),
    snowpackPressure: clamp(Number(hydration.snowpackPressure) || 0, 0, 1),
    floodplainWetness: clamp(Number(hydration.floodplainWetness) || 0, 0, 1),
    deltaWetness: clamp(Number(hydration.deltaWetness) || 0, 0, 1),
    springSeepPressure: clamp(Number(hydration.springSeepPressure) || 0, 0, 1),
    subterraneanWaterPressure: clamp(Number(hydration.subterraneanWaterPressure) || 0, 0, 1),
    surfaceWaterIndex,
    hydrationActivationIndex,
    seaLevelFill: Number(hydration.seaLevelFill) || cache.runtimeOptions.hydrationContext.seaLevelFill,
    waterdownStrength: Number(hydration.waterdownStrength) || cache.runtimeOptions.hydrationContext.waterdownStrength,
    hydrationColorInfluence: hydration.hydrationColorInfluence || null,

    foliageEnabled: false,
    climateEnabled: false,
    ecologyEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,

    foliage: false,
    trees: false,
    vegetation: false,

    ownsHydration: false,
    ownsWaterPlacement: false,
    ownsWaterFill: false,
    ownsCameraControl: false,
    ownsZoomControl: false,
    ownsSpinControl: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsAnimals: false,
    ownsMarineLife: false,
    ownsConstructCivilization: false,
    ownsRouteRendering: false,
    ownsFinalRender: false,
    visualPassClaimed: false
  });
}

function buildRuntimeCompositeField(cache) {
  const width = cache.fieldWidth;
  const height = cache.fieldHeight;
  const samples = new Array(width * height);

  let landSamples = 0;
  let waterSamples = 0;
  let iceSamples = 0;
  let beachSamples = 0;
  let sandSamples = 0;
  let inlandSamples = 0;
  let smallContinentSamples = 0;

  let hydratedSamples = 0;
  let oceanHydrationSamples = 0;
  let coastalWaterSamples = 0;
  let shelfWaterSamples = 0;
  let deepOceanSamples = 0;
  let trenchWaterSamples = 0;
  let riverSamples = 0;
  let streamSamples = 0;
  let lakeSamples = 0;
  let glacierSamples = 0;
  let snowpackSamples = 0;
  let floodplainSamples = 0;
  let deltaSamples = 0;
  let springSamples = 0;
  let subterraneanSamples = 0;
  let beachOutlineSamples = 0;
  let beachRimSamples = 0;
  let sandCoveredSamples = 0;
  let exposedLandSamples = 0;
  let visibleLandSamples = 0;
  let foliageSamples = 0;

  let maxHydration = 0;
  let maxSurfaceWater = 0;
  let maxOceanDepth = 0;
  let maxBathymetry = 0;
  let maxVisibleDepth = 0;
  let maxWaterVisibility = 0;
  let maxCoastalBlue = 0;
  let maxDeepBlue = 0;
  let maxTrenchDark = 0;
  let maxBeachOutline = 0;
  let maxBeachRim = 0;
  let maxRiver = 0;
  let maxLake = 0;
  let maxGlacier = 0;

  const visualSurfaceClasses = new Set();
  const waterClasses = new Set();
  const visibleDepthClasses = new Set();

  for (let y = 0; y < height; y += 1) {
    const v = height === 1 ? 0.5 : y / (height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = width === 1 ? 0.5 : x / (width - 1);
      const sample = composeRuntimeSampleFromLayers(cache, u, v);
      samples[y * width + x] = sample;

      visualSurfaceClasses.add(sample.visualSurfaceClass);
      waterClasses.add(sample.waterClass);
      visibleDepthClasses.add(sample.visibleWaterDepthClass);

      if (sample.isIce) iceSamples += 1;
      else if (sample.isLandFootprint) landSamples += 1;
      else waterSamples += 1;

      if (sample.isBeach) beachSamples += 1;
      if (sample.isSand) sandSamples += 1;
      if (sample.inlandTerrainPlaceholder) inlandSamples += 1;
      if (sample.isSmallContinentFootprint) smallContinentSamples += 1;

      if (sample.isHydrated) hydratedSamples += 1;
      if (sample.isOceanWater) oceanHydrationSamples += 1;
      if (sample.isCoastalWater) coastalWaterSamples += 1;
      if (sample.isShelfWater) shelfWaterSamples += 1;
      if (sample.isDeepOcean) deepOceanSamples += 1;
      if (sample.isTrenchWater) trenchWaterSamples += 1;
      if (sample.isRiver) riverSamples += 1;
      if (sample.isStream) streamSamples += 1;
      if (sample.isLake) lakeSamples += 1;
      if (sample.isGlacier) glacierSamples += 1;
      if (sample.isSnowpack) snowpackSamples += 1;
      if (sample.isFloodplain) floodplainSamples += 1;
      if (sample.isDelta) deltaSamples += 1;
      if (sample.isSpring) springSamples += 1;
      if (sample.isSubterraneanWater || sample.subterraneanWaterPressure > 0.44) subterraneanSamples += 1;
      if (sample.beachOutlinePressure > 0.34) beachOutlineSamples += 1;
      if (sample.beachRimStillVisible) beachRimSamples += 1;
      if (sample.sandCoveredByHydration) sandCoveredSamples += 1;
      if (sample.exposedLandAfterSeaLevel) exposedLandSamples += 1;
      if (sample.landStillVisibleAfterHydration) visibleLandSamples += 1;
      if (sample.foliage || sample.trees || sample.vegetation) foliageSamples += 1;

      maxHydration = Math.max(maxHydration, sample.hydrationActivationIndex);
      maxSurfaceWater = Math.max(maxSurfaceWater, sample.surfaceWaterIndex);
      maxOceanDepth = Math.max(maxOceanDepth, sample.oceanDepthIndex);
      maxBathymetry = Math.max(maxBathymetry, sample.bathymetryHydrationIndex);
      maxVisibleDepth = Math.max(maxVisibleDepth, sample.visibleWaterDepthIndex);
      maxWaterVisibility = Math.max(maxWaterVisibility, sample.waterVisibilityIndex);
      maxCoastalBlue = Math.max(maxCoastalBlue, sample.coastalShelfBlueIndex);
      maxDeepBlue = Math.max(maxDeepBlue, sample.deepOceanBlueIndex);
      maxTrenchDark = Math.max(maxTrenchDark, sample.trenchDarknessIndex);
      maxBeachOutline = Math.max(maxBeachOutline, sample.beachOutlinePressure);
      maxBeachRim = Math.max(maxBeachRim, sample.beachContactRimIndex);
      maxRiver = Math.max(maxRiver, sample.riverFlowPressure);
      maxLake = Math.max(maxLake, sample.lakeFillPressure);
      maxGlacier = Math.max(maxGlacier, sample.glacierMassPressure);
    }
  }

  const totalSamples = samples.length;

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    width,
    height,
    samples,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,

    stats: Object.freeze({
      totalSamples,

      landSamples,
      waterSamples,
      iceSamples,
      beachSamples,
      sandSamples,
      inlandSamples,
      smallContinentSamples,

      hydratedSamples,
      oceanHydrationSamples,
      coastalWaterSamples,
      shelfWaterSamples,
      deepOceanSamples,
      trenchWaterSamples,
      riverSamples,
      streamSamples,
      lakeSamples,
      glacierSamples,
      snowpackSamples,
      floodplainSamples,
      deltaSamples,
      springSamples,
      subterraneanSamples,
      beachOutlineSamples,
      beachRimSamples,
      sandCoveredSamples,
      exposedLandSamples,
      visibleLandSamples,
      foliageSamples,

      landRatio: totalSamples ? landSamples / totalSamples : 0,
      waterRatio: totalSamples ? waterSamples / totalSamples : 0,
      iceRatio: totalSamples ? iceSamples / totalSamples : 0,
      beachRatio: totalSamples ? beachSamples / totalSamples : 0,
      sandRatio: totalSamples ? sandSamples / totalSamples : 0,
      inlandRatio: totalSamples ? inlandSamples / totalSamples : 0,

      hydrationRatio: totalSamples ? hydratedSamples / totalSamples : 0,
      oceanHydrationRatio: totalSamples ? oceanHydrationSamples / totalSamples : 0,
      coastalWaterRatio: totalSamples ? coastalWaterSamples / totalSamples : 0,
      shelfWaterRatio: totalSamples ? shelfWaterSamples / totalSamples : 0,
      deepOceanRatio: totalSamples ? deepOceanSamples / totalSamples : 0,
      trenchWaterRatio: totalSamples ? trenchWaterSamples / totalSamples : 0,
      riverRatio: totalSamples ? riverSamples / totalSamples : 0,
      streamRatio: totalSamples ? streamSamples / totalSamples : 0,
      lakeRatio: totalSamples ? lakeSamples / totalSamples : 0,
      glacierRatio: totalSamples ? glacierSamples / totalSamples : 0,
      snowpackRatio: totalSamples ? snowpackSamples / totalSamples : 0,
      floodplainRatio: totalSamples ? floodplainSamples / totalSamples : 0,
      deltaRatio: totalSamples ? deltaSamples / totalSamples : 0,
      springRatio: totalSamples ? springSamples / totalSamples : 0,
      subterraneanRatio: totalSamples ? subterraneanSamples / totalSamples : 0,
      beachOutlineRatio: totalSamples ? beachOutlineSamples / totalSamples : 0,
      beachRimRatio: totalSamples ? beachRimSamples / totalSamples : 0,
      sandCoveredRatio: totalSamples ? sandCoveredSamples / totalSamples : 0,
      exposedLandRatio: totalSamples ? exposedLandSamples / totalSamples : 0,
      visibleLandRatio: totalSamples ? visibleLandSamples / totalSamples : 0,

      maxHydration,
      maxSurfaceWater,
      maxOceanDepth,
      maxBathymetry,
      maxVisibleDepth,
      maxWaterVisibility,
      maxCoastalBlue,
      maxDeepBlue,
      maxTrenchDark,
      maxBeachOutline,
      maxBeachRim,
      maxRiver,
      maxLake,
      maxGlacier,

      visualSurfaceClasses: Object.freeze(Array.from(visualSurfaceClasses)),
      waterClasses: Object.freeze(Array.from(waterClasses)),
      visibleDepthClasses: Object.freeze(Array.from(visibleDepthClasses)),
      visualSurfaceClassCount: visualSurfaceClasses.size,

      beachOutlineOnly: true,
      sandInteriorBlocked: true,
      wholeLandBeachBlocked: true,
      waterDominatesSeaLevel: true,
      hydrationMayCoverSand: true,
      inlandTerrainPlaceholderActive: true,

      hydrationAllowedToRender: true,
      seaLevelHydrationActive: true,
      waterDepthActive: true,
      depthVisibilityActive: true,
      beachRimActive: true,
      exposedLandReportActive: true,
      hydrationContract: CONTRACTS.hydrationCurrent,
      topologyContract: CONTRACTS.topologyCurrent,
      emitsVisualSurfaceClass: true,
      waterFirstVisualAuthority: true
    })
  });
}

function getRuntimeSampleFromCompositeField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) return null;

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || null;
}

function buildRuntimeCache(options) {
  const layerCache = {
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    fieldWidth: options.fieldWidth,
    fieldHeight: options.fieldHeight,
    runtimeOptions: options,

    topologyField: null,
    tectonicsField: null,
    terrainField: null,
    hydrationField: null,

    topologyStatus: null,
    tectonicsStatus: null,
    terrainStatus: null,
    hydrationStatus: null,
    seaLevelEstimate: null
  };

  layerCache.topologyField = safeCall(null, () =>
    buildTopologyField(options.fieldWidth, options.fieldHeight, options.topologyContext)
  );

  layerCache.tectonicsField = safeCall(null, () =>
    buildTectonicsField(options.fieldWidth, options.fieldHeight, {
      ...options.tectonicsContext,
      topologyContext: options.topologyContext
    })
  );

  layerCache.terrainField = safeCall(null, () =>
    buildTerrainField(options.fieldWidth, options.fieldHeight, {
      ...options.terrainContext,
      topologyContext: options.topologyContext,
      tectonicsContext: options.tectonicsContext
    })
  );

  layerCache.hydrationField = safeCall(null, () =>
    buildHydrationField(options.fieldWidth, options.fieldHeight, {
      ...options.hydrationContext,
      topologyContext: options.topologyContext,
      tectonicsContext: options.tectonicsContext,
      terrainContext: options.terrainContext
    })
  );

  layerCache.topologyStatus = safeCall(null, () => getTopologyStatus());
  layerCache.tectonicsStatus = safeCall(null, () => getTectonicsStatus());
  layerCache.terrainStatus = safeCall(null, () => getTerrainStatus());
  layerCache.hydrationStatus = safeCall(null, () => getHydrationStatus());

  layerCache.seaLevelEstimate = safeCall(null, () =>
    estimateEarthEquivalentSeaLevel(96, 48, options.topologyContext)
  );

  const runtimeField = buildRuntimeCompositeField(layerCache);

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    fieldWidth: options.fieldWidth,
    fieldHeight: options.fieldHeight,
    runtimeOptions: options,

    topologyField: layerCache.topologyField,
    tectonicsField: layerCache.tectonicsField,
    terrainField: layerCache.terrainField,
    hydrationField: layerCache.hydrationField,
    runtimeField,

    topologyStatus: layerCache.topologyStatus,
    tectonicsStatus: layerCache.tectonicsStatus,
    terrainStatus: layerCache.terrainStatus,
    hydrationStatus: layerCache.hydrationStatus,
    seaLevelEstimate: layerCache.seaLevelEstimate,

    createdAt: Date.now(),
    runtimeCacheActive: true,
    lowLagSampling: true,
    hydrationCacheActive: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,
    hydrationConsumedAfterTerrain: true,
    hydrationAllowedToRender: true,
    seaLevelHydrationActive: true,
    waterDepthActive: true,
    depthVisibilityActive: true,
    beachRimActive: true,
    exposedLandReportActive: true,
    consumesBeachOutlineTopology: true,
    consumesVisibleDepthHydration: true,
    emitsVisualSurfaceClass: true,
    waterFirstVisualAuthority: true,

    topologyContract: CONTRACTS.topologyCurrent,
    hydrationContract: CONTRACTS.hydrationCurrent
  });
}

function sampleFromRuntimeCache(cache, u, v) {
  const cached = getRuntimeSampleFromCompositeField(cache.runtimeField, u, v);

  if (cached) return cached;

  return composeRuntimeSampleFromLayers(cache, u, v);
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

        contracts: CONTRACTS,

        fieldWidth: cache.fieldWidth,
        fieldHeight: cache.fieldHeight,

        runtimeCacheActive: true,
        lowLagSampling: true,
        hydrationCacheActive: true,
        runtimeCompositeFieldActive: true,
        perPixelChainRecalculation: false,
        routeSamplesCompositeField: true,

        consumesBeachOutlineTopology: true,
        consumesVisibleDepthHydration: true,
        consumesSeaLevelHydration: true,
        hydrationConsumedAfterTerrain: true,
        hydrationAllowedToRender: true,
        seaLevelHydrationActive: true,
        waterDepthActive: true,
        depthVisibilityActive: true,
        beachRimActive: true,
        exposedLandReportActive: true,
        emitsVisualSurfaceClass: true,
        waterFirstVisualAuthority: true,

        topologyContract: CONTRACTS.topologyCurrent,
        hydrationContract: CONTRACTS.hydrationCurrent,

        topologyLoaded: Boolean(cache.topologyField && cache.topologyField.samples),
        tectonicsLoaded: Boolean(cache.tectonicsField && cache.tectonicsField.samples),
        terrainLoaded: Boolean(cache.terrainField && cache.terrainField.samples),
        hydrationLoaded: Boolean(cache.hydrationField && cache.hydrationField.samples),
        runtimeFieldLoaded: Boolean(cache.runtimeField && cache.runtimeField.samples),

        topologyStatus: cache.topologyStatus,
        tectonicsStatus: cache.tectonicsStatus,
        terrainStatus: cache.terrainStatus,
        hydrationStatus: cache.hydrationStatus,
        seaLevelEstimate: cache.seaLevelEstimate,
        runtimeFieldStats: cache.runtimeField.stats,

        layerOrder: RUNTIME_LAW.layerOrder,
        chain: RUNTIME_LAW.chain,
        topologyFirst: true,
        tectonicsSecond: true,
        terrainThird: true,
        hydrationFourth: true,

        hydrationHeld: false,
        hydrationActiveInRuntime: true,

        beachOutlineOnly: true,
        sandInteriorBlocked: true,
        wholeLandBeachBlocked: true,
        waterDominatesSeaLevel: true,
        hydrationMayCoverSand: true,
        inlandTerrainPlaceholderActive: true,

        ownsCameraControl: false,
        ownsZoomControl: false,
        ownsSpinControl: false,
        ownsRouteRendering: false,
        ownsFinalRender: false,

        foliageClosed: true,
        climateClosed: true,
        ecologyClosed: true,
        animalsClosed: true,
        marineLifeClosed: true,
        constructCivilizationClosed: true,
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

  const samples = new Array(w * h);

  let landSamples = 0;
  let waterSamples = 0;
  let iceSamples = 0;
  let hydratedSamples = 0;
  let oceanHydrationSamples = 0;
  let beachSamples = 0;
  let sandSamples = 0;
  let visibleLandSamples = 0;
  let foliageSamples = 0;

  let maxHydration = 0;
  let maxSurfaceWater = 0;
  let maxVisibleDepth = 0;
  let maxWaterVisibility = 0;

  const visualSurfaceClasses = new Set();
  const waterClasses = new Set();

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = runtime.sampleRuntimeState(u, v, options);
      samples[y * w + x] = sample;

      visualSurfaceClasses.add(sample.visualSurfaceClass);
      waterClasses.add(sample.waterClass);

      if (sample.isIce) iceSamples += 1;
      else if (sample.isLandFootprint) landSamples += 1;
      else waterSamples += 1;

      if (sample.isHydrated) hydratedSamples += 1;
      if (sample.isOceanWater) oceanHydrationSamples += 1;
      if (sample.isBeach) beachSamples += 1;
      if (sample.isSand) sandSamples += 1;
      if (sample.landStillVisibleAfterHydration) visibleLandSamples += 1;
      if (sample.foliage || sample.trees || sample.vegetation) foliageSamples += 1;

      maxHydration = Math.max(maxHydration, sample.hydrationActivationIndex);
      maxSurfaceWater = Math.max(maxSurfaceWater, sample.surfaceWaterIndex);
      maxVisibleDepth = Math.max(maxVisibleDepth, sample.visibleWaterDepthIndex);
      maxWaterVisibility = Math.max(maxWaterVisibility, sample.waterVisibilityIndex);
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    width: w,
    height: h,
    samples,
    runtimeStatus: runtime.getStatus(),
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,

    stats: Object.freeze({
      totalSamples: samples.length,
      landSamples,
      waterSamples,
      iceSamples,
      hydratedSamples,
      oceanHydrationSamples,
      beachSamples,
      sandSamples,
      visibleLandSamples,
      foliageSamples,

      landRatio: samples.length ? landSamples / samples.length : 0,
      waterRatio: samples.length ? waterSamples / samples.length : 0,
      iceRatio: samples.length ? iceSamples / samples.length : 0,
      hydrationRatio: samples.length ? hydratedSamples / samples.length : 0,
      oceanHydrationRatio: samples.length ? oceanHydrationSamples / samples.length : 0,
      beachRatio: samples.length ? beachSamples / samples.length : 0,
      sandRatio: samples.length ? sandSamples / samples.length : 0,
      visibleLandRatio: samples.length ? visibleLandSamples / samples.length : 0,

      maxHydration,
      maxSurfaceWater,
      maxVisibleDepth,
      maxWaterVisibility,

      visualSurfaceClasses: Object.freeze(Array.from(visualSurfaceClasses)),
      waterClasses: Object.freeze(Array.from(waterClasses)),
      visualSurfaceClassCount: visualSurfaceClasses.size,

      runtimeCacheActive: true,
      lowLagSampling: true,
      hydrationCacheActive: true,
      runtimeCompositeFieldActive: true,
      perPixelChainRecalculation: false,

      topologyFirst: true,
      tectonicsSecond: true,
      terrainThird: true,
      hydrationFourth: true,

      hydrationHeld: false,
      hydrationAllowedToRender: true,
      hydrationConsumedAfterTerrain: true,
      seaLevelHydrationActive: true,
      waterDepthActive: true,
      depthVisibilityActive: true,
      beachRimActive: true,
      exposedLandReportActive: true,
      consumesBeachOutlineTopology: true,
      consumesVisibleDepthHydration: true,
      emitsVisualSurfaceClass: true,
      waterFirstVisualAuthority: true,

      topologyContract: CONTRACTS.topologyCurrent,
      hydrationContract: CONTRACTS.hydrationCurrent,

      beachOutlineOnly: true,
      sandInteriorBlocked: true,
      wholeLandBeachBlocked: true,
      waterDominatesSeaLevel: true,
      hydrationMayCoverSand: true,
      inlandTerrainPlaceholderActive: true,

      foliageClosed: true,
      visualPassClaimed: false
    })
  });
}

export function getRuntimeStatus() {
  const runtime = sharedRuntime || createAudraliaRuntime();

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active",
    id: "audralia-runtime-allow-visible-hydration-depth",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    contracts: CONTRACTS,
    runtimeLaw: RUNTIME_LAW,

    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,
    hydrationAuthority: HYDRATION_AUTHORITY,

    topologyContract: CONTRACTS.topologyCurrent,
    hydrationContract: CONTRACTS.hydrationCurrent,

    exports: Object.freeze([
      "createAudraliaRuntime",
      "sampleRuntimeState",
      "sampleAudraliaPlanetState",
      "buildAudraliaRuntimeField",
      "getRuntimeStatus"
    ]),

    layerOrder: RUNTIME_LAW.layerOrder,
    chain: "topology→tectonics→terrain→hydration",
    topologyFirst: true,
    tectonicsSecond: true,
    terrainThird: true,
    hydrationFourth: true,

    runtimeCacheActive: true,
    lowLagSampling: true,
    hydrationCacheActive: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,
    routeSamplesCompositeField: true,

    consumesBeachOutlineTopology: true,
    consumesVisibleDepthHydration: true,
    consumesSeaLevelHydration: true,
    hydrationConsumedAfterTerrain: true,
    hydrationHeld: false,
    hydrationAllowedToRender: true,
    seaLevelHydrationActive: true,
    waterDepthActive: true,
    depthVisibilityActive: true,
    beachRimActive: true,
    exposedLandReportActive: true,
    emitsVisualSurfaceClass: true,
    waterFirstVisualAuthority: true,

    fieldWidth: runtime.cache.fieldWidth,
    fieldHeight: runtime.cache.fieldHeight,

    topologyLoaded: Boolean(runtime.cache.topologyField && runtime.cache.topologyField.samples),
    tectonicsLoaded: Boolean(runtime.cache.tectonicsField && runtime.cache.tectonicsField.samples),
    terrainLoaded: Boolean(runtime.cache.terrainField && runtime.cache.terrainField.samples),
    hydrationLoaded: Boolean(runtime.cache.hydrationField && runtime.cache.hydrationField.samples),
    runtimeFieldLoaded: Boolean(runtime.cache.runtimeField && runtime.cache.runtimeField.samples),

    topologyStatus: runtime.cache.topologyStatus,
    tectonicsStatus: runtime.cache.tectonicsStatus,
    terrainStatus: runtime.cache.terrainStatus,
    hydrationStatus: runtime.cache.hydrationStatus,
    seaLevelEstimate: runtime.cache.seaLevelEstimate,
    runtimeFieldStats: runtime.cache.runtimeField.stats,

    ownsRuntimeSampling: true,
    ownsChainComposition: true,
    ownsPerformanceCache: true,
    ownsRouteDataHandoff: true,
    ownsVisualSurfaceClassification: true,

    ownsTopology: false,
    ownsTectonics: false,
    ownsTerrain: false,
    ownsHydration: false,
    ownsLandFootprint: false,
    ownsLandExpansion: false,
    ownsAboveSeaElevation: false,
    ownsWaterPlacement: false,
    ownsWaterFill: false,

    ownsCameraControl: false,
    ownsZoomControl: false,
    ownsSpinControl: false,
    ownsRouteRendering: false,
    ownsFinalRender: false,

    hydrationActiveInRuntime: true,

    beachOutlineOnly: true,
    sandInteriorBlocked: true,
    wholeLandBeachBlocked: true,
    waterDominatesSeaLevel: true,
    hydrationMayCoverSand: true,
    inlandTerrainPlaceholderActive: true,

    foliageClosed: true,
    climateClosed: true,
    ecologyClosed: true,
    animalsClosed: true,
    marineLifeClosed: true,
    constructCivilizationClosed: true,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
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
