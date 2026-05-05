// /assets/audralia/audralia.hydration.render.js
// AUDRALIA_HYDRATION_VISIBLE_DEPTH_BEACH_RIM_EXPOSED_LAND_TNT_v1
//
// Role:
// - Audralia hydration authority.
// - Consumes topology, tectonics, and terrain.
// - Makes sea-level hydration visually legible.
// - Amplifies water-depth classes so the route can distinguish coastal water,
//   shelf water, open ocean, deep ocean, trench water, river flow, lake fill,
//   glacier/snowpack, beach-contact rim, and exposed land.
// - Reports remaining exposed land after hydration without redefining topology.
//
// Correction:
// - Hydration no longer reads as a flat pale sand/opal sheet.
// - Ocean depth, shelf depth, trench darkness, coastal contact, and beach rim
//   receive explicit visibility indexes.
// - Hydration may cover sand, but it does not own or rewrite land footprint.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No runtime rendering.
// - No land generation.
// - No topology rewrite.
// - No tectonic overwrite.
// - No terrain elevation ownership.
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

const RECEIPT = "AUDRALIA_HYDRATION_VISIBLE_DEPTH_BEACH_RIM_EXPOSED_LAND_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_HYDRATION_SEA_LEVEL_WATER_DEPTH_BEACH_OUTLINE_TNT_v1",
  "AUDRALIA_G1_HYDRATION_CONSUME_TOPOLOGY_TECTONICS_TERRAIN_WATERDOWN_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_HYDRATION_VISIBLE_DEPTH_BEACH_RIM_EXPOSED_LAND";
const FILE = "/assets/audralia/audralia.hydration.render.js";

const TOPOLOGY_AUTHORITY = "/assets/audralia/audralia.topology.render.js";
const TECTONICS_AUTHORITY = "/assets/audralia/audralia.tectonics.render.js";
const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";

const HYDRATION_LAW = Object.freeze({
  ownsHydration: true,
  ownsWaterPlacement: true,
  ownsWaterFlowPermission: true,
  ownsWaterDepthVisibility: true,
  ownsBeachContactRim: true,
  ownsExposedLandReport: true,

  ownsTopology: false,
  ownsLandFootprint: false,
  ownsVoidFootprint: false,
  ownsSeaLevelBoundary: false,
  ownsTectonics: false,
  ownsTerrain: false,
  ownsAboveSeaElevation: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsAnimals: false,
  ownsMarineLife: false,
  ownsConstructCivilization: false,
  ownsRouteRendering: false,
  ownsRuntimeRendering: false,
  ownsFinalRender: false,

  consumesTopology: true,
  consumesTectonics: true,
  consumesTerrain: true,
  seaLevelHydrationActive: true,
  waterDepthActive: true,
  depthVisibilityActive: true,
  beachRimActive: true,
  exposedLandReportActive: true,
  hydrationMayCoverSand: true,
  visualPassClaimed: false
});

const CONTRACTS = Object.freeze({
  hydration: RECEIPT,
  previousHydration: "AUDRALIA_HYDRATION_SEA_LEVEL_WATER_DEPTH_BEACH_OUTLINE_TNT_v1",
  topology: "AUDRALIA_TOPOLOGY_BEACH_OUTLINE_ONLY_WATER_DOMINANT_TNT_v1",
  tectonics: "AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1",
  terrain: "AUDRALIA_G1_TERRAIN_STRONG_RELIEF_TOPOLOGY_TECTONICS_LOCK_TNT_v2",
  runtimeExpected: "AUDRALIA_RUNTIME_CONSUME_BEACH_OUTLINE_TOPOLOGY_SEA_LEVEL_HYDRATION_TNT_v1"
});

const DEFAULTS = Object.freeze({
  fieldWidth: 224,
  fieldHeight: 112,
  minFieldWidth: 64,
  minFieldHeight: 32,
  maxFieldWidth: 512,
  maxFieldHeight: 256,

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

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function fract(value) {
  return value - Math.floor(value);
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

function hash2(x, y, seed) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fract(x);
  const fy = fract(y);

  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return mix(mix(a, b, ux), mix(c, d, ux), uy);
}

function fbm(x, y, seed, octaves) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.00001, normalizer);
}

function normalizeDimension(value, fallback, min, max) {
  return clamp(Math.floor(Number(value) || fallback), min, max);
}

