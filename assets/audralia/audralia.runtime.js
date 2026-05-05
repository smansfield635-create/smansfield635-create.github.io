// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1
//
// Active renewal:
// - AUDRALIA_TOPOLOGY_RUNTIME_EARTH_EQUIVALENT_LAND_RATIO_ALIGNMENT_TNT_v1
//
// Role:
// - Audralia runtime authority.
// - Consumes topology Earth-equivalent land-ratio field.
// - Preserves current route/runtime contract.
// - Preserves active invariant climate conduit.
// - Preserves hydration visibility.
// - Ensures hydration cannot erase topology-approved land.
// - Exposes route-visible land/water/beach/relief diagnostics.
//
// Correct chain:
// - Physical genealogy: tectonics → topology → terrain
// - Environmental conduit: climate → hydration
// - Runtime composition: topology + terrain + climate-conditioned hydration → runtime → route
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No camera control.
// - No zoom control.
// - No spin control.
// - No parent auto-mount.
// - No topology file overwrite.
// - No terrain file overwrite.
// - No hydration file overwrite.
// - No climate rendering.
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
  buildTopologyField,
  getTopologySampleFromField,
  getTopologyStatus,
  estimateEarthEquivalentSeaLevel
} from "./audralia/tectonics/topology/render.js?v=AUDRALIA_TOPOLOGY_EARTH_EQUIVALENT_EXPOSED_LAND_RATIO_TNT_v1";

import {
  sampleClimate,
  buildClimateField,
  getClimateStatus
} from "./audralia.climate.render.js?v=AUDRALIA_CLIMATE_INVARIANT_HYDRATION_CONDUIT_TNT_v1";

const RECEIPT = "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_TOPOLOGY_RUNTIME_EARTH_EQUIVALENT_LAND_RATIO_ALIGNMENT_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_RUNTIME_CLIMATE_CONDUIT_ALIGNMENT_TNT_v1",
  "AUDRALIA_RUNTIME_IMPORT_STABILIZER_TNT_v1",
  "AUDRALIA_RUNTIME_ROUTE_COMPAT_SURFACE_DIAGNOSTIC_RENEWAL_TNT_v2",
  "AUDRALIA_RUNTIME_CONSUME_HYDRATION_AFTER_TERRAIN_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G2_RUNTIME_EARTH_EQUIVALENT_LAND_RATIO_ALIGNED";
const FILE = "/assets/audralia/audralia.runtime.js";

const TARGET_LAND_RATIO = 0.292;
const TARGET_MIN = 0.270;
const TARGET_MAX = 0.310;

const AUTHORITY_PATHS = Object.freeze({
  tectonicsParent: "/assets/audralia/audralia/tectonics/render.js",
  topologyChild: "/assets/audralia/audralia/tectonics/topology/render.js",
  terrainGrandchild: "/assets/audralia/audralia/tectonics/topology/terrain.render.js",
  climateInvariant: "/assets/audralia/audralia.climate.render.js",
  hydrationParent: "/assets/audralia/audralia/hydration/render.js",
  oceansChild: "/assets/audralia/audralia/hydration/oceans.render.js",
  parentIdentity: "/assets/audralia/audralia.planet.render.js",
  routeExpected: "/showroom/globe/audralia/index.js"
});

const CONTRACTS = Object.freeze({
  runtime: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  topologyChild: "AUDRALIA_TOPOLOGY_EARTH_EQUIVALENT_EXPOSED_LAND_RATIO_TNT_v1",
  topologyCompatibility: "AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1",
  terrainGrandchild: "AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1",
  climateInvariant: "AUDRALIA_CLIMATE_INVARIANT_HYDRATION_CONDUIT_TNT_v1",
  hydrationParent: "AUDRALIA_HYDRATION_PARENT_TECTONIC_GENEALOGY_ALIGNMENT_TNT_v1",
  oceansChild: "AUDRALIA_HYDRATION_OCEANS_CHILD_TURQUOISE_DEPTH_GRADIENT_TNT_v1",
  parentIdentity: "AUDRALIA_PARENT_THIN_IDENTITY_HANDOFF_NO_AUTOMOUNT_TNT_v1",
  routeExpected: "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1"
});

const RUNTIME_LAW = Object.freeze({
  physicalGenealogy: "tectonics→topology→terrain",
  environmentalConduit: "climate→hydration",
  runtimeComposition: "earth_equivalent_topology+terrain+climate_conditioned_hydration→runtime→route",
  fullChain: "tectonics→topology(earth_equivalent_land_ratio)→terrain + climate→hydration → runtime→route",

  targetLandRatio: TARGET_LAND_RATIO,
  targetLandRatioMin: TARGET_MIN,
  targetLandRatioMax: TARGET_MAX,

  topologyLandControlsLandPreservation: true,
  hydrationCannotEraseTopologyLand: true,
  oceansMayFillOnlyTopologyVoid: true,
  routeMustPaintRuntimeSurfaceClass: true,

  climateActiveInvariant: true,
  climateVisible: false,
  climateConducesHydration: true,
  climateDoesNotRender: true,
  hydrationReadsClimate: true,

  ownsRuntimeSampling: true,
  ownsChainComposition: true,
  ownsPerformanceCache: true,
  ownsRouteDataHandoff: true,
  ownsVisualSurfaceClassification: true,

  ownsTectonics: false,
  ownsTopology: false,
  ownsTerrain: false,
  ownsClimate: false,
  ownsHydration: false,
  ownsOceansChild: false,
  ownsLandFootprint: false,
  ownsWaterFill: false,
  ownsCloudRendering: false,
  ownsWeatherAnimation: false,
  ownsCameraControl: false,
  ownsZoomControl: false,
  ownsSpinControl: false,
  ownsRouteRendering: false,
  ownsFinalRender: false,

  ecologyEnabled: false,
  foliageEnabled: false,
  treesEnabled: false,
  vegetationEnabled: false,
  animalsEnabled: false,
  marineLifeEnabled: false,
  constructCivilizationEnabled: false,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 192,
  fieldHeight: 96,
  minFieldWidth: 64,
  minFieldHeight: 32,
  maxFieldWidth: 320,
  maxFieldHeight: 160,

  targetLandRatio: TARGET_LAND_RATIO,
  coastalWidth: 0.060,
  shelfWidth: 0.145,
  hydrationStrength: 0.86,
  climateHydrationWeight: 0.42,
  reliefStrength: 0.86,
  beachStrength: 0.90
});

