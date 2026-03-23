// /world/render/terrain/elevation_render/index.js
// MODE: RENDER EXTENSION CONTRACT RENEWAL
// STATUS: ELEVATION FACTOR AUTHORITY v2
// ROLE:
// - read planet-engine-facing elevation fields only
// - classify terrain-family upward emphasis only
// - return normalized packet or null
// - own no terrain baseline coverage
// - own no cut / incision coverage
// - own no botany coverage
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
   CLASSIFICATION
========================= */

function classifyTerrainClass(sample) {
  return normalizeString(sample?.terrainClass, "NONE");
}

function classifyElevationClass(sample) {
  const terrainClass = classifyTerrainClass(sample);

  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const summitStrength = clamp(toNumber(sample?.strongestSummitScore, 0), 0, 1);

  if (terrainClass === "SUMMIT" || elevation >= 0.72 || summitStrength >= 0.30) return "SUMMIT";
  if (terrainClass === "MOUNTAIN" || elevation >= 0.56 || ridgeStrength >= 0.34) return "MOUNTAIN";
  if (terrainClass === "RIDGE" || (ridgeStrength >= 0.18 && elevation >= 0.32)) return "RIDGE";
  if (terrainClass === "FOOTHILL" || elevation >= 0.18 || plateauStrength >= 0.12) return "HILL";

  return "NONE";
}

function classifyElevationOrgan(sample, elevationClass) {
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const summitStrength = clamp(toNumber(sample?.strongestSummitScore, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);

  if (elevationClass === "SUMMIT") return "PEAK_NODE";
  if (elevationClass === "MOUNTAIN" && summitStrength >= 0.24) return "PRESSURE_TOWER";
  if (elevationClass === "RIDGE" && ridgeStrength >= 0.26) return "SPINE_LINE";
  if (elevationClass === "HILL" && plateauStrength >= 0.18) return "ROLLING_SHELF";

  return "NONE";
}

/* =========================
   METRICS
========================= */

function computeReliefWeight(sample) {
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const summitStrength = clamp(toNumber(sample?.strongestSummitScore, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);

  return clamp(
    elevation * 0.42 +
    ridgeStrength * 0.24 +
    summitStrength * 0.24 +
    plateauStrength * 0.10,
    0,
    1
  );
}

function computeCrestFactor(sample, elevationClass) {
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const summitStrength = clamp(toNumber(sample?.strongestSummitScore, 0), 0, 1);
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);

  const classBoost =
    elevationClass === "SUMMIT" ? 0.24 :
    elevationClass === "MOUNTAIN" ? 0.16 :
    elevationClass === "RIDGE" ? 0.12 :
    elevationClass === "HILL" ? 0.06 :
    0;

  return clamp(
    summitStrength * 0.36 +
    ridgeStrength * 0.26 +
    elevation * 0.20 +
    classBoost,
    0,
    1
  );
}

function computeShelfFactor(sample, elevationClass) {
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);

  const classBoost =
    elevationClass === "HILL" ? 0.08 :
    elevationClass === "RIDGE" ? 0.04 :
    0;

  return clamp(
    plateauStrength * 0.56 +
    curvature * 0.10 +
    classBoost,
    0,
    1
  );
}

