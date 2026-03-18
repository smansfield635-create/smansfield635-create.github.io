import { WORLD_KERNEL } from "./world_kernel.js";

const SCALE = 10000;
const NUMERIC_MODE = "A_INT32_BIGINT";
const ENUM_REGISTRY_VERSION =
  Number.isInteger(WORLD_KERNEL?.enums?.version)
    ? WORLD_KERNEL.enums.version
    : 1;

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeLabel(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "UNKNOWN";
  }

  return value.trim().toUpperCase().replace(/\s+/g, "_");
}

function roundHalfAwayFromZero(value) {
  if (!Number.isFinite(value)) {
    throw new Error("QS3_NON_CANONICAL_ROUNDING:non_finite");
  }

  return value >= 0
    ? Math.floor(value + 0.5)
    : -Math.floor(Math.abs(value) + 0.5);
}

function requireInt32(value, fieldName) {
  if (!Number.isInteger(value)) {
    throw new Error(`QS1_OUT_OF_RANGE_INPUT:${fieldName}:not_integer`);
  }

  if (value < -2147483648 || value > 2147483647) {
    throw new Error(`QS1_OUT_OF_RANGE_INPUT:${fieldName}:int32_range`);
  }

  return value;
}

function clampInt32(value, min, max, fieldName) {
  const int32 = requireInt32(value, fieldName);

  if (int32 < min) return min;
  if (int32 > max) return max;
  return int32;
}

function quantizeUnsigned(value, fieldName) {
  if (!isFiniteNumber(value)) {
    throw new Error(`QS5_MISSING_FIELD:${fieldName}`);
  }

  const scaled = roundHalfAwayFromZero(value * SCALE);
  return clampInt32(scaled, 0, SCALE, fieldName);
}

function quantizeSigned(value, fieldName) {
  if (!isFiniteNumber(value)) {
    throw new Error(`QS5_MISSING_FIELD:${fieldName}`);
  }

  const scaled = roundHalfAwayFromZero(value * SCALE);
  return clampInt32(scaled, -SCALE, SCALE, fieldName);
}

