// /assets/instruments.js
// MODE: INSTRUMENT CONTRACT RENEWAL
// STATUS: DIAGNOSTIC / CLASSIFICATION AUTHORITY v2
// ROLE:
// - observe runtime state only
// - classify / summarize / render compact diagnostics only
// - no render authority
// - no terrain mutation
// - no runtime mutation
// - no compensation
// - pair lawfully with world / terrain / traversal / coherence contracts
// - expand reporting terms to fuller current baseline expression

import { WORLD_KERNEL } from "/world/world_kernel.js";

const EMPTY = "—";
const STALE_THRESHOLD_MS = 3000;
const DEFAULT_FPS = 0;
const DEFAULT_DT_MS = 0;
const DEFAULT_SOURCE_PHASE = "RUNNING";
const DEFAULT_SOURCE_MODE = "active";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value, fallback = EMPTY) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizePrimitive(value, fallback = EMPTY) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return normalizeString(value, fallback);
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : fallback;
  if (typeof value === "boolean") return value ? "true" : "false";
  return fallback;
}

function toFixedSafe(value, digits = 3, fallback = EMPTY) {
  return isFiniteNumber(value) ? value.toFixed(digits) : fallback;
}

function toPercentSafe(value, digits = 1, fallback = EMPTY) {
  return isFiniteNumber(value) ? `${(value * 100).toFixed(digits)}%` : fallback;
}

function toIntegerSafe(value, fallback = EMPTY) {
  return isFiniteNumber(value) ? String(Math.round(value)) : fallback;
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function labelize(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase());
}

function renderKeyValueSection(title, data) {
  const rows = Object.entries(data).map(([key, value]) => {
    return `<div class="panel-row"><span class="panel-key">${escapeHTML(labelize(key))}</span><span class="panel-value">${escapeHTML(normalizePrimitive(value))}</span></div>`;
  });

  return `<section class="panel-section"><h3 class="panel-title">${escapeHTML(title)}</h3>${rows.join("")}</section>`;
}

function readMetric(sample, key, fallback = 0) {
  const value = sample?.[key];
  return isFiniteNumber(value) ? value : fallback;
}

function buildVector(currentSample, previousSample) {
  const current = normalizeObject(currentSample);
  const previous = normalizeObject(previousSample);

  const dx =
    isFiniteNumber(current.lonDeg) && isFiniteNumber(previous.lonDeg)
      ? current.lonDeg - previous.lonDeg
      : 0;

  const dy =
    isFiniteNumber(current.latDeg) && isFiniteNumber(previous.latDeg)
      ? current.latDeg - previous.latDeg
      : 0;

  return Object.freeze({
    dx,
    dy,
    magnitude: Math.sqrt((dx * dx) + (dy * dy))
  });
}

function buildStateIndex(currentSample) {
  const sample = normalizeObject(currentSample);

  const bits = [
    clamp(sample.plateauStrength ?? 0, 0, 1) >= 0.5 ? 1 : 0,
    clamp(sample.strongestSummitScore ?? 0, 0, 1) >= 0.2 ? 1 : 0,
    sample.shoreline === true ? 1 : 0,
    sample.waterMask === 1 ? 1 : 0,
    clamp(sample.basinStrength ?? 0, 0, 1) >= 0.18 ? 1 : 0,
    sample.riverCandidate === true ? 1 : 0,
    sample.lakeCandidate === true ? 1 : 0,
    sample.subRegion === "GENEROSITY_CONTINENT" ? 1 : 0
  ];

  let stateIndex = 0;

  for (let i = 0; i < bits.length; i += 1) {
    stateIndex |= bits[i] << (7 - i);
  }

  return stateIndex;
}

function buildCoherence(currentSample, coherenceBindingState = null, perceptionModifiersState = null) {
  const coherence = normalizeObject(coherenceBindingState);
  const perception = normalizeObject(perceptionModifiersState);
  const sample = normalizeObject(currentSample);

  const direct =
    coherence?.globalField?.coherence ??
    coherence?.global?.coherence ??
    perception?.globalEnvelope?.clarityLevel;

  if (isFiniteNumber(direct)) {
    return clamp(direct, 0, 1);
  }

  const plateau = clamp(sample.plateauStrength ?? 0, 0, 1);
  const mountain = clamp(sample.strongestSummitScore ?? 0, 0, 1);
  const basin = clamp(sample.strongestBasinScore ?? 0, 0, 1);
  const shoreline = sample.shoreline === true ? 1 : 0;
  const wetland = sample.biomeType === "WETLAND" ? 1 : 0;
  const glacier = sample.biomeType === "GLACIER" ? 1 : 0;

  const energy = clamp(0.26 + plateau * 0.20 + mountain * 0.28 + shoreline * 0.08, 0, 1);
  const information = clamp(0.28 + basin * 0.24 + shoreline * 0.12 + wetland * 0.10, 0, 1);
  const value = clamp(0.24 + (1 - glacier) * 0.16 + plateau * 0.14 + basin * 0.16 + wetland * 0.10, 0, 1);

  return clamp(Math.min(energy, information, value), 0, 1);
}

