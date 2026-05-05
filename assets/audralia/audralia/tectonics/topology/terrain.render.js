// /assets/audralia/audralia/tectonics/topology/terrain.render.js
// AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1
//
// Role:
// - Audralia terrain grandchild authority.
// - Born from topology.
// - Topology was born from tectonics.
// - Owns elevation, relief, ridges, basins, cliffs, carved channels, glacier seats, and hydrology readiness.
// - Must never expand land beyond topology.
//
// Hard locks:
// - No DOM mutation.
// - No route rendering.
// - No runtime rendering.
// - No land generation.
// - No topology rewrite.
// - No tectonic overwrite.
// - No active hydration.
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

import {
  sampleTopology,
  buildTopologyField,
  getTopologySampleFromField,
  getTopologyStatus
} from "./render.js?v=AUDRALIA_TECTONICS_TOPOLOGY_CHILD_FOOTPRINT_AUTHORITY_TNT_v1";

const RECEIPT = "AUDRALIA_TECTONICS_TOPOLOGY_TERRAIN_GRANDCHILD_RELIEF_TNT_v1";

const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1_TERRAIN_GRANDCHILD_OF_TOPOLOGY";
const FILE = "/assets/audralia/audralia/tectonics/topology/terrain.render.js";

const TERRAIN_LAW = Object.freeze({
  genealogy: "tectonics→topology→terrain",
  grandchildOfTectonics: true,
  childOfTopology: true,
  parentTopology: "/assets/audralia/audralia/tectonics/topology/render.js",
  grandparentTectonics: "/assets/audralia/audralia/tectonics/render.js",

  ownsTerrain: true,
  ownsElevation: true,
  ownsRelief: true,
  ownsRidges: true,
  ownsBasins: true,
  ownsCliffs: true,
  ownsCarvedChannels: true,
  ownsHydrologyReadiness: true,

  ownsTectonics: false,
  ownsTopology: false,
  ownsLandFootprint: false,
  ownsLandExpansion: false,
  ownsHydration: false,
  ownsRouteRendering: false,
  ownsRuntimeRendering: false,
  ownsFinalRender: false,

  mustRespectTopologyLandArea: true,
  visualPassClaimed: false
});

const DEFAULTS = Object.freeze({
  fieldWidth: 224,
  fieldHeight: 112,
  minFieldWidth: 64,
  minFieldHeight: 32,
  maxFieldWidth: 512,
  maxFieldHeight: 256,
  reliefDemand: 1.0,
  canyonDemand: 0.94,
  cliffDemand: 0.90,
  hydrologyReadinessDemand: 0.90,
  glacierDemand: 0.78
});

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
    total += valueNoise(x * frequency, y * frequency, seed + i * 19.13) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.00001, normalizer);
}

function safeTectonics(context, point) {
  if (context && context.tectonics) return context.tectonics;
  if (context && context.tectonicsSample) return context.tectonicsSample;
  if (context && context.tectonicsField) return getTectonicsSampleFromField(context.tectonicsField, point.u, point.v);

  try {
    return sampleTectonics(point.u, point.v, context && context.tectonicsContext ? context.tectonicsContext : {});
  } catch {
    return Object.freeze({
      receipt: "TERRAIN_GRANDCHILD_FALLBACK_TECTONICS",
      fallbackUsed: true,
      crustalStressIndex: 0,
      mountainChainPermission: 0,
      canyonPermission: 0,
      cliffPermission: 0,
      upliftPermission: 0,
      trenchReinforcementPermission: 0,
      terrainPressureHandoff: 0,
      exposedMineralHardnessIndex: 0
    });
  }
}

function safeTopology(context, point, tectonics) {
  if (context && context.topology) return context.topology;
  if (context && context.topologySample) return context.topologySample;
  if (context && context.topologyField) return getTopologySampleFromField(context.topologyField, point.u, point.v);

  try {
    return sampleTopology(point.u, point.v, { ...(context || {}), tectonics });
  } catch {
    return Object.freeze({
      receipt: "TERRAIN_GRANDCHILD_FALLBACK_TOPOLOGY",
      fallbackUsed: true,
      isLandFootprint: false,
      isAboveWaterLandFootprint: false,
      isVoidFootprint: true,
      isWaterFootprint: true,
      isPolarIceFootprint: false,
      isBeach: false,
      isShelf: false,
      oceanDepthIndex: 0.62,
      bathymetryBlueprintIndex: 0.58,
      terrainRisePermission: 0,
      terrainBlockPermission: 1,
      shorelinePressure: 0,
      beachOutlinePressure: 0,
      cliffBaseCut: 0
    });
  }
}

