// /world/render/terrain/cut_render_engine.js
// MODE: RENDER EXTENSION CONTRACT RENEWAL
// STATUS: CUT FACTOR AUTHORITY v4
// ROLE:
// - incision / edge emphasis only
// - overlay only
// - fracture / escarpment / canyon articulation only
// - preserve ownership boundary
// - expand expression toward 256-scope terrain incision grammar

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

function boolToNumber(v) {
  return v === true ? 1 : 0;
}

/* =========================
   RAW READS
========================= */

function readGeometry(sample) {
  return Object.freeze({
    elevation: clamp(toNumber(sample?.elevation), 0, 1),
    slope: clamp(toNumber(sample?.slope), 0, 1),
    curvatureSigned: clamp(toNumber(sample?.curvature), -1, 1),
    curvatureAbs: clamp(Math.abs(toNumber(sample?.curvature)), 0, 1),
    ridgeStrength: clamp(toNumber(sample?.ridgeStrength), 0, 1),
    basinStrength: clamp(toNumber(sample?.basinStrength), 0, 1),
    canyonStrength: clamp(toNumber(sample?.canyonStrength), 0, 1),
    divideStrength: clamp(toNumber(sample?.divideStrength), 0, 1),
    plateauStrength: clamp(toNumber(sample?.plateauStrength), 0, 1),
    strongestSummitScore: clamp(toNumber(sample?.strongestSummitScore), 0, 1),
    strongestBasinScore: clamp(toNumber(sample?.strongestBasinScore), 0, 1),
    backboneStrength: clamp(toNumber(sample?.backboneStrength), 0, 1),
    cavePotential: clamp(toNumber(sample?.cavePotential), 0, 1),
    distanceToWater: Math.max(-1, toNumber(sample?.distanceToWater, -1)),
    distanceToLand: Math.max(-1, toNumber(sample?.distanceToLand, -1))
  });
}

function readFlow(sample) {
  return Object.freeze({
    runoff: clamp(toNumber(sample?.runoff), 0, 1),
    rainfall: clamp(toNumber(sample?.rainfall), 0, 1),
    basinAccumulation: clamp(toNumber(sample?.basinAccumulation), 0, 1),
    transportPotential: clamp(toNumber(sample?.transportPotential), 0, 1),
    depositionPotential: clamp(toNumber(sample?.depositionPotential), 0, 1),
    sedimentLoad: clamp(toNumber(sample?.sedimentLoad), 0, 1),
    evaporationPressure: clamp(toNumber(sample?.evaporationPressure), 0, 1),
    riverCandidate: boolToNumber(sample?.riverCandidate),
    lakeCandidate: boolToNumber(sample?.lakeCandidate),
    shoreline: boolToNumber(sample?.shoreline),
    shorelineBand: boolToNumber(sample?.shorelineBand)
  });
}

function readTags(sample) {
  return Object.freeze({
    terrainClass: normalizeString(sample?.terrainClass, "NONE"),
    biomeType: normalizeString(sample?.biomeType, "NONE"),
    surfaceMaterial: normalizeString(sample?.surfaceMaterial, "NONE"),
    flowClass: normalizeString(sample?.flowClass, "NONE"),
    flowDirection: normalizeString(sample?.flowDirection, "NONE"),
    plateauRole: normalizeString(sample?.plateauRole, "NONE"),
    creviceTagged: sample?.creviceId != null,
    canyonTagged: sample?.canyonId != null,
    valleyTagged: sample?.valleyId != null,
    basinTagged: sample?.basinId != null,
    plateauTagged: sample?.plateauId != null,
    rangeTagged: sample?.rangeId != null
  });
}

/* =========================
   DERIVED INCISION AXES
========================= */

function computeFractureSignal(geo, flow, tags) {
  return clamp(
    geo.divideStrength * 0.24 +
    geo.curvatureAbs * 0.18 +
    geo.slope * 0.14 +
    geo.canyonStrength * 0.12 +
    geo.cavePotential * 0.08 +
    boolToNumber(tags.creviceTagged) * 0.14 +
    boolToNumber(tags.canyonTagged) * 0.10,
    0,
    1
  );
}

