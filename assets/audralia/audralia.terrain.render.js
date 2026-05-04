// /assets/audralia/audralia.terrain.render.js
// AUDRALIA_G1_NINE_SUMMITS_TERRAIN_CHILD_TNT_v1
// Role: first direct downstream child for /assets/audralia/audralia.planet.render.js.
// Scope: terrain data only.
// Owns: seven land-body terrain structure, Nine Summits region mapping, coherence-index terrain gating.
// Does not own: parent globe rendering, hydration, climate, ecology, fauna, runtime, route shell, Earth, Sun, Moon, visual pass claim.

const RECEIPT = "AUDRALIA_G1_NINE_SUMMITS_TERRAIN_CHILD_TNT_v1";
const PLANETARY_OBJECT = "Audralia";
const GENERATION = "G1";
const FILE = "/assets/audralia/audralia.terrain.render.js";
const PARENT_AUTHORITY = "/assets/audralia/audralia.planet.render.js";

const LAND_BODIES = Object.freeze([
  Object.freeze({
    id: 1,
    key: "primary_east_west_mainland",
    name: "Primary East-West Mainland",
    role: "prominent horizontal mainland crossing eastern and western hemispheres"
  }),
  Object.freeze({
    id: 2,
    key: "secondary_northern_east_landmass",
    name: "Secondary Northern-East Landmass",
    role: "northern eastern secondary body"
  }),
  Object.freeze({
    id: 3,
    key: "secondary_northern_west_landmass",
    name: "Secondary Northern-West Landmass",
    role: "northern western secondary body"
  }),
  Object.freeze({
    id: 4,
    key: "secondary_southern_east_landmass",
    name: "Secondary Southern-East Landmass",
    role: "southern eastern secondary body"
  }),
  Object.freeze({
    id: 5,
    key: "secondary_southern_west_landmass",
    name: "Secondary Southern-West Landmass",
    role: "southern western secondary body"
  }),
  Object.freeze({
    id: 6,
    key: "north_polar_landmass",
    name: "North Polar Landmass",
    role: "distinct northern polar body"
  }),
  Object.freeze({
    id: 7,
    key: "south_polar_landmass",
    name: "South Polar Landmass",
    role: "distinct southern polar body"
  })
]);

const NINE_SUMMITS = Object.freeze([
  Object.freeze({
    id: 1,
    key: "love",
    name: "Love",
    coherenceThreshold: 0.12,
    anchorLon: -0.12,
    anchorLat: 0.02,
    regionRole: "convergence heartland"
  }),
  Object.freeze({
    id: 2,
    key: "coherence",
    name: "Coherence",
    coherenceThreshold: 0.22,
    anchorLon: 0.16,
    anchorLat: 0.04,
    regionRole: "alignment ridge"
  }),
  Object.freeze({
    id: 3,
    key: "structure",
    name: "Structure",
    coherenceThreshold: 0.32,
    anchorLon: -0.52,
    anchorLat: 0.18,
    regionRole: "western plateau"
  }),
  Object.freeze({
    id: 4,
    key: "balance",
    name: "Balance",
    coherenceThreshold: 0.42,
    anchorLon: 0.52,
    anchorLat: 0.16,
    regionRole: "eastern transition basin"
  }),
  Object.freeze({
    id: 5,
    key: "stability",
    name: "Stability",
    coherenceThreshold: 0.52,
    anchorLon: -0.42,
    anchorLat: -0.18,
    regionRole: "southern shelf highland"
  }),
  Object.freeze({
    id: 6,
    key: "peace",
    name: "Peace",
    coherenceThreshold: 0.62,
    anchorLon: 0.42,
    anchorLat: -0.2,
    regionRole: "protected basin"
  }),
  Object.freeze({
    id: 7,
    key: "joy",
    name: "Joy",
    coherenceThreshold: 0.72,
    anchorLon: 0.72,
    anchorLat: 0.48,
    regionRole: "northern island arc"
  }),
  Object.freeze({
    id: 8,
    key: "dignity",
    name: "Dignity",
    coherenceThreshold: 0.82,
    anchorLon: -0.72,
    anchorLat: 0.5,
    regionRole: "northern crownland"
  }),
  Object.freeze({
    id: 9,
    key: "free_will",
    name: "Free Will",
    coherenceThreshold: 0.9,
    anchorLon: 0.02,
    anchorLat: -0.62,
    regionRole: "southern frontier belt"
  })
]);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : 0));
}

