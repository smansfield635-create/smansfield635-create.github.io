// /assets/audralia.planet.render-hydration.js
// AUDRALIA_G1_PLANET_RENDER_HYDRATION_CHILD_TNT_v1
// Parent authority: /assets/AdreliaPlanetRendered.js
// Direct upstream sibling dependency: /assets/audralia.planet.render-topography.js
// Role: direct downstream hydration child for Audralia planet render.
// Scope: water science only. No climate, ecology, fauna, HTML, route, Earth, Sun, Moon, or final rendering.

import {
  createTopographyProfile,
  sampleTopography,
  buildTopographyField,
  getTopographySampleFromField
} from "/assets/audralia.planet.render-topography.js";

const RECEIPT = "AUDRALIA_G1_PLANET_RENDER_HYDRATION_CHILD_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";
const PARENT_AUTHORITY = "/assets/AdreliaPlanetRendered.js";
const CHILD_FILE = "/assets/audralia.planet.render-hydration.js";
const TOPOGRAPHY_CHILD_FILE = "/assets/audralia.planet.render-topography.js";

const DEFAULT_PROFILE = Object.freeze({
  receipt: RECEIPT,
  planetaryObject: PLANETARY_OBJECT,
  generation: GENERATION,
  parentAuthority: PARENT_AUTHORITY,
  childFile: CHILD_FILE,
  upstreamTopography: TOPOGRAPHY_CHILD_FILE,
  layer: "hydration",

  lattice: 256,
  seaLevelMeters: 0,
  oceanFloorLimitMeters: -7200,
  shallowShelfLimitMeters: -350,
  coastalBandMeters: 420,
  riverElevationMinMeters: 80,
  riverElevationMaxMeters: 4200,
  glacierLatitudeStart: 0.68,
  glacierMountainStartMeters: 3600,

  ownsTopography: false,
  ownsHydration: true,
  ownsClimate: false,
  ownsEcology: false,
  ownsFauna: false,
  ownsRoute: false,
  ownsHtml: false,
  ownsFinalRender: false
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeInput(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y, seed = 0) {
  return fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123);
}

function valueNoise(x, y, seed = 0) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = fract(x);
  const fy = fract(y);

  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);

  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);

  return mix(mix(a, b, ux), mix(c, d, ux), uy);
}

function fbm(x, y, seed = 0, octaves = 4) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 23.23) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
}

function getTopographyForPoint(u, v, profile, topographyField) {
  if (topographyField) {
    return getTopographySampleFromField(topographyField, u, v);
  }

  const topographyProfile = createTopographyProfile({
    lattice: profile.lattice
  });

  return sampleTopography(u, v, topographyProfile);
}

function classifyWaterBody(topography, waterDepthMeters, coast, shelf, glacier, riverPotential) {
  if (glacier > 0.72) return "glacier_ice";
  if (waterDepthMeters > 4200) return "deep_ocean";
  if (waterDepthMeters > 900) return "open_ocean";
  if (waterDepthMeters > 0 && shelf > 0.42) return "continental_shelf_sea";
  if (waterDepthMeters > 0) return "shallow_sea";
  if (coast > 0.48) return "coastal_edge";
  if (riverPotential > 0.62) return "river_corridor";
  if (topography.basinPermission > 0.55 && topography.elevationMeters > 0) return "inland_basin";
  return "dry_land";
}

export function createHydrationProfile(overrides = {}) {
  return Object.freeze({
    ...DEFAULT_PROFILE,
    ...overrides,
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    layer: "hydration"
  });
}

