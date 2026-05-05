// /assets/audralia/audralia/tectonics/topology/render.js
// AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1
//
// Role:
// - Audralia topology child authority.
// - Born from tectonics.
// - Tectonics begot topology.
// - Topology begot terrain.
// - Owns land/void footprint, sea-level boundary, coastline, beach outline, bathymetry, and land-preservation gate.
// - Does not own terrain relief.
// - Does not own hydration.
// - Does not own route rendering.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No runtime rendering.
// - No terrain elevation ownership.
// - No hydration.
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
} from "../render.js?v=AUDRALIA_TECTONICS_DERIVATIVE_ORIGIN_PARENT_TNT_v1";

const RECEIPT = "AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1";

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_TOPOLOGY_CHILD_OF_TECTONICS";
const FILE = "/assets/audralia/audralia/tectonics/topology/render.js";

const TARGET_EXPOSED_LAND_RATIO = 0.292;

const TOPOLOGY_LAW = Object.freeze({
  genealogy: "tectonics→topology→terrain",
  childOfTectonics: true,
  begotTerrain: true,

  parentTectonics: "/assets/audralia/audralia/tectonics/render.js",
  terrainGrandchildExpected: "/assets/audralia/audralia/tectonics/topology/terrain.render.js",

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
  ownsRouteRendering: false,
  ownsRuntimeRendering: false,
  ownsFinalRender: false,

  hydrationMayNotConvertLandToOcean: true,
  terrainMustNotExpandLandArea: true,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 224,
  fieldHeight: 112,
  minFieldWidth: 64,
  minFieldHeight: 32,
  maxFieldWidth: 512,
  maxFieldHeight: 256,

  coastlineComplexity: 0.94,
  connectionStrength: 0.88,
  beachOutlineStrength: 0.92,
  tectonicLandCoupling: 0.92,
  seaLevelBias: 0,
  enforceEarthEquivalentLandRatio: true
});

const LAND_BODIES = Object.freeze([
  {
    id: 1,
    key: "mainland",
    name: "Mainland",
    lon: -0.38,
    lat: 0.10,
    rx: 0.48,
    ry: 0.31,
    weight: 1.12
  },
  {
    id: 2,
    key: "western_lobe",
    name: "Western Regional Landmass",
    lon: -0.76,
    lat: -0.22,
    rx: 0.24,
    ry: 0.25,
    weight: 0.74
  },
  {
    id: 3,
    key: "eastern_lobe",
    name: "Eastern Regional Landmass",
    lon: 0.44,
    lat: -0.03,
    rx: 0.35,
    ry: 0.28,
    weight: 0.94
  },
  {
    id: 4,
    key: "northern_highland",
    name: "Northern Regional Landmass",
    lon: 0.05,
    lat: 0.58,
    rx: 0.38,
    ry: 0.20,
    weight: 0.78
  },
  {
    id: 5,
    key: "southern_weathered_arc",
    name: "Southern Regional Landmass",
    lon: 0.28,
    lat: -0.62,
    rx: 0.41,
    ry: 0.18,
    weight: 0.80
  },
  {
    id: 6,
    key: "north_polar_land",
    name: "North Polar Landmass",
    lon: 0.00,
    lat: 0.92,
    rx: 0.92,
    ry: 0.095,
    weight: 0.66
  },
  {
    id: 7,
    key: "south_polar_land",
    name: "South Polar Landmass",
    lon: 0.00,
    lat: -0.91,
    rx: 0.92,
    ry: 0.105,
    weight: 0.70
  }
]);

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

  return Object.freeze({
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2
  });
}

function fract(value) {
  return value - Math.floor(value);
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
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

function fbm(x, y, seed, octaves = 4) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 29.31) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.00001, normalizer);
}

function wrappedLonDistance(a, b) {
  const direct = Math.abs(a - b);
  return Math.min(direct, 2 - direct);
}

function landBodyScore(point, body) {
  const dx = wrappedLonDistance(point.lon, body.lon) / body.rx;
  const dy = Math.abs(point.lat - body.lat) / body.ry;
  const d = Math.sqrt(dx * dx + dy * dy);
  return clamp((1 - d) * body.weight, 0, 1);
}

