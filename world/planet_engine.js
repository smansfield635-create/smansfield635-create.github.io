import { WORLD_KERNEL } from "./world_kernel.js";

/*
PLANET_ENGINE_vNEXT
- Canon-first
- No legacy localGrid usage
- Direct kernel consumption
- No duplicate buildPlanetField bindings
*/

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeKernel() {
  const kernel = WORLD_KERNEL && typeof WORLD_KERNEL === "object" ? WORLD_KERNEL : {};
  const constants = kernel.constants && typeof kernel.constants === "object" ? kernel.constants : {};

  const width =
    Number.isInteger(kernel.width) ? kernel.width :
    Number.isInteger(kernel?.planetField?.width) ? kernel.planetField.width :
    Number.isInteger(constants.lonSteps) ? constants.lonSteps :
    256;

  const height =
    Number.isInteger(kernel.height) ? kernel.height :
    Number.isInteger(kernel?.planetField?.height) ? kernel.planetField.height :
    Number.isInteger(constants.latSteps) ? constants.latSteps :
    256;

  const seaLevel =
    typeof kernel.seaLevel === "number" && Number.isFinite(kernel.seaLevel)
      ? kernel.seaLevel
      : 0;

  const continents = Array.isArray(kernel.continents) ? kernel.continents : [];

  return Object.freeze({
    width,
    height,
    seaLevel,
    continents
  });
}

function makeGrid(width, height) {
  const latStep = 180 / Math.max(1, height - 1);
  const lonStep = 360 / Math.max(1, width);

  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      latDeg: 90 - y * latStep,
      lonDeg: -180 + x * lonStep
    }))
  );
}

function pickContinent(cell, kernel) {
  let best = null;
  let bestScore = -Infinity;

  for (const continent of kernel.continents) {
    const lat = typeof continent?.lat === "number" ? continent.lat : 0;
    const lon = typeof continent?.lon === "number" ? continent.lon : 0;
    const weight = typeof continent?.weight === "number" ? continent.weight : 0;
    const falloff = typeof continent?.falloff === "number" ? continent.falloff : 0.01;

    const dLat = cell.latDeg - lat;
    const dLon = cell.lonDeg - lon;
    const dist = Math.sqrt((dLat * dLat) + (dLon * dLon));
    const score = weight - dist * falloff;

    if (score > bestScore) {
      bestScore = score;
      best = continent;
    }
  }

  return best;
}

function computeElevation(cell, continent) {
  if (!continent) return -0.2;

  const base =
    typeof continent?.elevationBase === "number" ? continent.elevationBase : 0.2;
  const variance =
    typeof continent?.elevationVariance === "number" ? continent.elevationVariance : 0.15;

  const noise =
    Math.sin(cell.latDeg * 0.1 + cell.lonDeg * 0.13) *
    Math.cos(cell.lonDeg * 0.07);

  return clamp(base + noise * variance, -1, 1);
}

function makeSample(cell, kernel) {
  const continent = pickContinent(cell, kernel);
  const elevation = computeElevation(cell, continent);
  const landMask = elevation > kernel.seaLevel ? 1 : 0;
  const waterMask = 1 - landMask;

  return Object.freeze({
    ...cell,
    elevation,
    baseElevation: elevation,
    seaLevel: kernel.seaLevel,
    landMask,
    waterMask,
    terrainClass: landMask === 1 ? "LOWLAND" : "WATER",
    biomeType: "NONE",
    surfaceMaterial: "NONE",
    rainfall: 0,
    temperature: 0,
    slope: 0,
    continentId: continent && continent.id ? continent.id : "OCEAN",
    eventFlags: Object.freeze([])
  });
}

function makeSamples(kernel) {
  const grid = makeGrid(kernel.width, kernel.height);

  return Object.freeze(
    grid.map((row) =>
      Object.freeze(
        row.map((cell) => makeSample(cell, kernel))
      )
    )
  );
}

function makeSummary(samples) {
  let landCount = 0;
  let waterCount = 0;

  for (const row of samples) {
    for (const sample of row) {
      if (sample.landMask === 1) landCount += 1;
      else waterCount += 1;
    }
  }

  return Object.freeze({
    sampleCount: landCount + waterCount,
    landCount,
    waterCount
  });
}

function assemblePlanetField(kernel) {
  const samples = makeSamples(kernel);

  return Object.freeze({
    width: kernel.width,
    height: kernel.height,
    samples,
    summary: makeSummary(samples)
  });
}

export function createPlanetEngine() {
  const kernel = normalizeKernel();

  function buildField() {
    return assemblePlanetField(kernel);
  }

  return Object.freeze({
    buildPlanetField: buildField
  });
}

const DEFAULT_ENGINE = createPlanetEngine();

export function buildPlanetField() {
  return DEFAULT_ENGINE.buildPlanetField();
}
