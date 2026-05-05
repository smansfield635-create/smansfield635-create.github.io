// /showroom/globe/audralia/audralia.deep-ocean.surface.js
// AUDRALIA_DEEP_OCEAN_SURFACE_CHILD_TNT_v1
//
// Active renewal:
// - AUDRALIA_DEEP_OCEAN_FEATHERED_DEPTH_BLEND_TNT_v1
//
// Role:
// - Child helper for Audralia route hex surface renderer.
// - Separates normal ocean, shelf/coastal water, deep ocean, and abyssal depth visually.
// - Represents DeepOcean as feathered water-depth variation, not a separate hard object.
// - Receives parent-provided texture color only.
// - Does not import runtime.
// - Does not create water.
// - Does not create land.
// - Does not mutate topology, terrain, hydration, climate, route, gauges, or runtime.
//
// Hard locks:
// - No runtime import.
// - No land generation.
// - No water generation.
// - No topology rewrite.
// - No terrain rewrite.
// - No hydration rewrite.
// - No climate rewrite.
// - No route boot ownership.
// - No graphic box.
// - No image generation.
// - No visual pass claim.

const RECEIPT = "AUDRALIA_DEEP_OCEAN_SURFACE_CHILD_TNT_v1";
const ACTIVE_RENEWAL = "AUDRALIA_DEEP_OCEAN_FEATHERED_DEPTH_BLEND_TNT_v1";
const PARENT_RECEIPT = "AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TNT_v1";
const ALIGNMENT_RECEIPT = "AUDRALIA_G8_HEX_CHILD_DEEP_OCEAN_SEPARATION_TNT_v1";

const LIMITS = Object.freeze({
  maxDeepDarkening: 0.32,
  maxAbyssalDarkening: 0.38,
  maxShelfBrightening: 0.28,
  maxOpenOceanShift: 0.18,
  hardBandSuppression: true,
  thresholdCliffSuppression: true,
  featheredBlend: true
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
    total += valueNoise(x * frequency, y * frequency, seed + i * 29.31) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / Math.max(0.000001, normalizer);
}

function colorLuma(color) {
  return (
    (Number(color[0]) || 0) * 0.2126 +
    (Number(color[1]) || 0) * 0.7152 +
    (Number(color[2]) || 0) * 0.0722
  ) / 255;
}

function mixColor(base, overlay, amount) {
  const t = clamp(amount, 0, 1);

  return [
    clamp(Math.round(mix(base[0], overlay[0], t)), 0, 255),
    clamp(Math.round(mix(base[1], overlay[1], t)), 0, 255),
    clamp(Math.round(mix(base[2], overlay[2], t)), 0, 255),
    base[3] === undefined ? 255 : base[3]
  ];
}

function isLandColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return r >= 92 && r >= g * 0.88 && r > b * 1.12;
}

function isIceOrHighlightColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return r > 185 && g > 185 && b > 185;
}

function isWaterColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return b > r * 1.03 && g > r * 0.68 && !isLandColor(color) && !isIceOrHighlightColor(color);
}

function isShelfColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return isWaterColor(color) && g > 82 && b > 98 && Math.abs(g - b) < 90;
}

function sampleTexture(texture, u, v) {
  const width = texture && texture.width ? texture.width : 1;
  const height = texture && texture.height ? texture.height : 1;
  const data = texture && texture.data ? texture.data : null;

  if (!data) return [10, 66, 124, 255];

  const tx = Math.floor(wrap01(u) * (width - 1));
  const ty = Math.floor(clamp(v, 0, 1) * (height - 1));
  const index = (ty * width + tx) * 4;

  return [
    data[index] || 0,
    data[index + 1] || 0,
    data[index + 2] || 0,
    data[index + 3] === undefined ? 255 : data[index + 3]
  ];
}

