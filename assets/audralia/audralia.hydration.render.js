// /assets/audralia/audralia.hydration.render.js
// AUDRALIA_HYDRATION_SEA_LEVEL_WATER_DEPTH_BEACH_OUTLINE_TNT_v1
//
// Role:
// - Audralia hydration authority.
// - Consumes topology first.
// - Consumes tectonics second.
// - Consumes terrain third.
// - Raises hydration to the topology sea-level/bathymetry contract.
// - Defines visible water depth, ocean fill, beach outline, coastal shelves,
//   sea-level erosion, rivers, streams, lakes, glaciers, snowpack, deltas,
//   floodplains, springs, and subterranean water pressure.
// - Hands runtime a complete hydration sample.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No land generation.
// - No land expansion.
// - No terrain elevation rewrite.
// - No tectonic overwrite.
// - No topology overwrite.
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
} from "./audralia.terrain.render.js?v=AUDRALIA_G1_TERRAIN_STRONG_RELIEF_TOPOLOGY_TECTONICS_LOCK_TNT_v2";

const RECEIPT = "AUDRALIA_HYDRATION_SEA_LEVEL_WATER_DEPTH_BEACH_OUTLINE_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_G1_HYDRATION_CONSUME_TOPOLOGY_TECTONICS_TERRAIN_WATERDOWN_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_HYDRATION_SEA_LEVEL_WATER_DEPTH_BEACH_OUTLINE";
const FILE = "/assets/audralia/audralia.hydration.render.js";

const TOPOLOGY_AUTHORITY = "/assets/audralia/audralia.topology.render.js";
const TECTONICS_AUTHORITY = "/assets/audralia/audralia.tectonics.render.js";
const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";

const HYDRATION_LAW = Object.freeze({
  layerOrder: Object.freeze(["topology", "tectonics", "terrain", "hydration"]),
  chain: "topology→tectonics→terrain→hydration",
  topologyFirst: true,
  tectonicsSecond: true,
  terrainThird: true,
  hydrationFourth: true,

  seaLevelHydrationActive: true,
  oceanFillActive: true,
  waterDepthActive: true,
  bathymetryActive: true,
  beachOutlineActive: true,
  coastalShelfActive: true,
  riverLakeGlacierActivationActive: true,
  subterraneanWaterActive: true,

  ownsHydration: true,
  ownsWaterPlacement: true,
  ownsWaterFill: true,
  ownsFlowPermission: true,

  ownsTopology: false,
  ownsTectonics: false,
  ownsTerrain: false,
  ownsLandFootprint: false,
  ownsLandExpansion: false,
  ownsAboveSeaElevation: false,
  ownsSeaLevelBoundary: false,
  ownsBathymetryBlueprint: false,
  ownsClimate: false,
  ownsEcology: false,
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

const DEFAULTS = Object.freeze({
  fieldWidth: 224,
  fieldHeight: 112,
  minFieldWidth: 64,
  minFieldHeight: 32,
  maxFieldWidth: 384,
  maxFieldHeight: 192,

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
    oceanFillDemand: 1.0,
    coastalFillDemand: 0.94,
    shelfFillDemand: 0.92,
    depthVisibilityDemand: 0.92,
    beachOutlineDemand: 0.90,
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
      ...(Number.isFinite(Number(context.seaLevelFill))
        ? { seaLevelFill: Number(context.seaLevelFill) }
        : {})
    })
  });
}

function fallbackTopologySample(u, v) {
  const point = normalizeUV(u, v);
  const polarIce = point.lat < -0.78;

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
    isSouthPolarIceFootprint: polarIce,

    surfaceClass: polarIce ? "polar_ice_footprint" : "void_mid_ocean",
    topologySurfaceClass: polarIce ? "polar_ice_footprint" : "void_mid_ocean",
    surfaceClassId: polarIce ? 12 : 3,

    landBodyId: 0,
    landBodyKey: "void_ocean",
    landBodyName: "Void / Ocean Footprint",

    targetLandRatio: 0.292,
    approximateEarthExposedLandRatio: 0.292,
    seaLevelThreshold: 0.5,
    seaLevelBoundary: 0.5,
    seaLevelDistance: 1,
    coastalExposureIndex: 0,

    oceanDepthIndex: polarIce ? 0 : 0.58,
    bathymetryBlueprintIndex: polarIce ? 0 : 0.54,
    trenchDepthIndex: 0,
    shelfDepthIndex: 0,
    basinDepthIndex: polarIce ? 0 : 0.48,
    depthClassKey: polarIce ? "polar_ice" : "mid_ocean",

    shorelinePressure: 0,
    beachPressure: 0,
    sandPressure: 0,
    rockPressure: 0,
    coastalCliffPressure: 0,
    seaLevelErosionPressure: 0,
    cliffBaseCut: 0,
    coastlineIrregularityIndex: 0,

    isBeach: false,
    isSand: false,
    isRock: false,
    isShelf: false,

    blackSandPressure: 0,
    whiteSandPressure: 0,
    opalSoftnessIndex: 0,
    diamondDarkSandIndex: 0,
    beachCloudSoftnessIndex: 0,

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

    ownsLandFootprint: false,
    ownsAboveSeaElevation: false,
    ownsHydration: false,
    ownsFoliage: false,
    visualPassClaimed: false
  });
}