function buildDirection16FromSamples(currentSample, previousSample) {
  const directions = WORLD_KERNEL?.cardinal16 ?? [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW"
  ];

  const current = normalizeObject(currentSample);
  const previous = normalizeObject(previousSample);

  const fallback = current.subRegion === "GENEROSITY_CONTINENT" ? "N" : "S";

  if (!isFiniteNumber(current.latDeg) || !isFiniteNumber(current.lonDeg)) {
    return fallback;
  }

  const previousLat = isFiniteNumber(previous.latDeg) ? previous.latDeg : current.latDeg;
  const previousLon = isFiniteNumber(previous.lonDeg) ? previous.lonDeg : current.lonDeg;

  const dLat = current.latDeg - previousLat;
  const dLon = current.lonDeg - previousLon;

  if (Math.abs(dLat) < 0.0001 && Math.abs(dLon) < 0.0001) {
    return fallback;
  }

  const angle = Math.atan2(dLon, dLat);
  const normalized = (angle + Math.PI * 2) % (Math.PI * 2);
  const sector = Math.round(normalized / (Math.PI / 8)) % 16;

  return directions[sector] ?? fallback;
}

function buildTrajectoryClass(coherence, previousCoherence, vectorMagnitude) {
  const delta = coherence - previousCoherence;

  if (delta > 0.03) return "ASCENT";
  if (delta < -0.03) return "DESCENT";
  if (vectorMagnitude < 0.01) return "STALL";
  return "OSCILLATION";
}

function deriveTimestampMs(tickIndex, fps) {
  if (!isFiniteNumber(tickIndex)) return null;
  const safeFps = isFiniteNumber(fps) && fps > 0 ? fps : 60;
  const ageMs = Math.max(0, Math.round((1 / safeFps) * 1000));
  return Date.now() - ageMs;
}

function deriveAgeMs(timestampMs) {
  if (!isFiniteNumber(timestampMs)) return null;
  return Math.max(0, Date.now() - timestampMs);
}

function deriveFrameSync(motionState) {
  const motion = normalizeObject(motionState);
  if (motion.rafActive === true && motion.motionRunning === true) return true;
  if (motion.rafActive === false || motion.motionRunning === false) return false;
  return null;
}

function classifyState({
  timestampValid,
  fresh,
  frameSync,
  verificationPass,
  failurePhase
}) {
  if (normalizeString(failurePhase, "") !== "") return "INVALID";
  if (verificationPass !== true) return "OFFLINE";
  if (timestampValid !== true) return "INVALID";
  if (frameSync === false) return "OFFLINE";
  if (fresh === false) return "STALE";
  return "LIVE";
}

function classifyTerrainEnvelope(sample) {
  const terrainClass = normalizeString(sample?.terrainClass, "NONE");
  const biomeType = normalizeString(sample?.biomeType, "NONE");
  const landMask = sample?.landMask === 1;
  const waterMask = sample?.waterMask === 1;

  if (waterMask) return "MARINE";
  if (!landMask) return "UNRESOLVED";
  if (terrainClass === "POLAR_ICE" || terrainClass === "GLACIAL_HIGHLAND" || biomeType === "GLACIER") return "CRYO";
  if (terrainClass === "SUMMIT" || terrainClass === "MOUNTAIN" || terrainClass === "RIDGE") return "RELIEF";
  if (terrainClass === "CANYON") return "INCISION";
  if (terrainClass === "PLATEAU") return "PLATEAU";
  if (terrainClass === "BASIN" || biomeType === "WETLAND") return "RETENTION";
  if (terrainClass === "BEACH" || terrainClass === "SHORELINE") return "SHORE";
  return "GROUND";
}

function classifyPrimitiveEnvelope(renderSummary = {}) {
  const primitive = normalizeObject(renderSummary.primitive);
  const density = normalizeObject(renderSummary.density);
  const audit = normalizeObject(renderSummary.audit);

  const primitiveType = normalizeString(primitive.primitiveType, "NONE");
  const path = normalizeString(primitive.primitivePath, "none");
  const densityTier = normalizeString(density.densityTier, "NONE");
  const cryoCount = readMetric(audit, "cryosphereCount", 0);
  const cutCount = readMetric(audit, "cutFamilyCount", 0);
  const elevationCount = readMetric(audit, "elevationFamilyCount", 0);

  if (primitiveType === "NONE") return "OFF";
  if (cryoCount > 0 && elevationCount > 0) return "CRYO_RELIEF";
  if (cutCount > 0 && elevationCount > 0) return "RELIEF_CUT";
  if (path.includes("split") && densityTier !== "NONE") return "FRAGMENTED";
  return "BASELINE";
}