function waterNeighborSignal(texture, u, v) {
  if (!texture || !texture.data) {
    return {
      landContact: 0,
      shelfContact: 0,
      waterContact: 0,
      deepContact: 0,
      gradient: 0
    };
  }

  const dx = 2 / Math.max(8, texture.width || 1024);
  const dy = 2 / Math.max(8, texture.height || 512);

  const center = sampleTexture(texture, u, v);
  const centerLuma = colorLuma(center);

  const samples = [
    sampleTexture(texture, u - dx, v),
    sampleTexture(texture, u + dx, v),
    sampleTexture(texture, u, v - dy),
    sampleTexture(texture, u, v + dy),
    sampleTexture(texture, u - dx, v - dy),
    sampleTexture(texture, u + dx, v - dy),
    sampleTexture(texture, u - dx, v + dy),
    sampleTexture(texture, u + dx, v + dy)
  ];

  let landContact = 0;
  let shelfContact = 0;
  let waterContact = 0;
  let deepContact = 0;
  let gradient = 0;

  samples.forEach(function (sample) {
    const sampleLuma = colorLuma(sample);

    if (isLandColor(sample)) landContact += 1;
    if (isShelfColor(sample)) shelfContact += 1;
    if (isWaterColor(sample)) waterContact += 1;
    if (isWaterColor(sample) && sampleLuma < 0.22) deepContact += 1;

    gradient += Math.abs(sampleLuma - centerLuma);
  });

  return {
    landContact: landContact / samples.length,
    shelfContact: shelfContact / samples.length,
    waterContact: waterContact / samples.length,
    deepContact: deepContact / samples.length,
    gradient: clamp(gradient / samples.length * 4.2, 0, 1)
  };
}

function sphericalBreakField(u, v, context) {
  const phase = Number(context && context.phase) || 0;
  const lon = wrap01(u + phase * 0.03) * 2 - 1;
  const lat = 1 - clamp(v, 0, 1) * 2;

  const broad =
    fbm(lon * 5.2 + 1.7, lat * 5.2 - 3.2, 7101, 4) * 0.50 +
    fbm(lon * 11.0 - 4.6, lat * 7.0 + 2.4, 7139, 4) * 0.25;

  const fine =
    fbm(lon * 24.0 + 5.1, lat * 16.0 - 8.0, 7177, 3) * 0.16 +
    fbm(lon * 47.0 - 2.3, lat * 31.0 + 6.9, 7193, 2) * 0.09;

  return clamp(broad + fine, 0, 1);
}

function classifyOceanDepth(color, texture, u, v, context) {
  const water = isWaterColor(color);
  const shelf = isShelfColor(color);
  const luma = colorLuma(color);
  const neighbor = waterNeighborSignal(texture, u, v);
  const breakField = sphericalBreakField(u, v, context);

  if (!water) {
    return {
      className: "land_or_ice_surface",
      water: false,
      shelf: false,
      ocean: false,
      deepOcean: false,
      abyssalDeepOcean: false,
      shelfIndex: 0,
      depthIndex: 0,
      featherIndex: 0,
      darkeningIndex: 0,
      neighbor
    };
  }

  const shelfIndex = clamp(
    (shelf ? 0.52 : 0) +
      neighbor.landContact * 0.42 +
      neighbor.shelfContact * 0.28 +
      (1 - luma) * 0.04,
    0,
    1
  );

  const rawDepthIndex = clamp(
    (1 - luma) * 0.64 +
      breakField * 0.24 +
      neighbor.deepContact * 0.14 -
      shelfIndex * 0.42 -
      neighbor.landContact * 0.22,
    0,
    1
  );

  const featherIndex = smoothstep(0.30, 0.92, rawDepthIndex);
  const darkeningIndex = clamp(
    featherIndex *
      (1 - shelfIndex * 0.78) *
      (1 - neighbor.landContact * 0.70) *
      (0.76 + breakField * 0.24),
    0,
    1
  );

  const shelfFeather = smoothstep(0.18, 0.86, shelfIndex);
  const abyssalDeepOcean = darkeningIndex > 0.76 && shelfIndex < 0.20;
  const deepOcean = darkeningIndex > 0.38 && shelfIndex < 0.44;
  const coastalOcean = shelfFeather > 0.36;

  return {
    className: abyssalDeepOcean
      ? "feathered_abyssal_depth_water"
      : deepOcean
        ? "feathered_deep_ocean_water"
        : coastalOcean
          ? "feathered_shelf_coastal_water"
          : "open_ocean_water",
    water: true,
    shelf: coastalOcean,
    ocean: !coastalOcean,
    deepOcean,
    abyssalDeepOcean,
    shelfIndex,
    depthIndex: rawDepthIndex,
    featherIndex,
    darkeningIndex,
    breakField,
    neighbor
  };
}