function computeVerticalDropSignal(geo, tags) {
  const mountainBias =
    tags.terrainClass === "SUMMIT" ? 0.16 :
    tags.terrainClass === "MOUNTAIN" ? 0.12 :
    tags.terrainClass === "RIDGE" ? 0.08 : 0;

  return clamp(
    geo.slope * 0.34 +
    geo.elevation * 0.16 +
    geo.ridgeStrength * 0.14 +
    geo.backboneStrength * 0.14 +
    geo.strongestSummitScore * 0.12 +
    mountainBias,
    0,
    1
  );
}

function computeHydroCutSignal(geo, flow, tags) {
  const flowBias =
    tags.flowClass === "RIVER" ? 0.16 :
    tags.flowClass === "STREAM" ? 0.10 :
    tags.flowClass === "LAKE" ? -0.04 : 0;

  return clamp(
    flow.runoff * 0.24 +
    flow.transportPotential * 0.20 +
    flow.sedimentLoad * 0.08 +
    geo.canyonStrength * 0.18 +
    boolToNumber(tags.valleyTagged) * 0.10 +
    flow.riverCandidate * 0.12 +
    flowBias,
    0,
    1
  );
}

function computeShelfLipSignal(geo, flow, tags) {
  const plateauBias =
    tags.plateauRole === "EDGE" ? 0.18 :
    tags.plateauRole === "OUTER" ? 0.10 :
    tags.plateauRole === "SLOPE" ? 0.06 :
    0;

  return clamp(
    geo.plateauStrength * 0.26 +
    boolToNumber(tags.plateauTagged) * 0.16 +
    plateauBias +
    geo.slope * 0.10 +
    geo.divideStrength * 0.10 +
    Math.max(0, 1 - flow.depositionPotential) * 0.10 +
    Math.max(0, geo.distanceToWater <= 2 && geo.distanceToWater >= 0 ? 0.10 : 0),
    0,
    1
  );
}

function computeBasinLipSignal(geo, flow, tags) {
  return clamp(
    geo.basinStrength * 0.24 +
    geo.strongestBasinScore * 0.18 +
    boolToNumber(tags.basinTagged) * 0.16 +
    flow.basinAccumulation * 0.14 +
    Math.max(0, geo.slope - 0.10) * 0.14 +
    (tags.flowClass === "LAKE" ? 0.10 : 0),
    0,
    1
  );
}

function computeShoreCutSignal(geo, flow, tags) {
  return clamp(
    flow.shoreline * 0.28 +
    flow.shorelineBand * 0.20 +
    flow.transportPotential * 0.12 +
    flow.sedimentLoad * 0.10 +
    geo.slope * 0.12 +
    geo.curvatureAbs * 0.10 +
    (tags.terrainClass === "SHORELINE" ? 0.08 : 0),
    0,
    1
  );
}

/* =========================
   CUT CLASSIFICATION
========================= */

function classifyCut(sample) {
  const geo = readGeometry(sample);
  const flow = readFlow(sample);
  const tags = readTags(sample);

  const fractureSignal = computeFractureSignal(geo, flow, tags);
  const verticalDropSignal = computeVerticalDropSignal(geo, tags);
  const hydroCutSignal = computeHydroCutSignal(geo, flow, tags);
  const shelfLipSignal = computeShelfLipSignal(geo, flow, tags);
  const basinLipSignal = computeBasinLipSignal(geo, flow, tags);
  const shoreCutSignal = computeShoreCutSignal(geo, flow, tags);

  if (
    tags.terrainClass === "CANYON" ||
    tags.creviceTagged ||
    geo.slope > 0.72 ||
    (geo.slope > 0.56 && fractureSignal > 0.52)
  ) {
    return "CLIFF";
  }

  if (
    tags.canyonTagged ||
    verticalDropSignal > 0.60 ||
    (geo.slope > 0.50 && geo.divideStrength > 0.28)
  ) {
    return "ESCARPMENT";
  }

  if (
    tags.terrainClass === "CANYON" ||
    hydroCutSignal > 0.56 ||
    geo.canyonStrength > 0.34
  ) {
    return "CANYON";
  }

  if (
    fractureSignal > 0.60 ||
    boolToNumber(tags.creviceTagged) === 1
  ) {
    return "FRACTURE";
  }

  if (
    shelfLipSignal > 0.54 ||
    basinLipSignal > 0.54
  ) {
    return "LIP";
  }

  if (
    shoreCutSignal > 0.52
  ) {
    return "SHORE_CUT";
  }

  if (
    hydroCutSignal > 0.40 ||
    geo.canyonStrength > 0.20 ||
    geo.curvatureAbs > 0.18
  ) {
    return "GORGE";
  }

  if (geo.slope > 0.12) {
    return "SLOPE";
  }

  return "NONE";
}

