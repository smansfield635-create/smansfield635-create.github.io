// /world/render/terrain/cut_render/index.js
// MODE: RENDER EXTENSION CONTRACT RENEWAL
// STATUS: CUT FACTOR AUTHORITY v1
// ROLE:
// - read planet-engine-facing cut / incision fields only
// - classify terrain-family cut emphasis only
// - return normalized packet or null
// - own no terrain baseline coverage
// - own no elevation coverage
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

function classifyCutClass(sample) {
  const terrainClass = classifyTerrainClass(sample);

  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const curvatureAbs = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const discontinuityStrength = clamp(curvatureAbs + slope, 0, 1);

  if (terrainClass === "CLIFF" || (slope >= 0.65 && discontinuityStrength >= 0.72)) return "CLIFF";
  if (terrainClass === "ESCARPMENT" || (slope >= 0.48 && plateauStrength >= 0.40 && elevation >= 0.28)) return "ESCARPMENT";
  if (terrainClass === "CANYON" || sample?.canyonId != null || (canyonStrength >= 0.30 && slope >= 0.18)) return "CANYON";
  if (terrainClass === "GORGE" || (sample?.valleyId != null && slope >= 0.34 && basinStrength >= 0.28)) return "GORGE";

  return "NONE";
}

function classifyCutOrgan(sample, cutClass) {
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);

  if (cutClass === "CLIFF") return "DROP_WALL";
  if (cutClass === "ESCARPMENT" && slope >= 0.54) return "BOUNDARY_FACE";
  if (cutClass === "CANYON" && canyonStrength >= 0.36) return "CARVE_CHANNEL";
  if (cutClass === "GORGE") return "NARROW_CUT";

  return "NONE";
}

/* =========================
   METRICS
========================= */

function computeCutWeight(sample) {
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);

  return clamp(
    slope * 0.36 +
    curvature * 0.24 +
    canyonStrength * 0.24 +
    basinStrength * 0.16,
    0,
    1
  );
}

function computeEdgeSharpness(sample, cutClass) {
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);

  const classBoost =
    cutClass === "CLIFF" ? 0.18 :
    cutClass === "ESCARPMENT" ? 0.14 :
    cutClass === "CANYON" ? 0.16 :
    cutClass === "GORGE" ? 0.12 :
    0;

  return clamp(
    slope * 0.40 +
    curvature * 0.26 +
    canyonStrength * 0.20 +
    classBoost,
    0,
    1
  );
}

function computeChannelFactor(sample, cutClass) {
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const runoff = clamp(toNumber(sample?.runoff, 0), 0, 1);

  const classBoost =
    cutClass === "CANYON" ? 0.16 :
    cutClass === "GORGE" ? 0.14 :
    cutClass === "ESCARPMENT" ? 0.06 :
    0;

  return clamp(
    canyonStrength * 0.36 +
    basinStrength * 0.24 +
    runoff * 0.18 +
    classBoost,
    0,
    1
  );
}

function computeDirectionalCut(sample) {
  const lat = toNumber(sample?.latDeg, 0) * Math.PI / 180;
  const lon = toNumber(sample?.lonDeg, 0) * Math.PI / 180;

  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);

  const northBias = clamp(
    Math.abs(Math.sin(lat)) * 0.18 +
    slope * 0.22 +
    curvature * 0.12,
    0,
    1
  );

  const southBias = clamp(
    basinStrength * 0.26 +
    canyonStrength * 0.28 +
    slope * 0.14 +
    Math.abs(Math.sin(lat)) * 0.08,
    0,
    1
  );

  const eastBias = clamp(
    Math.abs(Math.sin(lon)) * 0.24 +
    slope * 0.18 +
    curvature * 0.18 +
    canyonStrength * 0.10,
    0,
    1
  );

  const westBias = clamp(
    Math.abs(Math.cos(lon)) * 0.24 +
    basinStrength * 0.16 +
    curvature * 0.16 +
    canyonStrength * 0.10,
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
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);

  const waveA = Math.sin((lon * 8.0) + (lat * 4.0));
  const waveB = Math.cos((lon * 12.0) - (lat * 6.0));
  const waveC = Math.sin((lon * 18.0) + (slope * Math.PI * 2));

  return clamp(((waveA * 0.36) + (waveB * 0.34) + (waveC * 0.30) + 1) * 0.5, 0, 1);
}

function computeSeparation(cutClass, cutWeight, edgeSharpness, directionalContrast) {
  const base =
    cutClass === "CLIFF" ? 0.88 :
    cutClass === "ESCARPMENT" ? 0.80 :
    cutClass === "CANYON" ? 0.82 :
    cutClass === "GORGE" ? 0.72 :
    0.20;

  return clamp(
    base +
    cutWeight * 0.08 +
    edgeSharpness * 0.08 +
    directionalContrast * 0.04,
    0,
    1
  );
}

