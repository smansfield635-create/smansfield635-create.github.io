// /assets/audralia/audralia.hydration.render.js
// AUDRALIA_G1_HYDRATION_CONSUME_TOPOLOGY_TECTONICS_TERRAIN_WATERDOWN_TNT_v1
//
// Role:
// - First Audralia hydration authority.
// - Consumes topology first.
// - Consumes tectonics second.
// - Consumes terrain third.
// - Activates water placement and flow permission only where the upstream chain permits it.
//
// Owns:
// - ocean water classification
// - coastal water transition
// - shelf water
// - deep ocean water
// - trench water
// - river flow permission
// - stream flow permission
// - lake fill permission
// - glacier mass permission
// - snowpack source permission
// - floodplain wetness
// - delta wetness
// - spring/seep pressure
// - subterranean water permission
// - watershed routing
//
// Does not own:
// - land footprint
// - sea level
// - bathymetry blueprint
// - tectonic plates
// - terrain elevation
// - terrain relief
// - climate
// - ecology
// - foliage
// - trees
// - vegetation
// - fauna
// - route rendering
// - final visual pass

import {
  sampleTopology,
  getTopologyStatus
} from "./audralia.topology.render.js?v=AUDRALIA_G1_TOPOLOGY_LANDMASS_100_PERCENT_EXPANSION_SMALL_CONTINENTS_TNT_v1";

import {
  sampleTectonics,
  getTectonicsStatus
} from "./audralia.tectonics.render.js?v=AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1";

import {
  sampleTerrain,
  getTerrainStatus
} from "./audralia.terrain.render.js?v=AUDRALIA_G1_TERRAIN_STRONG_RELIEF_TOPOLOGY_TECTONICS_LOCK_TNT_v2";

const RECEIPT = "AUDRALIA_G1_HYDRATION_CONSUME_TOPOLOGY_TECTONICS_TERRAIN_WATERDOWN_TNT_v1";

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_HYDRATION_WATERDOWN";
const FILE = "/assets/audralia/audralia.hydration.render.js";

const TOPOLOGY_AUTHORITY = "/assets/audralia/audralia.topology.render.js";
const TECTONICS_AUTHORITY = "/assets/audralia/audralia.tectonics.render.js";
const TERRAIN_AUTHORITY = "/assets/audralia/audralia.terrain.render.js";

const HYDRATION_LAW = Object.freeze({
  role: "water-placement-and-flow-authority",
  firstWaterdownPass: true,

  consumesTopology: true,
  consumesTectonics: true,
  consumesTerrain: true,
  topologyDependencyConfirmed: true,
  tectonicsDependencyConfirmed: true,
  terrainDependencyConfirmed: true,

  topologyOwnsLandFootprint: true,
  topologyOwnsSeaLevel: true,
  topologyOwnsBathymetry: true,
  tectonicsOwnsPlatePressure: true,
  terrainOwnsElevationRelief: true,

  ownsHydration: true,
  ownsWaterPlacement: true,
  ownsFlowPermission: true,
  ownsWaterFill: true,
  ownsWatershedRouting: true,
  ownsOceanWaterClass: true,
  ownsRiverFlow: true,
  ownsStreamFlow: true,
  ownsLakeFill: true,
  ownsGlacierMass: true,
  ownsSnowpack: true,
  ownsFloodplainWetness: true,
  ownsDeltaWetness: true,
  ownsSpringSeepPressure: true,
  ownsSubterraneanWaterPermission: true,

  ownsLandFootprint: false,
  ownsSeaLevel: false,
  ownsBathymetry: false,
  ownsTectonics: false,
  ownsTerrainElevation: false,
  ownsTerrainRelief: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFoliage: false,
  ownsTrees: false,
  ownsVegetation: false,
  ownsFauna: false,
  ownsRuntime: false,
  ownsRouteRendering: false,
  ownsFinalRender: false,

  imageGeneration: false,
  graphicBox: false,
  visualPassClaimed: false
});

const WATER_CLASSES = Object.freeze([
  "dry_land",
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
  "subterranean_water"
]);

