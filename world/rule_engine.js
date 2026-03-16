import {
  WORLD_KERNEL,
  getStateRegistry,
  getRuleFamilyRegistry,
  getSimulationTickContract
} from "./world_kernel.js";

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

function toNumber(value, fallback = 0) {
  return isFiniteNumber(value) ? value : fallback;
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

function countNeighborCodes(neighbors, code) {
  let total = 0;
  for (const neighbor of neighbors) {
    if (neighbor?.stateCode === code) total += 1;
  }
  return total;
}

function countNeighborFamily(neighbors, familyFromCode, familyName) {
  let total = 0;
  for (const neighbor of neighbors) {
    if (!neighbor) continue;
    if (familyFromCode(neighbor.stateCode) === familyName) total += 1;
  }
  return total;
}

function seedStateFromSample(sample, lookup) {
  const terrainClass = typeof sample?.terrainClass === "string" ? sample.terrainClass : "WATER";
  const biomeType = typeof sample?.biomeType === "string" ? sample.biomeType : "NONE";
  const surfaceMaterial = typeof sample?.surfaceMaterial === "string" ? sample.surfaceMaterial : "NONE";
  const rainfall = toNumber(sample?.rainfall, 0);
  const runoff = toNumber(sample?.runoff, 0);
  const freezePotential = toNumber(sample?.freezePotential, 0);
  const meltPotential = toNumber(sample?.meltPotential, 0);
  const basinStrength = toNumber(sample?.basinStrength, 0);
  const shorelineBand = sample?.shorelineBand === true;
  const waterDepth = toNumber(sample?.waterDepth, 0);

  if (terrainClass === "POLAR_ICE") {
    return Object.freeze({ stateCode: lookup.code("ICE_SHEET"), stateAge: 0 });
  }

  if (terrainClass === "GLACIAL_HIGHLAND" || biomeType === "GLACIER") {
    return Object.freeze({ stateCode: lookup.code("GLACIER_STABLE"), stateAge: 0 });
  }

  if (terrainClass === "WATER") {
    if (waterDepth >= 0.30) return Object.freeze({ stateCode: lookup.code("WATER_TRENCH"), stateAge: 0 });
    if (waterDepth >= 0.18) return Object.freeze({ stateCode: lookup.code("WATER_ABYSS"), stateAge: 0 });
    if (waterDepth >= 0.08) return Object.freeze({ stateCode: lookup.code("WATER_SLOPE"), stateAge: 0 });
    return Object.freeze({ stateCode: lookup.code("WATER_STILL_DEEP"), stateAge: 0 });
  }

  if (terrainClass === "SHELF") {
    return Object.freeze({ stateCode: lookup.code("WATER_SHELF"), stateAge: 0 });
  }

  if (terrainClass === "BASIN" && basinStrength >= 0.18 && rainfall >= 0.30) {
    return Object.freeze({ stateCode: lookup.code("WATER_BASIN_RETAINED"), stateAge: 0 });
  }

  if (surfaceMaterial === "ICE") {
    return Object.freeze({ stateCode: lookup.code("ICE_PACK"), stateAge: 0 });
  }

  if (surfaceMaterial === "SNOW") {
    return Object.freeze({ stateCode: lookup.code("SNOW_DENSE"), stateAge: 0 });
  }

  if (surfaceMaterial === "BEDROCK") {
    return Object.freeze({ stateCode: lookup.code("BEDROCK_EXPOSED"), stateAge: 0 });
  }

  if (surfaceMaterial === "GRAVEL") {
    return Object.freeze({ stateCode: lookup.code("GRAVEL_LOOSE"), stateAge: 0 });
  }

  if (surfaceMaterial === "SAND") {
    return Object.freeze({
      stateCode: lookup.code(shorelineBand ? "SAND_WET" : "SAND_DRY"),
      stateAge: 0
    });
  }

  if (surfaceMaterial === "SILT") {
    return Object.freeze({
      stateCode: lookup.code(rainfall >= 0.35 ? "SILT_WET" : "SILT_DRY"),
      stateAge: 0
    });
  }

  if (surfaceMaterial === "CLAY") {
    return Object.freeze({
      stateCode: lookup.code(runoff >= 0.28 ? "CLAY_WET" : "CLAY_DRY"),
      stateAge: 0
    });
  }

  if (biomeType === "TROPICAL_RAINFOREST") {
    return Object.freeze({ stateCode: lookup.code("RAINFOREST_TROPICAL"), stateAge: 0 });
  }

  if (biomeType === "TEMPERATE_FOREST") {
    return Object.freeze({ stateCode: lookup.code("FOREST_TEMPERATE"), stateAge: 0 });
  }

  if (biomeType === "BOREAL_FOREST") {
    return Object.freeze({ stateCode: lookup.code("FOREST_BOREAL"), stateAge: 0 });
  }

  if (biomeType === "WETLAND") {
    return Object.freeze({ stateCode: lookup.code("WETLAND_REED"), stateAge: 0 });
  }

  if (biomeType === "DESERT") {
    return Object.freeze({ stateCode: lookup.code("DESERT_SCRUB"), stateAge: 0 });
  }

  if (biomeType === "TUNDRA") {
    return Object.freeze({ stateCode: lookup.code("TUNDRA_MOSS"), stateAge: 0 });
  }

  if (biomeType === "TROPICAL_GRASSLAND") {
    return Object.freeze({ stateCode: lookup.code("GRASSLAND_TROPICAL"), stateAge: 0 });
  }

  if (biomeType === "TEMPERATE_GRASSLAND") {
    return Object.freeze({ stateCode: lookup.code("GRASSLAND_TEMPERATE"), stateAge: 0 });
  }

  if (freezePotential >= 0.72 && meltPotential <= 0.18) {
    return Object.freeze({ stateCode: lookup.code("FROST_HEAVY"), stateAge: 0 });
  }

  if (runoff >= 0.32) {
    return Object.freeze({ stateCode: lookup.code("SOIL_MOIST"), stateAge: 0 });
  }

  return Object.freeze({ stateCode: lookup.code("SOIL_DRY"), stateAge: 0 });
}

function freezeMeltTransition(sample, currentCell, neighbors, lookup, familyFromCode) {
  const currentFamily = familyFromCode(currentCell.stateCode);
  const freezePotential = toNumber(sample?.freezePotential, 0);
  const meltPotential = toNumber(sample?.meltPotential, 0);
  const temperature = toNumber(sample?.temperature, 0);
  const elevation = toNumber(sample?.elevation, 0);
  const climateBand = typeof sample?.climateBandField === "string" ? sample.climateBandField : "TEMPERATE";

  const waterNeighborCount = countNeighborFamily(neighbors, familyFromCode, "water_family");
  const cryoNeighborCount = countNeighborFamily(neighbors, familyFromCode, "cryosphere_family");

  if (
    (currentFamily === "water_family" || currentFamily === "substrate_family") &&
    freezePotential >= 0.78 &&
    meltPotential <= 0.18 &&
    (climateBand === "POLAR" || climateBand === "SUBPOLAR" || elevation >= 0.22)
  ) {
    const nextStateCode =
      waterNeighborCount > 2
        ? lookup.code("ICE_PACK")
        : lookup.code("FROST_HEAVY");

    return Object.freeze({
      changed: true,
      ruleFamily: "FREEZE_MELT",
      admissible: true,
      nextStateCode
    });
  }

  if (
    currentFamily === "cryosphere_family" &&
    meltPotential >= 0.62 &&
    temperature >= 0.42
  ) {
    const nextStateCode =
      cryoNeighborCount > 3
        ? lookup.code("SLUSH")
        : lookup.code("WATER_GLACIAL_RUNOFF");

    return Object.freeze({
      changed: true,
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

function waterRetentionSpreadTransition(sample, currentCell, neighbors, lookup, familyFromCode) {
  const currentFamily = familyFromCode(currentCell.stateCode);
  const basinStrength = toNumber(sample?.basinStrength, 0);
  const slope = toNumber(sample?.slope, 0);
  const rainfall = toNumber(sample?.rainfall, 0);
  const runoff = toNumber(sample?.runoff, 0);
  const drainage = typeof sample?.drainage === "string" ? sample.drainage : "none";
  const waterNeighborCount = countNeighborFamily(neighbors, familyFromCode, "water_family");

  if (currentFamily === "water_family") {
    if (basinStrength >= 0.18 && slope <= 0.16) {
      return Object.freeze({
        changed: currentCell.stateCode !== lookup.code("WATER_BASIN_RETAINED"),
        ruleFamily: "WATER_RETENTION_SPREAD",
        admissible: true,
        nextStateCode: lookup.code("WATER_BASIN_RETAINED")
      });
    }

    if ((slope >= 0.18 || drainage !== "none") && runoff >= 0.26) {
      return Object.freeze({
        changed: currentCell.stateCode !== lookup.code("WATER_FLOWING_STRONG"),
        ruleFamily: "WATER_RETENTION_SPREAD",
        admissible: true,
        nextStateCode: lookup.code("WATER_FLOWING_STRONG")
      });
    }

    if (slope >= 0.10 || runoff >= 0.18) {
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
    rainfall >= 0.24 &&
    slope <= 0.26
  ) {
    return Object.freeze({
      changed: true,
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

function wettingDryingTransition(sample, currentCell, neighbors, lookup, familyFromCode) {
  const currentFamily = familyFromCode(currentCell.stateCode);
  const rainfall = toNumber(sample?.rainfall, 0);
  const runoff = toNumber(sample?.runoff, 0);
  const evaporationPressure = toNumber(sample?.evaporationPressure, 0);
  const basinAccumulation = toNumber(sample?.basinAccumulation, 0);
  const shorelineBand = sample?.shorelineBand === true;
  const waterNeighborCount = countNeighborFamily(neighbors, familyFromCode, "water_family");

  if (currentFamily !== "substrate_family") {
    return Object.freeze({
      changed: false,
      ruleFamily: "WETTING_DRYING",
      admissible: false,
      nextStateCode: currentCell.stateCode
    });
  }

  if (
    (waterNeighborCount >= 1 || shorelineBand || rainfall >= 0.34 || basinAccumulation >= 0.30) &&
    evaporationPressure <= 0.62
  ) {
    if (currentCell.stateCode === lookup.code("SOIL_DRY")) {
      return Object.freeze({
        changed: true,
        ruleFamily: "WETTING_DRYING",
        admissible: true,
        nextStateCode: lookup.code("SOIL_MOIST")
      });
    }

    if (currentCell.stateCode === lookup.code("SOIL_MOIST") && (waterNeighborCount >= 2 || basinAccumulation >= 0.42)) {
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
    evaporationPressure >= 0.68 &&
    rainfall <= 0.18 &&
    runoff <= 0.18 &&
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

function summarizeStateLattice(currentStateBuffer, previousStateBuffer, lookup, familyFromCode) {
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

  function seedStateBuffer(sampleGrid) {
    const grid = getSampleGrid({ sampleGrid });

    if (!grid.length) {
      return createBuffer(width, height, () => emptyCellState());
    }

    return createBuffer(width, height, (x, y) => {
      const sample = grid[y]?.[x] ?? null;
      return sample ? seedStateFromSample(sample, lookup) : emptyCellState();
    });
  }

  function stepStateLattice(input = {}) {
    const sampleGrid = getSampleGrid(input);
    const currentStateBufferInput = normalizeArray(input.currentStateBuffer);
    const tickIndex = Number.isInteger(input.tickIndex) ? input.tickIndex : 0;
    const activeRuleFamilies = normalizeArray(input.activeRuleFamilies).length
      ? normalizeArray(input.activeRuleFamilies)
      : tickContract.firstRuleFamilies;

    const currentStateBuffer =
      currentStateBufferInput.length && Array.isArray(currentStateBufferInput[0])
        ? currentStateBufferInput
        : seedStateBuffer(sampleGrid);

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
        const sample = sampleGrid[y]?.[x] ?? null;
        const currentCell = currentStateBuffer[y]?.[x] ?? emptyCellState();
        const neighbors = getNeighbors(currentStateBuffer, x, y);

        let nextStateCode = currentCell.stateCode;
        let chosenRuleFamily = null;
        let transitionAdmissible = false;

        for (const ruleFamily of precedence) {
          if (!activeRuleFamilies.includes(ruleFamily)) continue;

          let result = null;

          if (ruleFamily === "FREEZE_MELT") {
            result = freezeMeltTransition(sample, currentCell, neighbors, lookup, lookup.familyFromCode);
          } else if (ruleFamily === "WATER_RETENTION_SPREAD") {
            result = waterRetentionSpreadTransition(sample, currentCell, neighbors, lookup, lookup.familyFromCode);
          } else if (ruleFamily === "WETTING_DRYING") {
            result = wettingDryingTransition(sample, currentCell, neighbors, lookup, lookup.familyFromCode);
          }

          if (result?.admissible === true) {
            nextStateCode = result.nextStateCode;
            chosenRuleFamily = result.ruleFamily;
            transitionAdmissible = true;
            transitionCounts[result.ruleFamily] += result.changed ? 1 : 0;
            admissibleCount += 1;
            break;
          }
        }

        if (!transitionAdmissible) {
          blockedTransitionCount += 1;
        }

        const nextStateAge =
          nextStateCode === currentCell.stateCode
            ? currentCell.stateAge + 1
            : 0;

        nextStateBufferMutable[y][x] = {
          stateCode: nextStateCode,
          stateAge: nextStateAge
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
      lookup,
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
      })
    });

    return Object.freeze({
      currentStateBuffer,
      nextStateBuffer,
      transitionSummary,
      stateSummary
    });
  }

  return Object.freeze({
    seedStateFromSample(sample) {
      return seedStateFromSample(sample, lookup);
    },
    seedStateBuffer,
    stepStateLattice,
    summarizeStateLattice(stateBuffer, previousStateBuffer = null) {
      return summarizeStateLattice(stateBuffer, previousStateBuffer, lookup, lookup.familyFromCode);
    }
  });
}

const DEFAULT_RULE_ENGINE = createRuleEngine();

export function seedStateFromSample(sample) {
  return DEFAULT_RULE_ENGINE.seedStateFromSample(sample);
}

export function seedStateBuffer(sampleGrid) {
  return DEFAULT_RULE_ENGINE.seedStateBuffer(sampleGrid);
}

export function stepStateLattice(input = {}) {
  return DEFAULT_RULE_ENGINE.stepStateLattice(input);
}

export function summarizeStateLattice(stateBuffer, previousStateBuffer = null) {
  return DEFAULT_RULE_ENGINE.summarizeStateLattice(stateBuffer, previousStateBuffer);
}