function strongestLandBody(point) {
  let best = LAND_BODIES[0];
  let bestScore = 0;

  for (const body of LAND_BODIES) {
    const score = landBodyScore(point, body);

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

function safeTectonics(context, point) {
  if (context && context.tectonics) return context.tectonics;
  if (context && context.tectonicsSample) return context.tectonicsSample;

  if (context && context.tectonicsField) {
    return getTectonicsSampleFromField(context.tectonicsField, point.u, point.v);
  }

  try {
    return sampleTectonics(
      point.u,
      point.v,
      context && context.tectonicsContext ? context.tectonicsContext : {}
    );
  } catch (error) {
    return Object.freeze({
      receipt: "TOPOLOGY_CHILD_FALLBACK_TECTONICS",
      fallbackUsed: true,
      error: error && error.message ? error.message : String(error),

      crustalStressIndex: 0,
      ancientCrustStabilityIndex: 0,
      primordialMountainMemoryIndex: 0,
      weatheredRemnantIndex: 0,
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
}

function classifyDepth(depth) {
  if (depth > 0.78) return "trench_ocean";
  if (depth > 0.58) return "deep_ocean";
  if (depth > 0.36) return "open_ocean";
  if (depth > 0.18) return "shelf_water";
  return "nearshore_water";
}

function sampleRawTopology(point, tectonics, context) {
  const broad = fbm(point.lon * 3.1 + 1.7, point.lat * 3.1 - 2.4, 3001, 5);
  const coast = fbm(point.lon * 12.6 - 4.8, point.lat * 12.6 + 1.1, 3011, 4);
  const detail = fbm(point.lon * 26.0 + 0.4, point.lat * 26.0 - 0.9, 3029, 3);
  const islandNoise = fbm(point.lon * 38.0 + 2.8, point.lat * 38.0 + 5.6, 3047, 3);

  const bodyResult = strongestLandBody(point);

  const tectonicLift = clamp(
    Number(tectonics.terrainPressureHandoff) * 0.34 +
      Number(tectonics.mountainChainPermission) * 0.20 +
      Number(tectonics.crustalStressIndex) * 0.18 +
      Number(tectonics.upliftPermission) * 0.16 +
      Number(tectonics.exposedMineralHardnessIndex) * 0.12,
    0,
    1
  );

  const polarSeat = Math.abs(point.lat) > 0.84
    ? clamp((Math.abs(point.lat) - 0.84) / 0.16, 0, 1)
    : 0;

  const arcConnector =
    clamp(1 - Math.abs(point.lat - (-0.14 + 0.10 * Math.sin((point.lon + 0.24) * Math.PI * 2.0))) * 6.8, 0, 1) *
    clamp(1 - Math.abs(point.lon + 0.12) * 0.76, 0, 1);

  const smallIslandPermission = clamp(
    Math.max(0, islandNoise - 0.62) * 1.8 +
      Number(tectonics.boundaryPressure) * 0.22 +
      Number(tectonics.trenchReinforcementPermission) * 0.12,
    0,
    1
  );

  const landPotential = clamp(
    bodyResult.score * 0.58 +
      tectonicLift * 0.20 +
      broad * 0.12 +
      (coast - 0.5) * 0.10 +
      (detail - 0.5) * 0.06 +
      arcConnector * 0.10 +
      smallIslandPermission * 0.06 +
      polarSeat * 0.24,
    0,
    1
  );

  const seaLevelThreshold = clamp(
    0.49 +
      Number(context && context.seaLevelBias ? context.seaLevelBias : 0) +
      (context && context.enforceEarthEquivalentLandRatio === false ? -0.04 : 0),
    0.41,
    0.64
  );

  return Object.freeze({
    landPotential,
    seaLevelThreshold,
    bodyResult,
    broad,
    coast,
    detail,
    islandNoise,
    tectonicLift,
    polarSeat,
    arcConnector,
    smallIslandPermission
  });
}

function surfaceClassIdFor(surfaceClass) {
  if (surfaceClass === "polar_ice_footprint") return 12;
  if (surfaceClass === "beach_outline_land") return 8;
  if (surfaceClass === "topology_land_footprint") return 7;
  if (surfaceClass === "nearshore_shelf_void") return 5;
  if (surfaceClass === "trench_ocean") return 4;
  if (surfaceClass === "deep_ocean") return 3;
  if (surfaceClass === "open_ocean") return 2;
  if (surfaceClass === "nearshore_water") return 1;
  return 0;
}

export function sampleTopology(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const options = Object.freeze({ ...DEFAULTS, ...(context || {}) });
  const tectonics = safeTectonics(options, point);
  const raw = sampleRawTopology(point, tectonics, options);

  const margin = raw.landPotential - raw.seaLevelThreshold;
  const isLand = margin > 0;
  const isBeach = Math.abs(margin) <= 0.055;
  const isShelf = !isLand && margin > -0.12;
  const isPolarIce = Math.abs(point.lat) > 0.88;
  const isSouthPolarIce = point.lat < -0.88;
  const isNorthPolarIce = point.lat > 0.88;

  const oceanDepthIndex = isLand
    ? 0
    : clamp(
        Math.abs(margin) * 1.7 +
          Number(tectonics.trenchReinforcementPermission) * 0.24 +
          (1 - raw.broad) * 0.18,
        0,
        1
      );

  const bathymetryBlueprintIndex = isLand
    ? 0
    : clamp(
        oceanDepthIndex * 0.76 +
          Number(tectonics.trenchReinforcementPermission) * 0.24,
        0,
        1
      );

  const beachOutlinePressure = clamp(1 - Math.abs(margin) / 0.08, 0, 1);
  const shorelinePressure = clamp(1 - Math.abs(margin) / 0.16, 0, 1);

  const surfaceClass = isPolarIce
    ? "polar_ice_footprint"
    : isLand && isBeach
      ? "beach_outline_land"
      : isLand
        ? "topology_land_footprint"
        : isShelf
          ? "nearshore_shelf_void"
          : classifyDepth(oceanDepthIndex);

  const body = raw.bodyResult.body;

  const blackSandPressure = isBeach
    ? clamp(Number(tectonics.diamondPressureIndex) * 0.82, 0, 1)
    : 0;

  const whiteSandPressure = isBeach
    ? clamp(Number(tectonics.opalSeamIndex) * 0.82, 0, 1)
    : 0;

  return Object.freeze({
    receipt: RECEIPT,
    activeContract: RECEIPT,
    latestContract: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    genealogy: TOPOLOGY_LAW.genealogy,
    childOfTectonics: true,
    begotTerrain: true,
    parentTectonicsReceipt: tectonics.receipt || "unknown",

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

    landPotential: raw.landPotential,
    seaLevelThreshold: raw.seaLevelThreshold,
    seaLevelBoundary: raw.seaLevelThreshold,
    seaLevelDistance: margin,
    targetLandRatio: TARGET_EXPOSED_LAND_RATIO,
    approximateEarthExposedLandRatio: TARGET_EXPOSED_LAND_RATIO,

    isLandFootprint: isLand,
    isAboveWaterLandFootprint: isLand && !isPolarIce,
    topologyLandFootprint: isLand,
    isVoidFootprint: !isLand && !isPolarIce,
    isWaterFootprint: !isLand && !isPolarIce,
    isPolarIceFootprint: isPolarIce,
    isSouthPolarIceFootprint: isSouthPolarIce,
    isNorthPolarIceFootprint: isNorthPolarIce,

    isBeach,
    isSand: isBeach,
    isRock: isLand && !isBeach && Number(tectonics.exposedMineralHardnessIndex) > 0.48,
    isShelf,
    isCoastline: shorelinePressure > 0.35,
    isIslandFootprint: isLand && raw.bodyResult.score < 0.55 && raw.islandNoise > 0.58,
    isConnectedLandSystem: isLand && (raw.bodyResult.score >= 0.42 || raw.arcConnector > 0.32),
    isSmallContinentFootprint: isLand && body.id > 1 && body.id < 6,

    surfaceClass,
    topologySurfaceClass: surfaceClass,
    surfaceClassId: surfaceClassIdFor(surfaceClass),

    landBodyId: isLand ? body.id : 0,
    landBodyKey: isLand ? body.key : "void_ocean",
    landBodyName: isLand ? body.name : "Void / Ocean Footprint",
    landConnectionId: isLand ? `${body.key}_connection` : "none",
    islandArcId: isLand && raw.islandNoise > 0.62 ? `${body.key}_island_arc` : "none",

    terrainRisePermission: isLand
      ? clamp(margin * 2.0 + raw.tectonicLift * 0.42, 0, 1)
      : 0,
    terrainBlockPermission: isLand ? 0 : 1,
    terrainSeedClass: isLand ? "topology_land_rise_allowed" : "void_no_rise",

    oceanDepthIndex,
    bathymetryBlueprintIndex,
    basinDepthIndex: oceanDepthIndex,
    trenchDepthIndex: !isLand
      ? clamp(Number(tectonics.trenchReinforcementPermission) * oceanDepthIndex, 0, 1)
      : 0,
    shelfDepthIndex: isShelf ? clamp(1 - oceanDepthIndex, 0, 1) : 0,
    reefShelfPermission: isShelf ? clamp(1 - oceanDepthIndex * 0.70, 0, 1) : 0,
    depthClassKey: isLand ? "land" : classifyDepth(oceanDepthIndex),
    oceanDepthClass: isLand ? "land" : classifyDepth(oceanDepthIndex),

    subterraneanDepthIndex: clamp(
      Number(tectonics.crustalStressIndex) * 0.36 +
        raw.broad * 0.24 +
        raw.detail * 0.16,
      0,
      1
    ),
    foundationDensityIndex: clamp(
      Number(tectonics.graniteCratonIndex) * 0.34 +
        Number(tectonics.diamondPressureIndex) * 0.28 +
        raw.tectonicLift * 0.20,
      0,
      1
    ),
    rockMassBoundaryIndex: clamp(
      Number(tectonics.exposedMineralHardnessIndex) * 0.42 +
        shorelinePressure * 0.18,
      0,
      1
    ),

    shorelinePressure,
    beachPressure: beachOutlinePressure,
    sandPressure: beachOutlinePressure,
    rockPressure: clamp(Number(tectonics.exposedMineralHardnessIndex) * (isLand ? 1 : 0), 0, 1),
    coastalCliffPressure: clamp(shorelinePressure * Number(tectonics.cliffPermission), 0, 1),
    seaLevelErosionPressure: clamp(shorelinePressure * 0.62 + raw.coast * 0.22, 0, 1),
    cliffBaseCut: clamp(shorelinePressure * Number(tectonics.cliffPermission) * 0.72, 0, 1),
    coastlineIrregularityIndex: clamp(
      raw.coast * 0.56 +
        raw.detail * 0.28 +
        shorelinePressure * 0.16,
      0,
      1
    ),

    beachType:
      isBeach && whiteSandPressure >= blackSandPressure
        ? "white_opal_beach_outline"
        : isBeach
          ? "black_diamond_beach_outline"
          : "none",

    blackSandPressure,
    whiteSandPressure,
    opalSoftnessIndex: clamp(Number(tectonics.opalSeamIndex) || 0, 0, 1),
    diamondDarkSandIndex: clamp(Number(tectonics.diamondPressureIndex) || 0, 0, 1),
    beachCloudSoftnessIndex: isBeach
      ? clamp(Number(tectonics.opalSeamIndex) * 0.36 + beachOutlinePressure * 0.44, 0, 1)
      : 0,

    beachOutlinePressure,
    beachWaterContactIndex: beachOutlinePressure,
    landPreservationGate: isLand,
    hydrationMayNotConvertLandToOcean: true,
    terrainMustNotExpandLandArea: true,

    foliage: false,
    trees: false,
    vegetation: false,
    animals: false,
    marineLife: false,
    constructCivilization: false,

    fallbackUsed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function buildTopologyField(width = DEFAULTS.fieldWidth, height = DEFAULTS.fieldHeight, context = {}) {
  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);

  const tectonicsField = context.tectonicsField || buildTectonicsField(w, h, context.tectonicsContext || {});
  const samples = new Array(w * h);

  let landSamples = 0;
  let waterSamples = 0;
  let beachSamples = 0;
  let shelfSamples = 0;
  let iceSamples = 0;
  let smallContinentSamples = 0;
  let islandSamples = 0;
  let maxDepth = 0;
  let maxCoastline = 0;
  let maxBeachOutline = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const tectonics = getTectonicsSampleFromField(tectonicsField, u, v);
      const sample = sampleTopology(u, v, { ...context, tectonics });

      samples[y * w + x] = sample;

      if (sample.isPolarIceFootprint) {
        iceSamples += 1;
      } else if (sample.isLandFootprint) {
        landSamples += 1;
      } else {
        waterSamples += 1;
      }

      if (sample.isBeach) beachSamples += 1;
      if (sample.isShelf) shelfSamples += 1;
      if (sample.isSmallContinentFootprint) smallContinentSamples += 1;
      if (sample.isIslandFootprint) islandSamples += 1;

      maxDepth = Math.max(maxDepth, sample.oceanDepthIndex);
      maxCoastline = Math.max(maxCoastline, sample.shorelinePressure);
      maxBeachOutline = Math.max(maxBeachOutline, sample.beachOutlinePressure);
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    activeContract: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    width: w,
    height: h,
    samples,
    tectonicsField,

    stats: Object.freeze({
      totalSamples: samples.length,
      landSamples,
      waterSamples,
      beachSamples,
      shelfSamples,
      iceSamples,
      smallContinentSamples,
      islandSamples,

      landRatio: samples.length ? landSamples / samples.length : 0,
      waterRatio: samples.length ? waterSamples / samples.length : 0,
      beachRatio: samples.length ? beachSamples / samples.length : 0,
      shelfRatio: samples.length ? shelfSamples / samples.length : 0,
      iceRatio: samples.length ? iceSamples / samples.length : 0,
      smallContinentRatio: samples.length ? smallContinentSamples / samples.length : 0,
      islandRatio: samples.length ? islandSamples / samples.length : 0,

      targetLandRatio: TARGET_EXPOSED_LAND_RATIO,
      maxDepth,
      maxCoastline,
      maxBeachOutline,

      childOfTectonics: true,
      begotTerrain: true,
      landPreservationGate: true,
      hydrationMayNotConvertLandToOcean: true,
      terrainMustNotExpandLandArea: true,

      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    })
  });
}

export function getTopologySampleFromField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) {
    return sampleTopology(uInput, vInput);
  }

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || sampleTopology(point.u, point.v);
}

export function estimateEarthEquivalentSeaLevel(width = 96, height = 48, context = {}) {
  const field = buildTopologyField(width, height, context);

  return Object.freeze({
    receipt: "AUDRALIA_TOPOLOGY_SEA_LEVEL_ESTIMATE",
    targetLandRatio: TARGET_EXPOSED_LAND_RATIO,
    estimatedLandRatio: field.stats.landRatio,
    seaLevelThreshold: 0.49,
    totalSamples: field.stats.totalSamples,
    landSamples: field.stats.landSamples,
    waterSamples: field.stats.waterSamples,
    beachSamples: field.stats.beachSamples,
    status:
      Math.abs(field.stats.landRatio - TARGET_EXPOSED_LAND_RATIO) <= 0.12
        ? "within_working_band"
        : "needs_later_calibration",
    visualPassClaimed: false
  });
}

export function getTopologyStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeContract: RECEIPT,
    status: "active",
    id: "audralia-topology-child-footprint-authority",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,

    topologyLaw: TOPOLOGY_LAW,
    parentTectonicsStatus: getTectonicsStatus(),

    exports: Object.freeze([
      "sampleTopology",
      "buildTopologyField",
      "getTopologySampleFromField",
      "estimateEarthEquivalentSeaLevel",
      "getTopologyStatus"
    ]),

    childOfTectonics: true,
    begotTerrain: true,

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

    hydrationMayNotConvertLandToOcean: true,
    terrainMustNotExpandLandArea: true,

    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  estimateEarthEquivalentSeaLevel,
  getTopologyStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaTopology = api;
  window.AudraliaTopology = api;
  window.audraliaTopology = api;
}

export default api;