function computeDirectionalElevation(sample) {
  const lat = toNumber(sample?.latDeg, 0) * Math.PI / 180;
  const lon = toNumber(sample?.lonDeg, 0) * Math.PI / 180;

  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const summitStrength = clamp(toNumber(sample?.strongestSummitScore, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);

  const northBias = clamp(
    Math.abs(Math.sin(lat)) * 0.30 +
    elevation * 0.24 +
    ridgeStrength * 0.22 +
    summitStrength * 0.12,
    0,
    1
  );

  const southBias = clamp(
    elevation * 0.18 +
    plateauStrength * 0.18 +
    Math.abs(Math.sin(lat)) * 0.14,
    0,
    1
  );

  const eastBias = clamp(
    Math.abs(Math.sin(lon)) * 0.28 +
    ridgeStrength * 0.22 +
    summitStrength * 0.10,
    0,
    1
  );

  const westBias = clamp(
    Math.abs(Math.cos(lon)) * 0.28 +
    plateauStrength * 0.18 +
    elevation * 0.12,
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

function computeVariation(sample) {
  const lat = toNumber(sample?.latDeg, 0) * Math.PI / 180;
  const lon = toNumber(sample?.lonDeg, 0) * Math.PI / 180;
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);

  const waveA = Math.sin((lon * 7.0) + (lat * 3.0));
  const waveB = Math.cos((lon * 11.0) - (lat * 5.0));
  const waveC = Math.sin((lon * 17.0) + (elevation * Math.PI * 2));

  return clamp(((waveA * 0.38) + (waveB * 0.34) + (waveC * 0.28) + 1) * 0.5, 0, 1);
}

function computeSeparation(elevationClass, reliefWeight, crestFactor, directionalContrast) {
  const base =
    elevationClass === "SUMMIT" ? 0.88 :
    elevationClass === "MOUNTAIN" ? 0.76 :
    elevationClass === "RIDGE" ? 0.64 :
    elevationClass === "HILL" ? 0.44 :
    0.24;

  return clamp(
    base +
    reliefWeight * 0.08 +
    crestFactor * 0.08 +
    directionalContrast * 0.04,
    0,
    1
  );
}

function deriveExpressionMeta(sample) {
  const terrainClass = classifyTerrainClass(sample);
  const elevationClass = classifyElevationClass(sample);
  const elevationOrgan = classifyElevationOrgan(sample, elevationClass);

  const reliefWeight = computeReliefWeight(sample);
  const crestFactor = computeCrestFactor(sample, elevationClass);
  const shelfFactor = computeShelfFactor(sample, elevationClass);
  const variationWeight = computeVariation(sample);
  const directional = computeDirectionalElevation(sample);
  const directionalContrast = computeDirectionalContrast(directional);
  const packetSeparationWeight = computeSeparation(
    elevationClass,
    reliefWeight,
    crestFactor,
    directionalContrast
  );

  return {
    terrainClass,
    elevationClass,
    elevationOrgan,
    reliefWeight,
    crestFactor,
    shelfFactor,
    variationWeight,
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
   MODULATION
========================= */

function tintColor(baseColor, lightenShift, darkenShift, greenShift = 0, blueShift = 0) {
  const match = /^rgba\((\d+),(\d+),(\d+),([^)]+)\)$/.exec(baseColor.replace(/\s+/g, ""));
  if (!match) return baseColor;

  const r = clamp(Number(match[1]) + lightenShift - darkenShift, 0, 255);
  const g = clamp(Number(match[2]) + Math.round((lightenShift * 0.60) - (darkenShift * 0.50) + greenShift), 0, 255);
  const b = clamp(Number(match[3]) + Math.round((lightenShift * 0.44) - (darkenShift * 0.66) + blueShift), 0, 255);
  const a = clamp(Number(match[4]), 0, 1);

  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

function scaleRadius(baseRadiusPx, packetSeparationWeight, crestFactor, variationWeight) {
  return baseRadiusPx * clamp(
    0.96 +
    packetSeparationWeight * 0.18 +
    crestFactor * 0.10 +
    (variationWeight - 0.5) * 0.06,
    0.86,
    1.42
  );
}

function sharpenAlpha(baseAlpha, directionalWeight, directionalContrast, crestFactor) {
  return clamp(
    baseAlpha +
    directionalWeight * 0.06 +
    directionalContrast * 0.06 +
    crestFactor * 0.08,
    0,
    1
  );
}

/* =========================
   PACKETS
========================= */

function resolveSummitPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "ELEVATION",
    elevationType: "SUMMIT",
    color: tintColor(
      "rgba(228,232,222,0.96)",
      Math.round(meta.directionalWeight * 10 + meta.crestFactor * 8),
      Math.round(meta.directionalContrast * 4),
      0,
      Math.round(meta.directionalWeight * 3)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.20, meta.packetSeparationWeight, meta.crestFactor, meta.variationWeight),
    alpha: sharpenAlpha(0.96, meta.directionalWeight, meta.directionalContrast, meta.crestFactor),
    overlayOnly: true,
    ...meta
  };
}

function resolveMountainPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "ELEVATION",
    elevationType: "MOUNTAIN",
    color: tintColor(
      "rgba(190,184,166,0.94)",
      Math.round(meta.directionalWeight * 8 + meta.crestFactor * 4),
      Math.round(meta.directionalContrast * 4),
      0,
      Math.round(meta.directionalWeight * 2)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.14, meta.packetSeparationWeight, meta.crestFactor, meta.variationWeight),
    alpha: sharpenAlpha(0.90, meta.directionalWeight, meta.directionalContrast, meta.crestFactor),
    overlayOnly: true,
    ...meta
  };
}

function resolveRidgePacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "ELEVATION",
    elevationType: "RIDGE",
    color: tintColor(
      "rgba(152,170,118,0.92)",
      Math.round(meta.directionalWeight * 7 + meta.crestFactor * 3),
      Math.round(meta.directionalContrast * 3),
      Math.round(meta.shelfFactor * 4),
      0
    ),
    radiusPx: scaleRadius(pointSizePx * 1.08, meta.packetSeparationWeight, meta.crestFactor, meta.variationWeight),
    alpha: sharpenAlpha(0.88, meta.directionalWeight, meta.directionalContrast, meta.crestFactor),
    overlayOnly: true,
    ...meta
  };
}

function resolveHillPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "ELEVATION",
    elevationType: "HILL",
    color: tintColor(
      "rgba(134,164,110,0.90)",
      Math.round(meta.directionalWeight * 5 + meta.shelfFactor * 2),
      Math.round(meta.directionalContrast * 2),
      Math.round(meta.shelfFactor * 5),
      0
    ),
    radiusPx: scaleRadius(pointSizePx * 1.02, meta.packetSeparationWeight, meta.crestFactor, meta.variationWeight),
    alpha: sharpenAlpha(0.84, meta.directionalWeight, meta.directionalContrast, meta.crestFactor * 0.6),
    overlayOnly: true,
    ...meta
  };
}

function resolvePacket(sample, pointSizePx) {
  const meta = deriveExpressionMeta(sample);

  if (meta.elevationClass === "SUMMIT") return resolveSummitPacket(pointSizePx, meta);
  if (meta.elevationClass === "MOUNTAIN") return resolveMountainPacket(pointSizePx, meta);
  if (meta.elevationClass === "RIDGE") return resolveRidgePacket(pointSizePx, meta);
  if (meta.elevationClass === "HILL") return resolveHillPacket(pointSizePx, meta);

  return null;
}

/* =========================
   NORMALIZATION
========================= */

function normalizePacket(packet, fallbackColor, fallbackRadiusPx) {
  if (!packet || typeof packet !== "object") return null;

  return Object.freeze({
    contractId: "TERRAIN_ELEVATION_RENDER_CONTRACT_v2",
    engineKey: "terrain.elevation",
    layer: normalizeString(packet.layer, "terrain"),
    category: normalizeString(packet.category, "TERRAIN"),
    subCategory: normalizeString(packet.subCategory, "ELEVATION"),
    elevationType: normalizeString(packet.elevationType, "NONE"),

    color: normalizeColor(packet.color, fallbackColor),
    radiusPx: clamp(isFiniteNumber(packet.radiusPx) ? packet.radiusPx : fallbackRadiusPx, 0.6, 12),
    alpha: clamp(isFiniteNumber(packet.alpha) ? packet.alpha : 1, 0, 1),
    overlayOnly: packet.overlayOnly === true,

    terrainClass: normalizeString(packet.terrainClass, "NONE"),
    elevationClass: normalizeString(packet.elevationClass, "NONE"),
    elevationOrgan: normalizeString(packet.elevationOrgan, "NONE"),

    reliefWeight: clamp(isFiniteNumber(packet.reliefWeight) ? packet.reliefWeight : 0, 0, 1),
    crestFactor: clamp(isFiniteNumber(packet.crestFactor) ? packet.crestFactor : 0, 0, 1),
    shelfFactor: clamp(isFiniteNumber(packet.shelfFactor) ? packet.shelfFactor : 0, 0, 1),
    variationWeight: clamp(isFiniteNumber(packet.variationWeight) ? packet.variationWeight : 0, 0, 1),
    packetSeparationWeight: clamp(isFiniteNumber(packet.packetSeparationWeight) ? packet.packetSeparationWeight : 0, 0, 1),

    directionalClass: normalizeString(packet.directionalClass, "CENTERED"),
    directionalWeight: clamp(isFiniteNumber(packet.directionalWeight) ? packet.directionalWeight : 0, 0, 1),
    directionalNorthBias: clamp(isFiniteNumber(packet.directionalNorthBias) ? packet.directionalNorthBias : 0, 0, 1),
    directionalSouthBias: clamp(isFiniteNumber(packet.directionalSouthBias) ? packet.directionalSouthBias : 0, 0, 1),
    directionalEastBias: clamp(isFiniteNumber(packet.directionalEastBias) ? packet.directionalEastBias : 0, 0, 1),
    directionalWestBias: clamp(isFiniteNumber(packet.directionalWestBias) ? packet.directionalWestBias : 0, 0, 1),
    directionalContrast: clamp(isFiniteNumber(packet.directionalContrast) ? packet.directionalContrast : 0, 0, 1),

    renderIntent: Object.freeze({
      drawsTerrain: false,
      drawsElevation: true,
      ownsTerrainBaseline: false,
      ownsCut: false,
      ownsBotany: false,
      ownsHydration: false,
      ownsBoot: false,
      ownsRuntime: false,
      ownsTruth: false
    })
  });
}

/* =========================
   ENTRY
========================= */

export function resolveElevationPacket({
  sample,
  pointSizePx,
  baseColor = "rgba(180,180,180,0.90)"
}) {
  if (!sample || sample.landMask !== 1) return null;

  const safePointSizePx = clamp(isFiniteNumber(pointSizePx) ? pointSizePx : 1, 0.6, 12);
  const packet = resolvePacket(sample, safePointSizePx);

  return normalizePacket(packet, baseColor, safePointSizePx);
}

export default Object.freeze({
  resolveElevationPacket
});