function fallbackTerrainSample(u, v, topology) {
  const land = Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint));
  const ice = Boolean(topology && topology.isSouthPolarIceFootprint);

  return Object.freeze({
    receipt: "HYDRATION_FALLBACK_TERRAIN_SAMPLE",
    planetaryObject: PLANETARY_OBJECT,
    u,
    v,

    isLand: land,
    isWater: !land && !ice,
    isIce: ice,
    normalizedElevation: land ? clamp(Number(topology.terrainRisePermission) || 0.28, 0, 1) : -clamp(Number(topology.oceanDepthIndex) || 0.44, 0, 1),
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

    watershedId: land ? "fallback_land_watershed" : "ocean",
    watershedStrength: 0,

    ownsHydration: false,
    ownsFoliage: false,
    visualPassClaimed: false
  });
}

function getTopologyFromFieldOrSample(field, u, v, context) {
  const fallback = fallbackTopologySample(u, v);

  if (field && field.samples && field.width && field.height) {
    return safeCall(fallback, () => getTopologySampleFromField(field, u, v));
  }

  return safeCall(fallback, () => sampleTopology(u, v, context.topologyContext));
}

function getTectonicsFromFieldOrSample(field, u, v, topology, context) {
  const fallback = fallbackTectonicsSample(u, v, topology);

  if (field && field.samples && field.width && field.height) {
    return safeCall(fallback, () => getTectonicsSampleFromField(field, u, v));
  }

  return safeCall(fallback, () => sampleTectonics(u, v, topology, context.tectonicsContext));
}

function getTerrainFromFieldOrSample(field, u, v, topology, context) {
  const fallback = fallbackTerrainSample(u, v, topology);

  if (field && field.samples && field.width && field.height) {
    return safeCall(fallback, () => getTerrainSampleFromField(field, u, v));
  }

  return safeCall(fallback, () => sampleTerrain(u, v, context.terrainContext));
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
        topology.isIce ||
        topology.southIce ||
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
        String(topology.surfaceClass || "").includes("beach") ||
        String(topology.topologySurfaceClass || "").includes("beach") ||
        Number(topology.beachPressure) > 0.34 ||
        Number(topology.sandPressure) > 0.34
      )
  );
}

function topologyAllowsShelf(topology) {
  return Boolean(
    topology &&
      (
        topology.isShelf ||
        Number(topology.shelfDepthIndex) > 0.34 ||
        Number(topology.reefShelfPermission) > 0.34 ||
        Number(topology.coastalExposureIndex) > 0.42
      )
  );
}

function waterDepthClass(depth, shelf, trench, coast) {
  if (trench >= 0.58 || depth >= 0.86) return "trench_water";
  if (depth >= 0.68) return "deep_ocean_water";
  if (shelf >= 0.46) return "shelf_water";
  if (coast >= 0.38) return "coastal_water";
  return "ocean_water";
}

