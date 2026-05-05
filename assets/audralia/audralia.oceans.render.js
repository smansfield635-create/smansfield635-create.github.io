// /assets/audralia/audralia.oceans.render.js
// AUDRALIA_OCEANS_CHILD_TURQUOISE_DEPTH_GRADIENT_TNT_v1
//
// Role:
// - Audralia oceans child authority under hydration.
// - Consumes topology, tectonics, and terrain.
// - Owns ocean-specific expression only: coastal turquoise, shelf water,
//   open ocean, deep ocean, trench darkness, shoreline contact, and beach rim.
// - Reports land preservation but does not define, expand, shrink, or erase land.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No runtime rendering.
// - No land generation.
// - No topology rewrite.
// - No tectonic overwrite.
// - No terrain elevation ownership.
// - No hydration parent replacement.
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

const RECEIPT = "AUDRALIA_OCEANS_CHILD_TURQUOISE_DEPTH_GRADIENT_TNT_v1";

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_OCEANS_CHILD_TURQUOISE_DEPTH_GRADIENT";
const FILE = "/assets/audralia/audralia.oceans.render.js";

const CONTRACTS = Object.freeze({
  oceans: RECEIPT,
  topology: "AUDRALIA_TOPOLOGY_BEACH_OUTLINE_ONLY_WATER_DOMINANT_TNT_v1",
  tectonics: "AUDRALIA_G1_TECTONIC_PLATE_LAYER_EARTH_LAND_AREA_ANCIENT_MOUNTAIN_MEMORY_TNT_v1",
  terrain: "AUDRALIA_G1_TERRAIN_STRONG_RELIEF_TOPOLOGY_TECTONICS_LOCK_TNT_v2",
  hydrationParentExpected: "AUDRALIA_HYDRATION_PARENT_CONSUME_OCEANS_CHILD_TNT_v1"
});

const OCEANS_LAW = Object.freeze({
  ownsOceans: true,
  ownsOceanDepth: true,
  ownsCoastalTurquoise: true,
  ownsShelfWater: true,
  ownsOpenOcean: true,
  ownsDeepOcean: true,
  ownsTrenchWater: true,
  ownsShorelineContact: true,
  ownsBeachRimReport: true,
  ownsLandPreservationReport: true,

  ownsTopology: false,
  ownsLandFootprint: false,
  ownsSeaLevelBoundary: false,
  ownsTectonics: false,
  ownsTerrain: false,
  ownsHydrationParent: false,
  ownsRouteRendering: false,
  ownsRuntimeRendering: false,
  ownsFinalRender: false,

  oceanDoesNotOwnLand: true,
  landPreservedByTopology: true,
  beachRimPreserved: true,
  turquoiseCoastalOutlineActive: true,
  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 224,
  fieldHeight: 112,
  minFieldWidth: 64,
  minFieldHeight: 32,
  maxFieldWidth: 512,
  maxFieldHeight: 256,
  coastalTurquoiseDemand: 1.0,
  shelfDemand: 0.95,
  openOceanDemand: 0.90,
  deepOceanDemand: 0.96,
  trenchDemand: 0.98,
  shorelineContactDemand: 0.96,
  beachRimDemand: 0.92
});

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

function fallbackTopology(u, v) {
  const point = normalizeUV(u, v);
  const ice = point.lat < -0.80 || point.lat > 0.88;

  return Object.freeze({
    receipt: "OCEANS_FALLBACK_TOPOLOGY",
    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,
    isLandFootprint: false,
    isAboveWaterLandFootprint: false,
    isVoidFootprint: !ice,
    isWaterFootprint: !ice,
    isPolarIceFootprint: ice,
    isSouthPolarIceFootprint: point.lat < -0.80,
    isNorthPolarIceFootprint: point.lat > 0.88,
    isBeach: false,
    isSand: false,
    isShelf: !ice,
    isCoastline: false,
    surfaceClass: ice ? "polar_ice_footprint" : "open_ocean_blueprint",
    topologySurfaceClass: ice ? "polar_ice_footprint" : "open_ocean_blueprint",
    oceanDepthIndex: ice ? 0 : 0.62,
    bathymetryBlueprintIndex: ice ? 0 : 0.58,
    shelfDepthIndex: ice ? 0 : 0.18,
    trenchDepthIndex: 0,
    coastalExposureIndex: 0,
    shorelinePressure: 0,
    beachOutlinePressure: 0,
    beachWaterContactIndex: 0
  });
}

function fallbackTectonics(u, v, topology) {
  return Object.freeze({
    receipt: "OCEANS_FALLBACK_TECTONICS",
    u,
    v,
    topologyLandFootprint: Boolean(topology && topology.isLandFootprint),
    trenchReinforcementPermission: 0,
    crustalStressIndex: 0,
    plateId: 0,
    plateKey: "fallback_ocean_plate"
  });
}

