// assets/audralia/audralia/hydration/deep-ocean.render.js
// AUDRALIA_HYDRATION_DEEP_OCEAN_CHILD_AUTHORITY_TNT_v1
//
// Active renewal:
// - AUDRALIA_HYDRATION_OCEANS_DEEP_OCEAN_CHILD_AUTHORITY_TNT_v1
//
// Role:
// - Audralia hydration child authority for DeepOcean.
// - Defines DeepOcean as feathered depth inside the ocean system.
// - Does not render.
// - Does not import runtime.
// - Does not create land.
// - Does not create water.
// - Does not mutate topology, terrain, climate, hydration parent, route, gauges, or showroom files.

const RECEIPT = "AUDRALIA_HYDRATION_DEEP_OCEAN_CHILD_AUTHORITY_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_HYDRATION_OCEANS_DEEP_OCEAN_CHILD_AUTHORITY_TNT_v1";
const FILE = "assets/audralia/audralia/hydration/deep-ocean.render.js";
const PARENT_OCEANS_FILE = "assets/audralia/audralia/hydration/oceans.render.js";

const CONTRACT = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  role: "hydration-deep-ocean-child-authority",
  owns: Object.freeze([
    "deep_ocean_depth_index",
    "abyssal_deep_ocean_depth_index",
    "deep_ocean_blend_index",
    "deep_ocean_feather_index",
    "deep_ocean_water_class",
    "deep_ocean_runtime_fields"
  ]),
  doesNotOwn: Object.freeze([
    "runtime_import",
    "route_rendering",
    "hex_rendering",
    "land_generation",
    "water_generation",
    "topology",
    "terrain",
    "climate",
    "hydration_parent",
    "gauges"
  ]),
  runtimeImport: false,
  routeRendering: false,
  landGeneration: false,
  waterGeneration: false,
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 31.19) * amplitude;
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

function isOceanCandidate(sample) {
  if (!sample) return false;
  if (isLandLocked(sample)) return false;
  if (isSolidIce(sample)) return false;

  return Boolean(
    sample.isOceanWater ||
      sample.isWater ||
      sample.waterVisibleToRoute ||
      String(sample.waterClass || "").includes("ocean") ||
      String(sample.surfaceClass || "").includes("ocean") ||
      String(sample.visualSurfaceClass || "").includes("ocean") ||
      Number(sample.oceanDepthIndex) > 0 ||
      Number(sample.visibleWaterDepthIndex) > 0 ||
      Number(sample.bathymetryHydrationIndex) > 0
  );
}

