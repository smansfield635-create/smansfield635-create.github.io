// /world/planet_engine.js
// MODE: CONTRACT EXECUTION
// CONTRACT: ENGINE_BASELINE_CONTRACT_G1
// STATUS: DENSE FIELD BUILDER | DETERMINISTIC | NON-DRIFT | KERNEL-SUBORDINATE

import WORLD_KERNEL from "./world_kernel.js";

const ENGINE_META = Object.freeze({
  name: "planet_engine",
  version: "G1_BASELINE",
  contract: "ENGINE_BASELINE_CONTRACT_G1",
  role: "dense_field_builder",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  kernelSubordinate: true
});

const GRID = 256;
const KERNEL_GRID = 16;
const TWO_PI = Math.PI * 2;

const deepFreeze = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }
  return value;
};

const clamp = (value, min, max) => {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const clamp01 = (value) => clamp(value, 0, 1);

const stableRound = (value, places = 12) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

const normalizeObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const noise = (x, y, seed = 0) => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453123;
  return (n - Math.floor(n)) * 2 - 1;
};

const octaveNoise = (x, y, octaves = 3, persistence = 0.5, seed = 0) => {
  let amplitude = 1;
  let frequency = 1;
  let total = 0;
  let max = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += noise(x * frequency, y * frequency, seed + i * 17.13) * amplitude;
    max += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return max > 0 ? total / max : 0;
};

const buildTimeState = (input = {}) => {
  const src = normalizeObject(input);
  const elapsedSeconds =
    typeof src.elapsedSeconds === "number" && Number.isFinite(src.elapsedSeconds)
      ? Math.max(0, src.elapsedSeconds)
      : 0;

  const dayPhase = ((elapsedSeconds * 0.02) % 1 + 1) % 1;
  const seasonPhase = ((elapsedSeconds * 0.0025) % 1 + 1) % 1;
  const stormPhase = ((elapsedSeconds * 0.01) % 1 + 1) % 1;

  return {
    elapsedSeconds: stableRound(elapsedSeconds),
    dayPhase: stableRound(dayPhase),
    seasonPhase: stableRound(seasonPhase),
    stormPhase: stableRound(stormPhase)
  };
};

const kernelIndexFromDense = (u01, v01) => ({
  i: clamp(Math.floor(u01 * KERNEL_GRID), 0, KERNEL_GRID - 1),
  j: clamp(Math.floor(v01 * KERNEL_GRID), 0, KERNEL_GRID - 1)
});

const sampleKernelCell = (u01, v01) => {
  const { i, j } = kernelIndexFromDense(u01, v01);
  return WORLD_KERNEL.lattice[j * KERNEL_GRID + i];
};

const denseGlobeProjection = (u01, v01) => {
  const lon = stableRound(u01 * 360 - 180);
  const lat = stableRound(90 - v01 * 180);

  const theta = u01 * TWO_PI;
  const phi = v01 * Math.PI;

  return {
    lat,
    lon,
    x: stableRound(Math.cos(theta) * Math.sin(phi)),
    y: stableRound(Math.sin(theta) * Math.sin(phi)),
    z: stableRound(Math.cos(phi))
  };
};

const classifyTerrain = (elevation, shorelineMask, landMask) => {
  if (!landMask) return "BASIN";
  if (shorelineMask > 0.72) return "PLAIN";
  if (elevation < 0.42) return "PLAIN";
  if (elevation < 0.58) return "PLATEAU";
  if (elevation < 0.72) return "RIDGE";
  if (elevation < 0.86) return "MOUNTAIN";
  return "SUMMIT";
};

const classifyBiome = (landMask, climate, moisture) => {
  if (!landMask) return climate < 0.28 ? "GLACIER" : "GRASSLAND";
  if (climate < 0.16) return "GLACIER";
  if (climate < 0.30) return "TUNDRA";
  if (moisture < 0.22) return "DESERT";
  if (moisture < 0.48) return "GRASSLAND";
  if (moisture < 0.72) return "FOREST";
  return "RAINFOREST";
};