const HYDRATION_THRESHOLDS = Object.freeze({
  river: 0.56,
  stream: 0.52,
  lake: 0.58,
  glacier: 0.62,
  snowpack: 0.55,
  floodplain: 0.54,
  delta: 0.56,
  spring: 0.50,
  subterranean: 0.46
});

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y, seed = 0) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed = 0) {
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

function fbm(x, y, seed = 0, octaves = 4) {
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

function getHydrationContext(context = {}) {
  return Object.freeze({
    waterdownStrength: clamp(Number.isFinite(Number(context.waterdownStrength)) ? Number(context.waterdownStrength) : 0.82, 0, 1),
    riverActivationDemand: clamp(Number.isFinite(Number(context.riverActivationDemand)) ? Number(context.riverActivationDemand) : 0.76, 0, 1),
    lakeActivationDemand: clamp(Number.isFinite(Number(context.lakeActivationDemand)) ? Number(context.lakeActivationDemand) : 0.74, 0, 1),
    glacierActivationDemand: clamp(Number.isFinite(Number(context.glacierActivationDemand)) ? Number(context.glacierActivationDemand) : 0.72, 0, 1),
    subterraneanActivationDemand: clamp(Number.isFinite(Number(context.subterraneanActivationDemand)) ? Number(context.subterraneanActivationDemand) : 0.62, 0, 1),
    topologyContext: context.topologyContext || {},
    tectonicsContext: context.tectonicsContext || {},
    terrainContext: context.terrainContext || {},
    climateEnabled: false,
    ecologyEnabled: false,
    foliageEnabled: false,
    visualPassClaimed: false
  });
}

function safeTopology(u, v, context) {
  try {
    return sampleTopology(u, v, context.topologyContext || {});
  } catch (error) {
    const point = normalizeUV(u, v);
    return Object.freeze({
      receipt: "HYDRATION_SAFE_TOPOLOGY_FALLBACK",
      u: point.u,
      v: point.v,
      lon: point.lon,
      lat: point.lat,
      isLandFootprint: false,
      isAboveWaterLandFootprint: false,
      isVoidFootprint: true,
      isSouthPolarIceFootprint: point.lat < -0.78,
      surfaceClass: point.lat < -0.78 ? "polar_ice_footprint" : "void_mid_ocean",
      oceanDepthIndex: 0.56,
      bathymetryBlueprintIndex: 0.48,
      trenchDepthIndex: 0.0,
      shelfDepthIndex: 0.0,
      shorelinePressure: 0,
      coastalExposureIndex: 0,
      deltaReceiverBoundary: 0,
      subterraneanDepthIndex: 0,
      visualPassClaimed: false
    });
  }
}

function safeTectonics(u, v, topology, context) {
  try {
    return sampleTectonics(u, v, topology, context.tectonicsContext || {});
  } catch (error) {
    return Object.freeze({
      receipt: "HYDRATION_SAFE_TECTONICS_FALLBACK",
      u,
      v,
      topologyLandFootprint: Boolean(topology && topology.isLandFootprint),
      crustalStressIndex: 0,
      upliftPermission: 0,
      canyonPermission: 0,
      cliffPermission: 0,
      trenchReinforcementPermission: 0,
      terrainPressureHandoff: 0,
      exposedMineralHardnessIndex: 0,
      ownsHydration: false,
      ownsFoliage: false,
      visualPassClaimed: false
    });
  }
}

function safeTerrain(u, v, context) {
  try {
    return sampleTerrain(u, v, context.terrainContext || {});
  } catch (error) {
    const topology = safeTopology(u, v, context);
    const land = Boolean(topology.isLandFootprint || topology.isAboveWaterLandFootprint);
    const ice = Boolean(topology.isSouthPolarIceFootprint);

    return Object.freeze({
      receipt: "HYDRATION_SAFE_TERRAIN_FALLBACK",
      u,
      v,
      isLand: land,
      isWater: !land && !ice,
      isIce: ice,
      normalizedElevation: land ? clamp(Number(topology.terrainRisePermission) || 0.28, 0, 1) : -clamp(Number(topology.oceanDepthIndex) || 0.44, 0, 1),
      ridge: 0,
      mountainPressure: 0,
      canyonPressure: 0,
      riverIncisionPressure: 0,
      streamBranchPressure: 0,
      valleyChannelPressure: 0,
      cliffPressure: 0,
      basin: 0,
      slope: 0,
      riverbedPressure: 0,
      streamPressure: 0,
      lakeBasinPressure: 0,
      glacierSeatPressure: ice ? 0.8 : 0,
      snowpackSourcePressure: ice ? 0.7 : 0,
      floodplainPressure: 0,
      deltaReceiverPressure: 0,
      hydrologyReadinessIndex: 0,
      watershedId: "fallback",
      ownsHydration: false,
      ownsFoliage: false,
      visualPassClaimed: false
    });
  }
}

function isLand(topology, terrain) {
  return Boolean(
    (topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint || topology.topologyLandFootprint)) ||
      (terrain && terrain.isLand)
  );
}

function isIce(topology, terrain) {
  return Boolean(
    (topology && (topology.isSouthPolarIceFootprint || topology.surfaceClass === "polar_ice_footprint")) ||
      (terrain && (terrain.isIce || terrain.southIce))
  );
}

function isOcean(topology, terrain) {
  return !isLand(topology, terrain) && !isIce(topology, terrain);
}

function classifyOcean(topology) {
  const depth = clamp(
    Number(topology.oceanDepthIndex) ||
      Number(topology.bathymetryBlueprintIndex) ||
      Number(topology.basinDepthIndex) ||
      0,
    0,
    1
  );

  const shelf = clamp(
    Number(topology.shelfDepthIndex) ||
      Number(topology.reefShelfPermission) ||
      Number(topology.coastalExposureIndex) ||
      0,
    0,
    1
  );

  const trench = clamp(
    Number(topology.trenchDepthIndex) ||
      Number(topology.trenchReinforcementPermission) ||
      0,
    0,
    1
  );

  const coast = clamp(
    Number(topology.shorelinePressure) ||
      Number(topology.coastalExposureIndex) ||
      0,
    0,
    1
  );

  if (trench > 0.48 || depth > 0.78) return "trench_water";
  if (depth > 0.55) return "deep_ocean_water";
  if (shelf > 0.42) return "shelf_water";
  if (coast > 0.36) return "coastal_water";
  return "ocean_water";
}

function computeFlowDirection(point, terrain, tectonics) {
  const elevation = clamp(Number(terrain.normalizedElevation) || 0, -1, 1);
  const ridge = clamp(Number(terrain.ridge) || 0, 0, 1);
  const canyon = clamp(Number(terrain.canyonPressure) || 0, 0, 1);
  const valley = clamp(Number(terrain.valleyChannelPressure) || 0, 0, 1);
  const plateStress = clamp(Number(tectonics.crustalStressIndex) || 0, 0, 1);

  const noiseA = fbm(point.lon * 3.6 + elevation, point.lat * 3.6 - ridge, 5100, 3);
  const noiseB = fbm(point.lon * 4.1 - canyon, point.lat * 4.1 + valley, 5200, 3);

  const eastWest = clamp((noiseA - 0.5) * 2 + plateStress * 0.22 - canyon * 0.14, -1, 1);
  const northSouth = clamp((0.5 - noiseB) * 2 - elevation * 0.34 + valley * 0.22, -1, 1);

  const magnitude = Math.sqrt(eastWest * eastWest + northSouth * northSouth) || 1;

  return Object.freeze({
    x: eastWest / magnitude,
    y: northSouth / magnitude,
    compass:
      Math.abs(eastWest) > Math.abs(northSouth)
        ? eastWest >= 0 ? "eastward" : "westward"
        : northSouth >= 0 ? "northward" : "southward"
  });
}

function hydrationSignals(point, topology, tectonics, terrain, context) {
  const land = isLand(topology, terrain);
  const ice = isIce(topology, terrain);
  const ocean = isOcean(topology, terrain);

  const coastPressure = clamp(
    Number(topology.shorelinePressure) ||
      Number(topology.coastalExposureIndex) ||
      Number(terrain.coastPressure) ||
      0,
    0,
    1
  );

  const shelfPressure = clamp(
    Number(topology.shelfDepthIndex) ||
      Number(topology.reefShelfPermission) ||
      Number(terrain.shelfPermission) ||
      0,
    0,
    1
  );

  const bathymetry = clamp(
    Number(topology.oceanDepthIndex) ||
      Number(topology.bathymetryBlueprintIndex) ||
      Math.abs(Number(terrain.normalizedElevation) || 0),
    0,
    1
  );

  const trenchPressure = clamp(
    Number(topology.trenchDepthIndex) ||
      Number(tectonics.trenchReinforcementPermission) ||
      0,
    0,
    1
  );

  const elevation = clamp(Number(terrain.normalizedElevation) || 0, -1, 1);
  const slope = clamp(Number(terrain.slope) || 0, 0, 1);
  const ridge = clamp(Number(terrain.ridge) || 0, 0, 1);
  const mountain = clamp(Number(terrain.mountainPressure) || 0, 0, 1);
  const canyon = clamp(Number(terrain.canyonPressure) || 0, 0, 1);
  const valley = clamp(Number(terrain.valleyChannelPressure) || 0, 0, 1);
  const basin = clamp(Number(terrain.basin) || 0, 0, 1);

  const riverbed = clamp(Number(terrain.riverbedPressure) || 0, 0, 1);
  const stream = clamp(Number(terrain.streamPressure) || 0, 0, 1);
  const lakeBasin = clamp(Number(terrain.lakeBasinPressure) || 0, 0, 1);
  const glacierSeat = clamp(Number(terrain.glacierSeatPressure) || 0, 0, 1);
  const snowpackSeat = clamp(Number(terrain.snowpackSourcePressure) || 0, 0, 1);
  const floodplain = clamp(Number(terrain.floodplainPressure) || 0, 0, 1);
  const deltaReceiver = clamp(
    Number(terrain.deltaReceiverPressure) ||
      Number(topology.deltaReceiverBoundary) ||
      0,
    0,
    1
  );

  const hydrologyReadiness = clamp(Number(terrain.hydrologyReadinessIndex) || 0, 0, 1);

  const crustStress = clamp(Number(tectonics.crustalStressIndex) || 0, 0, 1);
  const fracture = clamp(
    Number(tectonics.canyonPermission) ||
      Number(tectonics.fracturePressure) ||
      crustStress * 0.46,
    0,
    1
  );

  const subterraneanDepth = clamp(
    Number(topology.subterraneanDepthIndex) ||
      Number(topology.foundationDensityIndex) ||
      Number(topology.rockMassBoundaryIndex) ||
      0,
    0,
    1
  );

  const mineralHardness = clamp(Number(tectonics.exposedMineralHardnessIndex) || 0, 0, 1);

  const sourcePressure = clamp(
    glacierSeat * 0.24 +
      snowpackSeat * 0.20 +
      mountain * 0.18 +
      ridge * 0.14 +
      elevation * 0.12 +
      context.waterdownStrength * 0.12,
    0,
    1
  );

  const riverFlowPressure = land
    ? clamp(
        riverbed * 0.34 +
          valley * 0.20 +
          canyon * 0.16 +
          sourcePressure * 0.14 +
          hydrologyReadiness * 0.12 +
          context.riverActivationDemand * 0.04,
        0,
        1
      )
    : 0;

  const streamFlowPressure = land
    ? clamp(
        stream * 0.34 +
          ridge * 0.16 +
          sourcePressure * 0.16 +
          slope * 0.10 +
          hydrologyReadiness * 0.10 +
          context.riverActivationDemand * 0.04,
        0,
        1
      )
    : 0;

  const lakeFillPressure = land
    ? clamp(
        lakeBasin * 0.36 +
          basin * 0.20 +
          (1 - slope) * 0.14 +
          floodplain * 0.12 +
          riverFlowPressure * 0.08 +
          context.lakeActivationDemand * 0.06,
        0,
        1
      )
    : 0;

  const glacierMassPressure = land || ice
    ? clamp(
        glacierSeat * 0.36 +
          snowpackSeat * 0.24 +
          mountain * 0.14 +
          smoothstep(0.58, 0.94, point.lat) * 0.14 +
          context.glacierActivationDemand * 0.08,
        0,
        1
      )
    : 0;

  const snowpackPressure = land || ice
    ? clamp(
        snowpackSeat * 0.38 +
          glacierMassPressure * 0.22 +
          ridge * 0.14 +
          smoothstep(0.52, 0.94, point.lat) * 0.14 +
          context.glacierActivationDemand * 0.06,
        0,
        1
      )
    : 0;

  const floodplainWetness = land
    ? clamp(
        floodplain * 0.36 +
          riverFlowPressure * 0.20 +
          lakeFillPressure * 0.14 +
          (1 - slope) * 0.10 +
          coastPressure * 0.10 +
          hydrologyReadiness * 0.08,
        0,
        1
      )
    : 0;

  const deltaWetness = land || ocean
    ? clamp(
        deltaReceiver * 0.34 +
          coastPressure * 0.24 +
          riverFlowPressure * 0.18 +
          floodplainWetness * 0.12 +
          shelfPressure * 0.08,
        0,
        1
      )
    : 0;

  const springSeepPressure = land
    ? clamp(
        subterraneanDepth * 0.24 +
          fracture * 0.22 +
          mineralHardness * 0.12 +
          ridge * 0.10 +
          basin * 0.10 +
          hydrologyReadiness * 0.12 +
          context.subterraneanActivationDemand * 0.06,
        0,
        1
      )
    : 0;

  const subterraneanWaterPressure = land
    ? clamp(
        subterraneanDepth * 0.30 +
          basin * 0.18 +
          fracture * 0.16 +
          springSeepPressure * 0.16 +
          lakeFillPressure * 0.08 +
          floodplainWetness * 0.08,
        0,
        1
      )
    : 0;

  const surfaceWaterIndex = ocean
    ? clamp(0.62 + shelfPressure * 0.18 + bathymetry * 0.14 + trenchPressure * 0.06, 0, 1)
    : clamp(
        riverFlowPressure * 0.18 +
          streamFlowPressure * 0.14 +
          lakeFillPressure * 0.18 +
          glacierMassPressure * 0.16 +
          snowpackPressure * 0.10 +
          floodplainWetness * 0.10 +
          deltaWetness * 0.08 +
          springSeepPressure * 0.06,
        0,
        1
      );

  const hydrationActivationIndex = clamp(
    surfaceWaterIndex * 0.34 +
      hydrologyReadiness * 0.18 +
      sourcePressure * 0.14 +
      riverFlowPressure * 0.10 +
      lakeFillPressure * 0.10 +
      glacierMassPressure * 0.08 +
      subterraneanWaterPressure * 0.06,
    0,
    1
  );

  const flowDirection = computeFlowDirection(point, terrain, tectonics);

  let waterClass = "dry_land";

  if (ocean) {
    waterClass = classifyOcean(topology);
  } else if (glacierMassPressure >= HYDRATION_THRESHOLDS.glacier) {
    waterClass = "glacier_mass";
  } else if (snowpackPressure >= HYDRATION_THRESHOLDS.snowpack) {
    waterClass = "snowpack_source";
  } else if (lakeFillPressure >= HYDRATION_THRESHOLDS.lake) {
    waterClass = "lake_fill";
  } else if (riverFlowPressure >= HYDRATION_THRESHOLDS.river) {
    waterClass = "river_flow";
  } else if (streamFlowPressure >= HYDRATION_THRESHOLDS.stream) {
    waterClass = "stream_flow";
  } else if (floodplainWetness >= HYDRATION_THRESHOLDS.floodplain) {
    waterClass = "floodplain_wetness";
  } else if (deltaWetness >= HYDRATION_THRESHOLDS.delta) {
    waterClass = "delta_wetness";
  } else if (springSeepPressure >= HYDRATION_THRESHOLDS.spring) {
    waterClass = "spring_seep";
  } else if (subterraneanWaterPressure >= HYDRATION_THRESHOLDS.subterranean) {
    waterClass = "subterranean_water";
  }

  return Object.freeze({
    land,
    ice,
    ocean,
    waterClass,
    flowDirection,

    coastPressure,
    shelfPressure,
    bathymetry,
    trenchPressure,
    sourcePressure,

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
    hydrationActivationIndex
  });
}

function hydrationColorInfluence(sample) {
  const activation = clamp(sample.hydrationActivationIndex || 0, 0, 1);

  if (sample.isGlacier || sample.isSnowpack) {
    return Object.freeze({
      base: sample.isGlacier ? "glacier_mass" : "snowpack_source",
      r: Math.round(mix(216, 246, activation)),
      g: Math.round(mix(232, 252, activation)),
      b: Math.round(mix(240, 255, activation)),
      a: activation
    });
  }

  if (sample.isRiver || sample.isStream) {
    return Object.freeze({
      base: sample.isRiver ? "river_flow" : "stream_flow",
      r: Math.round(mix(42, 98, activation)),
      g: Math.round(mix(118, 184, activation)),
      b: Math.round(mix(168, 230, activation)),
      a: activation
    });
  }

  if (sample.isLake) {
    return Object.freeze({
      base: "lake_fill",
      r: Math.round(mix(34, 76, activation)),
      g: Math.round(mix(104, 164, activation)),
      b: Math.round(mix(154, 216, activation)),
      a: activation
    });
  }

  if (sample.isOceanWater) {
    return Object.freeze({
      base: sample.waterClass,
      r: Math.round(mix(4, 42, sample.shelfPressure)),
      g: Math.round(mix(26, 128, sample.shelfPressure)),
      b: Math.round(mix(78, 184, sample.shelfPressure)),
      a: 1
    });
  }

  if (sample.isFloodplain || sample.isDelta || sample.isSpring || sample.isSubterraneanWater) {
    return Object.freeze({
      base: sample.waterClass,
      r: Math.round(mix(38, 84, activation)),
      g: Math.round(mix(100, 168, activation)),
      b: Math.round(mix(122, 196, activation)),
      a: activation
    });
  }

  return Object.freeze({
    base: "dry_land_no_surface_water",
    r: 0,
    g: 0,
    b: 0,
    a: 0
  });
}

export function createHydrationProfile(overrides = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    role: "hydration-waterdown-authority",

    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,

    hydrationLaw: HYDRATION_LAW,
    waterClasses: WATER_CLASSES,
    thresholds: HYDRATION_THRESHOLDS,

    consumesTopology: true,
    consumesTectonics: true,
    consumesTerrain: true,
    topologyDependencyConfirmed: true,
    tectonicsDependencyConfirmed: true,
    terrainDependencyConfirmed: true,

    ownsHydration: true,
    ownsWaterPlacement: true,
    ownsFlowPermission: true,
    ownsWaterFill: true,
    ownsWatershedRouting: true,
    ownsOceanWaterClass: true,
    ownsRiverFlow: true,
    ownsStreamFlow: true,
    ownsLakeFill: true,
    ownsGlacierMass: true,
    ownsSnowpack: true,
    ownsFloodplainWetness: true,
    ownsDeltaWetness: true,
    ownsSpringSeepPressure: true,
    ownsSubterraneanWaterPermission: true,

    ownsLandFootprint: false,
    ownsSeaLevel: false,
    ownsBathymetry: false,
    ownsTectonics: false,
    ownsTerrainElevation: false,
    ownsTerrainRelief: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsRouteRendering: false,
    ownsFinalRender: false,

    hydrationHeld: false,
    climateEnabled: false,
    ecologyEnabled: false,
    foliageEnabled: false,
    visualPassClaimed: false,

    ...overrides
  });
}