function buildTerrainMetrics(sample) {
  const terrainClass = normalizeString(sample?.terrainClass, "NONE");
  const biomeType = normalizeString(sample?.biomeType, "NONE");
  const surfaceMaterial = normalizeString(sample?.surfaceMaterial, "NONE");

  const elevation = clamp(readMetric(sample, "elevation", 0), -1, 1);
  const slope = clamp(readMetric(sample, "slope", 0), 0, 1);
  const curvature = clamp(readMetric(sample, "curvature", 0), -1, 1);
  const ridgeStrength = clamp(readMetric(sample, "ridgeStrength", 0), 0, 1);
  const plateauStrength = clamp(readMetric(sample, "plateauStrength", 0), 0, 1);
  const basinStrength = clamp(readMetric(sample, "basinStrength", 0), 0, 1);
  const canyonStrength = clamp(readMetric(sample, "canyonStrength", 0), 0, 1);
  const continuity =
    clamp(
      plateauStrength * 0.24 +
      basinStrength * 0.16 +
      (1 - slope) * 0.20 +
      Math.max(0, 1 - Math.abs(curvature)) * 0.14 +
      (terrainClass === "PLATEAU" ? 0.12 : 0) +
      (biomeType === "WETLAND" ? 0.08 : 0),
      0,
      1
    );

  const variation =
    clamp(
      slope * 0.24 +
      Math.abs(curvature) * 0.20 +
      canyonStrength * 0.18 +
      ridgeStrength * 0.16 +
      Math.abs(elevation) * 0.12 +
      (surfaceMaterial === "BEDROCK" ? 0.06 : 0) +
      (surfaceMaterial === "SAND" ? 0.04 : 0),
      0,
      1
    );

  const retention =
    clamp(
      basinStrength * 0.30 +
      plateauStrength * 0.10 +
      readMetric(sample, "rainfall", 0) * 0.16 +
      readMetric(sample, "runoff", 0) * 0.10 +
      readMetric(sample, "basinAccumulation", 0) * 0.24 +
      (biomeType === "WETLAND" ? 0.10 : 0),
      0,
      1
    );

  const exposure =
    clamp(
      ridgeStrength * 0.24 +
      canyonStrength * 0.20 +
      slope * 0.18 +
      Math.max(0, elevation) * 0.16 +
      readMetric(sample, "strongestSummitScore", 0) * 0.16 +
      (terrainClass === "SUMMIT" ? 0.10 : 0),
      0,
      1
    );

  return Object.freeze({
    terrainClass,
    biomeType,
    surfaceMaterial,
    continuity,
    variation,
    retention,
    exposure
  });
}

function buildDirectionalMetrics(sample, previousSample) {
  const direction16 = buildDirection16FromSamples(sample, previousSample);
  const lat = readMetric(sample, "latDeg", 0) * Math.PI / 180;
  const lon = readMetric(sample, "lonDeg", 0) * Math.PI / 180;
  const slope = clamp(readMetric(sample, "slope", 0), 0, 1);
  const ridgeStrength = clamp(readMetric(sample, "ridgeStrength", 0), 0, 1);
  const basinStrength = clamp(readMetric(sample, "basinStrength", 0), 0, 1);
  const rainfall = clamp(readMetric(sample, "rainfall", 0), 0, 1);
  const canyonStrength = clamp(readMetric(sample, "canyonStrength", 0), 0, 1);

  const northBias = clamp(Math.abs(Math.sin(lat)) * 0.24 + rainfall * 0.20 + (1 - slope) * 0.14 + ridgeStrength * 0.06, 0, 1);
  const southBias = clamp(basinStrength * 0.24 + canyonStrength * 0.14 + (1 - rainfall) * 0.16 + Math.abs(Math.sin(lat)) * 0.10, 0, 1);
  const eastBias = clamp(Math.abs(Math.sin(lon)) * 0.24 + slope * 0.18 + ridgeStrength * 0.14 + canyonStrength * 0.08, 0, 1);
  const westBias = clamp(Math.abs(Math.cos(lon)) * 0.24 + basinStrength * 0.20 + (1 - slope) * 0.10 + rainfall * 0.08, 0, 1);

  const sorted = [northBias, southBias, eastBias, westBias].sort((a, b) => b - a);
  const directionalContrast = clamp((sorted[0] ?? 0) - (sorted[1] ?? 0), 0, 1);

  let directionalClass = "CENTERED";
  const dominant = sorted[0] ?? 0;

  if (dominant === northBias) directionalClass = "NORTH";
  else if (dominant === southBias) directionalClass = "SOUTH";
  else if (dominant === eastBias) directionalClass = "EAST";
  else if (dominant === westBias) directionalClass = "WEST";

  return Object.freeze({
    direction16,
    directionalClass,
    directionalWeight: dominant,
    directionalNorthBias: northBias,
    directionalSouthBias: southBias,
    directionalEastBias: eastBias,
    directionalWestBias: westBias,
    directionalContrast
  });
}

