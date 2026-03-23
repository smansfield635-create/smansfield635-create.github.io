// /world/render/terrain/terrain_render_engine.js
// MODE: RENDER EXTENSION CONTRACT RENEWAL
// STATUS: TERRAIN FACTOR AUTHORITY v8
// ROLE:
// - own 100% terrain baseline coverage for land
// - classify substrate / surface continuity only
// - express composition law already present in planet field
// - express regional purity / material density / sediment bias already present in sample truth
// - preserve baseline ownership boundary
// - NOT own elevation emphasis
// - NOT own cut / incision emphasis
// - NOT own botany
// - return normalized packet or null
// - remain coherent with downstream render factor families
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

function boolToNumber(value) {
  return value === true ? 1 : 0;
}

/* =========================
   SAMPLE READS
========================= */

function readTags(sample) {
  return Object.freeze({
    terrainClass: normalizeString(sample?.terrainClass, "NONE"),
    biomeType: normalizeString(sample?.biomeType, "NONE"),
    surfaceMaterial: normalizeString(sample?.surfaceMaterial, "NONE"),
    compositionClass: normalizeString(sample?.compositionClass, "BASE_DOMINANT"),
    materialType: normalizeString(sample?.materialType, "mixed"),
    sedimentType: normalizeString(sample?.sedimentType, "mixed"),
    climateBandField: normalizeString(sample?.climateBandField, "NONE"),
    plateauRole: normalizeString(sample?.plateauRole, "NONE"),
    flowClass: normalizeString(sample?.flowClass, "NONE"),
    shoreline: sample?.shoreline === true,
    shorelineBand: sample?.shorelineBand === true,
    riverCandidate: sample?.riverCandidate === true,
    lakeCandidate: sample?.lakeCandidate === true,
    rangeTagged: sample?.rangeId != null,
    basinTagged: sample?.basinId != null,
    plateauTagged: sample?.plateauId != null,
    canyonTagged: sample?.canyonId != null,
    creviceTagged: sample?.creviceId != null,
    valleyTagged: sample?.valleyId != null
  });
}

function readGeometry(sample) {
  return Object.freeze({
    elevation: clamp(toNumber(sample?.elevation), 0, 1),
    slope: clamp(toNumber(sample?.slope), 0, 1),
    curvatureSigned: clamp(toNumber(sample?.curvature), -1, 1),
    curvatureAbs: clamp(Math.abs(toNumber(sample?.curvature)), 0, 1),
    ridgeStrength: clamp(toNumber(sample?.ridgeStrength), 0, 1),
    basinStrength: clamp(toNumber(sample?.basinStrength), 0, 1),
    canyonStrength: clamp(toNumber(sample?.canyonStrength), 0, 1),
    plateauStrength: clamp(toNumber(sample?.plateauStrength), 0, 1),
    strongestSummitScore: clamp(toNumber(sample?.strongestSummitScore), 0, 1),
    strongestBasinScore: clamp(toNumber(sample?.strongestBasinScore), 0, 1),
    backboneStrength: clamp(toNumber(sample?.backboneStrength), 0, 1),
    divideStrength: clamp(toNumber(sample?.divideStrength), 0, 1),
    cavePotential: clamp(toNumber(sample?.cavePotential), 0, 1),
    freezePotential: clamp(toNumber(sample?.freezePotential), 0, 1),
    temperature: clamp(toNumber(sample?.temperature), 0, 1),
    seasonalTemperature: clamp(toNumber(sample?.seasonalTemperature), 0, 1)
  });
}

function readHydrology(sample) {
  return Object.freeze({
    rainfall: clamp(toNumber(sample?.rainfall), 0, 1),
    runoff: clamp(toNumber(sample?.runoff), 0, 1),
    basinAccumulation: clamp(toNumber(sample?.basinAccumulation), 0, 1),
    drainage: normalizeString(sample?.drainage, "none"),
    maritimeInfluence: clamp(toNumber(sample?.maritimeInfluence), 0, 1),
    continentality: clamp(toNumber(sample?.continentality), 0, 1),
    rainShadowStrength: clamp(toNumber(sample?.rainShadowStrength), 0, 1),
    evaporationPressure: clamp(toNumber(sample?.evaporationPressure), 0, 1),
    transportPotential: clamp(toNumber(sample?.transportPotential), 0, 1),
    depositionPotential: clamp(toNumber(sample?.depositionPotential), 0, 1),
    sedimentLoad: clamp(toNumber(sample?.sedimentLoad), 0, 1),
    distanceToWater: Math.max(-1, toNumber(sample?.distanceToWater, -1)),
    distanceToLand: Math.max(-1, toNumber(sample?.distanceToLand, -1))
  });
}

