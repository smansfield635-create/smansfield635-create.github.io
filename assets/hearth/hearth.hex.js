// /assets/audralia/audralia.hex.surface.js
// AUDRALIA_HEX_SURFACE_HIGH_DENSITY_OVERLAP_SEEDED_VARIATION_TNT_v5
// Full-file replacement.
// Purpose:
// - Renew Audralia's high-density hex surface using the Hearth cross-adoption lesson.
// - Preserve Audralia parent authority, relief grandchild authority, and planet identity.
// - Keep high-density hex surface rendering.
// - Correct visual sampling so raw sphere position owns visual continuity.
// - Hex center owns influence, edge behavior, micro seeds, seam pressure, and relief modulation.
// - Child expresses parent fields and grandchild relief overlays.
// - Child does not create land/water/world truth.
// - Child must not import runtime.
// - Child must not overwrite parent classification.
// - Grandchild is relief-only.
// - No GraphicBox. No image generation. No visual-pass claim.

import {
  refineAudraliaReliefSample,
  getAudraliaReliefSurfaceStatus,
  AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE
} from "/assets/audralia/audralia.relief.surface.js";

const RECEIPT = "AUDRALIA_HEX_SURFACE_HIGH_DENSITY_OVERLAP_SEEDED_VARIATION_TNT_v5";
const PREVIOUS_RECEIPT = "AUDRALIA_HEX_SURFACE_CHILD_GRANDCHILD_RELIEF_BIND_TNT_v4";
const LEGACY_RECEIPT = "AUDRALIA_G7_HEX_SURFACE_CHILD_RENDERER_TNT_v1";
const PREVIOUS_ACTIVE_RENEWAL = "AUDRALIA_G9_HEX_CHILD_4K_MICRO_SURFACE_GLAZE_TNT_v1";
const COMPATIBILITY_RENEWAL = "AUDRALIA_G8_HEX_CHILD_GLOBAL_AQUEOUS_GLAZE_LAYER_TNT_v1";
const PARENT_REQUIRED_RECEIPT = "AUDRALIA_SURFACE_PARENT_COASTLINE_RIDGE_FEATHER_TNT_v6";
const PARENT_FALLBACK_RECEIPT = "AUDRALIA_SURFACE_PARENT_BASIN_RIDGE_DISTRIBUTION_TNT_v5";
const GRANDCHILD_RELIEF_RECEIPT = "AUDRALIA_GRANDCHILD_RELIEF_FIELD_EXPRESSOR_TNT_v1";
const CHILD_CONTRACT = "AUDRALIA_HEX_SURFACE_OVERLAP_SEEDED_VARIATION_CONTRACT_v1";

const REMOVED_STALE_RECEIPTS = Object.freeze([
  "AUDRALIA_G8_HEX_CHILD_DEEP_OCEAN_SEPARATION_TNT_v1",
  "AUDRALIA_DEEP_OCEAN_SURFACE_CHILD_TNT_v1",
  "AUDRALIA_DEEP_OCEAN_FEATHERED_DEPTH_BLEND_TNT_v1"
]);

const DEFAULTS = Object.freeze({
  radiusRatio: 0.405,
  hexDensity: 288,
  minHexRadius: 0.82,
  maxHexRadius: 3.10,
  edgeDarkening: 0.026,
  seamSoftening: 0.048,
  parentTextureBlend: 0.18,
  hexTextureInfluence: 0.12,
  rawContinuityStrength: 1,
  seededVariationStrength: 0.34,
  ridgeExpressionStrength: 0.50,
  mountainExpressionStrength: 0.44,
  coastlineExpressionStrength: 0.50,
  shelfExpressionStrength: 0.44,
  mineralExpressionStrength: 0.36,
  reliefGrandchildStrength: 0.64,
  microTerrainStrength: 0.42,
  waterVariationStrength: 0.24,
  asymmetryStrength: 0.22,
  atmosphereStrength: 1,
  lightX: -0.42,
  lightY: 0.36,
  lightZ: 0.83
});

const STATUS = {
  ok: true,
  receipt: RECEIPT,
  previousReceipt: PREVIOUS_RECEIPT,
  legacyReceipt: LEGACY_RECEIPT,
  previousActiveRenewal: PREVIOUS_ACTIVE_RENEWAL,
  compatibilityRenewal: COMPATIBILITY_RENEWAL,
  parentRequiredReceipt: PARENT_REQUIRED_RECEIPT,
  parentFallbackReceipt: PARENT_FALLBACK_RECEIPT,
  grandchildReliefReceipt: GRANDCHILD_RELIEF_RECEIPT,
  grandchildReliefImportedReceipt: AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE,
  childContract: CHILD_CONTRACT,

  role: "audralia-high-density-overlap-seeded-variation-parent-field-expressor",
  parentStandardRequired: true,
  childActivatedByParentContract: false,
  parentReceiptDetected: "",
  parentSurfaceSamplerDetected: false,
  grandchildReliefActivated: true,
  grandchildReliefStatus: getAudraliaReliefSurfaceStatus(),

  parentClassificationPreserved: true,
  downstreamClassificationOverrideAllowed: false,
  grandchildrenActivated: true,

  rawVisualContinuity: true,
  highDensityHexInfluence: true,
  overlappingHexFootprints: true,
  seededVariation: true,
  hexCenterVisualOverride: false,

  runtimeImport: false,
  runtimeAuthority: false,
  routeOwnedLandGeneration: false,
  routeOwnedWaterGeneration: false,

  hearthContractImported: false,
  hearthPlanetTruthImported: false,

  graphicBox: false,
  imageGeneration: false,
  visualPassClaimed: false
};

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function clamp01(value) {
  return clamp(value, 0, 1);
}

function mix(a, b, t) {
  return a + (b - a) * clamp01(t);
}

function wrap01(value) {
  return ((Number(value) % 1) + 1) % 1;
}

function fract(value) {
  return value - Math.floor(value);
}

function smoothstep(edge0, edge1, value) {
  const denominator = Math.max(0.000001, edge1 - edge0);
  const t = clamp01((value - edge0) / denominator);
  return t * t * (3 - 2 * t);
}

function hash2(x, y, seed) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function signedHash2(x, y, seed) {
  return hash2(x, y, seed) * 2 - 1;
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
  let amplitude = 0.52;
  let frequency = 1;
  let normalizer = 0;

  for (let index = 0; index < octaves; index += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + index * 29.37) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2.04;
  }

  return total / Math.max(0.000001, normalizer);
}