const classifyClimateBand = (climate) => {
  if (climate < 0.18) return "POLAR";
  if (climate < 0.38) return "COLD";
  if (climate < 0.68) return "TEMPERATE";
  if (climate < 0.84) return "WARM";
  return "TROPICAL";
};

const classifySurfaceMaterial = (terrainClass, biomeType, landMask) => {
  if (!landMask) return "WATER";
  if (biomeType === "GLACIER") return "ICE";
  if (biomeType === "DESERT") return "SAND";
  if (terrainClass === "MOUNTAIN" || terrainClass === "SUMMIT") return "ROCK";
  if (terrainClass === "RIDGE") return "STONE";
  return "SOIL";
};

const classifyBoundary = (score, thresholds) => {
  if (score < thresholds.boundaryOpen) return "OPEN";
  if (score < thresholds.boundaryHold) return "HOLD";
  if (score < thresholds.boundaryGate) return "GATE";
  if (score < thresholds.boundaryBridge) return "BRIDGE";
  return "BLOCK";
};

const deriveDenseBoundary = (kernelCell, habitability, shorelineMask) => {
  const thresholds = WORLD_KERNEL.worldProfile.thresholds;
  const baseScore = Number(kernelCell.boundary.score || 0);
  const coherence = Number(kernelCell.force.fields?.coherence || 0);
  const score = clamp01(
    baseScore * 0.72 +
    (1 - habitability) * 0.18 +
    shorelineMask * 0.10 -
    coherence * 0.08
  );

  return {
    classification: classifyBoundary(score, thresholds),
    score: stableRound(score),
    dominanceGap: stableRound(Number(kernelCell.boundary.dominanceGap || 0))
  };
};

const deriveDenseMetrics = (u01, v01, kernelCell, timeState) => {
  const macro = 1 - Number(kernelCell.normalized.radius01 || 0);
  const coherence = clamp01(Number(kernelCell.force.fields?.coherence || 0));
  const boundaryPressure = clamp01(Number(kernelCell.force.fields?.boundaryPressure || 0));
  const integration = clamp01(Number(kernelCell.force.fields?.integration || 0));

  const terrainNoise = (octaveNoise(u01 * 2.1, v01 * 2.1, 3, 0.55, 1) + 1) * 0.5;
  const ridgeNoise = (octaveNoise(u01 * 6.2, v01 * 6.2, 2, 0.48, 7) + 1) * 0.5;
  const moistureNoise = (octaveNoise(u01 * 3.7, v01 * 3.7, 2, 0.55, 13) + 1) * 0.5;

  const elevation = clamp01(
    macro * 0.40 +
    terrainNoise * 0.26 +
    ridgeNoise * 0.16 +
    coherence * 0.12 -
    boundaryPressure * 0.08
  );

  const polarDistance = Math.abs(v01 - 0.5) * 2;
  const climate = clamp01(
    (1 - polarDistance) * 0.58 +
    (1 - elevation) * 0.16 +
    (1 - boundaryPressure) * 0.08 +
    ((timeState.seasonPhase + 0.25) % 1) * 0.04 +
    moistureNoise * 0.14
  );

  const moisture = clamp01(
    moistureNoise * 0.48 +
    integration * 0.20 +
    (1 - boundaryPressure) * 0.14 +
    (1 - polarDistance) * 0.10 +
    (1 - elevation) * 0.08
  );

  const seaLevel = clamp01(0.46 + boundaryPressure * 0.08 - coherence * 0.05);
  const landMask = elevation > seaLevel ? 1 : 0;
  const waterMask = landMask ? 0 : 1;
  const shorelineMask = clamp01(1 - Math.abs(elevation - seaLevel) / 0.05);
  const accumulation = clamp01(moisture * 0.66 + shorelineMask * 0.34);

  const habitability = clamp01(
    landMask *
    (
      (1 - Math.abs(climate - 0.56)) * 0.36 +
      moisture * 0.30 +
      coherence * 0.22 +
      (1 - boundaryPressure) * 0.12
    )
  );

  const traversalDifficulty = clamp01(
    boundaryPressure * 0.42 +
    (1 - landMask) * 0.24 +
    clamp01((elevation - 0.68) / 0.32) * 0.22 +
    (1 - habitability) * 0.12
  );

  return {
    elevation: stableRound(elevation),
    climate: stableRound(climate),
    moisture: stableRound(moisture),
    seaLevel: stableRound(seaLevel),
    landMask,
    waterMask,
    shorelineMask: stableRound(shorelineMask),
    accumulation: stableRound(accumulation),
    habitability: stableRound(habitability),
    traversalDifficulty: stableRound(traversalDifficulty)
  };
};

