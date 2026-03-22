// /world/render/terrain_render_engine.js
// MODE: RENDER EXTENSION CONTRACT RENEWAL
// STATUS: TERRAIN FACTOR AUTHORITY v5
// ROLE:
// - read planet-engine-facing terrain fields only
// - classify terrain packet only
// - return normalized packet or null
// - remain coherent with hydration contract family
// - own no boot, no runtime, no truth
// - increase terrain expression without changing ownership boundaries
// - strengthen directional contrast, contour compression, and class separation

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
   THRESHOLD CLASSES
========================= */

function classifyTerrainClass(sample) {
  return normalizeString(sample?.terrainClass, "NONE");
}

function classifyBiomeType(sample) {
  return normalizeString(sample?.biomeType, "NONE");
}

function classifyHeightClass(sample) {
  const terrainClass = classifyTerrainClass(sample);
  const biomeType = classifyBiomeType(sample);

  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const summitStrength = clamp(toNumber(sample?.strongestSummitScore, 0), 0, 1);

  if (
    terrainClass === "POLAR_ICE" ||
    terrainClass === "GLACIAL_HIGHLAND" ||
    biomeType === "GLACIER"
  ) {
    return "GLACIAL_HIGHLAND";
  }

  if (elevation >= 0.72 || summitStrength >= 0.30 || terrainClass === "SUMMIT") return "SUMMIT";
  if (elevation >= 0.56 || ridgeStrength >= 0.34 || terrainClass === "MOUNTAIN") return "MOUNTAIN";
  if ((ridgeStrength >= 0.18 && elevation >= 0.32) || terrainClass === "RIDGE") return "RIDGE";
  if ((plateauStrength >= 0.52 && elevation >= 0.24) || terrainClass === "PLATEAU") return "PLATEAU";
  if (elevation >= 0.42) return "HIGHLAND";
  if (elevation >= 0.26 || terrainClass === "FOOTHILL") return "FOOTHILL";
  if (elevation >= 0.16) return "UPLAND";
  return "LOWLAND";
}

function classifyCutClass(sample) {
  const terrainClass = classifyTerrainClass(sample);

  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const curvatureAbs = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);
  const discontinuityStrength = clamp(curvatureAbs + slope, 0, 1);

  if (terrainClass === "CANYON") return "CANYON";

  if (slope >= 0.65 && discontinuityStrength >= 0.72) return "CLIFF";
  if (slope >= 0.48 && plateauStrength >= 0.40 && toNumber(sample?.elevation, 0) >= 0.28) return "ESCARPMENT";
  if (sample?.creviceId != null && slope >= 0.48) return "CREVICE";
  if (sample?.canyonId != null || (canyonStrength >= 0.30 && slope >= 0.18)) return "CANYON";
  if (sample?.valleyId != null && slope >= 0.34 && basinStrength >= 0.28) return "GORGE";
  if (slope >= 0.12) return "SLOPE";

  return "NONE";
}

function classifyTerrainOrgan(sample) {
  const terrainClass = classifyTerrainClass(sample);
  const biomeType = classifyBiomeType(sample);
  const heightClass = classifyHeightClass(sample);

  if (terrainClass === "BASIN") return "INTAKE_BASIN";
  if (heightClass === "SUMMIT" || heightClass === "MOUNTAIN") return "PRESSURE_TOWER";
  if (heightClass === "PLATEAU") return "REGULATORY_SHELF";
  if (
    terrainClass === "POLAR_ICE" ||
    terrainClass === "GLACIAL_HIGHLAND" ||
    biomeType === "GLACIER"
  ) {
    return "FROZEN_RESERVE";
  }

  return "NONE";
}

/* =========================
   BASE METRICS
========================= */

function computeReliefWeight(sample) {
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const summitStrength = clamp(toNumber(sample?.strongestSummitScore, 0), 0, 1);

  return clamp(
    elevation * 0.42 +
    ridgeStrength * 0.24 +
    plateauStrength * 0.14 +
    basinStrength * 0.08 +
    summitStrength * 0.22,
    0,
    1
  );
}

function computeDiscontinuityWeight(sample) {
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);

  return clamp(
    slope * 0.48 +
    curvature * 0.28 +
    canyonStrength * 0.24,
    0,
    1
  );
}

/* =========================
   EXPRESSION METRICS v5
========================= */

