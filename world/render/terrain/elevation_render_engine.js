// /world/render/terrain/elevation_render_engine.js
// MODE: RENDER EXTENSION CONTRACT RENEWAL
// STATUS: ELEVATION FACTOR AUTHORITY v3
// ROLE:
// - upward emphasis only
// - overlay only
// - crest / uplift / shelf articulation only
// - no baseline ownership

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function isFiniteNumber(v) {
  return typeof v === "number" && Number.isFinite(v);
}

function toNumber(v, f = 0) {
  return isFiniteNumber(v) ? v : f;
}

function normalizeString(v, f = "NONE") {
  return typeof v === "string" && v.length > 0 ? v : f;
}

/* =========================
   CLASSIFICATION
========================= */

function classifyElevation(sample) {
  const terrainClass = normalizeString(sample?.terrainClass, "NONE");
  const elevation = clamp(toNumber(sample?.elevation), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength), 0, 1);
  const strongestSummitScore = clamp(toNumber(sample?.strongestSummitScore), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength), 0, 1);
  const backboneStrength = clamp(toNumber(sample?.backboneStrength), 0, 1);

  if (terrainClass === "SUMMIT" || elevation > 0.76 || strongestSummitScore > 0.28) {
    return "SUMMIT";
  }

  if (terrainClass === "MOUNTAIN" || elevation > 0.60 || backboneStrength > 0.54) {
    return "MOUNTAIN";
  }

  if (terrainClass === "RIDGE" || ridgeStrength > 0.24) {
    return "RIDGE";
  }

  if (terrainClass === "PLATEAU" || plateauStrength > 0.50) {
    return "PLATEAU";
  }

  if (elevation > 0.20) {
    return "HILL";
  }

  return "NONE";
}

/* =========================
   METRICS
========================= */

function computeWeight(sample) {
  const elevation = clamp(toNumber(sample?.elevation), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength), 0, 1);
  const strongestSummitScore = clamp(toNumber(sample?.strongestSummitScore), 0, 1);
  const plateauStrength = clamp(toNumber(sample?.plateauStrength), 0, 1);
  const backboneStrength = clamp(toNumber(sample?.backboneStrength), 0, 1);

  return clamp(
    elevation * 0.34 +
    ridgeStrength * 0.18 +
    strongestSummitScore * 0.24 +
    plateauStrength * 0.10 +
    backboneStrength * 0.14,
    0,
    1
  );
}

function computeCrestFactor(sample) {
  const strongestSummitScore = clamp(toNumber(sample?.strongestSummitScore), 0, 1);
  const ridgeStrength = clamp(toNumber(sample?.ridgeStrength), 0, 1);
  const backboneStrength = clamp(toNumber(sample?.backboneStrength), 0, 1);
  const regionalPurityWeight = clamp(toNumber(sample?.regionalPurityWeight), 0, 1);

  return clamp(
    strongestSummitScore * 0.40 +
    ridgeStrength * 0.18 +
    backboneStrength * 0.26 +
    regionalPurityWeight * 0.16,
    0,
    1
  );
}

function computeShelfFactor(sample) {
  const plateauStrength = clamp(toNumber(sample?.plateauStrength), 0, 1);
  const slope = clamp(toNumber(sample?.slope), 0, 1);
  const basinStrength = clamp(toNumber(sample?.basinStrength), 0, 1);

  return clamp(
    plateauStrength * 0.56 +
    (1 - slope) * 0.28 +
    basinStrength * 0.16,
    0,
    1
  );
}

/* =========================
   PACKET
========================= */

function buildPacket(type, baseSize, weight, crestFactor, shelfFactor) {
  const scale =
    type === "SUMMIT" ? 1.22 :
    type === "MOUNTAIN" ? 1.15 :
    type === "RIDGE" ? 1.08 :
    type === "PLATEAU" ? 1.06 :
    type === "HILL" ? 1.02 :
    1;

  const alpha =
    type === "SUMMIT" ? 0.95 :
    type === "MOUNTAIN" ? 0.90 :
    type === "RIDGE" ? 0.86 :
    type === "PLATEAU" ? 0.84 :
    type === "HILL" ? 0.80 :
    0;

  const color =
    type === "SUMMIT" ? "rgba(235,235,225,0.95)" :
    type === "MOUNTAIN" ? "rgba(196,190,170,0.92)" :
    type === "RIDGE" ? "rgba(156,172,124,0.90)" :
    type === "PLATEAU" ? "rgba(168,176,132,0.88)" :
    "rgba(132,160,110,0.88)";

  return {
    layer: "elevation",
    category: "ELEVATION",
    subCategory: type,
    color,
    radiusPx: baseSize * scale * (1 + weight * 0.18 + crestFactor * 0.06 + shelfFactor * 0.04),
    alpha: clamp(alpha + weight * 0.08 + crestFactor * 0.04, 0, 1),
    overlayOnly: true,
    elevationClass: type,
    reliefWeight: weight,
    crestFactor,
    shelfFactor
  };
}

/* =========================
   ENTRY
========================= */

export function resolveElevationPacket({ sample, pointSizePx }) {
  if (!sample || sample.landMask !== 1) return null;

  const type = classifyElevation(sample);
  if (type === "NONE") return null;

  const weight = computeWeight(sample);
  const crestFactor = computeCrestFactor(sample);
  const shelfFactor = computeShelfFactor(sample);
  const base = isFiniteNumber(pointSizePx) ? pointSizePx : 1;

  return Object.freeze(buildPacket(type, base, weight, crestFactor, shelfFactor));
}

export default Object.freeze({
  resolveElevationPacket
});