function mix(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
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

function fbm(x, y, seed = 0, octaves = 5) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += valueNoise(x * frequency, y * frequency, seed + i * 29.17) * amplitude;
    normalizer += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total / normalizer;
}

function gaussian(dx, dy, sx, sy, power = 1) {
  return Math.exp(-((dx * dx) / (sx * sx) + (dy * dy) / (sy * sy)) * power);
}

function wrapLonDistance(a, b) {
  let d = a - b;
  while (d > 1) d -= 2;
  while (d < -1) d += 2;
  return d;
}

function lobe(lon, lat, cx, cy, sx, sy, power = 1) {
  return gaussian(wrapLonDistance(lon, cx), lat - cy, sx, sy, power);
}

function normalizeUV(uInput, vInput) {
  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  return Object.freeze({
    u,
    v,
    lon: u * 2 - 1,
    lat: 1 - v * 2
  });
}

function getInputContext(context = {}) {
  const coherenceIndex = clamp(
    Number.isFinite(Number(context.coherenceIndex)) ? Number(context.coherenceIndex) : 0.64,
    0,
    1
  );

  const collaborativeExpression = clamp(
    Number.isFinite(Number(context.collaborativeExpression)) ? Number(context.collaborativeExpression) : 0.68,
    0,
    1
  );

  const expressionStrength = clamp(
    coherenceIndex * 0.62 + collaborativeExpression * 0.38,
    0,
    1
  );

  return Object.freeze({
    coherenceIndex,
    collaborativeExpression,
    expressionStrength
  });
}

function landBodyFields(lon, lat) {
  const equatorialBend = Math.sin(lon * Math.PI * 2.1) * 0.055;
  const primarySpine = gaussian(0, lat - equatorialBend, 1.34, 0.2, 1.02);
  const primaryLowerShelf = gaussian(0, lat + 0.18 - equatorialBend * 0.35, 1.12, 0.18, 1.08);
  const primaryUpperShelf = gaussian(0, lat - 0.18 - equatorialBend * 0.45, 1.0, 0.16, 1.1);
  const primary =
    primarySpine * 0.88 +
    primaryLowerShelf * 0.22 +
    primaryUpperShelf * 0.18;

  const secondaryNE =
    lobe(lon, lat, 0.58, 0.46, 0.3, 0.25, 1.03) * 0.78 +
    lobe(lon, lat, 0.78, 0.36, 0.18, 0.18, 1.05) * 0.24;

  const secondaryNW =
    lobe(lon, lat, -0.58, 0.48, 0.3, 0.25, 1.03) * 0.78 +
    lobe(lon, lat, -0.8, 0.36, 0.18, 0.18, 1.05) * 0.24;

  const secondarySE =
    lobe(lon, lat, 0.54, -0.48, 0.32, 0.26, 1.04) * 0.76 +
    lobe(lon, lat, 0.78, -0.38, 0.18, 0.18, 1.05) * 0.24;

  const secondarySW =
    lobe(lon, lat, -0.54, -0.48, 0.32, 0.26, 1.04) * 0.76 +
    lobe(lon, lat, -0.78, -0.38, 0.18, 0.18, 1.05) * 0.24;

  const northPolar =
    smoothstep(0.66, 0.89, lat) *
    (0.68 + fbm(lon * 3.2, lat * 3.2, 601, 4) * 0.32);

  const southPolar =
    smoothstep(0.66, 0.9, -lat) *
    (0.68 + fbm(lon * 3.2 + 8.0, lat * 3.2 - 5.0, 607, 4) * 0.32);

  return Object.freeze({
    1: primary,
    2: secondaryNE,
    3: secondaryNW,
    4: secondarySE,
    5: secondarySW,
    6: northPolar,
    7: southPolar
  });
}