function buildPrimitiveMetrics(sample, previousSample, renderSummary = {}) {
  const terrain = buildTerrainMetrics(sample);
  const directional = buildDirectionalMetrics(sample, previousSample);
  const renderAudit = normalizeObject(renderSummary.audit);
  const renderDensity = normalizeObject(renderSummary.density);

  const packetSeparationWeight = clamp(
    terrain.continuity * 0.20 +
    terrain.variation * 0.22 +
    terrain.exposure * 0.24 +
    terrain.retention * 0.18 +
    directional.directionalContrast * 0.16,
    0,
    1
  );

  const shadowDensity = clamp(
    terrain.exposure * 0.28 +
    terrain.variation * 0.18 +
    readMetric(sample, "strongestSummitScore", 0) * 0.12 +
    readMetric(sample, "canyonStrength", 0) * 0.16 +
    directional.directionalContrast * 0.10 +
    (readMetric(renderAudit, "cutFamilyCount", 0) > 0 ? 0.08 : 0),
    0,
    1
  );

  const fragmentWeight = clamp(
    terrain.variation * 0.30 +
    terrain.exposure * 0.16 +
    readMetric(sample, "canyonStrength", 0) * 0.16 +
    readMetric(sample, "ridgeStrength", 0) * 0.10 +
    directional.directionalContrast * 0.14 +
    (normalizeString(renderDensity.densityTier, "NONE") !== "NONE" ? 0.06 : 0),
    0,
    1
  );

  const asymmetryWeight = clamp(
    directional.directionalWeight * 0.28 +
    directional.directionalContrast * 0.22 +
    terrain.variation * 0.18 +
    terrain.exposure * 0.12 +
    terrain.retention * 0.08,
    0,
    1
  );

  return Object.freeze({
    ...terrain,
    ...directional,
    packetSeparationWeight,
    shadowDensity,
    fragmentWeight,
    asymmetryWeight
  });
}

function buildScopeMetrics(currentSample, planetField, projectionSummary, worldVariantState, traversalState, worldModeState) {
  const sample = normalizeObject(currentSample);
  const projection = normalizeObject(projectionSummary);
  const variant = normalizeObject(worldVariantState);
  const traversal = normalizeObject(traversalState);
  const worldMode = normalizeObject(worldModeState);

  const width = Array.isArray(planetField?.samples) && Array.isArray(planetField.samples[0])
    ? planetField.samples[0].length
    : null;
  const height = Array.isArray(planetField?.samples) ? planetField.samples.length : null;

  return Object.freeze({
    sampleX: isFiniteNumber(projection.sampleX) ? Math.round(projection.sampleX) : null,
    sampleY: isFiniteNumber(projection.sampleY) ? Math.round(projection.sampleY) : null,
    width,
    height,
    continentId: normalizeString(sample.continentId, "NONE"),
    continentName: normalizeString(sample.continentName, "NONE"),
    continentTier: isFiniteNumber(sample.continentTier) ? sample.continentTier : null,
    shardClass: normalizeString(sample.shardClass, "NONE"),
    activeVariant: isFiniteNumber(variant.activeVariant) ? variant.activeVariant : null,
    ratio: normalizeString(variant.ratio, EMPTY),
    traversalMode: normalizeString(worldMode?.diagnostics?.activeTraversalMode ?? traversal.activeMode, EMPTY),
    zoneState: normalizeString(worldMode?.zoneState ?? "NONE", "NONE")
  });
}

