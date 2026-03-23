// /world/render/terrain_render_engine.js
// MODE: RENDER EXTENSION CONTRACT RENEWAL
// STATUS: TERRAIN FACTOR AUTHORITY v6
// ROLE:
// - own 100% terrain baseline coverage for land
// - classify substrate / surface continuity only
// - NOT own elevation emphasis
// - NOT own cut / incision emphasis
// - NOT own botany
// - return normalized packet or null
// - remain coherent with downstream render factor families
// - own no boot, no runtime, no truth

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeString(value, fallback = "NONE") {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function normalizeColor(value, fallback) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function toNumber(value, fallback = 0) {
  return isFiniteNumber(value) ? value : fallback;
}

/* =========================
   BASE CLASSIFICATION
========================= */

function classifyTerrainClass(sample) {
  return normalizeString(sample?.terrainClass, "NONE");
}

function classifyBiomeType(sample) {
  return normalizeString(sample?.biomeType, "NONE");
}

function classifySurfaceClass(sample) {
  const terrainClass = classifyTerrainClass(sample);
  const biomeType = classifyBiomeType(sample);

  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);
  const runoff = clamp(toNumber(sample?.runoff, 0), 0, 1);
  const rainfall = clamp(toNumber(sample?.rainfall, 0), 0, 1);
  const basinAccumulation = clamp(toNumber(sample?.basinAccumulation, 0), 0, 1);

  const aridity = clamp(
    (1 - rainfall) * 0.46 +
    (1 - basinAccumulation) * 0.18 +
    slope * 0.12 +
    elevation * 0.10 +
    canyonStrength * 0.08 +
    curvature * 0.06,
    0,
    1
  );

  const fertility = clamp(
    rainfall * 0.34 +
    basinAccumulation * 0.28 +
    basinStrength * 0.14 +
    plateauStrength * 0.08 +
    (1 - slope) * 0.10 +
    (biomeType === "WETLAND" ? 0.12 : 0),
    0,
    1
  );

  const exposure = clamp(
    slope * 0.26 +
    ridgeStrength * 0.18 +
    canyonStrength * 0.16 +
    curvature * 0.14 +
    elevation * 0.14 +
    (terrainClass === "RIDGE" ? 0.10 : 0) +
    (terrainClass === "SUMMIT" ? 0.12 : 0),
    0,
    1
  );

  if (
    biomeType === "DESERT" ||
    terrainClass === "BADLAND" ||
    aridity >= 0.72
  ) {
    return "BARREN";
  }

  if (
    terrainClass === "GLACIAL_HIGHLAND" ||
    terrainClass === "POLAR_ICE" ||
    biomeType === "GLACIER"
  ) {
    return "ROCK";
  }

  if (exposure >= 0.62 && fertility <= 0.44) {
    return "ROCK";
  }

  if (fertility >= 0.58 && exposure <= 0.46) {
    return "SOIL";
  }

  return "MIXED";
}

function classifyTerrainOrgan(sample, surfaceClass) {
  const terrainClass = classifyTerrainClass(sample);
  const biomeType = classifyBiomeType(sample);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);

  if (surfaceClass === "SOIL" && basinStrength >= 0.34) return "RECEPTION_FIELD";
  if (surfaceClass === "ROCK" && terrainClass === "RIDGE") return "EXPOSURE_SHELL";
  if (surfaceClass === "MIXED" && plateauStrength >= 0.40) return "TRANSITION_SHELF";
  if (surfaceClass === "BARREN") return "DEPLETION_FIELD";
  if (biomeType === "WETLAND") return "SATURATION_FIELD";

  return "NONE";
}

/* =========================
   SURFACE METRICS
========================= */

function computeSurfaceContinuity(sample) {
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const rainfall = clamp(toNumber(sample?.rainfall, 0), 0, 1);
  const basinAccumulation = clamp(toNumber(sample?.basinAccumulation, 0), 0, 1);
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);

  return clamp(
    plateauStrength * 0.24 +
    basinStrength * 0.18 +
    rainfall * 0.18 +
    basinAccumulation * 0.18 +
    (1 - slope) * 0.14 +
    (1 - ridgeStrength) * 0.08,
    0,
    1
  );
}

function computeSurfaceVariation(sample) {
  const lat = toNumber(sample?.latDeg, 0) * Math.PI / 180;
  const lon = toNumber(sample?.lonDeg, 0) * Math.PI / 180;
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);

  const waveA = Math.sin((lon * 5.0) + (lat * 2.0));
  const waveB = Math.cos((lon * 9.0) - (lat * 4.0));
  const waveC = Math.sin((lon * 13.0) + elevation * Math.PI * 2);

  const normalized = clamp(((waveA * 0.38) + (waveB * 0.34) + (waveC * 0.28) + 1) * 0.5, 0, 1);

  return clamp(
    normalized * 0.48 +
    slope * 0.20 +
    curvature * 0.18 +
    canyonStrength * 0.08 +
    elevation * 0.06,
    0,
    1
  );
}