function computeDirectionalRelief(sample) {
  const lat = toNumber(sample?.latDeg, 0) * Math.PI / 180;
  const lon = toNumber(sample?.lonDeg, 0) * Math.PI / 180;

  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);

  const northBias = clamp(
    Math.abs(Math.sin(lat)) * 0.30 +
    elevation * 0.24 +
    ridgeStrength * 0.28 +
    plateauStrength * 0.10,
    0,
    1
  );

  const southBias = clamp(
    basinStrength * 0.34 +
    canyonStrength * 0.22 +
    slope * 0.18 +
    (1 - elevation) * 0.14 +
    Math.abs(Math.sin(lat)) * 0.12,
    0,
    1
  );

  const eastBias = clamp(
    Math.abs(Math.sin(lon)) * 0.28 +
    slope * 0.24 +
    curvature * 0.18 +
    ridgeStrength * 0.10,
    0,
    1
  );

  const westBias = clamp(
    Math.abs(Math.cos(lon)) * 0.28 +
    plateauStrength * 0.20 +
    basinStrength * 0.14 +
    curvature * 0.12,
    0,
    1
  );

  const dominantDirectionalRelief = Math.max(northBias, southBias, eastBias, westBias);

  let directionalClass = "CENTERED";
  if (dominantDirectionalRelief === northBias) directionalClass = "NORTH";
  else if (dominantDirectionalRelief === southBias) directionalClass = "SOUTH";
  else if (dominantDirectionalRelief === eastBias) directionalClass = "EAST";
  else if (dominantDirectionalRelief === westBias) directionalClass = "WEST";

  return {
    directionalClass,
    directionalReliefWeight: dominantDirectionalRelief,
    directionalNorthBias: northBias,
    directionalSouthBias: southBias,
    directionalEastBias: eastBias,
    directionalWestBias: westBias
  };
}

function computeEdgeSharpness(sample) {
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);

  return clamp(
    slope * 0.42 +
    curvature * 0.26 +
    canyonStrength * 0.18 +
    ridgeStrength * 0.08 +
    plateauStrength * 0.06,
    0,
    1
  );
}

function computeMicroVariation(sample) {
  const lat = toNumber(sample?.latDeg, 0) * Math.PI / 180;
  const lon = toNumber(sample?.lonDeg, 0) * Math.PI / 180;
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);

  const waveA = Math.sin((lon * 7.0) + (lat * 3.0));
  const waveB = Math.cos((lon * 11.0) - (lat * 5.0));
  const waveC = Math.sin((lon * 17.0) + (elevation * Math.PI * 2));
  const waveD = Math.cos((lon * 19.0) + (lat * 2.5));

  const raw = (waveA * 0.34) + (waveB * 0.26) + (waveC * 0.22) + (waveD * 0.18);
  const normalized = clamp((raw + 1) * 0.5, 0, 1);

  return clamp(
    normalized * 0.48 +
    ridgeStrength * 0.18 +
    basinStrength * 0.12 +
    slope * 0.16 +
    elevation * 0.06,
    0,
    1
  );
}

function computeContinuityWeight(sample) {
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const summitStrength = clamp(toNumber(sample?.strongestSummitScore, 0), 0, 1);

  return clamp(
    elevation * 0.20 +
    ridgeStrength * 0.28 +
    plateauStrength * 0.18 +
    basinStrength * 0.16 +
    summitStrength * 0.18,
    0,
    1
  );
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

function computeContourCompression(sample, reliefWeight, edgeSharpness) {
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);

  return clamp(
    reliefWeight * 0.32 +
    edgeSharpness * 0.30 +
    slope * 0.22 +
    curvature * 0.10 +
    elevation * 0.06,
    0,
    1
  );
}

function computeCrestFactor(sample, heightClass, cutClass) {
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength, 0), 0, 1);
  const summitStrength = clamp(toNumber(sample?.strongestSummitScore, 0), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const elevation = clamp(toNumber(sample?.elevation, 0), 0, 1);

  let classBoost = 0;
  if (heightClass === "SUMMIT") classBoost = 0.22;
  else if (heightClass === "MOUNTAIN") classBoost = 0.16;
  else if (heightClass === "RIDGE") classBoost = 0.14;
  else if (heightClass === "PLATEAU") classBoost = 0.08;
  else if (cutClass === "CLIFF" || cutClass === "ESCARPMENT") classBoost = 0.10;

  return clamp(
    summitStrength * 0.34 +
    ridgeStrength * 0.26 +
    plateauStrength * 0.12 +
    elevation * 0.18 +
    classBoost,
    0,
    1
  );
}