const buildDenseSample = (x, y, timeState) => {
  const u01 = (x + 0.5) / GRID;
  const v01 = (y + 0.5) / GRID;
  const kernelCell = sampleKernelCell(u01, v01);
  const metrics = deriveDenseMetrics(u01, v01, kernelCell, timeState);
  const boundary = deriveDenseBoundary(
    kernelCell,
    metrics.habitability,
    metrics.shorelineMask
  );

  const terrainClass = classifyTerrain(
    metrics.elevation,
    metrics.shorelineMask,
    metrics.landMask
  );
  const biomeType = classifyBiome(
    metrics.landMask,
    metrics.climate,
    metrics.moisture
  );
  const climateBand = classifyClimateBand(metrics.climate);
  const surfaceMaterial = classifySurfaceMaterial(
    terrainClass,
    biomeType,
    metrics.landMask
  );

  const threshold = WORLD_KERNEL.api.thresholdEvaluation({
    CT: clamp01(
      Number(kernelCell.force.fields?.coherence || 0) * 0.55 +
      metrics.habitability * 0.45
    ),
    AQ: clamp01(
      boundary.score * 0.55 +
      (1 - metrics.habitability) * 0.25 +
      metrics.waterMask * 0.20
    )
  });

  const globe = denseGlobeProjection(u01, v01);

  const dynamicIllumination = clamp01(
    0.38 +
    (1 - Math.abs(v01 - 0.5) * 2) * 0.24 +
    metrics.habitability * 0.18 +
    (1 - boundary.score) * 0.20
  );

  const dynamicCloudBias = clamp01(metrics.moisture * 0.7 + metrics.waterMask * 0.2);
  const dynamicStormBias = clamp01(boundary.score * 0.55 + dynamicCloudBias * 0.45);
  const dynamicCurrentBias = clamp01(metrics.waterMask * 0.65 + metrics.shorelineMask * 0.35);
  const dynamicAuroraBias = clamp01((1 - metrics.climate) * 0.65 + (1 - metrics.moisture) * 0.10);
  const dynamicGlowBias = clamp01(dynamicIllumination * 0.5 + metrics.habitability * 0.5);

  const receipt = {
    state: {
      i: kernelCell.i,
      j: kernelCell.j
    },
    region: {
      regionId: kernelCell.region.regionId,
      label: kernelCell.region.label
    },
    node: {
      nodeId: kernelCell.node.nodeId,
      label: kernelCell.node.label
    },
    forces: {
      ...kernelCell.force.vector
    },
    boundary: boundary.classification,
    timestamp: 0
  };

  return {
    i: kernelCell.i,
    j: kernelCell.j,
    region: kernelCell.region,
    divide: kernelCell.divide,
    node: kernelCell.node,
    boundary,
    force: kernelCell.force,
    terrainClass,
    biomeType,
    surfaceMaterial,
    climateBand,
    climate: metrics.climate,
    moisture: metrics.moisture,
    accumulation: metrics.accumulation,
    shorelineMask: metrics.shorelineMask,
    landMask: metrics.landMask,
    waterMask: metrics.waterMask,
    habitability: metrics.habitability,
    traversalDifficulty: metrics.traversalDifficulty,
    fields: {
      ...kernelCell.force.fields,
      elevation: metrics.elevation,
      climate: metrics.climate,
      moisture: metrics.moisture,
      shorelineMask: metrics.shorelineMask,
      landMask: metrics.landMask,
      waterMask: metrics.waterMask,
      habitability: metrics.habitability,
      traversalDifficulty: metrics.traversalDifficulty,
      boundaryPressure: boundary.score
    },
    derived: {
      profileId: WORLD_KERNEL.worldProfile.id,
      denseU01: stableRound(u01),
      denseV01: stableRound(v01),
      kernelRegionMargin: kernelCell.region.margin,
      kernelBoundaryScore: kernelCell.boundary.score,
      forceVariance: kernelCell.force.variance,
      seaLevel: metrics.seaLevel
    },
    projections: {
      flat: {
        x: stableRound(u01),
        y: stableRound(v01)
      },
      tree: {
        root: stableRound(kernelCell.region.regionId - 0.5, 6),
        branch: kernelCell.node.primary,
        leaf: stableRound(kernelCell.node.nodeId + 0.5, 6),
        label: kernelCell.node.label
      },
      globe
    },
    receipt,
    threshold,
    dynamicIllumination: stableRound(dynamicIllumination),
    dynamicCloudBias: stableRound(dynamicCloudBias),
    dynamicStormBias: stableRound(dynamicStormBias),
    dynamicCurrentBias: stableRound(dynamicCurrentBias),
    dynamicAuroraBias: stableRound(dynamicAuroraBias),
    dynamicGlowBias: stableRound(dynamicGlowBias),
    motionState: {
      yaw: 0,
      pitch: 0,
      yawVelocity: 0,
      pitchVelocity: 0,
      orbitPhase: 0,
      mode: "baseline"
    }
  };
};

