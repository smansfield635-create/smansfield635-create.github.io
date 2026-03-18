import { WORLD_KERNEL } from "./world_kernel.js";

const SCALE = 10000;
const NUMERIC_MODE = "AUTHORITATIVE_STRICT_A_INT32_BIGINT";

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function roundHalfAwayFromZero(value) {
  if (!Number.isFinite(value)) return 0;
  if (value >= 0) return Math.floor(value + 0.5);
  return -Math.floor(Math.abs(value) + 0.5);
}

function clampInt(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value | 0;
}

function quantizeUnsigned(value) {
  const scaled = roundHalfAwayFromZero((isFiniteNumber(value) ? value : 0) * SCALE);
  return clampInt(scaled, 0, SCALE);
}

function quantizeSigned(value) {
  const scaled = roundHalfAwayFromZero((isFiniteNumber(value) ? value : 0) * SCALE);
  return clampInt(scaled, -SCALE, SCALE);
}

function normalizeLabel(value) {
  if (typeof value !== "string" || !value.trim()) return "UNKNOWN";
  return value.trim().toUpperCase().replace(/\s+/g, "_");
}

function buildEnumFamily(labels, familyName) {
  const codeByLabel = Object.create(null);
  const labelByCode = Object.create(null);

  for (let i = 0; i < labels.length; i += 1) {
    const normalized = normalizeLabel(labels[i]);
    codeByLabel[normalized] = i;
    labelByCode[i] = normalized;
  }

  function requireCode(label, failureClass) {
    const normalized = normalizeLabel(label);
    const code = codeByLabel[normalized];
    if (!Number.isInteger(code)) {
      const error = new Error(`${failureClass}:${familyName}:${normalized}`);
      error.code = failureClass;
      error.family = familyName;
      error.label = normalized;
      throw error;
    }
    return code;
  }

  function isValidCode(code) {
    return Number.isInteger(code) && Object.prototype.hasOwnProperty.call(labelByCode, code);
  }

  return Object.freeze({
    familyName,
    codeByLabel: Object.freeze(codeByLabel),
    labelByCode: Object.freeze(labelByCode),
    requireCode,
    isValidCode
  });
}

const VOCAB = normalizeObject(WORLD_KERNEL?.vocabulary);
const TERRAIN = buildEnumFamily(Array.isArray(VOCAB.terrainClasses) ? VOCAB.terrainClasses : ["UNKNOWN"], "TERRAIN");
const SURFACE = buildEnumFamily(Array.isArray(VOCAB.surfaceMaterials) ? VOCAB.surfaceMaterials : ["UNKNOWN"], "SURFACE");
const BIOME = buildEnumFamily(Array.isArray(VOCAB.biomeTypes) ? VOCAB.biomeTypes : ["UNKNOWN"], "BIOME");
const CLIMATE = buildEnumFamily(Array.isArray(VOCAB.climateBands) ? VOCAB.climateBands : ["UNKNOWN"], "CLIMATE");

/*
  DRAINAGE is not yet exposed as a canonical vocabulary array in WORLD_KERNEL.
  This local binding follows FULL_ENUM_REGISTRY_BINDING_SPEC_v1 and should be
  moved into WORLD_KERNEL when that file is upgraded.
*/
const DRAINAGE = buildEnumFamily(
  ["UNKNOWN", "NONE", "CLOSED_BASIN", "OPEN_FLOW", "RIVER_ACTIVE", "FLOODPLAIN", "WETLAND_DRAIN"],
  "DRAINAGE"
);

const ENUM_REGISTRY_VERSION = 1;

