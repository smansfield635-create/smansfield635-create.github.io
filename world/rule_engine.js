import {
  WORLD_KERNEL,
  getStateRegistry,
  getRuleFamilyRegistry,
  getSimulationTickContract
} from "./world_kernel.js";
import {
  createQuantizedSampleView,
  isCanonicalQuantizedSampleGrid
} from "./quantized_sample_view.js";

const STAGE_1_BOUNDARY_MODE = "LOCAL_PATCH_HARD_EDGE";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireInt32(value, fieldName) {
  if (!Number.isInteger(value)) {
    throw new Error(`RULE_ENGINE_INVALID_INT32:${fieldName}`);
  }
  if (value < -2147483648 || value > 2147483647) {
    throw new Error(`RULE_ENGINE_INT32_OUT_OF_RANGE:${fieldName}`);
  }
  return value;
}

function clampInt32(value, min, max, fieldName) {
  const int32 = requireInt32(value, fieldName);
  if (int32 < min) return min;
  if (int32 > max) return max;
  return int32;
}

function requireArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new Error(`RULE_ENGINE_INVALID_ARRAY:${fieldName}`);
  }
  return value;
}

function buildStateLookup() {
  const registry = getStateRegistry();
  const codesByName = isPlainObject(registry?.codesByName) ? registry.codesByName : null;
  const byCode = isPlainObject(registry?.byCode) ? registry.byCode : null;

  if (!codesByName || !byCode) {
    throw new Error("RULE_ENGINE_STATE_REGISTRY_INVALID");
  }

  function requireStateCode(name) {
    if (typeof name !== "string" || name.length === 0) {
      throw new Error("RULE_ENGINE_STATE_LOOKUP_INVALID_NAME");
    }

    const code = codesByName[name];
    if (!Number.isInteger(code)) {
      throw new Error(`RULE_ENGINE_STATE_LOOKUP_MISSING:${name}`);
    }

    return requireInt32(code, `stateCode:${name}`);
  }

  function getStateEntry(stateCode) {
    const code = requireInt32(stateCode, "getStateEntry.stateCode");
    const entry = byCode[code];
    if (!isPlainObject(entry)) {
      throw new Error(`RULE_ENGINE_INVALID_STATE_CODE:${code}`);
    }
    return entry;
  }

  function familyFromCode(stateCode) {
    return getStateEntry(stateCode).family;
  }

  return Object.freeze({
    requireStateCode,
    getStateEntry,
    familyFromCode
  });
}

function buildRuleLookup() {
  const families = getRuleFamilyRegistry();
  const precedence = requireArray(WORLD_KERNEL?.ruleEngine?.precedence, "WORLD_KERNEL.ruleEngine.precedence");

  if (!isPlainObject(families)) {
    throw new Error("RULE_ENGINE_FAMILY_REGISTRY_INVALID");
  }

  for (let i = 0; i < precedence.length; i += 1) {
    const familyName = precedence[i];
    if (!isPlainObject(families[familyName])) {
      throw new Error(`RULE_ENGINE_PRECEDENCE_FAMILY_MISSING:${familyName}`);
    }
  }

  return Object.freeze({
    families,
    precedence: Object.freeze([...precedence])
  });
}

function getPlanetDimensions() {
  const contract = isPlainObject(WORLD_KERNEL?.planetField) ? WORLD_KERNEL.planetField : null;
  if (!contract) {
    throw new Error("RULE_ENGINE_PLANET_FIELD_CONTRACT_INVALID");
  }

  return Object.freeze({
    width: Number.isInteger(contract.width) ? contract.width : 256,
    height: Number.isInteger(contract.height) ? contract.height : 256
  });
}

function emptyCellState() {
  return Object.freeze({
    stateCode: 0,
    stateAge: 0
  });
}

function createFrozenStateCell(stateCode, stateAge) {
  return Object.freeze({
    stateCode: requireInt32(stateCode, "stateCode"),
    stateAge: clampInt32(stateAge, 0, 2147483647, "stateAge")
  });
}

function validateStateCell(cell, fieldName) {
  if (!isPlainObject(cell)) {
    throw new Error(`RULE_ENGINE_INVALID_STATE_CELL:${fieldName}`);
  }

  requireInt32(cell.stateCode, `${fieldName}.stateCode`);
  requireInt32(cell.stateAge, `${fieldName}.stateAge`);

  return cell;
}

