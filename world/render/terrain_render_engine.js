// /world/render/terrain_render_engine.js
// MODE: RENDER EXTENSION CONTRACT EXPANSION
// STATUS: TERRAIN FACTOR AUTHORITY (EXPANDED)
// ROLE:
// - read planet-engine-facing terrain fields only
// - classify terrain packet only
// - return normalized packet or null
// - aligned with hydration contract family
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

/* =========================
   CORE CLASSIFICATION
========================= */

function classifyTerrainClass(sample) {
  return normalizeString(sample?.terrainClass, "NONE");
}

function classifyBiomeType(sample) {
  return normalizeString(sample?.biomeType, "NONE");
}

function classifyHeightClass(sample) {
  const elevation = isFiniteNumber(sample?.elevation) ? sample.elevation : 0;
  const ridgeStrength = isFiniteNumber(sample?.ridgeStrength) ? sample.ridgeStrength : 0;
  const plateauStrength = isFiniteNumber(sample?.plateauStrength) ? sample.plateauStrength : 0;
  const summitStrength = isFiniteNumber(sample?.strongestSummitScore) ? sample.strongestSummitScore : 0;

  if (sample?.terrainClass === "POLAR_ICE" || sample?.terrainClass === "GLACIAL_HIGHLAND" || sample?.biomeType === "GLACIER") {
    return "GLACIAL_HIGHLAND";
  }

  if (elevation >= 0.72 || summitStrength >= 0.30 || sample?.terrainClass === "SUMMIT") return "SUMMIT";
  if (elevation >= 0.56 || ridgeStrength >= 0.34 || sample?.terrainClass === "MOUNTAIN") return "MOUNTAIN";
  if (ridgeStrength >= 0.18 && elevation >= 0.32 || sample?.terrainClass === "RIDGE") return "RIDGE";
  if (plateauStrength >= 0.52 && elevation >= 0.24 || sample?.terrainClass === "PLATEAU") return "PLATEAU";
  if (elevation >= 0.42) return "HIGHLAND";
  if (elevation >= 0.26) return "FOOTHILL";
  if (elevation >= 0.16) return "UPLAND";
  return "LOWLAND";
}

function classifyCutClass(sample) {
  const slope = clamp(isFiniteNumber(sample?.slope) ? sample.slope : 0, 0, 1);
  const basinStrength = clamp(isFiniteNumber(sample?.basinStrength) ? sample.basinStrength : 0, 0, 1);
  const plateauStrength = clamp(isFiniteNumber(sample?.plateauStrength) ? sample.plateauStrength : 0, 0, 1);
  const curvature = isFiniteNumber(sample?.curvature) ? Math.abs(sample.curvature) : 0;
  const discontinuity = clamp(curvature + slope, 0, 1);
  const canyonStrength = clamp(isFiniteNumber(sample?.canyonStrength) ? sample.canyonStrength : 0, 0, 1);

  if (slope >= 0.65 && discontinuity >= 0.72) return "CLIFF";
  if (slope >= 0.48 && plateauStrength >= 0.40 && (sample?.elevation ?? 0) >= 0.28) return "ESCARPMENT";
  if (sample?.creviceId != null && slope >= 0.48) return "CREVICE";
  if (sample?.canyonId != null || (canyonStrength >= 0.30 && slope >= 0.18)) return "CANYON";
  if (sample?.valleyId != null && slope >= 0.34 && basinStrength >= 0.28) return "GORGE";
  if (slope >= 0.12) return "SLOPE";
  return "NONE";
}

function classifyTerrainOrgan(sample) {
  const terrainClass = classifyTerrainClass(sample);
  const biomeType = classifyBiomeType(sample);

  if (terrainClass === "SUMMIT" || terrainClass === "MOUNTAIN") return "PRESSURE_TOWER";
  if (terrainClass === "PLATEAU") return "REGULATORY_SHELF";
  if (terrainClass === "BASIN") return "INTAKE_BASIN";
  if (terrainClass === "GLACIAL_HIGHLAND" || terrainClass === "POLAR_ICE" || biomeType === "GLACIER") {
    return "FROZEN_RESERVE";
  }

  return "NONE";
}

/* =========================
   RELIEF METRIC
========================= */

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

/* =========================
   PACKET RESOLUTION
========================= */