function safeCall(fallback, fn) {
  try {
    const value = fn();
    return value == null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function getOptions(context = {}) {
  return Object.freeze({
    fieldWidth: normalizeDimension(
      context.fieldWidth,
      DEFAULTS.fieldWidth,
      DEFAULTS.minFieldWidth,
      DEFAULTS.maxFieldWidth
    ),
    fieldHeight: normalizeDimension(
      context.fieldHeight,
      DEFAULTS.fieldHeight,
      DEFAULTS.minFieldHeight,
      DEFAULTS.maxFieldHeight
    ),

    topologyContext: Object.freeze({
      ...DEFAULTS.topologyContext,
      ...(context.topologyContext || {})
    }),

    tectonicsContext: Object.freeze({
      ...DEFAULTS.tectonicsContext,
      ...(context.tectonicsContext || {})
    }),

    terrainContext: Object.freeze({
      ...DEFAULTS.terrainContext,
      ...(context.terrainContext || {})
    }),

    hydrationContext: Object.freeze({
      ...DEFAULTS.hydrationContext,
      ...(context.hydrationContext || {}),
      seaLevelFill: Number.isFinite(Number(context.seaLevelFill))
        ? Number(context.seaLevelFill)
        : (context.hydrationContext && Number.isFinite(Number(context.hydrationContext.seaLevelFill)))
          ? Number(context.hydrationContext.seaLevelFill)
          : DEFAULTS.hydrationContext.seaLevelFill
    })
  });
}

function fallbackTopologySample(u, v) {
  const point = normalizeUV(u, v);
  const polarIce = point.lat < -0.80 || point.lat > 0.88;

  return Object.freeze({
    receipt: "HYDRATION_FALLBACK_TOPOLOGY_SAMPLE",
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

    surfaceClass: polarIce ? "polar_ice_footprint" : "open_ocean_blueprint",
    topologySurfaceClass: polarIce ? "polar_ice_footprint" : "open_ocean_blueprint",

    isBeach: false,
    isSand: false,
    isShelf: !polarIce,
    isCoastline: false,
    isCoastalCliff: false,

    beachOutlineOnly: true,
    sandInteriorBlocked: true,
    wholeLandBeachBlocked: true,
    inlandTerrainPlaceholderActive: true,
    waterDominatesSeaLevel: true,

    oceanDepthIndex: polarIce ? 0 : 0.62,
    bathymetryBlueprintIndex: polarIce ? 0 : 0.58,
    trenchDepthIndex: 0,
    shelfDepthIndex: polarIce ? 0 : 0.18,
    basinDepthIndex: polarIce ? 0 : 0.52,
    depthClassKey: polarIce ? "polar_ice" : "open_ocean",

    shorelinePressure: 0,
    beachPressure: 0,
    beachOutlinePressure: 0,
    beachWaterContactIndex: 0,
    sandPressure: 0,
    blackSandPressure: 0,
    whiteSandPressure: 0,
    opalSoftnessIndex: 0,
    diamondDarkSandIndex: 0,
    beachCloudSoftnessIndex: 0,

    coastalExposureIndex: 0,
    coastalCliffPressure: 0,
    seaLevelErosionPressure: 0,
    cliffBaseCut: 0,

    terrainRisePermission: 0,
    terrainBlockPermission: 1,

    subterraneanDepthIndex: polarIce ? 0.3 : 0.58,
    foundationDensityIndex: 0.44,
    rockMassBoundaryIndex: 0.32,

    ownsHydration: false,
    visualPassClaimed: false
  });
}

function fallbackTectonicsSample(u, v, topology) {
  return Object.freeze({
    receipt: "HYDRATION_FALLBACK_TECTONICS_SAMPLE",
    planetaryObject: PLANETARY_OBJECT,
    u,
    v,
    topologyLandFootprint: Boolean(topology && topology.isLandFootprint),
    tectonicType: "hydration_fallback_pressure",
    plateId: 0,
    plateKey: "hydration_fallback_plate",
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
    ownsHydration: false,
    visualPassClaimed: false
  });
}

function fallbackTerrainSample(u, v, topology) {
  const land = Boolean(topology && topology.isLandFootprint);
  const ice = Boolean(topology && (topology.isPolarIceFootprint || topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint));

  return Object.freeze({
    receipt: "HYDRATION_FALLBACK_TERRAIN_SAMPLE",
    planetaryObject: PLANETARY_OBJECT,
    u,
    v,

    isLand: land,
    isWater: !land && !ice,
    isIce: ice,

    normalizedElevation: land
      ? clamp(Number(topology.terrainRisePermission) || 0.28, 0, 1)
      : -clamp(Number(topology.oceanDepthIndex) || 0.50, 0, 1),

    elevationMeters: land ? Math.round((Number(topology.terrainRisePermission) || 0.28) * 9200) : 0,

    ridge: 0,
    mountainPressure: 0,
    canyonPressure: 0,
    basin: land ? 0.28 : 0,
    slope: 0,

    coastPressure: Number(topology.shorelinePressure) || 0,
    shelfPermission: Number(topology.shelfDepthIndex) || 0,

    riverbedPressure: 0,
    streamPressure: 0,
    lakeBasinPressure: 0,
    glacierSeatPressure: ice ? 0.8 : 0,
    snowpackSourcePressure: ice ? 0.7 : 0,
    valleyChannelPressure: 0,
    floodplainPressure: 0,
    deltaReceiverPressure: 0,
    hydrologyReadinessIndex: 0,

    watershedId: land ? "hydration_fallback_land_watershed" : "ocean",
    watershedStrength: 0,

    ownsHydration: false,
    visualPassClaimed: false
  });
}

function getTopology(context, u, v) {
  if (context && context.topologyField) {
    return getTopologySampleFromField(context.topologyField, u, v);
  }

  return safeCall(fallbackTopologySample(u, v), () =>
    sampleTopology(u, v, context && context.topologyContext ? context.topologyContext : DEFAULTS.topologyContext)
  );
}

function getTectonics(context, u, v, topology) {
  if (context && context.tectonicsField) {
    return getTectonicsSampleFromField(context.tectonicsField, u, v);
  }

  return safeCall(fallbackTectonicsSample(u, v, topology), () =>
    sampleTectonics(
      u,
      v,
      topology,
      context && context.tectonicsContext ? context.tectonicsContext : DEFAULTS.tectonicsContext
    )
  );
}

function getTerrain(context, u, v, topology) {
  if (context && context.terrainField) {
    return getTerrainSampleFromField(context.terrainField, u, v);
  }

  return safeCall(fallbackTerrainSample(u, v, topology), () =>
    sampleTerrain(
      u,
      v,
      context && context.terrainContext ? context.terrainContext : DEFAULTS.terrainContext
    )
  );
}

function isLand(topology) {
  return Boolean(
    topology &&
      (
        topology.isLandFootprint ||
        topology.isAboveWaterLandFootprint ||
        topology.topologyLandFootprint
      )
  );
}

function isIce(topology, terrain) {
  return Boolean(
    (topology &&
      (
        topology.isPolarIceFootprint ||
        topology.isSouthPolarIceFootprint ||
        topology.isNorthPolarIceFootprint ||
        topology.surfaceClass === "polar_ice_footprint" ||
        topology.topologySurfaceClass === "polar_ice_footprint"
      )) ||
      (terrain && (terrain.isIce || terrain.southIce))
  );
}

function isBeach(topology) {
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

function isInlandTerrain(topology) {
  return Boolean(
    topology &&
      (
        topology.inlandTerrainPlaceholder ||
        topology.inlandTerrainPlaceholderActive ||
        String(topology.surfaceClass || "").includes("inland_terrain")
      )
  );
}

function deriveOceanDepth(topology, tectonics) {
  const base = clamp(
    Number(topology.oceanDepthIndex) ||
      Number(topology.bathymetryBlueprintIndex) ||
      Number(topology.basinDepthIndex) ||
      0,
    0,
    1
  );

  const bathy = clamp(Number(topology.bathymetryBlueprintIndex) || base, 0, 1);
  const trench = clamp(
    Number(topology.trenchDepthIndex) ||
      Number(tectonics.trenchReinforcementPermission) ||
      0,
    0,
    1
  );

  return clamp(base * 0.54 + bathy * 0.30 + trench * 0.22, 0, 1);
}

function deriveVisibleDepthClass(depth, shelf, trench, coastal) {
  if (trench >= 0.58 || depth >= 0.86) return "trench";
  if (depth >= 0.70) return "deep_ocean";
  if (shelf >= 0.42) return "shelf";
  if (coastal >= 0.36) return "coastal";
  return "open_ocean";
}

function deriveWaterClass(flags) {
  if (flags.glacier > 0.62) return "glacier_mass";
  if (flags.snowpack > 0.62) return "snowpack_source";

  if (flags.ocean) {
    if (flags.trench > 0.58 || flags.depth > 0.86) return "trench_water";
    if (flags.depth > 0.70) return "deep_ocean_water";
    if (flags.shelf > 0.42) return "shelf_water";
    if (flags.coastal > 0.36) return "coastal_water";
    return "ocean_water";
  }

  if (flags.lake > 0.58) return "lake_fill";
  if (flags.river > 0.54) return "river_flow";
  if (flags.stream > 0.50) return "stream_flow";
  if (flags.delta > 0.52) return "delta_wetland";
  if (flags.floodplain > 0.54) return "floodplain_wetland";
  if (flags.spring > 0.50) return "spring_seep";
  if (flags.subterranean > 0.58) return "subterranean_water";

  return "dry_land";
}

function waterClassIdFor(waterClass) {
  switch (waterClass) {
    case "trench_water": return 90;
    case "deep_ocean_water": return 80;
    case "ocean_water": return 70;
    case "shelf_water": return 60;
    case "coastal_water": return 50;
    case "lake_fill": return 40;
    case "river_flow": return 35;
    case "stream_flow": return 30;
    case "delta_wetland": return 25;
    case "floodplain_wetland": return 24;
    case "spring_seep": return 22;
    case "subterranean_water": return 20;
    case "glacier_mass": return 15;
    case "snowpack_source": return 14;
    default: return 0;
  }
}

function deriveFlowDirection(topology, terrain, u, v) {
  const slope = clamp(Number(terrain.slope) || 0, 0, 1);
  const canyon = clamp(Number(terrain.canyonPressure) || Number(terrain.riverIncisionPressure) || 0, 0, 1);
  const coast = clamp(Number(topology.shorelinePressure) || 0, 0, 1);

  const angle = (Number(topology.landBodyId) || 1) * 0.73 + u * Math.PI * 2 + v * Math.PI;
  const strength = clamp(slope * 0.34 + canyon * 0.38 + coast * 0.18, 0, 1);

  return Object.freeze({
    flowDirection: strength > 0.16 ? "terrain_to_receiver" : "none",
    flowVectorX: Math.cos(angle) * strength,
    flowVectorY: Math.sin(angle) * strength,
    flowStrength: strength
  });
}

function composeHydrationSample(uInput, vInput, context = {}) {
  const options = getOptions(context);
  const point = normalizeUV(uInput, vInput);

  const topology = getTopology(options, point.u, point.v);
  const tectonics = getTectonics(options, point.u, point.v, topology);
  const terrain = getTerrain(options, point.u, point.v, topology);

  const land = isLand(topology);
  const ice = isIce(topology, terrain);
  const beach = isBeach(topology);
  const inland = isInlandTerrain(topology);
  const ocean = !land && !ice;

  const h = options.hydrationContext;

  const broadNoise = fbm(point.lon * 4.4 + 1.5, point.lat * 4.4 - 1.1, 808, 4);
  const detailNoise = fbm(point.lon * 13.0 - 2.6, point.lat * 13.0 + 0.8, 909, 4);

  const oceanDepthIndex = ocean
    ? deriveOceanDepth(topology, tectonics)
    : 0;

  const bathymetryHydrationIndex = ocean
    ? clamp(
        oceanDepthIndex * 0.58 +
          (Number(topology.bathymetryBlueprintIndex) || 0) * 0.30 +
          detailNoise * 0.12,
        0,
        1
      )
    : 0;

  const trenchHydrationIndex = ocean
    ? clamp(
        (Number(topology.trenchDepthIndex) || 0) * 0.58 +
          (Number(tectonics.trenchReinforcementPermission) || 0) * 0.26 +
          Math.max(0, detailNoise - 0.52) * 0.38,
        0,
        1
      )
    : 0;

  const shelfPressure = ocean
    ? clamp(
        (Number(topology.shelfDepthIndex) || 0) * 0.58 +
          (Number(topology.reefShelfPermission) || 0) * 0.26 +
          (Number(topology.coastalExposureIndex) || 0) * 0.16,
        0,
        1
      )
    : 0;

  const coastalPressure = ocean
    ? clamp(
        (Number(topology.coastalExposureIndex) || 0) * 0.46 +
          (Number(topology.shorelinePressure) || 0) * 0.34 +
          shelfPressure * 0.18,
        0,
        1
      )
    : 0;

  const visibleWaterDepthClass = ocean
    ? deriveVisibleDepthClass(oceanDepthIndex, shelfPressure, trenchHydrationIndex, coastalPressure)
    : "none";

  const visibleWaterDepthIndex = ocean
    ? clamp(
        oceanDepthIndex * 0.46 +
          bathymetryHydrationIndex * 0.30 +
          trenchHydrationIndex * 0.18 +
          (1 - shelfPressure) * 0.10,
        0,
        1
      )
    : 0;

  const waterVisibilityIndex = ocean
    ? clamp(
        h.visibleDepthDemand * 0.28 +
          visibleWaterDepthIndex * 0.46 +
          Math.abs(detailNoise - 0.5) * 0.18 +
          broadNoise * 0.08,
        0,
        1
      )
    : 0;

  const coastalShelfBlueIndex = ocean
    ? clamp(shelfPressure * 0.62 + coastalPressure * 0.26 + waterVisibilityIndex * 0.12, 0, 1)
    : 0;

  const deepOceanBlueIndex = ocean
    ? clamp(oceanDepthIndex * 0.58 + bathymetryHydrationIndex * 0.26 + (1 - shelfPressure) * 0.16, 0, 1)
    : 0;

  const trenchDarknessIndex = ocean
    ? clamp(trenchHydrationIndex * 0.72 + oceanDepthIndex * 0.18 + detailNoise * 0.10, 0, 1)
    : 0;

  const shorelinePressure = clamp(Number(topology.shorelinePressure) || 0, 0, 1);
  const beachOutlinePressure = clamp(
    Number(topology.beachOutlinePressure) ||
      Number(topology.beachPressure) ||
      (beach ? shorelinePressure : 0),
    0,
    1
  );

  const beachContactRimIndex = clamp(
    beachOutlinePressure * 0.44 +
      shorelinePressure * 0.28 +
      coastalPressure * 0.18 +
      h.beachRimDemand * 0.10,
    0,
    1
  );

  const beachWaterContactIndex = clamp(
    Number(topology.beachWaterContactIndex) ||
      beachContactRimIndex * 0.84 +
        shelfPressure * 0.10,
    0,
    1
  );

  const riverFlowPressure = land
    ? clamp(
        (Number(terrain.riverbedPressure) || 0) * 0.48 +
          (Number(terrain.riverIncisionPressure) || 0) * 0.24 +
          (Number(terrain.hydrologyReadinessIndex) || 0) * 0.18 +
          h.riverActivationDemand * 0.10,
        0,
        1
      )
    : 0;

  const streamFlowPressure = land
    ? clamp(
        (Number(terrain.streamPressure) || 0) * 0.54 +
          (Number(terrain.valleyChannelPressure) || 0) * 0.18 +
          h.streamActivationDemand * 0.10,
        0,
        1
      )
    : 0;

  const lakeFillPressure = land
    ? clamp(
        (Number(terrain.lakeBasinPressure) || 0) * 0.62 +
          (Number(terrain.basin) || 0) * 0.16 +
          h.lakeActivationDemand * 0.10,
        0,
        1
      )
    : 0;

  const glacierMassPressure = ice
    ? clamp(0.72 + h.glacierActivationDemand * 0.18, 0, 1)
    : land
      ? clamp(
          (Number(terrain.glacierSeatPressure) || 0) * 0.66 +
            (Number(terrain.snowpackSourcePressure) || 0) * 0.18 +
            h.glacierActivationDemand * 0.08,
          0,
          1
        )
      : 0;

  const snowpackPressure = ice
    ? clamp(0.64 + h.snowpackActivationDemand * 0.18, 0, 1)
    : land
      ? clamp(
          (Number(terrain.snowpackSourcePressure) || 0) * 0.68 +
            glacierMassPressure * 0.20,
          0,
          1
        )
      : 0;

  const floodplainWetness = land
    ? clamp(
        (Number(terrain.floodplainPressure) || 0) * 0.60 +
          riverFlowPressure * 0.18 +
          h.floodplainActivationDemand * 0.08,
        0,
        1
      )
    : 0;

  const deltaWetness = clamp(
    (Number(terrain.deltaReceiverPressure) || 0) * 0.54 +
      coastalPressure * 0.20 +
      riverFlowPressure * 0.18 +
      h.deltaActivationDemand * 0.06,
    0,
    1
  );

  const springSeepPressure = land
    ? clamp(
        (Number(topology.subterraneanDepthIndex) || 0) * 0.22 +
          (Number(tectonics.crustalStressIndex) || 0) * 0.18 +
          (Number(terrain.hydrologyReadinessIndex) || 0) * 0.20 +
          h.springActivationDemand * 0.10,
        0,
        1
      )
    : 0;

  const subterraneanWaterPressure = clamp(
    (Number(topology.subterraneanDepthIndex) || 0) * 0.36 +
      (Number(topology.foundationDensityIndex) || 0) * 0.12 +
      (land ? (Number(terrain.hydrologyReadinessIndex) || 0) * 0.18 : oceanDepthIndex * 0.20) +
      h.subterraneanActivationDemand * 0.10,
    0,
    1
  );

  const waterClass = deriveWaterClass({
    ocean,
    depth: oceanDepthIndex,
    shelf: shelfPressure,
    trench: trenchHydrationIndex,
    coastal: coastalPressure,
    river: riverFlowPressure,
    stream: streamFlowPressure,
    lake: lakeFillPressure,
    glacier: glacierMassPressure,
    snowpack: snowpackPressure,
    floodplain: floodplainWetness,
    delta: deltaWetness,
    spring: springSeepPressure,
    subterranean: subterraneanWaterPressure
  });

  const surfaceWaterIndex = clamp(
    ocean
      ? 0.70 +
          waterVisibilityIndex * 0.18 +
          visibleWaterDepthIndex * 0.12
      : Math.max(
          riverFlowPressure,
          streamFlowPressure,
          lakeFillPressure,
          glacierMassPressure,
          snowpackPressure,
          floodplainWetness,
          deltaWetness,
          springSeepPressure
        ),
    0,
    1
  );

  const hydrationActivationIndex = clamp(
    waterClass === "dry_land"
      ? Math.max(
          subterraneanWaterPressure * 0.30,
          beachContactRimIndex * 0.20
        )
      : surfaceWaterIndex,
    0,
    1
  );

  const exposedLandAfterSeaLevel = land && !ice;
  const landStillVisibleAfterHydration =
    exposedLandAfterSeaLevel &&
    !(
      lakeFillPressure > 0.74 ||
      riverFlowPressure > 0.72 ||
      floodplainWetness > 0.78 ||
      deltaWetness > 0.78
    );

  const hydrationMayCoverSand = true;
  const sandCoveredByHydration =
    beach &&
    (
      beachWaterContactIndex > 0.54 ||
      coastalPressure > 0.46 ||
      deltaWetness > 0.60
    );

  const beachRimStillVisible =
    beach &&
    beachContactRimIndex > 0.20 &&
    !sandCoveredByHydration;

  const visualHydrationClass =
    waterClass === "dry_land"
      ? beachRimStillVisible
        ? "beach_rim_visible"
        : inland
          ? "exposed_inland_land"
          : "exposed_land"
      : waterClass;

  const flow = deriveFlowDirection(topology, terrain, point.u, point.v);

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    activeContract: RECEIPT,
    latestContract: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    hydrationLaw: HYDRATION_LAW,
    contracts: CONTRACTS,

    topologyReceipt: topology.receipt || "unknown",
    tectonicsReceipt: tectonics.receipt || "unknown",
    terrainReceipt: terrain.receipt || "unknown",

    consumesTopology: true,
    consumesTectonics: true,
    consumesTerrain: true,

    seaLevelHydrationActive: true,
    waterDepthActive: true,
    depthVisibilityActive: true,
    beachRimActive: true,
    exposedLandReportActive: true,
    hydrationMayCoverSand,

    topologyLandFootprint: land,
    topologyVoidFootprint: !land && !ice,
    isLandFootprint: land,
    isAboveWaterLandFootprint: land && !ice,
    isVoidFootprint: !land && !ice,
    isWaterFootprint: !land && !ice,
    isIceFootprint: ice,
    isBeachFootprint: beach,
    isInlandTerrainFootprint: inland,

    exposedLandAfterSeaLevel,
    landStillVisibleAfterHydration,
    exposedLandVisibilityIndex: landStillVisibleAfterHydration
      ? clamp(0.62 + (Number(terrain.normalizedElevation) || 0) * 0.22, 0, 1)
      : 0,
    exposedLandClass: landStillVisibleAfterHydration
      ? beach
        ? "beach_outline_remaining"
        : inland
          ? "inland_terrain_remaining"
          : "land_remaining"
      : "covered_or_not_land",

    waterClass,
    waterClassId: waterClassIdFor(waterClass),
    visualHydrationClass,

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
    isSnowpack: waterClass === "snowpack_source",
    isFloodplain: waterClass === "floodplain_wetland",
    isDelta: waterClass === "delta_wetland",
    isSpring: waterClass === "spring_seep",
    isSubterraneanWater: subterraneanWaterPressure > 0.58,

    visibleWaterDepthClass,
    visibleWaterDepthIndex,
    waterVisibilityIndex,
    coastalShelfBlueIndex,
    deepOceanBlueIndex,
    trenchDarknessIndex,

    oceanDepthIndex,
    bathymetryHydrationIndex,
    trenchHydrationIndex,
    shelfPressure,
    coastalWaterPressure: coastalPressure,

    beachOutlinePressure,
    beachContactRimIndex,
    beachWaterContactIndex,
    beachRimStillVisible,
    sandCoveredByHydration,

    riverFlowPressure,
    streamFlowPressure,
    lakeFillPressure,
    glacierMassPressure,
    snowpackPressure,
    floodplainWetness,
    deltaWetness,
    springSeepPressure,
    subterraneanWaterPressure,

    surfaceWaterIndex,
    hydrationActivationIndex,

    seaLevelFill: h.seaLevelFill,
    waterdownStrength: h.waterdownStrength,

    watershedId: terrain.watershedId || (ocean ? "ocean" : "unassigned_land_watershed"),
    flowDirection: flow.flowDirection,
    flowVectorX: flow.flowVectorX,
    flowVectorY: flow.flowVectorY,
    flowStrength: flow.flowStrength,

    hydrationColorInfluence: Object.freeze({
      waterDominance: clamp(surfaceWaterIndex * 0.84 + waterVisibilityIndex * 0.16, 0, 1),
      coastalBlue: coastalShelfBlueIndex,
      deepBlue: deepOceanBlueIndex,
      trenchDark: trenchDarknessIndex,
      beachRim: beachContactRimIndex,
      exposedLand: landStillVisibleAfterHydration ? 1 : 0,
      glacierWhite: glacierMassPressure,
      riverBlue: riverFlowPressure,
      lakeBlue: lakeFillPressure
    }),

    ownsHydration: true,
    ownsWaterPlacement: true,
    ownsWaterFlowPermission: true,
    ownsWaterDepthVisibility: true,
    ownsBeachContactRim: true,
    ownsExposedLandReport: true,

    ownsTopology: false,
    ownsLandFootprint: false,
    ownsVoidFootprint: false,
    ownsSeaLevelBoundary: false,
    ownsTectonics: false,
    ownsTerrain: false,
    ownsAboveSeaElevation: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsAnimals: false,
    ownsMarineLife: false,
    ownsConstructCivilization: false,
    ownsRouteRendering: false,
    ownsRuntimeRendering: false,
    ownsFinalRender: false,

    climateEnabled: false,
    ecologyEnabled: false,
    foliageEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,

    foliage: false,
    trees: false,
    vegetation: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

export function sampleHydration(u, v, context = {}) {
  return composeHydrationSample(u, v, context);
}

export function buildHydrationField(width = DEFAULTS.fieldWidth, height = DEFAULTS.fieldHeight, context = {}) {
  const options = getOptions({
    ...context,
    fieldWidth: width,
    fieldHeight: height
  });

  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);

  const topologyField = safeCall(null, () =>
    buildTopologyField(w, h, options.topologyContext)
  );

  const tectonicsField = safeCall(null, () =>
    buildTectonicsField(w, h, {
      ...options.tectonicsContext,
      topologyContext: options.topologyContext
    })
  );

  const terrainField = safeCall(null, () =>
    buildTerrainField(w, h, {
      ...options.terrainContext,
      topologyContext: options.topologyContext,
      tectonicsContext: options.tectonicsContext
    })
  );

  const samplingContext = Object.freeze({
    ...options,
    topologyField,
    tectonicsField,
    terrainField
  });

  const samples = new Array(w * h);

  let landSamples = 0;
  let voidSamples = 0;
  let iceSamples = 0;
  let beachSamples = 0;
  let exposedLandSamples = 0;
  let visibleLandSamples = 0;
  let hydratedSamples = 0;
  let oceanSamples = 0;
  let coastalSamples = 0;
  let shelfSamples = 0;
  let deepOceanSamples = 0;
  let trenchSamples = 0;
  let riverSamples = 0;
  let streamSamples = 0;
  let lakeSamples = 0;
  let glacierSamples = 0;
  let snowpackSamples = 0;
  let floodplainSamples = 0;
  let deltaSamples = 0;
  let springSamples = 0;
  let subterraneanSamples = 0;
  let beachRimSamples = 0;
  let sandCoveredSamples = 0;
  let foliageSamples = 0;

  let maxWaterVisibility = 0;
  let maxVisibleDepth = 0;
  let maxCoastalBlue = 0;
  let maxDeepBlue = 0;
  let maxTrenchDark = 0;
  let maxBeachRim = 0;
  let maxHydration = 0;
  let maxSurfaceWater = 0;
  let maxRiver = 0;
  let maxLake = 0;
  let maxGlacier = 0;

  const waterClasses = new Set();
  const visualHydrationClasses = new Set();
  const visibleDepthClasses = new Set();

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = composeHydrationSample(u, v, samplingContext);

      samples[y * w + x] = sample;

      waterClasses.add(sample.waterClass);
      visualHydrationClasses.add(sample.visualHydrationClass);
      visibleDepthClasses.add(sample.visibleWaterDepthClass);

      if (sample.isIceFootprint) iceSamples += 1;
      else if (sample.isLandFootprint) landSamples += 1;
      else voidSamples += 1;

      if (sample.isBeachFootprint) beachSamples += 1;
      if (sample.exposedLandAfterSeaLevel) exposedLandSamples += 1;
      if (sample.landStillVisibleAfterHydration) visibleLandSamples += 1;
      if (sample.isHydrated) hydratedSamples += 1;
      if (sample.isOceanWater) oceanSamples += 1;
      if (sample.isCoastalWater) coastalSamples += 1;
      if (sample.isShelfWater) shelfSamples += 1;
      if (sample.isDeepOcean) deepOceanSamples += 1;
      if (sample.isTrenchWater) trenchSamples += 1;
      if (sample.isRiver) riverSamples += 1;
      if (sample.isStream) streamSamples += 1;
      if (sample.isLake) lakeSamples += 1;
      if (sample.isGlacier) glacierSamples += 1;
      if (sample.isSnowpack) snowpackSamples += 1;
      if (sample.isFloodplain) floodplainSamples += 1;
      if (sample.isDelta) deltaSamples += 1;
      if (sample.isSpring) springSamples += 1;
      if (sample.isSubterraneanWater) subterraneanSamples += 1;
      if (sample.beachRimStillVisible) beachRimSamples += 1;
      if (sample.sandCoveredByHydration) sandCoveredSamples += 1;
      if (sample.foliage || sample.trees || sample.vegetation) foliageSamples += 1;

      maxWaterVisibility = Math.max(maxWaterVisibility, sample.waterVisibilityIndex);
      maxVisibleDepth = Math.max(maxVisibleDepth, sample.visibleWaterDepthIndex);
      maxCoastalBlue = Math.max(maxCoastalBlue, sample.coastalShelfBlueIndex);
      maxDeepBlue = Math.max(maxDeepBlue, sample.deepOceanBlueIndex);
      maxTrenchDark = Math.max(maxTrenchDark, sample.trenchDarknessIndex);
      maxBeachRim = Math.max(maxBeachRim, sample.beachContactRimIndex);
      maxHydration = Math.max(maxHydration, sample.hydrationActivationIndex);
      maxSurfaceWater = Math.max(maxSurfaceWater, sample.surfaceWaterIndex);
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
    file: FILE,
    width: w,
    height: h,
    samples,
    hydrationLaw: HYDRATION_LAW,
    contracts: CONTRACTS,

    topologyField,
    tectonicsField,
    terrainField,

    stats: Object.freeze({
      totalSamples,
      landSamples,
      voidSamples,
      iceSamples,
      beachSamples,
      exposedLandSamples,
      visibleLandSamples,
      hydratedSamples,
      oceanSamples,
      coastalSamples,
      shelfSamples,
      deepOceanSamples,
      trenchSamples,
      riverSamples,
      streamSamples,
      lakeSamples,
      glacierSamples,
      snowpackSamples,
      floodplainSamples,
      deltaSamples,
      springSamples,
      subterraneanSamples,
      beachRimSamples,
      sandCoveredSamples,
      foliageSamples,

      landRatio: totalSamples ? landSamples / totalSamples : 0,
      voidRatio: totalSamples ? voidSamples / totalSamples : 0,
      iceRatio: totalSamples ? iceSamples / totalSamples : 0,
      beachRatio: totalSamples ? beachSamples / totalSamples : 0,
      exposedLandRatio: totalSamples ? exposedLandSamples / totalSamples : 0,
      visibleLandRatio: totalSamples ? visibleLandSamples / totalSamples : 0,
      hydrationRatio: totalSamples ? hydratedSamples / totalSamples : 0,
      oceanRatio: totalSamples ? oceanSamples / totalSamples : 0,
      coastalRatio: totalSamples ? coastalSamples / totalSamples : 0,
      shelfRatio: totalSamples ? shelfSamples / totalSamples : 0,
      deepOceanRatio: totalSamples ? deepOceanSamples / totalSamples : 0,
      trenchRatio: totalSamples ? trenchSamples / totalSamples : 0,
      riverRatio: totalSamples ? riverSamples / totalSamples : 0,
      streamRatio: totalSamples ? streamSamples / totalSamples : 0,
      lakeRatio: totalSamples ? lakeSamples / totalSamples : 0,
      glacierRatio: totalSamples ? glacierSamples / totalSamples : 0,
      snowpackRatio: totalSamples ? snowpackSamples / totalSamples : 0,
      floodplainRatio: totalSamples ? floodplainSamples / totalSamples : 0,
      deltaRatio: totalSamples ? deltaSamples / totalSamples : 0,
      springRatio: totalSamples ? springSamples / totalSamples : 0,
      subterraneanRatio: totalSamples ? subterraneanSamples / totalSamples : 0,
      beachRimRatio: totalSamples ? beachRimSamples / totalSamples : 0,
      sandCoveredRatio: totalSamples ? sandCoveredSamples / totalSamples : 0,

      maxWaterVisibility,
      maxVisibleDepth,
      maxCoastalBlue,
      maxDeepBlue,
      maxTrenchDark,
      maxBeachRim,
      maxHydration,
      maxSurfaceWater,
      maxRiver,
      maxLake,
      maxGlacier,

      waterClasses: Object.freeze(Array.from(waterClasses)),
      visualHydrationClasses: Object.freeze(Array.from(visualHydrationClasses)),
      visibleDepthClasses: Object.freeze(Array.from(visibleDepthClasses)),

      seaLevelHydrationActive: true,
      waterDepthActive: true,
      depthVisibilityActive: true,
      beachRimActive: true,
      exposedLandReportActive: true,
      hydrationMayCoverSand: true,

      topologyContract: CONTRACTS.topology,
      terrainContract: CONTRACTS.terrain,

      foliageClosed: true,
      visualPassClaimed: false
    })
  });
}

export function getHydrationSampleFromField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) {
    return sampleHydration(uInput, vInput);
  }

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || sampleHydration(point.u, point.v);
}