function buildEnumFamily(labels, familyName) {
  if (!Array.isArray(labels) || labels.length === 0) {
    throw new Error(`ER2_ENUM_INVALID_CODE:${familyName}:empty_registry`);
  }

  const codeByLabel = Object.create(null);
  const labelByCode = Object.create(null);

  for (let i = 0; i < labels.length; i += 1) {
    const normalized = normalizeLabel(labels[i]);
    if (codeByLabel[normalized] !== undefined) {
      throw new Error(`ER4_ENUM_ORDER_DRIFT:${familyName}:${normalized}`);
    }
    codeByLabel[normalized] = i;
    labelByCode[i] = normalized;
  }

  function requireCode(label) {
    const normalized = normalizeLabel(label);
    const code = codeByLabel[normalized];

    if (!Number.isInteger(code)) {
      throw new Error(`ER2_ENUM_INVALID_CODE:${familyName}:${normalized}`);
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

function getVocabularyArrays() {
  const vocabulary = isPlainObject(WORLD_KERNEL?.vocabulary) ? WORLD_KERNEL.vocabulary : null;

  if (!vocabulary) {
    throw new Error("ER1_ENUM_VERSION_MISMATCH:missing_vocabulary");
  }

  return Object.freeze({
    terrainClasses: Array.isArray(vocabulary.terrainClasses) ? vocabulary.terrainClasses : null,
    surfaceMaterials: Array.isArray(vocabulary.surfaceMaterials) ? vocabulary.surfaceMaterials : null,
    biomeTypes: Array.isArray(vocabulary.biomeTypes) ? vocabulary.biomeTypes : null,
    climateBands: Array.isArray(vocabulary.climateBands) ? vocabulary.climateBands : null
  });
}

const VOCABULARY = getVocabularyArrays();

const TERRAIN = buildEnumFamily(
  ["UNKNOWN", ...VOCABULARY.terrainClasses],
  "TERRAIN"
);

const SURFACE = buildEnumFamily(
  ["UNKNOWN", ...VOCABULARY.surfaceMaterials],
  "SURFACE"
);

const BIOME = buildEnumFamily(
  ["UNKNOWN", ...VOCABULARY.biomeTypes],
  "BIOME"
);

const CLIMATE = buildEnumFamily(
  ["UNKNOWN", ...VOCABULARY.climateBands],
  "CLIMATE"
);

const DRAINAGE = buildEnumFamily(
  ["UNKNOWN", "NONE", "CLOSED_BASIN", "OPEN_FLOW", "RIVER_ACTIVE", "FLOODPLAIN", "WETLAND_DRAIN"],
  "DRAINAGE"
);

function normalizeDrainageLabel(value, sample) {
  const normalized = normalizeLabel(value);

  if (normalized === "NONE") return "NONE";
  if (normalized === "CLOSED_BASIN") return "CLOSED_BASIN";
  if (normalized === "OPEN_FLOW") return "OPEN_FLOW";
  if (normalized === "RIVER_ACTIVE") return "RIVER_ACTIVE";
  if (normalized === "FLOODPLAIN") return "FLOODPLAIN";
  if (normalized === "WETLAND_DRAIN") return "WETLAND_DRAIN";

  /*
    Stage-1 float-domain planet_engine emits directional drainage values.
    This bridge resolves them explicitly into canonical drainage families.
  */
  if (
    normalized === "WEST" ||
    normalized === "EAST" ||
    normalized === "NORTH" ||
    normalized === "SOUTH"
  ) {
    if (sample?.riverCandidate === true) return "RIVER_ACTIVE";
    return "OPEN_FLOW";
  }

  if (normalized === "BASIN" || normalized === "CLOSED") return "CLOSED_BASIN";
  if (normalized === "OPEN" || normalized === "FLOW") return "OPEN_FLOW";
  if (normalized === "RIVER") return "RIVER_ACTIVE";
  if (normalized === "WETLAND") return "WETLAND_DRAIN";

  throw new Error(`ER2_ENUM_INVALID_CODE:DRAINAGE:${normalized}`);
}

function requireBoolean(value, fieldName) {
  if (typeof value !== "boolean") {
    throw new Error(`QS5_MISSING_FIELD:${fieldName}`);
  }
  return value;
}

function requireSampleField(sample, fieldName) {
  if (!(fieldName in sample)) {
    throw new Error(`QS5_MISSING_FIELD:${fieldName}`);
  }
  return sample[fieldName];
}

function buildQuantizedSample(sample) {
  if (!isPlainObject(sample)) {
    throw new Error("QS5_MISSING_FIELD:sample");
  }

  const rainfall = requireSampleField(sample, "rainfall");
  const runoff = requireSampleField(sample, "runoff");
  const freezePotential = requireSampleField(sample, "freezePotential");
  const meltPotential = requireSampleField(sample, "meltPotential");
  const basinStrength = requireSampleField(sample, "basinStrength");
  const slope = requireSampleField(sample, "slope");
  const elevation = requireSampleField(sample, "elevation");
  const temperature = requireSampleField(sample, "temperature");
  const evaporationPressure = requireSampleField(sample, "evaporationPressure");
  const waterDepth = requireSampleField(sample, "waterDepth");
  const shorelineBand = requireSampleField(sample, "shorelineBand");
  const terrainClass = requireSampleField(sample, "terrainClass");
  const biomeType = requireSampleField(sample, "biomeType");
  const surfaceMaterial = requireSampleField(sample, "surfaceMaterial");
  const climateBandField = requireSampleField(sample, "climateBandField");
  const drainage = requireSampleField(sample, "drainage");

  const terrainCode = TERRAIN.requireCode(terrainClass);
  const surfaceCode = SURFACE.requireCode(surfaceMaterial);
  const biomeCode = BIOME.requireCode(biomeType);
  const climateCode = CLIMATE.requireCode(climateBandField);
  const drainageCode = DRAINAGE.requireCode(normalizeDrainageLabel(drainage, sample));

  const shorelineBandInt =
    requireBoolean(shorelineBand, "shorelineBand") ||
    terrainCode === TERRAIN.requireCode("SHORELINE") ||
    terrainCode === TERRAIN.requireCode("BEACH")
      ? 1
      : 0;

  return Object.freeze({
    rainfallQ: quantizeUnsigned(rainfall, "rainfall"),
    runoffQ: quantizeUnsigned(runoff, "runoff"),
    freezeQ: quantizeUnsigned(freezePotential, "freezePotential"),
    meltQ: quantizeUnsigned(meltPotential, "meltPotential"),
    basinQ: quantizeUnsigned(basinStrength, "basinStrength"),
    slopeQ: quantizeUnsigned(slope, "slope"),
    elevationQ: quantizeSigned(elevation, "elevation"),
    temperatureQ: quantizeUnsigned(temperature, "temperature"),
    evaporationQ: quantizeUnsigned(evaporationPressure, "evaporationPressure"),
    waterDepthQ: quantizeUnsigned(waterDepth, "waterDepth"),

    shorelineBand: shorelineBandInt,

    terrainCode,
    biomeCode,
    surfaceCode,
    climateCode,
    drainageCode,

    enumRegistryVersion: ENUM_REGISTRY_VERSION,
    numericMode: NUMERIC_MODE
  });
}

function validateQuantizedSample(sample) {
  if (!isPlainObject(sample)) {
    throw new Error("QS5_MISSING_FIELD:quantizedSample");
  }

  const requiredIntFields = [
    "rainfallQ",
    "runoffQ",
    "freezeQ",
    "meltQ",
    "basinQ",
    "slopeQ",
    "elevationQ",
    "temperatureQ",
    "evaporationQ",
    "waterDepthQ",
    "shorelineBand",
    "terrainCode",
    "biomeCode",
    "surfaceCode",
    "climateCode",
    "drainageCode",
    "enumRegistryVersion"
  ];

  for (let i = 0; i < requiredIntFields.length; i += 1) {
    const key = requiredIntFields[i];
    requireInt32(sample[key], key);
  }

  if (sample.enumRegistryVersion !== ENUM_REGISTRY_VERSION) {
    throw new Error("ER1_ENUM_VERSION_MISMATCH");
  }

  if (sample.numericMode !== NUMERIC_MODE) {
    throw new Error("NUMERIC_MODE_MISMATCH");
  }

  if (!TERRAIN.isValidCode(sample.terrainCode)) {
    throw new Error("ER2_ENUM_INVALID_CODE:TERRAIN");
  }

  if (!SURFACE.isValidCode(sample.surfaceCode)) {
    throw new Error("ER2_ENUM_INVALID_CODE:SURFACE");
  }

  if (!BIOME.isValidCode(sample.biomeCode)) {
    throw new Error("ER2_ENUM_INVALID_CODE:BIOME");
  }

  if (!CLIMATE.isValidCode(sample.climateCode)) {
    throw new Error("ER2_ENUM_INVALID_CODE:CLIMATE");
  }

  if (!DRAINAGE.isValidCode(sample.drainageCode)) {
    throw new Error("ER2_ENUM_INVALID_CODE:DRAINAGE");
  }

  if (sample.shorelineBand !== 0 && sample.shorelineBand !== 1) {
    throw new Error("QS1_OUT_OF_RANGE_INPUT:shorelineBand");
  }

  return sample;
}

function isCanonicalQuantizedSample(sample) {
  try {
    validateQuantizedSample(sample);
    return true;
  } catch {
    return false;
  }
}

function isCanonicalQuantizedSampleGrid(sampleGrid) {
  if (!Array.isArray(sampleGrid) || sampleGrid.length === 0) {
    return false;
  }

  if (!Array.isArray(sampleGrid[0]) || sampleGrid[0].length === 0) {
    return false;
  }

  const width = sampleGrid[0].length;

  for (let y = 0; y < sampleGrid.length; y += 1) {
    if (!Array.isArray(sampleGrid[y]) || sampleGrid[y].length !== width) {
      return false;
    }

    for (let x = 0; x < sampleGrid[y].length; x += 1) {
      if (!isCanonicalQuantizedSample(sampleGrid[y][x])) {
        return false;
      }
    }
  }

  return true;
}

function buildQuantizedSampleGrid(sampleGrid) {
  if (!Array.isArray(sampleGrid) || sampleGrid.length === 0) {
    throw new Error("QS5_MISSING_FIELD:sampleGrid");
  }

  if (!Array.isArray(sampleGrid[0]) || sampleGrid[0].length === 0) {
    throw new Error("QS5_MISSING_FIELD:sampleGrid[0]");
  }

  const width = sampleGrid[0].length;

  return Object.freeze(
    sampleGrid.map((row, y) => {
      if (!Array.isArray(row) || row.length !== width) {
        throw new Error(`QS5_MISSING_FIELD:sampleGrid.row_${y}`);
      }

      return Object.freeze(
        row.map((sample, x) => {
          try {
            return buildQuantizedSample(sample);
          } catch (error) {
            throw new Error(`${error.message}:cell_${x}_${y}`);
          }
        })
      );
    })
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
    buildQuantizedSampleGrid,
    validateQuantizedSample,
    isCanonicalQuantizedSample,
    isCanonicalQuantizedSampleGrid
  });
}

const DEFAULT_QUANTIZED_SAMPLE_VIEW = createQuantizedSampleView();

export function quantizeSample(sample) {
  return DEFAULT_QUANTIZED_SAMPLE_VIEW.buildQuantizedSample(sample);
}

export function quantizeSampleGrid(sampleGrid) {
  return DEFAULT_QUANTIZED_SAMPLE_VIEW.buildQuantizedSampleGrid(sampleGrid);
}

export function validateQuantizedSample(sample) {
  return DEFAULT_QUANTIZED_SAMPLE_VIEW.validateQuantizedSample(sample);
}

export function isCanonicalQuantizedSample(sample) {
  return DEFAULT_QUANTIZED_SAMPLE_VIEW.isCanonicalQuantizedSample(sample);
}

export function isCanonicalQuantizedSampleGrid(sampleGrid) {
  return DEFAULT_QUANTIZED_SAMPLE_VIEW.isCanonicalQuantizedSampleGrid(sampleGrid);
}
