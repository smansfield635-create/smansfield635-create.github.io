export function analyzeWorld(planetField, projectionSummary = {}) {
  const grid = Array.isArray(planetField?.samples) ? planetField.samples : [];
  const hasGrid = grid.length > 0 && Array.isArray(grid[0]) && grid[0].length > 0;

  if (!hasGrid) {
    return Object.freeze({
      phase: "NONE",
      stabilityClass: "COLLAPSE",
      lobeId: "NONE",
      terrainClass: "NONE",
      biomeType: "NONE",
      surfaceMaterial: "NONE",
      continentId: "NONE",
      continentName: "NONE",
      continentTier: null,
      shardClass: "NONE",
      landMask: 0,
      waterMask: 0,
      shoreline: false,
      elevation: null,
      rainfall: null,
      freezePotential: null,
      habitability: null,
      maritimeInfluence: null,
      continentality: null,
      evaporationPressure: null,
      auroralPotential: null,
      traversalDifficulty: null,
      slopeSeverity: null,
      activeCitiesTotal: 0,
      activeMetrosTotal: 0,
      sampleX: null,
      sampleY: null,
      cellId: "NONE",
      reason: "Planet field missing or unreadable."
    });
  }

  const height = grid.length;
  const width = grid[0].length;

  const rawX = Number.isInteger(projectionSummary?.sampleX) ? projectionSummary.sampleX : Math.floor(width * 0.5);
  const rawY = Number.isInteger(projectionSummary?.sampleY) ? projectionSummary.sampleY : Math.floor(height * 0.5);

  const sampleX = clamp(rawX, 0, width - 1);
  const sampleY = clamp(rawY, 0, height - 1);

  const currentSample = grid[sampleY]?.[sampleX] || null;
  const resolvedSample = currentSample || grid[Math.floor(height * 0.5)]?.[Math.floor(width * 0.5)] || grid[0]?.[0] || null;

  if (!resolvedSample) {
    return Object.freeze({
      phase: "NONE",
      stabilityClass: "COLLAPSE",
      lobeId: "NONE",
      terrainClass: "NONE",
      biomeType: "NONE",
      surfaceMaterial: "NONE",
      continentId: "NONE",
      continentName: "NONE",
      continentTier: null,
      shardClass: "NONE",
      landMask: 0,
      waterMask: 0,
      shoreline: false,
      elevation: null,
      rainfall: null,
      freezePotential: null,
      habitability: null,
      maritimeInfluence: null,
      continentality: null,
      evaporationPressure: null,
      auroralPotential: null,
      traversalDifficulty: null,
      slopeSeverity: null,
      activeCitiesTotal: 0,
      activeMetrosTotal: 0,
      sampleX,
      sampleY,
      cellId: `${sampleY}:${sampleX}`,
      reason: "Resolved sample missing."
    });
  }

  const terrainClass = readString(resolvedSample.terrainClass, "NONE");
  const biomeType = readString(resolvedSample.biomeType, "NONE");
  const surfaceMaterial = readString(resolvedSample.surfaceMaterial, "NONE");
  const continentId = readString(resolvedSample.continentId, "NONE");
  const continentName = readString(resolvedSample.continentName, "NONE");
  const shardClass = readString(resolvedSample.shardClass, "NONE");
  const continentTier = Number.isFinite(resolvedSample.continentTier) ? resolvedSample.continentTier : null;

  const landMask = resolvedSample.landMask === 1 ? 1 : 0;
  const waterMask = resolvedSample.waterMask === 1 ? 1 : 0;
  const shoreline = resolvedSample.shoreline === true || resolvedSample.shorelineBand === true;

  const elevation = readFinite(resolvedSample.elevation);
  const rainfall = readFinite(resolvedSample.rainfall);
  const freezePotential = readFinite(resolvedSample.freezePotential);
  const habitability = readFinite(resolvedSample.habitability);
  const maritimeInfluence = readFinite(resolvedSample.maritimeInfluence);
  const continentality = readFinite(resolvedSample.continentality);
  const evaporationPressure = readFinite(resolvedSample.evaporationPressure);
  const auroralPotential = readFinite(resolvedSample.auroralPotential);
  const traversalDifficulty = readFinite(resolvedSample.traversalDifficulty);
  const slopeSeverity = readFinite(resolvedSample.slopeSeverity);

  const phase = resolvePhase({
    landMask,
    waterMask,
    shoreline,
    terrainClass
  });

  const stabilityClass = resolveStabilityClass({
    phase,
    terrainClass,
    biomeType,
    habitability,
    rainfall,
    freezePotential,
    traversalDifficulty,
    slopeSeverity,
    shoreline
  });

  const lobeId = resolveLobeId({
    continentId,
    continentTier,
    terrainClass,
    landMask,
    waterMask
  });

  return Object.freeze({
    phase,
    stabilityClass,
    lobeId,
    terrainClass,
    biomeType,
    surfaceMaterial,
    continentId,
    continentName,
    continentTier,
    shardClass,
    landMask,
    waterMask,
    shoreline,
    elevation,
    rainfall,
    freezePotential,
    habitability,
    maritimeInfluence,
    continentality,
    evaporationPressure,
    auroralPotential,
    traversalDifficulty,
    slopeSeverity,
    activeCitiesTotal: Number.isFinite(resolvedSample.activeCitiesTotal) ? resolvedSample.activeCitiesTotal : 0,
    activeMetrosTotal: Number.isFinite(resolvedSample.activeMetrosTotal) ? resolvedSample.activeMetrosTotal : 0,
    sampleX,
    sampleY,
    cellId: `${sampleY}:${sampleX}`,
    reason: buildReason({
      phase,
      stabilityClass,
      terrainClass,
      biomeType,
      continentId,
      shoreline
    })
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function readFinite(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readString(value, fallback) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function resolvePhase({ landMask, waterMask, shoreline, terrainClass }) {
  if (shoreline) return "MIXED";
  if (landMask === 1) return "LAND";
  if (waterMask === 1) return "WATER";
  if (terrainClass === "WATER" || terrainClass === "SHELF") return "WATER";
  if (terrainClass === "BEACH" || terrainClass === "SHORELINE") return "MIXED";
  return "LAND";
}

function resolveStabilityClass({
  phase,
  terrainClass,
  biomeType,
  habitability,
  rainfall,
  freezePotential,
  traversalDifficulty,
  slopeSeverity,
  shoreline
}) {
  if (phase === "WATER") return "COLLAPSE";
  if (terrainClass === "WATER" || terrainClass === "SHELF") return "COLLAPSE";
  if (shoreline) return "UNSTABLE";
  if (terrainClass === "CANYON" || terrainClass === "SUMMIT" || terrainClass === "MOUNTAIN") return "UNSTABLE";
  if (terrainClass === "POLAR_ICE" || terrainClass === "GLACIAL_HIGHLAND") return "UNSTABLE";
  if (biomeType === "GLACIER") return "UNSTABLE";

  const h = typeof habitability === "number" ? habitability : 0;
  const r = typeof rainfall === "number" ? rainfall : 0;
  const f = typeof freezePotential === "number" ? freezePotential : 0;
  const t = typeof traversalDifficulty === "number" ? traversalDifficulty : 1;
  const s = typeof slopeSeverity === "number" ? slopeSeverity : 1;

  if (h >= 0.45 && t <= 0.55 && s <= 0.60 && f <= 0.60) return "STABLE";
  if (h >= 0.20 && r >= 0.12 && t <= 0.82 && s <= 0.88) return "UNSTABLE";
  return "COLLAPSE";
}

function resolveLobeId({ continentId, continentTier, terrainClass, landMask, waterMask }) {
  if (landMask !== 1) {
    if (waterMask === 1 || terrainClass === "WATER" || terrainClass === "SHELF") return "NONE";
  }

  if (typeof continentId === "string" && continentId !== "NONE") return continentId;
  if (Number.isFinite(continentTier)) return `T${continentTier}`;
  return "NONE";
}

function buildReason({ phase, stabilityClass, terrainClass, biomeType, continentId, shoreline }) {
  return [
    `phase=${phase}`,
    `stability=${stabilityClass}`,
    `terrain=${terrainClass}`,
    `biome=${biomeType}`,
    `continent=${continentId}`,
    `shoreline=${shoreline === true ? "true" : "false"}`
  ].join(" | ");
}