let CACHED_FIELD = null;

const buildStaticField = () => {
  if (CACHED_FIELD) return CACHED_FIELD;

  const rows = [];
  let bestSpawn = { x: Math.floor(GRID / 2), y: Math.floor(GRID / 2), score: -Infinity };
  const terrainCounts = {};
  const biomeCounts = {};

  for (let y = 0; y < GRID; y += 1) {
    const row = [];
    for (let x = 0; x < GRID; x += 1) {
      const sample = buildDenseSample(x, y, buildTimeState({ elapsedSeconds: 0 }));
      row.push(sample);

      terrainCounts[sample.terrainClass] = (terrainCounts[sample.terrainClass] || 0) + 1;
      biomeCounts[sample.biomeType] = (biomeCounts[sample.biomeType] || 0) + 1;

      const centerBias =
        1 -
        Math.min(
          1,
          Math.hypot(x - GRID / 2, y - GRID / 2) / (Math.sqrt(2) * GRID / 2)
        );

      const spawnScore =
        (sample.threshold.action === "PASS" ? 0.52 : 0) +
        (sample.boundary.classification !== "BLOCK" ? 0.20 : 0) +
        sample.habitability * 0.20 +
        centerBias * 0.08;

      if (spawnScore > bestSpawn.score) {
        bestSpawn = { x, y, score: spawnScore };
      }
    }
    rows.push(row);
  }

  const field = {
    width: GRID,
    height: GRID,
    samples: rows,
    summary: {
      grid: GRID,
      kernelGrid: KERNEL_GRID,
      profileId: WORLD_KERNEL.worldProfile.id,
      defaultCursor: {
        x: bestSpawn.x,
        y: bestSpawn.y
      },
      terrainCounts,
      biomeCounts
    },
    motionContract: {
      deterministic: true,
      successorReceiptMode: "disabled_in_baseline",
      perFrameRebuild: false
    },
    timeState: buildTimeState({ elapsedSeconds: 0 })
  };

  CACHED_FIELD = deepFreeze(field);
  return CACHED_FIELD;
};

export function createPlanetEngine() {
  return deepFreeze({
    meta: ENGINE_META,
    buildPlanetFrame(frameState = {}) {
      const field = buildStaticField();
      const timeState = buildTimeState(frameState);

      return deepFreeze({
        ...field,
        timeState
      });
    }
  });
}

const DEFAULT_ENGINE = createPlanetEngine();

export const buildPlanetFrame = (frameState = {}) =>
  DEFAULT_ENGINE.buildPlanetFrame(frameState);

export default DEFAULT_ENGINE;