function computeSurfaceExposure(sample) {
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);

  return clamp(
    elevation * 0.22 +
    slope * 0.28 +
    ridgeStrength * 0.20 +
    canyonStrength * 0.14 +
    curvature * 0.16,
    0,
    1
  );
}

function computeSurfaceRetention(sample) {
  const rainfall = clamp(toNumber(sample?.rainfall, 0), 0, 1);
  const runoff = clamp(toNumber(sample?.runoff, 0), 0, 1);
  const basinAccumulation = clamp(toNumber(sample?.basinAccumulation, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);

  return clamp(
    rainfall * 0.24 +
    runoff * 0.12 +
    basinAccumulation * 0.30 +
    basinStrength * 0.22 +
    (1 - slope) * 0.12,
    0,
    1
  );
}

function computeDirectionalSurface(sample) {
  const lat = toNumber(sample?.latDeg, 0) * Math.PI / 180;
  const lon = toNumber(sample?.lonDeg, 0) * Math.PI / 180;

  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const rainfall = clamp(toNumber(sample?.rainfall, 0), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);

  const northBias = clamp(
    Math.abs(Math.sin(lat)) * 0.24 +
    rainfall * 0.22 +
    plateauStrength * 0.18 +
    (1 - slope) * 0.12,
    0,
    1
  );

  const southBias = clamp(
    basinStrength * 0.28 +
    canyonStrength * 0.16 +
    (1 - rainfall) * 0.18 +
    Math.abs(Math.sin(lat)) * 0.10,
    0,
    1
  );

  const eastBias = clamp(
    Math.abs(Math.sin(lon)) * 0.24 +
    slope * 0.18 +
    ridgeStrength * 0.16 +
    rainfall * 0.10,
    0,
    1
  );

  const westBias = clamp(
    Math.abs(Math.cos(lon)) * 0.24 +
    plateauStrength * 0.20 +
    basinStrength * 0.16 +
    canyonStrength * 0.08,
    0,
    1
  );

  const dominant = Math.max(northBias, southBias, eastBias, westBias);

  let directionalClass = "CENTERED";
  if (dominant === northBias) directionalClass = "NORTH";
  else if (dominant === southBias) directionalClass = "SOUTH";
  else if (dominant === eastBias) directionalClass = "EAST";
  else if (dominant === westBias) directionalClass = "WEST";

  return {
    directionalClass,
    directionalWeight: dominant,
    directionalNorthBias: northBias,
    directionalSouthBias: southBias,
    directionalEastBias: eastBias,
    directionalWestBias: westBias
  };
}

function computeDirectionalContrast(directional) {
  const values = [
    directional.directionalNorthBias,
    directional.directionalSouthBias,
    directional.directionalEastBias,
    directional.directionalWestBias
  ].sort((a, b) => b - a);

  return clamp(values[0] - values[1], 0, 1);
}

function computeSurfaceSeparation(surfaceClass, continuityWeight, variationWeight, exposureWeight, retentionWeight, directionalContrast) {
  const base =
    surfaceClass === "SOIL" ? 0.58 :
    surfaceClass === "ROCK" ? 0.66 :
    surfaceClass === "MIXED" ? 0.48 :
    surfaceClass === "BARREN" ? 0.62 :
    0.32;

  return clamp(
    base +
    continuityWeight * 0.08 +
    variationWeight * 0.06 +
    exposureWeight * 0.08 +
    retentionWeight * 0.06 +
    directionalContrast * 0.04,
    0,
    1
  );
}

function deriveExpressionMeta(sample) {
  const terrainClass = classifyTerrainClass(sample);
  const biomeType = classifyBiomeType(sample);
  const surfaceClass = classifySurfaceClass(sample);
  const terrainOrgan = classifyTerrainOrgan(sample, surfaceClass);

  const continuityWeight = computeSurfaceContinuity(sample);
  const variationWeight = computeSurfaceVariation(sample);
  const exposureWeight = computeSurfaceExposure(sample);
  const retentionWeight = computeSurfaceRetention(sample);
  const directional = computeDirectionalSurface(sample);
  const directionalContrast = computeDirectionalContrast(directional);
  const packetSeparationWeight = computeSurfaceSeparation(
    surfaceClass,
    continuityWeight,
    variationWeight,
    exposureWeight,
    retentionWeight,
    directionalContrast
  );

  return {
    terrainClass,
    biomeType,
    surfaceClass,
    terrainOrgan,
    continuityWeight,
    variationWeight,
    exposureWeight,
    retentionWeight,
    packetSeparationWeight,
    directionalClass: directional.directionalClass,
    directionalWeight: directional.directionalWeight,
    directionalNorthBias: directional.directionalNorthBias,
    directionalSouthBias: directional.directionalSouthBias,
    directionalEastBias: directional.directionalEastBias,
    directionalWestBias: directional.directionalWestBias,
    directionalContrast
  };
}

/* =========================
   PACKET MODULATION
========================= */

function tintColor(baseColor, lightenShift, darkenShift, greenShift = 0, blueShift = 0) {
  const match = /^rgba\((\d+),(\d+),(\d+),([^)]+)\)$/.exec(baseColor.replace(/\s+/g, ""));
  if (!match) return baseColor;

  const r = clamp(Number(match[1]) + lightenShift - darkenShift, 0, 255);
  const g = clamp(Number(match[2]) + Math.round((lightenShift * 0.60) - (darkenShift * 0.48) + greenShift), 0, 255);
  const b = clamp(Number(match[3]) + Math.round((lightenShift * 0.36) - (darkenShift * 0.62) + blueShift), 0, 255);
  const a = clamp(Number(match[4]), 0, 1);

  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

function scaleRadius(baseRadiusPx, packetSeparationWeight, continuityWeight, variationWeight) {
  return baseRadiusPx * clamp(
    0.96 +
    packetSeparationWeight * 0.12 +
    continuityWeight * 0.08 +
    (variationWeight - 0.5) * 0.08,
    0.84,
    1.28
  );
}

function sharpenAlpha(baseAlpha, continuityWeight, directionalWeight, directionalContrast) {
  return clamp(
    baseAlpha +
    continuityWeight * 0.08 +
    directionalWeight * 0.05 +
    directionalContrast * 0.04,
    0,
    1
  );
}

/* =========================
   PACKET RESOLUTION
========================= */

function resolveSoilPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "SOIL",
    color: tintColor(
      "rgba(118,144,96,0.92)",
      Math.round(meta.continuityWeight * 8 + meta.retentionWeight * 4),
      Math.round(meta.exposureWeight * 3),
      Math.round(meta.retentionWeight * 10),
      Math.round(meta.directionalWeight * 2)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.04, meta.packetSeparationWeight, meta.continuityWeight, meta.variationWeight),
    alpha: sharpenAlpha(0.90, meta.continuityWeight, meta.directionalWeight, meta.directionalContrast),
    overlayOnly: false,
    ...meta
  };
}

function resolveRockPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "ROCK",
    color: tintColor(
      "rgba(146,144,132,0.94)",
      Math.round(meta.directionalWeight * 6),
      Math.round(meta.exposureWeight * 8 + meta.directionalContrast * 4),
      0,
      Math.round(meta.exposureWeight * 3)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.08, meta.packetSeparationWeight, meta.continuityWeight, meta.variationWeight),
    alpha: sharpenAlpha(0.94, meta.continuityWeight * 0.6, meta.directionalWeight, meta.directionalContrast),
    overlayOnly: false,
    ...meta
  };
}

function resolveMixedPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "MIXED",
    color: tintColor(
      "rgba(126,138,104,0.92)",
      Math.round(meta.continuityWeight * 5 + meta.retentionWeight * 2),
      Math.round(meta.exposureWeight * 4),
      Math.round(meta.retentionWeight * 5),
      Math.round(meta.variationWeight * 2)
    ),
    radiusPx: scaleRadius(pointSizePx, meta.packetSeparationWeight, meta.continuityWeight, meta.variationWeight),
    alpha: sharpenAlpha(0.90, meta.continuityWeight, meta.directionalWeight, meta.directionalContrast),
    overlayOnly: false,
    ...meta
  };
}

function resolveBarrenPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "BARREN",
    color: tintColor(
      "rgba(154,132,96,0.92)",
      Math.round(meta.directionalWeight * 4),
      Math.round(meta.exposureWeight * 6 + meta.directionalContrast * 3),
      Math.round(meta.retentionWeight * -4),
      0
    ),
    radiusPx: scaleRadius(pointSizePx * 0.98, meta.packetSeparationWeight, meta.continuityWeight, meta.variationWeight),
    alpha: sharpenAlpha(0.88, meta.continuityWeight * 0.5, meta.directionalWeight, meta.directionalContrast),
    overlayOnly: false,
    ...meta
  };
}

