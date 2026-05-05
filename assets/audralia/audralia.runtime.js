// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_CACHED_TOPOLOGY_TECTONICS_TERRAIN_CHAIN_TNT_v2
//
// Role:
// - Audralia runtime authority.
// - Consumes topology first.
// - Consumes tectonics second.
// - Consumes terrain third.
// - Provides cached, low-lag runtime sampling for the route compositor.
// - Prevents route-level per-pixel calls from recalculating topology, tectonics, and terrain repeatedly.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No land generation outside topology.
// - No tectonic overwrite.
// - No terrain land expansion.
// - No active hydration.
// - No foliage.
// - No trees.
// - No vegetation.
// - No graphic box.
// - No image generation.
// - No visual pass claim.

import {
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  estimateEarthEquivalentSeaLevel,
  getTopologyStatus
} from "./audralia.topology.render.js?v=AUDRALIA_G1_TOPOLOGY_LANDMASS_100_PERCENT_EXPANSION_SMALL_CONTINENTS_TNT_v1";

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
} from "./audralia.terrain.render.js?v=AUDRALIA_G1_TERRAIN_HYDROLOGY_MAP_CHILD_TNT_v1";

const RECEIPT = "AUDRALIA_RUNTIME_CACHED_TOPOLOGY_TECTONICS_TERRAIN_CHAIN_TNT_v2";

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_RUNTIME_CACHED_CHAIN";
const FILE = "/assets/audralia/audralia.runtime.js";

const TOPOLOGY_AUTHORITY = "/assets/audralia/audralia.topology.render.js";
const TECTONICS_AUTHORITY = "/assets/audralia/audralia.tectonics.render.js";
const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";
const HYDRATION_AUTHORITY_LATER = "/assets/audralia/audralia.hydration.render.js";

const CONTRACTS = Object.freeze({
  runtime: RECEIPT,
  topology: "AUDRALIA_G1_TOPOLOGY_LANDMASS_100_PERCENT_EXPANSION_SMALL_CONTINENTS_TNT_v1",
  topologyCompatibleReceipt: "AUDRALIA_G1_TOPOLOGY_PLANET_BLUEPRINT_AND_SUBTERRANEAN_DEPTH_TNT_v1",
  tectonics: "AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1",
  terrainCurrent: "AUDRALIA_G1_TERRAIN_HYDROLOGY_MAP_CHILD_TNT_v1",
  routeExpected: "AUDRALIA_ROUTE_TRUE_ORTHOGRAPHIC_GLOBE_RENDER_TNT_v2"
});

const RUNTIME_LAW = Object.freeze({
  layerOrder: Object.freeze(["topology", "tectonics", "terrain", "hydration_later"]),
  topologyFirst: true,
  tectonicsSecond: true,
  terrainThird: true,
  hydrationHeld: true,

  ownsRuntimeSampling: true,
  ownsChainComposition: true,
  ownsPerformanceCache: true,
  ownsRouteDataHandoff: true,

  ownsTopology: false,
  ownsTectonics: false,
  ownsTerrain: false,
  ownsLandFootprint: false,
  ownsLandExpansion: false,
  ownsAboveSeaElevation: false,
  ownsHydration: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsRouteRendering: false,
  ownsFinalRender: false,
  visualPassClaimed: false,

  terrainMustRespectTopologyLandArea: true,
  routeMustNotGenerateLand: true,
  routeMustConsumeRuntime: true
});