export function sampleHydration(u, v, options = {}) {
  const profile = createHydrationProfile(options.profile || {});
  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  const topography = options.topographySample || getTopographyForPoint(
    safeU,
    safeV,
    profile,
    options.topographyField
  );

  const elevationMeters = topography.elevationMeters;
  const seaLevelDelta = profile.seaLevelMeters - elevationMeters;

  const isOcean = seaLevelDelta > 0;
  const waterDepthMeters = isOcean ? Math.round(seaLevelDelta) : 0;

  const normalizedDepth = clamp(
    waterDepthMeters / Math.abs(profile.oceanFloorLimitMeters),
    0,
    1
  );

  const shelf = isOcean
    ? clamp(1 - waterDepthMeters / Math.abs(profile.shallowShelfLimitMeters), 0, 1)
    : clamp(topography.shelfPermission || 0, 0, 1);

  const coast = clamp(
    1 - Math.abs(elevationMeters - profile.seaLevelMeters) / profile.coastalBandMeters,
    0,
    1
  );

  const polarGlacier = smoothstep(
    profile.glacierLatitudeStart,
    0.96,
    Math.abs(topography.lat)
  );

  const mountainGlacier = smoothstep(
    profile.glacierMountainStartMeters,
    6800,
    elevationMeters
  );

  const glacier = clamp(Math.max(polarGlacier, mountainGlacier) * (isOcean ? 0.25 : 1), 0, 1);

  const drainageNoise = fbm(topography.lon * 9.0 + 13.2, topography.lat * 9.0 - 3.8, 501, 5);
  const riverElevationBand =
    smoothstep(profile.riverElevationMinMeters, 900, elevationMeters) *
    (1 - smoothstep(2600, profile.riverElevationMaxMeters, elevationMeters));

  const riverPotential = !isOcean
    ? clamp(
        riverElevationBand *
        topography.slope *
        (topography.basinPermission * 0.48 + topography.mountainPermission * 0.52) *
        (0.72 + drainageNoise * 0.42),
        0,
        1
      )
    : 0;

  const lakePotential = !isOcean
    ? clamp(
        topography.basinPermission *
        (1 - topography.slope) *
        smoothstep(-80, 1200, elevationMeters) *
        (0.7 + drainageNoise * 0.3),
        0,
        1
      )
    : 0;

  const wetEdge = clamp(Math.max(coast, riverPotential * 0.72, lakePotential * 0.58), 0, 1);

  const waterBody = classifyWaterBody(
    topography,
    waterDepthMeters,
    coast,
    shelf,
    glacier,
    riverPotential
  );

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    layer: "hydration",

    u: safeU,
    v: safeV,
    lon: topography.lon,
    lat: topography.lat,

    topography,

    seaLevelMeters: profile.seaLevelMeters,
    elevationMeters,

    isOcean,
    isLandWater: !isOcean && (riverPotential > 0.48 || lakePotential > 0.52),
    waterDepthMeters,
    normalizedDepth,

    shelfWaterPermission: shelf,
    coastalPermission: coast,
    wetEdgePermission: wetEdge,
    riverPermission: riverPotential,
    lakePermission: lakePotential,
    glacierPermission: glacier,

    waterBody,

    ownsTopography: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    renderColor: null
  });
}

export function buildHydrationField(options = {}) {
  const profile = createHydrationProfile(options.profile || {});
  const width = Math.max(8, Math.floor(options.width || profile.lattice || 256));
  const height = Math.max(8, Math.floor(options.height || profile.lattice || 256));

  const topographyField = options.topographyField || buildTopographyField({
    width,
    height,
    profile: {
      lattice: profile.lattice
    }
  });

  const samples = new Array(width * height);

  let oceanSamples = 0;
  let shelfSamples = 0;
  let coastSamples = 0;
  let riverSamples = 0;
  let lakeSamples = 0;
  let glacierSamples = 0;
  let maxWaterDepthMeters = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      const v = y / (height - 1);

      const sample = sampleHydration(u, v, {
        profile,
        topographyField
      });

      const index = y * width + x;
      samples[index] = sample;

      if (sample.isOcean) oceanSamples += 1;
      if (sample.shelfWaterPermission > 0.45) shelfSamples += 1;
      if (sample.coastalPermission > 0.45) coastSamples += 1;
      if (sample.riverPermission > 0.5) riverSamples += 1;
      if (sample.lakePermission > 0.5) lakeSamples += 1;
      if (sample.glacierPermission > 0.5) glacierSamples += 1;

      maxWaterDepthMeters = Math.max(maxWaterDepthMeters, sample.waterDepthMeters);
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    layer: "hydration",

    width,
    height,
    profile,
    topographyField,
    samples,

    stats: Object.freeze({
      oceanSampleRatio: oceanSamples / samples.length,
      shelfSampleRatio: shelfSamples / samples.length,
      coastSampleRatio: coastSamples / samples.length,
      riverSampleRatio: riverSamples / samples.length,
      lakeSampleRatio: lakeSamples / samples.length,
      glacierSampleRatio: glacierSamples / samples.length,
      maxWaterDepthMeters
    }),

    downstreamForParent: true,
    parentMustCompose: true
  });
}

export function getHydrationSampleFromField(field, u, v) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleHydration(u, v);
  }

  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  const x = clamp(Math.round(safeU * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(safeV * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getHydrationStatus() {
  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    upstreamTopography: TOPOGRAPHY_CHILD_FILE,
    layer: "hydration",

    downstreamChild: true,
    randomAsset: false,
    parentRenderRequired: true,

    ownsTopography: false,
    ownsHydration: true,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRoute: false,
    ownsHtml: false,
    ownsEarth: false,
    ownsSun: false,
    ownsMoon: false,
    ownsFinalRender: false,

    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createHydrationProfile,
  sampleHydration,
  buildHydrationField,
  getHydrationSampleFromField,
  getHydrationStatus
});
