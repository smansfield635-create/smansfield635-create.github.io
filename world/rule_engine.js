import {
  WORLD_KERNEL,
  getStateRegistry,
  getRuleFamilyRegistry,
  getSimulationTickContract
} from "./world_kernel.js";
import { createQuantizedSampleView } from "./quantized_sample_view.js";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function isFiniteInteger(value) {
  return typeof value === "number" && Number.isInteger(value);
}

function clampInt(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value | 0;
}

function getPlanetDimensions() {
  const contract = normalizeObject(WORLD_KERNEL.planetField);
  return Object.freeze({
    width: Number.isInteger(contract.width) ? contract.width : 256,
    height: Number.isInteger(contract.height) ? contract.height : 256
  });
}

function getSampleGrid(input) {
  const rows = normalizeArray(input?.sampleGrid);
  return Array.isArray(rows[0]) ? rows : [];
}

function emptyCellState() {
  return Object.freeze({
    stateCode: 0,
    stateAge: 0
  });
}

function buildStateLookup() {
  const registry = getStateRegistry();
  const byName = normalizeObject(registry?.codesByName);
  const byCode = normalizeObject(registry?.byCode);

  function code(name, fallback = 0) {
    const value = byName[name];
    return Number.isInteger(value) ? value : fallback;
  }

  function familyFromCode(stateCode) {
    const entry = byCode[stateCode];
    return typeof entry?.family === "string" ? entry.family : "unknown";
  }

  return Object.freeze({
    code,
    familyFromCode
  });
}

function buildRuleLookup() {
  const families = getRuleFamilyRegistry();
  const precedence = normalizeArray(WORLD_KERNEL.ruleEngine?.precedence);
  return Object.freeze({
    families,
    precedence
  });
}

function createBuffer(width, height, fillFn) {
  return Object.freeze(
    Array.from({ length: height }, (_, y) =>
      Object.freeze(
        Array.from({ length: width }, (_, x) => fillFn(x, y))
      )
    )
  );
}

function cloneMutableBuffer(buffer) {
  return buffer.map((row) => row.map((cell) => ({
    stateCode: cell.stateCode,
    stateAge: cell.stateAge
  })));
}

function getCell(buffer, x, y) {
  if (y < 0 || y >= buffer.length) return null;
  const row = buffer[y];
  if (x < 0 || x >= row.length) return null;
  return row[x];
}

function getNeighbors(buffer, x, y) {
  return Object.freeze([
    getCell(buffer, x, y - 1),
    getCell(buffer, x + 1, y - 1),
    getCell(buffer, x + 1, y),
    getCell(buffer, x + 1, y + 1),
    getCell(buffer, x, y + 1),
    getCell(buffer, x - 1, y + 1),
    getCell(buffer, x - 1, y),
    getCell(buffer, x - 1, y - 1)
  ]);
}

function countNeighborFamily(neighbors, familyFromCode, familyName) {
  let total = 0;
  for (const neighbor of neighbors) {
    if (!neighbor) continue;
    if (familyFromCode(neighbor.stateCode) === familyName) total += 1;
  }
  return total;
}

function summarizeStateLattice(currentStateBuffer, previousStateBuffer, familyFromCode) {
  const summary = {
    sampleCount: 0,
    mutatedCount: 0,
    retainedCount: 0,
    blockedTransitionCount: 0,
    waterFamilyCount: 0,
    cryosphereFamilyCount: 0,
    substrateFamilyCount: 0,
    vegetationFamilyCount: 0,
    thermalReactiveFamilyCount: 0,
    civilizationFamilyCount: 0,
    metaEventFamilyCount: 0
  };

  for (let y = 0; y < currentStateBuffer.length; y += 1) {
    for (let x = 0; x < currentStateBuffer[y].length; x += 1) {
      const current = currentStateBuffer[y][x];
      const previous = previousStateBuffer ? previousStateBuffer[y][x] : null;
      const family = familyFromCode(current.stateCode);

      summary.sampleCount += 1;

      if (previous) {
        if (previous.stateCode !== current.stateCode) summary.mutatedCount += 1;
        else summary.retainedCount += 1;
      }

      if (family === "water_family") summary.waterFamilyCount += 1;
      else if (family === "cryosphere_family") summary.cryosphereFamilyCount += 1;
      else if (family === "substrate_family") summary.substrateFamilyCount += 1;
      else if (family === "vegetation_family") summary.vegetationFamilyCount += 1;
      else if (family === "thermal_reactive_family") summary.thermalReactiveFamilyCount += 1;
      else if (family === "civilization_family") summary.civilizationFamilyCount += 1;
      else if (family === "meta_event_family") summary.metaEventFamilyCount += 1;
    }
  }

  return Object.freeze(summary);
}