const DEFAULTS = Object.freeze({
  fieldWidth: 192,
  fieldHeight: 96,
  maxFieldWidth: 320,
  maxFieldHeight: 160,
  minFieldWidth: 48,
  minFieldHeight: 24,

  topologyContext: Object.freeze({
    blueprintResolution: 0.88,
    coastlineComplexity: 0.92,
    connectionStrength: 0.90,
    subterraneanPressure: 0.72,
    landExpansionMultiplier: 2,
    enforceEarthEquivalentLandRatio: false
  }),

  tectonicsContext: Object.freeze({
    tectonicStressDemand: 0.84,
    ancientMountainMemory: 0.96,
    mineralExposureDemand: 0.88,
    erosionAge: 1
  }),

  terrainContext: Object.freeze({
    coherenceIndex: 0.94,
    collaborativeExpression: 0.90
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

function safeCall(label, fallback, fn) {
  try {
    return fn();
  } catch (error) {
    return Object.freeze({
      ok: false,
      runtimeFallback: true,
      label,
      error: error && error.message ? error.message : String(error),
      fallback
    });
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
    hydrationEnabled: false,
    foliageEnabled: false,
    visualPassClaimed: false
  });
}

function fallbackTopologySample(u, v) {
  const point = normalizeUV(u, v);
  return Object.freeze({
    receipt: "RUNTIME_FALLBACK_TOPOLOGY_SAMPLE",
    planetaryObject: PLANETARY_OBJECT,
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    isLandFootprint: false,
    isAboveWaterLandFootprint: false,
    isVoidFootprint: true,
    isSouthPolarIceFootprint: point.lat < -0.78,
    isBeach: false,
    isSand: false,
    isRock: false,
    isShelf: false,
    surfaceClass: point.lat < -0.78 ? "polar_ice_footprint" : "void_mid_ocean",
    surfaceClassId: point.lat < -0.78 ? 12 : 3,
    landBodyId: 0,
    landBodyKey: "void_ocean",
    oceanDepthIndex: 0.54,
    bathymetryBlueprintIndex: 0.46,
    trenchDepthIndex: 0,
    shelfDepthIndex: 0,
    terrainRisePermission: 0,
    terrainBlockPermission: 1,
    terrainSeedClass: "void_no_rise",
    foliage: false,
    trees: false,
    vegetation: false,
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
  const ice = Boolean(topology && topology.isSouthPolarIceFootprint);

  return Object.freeze({
    receipt: "RUNTIME_FALLBACK_TERRAIN_SAMPLE",
    planetaryObject: PLANETARY_OBJECT,
    u,
    v,
    isLand: land,
    isWater: !land && !ice,
    isIce: ice,
    normalizedElevation: land ? clamp(Number(topology.terrainRisePermission) || 0.28, 0, 1) : -clamp(Number(topology.oceanDepthIndex) || 0.44, 0, 1),
    elevationMeters: land ? Math.round((Number(topology.terrainRisePermission) || 0.28) * 9200) : 0,
    ridge: 0,
    basin: land ? 0.28 : 0,
    slope: 0,
    coastPressure: Number(topology.shorelinePressure) || 0,
    shelfPermission: Number(topology.reefShelfPermission) || 0,
    riverbedPressure: 0,
    streamPressure: 0,
    lakeBasinPressure: 0,
    glacierSeatPressure: ice ? 0.8 : 0,
    valleyChannelPressure: 0,
    hydrologyReadinessIndex: 0,
    ownsHydration: false,
    ownsFoliage: false,
    visualPassClaimed: false
  });
}

function buildRuntimeCache(options) {
  const topologyField = safeCall("buildTopologyField", null, () =>
    buildTopologyField(options.fieldWidth, options.fieldHeight, options.topologyContext)
  );

  const tectonicsField = safeCall("buildTectonicsField", null, () =>
    buildTectonicsField(options.fieldWidth, options.fieldHeight, {
      ...options.tectonicsContext,
      topologyContext: options.topologyContext
    })
  );

  const terrainField = safeCall("buildTerrainField", null, () =>
    buildTerrainField(options.fieldWidth, options.fieldHeight, options.terrainContext)
  );

  const topologyStatus = safeCall("getTopologyStatus", null, () => getTopologyStatus());
  const tectonicsStatus = safeCall("getTectonicsStatus", null, () => getTectonicsStatus());
  const terrainStatus = safeCall("getTerrainStatus", null, () => getTerrainStatus());

  const seaLevelEstimate = safeCall("estimateEarthEquivalentSeaLevel", null, () =>
    estimateEarthEquivalentSeaLevel(96, 48, options.topologyContext)
  );

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    fieldWidth: options.fieldWidth,
    fieldHeight: options.fieldHeight,
    topologyField,
    tectonicsField,
    terrainField,
    topologyStatus,
    tectonicsStatus,
    terrainStatus,
    seaLevelEstimate,
    createdAt: Date.now(),
    runtimeCacheActive: true,
    lowLagSampling: true
  });
}

function fieldSample(field, getter, fallback, u, v, extra) {
  if (field && field.samples && field.width && field.height && typeof getter === "function") {
    return safeCall("fieldSample", fallback, () => getter(field, u, v));
  }

  return safeCall("directSample", fallback, () => extra());
}

function getTopologyFromCache(cache, u, v) {
  const fallback = fallbackTopologySample(u, v);

  return fieldSample(
    cache.topologyField,
    getTopologySampleFromField,
    fallback,
    u,
    v,
    () => sampleTopology(u, v, DEFAULTS.topologyContext)
  );
}

function getTectonicsFromCache(cache, u, v, topologySample) {
  const fallback = fallbackTectonicsSample(u, v, topologySample);

  return fieldSample(
    cache.tectonicsField,
    getTectonicsSampleFromField,
    fallback,
    u,
    v,
    () => sampleTectonics(u, v, topologySample, DEFAULTS.tectonicsContext)
  );
}

function getTerrainFromCache(cache, u, v, topologySample) {
  const fallback = fallbackTerrainSample(u, v, topologySample);

  return fieldSample(
    cache.terrainField,
    getTerrainSampleFromField,
    fallback,
    u,
    v,
    () => sampleTerrain(u, v, DEFAULTS.terrainContext)
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
        topology.isSand ||
        String(topology.beachType || "").includes("beach") ||
        String(topology.surfaceClass || "").includes("beach")
      )
  );
}

function topologyAllowsRock(topology) {
  return Boolean(
    topology &&
      (
        topology.isRock ||
        String(topology.surfaceClass || "").includes("rock") ||
        Number(topology.rockPressure) > 0.44
      )
  );
}

function composeRuntimeSample(cache, uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);

  const topology = getTopologyFromCache(cache, point.u, point.v);
  const tectonics = getTectonicsFromCache(cache, point.u, point.v, topology);
  const terrain = getTerrainFromCache(cache, point.u, point.v, topology);

  const landAllowed = topologyAllowsLand(topology);
  const iceAllowed = topologyAllowsIce(topology);
  const beachAllowed = topologyAllowsBeach(topology);
  const rockAllowed = topologyAllowsRock(topology);

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
    : landAllowed
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

  const ridge = landAllowed
    ? clamp(
        (Number(terrain.ridge) || 0) * 0.34 +
          (Number(tectonics.mountainChainPermission) || 0) * 0.36 +
          (Number(tectonics.upliftPermission) || 0) * 0.18 +
          (Number(topology.cliffRisePermission) || 0) * 0.12,
        0,
        1
      )
    : 0;

  const canyon = landAllowed
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

  const hydrologyReadinessIndex = landAllowed
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

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    runtimeChain: "topology→tectonics→terrain",
    runtimeCacheActive: true,
    lowLagSampling: true,

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

    isLandFootprint: landAllowed,
    isAboveWaterLandFootprint: landAllowed && !iceAllowed,
    isVoidFootprint: !landAllowed && !iceAllowed,
    topologyLandFootprint: landAllowed,
    topologyVoidFootprint: !landAllowed && !iceAllowed,
    isWater: !landAllowed && !iceAllowed,
    isLand: landAllowed,
    isIce: iceAllowed,
    isSouthPolarIceFootprint: iceAllowed,
    southIce: iceAllowed,

    isBeach: beachAllowed,
    isSand: Boolean(topology.isSand || beachAllowed),
    isRock: rockAllowed,
    isShelf: Boolean(topology.isShelf),
    isCoastline: Boolean(topology.isCoastline),
    isIslandFootprint: Boolean(topology.isIslandFootprint),
    isConnectedLandSystem: Boolean(topology.isConnectedLandSystem),
    isSmallContinentFootprint: Boolean(topology.isSmallContinentFootprint),

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

    oceanDepthIndex: clamp(Number(topology.oceanDepthIndex) || 0, 0, 1),
    bathymetryBlueprintIndex: clamp(Number(topology.bathymetryBlueprintIndex) || 0, 0, 1),
    trenchDepthIndex: clamp(Number(topology.trenchDepthIndex) || Number(tectonics.trenchReinforcementPermission) || 0, 0, 1),
    shelfDepthIndex: clamp(Number(topology.shelfDepthIndex) || Number(topology.reefShelfPermission) || 0, 0, 1),
    basinDepthIndex: clamp(Number(topology.basinDepthIndex) || 0, 0, 1),
    depthClassKey: topology.depthClassKey || topology.oceanDepthClass || "land",

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
    terrainAllowedByTopology: landAllowed,
    terrainMustNotExpandLandArea: true,

    normalizedElevation,
    elevationMeters: landAllowed ? Math.round(normalizedElevation * 9200) : Math.round(normalizedElevation * 5600),
    ridge,
    basin: clamp(Number(terrain.basin) || Number(topology.basinDepressionPermission) || 0, 0, 1),
    slope: clamp(Number(terrain.slope) || ridge * 0.42 + canyon * 0.24 + cliff * 0.18, 0, 1),
    canyonPressure: canyon,
    riverIncisionPressure: clamp(Number(terrain.riverIncisionPressure) || canyon * 0.62, 0, 1),
    valleyChannelPressure: clamp(Number(terrain.valleyChannelPressure) || canyon * 0.58, 0, 1),
    riverbedPressure: landAllowed ? clamp(Number(terrain.riverbedPressure) || canyon * 0.48, 0, 1) : 0,
    streamPressure: landAllowed ? clamp(Number(terrain.streamPressure) || canyon * 0.34, 0, 1) : 0,
    lakeBasinPressure: landAllowed ? clamp(Number(terrain.lakeBasinPressure) || Number(terrain.basin) || 0, 0, 1) : 0,
    glacierSeatPressure: clamp(Number(terrain.glacierSeatPressure) || (iceAllowed ? 0.8 : 0), 0, 1),
    hydrologyReadinessIndex,

    activeHydrationOwnedHere: false,
    hydrationHeld: true,
    hydrationEnabled: false,
    foliageEnabled: false,

    foliage: false,
    trees: false,
    vegetation: false,
    ownsHydration: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsRouteRendering: false,
    ownsFinalRender: false,
    visualPassClaimed: false
  });
}