function readComposition(sample) {
  const compositionWeight = clamp(toNumber(sample?.compositionWeight), 0, 1);
  const preciousWeight = clamp(toNumber(sample?.preciousWeight), 0, 1);
  const baseWeight = clamp(toNumber(sample?.baseWeight), 0, 1);
  const regionalPurityWeight = clamp(toNumber(sample?.regionalPurityWeight), 0, 1);
  const continentMacroWeight = clamp(toNumber(sample?.continentMacroWeight), 0, 1);
  const waterPurityWeight = clamp(toNumber(sample?.waterPurityWeight), 0, 1);
  const mineralReflectanceWeight = clamp(toNumber(sample?.mineralReflectanceWeight), 0, 1);
  const sedimentTintWeight = clamp(toNumber(sample?.sedimentTintWeight), 0, 1);

  const diamondDensity = clamp(toNumber(sample?.diamondDensity), 0, 1);
  const opalDensity = clamp(toNumber(sample?.opalDensity), 0, 1);
  const graniteDensity = clamp(toNumber(sample?.graniteDensity), 0, 1);
  const marbleDensity = clamp(toNumber(sample?.marbleDensity), 0, 1);
  const metalDensity = clamp(toNumber(sample?.metalDensity), 0, 1);

  const crystalWeight = clamp(
    diamondDensity * 0.54 +
    opalDensity * 0.28 +
    metalDensity * 0.18,
    0,
    1
  );

  const stoneWeight = clamp(
    graniteDensity * 0.52 +
    marbleDensity * 0.22 +
    baseWeight * 0.26,
    0,
    1
  );

  return Object.freeze({
    compositionWeight,
    preciousWeight,
    baseWeight,
    regionalPurityWeight,
    continentMacroWeight,
    waterPurityWeight,
    mineralReflectanceWeight,
    sedimentTintWeight,
    diamondDensity,
    opalDensity,
    graniteDensity,
    marbleDensity,
    metalDensity,
    crystalWeight,
    stoneWeight
  });
}

/* =========================
   SURFACE AXES
========================= */

function computeExposureSignal(geo, hydro, tags, comp) {
  const terrainBias =
    tags.terrainClass === "RIDGE" ? 0.10 :
    tags.terrainClass === "MOUNTAIN" ? 0.14 :
    tags.terrainClass === "SUMMIT" ? 0.18 :
    tags.terrainClass === "CANYON" ? 0.08 :
    0;

  return clamp(
    geo.slope * 0.20 +
    geo.ridgeStrength * 0.16 +
    geo.canyonStrength * 0.10 +
    geo.curvatureAbs * 0.08 +
    geo.elevation * 0.08 +
    geo.backboneStrength * 0.10 +
    comp.stoneWeight * 0.12 +
    comp.crystalWeight * 0.08 +
    hydro.continentality * 0.04 +
    terrainBias,
    0,
    1
  );
}

function computeRetentionSignal(geo, hydro, tags, comp) {
  const basinBias =
    tags.basinTagged ? 0.12 :
    tags.lakeCandidate ? 0.10 :
    tags.flowClass === "LAKE" ? 0.12 :
    tags.flowClass === "STREAM" ? 0.08 :
    0;

  return clamp(
    hydro.rainfall * 0.16 +
    hydro.runoff * 0.06 +
    hydro.basinAccumulation * 0.18 +
    hydro.depositionPotential * 0.10 +
    geo.basinStrength * 0.10 +
    geo.plateauStrength * 0.08 +
    (1 - geo.slope) * 0.08 +
    comp.baseWeight * 0.10 +
    comp.opalDensity * 0.06 +
    basinBias,
    0,
    1
  );
}

