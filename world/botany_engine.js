// /world/botany_engine.js
// MODE: BOTANY ENGINE CONTRACT v1
// STATUS: TNT — DETERMINISTIC SURFACE LIFE EXPRESSION
// PURPOSE:
// 1) read intrinsic surface/ecology truth only
// 2) derive visible botany expression deterministically
// 3) never redefine terrain, climate, or surface cover
// 4) produce per-sample botany outputs + summary
// 5) stay finite, bounded, and non-drifting

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function toNumber(value, fallback = 0) {
  return isFiniteNumber(value) ? value : fallback;
}

function round3(value) {
  return Math.round((value ?? 0) * 1000) / 1000;
}

function hashNoise(seed, a, b, c = 0) {
  const v = Math.sin((seed * 0.001) + (a * 127.1) + (b * 311.7) + (c * 74.7)) * 43758.5453123;
  return v - Math.floor(v);
}

function sampleSignedNoise(seed, latDeg, lonDeg, scaleLat, scaleLon) {
  const a = latDeg / scaleLat;
  const b = lonDeg / scaleLon;
  const n = hashNoise(seed, a, b, 0);
  return (n * 2) - 1;
}

const BOTANY_TYPES = Object.freeze({
  NONE: "NONE",
  GRASSLAND: "GRASSLAND",
  SHRUBLAND: "SHRUBLAND",
  SPARSE_TREES: "SPARSE_TREES",
  FOREST: "FOREST",
  DENSE_FOREST: "DENSE_FOREST",
  SHORELINE_SPARSE: "SHORELINE_SPARSE",
  GLACIAL_NONE: "GLACIAL_NONE"
});

const DEFAULT_CONSTANTS = Object.freeze({
  richnessNoiseSeedA: 9101,
  richnessNoiseSeedB: 11213,
  richnessNoiseSeedC: 14159,
  meadowTreeThreshold: 0.22,
  forestDenseTreeThreshold: 0.62,
  forestDenseContinuityThreshold: 0.62,
  barrenShrubRainThreshold: 0.18,
  coldSuppressionThreshold: 0.24,
  glacialSuppressionThreshold: 0.70
});

function buildConstants(input = {}) {
  const c = normalizeObject(input);

  return Object.freeze({
    richnessNoiseSeedA: toNumber(c.richnessNoiseSeedA, DEFAULT_CONSTANTS.richnessNoiseSeedA),
    richnessNoiseSeedB: toNumber(c.richnessNoiseSeedB, DEFAULT_CONSTANTS.richnessNoiseSeedB),
    richnessNoiseSeedC: toNumber(c.richnessNoiseSeedC, DEFAULT_CONSTANTS.richnessNoiseSeedC),
    meadowTreeThreshold: toNumber(c.meadowTreeThreshold, DEFAULT_CONSTANTS.meadowTreeThreshold),
    forestDenseTreeThreshold: toNumber(c.forestDenseTreeThreshold, DEFAULT_CONSTANTS.forestDenseTreeThreshold),
    forestDenseContinuityThreshold: toNumber(c.forestDenseContinuityThreshold, DEFAULT_CONSTANTS.forestDenseContinuityThreshold),
    barrenShrubRainThreshold: toNumber(c.barrenShrubRainThreshold, DEFAULT_CONSTANTS.barrenShrubRainThreshold),
    coldSuppressionThreshold: toNumber(c.coldSuppressionThreshold, DEFAULT_CONSTANTS.coldSuppressionThreshold),
    glacialSuppressionThreshold: toNumber(c.glacialSuppressionThreshold, DEFAULT_CONSTANTS.glacialSuppressionThreshold)
  });
}

function getSamplesFromPlanetField(planetField) {
  const field = normalizeObject(planetField);
  return Array.isArray(field.samples) ? field.samples : [];
}

function getWidth(samples) {
  return Array.isArray(samples[0]) ? samples[0].length : 0;
}

function getHeight(samples) {
  return Array.isArray(samples) ? samples.length : 0;
}

function wrapX(x, width) {
  if (width <= 0) return 0;
  if (x < 0) return width - 1;
  if (x >= width) return 0;
  return x;
}

function getCell(grid, x, y) {
  const height = getHeight(grid);
  const width = getWidth(grid);
  if (y < 0 || y >= height || width <= 0) return null;
  return grid[y]?.[wrapX(x, width)] ?? null;
}

