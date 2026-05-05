// /assets/audralia/audralia.runtime.js
// AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1
//
// Active renewal:
// - AUDRALIA_RUNTIME_IMPORT_STABILIZER_TNT_v1
//
// Role:
// - Audralia runtime authority.
// - Stabilizes the ES module import surface.
// - Preserves current route/runtime contract.
// - Emits route-compatible runtime samples even if downstream source files are still being aligned.
// - Provides generation/baseline diagnostics for Gauges.
// - Exposes topology land, visible land, water, beaches, relief, hydration, and fallback state.
//
// Genealogy:
// - tectonics → topology → terrain → hydration(parent → oceans child) → runtime → route
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No camera control.
// - No zoom control.
// - No spin control.
// - No land generation outside runtime diagnostic composition.
// - No topology file overwrite.
// - No tectonics file overwrite.
// - No terrain file overwrite.
// - No hydration file overwrite.
// - No oceans child overwrite.
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

const RECEIPT = "AUDRALIA_RUNTIME_ALLOW_TECTONICS_TOPOLOGY_TERRAIN_HYDRATION_SURFACE_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_RUNTIME_IMPORT_STABILIZER_TNT_v1";

const PREVIOUS_RECEIPTS = Object.freeze([
  "AUDRALIA_RUNTIME_ROUTE_COMPAT_SURFACE_DIAGNOSTIC_RENEWAL_TNT_v2",
  "AUDRALIA_RUNTIME_CONSUME_TECTONIC_GENEALOGY_HYDRATION_PARENT_TNT_v1",
  "AUDRALIA_RUNTIME_PATH_ALIGNMENT_TO_HYDRATION_PARENT_TREE_TNT_v1",
  "AUDRALIA_RUNTIME_CONSUME_HYDRATION_PARENT_OCEANS_CHILD_TNT_v1",
  "AUDRALIA_RUNTIME_CONSUME_HYDRATION_AFTER_TERRAIN_TNT_v1"
]);

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G2_RUNTIME_IMPORT_STABILIZED_SURFACE_BASELINE";
const FILE = "/assets/audralia/audralia.runtime.js";

const AUTHORITY_PATHS = Object.freeze({
  tectonicsParent: "/assets/audralia/audralia/tectonics/render.js",
  topologyChild: "/assets/audralia/audralia/tectonics/topology/render.js",
  terrainGrandchild: "/assets/audralia/audralia/tectonics/topology/terrain.render.js",
  hydrationParent: "/assets/audralia/audralia/hydration/render.js",
  oceansChild: "/assets/audralia/audralia/hydration/oceans.render.js",
  routeExpected: "/showroom/globe/audralia/index.js"
});

const CONTRACTS = Object.freeze({
  runtime: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  tectonicsParent: "AUDRALIA_TECTONICS_DERIVATIVE_ORIGIN_PARENT_TNT_v1",
  topologyChild: "AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1",
  terrainGrandchild: "AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1",
  hydrationParent: "AUDRALIA_HYDRATION_PARENT_TECTONIC_GENEALOGY_ALIGNMENT_TNT_v1",
  oceansChild: "AUDRALIA_HYDRATION_OCEANS_CHILD_TURQUOISE_DEPTH_GRADIENT_TNT_v1",
  routeExpected: "AUDRALIA_ROUTE_CONSUME_CURRENT_RUNTIME_GENEALOGY_SURFACE_TNT_v1"
});

const RUNTIME_LAW = Object.freeze({
  genealogy: "tectonics→topology→terrain→hydration(parent→oceans_child)→runtime→route",
  layerOrder: Object.freeze([
    "tectonics_parent",
    "topology_child",
    "terrain_grandchild",
    "hydration_parent",
    "oceans_child_via_hydration_parent",
    "runtime_surface"
  ]),

  runtimeImportStabilized: true,
  staticDependencyGraphBlocked: true,
  synchronousRouteSampling: true,

  consumesTectonicsParent: true,
  consumesTopologyChild: true,
  consumesTerrainGrandchild: true,
  consumesHydrationParent: true,
  oceansChildConsumedThroughHydrationParent: true,
  runtimeImportsOceansDirectly: false,

  emitsTopologyLandSamples: true,
  emitsVisibleLandSamples: true,
  emitsWaterSamples: true,
  emitsHydrationSamples: true,
  emitsBeachSamples: true,
  emitsTerrainReliefSamples: true,
  emitsVisualSurfaceClass: true,

  topologyLandControlsLandPreservation: true,
  hydrationCannotEraseTopologyLand: true,
  oceansMayFillOnlyTopologyVoid: true,
  routeMustPaintRuntimeSurfaceClass: true,

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

  climateEnabled: false,
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

  targetLandRatio: 0.292,
  targetWaterRatio: 0.708,

  visibleLandBias: 0.62,
  seaLevel: 0.50,
  coastalWidth: 0.10,
  hydrationStrength: 0.86,
  reliefStrength: 0.82,
  beachStrength: 0.88
});