function buildLifecycleMetrics(currentSample) {
  const sample = normalizeObject(currentSample);

  return Object.freeze({
    rainfall: clamp(readMetric(sample, "rainfall", 0), 0, 1),
    runoff: clamp(readMetric(sample, "runoff", 0), 0, 1),
    basinAccumulation: clamp(readMetric(sample, "basinAccumulation", 0), 0, 1),
    freezePotential: clamp(readMetric(sample, "freezePotential", 0), 0, 1),
    meltPotential: clamp(readMetric(sample, "meltPotential", 0), 0, 1),
    evaporationPressure: clamp(readMetric(sample, "evaporationPressure", 0), 0, 1),
    maritimeInfluence: clamp(readMetric(sample, "maritimeInfluence", 0), 0, 1),
    continentality: clamp(readMetric(sample, "continentality", 0), 0, 1),
    auroralPotential: clamp(readMetric(sample, "auroralPotential", 0), 0, 1),
    magneticIntensity: clamp(readMetric(sample, "magneticIntensity", 0), 0, 1),
    navigationStability: clamp(readMetric(sample, "navigationStability", 0), 0, 1),
    gravityConstraint: clamp(readMetric(sample, "gravityConstraint", 0), 0, 1)
  });
}

function buildRoleMetrics(currentSample) {
  const sample = normalizeObject(currentSample);

  return Object.freeze({
    terrainEnvelope: classifyTerrainEnvelope(sample),
    landMask: sample.landMask === 1,
    waterMask: sample.waterMask === 1,
    shoreline: sample.shoreline === true || sample.shorelineBand === true,
    riverCandidate: sample.riverCandidate === true,
    lakeCandidate: sample.lakeCandidate === true,
    caveCandidate: normalizeArray(sample.eventFlags).includes("CAVE_CANDIDATE"),
    flowClass: normalizeString(sample.flowClass, "NONE"),
    flowDirection: normalizeString(sample.flowDirection, "NONE"),
    hemisphereSeason: normalizeString(sample.hemisphereSeason, "NONE"),
    seasonalBiomePhase: normalizeString(sample.seasonalBiomePhase, "NONE")
  });
}

function buildAuthorityMetrics(authorityState, renderSummary = {}) {
  const authority = normalizeObject(authorityState);
  const renderAuthority = normalizeObject(renderSummary.renderAuthority);

  return Object.freeze({
    runtimeSource: normalizeString(authority.runtimeSource, "/world/runtime/world_runtime.js"),
    instrumentSource: normalizeString(authority.instrumentSource, "/assets/instruments.js"),
    renderReadsScope: renderAuthority.renderReadsScope === true,
    renderReadsLens: renderAuthority.renderReadsLens === true,
    fallbackMode: renderAuthority.fallbackMode === true,
    liveRenderPath: normalizeString(renderAuthority.liveRenderPath, "NONE")
  });
}

function buildSummaryStrings({
  classifiedState,
  sourcePhase,
  primitiveMetrics,
  scopeMetrics,
  lifecycleMetrics,
  roleMetrics
}) {
  const compactState = [
    `STATE=${classifiedState}`,
    `PHASE=${sourcePhase}`,
    `ENV=${primitiveMetrics.terrainEnvelope}`,
    `DIR=${primitiveMetrics.direction16}`,
    `C=${toFixedSafe(primitiveMetrics.packetSeparationWeight, 2)}`,
    `SH=${toFixedSafe(primitiveMetrics.shadowDensity, 2)}`,
    `FR=${toFixedSafe(primitiveMetrics.fragmentWeight, 2)}`
  ].join(" | ");

  const compactWorld = [
    `CONT=${scopeMetrics.continentId}`,
    `TIER=${normalizePrimitive(scopeMetrics.continentTier)}`,
    `MODE=${scopeMetrics.traversalMode}`,
    `SEASON=${roleMetrics.hemisphereSeason}`,
    `RAIN=${toFixedSafe(lifecycleMetrics.rainfall, 2)}`,
    `FREEZE=${toFixedSafe(lifecycleMetrics.freezePotential, 2)}`
  ].join(" | ");

  return Object.freeze({
    compactState,
    compactWorld
  });
}