function chooseLandBody(fields) {
  let bestId = 0;
  let bestScore = -Infinity;

  for (let i = 1; i <= 7; i += 1) {
    const score = fields[i] || 0;
    if (score > bestScore) {
      bestScore = score;
      bestId = i;
    }
  }

  return Object.freeze({
    landBodyId: bestId,
    landBodyScore: bestScore,
    landBody: LAND_BODIES[bestId - 1] || null
  });
}

function summitDistanceScore(lon, lat, summit) {
  const dx = wrapLonDistance(lon, summit.anchorLon);
  const dy = lat - summit.anchorLat;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return 1 / (0.0001 + distance);
}

function chooseSummitRegion(lon, lat, context) {
  let best = NINE_SUMMITS[0];
  let bestScore = -Infinity;

  for (const summit of NINE_SUMMITS) {
    const proximity = summitDistanceScore(lon, lat, summit);
    const thresholdGate = smoothstep(
      Math.max(0, summit.coherenceThreshold - 0.18),
      Math.min(1, summit.coherenceThreshold + 0.18),
      context.expressionStrength
    );

    const regionNoise =
      fbm(
        lon * 2.4 + summit.id * 0.37,
        lat * 2.4 - summit.id * 0.41,
        700 + summit.id,
        3
      ) * 0.18;

    const score = proximity * (0.76 + thresholdGate * 0.42) + regionNoise;

    if (score > bestScore) {
      best = summit;
      bestScore = score;
    }
  }

  const accessStrength = smoothstep(
    Math.max(0, best.coherenceThreshold - 0.16),
    Math.min(1, best.coherenceThreshold + 0.16),
    context.expressionStrength
  );

  return Object.freeze({
    summitRegionId: best.id,
    summitRegionKey: best.key,
    summitRegionName: best.name,
    summitRegionRole: best.regionRole,
    coherenceThreshold: best.coherenceThreshold,
    summitAccessStrength: accessStrength,
    summitExpressionWeight: clamp(accessStrength * 0.72 + context.collaborativeExpression * 0.28, 0, 1)
  });
}