function normalizeDrainageLabel(value) {
  const normalized = normalizeLabel(value);

  if (normalized === "NONE") return "NONE";
  if (normalized === "CLOSED_BASIN") return "CLOSED_BASIN";
  if (normalized === "OPEN_FLOW") return "OPEN_FLOW";
  if (normalized === "RIVER_ACTIVE") return "RIVER_ACTIVE";
  if (normalized === "FLOODPLAIN") return "FLOODPLAIN";
  if (normalized === "WETLAND_DRAIN") return "WETLAND_DRAIN";

  /*
    Upstream planet fields may still emit loose drainage strings.
    Normalize explicitly here. No fuzzy guessing beyond the listed aliases.
  */
  if (normalized === "BASIN") return "CLOSED_BASIN";
  if (normalized === "CLOSED") return "CLOSED_BASIN";
  if (normalized === "OPEN") return "OPEN_FLOW";
  if (normalized === "RIVER") return "RIVER_ACTIVE";
  if (normalized === "WETLAND") return "WETLAND_DRAIN";

  return normalized;
}

function buildQuantizedSample(sample) {
  const source = normalizeObject(sample);

  const terrainCode = TERRAIN.requireCode(source.terrainClass, "ER2_ENUM_INVALID_CODE");
  const surfaceCode = SURFACE.requireCode(source.surfaceMaterial, "ER2_ENUM_INVALID_CODE");
  const biomeCode = BIOME.requireCode(source.biomeType, "ER2_ENUM_INVALID_CODE");
  const climateCode = CLIMATE.requireCode(source.climateBandField, "ER2_ENUM_INVALID_CODE");
  const drainageCode = DRAINAGE.requireCode(normalizeDrainageLabel(source.drainage), "ER2_ENUM_INVALID_CODE");

  const shorelineBand =
    source.shorelineBand === true ||
    terrainCode === TERRAIN.requireCode("SHORELINE", "ER2_ENUM_INVALID_CODE") ||
    terrainCode === TERRAIN.requireCode("BEACH", "ER2_ENUM_INVALID_CODE")
      ? 1
      : 0;

  return Object.freeze({
    rainfallQ: quantizeUnsigned(source.rainfall),
    runoffQ: quantizeUnsigned(source.runoff),
    freezeQ: quantizeUnsigned(source.freezePotential),
    meltQ: quantizeUnsigned(source.meltPotential),
    basinQ: quantizeUnsigned(source.basinStrength),
    slopeQ: quantizeUnsigned(source.slope),
    elevationQ: quantizeSigned(source.elevation),
    temperatureQ: quantizeUnsigned(source.temperature),
    evaporationQ: quantizeUnsigned(source.evaporationPressure),
    waterDepthQ: quantizeUnsigned(source.waterDepth),

    shorelineBand,

    terrainCode,
    biomeCode,
    surfaceCode,
    climateCode,
    drainageCode,

    enumRegistryVersion: ENUM_REGISTRY_VERSION,
    numericMode: NUMERIC_MODE
  });
}

function buildQuantizedSampleGrid(sampleGrid) {
  if (!Array.isArray(sampleGrid) || !Array.isArray(sampleGrid[0])) return Object.freeze([]);

  return Object.freeze(
    sampleGrid.map((row) =>
      Object.freeze(
        row.map((sample) => buildQuantizedSample(sample))
      )
    )
  );
}

export function createQuantizedSampleView() {
  return Object.freeze({
    scale: SCALE,
    numericMode: NUMERIC_MODE,
    enumRegistryVersion: ENUM_REGISTRY_VERSION,
    registries: Object.freeze({
      terrain: TERRAIN,
      surface: SURFACE,
      biome: BIOME,
      climate: CLIMATE,
      drainage: DRAINAGE
    }),
    buildQuantizedSample,
    buildQuantizedSampleGrid
  });
}

const DEFAULT_QUANTIZED_SAMPLE_VIEW = createQuantizedSampleView();

export function quantizeSample(sample) {
  return DEFAULT_QUANTIZED_SAMPLE_VIEW.buildQuantizedSample(sample);
}

export function quantizeSampleGrid(sampleGrid) {
  return DEFAULT_QUANTIZED_SAMPLE_VIEW.buildQuantizedSampleGrid(sampleGrid);
}