function getNeighborCoords4(x, y, width, height) {
  const coords = [];
  if (y - 1 >= 0) coords.push([x, y - 1]);
  coords.push([wrapX(x + 1, width), y]);
  if (y + 1 < height) coords.push([x, y + 1]);
  coords.push([wrapX(x - 1, width), y]);
  return coords;
}

function computeRichnessNoise(sample, constants) {
  const latDeg = toNumber(sample?.latDeg, 0);
  const lonDeg = toNumber(sample?.lonDeg, 0);

  const n1 = sampleSignedNoise(constants.richnessNoiseSeedA, latDeg, lonDeg, 7.5, 11.5);
  const n2 = sampleSignedNoise(constants.richnessNoiseSeedB, latDeg, lonDeg, 14.0, 19.0);
  const n3 = sampleSignedNoise(constants.richnessNoiseSeedC, latDeg, lonDeg, 31.0, 41.0);

  return clamp((0.50 * n1) + (0.35 * n2) + (0.15 * n3), -1, 1);
}

function resolveBaseBotanyType(sample, constants) {
  const surfaceCoverType = sample?.surfaceCoverType ?? "WATER";
  const rainfall = clamp(toNumber(sample?.rainfall, 0), 0, 1);
  const treeDensity = clamp(toNumber(sample?.treeDensity, 0), 0, 1);
  const surfaceContinuity = clamp(toNumber(sample?.surfaceContinuity, 0), 0, 1);

  if (surfaceCoverType === "WATER") return BOTANY_TYPES.NONE;
  if (surfaceCoverType === "GLACIAL") return BOTANY_TYPES.GLACIAL_NONE;
  if (surfaceCoverType === "BEACH") return BOTANY_TYPES.SHORELINE_SPARSE;

  if (surfaceCoverType === "BARREN") {
    return rainfall >= constants.barrenShrubRainThreshold
      ? BOTANY_TYPES.SHRUBLAND
      : BOTANY_TYPES.NONE;
  }

  if (surfaceCoverType === "MEADOW") {
    return treeDensity >= constants.meadowTreeThreshold
      ? BOTANY_TYPES.SPARSE_TREES
      : BOTANY_TYPES.GRASSLAND;
  }

  if (surfaceCoverType === "FOREST") {
    return treeDensity >= constants.forestDenseTreeThreshold &&
      surfaceContinuity >= constants.forestDenseContinuityThreshold
      ? BOTANY_TYPES.DENSE_FOREST
      : BOTANY_TYPES.FOREST;
  }

  return BOTANY_TYPES.NONE;
}

