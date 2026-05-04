// /assets/audralia.planet.render-topography.js
// AUDRALIA_G1_PLANET_RENDER_TOPOGRAPHY_CHILD_TNT_v1
// Parent authority: /assets/AdreliaPlanetRendered.js
// Role: direct downstream topography child for Audralia planet render.
// Scope: terrain science only. No hydration, climate, ecology, fauna, HTML, route, Earth, Sun, Moon, or final rendering.

const RECEIPT = "AUDRALIA_G1_PLANET_RENDER_TOPOGRAPHY_CHILD_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";
const PARENT_AUTHORITY = "/assets/AdreliaPlanetRendered.js";
const CHILD_FILE = "/assets/audralia.planet.render-topography.js";

const DEFAULT_PROFILE = Object.freeze({
  receipt: RECEIPT,
  planetaryObject: PLANETARY_OBJECT,
  generation: GENERATION,
  parentAuthority: PARENT_AUTHORITY,
  childFile: CHILD_FILE,
  layer: "topography",

  mapStandard: "spherical-normalized-sampling",
  lattice: 256,

  radiusKm: 6371,
  seaLevelReferenceMeters: 0,
  elevationMinMeters: -7200,
  elevationMaxMeters: 9100,

  plateCount: 9,
  summitCount: 9,
  basinCount: 7,

  ownsTopography: true,
  ownsHydration: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFauna: false,
  ownsRoute: false,
  ownsHtml: false,
  ownsFinalRender: false
});

const PLATE_ANCHORS = Object.freeze([
  { id: "PLATE_NORTH_CROWN", lon: -0.16, lat: 0.72, lift: 0.44, drift: 0.21 },
  { id: "PLATE_EAST_SHELF", lon: 0.56, lat: 0.18, lift: 0.18, drift: -0.12 },
  { id: "PLATE_SOUTH_BASIN", lon: 0.08, lat: -0.68, lift: -0.38, drift: 0.08 },
  { id: "PLATE_WEST_RIDGE", lon: -0.72, lat: -0.06, lift: 0.32, drift: -0.22 },
  { id: "PLATE_CENTRAL_CRATON", lon: -0.08, lat: 0.04, lift: 0.52, drift: 0.03 },
  { id: "PLATE_NORTHEAST_HIGH", lon: 0.34, lat: 0.54, lift: 0.35, drift: 0.18 },
  { id: "PLATE_SOUTHWEST_LOW", lon: -0.42, lat: -0.48, lift: -0.24, drift: -0.18 },
  { id: "PLATE_EQUATORIAL_BELT", lon: 0.02, lat: -0.02, lift: 0.14, drift: 0.1 },
  { id: "PLATE_OUTER_ARC", lon: 0.78, lat: -0.34, lift: 0.12, drift: -0.06 }
]);

const SUMMIT_ANCHORS = Object.freeze([
  { id: "SUMMIT_01", lon: -0.46, lat: 0.38, height: 1.0, spread: 0.018 },
  { id: "SUMMIT_02", lon: -0.24, lat: 0.52, height: 0.88, spread: 0.02 },
  { id: "SUMMIT_03", lon: 0.04, lat: 0.46, height: 0.94, spread: 0.018 },
  { id: "SUMMIT_04", lon: 0.3, lat: 0.32, height: 0.76, spread: 0.026 },
  { id: "SUMMIT_05", lon: 0.48, lat: 0.04, height: 0.82, spread: 0.022 },
  { id: "SUMMIT_06", lon: 0.26, lat: -0.28, height: 0.72, spread: 0.028 },
  { id: "SUMMIT_07", lon: -0.04, lat: -0.36, height: 0.7, spread: 0.03 },
  { id: "SUMMIT_08", lon: -0.36, lat: -0.18, height: 0.78, spread: 0.026 },
  { id: "SUMMIT_09", lon: -0.62, lat: 0.12, height: 0.86, spread: 0.022 }
]);

const BASIN_ANCHORS = Object.freeze([
  { id: "BASIN_WEST_DEEP", lon: -0.58, lat: -0.38, depth: -0.44, spread: 0.12 },
  { id: "BASIN_EAST_SHELF", lon: 0.62, lat: 0.22, depth: -0.26, spread: 0.18 },
  { id: "BASIN_SOUTH_POLAR", lon: 0.12, lat: -0.72, depth: -0.48, spread: 0.08 },
  { id: "BASIN_NORTH_POLAR", lon: -0.14, lat: 0.78, depth: -0.18, spread: 0.1 },
  { id: "BASIN_EQUATORIAL", lon: 0.08, lat: -0.12, depth: -0.16, spread: 0.2 },
  { id: "BASIN_OUTER_ARC", lon: 0.82, lat: -0.38, depth: -0.22, spread: 0.14 },
  { id: "BASIN_NORTHWEST", lon: -0.78, lat: 0.26, depth: -0.2, spread: 0.16 }
]);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function fract(value) {
  return value - Math.floor(value);
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function normalizeInput(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
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

function fbm(x, y, seed = 0, octaves = 5) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 19.19) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
}