function computeAriditySignal(geo, hydro, tags, comp) {
  const desertBias =
    tags.biomeType === "DESERT" ? 0.20 :
    tags.surfaceMaterial === "SAND" ? 0.14 :
    tags.surfaceMaterial === "GRAVEL" ? 0.10 :
    0;

  return clamp(
    (1 - hydro.rainfall) * 0.18 +
    hydro.evaporationPressure * 0.16 +
    hydro.continentality * 0.10 +
    hydro.rainShadowStrength * 0.10 +
    geo.slope * 0.06 +
    geo.canyonStrength * 0.06 +
    comp.sedimentTintWeight * 0.12 +
    comp.baseWeight * 0.10 +
    desertBias,
    0,
    1
  );
}

function computeCryoSignal(geo, tags, comp) {
  const cryoBias =
    tags.surfaceMaterial === "ICE" ? 0.18 :
    tags.surfaceMaterial === "SNOW" ? 0.14 :
    tags.terrainClass === "POLAR_ICE" ? 0.18 :
    tags.terrainClass === "GLACIAL_HIGHLAND" ? 0.16 :
    tags.biomeType === "GLACIER" ? 0.18 :
    0;

  return clamp(
    geo.freezePotential * 0.32 +
    (1 - geo.temperature) * 0.10 +
    (1 - geo.seasonalTemperature) * 0.08 +
    geo.elevation * 0.08 +
    comp.opalDensity * 0.08 +
    comp.mineralReflectanceWeight * 0.10 +
    cryoBias,
    0,
    1
  );
}

function computeCrystalSignal(tags, comp) {
  const purityBias =
    tags.compositionClass === "PURITY_DOMINANT" ? 0.20 :
    tags.compositionClass === "PRECIOUS_DOMINANT" ? 0.10 :
    0;

  return clamp(
    comp.crystalWeight * 0.30 +
    comp.preciousWeight * 0.16 +
    comp.compositionWeight * 0.12 +
    comp.regionalPurityWeight * 0.14 +
    comp.mineralReflectanceWeight * 0.12 +
    comp.diamondDensity * 0.08 +
    comp.opalDensity * 0.08 +
    purityBias,
    0,
    1
  );
}

function computeFertilitySignal(geo, hydro, tags, comp) {
  const soilBias =
    tags.surfaceMaterial === "SOIL" ? 0.12 :
    tags.surfaceMaterial === "CLAY" ? 0.10 :
    tags.surfaceMaterial === "SILT" ? 0.10 :
    tags.biomeType === "WETLAND" ? 0.14 :
    0;

  return clamp(
    hydro.rainfall * 0.18 +
    hydro.basinAccumulation * 0.14 +
    hydro.depositionPotential * 0.10 +
    geo.basinStrength * 0.10 +
    geo.plateauStrength * 0.08 +
    (1 - geo.slope) * 0.06 +
    comp.baseWeight * 0.10 +
    comp.marbleDensity * 0.04 +
    soilBias,
    0,
    1
  );
}

function computeContinuitySignal(geo, hydro, tags, comp) {
  const plateauBias =
    tags.plateauRole === "CORE" ? 0.12 :
    tags.plateauRole === "OUTER" ? 0.08 :
    tags.plateauRole === "EDGE" ? 0.04 :
    0;

  return clamp(
    geo.plateauStrength * 0.16 +
    geo.basinStrength * 0.10 +
    hydro.rainfall * 0.10 +
    hydro.basinAccumulation * 0.14 +
    hydro.depositionPotential * 0.10 +
    (1 - geo.slope) * 0.08 +
    (1 - geo.curvatureAbs) * 0.06 +
    comp.baseWeight * 0.08 +
    comp.compositionWeight * 0.06 +
    plateauBias,
    0,
    1
  );
}

function computeVariationSignal(geo, hydro, comp) {
  return clamp(
    geo.curvatureAbs * 0.14 +
    geo.canyonStrength * 0.12 +
    hydro.transportPotential * 0.12 +
    hydro.sedimentLoad * 0.14 +
    comp.sedimentTintWeight * 0.14 +
    comp.crystalWeight * 0.10 +
    comp.stoneWeight * 0.10 +
    comp.mineralReflectanceWeight * 0.14,
    0,
    1
  );
}

/* =========================
   SURFACE CLASSIFICATION
========================= */