let sharedRuntime = null;
let lightweightStatus = null;

function clamp(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y, seed) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function noise2(x, y, seed) {
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

function fbm(x, y, seed, octaves = 4) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += noise2(x * frequency, y * frequency, seed + i * 31.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.00001, normalizer);
}

function normalizeDimension(value, fallback, min, max) {
  return clamp(Math.floor(Number(value) || fallback), min, max);
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

function getRuntimeOptions(options = {}) {
  return Object.freeze({
    fieldWidth: normalizeDimension(
      options.fieldWidth || options.width,
      DEFAULTS.fieldWidth,
      DEFAULTS.minFieldWidth,
      DEFAULTS.maxFieldWidth
    ),
    fieldHeight: normalizeDimension(
      options.fieldHeight || options.height,
      DEFAULTS.fieldHeight,
      DEFAULTS.minFieldHeight,
      DEFAULTS.maxFieldHeight
    ),

    targetLandRatio: clamp(Number(options.targetLandRatio) || DEFAULTS.targetLandRatio, 0.18, 0.42),
    coastalWidth: clamp(Number(options.coastalWidth) || DEFAULTS.coastalWidth, 0.025, 0.12),
    shelfWidth: clamp(Number(options.shelfWidth) || DEFAULTS.shelfWidth, 0.08, 0.24),
    hydrationStrength: clamp(Number(options.hydrationStrength) || DEFAULTS.hydrationStrength, 0.30, 1),
    climateHydrationWeight: clamp(Number(options.climateHydrationWeight) || DEFAULTS.climateHydrationWeight, 0.20, 0.72),
    reliefStrength: clamp(Number(options.reliefStrength) || DEFAULTS.reliefStrength, 0.25, 1),
    beachStrength: clamp(Number(options.beachStrength) || DEFAULTS.beachStrength, 0.25, 1),

    climateEnabled: true,
    climateActiveInvariant: true,
    climateConducesHydration: true,
    climateVisible: false,

    allowsTopology: true,
    allowsTerrain: true,
    allowsHydration: true,
    allowsWater: true,
    allowsLand: true,
    allowsBeachOutline: true,
    allowsRelief: true,

    hydrationHeld: false,
    hydrationAllowedToRender: true,
    landPreservationFirst: true,
    topologyLandControlsLandPreservation: true,
    hydrationCannotEraseTopologyLand: true,
    oceansMayFillOnlyTopologyVoid: true,

    ecologyEnabled: false,
    foliageEnabled: false,
    treesEnabled: false,
    vegetationEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,
    visualPassClaimed: false
  });
}

function deriveTectonicPressure(point, topology) {
  const stress = fbm(point.lon * 8.0 + 2.0, point.lat * 8.0 - 3.0, 7101, 4);
  const boundary = fbm(point.lon * 15.0 - 4.5, point.lat * 15.0 + 1.5, 7117, 3);
  const lift = fbm(point.lon * 5.0 + 1.2, point.lat * 5.0 - 7.4, 7133, 4);

  const crustalStressIndex = clamp(stress * 0.52 + boundary * 0.26, 0, 1);
  const mountainChainPermission = topology.isAboveWaterLandFootprint
    ? clamp(lift * 0.44 + crustalStressIndex * 0.28 + topology.terrainRisePermission * 0.24, 0, 1)
    : 0;
  const canyonPermission = topology.isAboveWaterLandFootprint
    ? clamp(boundary * 0.42 + stress * 0.22, 0, 1)
    : 0;
  const cliffPermission = clamp(topology.shorelinePressure * 0.45 + boundary * 0.28, 0, 1);
  const upliftPermission = topology.isAboveWaterLandFootprint
    ? clamp(mountainChainPermission * 0.44 + lift * 0.24, 0, 1)
    : 0;
  const terrainPressureHandoff = clamp(
    mountainChainPermission * 0.42 +
      canyonPermission * 0.20 +
      upliftPermission * 0.24 +
      topology.terrainRisePermission * 0.14,
    0,
    1
  );

  return Object.freeze({
    receipt: "RUNTIME_TECTONIC_PRESSURE_DERIVED_FROM_TOPOLOGY_ALIGNMENT",
    crustalStressIndex,
    mountainChainPermission,
    canyonPermission,
    cliffPermission,
    upliftPermission,
    terrainPressureHandoff,
    diamondPressureIndex: topology.diamondPressureIndex || clamp(stress * 0.42 + boundary * 0.22, 0, 1),
    opalSeamIndex: topology.opalSeamIndex || clamp((1 - stress) * 0.26 + lift * 0.24, 0, 1),
    graniteCratonIndex: topology.graniteCratonIndex || clamp(lift * 0.44 + topology.landPotential * 0.20, 0, 1),
    slateFoldBeltIndex: topology.slateFoldBeltIndex || clamp(boundary * 0.48 + stress * 0.16, 0, 1),
    exposedMineralHardnessIndex: topology.exposedMineralHardnessIndex || clamp(stress * 0.36 + lift * 0.22, 0, 1)
  });
}

function deriveTerrain(point, topology, tectonics, options) {
  const land = Boolean(topology.isAboveWaterLandFootprint);
  const ice = Boolean(topology.isPolarIceFootprint);

  const detail = fbm(point.lon * 18.0 + 3.6, point.lat * 18.0 - 2.7, 7201, 4);
  const channels = fbm(point.lon * 34.0 - 1.2, point.lat * 34.0 + 4.5, 7217, 3);
  const broad = fbm(point.lon * 6.0 + 2.3, point.lat * 6.0 - 7.1, 7231, 4);

  const normalizedElevation = land
    ? clamp(
        topology.terrainRisePermission * 0.44 +
          tectonics.terrainPressureHandoff * 0.30 +
          tectonics.mountainChainPermission * 0.16 +
          detail * 0.10,
        0,
        1
      )
    : -clamp(topology.oceanDepthIndex || topology.bathymetryBlueprintIndex || 0.48, 0, 1);

  const ridge = land
    ? clamp(tectonics.mountainChainPermission * 0.46 + tectonics.upliftPermission * 0.22 + detail * 0.20, 0, 1)
    : 0;

  const canyonPressure = land
    ? clamp(tectonics.canyonPermission * 0.44 + Math.max(0, channels - 0.48) * 0.64 + ridge * 0.12, 0, 1)
    : 0;

  const cliffPressure = land || topology.isCoastline
    ? clamp(tectonics.cliffPermission * 0.42 + topology.coastalCliffPressure * 0.42 + topology.shorelinePressure * 0.16, 0, 1)
    : 0;

  const basin = land
    ? clamp((1 - normalizedElevation) * 0.32 + broad * 0.18, 0, 1)
    : clamp(topology.oceanDepthIndex * 0.76, 0, 1);

  const riverbedPressure = land ? clamp(canyonPressure * 0.44 + channels * 0.28 + topology.shorelinePressure * 0.12, 0, 1) : 0;
  const streamPressure = land ? clamp(riverbedPressure * 0.66 + detail * 0.12, 0, 1) : 0;
  const lakeBasinPressure = land ? clamp(basin * 0.52 + (1 - ridge) * 0.16, 0, 1) : 0;
  const glacierSeatPressure = ice ? 0.86 : land && Math.abs(point.lat) > 0.66 ? clamp((Math.abs(point.lat) - 0.66) / 0.34, 0, 1) * 0.48 : 0;
  const valleyChannelPressure = land ? clamp(canyonPressure * 0.56 + riverbedPressure * 0.24, 0, 1) : 0;

  const hydrologyReadinessIndex = land || ice
    ? clamp(
        riverbedPressure * 0.22 +
          streamPressure * 0.14 +
          lakeBasinPressure * 0.18 +
          glacierSeatPressure * 0.18 +
          valleyChannelPressure * 0.16 +
          topology.beachOutlinePressure * 0.12,
        0,
        1
      )
    : 0;

  return Object.freeze({
    receipt: CONTRACTS.terrainGrandchild,
    isLand: land,
    isWater: !land && !ice,
    isIce: ice,
    normalizedElevation,
    elevationMeters: land ? Math.round(normalizedElevation * 9400) : Math.round(normalizedElevation * 5600),
    ridge,
    mountainPressure: ridge,
    basin,
    slope: land ? clamp(ridge * 0.38 + canyonPressure * 0.24 + cliffPressure * 0.18, 0, 1) : 0,
    canyonPressure,
    cliffPressure,
    riverIncisionPressure: land ? clamp(canyonPressure * 0.62, 0, 1) : 0,
    valleyChannelPressure,
    riverbedPressure,
    streamPressure,
    lakeBasinPressure,
    glacierSeatPressure,
    snowpackSourcePressure: glacierSeatPressure,
    floodplainPressure: land ? clamp(riverbedPressure * (1 - ridge) * 0.58, 0, 1) : 0,
    deltaReceiverPressure: land && topology.isCoastline ? clamp(riverbedPressure * topology.shorelinePressure * 0.72, 0, 1) : 0,
    hydrologyReadinessIndex,

    ownsTerrain: true,
    ownsLandFootprint: false,
    ownsHydration: false,
    ownsClimate: false,
    visualPassClaimed: false
  });
}

function safeClimateSample(point, topology, terrain) {
  try {
    return sampleClimate(point.u, point.v, {
      topology,
      terrain,
      climateContext: {
        cleanAtmosphereIndex: 0.96,
        oceanCycleStrength: 0.88,
        pressureCirculationStrength: 0.84,
        rainfallStrength: 0.78,
        evaporationStrength: 0.72,
        snowlineSensitivity: 0.74,
        glacierPermissionStrength: 0.70,
        elevationClimateStrength: 0.86,
        breathableEnvelopeStrength: 0.96
      }
    });
  } catch (error) {
    return Object.freeze({
      receipt: "RUNTIME_CLIMATE_SAFE_FALLBACK",
      climateActive: true,
      climateInvariant: true,
      climateConducesHydration: true,
      climateVisible: false,
      climateFallbackUsed: true,
      temperatureIndex: 0.52,
      pressureIndex: 0.52,
      windCorridorIndex: 0.46,
      rainfallTendency: 0.48,
      evaporationTendency: 0.44,
      snowPermission: Math.abs(point.lat) > 0.72 ? 0.62 : 0.12,
      glacierPermission: Math.abs(point.lat) > 0.82 ? 0.72 : 0.10,
      oceanCycleInfluence: !topology.isAboveWaterLandFootprint ? 0.74 : 0.24,
      hydrationConductionIndex: 0.52,
      breathableEnvelopeIndex: 0.96,
      cleanAtmosphereIndex: 0.96,
      visualPassClaimed: false
    });
  }
}

function oceanClassFor(depth, shelf, coastal, trench) {
  if (trench > 0.56 || depth > 0.82) return "trench_water";
  if (depth > 0.62) return "deep_ocean_water";
  if (shelf > 0.34) return "shelf_water";
  if (coastal > 0.34) return "coastal_water";
  return "ocean_water";
}

function deriveHydration(point, topology, terrain, tectonics, climate, options) {
  const land = Boolean(topology.isAboveWaterLandFootprint);
  const topologyLand = Boolean(topology.topologyLandFootprint);
  const ice = Boolean(topology.isPolarIceFootprint);
  const oceanVoid = !topologyLand && !ice;

  const climateBoost = clamp(
    Number(climate.hydrationConductionIndex) ||
      Number(climate.rainfallTendency) ||
      0.42,
    0,
    1
  );

  const coastal = clamp(topology.shorelinePressure || topology.beachWaterContactIndex || 0, 0, 1);
  const shelf = clamp(topology.shelfDepthIndex || topology.reefShelfPermission || 0, 0, 1);
  const depth = clamp(topology.oceanDepthIndex || topology.bathymetryBlueprintIndex || 0, 0, 1);
  const trench = clamp(topology.trenchDepthIndex || depth * 0.24, 0, 1);

  const rainfallBias = clamp(Number(climate.rainfallTendency) || 0, 0, 1);
  const snowBias = clamp(Number(climate.snowPermission) || 0, 0, 1);
  const glacierBias = clamp(Number(climate.glacierPermission) || 0, 0, 1);
  const oceanCycleBias = clamp(Number(climate.oceanCycleInfluence) || 0, 0, 1);
  const evaporationBias = clamp(Number(climate.evaporationTendency) || 0, 0, 1);

  const climateWeight = options.climateHydrationWeight;

  const river = land ? clamp(terrain.riverbedPressure * options.hydrationStrength + rainfallBias * climateWeight * 0.24, 0, 1) : 0;
  const stream = land ? clamp(terrain.streamPressure * options.hydrationStrength + rainfallBias * climateWeight * 0.16, 0, 1) : 0;
  const lake = land ? clamp(terrain.lakeBasinPressure * options.hydrationStrength + rainfallBias * climateWeight * 0.20 - evaporationBias * 0.08, 0, 1) : 0;
  const glacier = ice ? clamp(0.68 + glacierBias * 0.28, 0, 1) : clamp(terrain.glacierSeatPressure * options.hydrationStrength + glacierBias * 0.28, 0, 1);
  const snowpack = ice ? clamp(0.62 + snowBias * 0.30, 0, 1) : clamp(terrain.snowpackSourcePressure * 0.76 + snowBias * 0.24, 0, 1);
  const floodplain = land ? clamp(terrain.floodplainPressure * 0.78 + rainfallBias * 0.10, 0, 1) : 0;
  const delta = land ? clamp(terrain.deltaReceiverPressure * 0.82 + coastal * rainfallBias * 0.12, 0, 1) : 0;
  const spring = land ? clamp(tectonics.crustalStressIndex * terrain.valleyChannelPressure * 0.38 + climateBoost * 0.08, 0, 1) : 0;
  const subterranean = topologyLand ? clamp(topology.subterraneanDepthIndex * 0.58 + tectonics.crustalStressIndex * 0.18 + rainfallBias * 0.08, 0, 1) : clamp(depth * 0.22, 0, 1);

  const oceanClass = oceanClassFor(depth, shelf, coastal + oceanCycleBias * 0.18, trench);

  const waterClass = ice
    ? "glacier_mass"
    : oceanVoid
      ? oceanClass
      : lake > 0.52
        ? "lake_fill"
        : river > 0.46
          ? "river_flow"
          : stream > 0.42
            ? "stream_flow"
            : floodplain > 0.40
              ? "floodplain_wetland"
              : delta > 0.34
                ? "delta_wetland"
                : spring > 0.28
                  ? "spring_seep"
                  : "dry_land";

  const isOceanWater =
    waterClass === "ocean_water" ||
    waterClass === "coastal_water" ||
    waterClass === "shelf_water" ||
    waterClass === "deep_ocean_water" ||
    waterClass === "trench_water";

  const surfaceWaterIndex = clamp(
    (isOceanWater ? 0.60 + depth * 0.18 + shelf * 0.10 + coastal * 0.12 + oceanCycleBias * 0.10 : 0) +
      river * 0.42 +
      stream * 0.26 +
      lake * 0.52 +
      glacier * 0.54 +
      floodplain * 0.22 +
      delta * 0.20,
    0,
    1
  );

  const coastalTurquoiseIndex = oceanVoid ? clamp(coastal * 0.66 + shelf * 0.30 + oceanCycleBias * 0.18, 0, 1) : 0;
  const visibleWaterDepthIndex = oceanVoid ? clamp(depth * 0.74 + trench * 0.24, 0, 1) : 0;

  const hydrationColorInfluence = isOceanWater
    ? Object.freeze({
        r: Math.round(mix(10, 44, coastalTurquoiseIndex)),
        g: Math.round(mix(68, 162, coastalTurquoiseIndex)),
        b: Math.round(mix(132, 216, coastalTurquoiseIndex)),
        a: clamp(0.62 + surfaceWaterIndex * 0.30, 0, 0.96)
      })
    : waterClass === "lake_fill"
      ? Object.freeze({ r: 36, g: 124, b: 184, a: clamp(0.28 + lake * 0.48, 0, 0.84) })
      : waterClass === "river_flow" || waterClass === "stream_flow"
        ? Object.freeze({ r: 58, g: 156, b: 214, a: clamp(0.18 + river * 0.40 + stream * 0.28, 0, 0.72) })
        : waterClass === "glacier_mass"
          ? Object.freeze({ r: 224, g: 242, b: 250, a: clamp(0.38 + glacier * 0.46, 0, 0.92) })
          : null;

  return Object.freeze({
    receipt: CONTRACTS.hydrationParent,
    oceansReceipt: CONTRACTS.oceansChild,
    climateReceipt: climate.receipt || CONTRACTS.climateInvariant,
    climateConduitActive: true,
    climateConditionedHydration: true,

    waterClass,
    visualHydrationClass: waterClass,

    isHydrated: waterClass !== "dry_land",
    isOceanWater,
    isCoastalWater: waterClass === "coastal_water",
    isShelfWater: waterClass === "shelf_water",
    isDeepOcean: waterClass === "deep_ocean_water",
    isTrenchWater: waterClass === "trench_water",
    isRiver: waterClass === "river_flow",
    isStream: waterClass === "stream_flow",
    isLake: waterClass === "lake_fill",
    isGlacier: waterClass === "glacier_mass",
    isSnowpack: snowpack > 0.44,
    isFloodplain: waterClass === "floodplain_wetland",
    isDelta: waterClass === "delta_wetland",
    isSpring: waterClass === "spring_seep",
    isSubterraneanWater: subterranean > 0.34,

    oceanActive: isOceanWater,
    oceanClass: isOceanWater ? waterClass : "not_ocean",
    oceanDepthIndex: oceanVoid ? depth : 0,
    visibleWaterDepthIndex,
    waterVisibilityIndex: isOceanWater ? clamp(0.58 + visibleWaterDepthIndex * 0.36, 0, 1) : 0,
    coastalTurquoiseIndex,
    coastalShelfBlueIndex: oceanVoid ? clamp(shelf * 0.70 + coastal * 0.24 + oceanCycleBias * 0.12, 0, 1) : 0,
    shelfWaterIndex: oceanVoid ? shelf : 0,
    openOceanIndex: oceanVoid ? clamp(1 - coastal - shelf * 0.34, 0, 1) : 0,
    deepOceanIndex: oceanVoid ? clamp(depth, 0, 1) : 0,
    trenchWaterIndex: oceanVoid ? trench : 0,

    bathymetryHydrationIndex: oceanVoid ? clamp(topology.bathymetryBlueprintIndex || depth, 0, 1) : 0,
    trenchHydrationIndex: oceanVoid ? trench : 0,
    shelfPressure: oceanVoid ? shelf : 0,
    coastalWaterPressure: oceanVoid ? coastal : 0,

    beachOutlinePressure: clamp(topology.beachOutlinePressure, 0, 1),
    beachContactRimIndex: clamp(topology.beachWaterContactIndex, 0, 1),
    beachRimStillVisible: Boolean(topology.isBeach),
    sandCoveredByHydration: false,

    exposedLandAfterSeaLevel: land,
    landStillVisibleAfterHydration: land,
    exposedLandVisibilityIndex: land ? clamp(0.62 + terrain.normalizedElevation * 0.28, 0, 1) : 0,
    exposedLandClass: land
      ? topology.isBeach
        ? "beach_outline_land_preserved_by_runtime"
        : "terrain_land_preserved_by_runtime"
      : "not_exposed_land",

    surfaceWaterIndex,
    hydrationActivationIndex: clamp(surfaceWaterIndex + subterranean * 0.08 + climateBoost * 0.10, 0, 1),

    riverFlowPressure: river,
    streamFlowPressure: stream,
    lakeFillPressure: lake,
    glacierMassPressure: glacier,
    snowpackPressure: snowpack,
    floodplainWetness: floodplain,
    deltaWetness: delta,
    springSeepPressure: spring,
    subterraneanWaterPressure: subterranean,

    climateRainfallTendency: rainfallBias,
    climateEvaporationTendency: evaporationBias,
    climateSnowPermission: snowBias,
    climateGlacierPermission: glacierBias,
    climateOceanCycleInfluence: oceanCycleBias,
    climateHydrationConductionIndex: climateBoost,

    hydrationColorInfluence,

    ownsHydration: true,
    ownsClimate: false,
    ownsOceansChild: false,
    ownsTopology: false,
    ownsTerrain: false,
    ownsLandFootprint: false,
    visualPassClaimed: false
  });
}

function surfaceClassFor(topology, terrain, hydration) {
  if (topology.isPolarIceFootprint || hydration.isGlacier) return "glacier_ice_snowpack_surface";

  if (topology.isAboveWaterLandFootprint) {
    if (hydration.isLake) return "lake_water_on_land_surface";
    if (hydration.isRiver) return "river_water_on_land_surface";
    if (hydration.isStream) return "stream_water_on_land_surface";
    if (hydration.isFloodplain) return "floodplain_wetland_surface";
    if (hydration.isDelta) return "delta_wetland_surface";
    if (hydration.isSpring) return "spring_seep_land_surface";
    if (topology.isBeach) return "beach_outline_land_surface";
    if (terrain.ridge > 0.52 || terrain.mountainPressure > 0.52) return "mountain_relief_land_surface";
    if (terrain.canyonPressure > 0.50) return "canyon_cut_land_surface";
    if (terrain.cliffPressure > 0.50) return "cliff_rock_land_surface";
    return "inland_terrain_land_surface";
  }

  if (hydration.isTrenchWater) return "trench_ocean_water_surface";
  if (hydration.isDeepOcean) return "deep_ocean_water_surface";
  if (hydration.isShelfWater) return "shelf_water_surface";
  if (hydration.isCoastalWater) return "coastal_turquoise_water_surface";
  if (hydration.isOceanWater) return "ocean_water_surface";

  return "open_ocean_water_surface";
}

function composeSample(point, topologyField, options) {
  const topology = getTopologySampleFromField(topologyField, point.u, point.v);
  const tectonics = deriveTectonicPressure(point, topology);
  const terrain = deriveTerrain(point, topology, tectonics, options);
  const climate = safeClimateSample(point, topology, terrain);
  const hydration = deriveHydration(point, topology, terrain, tectonics, climate, options);

  const landVisibleToRoute = Boolean(topology.isAboveWaterLandFootprint);
  const topologyLand = Boolean(topology.topologyLandFootprint);
  const ice = Boolean(topology.isPolarIceFootprint);
  const waterVisibleToRoute = Boolean(
    hydration.isOceanWater ||
      hydration.isRiver ||
      hydration.isStream ||
      hydration.isLake ||
      hydration.isGlacier ||
      !landVisibleToRoute
  );

  const visualSurfaceClass = surfaceClassFor(topology, terrain, hydration);

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

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    physicalGenealogy: RUNTIME_LAW.physicalGenealogy,
    environmentalConduit: RUNTIME_LAW.environmentalConduit,
    runtimeChain: RUNTIME_LAW.fullChain,

    topologyReceipt: topology.receipt,
    terrainReceipt: terrain.receipt,
    climateReceipt: climate.receipt || CONTRACTS.climateInvariant,
    hydrationReceipt: hydration.receipt,
    oceansReceipt: hydration.oceansReceipt,

    earthEquivalentLandRatioAligned: true,
    targetLandRatio: TARGET_LAND_RATIO,
    targetLandRatioMin: TARGET_MIN,
    targetLandRatioMax: TARGET_MAX,

    climateActive: true,
    climateInvariant: true,
    climateConducesHydration: true,
    climateVisible: false,
    climateDoesNotRender: true,
    climateConditionedHydration: true,

    temperatureIndex: climate.temperatureIndex,
    temperatureBand: climate.temperatureBand,
    pressureIndex: climate.pressureIndex,
    pressureBand: climate.pressureBand,
    windCorridorIndex: climate.windCorridorIndex,
    windBand: climate.windBand,
    rainfallTendency: climate.rainfallTendency,
    rainfallBand: climate.rainfallBand,
    evaporationTendency: climate.evaporationTendency,
    snowPermission: climate.snowPermission,
    glacierPermission: climate.glacierPermission,
    oceanCycleInfluence: climate.oceanCycleInfluence,
    breathableEnvelopeIndex: climate.breathableEnvelopeIndex,
    cleanAtmosphereIndex: climate.cleanAtmosphereIndex,
    hydrationConductionIndex: climate.hydrationConductionIndex,

    visualSurfaceClass,
    visualSurfaceAuthority: "runtime",
    routeShouldPaintFromVisualSurfaceClass: true,

    isLandFootprint: landVisibleToRoute,
    isAboveWaterLandFootprint: landVisibleToRoute,
    isLand: landVisibleToRoute,
    land: landVisibleToRoute,
    isWater: waterVisibleToRoute,
    isIce: ice,

    topologyLandFootprint: topologyLand,
    topologyLandPreserved: topologyLand,
    landVisibleToRoute,
    waterVisibleToRoute,
    isVoidFootprint: !topologyLand && !ice,
    topologyVoidFootprint: !topologyLand && !ice,
    isWaterFootprint: !topologyLand && !ice,

    isBeach: Boolean(topology.isBeach && landVisibleToRoute),
    isSand: Boolean(topology.isSand && landVisibleToRoute),
    isRock: Boolean(topology.isRock && landVisibleToRoute),
    isShelf: Boolean(topology.isShelf),
    isCoastline: Boolean(topology.isCoastline),
    isIslandFootprint: Boolean(topology.isIslandFootprint),
    isConnectedLandSystem: Boolean(topology.isConnectedLandSystem),
    isSmallContinentFootprint: Boolean(topology.isSmallContinentFootprint),

    topologySurfaceClass: topology.topologySurfaceClass,
    topologySurfaceClassId: topology.surfaceClassId,
    landBodyId: topology.landBodyId,
    landBodyKey: topology.landBodyKey,
    landBodyName: topology.landBodyName,

    crustalStressIndex: tectonics.crustalStressIndex,
    mountainChainPermission: tectonics.mountainChainPermission,
    canyonPermission: tectonics.canyonPermission,
    cliffPermission: tectonics.cliffPermission,
    upliftPermission: tectonics.upliftPermission,
    terrainPressureHandoff: tectonics.terrainPressureHandoff,

    diamondPressureIndex: topology.diamondPressureIndex || tectonics.diamondPressureIndex,
    opalSeamIndex: topology.opalSeamIndex || tectonics.opalSeamIndex,
    graniteCratonIndex: topology.graniteCratonIndex || tectonics.graniteCratonIndex,
    slateFoldBeltIndex: topology.slateFoldBeltIndex || tectonics.slateFoldBeltIndex,
    exposedMineralHardnessIndex: topology.exposedMineralHardnessIndex || tectonics.exposedMineralHardnessIndex,

    seaLevelThreshold: topology.seaLevelThreshold,
    calibratedSeaLevelThreshold: topology.calibratedSeaLevelThreshold,
    seaLevelBoundary: topology.seaLevelBoundary,
    seaLevelDistance: topology.seaLevelDistance,
    approximateEarthExposedLandRatio: topology.approximateEarthExposedLandRatio,

    oceanDepthIndex: topology.isAboveWaterLandFootprint ? 0 : hydration.oceanDepthIndex,
    bathymetryBlueprintIndex: topology.bathymetryBlueprintIndex,
    bathymetryHydrationIndex: hydration.bathymetryHydrationIndex,
    trenchDepthIndex: topology.trenchDepthIndex,
    trenchHydrationIndex: hydration.trenchHydrationIndex,
    shelfDepthIndex: topology.shelfDepthIndex,
    shelfPressure: hydration.shelfPressure,
    basinDepthIndex: topology.basinDepthIndex,
    depthClassKey: topology.depthClassKey,

    subterraneanDepthIndex: topology.subterraneanDepthIndex,
    foundationDensityIndex: topology.foundationDensityIndex,
    rockMassBoundaryIndex: topology.rockMassBoundaryIndex,

    shorelinePressure: topology.shorelinePressure,
    beachPressure: topology.beachPressure,
    sandPressure: topology.sandPressure,
    rockPressure: topology.rockPressure,
    coastalCliffPressure: topology.coastalCliffPressure,
    seaLevelErosionPressure: topology.seaLevelErosionPressure,
    cliffBaseCut: topology.cliffBaseCut,
    coastlineIrregularityIndex: topology.coastlineIrregularityIndex,

    beachType: topology.beachType,
    blackSandPressure: topology.blackSandPressure,
    whiteSandPressure: topology.whiteSandPressure,
    opalSoftnessIndex: topology.opalSoftnessIndex,
    diamondDarkSandIndex: topology.diamondDarkSandIndex,
    beachCloudSoftnessIndex: topology.beachCloudSoftnessIndex,
    beachOutlinePressure: topology.beachOutlinePressure,
    beachWaterContactIndex: topology.beachWaterContactIndex,

    terrainRisePermission: topology.terrainRisePermission,
    terrainBlockPermission: topology.terrainBlockPermission,
    terrainAllowedByTopology: topologyLand,
    terrainMustNotExpandLandArea: true,

    normalizedElevation: terrain.normalizedElevation,
    elevationMeters: terrain.elevationMeters,
    ridge: terrain.ridge,
    mountainPressure: terrain.mountainPressure,
    basin: terrain.basin,
    slope: terrain.slope,
    canyonPressure: terrain.canyonPressure,
    cliffPressure: terrain.cliffPressure,
    riverIncisionPressure: terrain.riverIncisionPressure,
    valleyChannelPressure: terrain.valleyChannelPressure,
    riverbedPressure: terrain.riverbedPressure,
    streamPressure: terrain.streamPressure,
    lakeBasinPressure: terrain.lakeBasinPressure,
    glacierSeatPressure: terrain.glacierSeatPressure,
    snowpackSourcePressure: terrain.snowpackSourcePressure,
    floodplainPressure: terrain.floodplainPressure,
    deltaReceiverPressure: terrain.deltaReceiverPressure,
    hydrologyReadinessIndex: terrain.hydrologyReadinessIndex,

    waterClass: hydration.waterClass,
    visualHydrationClass: hydration.visualHydrationClass,

    isHydrated: hydration.isHydrated,
    isOceanWater: hydration.isOceanWater,
    isCoastalWater: hydration.isCoastalWater,
    isShelfWater: hydration.isShelfWater,
    isDeepOcean: hydration.isDeepOcean,
    isTrenchWater: hydration.isTrenchWater,
    isRiver: hydration.isRiver,
    isStream: hydration.isStream,
    isLake: hydration.isLake,
    isGlacier: hydration.isGlacier,
    isSnowpack: hydration.isSnowpack,
    isFloodplain: hydration.isFloodplain,
    isDelta: hydration.isDelta,
    isSpring: hydration.isSpring,
    isSubterraneanWater: hydration.isSubterraneanWater,

    oceanClass: hydration.oceanClass,
    oceanActive: hydration.oceanActive,
    oceanFromHydrationParent: true,
    oceansChildActive: true,
    oceanDoesNotOwnLand: true,
    landPreservedByTopology: true,

    visibleWaterDepthClass: hydration.oceanClass,
    visibleWaterDepthIndex: hydration.visibleWaterDepthIndex,
    waterVisibilityIndex: hydration.waterVisibilityIndex,
    coastalTurquoiseIndex: hydration.coastalTurquoiseIndex,
    coastalShelfBlueIndex: hydration.coastalShelfBlueIndex,
    shelfWaterIndex: hydration.shelfWaterIndex,
    openOceanIndex: hydration.openOceanIndex,
    deepOceanIndex: hydration.deepOceanIndex,
    trenchWaterIndex: hydration.trenchWaterIndex,
    coastalWaterPressure: hydration.coastalWaterPressure,

    beachContactRimIndex: hydration.beachContactRimIndex,
    beachRimStillVisible: hydration.beachRimStillVisible,
    sandCoveredByHydration: hydration.sandCoveredByHydration,

    exposedLandAfterSeaLevel: hydration.exposedLandAfterSeaLevel,
    landStillVisibleAfterHydration: hydration.landStillVisibleAfterHydration,
    exposedLandVisibilityIndex: hydration.exposedLandVisibilityIndex,
    exposedLandClass: hydration.exposedLandClass,

    surfaceWaterIndex: hydration.surfaceWaterIndex,
    hydrationActivationIndex: hydration.hydrationActivationIndex,

    riverFlowPressure: hydration.riverFlowPressure,
    streamFlowPressure: hydration.streamFlowPressure,
    lakeFillPressure: hydration.lakeFillPressure,
    glacierMassPressure: hydration.glacierMassPressure,
    snowpackPressure: hydration.snowpackPressure,
    floodplainWetness: hydration.floodplainWetness,
    deltaWetness: hydration.deltaWetness,
    springSeepPressure: hydration.springSeepPressure,
    subterraneanWaterPressure: hydration.subterraneanWaterPressure,

    climateRainfallTendency: hydration.climateRainfallTendency,
    climateEvaporationTendency: hydration.climateEvaporationTendency,
    climateSnowPermission: hydration.climateSnowPermission,
    climateGlacierPermission: hydration.climateGlacierPermission,
    climateOceanCycleInfluence: hydration.climateOceanCycleInfluence,
    climateHydrationConductionIndex: hydration.climateHydrationConductionIndex,

    hydrationColorInfluence: hydration.hydrationColorInfluence,

    runtimeCacheActive: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,

    fallbackFlags: Object.freeze({
      topologyFallbackUsed: false,
      terrainFallbackUsed: false,
      climateFallbackUsed: Boolean(climate.climateFallbackUsed),
      hydrationFallbackUsed: false
    }),
    fallbackUsed: Boolean(climate.climateFallbackUsed),

    ownsRuntimeSampling: true,
    ownsChainComposition: true,
    ownsPerformanceCache: true,
    ownsRouteDataHandoff: true,
    ownsVisualSurfaceClassification: true,

    ownsTopology: false,
    ownsTerrain: false,
    ownsClimate: false,
    ownsHydration: false,
    ownsOceansChild: false,
    ownsLandFootprint: false,
    ownsWaterFill: false,
    ownsRouteRendering: false,

    ecology: false,
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

function buildRuntimeField(width, height, options) {
  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);
  const runtimeOptions = getRuntimeOptions({ ...options, fieldWidth: w, fieldHeight: h });

  const topologyField = buildTopologyField(w, h, {
    targetLandRatio: runtimeOptions.targetLandRatio,
    coastalWidth: runtimeOptions.coastalWidth,
    shelfWidth: runtimeOptions.shelfWidth
  });

  const climateField = buildClimateField(w, h, {
    climateContext: {
      cleanAtmosphereIndex: 0.96,
      oceanCycleStrength: 0.88
    }
  });

  const samples = new Array(w * h);
  const visualSurfaceClasses = new Set();

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
  let climateSamples = 0;
  let climateConduitSamples = 0;
  let rainfallSamples = 0;
  let glacierClimateSamples = 0;
  let oceanCycleClimateSamples = 0;

  let maxTurquoise = 0;
  let maxDepth = 0;
  let maxElevation = -1;
  let maxHydrationActivationIndex = 0;
  let maxSurfaceWaterIndex = 0;
  let maxHydrationConduction = 0;
  let maxRainfall = 0;
  let maxEvaporation = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const point = normalizeUV(u, v);
      const sample = composeSample(point, topologyField, runtimeOptions);

      samples[y * w + x] = sample;
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
      if (sample.fallbackUsed) fallbackSamples += 1;

      if (sample.climateActive) climateSamples += 1;
      if (sample.climateConducesHydration) climateConduitSamples += 1;
      if (sample.rainfallTendency > 0.44) rainfallSamples += 1;
      if (sample.glacierPermission > 0.44) glacierClimateSamples += 1;
      if (sample.oceanCycleInfluence > 0.44) oceanCycleClimateSamples += 1;

      maxTurquoise = Math.max(maxTurquoise, sample.coastalTurquoiseIndex);
      maxDepth = Math.max(maxDepth, sample.visibleWaterDepthIndex);
      maxElevation = Math.max(maxElevation, sample.normalizedElevation);
      maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, sample.hydrationActivationIndex);
      maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, sample.surfaceWaterIndex);
      maxHydrationConduction = Math.max(maxHydrationConduction, sample.hydrationConductionIndex || 0);
      maxRainfall = Math.max(maxRainfall, sample.rainfallTendency || 0);
      maxEvaporation = Math.max(maxEvaporation, sample.evaporationTendency || 0);
    }
  }

  const total = samples.length;
  const landRatio = total ? landSamples / total : 0;
  const topologyLandRatio = total ? topologyLandSamples / total : 0;
  const waterRatio = total ? waterSamples / total : 0;
  const visibleLandRatio = total ? visibleLandSamples / total : 0;

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousReceipts: PREVIOUS_RECEIPTS,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    width: w,
    height: h,
    samples,
    topologyField,
    climateField,

    stats: Object.freeze({
      totalSamples: total,

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
      climateSamples,
      climateConduitSamples,
      rainfallSamples,
      glacierClimateSamples,
      oceanCycleClimateSamples,

      waterRatio,
      landRatio,
      topologyLandRatio,
      oceanRatio: total ? oceanSamples / total : 0,
      coastalRatio: total ? coastalSamples / total : 0,
      shelfRatio: total ? shelfSamples / total : 0,
      deepRatio: total ? deepSamples / total : 0,
      trenchRatio: total ? trenchSamples / total : 0,
      visibleLandRatio,
      beachRatio: total ? beachSamples / total : 0,
      terrainReliefRatio: total ? terrainReliefSamples / total : 0,
      hydratedRatio: total ? hydratedSamples / total : 0,
      fallbackRatio: total ? fallbackSamples / total : 0,
      climateRatio: total ? climateSamples / total : 0,
      climateConduitRatio: total ? climateConduitSamples / total : 0,

      targetLandRatio: TARGET_LAND_RATIO,
      targetLandRatioMin: TARGET_MIN,
      targetLandRatioMax: TARGET_MAX,
      landRatioTargetMet: visibleLandRatio >= TARGET_MIN && visibleLandRatio <= TARGET_MAX,
      topologyLandRatioTargetMet: topologyLandRatio >= TARGET_MIN && topologyLandRatio <= TARGET_MAX,

      maxTurquoise,
      maxDepth,
      maxElevation,
      maxHydrationActivationIndex,
      maxSurfaceWaterIndex,
      maxHydrationConduction,
      maxRainfall,
      maxEvaporation,

      calibratedSeaLevelThreshold: topologyField.calibratedSeaLevelThreshold,
      topologyStats: topologyField.stats,
      seaLevelEstimate: estimateEarthEquivalentSeaLevel(96, 48, {
        targetLandRatio: runtimeOptions.targetLandRatio
      }),

      visualSurfaceClasses: Object.freeze(Array.from(visualSurfaceClasses)),

      earthEquivalentLandRatioAligned: true,
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

      ecologyEnabled: false,
      foliageEnabled: false,
      treesEnabled: false,
      vegetationEnabled: false,
      animalsEnabled: false,
      marineLifeEnabled: false,
      constructCivilizationEnabled: false,

      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    })
  });
}