export function getHydrationStatus() {
  const topologyStatus = safeCall(null, () => getTopologyStatus());
  const tectonicsStatus = safeCall(null, () => getTectonicsStatus());
  const terrainStatus = safeCall(null, () => getTerrainStatus());

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: "active",
    id: "audralia-hydration-visible-depth-beach-rim-exposed-land",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    contracts: CONTRACTS,
    hydrationLaw: HYDRATION_LAW,

    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,

    topologyStatus,
    tectonicsStatus,
    terrainStatus,

    exports: Object.freeze([
      "sampleHydration",
      "buildHydrationField",
      "getHydrationSampleFromField",
      "getHydrationStatus"
    ]),

    consumesTopology: true,
    consumesTectonics: true,
    consumesTerrain: true,

    seaLevelHydrationActive: true,
    waterDepthActive: true,
    depthVisibilityActive: true,
    beachRimActive: true,
    exposedLandReportActive: true,
    hydrationMayCoverSand: true,

    visibleWaterDepthFields: Object.freeze([
      "visibleWaterDepthClass",
      "visibleWaterDepthIndex",
      "waterVisibilityIndex",
      "coastalShelfBlueIndex",
      "deepOceanBlueIndex",
      "trenchDarknessIndex",
      "beachContactRimIndex",
      "exposedLandAfterSeaLevel",
      "landStillVisibleAfterHydration",
      "sandCoveredByHydration"
    ]),

    surfaceWaterClasses: Object.freeze([
      "ocean_water",
      "coastal_water",
      "shelf_water",
      "deep_ocean_water",
      "trench_water",
      "river_flow",
      "stream_flow",
      "lake_fill",
      "glacier_mass",
      "snowpack_source",
      "delta_wetland",
      "floodplain_wetland",
      "spring_seep",
      "subterranean_water",
      "dry_land"
    ]),

    ownsHydration: true,
    ownsWaterPlacement: true,
    ownsWaterFlowPermission: true,
    ownsWaterDepthVisibility: true,
    ownsBeachContactRim: true,
    ownsExposedLandReport: true,

    ownsTopology: false,
    ownsLandFootprint: false,
    ownsVoidFootprint: false,
    ownsSeaLevelBoundary: false,
    ownsTectonics: false,
    ownsTerrain: false,
    ownsAboveSeaElevation: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsAnimals: false,
    ownsMarineLife: false,
    ownsConstructCivilization: false,
    ownsRouteRendering: false,
    ownsRuntimeRendering: false,
    ownsFinalRender: false,

    climateClosed: true,
    ecologyClosed: true,
    foliageClosed: true,
    treesClosed: true,
    vegetationClosed: true,
    animalsClosed: true,
    marineLifeClosed: true,
    constructCivilizationClosed: true,

    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  sampleHydration,
  buildHydrationField,
  getHydrationSampleFromField,
  getHydrationStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaHydration = api;
  window.AudraliaHydration = api;
  window.audraliaHydration = api;
}

export default api;