function validateStateBuffer(stateBuffer, width, height) {
  const rows = requireArray(stateBuffer, "stateBuffer");

  if (rows.length !== height) {
    throw new Error("RULE_ENGINE_STATE_BUFFER_HEIGHT_MISMATCH");
  }

  for (let y = 0; y < rows.length; y += 1) {
    const row = requireArray(rows[y], `stateBuffer[${y}]`);
    if (row.length !== width) {
      throw new Error(`RULE_ENGINE_STATE_BUFFER_WIDTH_MISMATCH:${y}`);
    }

    for (let x = 0; x < row.length; x += 1) {
      validateStateCell(row[x], `stateBuffer[${y}][${x}]`);
    }
  }

  return stateBuffer;
}

function cloneMutableBuffer(buffer) {
  return buffer.map((row) =>
    row.map((cell) => ({
      stateCode: cell.stateCode,
      stateAge: cell.stateAge
    }))
  );
}

function getCell(buffer, x, y) {
  if (STAGE_1_BOUNDARY_MODE !== "LOCAL_PATCH_HARD_EDGE") {
    throw new Error("RULE_ENGINE_BOUNDARY_MODE_INVALID");
  }

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

  for (let i = 0; i < neighbors.length; i += 1) {
    const neighbor = neighbors[i];
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
  const stateLookup = buildStateLookup();
  const { precedence } = buildRuleLookup();
  const quantizedSampleView = createQuantizedSampleView();

  const registries = quantizedSampleView.registries;
  const terrain = registries.terrain;
  const surface = registries.surface;
  const biome = registries.biome;
  const climate = registries.climate;
  const drainage = registries.drainage;

  const TERRAIN = Object.freeze({
    UNKNOWN: terrain.requireCode("UNKNOWN"),
    WATER: terrain.requireCode("WATER"),
    SHELF: terrain.requireCode("SHELF"),
    SHORELINE: terrain.requireCode("SHORELINE"),
    BEACH: terrain.requireCode("BEACH"),
    BASIN: terrain.requireCode("BASIN"),
    POLAR_ICE: terrain.requireCode("POLAR_ICE"),
    GLACIAL_HIGHLAND: terrain.requireCode("GLACIAL_HIGHLAND")
  });

  const SURFACE = Object.freeze({
    UNKNOWN: surface.requireCode("UNKNOWN"),
    NONE: surface.requireCode("NONE"),
    BEDROCK: surface.requireCode("BEDROCK"),
    GRAVEL: surface.requireCode("GRAVEL"),
    SAND: surface.requireCode("SAND"),
    SILT: surface.requireCode("SILT"),
    CLAY: surface.requireCode("CLAY"),
    SOIL: surface.requireCode("SOIL"),
    ICE: surface.requireCode("ICE"),
    SNOW: surface.requireCode("SNOW")
  });

  const BIOME = Object.freeze({
    UNKNOWN: biome.requireCode("UNKNOWN"),
    NONE: biome.requireCode("NONE"),
    TROPICAL_RAINFOREST: biome.requireCode("TROPICAL_RAINFOREST"),
    TEMPERATE_FOREST: biome.requireCode("TEMPERATE_FOREST"),
    BOREAL_FOREST: biome.requireCode("BOREAL_FOREST"),
    WETLAND: biome.requireCode("WETLAND"),
    DESERT: biome.requireCode("DESERT"),
    TUNDRA: biome.requireCode("TUNDRA"),
    TROPICAL_GRASSLAND: biome.requireCode("TROPICAL_GRASSLAND"),
    TEMPERATE_GRASSLAND: biome.requireCode("TEMPERATE_GRASSLAND"),
    GLACIER: biome.requireCode("GLACIER")
  });

  const CLIMATE = Object.freeze({
    UNKNOWN: climate.requireCode("UNKNOWN"),
    EQUATORIAL: climate.requireCode("EQUATORIAL"),
    TROPICAL: climate.requireCode("TROPICAL"),
    TEMPERATE: climate.requireCode("TEMPERATE"),
    SUBPOLAR: climate.requireCode("SUBPOLAR"),
    POLAR: climate.requireCode("POLAR")
  });

  const DRAINAGE = Object.freeze({
    UNKNOWN: drainage.requireCode("UNKNOWN"),
    NONE: drainage.requireCode("NONE"),
    CLOSED_BASIN: drainage.requireCode("CLOSED_BASIN"),
    OPEN_FLOW: drainage.requireCode("OPEN_FLOW"),
    RIVER_ACTIVE: drainage.requireCode("RIVER_ACTIVE"),
    FLOODPLAIN: drainage.requireCode("FLOODPLAIN"),
    WETLAND_DRAIN: drainage.requireCode("WETLAND_DRAIN")
  });

  function validateQuantizedSample(sample) {
    return quantizedSampleView.validateQuantizedSample(sample);
  }

  function getQuantizedSampleGrid(input) {
    if (isCanonicalQuantizedSampleGrid(input?.quantizedSampleGrid)) {
      return input.quantizedSampleGrid;
    }

    const sourceGrid = input?.sampleGrid;
    if (!Array.isArray(sourceGrid) || sourceGrid.length === 0) {
      throw new Error("RULE_ENGINE_SAMPLE_GRID_MISSING");
    }

    return quantizedSampleView.buildQuantizedSampleGrid(sourceGrid);
  }

  function nextAge(currentAge, changed) {
    if (changed) return 0;
    return clampInt32(currentAge + 1, 0, 2147483647, "nextAge");
  }

  function seedStateFromQuantizedSample(sample) {
    validateQuantizedSample(sample);

    if (sample.terrainCode === TERRAIN.POLAR_ICE) {
      return createFrozenStateCell(stateLookup.requireStateCode("ICE_SHEET"), 0);
    }

    if (sample.terrainCode === TERRAIN.GLACIAL_HIGHLAND || sample.biomeCode === BIOME.GLACIER) {
      return createFrozenStateCell(stateLookup.requireStateCode("GLACIER_STABLE"), 0);
    }

    if (sample.terrainCode === TERRAIN.WATER) {
      if (sample.waterDepthQ >= 3000) {
        return createFrozenStateCell(stateLookup.requireStateCode("WATER_TRENCH"), 0);
      }
      if (sample.waterDepthQ >= 1800) {
        return createFrozenStateCell(stateLookup.requireStateCode("WATER_ABYSS"), 0);
      }
      if (sample.waterDepthQ >= 800) {
        return createFrozenStateCell(stateLookup.requireStateCode("WATER_SLOPE"), 0);
      }
      return createFrozenStateCell(stateLookup.requireStateCode("WATER_STILL_DEEP"), 0);
    }

    if (sample.terrainCode === TERRAIN.SHELF) {
      return createFrozenStateCell(stateLookup.requireStateCode("WATER_SHELF"), 0);
    }

    if (sample.terrainCode === TERRAIN.BASIN && sample.basinQ >= 1800 && sample.rainfallQ >= 3000) {
      return createFrozenStateCell(stateLookup.requireStateCode("WATER_BASIN_RETAINED"), 0);
    }

    if (sample.surfaceCode === SURFACE.ICE) {
      return createFrozenStateCell(stateLookup.requireStateCode("ICE_PACK"), 0);
    }

    if (sample.surfaceCode === SURFACE.SNOW) {
      return createFrozenStateCell(stateLookup.requireStateCode("SNOW_DENSE"), 0);
    }

    if (sample.surfaceCode === SURFACE.BEDROCK) {
      return createFrozenStateCell(stateLookup.requireStateCode("BEDROCK_EXPOSED"), 0);
    }

    if (sample.surfaceCode === SURFACE.GRAVEL) {
      return createFrozenStateCell(stateLookup.requireStateCode("GRAVEL_LOOSE"), 0);
    }

    if (sample.surfaceCode === SURFACE.SAND) {
      return createFrozenStateCell(
        stateLookup.requireStateCode(sample.shorelineBand === 1 ? "SAND_WET" : "SAND_DRY"),
        0
      );
    }

    if (sample.surfaceCode === SURFACE.SILT) {
      return createFrozenStateCell(
        stateLookup.requireStateCode(sample.rainfallQ >= 3500 ? "SILT_WET" : "SILT_DRY"),
        0
      );
    }

    if (sample.surfaceCode === SURFACE.CLAY) {
      return createFrozenStateCell(
        stateLookup.requireStateCode(sample.runoffQ >= 2800 ? "CLAY_WET" : "CLAY_DRY"),
        0
      );
    }

    if (sample.surfaceCode === SURFACE.SOIL) {
      if (sample.biomeCode === BIOME.TROPICAL_RAINFOREST) {
        return createFrozenStateCell(stateLookup.requireStateCode("RAINFOREST_TROPICAL"), 0);
      }

      if (sample.biomeCode === BIOME.TEMPERATE_FOREST) {
        return createFrozenStateCell(stateLookup.requireStateCode("FOREST_TEMPERATE"), 0);
      }

      if (sample.biomeCode === BIOME.BOREAL_FOREST) {
        return createFrozenStateCell(stateLookup.requireStateCode("FOREST_BOREAL"), 0);
      }

      if (sample.biomeCode === BIOME.WETLAND) {
        return createFrozenStateCell(stateLookup.requireStateCode("WETLAND_REED"), 0);
      }

      if (sample.biomeCode === BIOME.DESERT) {
        return createFrozenStateCell(stateLookup.requireStateCode("DESERT_SCRUB"), 0);
      }

      if (sample.biomeCode === BIOME.TUNDRA) {
        return createFrozenStateCell(stateLookup.requireStateCode("TUNDRA_MOSS"), 0);
      }

      if (sample.biomeCode === BIOME.TROPICAL_GRASSLAND) {
        return createFrozenStateCell(stateLookup.requireStateCode("GRASSLAND_TROPICAL"), 0);
      }

      if (sample.biomeCode === BIOME.TEMPERATE_GRASSLAND) {
        return createFrozenStateCell(stateLookup.requireStateCode("GRASSLAND_TEMPERATE"), 0);
      }
    }

    if (sample.freezeQ >= 7200 && sample.meltQ <= 1800) {
      return createFrozenStateCell(stateLookup.requireStateCode("FROST_HEAVY"), 0);
    }

    if (sample.runoffQ >= 3200) {
      return createFrozenStateCell(stateLookup.requireStateCode("SOIL_MOIST"), 0);
    }

    return createFrozenStateCell(stateLookup.requireStateCode("SOIL_DRY"), 0);
  }

  function seedStateBuffer(sampleGridOrQuantizedGrid) {
    const quantizedGrid = isCanonicalQuantizedSampleGrid(sampleGridOrQuantizedGrid)
      ? sampleGridOrQuantizedGrid
      : quantizedSampleView.buildQuantizedSampleGrid(sampleGridOrQuantizedGrid);

    if (quantizedGrid.length !== height) {
      throw new Error("RULE_ENGINE_GRID_HEIGHT_MISMATCH");
    }

    if (!Array.isArray(quantizedGrid[0]) || quantizedGrid[0].length !== width) {
      throw new Error("RULE_ENGINE_GRID_WIDTH_MISMATCH");
    }

    return Object.freeze(
      quantizedGrid.map((row, y) => {
        if (!Array.isArray(row) || row.length !== width) {
          throw new Error(`RULE_ENGINE_GRID_WIDTH_MISMATCH:${y}`);
        }

        return Object.freeze(
          row.map((sample, x) => {
            validateQuantizedSample(sample);
            return seedStateFromQuantizedSample(sample);
          })
        );
      })
    );
  }

  function freezeMeltTransition(sample, currentCell, neighbors) {
    const currentFamily = stateLookup.familyFromCode(currentCell.stateCode);
    const waterNeighborCount = countNeighborFamily(neighbors, stateLookup.familyFromCode, "water_family");
    const cryoNeighborCount = countNeighborFamily(neighbors, stateLookup.familyFromCode, "cryosphere_family");

    if (
      (currentFamily === "water_family" || currentFamily === "substrate_family") &&
      sample.freezeQ >= 7800 &&
      sample.meltQ <= 1800 &&
      (
        sample.climateCode === CLIMATE.POLAR ||
        sample.climateCode === CLIMATE.SUBPOLAR ||
        sample.elevationQ >= 2200
      )
    ) {
      const nextStateCode =
        waterNeighborCount > 2
          ? stateLookup.requireStateCode("ICE_PACK")
          : stateLookup.requireStateCode("FROST_HEAVY");

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
          ? stateLookup.requireStateCode("SLUSH")
          : stateLookup.requireStateCode("WATER_GLACIAL_RUNOFF");

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
    const currentFamily = stateLookup.familyFromCode(currentCell.stateCode);
    const waterNeighborCount = countNeighborFamily(neighbors, stateLookup.familyFromCode, "water_family");

    if (currentFamily === "water_family") {
      if (sample.basinQ >= 1800 && sample.slopeQ <= 1600) {
        const nextStateCode = stateLookup.requireStateCode("WATER_BASIN_RETAINED");
        return Object.freeze({
          changed: currentCell.stateCode !== nextStateCode,
          ruleFamily: "WATER_RETENTION_SPREAD",
          admissible: true,
          nextStateCode
        });
      }

      if (
        (sample.slopeQ >= 1800 || sample.drainageCode !== DRAINAGE.NONE) &&
        sample.runoffQ >= 2600
      ) {
        const nextStateCode = stateLookup.requireStateCode("WATER_FLOWING_STRONG");
        return Object.freeze({
          changed: currentCell.stateCode !== nextStateCode,
          ruleFamily: "WATER_RETENTION_SPREAD",
          admissible: true,
          nextStateCode
        });
      }

      if (sample.slopeQ >= 1000 || sample.runoffQ >= 1800) {
        const nextStateCode = stateLookup.requireStateCode("WATER_FLOWING_WEAK");
        return Object.freeze({
          changed: currentCell.stateCode !== nextStateCode,
          ruleFamily: "WATER_RETENTION_SPREAD",
          admissible: true,
          nextStateCode
        });
      }
    }

    if (
      currentFamily === "substrate_family" &&
      waterNeighborCount >= 2 &&
      sample.rainfallQ >= 2400 &&
      sample.slopeQ <= 2600
    ) {
      const nextStateCode = stateLookup.requireStateCode("WATER_SEEPING");
      return Object.freeze({
        changed: currentCell.stateCode !== nextStateCode,
        ruleFamily: "WATER_RETENTION_SPREAD",
        admissible: true,
        nextStateCode
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
    const currentFamily = stateLookup.familyFromCode(currentCell.stateCode);
    const waterNeighborCount = countNeighborFamily(neighbors, stateLookup.familyFromCode, "water_family");

    if (currentFamily !== "substrate_family") {
      return Object.freeze({
        changed: false,
        ruleFamily: "WETTING_DRYING",
        admissible: false,
        nextStateCode: currentCell.stateCode
      });
    }

    if (
      (
        waterNeighborCount >= 1 ||
        sample.shorelineBand === 1 ||
        sample.rainfallQ >= 3400 ||
        sample.basinQ >= 3000
      ) &&
      sample.evaporationQ <= 6200
    ) {
      if (currentCell.stateCode === stateLookup.requireStateCode("SOIL_DRY")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: stateLookup.requireStateCode("SOIL_MOIST")
        });
      }

      if (
        currentCell.stateCode === stateLookup.requireStateCode("SOIL_MOIST") &&
        (waterNeighborCount >= 2 || sample.basinQ >= 4200)
      ) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: stateLookup.requireStateCode("SOIL_SATURATED")
        });
      }

      if (currentCell.stateCode === stateLookup.requireStateCode("SAND_DRY")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: stateLookup.requireStateCode("SAND_WET")
        });
      }

      if (currentCell.stateCode === stateLookup.requireStateCode("SILT_DRY")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: stateLookup.requireStateCode("SILT_WET")
        });
      }

      if (currentCell.stateCode === stateLookup.requireStateCode("CLAY_DRY")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: stateLookup.requireStateCode("CLAY_WET")
        });
      }
    }

    if (
      sample.evaporationQ >= 6800 &&
      sample.rainfallQ <= 1800 &&
      sample.runoffQ <= 1800 &&
      waterNeighborCount === 0
    ) {
      if (currentCell.stateCode === stateLookup.requireStateCode("SOIL_SATURATED")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: stateLookup.requireStateCode("SOIL_MOIST")
        });
      }

      if (currentCell.stateCode === stateLookup.requireStateCode("SOIL_MOIST")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: stateLookup.requireStateCode("SOIL_DRY")
        });
      }

      if (currentCell.stateCode === stateLookup.requireStateCode("SAND_WET")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: stateLookup.requireStateCode("SAND_DRY")
        });
      }

      if (currentCell.stateCode === stateLookup.requireStateCode("SILT_WET")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: stateLookup.requireStateCode("SILT_DRY")
        });
      }

      if (currentCell.stateCode === stateLookup.requireStateCode("CLAY_WET")) {
        return Object.freeze({
          changed: true,
          ruleFamily: "WETTING_DRYING",
          admissible: true,
          nextStateCode: stateLookup.requireStateCode("CLAY_DRY")
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

  function stepStateLattice(input = {}) {
    if (!isPlainObject(input)) {
      throw new Error("RULE_ENGINE_STEP_INPUT_INVALID");
    }

    const quantizedSampleGrid = getQuantizedSampleGrid(input);
    if (quantizedSampleGrid.length !== height || quantizedSampleGrid[0].length !== width) {
      throw new Error("RULE_ENGINE_GRID_COMPLETENESS_FAILURE");
    }

    const tickIndex = Number.isInteger(input.tickIndex) ? input.tickIndex : 0;

    const activeRuleFamilies = Array.isArray(input.activeRuleFamilies) && input.activeRuleFamilies.length > 0
      ? Object.freeze([...input.activeRuleFamilies])
      : tickContract.firstRuleFamilies;

    const activeRuleFamilySet = new Set(activeRuleFamilies);

    const currentStateBuffer =
      Array.isArray(input.currentStateBuffer)
        ? validateStateBuffer(input.currentStateBuffer, width, height)
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
        const sample = validateQuantizedSample(quantizedSampleGrid[y][x]);
        const currentCell = validateStateCell(currentStateBuffer[y][x], `currentStateBuffer[${y}][${x}]`);
        const neighbors = getNeighbors(currentStateBuffer, x, y);

        let nextStateCode = currentCell.stateCode;
        let transitionAdmissible = false;

        for (let i = 0; i < precedence.length; i += 1) {
          const ruleFamily = precedence[i];
          if (!activeRuleFamilySet.has(ruleFamily)) continue;

          let result = null;

          if (ruleFamily === "FREEZE_MELT") {
            result = freezeMeltTransition(sample, currentCell, neighbors);
          } else if (ruleFamily === "WATER_RETENTION_SPREAD") {
            result = waterRetentionSpreadTransition(sample, currentCell, neighbors);
          } else if (ruleFamily === "WETTING_DRYING") {
            result = wettingDryingTransition(sample, currentCell, neighbors);
          } else {
            throw new Error(`RULE_ENGINE_UNKNOWN_RULE_FAMILY:${ruleFamily}`);
          }

          if (result.admissible === true) {
            nextStateCode = requireInt32(result.nextStateCode, `nextStateCode:${ruleFamily}`);
            transitionAdmissible = true;
            if (result.changed) {
              transitionCounts[result.ruleFamily] += 1;
            }
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
        Object.freeze(row.map((cell) => createFrozenStateCell(cell.stateCode, cell.stateAge)))
      )
    );

    const stateSummary = summarizeStateLattice(
      nextStateBuffer,
      currentStateBuffer,
      stateLookup.familyFromCode
    );

    const transitionSummary = Object.freeze({
      tickIndex,
      activeRuleFamilies: Object.freeze([...activeRuleFamilies]),
      admissibleCount: requireInt32(admissibleCount, "admissibleCount"),
      blockedTransitionCount: requireInt32(blockedTransitionCount, "blockedTransitionCount"),
      transitionCounts: Object.freeze({
        FREEZE_MELT: requireInt32(transitionCounts.FREEZE_MELT, "transitionCounts.FREEZE_MELT"),
        WATER_RETENTION_SPREAD: requireInt32(
          transitionCounts.WATER_RETENTION_SPREAD,
          "transitionCounts.WATER_RETENTION_SPREAD"
        ),
        WETTING_DRYING: requireInt32(transitionCounts.WETTING_DRYING, "transitionCounts.WETTING_DRYING")
      }),
      enumRegistryVersion: quantizedSampleView.enumRegistryVersion,
      numericMode: quantizedSampleView.numericMode,
      boundaryMode: STAGE_1_BOUNDARY_MODE
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
    boundaryMode: STAGE_1_BOUNDARY_MODE,
    seedStateFromSample(sample) {
      return seedStateFromQuantizedSample(quantizedSampleView.buildQuantizedSample(sample));
    },
    seedStateFromQuantizedSample,
    seedStateBuffer,
    stepStateLattice,
    summarizeStateLattice(stateBuffer, previousStateBuffer = null) {
      validateStateBuffer(stateBuffer, width, height);
      if (previousStateBuffer) {
        validateStateBuffer(previousStateBuffer, width, height);
      }

      return summarizeStateLattice(
        stateBuffer,
        previousStateBuffer,
        stateLookup.familyFromCode
      );
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