export function buildInstrumentReceipt({
  currentSample = null,
  previousSample = null,
  tickIndex = 0,
  motionState = null,
  authorityState = null,
  planetField = null,
  projectionSummary = null,
  worldVariantState = null,
  traversalState = null,
  coherenceBindingState = null,
  perceptionModifiersState = null,
  subsurfaceActivationState = null,
  worldModeState = null,
  renderSummary = null
} = {}) {
  const current = normalizeObject(currentSample);
  const previous = normalizeObject(previousSample);
  const motion = normalizeObject(motionState);
  const authority = normalizeObject(authorityState);
  const traversal = normalizeObject(traversalState);
  const coherence = normalizeObject(coherenceBindingState);
  const perception = normalizeObject(perceptionModifiersState);
  const subsurface = normalizeObject(subsurfaceActivationState);
  const worldMode = normalizeObject(worldModeState);
  const variant = normalizeObject(worldVariantState);

  const fps = isFiniteNumber(motion.fps) ? motion.fps : DEFAULT_FPS;
  const dtMs = isFiniteNumber(motion.dtMs) ? motion.dtMs : DEFAULT_DT_MS;
  const timestampMs = deriveTimestampMs(tickIndex, fps);
  const ageMs = deriveAgeMs(timestampMs);
  const timestampValid = isFiniteNumber(timestampMs);
  const fresh = isFiniteNumber(ageMs) ? ageMs <= STALE_THRESHOLD_MS : false;
  const frameSync = deriveFrameSync(motion);
  const verificationPass = motion.motionRunning === true && motion.rafActive === true;
  const sourcePhase = normalizeString(motion.sourcePhase, DEFAULT_SOURCE_PHASE);
  const sourceMode = normalizeString(motion.sourceMode, DEFAULT_SOURCE_MODE);
  const failurePhase = normalizeString(motion.failurePhase, "");
  const failureMessage = normalizeString(motion.failureMessage, "");

  const coherenceValue = buildCoherence(current, coherence, perception);
  const previousCoherence = buildCoherence(previous, coherence, perception);
  const vector = buildVector(current, previous);
  const direction16 = buildDirection16FromSamples(current, previous);
  const stateIndex = buildStateIndex(current);
  const trajectoryClass = buildTrajectoryClass(coherenceValue, previousCoherence, vector.magnitude);
  const stability =
    coherence?.globalField?.stability ??
    coherence?.global?.stability ??
    perception?.globalEnvelope?.stabilityLevel ??
    0;

  const classifiedState = classifyState({
    timestampValid,
    fresh,
    frameSync,
    verificationPass,
    failurePhase
  });

  const primitiveMetrics = buildPrimitiveMetrics(current, previous, renderSummary);
  const primitiveEnvelope = classifyPrimitiveEnvelope(renderSummary);
  const scopeMetrics = buildScopeMetrics(current, planetField, projectionSummary, variant, traversal, worldMode);
  const lifecycleMetrics = buildLifecycleMetrics(current);
  const roleMetrics = buildRoleMetrics(current);
  const authorityMetrics = buildAuthorityMetrics(authority, renderSummary);
  const summaryStrings = buildSummaryStrings({
    classifiedState,
    sourcePhase,
    primitiveMetrics,
    scopeMetrics,
    lifecycleMetrics,
    roleMetrics
  });

  return Object.freeze({
    classifiedState,

    displayPayload: Object.freeze({
      baseline: Object.freeze({
        t: normalizeString(sourcePhase, EMPTY),
        p: normalizeString(direction16, EMPTY),
        s: normalizePrimitive(stateIndex, EMPTY),
        v: normalizeString(variant.ratio, EMPTY)
      }),

      progress: Object.freeze({
        f: normalizeString(worldMode?.diagnostics?.activeTraversalMode ?? traversal.activeMode, EMPTY),
        dt: isFiniteNumber(dtMs) ? `${Math.round(dtMs)}ms` : EMPTY,
        c: coherenceValue,
        st: isFiniteNumber(stability) ? clamp(stability, 0, 1) : 0,
        tr: normalizeString(trajectoryClass, EMPTY)
      }),

      failure: Object.freeze({
        ph: normalizeString(failurePhase, EMPTY),
        msg: normalizeString(failureMessage, EMPTY),
        s: failurePhase.length > 0
      }),

      summary: Object.freeze({
        state: summaryStrings.compactState,
        world: summaryStrings.compactWorld
      })
    }),

    diagnosticsPayload: Object.freeze({
      timestampMs,
      ageMs,
      timestampValid,
      fresh,
      frameSync,
      verificationPass,
      fps,
      dtMs,
      classifiedState,
      sourcePhase,
      sourceMode,
      failurePhase: normalizeString(failurePhase, EMPTY),
      failureMessage: normalizeString(failureMessage, EMPTY),
      primitiveEnvelope,
      terrainEnvelope: primitiveMetrics.terrainEnvelope
    }),

    meta: Object.freeze({
      tickIndex,
      stateIndex,
      coherence: coherenceValue,
      direction16,
      trajectoryClass,
      vector: Object.freeze(vector),
      authority: Object.freeze(authorityMetrics),
      projectionSummary: Object.freeze(normalizeObject(projectionSummary)),
      fieldSummary: Object.freeze({
        hasPlanetField: Array.isArray(planetField?.samples),
        accessAllowed: subsurface?.accessState?.accessAllowed === true || subsurface.accessAllowed === true,
        primitiveEnvelope,
        terrainEnvelope: primitiveMetrics.terrainEnvelope
      }),
      scope: Object.freeze(scopeMetrics),
      primitive: Object.freeze(primitiveMetrics),
      lifecycle: Object.freeze(lifecycleMetrics),
      role: Object.freeze(roleMetrics)
    })
  });
}

export function buildInstrumentState(input = {}) {
  return buildInstrumentReceipt(input);
}