function derivePresenceByType(sample, botanyType) {
  const vegetationDensity = clamp(toNumber(sample?.vegetationDensity, 0), 0, 1);
  const treeDensity = clamp(toNumber(sample?.treeDensity, 0), 0, 1);
  const grassDensity = clamp(toNumber(sample?.grassDensity, 0), 0, 1);
  const surfaceContinuity = clamp(toNumber(sample?.surfaceContinuity, 0), 0, 1);
  const rainfall = clamp(toNumber(sample?.rainfall, 0), 0, 1);
  const temperature = clamp(toNumber(sample?.temperature, 0), 0, 1);
  const slope = clamp(toNumber(sample?.slope, 0), 0, 1);
  const compositionWeight = clamp(toNumber(sample?.compositionWeight, 0), 0, 1);
  const freezePotential = clamp(toNumber(sample?.freezePotential, 0), 0, 1);

  const climateGain = clamp((rainfall * 0.55) + (temperature * 0.25) + ((1 - slope) * 0.20), 0, 1);
  const richnessGain = clamp((compositionWeight - 0.5) * 0.10, -0.05, 0.05);
  const coldSuppression = clamp(freezePotential * 0.55, 0, 0.55);

  let botanyPresence = 0;
  let treePresence = 0;
  let grassPresence = 0;
  let shrubPresence = 0;

  if (botanyType === BOTANY_TYPES.NONE || botanyType === BOTANY_TYPES.GLACIAL_NONE) {
    botanyPresence = 0;
    treePresence = 0;
    grassPresence = 0;
    shrubPresence = 0;
  } else if (botanyType === BOTANY_TYPES.SHORELINE_SPARSE) {
    grassPresence = clamp((grassDensity * 0.35) + (rainfall * 0.08) - (slope * 0.10), 0, 0.20);
    shrubPresence = clamp((vegetationDensity * 0.18) + (rainfall * 0.10) - (freezePotential * 0.12), 0, 0.18);
    treePresence = 0;
    botanyPresence = clamp(grassPresence + shrubPresence, 0, 0.28);
  } else if (botanyType === BOTANY_TYPES.SHRUBLAND) {
    shrubPresence = clamp((vegetationDensity * 0.55) + (rainfall * 0.20) + ((1 - slope) * 0.10), 0, 0.55);
    grassPresence = clamp((grassDensity * 0.28) + (rainfall * 0.08), 0, 0.22);
    treePresence = 0;
    botanyPresence = clamp((shrubPresence * 0.75) + (grassPresence * 0.25), 0, 0.60);
  } else if (botanyType === BOTANY_TYPES.GRASSLAND) {
    grassPresence = clamp((grassDensity * 0.78) + (climateGain * 0.16) + richnessGain, 0, 1);
    shrubPresence = clamp((vegetationDensity * 0.20) + (surfaceContinuity * 0.10), 0, 0.30);
    treePresence = clamp(treeDensity * 0.10, 0, 0.12);
    botanyPresence = clamp((grassPresence * 0.78) + (shrubPresence * 0.14) + (treePresence * 0.08), 0, 1);
  } else if (botanyType === BOTANY_TYPES.SPARSE_TREES) {
    grassPresence = clamp((grassDensity * 0.58) + (climateGain * 0.10), 0, 0.72);
    treePresence = clamp((treeDensity * 0.45) + (surfaceContinuity * 0.10) + richnessGain, 0, 0.42);
    shrubPresence = clamp((vegetationDensity * 0.22) + (rainfall * 0.10), 0, 0.32);
    botanyPresence = clamp((treePresence * 0.42) + (grassPresence * 0.38) + (shrubPresence * 0.20), 0, 1);
  } else if (botanyType === BOTANY_TYPES.FOREST) {
    treePresence = clamp((treeDensity * 0.72) + (surfaceContinuity * 0.12) + (climateGain * 0.08) + richnessGain, 0, 1);
    shrubPresence = clamp((vegetationDensity * 0.30) + (rainfall * 0.10), 0, 0.38);
    grassPresence = clamp((grassDensity * 0.22) + ((1 - treePresence) * 0.10), 0, 0.26);
    botanyPresence = clamp((treePresence * 0.72) + (shrubPresence * 0.18) + (grassPresence * 0.10), 0, 1);
  } else if (botanyType === BOTANY_TYPES.DENSE_FOREST) {
    treePresence = clamp((treeDensity * 0.88) + (surfaceContinuity * 0.10) + (climateGain * 0.06) + richnessGain, 0, 1);
    shrubPresence = clamp((vegetationDensity * 0.24) + (rainfall * 0.08), 0, 0.28);
    grassPresence = clamp((grassDensity * 0.12) + ((1 - treePresence) * 0.05), 0, 0.14);
    botanyPresence = clamp((treePresence * 0.84) + (shrubPresence * 0.11) + (grassPresence * 0.05), 0, 1);
  }

  if (freezePotential > 0) {
    botanyPresence = clamp(botanyPresence - coldSuppression, 0, 1);
    treePresence = clamp(treePresence - coldSuppression * 0.70, 0, 1);
    grassPresence = clamp(grassPresence - coldSuppression * 0.45, 0, 1);
    shrubPresence = clamp(shrubPresence - coldSuppression * 0.55, 0, 1);
  }

  return Object.freeze({
    botanyPresence: round3(botanyPresence),
    treePresence: round3(treePresence),
    grassPresence: round3(grassPresence),
    shrubPresence: round3(shrubPresence)
  });
}

