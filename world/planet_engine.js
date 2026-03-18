import { WORLD_KERNEL } from "./world_kernel.js";

/*
PLANET_ENGINE_vNEXT
- Canon-first
- No legacy localGrid usage
- Direct kernel consumption
*/

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function buildGrid(width, height) {
  const latStep = 180 / (height - 1);
  const lonStep = 360 / width;

  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      const latDeg = 90 - y * latStep;
      const lonDeg = -180 + x * lonStep;

      return {
        x,
        y,
        latDeg,
        lonDeg
      };
    })
  );
}

function resolveContinent(sample, kernel) {
  const anchors = Array.isArray(kernel?.continents) ? kernel.continents : [];

  let best = null;
  let bestScore = -Infinity;

  for (const c of anchors) {
    const dLat = sample.latDeg - c.lat;
    const dLon = sample.lonDeg - c.lon;
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    const score = c.weight - dist * c.falloff;

    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }

  return best;
}

function resolveElevation(sample, continent) {
  if (!continent) return -0.2;

  const base = continent.elevationBase;
  const variance = continent.elevationVariance;

  const n =
    Math.sin(sample.latDeg * 0.1 + sample.lonDeg * 0.13) *
    Math.cos(sample.lonDeg * 0.07);

  return clamp(base + n * variance, -1, 1);
}

function resolveLandWater(elevation, seaLevel) {
  return elevation > seaLevel ? 1 : 0;
}

function buildSample(sample, kernel) {
  const continent = resolveContinent(sample, kernel);
  const elevation = resolveElevation(sample, continent);
  const seaLevel = typeof kernel?.seaLevel === "number" ? kernel.seaLevel : 0;
  const landMask = resolveLandWater(elevation, seaLevel);
  const waterMask = 1 - landMask;

  return Object.freeze({
    ...sample,
    elevation,
    baseElevation: elevation,
    seaLevel,
    landMask,
    waterMask,
    terrainClass: landMask ? "LOWLAND" : "WATER",
    biomeType: "NONE",
    surfaceMaterial: "NONE",
    rainfall: 0,
    temperature: 0,
    slope: 0,
    continentId: continent ? continent.id : "OCEAN",
    eventFlags: Object.freeze([])
  });
}

function buildSamples(kernel) {
  const width = kernel.width;
  const height = kernel.height;
  const grid = buildGrid(width, height);

  return Object.freeze(
    grid.map((row) =>
      Object.freeze(row.map((cell) => buildSample(cell, kernel)))
    )
  );
}

function buildSummary(samples) {
  let land = 0;
  let water = 0;

  for (const row of samples) {
    for (const s of row) {
      if (s.landMask) land += 1;
      else water += 1;
    }
  }

  return Object.freeze({
    sampleCount: land + water,
    landCount: land,
    waterCount: water
  });
}

function buildPlanetFieldInternal(kernel) {
  const width = Number.isInteger(kernel?.width) ? kernel.width : 256;
  const height = Number.isInteger(kernel?.height) ? kernel.height : 256;
  const normalizedKernel = {
    ...kernel,
    width,
    height
  };

  const samples = buildSamples(normalizedKernel);

  return Object.freeze({
    width,
    height,
    samples,
    summary: buildSummary(samples)
  });
}

export function createPlanetEngine() {
  function buildPlanetField() {
    return buildPlanetFieldInternal(WORLD_KERNEL);
  }

  return Object.freeze({
    buildPlanetField
  });
}

const DEFAULT_ENGINE = createPlanetEngine();

export function buildPlanetField() {
  return DEFAULT_ENGINE.buildPlanetField();
}
