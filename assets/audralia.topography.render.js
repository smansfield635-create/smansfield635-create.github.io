// /assets/audralia.topography.render.js
// AUDRALIA_G1_TOPOGRAPHY_DOWNSTREAM_CHILD_TNT_v1
// Downstream child of: /assets/AdreliaPlanetRendered.js
// Role: topography science only. No hydration, climate, ecology, fauna, Earth, Sun, Moon, HTML, or route authority.

const AUDRALIA_TOPOGRAPHY_RECEIPT = "AUDRALIA_G1_TOPOGRAPHY_DOWNSTREAM_CHILD_TNT_v1";
const AUDRALIA_PARENT_AUTHORITY = "/assets/AdreliaPlanetRendered.js";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";

const DEFAULT_PROFILE = Object.freeze({
  receipt: AUDRALIA_TOPOGRAPHY_RECEIPT,
  planetaryObject: PLANETARY_OBJECT,
  generation: GENERATION,
  parentAuthority: AUDRALIA_PARENT_AUTHORITY,
  layer: "topography",
  radiusKm: 6371,
  elevationMinMeters: -6200,
  elevationMaxMeters: 8840,
  seaLevelReferenceMeters: 0,
  plateCount: 9,
  basinCount: 7,
  ridgeCount: 13,
  summitCount: 9,
  ownsHydration: false,
  ownsClimate: false,
  ownsEcology: false,
  ownsFauna: false,
  ownsRendering: false
});

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

function sphericalDistance(aLon, aLat, bLon, bLat) {
  const x = aLon - bLon;
  const y = aLat - bLat;
  return Math.sqrt(x * x + y * y);
}

const PLATE_ANCHORS = Object.freeze([
  { id: "NORTH_CROWN", lon: -0.18, lat: 0.72, lift: 0.42 },
  { id: "EAST_SHELF", lon: 0.58, lat: 0.18, lift: 0.22 },
  { id: "SOUTH_BASIN", lon: 0.1, lat: -0.68, lift: -0.34 },
  { id: "WEST_RIDGE", lon: -0.72, lat: -0.08, lift: 0.3 },
  { id: "CENTRAL_CRATON", lon: -0.08, lat: 0.04, lift: 0.5 },
  { id: "NORTHEAST_HIGH", lon: 0.36, lat: 0.56, lift: 0.36 },
  { id: "SOUTHWEST_LOW", lon: -0.44, lat: -0.48, lift: -0.22 },
  { id: "EQUATORIAL_BELT", lon: 0.02, lat: -0.02, lift: 0.18 },
  { id: "OUTER_ARC", lon: 0.78, lat: -0.34, lift: 0.12 }
]);

const SUMMIT_ANCHORS = Object.freeze([
  { id: "SUMMIT_01", lon: -0.44, lat: 0.38, height: 1.0 },
  { id: "SUMMIT_02", lon: -0.22, lat: 0.52, height: 0.88 },
  { id: "SUMMIT_03", lon: 0.04, lat: 0.46, height: 0.94 },
  { id: "SUMMIT_04", lon: 0.3, lat: 0.32, height: 0.76 },
  { id: "SUMMIT_05", lon: 0.48, lat: 0.04, height: 0.82 },
  { id: "SUMMIT_06", lon: 0.26, lat: -0.28, height: 0.72 },
  { id: "SUMMIT_07", lon: -0.04, lat: -0.36, height: 0.7 },
  { id: "SUMMIT_08", lon: -0.36, lat: -0.18, height: 0.78 },
  { id: "SUMMIT_09", lon: -0.62, lat: 0.12, height: 0.86 }
]);

function plateInfluence(lon, lat) {
  let strongest = PLATE_ANCHORS[0];
  let strongestScore = -Infinity;
  let totalLift = 0;

  for (const plate of PLATE_ANCHORS) {
    const distance = sphericalDistance(lon, lat, plate.lon, plate.lat);
    const influence = clamp(1 - distance / 1.05, 0, 1);
    const score = influence + plate.lift * 0.15;

    totalLift += influence * plate.lift;

    if (score > strongestScore) {
      strongestScore = score;
      strongest = plate;
    }
  }

  return {
    plateId: strongest.id,
    plateLift: clamp(totalLift, -0.55, 0.7)
  };
}

function summitInfluence(lon, lat) {
  let total = 0;
  let nearest = SUMMIT_ANCHORS[0];
  let nearestDistance = Infinity;

  for (const summit of SUMMIT_ANCHORS) {
    const distance = sphericalDistance(lon, lat, summit.lon, summit.lat);
    const influence = Math.exp(-(distance * distance) / 0.018) * summit.height;

    total += influence;

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = summit;
    }
  }

  return {
    summitId: nearest.id,
    summitDistance: nearestDistance,
    summitLift: clamp(total, 0, 1)
  };
}

function basinInfluence(lon, lat) {
  const polarBasin = smoothstep(0.52, 0.92, Math.abs(lat)) * -0.2;
  const westernBasin = Math.exp(-sphericalDistance(lon, lat, -0.58, -0.38) ** 2 / 0.12) * -0.38;
  const easternBasin = Math.exp(-sphericalDistance(lon, lat, 0.62, 0.22) ** 2 / 0.18) * -0.22;
  const southernBasin = Math.exp(-sphericalDistance(lon, lat, 0.12, -0.72) ** 2 / 0.08) * -0.44;

  return clamp(polarBasin + westernBasin + easternBasin + southernBasin, -0.72, 0);
}