function terrainSignals(lon, lat, landBodyChoice, summitChoice, context) {
  const landBodyId = landBodyChoice.landBodyId;
  const bodyScore = landBodyChoice.landBodyScore;

  const continentNoise = fbm(lon * 5.5 + 1.7, lat * 5.5 - 2.6, 101, 6);
  const fineNoise = fbm(lon * 17.0 - 4.1, lat * 17.0 + 3.9, 211, 4);
  const tectonicNoise = fbm(lon * 2.2 + 8.3, lat * 2.2 - 6.8, 311, 5);

  const coastlineThreshold = 0.5;
  const landScore = clamp(
    bodyScore + (continentNoise - 0.5) * 0.16 + (fineNoise - 0.5) * 0.06,
    0,
    1.4
  );

  const isLand = landScore >= coastlineThreshold;
  const coastPressure = clamp(1 - Math.abs(landScore - coastlineThreshold) / 0.14, 0, 1);
  const shelfPermission = isLand ? clamp(coastPressure * 0.44, 0, 1) : clamp(coastPressure * 0.94, 0, 1);

  const primaryRidge =
    landBodyId === 1
      ? Math.exp(-Math.pow((lat - Math.sin(lon * Math.PI * 3.0) * 0.07) / 0.08, 2)) *
        smoothstep(0.98, 0.12, Math.abs(lon))
      : 0;

  const secondaryRidge =
    [2, 3, 4, 5].includes(landBodyId)
      ? clamp(tectonicNoise * 0.8 + fineNoise * 0.28, 0, 1)
      : 0;

  const polarRidge =
    [6, 7].includes(landBodyId)
      ? clamp(smoothstep(0.68, 0.96, Math.abs(lat)) * (0.55 + continentNoise * 0.45), 0, 1)
      : 0;

  const summitRidgeBoost = clamp(summitChoice.summitExpressionWeight * 0.34, 0, 0.34);

  const ridge = isLand
    ? clamp(primaryRidge * 0.72 + secondaryRidge * 0.38 + polarRidge * 0.54 + summitRidgeBoost, 0, 1)
    : 0;

  const basin = isLand
    ? clamp(
        (1 - ridge) *
          (0.42 + (1 - tectonicNoise) * 0.38) *
          smoothstep(0.5, 0.82, landScore) *
          (1 - coastPressure * 0.5),
        0,
        1
      )
    : 0;

  const dryInteriorPressure = isLand
    ? clamp(
        (1 - coastPressure) *
          smoothstep(0.18, 0.62, Math.abs(lat)) *
          (0.52 + fineNoise * 0.38) *
          (1 - summitChoice.summitExpressionWeight * 0.18),
        0,
        1
      )
    : 0;

  const polarSeat =
    [6, 7].includes(landBodyId)
      ? clamp(smoothstep(0.66, 0.96, Math.abs(lat)), 0, 1)
      : clamp(smoothstep(0.84, 0.98, Math.abs(lat)) * 0.24, 0, 1);

  const normalizedElevation = isLand
    ? clamp((landScore - coastlineThreshold) * 1.25 + ridge * 0.48 - basin * 0.22, 0, 1)
    : -clamp((coastlineThreshold - landScore) * 1.1 + (1 - shelfPermission) * 0.28, 0, 1);

  const slope = isLand
    ? clamp(ridge * 0.52 + Math.abs(fineNoise - continentNoise) * 0.8 + coastPressure * 0.18, 0, 1)
    : clamp(coastPressure * 0.24, 0, 1);

  const horizontalMainlandContinuity =
    landBodyId === 1
      ? clamp(smoothstep(0.7, 0.08, Math.abs(lat)) * smoothstep(1.08, 0.28, Math.abs(lon)), 0, 1)
      : 0;

  return Object.freeze({
    landScore,
    isLand,
    isWater: !isLand,
    normalizedElevation,
    elevationMeters: isLand ? Math.round(normalizedElevation * 8200) : Math.round(normalizedElevation * 5200),
    ridge,
    basin,
    slope,
    coastPressure,
    shelfPermission,
    dryInteriorPressure,
    polarSeat,
    terrainNoise: continentNoise,
    fineTerrainNoise: fineNoise,
    tectonicPressure: tectonicNoise,
    horizontalMainlandContinuity
  });
}

function terrainColorInfluence(sample) {
  if (!sample.isLand) {
    return Object.freeze({
      base: "water_permission",
      oceanDepth: clamp(Math.abs(sample.normalizedElevation), 0, 1),
      shelf: sample.shelfPermission,
      coast: sample.coastPressure,
      r: Math.round(mix(8, 44, sample.shelfPermission)),
      g: Math.round(mix(30, 142, sample.shelfPermission)),
      b: Math.round(mix(78, 168, sample.shelfPermission))
    });
  }

  const summitWarmth = sample.summitExpressionWeight;
  const highland = sample.ridge;
  const dry = sample.dryInteriorPressure;
  const polar = sample.polarSeat;

  return Object.freeze({
    base: "terrain_land",
    highland,
    dry,
    polar,
    summitWarmth,
    r: Math.round(mix(mix(106, 172, dry), 222, polar * 0.72)),
    g: Math.round(mix(mix(128, 124, dry), 234, polar * 0.72)),
    b: Math.round(mix(mix(78, 92, dry), 240, polar * 0.72))
  });
}

export function createTerrainProfile(overrides = {}) {
  return Object.freeze({
    receipt: RECEIPT,
    status: "active",
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    role: "nine-summits-terrain-child",
    landBodyCount: 7,
    summitRegionCount: 9,
    terrainChild: true,
    ownsTerrain: true,
    ownsFinalRender: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRuntime: false,
    visualPassClaimed: false,
    ...overrides
  });
}