function computeShelfFactor(sample, heightClass) {
  const plateauStrength = clamp(toNumber(sample?.plateauStrength, 0), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);

  let classBoost = 0;
  if (heightClass === "PLATEAU") classBoost = 0.20;
  else if (heightClass === "HIGHLAND") classBoost = 0.08;

  return clamp(
    plateauStrength * 0.42 +
    basinStrength * 0.08 +
    curvature * 0.10 +
    classBoost,
    0,
    1
  );
}

function computeCutFactor(sample, cutClass) {
  const canyonStrength = clamp(toNumber(sample?.canyonStrength, 0), 0, 1);
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature, 0)), 0, 1);

  let classBoost = 0;
  if (cutClass === "CLIFF") classBoost = 0.22;
  else if (cutClass === "ESCARPMENT") classBoost = 0.18;
  else if (cutClass === "CANYON" || cutClass === "GORGE" || cutClass === "CREVICE") classBoost = 0.20;
  else if (cutClass === "SLOPE") classBoost = 0.06;

  return clamp(
    canyonStrength * 0.28 +
    slope * 0.30 +
    curvature * 0.16 +
    classBoost,
    0,
    1
  );
}

function strengthenPacketSeparation(heightClass, cutClass, reliefWeight, edgeSharpness, contourCompression, directionalContrast) {
  const base =
    heightClass === "SUMMIT" ? 0.88 :
    heightClass === "MOUNTAIN" ? 0.78 :
    cutClass === "CLIFF" || cutClass === "ESCARPMENT" ? 0.86 :
    cutClass === "CANYON" || cutClass === "GORGE" || cutClass === "CREVICE" ? 0.82 :
    heightClass === "RIDGE" ? 0.70 :
    heightClass === "PLATEAU" ? 0.66 :
    heightClass === "HIGHLAND" ? 0.56 :
    heightClass === "FOOTHILL" ? 0.46 :
    heightClass === "UPLAND" ? 0.34 : 0.22;

  return clamp(
    base +
    reliefWeight * 0.08 +
    edgeSharpness * 0.08 +
    contourCompression * 0.06 +
    directionalContrast * 0.04,
    0,
    1
  );
}

function deriveExpressionMeta(sample) {
  const terrainClass = classifyTerrainClass(sample);
  const heightClass = classifyHeightClass(sample);
  const cutClass = classifyCutClass(sample);
  const terrainOrgan = classifyTerrainOrgan(sample);

  const reliefWeight = computeReliefWeight(sample);
  const discontinuityWeight = computeDiscontinuityWeight(sample);
  const edgeSharpness = computeEdgeSharpness(sample);
  const microVariation = computeMicroVariation(sample);
  const continuityWeight = computeContinuityWeight(sample);
  const directional = computeDirectionalRelief(sample);
  const directionalContrast = computeDirectionalContrast(directional);
  const contourCompression = computeContourCompression(sample, reliefWeight, edgeSharpness);
  const crestFactor = computeCrestFactor(sample, heightClass, cutClass);
  const shelfFactor = computeShelfFactor(sample, heightClass);
  const cutFactor = computeCutFactor(sample, cutClass);
  const packetSeparationWeight = strengthenPacketSeparation(
    heightClass,
    cutClass,
    reliefWeight,
    edgeSharpness,
    contourCompression,
    directionalContrast
  );

  return {
    terrainClass,
    heightClass,
    cutClass,
    terrainOrgan,
    reliefWeight,
    discontinuityWeight,
    edgeSharpness,
    microVariation,
    continuityWeight,
    packetSeparationWeight,
    directionalClass: directional.directionalClass,
    directionalReliefWeight: directional.directionalReliefWeight,
    directionalNorthBias: directional.directionalNorthBias,
    directionalSouthBias: directional.directionalSouthBias,
    directionalEastBias: directional.directionalEastBias,
    directionalWestBias: directional.directionalWestBias,
    directionalContrast,
    contourCompression,
    crestFactor,
    shelfFactor,
    cutFactor
  };
}

/* =========================
   PACKET MODULATION
========================= */