export function sampleHydration(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const hydrationContext = getHydrationContext(context);

  const topology = safeTopology(point.u, point.v, hydrationContext);
  const tectonics = safeTectonics(point.u, point.v, topology, hydrationContext);
  const terrain = safeTerrain(point.u, point.v, hydrationContext);

  const signals = hydrationSignals(point, topology, tectonics, terrain, hydrationContext);

  const waterClass = signals.waterClass;

  const sample = Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    topologyReceipt: topology.receipt || topology.activeContract || "unknown",
    tectonicsReceipt: tectonics.receipt || "unknown",
    terrainReceipt: terrain.receipt || "unknown",

    consumesTopology: true,
    consumesTectonics: true,
    consumesTerrain: true,
    topologyDependencyConfirmed: true,
    tectonicsDependencyConfirmed: true,
    terrainDependencyConfirmed: true,

    isHydrated: waterClass !== "dry_land",
    isOceanWater:
      waterClass === "ocean_water" ||
      waterClass === "coastal_water" ||
      waterClass === "shelf_water" ||
      waterClass === "deep_ocean_water" ||
      waterClass === "trench_water",
    isCoastalWater: waterClass === "coastal_water",
    isShelfWater: waterClass === "shelf_water",
    isDeepOcean: waterClass === "deep_ocean_water",
    isTrenchWater: waterClass === "trench_water",
    isRiver: waterClass === "river_flow",
    isStream: waterClass === "stream_flow",
    isLake: waterClass === "lake_fill",
    isGlacier: waterClass === "glacier_mass",
    isSnowpack: waterClass === "snowpack_source",
    isFloodplain: waterClass === "floodplain_wetness",
    isDelta: waterClass === "delta_wetness",
    isSpring: waterClass === "spring_seep",
    isSubterraneanWater: waterClass === "subterranean_water",

    waterClass,
    watershedId: terrain.watershedId || "ocean",
    flowDirection: signals.flowDirection.compass,
    flowVectorX: signals.flowDirection.x,
    flowVectorY: signals.flowDirection.y,
    flowStrength: clamp(
      signals.riverFlowPressure * 0.34 +
        signals.streamFlowPressure * 0.22 +
        signals.glacierMassPressure * 0.14 +
        signals.snowpackPressure * 0.10 +
        signals.deltaWetness * 0.10 +
        signals.springSeepPressure * 0.10,
      0,
      1
    ),

    coastPressure: signals.coastPressure,
    shelfPressure: signals.shelfPressure,
    bathymetryHydrationIndex: signals.bathymetry,
    trenchHydrationIndex: signals.trenchPressure,
    sourcePressure: signals.sourcePressure,

    riverFlowPressure: signals.riverFlowPressure,
    streamFlowPressure: signals.streamFlowPressure,
    lakeFillPressure: signals.lakeFillPressure,
    glacierMassPressure: signals.glacierMassPressure,
    snowpackPressure: signals.snowpackPressure,
    floodplainWetness: signals.floodplainWetness,
    deltaWetness: signals.deltaWetness,
    springSeepPressure: signals.springSeepPressure,
    subterraneanWaterPressure: signals.subterraneanWaterPressure,
    surfaceWaterIndex: signals.surfaceWaterIndex,
    hydrationActivationIndex: signals.hydrationActivationIndex,

    topologyLandFootprint: signals.land,
    topologyIceFootprint: signals.ice,
    topologyOceanFootprint: signals.ocean,
    terrainElevation: terrain.normalizedElevation || 0,
    terrainHydrologyReadinessIndex: terrain.hydrologyReadinessIndex || 0,

    hydrationColorInfluence: null,

    ownsHydration: true,
    ownsWaterPlacement: true,
    ownsFlowPermission: true,
    ownsWaterFill: true,
    ownsWatershedRouting: true,

    ownsLandFootprint: false,
    ownsSeaLevel: false,
    ownsBathymetry: false,
    ownsTectonics: false,
    ownsTerrainElevation: false,
    ownsTerrainRelief: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsRouteRendering: false,
    ownsFinalRender: false,

    hydrationHeld: false,
    climateEnabled: false,
    ecologyEnabled: false,
    foliageEnabled: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false
  });

  return Object.freeze({
    ...sample,
    hydrationColorInfluence: hydrationColorInfluence(sample)
  });
}

