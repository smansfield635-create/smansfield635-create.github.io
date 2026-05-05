// assets/audralia/audralia/hydration/oceans.render.js
// AUDRALIA_HYDRATION_OCEANS_PARENT_AUTHORITY_TNT_v1
//
// Active renewal:
// - AUDRALIA_HYDRATION_OCEANS_DEEP_OCEAN_CHILD_AUTHORITY_TNT_v1
//
// Role:
// - Audralia hydration oceans parent authority.
// - Owns ocean, shelf/coastal water, open ocean, DeepOcean handoff, trench water,
//   bathymetry water fields, and route-readable ocean fields.
// - Consumes DeepOcean child authority.
// - Does not render.
// - Does not import runtime.
// - Does not generate land.
// - Does not generate water outside topology void.
// - Does not mutate topology, terrain, climate, hydration parent, route, gauges, or showroom files.

import {
  applyDeepOceanToSample,
  sampleDeepOcean,
  getStatus as getDeepOceanStatus
} from "./deep-ocean.render.js";

const RECEIPT = "AUDRALIA_HYDRATION_OCEANS_PARENT_AUTHORITY_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_HYDRATION_OCEANS_DEEP_OCEAN_CHILD_AUTHORITY_TNT_v1";
const FILE = "assets/audralia/audralia/hydration/oceans.render.js";
const DEEP_OCEAN_FILE = "assets/audralia/audralia/hydration/deep-ocean.render.js";
const DEEP_OCEAN_RECEIPT = "AUDRALIA_HYDRATION_DEEP_OCEAN_CHILD_AUTHORITY_TNT_v1";

const CONTRACT = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  role: "hydration-oceans-parent-authority",
  child: DEEP_OCEAN_RECEIPT,
  owns: Object.freeze([
    "ocean_water_surface",
    "shelf_water_surface",
    "coastal_water_surface",
    "open_ocean_surface",
    "deep_ocean_child_handoff",
    "trench_water_surface",
    "bathymetry_hydration_fields",
    "ocean_runtime_fields"
  ]),
  doesNotOwn: Object.freeze([
    "runtime_import",
    "route_rendering",
    "hex_rendering",
    "land_generation",
    "topology",
    "terrain",
    "climate",
    "hydration_parent",
    "gauges"
  ]),
  consumesDeepOceanChild: true,
  runtimeImport: false,
  routeRendering: false,
  landGeneration: false,
  waterGenerationOutsideTopologyVoid: false,
  topologyRewrite: false,
  terrainRewrite: false,
  climateRewrite: false,
  hydrationParentRewrite: false,
  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
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

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 27.31) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.000001, normalizer);
}

function readPoint(input, yInput) {
  if (input && typeof input === "object") {
    return Object.freeze({
      u: wrap01(
        Number.isFinite(input.u)
          ? input.u
          : Number.isFinite(input.x)
            ? input.x
            : Number.isFinite(input.lon)
              ? input.lon / 360 + 0.5
              : 0
      ),
      v: clamp(
        Number.isFinite(input.v)
          ? input.v
          : Number.isFinite(input.y)
            ? input.y
            : Number.isFinite(input.lat)
              ? 0.5 - input.lat / 180
              : 0,
        0,
        1
      )
    });
  }

  return Object.freeze({
    u: wrap01(input),
    v: clamp(yInput, 0, 1)
  });
}

function isLandLocked(sample) {
  return Boolean(
    sample &&
      (
        sample.isLand ||
        sample.land === true ||
        sample.visibleTerrainLand ||
        sample.landVisibleToRoute ||
        sample.isLandFootprint ||
        sample.isAboveWaterLandFootprint
      )
  );
}

function isSolidIce(sample) {
  return Boolean(
    sample &&
      (
        sample.isIce ||
        sample.isGlacier ||
        sample.isSnowpack ||
        sample.isPolarIceFootprint ||
        String(sample.waterClass || "").includes("glacier") ||
        String(sample.surfaceClass || "").includes("ice") ||
        String(sample.visualSurfaceClass || "").includes("ice")
      )
  );
}

function isTopologyVoidWaterSeat(sample) {
  if (!sample) return true;
  if (isLandLocked(sample)) return false;
  if (isSolidIce(sample)) return false;
  if (sample.solidSurfaceLand === true) return false;
  return true;
}