function classifySurfaceClass(sample) {
  const tags = readTags(sample);
  const geo = readGeometry(sample);
  const hydro = readHydrology(sample);
  const comp = readComposition(sample);

  const exposureSignal = computeExposureSignal(geo, hydro, tags, comp);
  const retentionSignal = computeRetentionSignal(geo, hydro, tags, comp);
  const ariditySignal = computeAriditySignal(geo, hydro, tags, comp);
  const cryoSignal = computeCryoSignal(geo, tags, comp);
  const crystalSignal = computeCrystalSignal(tags, comp);
  const fertilitySignal = computeFertilitySignal(geo, hydro, tags, comp);

  if (cryoSignal >= 0.64) return "CRYO";
  if (crystalSignal >= 0.64) return "CRYSTAL";
  if (ariditySignal >= 0.62) return "BARREN";
  if (exposureSignal >= 0.62) return "ROCK";
  if (fertilitySignal >= 0.58 || retentionSignal >= 0.58) return "SOIL";

  return "MIXED";
}

function classifyTerrainOrgan(sample, surfaceClass) {
  const tags = readTags(sample);
  const geo = readGeometry(sample);
  const hydro = readHydrology(sample);
  const comp = readComposition(sample);

  if (surfaceClass === "SOIL" && geo.basinStrength >= 0.34) return "RECEPTION_FIELD";
  if (surfaceClass === "ROCK" && (tags.terrainClass === "RIDGE" || tags.terrainClass === "MOUNTAIN")) return "EXPOSURE_SHELL";
  if (surfaceClass === "MIXED" && geo.plateauStrength >= 0.40) return "TRANSITION_SHELF";
  if (surfaceClass === "BARREN") return "DEPLETION_FIELD";
  if (surfaceClass === "CRYO") return "CRYO_SHELL";
  if (surfaceClass === "CRYSTAL" && comp.crystalWeight >= 0.64) return "PURITY_SHELL";
  if (
    tags.surfaceMaterial === "CLAY" ||
    tags.biomeType === "WETLAND" ||
    hydro.rainfall >= 0.64 ||
    hydro.basinAccumulation >= 0.60
  ) {
    return "SATURATION_FIELD";
  }

  return "NONE";
}

/* =========================
   DIRECTIONAL FIELD
========================= */