function colorInfluenceForWaterClass(waterClass, sample) {
  const depth = clamp(Number(sample.oceanDepthIndex) || 0, 0, 1);
  const shelf = clamp(Number(sample.shelfPressure) || 0, 0, 1);
  const activation = clamp(Number(sample.hydrationActivationIndex) || 0, 0, 1);

  if (waterClass === "trench_water") {
    return Object.freeze({ r: 2, g: 22, b: 76, a: clamp(0.78 + activation * 0.16, 0, 0.96) });
  }

  if (waterClass === "deep_ocean_water") {
    return Object.freeze({ r: 4, g: 46, b: 126, a: clamp(0.74 + depth * 0.18, 0, 0.94) });
  }

  if (waterClass === "shelf_water") {
    return Object.freeze({ r: 18, g: 112, b: 174, a: clamp(0.70 + shelf * 0.18, 0, 0.92) });
  }

  if (waterClass === "coastal_water") {
    return Object.freeze({ r: 34, g: 142, b: 196, a: clamp(0.66 + shelf * 0.16, 0, 0.88) });
  }

  if (waterClass === "river_flow") {
    return Object.freeze({ r: 56, g: 152, b: 214, a: 0.72 });
  }

  if (waterClass === "stream_flow") {
    return Object.freeze({ r: 72, g: 176, b: 226, a: 0.58 });
  }

  if (waterClass === "lake_fill") {
    return Object.freeze({ r: 40, g: 126, b: 184, a: 0.78 });
  }

  if (waterClass === "glacier_mass" || waterClass === "snowpack_source") {
    return Object.freeze({ r: 226, g: 242, b: 250, a: 0.78 });
  }

  if (waterClass === "delta_wetness") {
    return Object.freeze({ r: 54, g: 146, b: 168, a: 0.58 });
  }

  if (waterClass === "floodplain_wetness") {
    return Object.freeze({ r: 62, g: 136, b: 148, a: 0.46 });
  }

  if (waterClass === "spring_seep") {
    return Object.freeze({ r: 76, g: 166, b: 190, a: 0.42 });
  }

  if (waterClass === "subterranean_water") {
    return Object.freeze({ r: 48, g: 96, b: 118, a: 0.26 });
  }

  return Object.freeze({ r: 8, g: 76, b: 146, a: 0.84 });
}