function ridgeNoise(x, y, seed = 0) {
  const n = fbm(x, y, seed, 6);
  return 1 - Math.abs(n * 2 - 1);
}

function distance2(aLon, aLat, bLon, bLat) {
  const x = aLon - bLon;
  const y = aLat - bLat;
  return x * x + y * y;
}

function normalizedToLonLat(u, v) {
  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  return Object.freeze({
    u: safeU,
    v: safeV,
    lon: safeU * 2 - 1,
    lat: 1 - safeV * 2
  });
}

function resolvePlate(lon, lat) {
  let dominant = PLATE_ANCHORS[0];
  let dominantScore = -Infinity;
  let lift = 0;
  let driftStress = 0;

  for (const plate of PLATE_ANCHORS) {
    const d = Math.sqrt(distance2(lon, lat, plate.lon, plate.lat));
    const influence = clamp(1 - d / 1.05, 0, 1);
    const score = influence + plate.lift * 0.12;

    lift += influence * plate.lift;
    driftStress += influence * Math.abs(plate.drift);

    if (score > dominantScore) {
      dominantScore = score;
      dominant = plate;
    }
  }

  return Object.freeze({
    plateId: dominant.id,
    plateLift: clamp(lift, -0.62, 0.76),
    plateStress: clamp(driftStress, 0, 1)
  });
}

function resolveSummit(lon, lat) {
  let lift = 0;
  let nearest = SUMMIT_ANCHORS[0];
  let nearestDistance = Infinity;

  for (const summit of SUMMIT_ANCHORS) {
    const d2 = distance2(lon, lat, summit.lon, summit.lat);
    const influence = Math.exp(-d2 / summit.spread) * summit.height;

    lift += influence;

    if (d2 < nearestDistance) {
      nearestDistance = d2;
      nearest = summit;
    }
  }

  return Object.freeze({
    summitId: nearest.id,
    summitLift: clamp(lift, 0, 1),
    summitDistance: Math.sqrt(nearestDistance)
  });
}

function resolveBasin(lon, lat) {
  let depth = 0;
  let nearest = BASIN_ANCHORS[0];
  let nearestDistance = Infinity;

  for (const basin of BASIN_ANCHORS) {
    const d2 = distance2(lon, lat, basin.lon, basin.lat);
    const influence = Math.exp(-d2 / basin.spread);

    depth += influence * basin.depth;

    if (d2 < nearestDistance) {
      nearestDistance = d2;
      nearest = basin;
    }
  }

  const polarCompression = smoothstep(0.62, 0.94, Math.abs(lat)) * -0.14;

  return Object.freeze({
    basinId: nearest.id,
    basinDepth: clamp(depth + polarCompression, -0.76, 0),
    basinDistance: Math.sqrt(nearestDistance)
  });
}

function shelfPermission(normalizedElevation) {
  return clamp(1 - Math.abs(normalizedElevation - 0.49) / 0.13, 0, 1);
}

function classifyLandform(elevationMeters, slope, shelf) {
  if (elevationMeters < -4200) return "abyssal_basin";
  if (elevationMeters < -1300) return "deep_basin_floor";
  if (elevationMeters < -120) return shelf > 0.38 ? "continental_shelf" : "submerged_lowland";
  if (elevationMeters < 250) return "coastal_plain";
  if (elevationMeters < 1200) return slope > 0.58 ? "broken_upland" : "upland_plain";
  if (elevationMeters < 2800) return "highland";
  if (elevationMeters < 5200) return "mountain_chain";
  return "summit_range";
}

export function createTopographyProfile(overrides = {}) {
  return Object.freeze({
    ...DEFAULT_PROFILE,
    ...overrides,
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    layer: "topography"
  });
}