function computeDirectionalSurface(sample) {
  const lat = toNumber(sample?.latDeg, 0) * Math.PI / 180;
  const lon = toNumber(sample?.lonDeg, 0) * Math.PI / 180;

  const tags = readTags(sample);
  const geo = readGeometry(sample);
  const hydro = readHydrology(sample);
  const comp = readComposition(sample);

  const northBias = clamp(
    Math.abs(Math.sin(lat)) * 0.14 +
    hydro.rainfall * 0.10 +
    geo.plateauStrength * 0.08 +
    (1 - geo.slope) * 0.06 +
    comp.regionalPurityWeight * 0.12,
    0,
    1
  );

  const southBias = clamp(
    geo.basinStrength * 0.12 +
    geo.canyonStrength * 0.08 +
    hydro.continentality * 0.10 +
    comp.baseWeight * 0.12 +
    boolToNumber(tags.basinTagged) * 0.10,
    0,
    1
  );

  const eastBias = clamp(
    Math.abs(Math.sin(lon)) * 0.14 +
    geo.slope * 0.10 +
    geo.ridgeStrength * 0.08 +
    comp.crystalWeight * 0.14 +
    comp.mineralReflectanceWeight * 0.10,
    0,
    1
  );

  const westBias = clamp(
    Math.abs(Math.cos(lon)) * 0.14 +
    geo.plateauStrength * 0.10 +
    geo.basinStrength * 0.08 +
    comp.stoneWeight * 0.14 +
    hydro.depositionPotential * 0.10,
    0,
    1
  );

  const dominant = Math.max(northBias, southBias, eastBias, westBias);

  let directionalClass = "CENTERED";
  if (dominant === northBias) directionalClass = "NORTH";
  else if (dominant === southBias) directionalClass = "SOUTH";
  else if (dominant === eastBias) directionalClass = "EAST";
  else if (dominant === westBias) directionalClass = "WEST";

  return Object.freeze({
    directionalClass,
    directionalWeight: dominant,
    directionalNorthBias: northBias,
    directionalSouthBias: southBias,
    directionalEastBias: eastBias,
    directionalWestBias: westBias
  });
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

/* =========================
   METRIC PACK
========================= */

function deriveExpressionMeta(sample) {
  const tags = readTags(sample);
  const geo = readGeometry(sample);
  const hydro = readHydrology(sample);
  const comp = readComposition(sample);

  const surfaceClass = classifySurfaceClass(sample);
  const terrainOrgan = classifyTerrainOrgan(sample, surfaceClass);

  const continuityWeight = computeContinuitySignal(geo, hydro, tags, comp);
  const variationWeight = computeVariationSignal(geo, hydro, comp);
  const exposureWeight = computeExposureSignal(geo, hydro, tags, comp);
  const retentionWeight = computeRetentionSignal(geo, hydro, tags, comp);
  const aridityWeight = computeAriditySignal(geo, hydro, tags, comp);
  const cryoWeight = computeCryoSignal(geo, tags, comp);
  const crystalWeight = computeCrystalSignal(tags, comp);
  const fertilityWeight = computeFertilitySignal(geo, hydro, tags, comp);

  const directional = computeDirectionalSurface(sample);
  const directionalContrast = computeDirectionalContrast(directional);

  const compositionSignal = clamp(
    comp.compositionWeight * 0.18 +
    comp.preciousWeight * 0.12 +
    comp.regionalPurityWeight * 0.12 +
    comp.mineralReflectanceWeight * 0.12 +
    crystalWeight * 0.18 +
    comp.sedimentTintWeight * 0.08 +
    boolToNumber(tags.shorelineBand) * 0.06 +
    boolToNumber(tags.shoreline) * 0.04 +
    comp.waterPurityWeight * 0.10,
    0,
    1
  );

  const packetSeparationWeight = clamp(
    continuityWeight * 0.10 +
    variationWeight * 0.10 +
    exposureWeight * 0.10 +
    retentionWeight * 0.10 +
    aridityWeight * 0.08 +
    cryoWeight * 0.10 +
    crystalWeight * 0.14 +
    fertilityWeight * 0.08 +
    directionalContrast * 0.06 +
    compositionSignal * 0.14,
    0,
    1
  );

  return Object.freeze({
    terrainClass: tags.terrainClass,
    biomeType: tags.biomeType,
    surfaceMaterial: tags.surfaceMaterial,
    compositionClass: tags.compositionClass,
    sedimentType: tags.sedimentType,
    materialType: tags.materialType,
    climateBandField: tags.climateBandField,
    surfaceClass,
    terrainOrgan,
    continuityWeight,
    variationWeight,
    exposureWeight,
    retentionWeight,
    aridityWeight,
    cryoWeight,
    crystalWeight,
    fertilityWeight,
    packetSeparationWeight,
    compositionSignal,
    diamondDensity: comp.diamondDensity,
    opalDensity: comp.opalDensity,
    graniteDensity: comp.graniteDensity,
    marbleDensity: comp.marbleDensity,
    metalDensity: comp.metalDensity,
    preciousWeight: comp.preciousWeight,
    baseWeight: comp.baseWeight,
    regionalPurityWeight: comp.regionalPurityWeight,
    continentMacroWeight: comp.continentMacroWeight,
    waterPurityWeight: comp.waterPurityWeight,
    mineralReflectanceWeight: comp.mineralReflectanceWeight,
    sedimentTintWeight: comp.sedimentTintWeight,
    sedimentLoad: hydro.sedimentLoad,
    transportPotential: hydro.transportPotential,
    depositionPotential: hydro.depositionPotential,
    directionalClass: directional.directionalClass,
    directionalWeight: directional.directionalWeight,
    directionalNorthBias: directional.directionalNorthBias,
    directionalSouthBias: directional.directionalSouthBias,
    directionalEastBias: directional.directionalEastBias,
    directionalWestBias: directional.directionalWestBias,
    directionalContrast
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
    Number(match[2]) + Math.round((lightenShift * 0.60) - (darkenShift * 0.48) + greenShift),
    0,
    255
  );
  const b = clamp(
    Number(match[3]) + Math.round((lightenShift * 0.34) - (darkenShift * 0.58) + blueShift),
    0,
    255
  );
  const a = clamp(Number(match[4]), 0, 1);

  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

function scaleRadius(baseRadiusPx, packetSeparationWeight, continuityWeight, variationWeight, compositionSignal) {
  return baseRadiusPx * clamp(
    0.94 +
    packetSeparationWeight * 0.10 +
    continuityWeight * 0.06 +
    variationWeight * 0.10 +
    compositionSignal * 0.10,
    0.84,
    1.38
  );
}

function sharpenAlpha(baseAlpha, continuityWeight, directionalWeight, directionalContrast, compositionSignal) {
  return clamp(
    baseAlpha +
    continuityWeight * 0.06 +
    directionalWeight * 0.04 +
    directionalContrast * 0.04 +
    compositionSignal * 0.08,
    0,
    1
  );
}

/* =========================
   PACKETS
========================= */

function resolveSoilPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "SOIL",
    color: tintColor(
      "rgba(118,144,96,0.92)",
      Math.round(meta.continuityWeight * 8 + meta.retentionWeight * 4 + meta.opalDensity * 4),
      Math.round(meta.exposureWeight * 2),
      Math.round(meta.retentionWeight * 10 + meta.baseWeight * 4),
      Math.round(meta.directionalWeight * 2 + meta.opalDensity * 3)
    ),
    radiusPx: scaleRadius(
      pointSizePx * 1.04,
      meta.packetSeparationWeight,
      meta.continuityWeight,
      meta.variationWeight,
      meta.compositionSignal
    ),
    alpha: sharpenAlpha(
      0.90,
      meta.continuityWeight,
      meta.directionalWeight,
      meta.directionalContrast,
      meta.compositionSignal
    ),
    overlayOnly: false,
    ...meta
  };
}

function resolveRockPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "ROCK",
    color: tintColor(
      "rgba(146,144,132,0.94)",
      Math.round(meta.directionalWeight * 4 + meta.marbleDensity * 4 + meta.metalDensity * 2),
      Math.round(meta.exposureWeight * 8 + meta.directionalContrast * 4),
      Math.round(meta.marbleDensity * 2),
      Math.round(meta.metalDensity * 6)
    ),
    radiusPx: scaleRadius(
      pointSizePx * 1.08,
      meta.packetSeparationWeight,
      meta.continuityWeight,
      meta.variationWeight,
      meta.compositionSignal
    ),
    alpha: sharpenAlpha(
      0.93,
      meta.continuityWeight * 0.5,
      meta.directionalWeight,
      meta.directionalContrast,
      meta.compositionSignal
    ),
    overlayOnly: false,
    ...meta
  };
}

function resolveMixedPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "MIXED",
    color: tintColor(
      "rgba(126,138,104,0.92)",
      Math.round(meta.continuityWeight * 5 + meta.retentionWeight * 2 + meta.opalDensity * 2),
      Math.round(meta.exposureWeight * 4),
      Math.round(meta.retentionWeight * 5),
      Math.round(meta.variationWeight * 2 + meta.mineralReflectanceWeight * 3)
    ),
    radiusPx: scaleRadius(
      pointSizePx,
      meta.packetSeparationWeight,
      meta.continuityWeight,
      meta.variationWeight,
      meta.compositionSignal
    ),
    alpha: sharpenAlpha(
      0.90,
      meta.continuityWeight,
      meta.directionalWeight,
      meta.directionalContrast,
      meta.compositionSignal
    ),
    overlayOnly: false,
    ...meta
  };
}

function resolveBarrenPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "BARREN",
    color: tintColor(
      "rgba(154,132,96,0.92)",
      Math.round(meta.directionalWeight * 2 + meta.metalDensity * 2),
      Math.round(meta.exposureWeight * 7 + meta.directionalContrast * 3 + meta.aridityWeight * 3),
      Math.round(meta.retentionWeight * -4),
      Math.round(meta.metalDensity * 2)
    ),
    radiusPx: scaleRadius(
      pointSizePx * 0.98,
      meta.packetSeparationWeight,
      meta.continuityWeight,
      meta.variationWeight,
      meta.compositionSignal
    ),
    alpha: sharpenAlpha(
      0.88,
      meta.continuityWeight * 0.4,
      meta.directionalWeight,
      meta.directionalContrast,
      meta.compositionSignal
    ),
    overlayOnly: false,
    ...meta
  };
}

function resolveCryoPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "CRYO",
    color: tintColor(
      "rgba(208,220,228,0.94)",
      Math.round(meta.mineralReflectanceWeight * 8 + meta.opalDensity * 6 + meta.cryoWeight * 4),
      Math.round(meta.exposureWeight * 2),
      0,
      Math.round(meta.opalDensity * 10 + meta.cryoWeight * 6)
    ),
    radiusPx: scaleRadius(
      pointSizePx * 1.06,
      meta.packetSeparationWeight,
      meta.continuityWeight,
      meta.variationWeight,
      meta.compositionSignal
    ),
    alpha: sharpenAlpha(
      0.94,
      meta.continuityWeight,
      meta.directionalWeight,
      meta.directionalContrast,
      meta.compositionSignal
    ),
    overlayOnly: false,
    ...meta
  };
}

function resolveCrystalPacket(pointSizePx, meta) {
  return {
    layer: "terrain",
    category: "TERRAIN",
    subCategory: "CRYSTAL",
    color: tintColor(
      "rgba(176,190,210,0.94)",
      Math.round(meta.compositionSignal * 10 + meta.opalDensity * 8 + meta.diamondDensity * 6),
      Math.round(meta.exposureWeight * 2),
      Math.round(meta.opalDensity * 6),
      Math.round(meta.diamondDensity * 14 + meta.mineralReflectanceWeight * 10)
    ),
    radiusPx: scaleRadius(
      pointSizePx * 1.10,
      meta.packetSeparationWeight,
      meta.continuityWeight,
      meta.variationWeight,
      meta.compositionSignal
    ),
    alpha: sharpenAlpha(
      0.95,
      meta.continuityWeight,
      meta.directionalWeight,
      meta.directionalContrast,
      meta.compositionSignal
    ),
    overlayOnly: false,
    ...meta
  };
}

function resolvePacket(sample, pointSizePx) {
  const meta = deriveExpressionMeta(sample);

  if (meta.surfaceClass === "SOIL") return resolveSoilPacket(pointSizePx, meta);
  if (meta.surfaceClass === "ROCK") return resolveRockPacket(pointSizePx, meta);
  if (meta.surfaceClass === "MIXED") return resolveMixedPacket(pointSizePx, meta);
  if (meta.surfaceClass === "BARREN") return resolveBarrenPacket(pointSizePx, meta);
  if (meta.surfaceClass === "CRYO") return resolveCryoPacket(pointSizePx, meta);
  if (meta.surfaceClass === "CRYSTAL") return resolveCrystalPacket(pointSizePx, meta);

  return resolveMixedPacket(pointSizePx, meta);
}

/* =========================
   NORMALIZATION
========================= */

