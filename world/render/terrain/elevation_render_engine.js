// /world/render/terrain/elevation_render_engine.js
// MODE: RENDER EXTENSION CONTRACT RENEWAL
// STATUS: ELEVATION FACTOR AUTHORITY v4
// ROLE:
// - upward emphasis only
// - overlay only
// - crest / uplift / shelf / apex articulation only
// - preserve ownership boundary
// - expand expression toward 256-scope uplift grammar

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
    ridgeStrength: clamp(toNumber(sample?.ridgeStrength), 0, 1),
    plateauStrength: clamp(toNumber(sample?.plateauStrength), 0, 1),
    basinStrength: clamp(toNumber(sample?.basinStrength), 0, 1),
    strongestSummitScore: clamp(toNumber(sample?.strongestSummitScore), 0, 1),
    strongestBasinScore: clamp(toNumber(sample?.strongestBasinScore), 0, 1),
    backboneStrength: clamp(toNumber(sample?.backboneStrength), 0, 1),
    divideStrength: clamp(toNumber(sample?.divideStrength), 0, 1),
    curvatureAbs: clamp(Math.abs(toNumber(sample?.curvature)), 0, 1),
    freezePotential: clamp(toNumber(sample?.freezePotential), 0, 1),
    rainfall: clamp(toNumber(sample?.rainfall), 0, 1),
    basinAccumulation: clamp(toNumber(sample?.basinAccumulation), 0, 1)
  });
}

function readTags(sample) {
  return Object.freeze({
    terrainClass: normalizeString(sample?.terrainClass, "NONE"),
    biomeType: normalizeString(sample?.biomeType, "NONE"),
    surfaceMaterial: normalizeString(sample?.surfaceMaterial, "NONE"),
    compositionClass: normalizeString(sample?.compositionClass, "BASE_DOMINANT"),
    plateauRole: normalizeString(sample?.plateauRole, "NONE"),
    rangeTagged: sample?.rangeId != null,
    plateauTagged: sample?.plateauId != null,
    basinTagged: sample?.basinId != null
  });
}

function readComposition(sample) {
  return Object.freeze({
    regionalPurityWeight: clamp(toNumber(sample?.regionalPurityWeight), 0, 1),
    compositionWeight: clamp(toNumber(sample?.compositionWeight), 0, 1),
    preciousWeight: clamp(toNumber(sample?.preciousWeight), 0, 1),
    baseWeight: clamp(toNumber(sample?.baseWeight), 0, 1),
    diamondDensity: clamp(toNumber(sample?.diamondDensity), 0, 1),
    opalDensity: clamp(toNumber(sample?.opalDensity), 0, 1),
    marbleDensity: clamp(toNumber(sample?.marbleDensity), 0, 1),
    mineralReflectanceWeight: clamp(toNumber(sample?.mineralReflectanceWeight), 0, 1)
  });
}

/* =========================
   UPLIFT AXES
========================= */

function computeApexSignal(geo, tags, comp) {
  const terrainBias =
    tags.terrainClass === "SUMMIT" ? 0.18 :
    tags.terrainClass === "MOUNTAIN" ? 0.08 :
    0;

  const cryoBias =
    tags.biomeType === "GLACIER" || tags.surfaceMaterial === "ICE" || tags.surfaceMaterial === "SNOW"
      ? 0.08
      : 0;

  return clamp(
    geo.strongestSummitScore * 0.34 +
    geo.backboneStrength * 0.18 +
    geo.elevation * 0.16 +
    geo.ridgeStrength * 0.10 +
    comp.regionalPurityWeight * 0.10 +
    comp.preciousWeight * 0.04 +
    terrainBias +
    cryoBias,
    0,
    1
  );
}

function computeMountainMassSignal(geo, tags) {
  const rangeBias = boolToNumber(tags.rangeTagged) * 0.14;
  const terrainBias =
    tags.terrainClass === "MOUNTAIN" ? 0.16 :
    tags.terrainClass === "RIDGE" ? 0.08 :
    0;

  return clamp(
    geo.elevation * 0.26 +
    geo.backboneStrength * 0.22 +
    geo.ridgeStrength * 0.18 +
    geo.slope * 0.10 +
    geo.divideStrength * 0.10 +
    rangeBias +
    terrainBias,
    0,
    1
  );
}

function computeRidgeSignal(geo, tags) {
  return clamp(
    geo.ridgeStrength * 0.34 +
    geo.divideStrength * 0.20 +
    geo.backboneStrength * 0.18 +
    geo.slope * 0.08 +
    boolToNumber(tags.rangeTagged) * 0.10 +
    boolToNumber(tags.plateauTagged) * 0.10,
    0,
    1
  );
}