export function createAudraliaRuntime(options = {}) {
  const runtimeOptions = getRuntimeOptions(options);
  const cache = buildRuntimeCache(runtimeOptions);

  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    runtimeOptions,
    cache,

    sampleRuntimeState(u, v, context = {}) {
      return composeRuntimeSample(cache, u, v, context);
    },

    sampleAudraliaPlanetState(u, v, context = {}) {
      return composeRuntimeSample(cache, u, v, context);
    },

    getStatus() {
      return Object.freeze({
        ok: true,
        receipt: RECEIPT,
        status: "active",
        planetaryObject: PLANETARY_OBJECT,
        generation: GENERATION,
        file: FILE,
        fieldWidth: cache.fieldWidth,
        fieldHeight: cache.fieldHeight,
        runtimeCacheActive: true,
        lowLagSampling: true,
        topologyLoaded: Boolean(cache.topologyField && cache.topologyField.samples),
        tectonicsLoaded: Boolean(cache.tectonicsField && cache.tectonicsField.samples),
        terrainLoaded: Boolean(cache.terrainField && cache.terrainField.samples),
        topologyStatus: cache.topologyStatus,
        tectonicsStatus: cache.tectonicsStatus,
        terrainStatus: cache.terrainStatus,
        seaLevelEstimate: cache.seaLevelEstimate,
        layerOrder: RUNTIME_LAW.layerOrder,
        topologyFirst: true,
        tectonicsSecond: true,
        terrainThird: true,
        hydrationHeld: true,
        foliageClosed: true,
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
  let beachSamples = 0;
  let smallContinentSamples = 0;
  let foliageSamples = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = runtime.sampleRuntimeState(u, v, options);
      samples[y * w + x] = sample;

      if (sample.isIce) iceSamples += 1;
      else if (sample.isLandFootprint) landSamples += 1;
      else waterSamples += 1;

      if (sample.isBeach) beachSamples += 1;
      if (sample.isSmallContinentFootprint) smallContinentSamples += 1;
      if (sample.foliage || sample.trees || sample.vegetation) foliageSamples += 1;
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    width: w,
    height: h,
    samples,
    runtimeStatus: runtime.getStatus(),
    stats: Object.freeze({
      totalSamples: samples.length,
      landSamples,
      waterSamples,
      iceSamples,
      beachSamples,
      smallContinentSamples,
      foliageSamples,
      landRatio: landSamples / samples.length,
      waterRatio: waterSamples / samples.length,
      iceRatio: iceSamples / samples.length,
      beachRatio: beachSamples / samples.length,
      smallContinentRatio: smallContinentSamples / samples.length,
      runtimeCacheActive: true,
      lowLagSampling: true,
      topologyFirst: true,
      tectonicsSecond: true,
      terrainThird: true,
      hydrationHeld: true,
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
    status: "active",
    id: "audralia-runtime-cached-topology-tectonics-terrain-chain",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    contracts: CONTRACTS,
    runtimeLaw: RUNTIME_LAW,

    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,
    hydrationAuthorityLater: HYDRATION_AUTHORITY_LATER,

    exports: Object.freeze([
      "createAudraliaRuntime",
      "sampleRuntimeState",
      "sampleAudraliaPlanetState",
      "buildAudraliaRuntimeField",
      "getRuntimeStatus"
    ]),

    layerOrder: RUNTIME_LAW.layerOrder,
    chain: "topology→tectonics→terrain",
    topologyFirst: true,
    tectonicsSecond: true,
    terrainThird: true,

    runtimeCacheActive: true,
    lowLagSampling: true,
    fieldWidth: runtime.cache.fieldWidth,
    fieldHeight: runtime.cache.fieldHeight,

    topologyLoaded: Boolean(runtime.cache.topologyField && runtime.cache.topologyField.samples),
    tectonicsLoaded: Boolean(runtime.cache.tectonicsField && runtime.cache.tectonicsField.samples),
    terrainLoaded: Boolean(runtime.cache.terrainField && runtime.cache.terrainField.samples),

    topologyStatus: runtime.cache.topologyStatus,
    tectonicsStatus: runtime.cache.tectonicsStatus,
    terrainStatus: runtime.cache.terrainStatus,
    seaLevelEstimate: runtime.cache.seaLevelEstimate,

    ownsRuntimeSampling: true,
    ownsChainComposition: true,
    ownsPerformanceCache: true,
    ownsRouteDataHandoff: true,

    ownsTopology: false,
    ownsTectonics: false,
    ownsTerrain: false,
    ownsLandFootprint: false,
    ownsLandExpansion: false,
    ownsAboveSeaElevation: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsRouteRendering: false,
    ownsFinalRender: false,

    hydrationHeld: true,
    foliageClosed: true,
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