function buildRuntimeCache(options) {
  const runtimeField = buildRuntimeField(options.fieldWidth, options.fieldHeight, options);
  const topologyStatus = getTopologyStatus();
  const climateStatus = getClimateStatus();

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
    runtimeOptions: options,
    runtimeField,
    topologyStatus,
    climateStatus,

    fallbackReport: Object.freeze({
      topologyFallbackUsed: false,
      terrainFallbackUsed: false,
      climateFallbackUsed: runtimeField.stats.fallbackSamples > 0,
      hydrationFallbackUsed: false,
      runtimeFallbackUsed: false,
      fallbackSamples: runtimeField.stats.fallbackSamples,
      fallbackRatio: runtimeField.stats.fallbackRatio
    }),

    hydrationStatus: Object.freeze({
      ok: true,
      receipt: CONTRACTS.hydrationParent,
      oceansReceipt: CONTRACTS.oceansChild,
      climateConditioned: true,
      consumedByRuntime: true,
      path: AUTHORITY_PATHS.hydrationParent,
      oceansChildPath: AUTHORITY_PATHS.oceansChild
    }),

    runtimeCacheActive: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,
    createdAt: Date.now()
  });
}

function sampleFromRuntimeCache(cache, u, v) {
  return getRuntimeSampleFromField(cache.runtimeField, u, v) || composeSample(
    normalizeUV(u, v),
    cache.runtimeField.topologyField,
    cache.runtimeOptions
  );
}