function fallbackTerrain(u, v, topology) {
  const land = Boolean(topology && topology.isLandFootprint);
  const ice = Boolean(topology && (topology.isPolarIceFootprint || topology.isSouthPolarIceFootprint || topology.isNorthPolarIceFootprint));

  return Object.freeze({
    receipt: "OCEANS_FALLBACK_TERRAIN",
    u,
    v,
    isLand: land,
    isIce: ice,
    normalizedElevation: land ? 0.24 : -0.48,
    riverbedPressure: 0,
    streamPressure: 0,
    lakeBasinPressure: 0,
    glacierSeatPressure: ice ? 0.8 : 0,
    hydrologyReadinessIndex: 0
  });
}

function getTopology(context, u, v) {
  if (context && context.topologyField) return getTopologySampleFromField(context.topologyField, u, v);
  return safeCall(fallbackTopology(u, v), () => sampleTopology(u, v, context && context.topologyContext ? context.topologyContext : {}));
}

function getTectonics(context, u, v, topology) {
  if (context && context.tectonicsField) return getTectonicsSampleFromField(context.tectonicsField, u, v);
  return safeCall(fallbackTectonics(u, v, topology), () => sampleTectonics(u, v, topology, context && context.tectonicsContext ? context.tectonicsContext : {}));
}

function getTerrain(context, u, v, topology) {
  if (context && context.terrainField) return getTerrainSampleFromField(context.terrainField, u, v);
  return safeCall(fallbackTerrain(u, v, topology), () => sampleTerrain(u, v, context && context.terrainContext ? context.terrainContext : {}));
}

function topologyLand(topology) {
  return Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint));
}

