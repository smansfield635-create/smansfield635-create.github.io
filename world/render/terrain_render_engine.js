// /world/render/terrain_render_engine.js
// MODE: RENDER EXTENSION CONTRACT RENEWAL
// STATUS: TERRAIN FACTOR AUTHORITY v3
// ROLE:
// - read planet-engine-facing terrain fields only
// - classify terrain packet only
// - return normalized packet or null
// - remain coherent with hydration contract family
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
   METRICS
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
   PACKET RESOLUTION
========================= */

function resolveGlacialPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: "rgba(232,240,248,0.96)",
    radiusPx: pointSizePx * 1.16,
    alpha: 1,
    overlayOnly: false,
    ...meta
  };
}

function resolveSummitPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: "rgba(210,214,206,0.96)",
    radiusPx: pointSizePx * 1.22,
    alpha: 1,
    overlayOnly: false,
    ...meta
  };
}

function resolveMountainPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: "rgba(172,168,154,0.94)",
    radiusPx: pointSizePx * 1.14,
    alpha: 1,
    overlayOnly: false,
    ...meta
  };
}

function resolveCliffPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: "rgba(156,146,122,0.94)",
    radiusPx: pointSizePx * 1.10,
    alpha: 1,
    overlayOnly: false,
    ...meta
  };
}

function resolveCutPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: "rgba(124,116,96,0.92)",
    radiusPx: pointSizePx * 1.02,
    alpha: 1,
    overlayOnly: false,
    ...meta
  };
}

function resolveRidgePacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: "rgba(138,154,110,0.92)",
    radiusPx: pointSizePx * 1.08,
    alpha: 1,
    overlayOnly: false,
    ...meta
  };
}

function resolvePlateauPacket(sample, pointSizePx, meta) {
  const plateauRole = normalizeString(sample?.plateauRole, "NONE");

  if (plateauRole === "CORE") {
    return {
      layer: "terrain",
      color: "rgba(144,160,112,0.94)",
      radiusPx: pointSizePx * 1.10,
      alpha: 1,
      overlayOnly: false,
      ...meta
    };
  }

  if (plateauRole === "EDGE") {
    return {
      layer: "terrain",
      color: "rgba(136,152,106,0.92)",
      radiusPx: pointSizePx * 1.08,
      alpha: 1,
      overlayOnly: false,
      ...meta
    };
  }

  return {
    layer: "terrain",
    color: "rgba(132,150,102,0.90)",
    radiusPx: pointSizePx * 1.06,
    alpha: 1,
    overlayOnly: false,
    ...meta
  };
}

function resolveBasinPacket(sample, pointSizePx, meta) {
  const basinStrength = clamp(toNumber(sample?.basinStrength, 0), 0, 1);

  return {
    layer: "terrain",
    color: basinStrength >= 0.42
      ? "rgba(88,124,76,0.92)"
      : "rgba(98,132,84,0.90)",
    radiusPx: pointSizePx * (basinStrength >= 0.42 ? 1.00 : 0.98),
    alpha: 1,
    overlayOnly: false,
    ...meta
  };
}

function resolveHighlandPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: "rgba(126,148,96,0.90)",
    radiusPx: pointSizePx * 1.04,
    alpha: 1,
    overlayOnly: false,
    ...meta
  };
}

function resolveUplandPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    color: "rgba(108,144,92,0.90)",
    radiusPx: pointSizePx,
    alpha: 1,
    overlayOnly: false,
    ...meta
  };
}

function resolveFallbackPacket(sample, pointSizePx, meta) {
  const reliefWeight = computeReliefWeight(sample);

  if (reliefWeight >= 0.72) {
    return {
      layer: "terrain",
      color: "rgba(154,160,142,0.92)",
      radiusPx: pointSizePx * 1.10,
      alpha: 1,
      overlayOnly: false,
      ...meta
    };
  }

  if (reliefWeight >= 0.46) {
    return {
      layer: "terrain",
      color: "rgba(126,148,96,0.90)",
      radiusPx: pointSizePx * 1.04,
      alpha: 1,
      overlayOnly: false,
      ...meta
    };
  }

  return null;
}

function resolvePacket(sample, pointSizePx) {
  const terrainClass = classifyTerrainClass(sample);
  const heightClass = classifyHeightClass(sample);
  const cutClass = classifyCutClass(sample);
  const terrainOrgan = classifyTerrainOrgan(sample);
  const reliefWeight = computeReliefWeight(sample);
  const discontinuityWeight = computeDiscontinuityWeight(sample);

  const meta = {
    terrainClass,
    heightClass,
    cutClass,
    terrainOrgan,
    reliefWeight,
    discontinuityWeight
  };

  if (heightClass === "GLACIAL_HIGHLAND") {
    return resolveGlacialPacket(pointSizePx, meta);
  }

  if (heightClass === "SUMMIT") {
    return resolveSummitPacket(pointSizePx, meta);
  }

  if (heightClass === "MOUNTAIN") {
    return resolveMountainPacket(pointSizePx, meta);
  }

  if (cutClass === "CLIFF" || cutClass === "ESCARPMENT") {
    return resolveCliffPacket(pointSizePx, meta);
  }

  if (cutClass === "CANYON" || cutClass === "GORGE" || cutClass === "CREVICE") {
    return resolveCutPacket(pointSizePx, meta);
  }

  if (heightClass === "RIDGE") {
    return resolveRidgePacket(pointSizePx, meta);
  }

  if (heightClass === "PLATEAU") {
    return resolvePlateauPacket(sample, pointSizePx, meta);
  }

  if (terrainClass === "BASIN" && classifyBiomeType(sample) !== "WETLAND") {
    return resolveBasinPacket(sample, pointSizePx, meta);
  }

  if (heightClass === "HIGHLAND") {
    return resolveHighlandPacket(pointSizePx, meta);
  }

  if (heightClass === "FOOTHILL" || heightClass === "UPLAND" || heightClass === "LOWLAND") {
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
    contractId: "TERRAIN_RENDER_CONTRACT_v3",
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
});