function tintColor(baseColor, lightenShift, darkenShift, greenShift = 0, blueShift = 0) {
  const match = /^rgba\((\d+),(\d+),(\d+),([^)]+)\)$/.exec(baseColor.replace(/\s+/g, ""));
  if (!match) return baseColor;

  const r = clamp(Number(match[1]) + lightenShift - darkenShift, 0, 255);
  const g = clamp(Number(match[2]) + Math.round((lightenShift * 0.6) - (darkenShift * 0.5) + greenShift), 0, 255);
  const b = clamp(Number(match[3]) + Math.round((lightenShift * 0.4) - (darkenShift * 0.7) + blueShift), 0, 255);
  const a = clamp(Number(match[4]), 0, 1);

  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

function scaleRadius(baseRadiusPx, packetSeparationWeight, edgeSharpness, microVariation, contourCompression) {
  return baseRadiusPx * clamp(
    0.92 +
    packetSeparationWeight * 0.18 +
    edgeSharpness * 0.08 +
    contourCompression * 0.06 +
    (microVariation - 0.5) * 0.05,
    0.76,
    1.40
  );
}

function sharpenAlpha(baseAlpha, edgeSharpness, directionalReliefWeight, directionalContrast) {
  return clamp(
    baseAlpha +
    edgeSharpness * 0.12 +
    directionalReliefWeight * 0.05 +
    directionalContrast * 0.05,
    0,
    1
  );
}

/* =========================
   PACKET RESOLUTION
========================= */

function resolveGlacialPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: tintColor(
      "rgba(232,240,248,0.96)",
      Math.round(meta.microVariation * 8 + meta.crestFactor * 4),
      Math.round(meta.edgeSharpness * 4),
      0,
      Math.round(meta.directionalReliefWeight * 5 + meta.directionalContrast * 4)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.16, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
    alpha: sharpenAlpha(1, meta.edgeSharpness * 0.20, meta.directionalReliefWeight * 0.16, meta.directionalContrast * 0.14),
    overlayOnly: false,
    ...meta
  };
}

function resolveSummitPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: tintColor(
      "rgba(210,214,206,0.96)",
      Math.round(meta.directionalReliefWeight * 10 + meta.crestFactor * 8),
      Math.round(meta.edgeSharpness * 5 + meta.cutFactor * 3)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.24, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
    alpha: sharpenAlpha(1, meta.edgeSharpness * 0.28, meta.directionalReliefWeight * 0.18, meta.directionalContrast * 0.18),
    overlayOnly: false,
    ...meta
  };
}

function resolveMountainPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: tintColor(
      "rgba(172,168,154,0.94)",
      Math.round(meta.directionalReliefWeight * 8 + meta.crestFactor * 5),
      Math.round(meta.edgeSharpness * 7 + meta.cutFactor * 2)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.16, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
    alpha: sharpenAlpha(1, meta.edgeSharpness * 0.28, meta.directionalReliefWeight * 0.16, meta.directionalContrast * 0.14),
    overlayOnly: false,
    ...meta
  };
}

function resolveCliffPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: tintColor(
      "rgba(156,146,122,0.94)",
      Math.round(meta.directionalReliefWeight * 4 + meta.contourCompression * 4),
      Math.round(meta.edgeSharpness * 12 + meta.cutFactor * 5)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.12, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
    alpha: sharpenAlpha(1, meta.edgeSharpness * 0.40, meta.directionalReliefWeight * 0.12, meta.directionalContrast * 0.12),
    overlayOnly: false,
    ...meta
  };
}

function resolveCutPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: tintColor(
      "rgba(124,116,96,0.92)",
      Math.round(meta.directionalReliefWeight * 3 + meta.contourCompression * 3),
      Math.round(meta.edgeSharpness * 14 + meta.cutFactor * 6)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.04, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
    alpha: sharpenAlpha(1, meta.edgeSharpness * 0.40, meta.directionalReliefWeight * 0.10, meta.directionalContrast * 0.10),
    overlayOnly: false,
    ...meta
  };
}

function resolveRidgePacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: tintColor(
      "rgba(138,154,110,0.92)",
      Math.round(meta.directionalReliefWeight * 7 + meta.crestFactor * 4),
      Math.round(meta.edgeSharpness * 6),
      Math.round(meta.microVariation * 5 + meta.shelfFactor * 2)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.10, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
    alpha: sharpenAlpha(1, meta.edgeSharpness * 0.20, meta.directionalReliefWeight * 0.14, meta.directionalContrast * 0.12),
    overlayOnly: false,
    ...meta
  };
}

