// /showroom/globe/audralia/audralia.deep-ocean.surface.js
// AUDRALIA_DEEP_OCEAN_SURFACE_CHILD_TNT_v1
//
// Role:
// - Child helper for Audralia route hex surface renderer.
// - Separates ocean, shelf/coastal water, deep ocean, and abyssal deep ocean visually.
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
const PARENT_RECEIPT = "AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TNT_v1";
const ALIGNMENT_RECEIPT = "AUDRALIA_G8_HEX_CHILD_SPHERICAL_BANDING_REDUCTION_TNT_v1";

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

function isWaterColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return b > r * 1.04 && g > r * 0.70 && !isLandColor(color);
}

function isShelfColor(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;

  return isWaterColor(color) && g > 88 && b > 104 && Math.abs(g - b) < 82;
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
      gradient: 0
    };
  }

  const dx = 2 / Math.max(8, texture.width || 1024);
  const dy = 2 / Math.max(8, texture.height || 512);

  const samples = [
    sampleTexture(texture, u - dx, v),
    sampleTexture(texture, u + dx, v),
    sampleTexture(texture, u, v - dy),
    sampleTexture(texture, u, v + dy),
    sampleTexture(texture, u - dx, v - dy),
    sampleTexture(texture, u + dx, v + dy)
  ];

  let landContact = 0;
  let shelfContact = 0;
  let waterContact = 0;
  let gradient = 0;
  const center = sampleTexture(texture, u, v);
  const centerLuma = colorLuma(center);

  samples.forEach(function (sample) {
    if (isLandColor(sample)) landContact += 1;
    if (isShelfColor(sample)) shelfContact += 1;
    if (isWaterColor(sample)) waterContact += 1;
    gradient += Math.abs(colorLuma(sample) - centerLuma);
  });

  return {
    landContact: landContact / samples.length,
    shelfContact: shelfContact / samples.length,
    waterContact: waterContact / samples.length,
    gradient: clamp(gradient / samples.length * 4.2, 0, 1)
  };
}

function classifyOceanDepth(color, texture, u, v, context) {
  const water = isWaterColor(color);
  const shelf = isShelfColor(color);
  const luma = colorLuma(color);
  const neighbor = waterNeighborSignal(texture, u, v);
  const latitude = Number(context && context.v) >= 0 ? Number(context.v) : v;

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
      neighbor
    };
  }

  const depthNoise =
    fbm(u * 9.0 + 1.7, v * 9.0 - 3.2, 7101, 4) * 0.46 +
    fbm(u * 27.0 - 5.4, v * 27.0 + 2.1, 7127, 3) * 0.20;

  const bandBreak =
    fbm(u * 18.0 + latitude * 3.1, v * 7.0 - 2.4, 7151, 3) * 0.16;

  const shelfIndex = clamp(
    (shelf ? 0.62 : 0) +
      neighbor.landContact * 0.36 +
      neighbor.shelfContact * 0.22 +
      (1 - luma) * 0.06,
    0,
    1
  );

  const depthIndex = clamp(
    (1 - luma) * 0.72 +
      depthNoise * 0.22 +
      bandBreak -
      shelfIndex * 0.34 -
      neighbor.landContact * 0.18,
    0,
    1
  );

  const abyssalDeepOcean = depthIndex > 0.72 && shelfIndex < 0.24;
  const deepOcean = !abyssalDeepOcean && depthIndex > 0.48 && shelfIndex < 0.42;
  const coastalOcean = shelfIndex >= 0.42;

  return {
    className: abyssalDeepOcean
      ? "abyssal_deep_ocean_surface"
      : deepOcean
        ? "deep_ocean_surface"
        : coastalOcean
          ? "shelf_coastal_ocean_surface"
          : "open_ocean_surface",
    water: true,
    shelf: coastalOcean,
    ocean: !coastalOcean,
    deepOcean,
    abyssalDeepOcean,
    shelfIndex,
    depthIndex,
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

  const openOcean = [8, 76, 142, result[3]];
  const deepOcean = [2, 34, 96, result[3]];
  const abyssal = [1, 18, 62, result[3]];
  const shelf = [40, 188, 202, result[3]];
  const shallowShelf = [72, 208, 210, result[3]];

  if (classification.abyssalDeepOcean) {
    result = mixColor(result, abyssal, 0.54 + classification.depthIndex * 0.22);
  } else if (classification.deepOcean) {
    result = mixColor(result, deepOcean, 0.42 + classification.depthIndex * 0.18);
  } else if (classification.shelf) {
    result = mixColor(result, shelf, 0.36 + classification.shelfIndex * 0.28);
    result = mixColor(result, shallowShelf, classification.neighbor.landContact * 0.16);
  } else {
    result = mixColor(result, openOcean, 0.30);
  }

  const breakNoise =
    fbm(u * 44.0 + 2.1, v * 23.0 - 1.4, 7193, 3) * 0.035 -
    fbm(u * 11.0 - 8.0, v * 29.0 + 4.1, 7211, 3) * 0.028;

  const depthShade = clamp(
    1 +
      breakNoise -
      classification.depthIndex * 0.08 +
      classification.shelfIndex * 0.06,
    0.78,
    1.12
  );

  result[0] = clamp(Math.round(result[0] * depthShade), 0, 255);
  result[1] = clamp(Math.round(result[1] * depthShade), 0, 255);
  result[2] = clamp(Math.round(result[2] * depthShade), 0, 255);

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
    parentReceipt: PARENT_RECEIPT,
    alignmentReceipt: ALIGNMENT_RECEIPT,
    role: "deep-ocean-visual-separation-child",
    owns: Object.freeze([
      "ocean_visual_classification",
      "deep_ocean_visual_classification",
      "shelf_coastal_visual_classification",
      "water_depth_color_separation"
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
  PARENT_RECEIPT,
  ALIGNMENT_RECEIPT,
  applyAudraliaOceanDepthSeparation,
  getAudraliaDeepOceanStatus
};

export default api;