export function createRuleEngine() {
  const { width, height } = getPlanetDimensions();
  const tickContract = getSimulationTickContract();
  const lookup = buildStateLookup();
  const { precedence } = buildRuleLookup();
  const quantizedSampleView = createQuantizedSampleView();

  const registries = quantizedSampleView.registries;
  const terrain = registries.terrain;
  const surface = registries.surface;
  const biome = registries.biome;
  const climate = registries.climate;
  const drainage = registries.drainage;

  const TERRAIN = Object.freeze({
    UNKNOWN: terrain.requireCode("UNKNOWN", "ER2_ENUM_INVALID_CODE"),
    WATER: terrain.requireCode("WATER", "ER2_ENUM_INVALID_CODE"),
    SHELF: terrain.requireCode("SHELF", "ER2_ENUM_INVALID_CODE"),
    SHORELINE: terrain.requireCode("SHORELINE", "ER2_ENUM_INVALID_CODE"),
    BEACH: terrain.requireCode("BEACH", "ER2_ENUM_INVALID_CODE"),
    BASIN: terrain.requireCode("BASIN", "ER2_ENUM_INVALID_CODE"),
    POLAR_ICE: terrain.requireCode("POLAR_ICE", "ER2_ENUM_INVALID_CODE"),
    GLACIAL_HIGHLAND: terrain.requireCode("GLACIAL_HIGHLAND", "ER2_ENUM_INVALID_CODE")
  });

  const SURFACE = Object.freeze({
    UNKNOWN: surface.requireCode("UNKNOWN", "ER2_ENUM_INVALID_CODE"),
    BEDROCK: surface.requireCode("BEDROCK", "ER2_ENUM_INVALID_CODE"),
    GRAVEL: surface.requireCode("GRAVEL", "ER2_ENUM_INVALID_CODE"),
    SAND: surface.requireCode("SAND", "ER2_ENUM_INVALID_CODE"),
    SILT: surface.requireCode("SILT", "ER2_ENUM_INVALID_CODE"),
    CLAY: surface.requireCode("CLAY", "ER2_ENUM_INVALID_CODE"),
    ICE: surface.requireCode("ICE", "ER2_ENUM_INVALID_CODE"),
    SNOW: surface.requireCode("SNOW", "ER2_ENUM_INVALID_CODE")
  });

  const BIOME = Object.freeze({
    UNKNOWN: biome.requireCode("UNKNOWN", "ER2_ENUM_INVALID_CODE"),
    TROPICAL_RAINFOREST: biome.requireCode("TROPICAL_RAINFOREST", "ER2_ENUM_INVALID_CODE"),
    TEMPERATE_FOREST: biome.requireCode("TEMPERATE_FOREST", "ER2_ENUM_INVALID_CODE"),
    BOREAL_FOREST: biome.requireCode("BOREAL_FOREST", "ER2_ENUM_INVALID_CODE"),
    WETLAND: biome.requireCode("WETLAND", "ER2_ENUM_INVALID_CODE"),
    DESERT: biome.requireCode("DESERT", "ER2_ENUM_INVALID_CODE"),
    TUNDRA: biome.requireCode("TUNDRA", "ER2_ENUM_INVALID_CODE"),
    TROPICAL_GRASSLAND: biome.requireCode("TROPICAL_GRASSLAND", "ER2_ENUM_INVALID_CODE"),
    TEMPERATE_GRASSLAND: biome.requireCode("TEMPERATE_GRASSLAND", "ER2_ENUM_INVALID_CODE"),
    GLACIER: biome.requireCode("GLACIER", "ER2_ENUM_INVALID_CODE")
  });

  const CLIMATE = Object.freeze({
    UNKNOWN: climate.requireCode("UNKNOWN", "ER2_ENUM_INVALID_CODE"),
    SUBPOLAR: climate.requireCode("SUBPOLAR", "ER2_ENUM_INVALID_CODE"),
    POLAR: climate.requireCode("POLAR", "ER2_ENUM_INVALID_CODE")
  });

  const DRAINAGE = Object.freeze({
    UNKNOWN: drainage.requireCode("UNKNOWN", "ER2_ENUM_INVALID_CODE"),
    NONE: drainage.requireCode("NONE", "ER2_ENUM_INVALID_CODE")
  });

  function validateQuantizedSample(sample) {
    if (!sample || typeof sample !== "object" || Array.isArray(sample)) {
      const error = new Error("QS5_MISSING_FIELD:sample");
      error.code = "QS5_MISSING_FIELD";
      throw error;
    }

    const requiredNumeric = [
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

    for (const key of requiredNumeric) {
      if (!isFiniteInteger(sample[key])) {
        const error = new Error(`QS5_MISSING_FIELD:${key}`);
        error.code = "QS5_MISSING_FIELD";
        throw error;
      }
    }

    if (sample.enumRegistryVersion !== quantizedSampleView.enumRegistryVersion) {
      const error = new Error("ER1_ENUM_VERSION_MISMATCH");
      error.code = "ER1_ENUM_VERSION_MISMATCH";
      throw error;
    }

    if (sample.numericMode !== quantizedSampleView.numericMode) {
      const error = new Error("NUMERIC_MODE_MISMATCH");
      error.code = "NUMERIC_MODE_MISMATCH";
      throw error;
    }

    if (!terrain.isValidCode(sample.terrainCode)) {
      const error = new Error("ER2_ENUM_INVALID_CODE:TERRAIN");
      error.code = "ER2_ENUM_INVALID_CODE";
      throw error;
    }
    if (!surface.isValidCode(sample.surfaceCode)) {
      const error = new Error("ER2_ENUM_INVALID_CODE:SURFACE");
      error.code = "ER2_ENUM_INVALID_CODE";
      throw error;
    }
    if (!biome.isValidCode(sample.biomeCode)) {
      const error = new Error("ER2_ENUM_INVALID_CODE:BIOME");
      error.code = "ER2_ENUM_INVALID_CODE";
      throw error;
    }
    if (!climate.isValidCode(sample.climateCode)) {
      const error = new Error("ER2_ENUM_INVALID_CODE:CLIMATE");
      error.code = "ER2_ENUM_INVALID_CODE";
      throw error;
    }
    if (!drainage.isValidCode(sample.drainageCode)) {
      const error = new Error("ER2_ENUM_INVALID_CODE:DRAINAGE");
      error.code = "ER2_ENUM_INVALID_CODE";
      throw error;
    }

    return sample;
  }

  function getQuantizedSampleGrid(input) {
    if (Array.isArray(input?.quantizedSampleGrid) && Array.isArray(input.quantizedSampleGrid[0])) {
      return Object.freeze(
        input.quantizedSampleGrid.map((row) =>
          Object.freeze(row.map((sample) => validateQuantizedSample(sample)))
        )
      );
    }

    const sourceGrid = getSampleGrid(input);
    if (!sourceGrid.length) return Object.freeze([]);

    return quantizedSampleView.buildQuantizedSampleGrid(sourceGrid);
  }

  function nextAge(currentAge, changed) {
    if (changed) return 0;
    return clampInt((currentAge | 0) + 1, 0, 2147483647);
  }

  function seedStateFromQuantizedSample(sample) {
    validateQuantizedSample(sample);

    if (sample.terrainCode === TERRAIN.POLAR_ICE) {
      return Object.freeze({ stateCode: lookup.code("ICE_SHEET"), stateAge: 0 });
    }

    if (sample.terrainCode === TERRAIN.GLACIAL_HIGHLAND || sample.biomeCode === BIOME.GLACIER) {
      return Object.freeze({ stateCode: lookup.code("GLACIER_STABLE"), stateAge: 0 });
    }

    if (sample.terrainCode === TERRAIN.WATER) {
      if (sample.waterDepthQ >= 3000) return Object.freeze({ stateCode: lookup.code("WATER_TRENCH"), stateAge: 0 });
      if (sample.waterDepthQ >= 1800) return Object.freeze({ stateCode: lookup.code("WATER_ABYSS"), stateAge: 0 });
      if (sample.waterDepthQ >= 800) return Object.freeze({ stateCode: lookup.code("WATER_SLOPE"), stateAge: 0 });
      return Object.freeze({ stateCode: lookup.code("WATER_STILL_DEEP"), stateAge: 0 });
    }

    if (sample.terrainCode === TERRAIN.SHELF) {
      return Object.freeze({ stateCode: lookup.code("WATER_SHELF"), stateAge: 0 });
    }

    if (sample.terrainCode === TERRAIN.BASIN && sample.basinQ >= 1800 && sample.rainfallQ >= 3000) {
      return Object.freeze({ stateCode: lookup.code("WATER_BASIN_RETAINED"), stateAge: 0 });
    }

    if (sample.surfaceCode === SURFACE.ICE) {
      return Object.freeze({ stateCode: lookup.code("ICE_PACK"), stateAge: 0 });
    }

    if (sample.surfaceCode === SURFACE.SNOW) {
      return Object.freeze({ stateCode: lookup.code("SNOW_DENSE"), stateAge: 0 });
    }

    if (sample.surfaceCode === SURFACE.BEDROCK) {
      return Object.freeze({ stateCode: lookup.code("BEDROCK_EXPOSED"), stateAge: 0 });
    }

    if (sample.surfaceCode === SURFACE.GRAVEL) {
      return Object.freeze({ stateCode: lookup.code("GRAVEL_LOOSE"), stateAge: 0 });
    }

    if (sample.surfaceCode === SURFACE.SAND) {
      return Object.freeze({
        stateCode: lookup.code(sample.shorelineBand === 1 ? "SAND_WET" : "SAND_DRY"),
        stateAge: 0
      });
    }

    if (sample.surfaceCode === SURFACE.SILT) {
      return Object.freeze({
        stateCode: lookup.code(sample.rainfallQ >= 3500 ? "SILT_WET" : "SILT_DRY"),
        stateAge: 0
      });
    }

    if (sample.surfaceCode === SURFACE.CLAY) {
      return Object.freeze({
        stateCode: lookup.code(sample.runoffQ >= 2800 ? "CLAY_WET" : "CLAY_DRY"),
        stateAge: 0
      });
    }

    if (sample.biomeCode === BIOME.TROPICAL_RAINFOREST) {
      return Object.freeze({ stateCode: lookup.code("RAINFOREST_TROPICAL"), stateAge: 0 });
    }

    if (sample.biomeCode === BIOME.TEMPERATE_FOREST) {
      return Object.freeze({ stateCode: lookup.code("FOREST_TEMPERATE"), stateAge: 0 });
    }

    if (sample.biomeCode === BIOME.BOREAL_FOREST) {
      return Object.freeze({ stateCode: lookup.code("FOREST_BOREAL"), stateAge: 0 });
    }

    if (sample.biomeCode === BIOME.WETLAND) {
      return Object.freeze({ stateCode: lookup.code("WETLAND_REED"), stateAge: 0 });
    }

    if (sample.biomeCode === BIOME.DESERT) {
      return Object.freeze({ stateCode: lookup.code("DESERT_SCRUB"), stateAge: 0 });
    }

    if (sample.biomeCode === BIOME.TUNDRA) {
      return Object.freeze({ stateCode: lookup.code("TUNDRA_MOSS"), stateAge: 0 });
    }

    if (sample.biomeCode === BIOME.TROPICAL_GRASSLAND) {
      return Object.freeze({ stateCode: lookup.code("GRASSLAND_TROPICAL"), stateAge: 0 });
    }

    if (sample.biomeCode === BIOME.TEMPERATE_GRASSLAND) {
      return Object.freeze({ stateCode: lookup.code("GRASSLAND_TEMPERATE"), stateAge: 0 });
    }

    if (sample.freezeQ >= 7200 && sample.meltQ <= 1800) {
      return Object.freeze({ stateCode: lookup.code("FROST_HEAVY"), stateAge: 0 });
    }

    if (sample.runoffQ >= 3200) {
      return Object.freeze({ stateCode: lookup.code("SOIL_MOIST"), stateAge: 0 });
    }

    return Object.freeze({ stateCode: lookup.code("SOIL_DRY"), stateAge: 0 });
  }

  function freezeMeltTransition(sample, currentCell, neighbors) {
    const currentFamily = lookup.familyFromCode(currentCell.stateCode);
    const waterNeighborCount = countNeighborFamily(neighbors, lookup.familyFromCode, "water_family");
    const cryoNeighborCount = countNeighborFamily(neighbors, lookup.familyFromCode, "cryosphere_family");

    if (
      (currentFamily === "water_family" || currentFamily === "substrate_family") &&
      sample.freezeQ >= 7800 &&
      sample.meltQ <= 1800 &&
      (sample.climateCode === CLIMATE.POLAR || sample.climateCode === CLIMATE.SUBPOLAR || sample.elevationQ >= 2200)
    ) {
      const nextStateCode =
        waterNeighborCount > 2
          ? lookup.code("ICE_PACK")
          : lookup.code("FROST_HEAVY");

      return Object.freeze({
        changed: nextStateCode !== currentCell.stateCode,
        ruleFamily: "FREEZE_MELT",
        admissible: true,
        nextStateCode
      });
    }

    if (
      currentFamily === "cryosphere_family" &&
      sample.meltQ >= 6200 &&
      sample.temperatureQ >= 4200
    ) {
      const nextStateCode =
        cryoNeighborCount > 3
          ? lookup.code("SLUSH")
          : lookup.code("WATER_GLACIAL_RUNOFF");

      return Object.freeze({
        changed: nextStateCode !== currentCell.stateCode,
        ruleFamily: "FREEZE_MELT",
        admissible: true,
        nextStateCode
      });
    }

    return Object.freeze({
      changed: false,
      ruleFamily: "FREEZE_MELT",
      admissible: false,
      nextStateCode: currentCell.stateCode
    });
  }

  function waterRetentionSpreadTransition(sample, currentCell, neighbors) {
    const currentFamily = lookup.familyFromCode(currentCell.stateCode);
    const waterNeighborCount = countNeighborFamily(neighbors, lookup.familyFromCode, "water_family");

    if (currentFamily === "water_family") {
      if (sample.basinQ >= 1800 && sample.slopeQ <= 1600) {
        return Object.freeze({
          changed: currentCell.stateCode !== lookup.code("WATER_BASIN_RETAINED"),
          ruleFamily: "WATER_RETENTION_SPREAD",
          admissible: true,
          nextStateCode: lookup.code("WATER_BASIN_RETAINED")
        });
      }

      if ((sample.slopeQ >= 1800 || sample.drainageCode !== DRAINAGE.NONE) && sample.runoffQ >= 2600) {
        return Object.freeze({
          changed: currentCell.stateCode !== lookup.code("WATER_FLOWING_STRONG"),
          ruleFamily: "WATER_RETENTION_SPREAD",
          admissible: true,
          nextStateCode: lookup.code("WATER_FLOWING_STRONG")
        });
      }

      if (sample.slopeQ >= 1000 || sample.runoffQ >= 1800) {
        return Object.freeze({
          changed: currentCell.stateCode !== lookup.code("WATER_FLOWING_WEAK"),
          ruleFamily: "WATER_RETENTION_SPREAD",
          admissible: true,
          nextStateCode: lookup.code("WATER_FLOWING_WEAK")
        });
      }
    }

    if (
      currentFamily === "substrate_family" &&
      waterNeighborCount >= 2 &&
      sample.rainfallQ >= 2400 &&
      sample.slopeQ <= 2600
    ) {
      return Object.freeze({
        changed: currentCell.stateCode !== lookup.code("WATER_SEEPING"),
        ruleFamily: "WATER_RETENTION_SPREAD",
        admissible: true,
        nextStateCode: lookup.code("WATER_SEEPING")
      });
    }

    return Object.freeze({
      changed: false,
      ruleFamily: "WATER_RETENTION_SPREAD",
      admissible: false,
      nextStateCode: currentCell.stateCode
    });
  }

  function wettingDryingTransition(sample, currentCell, neighbors) {
    const currentFamily = lookup.familyFromCode(currentCell.stateCode);
    const waterNeighborCount = countNeighborFamily(neighbors, lookup.familyFromCode, "water_family");

    if (currentFamily !== "substrate_family") {
      return Object.freeze({
        changed: false,
        ruleFamily: "WETTING_DRYING",
        admissible: false,
        nextStateCode: currentCell.stateCode
      });
    }

    if (
      (waterNeighborCount >= 1 || sample.shorelineBand === 1 || sample.rainfallQ >= 3400 || sample.basinQ >= 3000) &&
      sample.evaporationQ <= 6200
    ) {
      if (currentCell.stateCode === lookup.code("SOIL_DRY")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: lookup.code("SOIL_MOIST")
        });
      }

      if (currentCell.stateCode === lookup.code("SOIL_MOIST") && (waterNeighborCount >= 2 || sample.basinQ >= 4200)) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: lookup.code("SOIL_SATURATED")
        });
      }

      if (currentCell.stateCode === lookup.code("SAND_DRY")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: lookup.code("SAND_WET")
        });
      }

      if (currentCell.stateCode === lookup.code("SILT_DRY")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: lookup.code("SILT_WET")
        });
      }

      if (currentCell.stateCode === lookup.code("CLAY_DRY")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: lookup.code("CLAY_WET")
        });
      }
    }

    if (
      sample.evaporationQ >= 6800 &&
      sample.rainfallQ <= 1800 &&
      sample.runoffQ <= 1800 &&
      waterNeighborCount === 0
    ) {
      if (currentCell.stateCode === lookup.code("SOIL_SATURATED")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: lookup.code("SOIL_MOIST")
        });
      }

      if (currentCell.stateCode === lookup.code("SOIL_MOIST")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: lookup.code("SOIL_DRY")
        });
      }

      if (currentCell.stateCode === lookup.code("SAND_WET")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: lookup.code("SAND_DRY")
        });
      }

      if (currentCell.stateCode === lookup.code("SILT_WET")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: lookup.code("SILT_DRY")
        });
      }

      if (currentCell.stateCode === lookup.code("CLAY_WET")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: lookup.code("CLAY_DRY")
        });
      }
    }

    return Object.freeze({
      changed: false,
      ruleFamily: "WETTING_DRYING",
      admissible: false,
      nextStateCode: currentCell.stateCode
    });
  }

  function seedStateBuffer(inputGrid) {
    const quantizedGrid =
      Array.isArray(inputGrid) && Array.isArray(inputGrid[0]) && isFiniteInteger(inputGrid[0][0]?.terrainCode)
        ? inputGrid
        : quantizedSampleView.buildQuantizedSampleGrid(inputGrid);

    if (!quantizedGrid.length) {
      return createBuffer(width, height, () => emptyCellState());
    }

    return createBuffer(width, height, (x, y) => {
      const sample = quantizedGrid[y]?.[x] ?? null;
      return sample ? seedStateFromQuantizedSample(sample) : emptyCellState();
    });
  }

  function stepStateLattice(input = {}) {
    const quantizedSampleGrid = getQuantizedSampleGrid(input);
    const currentStateBufferInput = normalizeArray(input.currentStateBuffer);
    const tickIndex = Number.isInteger(input.tickIndex) ? input.tickIndex : 0;
    const activeRuleFamilies = normalizeArray(input.activeRuleFamilies).length
      ? normalizeArray(input.activeRuleFamilies)
      : tickContract.firstRuleFamilies;

    const currentStateBuffer =
      currentStateBufferInput.length && Array.isArray(currentStateBufferInput[0])
        ? currentStateBufferInput
        : seedStateBuffer(quantizedSampleGrid);

    const nextStateBufferMutable = cloneMutableBuffer(currentStateBuffer);

    const transitionCounts = {
      FREEZE_MELT: 0,
      WATER_RETENTION_SPREAD: 0,
      WETTING_DRYING: 0
    };

    let admissibleCount = 0;
    let blockedTransitionCount = 0;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const sample = validateQuantizedSample(quantizedSampleGrid[y]?.[x] ?? {});
        const currentCell = currentStateBuffer[y]?.[x] ?? emptyCellState();
        const neighbors = getNeighbors(currentStateBuffer, x, y);

        let nextStateCode = currentCell.stateCode;
        let transitionAdmissible = false;

        for (const ruleFamily of precedence) {
          if (!activeRuleFamilies.includes(ruleFamily)) continue;

          let result = null;

          if (ruleFamily === "FREEZE_MELT") {
            result = freezeMeltTransition(sample, currentCell, neighbors);
          } else if (ruleFamily === "WATER_RETENTION_SPREAD") {
            result = waterRetentionSpreadTransition(sample, currentCell, neighbors);
          } else if (ruleFamily === "WETTING_DRYING") {
            result = wettingDryingTransition(sample, currentCell, neighbors);
          }

          if (result?.admissible === true) {
            nextStateCode = result.nextStateCode;
            transitionAdmissible = true;
            transitionCounts[result.ruleFamily] += result.changed ? 1 : 0;
            admissibleCount += 1;
            break;
          }
        }

        if (!transitionAdmissible) {
          blockedTransitionCount += 1;
        }

        const changed = nextStateCode !== currentCell.stateCode;
        nextStateBufferMutable[y][x] = {
          stateCode: nextStateCode,
          stateAge: nextAge(currentCell.stateAge, changed)
        };
      }
    }

    const nextStateBuffer = Object.freeze(
      nextStateBufferMutable.map((row) =>
        Object.freeze(row.map((cell) => Object.freeze(cell)))
      )
    );

    const stateSummary = summarizeStateLattice(
      nextStateBuffer,
      currentStateBuffer,
      lookup.familyFromCode
    );

    const transitionSummary = Object.freeze({
      tickIndex,
      activeRuleFamilies: Object.freeze([...activeRuleFamilies]),
      admissibleCount,
      blockedTransitionCount,
      transitionCounts: Object.freeze({
        FREEZE_MELT: transitionCounts.FREEZE_MELT,
        WATER_RETENTION_SPREAD: transitionCounts.WATER_RETENTION_SPREAD,
        WETTING_DRYING: transitionCounts.WETTING_DRYING
      }),
      enumRegistryVersion: quantizedSampleView.enumRegistryVersion,
      numericMode: quantizedSampleView.numericMode
    });

    return Object.freeze({
      quantizedSampleGrid,
      currentStateBuffer,
      nextStateBuffer,
      transitionSummary,
      stateSummary
    });
  }

  return Object.freeze({
    seedStateFromSample(sample) {
      return seedStateFromQuantizedSample(quantizedSampleView.buildQuantizedSample(sample));
    },
    seedStateFromQuantizedSample,
    seedStateBuffer,
    stepStateLattice,
    summarizeStateLattice(stateBuffer, previousStateBuffer = null) {
      return summarizeStateLattice(stateBuffer, previousStateBuffer, lookup.familyFromCode);
    }
  });
}

const DEFAULT_RULE_ENGINE = createRuleEngine();

export function seedStateFromSample(sample) {
  return DEFAULT_RULE_ENGINE.seedStateFromSample(sample);
}

export function seedStateBuffer(sampleGridOrQuantizedGrid) {
  return DEFAULT_RULE_ENGINE.seedStateBuffer(sampleGridOrQuantizedGrid);
}

export function stepStateLattice(input = {}) {
  return DEFAULT_RULE_ENGINE.stepStateLattice(input);
}

export function summarizeStateLattice(stateBuffer, previousStateBuffer = null) {
  return DEFAULT_RULE_ENGINE.summarizeStateLattice(stateBuffer, previousStateBuffer);
}