function resolvePlateauPacket(sample, pointSizePx, meta) {
  const plateauRole = normalizeString(sample?.plateauRole, "NONE");

  let baseColor = "rgba(132,150,102,0.90)";
  let baseRadiusPx = pointSizePx * 1.06;

  if (plateauRole === "CORE") {
    baseColor = "rgba(144,160,112,0.94)";
    baseRadiusPx = pointSizePx * 1.12;
  } else if (plateauRole === "EDGE") {
    baseColor = "rgba(136,152,106,0.92)";
    baseRadiusPx = pointSizePx * 1.10;
  }

  return {
    layer: "terrain",
    color: tintColor(
      baseColor,
      Math.round(meta.directionalReliefWeight * 5 + meta.shelfFactor * 4),
      Math.round(meta.edgeSharpness * 4 + meta.cutFactor * 2),
      Math.round(meta.microVariation * 4 + meta.continuityWeight * 2)
    ),
    radiusPx: scaleRadius(baseRadiusPx, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
    alpha: sharpenAlpha(1, meta.edgeSharpness * 0.16, meta.directionalReliefWeight * 0.12, meta.directionalContrast * 0.10),
    overlayOnly: false,
    ...meta
  };
}

function resolveBasinPacket(sample, pointSizePx, meta) {
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);
  const baseColor = basinStrength >= 0.42
    ? "rgba(88,124,76,0.92)"
    : "rgba(98,132,84,0.90)";
  const baseRadiusPx = pointSizePx * (basinStrength >= 0.42 ? 1.02 : 1.00);

  return {
    layer: "terrain",
    color: tintColor(
      baseColor,
      Math.round(meta.microVariation * 4 + meta.continuityWeight * 2),
      Math.round(meta.edgeSharpness * 5),
      Math.round(meta.continuityWeight * 4 + meta.shelfFactor * 2),
      Math.round(meta.directionalContrast * 3)
    ),
    radiusPx: scaleRadius(baseRadiusPx, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
    alpha: sharpenAlpha(1, meta.edgeSharpness * 0.18, meta.directionalReliefWeight * 0.08, meta.directionalContrast * 0.08),
    overlayOnly: false,
    ...meta
  };
}

function resolveHighlandPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: tintColor(
      "rgba(126,148,96,0.90)",
      Math.round(meta.directionalReliefWeight * 5 + meta.shelfFactor * 2),
      Math.round(meta.edgeSharpness * 4),
      Math.round(meta.microVariation * 3)
    ),
    radiusPx: scaleRadius(pointSizePx * 1.06, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
    alpha: sharpenAlpha(1, meta.edgeSharpness * 0.14, meta.directionalReliefWeight * 0.10, meta.directionalContrast * 0.08),
    overlayOnly: false,
    ...meta
  };
}

function resolveUplandPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: tintColor(
      "rgba(108,144,92,0.90)",
      Math.round(meta.directionalReliefWeight * 4 + meta.microVariation * 2),
      Math.round(meta.edgeSharpness * 3),
      Math.round(meta.microVariation * 4)
    ),
    radiusPx: scaleRadius(pointSizePx, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
    alpha: sharpenAlpha(1, meta.edgeSharpness * 0.08, meta.directionalReliefWeight * 0.06, meta.directionalContrast * 0.06),
    overlayOnly: false,
    ...meta
  };
}