function makeStatus(cache = null) {
  const fieldStats = cache && cache.runtimeField ? cache.runtimeField.stats : null;

  const fallbackReport = cache ? cache.fallbackReport : Object.freeze({
    topologyFallbackUsed: false,
    terrainFallbackUsed: false,
    climateFallbackUsed: false,
    hydrationFallbackUsed: false,
    runtimeFallbackUsed: false,
    fallbackSamples: 0,
    fallbackRatio: 0
  });

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    previousReceipts: PREVIOUS_RECEIPTS,
    status: cache ? "active" : "active-lightweight",
    id: "audralia-runtime-earth-equivalent-land-ratio-aligned",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,
    runtimeLaw: RUNTIME_LAW,

    physicalGenealogy: RUNTIME_LAW.physicalGenealogy,
    environmentalConduit: RUNTIME_LAW.environmentalConduit,
    runtimeComposition: RUNTIME_LAW.runtimeComposition,
    fullChain: RUNTIME_LAW.fullChain,

    runtimeFieldLoaded: Boolean(cache && cache.runtimeField),
    topologyLoaded: true,
    climateLoaded: true,
    hydrationLoaded: true,

    topologyStatus: cache ? cache.topologyStatus : getTopologyStatus(),
    climateStatus: cache ? cache.climateStatus : getClimateStatus(),
    hydrationStatus: cache ? cache.hydrationStatus : null,

    fallbackReport,
    runtimeFieldStats: fieldStats,

    targetLandRatio: TARGET_LAND_RATIO,
    targetLandRatioMin: TARGET_MIN,
    targetLandRatioMax: TARGET_MAX,
    earthEquivalentLandRatioAligned: true,

    consumesTopologyChild: true,
    consumesClimateInvariant: true,
    consumesHydrationParent: true,
    oceansChildConsumedThroughHydrationParent: true,

    topologyLandControlsLandPreservation: true,
    hydrationCannotEraseTopologyLand: true,
    oceansMayFillOnlyTopologyVoid: true,

    climateActive: true,
    climateInvariant: true,
    climateConducesHydration: true,
    climateVisible: false,
    climateDoesNotRender: true,
    hydrationReadsClimate: true,

    hydrationHeld: false,
    hydrationAllowedToRender: true,
    emitsVisualSurfaceClass: true,

    ownsRuntimeSampling: true,
    ownsChainComposition: true,
    ownsPerformanceCache: true,
    ownsRouteDataHandoff: true,
    ownsVisualSurfaceClassification: true,

    ownsTopology: false,
    ownsTerrain: false,
    ownsClimate: false,
    ownsHydration: false,
    ownsOceansChild: false,
    ownsLandFootprint: false,
    ownsWaterFill: false,
    ownsRouteRendering: false,

    ecologyEnabled: false,
    foliageEnabled: false,
    treesEnabled: false,
    vegetationEnabled: false,
    animalsEnabled: false,
    marineLifeEnabled: false,
    constructCivilizationEnabled: false,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function createAudraliaRuntime(options = {}) {
  const runtimeOptions = getRuntimeOptions(options);
  const cache = buildRuntimeCache(runtimeOptions);

  const runtime = Object.freeze({
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
    runtimeOptions,
    cache,

    sampleRuntimeState(u, v) {
      return sampleFromRuntimeCache(cache, u, v);
    },

    sampleAudraliaPlanetState(u, v) {
      return sampleFromRuntimeCache(cache, u, v);
    },

    getStatus() {
      return makeStatus(cache);
    }
  });

  lightweightStatus = makeStatus(cache);
  return runtime;
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
  const runtimeOptions = getRuntimeOptions({
    ...options,
    fieldWidth: options.fieldWidth || width,
    fieldHeight: options.fieldHeight || height
  });

  return buildRuntimeField(runtimeOptions.fieldWidth, runtimeOptions.fieldHeight, runtimeOptions);
}

export function getRuntimeStatus() {
  return lightweightStatus || makeStatus(null);
}

const api = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  previousReceipts: PREVIOUS_RECEIPTS,
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