/* =========================
   METRIC PACK
========================= */

function computeWeightPack(sample) {
  const geo = readGeometry(sample);
  const flow = readFlow(sample);
  const tags = readTags(sample);

  const fractureSignal = computeFractureSignal(geo, flow, tags);
  const verticalDropSignal = computeVerticalDropSignal(geo, tags);
  const hydroCutSignal = computeHydroCutSignal(geo, flow, tags);
  const shelfLipSignal = computeShelfLipSignal(geo, flow, tags);
  const basinLipSignal = computeBasinLipSignal(geo, flow, tags);
  const shoreCutSignal = computeShoreCutSignal(geo, flow, tags);

  const incisionWeight = clamp(
    geo.slope * 0.20 +
    geo.canyonStrength * 0.18 +
    geo.curvatureAbs * 0.14 +
    geo.divideStrength * 0.12 +
    flow.transportPotential * 0.12 +
    fractureSignal * 0.08 +
    hydroCutSignal * 0.08 +
    verticalDropSignal * 0.08,
    0,
    1
  );

  const edgeSharpness = clamp(
    geo.slope * 0.20 +
    geo.curvatureAbs * 0.18 +
    fractureSignal * 0.18 +
    geo.divideStrength * 0.12 +
    boolToNumber(tags.creviceTagged) * 0.12 +
    boolToNumber(tags.canyonTagged) * 0.08 +
    verticalDropSignal * 0.12,
    0,
    1
  );

  const fractureBias = clamp(
    fractureSignal * 0.44 +
    geo.divideStrength * 0.20 +
    geo.curvatureAbs * 0.12 +
    boolToNumber(tags.creviceTagged) * 0.12 +
    boolToNumber(tags.rangeTagged) * 0.12,
    0,
    1
  );

  const hydroBias = clamp(
    hydroCutSignal * 0.48 +
    flow.runoff * 0.18 +
    flow.transportPotential * 0.14 +
    flow.riverCandidate * 0.10 +
    boolToNumber(tags.valleyTagged) * 0.10,
    0,
    1
  );

  const lipBias = clamp(
    shelfLipSignal * 0.48 +
    basinLipSignal * 0.32 +
    boolToNumber(tags.plateauTagged) * 0.10 +
    boolToNumber(tags.basinTagged) * 0.10,
    0,
    1
  );

  const shorelineBias = clamp(
    shoreCutSignal * 0.52 +
    flow.shoreline * 0.24 +
    flow.shorelineBand * 0.14 +
    (tags.terrainClass === "SHORELINE" ? 0.10 : 0),
    0,
    1
  );

  return Object.freeze({
    incisionWeight,
    edgeSharpness,
    fractureBias,
    hydroBias,
    lipBias,
    shorelineBias,
    fractureSignal,
    verticalDropSignal,
    hydroCutSignal,
    shelfLipSignal,
    basinLipSignal,
    shoreCutSignal
  });
}

/* =========================
   COLOR LAW
========================= */

function tintColor(baseColor, lightenShift, darkenShift, greenShift = 0, blueShift = 0) {
  const match = /^rgba\((\d+),(\d+),(\d+),([^)]+)\)$/.exec(baseColor.replace(/\s+/g, ""));
  if (!match) return baseColor;

  const r = clamp(Number(match[1]) + lightenShift - darkenShift, 0, 255);
  const g = clamp(
    Number(match[2]) + Math.round((lightenShift * 0.54) - (darkenShift * 0.42) + greenShift),
    0,
    255
  );
  const b = clamp(
    Number(match[3]) + Math.round((lightenShift * 0.26) - (darkenShift * 0.52) + blueShift),
    0,
    255
  );
  const a = clamp(Number(match[4]), 0, 1);

  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