export function renderCompactBarHTML(runtime = {}) {
  const instrument = normalizeObject(runtime.instrument);
  const diagnosticsPayload = normalizeObject(instrument.diagnosticsPayload);
  const displayPayload = normalizeObject(instrument.displayPayload);
  const baseline = normalizeObject(displayPayload.baseline);
  const progress = normalizeObject(displayPayload.progress);
  const summary = normalizeObject(displayPayload.summary);

  return `
    <div class="diagnostic-bar__group">
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">State</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(instrument.classifiedState))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Phase</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(diagnosticsPayload.sourcePhase))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Env</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(diagnosticsPayload.terrainEnvelope))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Prim</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(diagnosticsPayload.primitiveEnvelope))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">FPS</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(diagnosticsPayload.fps))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">dt</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(progress.dt))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Dir</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(baseline.p))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">C</span>
        <span class="diagnostic-pill__value">${escapeHTML(toFixedSafe(progress.c, 2))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">St</span>
        <span class="diagnostic-pill__value">${escapeHTML(toFixedSafe(progress.st, 2))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Tr</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(progress.tr))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">S</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(baseline.s))}</span>
      </span>
    </div>
    <div class="diagnostic-bar__group">
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Summary</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(summary.state, EMPTY))}</span>
      </span>
    </div>
  `.trim();
}