function computeShelfSignal(geo, tags) {
  const plateauRoleBias =
    tags.plateauRole === "CORE" ? 0.16 :
    tags.plateauRole === "OUTER" ? 0.10 :
    tags.plateauRole === "EDGE" ? 0.08 :
    tags.plateauRole === "SLOPE" ? 0.04 :
    0;

  return clamp(
    geo.plateauStrength * 0.40 +
    (1 - geo.slope) * 0.18 +
    geo.basinStrength * 0.10 +
    geo.rainfall * 0.06 +
    boolToNumber(tags.plateauTagged) * 0.16 +
    plateauRoleBias,
    0,
    1
  );
}

function computeRiseSignal(geo, comp) {
  return clamp(
    geo.elevation * 0.24 +
    geo.backboneStrength * 0.12 +
    geo.ridgeStrength * 0.10 +
    geo.slope * 0.08 +
    comp.compositionWeight * 0.10 +
    comp.mineralReflectanceWeight * 0.08 +
    comp.marbleDensity * 0.08 +
    comp.baseWeight * 0.08 +
    geo.curvatureAbs * 0.12,
    0,
    1
  );
}

function computeCryoUpliftSignal(geo, tags, comp) {
  const cryoTag =
    tags.biomeType === "GLACIER" ||
    tags.surfaceMaterial === "ICE" ||
    tags.surfaceMaterial === "SNOW" ||
    tags.terrainClass === "POLAR_ICE" ||
    tags.terrainClass === "GLACIAL_HIGHLAND"
      ? 1
      : 0;

  return clamp(
    geo.freezePotential * 0.34 +
    geo.elevation * 0.18 +
    geo.strongestSummitScore * 0.10 +
    comp.opalDensity * 0.10 +
    comp.mineralReflectanceWeight * 0.10 +
    cryoTag * 0.18,
    0,
    1
  );
}

/* =========================
   CLASSIFICATION
========================= */

function classifyElevation(sample) {
  const geo = readGeometry(sample);
  const tags = readTags(sample);
  const comp = readComposition(sample);

  const apexSignal = computeApexSignal(geo, tags, comp);
  const mountainMassSignal = computeMountainMassSignal(geo, tags);
  const ridgeSignal = computeRidgeSignal(geo, tags);
  const shelfSignal = computeShelfSignal(geo, tags);
  const riseSignal = computeRiseSignal(geo, comp);
  const cryoUpliftSignal = computeCryoUpliftSignal(geo, tags, comp);

  if (
    tags.terrainClass === "SUMMIT" ||
    apexSignal > 0.74
  ) {
    return "APEX";
  }

  if (
    tags.terrainClass === "POLAR_ICE" ||
    tags.terrainClass === "GLACIAL_HIGHLAND" ||
    cryoUpliftSignal > 0.68
  ) {
    return "CRYO_RISE";
  }

  if (
    tags.terrainClass === "MOUNTAIN" ||
    mountainMassSignal > 0.62
  ) {
    return "MOUNTAIN";
  }

  if (
    tags.terrainClass === "RIDGE" ||
    ridgeSignal > 0.56
  ) {
    return "RIDGE";
  }

  if (
    tags.terrainClass === "PLATEAU" ||
    shelfSignal > 0.56
  ) {
    return "SHELF";
  }

  if (riseSignal > 0.34 || geo.elevation > 0.18) {
    return "RISE";
  }

  return "NONE";
}

/* =========================
   METRIC PACK
========================= */