function deriveExpressionMeta(sample) {
  const terrainClass = classifyTerrainClass(sample);
  const cutClass = classifyCutClass(sample);
  const cutOrgan = classifyCutOrgan(sample, cutClass);

  const cutWeight = computeCutWeight(sample);
  const edgeSharpness = computeEdgeSharpness(sample, cutClass);
  const channelFactor = computeChannelFactor(sample, cutClass);
  const variationWeight = computeVariation(sample);
  const directional = computeDirectionalCut(sample);
  const directionalContrast = computeDirectionalContrast(directional);
  const packetSeparationWeight = computeSeparation(
    cutClass,
    cutWeight,
    edgeSharpness,
    directionalContrast
  );

  return {
    terrainClass,
    cutClass,
    cutOrgan,
    cutWeight,
    edgeSharpness,
    channelFactor,
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
  const b = clamp(Number(match[3]) + Math.round((lightenShift * 0.34) - (darkenShift * 0.74) + blueShift), 0, 255);
  const a = clamp(Number(match[4]), 0, 1);

  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

function scaleRadius(baseRadiusPx, packetSeparationWeight, edgeSharpness, variationWeight) {
  return baseRadiusPx * clamp(
    0.94 +
    packetSeparationWeight * 0.12 +
    edgeSharpness * 0.10 +
    (variationWeight - 0.5) * 0.08,
    0.82,
    1.34
  );
}

function sharpenAlpha(baseAlpha, edgeSharpness, directionalWeight, directionalContrast) {
  return clamp(
    baseAlpha +
    edgeSharpness * 0.12 +
    directionalWeight * 0.05 +
    directionalContrast * 0.05,
    0,
    1
  );
}

/* =========================
   PACKET RESOLUTION
========================= */

function resolveCliffPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "CUT",
    cutType: "CLIFF",
    color: tintColor(
      "rgba(158,144,120,0.94)",
      Math.round(meta.directionalWeight * 4),
      Math.round(meta.edgeSharpness * 12 + meta.directionalContrast * 4)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.12, meta.packetSeparationWeight, meta.edgeSharpness, meta.variationWeight),
    alpha: sharpenAlpha(0.96, meta.edgeSharpness, meta.directionalWeight, meta.directionalContrast),
    overlayOnly: true,
    ...meta
  };
}

function resolveEscarpmentPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "CUT",
    cutType: "ESCARPMENT",
    color: tintColor(
      "rgba(148,132,108,0.92)",
      Math.round(meta.directionalWeight * 4 + meta.channelFactor * 2),
      Math.round(meta.edgeSharpness * 10 + meta.directionalContrast * 3)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.08, meta.packetSeparationWeight, meta.edgeSharpness, meta.variationWeight),
    alpha: sharpenAlpha(0.92, meta.edgeSharpness, meta.directionalWeight, meta.directionalContrast),
    overlayOnly: true,
    ...meta
  };
}

function resolveCanyonPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "CUT",
    cutType: "CANYON",
    color: tintColor(
      "rgba(126,112,94,0.92)",
      Math.round(meta.channelFactor * 3),
      Math.round(meta.edgeSharpness * 14 + meta.directionalContrast * 3),
      0,
      Math.round(meta.channelFactor * 2)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.04, meta.packetSeparationWeight, meta.edgeSharpness, meta.variationWeight),
    alpha: sharpenAlpha(0.94, meta.edgeSharpness, meta.directionalWeight, meta.directionalContrast),
    overlayOnly: true,
    ...meta
  };
}

function resolveGorgePacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "CUT",
    cutType: "GORGE",
    color: tintColor(
      "rgba(118,104,88,0.90)",
      Math.round(meta.channelFactor * 2),
      Math.round(meta.edgeSharpness * 12 + meta.directionalContrast * 2)
    ),
    radiusPx: scaleRadius(pointSizePx, meta.packetSeparationWeight, meta.edgeSharpness, meta.variationWeight),
    alpha: sharpenAlpha(0.90, meta.edgeSharpness, meta.directionalWeight, meta.directionalContrast),
    overlayOnly: true,
    ...meta
  };
}

function resolvePacket(sample, pointSizePx) {
  const meta = deriveExpressionMeta(sample);

  if (meta.cutClass === "CLIFF") return resolveCliffPacket(pointSizePx, meta);
  if (meta.cutClass === "ESCARPMENT") return resolveEscarpmentPacket(pointSizePx, meta);
  if (meta.cutClass === "CANYON") return resolveCanyonPacket(pointSizePx, meta);
  if (meta.cutClass === "GORGE") return resolveGorgePacket(pointSizePx, meta);

  return null;
}

/* =========================
   NORMALIZATION
========================= */

function normalizePacket(packet, fallbackColor, fallbackRadiusPx) {
  if (!packet || typeof packet !== "object") return null;

  return Object.freeze({
    contractId: "TERRAIN_CUT_RENDER_CONTRACT_v1",
    engineKey: "terrain.cut",
    layer: normalizeString(packet.layer, "terrain"),
    category: normalizeString(packet.category, "TERRAIN"),
    subCategory: normalizeString(packet.subCategory, "CUT"),
    cutType: normalizeString(packet.cutType, "NONE"),

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
    cutClass: normalizeString(packet.cutClass, "NONE"),
    cutOrgan: normalizeString(packet.cutOrgan, "NONE"),

    cutWeight: clamp(
      isFiniteNumber(packet.cutWeight) ? packet.cutWeight : 0,
      0,
      1
    ),
    edgeSharpness: clamp(
      isFiniteNumber(packet.edgeSharpness) ? packet.edgeSharpness : 0,
      0,
      1
    ),
    channelFactor: clamp(
      isFiniteNumber(packet.channelFactor) ? packet.channelFactor : 0,
      0,
      1
    ),
    variationWeight: clamp(
      isFiniteNumber(packet.variationWeight) ? packet.variationWeight : 0,
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
      drawsTerrain: false,
      drawsCut: true,
      ownsTerrainBaseline: false,
      ownsElevation: false,
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

export function resolveCutPacket({
  sample,
  pointSizePx,
  baseColor = "rgba(124,116,96,0.92)"
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
  resolveCutPacket
});