function sampleDeepOcean(input, sampleInput, optionsInput) {
  const point = readPoint(input);
  const source = sampleInput && typeof sampleInput === "object" ? sampleInput : input && typeof input === "object" ? input : {};
  const options = optionsInput || {};

  const oceanCandidate = isOceanCandidate(source);

  const baseDepth = clamp(
    Number(source.oceanDepthIndex) ||
      Number(source.visibleWaterDepthIndex) ||
      Number(source.bathymetryHydrationIndex) ||
      Number(source.basinDepthIndex) ||
      Number(source.depth) ||
      0,
    0,
    1
  );

  const shelfIndex = clamp(
    Number(source.shelfWaterIndex) ||
      Number(source.shelfDepthIndex) ||
      Number(source.shelfPressure) ||
      Number(source.coastalTurquoiseIndex) * 0.70 ||
      0,
    0,
    1
  );

  const trenchIndex = clamp(
    Number(source.trenchDepthIndex) ||
      Number(source.trenchHydrationIndex) ||
      0,
    0,
    1
  );

  const latitude = 1 - point.v * 2;
  const longitude = point.u * 2 - 1;

  const sphericalDepthBreak =
    fbm(longitude * 5.0 + 2.7, latitude * 5.0 - 4.1, 4101, 4) * 0.46 +
    fbm(longitude * 13.0 - 6.2, latitude * 9.0 + 3.5, 4129, 4) * 0.25 +
    fbm(longitude * 29.0 + 1.8, latitude * 19.0 - 7.4, 4153, 3) * 0.12;

  const shelfRestraint = clamp(shelfIndex * 0.76, 0, 0.82);
  const trenchBoost = clamp(trenchIndex * 0.24, 0, 0.24);

  const depthIndex = oceanCandidate
    ? clamp(
        baseDepth * 0.72 +
          sphericalDepthBreak * 0.22 +
          trenchBoost -
          shelfRestraint,
        0,
        1
      )
    : 0;

  const deepOceanIndex = oceanCandidate ? smoothstep(0.42, 0.82, depthIndex) : 0;
  const abyssalDeepOceanIndex = oceanCandidate ? smoothstep(0.72, 0.98, depthIndex) : 0;

  const featherIndex = oceanCandidate
    ? clamp(
        deepOceanIndex *
          (1 - shelfIndex * 0.72) *
          (0.78 + sphericalDepthBreak * 0.22),
        0,
        1
      )
    : 0;

  const blendCap = clamp(Number(options.maxDeepOceanBlend) || 0.42, 0.18, 0.56);

  const blendIndex = clamp(
    featherIndex * 0.44 + abyssalDeepOceanIndex * 0.14,
    0,
    blendCap
  );

  const className =
    !oceanCandidate
      ? "not_ocean_water"
      : abyssalDeepOceanIndex > 0.54
        ? "abyssal_deep_ocean_water"
        : deepOceanIndex > 0.34
          ? "deep_ocean_water"
          : "open_ocean_water";

  return Object.freeze({
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    file: FILE,
    parentOceansFile: PARENT_OCEANS_FILE,

    u: point.u,
    v: point.v,

    oceanCandidate,
    isDeepOcean: oceanCandidate && deepOceanIndex > 0.34,
    isAbyssalDeepOcean: oceanCandidate && abyssalDeepOceanIndex > 0.54,
    isOceanDepthField: oceanCandidate,

    waterClass: className,
    oceanDepthClass: className,

    oceanDepthIndex: baseDepth,
    deepOceanDepthIndex: depthIndex,
    deepOceanIndex,
    abyssalDeepOceanIndex,
    deepOceanFeatherIndex: featherIndex,
    deepOceanBlendIndex: blendIndex,
    sphericalDepthBreakIndex: sphericalDepthBreak,

    deepOceanColorInfluence: Object.freeze({
      r: 5,
      g: 50,
      b: 116,
      a: blendIndex
    }),

    abyssalDeepOceanColorInfluence: Object.freeze({
      r: 2,
      g: 28,
      b: 82,
      a: clamp(abyssalDeepOceanIndex * 0.22, 0, 0.22)
    }),

    shelfRestraintIndex: shelfRestraint,
    trenchBoostIndex: trenchBoost,

    runtimeImport: false,
    landGeneration: false,
    waterGeneration: false,
    topologyRewrite: false,
    terrainRewrite: false,
    climateRewrite: false,
    hydrationParentRewrite: false,
    routeRendering: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

function applyDeepOceanToSample(sample, options) {
  const source = sample && typeof sample === "object" ? sample : {};
  const deep = sampleDeepOcean(source, source, options);

  if (!deep.oceanCandidate) {
    return Object.freeze({
      ...source,
      deepOceanReceipt: RECEIPT,
      deepOceanActiveRenewal: ACTIVE_RENEWAL,
      deepOceanCandidate: false,
      isDeepOcean: false,
      isAbyssalDeepOcean: false,
      deepOceanBlendIndex: 0,
      runtimeImport: false,
      landGeneration: false,
      waterGeneration: false,
      graphicBox: false,
      imageGeneration: false,
      visualPassClaimed: false
    });
  }

  return Object.freeze({
    ...source,

    deepOceanReceipt: RECEIPT,
    deepOceanActiveRenewal: ACTIVE_RENEWAL,

    isDeepOcean: deep.isDeepOcean,
    isAbyssalDeepOcean: deep.isAbyssalDeepOcean,
    isOceanDepthField: true,

    waterClass: deep.waterClass,
    oceanDepthClass: deep.oceanDepthClass,

    deepOceanDepthIndex: deep.deepOceanDepthIndex,
    deepOceanIndex: deep.deepOceanIndex,
    abyssalDeepOceanIndex: deep.abyssalDeepOceanIndex,
    deepOceanFeatherIndex: deep.deepOceanFeatherIndex,
    deepOceanBlendIndex: deep.deepOceanBlendIndex,
    sphericalDepthBreakIndex: deep.sphericalDepthBreakIndex,

    deepOceanColorInfluence: deep.deepOceanColorInfluence,
    abyssalDeepOceanColorInfluence: deep.abyssalDeepOceanColorInfluence,

    runtimeImport: false,
    landGeneration: false,
    waterGeneration: false,
    topologyRewrite: false,
    terrainRewrite: false,
    climateRewrite: false,
    hydrationParentRewrite: false,
    routeRendering: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

function decorateOceanSample(sample, options) {
  return applyDeepOceanToSample(sample, options);
}

function getStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    file: FILE,
    parentOceansFile: PARENT_OCEANS_FILE,
    contract: CONTRACT,
    role: "hydration-deep-ocean-child-authority",
    runtimeImport: false,
    landGeneration: false,
    waterGeneration: false,
    topologyRewrite: false,
    terrainRewrite: false,
    climateRewrite: false,
    hydrationParentRewrite: false,
    routeRendering: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false,
    api: Object.freeze({
      sampleDeepOcean: true,
      sampleAudraliaDeepOcean: true,
      applyDeepOceanToSample: true,
      decorateOceanSample: true,
      getStatus: true
    })
  });
}

const api = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  contract: CONTRACT,
  sampleDeepOcean,
  sampleAudraliaDeepOcean: sampleDeepOcean,
  applyDeepOceanToSample,
  decorateOceanSample,
  getStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaDeepOceanRender = api;
  window.AudraliaDeepOceanRender = api;
  window.audraliaDeepOceanRender = api;
}

export {
  RECEIPT,
  ACTIVE_RENEWAL,
  CONTRACT,
  sampleDeepOcean,
  sampleDeepOcean as sampleAudraliaDeepOcean,
  applyDeepOceanToSample,
  decorateOceanSample,
  getStatus
};

export default api;