function normalizePacket(packet, fallbackColor, fallbackRadiusPx) {
  if (!packet || typeof packet !== "object") return null;

  return Object.freeze({
    contractId: "TERRAIN_RENDER_CONTRACT_v8",
    engineKey: "terrain",
    layer: normalizeString(packet.layer, "terrain"),
    category: normalizeString(packet.category, "TERRAIN"),
    subCategory: normalizeString(packet.subCategory, "MIXED"),

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
    biomeType: normalizeString(packet.biomeType, "NONE"),
    surfaceMaterial: normalizeString(packet.surfaceMaterial, "NONE"),
    compositionClass: normalizeString(packet.compositionClass, "BASE_DOMINANT"),
    sedimentType: normalizeString(packet.sedimentType, "mixed"),
    materialType: normalizeString(packet.materialType, "mixed"),
    climateBandField: normalizeString(packet.climateBandField, "NONE"),
    surfaceClass: normalizeString(packet.surfaceClass, "NONE"),
    terrainOrgan: normalizeString(packet.terrainOrgan, "NONE"),

    continuityWeight: clamp(isFiniteNumber(packet.continuityWeight) ? packet.continuityWeight : 0, 0, 1),
    variationWeight: clamp(isFiniteNumber(packet.variationWeight) ? packet.variationWeight : 0, 0, 1),
    exposureWeight: clamp(isFiniteNumber(packet.exposureWeight) ? packet.exposureWeight : 0, 0, 1),
    retentionWeight: clamp(isFiniteNumber(packet.retentionWeight) ? packet.retentionWeight : 0, 0, 1),
    aridityWeight: clamp(isFiniteNumber(packet.aridityWeight) ? packet.aridityWeight : 0, 0, 1),
    cryoWeight: clamp(isFiniteNumber(packet.cryoWeight) ? packet.cryoWeight : 0, 0, 1),
    crystalWeight: clamp(isFiniteNumber(packet.crystalWeight) ? packet.crystalWeight : 0, 0, 1),
    fertilityWeight: clamp(isFiniteNumber(packet.fertilityWeight) ? packet.fertilityWeight : 0, 0, 1),
    packetSeparationWeight: clamp(isFiniteNumber(packet.packetSeparationWeight) ? packet.packetSeparationWeight : 0, 0, 1),
    compositionSignal: clamp(isFiniteNumber(packet.compositionSignal) ? packet.compositionSignal : 0, 0, 1),

    diamondDensity: clamp(isFiniteNumber(packet.diamondDensity) ? packet.diamondDensity : 0, 0, 1),
    opalDensity: clamp(isFiniteNumber(packet.opalDensity) ? packet.opalDensity : 0, 0, 1),
    graniteDensity: clamp(isFiniteNumber(packet.graniteDensity) ? packet.graniteDensity : 0, 0, 1),
    marbleDensity: clamp(isFiniteNumber(packet.marbleDensity) ? packet.marbleDensity : 0, 0, 1),
    metalDensity: clamp(isFiniteNumber(packet.metalDensity) ? packet.metalDensity : 0, 0, 1),
    preciousWeight: clamp(isFiniteNumber(packet.preciousWeight) ? packet.preciousWeight : 0, 0, 1),
    baseWeight: clamp(isFiniteNumber(packet.baseWeight) ? packet.baseWeight : 0, 0, 1),
    regionalPurityWeight: clamp(isFiniteNumber(packet.regionalPurityWeight) ? packet.regionalPurityWeight : 0, 0, 1),
    continentMacroWeight: clamp(isFiniteNumber(packet.continentMacroWeight) ? packet.continentMacroWeight : 0, 0, 1),
    waterPurityWeight: clamp(isFiniteNumber(packet.waterPurityWeight) ? packet.waterPurityWeight : 0, 0, 1),
    mineralReflectanceWeight: clamp(isFiniteNumber(packet.mineralReflectanceWeight) ? packet.mineralReflectanceWeight : 0, 0, 1),
    sedimentTintWeight: clamp(isFiniteNumber(packet.sedimentTintWeight) ? packet.sedimentTintWeight : 0, 0, 1),
    sedimentLoad: clamp(isFiniteNumber(packet.sedimentLoad) ? packet.sedimentLoad : 0, 0, 1),
    transportPotential: clamp(isFiniteNumber(packet.transportPotential) ? packet.transportPotential : 0, 0, 1),
    depositionPotential: clamp(isFiniteNumber(packet.depositionPotential) ? packet.depositionPotential : 0, 0, 1),

    directionalClass: normalizeString(packet.directionalClass, "CENTERED"),
    directionalWeight: clamp(isFiniteNumber(packet.directionalWeight) ? packet.directionalWeight : 0, 0, 1),
    directionalNorthBias: clamp(isFiniteNumber(packet.directionalNorthBias) ? packet.directionalNorthBias : 0, 0, 1),
    directionalSouthBias: clamp(isFiniteNumber(packet.directionalSouthBias) ? packet.directionalSouthBias : 0, 0, 1),
    directionalEastBias: clamp(isFiniteNumber(packet.directionalEastBias) ? packet.directionalEastBias : 0, 0, 1),
    directionalWestBias: clamp(isFiniteNumber(packet.directionalWestBias) ? packet.directionalWestBias : 0, 0, 1),
    directionalContrast: clamp(isFiniteNumber(packet.directionalContrast) ? packet.directionalContrast : 0, 0, 1),

    renderIntent: Object.freeze({
      drawsTerrain: true,
      ownsElevation: false,
      ownsCut: false,
      ownsBotany: false,
      ownsHydration: false,
      ownsBoot: false,
      ownsRuntime: false,
      ownsTruth: false,
      baselineCoverage: "LAND_100_PERCENT"
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