function buildBaseBotanyGrid(samples, constants) {
  return samples.map((row) =>
    row.map((sample) => {
      const normalizedSample = normalizeObject(sample);
      const richnessNoise = computeRichnessNoise(normalizedSample, constants);
      const baseBotanyType = resolveBaseBotanyType(normalizedSample, constants);
      const presence = derivePresenceByType(normalizedSample, baseBotanyType);

      const noiseModulatedPresence = round3(
        clamp(
          presence.botanyPresence + richnessNoise * 0.06,
          0,
          1
        )
      );

      return Object.freeze({
        x: normalizedSample.x,
        y: normalizedSample.y,
        latDeg: toNumber(normalizedSample.latDeg, 0),
        lonDeg: toNumber(normalizedSample.lonDeg, 0),

        botanyType: baseBotanyType,
        botanyPresence: noiseModulatedPresence,
        treePresence: presence.treePresence,
        grassPresence: presence.grassPresence,
        shrubPresence: presence.shrubPresence,
        botanyContinuity: 0,

        support: Object.freeze({
          surfaceCoverType: normalizedSample.surfaceCoverType ?? "WATER",
          vegetationDensity: round3(clamp(toNumber(normalizedSample.vegetationDensity, 0), 0, 1)),
          treeDensity: round3(clamp(toNumber(normalizedSample.treeDensity, 0), 0, 1)),
          grassDensity: round3(clamp(toNumber(normalizedSample.grassDensity, 0), 0, 1)),
          surfaceContinuity: round3(clamp(toNumber(normalizedSample.surfaceContinuity, 0), 0, 1)),
          rainfall: round3(clamp(toNumber(normalizedSample.rainfall, 0), 0, 1)),
          temperature: round3(clamp(toNumber(normalizedSample.temperature, 0), 0, 1)),
          slope: round3(clamp(toNumber(normalizedSample.slope, 0), 0, 1)),
          compositionWeight: round3(clamp(toNumber(normalizedSample.compositionWeight, 0), 0, 1))
        }),

        placement: Object.freeze({
          canopyDensity: 0,
          undergrowthDensity: 0,
          patchiness: 0
        })
      });
    })
  );
}

function applyBotanyContinuity(grid) {
  const height = getHeight(grid);
  const width = getWidth(grid);

  return grid.map((row, y) =>
    row.map((cell, x) => {
      const neighbors = getNeighborCoords4(x, y, width, height);
      let sameTypeCount = 0;
      let validCount = 0;
      let botanyPresenceMean = 0;

      for (let i = 0; i < neighbors.length; i += 1) {
        const nx = neighbors[i][0];
        const ny = neighbors[i][1];
        const neighbor = getCell(grid, nx, ny);
        if (!neighbor) continue;

        validCount += 1;
        botanyPresenceMean += toNumber(neighbor.botanyPresence, 0);
        if (neighbor.botanyType === cell.botanyType) {
          sameTypeCount += 1;
        }
      }

      const typeAgreement = validCount > 0 ? sameTypeCount / validCount : 1;
      const neighborPresenceMean = validCount > 0 ? botanyPresenceMean / validCount : cell.botanyPresence;
      const botanyContinuity = round3(clamp((typeAgreement * 0.70) + (neighborPresenceMean * 0.30), 0, 1));

      let botanyType = cell.botanyType;
      let treePresence = cell.treePresence;
      let grassPresence = cell.grassPresence;
      let shrubPresence = cell.shrubPresence;
      let botanyPresence = cell.botanyPresence;

      if (botanyType === BOTANY_TYPES.FOREST && treePresence >= 0.62 && botanyContinuity >= 0.62) {
        botanyType = BOTANY_TYPES.DENSE_FOREST;
      }

      if (botanyType === BOTANY_TYPES.GRASSLAND && treePresence >= 0.22) {
        botanyType = BOTANY_TYPES.SPARSE_TREES;
      }

      if (
        botanyType !== BOTANY_TYPES.NONE &&
        botanyType !== BOTANY_TYPES.GLACIAL_NONE &&
        botanyType !== BOTANY_TYPES.SHORELINE_SPARSE
      ) {
        botanyPresence = round3(clamp(botanyPresence * (0.84 + botanyContinuity * 0.16), 0, 1));

        if (botanyType === BOTANY_TYPES.FOREST || botanyType === BOTANY_TYPES.DENSE_FOREST || botanyType === BOTANY_TYPES.SPARSE_TREES) {
          treePresence = round3(clamp(treePresence * (0.82 + botanyContinuity * 0.18), 0, 1));
        }

        if (botanyType === BOTANY_TYPES.GRASSLAND) {
          grassPresence = round3(clamp(grassPresence * (0.84 + botanyContinuity * 0.16), 0, 1));
        }
      }

      const canopyDensity = round3(
        clamp(
          treePresence * (botanyType === BOTANY_TYPES.DENSE_FOREST ? 1.0 : botanyType === BOTANY_TYPES.FOREST ? 0.82 : 0.45),
          0,
          1
        )
      );

      const undergrowthDensity = round3(
        clamp(
          grassPresence * 0.55 + shrubPresence * 0.45,
          0,
          1
        )
      );

      const patchiness = round3(clamp(1 - botanyContinuity, 0, 1));

      return Object.freeze({
        ...cell,
        botanyType,
        botanyPresence,
        treePresence,
        grassPresence,
        shrubPresence,
        botanyContinuity,
        placement: Object.freeze({
          canopyDensity,
          undergrowthDensity,
          patchiness
        })
      });
    })
  );
}

