import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function toNumber(value, fallback = 0) {
  return isFiniteNumber(value) ? value : fallback;
}

function wrapLongitude(lonDeg) {
  let value = lonDeg;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function buildCoordinateMaps(width, height) {
  const latStep = 180 / Math.max(1, height - 1);
  const lonStep = 360 / Math.max(1, width);

  return Object.freeze({
    latAt(y) {
      return 90 - y * latStep;
    },
    lonAt(x) {
      return wrapLongitude(-180 + x * lonStep);
    }
  });
}

function normalizeTerrainField(input, width, height) {
  const source = normalizeObject(input);
  const samples = source.samples;

  const map = new Map();

  if (Array.isArray(samples)) {
    const first = samples[0];

    if (Array.isArray(first)) {
      for (let y = 0; y < Math.min(height, samples.length); y += 1) {
        const row = Array.isArray(samples[y]) ? samples[y] : [];
        for (let x = 0; x < Math.min(width, row.length); x += 1) {
          map.set(`${x}:${y}`, normalizeObject(row[x]));
        }
      }
    } else {
      for (const rawSample of samples) {
        const sample = normalizeObject(rawSample);
        const x = Number.isInteger(sample.x) ? sample.x : null;
        const y = Number.isInteger(sample.y) ? sample.y : null;
        if (x === null || y === null) continue;
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        map.set(`${x}:${y}`, sample);
      }
    }
  }

  return Object.freeze({
    getSample(x, y) {
      return map.get(`${x}:${y}`) ?? null;
    }
  });
}

function createBaseSample(x, y, latDeg, lonDeg, terrainSeed) {
  const terrain = normalizeObject(terrainSeed);
  const visible = terrain.visible !== false;

  return {
    x,
    y,
    latDeg,
    lonDeg,
    visible,

    elevation: toNumber(terrain.elevation, 0),
    seaLevel: toNumber(terrain.seaLevel, 0),
    terrainClass: typeof terrain.terrainClass === "string" ? terrain.terrainClass : "unknown",
    shoreline: terrain.shoreline === true,
    continentMass: toNumber(terrain.continentMass, 0),

    slope: 0,
    curvature: 0,
    ridgeStrength: 0,
    basinStrength: 0,
    divideStrength: 0,
    plateauStrength: 0,
    canyonStrength: 0,
    cavePotential: 0,

    temperature: 0,
    thermalGradient: 0,
    freezePotential: 0,
    meltPotential: 0,
    evaporationPressure: 0,

    rainfall: 0,
    runoff: 0,
    basinAccumulation: 0,
    drainage: "none",
    riverCandidate: false,
    lakeCandidate: false,

    magneticIntensity: 0,
    shieldingGradient: 0,
    auroralPotential: 0,
    navigationBias: "N",
    navigationStability: 0,

    materialType: "mixed",
    diamondDensity: 0,
    opalDensity: 0,
    graniteDensity: 0,
    marbleDensity: 0,
    metalDensity: 0,

    sedimentType: "none",
    sedimentLoad: 0,
    transportPotential: 0,
    depositionPotential: 0,

    eventFlags: Object.freeze([])
  };
}

function enrichLithosphere(sample) {
  const absLat = Math.abs(sample.latDeg) / 90;
  const elevationBias = clamp((sample.elevation - sample.seaLevel) * 0.7 + 0.5, 0, 1);
  const mountainBias = clamp(elevationBias * 0.7 + absLat * 0.3, 0, 1);

  const diamondDensity = clamp(0.18 + mountainBias * 0.55, 0, 1);
  const opalDensity = clamp(0.28 + (1 - absLat) * 0.35, 0, 1);
  const graniteDensity = clamp(0.22 + (1 - mountainBias) * 0.25, 0, 1);
  const marbleDensity = clamp(0.08 + (1 - elevationBias) * 0.18, 0, 1);
  const metalDensity = clamp(0.03 + mountainBias * 0.12, 0, 1);

  let materialType = "mixed";
  if (diamondDensity >= opalDensity && diamondDensity >= graniteDensity) materialType = "diamond";
  else if (opalDensity >= graniteDensity) materialType = "opal";
  else materialType = "granite";

  return {
    ...sample,
    materialType,
    diamondDensity,
    opalDensity,
    graniteDensity,
    marbleDensity,
    metalDensity
  };
}

function getElevation(grid, x, y) {
  return grid[y]?.[x]?.elevation ?? 0;
}

function enrichTopology(grid, x, y, constants) {
  const sample = grid[y][x];
  const center = sample.elevation;
  const left = getElevation(grid, Math.max(0, x - 1), y);
  const right = getElevation(grid, Math.min(grid[0].length - 1, x + 1), y);
  const up = getElevation(grid, x, Math.max(0, y - 1));
  const down = getElevation(grid, x, Math.min(grid.length - 1, y + 1));

  const dx = right - left;
  const dy = down - up;
  const slope = clamp(Math.sqrt(dx * dx + dy * dy), 0, 1);

  const meanNeighbor = (left + right + up + down) / 4;
  const curvature = clamp(center - meanNeighbor, -1, 1);

  const ridgeStrength = clamp(curvature > 0 ? curvature : 0, 0, 1);
  const basinStrength = clamp(curvature < 0 ? -curvature : 0, 0, 1);
  const divideStrength = clamp(Math.abs(dx - dy), 0, 1);
  const plateauStrength = clamp(center > constants.topologyMountainThreshold ? 1 - slope : 0, 0, 1);
  const canyonStrength = clamp(
    slope > constants.topologyCanyonThreshold ? basinStrength * slope : 0,
    0,
    1
  );
  const cavePotential = clamp(
    basinStrength * 0.45 + sample.marbleDensity * 0.3 + sample.opalDensity * 0.15,
    0,
    1
  );

  const shoreline =
    sample.terrainClass === "water"
      ? false
      : [left, right, up, down].some((value) => value <= sample.seaLevel);

  let terrainClass = sample.terrainClass;
  if (terrainClass === "unknown") {
    if (center <= sample.seaLevel) terrainClass = "water";
    else if (ridgeStrength > 0.5 && center > constants.topologyMountainThreshold) terrainClass = "mountain";
    else if (basinStrength > 0.45) terrainClass = "basin";
    else terrainClass = "land";
  }

  const continentMass = clamp(
    sample.terrainClass === "water" || terrainClass === "water" ? 0 : 0.35 + center * 0.65,
    0,
    1
  );

  return {
    ...sample,
    shoreline,
    terrainClass,
    continentMass,
    slope,
    curvature,
    ridgeStrength,
    basinStrength,
    divideStrength,
    plateauStrength,
    canyonStrength,
    cavePotential
  };
}

function enrichThermodynamics(sample, constants) {
  const absLat = Math.abs(sample.latDeg) / 90;
  const polarCooling = Math.pow(absLat, 1.35) * constants.thermalPolarCoolingStrength;
  const elevationCooling = clamp((sample.elevation - sample.seaLevel) * 0.35, 0, 0.32);
  const materialRetention = clamp(sample.diamondDensity * 0.06 + sample.opalDensity * 0.04, 0, 0.12);
  const terrainExposure = clamp(sample.slope * 0.08 + sample.divideStrength * 0.05, 0, 0.16);
  const wildernessDecay = clamp(
    (1 - sample.continentMass) * constants.thermalWildernessDecayStrength,
    0,
    1
  );

  const temperature = clamp(
    constants.thermalBaseline +
      materialRetention -
      polarCooling -
      elevationCooling -
      terrainExposure -
      wildernessDecay * 0.18,
    0,
    1
  );

  const freezePotential = clamp((0.42 - temperature) / 0.42, 0, 1);
  const meltPotential = clamp((temperature - 0.38) / 0.42, 0, 1);
  const evaporationPressure = clamp((temperature - 0.28) / 0.52, 0, 1);
  const thermalGradient = clamp(polarCooling + elevationCooling + terrainExposure, 0, 1);

  return {
    ...sample,
    temperature,
    thermalGradient,
    freezePotential,
    meltPotential,
    evaporationPressure
  };
}

function determineDrainage(sample, left, right, up, down) {
  const targets = [
    { key: "west", value: left?.elevation ?? sample.elevation },
    { key: "east", value: right?.elevation ?? sample.elevation },
    { key: "north", value: up?.elevation ?? sample.elevation },
    { key: "south", value: down?.elevation ?? sample.elevation }
  ];

  targets.sort((a, b) => a.value - b.value);
  if (targets[0].value >= sample.elevation) return "none";
  return targets[0].key;
}

function enrichHydrology(grid, x, y, constants) {
  const sample = grid[y][x];
  const left = grid[y]?.[Math.max(0, x - 1)] ?? null;
  const right = grid[y]?.[Math.min(grid[0].length - 1, x + 1)] ?? null;
  const up = grid[Math.max(0, y - 1)]?.[x] ?? null;
  const down = grid[Math.min(grid.length - 1, y + 1)]?.[x] ?? null;

  const rainfall = clamp(
    0.18 +
      sample.evaporationPressure * 0.42 +
      sample.basinStrength * 0.12 +
      (sample.shoreline ? 0.14 : 0),
    0,
    1
  );

  const runoff = clamp(
    rainfall * constants.hydrologyRunoffStrength +
      sample.slope * 0.24 +
      sample.freezePotential * 0.08,
    0,
    1
  );

  const basinAccumulation = clamp(
    sample.basinStrength * 0.6 +
      rainfall * 0.2 +
      (sample.terrainClass === "water" ? 0.2 : 0),
    0,
    1
  );

  const drainage = determineDrainage(sample, left, right, up, down);
  const riverCandidate =
    runoff >= constants.hydrologyRiverThreshold && sample.terrainClass !== "water";
  const lakeCandidate =
    basinAccumulation >= constants.hydrologyLakeThreshold && sample.terrainClass !== "water";

  return {
    ...sample,
    rainfall,
    runoff,
    basinAccumulation,
    drainage,
    riverCandidate,
    lakeCandidate
  };
}

function enrichMagnetics(sample, constants) {
  const absLat = Math.abs(sample.latDeg) / 90;
  const polarBias = Math.pow(absLat, 0.72);
  const mountainAmplifier = clamp(sample.elevation * 0.22 + sample.diamondDensity * 0.1, 0, 0.22);

  const magneticIntensity = clamp(
    constants.magneticBaseline + polarBias * 0.5 + mountainAmplifier,
    0,
    1
  );
  const shieldingGradient = clamp(0.25 + magneticIntensity * 0.68, 0, 1);
  const auroralPotential = clamp(Math.pow(polarBias, 1.6) * 0.82 + sample.opalDensity * 0.08, 0, 1);

  const navigationBias =
    sample.latDeg > 12 ? "N"
      : sample.latDeg < -12 ? "S"
      : sample.lonDeg >= 0 ? "E"
      : "W";

  const navigationStability = clamp(0.35 + magneticIntensity * 0.5 - sample.canyonStrength * 0.15, 0, 1);

  return {
    ...sample,
    magneticIntensity,
    shieldingGradient,
    auroralPotential,
    navigationBias,
    navigationStability
  };
}

function enrichSediment(sample) {
  const transportPotential = clamp(
    sample.runoff * 0.45 + sample.slope * 0.3 + sample.meltPotential * 0.15,
    0,
    1
  );
  const depositionPotential = clamp(
    sample.basinAccumulation * 0.5 +
      (1 - sample.slope) * 0.22 +
      sample.freezePotential * 0.08 +
      (sample.shoreline ? 0.2 : 0),
    0,
    1
  );

  let sedimentType = "mixed";
  if (sample.diamondDensity > 0.58 && depositionPotential > 0.45) sedimentType = "diamond_sand";
  else if (sample.opalDensity > 0.5 && transportPotential > 0.35) sedimentType = "opal_dust";
  else if (sample.graniteDensity > 0.42) sedimentType = "stone_sediment";
  else if (sample.terrainClass === "water") sedimentType = "marine_sediment";

  const sedimentLoad = clamp(
    transportPotential * 0.62 + depositionPotential * 0.28 + sample.metalDensity * 0.08,
    0,
    1
  );

  return {
    ...sample,
    sedimentType,
    sedimentLoad,
    transportPotential,
    depositionPotential
  };
}

function finalizeSample(sample) {
  const terrainClass =
    sample.terrainClass === "unknown"
      ? sample.elevation <= sample.seaLevel ? "water" : "land"
      : sample.terrainClass;

  return Object.freeze({
    ...sample,
    terrainClass,
    eventFlags: Object.freeze(Array.isArray(sample.eventFlags) ? [...sample.eventFlags] : [])
  });
}

function buildSummary(grid) {
  const summary = {
    sampleCount: 0,
    landCount: 0,
    waterCount: 0,
    shorelineCount: 0,

    mountainCount: 0,
    basinCount: 0,
    canyonCount: 0,
    caveCandidateCount: 0,

    temperatureAverage: 0,
    rainfallAverage: 0,
    runoffAverage: 0,

    magneticAverage: 0,
    auroralAverage: 0,

    diamondAverage: 0,
    opalAverage: 0,
    sedimentAverage: 0
  };

  let temperatureTotal = 0;
  let rainfallTotal = 0;
  let runoffTotal = 0;
  let magneticTotal = 0;
  let auroralTotal = 0;
  let diamondTotal = 0;
  let opalTotal = 0;
  let sedimentTotal = 0;

  for (const row of grid) {
    for (const sample of row) {
      summary.sampleCount += 1;
      if (sample.terrainClass === "water") summary.waterCount += 1;
      else summary.landCount += 1;
      if (sample.shoreline) summary.shorelineCount += 1;

      if (sample.ridgeStrength > 0.5 && sample.elevation > sample.seaLevel) summary.mountainCount += 1;
      if (sample.basinStrength > 0.45) summary.basinCount += 1;
      if (sample.canyonStrength > 0.45) summary.canyonCount += 1;
      if (sample.cavePotential > 0.5) summary.caveCandidateCount += 1;

      temperatureTotal += sample.temperature;
      rainfallTotal += sample.rainfall;
      runoffTotal += sample.runoff;
      magneticTotal += sample.magneticIntensity;
      auroralTotal += sample.auroralPotential;
      diamondTotal += sample.diamondDensity;
      opalTotal += sample.opalDensity;
      sedimentTotal += sample.sedimentLoad;
    }
  }

  const count = Math.max(1, summary.sampleCount);
  summary.temperatureAverage = temperatureTotal / count;
  summary.rainfallAverage = rainfallTotal / count;
  summary.runoffAverage = runoffTotal / count;
  summary.magneticAverage = magneticTotal / count;
  summary.auroralAverage = auroralTotal / count;
  summary.diamondAverage = diamondTotal / count;
  summary.opalAverage = opalTotal / count;
  summary.sedimentAverage = sedimentTotal / count;

  return Object.freeze(summary);
}

function buildCompleteness() {
  return Object.freeze({
    samples: true,
    lithosphere: true,
    topology: true,
    thermodynamics: true,
    hydrology: true,
    magnetics: true,
    sediment: true
  });
}

export function createPlanetEngine() {
  const contract = WORLD_KERNEL.planetField;
  const constants = WORLD_KERNEL.constants;
  const width = contract.width;
  const height = contract.height;
  const coordinates = buildCoordinateMaps(width, height);

  function buildPlanetField(inputState = {}) {
    const state = normalizeObject(inputState);
    const normalizedTerrain = normalizeTerrainField(state.terrainField, width, height);

    const stage0 = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => {
        const latDeg = coordinates.latAt(y);
        const lonDeg = coordinates.lonAt(x);
        const terrainSeed = normalizedTerrain.getSample(x, y);
        return createBaseSample(x, y, latDeg, lonDeg, terrainSeed);
      })
    );

    const stage1 = stage0.map((row) => row.map((sample) => enrichLithosphere(sample)));

    const stage2 = stage1.map((row, y, grid) =>
      row.map((_, x) => enrichTopology(grid, x, y, constants))
    );

    const stage3 = stage2.map((row) => row.map((sample) => enrichThermodynamics(sample, constants)));

    const stage4 = stage3.map((row, y, grid) =>
      row.map((_, x) => enrichHydrology(grid, x, y, constants))
    );

    const stage5 = stage4.map((row) => row.map((sample) => enrichMagnetics(sample, constants)));

    const stage6 = stage5.map((row) => row.map((sample) => enrichSediment(sample)));

    const finalizedRows = stage6.map((row) => Object.freeze(row.map((sample) => finalizeSample(sample))));
    const samples = Object.freeze(finalizedRows);
    const summary = buildSummary(samples);
    const completeness = buildCompleteness();

    return Object.freeze({
      width,
      height,
      samples,
      summary,
      completeness
    });
  }

  return Object.freeze({
    buildPlanetField
  });
}

const DEFAULT_PLANET_ENGINE = createPlanetEngine();

export function buildPlanetField(inputState = {}) {
  return DEFAULT_PLANET_ENGINE.buildPlanetField(inputState);
}
