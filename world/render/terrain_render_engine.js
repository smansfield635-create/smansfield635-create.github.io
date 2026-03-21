// /world/render/terrain_render_engine.js
// MODE: RENDER EXTENSION FACTOR
// STATUS: TERRAIN PORT AUTHORITY
// ROLE:
// - read planet-engine-facing terrain fields only
// - classify terrain packet only
// - return normalized packet or null
// - own no boot, no runtime, no truth

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeColor(value, fallback) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function normalizePacket(packet, fallbackColor, fallbackRadiusPx) {
  if (!packet || typeof packet !== "object") return null;

  return {
    engineKey: "terrain",
    layer: typeof packet.layer === "string" ? packet.layer : "terrain",
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
    overlayOnly: packet.overlayOnly === true
  };
}

function classifyTerrainClass(sample) {
  return typeof sample?.terrainClass === "string" ? sample.terrainClass : "LAND";
}

function classifyBiomeType(sample) {
  return typeof sample?.biomeType === "string" ? sample.biomeType : "NONE";
}

function terrainReliefWeight(sample) {
  const elevation = isFiniteNumber(sample?.elevation) ? sample.elevation : 0;
  const ridgeStrength = isFiniteNumber(sample?.ridgeStrength) ? sample.ridgeStrength : 0;
  const plateauStrength = isFiniteNumber(sample?.plateauStrength) ? sample.plateauStrength : 0;
  const basinStrength = isFiniteNumber(sample?.basinStrength) ? sample.basinStrength : 0;
  const summitStrength = isFiniteNumber(sample?.strongestSummitScore) ? sample.strongestSummitScore : 0;

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

function resolveSummitPacket(pointSizePx) {
  return {
    layer: "terrain",
    color: "rgba(210,214,206,0.96)",
    radiusPx: pointSizePx * 1.22,
    alpha: 1,
    overlayOnly: false
  };
}

function resolveMountainPacket(pointSizePx) {
  return {
    layer: "terrain",
    color: "rgba(172,168,154,0.94)",
    radiusPx: pointSizePx * 1.14,
    alpha: 1,
    overlayOnly: false
  };
}

function resolveRidgePacket(pointSizePx) {
  return {
    layer: "terrain",
    color: "rgba(138,154,110,0.92)",
    radiusPx: pointSizePx * 1.08,
    alpha: 1,
    overlayOnly: false
  };
}

function resolvePlateauPacket(sample, pointSizePx) {
  const plateauRole = typeof sample?.plateauRole === "string" ? sample.plateauRole : "NONE";

  if (plateauRole === "CORE") {
    return {
      layer: "terrain",
      color: "rgba(144,160,112,0.94)",
      radiusPx: pointSizePx * 1.10,
      alpha: 1,
      overlayOnly: false
    };
  }

  if (plateauRole === "EDGE") {
    return {
      layer: "terrain",
      color: "rgba(136,152,106,0.92)",
      radiusPx: pointSizePx * 1.08,
      alpha: 1,
      overlayOnly: false
    };
  }

  return {
    layer: "terrain",
    color: "rgba(132,150,102,0.90)",
    radiusPx: pointSizePx * 1.06,
    alpha: 1,
    overlayOnly: false
  };
}

function resolveBasinPacket(sample, pointSizePx) {
  const basinStrength = clamp(
    isFiniteNumber(sample?.basinStrength) ? sample.basinStrength : 0,
    0,
    1
  );

  return {
    layer: "terrain",
    color: basinStrength >= 0.42
      ? "rgba(88,124,76,0.92)"
      : "rgba(98,132,84,0.90)",
    radiusPx: pointSizePx * (basinStrength >= 0.42 ? 1.00 : 0.98),
    alpha: 1,
    overlayOnly: false
  };
}

function resolveGlacialPacket(pointSizePx) {
  return {
    layer: "terrain",
    color: "rgba(232,240,248,0.96)",
    radiusPx: pointSizePx * 1.16,
    alpha: 1,
    overlayOnly: false
  };
}

function resolveFallbackTerrainPacket(sample, pointSizePx) {
  const relief = terrainReliefWeight(sample);

  if (relief >= 0.72) {
    return {
      layer: "terrain",
      color: "rgba(154,160,142,0.92)",
      radiusPx: pointSizePx * 1.10,
      alpha: 1,
      overlayOnly: false
    };
  }

  if (relief >= 0.46) {
    return {
      layer: "terrain",
      color: "rgba(126,148,96,0.90)",
      radiusPx: pointSizePx * 1.04,
      alpha: 1,
      overlayOnly: false
    };
  }

  return null;
}

export function resolveTerrainPacket({
  sample,
  pointSizePx,
  baseColor = "rgba(86,150,86,0.88)"
}) {
  if (!sample || sample.landMask !== 1) return null;

  const terrainClass = classifyTerrainClass(sample);
  const biomeType = classifyBiomeType(sample);

  let packet = null;

  if (
    terrainClass === "POLAR_ICE" ||
    terrainClass === "GLACIAL_HIGHLAND" ||
    biomeType === "GLACIER"
  ) {
    packet = resolveGlacialPacket(pointSizePx);
  } else if (terrainClass === "SUMMIT") {
    packet = resolveSummitPacket(pointSizePx);
  } else if (terrainClass === "MOUNTAIN") {
    packet = resolveMountainPacket(pointSizePx);
  } else if (terrainClass === "RIDGE") {
    packet = resolveRidgePacket(pointSizePx);
  } else if (terrainClass === "PLATEAU") {
    packet = resolvePlateauPacket(sample, pointSizePx);
  } else if (terrainClass === "BASIN" && biomeType !== "WETLAND") {
    packet = resolveBasinPacket(sample, pointSizePx);
  } else {
    packet = resolveFallbackTerrainPacket(sample, pointSizePx);
  }

  return normalizePacket(packet, baseColor, pointSizePx);
}