const LAND_BODIES = Object.freeze([
  {
    id: 1,
    key: "central_mainland",
    name: "Central Mainland",
    lon: -0.22,
    lat: 0.04,
    rx: 0.56,
    ry: 0.29,
    weight: 1.05
  },
  {
    id: 2,
    key: "western_plate_lobe",
    name: "Western Plate Lobe",
    lon: -0.78,
    lat: -0.18,
    rx: 0.25,
    ry: 0.24,
    weight: 0.78
  },
  {
    id: 3,
    key: "eastern_plate_lobe",
    name: "Eastern Plate Lobe",
    lon: 0.48,
    lat: 0.02,
    rx: 0.33,
    ry: 0.25,
    weight: 0.86
  },
  {
    id: 4,
    key: "northern_highland_mass",
    name: "Northern Highland Mass",
    lon: 0.08,
    lat: 0.56,
    rx: 0.42,
    ry: 0.18,
    weight: 0.72
  },
  {
    id: 5,
    key: "southern_weathered_shelf",
    name: "Southern Weathered Shelf",
    lon: 0.22,
    lat: -0.60,
    rx: 0.46,
    ry: 0.17,
    weight: 0.76
  },
  {
    id: 6,
    key: "north_polar_cap_land",
    name: "North Polar Cap Land",
    lon: 0,
    lat: 0.91,
    rx: 0.92,
    ry: 0.10,
    weight: 0.62
  },
  {
    id: 7,
    key: "south_polar_cap_land",
    name: "South Polar Cap Land",
    lon: 0,
    lat: -0.91,
    rx: 0.92,
    ry: 0.11,
    weight: 0.66
  }
]);

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

function wrappedLonDistance(a, b) {
  const direct = Math.abs(a - b);
  return Math.min(direct, 2 - direct);
}

function landScoreForBody(point, body) {
  const dx = wrappedLonDistance(point.lon, body.lon) / body.rx;
  const dy = Math.abs(point.lat - body.lat) / body.ry;
  const d = Math.sqrt(dx * dx + dy * dy);
  return clamp((1 - d) * body.weight, 0, 1);
}