export function sampleTopography(u, v, profile = createTopographyProfile()) {
  const point = normalizedToLonLat(u, v);
  const { lon, lat } = point;

  const plate = resolvePlate(lon, lat);
  const summit = resolveSummit(lon, lat);
  const basin = resolveBasin(lon, lat);

  const continentalScale = fbm(lon * 2.1 + 41.2, lat * 2.1 - 13.4, 101, 5);
  const cratonScale = fbm(lon * 3.4 - 7.7, lat * 3.4 + 9.1, 151, 5);
  const ridgeScale = ridgeNoise(lon * 5.2 - 4.3, lat * 5.2 + 2.6, 203);
  const fineRelief = fbm(lon * 14.0 + 5.5, lat * 14.0 - 9.5, 307, 4);

  const tectonicBase =
    0.44 +
    plate.plateLift * 0.42 +
    summit.summitLift * 0.48 +
    basin.basinDepth * 0.56 +
    (continentalScale - 0.5) * 0.34 +
    (cratonScale - 0.5) * 0.2 +
    ridgeScale * 0.16 +
    (fineRelief - 0.5) * 0.08;

  const normalizedElevation = clamp(tectonicBase, 0, 1);
  const elevationMeters = Math.round(
    mix(profile.elevationMinMeters, profile.elevationMaxMeters, normalizedElevation)
  );

  const localA = fbm(lon * 18.0 + 0.24, lat * 18.0 - 0.31, 401, 3);
  const localB = fbm(lon * 18.0 - 0.27, lat * 18.0 + 0.34, 401, 3);
  const slope = clamp(Math.abs(localA - localB) * 3.1 + ridgeScale * 0.34 + plate.plateStress * 0.18, 0, 1);

  const shelf = shelfPermission(normalizedElevation);
  const mountainPermission = clamp((elevationMeters - 1100) / 5400, 0, 1);
  const basinPermission = clamp((-elevationMeters - 120) / 5400, 0, 1);
  const coastalPermission = shelf;

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    layer: "topography",

    u: point.u,
    v: point.v,
    lon,
    lat,

    elevationMeters,
    normalizedElevation,
    slope,

    plateId: plate.plateId,
    plateStress: plate.plateStress,

    summitId: summit.summitId,
    summitDistance: summit.summitDistance,

    basinId: basin.basinId,
    basinDistance: basin.basinDistance,

    shelfPermission: shelf,
    mountainPermission,
    basinPermission,
    coastalPermission,

    landform: classifyLandform(elevationMeters, slope, shelf),

    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    renderColor: null
  });
}

export function buildTopographyField(options = {}) {
  const profile = createTopographyProfile(options.profile || {});
  const width = Math.max(8, Math.floor(options.width || profile.lattice || 256));
  const height = Math.max(8, Math.floor(options.height || profile.lattice || 256));
  const samples = new Array(width * height);

  let minElevation = Infinity;
  let maxElevation = -Infinity;
  let sumElevation = 0;
  let summitSamples = 0;
  let basinSamples = 0;
  let shelfSamples = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sample = sampleTopography(x / (width - 1), y / (height - 1), profile);
      const index = y * width + x;

      samples[index] = sample;
      minElevation = Math.min(minElevation, sample.elevationMeters);
      maxElevation = Math.max(maxElevation, sample.elevationMeters);
      sumElevation += sample.elevationMeters;

      if (sample.mountainPermission > 0.72) summitSamples += 1;
      if (sample.basinPermission > 0.55) basinSamples += 1;
      if (sample.shelfPermission > 0.45) shelfSamples += 1;
    }
  }

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    layer: "topography",

    width,
    height,
    profile,
    samples,

    stats: Object.freeze({
      minElevationMeters: minElevation,
      maxElevationMeters: maxElevation,
      averageElevationMeters: Math.round(sumElevation / samples.length),
      summitSampleRatio: summitSamples / samples.length,
      basinSampleRatio: basinSamples / samples.length,
      shelfSampleRatio: shelfSamples / samples.length
    }),

    downstreamForParent: true,
    parentMustCompose: true
  });
}

export function getTopographySampleFromField(field, u, v) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleTopography(u, v);
  }

  const safeU = clamp(normalizeInput(u, 0.5), 0, 1);
  const safeV = clamp(normalizeInput(v, 0.5), 0, 1);

  const x = clamp(Math.round(safeU * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(safeV * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getTopographyStatus() {
  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: PARENT_AUTHORITY,
    childFile: CHILD_FILE,
    layer: "topography",

    downstreamChild: true,
    randomAsset: false,
    parentRenderRequired: true,

    ownsTopography: true,
    ownsHydration: false,
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
  createTopographyProfile,
  sampleTopography,
  buildTopographyField,
  getTopographySampleFromField,
  getTopographyStatus
});