function cubeRound(q, r) {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  let rs = Math.round(s);

  const qDiff = Math.abs(rq - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(rs - s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  }

  return { q: rq, r: rr };
}

function nearestHexCenter(xPx, yPx, hexRadius) {
  const q = (Math.sqrt(3) / 3 * xPx - 1 / 3 * yPx) / hexRadius;
  const r = (2 / 3 * yPx) / hexRadius;
  const rounded = cubeRound(q, r);

  return {
    x: hexRadius * Math.sqrt(3) * (rounded.q + rounded.r / 2),
    y: hexRadius * 1.5 * rounded.r,
    q: rounded.q,
    r: rounded.r
  };
}

function hexDistance(localX, localY, hexRadius) {
  const q = (Math.sqrt(3) / 3 * localX - 1 / 3 * localY) / hexRadius;
  const r = (2 / 3 * localY) / hexRadius;
  const s = -q - r;

  return Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
}

function normalizeOptions(options = {}) {
  return Object.freeze({
    radiusRatio: clamp(Number(options.radiusRatio) || DEFAULTS.radiusRatio, 0.32, 0.48),
    hexDensity: clamp(Number(options.hexDensity) || DEFAULTS.hexDensity, 120, 520),
    minHexRadius: clamp(Number(options.minHexRadius) || DEFAULTS.minHexRadius, 0.55, 3),
    maxHexRadius: clamp(Number(options.maxHexRadius) || DEFAULTS.maxHexRadius, 1.4, 6),
    edgeDarkening: clamp(Number(options.edgeDarkening ?? DEFAULTS.edgeDarkening), 0, 0.18),
    seamSoftening: clamp(Number(options.seamSoftening ?? DEFAULTS.seamSoftening), 0, 0.18),
    parentTextureBlend: clamp(Number(options.parentTextureBlend ?? DEFAULTS.parentTextureBlend), 0, 0.48),
    hexTextureInfluence: clamp(Number(options.hexTextureInfluence ?? DEFAULTS.hexTextureInfluence), 0, 0.34),
    rawContinuityStrength: clamp(Number(options.rawContinuityStrength ?? DEFAULTS.rawContinuityStrength), 0.5, 1.2),
    seededVariationStrength: clamp(Number(options.seededVariationStrength ?? DEFAULTS.seededVariationStrength), 0, 0.72),
    ridgeExpressionStrength: clamp(Number(options.ridgeExpressionStrength ?? DEFAULTS.ridgeExpressionStrength), 0, 0.85),
    mountainExpressionStrength: clamp(Number(options.mountainExpressionStrength ?? DEFAULTS.mountainExpressionStrength), 0, 0.85),
    coastlineExpressionStrength: clamp(Number(options.coastlineExpressionStrength ?? DEFAULTS.coastlineExpressionStrength), 0, 0.9),
    shelfExpressionStrength: clamp(Number(options.shelfExpressionStrength ?? DEFAULTS.shelfExpressionStrength), 0, 0.9),
    mineralExpressionStrength: clamp(Number(options.mineralExpressionStrength ?? DEFAULTS.mineralExpressionStrength), 0, 0.75),
    reliefGrandchildStrength: clamp(Number(options.reliefGrandchildStrength ?? DEFAULTS.reliefGrandchildStrength), 0, 1),
    microTerrainStrength: clamp(Number(options.microTerrainStrength ?? DEFAULTS.microTerrainStrength), 0, 0.82),
    waterVariationStrength: clamp(Number(options.waterVariationStrength ?? DEFAULTS.waterVariationStrength), 0, 0.62),
    asymmetryStrength: clamp(Number(options.asymmetryStrength ?? DEFAULTS.asymmetryStrength), 0, 0.6),
    atmosphereStrength: clamp(Number(options.atmosphereStrength ?? DEFAULTS.atmosphereStrength), 0, 1.4),
    lightX: Number(options.lightX) || DEFAULTS.lightX,
    lightY: Number(options.lightY) || DEFAULTS.lightY,
    lightZ: Number(options.lightZ) || DEFAULTS.lightZ
  });
}

function sampleTexture(texture, u, v) {
  const width = texture && texture.width ? texture.width : 1;
  const height = texture && texture.height ? texture.height : 1;
  const data = texture && texture.data ? texture.data : null;

  if (!data) return [8, 45, 78, 255];

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

function sampleTextureBilinear(texture, u, v) {
  const width = texture && texture.width ? texture.width : 1;
  const height = texture && texture.height ? texture.height : 1;
  const data = texture && texture.data ? texture.data : null;

  if (!data || width < 2 || height < 2) return sampleTexture(texture, u, v);

  const x = wrap01(u) * (width - 1);
  const y = clamp(v, 0, 1) * (height - 1);

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = (x0 + 1) % width;
  const y1 = Math.min(height - 1, y0 + 1);

  const tx = x - x0;
  const ty = y - y0;

  const i00 = (y0 * width + x0) * 4;
  const i10 = (y0 * width + x1) * 4;
  const i01 = (y1 * width + x0) * 4;
  const i11 = (y1 * width + x1) * 4;

  const c00 = [data[i00] || 0, data[i00 + 1] || 0, data[i00 + 2] || 0, data[i00 + 3] === undefined ? 255 : data[i00 + 3]];
  const c10 = [data[i10] || 0, data[i10 + 1] || 0, data[i10 + 2] || 0, data[i10 + 3] === undefined ? 255 : data[i10 + 3]];
  const c01 = [data[i01] || 0, data[i01 + 1] || 0, data[i01 + 2] || 0, data[i01 + 3] === undefined ? 255 : data[i01 + 3]];
  const c11 = [data[i11] || 0, data[i11 + 1] || 0, data[i11 + 2] || 0, data[i11 + 3] === undefined ? 255 : data[i11 + 3]];

  return [
    clamp(Math.round(mix(mix(c00[0], c10[0], tx), mix(c01[0], c11[0], tx), ty)), 0, 255),
    clamp(Math.round(mix(mix(c00[1], c10[1], tx), mix(c01[1], c11[1], tx), ty)), 0, 255),
    clamp(Math.round(mix(mix(c00[2], c10[2], tx), mix(c01[2], c11[2], tx), ty)), 0, 255),
    clamp(Math.round(mix(mix(c00[3], c10[3], tx), mix(c01[3], c11[3], tx), ty)), 0, 255)
  ];
}

function mixColor(base, overlay, amount) {
  const t = clamp01(amount);

  return [
    clamp(Math.round(mix(base[0], overlay[0], t)), 0, 255),
    clamp(Math.round(mix(base[1], overlay[1], t)), 0, 255),
    clamp(Math.round(mix(base[2], overlay[2], t)), 0, 255),
    base[3] === undefined ? 255 : base[3]
  ];
}

function multiplyColor(color, amount) {
  return [
    clamp(Math.round(color[0] * amount), 0, 255),
    clamp(Math.round(color[1] * amount), 0, 255),
    clamp(Math.round(color[2] * amount), 0, 255),
    color[3] === undefined ? 255 : color[3]
  ];
}

function colorLuma(color) {
  return (
    (Number(color[0]) || 0) * 0.2126 +
    (Number(color[1]) || 0) * 0.7152 +
    (Number(color[2]) || 0) * 0.0722
  ) / 255;
}

function resolveParentSurfaceSampler(state) {
  const candidates = [
    state && state.surface && state.surface.sampleSurface,
    state && state.surface && state.surface.sampleAudraliaSurface,
    state && state.parentSurface && state.parentSurface.sampleSurface,
    state && state.parentSurface && state.parentSurface.sampleAudraliaSurface,
    state && state.parentSurfaceSampler,
    state && state.surfaceSampler,
    state && state.parent && state.parent.sampleSurface,
    state && state.parent && state.parent.sampleAudraliaSurface
  ];

  return candidates.find((candidate) => typeof candidate === "function") || null;
}

function resolveParentReceipt(state) {
  const candidates = [
    state && state.surfaceReceipt,
    state && state.parentSurfaceReceipt,
    state && state.surface && state.surface.AUDRALIA_SURFACE_RECEIPT_VALUE,
    state && state.surface && state.surface.default && state.surface.default.receipt,
    state && state.parentSurface && state.parentSurface.AUDRALIA_SURFACE_RECEIPT_VALUE,
    state && state.parentSurface && state.parentSurface.default && state.parentSurface.default.receipt,
    state && state.parent && state.parent.receipt
  ];

  return String(candidates.find((value) => typeof value === "string" && value.length) || "");
}

function isParentReceiptAccepted(receipt) {
  return receipt === PARENT_REQUIRED_RECEIPT || receipt === PARENT_FALLBACK_RECEIPT || receipt.includes("AUDRALIA_SURFACE_PARENT_");
}

function fallbackTextureClassification(color) {
  const r = Number(color[0]) || 0;
  const g = Number(color[1]) || 0;
  const b = Number(color[2]) || 0;
  const luma = colorLuma(color);

  const ice = r > 184 && g > 184 && b > 184;
  const water = b > r * 1.02 && g > r * 0.55;
  const shelf = water && g > 88 && b > 98 && Math.abs(g - b) < 112;
  const land = !ice && !water && r >= 50 && g >= 54;

  return {
    ok: true,
    receipt: "TEXTURE_FALLBACK_PARENT_UNAVAILABLE",
    visualSurfaceClass: ice
      ? "glacier_ice_snowpack_surface"
      : land
        ? "inland_terrain_land_surface"
        : shelf
          ? "shelf_water_surface"
          : "ocean_water_surface",
    ice,
    glacier: ice,
    liquidWater: water,
    water,
    shelf,
    ocean: water && !shelf,
    exposedTerrainLand: land,
    land,
    visibleLand: land,
    solidSurfaceLand: land || ice,
    topologyLand: land || ice,
    coastlineIndex: shelf ? 0.72 : 0,
    shelfIndex: shelf ? 0.78 : 0,
    shelfGradientIndex: shelf ? 0.78 : 0,
    turquoiseIndex: shelf ? 0.74 : water ? 0.18 : 0,
    parentEdgeDefinition: shelf ? 0.40 : land ? 0.16 : 0.08,
    ridgeIndex: land ? clamp01((luma - 0.28) * 1.2) : 0,
    mountainIndex: land ? clamp01((luma - 0.36) * 1.1) : 0,
    basinIndex: land ? clamp01((0.62 - luma) * 0.8) : 0,
    microGlazeIndex: clamp01(luma * 0.35),
    parentHexDetailIndex: 0.32,
    mineralIndex: land ? 0.34 : 0.10,
    diamondSignal: ice ? 0.32 : land ? 0.12 : 0.04,
    opalSignal: shelf ? 0.38 : land ? 0.12 : 0.08,
    graniteSignal: land ? 0.34 : 0.05,
    slateSignal: land ? 0.22 : water ? 0.14 : 0.06,
    elevation: land ? 0.34 : ice ? 0.42 : 0,
    depth: water ? 0.42 : 0,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  };
}

function sampleParent(state, sampler, u, v) {
  const lon = (wrap01(u) - 0.5) * Math.PI * 2;
  const lat = (0.5 - clamp(v, 0, 1)) * Math.PI;

  if (typeof sampler === "function") {
    try {
      const sample = sampler({
        lat,
        lon,
        u: wrap01(u),
        v: clamp(v, 0, 1),
        x: wrap01(u),
        y: clamp(v, 0, 1),
        visualSamplingMode: "raw-sphere-continuity",
        hexCenterVisualOverride: false
      });

      if (sample && typeof sample === "object") return sample;
    } catch (_) {}
  }

  const textureColor = sampleTextureBilinear(state.texture, u, v);
  return fallbackTextureClassification(textureColor);
}

function baseColorFromParent(sample) {
  const relief = clamp01(sample.terrainReliefIndex ?? sample.terrainRelief ?? sample.elevation ?? 0);
  const mineral = clamp01(sample.mineralIndex ?? 0);
  const coast = clamp01(sample.coastlineIndex ?? sample.coastalFeather ?? 0);
  const shelf = clamp01(sample.shelfGradientIndex ?? sample.shelfIndex ?? 0);
  const turquoise = clamp01(sample.turquoiseIndex ?? sample.turquoise ?? 0);
  const glaze = clamp01(sample.microGlazeIndex ?? 0);
  const ridge = clamp01(sample.ridgeIndex ?? 0);
  const mountain = clamp01(sample.mountainIndex ?? 0);

  if (sample.ice || sample.glacier || sample.visualSurfaceClass === "glacier_ice_snowpack_surface") {
    return [
      Math.round(mix(182, 244, glaze * 0.40 + relief * 0.20)),
      Math.round(mix(204, 250, glaze * 0.40 + relief * 0.20)),
      Math.round(mix(213, 255, glaze * 0.42 + relief * 0.18)),
      255
    ];
  }

  if (sample.liquidWater || sample.water || sample.ocean || sample.shelf || sample.visualSurfaceClass === "shelf_water_surface" || sample.visualSurfaceClass === "ocean_water_surface") {
    if (sample.shelf || sample.visualSurfaceClass === "shelf_water_surface") {
      return [
        Math.round(mix(20, 78, turquoise * 0.55 + shelf * 0.25)),
        Math.round(mix(126, 218, turquoise * 0.62 + shelf * 0.22)),
        Math.round(mix(146, 224, turquoise * 0.58 + shelf * 0.26)),
        255
      ];
    }

    const depth = clamp01(sample.depth ?? sample.oceanDepth ?? 0.48);

    return [
      Math.round(mix(5, 14, depth)),
      Math.round(mix(47, 78, 1 - depth * 0.24)),
      Math.round(mix(95, 162, 1 - depth * 0.18)),
      255
    ];
  }

  const greenBase = [
    mix(68, 138, glaze * 0.35 + relief * 0.20),
    mix(91, 132, glaze * 0.30 + relief * 0.18),
    mix(64, 82, glaze * 0.22)
  ];

  const ridgeDark = [
    mix(53, 88, mineral * 0.18),
    mix(64, 88, mineral * 0.14),
    mix(57, 70, mineral * 0.12)
  ];

  const highRange = [
    mix(116, 174, mineral * 0.18),
    mix(119, 152, mineral * 0.16),
    mix(94, 108, mineral * 0.12)
  ];

  let color = [
    Math.round(greenBase[0]),
    Math.round(greenBase[1]),
    Math.round(greenBase[2]),
    255
  ];

  color = mixColor(color, [ridgeDark[0], ridgeDark[1], ridgeDark[2], 255], ridge * 0.24);
  color = mixColor(color, [highRange[0], highRange[1], highRange[2], 255], mountain * 0.18);
  color = mixColor(color, [186, 158, 91, 255], clamp01(sample.diamondSignal ?? 0) * 0.10);
  color = mixColor(color, [168, 218, 202, 255], clamp01(sample.opalSignal ?? 0) * 0.10);
  color = mixColor(color, [229, 214, 164, 255], coast * 0.10);

  return color;
}

function applyParentAndGrandchildExpression(baseColor, rawTextureColor, hexTextureColor, sample, relief, geometryIndex, geometry, config) {
  const ridge = clamp01(sample.ridgeIndex ?? 0);
  const mountain = clamp01(sample.mountainIndex ?? 0);
  const coast = clamp01(sample.coastlineIndex ?? sample.coastalFeather ?? 0);
  const shelf = clamp01(sample.shelfGradientIndex ?? sample.shelfIndex ?? 0);
  const micro = clamp01(sample.parentHexDetailIndex ?? sample.microTerrainIndex ?? 0);
  const glaze = clamp01(sample.microGlazeIndex ?? 0);
  const diamond = clamp01(sample.diamondSignal ?? 0);
  const opal = clamp01(sample.opalSignal ?? 0);
  const granite = clamp01(sample.graniteSignal ?? 0);
  const slate = clamp01(sample.slateSignal ?? 0);

  const seed = geometry.microSeeds[geometryIndex];
  const zDepth = geometry.sphericalDepths[geometryIndex];
  const hexQ = geometry.hexQ[geometryIndex];
  const hexR = geometry.hexR[geometryIndex];
  const rawU = geometry.rawU[geometryIndex];
  const rawV = geometry.rawV[geometryIndex];
  const edge = geometry.edgeFactors[geometryIndex];
  const overlap = geometry.overlapFactors[geometryIndex];
  const asymmetry = geometry.asymmetryFactors[geometryIndex];

  let color = baseColor;

  if (rawTextureColor && rawTextureColor[3] > 0) {
    color = mixColor(color, rawTextureColor, config.parentTextureBlend);
  }

  if (hexTextureColor && hexTextureColor[3] > 0) {
    color = mixColor(color, hexTextureColor, config.hexTextureInfluence * (0.45 + overlap * 0.55));
  }

  const fineNoise = fbm(
    hexQ * 0.17 + seed * 2.0 + rawU * 3.4,
    hexR * 0.17 - seed * 3.0 + rawV * 2.7,
    1711,
    3
  );

  const flowingNoise = fbm(
    rawU * 22.0 + seed * 0.17,
    rawV * 17.0 - seed * 0.13,
    2719,
    4
  );

  const asymmetricNoise = fbm(
    rawU * 7.5 + asymmetry * 3.0,
    rawV * 5.7 - asymmetry * 2.4,
    3347,
    3
  );

  const seededVariation =
    (fineNoise - 0.5) * config.microTerrainStrength +
    (flowingNoise - 0.5) * config.seededVariationStrength +
    (asymmetricNoise - 0.5) * config.asymmetryStrength;

  const ridgeLift = clamp01((ridge * 0.70 + relief.ridgeOverlay * 0.80) * config.ridgeExpressionStrength);
  const mountainLift = clamp01((mountain * 0.68 + relief.mountainOverlay * 0.82) * config.mountainExpressionStrength);
  const coastLift = clamp01((coast * 0.70 + relief.coastlineGritOverlay * 0.80) * config.coastlineExpressionStrength);
  const shelfLift = clamp01((shelf * 0.72 + relief.shelfReliefOverlay * 0.80) * config.shelfExpressionStrength);
  const mineralLift = clamp01((diamond + opal + granite + slate + relief.mineralPressureOverlay) * 0.22 * config.mineralExpressionStrength);
  const reliefLift = clamp01(relief.reliefContrast * config.reliefGrandchildStrength);
  const microLift = clamp01((micro * 0.50 + glaze * 0.32 + relief.microNoise * 0.36 + Math.max(0, seededVariation) * 0.26) * config.microTerrainStrength);
  const shadeLift = clamp01(relief.shadeLift * config.reliefGrandchildStrength);
  const shadeDrop = clamp01(relief.shadeDrop * config.reliefGrandchildStrength);

  if (sample.exposedTerrainLand || sample.land || sample.visibleLand) {
    color = mixColor(color, [48, 61, 52, 255], ridgeLift * 0.24 + shadeDrop * 0.18);
    color = mixColor(color, [166, 154, 112, 255], mountainLift * 0.17 + shadeLift * 0.12);
    color = mixColor(color, [218, 204, 156, 255], coastLift * 0.16);
    color = mixColor(color, [202, 224, 199, 255], opal * 0.06 + diamond * 0.045 + mineralLift * 0.08);
    color = mixColor(color, [78, 86, 82, 255], slate * 0.10 + relief.subterraneanPressureOverlay * 0.08);
    color = mixColor(color, [112, 100, 70, 255], relief.basinShadowOverlay * 0.10);

    if (seededVariation > 0) {
      color = mixColor(color, [214, 204, 160, 255], seededVariation * 0.08);
    } else {
      color = mixColor(color, [44, 54, 48, 255], Math.abs(seededVariation) * 0.08);
    }
  }

  if (sample.shelf || sample.visualSurfaceClass === "shelf_water_surface") {
    color = mixColor(color, [66, 218, 223, 255], shelfLift * 0.26 + coastLift * 0.10);
    color = mixColor(color, [218, 232, 204, 255], opal * 0.05 + relief.coastlineGritOverlay * 0.04);
    color = mixColor(color, [44, 196, 210, 255], Math.max(0, seededVariation) * 0.06);
  }

  if (sample.ocean || sample.visualSurfaceClass === "ocean_water_surface") {
    const waterVariation = Math.abs(seededVariation) * config.waterVariationStrength;
    color = mixColor(color, [7, 28, 75, 255], clamp01(sample.depth ?? 0.45) * 0.12 + relief.deepWaterVariationOverlay * 0.08);
    color = mixColor(color, [20, 112, 160, 255], Math.max(0, flowingNoise - 0.48) * 0.055 * config.waterVariationStrength);
    color = mixColor(color, [4, 32, 88, 255], waterVariation * 0.035);
  }

  if (sample.ice || sample.glacier) {
    color = mixColor(color, [250, 253, 255, 255], diamond * 0.10 + relief.iceRidgeOverlay * 0.08 + (seed > 0.94 ? 0.04 : 0));
  }

  const seam = clamp(
    1 - edge * config.edgeDarkening + (1 - edge) * config.seamSoftening,
    0.78,
    1.10
  );

  const sphericalShade = clamp(0.60 + zDepth * 0.48, 0.48, 1.08);
  const microShade = clamp(0.955 + seededVariation * 0.10 + microLift * 0.05 + mineralLift * 0.03 + reliefLift * 0.04, 0.86, 1.14);
  const reliefShade = clamp(1 + shadeLift * 0.16 - shadeDrop * 0.14, 0.84, 1.16);

  return multiplyColor(color, seam * sphericalShade * microShade * reliefShade);
}

function buildHexGeometry(size, options = {}) {
  const radius = size * options.radiusRatio;
  const cx = size / 2;
  const cy = size / 2;

  const hexRadius = clamp(
    size / options.hexDensity,
    options.minHexRadius,
    options.maxHexRadius
  );

  let count = 0;

  for (let py = 0; py < size; py += 1) {
    const y = (py + 0.5 - cy) / radius;

    for (let px = 0; px < size; px += 1) {
      const x = (px + 0.5 - cx) / radius;
      if (x * x + y * y <= 1) count += 1;
    }
  }

  const indices = new Uint32Array(count);

  const rawLonOffsets = new Float32Array(count);
  const rawVCoords = new Float32Array(count);
  const hexLonOffsets = new Float32Array(count);
  const hexVCoords = new Float32Array(count);

  const rawU = new Float32Array(count);
  const rawV = new Float32Array(count);

  const edgeFactors = new Float32Array(count);
  const overlapFactors = new Float32Array(count);
  const asymmetryFactors = new Float32Array(count);
  const microSeeds = new Float32Array(count);
  const sphericalDepths = new Float32Array(count);
  const hexQ = new Int32Array(count);
  const hexR = new Int32Array(count);

  let i = 0;

  for (let py = 0; py < size; py += 1) {
    const yRaw = py + 0.5 - cy;
    const y = yRaw / radius;

    for (let px = 0; px < size; px += 1) {
      const xRaw = px + 0.5 - cx;
      const x = xRaw / radius;
      const r2 = x * x + y * y;

      if (r2 > 1) continue;

      const rawZ = Math.sqrt(Math.max(0, 1 - r2));
      const rawLonOffset = Math.atan2(x, rawZ) / (Math.PI * 2);
      const rawLatitude = Math.asin(clamp(-y, -1, 1));
      const rawVCoord = clamp(0.5 - rawLatitude / Math.PI, 0, 1);

      const center = nearestHexCenter(xRaw, yRaw, hexRadius);

      let hx = center.x / radius;
      let hy = center.y / radius;
      let hr2 = hx * hx + hy * hy;

      if (hr2 > 0.999) {
        const scale = 0.999 / Math.sqrt(hr2);
        hx *= scale;
        hy *= scale;
        hr2 = hx * hx + hy * hy;
      }

      const hexZ = Math.sqrt(Math.max(0, 1 - hr2));
      const hexLonOffset = Math.atan2(hx, hexZ) / (Math.PI * 2);
      const hexLatitude = Math.asin(clamp(-hy, -1, 1));
      const hexVCoord = clamp(0.5 - hexLatitude / Math.PI, 0, 1);

      const localX = xRaw - center.x;
      const localY = yRaw - center.y;
      const hexEdgeDistance = hexDistance(localX, localY, hexRadius);
      const edge = smoothstep(0.76, 1.05, hexEdgeDistance);
      const overlap = 1 - smoothstep(0.82, 1.24, hexEdgeDistance);
      const seed = hash2(center.q, center.r, 2027);
      const asymmetry = signedHash2(center.q, center.r, 8081);

      indices[i] = (py * size + px) * 4;

      rawLonOffsets[i] = rawLonOffset;
      rawVCoords[i] = rawVCoord;
      hexLonOffsets[i] = hexLonOffset;
      hexVCoords[i] = hexVCoord;

      rawU[i] = wrap01(rawLonOffset + 0.5);
      rawV[i] = rawVCoord;

      edgeFactors[i] = edge;
      overlapFactors[i] = overlap;
      asymmetryFactors[i] = asymmetry;
      microSeeds[i] = seed;
      sphericalDepths[i] = rawZ;
      hexQ[i] = center.q;
      hexR[i] = center.r;

      i += 1;
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    compatibilityRenewal: COMPATIBILITY_RENEWAL,
    parentRequiredReceipt: PARENT_REQUIRED_RECEIPT,
    grandchildReliefReceipt: GRANDCHILD_RELIEF_RECEIPT,
    childContract: CHILD_CONTRACT,
    model: "raw-continuity-high-density-hex-influence-grandchild-relief-bound-surface",
    size,
    radius,
    hexRadius,
    count,
    indices,

    rawLonOffsets,
    rawVCoords,
    hexLonOffsets,
    hexVCoords,
    rawU,
    rawV,

    edgeFactors,
    overlapFactors,
    asymmetryFactors,
    microSeeds,
    sphericalDepths,
    hexQ,
    hexR,

    rawVisualContinuity: true,
    highDensityHexInfluence: true,
    hexCenterVisualOverride: false
  });
}

function drawAtmosphere(ctx, size, options = {}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * options.radiusRatio;
  const strength = options.atmosphereStrength;

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  const highlight = ctx.createRadialGradient(
    cx - radius * 0.34,
    cy - radius * 0.36,
    radius * 0.02,
    cx,
    cy,
    radius * 1.16
  );

  highlight.addColorStop(0, `rgba(255,255,255,${0.13 * strength})`);
  highlight.addColorStop(0.32, `rgba(255,255,255,${0.035 * strength})`);
  highlight.addColorStop(0.74, "rgba(0,0,0,0.10)");
  highlight.addColorStop(1, "rgba(0,0,0,0.50)");

  ctx.fillStyle = highlight;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  const edge = ctx.createRadialGradient(cx, cy, radius * 0.66, cx, cy, radius);
  edge.addColorStop(0, "rgba(0,0,0,0)");
  edge.addColorStop(0.78, `rgba(8,23,44,${0.16 * strength})`);
  edge.addColorStop(1, `rgba(4,10,20,${0.62 * strength})`);

  ctx.fillStyle = edge;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.save();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(1, size * 0.004), 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(190,226,255,${0.30 * strength})`;
  ctx.lineWidth = Math.max(1, size * 0.003);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius + Math.max(2, size * 0.011), 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(108,185,232,${0.12 * strength})`;
  ctx.lineWidth = Math.max(1, size * 0.006);
  ctx.stroke();

  ctx.restore();
}

function publishChildStatus(state, frameReceipt) {
  const parentReceipt = resolveParentReceipt(state);
  const parentSampler = resolveParentSurfaceSampler(state);

  STATUS.childActivatedByParentContract = Boolean(parentSampler && isParentReceiptAccepted(parentReceipt));
  STATUS.parentSurfaceSamplerDetected = Boolean(parentSampler);
  STATUS.parentReceiptDetected = parentReceipt;
  STATUS.grandchildReliefActivated = true;
  STATUS.grandchildReliefImportedReceipt = AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE;
  STATUS.grandchildReliefStatus = getAudraliaReliefSurfaceStatus();

  if (state && state.canvas) {
    state.canvas.dataset.hexSurfaceChild = RECEIPT;
    state.canvas.dataset.hexSurfacePreviousReceipt = PREVIOUS_RECEIPT;
    state.canvas.dataset.hexSurfaceLegacyReceipt = LEGACY_RECEIPT;
    state.canvas.dataset.hexSurfacePreviousActiveRenewal = PREVIOUS_ACTIVE_RENEWAL;
    state.canvas.dataset.hexSurfaceCompatibilityRenewal = COMPATIBILITY_RENEWAL;
    state.canvas.dataset.hexSurfaceParentRequiredReceipt = PARENT_REQUIRED_RECEIPT;
    state.canvas.dataset.hexSurfaceParentFallbackReceipt = PARENT_FALLBACK_RECEIPT;
    state.canvas.dataset.hexSurfaceParentReceiptDetected = parentReceipt || "";
    state.canvas.dataset.hexSurfaceGrandchildReliefReceipt = GRANDCHILD_RELIEF_RECEIPT;
    state.canvas.dataset.hexSurfaceGrandchildReliefImportedReceipt = AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE;
    state.canvas.dataset.hexSurfaceChildContract = CHILD_CONTRACT;
    state.canvas.dataset.hexSurfaceModel = "raw-continuity-high-density-hex-influence-grandchild-relief-bound-surface";
    state.canvas.dataset.childActivatedByParentContract = String(STATUS.childActivatedByParentContract);
    state.canvas.dataset.parentSurfaceSamplerDetected = String(Boolean(parentSampler));
    state.canvas.dataset.grandchildReliefActivated = "true";
    state.canvas.dataset.parentClassificationPreserved = "true";
    state.canvas.dataset.downstreamClassificationOverrideAllowed = "false";
    state.canvas.dataset.rawVisualContinuity = "true";
    state.canvas.dataset.highDensityHexInfluence = "true";
    state.canvas.dataset.overlappingHexFootprints = "true";
    state.canvas.dataset.seededVariation = "true";
    state.canvas.dataset.hexCenterVisualOverride = "false";
    state.canvas.dataset.runtimeImport = "false";
    state.canvas.dataset.runtimeAuthority = "false";
    state.canvas.dataset.routeOwnedLandGeneration = "false";
    state.canvas.dataset.routeOwnedWaterGeneration = "false";
    state.canvas.dataset.hearthContractImported = "false";
    state.canvas.dataset.hearthPlanetTruthImported = "false";
    state.canvas.dataset.graphicBox = "false";
    state.canvas.dataset.imageGeneration = "false";
    state.canvas.dataset.visualPassClaimed = "false";

    if (frameReceipt) {
      state.canvas.dataset.hexSurfaceFrameReceipt = frameReceipt.receipt;
      state.canvas.dataset.hexSamples = String(frameReceipt.samples || 0);
      state.canvas.dataset.parentSamples = String(frameReceipt.parentSamples || 0);
      state.canvas.dataset.textureFallbackSamples = String(frameReceipt.textureFallbackSamples || 0);
      state.canvas.dataset.ridgeExpressedPixels = String(frameReceipt.ridgeExpressedPixels || 0);
      state.canvas.dataset.mountainExpressedPixels = String(frameReceipt.mountainExpressedPixels || 0);
      state.canvas.dataset.coastlineExpressedPixels = String(frameReceipt.coastlineExpressedPixels || 0);
      state.canvas.dataset.shelfExpressedPixels = String(frameReceipt.shelfExpressedPixels || 0);
      state.canvas.dataset.grandchildReliefPixels = String(frameReceipt.grandchildReliefPixels || 0);
      state.canvas.dataset.subterraneanExpressedPixels = String(frameReceipt.subterraneanExpressedPixels || 0);
      state.canvas.dataset.rawContinuitySamples = String(frameReceipt.rawContinuitySamples || 0);
      state.canvas.dataset.hexInfluenceSamples = String(frameReceipt.hexInfluenceSamples || 0);
    }
  }

  if (typeof window !== "undefined") {
    window.DGBAudraliaHexSurfaceStatus = STATUS;
  }

  return STATUS;
}

export function drawAudraliaHexSurfaceFrame(state, options = {}) {
  if (!state || !state.canvas || !state.ctx) {
    throw new Error("AUDRALIA_HEX_SURFACE_MISSING_STATE");
  }

  const size = Number(state.canvas.width) || 0;

  if (!size) {
    throw new Error("AUDRALIA_HEX_SURFACE_MISSING_CANVAS_SIZE");
  }

  const config = normalizeOptions(options);
  const parentSampler = resolveParentSurfaceSampler(state);
  const parentReceipt = resolveParentReceipt(state);
  const parentAccepted = Boolean(parentSampler && isParentReceiptAccepted(parentReceipt));

  if (!state.hexGeometry || state.hexGeometry.size !== size || state.hexGeometry.receipt !== RECEIPT) {
    state.hexGeometry = buildHexGeometry(size, config);
  }

  const geometry = state.hexGeometry;
  const output = state.ctx.createImageData(size, size);
  const data = output.data;
  const phase = Number(state.phase) || 0;

  let sampledPixels = 0;
  let parentSamples = 0;
  let textureFallbackSamples = 0;
  let landPixels = 0;
  let waterPixels = 0;
  let shelfPixels = 0;
  let icePixels = 0;
  let ridgeExpressedPixels = 0;
  let mountainExpressedPixels = 0;
  let coastlineExpressedPixels = 0;
  let shelfExpressedPixels = 0;
  let mineralExpressedPixels = 0;
  let grandchildReliefPixels = 0;
  let subterraneanExpressedPixels = 0;
  let rawContinuitySamples = 0;
  let hexInfluenceSamples = 0;

  for (let i = 0; i < geometry.count; i += 1) {
    const out = geometry.indices[i];

    const rawU = wrap01(phase + geometry.rawLonOffsets[i]);
    const rawV = geometry.rawVCoords[i];

    const hexU = wrap01(phase + geometry.hexLonOffsets[i]);
    const hexV = geometry.hexVCoords[i];

    const rawTextureColor = sampleTextureBilinear(state.texture, rawU, rawV);
    const hexTextureColor = sampleTextureBilinear(state.texture, hexU, hexV);

    const sample = sampleParent(state, parentSampler, rawU, rawV);
    const usedParent = Boolean(parentSampler && sample && sample.receipt && sample.receipt !== "TEXTURE_FALLBACK_PARENT_UNAVAILABLE");

    if (usedParent) parentSamples += 1;
    else textureFallbackSamples += 1;

    const relief = refineAudraliaReliefSample(sample, {
      seed: geometry.microSeeds[i],
      phase,
      childReceipt: RECEIPT,
      parentReceipt,
      visualSamplingMode: "raw-sphere-continuity",
      hexInfluenceMode: "high-density-overlap",
      rawU,
      rawV,
      hexU,
      hexV,
      hexQ: geometry.hexQ[i],
      hexR: geometry.hexR[i],
      edgeFactor: geometry.edgeFactors[i],
      overlapFactor: geometry.overlapFactors[i],
      asymmetryFactor: geometry.asymmetryFactors[i]
    });

    const baseColor = baseColorFromParent(sample);
    const color = applyParentAndGrandchildExpression(baseColor, rawTextureColor, hexTextureColor, sample, relief, i, geometry, config);

    if (sample.exposedTerrainLand || sample.land || sample.visibleLand) landPixels += 1;
    if (sample.liquidWater || sample.water || sample.ocean) waterPixels += 1;
    if (sample.shelf) shelfPixels += 1;
    if (sample.ice || sample.glacier) icePixels += 1;
    if (clamp01(sample.ridgeIndex ?? 0) > 0.34 || relief.expressiveRidge) ridgeExpressedPixels += 1;
    if (clamp01(sample.mountainIndex ?? 0) > 0.34 || relief.expressiveMountain) mountainExpressedPixels += 1;
    if (clamp01(sample.coastlineIndex ?? sample.coastalFeather ?? 0) > 0.22 || relief.expressiveCoastline) coastlineExpressedPixels += 1;
    if (clamp01(sample.shelfGradientIndex ?? sample.shelfIndex ?? 0) > 0.22 || relief.expressiveShelf) shelfExpressedPixels += 1;

    if ((clamp01(sample.diamondSignal ?? 0) + clamp01(sample.opalSignal ?? 0) + clamp01(sample.graniteSignal ?? 0) + clamp01(sample.slateSignal ?? 0)) > 0.32 || relief.mineralPressureOverlay > 0.22) {
      mineralExpressedPixels += 1;
    }

    if (relief.reliefContrast > 0.18) grandchildReliefPixels += 1;
    if (relief.expressiveSubterranean) subterraneanExpressedPixels += 1;

    rawContinuitySamples += 1;
    hexInfluenceSamples += 1;
    sampledPixels += 1;

    data[out] = color[0];
    data[out + 1] = color[1];
    data[out + 2] = color[2];
    data[out + 3] = color[3];
  }

  state.ctx.putImageData(output, 0, 0);
  drawAtmosphere(state.ctx, size, config);

  const frameReceipt = Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    legacyReceipt: LEGACY_RECEIPT,
    compatibilityRenewal: COMPATIBILITY_RENEWAL,
    parentRequiredReceipt: PARENT_REQUIRED_RECEIPT,
    parentFallbackReceipt: PARENT_FALLBACK_RECEIPT,
    parentReceiptDetected: parentReceipt,
    grandchildReliefReceipt: GRANDCHILD_RELIEF_RECEIPT,
    grandchildReliefImportedReceipt: AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE,
    childContract: CHILD_CONTRACT,
    parentAccepted,
    childActivatedByParentContract: parentAccepted,
    grandchildReliefActivated: true,
    model: "raw-continuity-high-density-hex-influence-grandchild-relief-bound-surface",
    size,
    samples: geometry.count,
    hexRadius: geometry.hexRadius,
    sampledPixels,
    parentSamples,
    textureFallbackSamples,
    landPixels,
    waterPixels,
    shelfPixels,
    icePixels,
    ridgeExpressedPixels,
    mountainExpressedPixels,
    coastlineExpressedPixels,
    shelfExpressedPixels,
    mineralExpressedPixels,
    grandchildReliefPixels,
    subterraneanExpressedPixels,
    rawContinuitySamples,
    hexInfluenceSamples,
    rawVisualContinuity: true,
    highDensityHexInfluence: true,
    overlappingHexFootprints: true,
    seededVariation: true,
    hexCenterVisualOverride: false,
    parentClassificationPreserved: true,
    downstreamClassificationOverrideAllowed: false,
    runtimeImport: false,
    runtimeAuthority: false,
    routeOwnedLandGeneration: false,
    routeOwnedWaterGeneration: false,
    hearthContractImported: false,
    hearthPlanetTruthImported: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });

  publishChildStatus(state, frameReceipt);

  return frameReceipt;
}