function isLand(topology) {
  return Boolean(topology && (topology.isLandFootprint || topology.isAboveWaterLandFootprint));
}

function isIce(topology) {
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

export function sampleTerrain(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const options = Object.freeze({ ...DEFAULTS, ...(context || {}) });

  const tectonics = safeTectonics(options, point);
  const topology = safeTopology(options, point, tectonics);

  const land = isLand(topology);
  const ice = isIce(topology);

  const reliefNoise = fbm(point.lon * 10.4 + 0.8, point.lat * 10.4 - 0.6, 4011, 4);
  const fineNoise = fbm(point.lon * 26.2 - 2.6, point.lat * 26.2 + 1.4, 4049, 3);
  const channelNoise = fbm(point.lon * 18.0 + 3.8, point.lat * 18.0 - 2.2, 4073, 4);

  const topologyRise = clamp(Number(topology.terrainRisePermission) || 0, 0, 1);
  const tectonicHandoff = clamp(Number(tectonics.terrainPressureHandoff) || 0, 0, 1);
  const mountainPermission = clamp(Number(tectonics.mountainChainPermission) || 0, 0, 1);
  const canyonPermission = clamp(Number(tectonics.canyonPermission) || 0, 0, 1);
  const cliffPermission = clamp(Number(tectonics.cliffPermission) || 0, 0, 1);
  const upliftPermission = clamp(Number(tectonics.upliftPermission) || 0, 0, 1);
  const mineralHardness = clamp(Number(tectonics.exposedMineralHardnessIndex) || 0, 0, 1);

  const ridge = land
    ? clamp(
        mountainPermission * 0.36 +
          upliftPermission * 0.24 +
          reliefNoise * 0.20 +
          topologyRise * 0.14 +
          mineralHardness * 0.06,
        0,
        1
      )
    : 0;

  const canyonPressure = land
    ? clamp(
        canyonPermission * 0.38 +
          channelNoise * 0.24 +
          Number(topology.seaLevelErosionPressure || 0) * 0.16 +
          (1 - reliefNoise) * 0.10 +
          clamp(options.canyonDemand, 0, 1) * 0.12,
        0,
        1
      )
    : 0;

  const cliffPressure = land
    ? clamp(
        cliffPermission * 0.38 +
          Number(topology.cliffBaseCut || 0) * 0.24 +
          Number(topology.coastalCliffPressure || 0) * 0.20 +
          mineralHardness * 0.10 +
          clamp(options.cliffDemand, 0, 1) * 0.08,
        0,
        1
      )
    : 0;

  const basin = land
    ? clamp(
        (1 - ridge) * 0.26 +
          (1 - topologyRise) * 0.22 +
          channelNoise * 0.18 +
          Number(topology.basinDepthIndex || 0) * 0.16,
        0,
        1
      )
    : clamp(Number(topology.oceanDepthIndex) || 0.58, 0, 1);

  const normalizedElevation = ice
    ? 0.18
    : land
      ? clamp(
          topologyRise * 0.30 +
            tectonicHandoff * 0.22 +
            ridge * 0.22 +
            cliffPressure * 0.10 +
            reliefNoise * 0.10 +
            fineNoise * 0.06,
          0.06,
          1
        )
      : -clamp(
          Number(topology.oceanDepthIndex) ||
            Number(topology.bathymetryBlueprintIndex) ||
            0.56,
          0.10,
          1
        );

  const slope = land
    ? clamp(ridge * 0.36 + canyonPressure * 0.24 + cliffPressure * 0.22 + fineNoise * 0.18, 0, 1)
    : 0;

  const riverbedPressure = land
    ? clamp(canyonPressure * 0.38 + basin * 0.18 + channelNoise * 0.26 + slope * 0.08, 0, 1)
    : 0;

  const streamPressure = land
    ? clamp(riverbedPressure * 0.62 + fineNoise * 0.18 + slope * 0.10, 0, 1)
    : 0;

  const lakeBasinPressure = land
    ? clamp(basin * 0.42 + (1 - ridge) * 0.22 + channelNoise * 0.16 + Number(topology.shorelinePressure || 0) * 0.10, 0, 1)
    : 0;

  const valleyChannelPressure = land
    ? clamp(canyonPressure * 0.46 + riverbedPressure * 0.26 + slope * 0.12, 0, 1)
    : 0;

  const floodplainPressure = land
    ? clamp(lakeBasinPressure * 0.30 + riverbedPressure * 0.28 + Number(topology.shorelinePressure || 0) * 0.16, 0, 1)
    : 0;

  const deltaReceiverPressure = land
    ? clamp(Number(topology.shorelinePressure || 0) * riverbedPressure * 0.72, 0, 1)
    : 0;

  const glacierSeatPressure = ice
    ? 0.88
    : land
      ? clamp(
          Math.max(0, Math.abs(point.lat) - 0.62) * 1.8 +
            ridge * 0.24 +
            mountainPermission * 0.18 +
            clamp(options.glacierDemand, 0, 1) * 0.08,
          0,
          1
        )
      : 0;

  const snowpackSourcePressure = clamp(glacierSeatPressure * 0.78 + ridge * 0.12, 0, 1);

  const hydrologyReadinessIndex = land || ice
    ? clamp(
        riverbedPressure * 0.22 +
          streamPressure * 0.14 +
          lakeBasinPressure * 0.16 +
          glacierSeatPressure * 0.14 +
          valleyChannelPressure * 0.14 +
          floodplainPressure * 0.10 +
          clamp(options.hydrologyReadinessDemand, 0, 1) * 0.10,
        0,
        1
      )
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

    genealogy: TERRAIN_LAW.genealogy,
    grandchildOfTectonics: true,
    childOfTopology: true,
    parentTopologyReceipt: topology.receipt || "unknown",
    grandparentTectonicsReceipt: tectonics.receipt || "unknown",

    ownsTerrain: true,
    ownsElevation: true,
    ownsRelief: true,
    ownsRidges: true,
    ownsBasins: true,
    ownsCliffs: true,
    ownsCarvedChannels: true,
    ownsHydrologyReadiness: true,

    ownsTectonics: false,
    ownsTopology: false,
    ownsLandFootprint: false,
    ownsLandExpansion: false,
    ownsHydration: false,

    isLand: land,
    isWater: !land && !ice,
    isIce: ice,
    topologyLandFootprint: land,
    terrainAllowedByTopology: land || ice,
    terrainMustNotExpandLandArea: true,
    landExpansionBlocked: true,

    normalizedElevation,
    elevationMeters: normalizedElevation >= 0
      ? Math.round(normalizedElevation * 9200)
      : Math.round(normalizedElevation * 5600),

    ridge,
    mountainPressure: ridge,
    basin,
    slope,
    canyonPressure,
    cliffPressure,
    coastPressure: clamp(Number(topology.shorelinePressure) || 0, 0, 1),
    shelfPermission: clamp(Number(topology.reefShelfPermission) || Number(topology.shelfDepthIndex) || 0, 0, 1),

    riverbedPressure,
    streamPressure,
    lakeBasinPressure,
    glacierSeatPressure,
    snowpackSourcePressure,
    valleyChannelPressure,
    floodplainPressure,
    deltaReceiverPressure,
    riverIncisionPressure: clamp(canyonPressure * 0.62 + riverbedPressure * 0.24, 0, 1),
    hydrologyReadinessIndex,

    mineralReliefIndex: mineralHardness,
    weatheredReliefIndex: clamp(Number(tectonics.weatheredRemnantIndex) || 0, 0, 1),
    ancientMountainMemoryReliefIndex: clamp(Number(tectonics.primordialMountainMemoryIndex) || 0, 0, 1),

    activeHydrationOwnedHere: false,
    hydrationHeld: true,
    hydrationEnabled: false,
    foliageEnabled: false,
    foliage: false,
    trees: false,
    vegetation: false,
    fallbackUsed: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

export function buildTerrainField(width = DEFAULTS.fieldWidth, height = DEFAULTS.fieldHeight, context = {}) {
  const w = normalizeDimension(width, DEFAULTS.fieldWidth, DEFAULTS.minFieldWidth, DEFAULTS.maxFieldWidth);
  const h = normalizeDimension(height, DEFAULTS.fieldHeight, DEFAULTS.minFieldHeight, DEFAULTS.maxFieldHeight);

  const tectonicsField = context.tectonicsField || buildTectonicsField(w, h, context.tectonicsContext || {});
  const topologyField = context.topologyField || buildTopologyField(w, h, { ...(context.topologyContext || {}), tectonicsField });

  const samples = new Array(w * h);

  let landSamples = 0;
  let waterSamples = 0;
  let iceSamples = 0;
  let reliefSamples = 0;
  let hydrologyReadySamples = 0;
  let glacierSeatSamples = 0;
  let maxElevation = -1;
  let maxHydrology = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const tectonics = getTectonicsSampleFromField(tectonicsField, u, v);
      const topology = getTopologySampleFromField(topologyField, u, v);
      const sample = sampleTerrain(u, v, { ...context, tectonics, topology });

      samples[y * w + x] = sample;

      if (sample.isIce) iceSamples += 1;
      else if (sample.isLand) landSamples += 1;
      else waterSamples += 1;

      if (sample.ridge > 0.38 || sample.canyonPressure > 0.38 || sample.cliffPressure > 0.38) reliefSamples += 1;
      if (sample.hydrologyReadinessIndex > 0.38) hydrologyReadySamples += 1;
      if (sample.glacierSeatPressure > 0.50) glacierSeatSamples += 1;

      maxElevation = Math.max(maxElevation, sample.normalizedElevation);
      maxHydrology = Math.max(maxHydrology, sample.hydrologyReadinessIndex);
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
    topologyField,
    stats: Object.freeze({
      totalSamples: samples.length,
      landSamples,
      waterSamples,
      iceSamples,
      reliefSamples,
      hydrologyReadySamples,
      glacierSeatSamples,
      landRatio: samples.length ? landSamples / samples.length : 0,
      waterRatio: samples.length ? waterSamples / samples.length : 0,
      iceRatio: samples.length ? iceSamples / samples.length : 0,
      reliefRatio: samples.length ? reliefSamples / samples.length : 0,
      hydrologyReadyRatio: samples.length ? hydrologyReadySamples / samples.length : 0,
      glacierSeatRatio: samples.length ? glacierSeatSamples / samples.length : 0,
      maxElevation,
      maxHydrology,
      grandchildOfTectonics: true,
      childOfTopology: true,
      terrainMustNotExpandLandArea: true,
      visualPassClaimed: false
    })
  });
}