function sampleOcean(input, sampleInput, optionsInput) {
  const point = readPoint(input);
  const source = sampleInput && typeof sampleInput === "object" ? sampleInput : input && typeof input === "object" ? input : {};
  const options = optionsInput || {};

  const waterSeat = isTopologyVoidWaterSeat(source);

  const lon = point.u * 2 - 1;
  const lat = 1 - point.v * 2;

  const seaLevelDistance = clamp(Number(source.seaLevelDistance) || 0, -1, 1);

  const shelfBlueprint = waterSeat
    ? clamp(
        Number(source.shelfWaterIndex) ||
          Number(source.shelfDepthIndex) ||
          Number(source.shelfPressure) ||
          Number(source.coastalTurquoiseIndex) * 0.70 ||
          smoothstep(0.18, 0.02, Math.abs(seaLevelDistance)) * 0.82,
        0,
        1
      )
    : 0;

  const bathymetryNoise =
    fbm(lon * 5.8 + 3.0, lat * 5.8 - 1.7, 2101, 5) * 0.42 +
    fbm(lon * 14.0 - 6.2, lat * 10.0 + 5.1, 2131, 4) * 0.25 +
    fbm(lon * 33.0 + 8.3, lat * 26.0 - 4.4, 2161, 3) * 0.12;

  const oceanDepthIndex = waterSeat
    ? clamp(
        Number(source.oceanDepthIndex) ||
          Number(source.visibleWaterDepthIndex) ||
          Number(source.bathymetryHydrationIndex) ||
          Math.abs(seaLevelDistance) * 1.42 +
            bathymetryNoise * 0.34 -
            shelfBlueprint * 0.30,
        0,
        1
      )
    : 0;

  const trenchDepthIndex = waterSeat
    ? clamp(
        Number(source.trenchDepthIndex) ||
          Number(source.trenchHydrationIndex) ||
          smoothstep(0.72, 0.98, bathymetryNoise) * (1 - shelfBlueprint),
        0,
        1
      )
    : 0;

  const coastalTurquoiseIndex = waterSeat
    ? clamp(
        Number(source.coastalTurquoiseIndex) ||
          Number(source.coastalShelfBlueIndex) ||
          shelfBlueprint * 0.78 +
            (1 - oceanDepthIndex) * 0.16,
        0,
        1
      )
    : 0;

  const isShelfWater = waterSeat && shelfBlueprint > 0.28;
  const isCoastalWater = waterSeat && coastalTurquoiseIndex > 0.48;
  const isTrenchWater = waterSeat && trenchDepthIndex > 0.46;

  const openOceanIndex = waterSeat
    ? clamp((1 - shelfBlueprint) * 0.72 + oceanDepthIndex * 0.18, 0, 1)
    : 0;

  const surfaceWaterIndex = waterSeat
    ? clamp(0.64 + shelfBlueprint * 0.24 + oceanDepthIndex * 0.10, 0, 1)
    : 0;

  const baseWaterClass =
    !waterSeat
      ? String(source.waterClass || "not_ocean_water")
      : isTrenchWater
        ? "trench_water"
        : isShelfWater
          ? "shelf_water"
          : isCoastalWater
            ? "coastal_water"
            : "ocean_water";

  const oceanSample = Object.freeze({
    ...source,

    oceanReceipt: RECEIPT,
    oceanActiveRenewal: ACTIVE_RENEWAL,
    deepOceanChildReceipt: DEEP_OCEAN_RECEIPT,
    deepOceanChildFile: DEEP_OCEAN_FILE,

    u: point.u,
    v: point.v,

    isWater: waterSeat,
    isOceanWater: waterSeat,
    waterVisibleToRoute: waterSeat,

    isShelfWater,
    isCoastalWater,
    isTrenchWater,

    waterClass: baseWaterClass,
    oceanWaterClass: baseWaterClass,

    oceanDepthIndex,
    visibleWaterDepthIndex: oceanDepthIndex,
    bathymetryHydrationIndex: oceanDepthIndex,
    basinDepthIndex: oceanDepthIndex,

    shelfWaterIndex: shelfBlueprint,
    shelfDepthIndex: shelfBlueprint,
    shelfPressure: shelfBlueprint,

    coastalTurquoiseIndex,
    coastalShelfBlueIndex: coastalTurquoiseIndex,

    trenchDepthIndex,
    trenchHydrationIndex: trenchDepthIndex,

    openOceanIndex,
    surfaceWaterIndex,

    oceanColorInfluence: Object.freeze({
      r: isTrenchWater ? 4 : isShelfWater ? 42 : 14,
      g: isTrenchWater ? 34 : isShelfWater ? 166 : 88,
      b: isTrenchWater ? 94 : isShelfWater ? 192 : 158,
      a: waterSeat ? clamp(0.16 + surfaceWaterIndex * 0.18, 0, 0.36) : 0
    }),

    oceansMayFillOnlyTopologyVoid: true,
    landGeneration: false,
    waterGenerationOutsideTopologyVoid: false,
    runtimeImport: false,
    routeRendering: false,
    topologyRewrite: false,
    terrainRewrite: false,
    climateRewrite: false,
    hydrationParentRewrite: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });

  return applyDeepOceanToSample(oceanSample, options.deepOcean || options);
}

function applyOceanToSample(sample, options) {
  return sampleOcean(sample, sample, options);
}

function decorateHydrationSample(sample, options) {
  return applyOceanToSample(sample, options);
}