function resolvePacket(sample, pointSizePx) {
  const terrainClass = classifyTerrainClass(sample);
  const heightClass = classifyHeightClass(sample);
  const cutClass = classifyCutClass(sample);
  const terrainOrgan = classifyTerrainOrgan(sample);
  const reliefWeight = terrainReliefWeight(sample);

  if (heightClass === "GLACIAL_HIGHLAND") {
    return {
      color: "rgba(232,240,248,0.96)",
      radiusPx: pointSizePx * 1.16,
      heightClass, cutClass, terrainClass, terrainOrgan, reliefWeight
    };
  }

  if (heightClass === "SUMMIT") {
    return {
      color: "rgba(210,214,206,0.96)",
      radiusPx: pointSizePx * 1.22,
      heightClass, cutClass, terrainClass, terrainOrgan, reliefWeight
    };
  }

  if (heightClass === "MOUNTAIN") {
    return {
      color: "rgba(172,168,154,0.94)",
      radiusPx: pointSizePx * 1.14,
      heightClass, cutClass, terrainClass, terrainOrgan, reliefWeight
    };
  }

  if (cutClass === "CLIFF" || cutClass === "ESCARPMENT") {
    return {
      color: "rgba(156,146,122,0.94)",
      radiusPx: pointSizePx * 1.10,
      heightClass, cutClass, terrainClass, terrainOrgan, reliefWeight
    };
  }

  if (cutClass === "CANYON" || cutClass === "GORGE" || cutClass === "CREVICE") {
    return {
      color: "rgba(124,116,96,0.92)",
      radiusPx: pointSizePx * 1.02,
      heightClass, cutClass, terrainClass, terrainOrgan, reliefWeight
    };
  }

  if (heightClass === "RIDGE") {
    return {
      color: "rgba(138,154,110,0.92)",
      radiusPx: pointSizePx * 1.08,
      heightClass, cutClass, terrainClass, terrainOrgan, reliefWeight
    };
  }

  if (heightClass === "PLATEAU") {
    const plateauRole = normalizeString(sample?.plateauRole, "NONE");
    return {
      color:
        plateauRole === "CORE"
          ? "rgba(144,160,112,0.94)"
          : plateauRole === "EDGE"
            ? "rgba(136,152,106,0.92)"
            : "rgba(132,150,102,0.90)",
      radiusPx:
        plateauRole === "CORE"
          ? pointSizePx * 1.10
          : plateauRole === "EDGE"
            ? pointSizePx * 1.08
            : pointSizePx * 1.06,
      heightClass, cutClass, terrainClass, terrainOrgan, reliefWeight
    };
  }

  if (terrainClass === "BASIN") {
    const basinStrength = clamp(isFiniteNumber(sample?.basinStrength) ? sample.basinStrength : 0, 0, 1);
    return {
      color: basinStrength >= 0.42
        ? "rgba(88,124,76,0.92)"
        : "rgba(98,132,84,0.90)",
      radiusPx: pointSizePx * (basinStrength >= 0.42 ? 1.00 : 0.98),
      heightClass, cutClass, terrainClass, terrainOrgan, reliefWeight
    };
  }

  if (heightClass === "HIGHLAND") {
    return {
      color: "rgba(126,148,96,0.90)",
      radiusPx: pointSizePx * 1.04,
      heightClass, cutClass, terrainClass, terrainOrgan, reliefWeight
    };
  }

  if (heightClass === "FOOTHILL" || heightClass === "UPLAND") {
    return {
      color: "rgba(108,144,92,0.90)",
      radiusPx: pointSizePx,
      heightClass, cutClass, terrainClass, terrainOrgan, reliefWeight
    };
  }

  return null;
}

/* =========================
   NORMALIZATION (HYDRATION-ALIGNED)
========================= */

function normalizePacket(packet, fallbackColor, fallbackRadiusPx) {
  if (!packet) return null;

  return Object.freeze({
    contractId: "TERRAIN_RENDER_CONTRACT_v2",
    engineKey: "terrain",
    layer: "terrain",
    color: normalizeColor(packet.color, fallbackColor),
    radiusPx: clamp(packet.radiusPx ?? fallbackRadiusPx, 0.6, 12),
    alpha: 1,
    overlayOnly: false,

    terrainClass: normalizeString(packet.terrainClass),
    heightClass: normalizeString(packet.heightClass),
    cutClass: normalizeString(packet.cutClass),
    terrainOrgan: normalizeString(packet.terrainOrgan),
    reliefWeight: clamp(packet.reliefWeight ?? 0, 0, 1),

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