function composeHydrationSample(uInput, vInput, topology, tectonics, terrain, options) {
  const point = normalizeUV(uInput, vInput);
  const hydrationContext = options.hydrationContext || DEFAULTS.hydrationContext;

  const land = topologyAllowsLand(topology);
  const ice = topologyAllowsIce(topology);
  const beach = topologyAllowsBeach(topology);
  const shelf = topologyAllowsShelf(topology);
  const ocean = !land && !ice;

  const seaLevelFill = clamp(Number(hydrationContext.seaLevelFill) || 1, 0, 1);
  const waterdownStrength = clamp(Number(hydrationContext.waterdownStrength) || 1, 0, 1);

  const shorelinePressure = clamp(Number(topology.shorelinePressure) || Number(terrain.coastPressure) || 0, 0, 1);
  const beachPressure = clamp(Number(topology.beachPressure) || Number(topology.sandPressure) || 0, 0, 1);
  const coastalExposureIndex = clamp(Number(topology.coastalExposureIndex) || 0, 0, 1);
  const shelfDepthIndex = clamp(
    Number(topology.shelfDepthIndex) ||
      Number(topology.reefShelfPermission) ||
      Number(terrain.shelfPermission) ||
      0,
    0,
    1
  );

  const oceanDepthIndex = clamp(
    Number(topology.oceanDepthIndex) ||
      Number(topology.bathymetryBlueprintIndex) ||
      Number(topology.basinDepthIndex) ||
      Math.abs(Number(terrain.normalizedElevation) || 0),
    0,
    1
  );

  const bathymetryHydrationIndex = clamp(
    Number(topology.bathymetryBlueprintIndex) ||
      Number(topology.basinDepthIndex) ||
      oceanDepthIndex,
    0,
    1
  );

  const trenchHydrationIndex = clamp(
    Number(topology.trenchDepthIndex) ||
      Number(tectonics.trenchReinforcementPermission) ||
      0,
    0,
    1
  );

  const seaLevelDistance = clamp(Math.abs(Number(topology.seaLevelDistance) || 0), 0, 1);
  const seaLevelErosionPressure = clamp(Number(topology.seaLevelErosionPressure) || 0, 0, 1);
  const coastalCliffPressure = clamp(
    Number(topology.coastalCliffPressure) ||
      Number(topology.cliffBaseCut) ||
      Number(tectonics.cliffPermission) ||
      0,
    0,
    1
  );

  const riverbedPressure = clamp(Number(terrain.riverbedPressure) || Number(terrain.riverIncisionPressure) * 0.55 || 0, 0, 1);
  const streamPressure = clamp(Number(terrain.streamPressure) || Number(terrain.valleyChannelPressure) * 0.42 || 0, 0, 1);
  const lakeBasinPressure = clamp(Number(terrain.lakeBasinPressure) || Number(terrain.basin) || 0, 0, 1);
  const glacierSeatPressure = clamp(Number(terrain.glacierSeatPressure) || Number(terrain.snowpackSourcePressure) || 0, 0, 1);
  const snowpackSourcePressure = clamp(Number(terrain.snowpackSourcePressure) || glacierSeatPressure * 0.72 || 0, 0, 1);
  const floodplainPressure = clamp(Number(terrain.floodplainPressure) || shorelinePressure * 0.30 || 0, 0, 1);
  const deltaReceiverPressure = clamp(Number(terrain.deltaReceiverPressure) || shorelinePressure * riverbedPressure || 0, 0, 1);
  const hydrologyReadinessIndex = clamp(Number(terrain.hydrologyReadinessIndex) || 0, 0, 1);

  const subterraneanDepthIndex = clamp(Number(topology.subterraneanDepthIndex) || 0, 0, 1);
  const foundationDensityIndex = clamp(Number(topology.foundationDensityIndex) || 0, 0, 1);
  const rockMassBoundaryIndex = clamp(Number(topology.rockMassBoundaryIndex) || 0, 0, 1);

  const riverFlowPressure = land
    ? clamp(
        riverbedPressure * 0.56 +
          hydrologyReadinessIndex * 0.22 +
          Number(tectonics.canyonPermission || 0) * 0.12 +
          Number(terrain.slope || 0) * 0.10,
        0,
        1
      )
    : 0;

  const streamFlowPressure = land
    ? clamp(
        streamPressure * 0.56 +
          riverbedPressure * 0.18 +
          hydrologyReadinessIndex * 0.16 +
          Number(terrain.valleyChannelPressure || 0) * 0.10,
        0,
        1
      )
    : 0;

  const lakeFillPressure = land
    ? clamp(
        lakeBasinPressure * 0.60 +
          hydrologyReadinessIndex * 0.18 +
          Number(terrain.basin || 0) * 0.16 +
          floodplainPressure * 0.06,
        0,
        1
      )
    : 0;

  const glacierMassPressure = ice
    ? clamp(0.74 + glacierSeatPressure * 0.20, 0, 1)
    : land
      ? clamp(glacierSeatPressure * 0.72 + snowpackSourcePressure * 0.18, 0, 1)
      : 0;

  const snowpackPressure = ice
    ? clamp(0.64 + snowpackSourcePressure * 0.22, 0, 1)
    : land
      ? clamp(snowpackSourcePressure * 0.62 + glacierSeatPressure * 0.20, 0, 1)
      : 0;

  const floodplainWetness = land
    ? clamp(floodplainPressure * 0.58 + riverFlowPressure * 0.18 + shorelinePressure * 0.12 + lakeFillPressure * 0.08, 0, 1)
    : 0;

  const deltaWetness = land || ocean
    ? clamp(deltaReceiverPressure * 0.56 + shorelinePressure * riverFlowPressure * 0.24 + coastalExposureIndex * 0.12, 0, 1)
    : 0;

  const springSeepPressure = land
    ? clamp(
        subterraneanDepthIndex * 0.20 +
          foundationDensityIndex * 0.12 +
          rockMassBoundaryIndex * 0.12 +
          Number(tectonics.crustalStressIndex || 0) * 0.16 +
          hydrologyReadinessIndex * 0.16,
        0,
        1
      )
    : 0;

  const subterraneanWaterPressure = clamp(
    subterraneanDepthIndex * 0.36 +
      foundationDensityIndex * 0.14 +
      rockMassBoundaryIndex * 0.14 +
      hydrologyReadinessIndex * (land ? 0.18 : 0.06) +
      oceanDepthIndex * (ocean ? 0.18 : 0),
    0,
    1
  );

  let waterClass = "dry_land";

  const oceanClass = waterDepthClass(
    oceanDepthIndex,
    shelfDepthIndex,
    trenchHydrationIndex,
    Math.max(shorelinePressure, coastalExposureIndex)
  );

  if (ocean) {
    waterClass = oceanClass;
  } else if (ice && glacierMassPressure >= 0.50) {
    waterClass = "glacier_mass";
  } else if (land && glacierMassPressure >= 0.66) {
    waterClass = "glacier_mass";
  } else if (land && snowpackPressure >= 0.62) {
    waterClass = "snowpack_source";
  } else if (land && lakeFillPressure >= 0.56) {
    waterClass = "lake_fill";
  } else if (land && riverFlowPressure >= 0.54) {
    waterClass = "river_flow";
  } else if (land && streamFlowPressure >= 0.50) {
    waterClass = "stream_flow";
  } else if (land && deltaWetness >= 0.52) {
    waterClass = "delta_wetness";
  } else if (land && floodplainWetness >= 0.48) {
    waterClass = "floodplain_wetness";
  } else if (land && springSeepPressure >= 0.52) {
    waterClass = "spring_seep";
  } else if (land && subterraneanWaterPressure >= 0.68) {
    waterClass = "subterranean_water";
  }

  const isOceanWater = ocean;
  const isCoastalWater = isOceanWater && waterClass === "coastal_water";
  const isShelfWater = isOceanWater && waterClass === "shelf_water";
  const isDeepOcean = isOceanWater && waterClass === "deep_ocean_water";
  const isTrenchWater = isOceanWater && waterClass === "trench_water";

  const isRiver = waterClass === "river_flow";
  const isStream = waterClass === "stream_flow";
  const isLake = waterClass === "lake_fill";
  const isGlacier = waterClass === "glacier_mass";
  const isSnowpack = waterClass === "snowpack_source";
  const isFloodplain = waterClass === "floodplain_wetness";
  const isDelta = waterClass === "delta_wetness";
  const isSpring = waterClass === "spring_seep";
  const isSubterraneanWater = waterClass === "subterranean_water";

  const surfaceWaterIndex = clamp(
    isOceanWater
      ? mix(0.74, 1.0, Math.max(oceanDepthIndex, seaLevelFill) * waterdownStrength)
      : Math.max(
          riverFlowPressure * 0.92,
          streamFlowPressure * 0.78,
          lakeFillPressure * 0.90,
          glacierMassPressure * 0.94,
          snowpackPressure * 0.66,
          floodplainWetness * 0.52,
          deltaWetness * 0.58,
          springSeepPressure * 0.42
        ),
    0,
    1
  );

  const hydrationActivationIndex = clamp(
    isOceanWater
      ? mix(0.76, 1.0, seaLevelFill * waterdownStrength)
      : Math.max(surfaceWaterIndex, subterraneanWaterPressure * 0.46),
    0,
    1
  );

  const beachOutlinePressure = clamp(
    beachPressure * 0.40 +
      shorelinePressure * 0.30 +
      coastalExposureIndex * 0.18 +
      (beach ? 0.18 : 0),
    0,
    1
  );

  const beachWaterContactIndex = clamp(
    beachOutlinePressure * 0.54 +
      seaLevelErosionPressure * 0.22 +
      coastalCliffPressure * 0.10 +
      (isCoastalWater || isShelfWater ? 0.24 : 0),
    0,
    1
  );

  const flowStrength = clamp(
    riverFlowPressure * 0.46 +
      streamFlowPressure * 0.26 +
      deltaWetness * 0.14 +
      Number(terrain.slope || 0) * 0.14,
    0,
    1
  );

  const flowDirection = flowStrength > 0.08
    ? point.lat > 0.1
      ? "downslope_southward_to_sea"
      : point.lat < -0.1
        ? "downslope_northward_to_sea"
        : "downslope_equatorial_to_nearest_coast"
    : "none";

  const flowVectorX = clamp(
    (Number(terrain.valleyChannelPressure) || 0) * 0.28 +
      (Number(tectonics.crustalStressIndex) || 0) * 0.12 -
      0.18,
    -1,
    1
  );

  const flowVectorY = clamp(
    point.lat > 0 ? 0.42 * flowStrength : -0.42 * flowStrength,
    -1,
    1
  );

  const hydrationColorInfluence = colorInfluenceForWaterClass(waterClass, {
    oceanDepthIndex,
    shelfPressure: shelfDepthIndex,
    hydrationActivationIndex
  });

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
    hydrationChain: "topology→tectonics→terrain→hydration",
    topologyReceipt: topology.receipt || topology.activeContract || "unknown",
    tectonicsReceipt: tectonics.receipt || "unknown",
    terrainReceipt: terrain.receipt || "unknown",

    seaLevelHydrationActive: true,
    seaLevelFill,
    waterdownStrength,
    oceanFillActive: true,
    waterDepthActive: true,
    bathymetryActive: true,
    beachOutlineActive: true,
    coastalShelfActive: true,
    riverLakeGlacierActivationActive: true,
    subterraneanWaterActive: true,

    waterClass,
    waterClassId:
      waterClass === "trench_water" ? 9 :
      waterClass === "deep_ocean_water" ? 8 :
      waterClass === "shelf_water" ? 7 :
      waterClass === "coastal_water" ? 6 :
      waterClass === "ocean_water" ? 5 :
      waterClass === "glacier_mass" ? 4 :
      waterClass === "lake_fill" ? 3 :
      waterClass === "river_flow" ? 2 :
      waterClass === "stream_flow" ? 1 :
      waterClass === "snowpack_source" ? 10 :
      waterClass === "delta_wetness" ? 11 :
      waterClass === "floodplain_wetness" ? 12 :
      waterClass === "spring_seep" ? 13 :
      waterClass === "subterranean_water" ? 14 :
      0,

    isHydrated: waterClass !== "dry_land" || subterraneanWaterPressure > 0.44,
    isOceanWater,
    isCoastalWater,
    isShelfWater,
    isDeepOcean,
    isTrenchWater,
    isRiver,
    isStream,
    isLake,
    isGlacier,
    isSnowpack,
    isFloodplain,
    isDelta,
    isSpring,
    isSubterraneanWater,

    isLandFootprint: land,
    isAboveWaterLandFootprint: land && !ice,
    isVoidFootprint: !land && !ice,
    isIce,
    isSouthPolarIceFootprint: ice,
    isBeach: beach,
    isShelf: shelf,

    seaLevelThreshold: topology.seaLevelThreshold,
    seaLevelBoundary: topology.seaLevelBoundary,
    seaLevelDistance,
    oceanDepthIndex,
    bathymetryHydrationIndex,
    bathymetryBlueprintIndex: clamp(Number(topology.bathymetryBlueprintIndex) || oceanDepthIndex, 0, 1),
    trenchHydrationIndex,
    trenchDepthIndex: trenchHydrationIndex,
    shelfPressure: shelfDepthIndex,
    shelfDepthIndex,
    basinDepthIndex: clamp(Number(topology.basinDepthIndex) || 0, 0, 1),
    depthClassKey: topology.depthClassKey || topology.oceanDepthClass || waterClass,

    shorelinePressure,
    beachPressure,
    beachOutlinePressure,
    beachWaterContactIndex,
    beachType: topology.beachType || (beach ? "mineral_beach" : "none"),
    blackSandPressure: clamp(Number(topology.blackSandPressure) || 0, 0, 1),
    whiteSandPressure: clamp(Number(topology.whiteSandPressure) || 0, 0, 1),
    opalSoftnessIndex: clamp(Number(topology.opalSoftnessIndex) || 0, 0, 1),
    diamondDarkSandIndex: clamp(Number(topology.diamondDarkSandIndex) || 0, 0, 1),
    beachCloudSoftnessIndex: clamp(Number(topology.beachCloudSoftnessIndex) || 0, 0, 1),

    coastalExposureIndex,
    coastalCliffPressure,
    seaLevelErosionPressure,
    cliffBaseCut: clamp(Number(topology.cliffBaseCut) || 0, 0, 1),
    coastlineIrregularityIndex: clamp(Number(topology.coastlineIrregularityIndex) || 0, 0, 1),

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

    riverbedPressure,
    streamPressure,
    lakeBasinPressure,
    glacierSeatPressure,
    snowpackSourcePressure,
    floodplainPressure,
    deltaReceiverPressure,
    hydrologyReadinessIndex,

    watershedId: terrain.watershedId || (isOceanWater ? "ocean" : "unassigned_watershed"),
    watershedStrength: clamp(Number(terrain.watershedStrength) || hydrologyReadinessIndex, 0, 1),
    flowDirection,
    flowVectorX,
    flowVectorY,
    flowStrength,

    subterraneanDepthIndex,
    foundationDensityIndex,
    rockMassBoundaryIndex,

    hydrationColorInfluence,

    ownsHydration: true,
    ownsWaterPlacement: true,
    ownsWaterFill: true,
    ownsFlowPermission: true,

    ownsTopology: false,
    ownsTectonics: false,
    ownsTerrain: false,
    ownsLandFootprint: false,
    ownsLandExpansion: false,
    ownsAboveSeaElevation: false,
    ownsSeaLevelBoundary: false,
    ownsBathymetryBlueprint: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsAnimals: false,
    ownsMarineLife: false,
    ownsConstructCivilization: false,
    ownsRouteRendering: false,
    ownsFinalRender: false,

    foliage: false,
    trees: false,
    vegetation: false,
    climateEnabled: false,
    ecologyEnabled: false,
    foliageEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

function buildUpstreamFields(width, height, options) {
  const topologyField = safeCall(null, () =>
    buildTopologyField(width, height, options.topologyContext)
  );

  const tectonicsField = safeCall(null, () =>
    buildTectonicsField(width, height, {
      ...options.tectonicsContext,
      topologyContext: options.topologyContext
    })
  );

  const terrainField = safeCall(null, () =>
    buildTerrainField(width, height, {
      ...options.terrainContext,
      topologyContext: options.topologyContext,
      tectonicsContext: options.tectonicsContext
    })
  );

  return Object.freeze({
    topologyField,
    tectonicsField,
    terrainField
  });
}

export function sampleHydration(u, v, context = {}) {
  const options = getOptions(context);

  const topology = getTopologyFromFieldOrSample(null, u, v, options);
  const tectonics = getTectonicsFromFieldOrSample(null, u, v, topology, options);
  const terrain = getTerrainFromFieldOrSample(null, u, v, topology, options);

  return composeHydrationSample(u, v, topology, tectonics, terrain, options);
}

export function buildHydrationField(width = DEFAULTS.fieldWidth, height = DEFAULTS.fieldHeight, context = {}) {
  const options = getOptions({
    ...context,
    fieldWidth: width,
    fieldHeight: height
  });

  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);
  const upstream = buildUpstreamFields(w, h, options);

  const samples = new Array(w * h);

  let landSamples = 0;
  let oceanSamples = 0;
  let coastalSamples = 0;
  let shelfSamples = 0;
  let deepOceanSamples = 0;
  let trenchSamples = 0;
  let beachOutlineSamples = 0;
  let riverSamples = 0;
  let streamSamples = 0;
  let lakeSamples = 0;
  let glacierSamples = 0;
  let snowpackSamples = 0;
  let floodplainSamples = 0;
  let deltaSamples = 0;
  let springSamples = 0;
  let subterraneanSamples = 0;
  let hydratedSamples = 0;
  let foliageSamples = 0;

  let maxOceanDepth = 0;
  let maxBathymetry = 0;
  let maxBeachOutline = 0;
  let maxSurfaceWater = 0;
  let maxHydration = 0;
  let maxRiver = 0;
  let maxLake = 0;
  let maxGlacier = 0;
  let maxSubterranean = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);

      const topology = getTopologyFromFieldOrSample(upstream.topologyField, u, v, options);
      const tectonics = getTectonicsFromFieldOrSample(upstream.tectonicsField, u, v, topology, options);
      const terrain = getTerrainFromFieldOrSample(upstream.terrainField, u, v, topology, options);
      const sample = composeHydrationSample(u, v, topology, tectonics, terrain, options);

      samples[y * w + x] = sample;

      if (sample.isLandFootprint) landSamples += 1;
      if (sample.isOceanWater) oceanSamples += 1;
      if (sample.isCoastalWater) coastalSamples += 1;
      if (sample.isShelfWater) shelfSamples += 1;
      if (sample.isDeepOcean) deepOceanSamples += 1;
      if (sample.isTrenchWater) trenchSamples += 1;
      if (sample.beachOutlinePressure > 0.34) beachOutlineSamples += 1;
      if (sample.isRiver) riverSamples += 1;
      if (sample.isStream) streamSamples += 1;
      if (sample.isLake) lakeSamples += 1;
      if (sample.isGlacier) glacierSamples += 1;
      if (sample.isSnowpack) snowpackSamples += 1;
      if (sample.isFloodplain) floodplainSamples += 1;
      if (sample.isDelta) deltaSamples += 1;
      if (sample.isSpring) springSamples += 1;
      if (sample.isSubterraneanWater || sample.subterraneanWaterPressure > 0.44) subterraneanSamples += 1;
      if (sample.isHydrated) hydratedSamples += 1;
      if (sample.foliage || sample.trees || sample.vegetation) foliageSamples += 1;

      maxOceanDepth = Math.max(maxOceanDepth, sample.oceanDepthIndex);
      maxBathymetry = Math.max(maxBathymetry, sample.bathymetryHydrationIndex);
      maxBeachOutline = Math.max(maxBeachOutline, sample.beachOutlinePressure);
      maxSurfaceWater = Math.max(maxSurfaceWater, sample.surfaceWaterIndex);
      maxHydration = Math.max(maxHydration, sample.hydrationActivationIndex);
      maxRiver = Math.max(maxRiver, sample.riverFlowPressure);
      maxLake = Math.max(maxLake, sample.lakeFillPressure);
      maxGlacier = Math.max(maxGlacier, sample.glacierMassPressure);
      maxSubterranean = Math.max(maxSubterranean, sample.subterraneanWaterPressure);
    }
  }

  const seaLevelEstimate = safeCall(null, () =>
    estimateEarthEquivalentSeaLevel(96, 48, options.topologyContext)
  );

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    width: w,
    height: h,
    samples,

    upstream: Object.freeze({
      topologyFieldLoaded: Boolean(upstream.topologyField && upstream.topologyField.samples),
      tectonicsFieldLoaded: Boolean(upstream.tectonicsField && upstream.tectonicsField.samples),
      terrainFieldLoaded: Boolean(upstream.terrainField && upstream.terrainField.samples)
    }),

    seaLevelEstimate,
    hydrationLaw: HYDRATION_LAW,

    stats: Object.freeze({
      totalSamples: samples.length,
      landSamples,
      oceanSamples,
      coastalSamples,
      shelfSamples,
      deepOceanSamples,
      trenchSamples,
      beachOutlineSamples,
      riverSamples,
      streamSamples,
      lakeSamples,
      glacierSamples,
      snowpackSamples,
      floodplainSamples,
      deltaSamples,
      springSamples,
      subterraneanSamples,
      hydratedSamples,
      foliageSamples,

      landRatio: landSamples / samples.length,
      oceanRatio: oceanSamples / samples.length,
      coastalRatio: coastalSamples / samples.length,
      shelfRatio: shelfSamples / samples.length,
      deepOceanRatio: deepOceanSamples / samples.length,
      trenchRatio: trenchSamples / samples.length,
      beachOutlineRatio: beachOutlineSamples / samples.length,
      riverRatio: riverSamples / samples.length,
      streamRatio: streamSamples / samples.length,
      lakeRatio: lakeSamples / samples.length,
      glacierRatio: glacierSamples / samples.length,
      snowpackRatio: snowpackSamples / samples.length,
      floodplainRatio: floodplainSamples / samples.length,
      deltaRatio: deltaSamples / samples.length,
      springRatio: springSamples / samples.length,
      subterraneanRatio: subterraneanSamples / samples.length,
      hydrationRatio: hydratedSamples / samples.length,

      maxOceanDepth,
      maxBathymetry,
      maxBeachOutline,
      maxSurfaceWater,
      maxHydration,
      maxRiver,
      maxLake,
      maxGlacier,
      maxSubterranean,

      seaLevelHydrationActive: true,
      oceanFillActive: true,
      waterDepthActive: true,
      bathymetryActive: true,
      beachOutlineActive: true,
      coastalShelfActive: true,
      subterraneanWaterActive: true,
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
    id: "audralia-hydration-sea-level-water-depth-beach-outline",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

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

    hydrationLaw: HYDRATION_LAW,
    layerOrder: HYDRATION_LAW.layerOrder,
    chain: HYDRATION_LAW.chain,

    topologyFirst: true,
    tectonicsSecond: true,
    terrainThird: true,
    hydrationFourth: true,

    consumesTopology: true,
    consumesTectonics: true,
    consumesTerrain: true,

    seaLevelHydrationActive: true,
    oceanFillActive: true,
    waterDepthActive: true,
    bathymetryActive: true,
    beachOutlineActive: true,
    coastalShelfActive: true,
    riverLakeGlacierActivationActive: true,
    subterraneanWaterActive: true,

    waterClasses: Object.freeze([
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
      "floodplain_wetness",
      "delta_wetness",
      "spring_seep",
      "subterranean_water",
      "dry_land"
    ]),

    ownsHydration: true,
    ownsWaterPlacement: true,
    ownsWaterFill: true,
    ownsFlowPermission: true,

    ownsTopology: false,
    ownsTectonics: false,
    ownsTerrain: false,
    ownsLandFootprint: false,
    ownsLandExpansion: false,
    ownsAboveSeaElevation: false,
    ownsSeaLevelBoundary: false,
    ownsBathymetryBlueprint: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsAnimals: false,
    ownsMarineLife: false,
    ownsConstructCivilization: false,
    ownsRouteRendering: false,
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