export function getAudraliaHexSurfaceStatus(state = null) {
  const parentReceipt = state ? resolveParentReceipt(state) : STATUS.parentReceiptDetected;
  const parentSampler = state ? resolveParentSurfaceSampler(state) : null;
  const childActivated = Boolean(parentSampler && isParentReceiptAccepted(parentReceipt));

  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    previousReceipt: PREVIOUS_RECEIPT,
    legacyReceipt: LEGACY_RECEIPT,
    previousActiveRenewal: PREVIOUS_ACTIVE_RENEWAL,
    compatibilityRenewal: COMPATIBILITY_RENEWAL,
    parentRequiredReceipt: PARENT_REQUIRED_RECEIPT,
    parentFallbackReceipt: PARENT_FALLBACK_RECEIPT,
    parentReceiptDetected: parentReceipt || STATUS.parentReceiptDetected || "",
    grandchildReliefReceipt: GRANDCHILD_RELIEF_RECEIPT,
    grandchildReliefImportedReceipt: AUDRALIA_RELIEF_SURFACE_RECEIPT_VALUE,
    childContract: CHILD_CONTRACT,
    role: "audralia-high-density-overlap-seeded-variation-parent-field-expressor",
    childActivatedByParentContract: childActivated || STATUS.childActivatedByParentContract,
    parentSurfaceSamplerDetected: Boolean(parentSampler) || STATUS.parentSurfaceSamplerDetected,
    parentStandardRequired: true,
    parentClassificationPreserved: true,
    downstreamClassificationOverrideAllowed: false,
    grandchildrenActivated: true,
    grandchildReliefActivated: true,
    grandchildReliefStatus: getAudraliaReliefSurfaceStatus(),
    geometryLoaded: Boolean(state && state.hexGeometry),
    hexRadius: state && state.hexGeometry ? state.hexGeometry.hexRadius : null,
    hexSamples: state && state.hexGeometry ? state.hexGeometry.count : null,
    textureOnlySampling: false,
    parentFieldExpression: true,
    ridgeExpression: true,
    mountainExpression: true,
    coastlineExpression: true,
    shelfExpression: true,
    mineralExpression: true,
    rawVisualContinuity: true,
    highDensityHexInfluence: true,
    overlappingHexFootprints: true,
    seededVariation: true,
    hexCenterVisualOverride: false,
    staleDeepOceanBlobLogicRemoved: true,
    deepOceanShowroomImport: false,
    deepOceanRouteOverlay: false,
    oceanSeparation: false,
    deepOceanSeparation: false,
    shelfOceanSeparation: false,
    runtimeImport: false,
    runtimeAuthority: false,
    routeOwnedLandGeneration: false,
    routeOwnedWaterGeneration: false,
    hearthContractImported: false,
    hearthPlanetTruthImported: false,
    graphicBox: false,
    imageGeneration: false,
    visualPassClaimed: false
  });
}