function buildOceanField(width, height, sampleSource, options) {
  const w = clamp(Math.floor(Number(width) || 192), 16, 1024);
  const h = clamp(Math.floor(Number(height) || 96), 8, 512);
  const samples = new Array(w * h);

  let oceanSamples = 0;
  let shelfSamples = 0;
  let coastalSamples = 0;
  let deepOceanSamples = 0;
  let abyssalDeepOceanSamples = 0;
  let trenchSamples = 0;
  let waterSamples = 0;
  let nonWaterSamples = 0;

  let maxDepth = 0;
  let maxDeepOceanBlend = 0;
  let maxTurquoise = 0;

  for (let y = 0; y < h; y += 1) {
    const v = h <= 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w <= 1 ? 0.5 : x / (w - 1);
      const base =
        typeof sampleSource === "function"
          ? sampleSource(u, v)
          : { u, v, isWater: true };

      const sample = sampleOcean({ u, v }, base, options);
      const index = y * w + x;

      samples[index] = sample;

      if (sample.isOceanWater) oceanSamples += 1;
      if (sample.isWater) waterSamples += 1;
      else nonWaterSamples += 1;

      if (sample.isShelfWater) shelfSamples += 1;
      if (sample.isCoastalWater) coastalSamples += 1;
      if (sample.isDeepOcean) deepOceanSamples += 1;
      if (sample.isAbyssalDeepOcean) abyssalDeepOceanSamples += 1;
      if (sample.isTrenchWater) trenchSamples += 1;

      maxDepth = Math.max(maxDepth, Number(sample.deepOceanDepthIndex) || Number(sample.oceanDepthIndex) || 0);
      maxDeepOceanBlend = Math.max(maxDeepOceanBlend, Number(sample.deepOceanBlendIndex) || 0);
      maxTurquoise = Math.max(maxTurquoise, Number(sample.coastalTurquoiseIndex) || 0);
    }
  }

  const total = Math.max(1, samples.length);

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    deepOceanChildReceipt: DEEP_OCEAN_RECEIPT,
    width: w,
    height: h,
    samples,
    stats: Object.freeze({
      totalSamples: samples.length,
      oceanSamples,
      waterSamples,
      nonWaterSamples,
      shelfSamples,
      coastalSamples,
      deepOceanSamples,
      abyssalDeepOceanSamples,
      trenchSamples,

      oceanRatio: oceanSamples / total,
      waterRatio: waterSamples / total,
      shelfRatio: shelfSamples / total,
      coastalRatio: coastalSamples / total,
      deepOceanRatio: deepOceanSamples / total,
      abyssalDeepOceanRatio: abyssalDeepOceanSamples / total,
      trenchRatio: trenchSamples / total,

      maxDepth,
      maxDeepOceanBlend,
      maxTurquoise,

      consumesDeepOceanChild: true,
      runtimeImport: false,
      landGeneration: false,
      waterGenerationOutsideTopologyVoid: false,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    })
  });
}

function createAudraliaOceanRenderer(options) {
  const config = options || {};

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    deepOceanChildReceipt: DEEP_OCEAN_RECEIPT,
    contract: CONTRACT,
    sampleOcean(input, sample) {
      return sampleOcean(input, sample, config);
    },
    sampleAudraliaOcean(input, sample) {
      return sampleOcean(input, sample, config);
    },
    applyOceanToSample(sample) {
      return applyOceanToSample(sample, config);
    },
    decorateHydrationSample(sample) {
      return decorateHydrationSample(sample, config);
    },
    buildOceanField(width, height, sampleSource) {
      return buildOceanField(width, height, sampleSource, config);
    },
    getStatus
  });
}

function getStatus() {
  const deepOceanStatus = getDeepOceanStatus();

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    file: FILE,
    deepOceanFile: DEEP_OCEAN_FILE,
    deepOceanChildReceipt: DEEP_OCEAN_RECEIPT,
    deepOceanChildLoaded: Boolean(deepOceanStatus && deepOceanStatus.ok),
    deepOceanChildActiveRenewal: deepOceanStatus && deepOceanStatus.activeRenewal ? deepOceanStatus.activeRenewal : "",
    contract: CONTRACT,
    role: "hydration-oceans-parent-authority",
    consumesDeepOceanChild: true,
    runtimeImport: false,
    landGeneration: false,
    waterGenerationOutsideTopologyVoid: false,
    topologyRewrite: false,
    terrainRewrite: false,
    climateRewrite: false,
    hydrationParentRewrite: false,
    routeRendering: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    api: Object.freeze({
      sampleOcean: true,
      sampleAudraliaOcean: true,
      applyOceanToSample: true,
      decorateHydrationSample: true,
      buildOceanField: true,
      createAudraliaOceanRenderer: true,
      getStatus: true
    })
  });
}

const api = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  deepOceanChildReceipt: DEEP_OCEAN_RECEIPT,
  contract: CONTRACT,
  sampleOcean,
  sampleAudraliaOcean: sampleOcean,
  sampleDeepOcean,
  applyOceanToSample,
  decorateHydrationSample,
  buildOceanField,
  createAudraliaOceanRenderer,
  getStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaOceansRender = api;
  window.AudraliaOceansRender = api;
  window.audraliaOceansRender = api;
}

export {
  RECEIPT,
  ACTIVE_RENEWAL,
  DEEP_OCEAN_RECEIPT,
  CONTRACT,
  sampleOcean,
  sampleOcean as sampleAudraliaOcean,
  sampleDeepOcean,
  applyOceanToSample,
  decorateHydrationSample,
  buildOceanField,
  createAudraliaOceanRenderer,
  getStatus
};

export default api;