export function sampleTerrain(uInput, vInput, context = {}) {
  const point = normalizeUV(uInput, vInput);
  const terrainContext = getInputContext(context);
  const bodyFields = landBodyFields(point.lon, point.lat);
  const landBodyChoice = chooseLandBody(bodyFields);
  const summitChoice = chooseSummitRegion(point.lon, point.lat, terrainContext);
  const signals = terrainSignals(point.lon, point.lat, landBodyChoice, summitChoice, terrainContext);

  const sample = Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,

    u: point.u,
    v: point.v,
    lon: point.lon,
    lat: point.lat,

    landBodyCount: 7,
    landBodyId: signals.isLand ? landBodyChoice.landBodyId : 0,
    landBodyKey: signals.isLand && landBodyChoice.landBody ? landBodyChoice.landBody.key : "ocean",
    landBodyName: signals.isLand && landBodyChoice.landBody ? landBodyChoice.landBody.name : "Ocean",
    landBodyRole: signals.isLand && landBodyChoice.landBody ? landBodyChoice.landBody.role : "water body",

    summitRegionId: signals.isLand ? summitChoice.summitRegionId : 0,
    summitRegionKey: signals.isLand ? summitChoice.summitRegionKey : "ocean",
    summitRegionName: signals.isLand ? summitChoice.summitRegionName : "Ocean",
    summitRegionRole: signals.isLand ? summitChoice.summitRegionRole : "water boundary",
    coherenceThreshold: signals.isLand ? summitChoice.coherenceThreshold : 0,
    summitAccessStrength: signals.isLand ? summitChoice.summitAccessStrength : 0,
    summitExpressionWeight: signals.isLand ? summitChoice.summitExpressionWeight : 0,

    coherenceIndex: terrainContext.coherenceIndex,
    collaborativeExpression: terrainContext.collaborativeExpression,
    expressionStrength: terrainContext.expressionStrength,

    landBodyFields: bodyFields,

    landScore: signals.landScore,
    isLand: signals.isLand,
    isWater: signals.isWater,
    normalizedElevation: signals.normalizedElevation,
    elevationMeters: signals.elevationMeters,
    ridge: signals.ridge,
    basin: signals.basin,
    slope: signals.slope,
    coastPressure: signals.coastPressure,
    shelfPermission: signals.shelfPermission,
    dryInteriorPressure: signals.dryInteriorPressure,
    polarSeat: signals.polarSeat,
    terrainNoise: signals.terrainNoise,
    fineTerrainNoise: signals.fineTerrainNoise,
    tectonicPressure: signals.tectonicPressure,
    horizontalMainlandContinuity: signals.horizontalMainlandContinuity,

    terrainColorInfluence: null,

    terrainChild: true,
    ownsTerrain: true,
    ownsFinalRender: false,
    visualPassClaimed: false
  });

  return Object.freeze({
    ...sample,
    terrainColorInfluence: terrainColorInfluence(sample)
  });
}