export function buildHydrationField(width = 128, height = 128, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 128));
  const h = Math.max(8, Math.floor(Number(height) || 128));
  const samples = new Array(w * h);

  const classCounts = new Map();
  const watershedCounts = new Map();

  let hydratedSamples = 0;
  let oceanSamples = 0;
  let riverSamples = 0;
  let streamSamples = 0;
  let lakeSamples = 0;
  let glacierSamples = 0;
  let snowpackSamples = 0;
  let floodplainSamples = 0;
  let deltaSamples = 0;
  let springSamples = 0;
  let subterraneanSamples = 0;

  let maxRiver = 0;
  let maxStream = 0;
  let maxLake = 0;
  let maxGlacier = 0;
  let maxSnowpack = 0;
  let maxFloodplain = 0;
  let maxDelta = 0;
  let maxSpring = 0;
  let maxSubterranean = 0;
  let maxSurfaceWater = 0;
  let maxHydration = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = sampleHydration(u, v, options);
      const index = y * w + x;

      samples[index] = sample;

      classCounts.set(sample.waterClass, (classCounts.get(sample.waterClass) || 0) + 1);
      watershedCounts.set(sample.watershedId, (watershedCounts.get(sample.watershedId) || 0) + 1);

      if (sample.isHydrated) hydratedSamples += 1;
      if (sample.isOceanWater) oceanSamples += 1;
      if (sample.isRiver) riverSamples += 1;
      if (sample.isStream) streamSamples += 1;
      if (sample.isLake) lakeSamples += 1;
      if (sample.isGlacier) glacierSamples += 1;
      if (sample.isSnowpack) snowpackSamples += 1;
      if (sample.isFloodplain) floodplainSamples += 1;
      if (sample.isDelta) deltaSamples += 1;
      if (sample.isSpring) springSamples += 1;
      if (sample.isSubterraneanWater) subterraneanSamples += 1;

      maxRiver = Math.max(maxRiver, sample.riverFlowPressure);
      maxStream = Math.max(maxStream, sample.streamFlowPressure);
      maxLake = Math.max(maxLake, sample.lakeFillPressure);
      maxGlacier = Math.max(maxGlacier, sample.glacierMassPressure);
      maxSnowpack = Math.max(maxSnowpack, sample.snowpackPressure);
      maxFloodplain = Math.max(maxFloodplain, sample.floodplainWetness);
      maxDelta = Math.max(maxDelta, sample.deltaWetness);
      maxSpring = Math.max(maxSpring, sample.springSeepPressure);
      maxSubterranean = Math.max(maxSubterranean, sample.subterraneanWaterPressure);
      maxSurfaceWater = Math.max(maxSurfaceWater, sample.surfaceWaterIndex);
      maxHydration = Math.max(maxHydration, sample.hydrationActivationIndex);
    }
  }

  const activeWaterClasses = Array.from(classCounts.keys()).sort();
  const activeWatersheds = Array.from(watershedCounts.keys()).sort();

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,
    width: w,
    height: h,
    samples,
    profile: createHydrationProfile(options.profile || {}),
    topologyStatus: getTopologyStatus(),
    tectonicsStatus: getTectonicsStatus(),
    terrainStatus: getTerrainStatus(),
    stats: Object.freeze({
      totalSamples: samples.length,
      hydratedSamples,
      drySamples: samples.length - hydratedSamples,
      oceanSamples,
      riverSamples,
      streamSamples,
      lakeSamples,
      glacierSamples,
      snowpackSamples,
      floodplainSamples,
      deltaSamples,
      springSamples,
      subterraneanSamples,

      hydrationRatio: hydratedSamples / samples.length,
      oceanRatio: oceanSamples / samples.length,
      riverRatio: riverSamples / samples.length,
      streamRatio: streamSamples / samples.length,
      lakeRatio: lakeSamples / samples.length,
      glacierRatio: glacierSamples / samples.length,
      snowpackRatio: snowpackSamples / samples.length,
      floodplainRatio: floodplainSamples / samples.length,
      deltaRatio: deltaSamples / samples.length,
      springRatio: springSamples / samples.length,
      subterraneanRatio: subterraneanSamples / samples.length,

      activeWaterClassCount: activeWaterClasses.length,
      expectedWaterClassCount: WATER_CLASSES.length,
      activeWaterClasses,

      activeWatershedCount: activeWatersheds.length,
      activeWatersheds,

      maxRiver,
      maxStream,
      maxLake,
      maxGlacier,
      maxSnowpack,
      maxFloodplain,
      maxDelta,
      maxSpring,
      maxSubterranean,
      maxSurfaceWater,
      maxHydration,

      consumesTopology: true,
      consumesTectonics: true,
      consumesTerrain: true,
      topologyDependencyConfirmed: true,
      tectonicsDependencyConfirmed: true,
      terrainDependencyConfirmed: true,

      ownsHydration: true,
      ownsWaterPlacement: true,
      ownsFlowPermission: true,
      ownsWaterFill: true,
      ownsWatershedRouting: true,

      ownsLandFootprint: false,
      ownsSeaLevel: false,
      ownsBathymetry: false,
      ownsTectonics: false,
      ownsTerrainElevation: false,
      ownsTerrainRelief: false,
      ownsClimate: false,
      ownsEcology: false,
      ownsFoliage: false,
      ownsTrees: false,
      ownsVegetation: false,
      ownsFauna: false,
      ownsRuntime: false,
      ownsRouteRendering: false,
      ownsFinalRender: false,

      hydrationHeld: false,
      climateEnabled: false,
      ecologyEnabled: false,
      foliageEnabled: false,
      visualPassClaimed: false
    }),
    hydrationChild: true,
    downstreamForTopology: true,
    downstreamForTectonics: true,
    downstreamForTerrain: true,
    visualPassClaimed: false
  });
}