function topologyIce(topology) {
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

function topologyBeach(topology) {
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

function classifyOcean(depth, shelf, trench, contact) {
  if (trench >= 0.58 || depth >= 0.86) return "trench_ocean";
  if (depth >= 0.70) return "deep_ocean";
  if (shelf >= 0.42) return "shelf_water";
  if (contact >= 0.34) return "coastal_turquoise";
  return "open_ocean";
}

function oceanClassId(oceanClass) {
  switch (oceanClass) {
    case "trench_ocean": return 90;
    case "deep_ocean": return 80;
    case "open_ocean": return 70;
    case "shelf_water": return 60;
    case "coastal_turquoise": return 50;
    case "polar_ice": return 15;
    case "not_ocean": return 0;
    default: return 0;
  }
}

function composeOceansSample(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const topology = getTopology(context, point.u, point.v);
  const tectonics = getTectonics(context, point.u, point.v, topology);
  const terrain = getTerrain(context, point.u, point.v, topology);

  const land = topologyLand(topology);
  const ice = topologyIce(topology);
  const beach = topologyBeach(topology);
  const oceanAllowed = !land && !ice;

  const broad = fbm(point.lon * 5.0 + 2.2, point.lat * 5.0 - 1.4, 515, 4);
  const detail = fbm(point.lon * 15.0 - 3.2, point.lat * 15.0 + 0.9, 616, 4);

  const topologyDepth = clamp(
    Number(topology.oceanDepthIndex) ||
      Number(topology.bathymetryBlueprintIndex) ||
      Number(topology.basinDepthIndex) ||
      0,
    0,
    1
  );

  const shelf = oceanAllowed
    ? clamp(
        (Number(topology.shelfDepthIndex) || 0) * 0.62 +
          (Number(topology.reefShelfPermission) || 0) * 0.22 +
          (Number(topology.coastalExposureIndex) || 0) * 0.16,
        0,
        1
      )
    : 0;

  const shorelineContact = oceanAllowed
    ? clamp(
        (Number(topology.shorelinePressure) || 0) * 0.38 +
          (Number(topology.coastalExposureIndex) || 0) * 0.34 +
          shelf * 0.18 +
          DEFAULTS.shorelineContactDemand * 0.10,
        0,
        1
      )
    : 0;

  const trench = oceanAllowed
    ? clamp(
        (Number(topology.trenchDepthIndex) || 0) * 0.54 +
          (Number(tectonics.trenchReinforcementPermission) || 0) * 0.26 +
          Math.max(0, detail - 0.52) * 0.38,
        0,
        1
      )
    : 0;

  const depth = oceanAllowed
    ? clamp(
        topologyDepth * 0.56 +
          (Number(topology.bathymetryBlueprintIndex) || 0) * 0.28 +
          trench * 0.18 +
          broad * 0.08,
        0,
        1
      )
    : 0;

  const oceanClass = ice ? "polar_ice" : oceanAllowed ? classifyOcean(depth, shelf, trench, shorelineContact) : "not_ocean";

  const coastalTurquoiseIndex = oceanAllowed
    ? clamp(shorelineContact * 0.52 + shelf * 0.34 + (1 - depth) * 0.14, 0, 1)
    : 0;

  const shelfWaterIndex = oceanAllowed
    ? clamp(shelf * 0.66 + shorelineContact * 0.18 + (1 - depth) * 0.12, 0, 1)
    : 0;

  const openOceanIndex = oceanAllowed
    ? clamp((1 - shelf) * 0.38 + depth * 0.24 + (1 - trench) * 0.18, 0, 1)
    : 0;

  const deepOceanIndex = oceanAllowed
    ? clamp(depth * 0.70 + (1 - shelf) * 0.18 + broad * 0.08, 0, 1)
    : 0;

  const trenchWaterIndex = oceanAllowed
    ? clamp(trench * 0.76 + depth * 0.16 + detail * 0.08, 0, 1)
    : 0;

  const beachOutline = clamp(Number(topology.beachOutlinePressure) || Number(topology.beachPressure) || 0, 0, 1);
  const beachRimIndex = clamp(
    beachOutline * 0.42 +
      Number(topology.beachWaterContactIndex || 0) * 0.30 +
      shorelineContact * 0.20 +
      (beach ? DEFAULTS.beachRimDemand * 0.08 : 0),
    0,
    1
  );

  const landPreservedByTopology = land;
  const oceanDoesNotOwnLand = true;
  const beachRimPreserved = beach && beachRimIndex > 0.20;

  const visibleOceanIndex = oceanAllowed
    ? clamp(
        coastalTurquoiseIndex * 0.28 +
          shelfWaterIndex * 0.20 +
          openOceanIndex * 0.18 +
          deepOceanIndex * 0.20 +
          trenchWaterIndex * 0.14,
        0,
        1
      )
    : 0;

  const oceanColorInfluence = Object.freeze({
    turquoise: coastalTurquoiseIndex,
    shelfBlue: shelfWaterIndex,
    openBlue: openOceanIndex,
    deepBlue: deepOceanIndex,
    trenchDark: trenchWaterIndex,
    beachRim: beachRimIndex,
    landPreserved: landPreservedByTopology ? 1 : 0
  });

  return Object.freeze({
    receipt: RECEIPT,
    activeContract: RECEIPT,
    latestContract: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    contracts: CONTRACTS,
    oceansLaw: OCEANS_LAW,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    topologyReceipt: topology.receipt || "unknown",
    tectonicsReceipt: tectonics.receipt || "unknown",
    terrainReceipt: terrain.receipt || "unknown",

    consumesTopology: true,
    consumesTectonics: true,
    consumesTerrain: true,

    oceanClass,
    oceanClassId: oceanClassId(oceanClass),
    oceanDepthClass: oceanClass,
    oceanAllowed,
    oceanActive: oceanAllowed,
    oceanDoesNotOwnLand,
    landPreservedByTopology,
    landFootprintFromTopology: land,
    voidFootprintFromTopology: !land && !ice,
    iceFootprintFromTopology: ice,
    beachFootprintFromTopology: beach,

    coastalTurquoiseIndex,
    shelfWaterIndex,
    openOceanIndex,
    deepOceanIndex,
    trenchWaterIndex,
    shorelineContactIndex: shorelineContact,
    beachRimIndex,
    beachRimPreserved,
    visibleOceanIndex,

    oceanDepthIndex: depth,
    bathymetryOceanIndex: depth,
    shelfPressure: shelf,
    trenchPressure: trench,

    remainingLandReport: land ? "land_preserved_by_topology" : "not_land",
    remainingBeachReport: beach ? "beach_rim_preserved_by_topology" : "not_beach",

    oceanColorInfluence,

    ownsOceans: true,
    ownsOceanDepth: true,
    ownsCoastalTurquoise: true,
    ownsShelfWater: true,
    ownsOpenOcean: true,
    ownsDeepOcean: true,
    ownsTrenchWater: true,
    ownsShorelineContact: true,
    ownsBeachRimReport: true,
    ownsLandPreservationReport: true,

    ownsTopology: false,
    ownsLandFootprint: false,
    ownsSeaLevelBoundary: false,
    ownsTectonics: false,
    ownsTerrain: false,
    ownsHydrationParent: false,
    ownsRouteRendering: false,
    ownsRuntimeRendering: false,
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

export function sampleOceans(u, v, context = {}) {
  return composeOceansSample(u, v, context);
}

export function buildOceansField(width = DEFAULTS.fieldWidth, height = DEFAULTS.fieldHeight, context = {}) {
  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);

  const topologyField = safeCall(null, () => buildTopologyField(w, h, context.topologyContext || {}));
  const tectonicsField = safeCall(null, () =>
    buildTectonicsField(w, h, {
      ...(context.tectonicsContext || {}),
      topologyContext: context.topologyContext || {}
    })
  );
  const terrainField = safeCall(null, () =>
    buildTerrainField(w, h, {
      ...(context.terrainContext || {}),
      topologyContext: context.topologyContext || {},
      tectonicsContext: context.tectonicsContext || {}
    })
  );

  const samplingContext = Object.freeze({
    ...context,
    topologyField,
    tectonicsField,
    terrainField
  });

  const samples = new Array(w * h);

  let oceanSamples = 0;
  let landPreservedSamples = 0;
  let turquoiseSamples = 0;
  let shelfSamples = 0;
  let openOceanSamples = 0;
  let deepOceanSamples = 0;
  let trenchSamples = 0;
  let beachRimSamples = 0;
  let maxTurquoise = 0;
  let maxDepth = 0;
  let maxTrench = 0;
  let maxBeachRim = 0;

  const oceanClasses = new Set();

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = composeOceansSample(u, v, samplingContext);

      samples[y * w + x] = sample;
      oceanClasses.add(sample.oceanClass);

      if (sample.oceanActive) oceanSamples += 1;
      if (sample.landPreservedByTopology) landPreservedSamples += 1;
      if (sample.coastalTurquoiseIndex > 0.34) turquoiseSamples += 1;
      if (sample.shelfWaterIndex > 0.34) shelfSamples += 1;
      if (sample.openOceanIndex > 0.34) openOceanSamples += 1;
      if (sample.deepOceanIndex > 0.34) deepOceanSamples += 1;
      if (sample.trenchWaterIndex > 0.34) trenchSamples += 1;
      if (sample.beachRimPreserved) beachRimSamples += 1;

      maxTurquoise = Math.max(maxTurquoise, sample.coastalTurquoiseIndex);
      maxDepth = Math.max(maxDepth, sample.oceanDepthIndex);
      maxTrench = Math.max(maxTrench, sample.trenchWaterIndex);
      maxBeachRim = Math.max(maxBeachRim, sample.beachRimIndex);
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
    topologyField,
    tectonicsField,
    terrainField,
    stats: Object.freeze({
      totalSamples: samples.length,
      oceanSamples,
      landPreservedSamples,
      turquoiseSamples,
      shelfSamples,
      openOceanSamples,
      deepOceanSamples,
      trenchSamples,
      beachRimSamples,
      oceanRatio: samples.length ? oceanSamples / samples.length : 0,
      landPreservedRatio: samples.length ? landPreservedSamples / samples.length : 0,
      turquoiseRatio: samples.length ? turquoiseSamples / samples.length : 0,
      shelfRatio: samples.length ? shelfSamples / samples.length : 0,
      openOceanRatio: samples.length ? openOceanSamples / samples.length : 0,
      deepOceanRatio: samples.length ? deepOceanSamples / samples.length : 0,
      trenchRatio: samples.length ? trenchSamples / samples.length : 0,
      beachRimRatio: samples.length ? beachRimSamples / samples.length : 0,
      maxTurquoise,
      maxDepth,
      maxTrench,
      maxBeachRim,
      oceanClasses: Object.freeze(Array.from(oceanClasses)),
      oceanDoesNotOwnLand: true,
      landPreservedByTopology: true,
      turquoiseCoastalOutlineActive: true,
      visualPassClaimed: false
    })
  });
}

export function getOceansSampleFromField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) {
    return sampleOceans(uInput, vInput);
  }

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || sampleOceans(point.u, point.v);
}

export function getOceansStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    status: "active",
    id: "audralia-oceans-child-turquoise-depth-gradient",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    contracts: CONTRACTS,
    oceansLaw: OCEANS_LAW,
    topologyStatus: safeCall(null, () => getTopologyStatus()),
    tectonicsStatus: safeCall(null, () => getTectonicsStatus()),
    terrainStatus: safeCall(null, () => getTerrainStatus()),
    exports: Object.freeze([
      "sampleOceans",
      "buildOceansField",
      "getOceansSampleFromField",
      "getOceansStatus"
    ]),
    oceanClasses: Object.freeze([
      "coastal_turquoise",
      "shelf_water",
      "open_ocean",
      "deep_ocean",
      "trench_ocean",
      "polar_ice",
      "not_ocean"
    ]),
    turquoiseCoastalOutlineActive: true,
    oceanDoesNotOwnLand: true,
    landPreservedByTopology: true,
    beachRimPreserved: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  sampleOceans,
  buildOceansField,
  getOceansSampleFromField,
  getOceansStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaOceans = api;
  window.AudraliaOceans = api;
  window.audraliaOceans = api;
}

export default api;