export function buildTerrainField(width = 128, height = 128, options = {}) {
  const w = Math.max(8, Math.floor(Number(width) || 128));
  const h = Math.max(8, Math.floor(Number(height) || 128));
  const samples = new Array(w * h);

  const landBodyCounts = new Map();
  const summitCounts = new Map();

  let landSamples = 0;
  let waterSamples = 0;
  let primaryMainlandSamples = 0;
  let horizontalContinuitySum = 0;
  let elevationSum = 0;
  let maxElevation = -Infinity;
  let minElevation = Infinity;

  for (let y = 0; y < h; y += 1) {
    const v = h === 1 ? 0.5 : y / (h - 1);

    for (let x = 0; x < w; x += 1) {
      const u = w === 1 ? 0.5 : x / (w - 1);
      const sample = sampleTerrain(u, v, options);
      const index = y * w + x;

      samples[index] = sample;

      if (sample.isLand) {
        landSamples += 1;
        elevationSum += sample.normalizedElevation;
        maxElevation = Math.max(maxElevation, sample.normalizedElevation);
        minElevation = Math.min(minElevation, sample.normalizedElevation);

        landBodyCounts.set(
          sample.landBodyId,
          (landBodyCounts.get(sample.landBodyId) || 0) + 1
        );

        summitCounts.set(
          sample.summitRegionId,
          (summitCounts.get(sample.summitRegionId) || 0) + 1
        );

        if (sample.landBodyId === 1) {
          primaryMainlandSamples += 1;
          horizontalContinuitySum += sample.horizontalMainlandContinuity;
        }
      } else {
        waterSamples += 1;
      }
    }
  }

  const activeLandBodies = Array.from(landBodyCounts.keys()).sort((a, b) => a - b);
  const activeSummitRegions = Array.from(summitCounts.keys()).sort((a, b) => a - b);

  return Object.freeze({
    receipt: RECEIPT,
    planetaryObject: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    width: w,
    height: h,
    samples,
    profile: createTerrainProfile(options.profile || {}),
    stats: Object.freeze({
      landSamples,
      waterSamples,
      landRatio: landSamples / samples.length,
      waterRatio: waterSamples / samples.length,
      activeLandBodyCount: activeLandBodies.length,
      expectedLandBodyCount: 7,
      activeLandBodies,
      activeSummitRegionCount: activeSummitRegions.length,
      expectedSummitRegionCount: 9,
      activeSummitRegions,
      primaryMainlandSampleRatio: primaryMainlandSamples / Math.max(1, landSamples),
      primaryHorizontalContinuityAverage: horizontalContinuitySum / Math.max(1, primaryMainlandSamples),
      averageLandElevation: elevationSum / Math.max(1, landSamples),
      minLandElevation: Number.isFinite(minElevation) ? minElevation : 0,
      maxLandElevation: Number.isFinite(maxElevation) ? maxElevation : 0
    }),
    terrainChild: true,
    downstreamForParent: true,
    parentMustCompose: true,
    visualPassClaimed: false
  });
}

export function getTerrainSampleFromField(field, uInput, vInput) {
  if (!field || !Array.isArray(field.samples) || !field.width || !field.height) {
    return sampleTerrain(uInput, vInput);
  }

  const u = ((Number(uInput) || 0) % 1 + 1) % 1;
  const v = clamp(Number(vInput) || 0, 0, 1);

  const x = clamp(Math.round(u * (field.width - 1)), 0, field.width - 1);
  const y = clamp(Math.round(v * (field.height - 1)), 0, field.height - 1);

  return field.samples[y * field.width + x];
}

export function getTerrainStatus() {
  return Object.freeze({
    ok: true,
    receipt: RECEIPT,
    status: "active",
    id: "audralia-g1-nine-summits-terrain-child",
    planetaryObject: PLANETARY_OBJECT,
    publicName: PLANETARY_OBJECT,
    generation: GENERATION,
    file: FILE,
    parentAuthority: PARENT_AUTHORITY,
    role: "nine-summits-terrain-child",
    terrainChild: true,
    downstreamForParent: true,
    landBodyCount: 7,
    summitRegionCount: 9,
    landBodies: LAND_BODIES,
    summitRegions: NINE_SUMMITS,
    exports: Object.freeze([
      "createTerrainProfile",
      "sampleTerrain",
      "buildTerrainField",
      "getTerrainSampleFromField",
      "getTerrainStatus"
    ]),
    ownsTerrain: true,
    ownsFinalRender: false,
    ownsHydration: false,
    ownsClimate: false,
    ownsEcology: false,
    ownsFauna: false,
    ownsRuntime: false,
    staticImageReplacement: false,
    imageGeneration: false,
    graphicBox: false,
    visualPassClaimed: false,
    generationPassClaimed: false
  });
}

export default Object.freeze({
  createTerrainProfile,
  sampleTerrain,
  buildTerrainField,
  getTerrainSampleFromField,
  getTerrainStatus
});