export function getHydrationSampleFromField(field, uInput, vInput) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleHydration(uInput, vInput);
  }

  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  const x = clamp(Math.round(u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getHydrationStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    status: "active",
    id: "audralia-g1-hydration-consume-topology-tectonics-terrain-waterdown",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    role: "hydration-waterdown-authority",
    topologyAuthority: TOPOLOGY_AUTHORITY,
    tectonicsAuthority: TECTONICS_AUTHORITY,
    terrainAuthority: TERRAIN_AUTHORITY,

    consumesTopology: true,
    consumesTectonics: true,
    consumesTerrain: true,
    topologyDependencyConfirmed: true,
    tectonicsDependencyConfirmed: true,
    terrainDependencyConfirmed: true,

    ownsHydration: true,
    ownsWaterPlacement: true,
    ownsFlowPermission: true,
    ownsWaterFill: true,
    ownsWatershedRouting: true,
    ownsOceanWaterClass: true,
    ownsRiverFlow: true,
    ownsStreamFlow: true,
    ownsLakeFill: true,
    ownsGlacierMass: true,
    ownsSnowpack: true,
    ownsFloodplainWetness: true,
    ownsDeltaWetness: true,
    ownsSpringSeepPressure: true,
    ownsSubterraneanWaterPermission: true,

    ownsLandFootprint: false,
    ownsSeaLevel: false,
    ownsBathymetry: false,
    ownsTectonics: false,
    ownsTerrainElevation: false,
    ownsTerrainRelief: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFoliage: false,
    ownsTrees: false,
    ownsVegetation: false,
    ownsFauna: false,
    ownsRuntime: false,
    ownsRouteRendering: false,
    ownsFinalRender: false,

    waterClasses: WATER_CLASSES,
    thresholds: HYDRATION_THRESHOLDS,

    hydrationHeld: false,
    hydrationActivated: true,
    climateEnabled: false,
    ecologyEnabled: false,
    foliageEnabled: false,

    exports: Object.freeze([
      "createHydrationProfile",
      "sampleHydration",
      "buildHydrationField",
      "getHydrationSampleFromField",
      "getHydrationStatus"
    ]),

    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createHydrationProfile,
  sampleHydration,
  buildHydrationField,
  getHydrationSampleFromField,
  getHydrationStatus
});