const api = Object.freeze({
  receipt: RECEIPT,
  previousReceipt: PREVIOUS_RECEIPT,
  legacyReceipt: LEGACY_RECEIPT,
  previousActiveRenewal: PREVIOUS_ACTIVE_RENEWAL,
  compatibilityRenewal: COMPATIBILITY_RENEWAL,
  parentRequiredReceipt: PARENT_REQUIRED_RECEIPT,
  parentFallbackReceipt: PARENT_FALLBACK_RECEIPT,
  grandchildReliefReceipt: GRANDCHILD_RELIEF_RECEIPT,
  childContract: CHILD_CONTRACT,
  removedStaleReceipts: REMOVED_STALE_RECEIPTS,
  drawAudraliaHexSurfaceFrame,
  getAudraliaHexSurfaceStatus
});

if (typeof window !== "undefined") {
  window.DGBAudraliaHexSurfaceRenderer = api;
  window.DGBAudraliaHexSurfaceStatus = STATUS;
}

export const AUDRALIA_HEX_SURFACE_RECEIPT_VALUE = RECEIPT;
export const AUDRALIA_HEX_SURFACE_PREVIOUS_RECEIPT_VALUE = PREVIOUS_RECEIPT;
export const AUDRALIA_HEX_SURFACE_PARENT_REQUIRED_RECEIPT_VALUE = PARENT_REQUIRED_RECEIPT;
export const AUDRALIA_HEX_SURFACE_GRANDCHILD_RELIEF_RECEIPT_VALUE = GRANDCHILD_RELIEF_RECEIPT;
export const AUDRALIA_HEX_SURFACE_CHILD_CONTRACT_VALUE = CHILD_CONTRACT;
export const AUDRALIA_HEX_SURFACE_PARENT_FIELD_EXPRESSION_ACTIVE = true;
export const AUDRALIA_HEX_SURFACE_GRANDCHILD_RELIEF_ACTIVE = true;
export const AUDRALIA_HEX_SURFACE_GRANDCHILDREN_ACTIVATED = true;
export const AUDRALIA_HEX_SURFACE_RUNTIME_IMPORT = false;
export const AUDRALIA_HEX_SURFACE_STATUS = STATUS;

export default api;