function computeWeightPack(sample) {
  const geo = readGeometry(sample);
  const tags = readTags(sample);
  const comp = readComposition(sample);

  const apexSignal = computeApexSignal(geo, tags, comp);
  const mountainMassSignal = computeMountainMassSignal(geo, tags);
  const ridgeSignal = computeRidgeSignal(geo, tags);
  const shelfSignal = computeShelfSignal(geo, tags);
  const riseSignal = computeRiseSignal(geo, comp);
  const cryoUpliftSignal = computeCryoUpliftSignal(geo, tags, comp);

  const reliefWeight = clamp(
    geo.elevation * 0.22 +
    geo.ridgeStrength * 0.14 +
    geo.strongestSummitScore * 0.18 +
    geo.backboneStrength * 0.16 +
    shelfSignal * 0.10 +
    riseSignal * 0.08 +
    apexSignal * 0.12,
    0,
    1
  );

  const crestFactor = clamp(
    apexSignal * 0.44 +
    geo.strongestSummitScore * 0.18 +
    geo.ridgeStrength * 0.10 +
    geo.backboneStrength * 0.14 +
    comp.regionalPurityWeight * 0.14,
    0,
    1
  );

  const shelfFactor = clamp(
    shelfSignal * 0.48 +
    geo.plateauStrength * 0.20 +
    boolToNumber(tags.plateauTagged) * 0.16 +
    boolToNumber(tags.basinTagged) * 0.08 +
    geo.basinStrength * 0.08,
    0,
    1
  );

  const cryoFactor = clamp(
    cryoUpliftSignal * 0.56 +
    geo.freezePotential * 0.20 +
    comp.opalDensity * 0.12 +
    comp.mineralReflectanceWeight * 0.12,
    0,
    1
  );

  const purityFactor = clamp(
    comp.regionalPurityWeight * 0.34 +
    comp.preciousWeight * 0.18 +
    comp.diamondDensity * 0.18 +
    comp.mineralReflectanceWeight * 0.16 +
    comp.compositionWeight * 0.14,
    0,
    1
  );

  return Object.freeze({
    reliefWeight,
    crestFactor,
    shelfFactor,
    cryoFactor,
    purityFactor,
    apexSignal,
    mountainMassSignal,
    ridgeSignal,
    shelfSignal,
    riseSignal,
    cryoUpliftSignal
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
    Number(match[2]) + Math.round((lightenShift * 0.56) - (darkenShift * 0.44) + greenShift),
    0,
    255
  );
  const b = clamp(
    Number(match[3]) + Math.round((lightenShift * 0.34) - (darkenShift * 0.56) + blueShift),
    0,
    255
  );
  const a = clamp(Number(match[4]), 0, 1);

  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

function resolveBaseColor(type) {
  if (type === "APEX") return "rgba(235,235,225,0.95)";
  if (type === "CRYO_RISE") return "rgba(214,226,234,0.94)";
  if (type === "MOUNTAIN") return "rgba(196,190,170,0.92)";
  if (type === "RIDGE") return "rgba(156,172,124,0.90)";
  if (type === "SHELF") return "rgba(168,176,132,0.88)";
  return "rgba(132,160,110,0.88)";
}

function resolveScale(type) {
  if (type === "APEX") return 1.24;
  if (type === "CRYO_RISE") return 1.16;
  if (type === "MOUNTAIN") return 1.14;
  if (type === "RIDGE") return 1.08;
  if (type === "SHELF") return 1.06;
  return 1.02;
}

function resolveAlpha(type) {
  if (type === "APEX") return 0.95;
  if (type === "CRYO_RISE") return 0.93;
  if (type === "MOUNTAIN") return 0.90;
  if (type === "RIDGE") return 0.86;
  if (type === "SHELF") return 0.84;
  return 0.80;
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
    Math.round(weightPack.crestFactor * 8 + weightPack.purityFactor * 6 + weightPack.cryoFactor * 4),
    Math.round(weightPack.shelfFactor * 2),
    Math.round(weightPack.shelfFactor * 3),
    Math.round(weightPack.cryoFactor * 8 + weightPack.purityFactor * 6)
  );

  return {
    layer: "elevation",
    category: "ELEVATION",
    subCategory: type,
    color,
    radiusPx: baseSize * scale * (
      1 +
      weightPack.reliefWeight * 0.18 +
      weightPack.crestFactor * 0.08 +
      weightPack.shelfFactor * 0.06 +
      weightPack.purityFactor * 0.04
    ),
    alpha: clamp(
      alpha +
      weightPack.reliefWeight * 0.08 +
      weightPack.crestFactor * 0.06 +
      weightPack.purityFactor * 0.04,
      0,
      1
    ),
    overlayOnly: true,
    elevationClass: type,
    reliefWeight: weightPack.reliefWeight,
    crestFactor: weightPack.crestFactor,
    shelfFactor: weightPack.shelfFactor,
    cryoFactor: weightPack.cryoFactor,
    purityFactor: weightPack.purityFactor,
    apexSignal: weightPack.apexSignal,
    mountainMassSignal: weightPack.mountainMassSignal,
    ridgeSignal: weightPack.ridgeSignal,
    shelfSignal: weightPack.shelfSignal,
    riseSignal: weightPack.riseSignal,
    cryoUpliftSignal: weightPack.cryoUpliftSignal
  };
}

/* =========================
   ENTRY
========================= */

export function resolveElevationPacket({ sample, pointSizePx }) {
  if (!sample || sample.landMask !== 1) return null;

  const type = classifyElevation(sample);
  if (type === "NONE") return null;

  const weightPack = computeWeightPack(sample);
  const base = isFiniteNumber(pointSizePx) ? pointSizePx : 1;

  return Object.freeze(buildPacket(type, base, weightPack));
}

export default Object.freeze({
  resolveElevationPacket
});