function finalizeBotanyGrid(grid) {
  return Object.freeze(
    grid.map((row) =>
      Object.freeze(
        row.map((cell) =>
          Object.freeze({
            ...cell,
            support: Object.freeze({ ...cell.support }),
            placement: Object.freeze({ ...cell.placement })
          })
        )
      )
    )
  );
}

function buildBotanySummary(grid) {
  let grasslandCount = 0;
  let shrublandCount = 0;
  let sparseTreeCount = 0;
  let forestCount = 0;
  let denseForestCount = 0;
  let shorelineSparseCount = 0;
  let avgBotanyPresenceTotal = 0;
  let avgTreePresenceTotal = 0;
  let sampleCount = 0;

  for (const row of grid) {
    for (const cell of row) {
      sampleCount += 1;
      avgBotanyPresenceTotal += toNumber(cell.botanyPresence, 0);
      avgTreePresenceTotal += toNumber(cell.treePresence, 0);

      if (cell.botanyType === BOTANY_TYPES.GRASSLAND) grasslandCount += 1;
      else if (cell.botanyType === BOTANY_TYPES.SHRUBLAND) shrublandCount += 1;
      else if (cell.botanyType === BOTANY_TYPES.SPARSE_TREES) sparseTreeCount += 1;
      else if (cell.botanyType === BOTANY_TYPES.FOREST) forestCount += 1;
      else if (cell.botanyType === BOTANY_TYPES.DENSE_FOREST) denseForestCount += 1;
      else if (cell.botanyType === BOTANY_TYPES.SHORELINE_SPARSE) shorelineSparseCount += 1;
    }
  }

  const divisor = Math.max(1, sampleCount);

  return Object.freeze({
    grasslandCount,
    shrublandCount,
    sparseTreeCount,
    forestCount,
    denseForestCount,
    shorelineSparseCount,
    avgBotanyPresence: round3(avgBotanyPresenceTotal / divisor),
    avgTreePresence: round3(avgTreePresenceTotal / divisor)
  });
}

function buildBotanyFieldInternal(planetField, options = {}) {
  const samples = getSamplesFromPlanetField(planetField);
  const width = getWidth(samples);
  const height = getHeight(samples);
  const constants = buildConstants(options.constants);

  const stage1 = buildBaseBotanyGrid(samples, constants);
  const stage2 = applyBotanyContinuity(stage1);
  const grid = finalizeBotanyGrid(stage2);
  const summary = buildBotanySummary(grid);

  return Object.freeze({
    width,
    height,
    grid,
    summary,
    constants,
    completeness: Object.freeze({
      inputs_read: true,
      type_resolution: true,
      density_resolution: true,
      continuity_resolution: true,
      summary_built: true
    })
  });
}

export function createBotanyEngine(config = {}) {
  const normalizedConfig = normalizeObject(config);

  function buildBotanyField(planetField, options = {}) {
    const mergedOptions = {
      ...normalizedConfig,
      ...normalizeObject(options)
    };
    return buildBotanyFieldInternal(planetField, mergedOptions);
  }

  return Object.freeze({
    buildBotanyField
  });
}

const DEFAULT_BOTANY_ENGINE = createBotanyEngine();

export function buildBotanyField(planetField, options = {}) {
  return DEFAULT_BOTANY_ENGINE.buildBotanyField(planetField, options);
}

export { BOTANY_TYPES };

export default DEFAULT_BOTANY_ENGINE;