function resolveBaseColor(type) {
  if (type === "CLIFF") return "rgba(155,145,120,0.95)";
  if (type === "ESCARPMENT") return "rgba(145,135,110,0.92)";
  if (type === "CANYON") return "rgba(125,115,95,0.90)";
  if (type === "FRACTURE") return "rgba(132,120,104,0.90)";
  if (type === "LIP") return "rgba(142,132,108,0.90)";
  if (type === "SHORE_CUT") return "rgba(136,124,102,0.90)";
  if (type === "GORGE") return "rgba(118,108,92,0.90)";
  return "rgba(110,100,85,0.88)";
}

function resolveScale(type) {
  if (type === "CLIFF") return 1.18;
  if (type === "ESCARPMENT") return 1.12;
  if (type === "CANYON") return 1.08;
  if (type === "FRACTURE") return 1.06;
  if (type === "LIP") return 1.05;
  if (type === "SHORE_CUT") return 1.04;
  if (type === "GORGE") return 1.04;
  return 1.02;
}

function resolveAlpha(type) {
  if (type === "CLIFF") return 0.95;
  if (type === "ESCARPMENT") return 0.91;
  if (type === "CANYON") return 0.89;
  if (type === "FRACTURE") return 0.88;
  if (type === "LIP") return 0.87;
  if (type === "SHORE_CUT") return 0.86;
  if (type === "GORGE") return 0.86;
  return 0.82;
}

/* =========================
   PACKET
========================= */

function buildPacket(type, baseSize, weightPack) {
  const baseColor = resolveBaseColor(type);
  const scale = resolveScale(type);
  const alpha = resolveAlpha(type);

  const color = tintColor(
    baseColor,
    Math.round(weightPack.hydroBias * 4 + weightPack.shorelineBias * 3),
    Math.round(weightPack.fractureBias * 7 + weightPack.edgeSharpness * 4),
    Math.round(weightPack.hydroBias * 2 - weightPack.fractureBias * 2),
    Math.round(weightPack.shorelineBias * 2)
  );

  return {
    layer: "cut",
    category: "CUT",
    subCategory: type,
    color,
    radiusPx: baseSize * scale * (
      1 +
      weightPack.incisionWeight * 0.16 +
      weightPack.edgeSharpness * 0.08 +
      weightPack.fractureBias * 0.04 +
      weightPack.hydroBias * 0.04
    ),
    alpha: clamp(
      alpha +
      weightPack.incisionWeight * 0.06 +
      weightPack.edgeSharpness * 0.06 +
      weightPack.fractureBias * 0.04,
      0,
      1
    ),
    overlayOnly: true,
    cutClass: type,
    cutWeight: weightPack.incisionWeight,
    edgeSharpness: weightPack.edgeSharpness,
    fractureBias: weightPack.fractureBias,
    hydroBias: weightPack.hydroBias,
    lipBias: weightPack.lipBias,
    shorelineBias: weightPack.shorelineBias,
    fractureSignal: weightPack.fractureSignal,
    verticalDropSignal: weightPack.verticalDropSignal,
    hydroCutSignal: weightPack.hydroCutSignal,
    shelfLipSignal: weightPack.shelfLipSignal,
    basinLipSignal: weightPack.basinLipSignal,
    shoreCutSignal: weightPack.shoreCutSignal
  };
}

/* =========================
   ENTRY
========================= */

export function resolveCutPacket({ sample, pointSizePx }) {
  if (!sample || sample.landMask !== 1) return null;

  const type = classifyCut(sample);
  if (type === "NONE") return null;

  const weightPack = computeWeightPack(sample);
  const base = isFiniteNumber(pointSizePx) ? pointSizePx : 1;

  return Object.freeze(buildPacket(type, base, weightPack));
}

export default Object.freeze({
  resolveCutPacket
});