function shelfPermission(normalizedElevation) {
  return clamp(1 - Math.abs(normalizedElevation - 0.48) / 0.14, 0, 1);
}

function classifyLandform(elevationMeters, slope, shelf) {
  if (elevationMeters < -3600) return "deep_basin";
  if (elevationMeters < -900) return "basin_floor";
  if (elevationMeters < -80) return shelf > 0.35 ? "continental_shelf" : "low_basin";
  if (elevationMeters < 350) return "coastal_plain";
  if (elevationMeters < 1300) return slope > 0.58 ? "broken_upland" : "upland_plain";
  if (elevationMeters < 3000) return "highland";
  if (elevationMeters < 5200) return "mountain";
  return "summit_range";
}

export function createTopographyProfile(overrides = {}) {
  return Object.freeze({
    ...DEFAULT_PROFILE,
    ...overrides,
    receipt: AUDRALIA_TOPOGRAPHY_RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    parentAuthority: AUDRALIA_PARENT_AUTHORITY,
    layer: "topography"
  });
}

export function sampleTopography(u, v, profile = createTopographyProfile()) {
  const safeU = clamp(Number.isFinite(u) ? u : 0.5, 0, 1);
  const safeV = clamp(Number.isFinite(v) ? v : 0.5, 0, 1);

  const lon = safeU * 2 - 1;
  const lat = 1 - safeV * 2;

  const plate = plateInfluence(lon, lat);
  const summit = summitInfluence(lon, lat);
  const basin = basinInfluence(lon, lat);

  const largeScale = fbm(lon * 2.2 + 40, lat * 2.2 - 11, 101, 5);
  const fracturedRidge = ridgeNoise(lon * 5.4 - 7, lat * 5.4 + 3, 203);
  const fineRelief = fbm(lon * 14.0 + 5, lat * 14.0 - 9, 307, 4);

  const tectonicBase =
    0.44 +
    plate.plateLift * 0.42 +
    summit.summitLift * 0.5 +
    basin * 0.55 +
    (largeScale - 0.5) * 0.34 +
    fracturedRidge * 0.18 +
    (fineRelief - 0.5) * 0.08;

  const normalizedElevation = clamp(tectonicBase, 0, 1);
  const elevationMeters = Math.round(
    mix(profile.elevationMinMeters, profile.elevationMaxMeters, normalizedElevation)
  );

  const localA = fbm(lon * 18.0 + 0.2, lat * 18.0 - 0.3, 401, 3);
  const localB = fbm(lon * 18.0 - 0.2, lat * 18.0 + 0.3, 401, 3);
  const slope = clamp(Math.abs(localA - localB) * 3.2 + fracturedRidge * 0.35, 0, 1);
  const shelf = shelfPermission(normalizedElevation);
  const landform = classifyLandform(elevationMeters, slope, shelf);

  return Object.freeze({
    receipt: AUDRALIA_TOPOGRAPHY_RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    layer: "topography",
    u: safeU,
    v: safeV,
    lon,
    lat,
    elevationMeters,
    normalizedElevation,
    slope,
    shelfPermission: shelf,
    landform,
    plateId: plate.plateId,
    summitId: summit.summitId,
    summitDistance: summit.summitDistance,
    mountainPermission: clamp((elevationMeters - 1200) / 5200, 0, 1),
    basinPermission: clamp((-elevationMeters - 150) / 5000, 0, 1),
    coastalPermission: shelf,
    renderColor: null
  });
}

export function buildTopographyMap(options = {}) {
  const profile = createTopographyProfile(options.profile || {});
  const width = Math.max(8, Math.floor(options.width || 256));
  const height = Math.max(8, Math.floor(options.height || 256));
  const samples = new Array(width * height);

  let minElevation = Infinity;
  let maxElevation = -Infinity;
  let sumElevation = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sample = sampleTopography(x / (width - 1), y / (height - 1), profile);
      samples[y * width + x] = sample;
      minElevation = Math.min(minElevation, sample.elevationMeters);
      maxElevation = Math.max(maxElevation, sample.elevationMeters);
      sumElevation += sample.elevationMeters;
    }
  }

  return Object.freeze({
    receipt: AUDRALIA_TOPOGRAPHY_RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    layer: "topography",
    parentAuthority: AUDRALIA_PARENT_AUTHORITY,
    width,
    height,
    profile,
    samples,
    stats: Object.freeze({
      minElevationMeters: minElevation,
      maxElevationMeters: maxElevation,
      averageElevationMeters: Math.round(sumElevation / samples.length)
    })
  });
}

export function getTopographyStatus() {
  return Object.freeze({
    receipt: AUDRALIA_TOPOGRAPHY_RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    parentAuthority: AUDRALIA_PARENT_AUTHORITY,
    layer: "topography",
    downstreamChild: true,
    ownsTopography: true,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRoute: false,
    ownsHtml: false,
    ownsEarth: false,
    visualPassClaimed: false
  });
}

export default Object.freeze({
  createTopographyProfile,
  sampleTopography,
  buildTopographyMap,
  getTopographyStatus
});