function resolvePacket(sample, pointSizePx) {
  const meta = deriveExpressionMeta(sample);

  if (meta.surfaceClass === "SOIL") {
    return resolveSoilPacket(pointSizePx, meta);
  }

  if (meta.surfaceClass === "ROCK") {
    return resolveRockPacket(pointSizePx, meta);
  }

  if (meta.surfaceClass === "MIXED") {
    return resolveMixedPacket(pointSizePx, meta);
  }

  if (meta.surfaceClass === "BARREN") {
    return resolveBarrenPacket(pointSizePx, meta);
  }

  return resolveMixedPacket(pointSizePx, meta);
}

/* =========================
   NORMALIZATION
========================= */

function normalizePacket(packet, fallbackColor, fallbackRadiusPx) {
  if (!packet || typeof packet !== "object") return null;

  return Object.freeze({
    contractId: "TERRAIN_RENDER_CONTRACT_v6",
    engineKey: "terrain",
    layer: normalizeString(packet.layer, "terrain"),
    category: normalizeString(packet.category, "TERRAIN"),
    subCategory: normalizeString(packet.subCategory, "MIXED"),

    color: normalizeColor(packet.color, fallbackColor),
    radiusPx: clamp(
      isFiniteNumber(packet.radiusPx) ? packet.radiusPx : fallbackRadiusPx,
      0.6,
      12
    ),
    alpha: clamp(
      isFiniteNumber(packet.alpha) ? packet.alpha : 1,
      0,
      1
    ),
    overlayOnly: packet.overlayOnly === true,

    terrainClass: normalizeString(packet.terrainClass, "NONE"),
    biomeType: normalizeString(packet.biomeType, "NONE"),
    surfaceClass: normalizeString(packet.surfaceClass, "NONE"),
    terrainOrgan: normalizeString(packet.terrainOrgan, "NONE"),

    continuityWeight: clamp(
      isFiniteNumber(packet.continuityWeight) ? packet.continuityWeight : 0,
      0,
      1
    ),
    variationWeight: clamp(
      isFiniteNumber(packet.variationWeight) ? packet.variationWeight : 0,
      0,
      1
    ),
    exposureWeight: clamp(
      isFiniteNumber(packet.exposureWeight) ? packet.exposureWeight : 0,
      0,
      1
    ),
    retentionWeight: clamp(
      isFiniteNumber(packet.retentionWeight) ? packet.retentionWeight : 0,
      0,
      1
    ),
    packetSeparationWeight: clamp(
      isFiniteNumber(packet.packetSeparationWeight) ? packet.packetSeparationWeight : 0,
      0,
      1
    ),

    directionalClass: normalizeString(packet.directionalClass, "CENTERED"),
    directionalWeight: clamp(
      isFiniteNumber(packet.directionalWeight) ? packet.directionalWeight : 0,
      0,
      1
    ),
    directionalNorthBias: clamp(
      isFiniteNumber(packet.directionalNorthBias) ? packet.directionalNorthBias : 0,
      0,
      1
    ),
    directionalSouthBias: clamp(
      isFiniteNumber(packet.directionalSouthBias) ? packet.directionalSouthBias : 0,
      0,
      1
    ),
    directionalEastBias: clamp(
      isFiniteNumber(packet.directionalEastBias) ? packet.directionalEastBias : 0,
      0,
      1
    ),
    directionalWestBias: clamp(
      isFiniteNumber(packet.directionalWestBias) ? packet.directionalWestBias : 0,
      0,
      1
    ),
    directionalContrast: clamp(
      isFiniteNumber(packet.directionalContrast) ? packet.directionalContrast : 0,
      0,
      1
    ),

    renderIntent: Object.freeze({
      drawsTerrain: true,
      ownsElevation: false,
      ownsCut: false,
      ownsBotany: false,
      ownsHydration: false,
      ownsBoot: false,
      ownsRuntime: false,
      ownsTruth: false,
      baselineCoverage: "LAND_100_PERCENT"
    })
  });
}

/* =========================
   ENTRY
========================= */

export function resolveTerrainPacket({
  sample,
  pointSizePx,
  baseColor = "rgba(86,150,86,0.88)"
}) {
  if (!sample || sample.landMask !== 1) return null;

  const safePointSizePx = clamp(
    isFiniteNumber(pointSizePx) ? pointSizePx : 1,
    0.6,
    12
  );

  const packet = resolvePacket(sample, safePointSizePx);
  return normalizePacket(packet, baseColor, safePointSizePx);
}

export default Object.freeze({
  resolveTerrainPacket
});
