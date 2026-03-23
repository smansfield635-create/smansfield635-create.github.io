// /world/render/terrain/cut_render_engine.js
// MODE: RENDER EXTENSION CONTRACT RENEWAL
// STATUS: CUT FACTOR AUTHORITY v3
// ROLE:
// - incision / edge emphasis only
// - overlay only
// - fracture / escarpment / canyon articulation only

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

function classifyCut(sample) {
  const terrainClass = normalizeString(sample?.terrainClass, "NONE");
  const slope = clamp(toNumber(sample?.slope), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature)), 0, 1);
  const divideStrength = clamp(toNumber(sample?.divideStrength), 0, 1);

  const creviceTagged = sample?.creviceId != null;
  const canyonTagged = sample?.canyonId != null;

  if (
    terrainClass === "CANYON" ||
    creviceTagged ||
    slope > 0.68 ||
    (slope > 0.52 && curvature > 0.32)
  ) {
    return "CLIFF";
  }

  if (
    canyonTagged ||
    slope > 0.48 ||
    divideStrength > 0.32
  ) {
    return "ESCARPMENT";
  }

  if (canyonStrength > 0.32) {
    return "CANYON";
  }

  if (canyonStrength > 0.20 || curvature > 0.18) {
    return "GORGE";
  }

  if (slope > 0.12) {
    return "SLOPE";
  }

  return "NONE";
}

/* =========================
   METRICS
========================= */

function computeWeight(sample) {
  const slope = clamp(toNumber(sample?.slope), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature)), 0, 1);
  const divideStrength = clamp(toNumber(sample?.divideStrength), 0, 1);

  return clamp(
    slope * 0.36 +
    canyonStrength * 0.28 +
    curvature * 0.20 +
    divideStrength * 0.16,
    0,
    1
  );
}

function computeSharpness(sample) {
  const slope = clamp(toNumber(sample?.slope), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature)), 0, 1);
  const canyonStrength = clamp(toNumber(sample?.canyonStrength), 0, 1);

  const creviceTagged = sample?.creviceId != null ? 1 : 0;
  const canyonTagged = sample?.canyonId != null ? 1 : 0;

  return clamp(
    slope * 0.30 +
    curvature * 0.20 +
    canyonStrength * 0.24 +
    creviceTagged * 0.16 +
    canyonTagged * 0.10,
    0,
    1
  );
}

function computeFractureBias(sample) {
  const divideStrength = clamp(toNumber(sample?.divideStrength), 0, 1);
  const slope = clamp(toNumber(sample?.slope), 0, 1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature)), 0, 1);

  return clamp(
    divideStrength * 0.42 +
    slope * 0.34 +
    curvature * 0.24,
    0,
    1
  );
}

/* =========================
   PACKET
========================= */

function buildPacket(type, baseSize, weight, sharpness, fractureBias) {
  const scale =
    type === "CLIFF" ? 1.18 :
    type === "ESCARPMENT" ? 1.10 :
    type === "CANYON" ? 1.07 :
    type === "GORGE" ? 1.05 :
    type === "SLOPE" ? 1.02 :
    1;

  const alpha =
    type === "CLIFF" ? 0.95 :
    type === "ESCARPMENT" ? 0.90 :
    type === "CANYON" ? 0.88 :
    type === "GORGE" ? 0.86 :
    type === "SLOPE" ? 0.82 :
    0;

  const color =
    type === "CLIFF" ? "rgba(155,145,120,0.95)" :
    type === "ESCARPMENT" ? "rgba(145,135,110,0.92)" :
    type === "CANYON" ? "rgba(125,115,95,0.90)" :
    type === "GORGE" ? "rgba(118,108,92,0.90)" :
    "rgba(110,100,85,0.88)";

  return {
    layer: "cut",
    category: "CUT",
    subCategory: type,
    color,
    radiusPx: baseSize * scale * (1 + weight * 0.16 + sharpness * 0.06 + fractureBias * 0.04),
    alpha: clamp(alpha + weight * 0.06 + sharpness * 0.06, 0, 1),
    overlayOnly: true,
    cutClass: type,
    cutWeight: weight,
    edgeSharpness: sharpness,
    fractureBias
  };
}

/* =========================
   ENTRY
========================= */

export function resolveCutPacket({ sample, pointSizePx }) {
  if (!sample || sample.landMask !== 1) return null;

  const type = classifyCut(sample);
  if (type === "NONE") return null;

  const weight = computeWeight(sample);
  const sharpness = computeSharpness(sample);
  const fractureBias = computeFractureBias(sample);
  const base = isFiniteNumber(pointSizePx) ? pointSizePx : 1;

  return Object.freeze(buildPacket(type, base, weight, sharpness, fractureBias));
}

export default Object.freeze({
  resolveCutPacket
});