export function renderPanelHTML(runtime = {}) {
  const instrument = normalizeObject(runtime.instrument);
  const displayPayload = normalizeObject(instrument.displayPayload);
  const diagnosticsPayload = normalizeObject(instrument.diagnosticsPayload);
  const baseline = normalizeObject(displayPayload.baseline);
  const progress = normalizeObject(displayPayload.progress);
  const failure = normalizeObject(displayPayload.failure);
  const summary = normalizeObject(displayPayload.summary);
  const meta = normalizeObject(instrument.meta);
  const primitive = normalizeObject(meta.primitive);
  const scope = normalizeObject(meta.scope);
  const lifecycle = normalizeObject(meta.lifecycle);
  const role = normalizeObject(meta.role);
  const authority = normalizeObject(meta.authority);

  const sections = [
    renderKeyValueSection("Instrument", Object.freeze({
      classifiedState: normalizePrimitive(instrument.classifiedState),
      timestampMs: normalizePrimitive(diagnosticsPayload.timestampMs),
      ageMs: normalizePrimitive(diagnosticsPayload.ageMs),
      timestampValid: normalizePrimitive(diagnosticsPayload.timestampValid),
      fresh: normalizePrimitive(diagnosticsPayload.fresh),
      frameSync: normalizePrimitive(diagnosticsPayload.frameSync),
      verificationPass: normalizePrimitive(diagnosticsPayload.verificationPass),
      fps: normalizePrimitive(diagnosticsPayload.fps),
      dtMs: normalizePrimitive(diagnosticsPayload.dtMs),
      sourcePhase: normalizePrimitive(diagnosticsPayload.sourcePhase),
      sourceMode: normalizePrimitive(diagnosticsPayload.sourceMode),
      primitiveEnvelope: normalizePrimitive(diagnosticsPayload.primitiveEnvelope),
      terrainEnvelope: normalizePrimitive(diagnosticsPayload.terrainEnvelope)
    })),
    renderKeyValueSection("Baseline", Object.freeze({
      t: normalizePrimitive(baseline.t),
      p: normalizePrimitive(baseline.p),
      s: normalizePrimitive(baseline.s),
      v: normalizePrimitive(baseline.v)
    })),
    renderKeyValueSection("Progress", Object.freeze({
      f: normalizePrimitive(progress.f),
      dt: normalizePrimitive(progress.dt),
      c: toFixedSafe(progress.c, 3),
      st: toFixedSafe(progress.st, 3),
      tr: normalizePrimitive(progress.tr)
    })),
    renderKeyValueSection("Summary", Object.freeze({
      state: normalizePrimitive(summary.state),
      world: normalizePrimitive(summary.world)
    })),
    renderKeyValueSection("Failure", Object.freeze({
      phase: normalizePrimitive(failure.ph),
      message: normalizePrimitive(failure.msg),
      signaled: normalizePrimitive(failure.s)
    })),
    renderKeyValueSection("Meta", Object.freeze({
      tickIndex: normalizePrimitive(meta.tickIndex),
      stateIndex: normalizePrimitive(meta.stateIndex),
      coherence: toFixedSafe(meta.coherence, 3),
      direction16: normalizePrimitive(meta.direction16),
      trajectoryClass: normalizePrimitive(meta.trajectoryClass),
      vectorDx: toFixedSafe(meta.vector?.dx, 3),
      vectorDy: toFixedSafe(meta.vector?.dy, 3),
      vectorMagnitude: toFixedSafe(meta.vector?.magnitude, 3)
    })),
    renderKeyValueSection("Primitive", Object.freeze({
      terrainEnvelope: normalizePrimitive(primitive.terrainEnvelope),
      terrainClass: normalizePrimitive(primitive.terrainClass),
      biomeType: normalizePrimitive(primitive.biomeType),
      surfaceMaterial: normalizePrimitive(primitive.surfaceMaterial),
      directionalClass: normalizePrimitive(primitive.directionalClass),
      directionalWeight: toFixedSafe(primitive.directionalWeight, 3),
      directionalContrast: toFixedSafe(primitive.directionalContrast, 3),
      continuity: toFixedSafe(primitive.continuity, 3),
      variation: toFixedSafe(primitive.variation, 3),
      retention: toFixedSafe(primitive.retention, 3),
      exposure: toFixedSafe(primitive.exposure, 3),
      packetSeparationWeight: toFixedSafe(primitive.packetSeparationWeight, 3),
      shadowDensity: toFixedSafe(primitive.shadowDensity, 3),
      fragmentWeight: toFixedSafe(primitive.fragmentWeight, 3),
      asymmetryWeight: toFixedSafe(primitive.asymmetryWeight, 3)
    })),
    renderKeyValueSection("Scope", Object.freeze({
      sampleX: normalizePrimitive(scope.sampleX),
      sampleY: normalizePrimitive(scope.sampleY),
      width: normalizePrimitive(scope.width),
      height: normalizePrimitive(scope.height),
      continentId: normalizePrimitive(scope.continentId),
      continentName: normalizePrimitive(scope.continentName),
      continentTier: normalizePrimitive(scope.continentTier),
      shardClass: normalizePrimitive(scope.shardClass),
      activeVariant: normalizePrimitive(scope.activeVariant),
      ratio: normalizePrimitive(scope.ratio),
      traversalMode: normalizePrimitive(scope.traversalMode),
      zoneState: normalizePrimitive(scope.zoneState)
    })),
    renderKeyValueSection("Lifecycle", Object.freeze({
      rainfall: toFixedSafe(lifecycle.rainfall, 3),
      runoff: toFixedSafe(lifecycle.runoff, 3),
      basinAccumulation: toFixedSafe(lifecycle.basinAccumulation, 3),
      freezePotential: toFixedSafe(lifecycle.freezePotential, 3),
      meltPotential: toFixedSafe(lifecycle.meltPotential, 3),
      evaporationPressure: toFixedSafe(lifecycle.evaporationPressure, 3),
      maritimeInfluence: toFixedSafe(lifecycle.maritimeInfluence, 3),
      continentality: toFixedSafe(lifecycle.continentality, 3),
      auroralPotential: toFixedSafe(lifecycle.auroralPotential, 3),
      magneticIntensity: toFixedSafe(lifecycle.magneticIntensity, 3),
      navigationStability: toFixedSafe(lifecycle.navigationStability, 3),
      gravityConstraint: toFixedSafe(lifecycle.gravityConstraint, 3)
    })),
    renderKeyValueSection("Role", Object.freeze({
      landMask: normalizePrimitive(role.landMask),
      waterMask: normalizePrimitive(role.waterMask),
      shoreline: normalizePrimitive(role.shoreline),
      riverCandidate: normalizePrimitive(role.riverCandidate),
      lakeCandidate: normalizePrimitive(role.lakeCandidate),
      caveCandidate: normalizePrimitive(role.caveCandidate),
      flowClass: normalizePrimitive(role.flowClass),
      flowDirection: normalizePrimitive(role.flowDirection),
      hemisphereSeason: normalizePrimitive(role.hemisphereSeason),
      seasonalBiomePhase: normalizePrimitive(role.seasonalBiomePhase)
    })),
    renderKeyValueSection("Authority", Object.freeze({
      runtimeSource: normalizePrimitive(authority.runtimeSource),
      instrumentSource: normalizePrimitive(authority.instrumentSource),
      renderReadsScope: normalizePrimitive(authority.renderReadsScope),
      renderReadsLens: normalizePrimitive(authority.renderReadsLens),
      fallbackMode: normalizePrimitive(authority.fallbackMode),
      liveRenderPath: normalizePrimitive(authority.liveRenderPath)
    }))
  ];

  return sections.join("");
}

export function createInstruments() {
  return Object.freeze({
    buildInstrumentState,
    buildInstrumentReceipt,
    renderCompactBarHTML,
    renderPanelHTML
  });
}

const DEFAULT_INSTRUMENTS = createInstruments();

export default DEFAULT_INSTRUMENTS;