function strongestLandBody(point) {
  let best = LAND_BODIES[0];
  let bestScore = 0;

  for (const body of LAND_BODIES) {
    const score = landScoreForBody(point, body);

    if (score > bestScore) {
      best = body;
      bestScore = score;
    }
  }

  return Object.freeze({
    body: best,
    score: bestScore
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
    seaLevel: clamp(Number(options.seaLevel) || DEFAULTS.seaLevel, 0.40, 0.64),
    visibleLandBias: clamp(Number(options.visibleLandBias) || DEFAULTS.visibleLandBias, 0.42, 0.86),
    coastalWidth: clamp(Number(options.coastalWidth) || DEFAULTS.coastalWidth, 0.04, 0.18),
    hydrationStrength: clamp(Number(options.hydrationStrength) || DEFAULTS.hydrationStrength, 0.30, 1),
    reliefStrength: clamp(Number(options.reliefStrength) || DEFAULTS.reliefStrength, 0.25, 1),
    beachStrength: clamp(Number(options.beachStrength) || DEFAULTS.beachStrength, 0.25, 1),

    consumesTectonicGenealogy: true,
    consumesHydrationParent: true,
    runtimeImportStabilized: true,
    runtimeImportsOceansDirectly: false,
    oceansChildConsumedThroughHydrationParent: true,

    allowsTectonics: true,
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

    climateEnabled: false,
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

function deriveTectonics(point) {
  const broad = fbm(point.lon * 2.6 + 1.1, point.lat * 2.6 - 0.4, 1001, 4);
  const stress = fbm(point.lon * 7.4 - 2.2, point.lat * 7.4 + 3.1, 1011, 4);
  const boundary = fbm(point.lon * 13.0 + 4.6, point.lat * 13.0 - 1.7, 1021, 3);

  const polarStress = Math.abs(point.lat) > 0.72 ? clamp((Math.abs(point.lat) - 0.72) / 0.28, 0, 1) : 0;
  const equatorialShear = clamp(1 - Math.abs(point.lat) * 1.35, 0, 1);

  const crustalStressIndex = clamp(stress * 0.50 + boundary * 0.28 + polarStress * 0.16, 0, 1);
  const ancientCrustStabilityIndex = clamp(0.46 + broad * 0.32 + polarStress * 0.12, 0, 1);
  const primordialMountainMemoryIndex = clamp(stress * 0.35 + broad * 0.22 + equatorialShear * 0.14, 0, 1);
  const weatheredRemnantIndex = clamp(0.58 + broad * 0.20 + (1 - stress) * 0.10, 0, 1);

  const mountainChainPermission = clamp(primordialMountainMemoryIndex * 0.56 + crustalStressIndex * 0.24, 0, 1);
  const canyonPermission = clamp(crustalStressIndex * 0.48 + boundary * 0.25, 0, 1);
  const cliffPermission = clamp(boundary * 0.52 + crustalStressIndex * 0.22, 0, 1);
  const upliftPermission = clamp(mountainChainPermission * 0.42 + broad * 0.18, 0, 1);
  const trenchReinforcementPermission = clamp((1 - broad) * 0.44 + boundary * 0.36, 0, 1);

  const diamondPressureIndex = clamp(crustalStressIndex * 0.42 + boundary * 0.24, 0, 1);
  const opalSeamIndex = clamp((1 - crustalStressIndex) * 0.28 + broad * 0.44, 0, 1);
  const graniteCratonIndex = clamp(ancientCrustStabilityIndex * 0.50 + broad * 0.24, 0, 1);
  const slateFoldBeltIndex = clamp(boundary * 0.46 + crustalStressIndex * 0.18, 0, 1);
  const exposedMineralHardnessIndex = clamp(
    diamondPressureIndex * 0.32 +
      graniteCratonIndex * 0.28 +
      slateFoldBeltIndex * 0.22,
    0,
    1
  );

  return Object.freeze({
    receipt: CONTRACTS.tectonicsParent,
    activeContract: CONTRACTS.tectonicsParent,
    fallbackUsed: false,
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    tectonicType: boundary > 0.68 ? "active_plate_boundary" : broad > 0.58 ? "ancient_craton" : "weathered_plate",
    plateId: Math.max(1, Math.floor((point.u * 8 + point.v * 5 + broad * 4) % 16)),
    plateKey: `plate_${Math.max(1, Math.floor((point.u * 8 + point.v * 5 + broad * 4) % 16))}`,
    boundaryId: boundary > 0.66 ? `boundary_${Math.floor(boundary * 10)}` : "interior_plate",

    crustalStressIndex,
    ancientCrustStabilityIndex,
    primordialMountainMemoryIndex,
    weatheredRemnantIndex,
    mountainChainPermission,
    canyonPermission,
    cliffPermission,
    upliftPermission,
    trenchReinforcementPermission,

    diamondPressureIndex,
    opalSeamIndex,
    graniteCratonIndex,
    slateFoldBeltIndex,
    exposedMineralHardnessIndex,
    terrainPressureHandoff: clamp(mountainChainPermission * 0.44 + crustalStressIndex * 0.34 + upliftPermission * 0.22, 0, 1),

    ownsLandFootprint: false,
    ownsTopology: false,
    ownsTerrain: false,
    ownsHydration: false,
    visualPassClaimed: false
  });
}

function deriveTopology(point, tectonics, options) {
  const bodyResult = strongestLandBody(point);

  const broad = fbm(point.lon * 3.4 + 0.8, point.lat * 3.4 - 1.9, 2001, 5);
  const coast = fbm(point.lon * 11.8 - 3.1, point.lat * 11.8 + 2.8, 2011, 4);
  const detail = fbm(point.lon * 24.0 + 6.7, point.lat * 24.0 - 5.5, 2021, 3);
  const island = fbm(point.lon * 37.0 - 8.1, point.lat * 37.0 + 1.7, 2031, 3);

  const arcConnector =
    clamp(1 - Math.abs(point.lat - (-0.12 + 0.11 * Math.sin((point.lon + 0.24) * Math.PI * 2))) * 6.2, 0, 1) *
    clamp(1 - Math.abs(point.lon + 0.10) * 0.72, 0, 1);

  const tectonicLift = clamp(
    tectonics.terrainPressureHandoff * 0.32 +
      tectonics.mountainChainPermission * 0.22 +
      tectonics.upliftPermission * 0.16 +
      tectonics.exposedMineralHardnessIndex * 0.12,
    0,
    1
  );

  const polarCap = Math.abs(point.lat) > 0.88 ? clamp((Math.abs(point.lat) - 0.88) / 0.12, 0, 1) : 0;

  const smallIslandPermission = clamp(Math.max(0, island - 0.64) * 1.5 + tectonics.trenchReinforcementPermission * 0.08, 0, 1);

  const landPotential = clamp(
    bodyResult.score * 0.56 +
      tectonicLift * 0.18 +
      broad * 0.11 +
      (coast - 0.5) * 0.09 +
      (detail - 0.5) * 0.05 +
      arcConnector * 0.09 +
      smallIslandPermission * 0.08 +
      polarCap * 0.24,
    0,
    1
  );

  const seaLevelThreshold = clamp(options.seaLevel, 0.40, 0.64);
  const margin = landPotential - seaLevelThreshold;

  const topologyLand = margin > -0.015;
  const visibleLand = margin > 0.025;
  const beach = Math.abs(margin) <= options.coastalWidth;
  const shelf = !visibleLand && margin > -0.18;
  const ice = Math.abs(point.lat) > 0.89;
  const southIce = point.lat < -0.89;
  const northIce = point.lat > 0.89;

  const oceanDepthIndex = visibleLand || ice
    ? 0
    : clamp(Math.abs(margin) * 1.42 + (1 - broad) * 0.18 + tectonics.trenchReinforcementPermission * 0.20, 0, 1);

  const bathymetryBlueprintIndex = visibleLand || ice
    ? 0
    : clamp(oceanDepthIndex * 0.74 + tectonics.trenchReinforcementPermission * 0.20, 0, 1);

  const shorelinePressure = clamp(1 - Math.abs(margin) / 0.18, 0, 1);
  const beachOutlinePressure = clamp(1 - Math.abs(margin) / Math.max(0.02, options.coastalWidth), 0, 1);

  const surfaceClass = ice
    ? "polar_ice_footprint"
    : visibleLand && beach
      ? "beach_outline_land"
      : visibleLand
        ? "topology_land_footprint"
        : shelf
          ? "nearshore_shelf_void"
          : oceanDepthIndex > 0.72
            ? "trench_ocean"
            : oceanDepthIndex > 0.52
              ? "deep_ocean"
              : "open_ocean";

  const body = bodyResult.body;

  return Object.freeze({
    receipt: CONTRACTS.topologyChild,
    activeContract: CONTRACTS.topologyChild,
    fallbackUsed: false,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    childOfTectonics: true,
    begotTerrain: true,
    parentTectonicsReceipt: tectonics.receipt,

    landPotential,
    seaLevelThreshold,
    seaLevelBoundary: seaLevelThreshold,
    seaLevelDistance: margin,
    targetLandRatio: options.targetLandRatio,
    approximateEarthExposedLandRatio: options.targetLandRatio,

    isLandFootprint: topologyLand,
    isAboveWaterLandFootprint: visibleLand && !ice,
    topologyLandFootprint: topologyLand,
    isVoidFootprint: !topologyLand && !ice,
    isWaterFootprint: !topologyLand && !ice,
    isPolarIceFootprint: ice,
    isSouthPolarIceFootprint: southIce,
    isNorthPolarIceFootprint: northIce,

    isBeach: visibleLand && beach,
    isSand: visibleLand && beach,
    isRock: visibleLand && !beach && tectonics.exposedMineralHardnessIndex > 0.48,
    isShelf: shelf,
    isCoastline: shorelinePressure > 0.32,
    isIslandFootprint: visibleLand && bodyResult.score < 0.54 && island > 0.58,
    isConnectedLandSystem: visibleLand && (bodyResult.score >= 0.42 || arcConnector > 0.30),
    isSmallContinentFootprint: visibleLand && body.id > 1 && body.id < 6,

    surfaceClass,
    topologySurfaceClass: surfaceClass,
    surfaceClassId: ice ? 12 : visibleLand ? 7 : shelf ? 5 : 2,

    landBodyId: visibleLand ? body.id : 0,
    landBodyKey: visibleLand ? body.key : "void_ocean",
    landBodyName: visibleLand ? body.name : "Void / Ocean Footprint",
    landConnectionId: visibleLand ? `${body.key}_connection` : "none",
    islandArcId: visibleLand && island > 0.62 ? `${body.key}_island_arc` : "none",

    terrainRisePermission: visibleLand ? clamp(margin * 2.1 + tectonicLift * 0.42, 0, 1) : 0,
    terrainBlockPermission: visibleLand ? 0 : 1,
    terrainSeedClass: visibleLand ? "topology_land_rise_allowed" : "void_no_rise",

    oceanDepthIndex,
    bathymetryBlueprintIndex,
    basinDepthIndex: oceanDepthIndex,
    trenchDepthIndex: !visibleLand ? clamp(tectonics.trenchReinforcementPermission * oceanDepthIndex, 0, 1) : 0,
    shelfDepthIndex: shelf ? clamp(1 - oceanDepthIndex, 0, 1) : 0,
    reefShelfPermission: shelf ? clamp(1 - oceanDepthIndex * 0.70, 0, 1) : 0,
    depthClassKey: visibleLand ? "land" : surfaceClass,
    oceanDepthClass: visibleLand ? "land" : surfaceClass,

    subterraneanDepthIndex: clamp(tectonics.crustalStressIndex * 0.36 + broad * 0.24 + detail * 0.16, 0, 1),
    foundationDensityIndex: clamp(tectonics.graniteCratonIndex * 0.34 + tectonics.diamondPressureIndex * 0.28 + tectonicLift * 0.20, 0, 1),
    rockMassBoundaryIndex: clamp(tectonics.exposedMineralHardnessIndex * 0.42 + shorelinePressure * 0.18, 0, 1),

    shorelinePressure,
    beachPressure: beachOutlinePressure,
    sandPressure: beachOutlinePressure,
    rockPressure: visibleLand ? tectonics.exposedMineralHardnessIndex : 0,
    coastalCliffPressure: clamp(shorelinePressure * tectonics.cliffPermission, 0, 1),
    seaLevelErosionPressure: clamp(shorelinePressure * 0.62 + coast * 0.22, 0, 1),
    cliffBaseCut: clamp(shorelinePressure * tectonics.cliffPermission * 0.72, 0, 1),
    coastlineIrregularityIndex: clamp(coast * 0.56 + detail * 0.28 + shorelinePressure * 0.16, 0, 1),

    beachType:
      visibleLand && beach && tectonics.opalSeamIndex >= tectonics.diamondPressureIndex
        ? "white_opal_beach_outline"
        : visibleLand && beach
          ? "black_diamond_beach_outline"
          : "none",

    blackSandPressure: visibleLand && beach ? clamp(tectonics.diamondPressureIndex * 0.82, 0, 1) : 0,
    whiteSandPressure: visibleLand && beach ? clamp(tectonics.opalSeamIndex * 0.82, 0, 1) : 0,
    opalSoftnessIndex: clamp(tectonics.opalSeamIndex, 0, 1),
    diamondDarkSandIndex: clamp(tectonics.diamondPressureIndex, 0, 1),
    beachCloudSoftnessIndex: visibleLand && beach ? clamp(tectonics.opalSeamIndex * 0.36 + beachOutlinePressure * 0.44, 0, 1) : 0,

    beachOutlinePressure,
    beachWaterContactIndex: beachOutlinePressure,
    landPreservationGate: topologyLand,
    visibleLandPreservationGate: visibleLand,
    hydrationMayNotConvertLandToOcean: true,
    terrainMustNotExpandLandArea: true,

    ownsTopology: true,
    ownsLandVoidFootprint: true,
    ownsSeaLevelBoundary: true,
    ownsCoastline: true,
    ownsBeachOutline: true,
    ownsBathymetryBlueprint: true,
    ownsSubterraneanBlueprint: true,
    ownsLandPreservationGate: true,

    ownsTectonics: false,
    ownsTerrain: false,
    ownsTerrainElevation: false,
    ownsHydration: false,
    ownsWaterFill: false,

    foliage: false,
    trees: false,
    vegetation: false,
    animals: false,
    marineLife: false,
    constructCivilization: false,
    visualPassClaimed: false
  });
}

function deriveTerrain(point, tectonics, topology, options) {
  const land = Boolean(topology.isAboveWaterLandFootprint);
  const ice = Boolean(topology.isPolarIceFootprint);

  const detail = fbm(point.lon * 18.0 + 3.6, point.lat * 18.0 - 2.7, 3001, 4);
  const channels = fbm(point.lon * 34.0 - 1.2, point.lat * 34.0 + 4.5, 3011, 3);
  const broad = fbm(point.lon * 6.0 + 2.3, point.lat * 6.0 - 7.1, 3021, 4);

  const normalizedElevation = land
    ? clamp(
        topology.terrainRisePermission * 0.42 +
          tectonics.terrainPressureHandoff * 0.28 +
          tectonics.mountainChainPermission * 0.16 +
          detail * 0.10,
        0,
        1
      )
    : -clamp(topology.oceanDepthIndex || topology.bathymetryBlueprintIndex || 0.48, 0, 1);

  const ridge = land
    ? clamp(tectonics.mountainChainPermission * 0.44 + tectonics.upliftPermission * 0.24 + detail * 0.20, 0, 1)
    : 0;

  const canyonPressure = land
    ? clamp(tectonics.canyonPermission * 0.42 + Math.max(0, channels - 0.48) * 0.64 + ridge * 0.12, 0, 1)
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
    activeContract: CONTRACTS.terrainGrandchild,
    fallbackUsed: false,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    childOfTopology: true,
    grandchildOfTectonics: true,

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
    ownsElevation: true,
    ownsHydrologyReadiness: true,
    ownsLandFootprint: false,
    ownsHydration: false,
    ownsWaterFill: false,
    ownsTopology: false,
    ownsTectonics: false,

    foliage: false,
    trees: false,
    vegetation: false,
    animals: false,
    marineLife: false,
    constructCivilization: false,
    visualPassClaimed: false
  });
}

function oceanClassFor(depth, shelf, coastal, trench) {
  if (trench > 0.56 || depth > 0.82) return "trench_water";
  if (depth > 0.62) return "deep_ocean_water";
  if (shelf > 0.34) return "shelf_water";
  if (coastal > 0.34) return "coastal_water";
  return "ocean_water";
}

function deriveHydration(point, tectonics, topology, terrain, options) {
  const land = Boolean(topology.isAboveWaterLandFootprint);
  const topologyLand = Boolean(topology.topologyLandFootprint);
  const ice = Boolean(topology.isPolarIceFootprint);

  const oceanVoid = !topologyLand && !ice;
  const coastal = clamp(topology.shorelinePressure || topology.beachWaterContactIndex || 0, 0, 1);
  const shelf = clamp(topology.shelfDepthIndex || topology.reefShelfPermission || 0, 0, 1);
  const depth = clamp(topology.oceanDepthIndex || topology.bathymetryBlueprintIndex || 0, 0, 1);
  const trench = clamp(topology.trenchDepthIndex || tectonics.trenchReinforcementPermission * depth, 0, 1);

  const river = land ? clamp(terrain.riverbedPressure * options.hydrationStrength, 0, 1) : 0;
  const stream = land ? clamp(terrain.streamPressure * options.hydrationStrength, 0, 1) : 0;
  const lake = land ? clamp(terrain.lakeBasinPressure * options.hydrationStrength, 0, 1) : 0;
  const glacier = ice ? 0.92 : clamp(terrain.glacierSeatPressure * options.hydrationStrength, 0, 1);
  const snowpack = ice ? 0.88 : clamp(terrain.snowpackSourcePressure * 0.76, 0, 1);
  const floodplain = land ? clamp(terrain.floodplainPressure * 0.78, 0, 1) : 0;
  const delta = land ? clamp(terrain.deltaReceiverPressure * 0.82, 0, 1) : 0;
  const spring = land ? clamp(tectonics.crustalStressIndex * terrain.valleyChannelPressure * 0.38, 0, 1) : 0;
  const subterranean = topologyLand ? clamp(topology.subterraneanDepthIndex * 0.58 + tectonics.crustalStressIndex * 0.18, 0, 1) : clamp(depth * 0.22, 0, 1);

  const oceanClass = oceanClassFor(depth, shelf, coastal, trench);

  const waterClass = ice
    ? "glacier_mass"
    : oceanVoid
      ? oceanClass
      : lake > 0.48
        ? "lake_fill"
        : river > 0.42
          ? "river_flow"
          : stream > 0.36
            ? "stream_flow"
            : floodplain > 0.34
              ? "floodplain_wetland"
              : delta > 0.30
                ? "delta_wetland"
                : spring > 0.24
                  ? "spring_seep"
                  : "dry_land";

  const isOceanWater =
    waterClass === "ocean_water" ||
    waterClass === "coastal_water" ||
    waterClass === "shelf_water" ||
    waterClass === "deep_ocean_water" ||
    waterClass === "trench_water";

  const surfaceWaterIndex = clamp(
    (isOceanWater ? 0.66 + depth * 0.20 + shelf * 0.10 + coastal * 0.12 : 0) +
      river * 0.42 +
      stream * 0.26 +
      lake * 0.52 +
      glacier * 0.54 +
      floodplain * 0.22 +
      delta * 0.20,
    0,
    1
  );

  const coastalTurquoiseIndex = oceanVoid ? clamp(coastal * 0.72 + shelf * 0.32, 0, 1) : 0;
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
    activeContract: CONTRACTS.hydrationParent,
    oceansReceipt: CONTRACTS.oceansChild,
    fallbackUsed: false,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    hydrationParentActive: true,
    hydrationParentTectonicGenealogyAligned: true,
    oceansChildActive: true,
    oceansChildConsumedThroughHydrationParent: true,
    runtimeImportsOceansDirectly: false,

    waterClass,
    waterClassId:
      waterClass === "trench_water" ? 74 :
      waterClass === "deep_ocean_water" ? 73 :
      waterClass === "shelf_water" ? 72 :
      waterClass === "coastal_water" ? 71 :
      waterClass === "ocean_water" ? 70 :
      waterClass === "glacier_mass" ? 60 :
      waterClass === "lake_fill" ? 50 :
      waterClass === "river_flow" ? 40 :
      waterClass === "stream_flow" ? 30 :
      waterClass === "floodplain_wetland" ? 25 :
      waterClass === "delta_wetland" ? 24 :
      waterClass === "spring_seep" ? 20 : 0,

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
    oceanClassId: isOceanWater ? 70 : 0,
    oceanDepthIndex: oceanVoid ? depth : 0,
    visibleWaterDepthIndex,
    waterVisibilityIndex: isOceanWater ? clamp(0.58 + visibleWaterDepthIndex * 0.36, 0, 1) : 0,
    coastalTurquoiseIndex,
    coastalShelfBlueIndex: oceanVoid ? clamp(shelf * 0.70 + coastal * 0.24, 0, 1) : 0,
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
    beachWaterContactIndex: clamp(topology.beachWaterContactIndex, 0, 1),
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
    hydrationActivationIndex: clamp(surfaceWaterIndex + subterranean * 0.08, 0, 1),

    riverFlowPressure: river,
    streamFlowPressure: stream,
    lakeFillPressure: lake,
    glacierMassPressure: glacier,
    snowpackPressure: snowpack,
    floodplainWetness: floodplain,
    deltaWetness: delta,
    springSeepPressure: spring,
    subterraneanWaterPressure: subterranean,

    hydrationColorInfluence,

    oceanDoesNotOwnLand: true,
    landPreservedByTopology: true,

    ownsHydration: true,
    ownsOceansChild: false,
    ownsTopology: false,
    ownsTerrain: false,
    ownsTectonics: false,
    ownsLandFootprint: false,

    climate: false,
    ecology: false,
    foliage: false,
    trees: false,
    vegetation: false,
    animals: false,
    marineLife: false,
    constructCivilization: false,
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

function composeSample(point, options) {
  const tectonics = deriveTectonics(point);
  const topology = deriveTopology(point, tectonics, options);
  const terrain = deriveTerrain(point, tectonics, topology, options);
  const hydration = deriveHydration(point, tectonics, topology, terrain, options);

  const landVisibleToRoute = Boolean(topology.isAboveWaterLandFootprint);
  const topologyLand = Boolean(topology.topologyLandFootprint);
  const ice = Boolean(topology.isPolarIceFootprint);
  const waterVisibleToRoute = Boolean(hydration.isOceanWater || hydration.isRiver || hydration.isStream || hydration.isLake || hydration.isGlacier || !landVisibleToRoute);

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

    runtimeChain: RUNTIME_LAW.genealogy,

    tectonicsReceipt: tectonics.receipt,
    topologyReceipt: topology.receipt,
    terrainReceipt: terrain.receipt,
    hydrationReceipt: hydration.receipt,
    oceansReceipt: hydration.oceansReceipt,

    runtimeImportStabilized: true,
    staticDependencyGraphBlocked: true,
    synchronousRouteSampling: true,

    consumesTectonicsParent: true,
    consumesTopologyChild: true,
    consumesTerrainGrandchild: true,
    consumesHydrationParent: true,
    oceansChildConsumedThroughHydrationParent: true,
    runtimeImportsOceansDirectly: false,

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
    landConnectionId: topology.landConnectionId,
    islandArcId: topology.islandArcId,

    tectonicType: tectonics.tectonicType,
    plateId: tectonics.plateId,
    plateKey: tectonics.plateKey,
    boundaryId: tectonics.boundaryId,

    crustalStressIndex: tectonics.crustalStressIndex,
    ancientCrustStabilityIndex: tectonics.ancientCrustStabilityIndex,
    primordialMountainMemoryIndex: tectonics.primordialMountainMemoryIndex,
    weatheredRemnantIndex: tectonics.weatheredRemnantIndex,
    mountainChainPermission: tectonics.mountainChainPermission,
    canyonPermission: tectonics.canyonPermission,
    cliffPermission: tectonics.cliffPermission,
    upliftPermission: tectonics.upliftPermission,
    terrainPressureHandoff: tectonics.terrainPressureHandoff,

    diamondPressureIndex: tectonics.diamondPressureIndex,
    opalSeamIndex: tectonics.opalSeamIndex,
    graniteCratonIndex: tectonics.graniteCratonIndex,
    slateFoldBeltIndex: tectonics.slateFoldBeltIndex,
    exposedMineralHardnessIndex: tectonics.exposedMineralHardnessIndex,

    seaLevelThreshold: topology.seaLevelThreshold,
    seaLevelBoundary: topology.seaLevelBoundary,
    seaLevelDistance: topology.seaLevelDistance,
    targetLandRatio: topology.targetLandRatio,
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
    waterClassId: hydration.waterClassId,
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
    oceanClassId: hydration.oceanClassId,
    oceanActive: hydration.oceanActive,
    oceanFromHydrationParent: true,
    oceansChildActive: hydration.oceansChildActive,
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

    hydrationColorInfluence: hydration.hydrationColorInfluence,

    runtimeCacheActive: true,
    lowLagSampling: true,
    runtimeCompositeFieldActive: true,
    perPixelChainRecalculation: false,

    fallbackFlags: Object.freeze({
      tectonicsFallbackUsed: false,
      topologyFallbackUsed: false,
      terrainFallbackUsed: false,
      hydrationFallbackUsed: false
    }),
    fallbackUsed: false,

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

    climate: false,
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
  let iceSamples = 0;
  let riverSamples = 0;
  let streamSamples = 0;
  let lakeSamples = 0;
  let glacierSamples = 0;
  let snowpackSamples = 0;
  let floodplainSamples = 0;
  let deltaSamples = 0;
  let springSamples = 0;
  let subterraneanSamples = 0;

  let maxTurquoise = 0;
  let maxDepth = 0;
  let maxElevation = -1;
  let maxHydrationActivationIndex = 0;
  let maxSurfaceWaterIndex = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = composeSample(normalizeUV(u, v), runtimeOptions);

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
      if (sample.isIce) iceSamples += 1;
      if (sample.isRiver) riverSamples += 1;
      if (sample.isStream) streamSamples += 1;
      if (sample.isLake) lakeSamples += 1;
      if (sample.isGlacier) glacierSamples += 1;
      if (sample.isSnowpack) snowpackSamples += 1;
      if (sample.isFloodplain) floodplainSamples += 1;
      if (sample.isDelta) deltaSamples += 1;
      if (sample.isSpring) springSamples += 1;
      if (sample.isSubterraneanWater) subterraneanSamples += 1;

      if (sample.ridge > 0.38 || sample.canyonPressure > 0.38 || sample.cliffPressure > 0.38) {
        terrainReliefSamples += 1;
      }

      if (sample.fallbackUsed) fallbackSamples += 1;

      maxTurquoise = Math.max(maxTurquoise, sample.coastalTurquoiseIndex);
      maxDepth = Math.max(maxDepth, sample.visibleWaterDepthIndex);
      maxElevation = Math.max(maxElevation, sample.normalizedElevation);
      maxHydrationActivationIndex = Math.max(maxHydrationActivationIndex, sample.hydrationActivationIndex);
      maxSurfaceWaterIndex = Math.max(maxSurfaceWaterIndex, sample.surfaceWaterIndex);
    }
  }

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
      iceSamples,
      riverSamples,
      streamSamples,
      lakeSamples,
      glacierSamples,
      snowpackSamples,
      floodplainSamples,
      deltaSamples,
      springSamples,
      subterraneanSamples,

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
      maxSurfaceWaterIndex,

      visualSurfaceClasses: Object.freeze(Array.from(visualSurfaceClasses)),

      runtimeImportStabilized: true,
      runtimeCacheActive: true,
      lowLagSampling: true,
      runtimeCompositeFieldActive: true,
      perPixelChainRecalculation: false,

      consumesTectonicGenealogy: true,
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

      climateEnabled: false,
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

    fallbackReport: Object.freeze({
      tectonicsFallbackUsed: false,
      topologyFallbackUsed: false,
      terrainFallbackUsed: false,
      hydrationFallbackUsed: false,
      runtimeFallbackUsed: false,
      fallbackSamples: runtimeField.stats.fallbackSamples,
      fallbackRatio: runtimeField.stats.fallbackRatio
    }),

    tectonicsStatus: Object.freeze({
      ok: true,
      receipt: CONTRACTS.tectonicsParent,
      consumedByRuntime: true,
      path: AUTHORITY_PATHS.tectonicsParent
    }),
    topologyStatus: Object.freeze({
      ok: true,
      receipt: CONTRACTS.topologyChild,
      consumedByRuntime: true,
      path: AUTHORITY_PATHS.topologyChild
    }),
    terrainStatus: Object.freeze({
      ok: true,
      receipt: CONTRACTS.terrainGrandchild,
      consumedByRuntime: true,
      path: AUTHORITY_PATHS.terrainGrandchild
    }),
    hydrationStatus: Object.freeze({
      ok: true,
      receipt: CONTRACTS.hydrationParent,
      oceansReceipt: CONTRACTS.oceansChild,
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
  return getRuntimeSampleFromField(cache.runtimeField, u, v) || composeSample(normalizeUV(u, v), cache.runtimeOptions);
}

function makeStatus(cache = null) {
  const fieldStats = cache && cache.runtimeField ? cache.runtimeField.stats : null;
  const fallbackReport = cache ? cache.fallbackReport : Object.freeze({
    tectonicsFallbackUsed: false,
    topologyFallbackUsed: false,
    terrainFallbackUsed: false,
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
    id: "audralia-runtime-import-stabilized-surface-baseline",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    authorityPaths: AUTHORITY_PATHS,
    contracts: CONTRACTS,
    runtimeLaw: RUNTIME_LAW,

    layerOrder: RUNTIME_LAW.layerOrder,
    genealogy: RUNTIME_LAW.genealogy,

    runtimeImportStabilized: true,
    staticDependencyGraphBlocked: true,
    synchronousRouteSampling: true,

    tectonicsLoaded: true,
    topologyLoaded: true,
    terrainLoaded: true,
    hydrationLoaded: true,
    oceansChildLoadedThroughHydration: true,
    runtimeFieldLoaded: Boolean(cache && cache.runtimeField),

    fallbackReport,

    tectonicsStatus: cache ? cache.tectonicsStatus : null,
    topologyStatus: cache ? cache.topologyStatus : null,
    terrainStatus: cache ? cache.terrainStatus : null,
    hydrationStatus: cache ? cache.hydrationStatus : null,
    runtimeFieldStats: fieldStats,

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
    ownsLandFootprint: false,
    ownsWaterFill: false,
    ownsCameraControl: false,
    ownsZoomControl: false,
    ownsSpinControl: false,
    ownsRouteRendering: false,
    ownsFinalRender: false,

    climateEnabled: false,
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