function applyAudraliaOceanDepthSeparation(color, texture, u, v, context = {}) {
  const classification = classifyOceanDepth(color, texture, u, v, context);

  if (!classification.water) {
    return Object.freeze({
      color,
      classification,
      changed: false
    });
  }

  let result = color.slice(0, 4);

  const openOcean = [8, 78, 148, result[3]];
  const softDeepOcean = [7, 52, 118, result[3]];
  const featheredAbyssal = [5, 38, 94, result[3]];
  const shelfWater = [42, 180, 196, result[3]];
  const brightShelfWater = [66, 204, 207, result[3]];

  const shelfBlend = clamp(
    classification.shelfIndex * LIMITS.maxShelfBrightening,
    0,
    LIMITS.maxShelfBrightening
  );

  const deepBlend = clamp(
    classification.darkeningIndex * LIMITS.maxDeepDarkening,
    0,
    LIMITS.maxDeepDarkening
  );

  const abyssalBlend = clamp(
    smoothstep(0.70, 1.0, classification.darkeningIndex) * LIMITS.maxAbyssalDarkening,
    0,
    LIMITS.maxAbyssalDarkening
  );

  const openBlend = clamp(
    (1 - classification.shelfIndex) *
      (1 - classification.darkeningIndex) *
      LIMITS.maxOpenOceanShift,
    0,
    LIMITS.maxOpenOceanShift
  );

  result = mixColor(result, openOcean, openBlend);

  if (classification.shelfIndex > 0.16) {
    result = mixColor(result, shelfWater, shelfBlend);
    result = mixColor(
      result,
      brightShelfWater,
      clamp(classification.neighbor.landContact * 0.10 + classification.shelfIndex * 0.08, 0, 0.16)
    );
  }

  if (classification.darkeningIndex > 0.12) {
    result = mixColor(result, softDeepOcean, deepBlend);
  }

  if (classification.darkeningIndex > 0.70 && classification.shelfIndex < 0.24) {
    result = mixColor(result, featheredAbyssal, abyssalBlend);
  }

  const antiBandNoise =
    (classification.breakField - 0.5) * 0.030 +
    (fbm(u * 31.0 + 8.0, v * 19.0 - 6.0, 7291, 3) - 0.5) * 0.026;

  const seamFeather = clamp(
    1 -
      classification.neighbor.gradient * 0.035 -
      classification.darkeningIndex * 0.035 +
      classification.shelfIndex * 0.030 +
      antiBandNoise,
    0.86,
    1.08
  );

  result[0] = clamp(Math.round(result[0] * seamFeather), 0, 255);
  result[1] = clamp(Math.round(result[1] * seamFeather), 0, 255);
  result[2] = clamp(Math.round(result[2] * seamFeather), 0, 255);

  return Object.freeze({
    color: result,
    classification,
    changed: true
  });
}

function getAudraliaDeepOceanStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    activeRenewal: ACTIVE_RENEWAL,
    parentReceipt: PARENT_RECEIPT,
    alignmentReceipt: ALIGNMENT_RECEIPT,
    role: "deep-ocean-feathered-depth-blend-child",
    owns: Object.freeze([
      "ocean_visual_classification",
      "deep_ocean_feathered_visual_classification",
      "shelf_coastal_visual_classification",
      "water_depth_color_blending",
      "deep_ocean_hard_band_suppression",
      "threshold_cliff_suppression"
    ]),
    doesNotOwn: Object.freeze([
      "runtime_import",
      "land_generation",
      "water_generation",
      "topology",
      "terrain",
      "hydration",
      "climate",
      "route_boot",
      "gauges"
    ]),
    limits: LIMITS,
    runtimeImport: false,
    landGeneration: false,
    waterGeneration: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  receipt: RECEIPT,
  activeRenewal: ACTIVE_RENEWAL,
  parentReceipt: PARENT_RECEIPT,
  alignmentReceipt: ALIGNMENT_RECEIPT,
  applyAudraliaOceanDepthSeparation,
  getAudraliaDeepOceanStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaDeepOceanSurface = api;
}

export {
  RECEIPT,
  ACTIVE_RENEWAL,
  PARENT_RECEIPT,
  ALIGNMENT_RECEIPT,
  applyAudraliaOceanDepthSeparation,
  getAudraliaDeepOceanStatus
};

export default api;