function resolveFallbackPacket(sample, pointSizePx, meta) {
  if (meta.reliefWeight >= 0.72) {
    return {
      layer: "terrain",
      color: tintColor(
        "rgba(154,160,142,0.92)",
        Math.round(meta.directionalReliefWeight * 4 + meta.crestFactor * 2),
        Math.round(meta.edgeSharpness * 4)
      ),
      radiusPx: scaleRadius(pointSizePx * 1.10, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
      alpha: sharpenAlpha(1, meta.edgeSharpness * 0.16, meta.directionalReliefWeight * 0.08, meta.directionalContrast * 0.06),
      overlayOnly: false,
      ...meta
    };
  }

  if (meta.reliefWeight >= 0.46) {
    return {
      layer: "terrain",
      color: tintColor(
        "rgba(126,148,96,0.90)",
        Math.round(meta.directionalReliefWeight * 4),
        Math.round(meta.edgeSharpness * 4)
      ),
      radiusPx: scaleRadius(pointSizePx * 1.04, meta.packetSeparationWeight, meta.edgeSharpness, meta.microVariation, meta.contourCompression),
      alpha: sharpenAlpha(1, meta.edgeSharpness * 0.12, meta.directionalReliefWeight * 0.08, meta.directionalContrast * 0.06),
      overlayOnly: false,
      ...meta
    };
  }

  return null;
}

function resolvePacket(sample, pointSizePx) {
  const meta = deriveExpressionMeta(sample);

  if (meta.heightClass === "GLACIAL_HIGHLAND") {
    return resolveGlacialPacket(pointSizePx, meta);
  }

  if (meta.heightClass === "SUMMIT") {
    return resolveSummitPacket(pointSizePx, meta);
  }

  if (meta.heightClass === "MOUNTAIN") {
    return resolveMountainPacket(pointSizePx, meta);
  }

  if (meta.cutClass === "CLIFF" || meta.cutClass === "ESCARPMENT") {
    return resolveCliffPacket(pointSizePx, meta);
  }

  if (meta.cutClass === "CANYON" || meta.cutClass === "GORGE" || meta.cutClass === "CREVICE") {
    return resolveCutPacket(pointSizePx, meta);
  }

  if (meta.heightClass === "RIDGE") {
    return resolveRidgePacket(pointSizePx, meta);
  }

  if (meta.heightClass === "PLATEAU") {
    return resolvePlateauPacket(sample, pointSizePx, meta);
  }

  if (meta.terrainClass === "BASIN" && classifyBiomeType(sample) !== "WETLAND") {
    return resolveBasinPacket(sample, pointSizePx, meta);
  }

  if (meta.heightClass === "HIGHLAND") {
    return resolveHighlandPacket(pointSizePx, meta);
  }

  if (meta.heightClass === "FOOTHILL" || meta.heightClass === "UPLAND" || meta.heightClass === "LOWLAND") {
    return resolveUplandPacket(pointSizePx, meta);
  }

  return resolveFallbackPacket(sample, pointSizePx, meta);
}

/* =========================
   NORMALIZATION
========================= */

function normalizePacket(packet, fallbackColor, fallbackRadiusPx) {
  if (!packet || typeof packet !== "object") return null;

  return Object.freeze({
    contractId: "TERRAIN_RENDER_CONTRACT_v5",
    engineKey: "terrain",
    layer: normalizeString(packet.layer, "terrain"),
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
    heightClass: normalizeString(packet.heightClass, "NONE"),
    cutClass: normalizeString(packet.cutClass, "NONE"),
    terrainOrgan: normalizeString(packet.terrainOrgan, "NONE"),

    reliefWeight: clamp(
      isFiniteNumber(packet.reliefWeight) ? packet.reliefWeight : 0,
      0,
      1
    ),
    discontinuityWeight: clamp(
      isFiniteNumber(packet.discontinuityWeight) ? packet.discontinuityWeight : 0,
      0,
      1
    ),
    edgeSharpness: clamp(
      isFiniteNumber(packet.edgeSharpness) ? packet.edgeSharpness : 0,
      0,
      1
    ),
    microVariation: clamp(
      isFiniteNumber(packet.microVariation) ? packet.microVariation : 0,
      0,
      1
    ),
    continuityWeight: clamp(
      isFiniteNumber(packet.continuityWeight) ? packet.continuityWeight : 0,
      0,
      1
    ),
    packetSeparationWeight: clamp(
      isFiniteNumber(packet.packetSeparationWeight) ? packet.packetSeparationWeight : 0,
      0,
      1
    ),
    directionalClass: normalizeString(packet.directionalClass, "CENTERED"),
    directionalReliefWeight: clamp(
      isFiniteNumber(packet.directionalReliefWeight) ? packet.directionalReliefWeight : 0,
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
    contourCompression: clamp(
      isFiniteNumber(packet.contourCompression) ? packet.contourCompression : 0,
      0,
      1
    ),
    crestFactor: clamp(
      isFiniteNumber(packet.crestFactor) ? packet.crestFactor : 0,
      0,
      1
    ),
    shelfFactor: clamp(
      isFiniteNumber(packet.shelfFactor) ? packet.shelfFactor : 0,
      0,
      1
    ),
    cutFactor: clamp(
      isFiniteNumber(packet.cutFactor) ? packet.cutFactor : 0,
      0,
      1
    ),

    renderIntent: Object.freeze({
      drawsTerrain: true,
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
}