export function getTerrainSampleFromField(field, uInput, vInput) {
  if (!field || !field.samples || !field.width || !field.height) {
    return sampleTerrain(uInput, vInput);
  }

  const point = normalizeUV(uInput, vInput);
  const x = clamp(Math.round(point.u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(point.v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x] || sampleTerrain(point.u, point.v);
}

export function getTerrainStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeContract: RECEIPT,
    status: "active",
    id: "audralia-terrain-grandchild-relief-authority",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    terrainLaw: TERRAIN_LAW,
    grandparentTectonicsStatus: getTectonicsStatus(),
    parentTopologyStatus: getTopologyStatus(),
    exports: Object.freeze([
      "sampleTerrain",
      "buildTerrainField",
      "getTerrainSampleFromField",
      "getTerrainStatus"
    ]),
    grandchildOfTectonics: true,
    childOfTopology: true,
    ownsTerrain: true,
    ownsElevation: true,
    ownsRelief: true,
    ownsHydrologyReadiness: true,
    ownsTectonics: false,
    ownsTopology: false,
    ownsLandFootprint: false,
    ownsLandExpansion: false,
    ownsHydration: false,
    terrainMustNotExpandLandArea: true,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaTerrain = api;
  window.AudraliaTerrain = api;
  window.audraliaTerrain = api;
}

export default api;
